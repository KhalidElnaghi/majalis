import { Component, effect, inject, viewChild } from '@angular/core';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatSort } from '@angular/material/sort';
import {
  MatDialogActions,
  MatDialogContent,
  MAT_DIALOG_DATA,
  MatDialogClose,
} from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';

import {
  DataTableComponent,
  ColumnDefinition,
} from '../../../../../../shared/components/ui/data-table/data-table.component';

import { LayoutService } from '../../../../../../core/services/layout.service';
import { LANG } from '../../../../../../core/services/translation.service';
import { Member } from '../../../../main.types';

@Component({
  selector: 'committee-member-preview',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogClose,
    MatDialogActions,
    MatIcon,
    TranslateModule,
    DataTableComponent,
    MatTableModule,
    MatSort,
    MatIconButton,

    MatDivider,
  ],
  template: `
    <div
      class="!text-primary flex items-center justify-between mx-4 py-4"
      mat-dialog-title
    >
      <h1 class="text-xl">{{ 'MAIN.LABEL.COMMITTE_MEMBERS' | translate }}</h1>

      <button color="warn" mat-icon-button mat-dialog-close>
        <mat-icon mat-dialog-close>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="!p-2">
      <div
        class="flex justify-evenly max-sm:flex-col max-sm:items-start max-sm:gap-1 items-center w-1/2"
      >
        <h3 class="font-semibold w-fit text-base px-2">
          {{ 'MAIN.LABEL.COMMITTE_NAME' | translate }}
        </h3>

        <div class="!text-black flex-grow px-5">
          {{ data.name }}
        </div>
      </div>

      <mat-divider class="!my-4" />

      <h3 class="font-semibold mb-2 text-base px-2">
        {{ 'MAIN.LABEL.COMMITTE_MEMBERS' | translate }}
      </h3>

      <data-table
        [withSelection]="false"
        [withSearch]="false"
        [columns]="columns"
        [data]="items"
        matSort
      >
        <ng-container matColumnDef="rule">
          <th mat-header-cell mat-sort-header *matHeaderCellDef>
            {{ 'MAIN.LABEL.RULE' | translate }}
          </th>

          <td mat-cell *matCellDef="let row">
            {{
              layout.language() === lang.EN ? row.ruleNameEn : row.ruleNameAr
            }}
          </td>
        </ng-container>
      </data-table>
    </mat-dialog-content>
  `,
})
export class CommitteeMemberPreviewComponent {
  data = inject(MAT_DIALOG_DATA);
  layout = inject(LayoutService);

  lang = LANG;

  ngAfterViewInit() {
    this.items.data = [
      ...this.data.internalMembers,
      ...this.data.externalMembers,
    ];
  }
  items = new MatTableDataSource<Member>();

  sort = viewChild.required(MatSort);

  setSort = effect(() => {
    this.items.sort = this.sort();
  });

  columns: ColumnDefinition[] = [
    { key: 'username', name: 'MAIN.LABEL.USERNAME' },
    { key: 'name', name: 'MAIN.LABEL.NAME' },
    { key: 'rule', custom: true },
  ];
}
