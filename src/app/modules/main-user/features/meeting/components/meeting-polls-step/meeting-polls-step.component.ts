import {
  Component,
  computed,
  inject,
  input,
  signal,
  Pipe,
} from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MatInput } from '@angular/material/input';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, debounceTime, startWith } from 'rxjs';

import { CustomDatePickerComponent } from '../../../../../../shared/components/form-controls/custom-date-picker/custom-date-picker.component';
import { MeetingPollComponent } from '../meeting-poll/meeting-poll.component';

import { MeetingsService } from '../../meetings.service';
import { LayoutService } from '../../../../../../core/services/layout.service';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';

import { AjendaForm, CommitteeSingleMeeting } from '../../../../main.types';
import {
  getTransformedDate,
  splitTime,
  toLocaleTimeZone,
} from '../meeting-info-step/meeting-info-step.config';
import { PollsResultDialogComponent } from '../polls-result-dialog/polls-result-dialog.component';
import { PollsVotingComponent } from "../polls-voting/polls-voting.component";

@Component({
  selector: 'meeting-polls-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    NgClass,

    MatSlideToggleModule,
    MatButtonModule,
    MatCardModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatError,
    MatInput,
    MatDivider,

    PollsResultDialogComponent,
    CustomDatePickerComponent,
    MeetingPollComponent,
    PollsVotingComponent,
],
  templateUrl: './meeting-polls-step.component.html',
})
export class MeetingPollsStepComponent {
  private activatedRoute = inject(ActivatedRoute);
  meetingService = inject(MeetingsService);
  private datePipe = inject(DatePipe);
  messages = inject(MessagesService);
  layout = inject(LayoutService);
  topics = signal([]);
  form = input.required<AjendaForm>();

  hasOptions = computed(
    () => this.fieldControl<FormArray>('topics').length > 0
  );

  meetingData = (this.activatedRoute.snapshot.data[
    'details'
  ] || this.activatedRoute.snapshot.data[
    'occurrenceData'
  ])  as CommitteeSingleMeeting;

  votingEndOptions = [
    { value: 'MeetingStarting', translation: 'MAIN.LABEL.MEETING_START' },
    { value: 'DuringMeeting', translation: 'MAIN.LABEL.DURING_MEETING' },
    { value: 'DayAfterMeeting', translation: 'MAIN.LABEL.MEETING_END' },
  ];

  isSettingsDisabled = signal(true);

  ngOnInit() {
    this.setMeetingData();
    this.topicsWithOptionsListner();
    this.voteTypeListner();
    this.dateTimeListner();
  }
  getTopicsResult(meetingId: string) {
    return this.meetingService.getTopicsResult(meetingId).subscribe({
      next: (data) => {
        this.topics.set(data);
      },
      error: (error) => {
        this.messages.show('error', error.message);
      },
    });
  }
  setMeetingData() {
    const { value } = this.meetingData;
    const {
      topics,
      showVotingForAll,
      votingStartsAt,
      votingStartType,
      votingEndType,
      canEditTopics,
    } = value;
    if (!canEditTopics) {
      this.getTopicsResult(value.id);
    }
    this.form().patchValue({
      showVotingForAll,
      votingStartType,
      votingEndType,
      ...(votingStartsAt && {
        votingStartsAt: this.datePipe.transform(
          toLocaleTimeZone(votingStartsAt),
          'yyyy-MM-dd'
        ) as string,
        votingStartsAtTime: this.datePipe.transform(
          toLocaleTimeZone(votingStartsAt),
          'HH:mm'
        ) as string,
      }),
    });
    topics.map((topic) =>
      this.fieldControl<FormArray>('topics').push(
        this.meetingService.generateMeetingTopic(topic)
      )
    );
  }

  private topicsWithOptionsListner() {
    const topics = this.fieldControl<FormArray>('topics');
    const filter = (array: any[]) =>
      array.filter((topic: any) => topic.id && topic.choices.length > 1)
        .length > 0
        ? false
        : true;
    // next line is for initial form state.
    this.isSettingsDisabled.set(filter(topics.value));
    topics.valueChanges.subscribe((value) => {
      this.isSettingsDisabled.set(filter(value));
    });
  }

  private voteTypeListner() {
    const form = this.form();

    this.fieldControl<FormControl>('votingStartType').valueChanges.subscribe(
      (value) => {
        if (value === 'Custom') return;
        this.saveVoteSettings({ ...form.value, votingStartType: value });
      }
    );

    this.fieldControl<FormControl>('votingEndType').valueChanges.subscribe(
      (value) => {
        const { votingStartsAt, votingStartsAtTime } = form.value;
        const dateTime = this.dateAndTimeToUTC(
          votingStartsAt ?? '',
          votingStartsAtTime ?? ''
        );
        this.saveVoteSettings({
          ...form.value,
          ...(dateTime && { votingStartsAt: dateTime }),
          votingEndType: value,
        });
      }
    );

    this.fieldControl<FormControl>('showVotingForAll').valueChanges.subscribe(
      (value) => {
        const { votingStartsAt, votingStartsAtTime } = form.value;
        const dateTime = this.dateAndTimeToUTC(
          votingStartsAt ?? '',
          votingStartsAtTime ?? ''
        );
        this.saveVoteSettings({
          ...form.value,
          ...(dateTime && { votingStartsAt: dateTime }),
          showVotingForAll: value,
        });
      }
    );
  }

  private dateTimeListner() {
    const dateControl = this.fieldControl<FormControl>('votingStartsAt');
    const timeControl = this.fieldControl<FormControl>('votingStartsAtTime');

    const initialDate = dateControl.value;
    const initialTime = timeControl.value;

    const combined$ = combineLatest([
      dateControl.valueChanges.pipe(startWith(initialDate)),
      timeControl.valueChanges.pipe(startWith(initialTime)),
    ]).pipe(debounceTime(500));

    combined$.subscribe(([date, time]) => {
      if (!date || !time) return;
      const dateTime = this.dateAndTimeToUTC(date, time);
      const formValue = this.form().value;
      this.saveVoteSettings({
        votingStartType: formValue.votingStartType,
        votingEndType: formValue.votingEndType,
        votingStartsAt: dateTime,
        showVotingForAll: formValue.showVotingForAll,
      });
    });
  }

  fieldControl<T = any>(controlName: string) {
    return this.form().get(controlName) as T;
  }

  addTopic() {
    this.fieldControl('topics').push(
      this.meetingService.generateMeetingTopic()
    );
  }

  saveVoteSettings(data: any) {
    const { value } = this.meetingData;
    if (value.status !== 'Draft') return;
    
    this.meetingService.saveVoteSettings(value.id, data).subscribe({
      error: (error) => this.messages.show('error', error.message),
      next: (data) => {
        this.form().patchValue({ ...data });
      },
    });
  }

  resetControl(control: string) {
    this.fieldControl<FormControl>(control).reset();
  }

  showMessage() {
    if (!this.isSettingsDisabled()) return;
    this.messages.show('info', 'MAIN.MESSAGE.MUST_HAVE_TOPIC');
  }

  dateAndTimeToUTC(date: Date | string, time: string) {
    if (!date || !time) return null;
    const [hours, minutes] = splitTime(time);
    const combinedDate = new Date(
      new Date(date).setHours(hours, minutes, 0, 0)
    );

    return getTransformedDate(
      combinedDate,
      this.datePipe,
      'yyyy-MM-ddTHH:mm',
      'UTC'
    );
  }
}
