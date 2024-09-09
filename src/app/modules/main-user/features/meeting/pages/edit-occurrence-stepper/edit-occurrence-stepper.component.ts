import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { CustomBreadcrumbComponent } from '../../../../../../shared/components/ui/breadcrumb/custom-breadcrumb.component';
import { PageHeaderComponent } from '../../../../../../shared/components/business/page-header/page-header.component';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

import { LayoutService } from '../../../../../../core/services/layout.service';
import { breadcrumbData, pageTitle } from './edit-edoccurrence-stepper.config';
import { mainRoutes } from '../../../../main.routes';
import { EditOccurrenceInfoStep } from '../../components/edit-occurrence-info-step/edit-occurrence-info-step.component';
import { getCombinedDate } from '../../components/edit-occurrence-info-step/edit-occurrence-info-step.config';
import { dateAndTimeValidator } from '../../components/meeting-info-step/meeting-info-step.config';
import { Attachments } from '../../../../../../core/services/media.service';
import { DatePipe } from '@angular/common';
import { CommitteeSingleMeeting, Occurrence } from '../../../../main.types';
import { MeetingPollsStepComponent } from '../../components/meeting-polls-step/meeting-polls-step.component';
import { voteDateTimeValidator } from '../../components/meeting-polls-step/meeting-polls-step.config';
import { MeetingsService } from '../../meetings.service';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { PermissionsManagerService } from '../../../../../../core/permissions/permissions-manager.service';
import {
  Action,
  Resources,
} from '../../../../../../core/permissions/auth-request.model';

@Component({
  selector: 'edit-occurrence-stepper',
  standalone: true,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true, displayDefaultIndicatorType: false },
    },
  ],
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    CustomBreadcrumbComponent,
    PageHeaderComponent,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,

    EditOccurrenceInfoStep,
    MeetingPollsStepComponent,
  ],
  template: `
    <page-header [titles]="title">
      <custom-breadcrumb breadcrumb [pagesRoutes]="breadcrumb" />
    </page-header>

    <form [formGroup]="occurrenceForm" (ngSubmit)="submitForm(occurrenceForm)">
      <mat-stepper
        [orientation]="layout.onMobile() ? 'vertical' : 'horizontal'"
        class="mat-elevation-z1 rounded-2xl"
        orientation="horizontal"
        animationDuration="500"
        labelPosition="bottom"
        #stepper
      >
        <!-- STEP: info step -->
        <mat-step
          errorMessage="{{ 'MAIN.ERROR.STEP_INFO_IS_MISSING' | translate }}"
          [stepControl]="infoForm"
        >
          <ng-template matStepLabel>
            {{ 'MAIN.TITLE.MEETING_INFO' | translate }}
          </ng-template>

          <edit-occurrence-info-step [form]="infoForm" />

          <div class="flex items-center justify-start gap-2">
            <button
              mat-raised-button
              color="primary"
              type="button"
              (click)="goToNextStep(stepper)"
            >
              <span>
                {{ 'GLOBAL.BUTTON.SAVE' | translate }}
              </span>
            </button>

            <button
              [routerLink]="ROUTES.COMMITTEE"
              mat-stroked-button
              type="button"
            >
              <span>
                {{ 'GLOBAL.BUTTON.CANCEL' | translate }}
              </span>
            </button>
          </div>
        </mat-step>

        <!-- STEP: polls step -->
        <mat-step
          errorMessage="{{ 'MAIN.ERROR.STEP_POLLS_IS_MISSING' | translate }}"
          [stepControl]="agendaForm"
        >
          <ng-template matStepLabel>
            {{ 'MAIN.TITLE.MEETING_POLLS' | translate }}
          </ng-template>

          <!-- Tarke's Component Here -->
          <meeting-polls-step [form]="agendaForm" />

          <div class="flex items-center justify-start gap-2">
            <button mat-raised-button color="primary" type="submit">
              <span>
                {{ 'GLOBAL.BUTTON.SAVE' | translate }}
              </span>
            </button>

            <button mat-stroked-button matStepperPrevious type="button">
              <span>
                {{ 'GLOBAL.BUTTON.PREVIOUS' | translate }}
              </span>
            </button>

            <button mat-stroked-button [routerLink]="ROUTES.COMMITTEE">
              <span>
                {{ 'GLOBAL.BUTTON.CANCEL' | translate }}
              </span>
            </button>
          </div>
        </mat-step>
      </mat-stepper>
    </form>
  `,
})
export default class MeetingStepperComponent {
  permissionsService = inject(PermissionsManagerService);
  private formBuilder = inject(FormBuilder);
  protected layout = inject(LayoutService);
  activatedRoute = inject(ActivatedRoute);
  messages = inject(MessagesService);
  meetingService = inject(MeetingsService);
  datePipe = inject(DatePipe);
  router = inject(Router);

