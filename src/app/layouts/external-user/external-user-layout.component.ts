import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TopBarComponent } from '../../shared/components/ui/top-bar/top-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { LayoutService } from '../../core/services/layout.service';
import { ExternalTopBarComponent } from '../../modules/external-user/components/top-bar/top-bar.component';

@Component({
  selector: 'app-external-user-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,

    MatToolbarModule,
    MatSidenavModule,
    TopBarComponent,
    MatButtonModule,

    ExternalTopBarComponent,
  ],
  template: ` <external-top-bar />
    <div class=" bg-light h-[calc(100vh_-_4rem)] p-2">
      <div class="shadow-md rounded-2xl h-full bg-white overflow-scroll p-2">
        <router-outlet />
      </div>
    </div>`,
})
export default class ExternalUserLayoutComponent {
  protected layout = inject(LayoutService);
}
