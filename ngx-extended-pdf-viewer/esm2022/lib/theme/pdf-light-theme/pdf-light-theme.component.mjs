import { DOCUMENT } from '@angular/common';
import { Component, CSP_NONCE, Inject, Optional } from '@angular/core';
import { css } from './colors-css';
import * as i0 from "@angular/core";
import * as i1 from "../../pdf-csp-policy.service";
export class PdfLightThemeComponent {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfLightThemeComponent, deps: [{ token: i0.Renderer2 }, { token: DOCUMENT }, { token: i1.PdfCspPolicyService }, { token: CSP_NONCE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfLightThemeComponent, selector: "pdf-light-theme", ngImport: i0, template: "" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfLightThemeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-light-theme', template: "" }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.PdfCspPolicyService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CSP_NONCE]
                }, {
                    type: Optional
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWxpZ2h0LXRoZW1lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvdGhlbWUvcGRmLWxpZ2h0LXRoZW1lL3BkZi1saWdodC10aGVtZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci9zcmMvbGliL3RoZW1lL3BkZi1saWdodC10aGVtZS9wZGYtbGlnaHQtdGhlbWUuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBcUIsUUFBUSxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBRXJHLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxjQUFjLENBQUM7OztBQVFuQyxNQUFNLE9BQU8sc0JBQXNCO0lBRXZCO0lBQ2tCO0lBQ2xCO0lBQytCO0lBSnpDLFlBQ1UsUUFBbUIsRUFDRCxRQUFhLEVBQy9CLG1CQUF3QyxFQUNULEtBQXFCO1FBSHBELGFBQVEsR0FBUixRQUFRLENBQVc7UUFDRCxhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQy9CLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDVCxVQUFLLEdBQUwsS0FBSyxDQUFnQjtJQUMzRCxDQUFDO0lBRUcsUUFBUTtRQUNiLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRU8sV0FBVztRQUNqQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQXFCLENBQUM7UUFDeEUsTUFBTSxDQUFDLEVBQUUsR0FBRyxlQUFlLENBQUM7UUFFNUIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2QsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQzNCO1FBRUQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLFdBQVc7UUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFnQixDQUFDO1FBQzVFLE1BQU0sRUFBRSxhQUFhLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLENBQUM7d0dBM0JVLHNCQUFzQiwyQ0FHdkIsUUFBUSxnREFFUixTQUFTOzRGQUxSLHNCQUFzQix1RENYbkMsRUFBQTs7NEZEV2Esc0JBQXNCO2tCQU5sQyxTQUFTOytCQUNFLGlCQUFpQjs7MEJBUXhCLE1BQU07MkJBQUMsUUFBUTs7MEJBRWYsTUFBTTsyQkFBQyxTQUFTOzswQkFBRyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ29tcG9uZW50LCBDU1BfTk9OQ0UsIEluamVjdCwgT25EZXN0cm95LCBPbkluaXQsIE9wdGlvbmFsLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBkZkNzcFBvbGljeVNlcnZpY2UgfSBmcm9tICcuLi8uLi9wZGYtY3NwLXBvbGljeS5zZXJ2aWNlJztcbmltcG9ydCB7IGNzcyB9IGZyb20gJy4vY29sb3JzLWNzcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BkZi1saWdodC10aGVtZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9wZGYtbGlnaHQtdGhlbWUuY29tcG9uZW50Lmh0bWwnLFxuICAvLyBzdHlsZVVybHM6IFsnLi9jb2xvcnMuc2NzcycsICcuLi9jb21tb24vcHJpbnQuc2NzcyddLFxuICAvLyBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBQZGZMaWdodFRoZW1lQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55LFxuICAgIHByaXZhdGUgcGRmQ3NwUG9saWN5U2VydmljZTogUGRmQ3NwUG9saWN5U2VydmljZSxcbiAgICBASW5qZWN0KENTUF9OT05DRSkgQE9wdGlvbmFsKCkgcHJpdmF0ZSBub25jZT86IHN0cmluZyB8IG51bGxcbiAgKSB7fVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmluamVjdFN0eWxlKCk7XG4gIH1cblxuICBwcml2YXRlIGluamVjdFN0eWxlKCkge1xuICAgIGNvbnN0IHN0eWxlcyA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnU1RZTEUnKSBhcyBIVE1MU3R5bGVFbGVtZW50O1xuICAgIHN0eWxlcy5pZCA9ICdwZGYtdGhlbWUtY3NzJztcblxuICAgIGlmICh0aGlzLm5vbmNlKSB7XG4gICAgICBzdHlsZXMubm9uY2UgPSB0aGlzLm5vbmNlO1xuICAgIH1cblxuICAgIHRoaXMucGRmQ3NwUG9saWN5U2VydmljZS5hZGRUcnVzdGVkQ1NTKHN0eWxlcywgY3NzKTtcbiAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMuZG9jdW1lbnQuaGVhZCwgc3R5bGVzKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBzdHlsZXMgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwZGYtdGhlbWUtY3NzJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgc3R5bGVzPy5wYXJlbnRFbGVtZW50Py5yZW1vdmVDaGlsZChzdHlsZXMpO1xuICB9XG59XG4iLCIiXX0=