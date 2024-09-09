import { DOCUMENT } from '@angular/common';
import { Component, CSP_NONCE, Inject, Optional } from '@angular/core';
import { css } from './colors-css';
import * as i0 from "@angular/core";
import * as i1 from "../../pdf-csp-policy.service";
export class PdfDarkThemeComponent {
    renderer;
    document;
    pdfCspPolicyService;
    nonce;
    constructor(renderer, document, pdfCspPolicyService, nonce) {
        this.renderer = renderer;
        this.document = document;
        this.pdfCspPolicyService = pdfCspPolicyService;
        this.nonce = nonce;
    }
    ngOnInit() {
        this.injectStyle();
    }
    injectStyle() {
        const styles = this.document.createElement('STYLE');
        styles.id = 'pdf-theme-css';
        if (this.nonce) {
            styles.nonce = this.nonce;
        }
        this.pdfCspPolicyService.addTrustedCSS(styles, css);
        this.renderer.appendChild(this.document.head, styles);
    }
    ngOnDestroy() {
        const styles = this.document.getElementById('pdf-theme-css');
        styles?.parentElement?.removeChild(styles);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfDarkThemeComponent, deps: [{ token: i0.Renderer2 }, { token: DOCUMENT }, { token: i1.PdfCspPolicyService }, { token: CSP_NONCE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfDarkThemeComponent, selector: "pdf-dark-theme", ngImport: i0, template: "" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfDarkThemeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-dark-theme', template: "" }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.PdfCspPolicyService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CSP_NONCE]
                }, {
                    type: Optional
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWRhcmstdGhlbWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi90aGVtZS9wZGYtZGFyay10aGVtZS9wZGYtZGFyay10aGVtZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci9zcmMvbGliL3RoZW1lL3BkZi1kYXJrLXRoZW1lL3BkZi1kYXJrLXRoZW1lLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQXFCLFFBQVEsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUVyRyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sY0FBYyxDQUFDOzs7QUFRbkMsTUFBTSxPQUFPLHFCQUFxQjtJQUV0QjtJQUNrQjtJQUNsQjtJQUMrQjtJQUp6QyxZQUNVLFFBQW1CLEVBQ0QsUUFBYSxFQUMvQixtQkFBd0MsRUFDVCxLQUFxQjtRQUhwRCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ0QsYUFBUSxHQUFSLFFBQVEsQ0FBSztRQUMvQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ1QsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7SUFDM0QsQ0FBQztJQUVHLFFBQVE7UUFDYixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVPLFdBQVc7UUFDakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFxQixDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxFQUFFLEdBQUcsZUFBZSxDQUFDO1FBRTVCLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUMzQjtRQUVELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSxXQUFXO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBZ0IsQ0FBQztRQUM1RSxNQUFNLEVBQUUsYUFBYSxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxDQUFDO3dHQTNCVSxxQkFBcUIsMkNBR3RCLFFBQVEsZ0RBRVIsU0FBUzs0RkFMUixxQkFBcUIsc0RDWGxDLEVBQUE7OzRGRFdhLHFCQUFxQjtrQkFOakMsU0FBUzsrQkFDRSxnQkFBZ0I7OzBCQVF2QixNQUFNOzJCQUFDLFFBQVE7OzBCQUVmLE1BQU07MkJBQUMsU0FBUzs7MEJBQUcsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENvbXBvbmVudCwgQ1NQX05PTkNFLCBJbmplY3QsIE9uRGVzdHJveSwgT25Jbml0LCBPcHRpb25hbCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQZGZDc3BQb2xpY3lTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vcGRmLWNzcC1wb2xpY3kuc2VydmljZSc7XG5pbXBvcnQgeyBjc3MgfSBmcm9tICcuL2NvbG9ycy1jc3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZGYtZGFyay10aGVtZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9wZGYtZGFyay10aGVtZS5jb21wb25lbnQuaHRtbCcsXG4gIC8vIHN0eWxlVXJsczogWycuL2NvbG9ycy5zY3NzJywgJy4uL2NvbW1vbi9wcmludC5zY3NzJ10sXG4gIC8vIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIFBkZkRhcmtUaGVtZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueSxcbiAgICBwcml2YXRlIHBkZkNzcFBvbGljeVNlcnZpY2U6IFBkZkNzcFBvbGljeVNlcnZpY2UsXG4gICAgQEluamVjdChDU1BfTk9OQ0UpIEBPcHRpb25hbCgpIHByaXZhdGUgbm9uY2U/OiBzdHJpbmcgfCBudWxsXG4gICkge31cblxuICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pbmplY3RTdHlsZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbmplY3RTdHlsZSgpIHtcbiAgICBjb25zdCBzdHlsZXMgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ1NUWUxFJykgYXMgSFRNTFN0eWxlRWxlbWVudDtcbiAgICBzdHlsZXMuaWQgPSAncGRmLXRoZW1lLWNzcyc7XG5cbiAgICBpZiAodGhpcy5ub25jZSkge1xuICAgICAgc3R5bGVzLm5vbmNlID0gdGhpcy5ub25jZTtcbiAgICB9XG5cbiAgICB0aGlzLnBkZkNzcFBvbGljeVNlcnZpY2UuYWRkVHJ1c3RlZENTUyhzdHlsZXMsIGNzcyk7XG4gICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLmRvY3VtZW50LmhlYWQsIHN0eWxlcyk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3Qgc3R5bGVzID0gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGRmLXRoZW1lLWNzcycpIGFzIEhUTUxFbGVtZW50O1xuICAgIHN0eWxlcz8ucGFyZW50RWxlbWVudD8ucmVtb3ZlQ2hpbGQoc3R5bGVzKTtcbiAgfVxufVxuIiwiIl19