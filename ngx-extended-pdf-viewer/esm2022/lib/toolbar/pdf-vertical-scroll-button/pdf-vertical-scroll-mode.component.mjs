import { Component, EventEmitter, Input, Output, effect } from '@angular/core';
import { ScrollMode } from '../../options/pdf-scroll-mode';
import * as i0 from "@angular/core";
import * as i1 from "../../pdf-notification-service";
import * as i2 from "../pdf-shy-button/pdf-shy-button.component";
import * as i3 from "../../responsive-visibility";
export class PdfVerticalScrollModeComponent {
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
                this.PDFViewerApplication?.eventBus.dispatch('switchscrollmode', { mode: ScrollMode.VERTICAL });
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfVerticalScrollModeComponent, deps: [{ token: i1.PDFNotificationService }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfVerticalScrollModeComponent, selector: "pdf-vertical-scroll-mode", inputs: { show: "show", scrollMode: "scrollMode", pageViewMode: "pageViewMode" }, outputs: { pageViewModeChange: "pageViewModeChange" }, ngImport: i0, template: "<pdf-shy-button\n  [cssClass]=\"show | responsiveCSSClass : 'always-in-secondary-menu'\"\n  title=\"Use Vertical Scrolling\"\n  primaryToolbarId=\"scrollVertical\"\n  l10nId=\"pdfjs-scroll-vertical-button\"\n  [toggled]=\"scrollMode == 0 && pageViewMode !== 'book'\"\n  [action]=\"onClick\"\n  l10nLabel=\"pdfjs-scroll-vertical-button-label\"\n  [order]=\"3100\"\n  [closeOnClick]=\"false\"\n  image=\"<svg class='pdf-margin-top-3px' width='24px' height='24px' viewBox='0 0 24 24'><path fill='currentColor' d='M9.5 4c1 0 1.5.5 1.5 1.5v5c0 1-.5 1.5-1.5 1.5h-3c-1 0-1.5-.5-1.5-1.5v-5C5 4.5 5.5 4 6.5 4zM11 0v.5c0 1-.5 1.5-1.5 1.5h-3C5.5 2 5 1.5 5 .5V0h6zM11 16v-.5c0-1-.5-1.5-1.5-1.5h-3c-1 0-1.5.5-1.5 1.5v.5h6z' /></svg>\"\n>\n</pdf-shy-button>\n", styles: ["button{padding:0;margin-top:0;margin-bottom:0}\n"], dependencies: [{ kind: "component", type: i2.PdfShyButtonComponent, selector: "pdf-shy-button", inputs: ["primaryToolbarId", "secondaryMenuId", "cssClass", "eventBusName", "l10nId", "l10nLabel", "title", "toggled", "disabled", "order", "action", "closeOnClick", "onlySecondaryMenu", "image"] }, { kind: "pipe", type: i3.ResponsiveCSSClassPipe, name: "responsiveCSSClass" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfVerticalScrollModeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-vertical-scroll-mode', template: "<pdf-shy-button\n  [cssClass]=\"show | responsiveCSSClass : 'always-in-secondary-menu'\"\n  title=\"Use Vertical Scrolling\"\n  primaryToolbarId=\"scrollVertical\"\n  l10nId=\"pdfjs-scroll-vertical-button\"\n  [toggled]=\"scrollMode == 0 && pageViewMode !== 'book'\"\n  [action]=\"onClick\"\n  l10nLabel=\"pdfjs-scroll-vertical-button-label\"\n  [order]=\"3100\"\n  [closeOnClick]=\"false\"\n  image=\"<svg class='pdf-margin-top-3px' width='24px' height='24px' viewBox='0 0 24 24'><path fill='currentColor' d='M9.5 4c1 0 1.5.5 1.5 1.5v5c0 1-.5 1.5-1.5 1.5h-3c-1 0-1.5-.5-1.5-1.5v-5C5 4.5 5.5 4 6.5 4zM11 0v.5c0 1-.5 1.5-1.5 1.5h-3C5.5 2 5 1.5 5 .5V0h6zM11 16v-.5c0-1-.5-1.5-1.5-1.5h-3c-1 0-1.5.5-1.5 1.5v.5h6z' /></svg>\"\n>\n</pdf-shy-button>\n", styles: ["button{padding:0;margin-top:0;margin-bottom:0}\n"] }]
        }], ctorParameters: () => [{ type: i1.PDFNotificationService }, { type: i0.NgZone }], propDecorators: { show: [{
                type: Input
            }], scrollMode: [{
                type: Input
            }], pageViewMode: [{
                type: Input
            }], pageViewModeChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXZlcnRpY2FsLXNjcm9sbC1tb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvdG9vbGJhci9wZGYtdmVydGljYWwtc2Nyb2xsLWJ1dHRvbi9wZGYtdmVydGljYWwtc2Nyb2xsLW1vZGUuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi90b29sYmFyL3BkZi12ZXJ0aWNhbC1zY3JvbGwtYnV0dG9uL3BkZi12ZXJ0aWNhbC1zY3JvbGwtbW9kZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2RixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sK0JBQStCLENBQUM7Ozs7O0FBVzNELE1BQU0sT0FBTyw4QkFBOEI7SUFpQnJCO0lBQXFEO0lBZmxFLElBQUksR0FBeUIsSUFBSSxDQUFDO0lBR2xDLFVBQVUsQ0FBaUI7SUFHM0IsWUFBWSxDQUFtQjtJQUcvQixrQkFBa0IsR0FBRyxJQUFJLFlBQVksRUFBb0IsQ0FBQztJQUUxRCxPQUFPLENBQWE7SUFFbkIsb0JBQW9CLENBQW9DO0lBRWhFLFlBQW9CLG1CQUEyQyxFQUFVLE1BQWM7UUFBbkUsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUF3QjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDckYsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxtQkFBbUIsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3BFLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO2dCQUM3QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDcEI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztRQUN4QyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7Z0JBQ25CLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxVQUFVLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxpQkFBaUIsRUFBRTtvQkFDL0UsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDMUI7Z0JBQ0QsSUFBSSxDQUFDLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDbEcsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRU0sV0FBVztRQUNoQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO3dHQXpDVSw4QkFBOEI7NEZBQTlCLDhCQUE4Qix5TUNaM0MsMnVCQWFBOzs0RkREYSw4QkFBOEI7a0JBTDFDLFNBQVM7K0JBQ0UsMEJBQTBCO2dIQU03QixJQUFJO3NCQURWLEtBQUs7Z0JBSUMsVUFBVTtzQkFEaEIsS0FBSztnQkFJQyxZQUFZO3NCQURsQixLQUFLO2dCQUlDLGtCQUFrQjtzQkFEeEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgTmdab25lLCBPdXRwdXQsIGVmZmVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2Nyb2xsTW9kZSB9IGZyb20gJy4uLy4uL29wdGlvbnMvcGRmLXNjcm9sbC1tb2RlJztcbmltcG9ydCB7IFBhZ2VWaWV3TW9kZVR5cGUsIFNjcm9sbE1vZGVUeXBlIH0gZnJvbSAnLi4vLi4vb3B0aW9ucy9wZGYtdmlld2VyJztcbmltcG9ydCB7IElQREZWaWV3ZXJBcHBsaWNhdGlvbiB9IGZyb20gJy4uLy4uL29wdGlvbnMvcGRmLXZpZXdlci1hcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBQREZOb3RpZmljYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vcGRmLW5vdGlmaWNhdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IFJlc3BvbnNpdmVWaXNpYmlsaXR5IH0gZnJvbSAnLi4vLi4vcmVzcG9uc2l2ZS12aXNpYmlsaXR5JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGRmLXZlcnRpY2FsLXNjcm9sbC1tb2RlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BkZi12ZXJ0aWNhbC1zY3JvbGwtbW9kZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3BkZi12ZXJ0aWNhbC1zY3JvbGwtbW9kZS5jb21wb25lbnQuY3NzJ10sXG59KVxuZXhwb3J0IGNsYXNzIFBkZlZlcnRpY2FsU2Nyb2xsTW9kZUNvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93OiBSZXNwb25zaXZlVmlzaWJpbGl0eSA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNjcm9sbE1vZGU6IFNjcm9sbE1vZGVUeXBlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBwYWdlVmlld01vZGU6IFBhZ2VWaWV3TW9kZVR5cGU7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBwYWdlVmlld01vZGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFBhZ2VWaWV3TW9kZVR5cGU+KCk7XG5cbiAgcHVibGljIG9uQ2xpY2s6ICgpID0+IHZvaWQ7XG5cbiAgcHJpdmF0ZSBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uIHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbm90aWZpY2F0aW9uU2VydmljZTogUERGTm90aWZpY2F0aW9uU2VydmljZSwgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSkge1xuICAgIGVmZmVjdCgoKSA9PiB7XG4gICAgICB0aGlzLlBERlZpZXdlckFwcGxpY2F0aW9uID0gbm90aWZpY2F0aW9uU2VydmljZS5vblBERkpTSW5pdFNpZ25hbCgpO1xuICAgICAgaWYgKHRoaXMuUERGVmlld2VyQXBwbGljYXRpb24pIHtcbiAgICAgICAgdGhpcy5vblBkZkpzSW5pdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGVtaXR0ZXIgPSB0aGlzLnBhZ2VWaWV3TW9kZUNoYW5nZTtcbiAgICB0aGlzLm9uQ2xpY2sgPSAoKSA9PiB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYWdlVmlld01vZGUgIT09ICdtdWx0aXBsZScgJiYgdGhpcy5wYWdlVmlld01vZGUgIT09ICdpbmZpbml0ZS1zY3JvbGwnKSB7XG4gICAgICAgICAgZW1pdHRlci5lbWl0KCdtdWx0aXBsZScpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuUERGVmlld2VyQXBwbGljYXRpb24/LmV2ZW50QnVzLmRpc3BhdGNoKCdzd2l0Y2hzY3JvbGxtb2RlJywgeyBtb2RlOiBTY3JvbGxNb2RlLlZFUlRJQ0FMIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBvblBkZkpzSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLlBERlZpZXdlckFwcGxpY2F0aW9uPy5ldmVudEJ1cy5vbignc3dpdGNoc2Nyb2xsbW9kZScsIChldmVudCkgPT4ge1xuICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5zY3JvbGxNb2RlID0gZXZlbnQubW9kZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iLCI8cGRmLXNoeS1idXR0b25cbiAgW2Nzc0NsYXNzXT1cInNob3cgfCByZXNwb25zaXZlQ1NTQ2xhc3MgOiAnYWx3YXlzLWluLXNlY29uZGFyeS1tZW51J1wiXG4gIHRpdGxlPVwiVXNlIFZlcnRpY2FsIFNjcm9sbGluZ1wiXG4gIHByaW1hcnlUb29sYmFySWQ9XCJzY3JvbGxWZXJ0aWNhbFwiXG4gIGwxMG5JZD1cInBkZmpzLXNjcm9sbC12ZXJ0aWNhbC1idXR0b25cIlxuICBbdG9nZ2xlZF09XCJzY3JvbGxNb2RlID09IDAgJiYgcGFnZVZpZXdNb2RlICE9PSAnYm9vaydcIlxuICBbYWN0aW9uXT1cIm9uQ2xpY2tcIlxuICBsMTBuTGFiZWw9XCJwZGZqcy1zY3JvbGwtdmVydGljYWwtYnV0dG9uLWxhYmVsXCJcbiAgW29yZGVyXT1cIjMxMDBcIlxuICBbY2xvc2VPbkNsaWNrXT1cImZhbHNlXCJcbiAgaW1hZ2U9XCI8c3ZnIGNsYXNzPSdwZGYtbWFyZ2luLXRvcC0zcHgnIHdpZHRoPScyNHB4JyBoZWlnaHQ9JzI0cHgnIHZpZXdCb3g9JzAgMCAyNCAyNCc+PHBhdGggZmlsbD0nY3VycmVudENvbG9yJyBkPSdNOS41IDRjMSAwIDEuNS41IDEuNSAxLjV2NWMwIDEtLjUgMS41LTEuNSAxLjVoLTNjLTEgMC0xLjUtLjUtMS41LTEuNXYtNUM1IDQuNSA1LjUgNCA2LjUgNHpNMTEgMHYuNWMwIDEtLjUgMS41LTEuNSAxLjVoLTNDNS41IDIgNSAxLjUgNSAuNVYwaDZ6TTExIDE2di0uNWMwLTEtLjUtMS41LTEuNS0xLjVoLTNjLTEgMC0xLjUuNS0xLjUgMS41di41aDZ6JyAvPjwvc3ZnPlwiXG4+XG48L3BkZi1zaHktYnV0dG9uPlxuIl19