import { Component, inject, signal, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  distinctUntilChanged,
  Subscription,
  debounceTime,
  switchMap,
  Subject,
  tap,
  map,
} from 'rxjs';

import { NewExternalUserComponent } from '../new-external-user/new-external-user.component';
import { DepartmentsMenuComponent } from '../departments-menu/departments-menu.component';
import {
  DataTableComponent,
  ColumnDefinition,
} from '../../../../shared/components/ui/data-table/data-table.component';

import { DialogsService } from '../../../../shared/components/ui/confirm-dialog/confirmation-dialog.service';
import { PermissionsManagerService } from '../../../../core/permissions/permissions-manager.service';
import { MessagesService } from '../../../../shared/components/ui/snackbars/messages.service';
import { CommitteesService } from '../../features/committees/committees.service';
import { LayoutService } from '../../../../core/services/layout.service';
import { LANG } from '../../../../core/services/translation.service';
import { MainService } from '../../main.service';

import { removeArrayDuplicates } from '../../../../shared/utils/data-transformation';
import { EntityType, Member, MemberType } from '../../main.types';
import {
  Resources,
  Action,
} from '../../../../core/permissions/auth-request.model';

@Component({
  selector: 'member-selection-form',
  standalone: true,
  imports: [
    NgClass,

    MatPaginatorModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    MatProgressBar,
    MatTabsModule,
    MatSortModule,
    MatIconButton,
    MatButton,
    MatIcon,

    TranslateModule,

    DataTableComponent,
    DepartmentsMenuComponent,
  ],
  templateUrl: './user-selection-modal.component.html',
})
export class userSelectionModal {
  permissionsService = inject(PermissionsManagerService);
  committeeService = inject(CommitteesService);
  translation = inject(TranslateService);
  dialogService = inject(DialogsService);
  messages = inject(MessagesService);
  mainService = inject(MainService);
  layout = inject(LayoutService);
  dialog = inject(MatDialog);
  dialogData = inject<{
    selected: Member[];
    committeeId: string;
    titles: {
      main: string;
      internalTab: string;
      externalTab: string;
      addButton: string;
    };
    category: string;
  }>(MAT_DIALOG_DATA);
  matDialogRef = inject(MatDialogRef);

  memberType = MemberType;
  entityType = EntityType;
  lang = LANG;

  currentInternalSelected = signal<Member[]>([]);
  currentExternalSelected = signal<Member[]>([]);
  departments = signal([]);
  loading = signal(false);

  preSelected = signal<string[]>([]);
  highlighted = signal<string[]>([]);

  RESOURCE = Resources;
  ACTION = Action;

  currentUrl: string = '';

  protected searchInternalStream$ = new Subject<string>();
  private searchInternalStreamSub$ = new Subscription();

  protected searchExternalStream$ = new Subject<string>();
  private searchExternalStreamSub$ = new Subscription();

  internalPaginator = viewChild.required<MatPaginator>('internal');
  externalPaginator = viewChild.required<MatPaginator>('external');

  internalItems = new MatTableDataSource();
  externalItems = new MatTableDataSource();

  internalColumns: ColumnDefinition[] = [
    { key: 'name', custom: true },
    // { key: 'department', custom: true },
  ];

  externalColumns: ColumnDefinition[] = [
    { key: 'name', custom: true },
    { key: 'actions', custom: true },
  ];

  internalPreSelected = this.dialogData.selected.filter(
    (x) => x.memberType === this.memberType.internal
  );
  externalPreSelected = this.dialogData.selected.filter(
    (x) => x.memberType === this.memberType.external
  );
  ngOnInit() {
    this.internalItems.paginator = this.internalPaginator();
    this.getInternalEntities({ pageIndex: 0, pageSize: 10, length: 0 });
    this.searchInternalStreamSub$ = this.onInternalSearchChange();

    this.externalItems.paginator = this.externalPaginator();
    this.getExternalEntities({ pageIndex: 0, pageSize: 10, length: 0 });
    this.searchExternalStreamSub$ = this.onExternalSearchChange();

    if (this.dialogData.category === 'meeting') {
      this.getCommitteeMembers();
    }
    this.currentInternalSelected.set(this.internalPreSelected);
    this.currentExternalSelected.set(this.externalPreSelected);
  }

