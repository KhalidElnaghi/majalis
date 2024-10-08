import { OnChanges, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { PdfCspPolicyService } from '../pdf-csp-policy.service';
import * as i0 from "@angular/core";
export declare class DynamicCssComponent implements OnInit, OnChanges, OnDestroy {
    private renderer;
    private document;
    private platformId;
    private pdfCspPolicyService;
    private nonce?;
    zoom: number;
    width: number;
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    get style(): string;
    constructor(renderer: Renderer2, document: Document, platformId: any, pdfCspPolicyService: PdfCspPolicyService, nonce?: string | null);
    ngOnInit(): void;
    ngOnChanges(): void;
    private injectStyle;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DynamicCssComponent, [null, null, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DynamicCssComponent, "pdf-dynamic-css", never, { "zoom": { "alias": "zoom"; "required": false; }; "width": { "alias": "width"; "required": false; }; }, {}, never, never, false, never>;
}
