import { MeetingsService } from './../../meetings.service';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { CustomBreadcrumbComponent } from '../../../../../../shared/components/ui/breadcrumb/custom-breadcrumb.component';
import { PageHeaderComponent } from '../../../../../../shared/components/business/page-header/page-header.component';
import { MeetingPollsStepComponent } from '../../components/meeting-polls-step/meeting-polls-step.component';
import { MeetingInfoStepComponent } from '../../components/meeting-info-step/meeting-info-step.component';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

import { LayoutService } from '../../../../../../core/services/layout.service';
import { breadcrumbData, pageTitle } from './meeting-stepper.config';
import { mainRoutes } from '../../../../main.routes';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { dateAndTimeValidator } from '../../components/meeting-info-step/meeting-info-step.config';
import { voteDateTimeValidator } from '../../components/meeting-polls-step/meeting-polls-step.config';

@Component({
  selector: 'meeting-stepper',
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
    AsyncPipe,

    MeetingInfoStepComponent,
    MeetingPollsStepComponent,
    CustomBreadcrumbComponent,
    PageHeaderComponent,

    MatStepperModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <page-header [titles]="title">
      <custom-breadcrumb breadcrumb [pagesRoutes]="breadcrumb" />
    </page-header>

    <form [formGroup]="form" (ngSubmit)="submitForm(form)">
      <mat-stepper
        [orientation]="layout.onMobile() ? 'vertical' : 'horizontal'"
        class="mat-elevation-z1 rounded-2xl"
        orientation="horizontal"
        animationDuration="500"
        labelPosition="bottom"
        linear
      >
        <!-- STEP: info step -->
        <mat-step
          errorMessage="{{ 'MAIN.ERROR.STEP_INFO_IS_MISSING' | translate }}"
          [stepControl]="infoForm"
        >
          <ng-template matStepLabel>
            {{ 'MAIN.TITLE.MEETING_INFO' | translate }}
          </ng-template>

          <meeting-info-step [form]="infoForm" />

          <div class="flex items-center justify-start gap-2">
            <button
              mat-raised-button
              color="primary"
              matStepperNext
              type="button"
              (click)="showValidationMsg()"
            >
              <span>
                {{ 'GLOBAL.BUTTON.NEXT' | translate }}
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

          <meeting-polls-step [form]="agendaForm" />

          <div class="flex items-center justify-start gap-2">
            <button
              mat-raised-button
              color="primary"
              matStepperNext
              type="button"
              (click)="validateMeeting()"
            >
              <span>
                {{ 'GLOBAL.BUTTON.CREATE' | translate }}
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
  private formBuilder = inject(FormBuilder);
  protected layout = inject(LayoutService);
  meetingService = inject(MeetingsService);
  messageService = inject(MessagesService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  ROUTES = mainRoutes;

  breadcrumb = breadcrumbData(
    this.activatedRoute.snapshot.queryParams['committeeId']
  );
  title = pageTitle;

  form = this.formBuilder.group({
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
        files: [],
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
    return this.form.get('info') as FormGroup;
  }

  get agendaForm() {
    return this.form.get('agenda') as FormGroup;
  }

  submitForm(form: FormGroup) {}

  validateMeeting() {
    if (this.form.status === 'VALID') {
      this.meetingService
        .validateMeeting(this.activatedRoute.snapshot.queryParams['meetingId'])
        .subscribe({
          next: () => {
            this.messageService.show(
              'success',
              'MAIN.MESSAGE.MEETING_WAS_SUCCESSFULLY_PUBLISHED'
            );
            this.router.navigate(['/main/committee/details'], {
              queryParams: {
                committeeId:
                  this.activatedRoute.snapshot.queryParams['committeeId'],
              },
            });
          },
          error: (error) => this.messageService.show('error', error.message),
        });
    } else {
      this.messageService.show('info', 'MAIN.ERROR.RECHECK', 3);
    }
  }

  showValidationMsg() {
    if (this.form.get('info')?.status === 'INVALID') {
      this.messageService.show('info', 'MAIN.ERROR.RECHECK', 3);
    }
  }
}
