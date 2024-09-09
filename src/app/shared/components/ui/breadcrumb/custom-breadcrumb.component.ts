import { RouterLink } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

import { LayoutService } from '../../../../core/services/layout.service';

@Component({
  selector: 'custom-breadcrumb',
  standalone: true,
  imports: [MatListModule, MatIcon, RouterLink, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: ` <mat-nav-list disableRipple class="!flex !items-center !w-fit">
    @for(route of pagesRoutes(); track route; let last = $last){

    <mat-list-item
      class="!w-fit !h-fit !p-1 !rounded-full"
      [queryParams]="route.queryParams"
      [routerLink]="route.path"
      [disabled]="last"
    >
      <a class="!text-black !mx-2 !text-sm !font-normal" matListItemTitle>
        {{ route.title | translate }}
      </a>

      @if(route.icon){
      <mat-icon matListItemIcon class="!mx-2">{{ route.icon }}</mat-icon>
      }
    </mat-list-item>

    @if(!last){
    <mat-icon class="!text-black">
      {{ layout.direction() == 'ltr' ? 'navigate_next' : 'chevron_left' }}
    </mat-icon>
    } }
  </mat-nav-list>`,
})
export class CustomBreadcrumbComponent {
  layout = inject(LayoutService);

  pagesRoutes = input.required<BreadcrumbStructure>();
}

export type BreadcrumbStructure = {
  title: string;
  path?: string;
  icon?: string;
  queryParams?: { [key: string]: any };
}[];
