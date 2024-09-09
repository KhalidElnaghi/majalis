import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';

import { CustomBreadcrumbComponent } from '../../../../../../shared/components/ui/breadcrumb/custom-breadcrumb.component';
import { MeetingItemComponent } from '../../../../../../shared/components/business/meeting-item/meeting-item.component';
import { PageHeaderComponent } from '../../../../../../shared/components/business/page-header/page-header.component';
import { EmptyEntityLineComponent } from '../../../../components/empty-entity-line/empty-entity-line.component';

import { BrowserStorageService } from '../../../../../../core/services/browser-storage.service';
import { breadcrumbData, pageTitle } from './my-meetings-list.config';
import { MeetingsService } from '../../meetings.service';

import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { LayoutService } from '../../../../../../core/services/layout.service';
import { Meeting, PaginatedResponse } from '../../../../main.types';
import { CustomDatePipe } from '../../../../../../shared/pipes/custom-date-pipe/custom-date-pipe.pipe';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatFormField,
  MatFormFieldModule,
  MatPrefix,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDateAdapterService } from '../../../../../../shared/components/form-controls/custom-date-picker/custom-date-picker.service';
import { DatePipe } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MeetingsSearchAndFilterComponent } from '../../../../../../shared/components/business/meetings-search-and-filter/meetings-search-and-filter.component';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'my-meetings-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    CustomBreadcrumbComponent,
    EmptyEntityLineComponent,
    MeetingItemComponent,
    PageHeaderComponent,
    MeetingsSearchAndFilterComponent,

    MatProgressBar,
    MatPaginatorModule,
    MatButtonModule,
    MatMenuModule,
    MatFormField,
    MatPrefix,
    MatSuffix,
    MatInput,
    MatIcon,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDivider,
    MatTooltip,

    TranslateModule,
    CustomDatePipe,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <page-header [titles]="title">
        <custom-breadcrumb breadcrumb [pagesRoutes]="breadcrumb" />
      </page-header>
      <div>
        <meetings-search-and-filter (getMyMeetings)="getMyMeetings($event)" />

        <!-- COMMITTEES LIST -->
        @if(this.meetings.length){
        <!--  -->
        <div class="flex flex-col gap-2">
          @for(meeting of this.meetings; track meeting) {
          <meeting-item [meeting]="meeting" [isInternal]="false" />
          }
        </div>

        <!-- Empty line -->
        } @else {
        <empty-entity-line />
        }

        <mat-paginator
          class="!m-2 !shadow-sm !rounded-b-md !transition-all"
          (page)="onPaginationChange($event)"
          showFirstLastButtons
          [pageSizeOptions]="pageSizeOptions"
          [pageSize]="pageSize()"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MyMeetingsListComponent {
  messageService = inject(MessagesService);
  meetingService = inject(MeetingsService);
  storageService = inject(BrowserStorageService);
  dateService = inject(CustomDateAdapterService);
  formBuilder = inject(FormBuilder);
  layoutService = inject(LayoutService);
  messages = inject(MessagesService);
  datePipe = inject(DatePipe);

  loading = signal<boolean>(false);
  showFilters = signal<boolean>(false);
  sorting!: string;
  date!: string;
  status!: string;
  search!: string;

  paginator = viewChild.required<MatPaginator>(MatPaginator);

  meetings: Meeting[] = [];
  breadcrumb = breadcrumbData;
  title = pageTitle;

  pageSizeOptions = [10, 25, 50];
  pageSize = signal<number>(this.pageSizeOptions[0]);
  paginatorSessionKey = 'myMeetingsListPaginator' as const;

  ngOnInit() {
    this.pageSize.set(
      this.storageService.getData('session', this.paginatorSessionKey)
        ?.pageSize || this.pageSizeOptions[0]
    );
  }

  onPaginationChange($event: PageEvent) {
    this.storageService.setData('session', this.paginatorSessionKey, $event);
    this.getMyMeetingList($event);
  }

  getMyMeetingList(event: PageEvent) {
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
      .getMyMeetingList(
        pageIndex,
        pageSize,
        this.search,
        this.date,
        this.status,
        this.sorting
      )
      .subscribe({
        next: (response: PaginatedResponse<Meeting>) => {
          this.layoutService.isLoading.set(false);
          this.meetings = response.items;
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

  getMyMeetings({
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
    this.search = search || '';
    this.date =
      (this.datePipe.transform(date || '', 'yyyy-MM-dd') as string) || ' ';
    this.status = status || '';
    this.sorting = sorting || '';
    this.getMyMeetingList(
      this.storageService.getData('session', this.paginatorSessionKey)
    );
  }
}
