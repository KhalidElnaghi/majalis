import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class PdfPasswordDialogComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfPasswordDialogComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfPasswordDialogComponent, selector: "pdf-password-dialog", ngImport: i0, template: "<dialog id=\"passwordDialog\">\n  <div class=\"row\">\n    <label for=\"password\" id=\"passwordText\" data-l10n-id=\"pdfjs-password-label\">Enter the password to open this PDF file:</label>\n  </div>\n  <div class=\"row\">\n    <input type=\"hidden\" id=\"password\" class=\"toolbarField\" />\n  </div>\n  <div class=\"buttonRow\">\n    <button id=\"passwordCancel\" class=\"dialogButton\"><span data-l10n-id=\"pdfjs-password-cancel-button\">Cancel</span></button>\n    <button id=\"passwordSubmit\" class=\"dialogButton\"><span data-l10n-id=\"pdfjs-password-ok-button\">OK</span></button>\n  </div>\n</dialog>\n" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfPasswordDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-password-dialog', template: "<dialog id=\"passwordDialog\">\n  <div class=\"row\">\n    <label for=\"password\" id=\"passwordText\" data-l10n-id=\"pdfjs-password-label\">Enter the password to open this PDF file:</label>\n  </div>\n  <div class=\"row\">\n    <input type=\"hidden\" id=\"password\" class=\"toolbarField\" />\n  </div>\n  <div class=\"buttonRow\">\n    <button id=\"passwordCancel\" class=\"dialogButton\"><span data-l10n-id=\"pdfjs-password-cancel-button\">Cancel</span></button>\n    <button id=\"passwordSubmit\" class=\"dialogButton\"><span data-l10n-id=\"pdfjs-password-ok-button\">OK</span></button>\n  </div>\n</dialog>\n" }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXBhc3N3b3JkLWRpYWxvZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci9zcmMvbGliL3BkZi1kaWFsb2cvcGRmLXBhc3N3b3JkLWRpYWxvZy9wZGYtcGFzc3dvcmQtZGlhbG9nLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvcGRmLWRpYWxvZy9wZGYtcGFzc3dvcmQtZGlhbG9nL3BkZi1wYXNzd29yZC1kaWFsb2cuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFNMUMsTUFBTSxPQUFPLDBCQUEwQjt3R0FBMUIsMEJBQTBCOzRGQUExQiwwQkFBMEIsMkRDTnZDLHVtQkFZQTs7NEZETmEsMEJBQTBCO2tCQUp0QyxTQUFTOytCQUNFLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZGYtcGFzc3dvcmQtZGlhbG9nJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BkZi1wYXNzd29yZC1kaWFsb2cuY29tcG9uZW50Lmh0bWwnLFxufSlcbmV4cG9ydCBjbGFzcyBQZGZQYXNzd29yZERpYWxvZ0NvbXBvbmVudCB7fVxuIiwiPGRpYWxvZyBpZD1cInBhc3N3b3JkRGlhbG9nXCI+XG4gIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICA8bGFiZWwgZm9yPVwicGFzc3dvcmRcIiBpZD1cInBhc3N3b3JkVGV4dFwiIGRhdGEtbDEwbi1pZD1cInBkZmpzLXBhc3N3b3JkLWxhYmVsXCI+RW50ZXIgdGhlIHBhc3N3b3JkIHRvIG9wZW4gdGhpcyBQREYgZmlsZTo8L2xhYmVsPlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgaWQ9XCJwYXNzd29yZFwiIGNsYXNzPVwidG9vbGJhckZpZWxkXCIgLz5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJidXR0b25Sb3dcIj5cbiAgICA8YnV0dG9uIGlkPVwicGFzc3dvcmRDYW5jZWxcIiBjbGFzcz1cImRpYWxvZ0J1dHRvblwiPjxzcGFuIGRhdGEtbDEwbi1pZD1cInBkZmpzLXBhc3N3b3JkLWNhbmNlbC1idXR0b25cIj5DYW5jZWw8L3NwYW4+PC9idXR0b24+XG4gICAgPGJ1dHRvbiBpZD1cInBhc3N3b3JkU3VibWl0XCIgY2xhc3M9XCJkaWFsb2dCdXR0b25cIj48c3BhbiBkYXRhLWwxMG4taWQ9XCJwZGZqcy1wYXNzd29yZC1vay1idXR0b25cIj5PSzwvc3Bhbj48L2J1dHRvbj5cbiAgPC9kaXY+XG48L2RpYWxvZz5cbiJdfQ==