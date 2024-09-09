import { Component, inject, input, output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';

import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';

import { CommitteeMemberPreviewComponent } from './committee-member-preview/committee-member-preview.component';
import { NewCommitteDialogComponent } from './new-committee-dialog/new-committe-dialog.component';

import { DialogsService } from '../../../../../shared/components/ui/confirm-dialog/confirmation-dialog.service';
import { PermissionsManagerService } from '../../../../../core/permissions/permissions-manager.service';
import { MessagesService } from '../../../../../shared/components/ui/snackbars/messages.service';
import { LayoutService } from '../../../../../core/services/layout.service';
import { CommitteesService } from '../committees.service';

import {
  Resources,
  Action,
} from '../../../../../core/permissions/auth-request.model';

import { Committee } from '../../../main.types';
@Component({
  selector: 'committee-item',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    MatCheckboxModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    TranslateModule,
  ],
  template: `
    <mat-card
      class="!flex !flex-row !items-center !justify-between !gap-2 !p-4 !shadow transition hover:!bg-primary/20"
      [ngClass]="{
        '!bg-primary/20': isSelected(),
        '!bg-light': !isSelected()
      }"
    >
      <mat-checkbox
        (change)="toggleSelection($event)"
        [checked]="isSelected()"
        [disabled]="isDisabled()"
        color="primary"
      />
      <div
        class="flex items-center gap-4 grow cursor-pointer"
        (click)="handleNavigationClick()"
      >
        <div>
          <h3 class="text-black my-0 font-bold text-sm">
            {{ committee().name }}
          </h3>

          <p class="text-disabledText text-xs flex gap-1">
            <span>{{ 'MAIN.MESSAGE.COMMITTEE_CREATED_ON' | translate }}</span>
            <span>{{ committee().creationTime | date : 'd-M-yyyy' }}</span>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-1">
        @if (layout.onMobile()) {

        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
        </button>

        <mat-menu #menu="matMenu">
          @for(action of actions; track action) {

          <button mat-menu-item (click)="action.handleClick()">
            <mat-icon
              [ngClass]="action.iconClasses"
              [fontIcon]="action.fontIcon"
            ></mat-icon>

            <span>{{ action.tooltip | translate }}</span>
          </button>
          }
        </mat-menu>

        } @else {

        <!-- Actions -->
        @for(action of actions; track action) {
        <button
          [matTooltip]="action.tooltip | translate"
          (click)="action.handleClick()"
          matTooltipPosition="above"
          mat-icon-button
        >
          <mat-icon [ngClass]="action.iconClasses">
            {{ action.fontIcon }}
          </mat-icon>
        </button>
        } }
      </div>
    </mat-card>
  `,
})
export class CommitteeItemComponent {
  permissionsService = inject(PermissionsManagerService);
  committeeService = inject(CommitteesService);
  dialogService = inject(DialogsService);
  messages = inject(MessagesService);
  layout = inject(LayoutService);
  dialog = inject(MatDialog);
  router = inject(Router);

  committee = input.required<Committee>();
  delete = output<Committee>();
  refresh = output();

  RESOURCE = Resources;
  ACTION = Action;

  isSelected(): boolean {
    return this.committeeService.selection.isSelected(this.committee());
  }

  isDisabled(): boolean {
    return this.committee().canDelete === false;
  }

  toggleSelection(event: MatCheckboxChange) {
    this.committeeService.toggleItem(this.committee());
  }

  showInvitees() {
    this.dialog.open(CommitteeMemberPreviewComponent, {
      data: this.committee(),
      width: this.layout.onMobile() ? '95%' : '60%',
      maxHeight: '600px',
      disableClose: true,
      direction: this.layout.direction(),
    });
  }

  editCommittee() {
    this.permissionsService
      .getDynamicPermissionForActions(this.committee().id, Action.edit)
      .subscribe({
        next: (res) => {
          if (res.results.committee[Action.edit] == false) {
            this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
          } else {
            this.dialog
              .open(NewCommitteDialogComponent, {
                width: this.layout.onMobile() ? '95%' : '45%',
                maxHeight: '80vh',
                direction: this.layout.direction(),
                data: {
                  placeHolder: 'ENTER_COMMITTE_NAME',
                  committee: this.committee(),
                  edit: true,
                },
              })
              .afterClosed()
              .subscribe((data) => {
                if (!data) return;
                this.refresh.emit();
              });
          }
        },
      });
  }

  deleteCommittee(): void {
    this.permissionsService
      .getDynamicPermissionForActions(this.committee().id, Action.delete)
      .subscribe({
        next: (res) => {
          if (res.results.committee[Action.delete] == false) {
            this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
          } else {
            this.delete.emit(this.committee());
          }
        },
      });
  }

  actions = [
    {
      id: 1,
      handleClick: () => this.showInvitees(),
      fontIcon: 'groups',
      iconClasses: '!text-primary',
      tooltip: 'MAIN.LABEL.MEMBERS',
    },
    {
      id: 2,
      handleClick: () => this.editCommittee(),
      fontIcon: 'border_color',
      iconClasses: '!text-primary',
      tooltip: 'GLOBAL.BUTTON.EDIT',
    },
    {
      id: 3,
      handleClick: () => this.deleteCommittee(),
      fontIcon: 'delete_forever',
      iconClasses: '!text-danger',
      tooltip: 'GLOBAL.BUTTON.DELETE',
    },
  ];

  handleNavigationClick() {
    this.permissionsService
      .getDynamicPermissionForActions(this.committee().id, Action.view)
      .subscribe({
        next: (res) => {
          if (res.results.committee[Action.view] == false) {
            this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
          } else {
            this.router.navigate(['/main/committee/details'], {
              queryParams: {
                committeeId: this.committee().id,
              },
            });
          }
        },
      });
  }
}
