import { Injectable, inject } from '@angular/core';

import { MatPaginatorIntl } from '@angular/material/paginator';

import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  private translate = inject(TranslateService);
  constructor() {
    super();
    this.translatePaginator();
    this.translate.onLangChange.subscribe(() => this.translatePaginator());
  }

  private translatePaginator(): void {
    this.translate.get('GLOBAL.PAGINATOR').subscribe((translations: any) => {
      this.previousPageLabel = translations.previousPageLabel;
      this.itemsPerPageLabel = translations.itemsPerPageLabel;
      this.firstPageLabel = translations.firstPageLabel;
      this.nextPageLabel = translations.nextPageLabel;
      this.lastPageLabel = translations.lastPageLabel;
      this.getRangeLabel = translations.getRangeLabel;

      if (typeof translations.getRangeLabel === 'string') {
        this.getRangeLabel = this.getRangeLabelFunction(
          translations.getRangeLabel
        );
      } else {
        this.getRangeLabel = this.defaultGetRangeLabel;
      }
      this.changes.next();
    });
  }

  private getRangeLabelFunction(
    template: string
  ): (page: number, pageSize: number, length: number) => string {
    return (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = Math.min((page + 1) * pageSize, length);
      return template
        .replace('{{start}}', start.toString())
        .replace('{{end}}', end.toString())
        .replace('{{total}}', length.toString());
    };
  }

  private defaultGetRangeLabel(
    page: number,
    pageSize: number,
    length: number
  ): string {
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, length);
    return `${start} - ${end} of ${length}`;
  }
}
