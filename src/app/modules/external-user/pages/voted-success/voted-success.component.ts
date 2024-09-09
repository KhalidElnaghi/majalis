import { Component } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule, MatIcon } from '@angular/material/icon';

@Component({
  selector: 'vote-success',
  standalone: true,
  imports: [TranslateModule, MatIconModule, MatIcon],
  template: `
    <div class="flex flex-col justify-center items-center  h-[60svh] gap-3">
      <div>
        <mat-icon class="text-green-700 text-3xl !w-[30px] !h-[30px]"
          >check_circle</mat-icon
        >
      </div>
      <div>
        {{ 'EXTERNAL.LABEL.VOTED_SEND_SUCCESSFULLY' | translate }}
      </div>
    </div>
  `,
})
export default class ExternalUserComponent {}
