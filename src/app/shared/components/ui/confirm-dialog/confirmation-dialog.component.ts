import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

import { DialogConfig, actionStatusIcon } from './confirmation-dialog.service';

@Component({
  selector: 'confirmation-dialog',
  standalone: true,
  imports: [
    NgTemplateOutlet,

    MatDialogModule,
    MatButtonModule,
    MatIconModule,

    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *ngTemplateOutlet="
        data.customContent || defaultTitle;
        context: { $implicit: data }
      "
    />

    <mat-dialog-content>
      <ng-container
        *ngTemplateOutlet="
          data.customContent || defaultContent;
          context: { $implicit: data }
        "
      />
    </mat-dialog-content>

    <mat-dialog-actions>
      <ng-container
        *ngTemplateOutlet="
          data.customActions || defaultActions;
          context: { $implicit: data }
        "
      />
    </mat-dialog-actions>

    <!-- defaults section -->
    <ng-template #defaultTitle>
      <div mat-dialog-title class="!flex !items-center !gap-2">
        <mat-icon [color]="actionButtonColor[data.type]"
          >{{ ICONS[data.type] }}
        </mat-icon>

        <span>
          {{ data.title | translate }}
        </span>
      </div>
    </ng-template>

    <ng-template #defaultContent>
      {{ data.message | translate }}
    </ng-template>

    <ng-template #defaultActions>
      @if (dialogWithActionType.has(data.type) && data.confirmButtonTitle) {
      <button
        [color]="actionButtonColor[data.type]"
        [mat-dialog-close]="true"
        mat-raised-button
      >
        {{ data.confirmButtonTitle | translate }}
      </button>
      }
      <button mat-stroked-button mat-dialog-close>
        {{ data.closeButtonTitle | translate }}
      </button>
    </ng-template>
  `,
})
export class CustomDialogComponent {
  data = inject(MAT_DIALOG_DATA) as DialogConfig;

  protected dialogWithActionType = new Set([
    'confirm',
    'form',
    'delete',
    'error',
  ]);

  protected ICONS = actionStatusIcon;

  // NOTE: These colors are useless in case of all actions are the primary color
  protected actionButtonColor = {
    success: 'primary',
    confirm: 'primary',
    form: 'primary',
    delete: 'warn',
    error: 'warn',
    warn: 'warn',
  } as const;
}
