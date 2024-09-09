import { RouterLink, RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

import {
  SideMenuComponent,
  sideMenuItem,
} from '../../shared/components/ui/side-menu/side-menu.component';
import { TopBarComponent } from '../../shared/components/ui/top-bar/top-bar.component';
import { appMenu } from '../../shared/components/ui/side-menu/app-menu';

import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-main-user-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    SideMenuComponent,
    TopBarComponent,
    MatButtonModule,
  ],
  template: ` <top-bar />
    <mat-drawer-container [dir]="layout.direction()" autosize>
      <mat-drawer
        (openedChange)="this.layout.isMenuOpen.set($event)"
        [mode]="layout.onMobile() ? 'over' : 'side'"
        [opened]="layout.isMenuOpen()"
        class="!rounded-e-3xl !my-4 !shadow-md"
      >
        <side-menu [menuItems]="menu" />
      </mat-drawer>

      <mat-drawer-content>
        <div class="p-4 h-[calc(100vh_-_4rem)]">
          <div
            class="shadow-md rounded-3xl h-full p-4 bg-white overflow-scroll"
          >
            <router-outlet />
          </div>
        </div>
      </mat-drawer-content>
    </mat-drawer-container>`,
})
export default class MainUserLayoutComponent {
  protected layout = inject(LayoutService);

  protected menu: sideMenuItem[] = appMenu;
}
