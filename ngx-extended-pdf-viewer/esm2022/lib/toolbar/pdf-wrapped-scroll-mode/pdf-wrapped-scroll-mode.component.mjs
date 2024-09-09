import { Component, EventEmitter, Input, Output, effect } from '@angular/core';
import { ScrollMode } from '../../options/pdf-scroll-mode';
import * as i0 from "@angular/core";
import * as i1 from "../../pdf-notification-service";
import * as i2 from "../pdf-shy-button/pdf-shy-button.component";
import * as i3 from "../../responsive-visibility";
export class PdfWrappedScrollModeComponent {
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
        const emitter = this.pageViewModeChange;
        this.onClick = () => {
            this.ngZone.run(() => {
                if (this.pageViewMode !== 'multiple' && this.pageViewMode !== 'infinite-scroll') {
                    emitter.emit('multiple');
                }
                this.PDFViewerApplication?.eventBus.dispatch('switchscrollmode', { mode: ScrollMode.WRAPPED });
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfWrappedScrollModeComponent, deps: [{ token: i1.PDFNotificationService }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfWrappedScrollModeComponent, selector: "pdf-wrapped-scroll-mode", inputs: { show: "show", scrollMode: "scrollMode", pageViewMode: "pageViewMode" }, outputs: { pageViewModeChange: "pageViewModeChange" }, ngImport: i0, template: "<pdf-shy-button\n  [cssClass]=\"show | responsiveCSSClass : 'always-in-secondary-menu'\"\n  title=\"Wrapped Scrolling\"\n  primaryToolbarId=\"scrollWrapped\"\n  [toggled]=\"scrollMode == 2\"\n  l10nId=\"pdfjs-scroll-wrapped-button\"\n  [action]=\"onClick\"\n  l10nLabel=\"pdfjs-scroll-wrapped-button-label\"\n  [order]=\"3300\"\n  [closeOnClick]=\"false\"\n  image=\"<svg class='pdf-margin-top-3px' width='24px' height='24px' viewBox='0 0 24 24'><path fill='currentColor' d='M5.5 4c1 0 1.5.5 1.5 1.5v5c0 1-.5 1.5-1.5 1.5h-3c-1 0-1.5-.5-1.5-1.5v-5C1 4.5 1.5 4 2.5 4zM7 0v.5C7 1.5 6.5 2 5.5 2h-3C1.5 2 1 1.5 1 .5V0h6zM7 16v-.5c0-1-.5-1.5-1.5-1.5h-3c-1 0-1.5.5-1.5 1.5v.5h6zM13.5 4c1 0 1.5.5 1.5 1.5v5c0 1-.5 1.5-1.5 1.5h-3c-1 0-1.5-.5-1.5-1.5v-5c0-1 .5-1.5 1.5-1.5zM15 0v.5c0 1-.5 1.5-1.5 1.5h-3C9.5 2 9 1.5 9 .5V0h6zM15 16v-.507c0-1-.5-1.5-1.5-1.5h-3C9.5 14 9 14.5 9 15.5v.5h6z' /></svg>\"\n>\n</pdf-shy-button>\n", styles: ["button{padding:0;margin-top:0;margin-bottom:0}\n"], dependencies: [{ kind: "component", type: i2.PdfShyButtonComponent, selector: "pdf-shy-button", inputs: ["primaryToolbarId", "secondaryMenuId", "cssClass", "eventBusName", "l10nId", "l10nLabel", "title", "toggled", "disabled", "order", "action", "closeOnClick", "onlySecondaryMenu", "image"] }, { kind: "pipe", type: i3.ResponsiveCSSClassPipe, name: "responsiveCSSClass" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfWrappedScrollModeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-wrapped-scroll-mode', template: "<pdf-shy-button\n  [cssClass]=\"show | responsiveCSSClass : 'always-in-secondary-menu'\"\n  title=\"Wrapped Scrolling\"\n  primaryToolbarId=\"scrollWrapped\"\n  [toggled]=\"scrollMode == 2\"\n  l10nId=\"pdfjs-scroll-wrapped-button\"\n  [action]=\"onClick\"\n  l10nLabel=\"pdfjs-scroll-wrapped-button-label\"\n  [order]=\"3300\"\n  [closeOnClick]=\"false\"\n  image=\"<svg class='pdf-margin-top-3px' width='24px' height='24px' viewBox='0 0 24 24'><path fill='currentColor' d='M5.5 4c1 0 1.5.5 1.5 1.5v5c0 1-.5 1.5-1.5 1.5h-3c-1 0-1.5-.5-1.5-1.5v-5C1 4.5 1.5 4 2.5 4zM7 0v.5C7 1.5 6.5 2 5.5 2h-3C1.5 2 1 1.5 1 .5V0h6zM7 16v-.5c0-1-.5-1.5-1.5-1.5h-3c-1 0-1.5.5-1.5 1.5v.5h6zM13.5 4c1 0 1.5.5 1.5 1.5v5c0 1-.5 1.5-1.5 1.5h-3c-1 0-1.5-.5-1.5-1.5v-5c0-1 .5-1.5 1.5-1.5zM15 0v.5c0 1-.5 1.5-1.5 1.5h-3C9.5 2 9 1.5 9 .5V0h6zM15 16v-.507c0-1-.5-1.5-1.5-1.5h-3C9.5 14 9 14.5 9 15.5v.5h6z' /></svg>\"\n>\n</pdf-shy-button>\n", styles: ["button{padding:0;margin-top:0;margin-bottom:0}\n"] }]
        }], ctorParameters: () => [{ type: i1.PDFNotificationService }, { type: i0.NgZone }], propDecorators: { show: [{
                type: Input
            }], scrollMode: [{
                type: Input
            }], pageViewMode: [{
                type: Input
            }], pageViewModeChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXdyYXBwZWQtc2Nyb2xsLW1vZGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi90b29sYmFyL3BkZi13cmFwcGVkLXNjcm9sbC1tb2RlL3BkZi13cmFwcGVkLXNjcm9sbC1tb2RlLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvdG9vbGJhci9wZGYtd3JhcHBlZC1zY3JvbGwtbW9kZS9wZGYtd3JhcHBlZC1zY3JvbGwtbW9kZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2RixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sK0JBQStCLENBQUM7Ozs7O0FBVzNELE1BQU0sT0FBTyw2QkFBNkI7SUFpQnBCO0lBQXFEO0lBZmxFLElBQUksR0FBeUIsSUFBSSxDQUFDO0lBR2xDLFVBQVUsQ0FBaUI7SUFHM0IsWUFBWSxDQUFtQjtJQUcvQixrQkFBa0IsR0FBRyxJQUFJLFlBQVksRUFBb0IsQ0FBQztJQUUxRCxPQUFPLENBQWE7SUFFbkIsb0JBQW9CLENBQW9DO0lBRWhFLFlBQW9CLG1CQUEyQyxFQUFVLE1BQWM7UUFBbkUsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUF3QjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDckYsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxtQkFBbUIsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3BFLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO2dCQUM3QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDcEI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztRQUN4QyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7Z0JBQ25CLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxVQUFVLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxpQkFBaUIsRUFBRTtvQkFDL0UsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDMUI7Z0JBQ0QsSUFBSSxDQUFDLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDakcsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRU0sV0FBVztRQUNoQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO3dHQXpDVSw2QkFBNkI7NEZBQTdCLDZCQUE2Qix3TUNaMUMsazVCQWFBOzs0RkREYSw2QkFBNkI7a0JBTHpDLFNBQVM7K0JBQ0UseUJBQXlCO2dIQU01QixJQUFJO3NCQURWLEtBQUs7Z0JBSUMsVUFBVTtzQkFEaEIsS0FBSztnQkFJQyxZQUFZO3NCQURsQixLQUFLO2dCQUlDLGtCQUFrQjtzQkFEeEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgTmdab25lLCBPdXRwdXQsIGVmZmVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2Nyb2xsTW9kZSB9IGZyb20gJy4uLy4uL29wdGlvbnMvcGRmLXNjcm9sbC1tb2RlJztcbmltcG9ydCB7IFBhZ2VWaWV3TW9kZVR5cGUsIFNjcm9sbE1vZGVUeXBlIH0gZnJvbSAnLi4vLi4vb3B0aW9ucy9wZGYtdmlld2VyJztcbmltcG9ydCB7IElQREZWaWV3ZXJBcHBsaWNhdGlvbiB9IGZyb20gJy4uLy4uL29wdGlvbnMvcGRmLXZpZXdlci1hcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBQREZOb3RpZmljYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vcGRmLW5vdGlmaWNhdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IFJlc3BvbnNpdmVWaXNpYmlsaXR5IH0gZnJvbSAnLi4vLi4vcmVzcG9uc2l2ZS12aXNpYmlsaXR5JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGRmLXdyYXBwZWQtc2Nyb2xsLW1vZGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLXdyYXBwZWQtc2Nyb2xsLW1vZGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9wZGYtd3JhcHBlZC1zY3JvbGwtbW9kZS5jb21wb25lbnQuY3NzJ10sXG59KVxuZXhwb3J0IGNsYXNzIFBkZldyYXBwZWRTY3JvbGxNb2RlQ29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgcHVibGljIHNob3c6IFJlc3BvbnNpdmVWaXNpYmlsaXR5ID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2Nyb2xsTW9kZTogU2Nyb2xsTW9kZVR5cGU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHBhZ2VWaWV3TW9kZTogUGFnZVZpZXdNb2RlVHlwZTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHBhZ2VWaWV3TW9kZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8UGFnZVZpZXdNb2RlVHlwZT4oKTtcblxuICBwdWJsaWMgb25DbGljazogKCkgPT4gdm9pZDtcblxuICBwcml2YXRlIFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBub3RpZmljYXRpb25TZXJ2aWNlOiBQREZOb3RpZmljYXRpb25TZXJ2aWNlLCBwcml2YXRlIG5nWm9uZTogTmdab25lKSB7XG4gICAgZWZmZWN0KCgpID0+IHtcbiAgICAgIHRoaXMuUERGVmlld2VyQXBwbGljYXRpb24gPSBub3RpZmljYXRpb25TZXJ2aWNlLm9uUERGSlNJbml0U2lnbmFsKCk7XG4gICAgICBpZiAodGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbikge1xuICAgICAgICB0aGlzLm9uUGRmSnNJbml0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgZW1pdHRlciA9IHRoaXMucGFnZVZpZXdNb2RlQ2hhbmdlO1xuICAgIHRoaXMub25DbGljayA9ICgpID0+IHtcbiAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnBhZ2VWaWV3TW9kZSAhPT0gJ211bHRpcGxlJyAmJiB0aGlzLnBhZ2VWaWV3TW9kZSAhPT0gJ2luZmluaXRlLXNjcm9sbCcpIHtcbiAgICAgICAgICBlbWl0dGVyLmVtaXQoJ211bHRpcGxlJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbj8uZXZlbnRCdXMuZGlzcGF0Y2goJ3N3aXRjaHNjcm9sbG1vZGUnLCB7IG1vZGU6IFNjcm9sbE1vZGUuV1JBUFBFRCB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICBwdWJsaWMgb25QZGZKc0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbj8uZXZlbnRCdXMub24oJ3N3aXRjaHNjcm9sbG1vZGUnLCAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMuc2Nyb2xsTW9kZSA9IGV2ZW50Lm1vZGU7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIiwiPHBkZi1zaHktYnV0dG9uXG4gIFtjc3NDbGFzc109XCJzaG93IHwgcmVzcG9uc2l2ZUNTU0NsYXNzIDogJ2Fsd2F5cy1pbi1zZWNvbmRhcnktbWVudSdcIlxuICB0aXRsZT1cIldyYXBwZWQgU2Nyb2xsaW5nXCJcbiAgcHJpbWFyeVRvb2xiYXJJZD1cInNjcm9sbFdyYXBwZWRcIlxuICBbdG9nZ2xlZF09XCJzY3JvbGxNb2RlID09IDJcIlxuICBsMTBuSWQ9XCJwZGZqcy1zY3JvbGwtd3JhcHBlZC1idXR0b25cIlxuICBbYWN0aW9uXT1cIm9uQ2xpY2tcIlxuICBsMTBuTGFiZWw9XCJwZGZqcy1zY3JvbGwtd3JhcHBlZC1idXR0b24tbGFiZWxcIlxuICBbb3JkZXJdPVwiMzMwMFwiXG4gIFtjbG9zZU9uQ2xpY2tdPVwiZmFsc2VcIlxuICBpbWFnZT1cIjxzdmcgY2xhc3M9J3BkZi1tYXJnaW4tdG9wLTNweCcgd2lkdGg9JzI0cHgnIGhlaWdodD0nMjRweCcgdmlld0JveD0nMCAwIDI0IDI0Jz48cGF0aCBmaWxsPSdjdXJyZW50Q29sb3InIGQ9J001LjUgNGMxIDAgMS41LjUgMS41IDEuNXY1YzAgMS0uNSAxLjUtMS41IDEuNWgtM2MtMSAwLTEuNS0uNS0xLjUtMS41di01QzEgNC41IDEuNSA0IDIuNSA0ek03IDB2LjVDNyAxLjUgNi41IDIgNS41IDJoLTNDMS41IDIgMSAxLjUgMSAuNVYwaDZ6TTcgMTZ2LS41YzAtMS0uNS0xLjUtMS41LTEuNWgtM2MtMSAwLTEuNS41LTEuNSAxLjV2LjVoNnpNMTMuNSA0YzEgMCAxLjUuNSAxLjUgMS41djVjMCAxLS41IDEuNS0xLjUgMS41aC0zYy0xIDAtMS41LS41LTEuNS0xLjV2LTVjMC0xIC41LTEuNSAxLjUtMS41ek0xNSAwdi41YzAgMS0uNSAxLjUtMS41IDEuNWgtM0M5LjUgMiA5IDEuNSA5IC41VjBoNnpNMTUgMTZ2LS41MDdjMC0xLS41LTEuNS0xLjUtMS41aC0zQzkuNSAxNCA5IDE0LjUgOSAxNS41di41aDZ6JyAvPjwvc3ZnPlwiXG4+XG48L3BkZi1zaHktYnV0dG9uPlxuIl19