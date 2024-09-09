import {
  ElementRef,
  Component,
  viewChild,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

type Document = {
  id: string;
  url: string;
  title: string;
  type: string;
  creationTime: string;
};

const acceptableAttachments = ['pdf'];

@Component({
  selector: 'committee-documents',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatProgressBar,
    MatTooltip,
    MatIcon,
    AttachmentCardComponent,
    EmptyEntityLineComponent,
  ],
  templateUrl: `./committee-documents.component.html`,
})
export class CommitteeDocumentsComponent {
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

  fileUploadStream$!: Subscription;
  documents = signal<Document[]>([]);
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
    this.getCommitteeDocuments();
  }

  onFileSelected(event: Event) {
    if (
      this.permissionsService.can(
        this.ACTION.upload,
        this.RESOURCE.committeeDocument,
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
        next: (res) => {
          this.resetUploadProcess();
          this.documents.set(res);
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

        const { id, name, contentType } =
          val.message as uploadAttachmentServerResponse;
        this.document = {
          url: id,
          title: name.replace('pdf', ''),
          type: contentType,
        };

        return this.meetingService.uploadCommitteeDocuments(
          this.committeeId,
          this.document
        );
      }),
      concatMap(() => {
        this.layout.isLoading.set(false);
        return this.meetingService.getCommitteeDocuments(this.committeeId).pipe(
          catchError((error) => {
            this.messages.show('error', error.message);
            this.layout.isLoading.set(false);
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

  getCommitteeDocuments() {
    if (
      this.permissionsService.can(
        this.ACTION.list,
        this.RESOURCE.committeeDocument,
        true
      )
    ) {
      this.layout.isLoading.set(true);
      this.meetingService
        .getCommitteeDocuments(this.committeeId)
        .pipe(
          catchError((error) => {
            this.messages.show('error', error.message);
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (res) => {
            this.documents.set(res);
            this.layout.isLoading.set(false);
          },
        });
    } else {
      this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
    }
  }

  handleDeleteDocument(url: string) {
    if (
      this.permissionsService.can(
        this.ACTION.delete,
        this.RESOURCE.committeeDocument,
        true
      )
    ) {
      this.layout.isLoading.set(true);
      this.meetingService
        .deleteCommitteeDocument(this.committeeId, url)
        .subscribe({
          next: () => {
            this.getCommitteeDocuments();
            this.layout.isLoading.set(false);
            this.messages.show(
              'success',
              'MAIN.MESSAGE.DOCUMENT_DELETED_SUCCESSFULLY'
            );
          },
          error: (err) => {
            this.layout.isLoading.set(false);
            this.messages.show('error', err.message);
          },
        });
    } else {
      this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
    }
  }
}
