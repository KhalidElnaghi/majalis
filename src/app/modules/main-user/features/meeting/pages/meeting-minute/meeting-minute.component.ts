import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import {
  ElementRef,
  Component,
  viewChild,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatTooltip } from '@angular/material/tooltip';
import { MatChipSet } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatSort } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatTableDataSource,
} from '@angular/material/table';

import { UploadingChipSkeletonComponent } from '../../../../../../shared/components/ui/uploading-chip-skeleton/uploading-chip-skeleton.component';
import { AttachmentChipComponent } from '../../../../../../shared/components/ui/attachment-chip/attachment-chip.component';
import { CustomBreadcrumbComponent } from '../../../../../../shared/components/ui/breadcrumb/custom-breadcrumb.component';
import { PageHeaderComponent } from '../../../../../../shared/components/business/page-header/page-header.component';
import { PollsResultDialogComponent } from '../../components/polls-result-dialog/polls-result-dialog.component';
import { MeetingMomentsPdfComponent } from '../../components/meeting-moments-pdf.component';
import {
  DataTableComponent,
  ColumnDefinition,
} from '../../../../../../shared/components/ui/data-table/data-table.component';

import { concatMap, EMPTY, Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { PermissionsManagerService } from '../../../../../../core/permissions/permissions-manager.service';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { LayoutService } from '../../../../../../core/services/layout.service';
import { MeetingsService } from '../../meetings.service';
import {
  uploadAttachmentServerResponse,
  UploadOnProgress,
  MediaService,
  Attachments,
} from '../../../../../../core/services/media.service';

import { CustomDatePipe } from '../../../../../../shared/pipes/custom-date-pipe/custom-date-pipe.pipe';

import { toLocaleTimeZone } from '../../components/meeting-info-step/meeting-info-step.config';
import { acceptableAttachments } from '../meeting-stepper/meeting-stepper.config';
import { pageTitle, breadcrumbData } from './meeting-minute.config';
import {
  Resources,
  Action,
} from '../../../../../../core/permissions/auth-request.model';
import {
  MeetingMinuteData,
  MinuteInvitee,
  Meeting,
} from '../../../../main.types';
import { PdfService } from '../../../../../../core/services/pdf.service';
@Component({
  selector: 'meeting-minute',
  standalone: true,
  templateUrl: './meeting-minute.component.html',
  imports: [
    MatButton,
    MatIcon,
    NgClass,
    MatChipSet,
    MatRadioButton,
    MatRadioGroup,
    MatTooltip,
    MatPaginator,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatSort,
    MatError,
    MatFormField,

    TranslateModule,
    ReactiveFormsModule,
    CustomDatePipe,
    CustomBreadcrumbComponent,
    PageHeaderComponent,
    DataTableComponent,
    AttachmentChipComponent,
    UploadingChipSkeletonComponent,
    MeetingMomentsPdfComponent,
  ],
})
export default class MeetingMinuteComponent {
  //#region Injectables
  permissionsService = inject(PermissionsManagerService);
  private formBuilder = inject(FormBuilder);
  meetingService = inject(MeetingsService);
  activatedRoute = inject(ActivatedRoute);
  mediaService = inject(MediaService);
  messages = inject(MessagesService);
  layout = inject(LayoutService);
  dialog = inject(MatDialog);
  router = inject(Router);
  pdf = inject(PdfService);

  meetingDataTest = {
    id: '',
    date: new Date(),
  };

  attendeesFileUploadStream$!: Subscription;
  attachmentsUploadStream$!: Subscription;

  occurrenceId = this.activatedRoute.snapshot.queryParams['occurrenceId'];
  committeeId = this.activatedRoute.snapshot.queryParams['committeeId'];
  meetingMinuteData = this.activatedRoute.snapshot.data[
    'meetingMinuteData'
  ] as MeetingMinuteData;

  recordTextSignal = signal<string[]>([]);
  meetingMinute = signal({
    title: '',
    date: '',
  });
  meetingOccurrenceStatus = signal('');
  copyStatus = signal(false);
  viewMode = signal(false);
  isClosed = signal(false);
  hasTopics = signal(false);

  attendeesFile = signal<Attachments | null>(null);
  attendeesFileUploadIndicator = signal({
    status: '',
    name: '',
    type: '',
    progress: 0,
  });
  attachmentsUploadIndicator = signal({
    status: '',
    name: '',
    type: '',
    progress: 0,
  });
  // #region Properties
  pageTitle = pageTitle;
  breadcrumbData = breadcrumbData(this.committeeId);

  initialColumns = [{ key: 'name', name: 'MAIN.TITLE.NAME' }];
  editModeColumns: ColumnDefinition[] = [
    { key: 'name', name: 'MAIN.TITLE.NAME' },
  ];
  viewModeColumns: ColumnDefinition[] = [
    { key: 'name', name: 'MAIN.TITLE.NAME' },
    { key: 'markingAttendance', custom: true },
  ];
  items = new MatTableDataSource<MinuteInvitee>();
  preAttendingMembers = signal<string[]>([]);
  attendedInvitees = signal<string[]>([]);

  RESOURCE = Resources;
  ACTION = Action;

  attendeesInput = viewChild.required<ElementRef>('attendeesInput');

  editModeAttendeesPaginator = viewChild.required<MatPaginator>(
    'editModeAttendeesPaginator'
  );
  viewModeAttendeesPaginator = viewChild.required<MatPaginator>(
    'viewModeAttendeesPaginator'
  );

  attachmentsInput = viewChild.required<ElementRef>('attachmentsInput');

  selectedAttachments: Attachments[] = [];
  pdfRecord = signal<string>('');
  votes = signal<any[]>([]);
  minuteForm = this.formBuilder.group({
    recordText: ['Description'],
    attendeesType: ['file'],
  });
  ngOnInit() {
    this.setMeetingMinuteData();
    this.setVotes();
  }
  setMeetingMinuteData() {
    const { viewMode } = this.activatedRoute.snapshot.queryParams;
    const {
      status,
      title,
      date,
      recordText,
      attendanceSheetUrl,
      attendanceSheetName,
      attendanceSheetType,
      invitees,
      attachments,
      hasTopics,
      meetingOccurrenceStatus,
    } = this.meetingMinuteData;

    if (status === 'Closed' && viewMode !== 'true') {
      this.redirectoToMeetingsList();
    }

    // SET VIEW MODE
    this.viewMode.set(viewMode === 'true' && status === 'Closed');
    this.items.paginator =
      viewMode === 'true' && status === 'Closed'
        ? this.viewModeAttendeesPaginator()
        : this.editModeAttendeesPaginator();

    // SET POLLS VIEW
    this.hasTopics.set(!!hasTopics);

    // SET POLLS STATUS
    this.meetingOccurrenceStatus.set(meetingOccurrenceStatus);
    // SET ATTENDEES THAT ACCEPTED THE INVITATION TO BE PRE-CHECKED
    this.preAttendingMembers.set(
      invitees.filter((x) => x.isAttended).map((x) => x.inviteeId)
    );
    // THIS TO WATCH FOR CHECKED ATTENDEES TO SEND THEM TO BACK-END
    this.attendedInvitees.set(
      invitees.filter((x) => x.isAttended).map((x) => x.inviteeId)
    );

    // SETTING TITLE, DATE
    this.meetingMinute.set({
      title: title,
      date: toLocaleTimeZone(date),
    });

    // SET ATTENDEES PDF
    if (attendanceSheetUrl && attendanceSheetName && attendanceSheetType) {
      this.attendeesFile.set({
        url: attendanceSheetUrl,
        name: attendanceSheetName,
        type: attendanceSheetType,
      });
    }

    // SET recordText & attendeesType defaults to table unless a file was provided
    if (recordText) {
      this.recordTextSignal.set(recordText.split('\n'));
    }
    this.minuteForm.patchValue({
      recordText,
      attendeesType: this.attendeesFile() ? 'file' : 'table',
    });

    // Set the tables data to be the retrieved inviteees
    this.items.data = invitees;

    // Already Saved Attachments
    this.selectedAttachments = attachments.map((attachment) => ({
      url: attachment.url,
      name: attachment.title,
      type: attachment.type,
    }));
  }
  setVotes() {
    this.meetingService.getTopicsResult(this.occurrenceId).subscribe((data) => {
      this.votes.set(data);
    });
  }

  fieldControl(formControlName: string) {
    return this.minuteForm.get(formControlName);
  }

  // #region Methods
  handleTextareaChange(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.recordTextSignal.set(value.split('\n'));
  }
  copyMinuteText() {
    const minuteDescriptionControl = this.fieldControl('recordText');
    navigator.clipboard
      .writeText(minuteDescriptionControl?.value || '')
      .then(() => {
        this.copyStatus.set(true);
        setTimeout(() => {
          this.copyStatus.set(false);
        }, 1000);
      })
      .catch(() => {
        this.messages.show('error', 'MAIN.MESSAGE.WE_COULD_NOT_COPY_THE_TEXT');
      });
  }

  setSelection(event: {
    checked: boolean;
    entity: MinuteInvitee | MinuteInvitee[];
  }) {
    const { checked, entity } = event;
    // CHECK / UNCHECK ALL
    if (Array.isArray(entity) && checked) {
      this.attendedInvitees.set(entity.map((x) => x.inviteeId));
      return;
    }
    if (Array.isArray(entity) && !checked) {
      this.attendedInvitees.set([]);
      return;
    }

    // SINGLE CHECK / UNCHECK
    if (checked) {
      this.attendedInvitees.update((curVal) => [
        ...curVal,
        (entity as MinuteInvitee).inviteeId,
      ]);

      return;
    }

    this.attendedInvitees.update((curVal) => [
      ...curVal.filter((x) => x !== (entity as MinuteInvitee).inviteeId),
    ]);
  }

  onSelectingAttendeesFile(fileInputEvent: Event) {
    const selectedFile = (
      (fileInputEvent.target as HTMLInputElement).files as FileList
    )[0];

    const typeName = selectedFile.type.split('/')[1];

    if (typeName !== 'pdf') {
      this.messages.show(
        'error',
        'MAIN.MESSAGE.ATTENDEES_FILE_SHOULD_BE_OF_TYPE_PDF'
      );
      (this.attendeesInput().nativeElement as HTMLInputElement).value = '';
      return;
    }
    (this.attendeesInput().nativeElement as HTMLInputElement).value = '';

    this.attendeesFile.set(null);

    this.attendeesFileUploadStream$ = this.uploadFile(
      selectedFile,
      'ATTENDEES'
    ).subscribe({
      error: (error) => {
        this.messages.show('error', error.message);
      },
    });
  }

  removeAttendeesFile() {
    (this.attendeesInput().nativeElement as HTMLInputElement).value = '';
    this.attendeesFile.set(null);
  }

  cancelUploadAttendeesFileProgress() {
    this.attendeesFileUploadStream$.unsubscribe();
    this.attendeesFileUploadIndicator.set({
      status: '',
      name: '',
      type: '',
      progress: 0,
    });
  }

  onAttachmentSelected(fileInputEvent: Event) {
    const selectedFile = (
      (fileInputEvent.target as HTMLInputElement).files as FileList
    )[0];

    const typeName = selectedFile.type.split('/')[1];

    if (!acceptableAttachments.includes(typeName)) {
      this.messages.show('error', 'MAIN.ERROR.UNSUPPORTED_FILE_TYPE');
      (this.attachmentsInput().nativeElement as HTMLInputElement).value = '';
      return;
    }
    this.attachmentsUploadStream$ = this.uploadFile(
      selectedFile,
      'ATTACHMENTS'
    ).subscribe({
      error: (error) => {
        this.messages.show('error', error.message);
      },
    });

    (this.attachmentsInput().nativeElement as HTMLInputElement).value = '';
  }

  removeAttachment(file: Attachments) {
    const fileIndex = this.selectedAttachments.indexOf(file);
    if (fileIndex >= 0) {
      this.selectedAttachments.splice(fileIndex, 1);
    }
  }

  cancelUploadAttachmentProgress() {
    this.attachmentsUploadStream$.unsubscribe();
    this.attachmentsUploadIndicator.set({
      status: '',
      name: '',
      type: '',
      progress: 0,
    });
  }

  viewMeetingPolls() {
    this.dialog.open(PollsResultDialogComponent, {
      width: '70%',
      maxHeight: '600px',
      direction: this.layout.direction(),
      data: {
        meetingId: this.occurrenceId,
        meetingStatus: this.meetingOccurrenceStatus(),
        showVotingForAll: true,
      },
    });
  }

  uploadFile(file: File, attachmentType: 'ATTENDEES' | 'ATTACHMENTS') {
    return this.mediaService.uploadFile(file).pipe(
      concatMap((val: UploadOnProgress) => {
        if (
          val &&
          val.status === 'progress' &&
          attachmentType === 'ATTENDEES'
        ) {
          this.attendeesFileUploadIndicator.set({
            status: 'progress',
            name: val.fileName,
            type: val.fileType,
            progress: val.message as number,
          });
          return EMPTY;
        }
        if (
          val &&
          val.status === 'progress' &&
          attachmentType === 'ATTACHMENTS'
        ) {
          this.attachmentsUploadIndicator.set({
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
        const attachment = {
          url: id,
          name: name,
          type: contentType,
        };

        if (attachmentType === 'ATTENDEES') {
          this.attendeesFile.set(attachment);
          this.attendeesFileUploadIndicator.set({
            status: '',
            name: '',
            type: '',
            progress: 0,
          });
        }

        if (attachmentType === 'ATTACHMENTS') {
          this.selectedAttachments.push(attachment);
          this.attachmentsUploadIndicator.set({
            status: '',
            name: '',
            type: '',
            progress: 0,
          });
        }

        return this.meetingService.createMeetingMinute(
          this.occurrenceId,
          this.getReqBody()
        );
      })
    );
  }

  saveSuccess() {
    return {
      next: () => {
        this.messages.show(
          'success',
          this.isClosed()
            ? 'MAIN.MESSAGE.MINUTE_WAS_SUCCESSFULLY_CLOSED'
            : 'MAIN.MESSAGE.MINUTE_WAS_SUCCESSFULLY_SAVED_AS_DRAFT'
        );
        this.redirectoToMeetingsList();
      },
      error: (error: any) => {
        this.messages.show('error', error.message);
        this.isClosed.set(false);
      },
      complete: () => {
        this.layout.isLoading.set(true);
      },
    };
  }

  saveAsDraft() {
    if (
      this.permissionsService.can(
        this.ACTION.create,
        this.RESOURCE.committeeMeetingMOM,
        true
      )
    ) {
      this.saveMinute().subscribe(this.saveSuccess());
    } else {
      this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
    }
  }

  saveMinute() {
    return this.meetingService.createMeetingMinute(
      this.occurrenceId,
      this.getReqBody()
    );
  }

  getPrintableDocs() {
    const doc = document.getElementById('pdf-container')!;
    doc.style.display = 'block';
    const intro = document.getElementById('intro')!;
    const attendance = document.getElementById('attendance')!;
    const voting = document.getElementById('voting')!;
    return { doc, intro, attendance, voting };
  }

  closeMinute() {
    if (
      this.permissionsService.can(
        this.ACTION.create,
        this.RESOURCE.committeeMeetingMOM,
        true
      )
    ) {
      const recordText = this.fieldControl('recordText')!;
      if (!recordText?.value) {
        recordText.setErrors({
          required: true,
        });
        this.messages.show('error', 'MAIN.MESSAGE.MINUTE_TEXT_IS_REQUIRED');
        return;
      }
      recordText.setErrors(null);
      this.isClosed.set(true);
      this.layout.isLoading.set(true);

      const { doc, intro, attendance, voting } = this.getPrintableDocs();

      this.pdf
        .submit({ intro, attendance, voting })
        .then((blob: Blob) => {
          doc.style.display = 'none';
          const file = new File(
            [blob],
            `${this.meetingMinuteData.title.trim()}-attendees.pdf`
          );
          this.mediaService
            .uploadFile(file)
            .pipe(
              concatMap((response) => {
                if (!response || response.status !== 'done') return EMPTY;
                this.pdfRecord.set(response.message.id);
                return this.saveMinute();
              })
            )
            .subscribe(this.saveSuccess());
        })
        .catch(() => {
          this.layout.isLoading.set(false);
        });
    } else {
      this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
    }
  }

  cancelMinute() {
    this.redirectoToMeetingsList();
  }

  redirectoToMeetingsList() {
    this.router.navigate(['/main/committee/details'], {
      queryParams: {
        committeeId: this.committeeId,
      },
    });
  }

  getReqBody() {
    const reqBody = {
      recordText: this.fieldControl('recordText')?.value || '',
      attendedInvitees: this.attendedInvitees(),
      ...(this.attendeesFile() && {
        attendanceSheetUrl: this.attendeesFile()!.url,
        attendanceSheetName: this.attendeesFile()!.name,
        attendanceSheetType: this.attendeesFile()!.type,
      }),
      isClosed: this.isClosed(),
      attachments: this.selectedAttachments.map((attachment) => ({
        title: attachment.name,
        url: attachment.url,
        type: attachment.type,
      })),
      ...(this.isClosed() && {
        recordPdfUrl: this.pdfRecord(),
      }),
    };
    return reqBody;
  }
}
