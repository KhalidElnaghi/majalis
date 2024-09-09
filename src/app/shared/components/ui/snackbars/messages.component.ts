import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

import { TranslateModule } from '@ngx-translate/core';

import { MessageData } from './messages.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-fit">
          <mat-icon>{{ ICONS[data.type] }}</mat-icon>
        </span>
        <span class="text-sm font-medium">
          {{ data.message | translate }}
        </span>
      </div>

      <button mat-icon-button (click)="dismiss()">
        <mat-icon>clear</mat-icon>
      </button>
    </div>
  `,
})
export class MessagesComponent {
  data = inject(MAT_SNACK_BAR_DATA) as MessageData;

  snackBarRef = inject(MatSnackBarRef<MessagesComponent>);
  ICONS = actionStatusIcon;

  dismiss() {
    this.snackBarRef.dismiss();
  }
}

export enum actionStatusIcon {
  success = 'check_circle_outline',
  error = 'error_outline',
  confirm = 'task_alt',
  form = 'description',
  delete = 'clear',
  warn = 'warning',
  info = 'info',
}
