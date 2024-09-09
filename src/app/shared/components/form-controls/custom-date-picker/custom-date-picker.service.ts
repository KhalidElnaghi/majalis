import { Injectable, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import * as _moment from 'moment-hijri';

// @ts-ignore:no-duplicate-imports
import { default as _rollupMoment, isMoment, Moment } from 'moment-hijri';
import { LocaleCodes } from './custom-date-picker-entities';
const MatHijri = _rollupMoment || (_moment as any);

@Injectable({
  providedIn: 'root',
})
export class CustomDateAdapterService {
  datePipe = inject(DatePipe);

  private toHijri(date: string) {
    return MatHijri(date, 'YYYY-MM-DD').format('iDD iMMMM ,iYYYY');
  }

  formatDate(date: Date) {
    return this.datePipe.transform(date, 'YYYY-MM-dd');
  }

  convertDateToDisplay(locale: LocaleCodes, value: Date & Moment) {
    if (locale == LocaleCodes.AR_SA) {
      return this.formatDate(value);
    } else {
      const gregDate = this.formatDate(value)!;
      return this.toHijri(gregDate);
    }
  }

  convertDate(dateValue: string | Date | Moment) {
    const dateFormat = 'YYYY-MM-dd';
    return this.datePipe.transform(
      isMoment(dateValue) ? dateValue.toDate() : dateValue,
      dateFormat
    );
  }

  onlyFuture = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d! >= today;
  };

  onlyPast = (d: Date | null): boolean => {
    return d! < new Date();
  };
}
