import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ElementRef,
  inject,
  input,
  signal,
  ViewContainerRef,
} from '@angular/core';

import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { TranslateModule } from '@ngx-translate/core';
import {
  MediaService,
  ProgressStatus,
} from '../../../../core/services/media.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MessagesService } from '../snackbars/messages.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'attachment-chip',
  standalone: true,
  imports: [
    MatChipsModule,
    MatIcon,
    MatTooltip,
    TranslateModule,
    MatProgressSpinner,
  ],
  template: `
    <div class="flex gap-1 items-center">
      <mat-chip>
        <div class="flex items-center justify-center gap-2">
          @if(!deleteButton()) {
          <!-- Download Progress -->
          @if(downloadProgress() && downloadProgress()?.status === "progress"){
          <div class="grid place-items-center relative">
            <mat-progress-spinner
              class="!col-span-full !row-span-full"
              diameter="30"
              color="primary"
              mode="determinate"
              [value]="downloadProgress()?.message"
            >
            </mat-progress-spinner>
            <span
              class="!cursor-pointer !text-black !text-xs !col-span-full !row-span-full !mx-auto !flex !items-center !justify-center !relative !z-50"
            >
              {{ downloadProgress()?.message }}
            </span>
          </div>
          <!--  IF NO DOWNLOAD PROGRESS KEEP THE DOWNLOAD ICON -->
          } @else {
          <mat-icon
            (click)="handleClick()"
            class="cursor-pointer"
            [matTooltip]="'GLOBAL.BUTTON.DOWNLOAD' | translate"
            matTextPrefix
            color="warn"
          >
            download
          </mat-icon>
          <!-- IF NO DELETE BUTTON WAS PROVIDED  -->
          } } @else {
          <ng-content #deleteButton></ng-content>
          }

          <span class="truncate max-w-24">
            {{ fileData().name }}
          </span>

          <mat-icon disabled color="warn">
            {{
              fileData().type.split('/')[1] == 'pdf'
                ? 'picture_as_pdf'
                : 'image'
            }}
          </mat-icon>
        </div>
      </mat-chip>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentChipComponent {
  activatedRoute = inject(ActivatedRoute);
  mediaService = inject(MediaService);
  messageService = inject(MessagesService);
  downloadProgress = signal<{ status: ProgressStatus; message: any } | null>(
    null
  );
  // URL is the ATTACHMENT-ID
  fileData = input.required<{ url: string; name: string; type: string }>();
  deleteButton = contentChild('deleteButton', { read: ElementRef });

  handleClick() {
    const secret = this.activatedRoute.snapshot.queryParams['secret'];

    const downloadMethod = secret
      ? this.downloadFileWithSecret(secret)
      : this.normalFileDownload();

    downloadMethod.subscribe({
      next: (progress) => {
        this.downloadProgress.set(progress);
        if (progress.status === 'done') {
          this.mediaService.handleDownloadBlob(progress, this.fileData());

          this.messageService.show(
            'success',
            'GLOBAL.MESSAGE.DOWNLOADED_SUCCESSFULLY',
            2
          );
        }
      },
      error: (error) => {
        this.messageService.show('error', error.message);
      },
    });
  }

  getToken(secret: string) {
    return this.mediaService.getExternalToken(encodeURIComponent(secret));
  }
  getTheFile(token: string = '') {
    return this.mediaService.downloadFile(
      this.fileData().url,
      false,
      false,
      token
    );
  }

  downloadFileWithSecret(secret: string) {
    return this.mediaService
      .getExternalToken(encodeURIComponent(secret))
      .pipe(switchMap(({ token }) => this.getTheFile(token)));
  }
  normalFileDownload() {
    return this.mediaService.downloadFile(this.fileData().url);
  }
}
