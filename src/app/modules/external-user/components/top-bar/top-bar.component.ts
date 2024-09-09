import { Component, inject } from '@angular/core';

import { MatProgressBar } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { LayoutService } from '../../../../core/services/layout.service';

@Component({
  selector: 'external-top-bar',
  standalone: true,
  imports: [MatToolbarModule, MatProgressBar],
  template: `
    <mat-toolbar
      class="flex justify-between items-center shadow-md relative z-[10] transition-colors backdrop-blur-md"
    >
      <div
        class="flex gap-8 items-center justify-between mx-2 sm:w-fit md:w-72"
      >
        <img src="./assets/images/ole5.png" alt="Logo" class="w-20 mx-auto" />
      </div>
    </mat-toolbar>

    @if(layout.isLoading()) {
    <mat-progress-bar mode="indeterminate" />
    }
  `,
})
export class ExternalTopBarComponent {
  layout = inject(LayoutService);
}
