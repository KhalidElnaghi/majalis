import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';

import { MeetingsService } from '../../../../modules/main-user/features/meeting/meetings.service';
import { DialogsService } from '../confirm-dialog/confirmation-dialog.service';
import { LayoutService } from '../../../../core/services/layout.service';
import { MessagesService } from '../snackbars/messages.service';
import {
  ProgressStatus,
  MediaService,
} from '../../../../core/services/media.service';

import { CustomDatePipe } from '../../../pipes/custom-date-pipe/custom-date-pipe.pipe';

@Component({
  selector: 'attachment-card',
  standalone: true,
  imports: [
    NgClass,

    MatProgressSpinner,
    MatButtonModule,
    MatCardModule,
    MatTooltip,
    MatDivider,
    MatIcon,

    TranslateModule,

    CustomDatePipe,
  ],
  template: `
    <mat-card class="!rounded-2xl shadow-lg m-2">
      <img
        src="./assets/images/pdf.png"
        mat-card-image
        alt="pdf logo"
        width="100%"
      />
      <mat-card-content>
        <div>
          <p class="font-bold text-xl truncate">
            {{ this.fileData().title || '--' }}
          </p>

          <p
            [ngClass]="{
              'text-xs': !this.layout.onMobile() && this.layout.isMenuOpen()
            }"
          >
            {{ 'GLOBAL.LABEL.DOCUMENT_ADDED_ON' | translate }}
            {{ this.fileData().creationTime | customDatePipe : 'dd-MM-yyyy' }}
          </p>
        </div>
      </mat-card-content>

      <mat-card-actions>
        <div class="mt-2 flex justify-start items-center ">
          <!-- Preview PDF -->
          <button
            [matTooltip]="'GLOBAL.BUTTON.VIEW' | translate"
            (click)="viewPDF()"
            mat-icon-button
            color="primary"
          >
            <mat-icon> remove_red_eye </mat-icon>
          </button>

          <!-- Download PDF -->
          @if(downloadProgress() && downloadProgress()?.status === "progress"){
          <div class="grid place-items-center relative">
            <mat-progress-spinner
              class="!col-span-full !row-span-full"
              [value]="downloadProgress()?.message"
              mode="determinate"
              color="primary"
              diameter="30"
            >
            </mat-progress-spinner>
            <span
              class="!cursor-pointer !text-black !text-xs !col-span-full !row-span-full !mx-auto !flex !items-center !justify-center !relative !z-50"
            >
              {{ downloadProgress()?.message }}
            </span>
          </div>
          } @else {
          <button
            [matTooltip]="'GLOBAL.BUTTON.DOWNLOAD' | translate"
            (click)="downloadPDF()"
            mat-icon-button
            color="primary"
          >
            <mat-icon> download </mat-icon>
          </button>
          }

          <!-- For internal user card only -->
          <!-- Delete PDF -->
          @if(this.fileData().isInternal){
          <mat-divider
            style="height: 35px"
            vertical="true"
            color="warn"
            class="max-md:!h-[0]"
          />

          <button
            [matTooltip]="'GLOBAL.BUTTON.DELETE' | translate"
            (click)="deletePDF()"
            mat-icon-button
            color="warn"
          >
            <mat-icon> delete_forever </mat-icon>
          </button>
          @if(attendeesFileId()){
          <button
            [matTooltip]="'MAIN.LABEL.ATTENDEES_FILE' | translate"
            (click)="viewPDF(attendeesFileId()!)"
            mat-icon-button
            color="primary"
          >
            <mat-icon> picture_as_pdf </mat-icon>
          </button>
          } }
        </div>
      </mat-card-actions>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentCardComponent {
  meetingService = inject(MeetingsService);
  activatedRoute = inject(ActivatedRoute);
  dialogService = inject(DialogsService);
  mediaService = inject(MediaService);
  messages = inject(MessagesService);
  layout = inject(LayoutService);
  matDialog = inject(MatDialog);

  deletedDocument = output<string>();
  deleteMinuteDocument = output<{ id: string; isManual: boolean }>();

  committeeId = this.activatedRoute.snapshot.queryParams['committeeId'];

  fileData = input.required<{
    id: string;
    url: string;
    title: string;
    creationTime: string;
    isInternal?: boolean;
  }>();
  fromMinutes = input<boolean>();
  isManual = input<boolean>();
  attendeesFileId = input<string | null>();

  permissions = input<{
    canPreview: boolean;
    canDelete: boolean;
  }>({ canDelete: false, canPreview: false });

  downloadProgress = signal<{ status: ProgressStatus; message: any } | null>(
    null
  );

  // #region Methods
  downloadPDF() {
    if (this.permissions()?.canPreview) {
      this.mediaService.downloadFile(this.fileData().url).subscribe({
        next: (progress) => {
          this.downloadProgress.set(progress);
          if (progress.status === 'done') {
            this.mediaService.handleDownloadDocuments(
              progress,
              this.fileData()
            );

            this.messages.show(
              'success',
              'GLOBAL.MESSAGE.DOWNLOADED_SUCCESSFULLY',
              2
            );
          }
        },
        error: (error) => {
          this.messages.show('error', error.message);
        },
      });
    } else {
      this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
    }
  }

  viewPDF(id = '') {
    if (this.permissions()?.canPreview) {
      this.matDialog.open(PdfViewerComponent, {
        data: {
          url: id ? id : this.fileData().url,
        },
        width: '100%',
        maxWidth: '800px',
      });
    } else {
      this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
    }
  }

  deletePDF() {
    if (this.permissions()?.canDelete) {
      this.dialogService
        .open({
          type: 'delete',
          title: 'MAIN.TITLE.DELETE_DOCUMENT',
          message: 'MAIN.MESSAGE.DELETE_DOCUMENT_MESSAGE',
          closeButtonTitle: 'GLOBAL.BUTTON.NO',
          confirmButtonTitle: 'GLOBAL.BUTTON.YES',
          value: '',
        })
        .subscribe((res) => {
          if (res) {
            if (this.fromMinutes()) {
              this.deleteMinuteDocument.emit({
                id: this.fileData().id,
                isManual: this.isManual()!,
              });
              return;
            }
            this.deletedDocument.emit(this.fileData().id);
          }
        });
    } else {
      this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
    }
  }
}
