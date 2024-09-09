import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Inject, Injectable, Optional } from '@angular/core';

import {
  HijriCalendarData,
  LocaleCodes,
  arabicNames,
} from './custom-date-picker-entities';
import * as _moment from 'moment-hijri';

// @ts-ignore:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment-hijri';
const MatHijri = _rollupMoment || (_moment as any);

@Injectable({
  providedIn: 'root',
})
export class CustomMaterialDateAdapter extends DateAdapter<Moment | Date> {
  _hijriCalendar: HijriCalendarData = {
    firstDayOfWeek: 6,
    dates: arabicNames.iDays,
    longMonths: arabicNames.iMonths.reverse(),
    shortMonths: arabicNames.iMonths.reverse(),
    longDaysOfWeek: arabicNames.iWeek,
    shortDaysOfWeek: arabicNames.iWeek,
    narrowDaysOfWeek: arabicNames.iDaysMin,
  };

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) _locale: string) {
    super();
    this.setLocale(_locale);
  }

  override setLocale(locale: string) {
    super.setLocale(locale);
  }

  getYear(date: Date & Moment): number {
    return this.locale == LocaleCodes.AR_SA
      ? this.clone(date)?.iYear()
      : date.getFullYear();
  }

  getMonth(date: Date & Moment): number {
    return this.locale == LocaleCodes.AR_SA
      ? this.clone(date)?.iMonth()
      : date.getMonth();
  }

  getDate(date: Date & Moment): number {
    return this.locale == LocaleCodes.AR_SA
      ? this.clone(date)?.iDate()
      : date.getDate();
  }

  getDayOfWeek(date: Date & Moment): number {
    return this.locale == LocaleCodes.AR_SA
      ? this.clone(date)?.day()
      : date.getDay();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (this.locale == LocaleCodes.AR_SA) {
      return style === 'long'
        ? this._hijriCalendar?.longMonths
        : this._hijriCalendar?.shortMonths;
    } else {
      const dtf = new Intl.DateTimeFormat(this.locale, {
        month: style,
        timeZone: 'utc',
      });
      return range(12, (i) => _formatGreg(dtf, new Date(2023, i, 1)));
    }
  }

  getDateNames(): string[] {
    if (this.locale == LocaleCodes.AR_SA) {
      return this._hijriCalendar?.dates;
    } else {
      const dtf = new Intl.DateTimeFormat(this.locale, {
        day: 'numeric',
        timeZone: 'utc',
      });
      return range(31, (i) => _formatGreg(dtf, new Date(2023, 0, i + 1)));
    }
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (this.locale == LocaleCodes.AR_SA) {
      switch (style) {
        case 'long':
          return this._hijriCalendar?.longDaysOfWeek;
        case 'short':
          return this._hijriCalendar?.shortDaysOfWeek;
        case 'narrow':
          return this._hijriCalendar?.narrowDaysOfWeek;
      }
    } else {
      const dtf = new Intl.DateTimeFormat(this.locale, {
        weekday: style,
        timeZone: 'utc',
      });
      return range(7, (i) => _formatGreg(dtf, new Date(2023, 0, i + 1)));
    }
  }

  getYearName(date: Date & Moment): string {
    if (this.locale == LocaleCodes.AR_SA) {
      return this.clone(date)?.format('iYYYY');
    } else {
      const dtf = new Intl.DateTimeFormat(this.locale, {
        year: 'numeric',
        timeZone: 'utc',
      });
      return _formatGreg(dtf, date);
    }
  }

  getFirstDayOfWeek(): number {
    return this.locale == LocaleCodes.AR_SA
      ? this._hijriCalendar?.firstDayOfWeek
      : 0;
  }

  getNumDaysInMonth(date: Date & Moment): number {
    if (this.locale == LocaleCodes.AR_SA) {
      return MatHijri?.iDaysInMonth(this.getYear(date), this.getMonth(date));
    } else {
      return this.getDate(
        _createDateWithOverflow(
          this.getYear(date),
          this.getMonth(date) + 1,
          0
        ) as any
      );
    }
  }

  addCalendarYears(date: any, years: number): Date | Moment {
    return this.locale == LocaleCodes.AR_SA
      ? this.clone(date)?.add(years, 'iYear')
      : this.addCalendarMonths(date, years * 12);
  }

  addCalendarMonths(date: any, months: number): Date | Moment {
    if (this.locale == LocaleCodes.AR_SA) {
      return this.clone(date)?.add(months, 'iMonth');
    } else {
      let newDate = _createDateWithOverflow(
        this.getYear(date),
        this.getMonth(date) + months,
        this.getDate(date)
      );
      return newDate;
    }
  }

  addCalendarDays(date: any, days: number): Date | Moment {
    return this.locale == LocaleCodes.AR_SA
      ? this.clone(date)?.add(days, 'days')
      : _createDateWithOverflow(
          this.getYear(date),
          this.getMonth(date),
          this.getDate(date) + days
        );
  }

  clone(date: Date & Moment): any {
    return this.locale == LocaleCodes.AR_SA
      ? date?.clone().locale(this.locale)
      : new Date(date.getTime());
  }

  createDate(year: number, month: number, date: number): any {
    if (this.locale == LocaleCodes.AR_SA) {
      const result = this._createMoment()
        ?.iYear(year)
        .iMonth(month)
        .iDate(date)
        .hours(0)
        .minutes(0)
        .seconds(0)
        .milliseconds(0)
        .locale(this.locale);
      return result;
    } else {
      let result = _createDateWithOverflow(year, month, date);
      return result;
    }
  }

  private _createMoment(date?: any, format?: any, locale?: string): any {
    return MatHijri(date, format, locale);
  }

  today(): Date | Moment {
    return this.locale == LocaleCodes.AR_SA
      ? this._createMoment()?.locale(this.locale)
      : new Date();
  }

  parse(value: any, parseFormat?: any): Date | Moment | null {
    if (this.locale == LocaleCodes.AR_SA) {
      if (value && typeof value === 'string') {
        return this._createMoment(value, parseFormat, this.locale);
      }
      return value ? this._createMoment(value)?.locale(this.locale) : null;
    }
    if (typeof value == 'number') {
      return new Date(value);
    }
    return value ? new Date(Date.parse(value)) : null;
  }

  format(date: any, displayFormat: any): string {
    if (this.locale == LocaleCodes.AR_SA) {
      date = this.clone(date);
      return date.format(displayFormat);
    } else {
      const dtf = new Intl.DateTimeFormat(this.locale, {
        ...displayFormat,
        timeZone: 'utc',
      });
      return _formatGreg(dtf, date);
    }
  }

  toIso8601(date: any): string {
    return this.locale == LocaleCodes.AR_SA
      ? this.clone(date)?.toISOString(true)
      : [
          date.getUTCFullYear(),
          this._2digit(date.getUTCMonth() + 1),
          this._2digit(date.getUTCDate()),
        ].join('-');
  }
  private _2digit(n: number) {
    return ('00' + n).slice(-2);
  }

  override deserialize(value: any): Moment | Date | null {
    if (this.locale == LocaleCodes.AR_SA) {
      let date: any;
      if (value instanceof Date) {
        date = this._createMoment(value)?.locale(this.locale);
      } else if (this.isDateInstance(value)) {
        return this.clone(value);
      }
      if (typeof value === 'string') {
        if (!value) {
          return null;
        }
        date = this._createMoment(value)?.locale(this.locale);
      }
      if (date && this.isValid(date)) {
        return this._createMoment(date)?.locale(this.locale);
      }
    } else {
      if (typeof value === 'string') {
        if (!value) {
          return null;
        }
        if (ISO_8601_REGEX.test(value)) {
          let date = new Date(value);
          if (this.isValid(date)) {
            return date;
          }
        }
      }
    }
    return super.deserialize(value);
  }

  isValid(date: any): boolean {
    return this.locale == LocaleCodes.AR_SA
      ? this.clone(date).isValid()
      : !isNaN(date.getTime());
  }

  invalid(): Moment | Date {
    return this.locale == LocaleCodes.AR_SA
      ? MatHijri?.invalid()
      : new Date(NaN);
  }

  isDateInstance(obj: any): boolean {
    return this.locale == LocaleCodes.AR_SA
      ? MatHijri?.isMoment(obj)
      : obj instanceof Date;
  }
}

function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

function _formatGreg(dtf: Intl.DateTimeFormat, date: Date) {
  const d = new Date();
  d.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  d.setUTCHours(
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
  return dtf.format(d);
}

function _createDateWithOverflow(year: number, month: number, date: number) {
  const d = new Date();
  d.setFullYear(year, month, date);
  d.setHours(0, 0, 0, 0);
  return d;
}

const ISO_8601_REGEX =
  /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;
