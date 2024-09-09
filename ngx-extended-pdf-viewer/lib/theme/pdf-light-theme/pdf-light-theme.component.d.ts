import { OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { PdfCspPolicyService } from '../../pdf-csp-policy.service';
import * as i0 from "@angular/core";
export declare class PdfLightThemeComponent implements OnInit, OnDestroy {
    private renderer;
    private document;
    private pdfCspPolicyService;
    private nonce?;
    constructor(renderer: Renderer2, document: any, pdfCspPolicyService: PdfCspPolicyService, nonce?: string | null);
    ngOnInit(): void;
    private injectStyle;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfLightThemeComponent, [null, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfLightThemeComponent, "pdf-light-theme", never, {}, {}, never, never, false, never>;
}
