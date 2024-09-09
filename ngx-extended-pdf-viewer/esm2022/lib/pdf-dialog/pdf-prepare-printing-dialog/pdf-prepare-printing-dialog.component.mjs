import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class PdfPreparePrintingDialogComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfPreparePrintingDialogComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfPreparePrintingDialogComponent, selector: "pdf-prepare-printing-dialog", ngImport: i0, template: "<dialog id=\"printServiceDialog\">\n  <div class=\"row\">\n    <span data-l10n-id=\"pdfjs-print-progress-message\">Preparing document for printing\u2026</span>\n  </div>\n  <div class=\"row\">\n    <progress value=\"0\" max=\"100\"></progress>\n    <span data-l10n-id=\"pdfjs-print-progress-percent\" data-l10n-args='{ \"progress\": 0 }' class=\"relative-progress\">0%</span>\n  </div>\n  <div class=\"buttonRow\">\n    <button id=\"printCancel\" class=\"dialogButton\" type=\"button\">\n      <span data-l10n-id=\"pdfjs-print-progress-close-button\">Cancel</span>\n    </button>\n  </div>\n</dialog>\n", styles: ["#printServiceDialog{min-width:200px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfPreparePrintingDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-prepare-printing-dialog', template: "<dialog id=\"printServiceDialog\">\n  <div class=\"row\">\n    <span data-l10n-id=\"pdfjs-print-progress-message\">Preparing document for printing\u2026</span>\n  </div>\n  <div class=\"row\">\n    <progress value=\"0\" max=\"100\"></progress>\n    <span data-l10n-id=\"pdfjs-print-progress-percent\" data-l10n-args='{ \"progress\": 0 }' class=\"relative-progress\">0%</span>\n  </div>\n  <div class=\"buttonRow\">\n    <button id=\"printCancel\" class=\"dialogButton\" type=\"button\">\n      <span data-l10n-id=\"pdfjs-print-progress-close-button\">Cancel</span>\n    </button>\n  </div>\n</dialog>\n", styles: ["#printServiceDialog{min-width:200px}\n"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXByZXBhcmUtcHJpbnRpbmctZGlhbG9nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvcGRmLWRpYWxvZy9wZGYtcHJlcGFyZS1wcmludGluZy1kaWFsb2cvcGRmLXByZXBhcmUtcHJpbnRpbmctZGlhbG9nLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvcGRmLWRpYWxvZy9wZGYtcHJlcGFyZS1wcmludGluZy1kaWFsb2cvcGRmLXByZXBhcmUtcHJpbnRpbmctZGlhbG9nLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBTzFDLE1BQU0sT0FBTyxpQ0FBaUM7d0dBQWpDLGlDQUFpQzs0RkFBakMsaUNBQWlDLG1FQ1A5Qyw0bEJBY0E7OzRGRFBhLGlDQUFpQztrQkFMN0MsU0FBUzsrQkFDRSw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGRmLXByZXBhcmUtcHJpbnRpbmctZGlhbG9nJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BkZi1wcmVwYXJlLXByaW50aW5nLWRpYWxvZy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3BkZi1wcmVwYXJlLXByaW50aW5nLWRpYWxvZy5jb21wb25lbnQuY3NzJ10sXG59KVxuZXhwb3J0IGNsYXNzIFBkZlByZXBhcmVQcmludGluZ0RpYWxvZ0NvbXBvbmVudCB7fVxuIiwiPGRpYWxvZyBpZD1cInByaW50U2VydmljZURpYWxvZ1wiPlxuICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgPHNwYW4gZGF0YS1sMTBuLWlkPVwicGRmanMtcHJpbnQtcHJvZ3Jlc3MtbWVzc2FnZVwiPlByZXBhcmluZyBkb2N1bWVudCBmb3IgcHJpbnRpbmfigKY8L3NwYW4+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgPHByb2dyZXNzIHZhbHVlPVwiMFwiIG1heD1cIjEwMFwiPjwvcHJvZ3Jlc3M+XG4gICAgPHNwYW4gZGF0YS1sMTBuLWlkPVwicGRmanMtcHJpbnQtcHJvZ3Jlc3MtcGVyY2VudFwiIGRhdGEtbDEwbi1hcmdzPSd7IFwicHJvZ3Jlc3NcIjogMCB9JyBjbGFzcz1cInJlbGF0aXZlLXByb2dyZXNzXCI+MCU8L3NwYW4+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiYnV0dG9uUm93XCI+XG4gICAgPGJ1dHRvbiBpZD1cInByaW50Q2FuY2VsXCIgY2xhc3M9XCJkaWFsb2dCdXR0b25cIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICA8c3BhbiBkYXRhLWwxMG4taWQ9XCJwZGZqcy1wcmludC1wcm9ncmVzcy1jbG9zZS1idXR0b25cIj5DYW5jZWw8L3NwYW4+XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuPC9kaWFsb2c+XG4iXX0=