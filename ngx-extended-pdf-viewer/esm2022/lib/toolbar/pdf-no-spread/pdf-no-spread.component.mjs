import { Component, Input, effect } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../pdf-notification-service";
import * as i2 from "../pdf-shy-button/pdf-shy-button.component";
import * as i3 from "../../responsive-visibility";
export class PdfNoSpreadComponent {
    notificationService;
    ngZone;
    show = true;
    spread = 'off';
    scrollMode;
    PDFViewerApplication;
    constructor(notificationService, ngZone) {
        this.notificationService = notificationService;
        this.ngZone = ngZone;
        effect(() => {
            this.PDFViewerApplication = notificationService.onPDFJSInitSignal();
            if (this.PDFViewerApplication) {
                this.onPdfJsInit();
            }
        });
    }
    onPdfJsInit() {
        this.PDFViewerApplication?.eventBus.on('spreadmodechanged', (event) => {
            this.ngZone.run(() => {
                const modes = ['off', 'odd', 'even'];
                this.spread = modes[event.mode];
            });
        });
    }
    onClick() {
        if (this.PDFViewerApplication) {
            this.PDFViewerApplication.pdfViewer.spreadMode = 0;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfNoSpreadComponent, deps: [{ token: i1.PDFNotificationService }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfNoSpreadComponent, selector: "pdf-no-spread", inputs: { show: "show", scrollMode: "scrollMode" }, ngImport: i0, template: "<pdf-shy-button\n  [cssClass]=\"show | responsiveCSSClass : 'always-in-secondary-menu'\"\n  title=\"Do not join page spreads\"\n  primaryToolbarId=\"spreadNone\"\n  l10nId=\"pdfjs-spread-none-button\"\n  [toggled]=\"spread === 'off'\"\n  [action]=\"onClick\"\n  l10nLabel=\"pdfjs-spread-none-button-label\"\n  [order]=\"2000\"\n  [closeOnClick]=\"false\"\n  [disabled]=\"scrollMode === 1\"\n  image=\"<svg class='pdf-margin-top-3px' width='24px' height='24px' viewBox='0 0 24 24'><path fill='currentColor' d='M6 3c-1 0-1.5.5-1.5 1.5v7c0 1 .5 1.5 1.5 1.5h4c1 0 1.5-.5 1.5-1.5v-7c0-1-.5-1.5-1.5-1.5z' /></svg>\"\n>\n</pdf-shy-button>\n", styles: ["button{padding:0;margin-top:0;margin-bottom:0}\n"], dependencies: [{ kind: "component", type: i2.PdfShyButtonComponent, selector: "pdf-shy-button", inputs: ["primaryToolbarId", "secondaryMenuId", "cssClass", "eventBusName", "l10nId", "l10nLabel", "title", "toggled", "disabled", "order", "action", "closeOnClick", "onlySecondaryMenu", "image"] }, { kind: "pipe", type: i3.ResponsiveCSSClassPipe, name: "responsiveCSSClass" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfNoSpreadComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-no-spread', template: "<pdf-shy-button\n  [cssClass]=\"show | responsiveCSSClass : 'always-in-secondary-menu'\"\n  title=\"Do not join page spreads\"\n  primaryToolbarId=\"spreadNone\"\n  l10nId=\"pdfjs-spread-none-button\"\n  [toggled]=\"spread === 'off'\"\n  [action]=\"onClick\"\n  l10nLabel=\"pdfjs-spread-none-button-label\"\n  [order]=\"2000\"\n  [closeOnClick]=\"false\"\n  [disabled]=\"scrollMode === 1\"\n  image=\"<svg class='pdf-margin-top-3px' width='24px' height='24px' viewBox='0 0 24 24'><path fill='currentColor' d='M6 3c-1 0-1.5.5-1.5 1.5v7c0 1 .5 1.5 1.5 1.5h4c1 0 1.5-.5 1.5-1.5v-7c0-1-.5-1.5-1.5-1.5z' /></svg>\"\n>\n</pdf-shy-button>\n", styles: ["button{padding:0;margin-top:0;margin-bottom:0}\n"] }]
        }], ctorParameters: () => [{ type: i1.PDFNotificationService }, { type: i0.NgZone }], propDecorators: { show: [{
                type: Input
            }], scrollMode: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLW5vLXNwcmVhZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci9zcmMvbGliL3Rvb2xiYXIvcGRmLW5vLXNwcmVhZC9wZGYtbm8tc3ByZWFkLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvdG9vbGJhci9wZGYtbm8tc3ByZWFkL3BkZi1uby1zcHJlYWQuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQVlqRSxNQUFNLE9BQU8sb0JBQW9CO0lBV1g7SUFBcUQ7SUFUbEUsSUFBSSxHQUF5QixJQUFJLENBQUM7SUFFbEMsTUFBTSxHQUFlLEtBQUssQ0FBQztJQUczQixVQUFVLENBQWlCO0lBRTFCLG9CQUFvQixDQUFvQztJQUVoRSxZQUFvQixtQkFBMkMsRUFBVSxNQUFjO1FBQW5FLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBd0I7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ3JGLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLENBQUMsb0JBQW9CLEdBQUcsbUJBQW1CLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUNwRSxJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ3BCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sV0FBVztRQUNoQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ3BFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtnQkFDbkIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBc0IsQ0FBQztnQkFDMUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sT0FBTztRQUNaLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzdCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztTQUNwRDtJQUNILENBQUM7d0dBakNVLG9CQUFvQjs0RkFBcEIsb0JBQW9CLHlHQ1pqQywybkJBY0E7OzRGREZhLG9CQUFvQjtrQkFMaEMsU0FBUzsrQkFDRSxlQUFlO2dIQU1sQixJQUFJO3NCQURWLEtBQUs7Z0JBTUMsVUFBVTtzQkFEaEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE5nWm9uZSwgZWZmZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTY3JvbGxNb2RlVHlwZSB9IGZyb20gJy4uLy4uL29wdGlvbnMvcGRmLXZpZXdlcic7XG5pbXBvcnQgeyBJUERGVmlld2VyQXBwbGljYXRpb24gfSBmcm9tICcuLi8uLi9vcHRpb25zL3BkZi12aWV3ZXItYXBwbGljYXRpb24nO1xuaW1wb3J0IHsgU3ByZWFkVHlwZSB9IGZyb20gJy4uLy4uL29wdGlvbnMvc3ByZWFkLXR5cGUnO1xuaW1wb3J0IHsgUERGTm90aWZpY2F0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL3BkZi1ub3RpZmljYXRpb24tc2VydmljZSc7XG5pbXBvcnQgeyBSZXNwb25zaXZlVmlzaWJpbGl0eSB9IGZyb20gJy4uLy4uL3Jlc3BvbnNpdmUtdmlzaWJpbGl0eSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BkZi1uby1zcHJlYWQnLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLW5vLXNwcmVhZC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3BkZi1uby1zcHJlYWQuY29tcG9uZW50LmNzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBQZGZOb1NwcmVhZENvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93OiBSZXNwb25zaXZlVmlzaWJpbGl0eSA9IHRydWU7XG5cbiAgcHVibGljIHNwcmVhZDogU3ByZWFkVHlwZSA9ICdvZmYnO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzY3JvbGxNb2RlOiBTY3JvbGxNb2RlVHlwZTtcblxuICBwcml2YXRlIFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBub3RpZmljYXRpb25TZXJ2aWNlOiBQREZOb3RpZmljYXRpb25TZXJ2aWNlLCBwcml2YXRlIG5nWm9uZTogTmdab25lKSB7XG4gICAgZWZmZWN0KCgpID0+IHtcbiAgICAgIHRoaXMuUERGVmlld2VyQXBwbGljYXRpb24gPSBub3RpZmljYXRpb25TZXJ2aWNlLm9uUERGSlNJbml0U2lnbmFsKCk7XG4gICAgICBpZiAodGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbikge1xuICAgICAgICB0aGlzLm9uUGRmSnNJbml0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25QZGZKc0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbj8uZXZlbnRCdXMub24oJ3NwcmVhZG1vZGVjaGFuZ2VkJywgKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RlcyA9IFsnb2ZmJywgJ29kZCcsICdldmVuJ10gYXMgQXJyYXk8U3ByZWFkVHlwZT47XG4gICAgICAgIHRoaXMuc3ByZWFkID0gbW9kZXNbZXZlbnQubW9kZV07XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNsaWNrKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLlBERlZpZXdlckFwcGxpY2F0aW9uKSB7XG4gICAgICB0aGlzLlBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5zcHJlYWRNb2RlID0gMDtcbiAgICB9XG4gIH1cbn1cbiIsIjxwZGYtc2h5LWJ1dHRvblxuICBbY3NzQ2xhc3NdPVwic2hvdyB8IHJlc3BvbnNpdmVDU1NDbGFzcyA6ICdhbHdheXMtaW4tc2Vjb25kYXJ5LW1lbnUnXCJcbiAgdGl0bGU9XCJEbyBub3Qgam9pbiBwYWdlIHNwcmVhZHNcIlxuICBwcmltYXJ5VG9vbGJhcklkPVwic3ByZWFkTm9uZVwiXG4gIGwxMG5JZD1cInBkZmpzLXNwcmVhZC1ub25lLWJ1dHRvblwiXG4gIFt0b2dnbGVkXT1cInNwcmVhZCA9PT0gJ29mZidcIlxuICBbYWN0aW9uXT1cIm9uQ2xpY2tcIlxuICBsMTBuTGFiZWw9XCJwZGZqcy1zcHJlYWQtbm9uZS1idXR0b24tbGFiZWxcIlxuICBbb3JkZXJdPVwiMjAwMFwiXG4gIFtjbG9zZU9uQ2xpY2tdPVwiZmFsc2VcIlxuICBbZGlzYWJsZWRdPVwic2Nyb2xsTW9kZSA9PT0gMVwiXG4gIGltYWdlPVwiPHN2ZyBjbGFzcz0ncGRmLW1hcmdpbi10b3AtM3B4JyB3aWR0aD0nMjRweCcgaGVpZ2h0PScyNHB4JyB2aWV3Qm94PScwIDAgMjQgMjQnPjxwYXRoIGZpbGw9J2N1cnJlbnRDb2xvcicgZD0nTTYgM2MtMSAwLTEuNS41LTEuNSAxLjV2N2MwIDEgLjUgMS41IDEuNSAxLjVoNGMxIDAgMS41LS41IDEuNS0xLjV2LTdjMC0xLS41LTEuNS0xLjUtMS41eicgLz48L3N2Zz5cIlxuPlxuPC9wZGYtc2h5LWJ1dHRvbj5cbiJdfQ==