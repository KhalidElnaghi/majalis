import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatTabsModule } from '@angular/material/tabs';

import { TranslateModule } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';

import { CommitteePreviousMeetingMinutesComponent } from '../committee-previous-meeting-minutes/committee-previous-meeting-minutes.component';
import { PageHeaderComponent } from '../../../../../../shared/components/business/page-header/page-header.component';
import MeetingDetailsViewComponent from '../../../meeting/pages/meeting-details-view/meeting-details-view.component';
import MeetingsListComponent from '../../../meeting/components/meetings-list/meetings-list.component';
import { CommitteeDocumentsComponent } from '../committee-documents/committee-documents.component';
import {
  CustomBreadcrumbComponent,
  BreadcrumbStructure,
} from '../../../../../../shared/components/ui/breadcrumb/custom-breadcrumb.component';

import { PermissionsManagerService } from '../../../../../../core/permissions/permissions-manager.service';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { LayoutService } from '../../../../../../core/services/layout.service';
import { MeetingsService } from '../../../meeting/meetings.service';

@Component({
  selector: 'committee-details',
  standalone: true,
  imports: [
    TranslateModule,
    MatTabsModule,

    CommitteePreviousMeetingMinutesComponent,
    MeetingDetailsViewComponent,
    CommitteeDocumentsComponent,
    CustomBreadcrumbComponent,
    MeetingsListComponent,
    PageHeaderComponent,
  ],
  templateUrl: './committee-details.component.html',
})
export default class MeetingsViewComponent {
  permissionsService = inject(PermissionsManagerService);
  activatedRoute = inject(ActivatedRoute);
  meetingService = inject(MeetingsService);
  layoutService = inject(LayoutService);
  messages = inject(MessagesService);

  meetingId = signal<string>('');
  value = signal<any>(null);

  breadcrumbData: BreadcrumbStructure = [
    { path: '/main', title: 'MAIN.TITLE.COMMITTEES', icon: 'corporate_fare' },
    {
      title: 'MAIN.LABEL.COMMITTEE_DETAILS',
    },
  ];

  pageTitle = {
    title: 'MAIN.LABEL.COMMITTEE_DETAILS',
    subTitle: '',
  };

  constructor() {
    this.permissionsService.initScopedPermission(
      this.activatedRoute.snapshot.data['committeePermissions']
    );
  }

  ngOnInit() {
    this.getMeetingDetails();
  }

  getMeetingDetails() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const { meetingId } = queryParams;
      if (meetingId) {
        this.layoutService.isLoading.set(true);
        this.meetingService
          .getOccurrenceData(meetingId)
          .pipe(
            catchError((error) => {
              this.messages.show('error', error.message);
              return throwError(() => error);
            })
          )
          .subscribe({
            next: ({ value }) => {
              this.value.set(value);
              this.meetingId.set(meetingId);
            },
            complete: () => this.layoutService.isLoading.set(false),
          });
      } else {
        this.meetingId.set('');
      }
    });
  }
}
