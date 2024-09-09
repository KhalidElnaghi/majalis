import { CommonModule } from '@angular/common';
import {
  contentChildren,
  viewChild,
  Component,
  computed,
  effect,
  input,
  inject,
  output,
} from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { SelectionModel } from '@angular/cdk/collections';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import {
  MatTableDataSource,
  MatHeaderRowDef,
  MatTableModule,
  MatColumnDef,
  MatRowDef,
  MatTable,
} from '@angular/material/table';

import { TranslateModule } from '@ngx-translate/core';

import { LayoutService } from '../../../../core/services/layout.service';

@Component({
  selector: 'data-table',
  standalone: true,
  styleUrl: './data-table.scss',
  templateUrl: './data-table.component.html',
  imports: [
    TranslateModule,
    CommonModule,

    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatMenuModule,
    MatSortModule,
    MatIconModule,
  ],
})
export class DataTableComponent<Data> {
  protected layout = inject(LayoutService);

  data = input.required<MatTableDataSource<any>>();
  columns = input.required<ColumnDefinition[]>();

  withSelection = input(false);
  withSearch = input(true);

  customHeaders = contentChildren<MatHeaderRowDef>(MatHeaderRowDef);
  customColumns = contentChildren<MatColumnDef>(MatColumnDef);
  customRow = contentChildren<MatRowDef<any>>(MatRowDef);

  table = viewChild.required<MatTable<any>>(MatTable);

  selectionEvent = output<any>();
  searchEvent = output<string>();

  dataSource = computed(() => this.data());

  preSelected = input<{ key: string; collection: (number | string)[] }>();
  selection = new SelectionModel<Data>(true, []);

  emptyRowLength!: number;
  tableColumns!: string[];

  constructor() {
    effect(() => {
      this.emptyRowLength = this.withSelection()
        ? this.columns().length + 1
        : this.columns().length;
    });

    effect(() => {
      if (this.customColumns())
        this.customColumns().forEach((columnDef) => {
          this.table()?.addColumnDef(columnDef);
        });

      if (this.customRow()) {
        this.customRow().forEach((rowDef) => this.table()?.addRowDef(rowDef));
      }

      if (this.customHeaders()) {
        this.customHeaders().forEach((headerRowDef) =>
          this.table()?.addHeaderRowDef(headerRowDef)
        );
      }
    });

    effect(() => {
      this.tableColumns = this.columns().map((col) => col.key);
      if (this.withSelection()) this.tableColumns.unshift('select');
    });

    // NOTE: Setting preSelected elements in table internal selection model
    effect(() => {
      const preSelectedIDs = this.preSelected()?.collection;

      const preSelectedEntities = this.dataSource().data.filter((line) =>
        preSelectedIDs?.includes(line[this.preSelected()!.key])
      );

      this.selection.select(...preSelectedEntities);
      // this.selectionEvent.emit(this.selection.selected);
    });
  }

  // 1- Selection
  get isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource().data.length;
    return numSelected === numRows;
  }

  protected onSelectionChange(row: any, event: MatCheckboxChange) {
    this.selectionEvent.emit({
      entity: row,
      checked: event.checked,
    });
  }

  protected toggleAllRows() {
    if (this.isAllSelected) {
      this.selection.clear();
      this.selectionEvent.emit({
        entity: this.dataSource().data as Data[],
        checked: this.isAllSelected,
      });
      return;
    }
    this.selection.select(...(this.dataSource().data as Data[]));
    this.selectionEvent.emit({
      entity: this.selection.selected,
      checked: this.isAllSelected,
    });
  }

  // 2- Search & filter
  onSearch(event: KeyboardEvent) {
    const value = (event.target as HTMLInputElement).value;
    this.searchEvent.emit(value);
  }

  protected onFilterChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
    if (this.dataSource().paginator) {
      this.dataSource()?.paginator?.firstPage();
    }
  }
}

export interface ColumnDefinition {
  custom?: boolean;
  name?: string;
  key: string;
}
