import * as i0 from "@angular/core";
export declare class PdfCspPolicyService {
    private sanitizer;
    constructor();
    init(): void;
    addTrustedCSS(styles: HTMLElement, css: string): void;
    addTrustedJavaScript(scripts: HTMLScriptElement, css: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfCspPolicyService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PdfCspPolicyService>;
}
