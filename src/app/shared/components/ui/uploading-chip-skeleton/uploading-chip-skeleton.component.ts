import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'uploading-chip-skeleton',
  standalone: true,
  imports: [TranslateModule, MatChip, MatIcon, MatProgressSpinner, MatTooltip],
  template: `
    <mat-chip>
      <div class="flex items-center justify-center gap-2">
        <div class="grid place-items-center relative">
          <mat-progress-spinner
            diameter="25"
            mode="determinate"
            class="!col-span-full !row-span-full"
            [value]="fileData().progress"
          />
          <mat-icon
            [matTooltip]="'GLOBAL.BUTTON.CANCEL' | translate"
            (click)="cancelUpload.emit(true)"
            class="!cursor-pointer !text-black !text-sm !col-span-full !row-span-full !mx-auto !flex !items-center !justify-center !relative !z-50"
            >close</mat-icon
          >
        </div>

        <span class="truncate max-w-24"> {{ fileData().name }} </span>

        <mat-icon disabled color="warn">
          {{
            fileData().type.split('/')[1] == 'pdf' ? 'picture_as_pdf' : 'image'
          }}
        </mat-icon>
      </div>
    </mat-chip>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadingChipSkeletonComponent {
  fileData = input.required<{
    name: string;
    type: string;
    progress: number;
  }>();

  cancelUpload = output<unknown>();
}
