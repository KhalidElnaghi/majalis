import { HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, map, throwError } from 'rxjs';

import { MessagesService } from '../../shared/components/ui/snackbars/messages.service';
import { AuthenticationService } from './authentication.service';
import { HttpService } from './http.service';

import { slugify } from '../../modules/main-user/features/meeting/components/meeting-info-step/meeting-info-step.config';
import { MAIN_STORAGE_API } from './../../modules/main-user/main.api';
import { environment } from '../../../environments/environment';
import { EXTERNAL_API } from '../../modules/external-user/external.api';

type Documents = {
  id?: string;
  url: string;
  title: string;
  type?: string;
  creationTime?: string;
};
@Injectable({
  providedIn: 'root',
})
export class MediaService {
  auth = inject(AuthenticationService);
  messages = inject(MessagesService);
  HTTP = inject(HttpService);

  uploadFile(file: File) {
    const reqBody: FormData = new FormData();
    reqBody.append(slugify(file.name), file, slugify(file.name));

    return this.HTTP.sendFiles(
      MAIN_STORAGE_API.STORAGE_ATTACHMENTS,
      reqBody
    ).pipe(
      catchError((error) => {
        this.messages.show('error', error.message);
        return throwError(() => error);
      }),
      map((event) =>
        this.getUploadEventMessage(event, slugify(file.name), file.type)
      )
    );
  }
  downloadFile(
    attachmentId: string,
    isDraft = false,
    isTenantLogo = false,
    token: string = ''
  ) {
    return this.HTTP.getFiles(
      MAIN_STORAGE_API.STORAGE_FILE_DOWNLOAD(
        attachmentId,
        isDraft,
        isTenantLogo,
        token ? token : this.auth.accessToken
      )
    ).pipe(
      catchError((error) => {
        this.messages.show('error', error.message);
        return throwError(() => error);
      }),
      map((event) => this.getEventMessage(event))
    );
  }

  getUploadEventMessage(event: any, fileName = '', fileType = ''): any {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        const percentDone = Math.round(
          (100 * event.loaded) / (event.total ?? 1)
        );
        return { status: 'progress', fileName, fileType, message: percentDone };

      case HttpEventType.Response:
        return { status: 'done', fileName, fileType, message: event.body };

      default:
        return { status: 'unknown', message: `Unhandled event: ${event.type}` };
    }
  }

  getEventMessage(event: any): any {
    switch (event.type) {
      case HttpEventType.DownloadProgress:
        const percentDone = Math.round(
          (100 * event.loaded) / (event.total ?? 1)
        );
        return { status: 'progress', message: percentDone };

      case HttpEventType.Response:
        return { status: 'done', message: event.body };

      default:
        return { status: 'unknown', message: `Unhandled event: ${event.type}` };
    }
  }

  handleDownloadBlob(
    progress: { status: ProgressStatus; message: any } | null,
    fileData: Attachments
  ) {
    if (!progress) return;
    const { name, type } = fileData;

    const url = URL.createObjectURL(progress.message);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;

    a.download = `${name}.${type.split('/')[1]}`;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  handleDownloadDocuments(
    progress: { status: ProgressStatus; message: any } | null,
    fileData: Documents
  ) {
    if (!progress) return;
    const { title, type } = fileData;

    const url = URL.createObjectURL(progress.message);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;

    a.download = `${title}.pdf`;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  getStreamURL(id: string) {
    return new URL(
      environment.baseUrl +
        MAIN_STORAGE_API.STORAGE_FILE_STREAM(id, this.auth.accessToken)
    );
  }

  getExternalToken(secret: string) {
    return this.HTTP.getData<Record<'token', string>>(
      EXTERNAL_API.GET_EXTERNAL_TOKEN(secret)
    );
  }
}

export enum ProgressStatus {
  progress = 'progress',
  done = 'done',
  unknown = 'unknown',
}

export type uploadAttachmentServerResponse = {
  id: string;
  tenantId: null;
  content: null;
  name: string;
  contentType: string;
  extension: string;
  filePath: string;
  isEncrypted: boolean;
};

export type UploadOnProgress = {
  status: 'progress' | 'done';
  fileName: string;
  fileType: string;
  message: number | uploadAttachmentServerResponse | string;
};

export type Attachments = {
  url: string;
  name: string;
  type: string;
};
