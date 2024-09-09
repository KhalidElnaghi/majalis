import { Component, EventEmitter, Input, Output, effect } from '@angular/core';
import { ScrollMode } from '../../options/pdf-scroll-mode';
import * as i0 from "@angular/core";
import * as i1 from "../../pdf-notification-service";
import * as i2 from "../pdf-shy-button/pdf-shy-button.component";
import * as i3 from "../../responsive-visibility";
export class PdfSinglePageModeComponent {
    notificationService;
    ngZone;
    show = true;
    scrollMode;
    pageViewMode;
    pageViewModeChange = new EventEmitter();
    onClick;
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
        this.onClick = () => {
            ngZone.run(() => {
                this.PDFViewerApplication?.eventBus.dispatch('switchscrollmode', { mode: ScrollMode.PAGE });
            });
        };
    }
    onPdfJsInit() {
        this.PDFViewerApplication?.eventBus.on('switchscrollmode', (event) => {
            this.ngZone.run(() => {
                this.scrollMode = event.mode;
            });
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfSinglePageModeComponent, deps: [{ token: i1.PDFNotificationService }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfSinglePageModeComponent, selector: "pdf-single-page-mode", inputs: { show: "show", scrollMode: "scrollMode", pageViewMode: "pageViewMode" }, outputs: { pageViewModeChange: "pageViewModeChange" }, ngImport: i0, template: "<pdf-shy-button\n  [cssClass]=\"show | responsiveCSSClass : 'always-in-secondary-menu'\"\n  title=\"Use Page Scrolling\"\n  primaryToolbarId=\"scrollPage\"\n  [toggled]=\"scrollMode == 3\"\n  l10nId=\"pdfjs-scroll-page-button\"\n  [action]=\"onClick\"\n  l10nLabel=\"pdfjs-scroll-page-button-label\"\n  [order]=\"3000\"\n  [closeOnClick]=\"false\"\n  image=\"<svg width='24px' height='24px' viewBox='0 0 24 24'><path fill='currentColor' d='M10,7V9H12V17H14V7H10Z' /></svg>\"\n>\n</pdf-shy-button>\n", styles: ["button{padding:0;margin-top:0;margin-bottom:0}\n"], dependencies: [{ kind: "component", type: i2.PdfShyButtonComponent, selector: "pdf-shy-button", inputs: ["primaryToolbarId", "secondaryMenuId", "cssClass", "eventBusName", "l10nId", "l10nLabel", "title", "toggled", "disabled", "order", "action", "closeOnClick", "onlySecondaryMenu", "image"] }, { kind: "pipe", type: i3.ResponsiveCSSClassPipe, name: "responsiveCSSClass" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfSinglePageModeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-single-page-mode', template: "<pdf-shy-button\n  [cssClass]=\"show | responsiveCSSClass : 'always-in-secondary-menu'\"\n  title=\"Use Page Scrolling\"\n  primaryToolbarId=\"scrollPage\"\n  [toggled]=\"scrollMode == 3\"\n  l10nId=\"pdfjs-scroll-page-button\"\n  [action]=\"onClick\"\n  l10nLabel=\"pdfjs-scroll-page-button-label\"\n  [order]=\"3000\"\n  [closeOnClick]=\"false\"\n  image=\"<svg width='24px' height='24px' viewBox='0 0 24 24'><path fill='currentColor' d='M10,7V9H12V17H14V7H10Z' /></svg>\"\n>\n</pdf-shy-button>\n", styles: ["button{padding:0;margin-top:0;margin-bottom:0}\n"] }]
        }], ctorParameters: () => [{ type: i1.PDFNotificationService }, { type: i0.NgZone }], propDecorators: { show: [{
                type: Input
            }], scrollMode: [{
                type: Input
            }], pageViewMode: [{
                type: Input
            }], pageViewModeChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXNpbmdsZS1wYWdlLW1vZGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi90b29sYmFyL3BkZi1zaW5nbGUtcGFnZS1tb2RlL3BkZi1zaW5nbGUtcGFnZS1tb2RlLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvdG9vbGJhci9wZGYtc2luZ2xlLXBhZ2UtbW9kZS9wZGYtc2luZ2xlLXBhZ2UtbW9kZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2RixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sK0JBQStCLENBQUM7Ozs7O0FBVzNELE1BQU0sT0FBTywwQkFBMEI7SUFpQmpCO0lBQXFEO0lBZmxFLElBQUksR0FBeUIsSUFBSSxDQUFDO0lBR2xDLFVBQVUsQ0FBaUI7SUFHM0IsWUFBWSxDQUFtQjtJQUcvQixrQkFBa0IsR0FBRyxJQUFJLFlBQVksRUFBb0IsQ0FBQztJQUUxRCxPQUFPLENBQWE7SUFFbkIsb0JBQW9CLENBQW9DO0lBRWhFLFlBQW9CLG1CQUEyQyxFQUFVLE1BQWM7UUFBbkUsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUF3QjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDckYsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxtQkFBbUIsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3BFLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO2dCQUM3QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDcEI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO1lBQ2xCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO2dCQUNkLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzlGLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVNLFdBQVc7UUFDaEIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNuRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzt3R0F0Q1UsMEJBQTBCOzRGQUExQiwwQkFBMEIscU1DWnZDLG9mQWFBOzs0RkREYSwwQkFBMEI7a0JBTHRDLFNBQVM7K0JBQ0Usc0JBQXNCO2dIQU16QixJQUFJO3NCQURWLEtBQUs7Z0JBSUMsVUFBVTtzQkFEaEIsS0FBSztnQkFJQyxZQUFZO3NCQURsQixLQUFLO2dCQUlDLGtCQUFrQjtzQkFEeEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgTmdab25lLCBPdXRwdXQsIGVmZmVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2Nyb2xsTW9kZSB9IGZyb20gJy4uLy4uL29wdGlvbnMvcGRmLXNjcm9sbC1tb2RlJztcbmltcG9ydCB7IFBhZ2VWaWV3TW9kZVR5cGUsIFNjcm9sbE1vZGVUeXBlIH0gZnJvbSAnLi4vLi4vb3B0aW9ucy9wZGYtdmlld2VyJztcbmltcG9ydCB7IElQREZWaWV3ZXJBcHBsaWNhdGlvbiB9IGZyb20gJy4uLy4uL29wdGlvbnMvcGRmLXZpZXdlci1hcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBQREZOb3RpZmljYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vcGRmLW5vdGlmaWNhdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IFJlc3BvbnNpdmVWaXNpYmlsaXR5IH0gZnJvbSAnLi4vLi4vcmVzcG9uc2l2ZS12aXNpYmlsaXR5JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGRmLXNpbmdsZS1wYWdlLW1vZGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLXNpbmdsZS1wYWdlLW1vZGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9wZGYtc2luZ2xlLXBhZ2UtbW9kZS5jb21wb25lbnQuY3NzJ10sXG59KVxuZXhwb3J0IGNsYXNzIFBkZlNpbmdsZVBhZ2VNb2RlQ29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgcHVibGljIHNob3c6IFJlc3BvbnNpdmVWaXNpYmlsaXR5ID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2Nyb2xsTW9kZTogU2Nyb2xsTW9kZVR5cGU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHBhZ2VWaWV3TW9kZTogUGFnZVZpZXdNb2RlVHlwZTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHBhZ2VWaWV3TW9kZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8UGFnZVZpZXdNb2RlVHlwZT4oKTtcblxuICBwdWJsaWMgb25DbGljazogKCkgPT4gdm9pZDtcblxuICBwcml2YXRlIFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBub3RpZmljYXRpb25TZXJ2aWNlOiBQREZOb3RpZmljYXRpb25TZXJ2aWNlLCBwcml2YXRlIG5nWm9uZTogTmdab25lKSB7XG4gICAgZWZmZWN0KCgpID0+IHtcbiAgICAgIHRoaXMuUERGVmlld2VyQXBwbGljYXRpb24gPSBub3RpZmljYXRpb25TZXJ2aWNlLm9uUERGSlNJbml0U2lnbmFsKCk7XG4gICAgICBpZiAodGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbikge1xuICAgICAgICB0aGlzLm9uUGRmSnNJbml0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uQ2xpY2sgPSAoKSA9PiB7XG4gICAgICBuZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbj8uZXZlbnRCdXMuZGlzcGF0Y2goJ3N3aXRjaHNjcm9sbG1vZGUnLCB7IG1vZGU6IFNjcm9sbE1vZGUuUEFHRSB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICBwdWJsaWMgb25QZGZKc0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbj8uZXZlbnRCdXMub24oJ3N3aXRjaHNjcm9sbG1vZGUnLCAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMuc2Nyb2xsTW9kZSA9IGV2ZW50Lm1vZGU7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIiwiPHBkZi1zaHktYnV0dG9uXG4gIFtjc3NDbGFzc109XCJzaG93IHwgcmVzcG9uc2l2ZUNTU0NsYXNzIDogJ2Fsd2F5cy1pbi1zZWNvbmRhcnktbWVudSdcIlxuICB0aXRsZT1cIlVzZSBQYWdlIFNjcm9sbGluZ1wiXG4gIHByaW1hcnlUb29sYmFySWQ9XCJzY3JvbGxQYWdlXCJcbiAgW3RvZ2dsZWRdPVwic2Nyb2xsTW9kZSA9PSAzXCJcbiAgbDEwbklkPVwicGRmanMtc2Nyb2xsLXBhZ2UtYnV0dG9uXCJcbiAgW2FjdGlvbl09XCJvbkNsaWNrXCJcbiAgbDEwbkxhYmVsPVwicGRmanMtc2Nyb2xsLXBhZ2UtYnV0dG9uLWxhYmVsXCJcbiAgW29yZGVyXT1cIjMwMDBcIlxuICBbY2xvc2VPbkNsaWNrXT1cImZhbHNlXCJcbiAgaW1hZ2U9XCI8c3ZnIHdpZHRoPScyNHB4JyBoZWlnaHQ9JzI0cHgnIHZpZXdCb3g9JzAgMCAyNCAyNCc+PHBhdGggZmlsbD0nY3VycmVudENvbG9yJyBkPSdNMTAsN1Y5SDEyVjE3SDE0VjdIMTBaJyAvPjwvc3ZnPlwiXG4+XG48L3BkZi1zaHktYnV0dG9uPlxuIl19