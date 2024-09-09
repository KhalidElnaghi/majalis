import { Injectable, TemplateRef, inject } from '@angular/core';

import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';

import { CustomDialogComponent } from './confirmation-dialog.component';

import { LayoutService } from '../../../../core/services/layout.service';

@Injectable({
  providedIn: 'root',
})
export class DialogsService {
  private layout = inject(LayoutService);
  private dialog = inject(MatDialog);

  open = (data: DialogConfig) => {
    const dialogRef = this.dialog.open(CustomDialogComponent, {
      data: data,
      width: data.styles?.width
        ? data.styles.width
        : this.layout.onMobile()
        ? '95%'
        : '45%',
      height: data.styles?.height ? data.styles.height : '',
      disableClose: true,
      autoFocus: true,
      enterAnimationDuration: 250,
      exitAnimationDuration: 200,
      panelClass: `dialog-${data.type}`,
      direction: this.layout.direction(),
      backdropClass: data.styles?.backdropClass ?? ['backdrop-blur-sm'],
      position: data.styles?.position,
    });

    return dialogRef.afterClosed().pipe(filter((value) => !!value));
  };
}

export type DialogConfig = {
  type: 'confirm' | 'success' | 'error' | 'warn' | 'delete' | 'form';
  title: string;
  message: string;
  value: any;
  closeButtonTitle: string;
  confirmButtonTitle?: string;
  customTitle?: TemplateRef<any>;
  customContent?: TemplateRef<any>;
  customActions?: TemplateRef<any>;
  styles?: {
    width?: string;
    height?: string;
    position?: DialogPosition;
    backdropClass?: string[];
  };
};

export enum actionStatusIcon {
  success = 'check_circle_outline',
  error = 'error_outline',
  confirm = 'task_alt',
  form = 'description',
  delete = 'delete_forever',
  warn = 'warning',
  info = 'info',
}
