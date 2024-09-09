import { MatDateFormats } from '@angular/material/core';

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'YYYY-MM-dd',
  },
  display: {
    dateInput: 'iDD iMMMM ,iYYYY',
    monthYearLabel: 'iMMMM iYYYY',
    dateA11yLabel: 'iDD iMMMM, iYYYY',
    monthYearA11yLabel: 'iMMMM iYYYY',
    monthLabel: 'iDD iMMMM',
  },
};

export enum LocaleCodes {
  AR_SA = 'ar-sa',
  EN_US = 'en-US',
}

export interface HijriCalendarData {
  firstDayOfWeek: number;
  longMonths: string[];
  shortMonths: string[];
  dates: string[];
  longDaysOfWeek: string[];
  shortDaysOfWeek: string[];
  narrowDaysOfWeek: string[];
}

export const arabicNames = {
  iMonths: [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الثاني',
    'جمادى الأولى',
    'جمادى الآخرة',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة',
  ],
  iDaysMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  iWeek: [
    'الأحد',
    'الإثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
  ],
  iDays: [
    '١',
    '٢',
    '٣',
    '٤',
    '٥',
    '٦',
    '٧',
    '٨',
    '٩',
    '١٠',
    '١١',
    '١٢',
    '١٣',
    '١٤',
    '١٥',
    '١٦',
    '١٧',
    '١٨',
    '١٩',
    '٢٠',
    '٢١',
    '٢٢',
    '٢٣',
    '٢٤',
    '٢٥',
    '٢٦',
    '٢٧',
    '٢٨',
    '٢٩',
    '٣٠',
  ],
};
