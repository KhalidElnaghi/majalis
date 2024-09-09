import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  ChangeDetectionStrategy,
  contentChild,
  TemplateRef,
  Component,
  input,
} from '@angular/core';

import { MatIconButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'action-menu',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    RouterLink,
    NgStyle,

    MatMenuModule,
    MatIconButton,
    MatIcon,
  ],
  template: `
    <!-- Menu Trigger -->
    <button
      [ngStyle]="{ color: menuIconColor() }"
      [matMenuTriggerFor]="menu"
      mat-icon-button
    >
      <mat-icon>{{ menuIcon() || 'more_horiz' }}</mat-icon>
    </button>

    <mat-menu #menu="matMenu" class="!px-2 !rounded-xl">
      @for(item of menuItems(); track item){

      <ng-container
        *ngTemplateOutlet="
          customMenuItem() || defaultMenuItem;
          context: { $implicit: item }
        "
      ></ng-container>

      }
    </mat-menu>

    <ng-template #defaultMenuItem let-item>
      <button
        [disabled]="item.active && !item.active(entity())"
        (click)="item.action && item.action(entity())"
        [routerLink]="item.route"
        mat-menu-item
      >
        {{ item.label }}

        @if(item.icon){
        <mat-icon>{{ item.icon }}</mat-icon>
        }
      </button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionMenuComponent {
  menuItems = input.required<MenuItem<unknown>[]>();
  entity = input.required<unknown>();

  menuIconColor = input<string>();
  menuIcon = input<string>();

  customMenuItem = contentChild<TemplateRef<unknown>>('customItem');
}

export type MenuItem<T> = {
  label: string;
  icon?: string;
  route?: string;
  action?: (data: T) => void;
  active?: (data: T) => boolean;
};
