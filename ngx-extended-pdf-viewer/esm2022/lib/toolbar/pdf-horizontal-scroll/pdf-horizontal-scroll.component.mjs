import { Component, EventEmitter, Input, Output, effect } from '@angular/core';
import { ScrollMode } from '../../options/pdf-scroll-mode';
import * as i0 from "@angular/core";
import * as i1 from "../../pdf-notification-service";
import * as i2 from "../pdf-shy-button/pdf-shy-button.component";
import * as i3 from "../../responsive-visibility";
export class PdfHorizontalScrollComponent {
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
                this.PDFViewerApplication?.eventBus.dispatch('switchscrollmode', { mode: ScrollMode.HORIZONTAL });
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfHorizontalScrollComponent, deps: [{ token: i1.PDFNotificationService }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfHorizontalScrollComponent, selector: "pdf-horizontal-scroll", inputs: { show: "show", scrollMode: "scrollMode", pageViewMode: "pageViewMode" }, outputs: { pageViewModeChange: "pageViewModeChange" }, ngImport: i0, template: "<pdf-shy-button\n  [cssClass]=\"show | responsiveCSSClass : 'always-in-secondary-menu'\"\n  title=\"Use Horizontal Scrolling\"\n  primaryToolbarId=\"scrollHorizontal\"\n  l10nId=\"pdfjs-scroll-horizontal-button\"\n  [toggled]=\"scrollMode == 1\"\n  [action]=\"onClick\"\n  l10nLabel=\"pdfjs-scroll-horizontal-button-label\"\n  [order]=\"3200\"\n  [closeOnClick]=\"false\"\n  image=\"<svg class='pdf-margin-top-3px' width='24px' height='24px'> <path fill='currentColor' d='M0 4h1.5c1 0 1.5.5 1.5 1.5v5c0 1-.5 1.5-1.5 1.5H0zM9.5 4c1 0 1.5.5 1.5 1.5v5c0 1-.5 1.5-1.5 1.5h-3c-1 0-1.5-.5-1.5-1.5v-5C5 4.5 5.5 4 6.5 4zM16 4h-1.5c-1 0-1.5.5-1.5 1.5v5c0 1 .5 1.5 1.5 1.5H16z' /> </svg>\"\n>\n</pdf-shy-button>\n", styles: ["button{padding:0;margin-top:0;margin-bottom:0}\n"], dependencies: [{ kind: "component", type: i2.PdfShyButtonComponent, selector: "pdf-shy-button", inputs: ["primaryToolbarId", "secondaryMenuId", "cssClass", "eventBusName", "l10nId", "l10nLabel", "title", "toggled", "disabled", "order", "action", "closeOnClick", "onlySecondaryMenu", "image"] }, { kind: "pipe", type: i3.ResponsiveCSSClassPipe, name: "responsiveCSSClass" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfHorizontalScrollComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-horizontal-scroll', template: "<pdf-shy-button\n  [cssClass]=\"show | responsiveCSSClass : 'always-in-secondary-menu'\"\n  title=\"Use Horizontal Scrolling\"\n  primaryToolbarId=\"scrollHorizontal\"\n  l10nId=\"pdfjs-scroll-horizontal-button\"\n  [toggled]=\"scrollMode == 1\"\n  [action]=\"onClick\"\n  l10nLabel=\"pdfjs-scroll-horizontal-button-label\"\n  [order]=\"3200\"\n  [closeOnClick]=\"false\"\n  image=\"<svg class='pdf-margin-top-3px' width='24px' height='24px'> <path fill='currentColor' d='M0 4h1.5c1 0 1.5.5 1.5 1.5v5c0 1-.5 1.5-1.5 1.5H0zM9.5 4c1 0 1.5.5 1.5 1.5v5c0 1-.5 1.5-1.5 1.5h-3c-1 0-1.5-.5-1.5-1.5v-5C5 4.5 5.5 4 6.5 4zM16 4h-1.5c-1 0-1.5.5-1.5 1.5v5c0 1 .5 1.5 1.5 1.5H16z' /> </svg>\"\n>\n</pdf-shy-button>\n", styles: ["button{padding:0;margin-top:0;margin-bottom:0}\n"] }]
        }], ctorParameters: () => [{ type: i1.PDFNotificationService }, { type: i0.NgZone }], propDecorators: { show: [{
                type: Input
            }], scrollMode: [{
                type: Input
            }], pageViewMode: [{
                type: Input
            }], pageViewModeChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWhvcml6b250YWwtc2Nyb2xsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvdG9vbGJhci9wZGYtaG9yaXpvbnRhbC1zY3JvbGwvcGRmLWhvcml6b250YWwtc2Nyb2xsLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvdG9vbGJhci9wZGYtaG9yaXpvbnRhbC1zY3JvbGwvcGRmLWhvcml6b250YWwtc2Nyb2xsLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7Ozs7QUFXM0QsTUFBTSxPQUFPLDRCQUE0QjtJQWlCbkI7SUFBcUQ7SUFmbEUsSUFBSSxHQUF5QixJQUFJLENBQUM7SUFHbEMsVUFBVSxDQUFpQjtJQUczQixZQUFZLENBQW1CO0lBRy9CLGtCQUFrQixHQUFHLElBQUksWUFBWSxFQUFvQixDQUFDO0lBRTFELE9BQU8sQ0FBYTtJQUVuQixvQkFBb0IsQ0FBb0M7SUFFaEUsWUFBb0IsbUJBQTJDLEVBQVUsTUFBYztRQUFuRSx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXdCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNyRixNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1YsSUFBSSxDQUFDLG9CQUFvQixHQUFHLG1CQUFtQixDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDcEUsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUNwQjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtnQkFDbkIsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFVBQVUsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLGlCQUFpQixFQUFFO29CQUMvRSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUMxQjtnQkFDRCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUNwRyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFTSxXQUFXO1FBQ2hCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDbkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO2dCQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7d0dBekNVLDRCQUE0Qjs0RkFBNUIsNEJBQTRCLHNNQ1p6Qyxpc0JBYUE7OzRGRERhLDRCQUE0QjtrQkFMeEMsU0FBUzsrQkFDRSx1QkFBdUI7Z0hBTTFCLElBQUk7c0JBRFYsS0FBSztnQkFJQyxVQUFVO3NCQURoQixLQUFLO2dCQUlDLFlBQVk7c0JBRGxCLEtBQUs7Z0JBSUMsa0JBQWtCO3NCQUR4QixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBOZ1pvbmUsIE91dHB1dCwgZWZmZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTY3JvbGxNb2RlIH0gZnJvbSAnLi4vLi4vb3B0aW9ucy9wZGYtc2Nyb2xsLW1vZGUnO1xuaW1wb3J0IHsgUGFnZVZpZXdNb2RlVHlwZSwgU2Nyb2xsTW9kZVR5cGUgfSBmcm9tICcuLi8uLi9vcHRpb25zL3BkZi12aWV3ZXInO1xuaW1wb3J0IHsgSVBERlZpZXdlckFwcGxpY2F0aW9uIH0gZnJvbSAnLi4vLi4vb3B0aW9ucy9wZGYtdmlld2VyLWFwcGxpY2F0aW9uJztcbmltcG9ydCB7IFBERk5vdGlmaWNhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9wZGYtbm90aWZpY2F0aW9uLXNlcnZpY2UnO1xuaW1wb3J0IHsgUmVzcG9uc2l2ZVZpc2liaWxpdHkgfSBmcm9tICcuLi8uLi9yZXNwb25zaXZlLXZpc2liaWxpdHknO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZGYtaG9yaXpvbnRhbC1zY3JvbGwnLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLWhvcml6b250YWwtc2Nyb2xsLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcGRmLWhvcml6b250YWwtc2Nyb2xsLmNvbXBvbmVudC5jc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgUGRmSG9yaXpvbnRhbFNjcm9sbENvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93OiBSZXNwb25zaXZlVmlzaWJpbGl0eSA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNjcm9sbE1vZGU6IFNjcm9sbE1vZGVUeXBlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBwYWdlVmlld01vZGU6IFBhZ2VWaWV3TW9kZVR5cGU7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBwYWdlVmlld01vZGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFBhZ2VWaWV3TW9kZVR5cGU+KCk7XG5cbiAgcHVibGljIG9uQ2xpY2s6ICgpID0+IHZvaWQ7XG5cbiAgcHJpdmF0ZSBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uIHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbm90aWZpY2F0aW9uU2VydmljZTogUERGTm90aWZpY2F0aW9uU2VydmljZSwgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSkge1xuICAgIGVmZmVjdCgoKSA9PiB7XG4gICAgICB0aGlzLlBERlZpZXdlckFwcGxpY2F0aW9uID0gbm90aWZpY2F0aW9uU2VydmljZS5vblBERkpTSW5pdFNpZ25hbCgpO1xuICAgICAgaWYgKHRoaXMuUERGVmlld2VyQXBwbGljYXRpb24pIHtcbiAgICAgICAgdGhpcy5vblBkZkpzSW5pdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGVtaXR0ZXIgPSB0aGlzLnBhZ2VWaWV3TW9kZUNoYW5nZTtcbiAgICB0aGlzLm9uQ2xpY2sgPSAoKSA9PiB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYWdlVmlld01vZGUgIT09ICdtdWx0aXBsZScgJiYgdGhpcy5wYWdlVmlld01vZGUgIT09ICdpbmZpbml0ZS1zY3JvbGwnKSB7XG4gICAgICAgICAgZW1pdHRlci5lbWl0KCdtdWx0aXBsZScpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuUERGVmlld2VyQXBwbGljYXRpb24/LmV2ZW50QnVzLmRpc3BhdGNoKCdzd2l0Y2hzY3JvbGxtb2RlJywgeyBtb2RlOiBTY3JvbGxNb2RlLkhPUklaT05UQUwgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIG9uUGRmSnNJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuUERGVmlld2VyQXBwbGljYXRpb24/LmV2ZW50QnVzLm9uKCdzd2l0Y2hzY3JvbGxtb2RlJywgKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnNjcm9sbE1vZGUgPSBldmVudC5tb2RlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsIjxwZGYtc2h5LWJ1dHRvblxuICBbY3NzQ2xhc3NdPVwic2hvdyB8IHJlc3BvbnNpdmVDU1NDbGFzcyA6ICdhbHdheXMtaW4tc2Vjb25kYXJ5LW1lbnUnXCJcbiAgdGl0bGU9XCJVc2UgSG9yaXpvbnRhbCBTY3JvbGxpbmdcIlxuICBwcmltYXJ5VG9vbGJhcklkPVwic2Nyb2xsSG9yaXpvbnRhbFwiXG4gIGwxMG5JZD1cInBkZmpzLXNjcm9sbC1ob3Jpem9udGFsLWJ1dHRvblwiXG4gIFt0b2dnbGVkXT1cInNjcm9sbE1vZGUgPT0gMVwiXG4gIFthY3Rpb25dPVwib25DbGlja1wiXG4gIGwxMG5MYWJlbD1cInBkZmpzLXNjcm9sbC1ob3Jpem9udGFsLWJ1dHRvbi1sYWJlbFwiXG4gIFtvcmRlcl09XCIzMjAwXCJcbiAgW2Nsb3NlT25DbGlja109XCJmYWxzZVwiXG4gIGltYWdlPVwiPHN2ZyBjbGFzcz0ncGRmLW1hcmdpbi10b3AtM3B4JyB3aWR0aD0nMjRweCcgaGVpZ2h0PScyNHB4Jz4gPHBhdGggZmlsbD0nY3VycmVudENvbG9yJyBkPSdNMCA0aDEuNWMxIDAgMS41LjUgMS41IDEuNXY1YzAgMS0uNSAxLjUtMS41IDEuNUgwek05LjUgNGMxIDAgMS41LjUgMS41IDEuNXY1YzAgMS0uNSAxLjUtMS41IDEuNWgtM2MtMSAwLTEuNS0uNS0xLjUtMS41di01QzUgNC41IDUuNSA0IDYuNSA0ek0xNiA0aC0xLjVjLTEgMC0xLjUuNS0xLjUgMS41djVjMCAxIC41IDEuNSAxLjUgMS41SDE2eicgLz4gPC9zdmc+XCJcbj5cbjwvcGRmLXNoeS1idXR0b24+XG4iXX0=