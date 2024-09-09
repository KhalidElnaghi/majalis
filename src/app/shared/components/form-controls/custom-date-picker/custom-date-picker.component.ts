import { Component, computed, inject, input, signal } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import {
  MatFormFieldAppearance,
  MatFormFieldModule,
} from '@angular/material/form-field';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
  MatDatepicker,
} from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  DateAdapter,
} from '@angular/material/core';

import { TranslateModule } from '@ngx-translate/core';

import { CustomMaterialDateAdapter } from './custom-material-date-adapter.service';
import { CustomDateAdapterService } from './custom-date-picker.service';
import {
  CUSTOM_DATE_FORMATS,
  LocaleCodes,
} from './custom-date-picker-entities';

import { LayoutService } from '../../../../core/services/layout.service';

@Component({
  selector: 'custom-date-picker',
  standalone: true,
  providers: [
    CustomDateAdapterService,
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: LocaleCodes.EN_US },
    {
      provide: DateAdapter,
      useClass: CustomMaterialDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  imports: [
    ReactiveFormsModule,

    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatButtonModule,
    MatInputModule,
    MatIcon,

    TranslateModule,
  ],
  template: `
    <div class="flex items-center">
      <mat-form-field [appearance]="apprearance()" class="w-full">
        <input
          [matDatepickerFilter]="
            timePeriod() == 'future'
              ? dateAdapterService.onlyFuture
              : dateAdapterService.onlyPast
          "
          (dateChange)="convertDate($event)"
          [formControlName]="controlName()"
          [matDatepicker]="picker"
          matInput
        />

        @if (!withHijri()) {

        <mat-datepicker-toggle matIconSuffix [for]="picker" />

        } @else {

        <div class="flex items-center">
          <button
            [matTooltip]="'MAIN.LABEL.HIJRI' | translate"
            matTooltipPosition="above"
            (click)="openCalendar(picker, CODE.AR_SA)"
            matIconSuffix
            mat-icon-button
            color="primary"
            type="button"
          >
            <mat-icon fontSet="material-icons-outlined">brightness_4</mat-icon>
          </button>

          <button
            [matTooltip]="'MAIN.LABEL.GREGORIAN' | translate"
            matTooltipPosition="above"
            (click)="openCalendar(picker, CODE.EN_US)"
            matIconSuffix
            mat-icon-button
            color="primary"
            type="button"
          >
            <mat-icon>calendar_today</mat-icon>
          </button>
        </div>
        }

        <mat-datepicker
          [dir]="calendarDirection()"
          [touchUi]="layout.onMobile()"
          color="primary"
          #picker
        >
          @if(withHijri()){
          <mat-datepicker-actions
            [dir]="layout.language() === 'ar' ? 'rtl' : 'ltr'"
          >
            <div class="flex flex-col items-center justify-center mx-auto">
              <span
                class="m-2 p-1 rounded-md bg-primary/50 hover:bg-primary/70"
              >
                {{ 'MAIN.LABEL.EQUIVALENT' | translate }}
                {{ convertedDate() }}
              </span>

              <div>
                <button mat-button matDatepickerCancel>
                  {{ 'GLOBAL.BUTTON.CANCEL' | translate }}
                </button>

                <button mat-raised-button color="primary" matDatepickerApply>
                  {{ 'GLOBAL.BUTTON.CONFIRM' | translate }}
                </button>
              </div>
            </div>
          </mat-datepicker-actions>
          }
        </mat-datepicker>

        @if(currentControl?.errors?.['required']) {
        <mat-error>{{ 'MAIN.ERROR.FIELD_REQUIRED' | translate }}</mat-error>
        }

        <!-- Invalid date selected -->
        @if(currentControl?.errors?.['invalidDate']) {
        <mat-error>
          {{ 'MAIN.ERROR.INVALID_SELECTED_DATE' | translate }}
        </mat-error>
        }
      </mat-form-field>
    </div>
  `,
})
export class CustomDatePickerComponent {
  dateAdapterService = inject(CustomDateAdapterService);
  currentLang = inject(LayoutService).language;
  parentControl = inject(ControlContainer);
  dateAdapter = inject(DateAdapter<any>);
  layout = inject(LayoutService);

  apprearance = input.required<MatFormFieldAppearance>();
  timePeriod = input.required<'future' | 'past'>();
  controlName = input.required<string>();
  withHijri = input<boolean>(true);

  locale = signal<LocaleCodes>(LocaleCodes.EN_US);
  convertedDate = signal<string>('');
  CODE = LocaleCodes;

  calendarDirection = computed(() =>
    this.locale() === this.CODE.AR_SA ? 'rtl' : 'ltr'
  );

  get currentControl() {
    return this.parentControl?.control?.get(this.controlName());
  }

  protected convertDate(input: MatDatepickerInputEvent<any>) {
    this.convertedDate.set(
      this.dateAdapterService.convertDateToDisplay(
        this.locale(),
        input.target.value
      )!
    );
  }

  protected openCalendar(pickerRef: MatDatepicker<any>, locale: LocaleCodes) {
    if (locale !== this.locale()) this.convertedDate.set('');
    this.dateAdapter.setLocale(locale);
    this.locale.set(locale);

    // NOTE: To fix the delay of changing calendar layout direction, depending on locale change as first time.
    setTimeout(() => {
      pickerRef.open();
    });
  }
}
