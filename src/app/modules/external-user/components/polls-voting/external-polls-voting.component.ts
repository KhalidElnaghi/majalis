import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'external-polls-voting',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="flex flex-col gap-5 text-black">
      @for(topic of topics(); track topic){ @if(topic.choices.length >0){
      <div class="flex flex-col border border-1 p-3 rounded gap-4">
        <div class="flex items-center max-sm:flex-col max-sm:items-start">
          <p class="w-[15%] text-gray-500">
            {{ 'EXTERNAL.LABEL.POLL' | translate }}
          </p>
          <p class="font-bold max-sm:text-sm">{{ topic.title }}</p>
        </div>
        @if(topic.choices.length >0){
        <div class="flex items-start max-sm:flex-col">
          <p class="w-[15%] text-gray-500">
            {{ 'EXTERNAL.LABEL.OPTIONS' | translate }}
          </p>
          <div class="flex flex-col flex-grow max-sm:!w-full">
            @for(choice of topic.choices; track choice){
            <div class="flex items-center gap-3 ">
              <p class="w-[15%]  text-sm max-sm:min-w-[30%] max-sm:text-[12px]">
                {{ choice.title }}
              </p>
            </div>
            }
          </div>
        </div>
        }
      </div>
      } }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalPollsVotingComponent {
  topics = input<any[]>();
}
