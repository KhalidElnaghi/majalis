import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

import { MessagesService } from '../../../../shared/components/ui/snackbars/messages.service';
import { LayoutService } from '../../../../core/services/layout.service';
import { ExternalService } from '../../external.service';
import { externalRoutes } from '../../external.routes';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'vote-otp-check',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIcon,

    TranslateModule,
  ],
  template: `
    <div class="flex justify-end">
      <button mat-icon-button (click)="location.back()">
        <mat-icon>keyboard_backspace</mat-icon>
      </button>
    </div>

    <div
      class="h-[calc(100vh_-_10rem)] flex items-center justify-center flex-col"
    >
      <div class="mb-16 w-full max-w-[480px]">
        <div class="mb-6">
          <h2 class="!text-[16px] font-normal mb-3">
            {{ 'EXTERNAL.LABEL.CHECK_OTP' | translate }}
          </h2>

          <h5 class="!text-xs !font-normal text-disabled">
            {{ 'EXTERNAL.LABEL.OTP_SENT_TO' | translate }}

            <span class="text-black mx-1">
              {{ phone() }}
            </span>

            <a
              class="mx-1 text-primary cursor-pointer"
              (click)="location.back()"
            >
              {{ 'GLOBAL.BUTTON.EDIT' | translate }}
            </a>
          </h5>
        </div>

        <form
          [formGroup]="form"
          (ngSubmit)="validateOtp()"
          class="flex flex-col gap-2"
        >
          <mat-form-field appearance="outline" class="!flex-grow">
            <input formControlName="otp" type="text" matInput maxlength="4" />
            <mat-label>{{ 'EXTERNAL.LABEL.OTP' | translate }}</mat-label>

            <!-- Required error message -->
            @if(form.controls.otp.errors?.['required'] ){
            <mat-error>{{ 'MAIN.ERROR.FIELD_REQUIRED' | translate }}</mat-error>
            }

            <!-- length error message [Maxlength] -->
            @if(form.controls.otp.errors?.['maxlength']){
            <mat-error>
              {{ 'EXTERNAL.ERROR.OTP_LENGTH_4' | translate }}
            </mat-error>
            }

            <!-- length error message [Minlength] -->
            @if(form.controls.otp.errors?.['minlength']){
            <mat-error>
              {{ 'EXTERNAL.ERROR.OTP_LENGTH_4' | translate }}
            </mat-error>
            }
          </mat-form-field>

          <button
            [disabled]="layout.isLoading()"
            mat-raised-button
            type="submit"
            color="primary"
            class="!rounded-[10px]"
          >
            {{ 'EXTERNAL.BUTTON.MOVE_TO_VOTE' | translate }}
          </button>
        </form>

        <div class="flex justify-center items-center gap-2 text-sm mt-6">
          <span class="text-disabled">
            {{ 'EXTERNAL.LABEL.NO_CODE_RECIEVED' | translate }}
          </span>

          <span class="cursor-pointer" (click)="validateOtp()">
            {{ 'EXTERNAL.LABEL.RESEND_CODE' | translate }}
          </span>

          <!-- TODO: add resend count down -->

          <!-- <span>({{ 23 }})</span> -->
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class VoteOtpCheckComponent {
  externalUserService = inject(ExternalService);
  messages = inject(MessagesService);
  formBuilder = inject(FormBuilder);
  layout = inject(LayoutService);
  location = inject(Location);
  router = inject(Router);

  tenant = input.required<string>();
  phone = input.required<string>();
  id = input.required<string>();

  form = this.formBuilder.group({
    otp: [
      null,
      [Validators.required, Validators.maxLength(4), Validators.minLength(4)],
    ],
  });

  validateOtp() {
    if (this.form.valid) {
      this.layout.isLoading.set(true);

      const customHeaders = new HttpHeaders({
        __tenant: this.tenant(),
      });

      this.externalUserService
        .validateOtpNumber(
          this.id(),
          this.phone(),
          this.form.value.otp!,
          customHeaders
        )
        .subscribe({
          next: (response: any) => {
            this.router.navigate([externalRoutes.MEETING_VOTE], {
              queryParams: {
                secret: response.userSecret,
                withOTP: true,
              },
            });
            this.layout.isLoading.set(false);
          },
          error: (error) => {
            this.messages.show('error', error.message, 4);
            this.layout.isLoading.set(false);
          },
        });
    }
  }
}
