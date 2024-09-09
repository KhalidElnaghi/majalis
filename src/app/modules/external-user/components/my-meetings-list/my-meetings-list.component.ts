import { ActivatedRoute } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { MatProgressBar } from '@angular/material/progress-bar';
import {
  MatPaginatorModule,
  MatPaginator,
  PageEvent,
} from '@angular/material/paginator';

import { MyMeeting } from '../../pages/my-meetings-and-previous-meeting-minutes/my-meetings-and-previous-meeting-minutes.component';
import { EmptyEntityLineComponent } from '../../../main-user/components/empty-entity-line/empty-entity-line.component';
import { CustomBreadcrumbComponent } from '../../../../shared/components/ui/breadcrumb/custom-breadcrumb.component';
import { MeetingItemComponent } from '../../../../shared/components/business/meeting-item/meeting-item.component';
import { PageHeaderComponent } from '../../../../shared/components/business/page-header/page-header.component';

import { BrowserStorageService } from '../../../../core/services/browser-storage.service';
import { LayoutService } from '../../../../core/services/layout.service';
import { ExternalService } from '../../external.service';
import { MeetingsSearchAndFilterComponent } from '../../../../shared/components/business/meetings-search-and-filter/meetings-search-and-filter.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'my-meetings-list',
  standalone: true,
  imports: [
    MatProgressBar,

    CustomBreadcrumbComponent,
    EmptyEntityLineComponent,
    MeetingsSearchAndFilterComponent,
    MeetingItemComponent,
    PageHeaderComponent,
    MatPaginatorModule,
  ],
  template: `
    @if(loading()){
    <mat-progress-bar mode="indeterminate" class="my-1" />
    }

    <div class="flex flex-col gap-4">
      <meetings-search-and-filter (getMyMeetings)="getMeetings($event)" />

      <!-- COMMITTEES LIST -->
      @if(this.myMeetings.items.length) {

      <!-- meetings lis -->
      @for(meeting of myMeetings.items; track meeting) {
      <meeting-item [meeting]="meeting" [isInternal]="false" />
      }
      <!-- Empty meetings list -->
      } @else { <empty-entity-line />}

      <mat-paginator
        class="!m-2 !shadow-sm !rounded-b-md !transition-all"
        (page)="onPaginationChange($event)"
        showFirstLastButtons
        [pageSizeOptions]="pageSizeOptions"
        [pageSize]="pageSize()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MyMeetingsListComponent {
  storageService = inject(BrowserStorageService);
  externalService = inject(ExternalService);
  activatedRoute = inject(ActivatedRoute);
  layoutService = inject(LayoutService);
  datePipe = inject(DatePipe);

  paginator = viewChild.required<MatPaginator>(MatPaginator);

  pageSizeOptions = [10, 25, 50];
  pageSize = signal<number>(this.pageSizeOptions[0]);
  paginatorSessionKey = 'myMeetingsListPaginator' as const;

  myMeetings: MyMeeting = this.activatedRoute.snapshot.data['myMeetings'];
  secret = this.activatedRoute.snapshot.queryParams['secret'];

  sorting!: string;
  date!: string;
  status!: string;
  search!: string;

  loading = signal(false);

  ngOnInit() {
    this.pageSize.set(
      this.storageService.getData('session', this.paginatorSessionKey)
        ?.pageSize || this.pageSizeOptions[0]
    );
  }

  onPaginationChange($event: PageEvent) {
    this.storageService.setData('session', this.paginatorSessionKey, $event);
    this.getMyMeetings($event);
  }

  getMyMeetings(event: PageEvent) {
    let pageIndex!: number;
    let pageSize!: number;
    this.loading.set(true);
    if (event) {
      pageIndex = event.pageIndex;
      pageSize = event.pageSize;
    } else {
      pageIndex = 0;
      pageSize = 10;
    }
    this.loading.set(true);

    this.externalService
      .getMyMeetings(
        this.secret,
        pageIndex,
        pageSize,
        this.sorting,
        this.search,
        this.status,
        this.date
      )
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.myMeetings.items = res.items;
          this.paginator().pageIndex = pageIndex;
          this.paginator().length = res.totalCount;
        },
        complete: () => {
          this.loading.set(false);
        },
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
    this.search = search || '';
    this.date =
      (this.datePipe.transform(date || '', 'yyyy-MM-dd') as string) || ' ';
    this.status = status || '';
    this.sorting = sorting || '';
    this.getMyMeetings(
      this.storageService.getData('session', this.paginatorSessionKey)
    );
  }
}
