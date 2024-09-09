import { Component, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import {
  MatPaginatorModule,
  MatPaginator,
  PageEvent,
} from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';

import { MeetingsSearchAndFilterComponent } from '../../../../../../shared/components/business/meetings-search-and-filter/meetings-search-and-filter.component';
import { MeetingItemComponent } from '../../../../../../shared/components/business/meeting-item/meeting-item.component';
import { EmptyEntityLineComponent } from '../../../../components/empty-entity-line/empty-entity-line.component';

import { CustomDateAdapterService } from '../../../../../../shared/components/form-controls/custom-date-picker/custom-date-picker.service';
import { DialogsService } from '../../../../../../shared/components/ui/confirm-dialog/confirmation-dialog.service';
import { PermissionsManagerService } from '../../../../../../core/permissions/permissions-manager.service';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { BrowserStorageService } from '../../../../../../core/services/browser-storage.service';
import { LayoutService } from '../../../../../../core/services/layout.service';
import { MeetingsService } from '../../meetings.service';

import { Meeting, PaginatedResponse } from '../../../../main.types';
import {
  Resources,
  Action,
} from '../../../../../../core/permissions/auth-request.model';

@Component({
  selector: 'meetings-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,

    MatPaginatorModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressBar,
    MatInputModule,
    MatTooltip,
    MatIcon,

    TranslateModule,

    MeetingsSearchAndFilterComponent,
    EmptyEntityLineComponent,
    MeetingItemComponent,
  ],
  template: `
    @if(permissionsService.can(ACTION.create, RESOURCE.committeeMeeting,true)){
    <div class="flex items-center justify-start gap-2 my-4">
      <button mat-raised-button color="primary" (click)="handleNavigation()">
        {{ 'MAIN.BUTTON.NEW_MEETING' | translate }}
        <mat-icon>add</mat-icon>
      </button>
    </div>
    }

    <!-- Available only for authorized user to meetings list -->
    @if(permissionsService.can(ACTION.list, RESOURCE.committeeMeeting,true)){
    <meetings-search-and-filter (getMyMeetings)="getMeetings($event)" />
    }

    <div class="flex flex-col gap-4">
      <!-- COMMITTEES LIST -->
      @if(meetingService.meetingsList().length){

      <!-- meetings list -->
      @for(meeting of meetingService.meetingsList(); track meeting.id) {
      <meeting-item
        [meeting]="meeting"
        [isInternal]="true"
        (deleteMeetingOccurrence)="handleDeleteOccurrence($event)"
      />
      }

      <!-- Empty line -->
      } @else {
      <empty-entity-line />
      }

      <!-- Available only for authorized user to meetings list -->
      @if(permissionsService.can(ACTION.list, RESOURCE.committeeMeeting,true)){
      <mat-paginator
        class="!m-2 !shadow-sm !rounded-b-md !transition-all"
        (page)="onPaginationChange($event)"
        [pageSizeOptions]="pageSizeOptions"
        [pageSize]="pageSize()"
        showFirstLastButtons
      />
      }
    </div>
  `,
})
export default class MeetingsListComponent {
  // #region Injectors
  permissionsService = inject(PermissionsManagerService);
  dateService = inject(CustomDateAdapterService);
  storageService = inject(BrowserStorageService);
  meetingService = inject(MeetingsService);
  messages = inject(MessagesService);
  activatedRoute = inject(ActivatedRoute);
  dialogService = inject(DialogsService);
  layoutService = inject(LayoutService);
  formBuilder = inject(FormBuilder);
  datePipe = inject(DatePipe);
  dialog = inject(MatDialog);
  router = inject(Router);

  paginator = viewChild.required<MatPaginator>(MatPaginator);

  RESOURCE = Resources;
  ACTION = Action;

  // ID is retrived from the url
  committeeId: string = this.activatedRoute.snapshot.queryParams['committeeId'];
  meetingId: string = '';
  sorting!: string;
  date!: string;
  status!: string;
  search!: string;

  pageSizeOptions = [10, 25, 50];
  pageSize = signal<number>(this.pageSizeOptions[0]);
  paginatorSessionKey = 'meetingsListPagination' as const;

  ngOnInit() {
    this.pageSize.set(
      this.storageService.getData('session', this.paginatorSessionKey)
        ?.pageSize || this.pageSizeOptions[0]
    );
  }

  // #region Methods
  allSelected(): boolean {
    return this.meetingService.allSelected;
  }

  onPaginationChange($event: PageEvent) {
    if (
      this.permissionsService.can(
        this.ACTION.list,
        this.RESOURCE.committeeMeeting,
        true
      )
    ) {
      this.storageService.setData('session', this.paginatorSessionKey, $event);
      this.getCommitteeMeetingsListData($event);
    }
  }

  handleNavigation() {
    this.layoutService.isLoading.set(true);
    this.meetingService.saveAsDraft(this.committeeId, {}).subscribe({
      next: (val) => {
        this.meetingId = val.value.meetingId;
        this.router.navigate(['/main/committee/meeting'], {
          queryParams: {
            committeeId: this.committeeId,
            meetingId: val.value.meetingId,
          },
        });
      },
      error: (error) => this.messages.show('error', error.message),
      complete: () => this.layoutService.isLoading.set(false),
    });
  }

  getCommitteeMeetingsListData(event: PageEvent) {
    let pageIndex!: number;
    let pageSize!: number;
    this.layoutService.isLoading.set(true);
    if (event) {
      pageIndex = event.pageIndex;
      pageSize = event.pageSize;
    } else {
      pageIndex = 0;
      pageSize = 10;
    }

    this.meetingService
      .getCommitteeMeetingsList(
        this.committeeId,
        pageIndex,
        pageSize,
        this.sorting,
        this.search,
        this.status,
        this.date
      )
      .subscribe({
        next: (response: PaginatedResponse<Meeting>) => {
          this.layoutService.isLoading.set(false);
          this.meetingService.meetingsList.set(response.items);
          this.paginator().pageIndex = pageIndex;
          this.paginator().length = response.totalCount;
        },
        complete: () => {
          this.layoutService.isLoading.set(false);
        },
        error: () => {
          this.layoutService.isLoading.set(false);
        },
      });
  }

  handleDeleteOccurrence(occurrenceId: string) {
    this.deleteOccurrence(occurrenceId).subscribe({
      next: () => {
        this.refetchData();
        this.messages.show(
          'success',
          'MAIN.MESSAGE.MEETING_WAS_DELETED_SUCCESSFULLY'
        );
      },
      error: (error) => {
        this.messages.show('error', error.message);
      },
    });
  }

  deleteOccurrence(occurrenceId: string) {
    return this.meetingService
      .deleteMeetingOccurrence(occurrenceId)
      .pipe(catchError((error) => throwError(() => error)));
  }

  refetchData() {
    this.getCommitteeMeetingsListData({
      pageIndex: 0,
      pageSize: this.pageSize(),
      length: 0,
    });
  }

  getMeetings({
    search,
    sorting,
    date,
    status,
  }: {
    search: string | null | undefined;
    sorting: string | null | undefined;
    date: string | null | undefined;
    status: string | null | undefined;
  }) {
    if (
      this.permissionsService.can(
        this.ACTION.list,
        this.RESOURCE.committeeMeeting,
        true
      )
    ) {
      this.search = search || '';
      this.date =
        (this.datePipe.transform(date || '', 'yyyy-MM-dd') as string) || ' ';
      this.status = status || '';
      this.sorting = sorting || '';
      this.getCommitteeMeetingsListData(
        this.storageService.getData('session', this.paginatorSessionKey)
      );
    } else {
      this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
    }
  }
}
