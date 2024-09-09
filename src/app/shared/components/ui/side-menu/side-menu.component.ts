import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { TranslateModule } from '@ngx-translate/core';

import { LayoutService } from '../../../../core/services/layout.service';

@Component({
  selector: 'side-menu',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule,

    MatExpansionModule,
    MatTooltipModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  template: `
    <mat-nav-list class="!px-1 !transition-all !w-[18rem]" disableRipple>
      <ng-container
        *ngTemplateOutlet="dynamicMenu; context: { $implicit: menuItems() }"
      ></ng-container>
      <ng-template #dynamicMenu let-items>
        <mat-accordion>
          @for (item of items; track item) {

          <!-- single nav item -->
          @if (!item.children && isLinkVisible(item.role)) {
          <mat-list-item
            class="!px-3 !my-1 !rounded-full"
            [ngClass]="{
              '!mx-3': !item.icon,
              '!bg-primary/15': link.isActive
            }"
            [activated]="link.isActive"
            #link="routerLinkActive"
            [routerLink]="item.path"
            routerLinkActive
            (click)="handleItemClick()"
          >
            @if(item.icon){
            <mat-icon
              matListItemIcon
              [ngClass]="{
                '!text-primary': link.isActive,
                '!text-black': !link.isActive
              }"
              class="!mx-4"
              [fontSet]="
                link.isActive ? 'material-icons' : 'material-icons-outlined'
              "
            >
              {{ item.icon }}
            </mat-icon>
            }

            <!-- item title -->
            <span
              matListItemTitle
              class="!font-medium !text-sm !text-black"
              [ngClass]="{
                '!text-primary': link.isActive,
                '!text-black': !link.isActive
              }"
            >
              {{ item.title | translate }}
            </span>
          </mat-list-item>
          }

          <!-- Nested Menu items -->
          @if (item.children && isLinkVisible(item.role)) {
          <mat-expansion-panel class="!shadow-none !bg-transparent">
            <mat-expansion-panel-header class="!px-0 !my-1 !bg-transparent">
              <mat-list-item
                class="!px-3 !rounded-full"
                [ngClass]="{
                  '!mx-3': !item.icon
                }"
                (click)="handleItemClick()"
              >
                @if(item.icon){
                <mat-icon
                  class="!mx-4 !text-black"
                  fontSet="material-icons"
                  matListItemIcon
                >
                  {{ item.icon }}
                </mat-icon>
                }

                <!-- item title -->
                <span
                  class="!font-medium !text-sm !text-black"
                  matListItemTitle
                >
                  {{ item.title | translate }}
                </span>
              </mat-list-item>
            </mat-expansion-panel-header>

            <!-- Dynamic rebuild for the menu in case of nested items -->
            <ng-container
              *ngTemplateOutlet="
                dynamicMenu;
                context: { $implicit: item.children }
              "
            ></ng-container>
          </mat-expansion-panel>
          } }
        </mat-accordion>
      </ng-template>
    </mat-nav-list>
  `,
})
export class SideMenuComponent {
  protected layout = inject(LayoutService);

  menuItems = input.required<sideMenuItem[]>();

  protected isLinkVisible(role: string[]) {
    return true;
  }

  handleItemClick() {
    if (this.layout.onMobile()) {
      this.layout.isMenuOpen.set(false);
    }
  }
}

export type sideMenuItem = {
  path?: string;
  title: string;
  children?: sideMenuItem[];
  roles?: string[];
  icon?: string;
};
