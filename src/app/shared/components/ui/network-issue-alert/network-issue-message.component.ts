import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'network-issue-message',
  standalone: true,
  imports: [MatProgressBar, MatIcon, TranslateModule],
  template: `
    <div class="bg-white p-0">
      <mat-progress-bar mode="indeterminate" color="warn" />

      <div class="p-5 min-h-7 bg-white/90">
        <h3 class="flex gap-3 align-middle text-danger_sh1 mb-3">
          <mat-icon>report_problem</mat-icon>
          <span>{{ 'Network Connection Failed' | translate }}</span>
        </h3>

        <span class="text-primary text-sm">
          {{ 'Kindly check your network connection to continue' | translate }}
        </span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkIssueMessageComponent {}
