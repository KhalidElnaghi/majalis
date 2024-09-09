import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

import {
  NgxExtendedPdfViewerModule,
  PageRenderedEvent,
} from 'ngx-extended-pdf-viewer';

import { TranslateModule } from '@ngx-translate/core';

import { AuthenticationService } from '../../../../core/services/authentication.service';
import { MediaService } from '../../../../core/services/media.service';

@Component({
  selector: 'pdf-viewer',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule, TranslateModule, MatIcon, MatTooltip],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngx-extended-pdf-viewer
      [src]="src"
      [textLayer]="true"
      [httpHeaders]="headers"
      [authorization]="token"
      [showToolbar]="true"
      [showSidebarButton]="true"
      [showFindButton]="false"
      [showPagingButtons]="true"
      [showZoomButtons]="false"
      [showPresentationModeButton]="true"
      [showOpenFileButton]="false"
      [showPrintButton]="true"
      [showDownloadButton]="true"
      [showSecondaryToolbarButton]="false"
      [showHandToolButton]="false"
      [showScrollingButton]="false"
      [showSpreadButton]="false"
      [showPropertiesButton]="false"
      [showTextEditor]="false"
      [showStampEditor]="false"
      [showDrawEditor]="false"
      showRotateButton="always-visible"
      (pageRendered)="handlePageLoaded($event)"
    />
  `,
})
export class PdfViewerComponent {
  dialogData = inject<{ url: string }>(MAT_DIALOG_DATA);
  authService = inject(AuthenticationService);
  mediaService = inject(MediaService);

  headers: any;

  src!: URL;
  token = this.authService.accessToken;

  ngOnInit(): void {
    this.src = this.mediaService.getStreamURL(this.dialogData.url);
    this.headers = {
      TenantId: this.authService.userData['tenantid'],
    };
  }

  async handlePageLoaded($event: PageRenderedEvent) {}
}
