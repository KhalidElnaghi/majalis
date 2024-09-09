import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { LayoutService } from '../../../../core/services/layout.service';

@Component({
  selector: 'page-header',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="w-full flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <h1 class="font-semibold text-xl">
          {{ titles().title | translate }}
        </h1>

        <div>
          @if(!layout.onMobile()){
          <ng-content select="[breadcrumb]"></ng-content>
          }
        </div>
      </div>

      <div class="flex items-center justify-between">
        @if(titles().subTitle){
        <h3 class="font-semibold text-sm">
          {{ titles().subTitle | translate }}
        </h3>
        }

        <div>
          <ng-content select="[add-button]"></ng-content>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  layout = inject(LayoutService);

  titles = input.required<{ title: string; subTitle: string }>();
}
