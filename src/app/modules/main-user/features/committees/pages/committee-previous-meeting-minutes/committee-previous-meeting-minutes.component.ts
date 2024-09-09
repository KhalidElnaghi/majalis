import { ActivatedRoute } from '@angular/router';
import {
  ChangeDetectionStrategy,
  ElementRef,
  Component,
  viewChild,
  inject,
  signal,
} from '@angular/core';

import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

import { catchError, concatMap, EMPTY, Subscription, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { AttachmentCardComponent } from '../../../../../../shared/components/ui/attachment-card/attachment-card.component';
import { EmptyEntityLineComponent } from '../../../../components/empty-entity-line/empty-entity-line.component';

import { PermissionsManagerService } from '../../../../../../core/permissions/permissions-manager.service';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { LayoutService } from '../../../../../../core/services/layout.service';
import { MeetingsService } from '../../../meeting/meetings.service';
import {
  uploadAttachmentServerResponse,
  UploadOnProgress,
  ProgressStatus,
  MediaService,
} from '../../../../../../core/services/media.service';

import {
  Resources,
  Action,
} from '../../../../../../core/permissions/auth-request.model';

const acceptableAttachments = ['pdf'];

type Document = {
  id: string;
  url: string;
  title: string;
  type: string;
  creationTime: string;
};
@Component({
  selector: 'committee-previous-meeting-minutes',
  standalone: true,
  imports: [
    MatProgressSpinner,
    TranslateModule,
    MatButtonModule,
    MatProgressBar,
    MatTooltip,
    MatIcon,
    AttachmentCardComponent,
    EmptyEntityLineComponent,
  ],
  template: `
    <div class="min-h-20 flex items-center justify-start gap-2">
      @if(permissionsService.can(ACTION.upload, RESOURCE.committeeMOM, true)){
      <button
        mat-raised-button
        (click)="fileInput.click()"
        color="primary"
        type="button"
        [disabled]="layout.isLoading()"
      >
        {{ 'MAIN.BUTTON.ADD_MINUTE' | translate }}
        <mat-icon>add</mat-icon>
      </button>
      }

      <input
        (change)="onFileSelected($event)"
        accept="image/*,.pdf"
        style="display: none"
        type="file"
        #fileInput
        id="file"
      />
    </div>

    <div
      class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3"
    >
      @for(document of previousMeetingMinutes(); track document) {
      <!-- This was Khalid's work,  I made this edit because there was a problem with the response types and data being passed to the card
            so i guess this part needs more investigation, this edit was temporarly added by (Sokkar) to prevent the error from occuring
            so it will provide blank data incase anything wrong happened
        -->
      <attachment-card
        [fileData]="{
          id: document.meetingOccurrenceId || document.id,
          url: document.recordPdfUrl || '',
          title: document.meetingTitle || document.recordText,
          creationTime: document.creationTime,
          isInternal: true,
        }"
        (deleteMinuteDocument)="handleDeleteDocument($event)"
        [fromMinutes]="true"
        [isManual]="!document.meetingOccurrenceId"
        [attendeesFileId]="document.attendanceSheetUrl"
        [permissions]="{
          canDelete: permissionsService.can(
            ACTION.delete,
            RESOURCE.committeeMOM,
            true
          ),
          canPreview: permissionsService.can(
            ACTION.preview,
            RESOURCE.committeeMOM,
            true
          ),
        }"
      />
      } @empty {
      <empty-entity-line />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommitteePreviousMeetingMinutesComponent {
  permissionsService = inject(PermissionsManagerService);
  private messageService = inject(MessagesService);
  private mediaService = inject(MediaService);
  meetingService = inject(MeetingsService);
  activatedRoute = inject(ActivatedRoute);
  messages = inject(MessagesService);
  layout = inject(LayoutService);

  fileInput = viewChild.required<ElementRef>('fileInput');

  RESOURCE = Resources;
  ACTION = Action;

  committeeId = this.activatedRoute.snapshot.queryParams['committeeId'];

  previousMeetingMinutes = signal<any>([]);
  fileUploadStream$!: Subscription;
  document!: Partial<Document>;

  downloadProgress = signal<{ status: ProgressStatus; message: any } | null>(
    null
  );

  singleFileUploadIndicator = signal({
    status: '',
    name: '',
    type: '',
    progress: 0,
  });

  ngOnInit(): void {
    this.getCommitteePreviousMeetingMinutes();
  }

  onFileSelected(event: Event) {
    if (
      this.permissionsService.can(
        this.ACTION.upload,
        this.RESOURCE.committeeMOM,
        true
      )
    ) {
      const inputElement = event.target as HTMLInputElement;
      if (!inputElement.files?.length) return;

      const file: File = inputElement.files[0];
      const typeName = file.type.split('/')[1];

      if (!acceptableAttachments.includes(typeName)) {
        this.messages.show('error', 'MAIN.ERROR.UNSUPPORTED_FILE_TYPE');
        (this.fileInput().nativeElement as HTMLInputElement).value = '';
        return;
      }

      this.fileUploadStream$ = this.handleUploadDocument(file).subscribe({
        next: (val: any) => {
          this.previousMeetingMinutes.set(val.items);
          this.resetUploadProcess();
          this.messageService.show(
            'success',
            'GLOBAL.MESSAGE.FILE_UPLOADED_SUCCESSFULLY',
            2
          );
        },
        complete: () => {
          (this.fileInput().nativeElement as HTMLInputElement).value = '';
          return;
        },
      });
    } else {
      this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
    }
  }

  handleUploadDocument(file?: File) {
    if (!file) return EMPTY;
    this.layout.isLoading.set(true);
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

        const { id, name } = val.message as uploadAttachmentServerResponse;

        this.document = {
          url: id,
          title: name.replace('pdf', ''),
        };

        return this.meetingService.uploadCommitteePreviousMeetingMinutes(
          this.committeeId,
          this.document
        );
      }),
      concatMap(() => {
        this.layout.isLoading.set(false);
        return this.meetingService
          .getCommitteePreviousMeetingMinutes(this.committeeId)
          .pipe(
            catchError((error) => {
              this.layout.isLoading.set(false);
              this.messages.show('error', error.message);
              return throwError(() => error);
            })
          );
      })
    );
  }

  resetUploadProcess() {
    this.singleFileUploadIndicator.set({
      status: '',
      name: '',
      type: '',
      progress: 0,
    });
    this.document = {
      id: '',
      url: '',
      title: '',
      type: '',
      creationTime: '',
    };
  }

  getCommitteePreviousMeetingMinutes() {
    if (
      this.permissionsService.can(
        this.ACTION.list,
        this.RESOURCE.committeeMOM,
        true
      )
    ) {
      this.layout.isLoading.set(true);
      this.meetingService
        .getCommitteePreviousMeetingMinutes(this.committeeId)
        .pipe(
          catchError((error) => {
            this.messages.show('error', error.message);
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (res) => {
            this.previousMeetingMinutes.set(res.items);
            this.layout.isLoading.set(false);
          },
        });
    } else {
      this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
    }
  }

  handleDeleteDocument(value: { id: string; isManual: boolean }) {
    if (
      this.permissionsService.can(
        this.ACTION.delete,
        this.RESOURCE.committeeMOM,
        true
      )
    ) {
      const { id, isManual } = value;

      this.meetingService.deleteMinutesDocuments(id, isManual).subscribe({
        next: () => {
          this.previousMeetingMinutes.update((minutes) =>
            minutes.filter((x: any) =>
              isManual ? x.id !== id : x.meetingOccurrenceId !== id
            )
          );
          this.messageService.show(
            'success',
            'MAIN.MESSAGE.RECORD_DELETED_SUCCESSFULLY'
          );
        },
        error: (error) => this.messageService.show('error', error.message),
      });
    } else {
      this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
    }
  }
}
