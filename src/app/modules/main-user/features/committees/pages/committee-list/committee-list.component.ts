import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  viewChild,
  Component,
  inject,
  signal,
} from '@angular/core';

import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {
  MatPaginatorModule,
  MatPaginator,
  PageEvent,
} from '@angular/material/paginator';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';

import { TranslateModule } from '@ngx-translate/core';

import { CustomBreadcrumbComponent } from '../../../../../../shared/components/ui/breadcrumb/custom-breadcrumb.component';
import { PageHeaderComponent } from '../../../../../../shared/components/business/page-header/page-header.component';
import { NewCommitteDialogComponent } from '../../components/new-committee-dialog/new-committe-dialog.component';
import { EmptyEntityLineComponent } from '../../../../components/empty-entity-line/empty-entity-line.component';
import { CommitteeItemComponent } from '../../components/committee-item.component';

import { DialogsService } from '../../../../../../shared/components/ui/confirm-dialog/confirmation-dialog.service';
import { PermissionsManagerService } from '../../../../../../core/permissions/permissions-manager.service';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { BrowserStorageService } from '../../../../../../core/services/browser-storage.service';
import { LayoutService } from '../../../../../../core/services/layout.service';
import { CommitteesService } from '../../committees.service';

import { breadcrumbData, pageTitle } from './committee-list.config';
import {
  Resources,
  Action,
} from '../../../../../../core/permissions/auth-request.model';
import { Committee } from '../../../../main.types';

@Component({
  selector: 'committee-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,

    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressBar,
    MatIconModule,

    TranslateModule,

    CustomBreadcrumbComponent,
    EmptyEntityLineComponent,
    CommitteeItemComponent,
    PageHeaderComponent,
  ],
  template: `
    <page-header [titles]="title">
      <custom-breadcrumb breadcrumb [pagesRoutes]="breadcrumb" />
    </page-header>

    <div class="flex items-center justify-start gap-2 mb-2">
      <!-- Add new committee -->
      @if(permissionsService.can(ACTION.create, RESOURCE.committee,false)){
      <button mat-raised-button color="primary" (click)="openCreateCommitte()">
        {{ 'MAIN.BUTTON.CREATE_NEW_COMMITTE' | translate }}
        <mat-icon>add</mat-icon>
      </button>
      }

      <!-- Delete Selected committee -->
      @if(permissionsService.can(ACTION.delete, RESOURCE.committee,false)){
      <button
        (click)="deleteSelected()"
        [disabled]="committeeService.selection.selected.length === 0"
        class="!rounded-xl"
        mat-icon-button
        color="warn"
      >
        <mat-icon> delete_forever </mat-icon>
      </button>
      }
    </div>

    <div class="flex flex-col gap-4">
      @if(loading()) {
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      }

      <!-- COMMITTEES LIST -->
      @if(committeeService.committeesList().length){

      <!-- Select all committees -->
      @if(permissionsService.can(ACTION.delete, RESOURCE.committee,false)){
      <mat-checkbox
        color="primary"
        (change)="toggleAllSelection($event)"
        [checked]="allSelected()"
        [indeterminate]="
          committeeService.selection.selected.length !== 0 && !allSelected()
        "
        class="mx-3.5"
      />
      }

      <!-- Committee list items -->
      @for(committee of committeeService.committeesList(); track committee.id) {
      <committee-item
        [committee]="committee"
        (refresh)="getCommitteesData({
          pageIndex: 0,
          pageSize: this.pageSizeOptions[0],
          length: 0,
        })"
        (delete)="deleteCommittee($event)"
      />
      }

      <!-- Empty line -->
      } @else {
      <empty-entity-line />
      }

      <!-- Paginator is only available for user have data list permission -->
      @if(permissionsService.can(ACTION.list, RESOURCE.committee,false)){
      <mat-paginator
        class="!m-2 !shadow-sm !rounded-b-md !transition-all"
        [pageSizeOptions]="pageSizeOptions"
        (page)="onPaginationChange($event)"
        showFirstLastButtons
        [pageSize]="pageSize()"
      />
      }
    </div>
  `,
})
export default class CommitteeListComponent {
  permissionsService = inject(PermissionsManagerService);
  storageService = inject(BrowserStorageService);
  committeeService = inject(CommitteesService);
  messageService = inject(MessagesService);
  dialogService = inject(DialogsService);
  activeRoute = inject(ActivatedRoute);

  layout = inject(LayoutService);
  dialog = inject(MatDialog);

