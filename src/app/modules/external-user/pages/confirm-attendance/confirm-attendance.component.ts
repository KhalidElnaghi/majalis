import { Component } from '@angular/core';

import { MatIcon } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'confirm-attendance',
  standalone: true,
  imports: [TranslateModule, MatIcon],
  template: `
    <div class="flex flex-col justify-center items-center  h-[60svh] gap-3">
      <div>
        <mat-icon class="text-green-700 text-3xl !w-[30px] !h-[30px]"
          >check_circle-outlined</mat-icon
        >
      </div>
      <div>
        {{ 'EXTERNAL.LABEL.ATTENDANCE_CONFIRMED_SUCCESSFULLY' | translate }}
      </div>
    </div>
  `,
})
export default class ExternalUserComponent {}
