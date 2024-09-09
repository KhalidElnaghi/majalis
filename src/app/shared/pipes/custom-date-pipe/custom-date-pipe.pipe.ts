import { inject, Pipe, PipeTransform } from '@angular/core';
import { formatDate, registerLocaleData } from '@angular/common';

import localeAr from '@angular/common/locales/ar';
import localeEn from '@angular/common/locales/en';

import { LayoutService } from './../../../core/services/layout.service';

registerLocaleData(localeAr);
registerLocaleData(localeEn);

@Pipe({
  name: 'customDatePipe',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  layoutService = inject(LayoutService);
  transform(
    value: any,
    format: string = 'mediumDate',
    locale: string = this.layoutService.language()
  ): string | null {
    return formatDate(value, format, locale);
  }
}