  paginator = viewChild.required<MatPaginator>(MatPaginator);

  RESOURCE = Resources;
  ACTION = Action;

  pageSizeOptions = [10, 25, 50];
  pageSize = signal<number>(this.pageSizeOptions[0]);
  paginatorSessionKey = 'committeeListPaginator' as const;

  breadcrumb = breadcrumbData;
  loading = signal(false);
  title = pageTitle;

  constructor() {
    this.permissionsService.initNonScopedPermission(
      this.activeRoute.snapshot.data['permissions']
    );
  }

  ngOnInit() {
    this.pageSize.set(
      this.storageService.getData('session', this.paginatorSessionKey)
        ?.pageSize || this.pageSizeOptions[0]
    );

    if (
      this.permissionsService.can(
        this.ACTION.list,
        this.RESOURCE.committee,
        false
      )
    ) {
      this.getCommitteesData({
        pageIndex: 0,
        pageSize: this.pageSize(),
        length: 0,
      });
    }

    this.permissionsService.resetScopedPermissions();
  }

  allSelected(): boolean {
    return this.committeeService.allSelected;
  }

  toggleAllSelection(event: MatCheckboxChange) {
    return this.committeeService.toggleAll(event.checked);
  }

  onPaginationChange($event: PageEvent) {
    this.storageService.setData('session', this.paginatorSessionKey, $event);
    this.getCommitteesData($event);
  }

  getCommitteesData(event: PageEvent) {
    this.loading.set(true);
    const { pageIndex, pageSize } = event;

    this.committeeService.getCommittees(pageIndex, pageSize).subscribe({
      next: (res) => {
        const reversedArray = res.items;
        this.committeeService.committeesList.set(reversedArray);

        this.paginator().pageIndex = pageIndex;
        this.paginator().length = res.totalCount;
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  openCreateCommitte(): void {
    this.dialog
      .open(NewCommitteDialogComponent, {
        width: this.layout.onMobile() ? '95%' : '45%',
        maxHeight: '80vh',
        direction: this.layout.direction(),
        data: {
          placeHolder: 'ENTER_COMMITTE_NAME',
        },
      })
      .afterClosed()
      .subscribe((data) => {
        if (!data) return;
        this.getCommitteesData({
          pageIndex: 0,
          pageSize: this.pageSizeOptions[0],
          length: 0,
        });
      });
  }

  deleteCommittee(committee: Committee): void {
    if (!committee.canDelete) {
      this.messageService.show(
        'error',
        'MAIN.MESSAGE.CANT_DELETE_COMMITTEE',
        4
      );
      return;
    }

    this.dialogService
      .open({
        type: 'delete',
        title: 'MAIN.TITLE.DELETE_COMMITTEE',
        message: 'MAIN.MESSAGE.DELETE_COMMITTEE_MESSAGE',
        closeButtonTitle: 'GLOBAL.BUTTON.NO',
        confirmButtonTitle: 'GLOBAL.BUTTON.YES',
        value: '',
      })
      .subscribe(() => {
        this.layout.isLoading.set(true);
        this.committeeService
          .deleteCommittee(committee.id)
          .subscribe(this.deleteSuccess());
      });
  }

  deleteSelected() {
    if (
      this.permissionsService.can(
        this.ACTION.delete,
        this.RESOURCE.committee,
        false
      )
    ) {
      this.dialogService
        .open({
          type: 'delete',
          title: 'MAIN.TITLE.DELETE_COMMITTEE',
          message: 'MAIN.MESSAGE.DELETE_COMMITTEE_MESSAGE',
          closeButtonTitle: 'GLOBAL.BUTTON.NO',
          confirmButtonTitle: 'GLOBAL.BUTTON.YES',
          value: '',
        })
        .subscribe((confirm) => {
          if (confirm) this.layout.isLoading.set(true);
          this.committeeService
            .deleteSelectedCommittees()
            .subscribe(this.deleteSuccess());
        });
    } else {
      this.messageService.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
    }
  }

  deleteSuccess() {
    return {
      next: () => {
        this.messageService.show(
          'success',
          'MAIN.MESSAGE.COMMITTEE_DELETED',
          4
        );
        this.getCommitteesData({
          pageIndex: 0,
          pageSize: this.pageSizeOptions[0],
          length: 0,
        });
      },
      error: (error: any) => {
        this.layout.isLoading.set(false);
        this.messageService.show('error', error.message);
      },
      complete: () => {
        this.layout.isLoading.set(false);
      },
    };
  }
}
