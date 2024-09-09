import {
  Component,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import {
  combineLatest,
  concatMap,
  debounceTime,
  EMPTY,
  startWith,
  Subscription,
} from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { CustomDatePickerComponent } from '../../../../../../shared/components/form-controls/custom-date-picker/custom-date-picker.component';
import { userSelectionModal } from '../../../../components/user-selection-modal/user-selection-modal.component';
import { RepetitionDialogComponent } from '../repetition-dialog/repetition-dialog.component';

import { MessagesService } from './../../../../../../shared/components/ui/snackbars/messages.service';
import { LayoutService } from '../../../../../../core/services/layout.service';
import { LANG } from '../../../../../../core/services/translation.service';
import { MeetingsService } from '../../meetings.service';

import { removeArrayDuplicates } from '../../../../../../shared/utils/data-transformation';

import { staticFilterRepetitionData } from '../repetition-dialog/repetition-dialog-config';
import {
  getRepetitionValueType,
  getTransformedDate,
  isValidDate,
  isValidEndTime,
  selectedMonthDetails,
  splitTime,
  toLocaleTimeZone,
} from './meeting-info-step.config';

import {
  acceptableAttachments,
  repeatedOptions,
  isValidationOK,
} from './../../pages/meeting-stepper/meeting-stepper.config';
import {
  repeatitionDialogData,
  Member,
  CommitteeSingleMeeting,
  weekDays,
} from '../../../../main.types';
import { UploadingChipSkeletonComponent } from '../../../../../../shared/components/ui/uploading-chip-skeleton/uploading-chip-skeleton.component';
import { AttachmentChipComponent } from '../../../../../../shared/components/ui/attachment-chip/attachment-chip.component';
import {
  Attachments,
  MediaService,
  uploadAttachmentServerResponse,
  UploadOnProgress,
} from '../../../../../../core/services/media.service';
@Component({
  selector: 'meeting-info-step',
  standalone: true,
  templateUrl: './meeting-info-step.component.html',
  imports: [
    NgClass,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatChipsModule,
    MatDivider,
    MatIcon,

    TranslateModule,

    CustomDatePickerComponent,
    AttachmentChipComponent,
    UploadingChipSkeletonComponent,
  ],
})
export class MeetingInfoStepComponent {
  private messageService = inject(MessagesService);
  private meetingService = inject(MeetingsService);
  private mediaService = inject(MediaService);
  private messages = inject(MessagesService);
  private activatedRoute = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private layout = inject(LayoutService);

  // Upload File Stream Observable Reference
  fileUploadStream$!: Subscription;

  form = input.required<FormGroup>();

  repetitionDialogdata!: repeatitionDialogData;
  attachment!: Attachments;
  lang = LANG;

  meetingId = '';
  committeeId = '';
  isRepeatDisabled = signal(true);
  isTimeDisabled = signal(true);

  items = new MatTableDataSource<Member>();

  fileInput = viewChild.required<ElementRef>('fileInput');
  selectedFiles: any[] = [];
  invitees: any[] = []; // TODO: to be removed after draft integration, testing only
  repeatOptions: {
    key: string;
    type: string;
    value: any;
    translation?: string[];
  }[] = [];

  singleFileUploadIndicator = signal({
    status: '',
    name: '',
    type: '',
    progress: 0,
  });

  ngOnInit() {
    this.committeeId = this.activatedRoute.snapshot.queryParams['committeeId'];

    if (this.activatedRoute.snapshot.queryParams['meetingId']) {
      this.getMeetingData();
    }
  }

  // #region Methods
  fieldControl(controlName: string) {
    return this.form().get(controlName);
  }
  openTimePicker(event: Event) {
    const input = event.target as HTMLInputElement;
    input.showPicker();
  }

  addInvitees(): void {
    this.dialog
      .open(userSelectionModal, {
        direction: this.layout.direction(),
        maxWidth: '800px',
        maxHeight: '90vh',
        width: '90%',

        data: {
          // pass default invitees here when its backend finished
          selected: this.invitees, // TODO: to be removed after draft integration, testing only
          committeeId: this.committeeId,
          titles: {
            main: 'MAIN.TITLE.ADD_INVITEES',
            internalTab: 'MAIN.LABEL.INTERNAL_INVITEES',
            externalTab: 'MAIN.LABEL.EXTERNAL_INVITEES',
            addButton: 'MAIN.TITLE.ADD_NEW_INVITEE',
          },
          category: 'meeting',
        },
      })
      .afterClosed()
      .subscribe((data: Member[]) => {
        if (!data) return;

        this.items.data = removeArrayDuplicates(data, 'id');

        this.invitees = removeArrayDuplicates(this.items.data, 'id');
        this.fieldControl('invitees')?.setValue(this.invitees);

        const seperatedInvitees = this.meetingService.seperateInvitees(data);

        const reqBody = {
          meetingId: this.meetingId,
          internalInvitees: seperatedInvitees.internalInvitees,
          externalInvitees: seperatedInvitees.externalInvitees,
        };

        this.meetingService.saveAsDraft(this.committeeId, reqBody).subscribe({
          error: (error) => this.messageService.show('error', error.message),
        });
      });
  }

  removeInvitees(invitee: Member): void {
    const index = this.invitees.indexOf(invitee);

    if (index >= 0) {
      this.invitees.splice(index, 1);
      this.fieldControl('invitees')?.setValue(this.invitees);
      const seperatedInvitees = this.meetingService.seperateInvitees(
        this.invitees
      );

      const reqBody = {
        meetingId: this.meetingId,
        internalInvitees: seperatedInvitees.internalInvitees,
        externalInvitees: seperatedInvitees.externalInvitees,
      };
      this.meetingService.saveAsDraft(this.committeeId, reqBody).subscribe({
        error: (error) => this.messageService.show('error', error.message),
      });
    }
  }

  removeFile(file: Attachments): void {
    const index = this.selectedFiles.indexOf(file);

    if (index >= 0) {
      this.selectedFiles.splice(index, 1);
    }
  }

  onFileSelected(event: Event) {
    // TODO: Check arabic file names
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files?.length) return;

    const file: File = inputElement.files[0];
    const typeName = file.type.split('/')[1];

    if (!acceptableAttachments.includes(typeName)) {
      this.messages.show('error', 'MAIN.ERROR.UNSUPPORTED_FILE_TYPE');
      (this.fileInput().nativeElement as HTMLInputElement).value = '';
      return;
    }

    this.fileUploadStream$ = this.uploadSelectedFile(file).subscribe({
      next: () => {
        this.selectedFiles.push(this.attachment);
        this.resetUploadChips();
        this.messageService.show(
          'success',
          'GLOBAL.MESSAGE.FILE_UPLOADED_SUCCESSFULLY',
          2
        );
      },
      complete: () => {
        (this.fileInput().nativeElement as HTMLInputElement).value = '';
      },
    });
  }
  uploadSelectedFile(file?: File) {
    if (!file) return EMPTY;
    return this.mediaService.uploadFile(file).pipe(
      concatMap((val: UploadOnProgress) => {
        if (val && val.status === 'progress') {
          this.singleFileUploadIndicator.set({
            status: 'progress',
            name: val.fileName,
            type: val.fileType,
            progress: val.message as number,
          });
          return EMPTY;
        }

        if (!val || val.status !== 'done') return EMPTY;

        const { id, name, contentType } =
          val.message as uploadAttachmentServerResponse;
        this.attachment = {
          url: id,
          name: name,
          type: contentType,
        };
        return this.meetingService.saveAsDraft(this.committeeId, {
          meetingId: this.meetingId,
          meetingAttachments: [this.attachment],
        });
      })
    );
  }

  cancelUploadProgress() {
    this.fileUploadStream$.unsubscribe();
    this.resetUploadChips();
  }
  resetUploadChips() {
    this.singleFileUploadIndicator.set({
      status: '',
      name: '',
      type: '',
      progress: 0,
    });
    this.attachment = {
      url: '',
      name: '',
      type: '',
    };
  }
  enableRepetition(
    transformedDate: string,
    startTime: string,
    endTime: string
  ) {
    const startTimeDate = `${transformedDate}T${startTime}`;
    const endTimeDate = `${transformedDate}T${endTime}`;
    if (
      isValidDate(transformedDate) &&
      startTime &&
      isValidEndTime(startTimeDate, endTimeDate)
    ) {
      const monthDetails = selectedMonthDetails(transformedDate, this.datePipe);
      const lang = this.layout.language();
      this.repeatOptions = repeatedOptions(monthDetails, lang);
      this.isRepeatDisabled.set(false);
    }
    if (!isValidDate(transformedDate) || !startTime || !endTime) {
      this.isRepeatDisabled.set(true);
    }
  }
  onDateTimeChanges(date: Date, startTime: string, endTime: string) {
    if (
      date < new Date(new Date().setHours(0, 0, 0, 0)) ||
      !startTime ||
      !endTime
    )
      return;
    const [startHours, startMinutes] = splitTime(startTime);
    const [endHours, endMinutes] = splitTime(endTime);

    const combinedDateAndStartTime = new Date(
      new Date(date).setHours(startHours, startMinutes, 0, 0)
    );
    const combinedDateAndEndTime = new Date(
      new Date(date).setHours(endHours, endMinutes, 0, 0)
    );
    const dateAndStartTime = getTransformedDate(
      combinedDateAndStartTime,
      this.datePipe,
      'yyyy-MM-ddTHH:mm',
      'UTC'
    );
    const dateAndEndTime = getTransformedDate(
      combinedDateAndEndTime,
      this.datePipe,
      'yyyy-MM-ddTHH:mm',
      'UTC'
    );
    const reqBody = {
      meetingId: this.meetingId,
      date: dateAndStartTime,
      endAt: dateAndEndTime,
    };
    this.meetingService.saveAsDraft(this.committeeId, reqBody).subscribe({
      error: (error) => this.messageService.show('error', error.message),
    });
  }
  handleOpenDialog() {
    const dialogRef = this.dialog.open(RepetitionDialogComponent, {
      disableClose: true,
      direction: this.layout.direction(),
      data: {
        date: this.form().get('date')?.value,
        data: this.repetitionDialogdata,
        committeeId: this.committeeId,
        meetingId: this.meetingId,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) return;
      this.repetitionDialogdata = res;
    });
  }

  // TITLE, DESCRIPTION, LOCATION
  inputOnBlur(event: Event) {
    const { id: key, value } = event.target as HTMLInputElement;
    const reqBody = {
      meetingId: this.meetingId,
      [key]: value,
    };
    if (!isValidationOK(key, value)) return;
    this.meetingService.saveAsDraft(this.committeeId, reqBody).subscribe({
      error: (error) => this.messageService.show('error', error.message),
    });
  }
  saveDateAndTimeAsDraft() {
    const dateControl = this.fieldControl('date')!;
    const startTimeControl = this.fieldControl('startTime')!;
    const endTimeControl = this.fieldControl('endTime')!;

    const initialDate = dateControl.value;
    const initialStartTime = startTimeControl.value;
    const initialEndTime = endTimeControl.value;

    const combined$ = combineLatest([
      dateControl.valueChanges.pipe(startWith(initialDate)),
      startTimeControl.valueChanges.pipe(startWith(initialStartTime)),
      endTimeControl.valueChanges.pipe(startWith(initialEndTime)),
    ]);

    combined$
      .pipe(debounceTime(500))
      .subscribe(([date, startTime, endTime]) => {
        const transformedDate = getTransformedDate(date, this.datePipe)!;
        if (dateControl.errors) {
          this.isTimeDisabled.set(true);
        } else {
          this.isTimeDisabled.set(false);
        }
        if (
          dateControl.errors ||
          startTimeControl.errors ||
          endTimeControl.errors
        ) {
          this.isRepeatDisabled.set(true);
          return;
        }

        this.enableRepetition(transformedDate, startTime, endTime);
        this.onDateTimeChanges(date, startTime, endTime);
      });
  }
  saveNotificationTypeAsDraft() {
    this.fieldControl('emailAlert')?.valueChanges.subscribe((val) => {
      notificationChange('emailNotification', val);
    });
    this.fieldControl('smsAlert')?.valueChanges.subscribe((val) => {
      notificationChange('smsNotification', val);
    });

    const notificationChange = (
      key: 'emailNotification' | 'smsNotification',
      val: Boolean
    ) => {
      const reqBody = {
        meetingId: this.meetingId,
        [key]: val,
      };
      this.meetingService.saveAsDraft(this.committeeId, reqBody).subscribe({
        error: (error) => this.messageService.show('error', error.message),
      });
    };
  }

  saveRepeatAsDraft() {
    this.fieldControl('repeat')?.valueChanges.subscribe((val) => {
      if (!val || val === 'CUSTOM_VALUE') return;
      const date = this.fieldControl('date')?.value;
      const reqBody = {
        meetingId: this.meetingId,
        repetition: staticFilterRepetitionData(
          val,
          getTransformedDate(date, this.datePipe, 'EEEE')! as weekDays[number]
        ),
      };
      this.meetingService.saveAsDraft(this.committeeId, reqBody).subscribe({
        error: (error) => this.messageService.show('error', error.message),
      });
    });
  }

  getMeetingData() {
    const { meetingId, committeeId } = this.activatedRoute.snapshot.queryParams;
    this.meetingId = meetingId;
    const { value } = this.activatedRoute.snapshot.data[
      'details'
    ] as CommitteeSingleMeeting;

    if (!value) {
      this.router.navigate(['/main/committee/details'], {
        queryParams: {
          committeeId,
        },
      });
    }

    const {
      title,
      description,
      location,
      emailNotification,
      smsNotification,
      invitees,
      date,
      meetingAttachments,
      repetition,
      endAt,
    } = value;

    const transformedDate = getTransformedDate(date, this.datePipe)!; // i.e 2024-12-31
    const dateLocal = new Date(toLocaleTimeZone(date)); // Z -> for timezone to convert it back to local-time from UTC

    if (isValidDate(transformedDate, false)) {
      const monthDetails = selectedMonthDetails(date, this.datePipe);
      const lang = this.layout.language();
      this.repeatOptions = repeatedOptions(monthDetails, lang);
      this.isTimeDisabled.set(false);
      this.isRepeatDisabled.set(false);
    }

    if (repetition.isCustom) {
      this.repetitionDialogdata = {
        ...repetition,
        end: 'never',
        ...(repetition.maxRepetitionCount && { end: 'count' }),
        ...(repetition.endAt && { end: 'date' }),
        ...(repetition.day ? { day: 'this-day' } : { day: 'this-date' }),
      };
    }

    this.form().patchValue({
      name: title,
      description: description,
      location: location,
      emailAlert: emailNotification,
      smsAlert: smsNotification,
      invitees: invitees,
      ...(isValidDate(transformedDate, false) && {
        date: getTransformedDate(dateLocal, this.datePipe, 'yyyy-MM-dd'),
        startTime: getTransformedDate(dateLocal, this.datePipe, 'HH:mm'),
      }),
      ...(isValidEndTime(date, endAt) && {
        endTime: getTransformedDate(
          toLocaleTimeZone(endAt),
          this.datePipe,
          'HH:mm'
        ),
      }),
      files: meetingAttachments,
      repeat: getRepetitionValueType(
        repetition.type,
        repetition.weekDays,
        repetition.isCustom
      ),
    });

    this.invitees = invitees.map((invitee) => ({
      ...invitee.member,
      memberType: invitee?.member?.type?.toUpperCase(), // this to identify whether the invitee is "INTERNAL" or "EXTERNAL"
    }));
    this.selectedFiles = meetingAttachments;

    this.listeners();
  }

  listeners() {
    this.saveRepeatAsDraft();
    this.saveNotificationTypeAsDraft();
    this.saveDateAndTimeAsDraft();
  }
}