  // #region Methods

  // Internal members methods
  getInternalEntities(event: PageEvent & { departmentId?: string }) {
    this.loading.set(true);
    return this.mainService
      .getEntities({
        page: event.pageIndex,
        maxResult: event.pageSize,
        entityType: this.entityType.employee,
        departmentId: event.departmentId,
      })
      .subscribe({
        next: (data) => {
          this.internalItems.data = data.items;

          // NOTE: This one is used in case of re-open the dialog with pre-selected values or in case of editing committee members in future sprints.
          this.setPreSelected();

          setTimeout(() => {
            this.internalPaginator().pageIndex = event.pageIndex;
            this.internalPaginator().length = data.totalCount;
          });
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  setSelectedDepartment(id: string) {
    this.getInternalEntities({
      pageIndex: 0,
      pageSize: 10,
      length: 0,
      departmentId: id,
    });
  }

  onInternalPaginationChange($event: PageEvent) {
    this.getInternalEntities($event);
  }

  onInternalSearchChange() {
    return this.searchInternalStream$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap(
          (
            searchValue // NOTE: passed from the subject stream source which is updated on search event
          ) =>
            this.mainService.getEntities({
              page: 0,
              maxResult: 10,
              entityType: this.entityType.employee,
              search: searchValue,
            })
        )
      )
      .subscribe({
        next: (data) => {
          this.internalItems.data = data.items;

          this.setPreSelected();

          setTimeout(() => {
            this.internalPaginator().pageIndex = 0;
            this.internalPaginator().length = data.totalCount;
          });

          this.loading.set(false);
        },

        error: (error) => {
          this.messages.show('error', error);
          this.loading.set(false);
        },
      });
  }

  setInternalSelection(values: any) {
    const { entity, checked } = values;

    if (Array.isArray(entity) && checked) {
      this.internalPreSelected.push(...entity);
      this.currentInternalSelected.set(
        removeArrayDuplicates([...this.internalPreSelected, ...entity], 'id')
      );
      return;
    }
    if (Array.isArray(entity) && !checked) {
      const deleted = new Set(entity.map((x) => x.id));
      this.internalPreSelected = this.internalPreSelected.filter((x) => {
        return !deleted.has(x.id);
      });
      this.currentInternalSelected.set(
        removeArrayDuplicates([...this.internalPreSelected], 'id')
      );
      return;
    }

    if (!Array.isArray(entity) && checked) {
      this.internalPreSelected.push(entity);
      this.currentInternalSelected.set(
        removeArrayDuplicates([...this.internalPreSelected, entity], 'id')
      );
      return;
    }
    if (!Array.isArray(entity) && !checked) {
      this.internalPreSelected = this.internalPreSelected.filter(
        (x) => x.id !== entity.id
      );
      this.currentInternalSelected.set(
        removeArrayDuplicates([...this.internalPreSelected], 'id')
      );
    }
  }

  // External members methods
  getExternalEntities(event: PageEvent) {
    this.loading.set(true);
    return this.mainService
      .getExternalEntites({
        page: event.pageIndex,
        maxResult: event.pageSize,
      })
      .subscribe({
        next: (data) => {
          this.externalItems.data = data.items;

          // NOTE: This one is used in case of re-open the dialog with pre-selected values or in case of editing committee members in future sprints.
          this.setPreSelected();

          setTimeout(() => {
            this.externalPaginator().pageIndex = event.pageIndex;
            this.externalPaginator().length = data.totalCount;
          });
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  onExternalSearchChange() {
    return this.searchExternalStream$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap(
          (
            searchValue // NOTE: passed from the subject stream source which is updated on search event
          ) =>
            this.mainService.getExternalEntites({
              page: 0,
              maxResult: 10,
              search: searchValue,
            })
        )
      )
      .subscribe({
        next: (data) => {
          this.externalItems.data = data.items;

          this.setPreSelected();

          setTimeout(() => {
            this.externalPaginator().pageIndex = 0;
            this.externalPaginator().length = data.totalCount;
          });

          this.loading.set(false);
        },

        error: (error) => {
          this.messages.show('error', error);
          this.loading.set(false);
        },
      });
  }

  onExternalPaginationChange($event: PageEvent) {
    this.getExternalEntities($event);
  }

  setExternalSelection(values: any) {
    const { entity, checked } = values;

    if (Array.isArray(entity) && checked) {
      this.externalPreSelected.push(...entity);
      this.currentExternalSelected.set(
        removeArrayDuplicates([...this.externalPreSelected, ...entity], 'id')
      );
      return;
    }
    if (Array.isArray(entity) && !checked) {
      const deleted = new Set(entity.map((x) => x.id));
      this.externalPreSelected = this.externalPreSelected.filter((x) => {
        return !deleted.has(x.id);
      });
      this.currentExternalSelected.set(
        removeArrayDuplicates([...this.externalPreSelected], 'id')
      );
      return;
    }

    if (!Array.isArray(entity) && checked) {
      this.externalPreSelected.push(entity);
      this.currentExternalSelected.set(
        removeArrayDuplicates([...this.externalPreSelected, entity], 'id')
      );
      return;
    }
    if (!Array.isArray(entity) && !checked) {
      this.externalPreSelected = this.externalPreSelected.filter(
        (x) => x.id !== entity.id
      );
      this.currentExternalSelected.set(
        removeArrayDuplicates([...this.externalPreSelected], 'id')
      );
    }
  }

  deleteMember(uuid: string) {
    this.dialogService
      .open({
        type: 'delete',
        title: 'MAIN.TITLE.DELETE_MEMBER',
        message: 'MAIN.MESSAGE.DELETE_MEMBER_MESSAGE',
        closeButtonTitle: 'GLOBAL.BUTTON.NO',
        confirmButtonTitle: 'GLOBAL.BUTTON.YES',
        value: '',
      })
      .subscribe((result) => {
        if (!result) return;
        this.loading.set(true);
        this.mainService.deleteExternalMember(uuid).subscribe({
          complete: () => {
            this.loading.set(false);
            this.messages.show(
              'success',
              this.translation.instant('MAIN.MESSAGE.DELETE_MEMBER_SUCCESS'),
              3
            );
            this.getExternalEntities({
              pageIndex: 0,
              pageSize: 10,
              length: 0,
            });
          },
        });
      });
  }

  getCommitteeMembers() {
    this.committeeService
      .getSingleCommittee(this.dialogData.committeeId)
      .pipe(
        map((data) => data.value),
        map((committee) => [
          ...committee.externalMembers,
          ...committee.internalMembers,
        ]),
        map((members) => members.map((member) => member.id))
      )
      .subscribe((result) => this.highlighted.set(result));
  }

  exportMembers() {
    this.matDialogRef.close([
      ...this.currentInternalSelected().map((x) => ({
        ...x,
        memberType: this.memberType.internal,
      })),

      ...this.currentExternalSelected().map((x) => ({
        ...x,
        memberType: this.memberType.external,
        nameAr: x.nameAr || x.name,
      })),
    ]);
  }

  setPreSelected() {
    this.preSelected.set([
      ...this.currentInternalSelected().map((x: Member) => x.id),
      ...this.currentExternalSelected().map((x: Member) => x.id),
      ...this.dialogData.selected.map((x: Member) => x.id),
    ]);
  }

  ngOnDestroy(): void {
    this.searchInternalStream$.unsubscribe();
    this.searchExternalStream$.unsubscribe();
  }

  openAddExternalForm() {
    this.dialog
      .open(NewExternalUserComponent, {
        direction: this.layout.direction(),
        width: '600px',
        data: {
          addNewInvitee: this.dialogData.titles.addButton,
        },
      })
      .afterClosed()
      .subscribe({
        next: (data) => {
          if (!data) return;
          this.getExternalEntities({
            pageIndex: 0,
            pageSize: 10,
            length: 0,
          });
        },
      });
  }
}
