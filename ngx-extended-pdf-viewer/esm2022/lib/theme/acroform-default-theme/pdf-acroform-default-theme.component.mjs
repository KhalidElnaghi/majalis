import { DOCUMENT } from '@angular/common';
import { Component, CSP_NONCE, Inject, Optional } from '@angular/core';
import { css } from './pdf-acroform-default-colors-css';
import * as i0 from "@angular/core";
import * as i1 from "../../pdf-csp-policy.service";
export class PdfAcroformDefaultThemeComponent {
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
        styles.id = 'pdf-acroform-css';
        if (this.nonce) {
            styles.nonce = this.nonce;
        }
        this.pdfCspPolicyService.addTrustedCSS(styles, css);
        this.renderer.appendChild(this.document.head, styles);
    }
    ngOnDestroy() {
        const styles = this.document.getElementById('pdf-acroform-css');
        styles?.parentElement?.removeChild(styles);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfAcroformDefaultThemeComponent, deps: [{ token: i0.Renderer2 }, { token: DOCUMENT }, { token: i1.PdfCspPolicyService }, { token: CSP_NONCE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfAcroformDefaultThemeComponent, selector: "pdf-acroform-default-theme", ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfAcroformDefaultThemeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-acroform-default-theme', template: '' }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.PdfCspPolicyService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CSP_NONCE]
                }, {
                    type: Optional
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWFjcm9mb3JtLWRlZmF1bHQtdGhlbWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi90aGVtZS9hY3JvZm9ybS1kZWZhdWx0LXRoZW1lL3BkZi1hY3JvZm9ybS1kZWZhdWx0LXRoZW1lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFxQixRQUFRLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFFckcsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLG1DQUFtQyxDQUFDOzs7QUFheEQsTUFBTSxPQUFPLGdDQUFnQztJQUVqQztJQUNrQjtJQUNsQjtJQUMrQjtJQUp6QyxZQUNVLFFBQW1CLEVBQ0QsUUFBYSxFQUMvQixtQkFBd0MsRUFDVCxLQUFxQjtRQUhwRCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ0QsYUFBUSxHQUFSLFFBQVEsQ0FBSztRQUMvQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ1QsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7SUFDM0QsQ0FBQztJQUVHLFFBQVE7UUFDYixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVPLFdBQVc7UUFDakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFxQixDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxFQUFFLEdBQUcsa0JBQWtCLENBQUM7UUFFL0IsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2QsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQzNCO1FBRUQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLFdBQVc7UUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQWdCLENBQUM7UUFDL0UsTUFBTSxFQUFFLGFBQWEsRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0MsQ0FBQzt3R0EzQlUsZ0NBQWdDLDJDQUdqQyxRQUFRLGdEQUVSLFNBQVM7NEZBTFIsZ0NBQWdDLGtFQVRqQyxFQUFFOzs0RkFTRCxnQ0FBZ0M7a0JBWDVDLFNBQVM7K0JBQ0UsNEJBQTRCLFlBQzVCLEVBQUU7OzBCQVlULE1BQU07MkJBQUMsUUFBUTs7MEJBRWYsTUFBTTsyQkFBQyxTQUFTOzswQkFBRyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ29tcG9uZW50LCBDU1BfTk9OQ0UsIEluamVjdCwgT25EZXN0cm95LCBPbkluaXQsIE9wdGlvbmFsLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBkZkNzcFBvbGljeVNlcnZpY2UgfSBmcm9tICcuLi8uLi9wZGYtY3NwLXBvbGljeS5zZXJ2aWNlJztcbmltcG9ydCB7IGNzcyB9IGZyb20gJy4vcGRmLWFjcm9mb3JtLWRlZmF1bHQtY29sb3JzLWNzcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BkZi1hY3JvZm9ybS1kZWZhdWx0LXRoZW1lJyxcbiAgdGVtcGxhdGU6ICcnLFxuICBzdHlsZVVybHM6IFtcbiAgICAvLyAgICAnLi9wZGYtYWNyb2Zvcm0tZGVmYXVsdC1jb2xvcnMuc2NzcycsXG4gICAgLy8gICAgJy4uL2NvbW1vbi9hbm5vdGF0aW9uLWxheWVyLWJ1aWxkZXIuc2NzcycsXG4gICAgLy8gICAgJy4uL2NvbW1vbi94ZmFfbGF5ZXJfYnVpbGRlci5zY3NzJyxcbiAgICAvLyAgICAnLi4vY29tbW9uL2Fubm90YXRpb25fZWRpdG9yX2xheWVyX2J1aWxkZXIuY3NzJyxcbiAgXSxcbiAgLy8gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIFBkZkFjcm9mb3JtRGVmYXVsdFRoZW1lQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55LFxuICAgIHByaXZhdGUgcGRmQ3NwUG9saWN5U2VydmljZTogUGRmQ3NwUG9saWN5U2VydmljZSxcbiAgICBASW5qZWN0KENTUF9OT05DRSkgQE9wdGlvbmFsKCkgcHJpdmF0ZSBub25jZT86IHN0cmluZyB8IG51bGxcbiAgKSB7fVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmluamVjdFN0eWxlKCk7XG4gIH1cblxuICBwcml2YXRlIGluamVjdFN0eWxlKCkge1xuICAgIGNvbnN0IHN0eWxlcyA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnU1RZTEUnKSBhcyBIVE1MU3R5bGVFbGVtZW50O1xuICAgIHN0eWxlcy5pZCA9ICdwZGYtYWNyb2Zvcm0tY3NzJztcblxuICAgIGlmICh0aGlzLm5vbmNlKSB7XG4gICAgICBzdHlsZXMubm9uY2UgPSB0aGlzLm5vbmNlO1xuICAgIH1cblxuICAgIHRoaXMucGRmQ3NwUG9saWN5U2VydmljZS5hZGRUcnVzdGVkQ1NTKHN0eWxlcywgY3NzKTtcbiAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMuZG9jdW1lbnQuaGVhZCwgc3R5bGVzKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBzdHlsZXMgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwZGYtYWNyb2Zvcm0tY3NzJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgc3R5bGVzPy5wYXJlbnRFbGVtZW50Py5yZW1vdmVDaGlsZChzdHlsZXMpO1xuICB9XG59XG4iXX0=