  meetingData = this.activatedRoute.snapshot.data[
    'occurrenceData'
  ] as CommitteeSingleMeeting;

  ROUTES = mainRoutes;
  title = pageTitle;

  breadcrumb = breadcrumbData(
    this.activatedRoute.snapshot.queryParams['committeeId']
  );

  RESOURCE = Resources;
  ACTION = Action;

  occurrenceForm = this.formBuilder.group({
    info: this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.maxLength(50)]],
        date: [null, [Validators.required]],
        startTime: [null, [Validators.required]],
        endTime: [null, [Validators.required]],
        repeat: [null, [Validators.required]],
        invitees: [null, [Validators.required]],
        location: ['', [Validators.required]],
        emailAlert: [false],
        smsAlert: [false],
        description: [''],
        files: [[] as Attachments[]],
        seperatedInvitees: [[]],
        repetition: [[]],
      },
      { validators: [dateAndTimeValidator] }
    ),
    agenda: this.formBuilder.group(
      {
        votingStartType: ['MeetingCreation'],
        votingEndType: ['MeetingStarting'],
        votingStartsAt: [null],
        votingStartsAtTime: [null],
        showVotingForAll: [false],
        topics: this.formBuilder.array([]),
      },
      { validators: [voteDateTimeValidator] }
    ),
  });

  ngOnInit() {
    this.layout.isLoading.set(false);
  }

  get infoForm() {
    return this.occurrenceForm.get('info') as FormGroup;
  }

  get agendaForm() {
    return this.occurrenceForm.get('agenda') as FormGroup;
  }

  submitForm(occurrenceForm: FormGroup) {
    if (
      this.permissionsService.can(
        this.ACTION.edit,
        this.RESOURCE.committeeMeeting,
        true
      )
    ) {
      if (!occurrenceForm.valid) return;
      if (occurrenceForm.status === 'VALID') {
        this.meetingService
          .validateUpdateMeeting(
            this.meetingData.value.meetingId,
            this.meetingData.value.id,
            occurrenceForm.get('agenda')?.value
          )
          .subscribe({
            next: () => {
              this.messages.show(
                'success',
                'MAIN.MESSAGE.MEETING_WAS_SUCCESSFULLY_EDITED'
              );
              this.router.navigate(['/main/committee/details'], {
                queryParams: {
                  committeeId:
                    this.activatedRoute.snapshot.queryParams['committeeId'],
                },
              });
            },
            error: (error) => this.messages.show('error', error.message),
          });
      } else {
        this.messages.show('info', 'MAIN.ERROR.RECHECK', 3);
      }
    } else {
      this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
    }
  }

  goToNextStep(stepper: MatStepper) {
    if (
      this.permissionsService.can(
        this.ACTION.edit,
        this.RESOURCE.committeeMeeting,
        true
      )
    ) {
      if (!this.infoForm.valid) {
        this.messages.show('warn', 'MAIN.ERROR.RECHECK');
        return;
      }

      this.layout.isLoading.set(true);

      const {
        name: title,
        description,
        date: formDate,
        startTime,
        endTime,
        location,
        smsAlert: smsNotification,
        emailAlert: emailNotification,
        seperatedInvitees,
        repetition,
        files: meetingAttachments,
      } = this.infoForm.value;

      const [date, endAt] = getCombinedDate(
        formDate,
        startTime,
        endTime,
        this.datePipe
      );

      const reqBody = {
        title,
        description,
        date,
        endAt,
        location,
        smsNotification,
        emailNotification,
        ...seperatedInvitees,
        meetingAttachments,
        repetition,
      };

      const { meetingId, id } = (
        this.activatedRoute.snapshot.data['occurrenceData'] as Occurrence
      ).value;
      this.meetingService.editOccurrenceInfo(meetingId, id, reqBody).subscribe({
        next: () => {
          stepper.next();
        },
        error: (error) => this.messages.show('error', error.message),
        complete: () => {
          this.layout.isLoading.set(false);
        },
      });
    } else {
      this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
    }
  }
}
