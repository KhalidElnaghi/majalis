import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'status-chip',
  standalone: true,
  imports: [NgClass, TranslateModule, MatChip],
  template: `<mat-chip
    [ngClass]="{
      '!bg-status-danger': status() == 'Closed',
      '!bg-status-warning': status() == 'Draft',
      '!bg-status-success': status() == 'Planned',
      '!bg-status-primary': status() == 'InProgress',
      '!bg-status-light_danger': status() == 'Finished',
    }"
    class="statusChip"
    >{{ 'MAIN.LABEL.' + status().toUpperCase() | translate }}</mat-chip
  > `,
})
export class StatusChipComponent {
  status = input.required<string>();
}
