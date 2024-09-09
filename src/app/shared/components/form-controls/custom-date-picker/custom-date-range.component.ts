import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';
import {
  MatFormFieldAppearance,
  MatFormFieldModule,
} from '@angular/material/form-field';

import { LayoutService } from '../../../../core/services/layout.service';
import { CustomDateAdapterService } from './custom-date-picker.service';

@Component({
  selector: 'custom-date-range',
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  imports: [
    ReactiveFormsModule,

    MatDatepickerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,

    TranslateModule,
  ],
  template: `
    <mat-form-field [appearance]="apprearance()" class="w-full">
      <mat-label>{{ label() | translate }}</mat-label>

      <mat-date-range-input [rangePicker]="picker">
        <input
          [formControlName]="startControlName()"
          [placeholder]="startPlaceholder()"
          matStartDate
          readonly
        />
        <input
          [formControlName]="endControlName()"
          [placeholder]="endPlaceholder()"
          matEndDate
          readonly
        />
      </mat-date-range-input>

      <mat-datepicker-toggle
        matIconSuffix
        [for]="picker"
      ></mat-datepicker-toggle>

      <mat-date-range-picker
        [touchUi]="layout.onMobile()"
        color="accent"
        #picker
      >
        <mat-datepicker-actions>
          <button mat-button matDatepickerCancel>
            {{ 'CANCEL' | translate }}
          </button>
          <button mat-raised-button color="primary" matDatepickerApply>
            {{ 'APPLY' | translate }}
          </button>
        </mat-datepicker-actions>
      </mat-date-range-picker>
    </mat-form-field>
  `,
})
export class CustomDateRangeComponent {
  apprearance = input.required<MatFormFieldAppearance>();
  startControlName = input.required<string>();
  startPlaceholder = input.required<string>();
  endControlName = input.required<string>();
  endPlaceholder = input.required<string>();
  label = input.required<string>();

  dateAdapterService = inject(CustomDateAdapterService);
  currentLang = inject(LayoutService).language;
  dateAdapter = inject(DateAdapter<any>);
  layout = inject(LayoutService);

  constructor() {
    effect(() => {
      if (this.currentLang() == 'ar') {
        this.dateAdapter.setLocale('ar-EG');
      } else {
        this.dateAdapter.setLocale('en-US');
      }
    });
  }
}
