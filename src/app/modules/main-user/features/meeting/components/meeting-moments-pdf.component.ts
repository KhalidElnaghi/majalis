import { DatePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { getTransformedDate } from './meeting-info-step/meeting-info-step.config';

@Component({
  selector: 'meeting-moments-pdf',
  standalone: true,
  imports: [TranslateModule, NgClass],
  template: `
    <div id="pdf-container">
      <div id="intro" class="container mx-auto w-[210mm] p-5">
        <div class="flex justify-between items-center">
          <img src="./assets/images/ole5.png" class="w-20" alt="Logo" />
          <p>
            {{ getTransformedDate(data().date, datePipe, 'dd-MM-yyyy') }}
            :التاريخ
          </p>
        </div>
        <div class="content">
          <p class="text-center mb-8">بسم الله الرحمن الرحيم</p>
          <p class="text-center m-2 font-bold mb-12">
            محضر اجتماع {{ data().title }}
            <br />
            لجنة {{ data().committeeName }}
            <br />
            المنعقد
            {{ getTransformedDate(data().date, datePipe, 'dd-MM-yyyy') }}
          </p>
          <p class="m-2 font-bold">
            بناءً على الاجتماع عن بعد في تمام الساعة
            {{ getTransformedDate(data().date, datePipe, 'hh:mm a') }} <br />
            برئاسة رئيس اللجنة الأستاذ:{{ data().committeeChairman }}
          </p>
          <p class="m-2 font-bold">
            تم مناقشة بعض النقاط التي تخص اللجنة وهي<br />
            @for(line of data().recordText;track line){
            {{ line }} <br />
            }
          </p>
          <p class="mt-12 text-end">
            رئيس اللجنة
            <br />
            {{ data().committeeChairman }}
          </p>
        </div>
      </div>
      <div id="attendance" class="container mx-auto w-[210mm] p-5">
        <div class="flex justify-between items-center">
          <img src="./assets/images/ole5.png" class="w-20" alt="Logo" />
          <p>
            {{ getTransformedDate(data().date, datePipe, 'dd-MM-yyyy') }}
            :التاريخ
          </p>
        </div>
        <div class="content">
          <p class="text-center mb-8">بسم الله الرحمن الرحيم</p>
          <p class="text-center m-2 font-bold mb-12">
            محضر اجتماع {{ data().title }}
            <br />
            لجنة {{ data().committeeName }}
            <br />
            المنعقد
            {{ getTransformedDate(data().date, datePipe, 'dd-MM-yyyy') }}
          </p>
          <p class="font-bold">كشف الحضور:</p>
          <table class="m-auto w-[85%] mt-2 border-collapse">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="p-2 text-center">الاسم</th>
                <th class="p-2 text-center">الحضور</th>
              </tr>
            </thead>
            <tbody class="bg-gray-100 border-t-2 border-b-2 border-gray-300">
              @for(invitee of data().invitees;track invitee){
              <tr class="border-b border-gray-200">
                <td class="p-2 text-center">{{ invitee.name }}</td>
                <td class="p-2 text-center">
                  @if(data().attendedInvitees.includes(invitee.inviteeId)){
                  <span class="text-green-500">✔</span>
                  }@else{
                  <span class="text-red-500">✖</span>
                  }
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
      <div id="voting" class="container mx-auto w-[210mm] p-5">
        <div class="flex justify-between items-center">
          <img src="./assets/images/ole5.png" class="w-20" alt="Logo" />
          <p>
            {{ getTransformedDate(data().date, datePipe, 'dd-MM-yyyy') }}
            :التاريخ
          </p>
        </div>
        <div class="content">
          <p class="text-center mb-8">بسم الله الرحمن الرحيم</p>
          <p class="text-center m-2 font-bold mb-12">
            محضر اجتماع {{ data().title }}
            <br />
            لجنة {{ data().committeeName }}
            <br />
            المنعقد
            {{ getTransformedDate(data().date, datePipe, 'dd-MM-yyyy') }}
          </p>
          @for(vote of data().votes;track vote) {
          <div
            class="w-4/5 mx-auto p-5 bg-white rounded-lg border border-gray-200 flex flex-col"
          >
            <div class="flex my-2">
              <p class="text-gray-500 basis-[15%] font-bold">المحور</p>
              <p class="font-bold basis-[85%]">
                {{ vote.title }}
              </p>
            </div>
            <div class="flex my-2">
              <p class="text-gray-500 basis-[15%] font-bold">الخيارات</p>
              <div class="font-bold flex flex-col basis-[85%] gap-5">
                @for(choice of vote.choices;track choice) {
                <div class="flex justify-between items-center">
                  <div class="font-bold min-w-[120px] overflow-visible">
                    {{ choice.title }}
                  </div>
                  <div
                    [ngClass]="{
                      'bg-status-success/30': $first,
                    }"
                    class="h-2 rounded-full mx-2 flex-1 bg-status-primary/30"
                  >
                    <div
                      class="h-[13px] rounded-full bg-status-primary"
                      [ngClass]="{
                        'bg-status-success': $first,
                      }"
                      [style]="{
                        width: choice.percentage + '%',
                      }"
                    ></div>
                  </div>
                  <div>{{ roundValue(choice.percentage) }} %</div>
                </div>
                }
              </div>
            </div>
            <div class="flex my-2">
              <p class="text-gray-500 basis-[15%] font-bold">المجموع</p>
              <p class="font-bold basis-[85%]">{{ vote.totalVoted }} صوت</p>
            </div>
          </div>
          }
          <p class="mt-12 text-end">
            رئيس اللجنة
            <br />
            {{ data().committeeChairman }}
          </p>
        </div>
      </div>
    </div>
  `,
  styles: `
    #pdf-container {
      direction: rtl;
      text-align: right;
      margin: 0;
      padding: 0;
      display: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingMomentsPdfComponent {
  data = input.required<any>();
  datePipe = inject(DatePipe);

  getTransformedDate = getTransformedDate;

  roundValue(value: number): number {
    return Math.round(value);
  }
}
