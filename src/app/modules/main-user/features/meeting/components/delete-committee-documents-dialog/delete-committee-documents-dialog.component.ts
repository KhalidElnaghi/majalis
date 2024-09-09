import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';

import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { MeetingsService } from '../../meetings.service';

@Component({
  selector: 'delete-committee-documents-dialog',
  standalone: true,
  imports: [
    TranslateModule,

    MatProgressBar,
    MatButtonToggleModule,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
    MatDialogTitle,
  ],
  template: `
    @if(loading()) {
    <mat-progress-bar mode="indeterminate" />
    }
    <div
      class="!text-primary flex items-center justify-start mx-4 py-4"
      mat-dialog-title
    >
      <h1 class="text-xl text-red-800">
        {{ dialogData.title | translate }}
      </h1>
    </div>

    <mat-dialog-content>
      <p class="text-black">{{ dialogData.content | translate }}</p>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button
        mat-flat-button
        color="warn"
        class="mx-2"
        (click)="deleteDocument()"
      >
        {{ 'GLOBAL.BUTTON.DELETE' | translate }}
      </button>

      <button mat-flat-button mat-dialog-close class="!text-black">
        {{ 'GLOBAL.BUTTON.CANCEL' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteCommitteeDocumentsDialogComponent {
  dialog = inject(MatDialogRef<unknown>);
  dialogData = inject(MAT_DIALOG_DATA);
  meetingService = inject(MeetingsService);
  messages = inject(MessagesService);

  loading = signal(false);

  deleteDocument() {
    this.meetingService
      .deleteCommitteeDocument(
        this.dialogData.committeeId,
        this.dialogData.fileId
      )
      .subscribe({
        next: () => {
          this.loading.set(true);
          this.messages.show(
            'success',
            'MAIN.MESSAGE.DOCUMENT_DELETED_SUCCESSFULLY'
          );
          this.dialog.close('success');
        },
        error: (err) => {
          this.loading.set(false);
          this.messages.show('error', err.message);
        },
      });
  }
}
