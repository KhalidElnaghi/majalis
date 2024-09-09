import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../pdf-shy-button/pdf-shy-button.component";
import * as i2 from "../../responsive-visibility";
export class PdfDocumentPropertiesComponent {
    show = true;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfDocumentPropertiesComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfDocumentPropertiesComponent, selector: "pdf-document-properties", inputs: { show: "show" }, ngImport: i0, template: "<pdf-shy-button\n  title=\"Document Properties\u2026\"\n  primaryToolbarId=\"documentProperties\"\n  [cssClass]=\"show | responsiveCSSClass : 'always-in-secondary-menu'\"\n  l10nId=\"pdfjs-document-properties-button\"\n  l10nLabel=\"pdfjs-document-properties-button-label\"\n  [order]=\"5000\"\n  eventBusName=\"documentproperties\"\n  [closeOnClick]=\"true\"\n  image=\"<svg class='pdf-margin-top-3px' width='16px' height='16px' viewBox='0 0 16 16'><path fill='currentColor' d='M8 16a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8zM8 2a6 6 0 1 0 6 6 6.006 6.006 0 0 0-6-6z' /><path fill='currentColor' d='M8 7a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1z' /><circle fill='currentColor' cx='8' cy='5' r='1.188' /></svg>\"\n>\n</pdf-shy-button>\n", styles: ["button{padding:0;margin-top:0;margin-bottom:0}\n"], dependencies: [{ kind: "component", type: i1.PdfShyButtonComponent, selector: "pdf-shy-button", inputs: ["primaryToolbarId", "secondaryMenuId", "cssClass", "eventBusName", "l10nId", "l10nLabel", "title", "toggled", "disabled", "order", "action", "closeOnClick", "onlySecondaryMenu", "image"] }, { kind: "pipe", type: i2.ResponsiveCSSClassPipe, name: "responsiveCSSClass" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfDocumentPropertiesComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-document-properties', template: "<pdf-shy-button\n  title=\"Document Properties\u2026\"\n  primaryToolbarId=\"documentProperties\"\n  [cssClass]=\"show | responsiveCSSClass : 'always-in-secondary-menu'\"\n  l10nId=\"pdfjs-document-properties-button\"\n  l10nLabel=\"pdfjs-document-properties-button-label\"\n  [order]=\"5000\"\n  eventBusName=\"documentproperties\"\n  [closeOnClick]=\"true\"\n  image=\"<svg class='pdf-margin-top-3px' width='16px' height='16px' viewBox='0 0 16 16'><path fill='currentColor' d='M8 16a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8zM8 2a6 6 0 1 0 6 6 6.006 6.006 0 0 0-6-6z' /><path fill='currentColor' d='M8 7a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1z' /><circle fill='currentColor' cx='8' cy='5' r='1.188' /></svg>\"\n>\n</pdf-shy-button>\n", styles: ["button{padding:0;margin-top:0;margin-bottom:0}\n"] }]
        }], propDecorators: { show: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWRvY3VtZW50LXByb3BlcnRpZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi90b29sYmFyL3BkZi1kb2N1bWVudC1wcm9wZXJ0aWVzL3BkZi1kb2N1bWVudC1wcm9wZXJ0aWVzLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvdG9vbGJhci9wZGYtZG9jdW1lbnQtcHJvcGVydGllcy9wZGYtZG9jdW1lbnQtcHJvcGVydGllcy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQVFqRCxNQUFNLE9BQU8sOEJBQThCO0lBRWxDLElBQUksR0FBeUIsSUFBSSxDQUFDO3dHQUY5Qiw4QkFBOEI7NEZBQTlCLDhCQUE4Qix5RkNSM0Msa3VCQVlBOzs0RkRKYSw4QkFBOEI7a0JBTDFDLFNBQVM7K0JBQ0UseUJBQXlCOzhCQU01QixJQUFJO3NCQURWLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSZXNwb25zaXZlVmlzaWJpbGl0eSB9IGZyb20gJy4uLy4uL3Jlc3BvbnNpdmUtdmlzaWJpbGl0eSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BkZi1kb2N1bWVudC1wcm9wZXJ0aWVzJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BkZi1kb2N1bWVudC1wcm9wZXJ0aWVzLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcGRmLWRvY3VtZW50LXByb3BlcnRpZXMuY29tcG9uZW50LmNzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBQZGZEb2N1bWVudFByb3BlcnRpZXNDb21wb25lbnQge1xuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvdzogUmVzcG9uc2l2ZVZpc2liaWxpdHkgPSB0cnVlO1xufVxuIiwiPHBkZi1zaHktYnV0dG9uXG4gIHRpdGxlPVwiRG9jdW1lbnQgUHJvcGVydGllc+KAplwiXG4gIHByaW1hcnlUb29sYmFySWQ9XCJkb2N1bWVudFByb3BlcnRpZXNcIlxuICBbY3NzQ2xhc3NdPVwic2hvdyB8IHJlc3BvbnNpdmVDU1NDbGFzcyA6ICdhbHdheXMtaW4tc2Vjb25kYXJ5LW1lbnUnXCJcbiAgbDEwbklkPVwicGRmanMtZG9jdW1lbnQtcHJvcGVydGllcy1idXR0b25cIlxuICBsMTBuTGFiZWw9XCJwZGZqcy1kb2N1bWVudC1wcm9wZXJ0aWVzLWJ1dHRvbi1sYWJlbFwiXG4gIFtvcmRlcl09XCI1MDAwXCJcbiAgZXZlbnRCdXNOYW1lPVwiZG9jdW1lbnRwcm9wZXJ0aWVzXCJcbiAgW2Nsb3NlT25DbGlja109XCJ0cnVlXCJcbiAgaW1hZ2U9XCI8c3ZnIGNsYXNzPSdwZGYtbWFyZ2luLXRvcC0zcHgnIHdpZHRoPScxNnB4JyBoZWlnaHQ9JzE2cHgnIHZpZXdCb3g9JzAgMCAxNiAxNic+PHBhdGggZmlsbD0nY3VycmVudENvbG9yJyBkPSdNOCAxNmE4IDggMCAxIDEgOC04IDguMDA5IDguMDA5IDAgMCAxLTggOHpNOCAyYTYgNiAwIDEgMCA2IDYgNi4wMDYgNi4wMDYgMCAwIDAtNi02eicgLz48cGF0aCBmaWxsPSdjdXJyZW50Q29sb3InIGQ9J004IDdhMSAxIDAgMCAwLTEgMXYzYTEgMSAwIDAgMCAyIDBWOGExIDEgMCAwIDAtMS0xeicgLz48Y2lyY2xlIGZpbGw9J2N1cnJlbnRDb2xvcicgY3g9JzgnIGN5PSc1JyByPScxLjE4OCcgLz48L3N2Zz5cIlxuPlxuPC9wZGYtc2h5LWJ1dHRvbj5cbiJdfQ==