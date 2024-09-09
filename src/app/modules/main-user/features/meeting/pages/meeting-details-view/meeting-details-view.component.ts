import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';

import { AttachmentChipComponent } from '../../../../../../shared/components/ui/attachment-chip/attachment-chip.component';
import { CustomBreadcrumbComponent } from '../../../../../../shared/components/ui/breadcrumb/custom-breadcrumb.component';
import { PageHeaderComponent } from '../../../../../../shared/components/business/page-header/page-header.component';
import { PollsResultDialogComponent } from '../../components/polls-result-dialog/polls-result-dialog.component';

import { DialogsService } from '../../../../../../shared/components/ui/confirm-dialog/confirmation-dialog.service';
import { AuthenticationService } from '../../../../../../core/services/authentication.service';
import { ExternalService } from '../../../../../external-user/external.service';
import { LayoutService } from '../../../../../../core/services/layout.service';

import { CustomDatePipe } from '../../../../../../shared/pipes/custom-date-pipe/custom-date-pipe.pipe';
import { toLocaleTimeZone } from '../../components/meeting-info-step/meeting-info-step.config';
import { urlRegExp } from '../meeting-stepper/meeting-stepper.config';
import { Meeting, weekDays } from '../../../../main.types';
import {
  getRepetitionString,
  breadcrumbData,
  pageTitle,
} from './meeting-details-view.config';

@Component({
  selector: 'meeting-details-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './meeting-details-view.component.html',
  imports: [
    DatePipe,

    MatButtonModule,
    MatChipsModule,
    MatIcon,

    TranslateModule,
    QRCodeModule,

    CustomBreadcrumbComponent,
    AttachmentChipComponent,
    PageHeaderComponent,
    CustomDatePipe,
  ],
})
export default class MeetingDetailsViewComponent {
  externalUserService = inject(ExternalService);
  authService = inject(AuthenticationService);
  activatedRoute = inject(ActivatedRoute);
  dialogService = inject(DialogsService);
  sanitizer = inject(DomSanitizer);
  layout = inject(LayoutService);
  datePipe = inject(DatePipe);
  dialog = inject(MatDialog);
  router = inject(Router);

  committeeId = this.activatedRoute.snapshot.queryParams['committeeId'];
  occuranceId = this.activatedRoute.snapshot.queryParams['meetingId'];
  tenantId = this.authService.userData['tenantid'];

  breadcrumb = breadcrumbData(this.committeeId);

  title = pageTitle;

  meetingDetails = signal<Partial<Meeting>>({});
  repetitionString = signal<string[]>(['']);
  value: any = input();

  voteURL = '';

  ngOnInit() {
    if (this.value()) {
      const {
        repetition: { type, day, weekDays, isCustom },
      } = this.value();
      const transformedDate = this.datePipe.transform(
        this.value().date,
        'yyyy-MM-dd'
      )!;

      this.meetingDetails.set({
        ...this.value(),
        ...(this.value().date && {
          date: toLocaleTimeZone(this.value().date),
        }),
      });

      this.voteURL = this.externalUserService.voteURL({
        id: this.occuranceId,
        title: this.meetingDetails().title!,
        tenant: this.tenantId,
      });

      const monthDetails = this.selectedMonthDetails(transformedDate);
      const lang = this.layout.language();
      this.repetitionString.set(
        getRepetitionString(
          type,
          day,
          this.value().date,
          weekDays,
          isCustom,
          monthDetails,
          lang
        )
      );
    }
  }

  getSanitizedText(): SafeHtml {
    if (!this.meetingDetails().location) return '';
    const urlPattern = urlRegExp;
    const replacedText = this.meetingDetails().location?.replace(
      urlPattern,
      (match, p1, p2) => {
        let url = match;
        if (!p2) {
          url = 'http://' + match;
        }
        return `<a class="!text-primary" href="${url}" class="custom-link" target="_blank">${match}</a>`;
      }
    );
    return this.sanitizer.bypassSecurityTrustHtml(replacedText ?? '');
  }

  private selectedMonthDetails(dateValue: string) {
    const date = new Date(dateValue);
    return {
      monthName: this.datePipe.transform(date, 'MMMM')!,
      dayName: this.datePipe.transform(date, 'EEEE')! as weekDays[number],
      dayNumeric: date.getDate(),
    };
  }

  backToMeetingsList() {
    this.router.navigate(['/main/committee/details'], {
      queryParams: {
        committeeId: this.committeeId,
      },
    });
  }

  handleViewMeetingPollResult() {
    this.dialog.open(PollsResultDialogComponent, {
      width: '70%',
      maxHeight: '600px',
      direction: this.layout.direction(),
      data: {
        meetingId: this.meetingDetails().id,
        meetingStatus: this.meetingDetails().status,
        showVotingForAll: this.meetingDetails().showVotingForAll,
      },
    });
  }
}
