import {
  Component,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDatePickerComponent } from '../../../../../../shared/components/form-controls/custom-date-picker/custom-date-picker.component';
import { DatePipe, NgClass } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatChipSet } from '@angular/material/chips';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { UploadingChipSkeletonComponent } from '../../../../../../shared/components/ui/uploading-chip-skeleton/uploading-chip-skeleton.component';
import { AttachmentChipComponent } from '../../../../../../shared/components/ui/attachment-chip/attachment-chip.component';
import { ActivatedRoute } from '@angular/router';
import {
  Member,
  Occurrence,
  repeatitionDialogData,
  weekDays,
} from '../../../../main.types';
import {
  combineLatest,
  concatMap,
  debounceTime,
  EMPTY,
  of,
  startWith,
  Subscription,
} from 'rxjs';
import {
  getRepetitionValueType,
  getTransformedDate,
  isValidDate,
  isValidEndTime,
  selectedMonthDetails,
  toLocaleTimeZone,
} from '../meeting-info-step/meeting-info-step.config';
import {
  acceptableAttachments,
  repeatedOptions,
} from '../../pages/meeting-stepper/meeting-stepper.config';
import { LayoutService } from '../../../../../../core/services/layout.service';
import { MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import {
  Attachments,
  MediaService,
  uploadAttachmentServerResponse,
  UploadOnProgress,
} from '../../../../../../core/services/media.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { userSelectionModal } from '../../../../components/user-selection-modal/user-selection-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { removeArrayDuplicates } from '../../../../../../shared/utils/data-transformation';
import { MeetingsService } from '../../meetings.service';
import {
  staticFilterRepetitionData,
  StaticRepetitionTypes,
} from '../repetition-dialog/repetition-dialog-config';
import { RepetitionDialogComponent } from '../repetition-dialog/repetition-dialog.component';

@Component({
  selector: 'edit-occurrence-info-step',
  standalone: true,
  templateUrl: './edit-occurrence-info-step.component.html',
  imports: [
    NgClass,
    ReactiveFormsModule,

    MatInput,
    MatFormField,
    MatSelect,
    MatLabel,
    MatCheckbox,
    MatOption,
    MatChipSet,
    MatIcon,
    MatIconButton,
    MatError,
    MatButton,

    CustomDatePickerComponent,
    UploadingChipSkeletonComponent,
    AttachmentChipComponent,

    TranslateModule,
  ],
})
export class EditOccurrenceInfoStep {
  activatedRoute = inject(ActivatedRoute);
  datePipe = inject(DatePipe);
  dialog = inject(MatDialog);
  mediaService = inject(MediaService);
  messageService = inject(MessagesService);
  layout = inject(LayoutService);
  meetingService = inject(MeetingsService);

  committeeId = this.activatedRoute.snapshot.queryParams['committeeId'];
  occurrenceId = this.activatedRoute.snapshot.queryParams['occurrenceId'];

  form = input.required<FormGroup>();

  repetitionDialogdata!: repeatitionDialogData;

  fileUploadStream$!: Subscription;
  fileInput = viewChild.required<ElementRef>('fileInput');
  selectedFiles: any[] = [];
  attachment!: Attachments;

  fieldControl(controlName: string) {
    return this.form().get(controlName);
  }

  repeatOptions: {
    key: string;
    type: string;
    value: any;
    translation?: string[];
  }[] = [];
  invitees: any[] = [];
  items = new MatTableDataSource<Member>();

  isTimeDisabled = signal(true);
  isRepeatDisabled = signal(false);

  singleFileUploadIndicator = signal({
    status: '',
    name: '',
    type: '',
    progress: 0,
  });

  ngOnInit() {
    this.valueSetter();
  }

  openTimePicker(event: Event) {
    const input = event.target as HTMLInputElement;
    input.showPicker();
  }

  DateTimeWatcher() {
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
      });
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
  repetitionWatcher() {
    this.fieldControl('repeat')?.valueChanges.subscribe((val) => {
      if (!val || val === 'CUSTOM_VALUE') return;
      const date = this.fieldControl('date')?.value;
      this.form().patchValue({
        repetition: staticFilterRepetitionData(
          val,
          getTransformedDate(date, this.datePipe, 'EEEE')! as weekDays[number]
        ),
      });
    });
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
        const seperatedInvitees = this.meetingService.seperateInvitees(data);

        this.form().patchValue({
          invitees: this.invitees,
          seperatedInvitees: seperatedInvitees,
        });
      });
  }

  removeInvitees(invitee: Member): void {
    const index = this.invitees.indexOf(invitee);

    if (index >= 0) {
      this.invitees.splice(index, 1);
      const seperatedInvitees = this.meetingService.seperateInvitees(
        this.invitees
      );

      this.form().patchValue({
        invitees: this.invitees,
        seperatedInvitees: seperatedInvitees,
      });
    }
  }
  handleOpenDialog() {
    const dialogRef = this.dialog.open(RepetitionDialogComponent, {
      disableClose: true,
      direction: this.layout.direction(),
      data: {
        date: this.form().get('date')?.value,
        data: this.repetitionDialogdata,
        isEdit: true,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) return;
      this.repetitionDialogdata = res;
      this.form().patchValue({
        repetition: res,
      });
    });
  }

  onFileSelected(event: Event) {
    // TODO: Check arabic file names
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files?.length) return;

    const file: File = inputElement.files[0];
    const typeName = file.type.split('/')[1];

    if (!acceptableAttachments.includes(typeName)) {
      this.messageService.show('error', 'MAIN.ERROR.UNSUPPORTED_FILE_TYPE');
      (this.fileInput().nativeElement as HTMLInputElement).value = '';
      return;
    }

    this.fileUploadStream$ = this.uploadSelectedFile(file).subscribe({
      next: (val) => {
        const filesControlValue = this.fieldControl('files')?.value.slice();
        filesControlValue.push({
          url: val.id,
          name: val.name,
          type: val.contentType,
        });
        this.form().patchValue({
          files: filesControlValue,
        });
        this.resetUploadChips();
      },
      error: (error) => this.messageService.show('error', error.message),
    });
  }
  uploadSelectedFile(file: File) {
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

        return of(val.message as uploadAttachmentServerResponse);
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
  removeFile(file: Attachments): void {
    const filesControlValue = this.fieldControl('files')?.value.slice();
    const index = filesControlValue?.indexOf(file);

    if (index >= 0) {
      filesControlValue.splice(index, 1);
      this.form().patchValue({
        files: filesControlValue,
      });
    }
  }

  valueSetter() {
    const { value } = this.activatedRoute.snapshot.data[
      'occurrenceData'
    ] as Occurrence;

    const dateLocal = new Date(toLocaleTimeZone(value.date));

    this.invitees = value.invitees.map((invitee) => ({
      ...invitee.member,
      memberType: invitee?.member?.type?.toUpperCase(), // this to identify whether the invitee is "INTERNAL" or "EXTERNAL"
    }));

    const monthDetails = selectedMonthDetails(value.date, this.datePipe);
    const lang = this.layout.language();
    this.repeatOptions = repeatedOptions(monthDetails, lang);

    if (value.repetition.isCustom) {
      this.repetitionDialogdata = {
        ...value.repetition,
        end: 'never',
        ...(value.repetition.maxRepetitionCount && { end: 'count' }),
        ...(value.repetition.endAt && { end: 'date' }),
        ...(value.repetition.day ? { day: 'this-day' } : { day: 'this-date' }),
      } as repeatitionDialogData;
    }

    const repeatType = getRepetitionValueType(
      value.repetition.type,
      value.repetition.weekDays as weekDays,
      value.repetition.isCustom
    );

    this.form().patchValue({
      name: value.title,
      date: getTransformedDate(dateLocal, this.datePipe, 'yyyy-MM-dd'),
      startTime: getTransformedDate(dateLocal, this.datePipe, 'HH:mm'),
      endTime: getTransformedDate(
        toLocaleTimeZone(value.endAt),
        this.datePipe,
        'HH:mm'
      ),
      repeat: repeatType,
      invitees: value.invitees,
      location: value.location,
      emailAlert: value.emailNotification,
      smsAlert: value.smsNotification,
      description: value.description,
      files: value.meetingAttachments,
      seperatedInvitees: this.meetingService.seperateInvitees(this.invitees),
      repetition: staticFilterRepetitionData(
        value.repetition.type,
        getTransformedDate(
          value.date,
          this.datePipe,
          'EEEE'
        )! as weekDays[number]
      ),
    });

    this.invitees = value.invitees.map((invitee) => ({
      ...invitee.member,
      memberType: invitee?.member?.type?.toUpperCase(), // this to identify whether the invitee is "INTERNAL" or "EXTERNAL"
    }));

    this.watchers();
  }
  watchers() {
    this.DateTimeWatcher();
    this.repetitionWatcher();
  }
}
