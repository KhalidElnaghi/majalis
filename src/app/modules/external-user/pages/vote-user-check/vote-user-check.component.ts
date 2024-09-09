import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

import { MessagesService } from '../../../../shared/components/ui/snackbars/messages.service';
import { LayoutService } from '../../../../core/services/layout.service';
import { ExternalService } from '../../external.service';

import { externalRoutes } from '../../external.routes';

@Component({
  selector: 'vote-user-check',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatIcon,

    TranslateModule,
  ],
  template: `
    <div class="h-full flex items-center justify-center flex-col">
      <div class="mb-16 w-full max-w-[480px]">
        <div class="text-center mb-10">
          <h2 class="text-[22px] font-normal mb-3">
            {{ 'EXTERNAL.LABEL.WELCOME_TO_MEETING_VOTE' | translate }} :
            {{ title() }}
          </h2>

          <h5 class="text-sm font-normal text-disabled">
            {{ 'EXTERNAL.LABEL.INSERT_MOBILE_TO_VOTE' | translate }}
          </h5>
        </div>

        <form
          [formGroup]="form"
          (ngSubmit)="checkMobile()"
          class="flex flex-col gap-2"
        >
          <mat-form-field appearance="outline" class="!flex-grow">
            <input formControlName="mobile" type="tel" matInput maxlength="9" />
            <mat-label>{{ 'MAIN.LABEL.MOBILE' | translate }}</mat-label>

            <p matSuffix class="flex items-center gap-2 px-2">
              966+
              <img
                class="rounded-md"
                width="35"
                height="15"
                src="./assets/images/saudi_arabia_flag.jpeg"
                alt="Saudi arabia flag"
              />
            </p>

            <!-- Required error message -->
            @if(form.controls.mobile.errors?.['required'] ){
            <mat-error>{{ 'MAIN.ERROR.FIELD_REQUIRED' | translate }}</mat-error>
            }

            <!-- Saudi Mobile error message -->
            @if(form.controls.mobile.errors?.['pattern']){
            <mat-error>
              {{ 'MAIN.ERROR.INVALID_PHONE_NUMBER' | translate }}
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
            {{ 'EXTERNAL.BUTTON.CHECK' | translate }}
          </button>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class VoteUserCheckComponent {
  externalUserService = inject(ExternalService);
  messages = inject(MessagesService);
  formBuilder = inject(FormBuilder);
  layout = inject(LayoutService);
  router = inject(Router);

  tenant = input.required<string>();
  title = input.required<string>();
  id = input.required<string>();

  form = this.formBuilder.group({
    mobile: [
      null,
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
        Validators.pattern(/^5[503649187]\d{7}$/),
      ],
    ],
  });

  checkMobile() {
    if (this.form.valid) {
      this.layout.isLoading.set(true);

      const customHeaders = new HttpHeaders({
        __tenant: this.tenant(),
      });

      this.externalUserService
        .requestOtpNumber(this.id(), this.form.value.mobile!, customHeaders)
        .subscribe({
          next: () => {
            this.router.navigate([externalRoutes.MEETING_VOTE_OTP_CHECK], {
              queryParams: {
                id: this.id(),
                phone: this.form.value.mobile!,
                tenant: this.tenant(),
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
