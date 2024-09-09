import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatCard } from '@angular/material/card';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'empty-entity-line',
  standalone: true,
  imports: [MatCard, TranslateModule],
  template: `
    <mat-card
      class="text-center !bg-light w-full h-14 mt-4 flex justify-center"
    >
      <span>
        {{ 'GLOBAL.MESSAGE.NO_DATA_TO_DISPLAY' | translate }}
      </span>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyEntityLineComponent {}
