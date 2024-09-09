import { EventEmitter, OnDestroy, TemplateRef } from '@angular/core';
import { PdfThumbnailDrawnEvent } from '../../../events/pdf-thumbnail-drawn-event';
import * as i0 from "@angular/core";
export declare class PdfSidebarContentComponent implements OnDestroy {
    customThumbnail: TemplateRef<any> | undefined;
    hideSidebarToolbar: boolean;
    mobileFriendlyZoomScale: number;
    defaultThumbnail: TemplateRef<any>;
    private linkService;
    thumbnailDrawn: EventEmitter<PdfThumbnailDrawnEvent>;
    get top(): string;
    constructor();
    ngOnDestroy(): void;
    pdfThumbnailGeneratorReady(): boolean;
    private createThumbnail;
    onKeyDown(event: KeyboardEvent): void;
    private replacePageNuberEverywhere;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfSidebarContentComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfSidebarContentComponent, "pdf-sidebar-content", never, { "customThumbnail": { "alias": "customThumbnail"; "required": false; }; "hideSidebarToolbar": { "alias": "hideSidebarToolbar"; "required": false; }; "mobileFriendlyZoomScale": { "alias": "mobileFriendlyZoomScale"; "required": false; }; }, { "thumbnailDrawn": "thumbnailDrawn"; }, never, never, false, never>;
}
