import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Input, Output, PLATFORM_ID, effect, } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./../../pdf-notification-service";
import * as i2 from "../../toolbar/pdf-shy-button/pdf-shy-button-service";
import * as i3 from "../../ngx-extended-pdf-viewer.service";
import * as i4 from "@angular/common";
import * as i5 from "../../responsive-visibility";
export class PdfSecondaryToolbarComponent {
    element;
    notificationService;
    platformId;
    pdfShyButtonService;
    ngxExtendedPdfViewerService;
    customSecondaryToolbar;
    secondaryToolbarTop;
    mobileFriendlyZoomScale;
    localizationInitialized;
    spreadChange = new EventEmitter();
    disablePreviousPage = true;
    disableNextPage = true;
    classMutationObserver;
    PDFViewerApplication;
    constructor(element, notificationService, platformId, pdfShyButtonService, ngxExtendedPdfViewerService) {
        this.element = element;
        this.notificationService = notificationService;
        this.platformId = platformId;
        this.pdfShyButtonService = pdfShyButtonService;
        this.ngxExtendedPdfViewerService = ngxExtendedPdfViewerService;
        effect(() => {
            this.PDFViewerApplication = notificationService.onPDFJSInitSignal();
            if (this.PDFViewerApplication) {
                this.onPdfJsInit();
            }
        });
    }
    onPdfJsInit() {
        this.PDFViewerApplication?.eventBus.on('pagechanging', () => {
            this.updateUIState();
        });
        this.PDFViewerApplication?.eventBus.on('pagerendered', () => {
            this.updateUIState();
        });
    }
    updateUIState() {
        setTimeout(() => {
            const currentPage = this.PDFViewerApplication?.pdfViewer.currentPageNumber;
            const previousButton = document.getElementById('previousPage');
            if (previousButton) {
                this.disablePreviousPage = Number(currentPage) <= 1;
                previousButton.disabled = this.disablePreviousPage;
            }
            const nextButton = document.getElementById('nextPage');
            if (nextButton) {
                this.disableNextPage = currentPage === this.PDFViewerApplication?.pagesCount;
                nextButton.disabled = this.disableNextPage;
            }
        });
    }
    onSpreadChange(newSpread) {
        this.spreadChange.emit(newSpread);
    }
    ngOnChanges(changes) {
        setTimeout(() => this.checkVisibility());
    }
    onResize() {
        setTimeout(() => this.checkVisibility());
    }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            const targetNode = this.element.nativeElement;
            const config = { attributes: true, childList: true, subtree: true };
            this.classMutationObserver = new MutationObserver((mutationList, observer) => {
                for (const mutation of mutationList) {
                    if (mutation.type === 'attributes') {
                        if (mutation.attributeName === 'class') {
                            this.checkVisibility();
                            break;
                        }
                    }
                    else if (mutation.type === 'childList') {
                        this.checkVisibility();
                        break;
                    }
                }
            });
            this.classMutationObserver.observe(targetNode, config);
        }
    }
    ngOnDestroy() {
        if (this.classMutationObserver) {
            this.classMutationObserver.disconnect();
            this.classMutationObserver = undefined;
        }
    }
    checkVisibility() {
        let visibleButtons = 0;
        const e = this.element.nativeElement;
        const f = e.children.item(0);
        if (f) {
            const g = f.children.item(0);
            if (g && g instanceof HTMLElement) {
                visibleButtons = this.checkVisibilityRecursively(g);
            }
        }
        this.ngxExtendedPdfViewerService.secondaryMenuIsEmpty = visibleButtons === 0;
    }
    checkVisibilityRecursively(e) {
        if (typeof window === 'undefined') {
            // server-side rendering
            return 0;
        }
        if (e.style.display === 'none') {
            return 0;
        }
        if (e.classList.contains('hidden')) {
            return 0;
        }
        if (e.classList.contains('invisible')) {
            return 0;
        }
        const style = window.getComputedStyle(e);
        if (style.display === 'none') {
            return 0;
        }
        if (e instanceof HTMLButtonElement || e instanceof HTMLAnchorElement) {
            return 1;
        }
        let count = 0;
        const children = e.children;
        if (children?.length) {
            for (let i = 0; i < children.length && count === 0; i++) {
                const child = children.item(i);
                if (child && child instanceof HTMLElement) {
                    count += this.checkVisibilityRecursively(child);
                }
            }
        }
        return count;
    }
    onClick(htmlevent, action, eventBusName, closeOnClick) {
        const PDFViewerApplication = window.PDFViewerApplication;
        const origin = htmlevent.target;
        origin?.classList.add('toggled');
        if (action) {
            action(htmlevent, true);
            htmlevent.preventDefault();
        }
        else if (eventBusName) {
            PDFViewerApplication.eventBus.dispatch(eventBusName);
            htmlevent.preventDefault();
        }
        if (closeOnClick) {
            PDFViewerApplication.secondaryToolbar.close();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfSecondaryToolbarComponent, deps: [{ token: i0.ElementRef }, { token: i1.PDFNotificationService }, { token: PLATFORM_ID }, { token: i2.PdfShyButtonService }, { token: i3.NgxExtendedPdfViewerService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfSecondaryToolbarComponent, selector: "pdf-secondary-toolbar", inputs: { customSecondaryToolbar: "customSecondaryToolbar", secondaryToolbarTop: "secondaryToolbarTop", mobileFriendlyZoomScale: "mobileFriendlyZoomScale", localizationInitialized: "localizationInitialized" }, outputs: { spreadChange: "spreadChange" }, host: { listeners: { "window:resize": "onResize()" } }, usesOnChanges: true, ngImport: i0, template: "<ng-container [ngTemplateOutlet]=\"customSecondaryToolbar ? customSecondaryToolbar : defaultSecondaryToolbar\"> </ng-container>\n\n<ng-template #defaultSecondaryToolbar>\n  <div\n    id=\"secondaryToolbar\"\n    class=\"secondaryToolbar hidden doorHangerRight\"\n    [style.top]=\"secondaryToolbarTop\"\n    [style.transform]=\"'scale(' + mobileFriendlyZoomScale + ')'\"\n    [style.transformOrigin]=\"'right top'\"\n  >\n    <div id=\"secondaryToolbarButtonContainer\">\n      <button\n        *ngFor=\"let button of pdfShyButtonService.buttons\"\n        type=\"button\"\n        [id]=\"button.id\"\n        [ngClass]=\"button.cssClass | invertForSecondaryToolbar\"\n        [class.toggled]=\"button.toggled\"\n        class=\"secondaryToolbarButton\"\n        [title]=\"button.title\"\n        [attr.data-l10n-id]=\"button.l10nId\"\n        (click)=\"onClick($event, button.action, button.eventBusName, button.closeOnClick)\"\n        [attr.aria-label]=\"button.title\"\n        role=\"button\"\n      >\n        <span class=\"icon\" role=\"img\" aria-hidden=\"true\" [attr.aria-label]=\"button.title\" *ngIf=\"button.image\" [innerHTML]=\"button.image\"></span>\n        <span class=\"toolbar-caption\" [attr.data-l10n-id]=\"button.l10nLabel\">{{ button.title }}</span>\n      </button>\n    </div>\n  </div>\n</ng-template>\n", styles: ["svg{position:absolute;display:inline-block;top:0;left:0}.secondaryToolbarButton{display:inline-flex;align-items:center;justify-content:flex-start;border:0 none;background:none;width:calc(100% - 4px);height:25px;position:relative;margin:0 0 4px;padding:3px 0 1px;min-height:25px;white-space:normal}.secondaryToolbarButton span{display:inline-block}.secondaryToolbarButton[disabled]{opacity:.5}::ng-deep html[dir=ltr] ngx-extended-pdf-viewer .secondaryToolbarButton{padding-left:4px;text-align:left}::ng-deep html[dir=rtl] ngx-extended-pdf-viewer .secondaryToolbarButton{padding-right:4px;text-align:right}::ng-deep html[dir=ltr] ngx-extended-pdf-viewer .secondaryToolbarButton>span{padding-right:4px}::ng-deep html[dir=rtl] ngx-extended-pdf-viewer .secondaryToolbarButton>span{padding-left:4px}.secondaryToolbar{height:auto;z-index:3000}::ng-deep html[dir=ltr] ngx-extended-pdf-viewer .secondaryToolbar{right:4px}::ng-deep [dir=rtl] ngx-extended-pdf-viewer .secondaryToolbar{left:4px}#secondaryToolbarButtonContainer{width:250px;max-height:775px;overflow-y:auto;-webkit-overflow-scrolling:touch}.toolbar-caption{position:relative;top:-3px}.icon{width:24px}\n"], dependencies: [{ kind: "directive", type: i4.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i4.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "pipe", type: i5.NegativeResponsiveCSSClassPipe, name: "invertForSecondaryToolbar" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfSecondaryToolbarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-secondary-toolbar', template: "<ng-container [ngTemplateOutlet]=\"customSecondaryToolbar ? customSecondaryToolbar : defaultSecondaryToolbar\"> </ng-container>\n\n<ng-template #defaultSecondaryToolbar>\n  <div\n    id=\"secondaryToolbar\"\n    class=\"secondaryToolbar hidden doorHangerRight\"\n    [style.top]=\"secondaryToolbarTop\"\n    [style.transform]=\"'scale(' + mobileFriendlyZoomScale + ')'\"\n    [style.transformOrigin]=\"'right top'\"\n  >\n    <div id=\"secondaryToolbarButtonContainer\">\n      <button\n        *ngFor=\"let button of pdfShyButtonService.buttons\"\n        type=\"button\"\n        [id]=\"button.id\"\n        [ngClass]=\"button.cssClass | invertForSecondaryToolbar\"\n        [class.toggled]=\"button.toggled\"\n        class=\"secondaryToolbarButton\"\n        [title]=\"button.title\"\n        [attr.data-l10n-id]=\"button.l10nId\"\n        (click)=\"onClick($event, button.action, button.eventBusName, button.closeOnClick)\"\n        [attr.aria-label]=\"button.title\"\n        role=\"button\"\n      >\n        <span class=\"icon\" role=\"img\" aria-hidden=\"true\" [attr.aria-label]=\"button.title\" *ngIf=\"button.image\" [innerHTML]=\"button.image\"></span>\n        <span class=\"toolbar-caption\" [attr.data-l10n-id]=\"button.l10nLabel\">{{ button.title }}</span>\n      </button>\n    </div>\n  </div>\n</ng-template>\n", styles: ["svg{position:absolute;display:inline-block;top:0;left:0}.secondaryToolbarButton{display:inline-flex;align-items:center;justify-content:flex-start;border:0 none;background:none;width:calc(100% - 4px);height:25px;position:relative;margin:0 0 4px;padding:3px 0 1px;min-height:25px;white-space:normal}.secondaryToolbarButton span{display:inline-block}.secondaryToolbarButton[disabled]{opacity:.5}::ng-deep html[dir=ltr] ngx-extended-pdf-viewer .secondaryToolbarButton{padding-left:4px;text-align:left}::ng-deep html[dir=rtl] ngx-extended-pdf-viewer .secondaryToolbarButton{padding-right:4px;text-align:right}::ng-deep html[dir=ltr] ngx-extended-pdf-viewer .secondaryToolbarButton>span{padding-right:4px}::ng-deep html[dir=rtl] ngx-extended-pdf-viewer .secondaryToolbarButton>span{padding-left:4px}.secondaryToolbar{height:auto;z-index:3000}::ng-deep html[dir=ltr] ngx-extended-pdf-viewer .secondaryToolbar{right:4px}::ng-deep [dir=rtl] ngx-extended-pdf-viewer .secondaryToolbar{left:4px}#secondaryToolbarButtonContainer{width:250px;max-height:775px;overflow-y:auto;-webkit-overflow-scrolling:touch}.toolbar-caption{position:relative;top:-3px}.icon{width:24px}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.PDFNotificationService }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i2.PdfShyButtonService }, { type: i3.NgxExtendedPdfViewerService }], propDecorators: { customSecondaryToolbar: [{
                type: Input
            }], secondaryToolbarTop: [{
                type: Input
            }], mobileFriendlyZoomScale: [{
                type: Input
            }], localizationInitialized: [{
                type: Input
            }], spreadChange: [{
                type: Output
            }], onResize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXNlY29uZGFyeS10b29sYmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvc2Vjb25kYXJ5LXRvb2xiYXIvcGRmLXNlY29uZGFyeS10b29sYmFyL3BkZi1zZWNvbmRhcnktdG9vbGJhci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci9zcmMvbGliL3NlY29uZGFyeS10b29sYmFyL3BkZi1zZWNvbmRhcnktdG9vbGJhci9wZGYtc2Vjb25kYXJ5LXRvb2xiYXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUNOLFdBQVcsRUFHWCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7QUFXdkIsTUFBTSxPQUFPLDRCQUE0QjtJQXlCN0I7SUFDRDtJQUNzQjtJQUN0QjtJQUNDO0lBM0JILHNCQUFzQixDQUErQjtJQUdyRCxtQkFBbUIsQ0FBQztJQUdwQix1QkFBdUIsQ0FBUztJQUdoQyx1QkFBdUIsQ0FBVTtJQUdqQyxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQTBCLENBQUM7SUFFMUQsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0lBRTNCLGVBQWUsR0FBRyxJQUFJLENBQUM7SUFFdEIscUJBQXFCLENBQStCO0lBRXBELG9CQUFvQixDQUFvQztJQUVoRSxZQUNVLE9BQW1CLEVBQ3BCLG1CQUEyQyxFQUNyQixVQUFrQixFQUN4QyxtQkFBd0MsRUFDdkMsMkJBQXdEO1FBSnhELFlBQU8sR0FBUCxPQUFPLENBQVk7UUFDcEIsd0JB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TSxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQXFCLENBQUM7UUFDL0MsTUFBTSxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakMsSUFBSSxNQUFNLEVBQUU7WUFDVixNQUFNLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hCLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUM1QjthQUFNLElBQUksWUFBWSxFQUFFO1lBQ3ZCLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckQsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzVCO1FBQ0QsSUFBSSxZQUFZLEVBQUU7WUFDaEIsb0JBQW9CLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDL0M7SUFDSCxDQUFDO3dHQWhMVSw0QkFBNEIsa0ZBMkI3QixXQUFXOzRGQTNCViw0QkFBNEIsdVlDM0J6QyxvekNBOEJBOzs0RkRIYSw0QkFBNEI7a0JBTHhDLFNBQVM7K0JBQ0UsdUJBQXVCOzswQkErQjlCLE1BQU07MkJBQUMsV0FBVztxSEF6QmQsc0JBQXNCO3NCQUQ1QixLQUFLO2dCQUlDLG1CQUFtQjtzQkFEekIsS0FBSztnQkFJQyx1QkFBdUI7c0JBRDdCLEtBQUs7Z0JBSUMsdUJBQXVCO3NCQUQ3QixLQUFLO2dCQUlDLFlBQVk7c0JBRGxCLE1BQU07Z0JBNERBLFFBQVE7c0JBRGQsWUFBWTt1QkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUExBVEZPUk1fSUQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBlZmZlY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmd4RXh0ZW5kZWRQZGZWaWV3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBJUERGVmlld2VyQXBwbGljYXRpb24gfSBmcm9tICcuLi8uLi9vcHRpb25zL3BkZi12aWV3ZXItYXBwbGljYXRpb24nO1xuaW1wb3J0IHsgUGRmU2h5QnV0dG9uU2VydmljZSB9IGZyb20gJy4uLy4uL3Rvb2xiYXIvcGRmLXNoeS1idXR0b24vcGRmLXNoeS1idXR0b24tc2VydmljZSc7XG5pbXBvcnQgeyBQREZOb3RpZmljYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi8uLi8uLi9wZGYtbm90aWZpY2F0aW9uLXNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZGYtc2Vjb25kYXJ5LXRvb2xiYXInLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLXNlY29uZGFyeS10b29sYmFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcGRmLXNlY29uZGFyeS10b29sYmFyLmNvbXBvbmVudC5jc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgUGRmU2Vjb25kYXJ5VG9vbGJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KClcbiAgcHVibGljIGN1c3RvbVNlY29uZGFyeVRvb2xiYXI6IFRlbXBsYXRlUmVmPGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNlY29uZGFyeVRvb2xiYXJUb3A7XG5cbiAgQElucHV0KClcbiAgcHVibGljIG1vYmlsZUZyaWVuZGx5Wm9vbVNjYWxlOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGxvY2FsaXphdGlvbkluaXRpYWxpemVkOiBib29sZWFuO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgc3ByZWFkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjwnb2ZmJyB8ICdldmVuJyB8ICdvZGQnPigpO1xuXG4gIHB1YmxpYyBkaXNhYmxlUHJldmlvdXNQYWdlID0gdHJ1ZTtcblxuICBwdWJsaWMgZGlzYWJsZU5leHRQYWdlID0gdHJ1ZTtcblxuICBwcml2YXRlIGNsYXNzTXV0YXRpb25PYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciB8IHVuZGVmaW5lZDtcblxuICBwcml2YXRlIFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyBub3RpZmljYXRpb25TZXJ2aWNlOiBQREZOb3RpZmljYXRpb25TZXJ2aWNlLFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogT2JqZWN0LFxuICAgIHB1YmxpYyBwZGZTaHlCdXR0b25TZXJ2aWNlOiBQZGZTaHlCdXR0b25TZXJ2aWNlLFxuICAgIHByaXZhdGUgbmd4RXh0ZW5kZWRQZGZWaWV3ZXJTZXJ2aWNlOiBOZ3hFeHRlbmRlZFBkZlZpZXdlclNlcnZpY2VcbiAgKSB7XG4gICAgZWZmZWN0KCgpID0+IHtcbiAgICAgIHRoaXMuUERGVmlld2VyQXBwbGljYXRpb24gPSBub3RpZmljYXRpb25TZXJ2aWNlLm9uUERGSlNJbml0U2lnbmFsKCk7XG4gICAgICBpZiAodGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbikge1xuICAgICAgICB0aGlzLm9uUGRmSnNJbml0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25QZGZKc0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbj8uZXZlbnRCdXMub24oJ3BhZ2VjaGFuZ2luZycsICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlVUlTdGF0ZSgpO1xuICAgIH0pO1xuICAgIHRoaXMuUERGVmlld2VyQXBwbGljYXRpb24/LmV2ZW50QnVzLm9uKCdwYWdlcmVuZGVyZWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVVJU3RhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVVSVN0YXRlKCk6IHZvaWQge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFBhZ2UgPSB0aGlzLlBERlZpZXdlckFwcGxpY2F0aW9uPy5wZGZWaWV3ZXIuY3VycmVudFBhZ2VOdW1iZXI7XG4gICAgICBjb25zdCBwcmV2aW91c0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcmV2aW91c1BhZ2UnKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgIGlmIChwcmV2aW91c0J1dHRvbikge1xuICAgICAgICB0aGlzLmRpc2FibGVQcmV2aW91c1BhZ2UgPSBOdW1iZXIoY3VycmVudFBhZ2UpIDw9IDE7XG4gICAgICAgIHByZXZpb3VzQnV0dG9uLmRpc2FibGVkID0gdGhpcy5kaXNhYmxlUHJldmlvdXNQYWdlO1xuICAgICAgfVxuICAgICAgY29uc3QgbmV4dEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXh0UGFnZScpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgaWYgKG5leHRCdXR0b24pIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlTmV4dFBhZ2UgPSBjdXJyZW50UGFnZSA9PT0gdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbj8ucGFnZXNDb3VudDtcbiAgICAgICAgbmV4dEJ1dHRvbi5kaXNhYmxlZCA9IHRoaXMuZGlzYWJsZU5leHRQYWdlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uU3ByZWFkQ2hhbmdlKG5ld1NwcmVhZDogJ29mZicgfCAnb2RkJyB8ICdldmVuJyk6IHZvaWQge1xuICAgIHRoaXMuc3ByZWFkQ2hhbmdlLmVtaXQobmV3U3ByZWFkKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmNoZWNrVmlzaWJpbGl0eSgpKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxuICBwdWJsaWMgb25SZXNpemUoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmNoZWNrVmlzaWJpbGl0eSgpKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIGNvbnN0IHRhcmdldE5vZGUgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgY29uc3QgY29uZmlnID0geyBhdHRyaWJ1dGVzOiB0cnVlLCBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfTtcblxuICAgICAgdGhpcy5jbGFzc011dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25MaXN0OiBNdXRhdGlvblJlY29yZFtdLCBvYnNlcnZlcikgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9uTGlzdCkge1xuICAgICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSAnYXR0cmlidXRlcycpIHtcbiAgICAgICAgICAgIGlmIChtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lID09PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgIHRoaXMuY2hlY2tWaXNpYmlsaXR5KCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tWaXNpYmlsaXR5KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmNsYXNzTXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKHRhcmdldE5vZGUsIGNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNsYXNzTXV0YXRpb25PYnNlcnZlcikge1xuICAgICAgdGhpcy5jbGFzc011dGF0aW9uT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgdGhpcy5jbGFzc011dGF0aW9uT2JzZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGNoZWNrVmlzaWJpbGl0eSgpOiB2b2lkIHtcbiAgICBsZXQgdmlzaWJsZUJ1dHRvbnMgPSAwO1xuICAgIGNvbnN0IGUgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBmID0gZS5jaGlsZHJlbi5pdGVtKDApO1xuICAgIGlmIChmKSB7XG4gICAgICBjb25zdCBnID0gZi5jaGlsZHJlbi5pdGVtKDApO1xuICAgICAgaWYgKGcgJiYgZyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHZpc2libGVCdXR0b25zID0gdGhpcy5jaGVja1Zpc2liaWxpdHlSZWN1cnNpdmVseShnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5uZ3hFeHRlbmRlZFBkZlZpZXdlclNlcnZpY2Uuc2Vjb25kYXJ5TWVudUlzRW1wdHkgPSB2aXNpYmxlQnV0dG9ucyA9PT0gMDtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tWaXNpYmlsaXR5UmVjdXJzaXZlbHkoZTogSFRNTEVsZW1lbnQpOiBudW1iZXIge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gc2VydmVyLXNpZGUgcmVuZGVyaW5nXG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgaWYgKGUuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRkZW4nKSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGlmIChlLmNsYXNzTGlzdC5jb250YWlucygnaW52aXNpYmxlJykpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZSk7XG4gICAgaWYgKHN0eWxlLmRpc3BsYXkgPT09ICdub25lJykge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgaWYgKGUgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCB8fCBlIGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gZS5jaGlsZHJlbjtcbiAgICBpZiAoY2hpbGRyZW4/Lmxlbmd0aCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGggJiYgY291bnQgPT09IDA7IGkrKykge1xuICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuLml0ZW0oaSk7XG4gICAgICAgIGlmIChjaGlsZCAmJiBjaGlsZCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgY291bnQgKz0gdGhpcy5jaGVja1Zpc2liaWxpdHlSZWN1cnNpdmVseShjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgcHVibGljIG9uQ2xpY2soXG4gICAgaHRtbGV2ZW50OiBFdmVudCxcbiAgICBhY3Rpb246IHVuZGVmaW5lZCB8ICgoaHRtbGV2ZW50OiBFdmVudCwgc2Vjb25kYXJ5VG9vbGJhcjogYm9vbGVhbikgPT4gdm9pZCksXG4gICAgZXZlbnRCdXNOYW1lPzogc3RyaW5nLFxuICAgIGNsb3NlT25DbGljaz86IGJvb2xlYW5cbiAgKTogdm9pZCB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBjb25zdCBvcmlnaW4gPSBodG1sZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgIG9yaWdpbj8uY2xhc3NMaXN0LmFkZCgndG9nZ2xlZCcpO1xuICAgIGlmIChhY3Rpb24pIHtcbiAgICAgIGFjdGlvbihodG1sZXZlbnQsIHRydWUpO1xuICAgICAgaHRtbGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSBlbHNlIGlmIChldmVudEJ1c05hbWUpIHtcbiAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLmRpc3BhdGNoKGV2ZW50QnVzTmFtZSk7XG4gICAgICBodG1sZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgaWYgKGNsb3NlT25DbGljaykge1xuICAgICAgUERGVmlld2VyQXBwbGljYXRpb24uc2Vjb25kYXJ5VG9vbGJhci5jbG9zZSgpO1xuICAgIH1cbiAgfVxufVxuIiwiPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21TZWNvbmRhcnlUb29sYmFyID8gY3VzdG9tU2Vjb25kYXJ5VG9vbGJhciA6IGRlZmF1bHRTZWNvbmRhcnlUb29sYmFyXCI+IDwvbmctY29udGFpbmVyPlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHRTZWNvbmRhcnlUb29sYmFyPlxuICA8ZGl2XG4gICAgaWQ9XCJzZWNvbmRhcnlUb29sYmFyXCJcbiAgICBjbGFzcz1cInNlY29uZGFyeVRvb2xiYXIgaGlkZGVuIGRvb3JIYW5nZXJSaWdodFwiXG4gICAgW3N0eWxlLnRvcF09XCJzZWNvbmRhcnlUb29sYmFyVG9wXCJcbiAgICBbc3R5bGUudHJhbnNmb3JtXT1cIidzY2FsZSgnICsgbW9iaWxlRnJpZW5kbHlab29tU2NhbGUgKyAnKSdcIlxuICAgIFtzdHlsZS50cmFuc2Zvcm1PcmlnaW5dPVwiJ3JpZ2h0IHRvcCdcIlxuICA+XG4gICAgPGRpdiBpZD1cInNlY29uZGFyeVRvb2xiYXJCdXR0b25Db250YWluZXJcIj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgKm5nRm9yPVwibGV0IGJ1dHRvbiBvZiBwZGZTaHlCdXR0b25TZXJ2aWNlLmJ1dHRvbnNcIlxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgW2lkXT1cImJ1dHRvbi5pZFwiXG4gICAgICAgIFtuZ0NsYXNzXT1cImJ1dHRvbi5jc3NDbGFzcyB8IGludmVydEZvclNlY29uZGFyeVRvb2xiYXJcIlxuICAgICAgICBbY2xhc3MudG9nZ2xlZF09XCJidXR0b24udG9nZ2xlZFwiXG4gICAgICAgIGNsYXNzPVwic2Vjb25kYXJ5VG9vbGJhckJ1dHRvblwiXG4gICAgICAgIFt0aXRsZV09XCJidXR0b24udGl0bGVcIlxuICAgICAgICBbYXR0ci5kYXRhLWwxMG4taWRdPVwiYnV0dG9uLmwxMG5JZFwiXG4gICAgICAgIChjbGljayk9XCJvbkNsaWNrKCRldmVudCwgYnV0dG9uLmFjdGlvbiwgYnV0dG9uLmV2ZW50QnVzTmFtZSwgYnV0dG9uLmNsb3NlT25DbGljaylcIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImJ1dHRvbi50aXRsZVwiXG4gICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImljb25cIiByb2xlPVwiaW1nXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJidXR0b24udGl0bGVcIiAqbmdJZj1cImJ1dHRvbi5pbWFnZVwiIFtpbm5lckhUTUxdPVwiYnV0dG9uLmltYWdlXCI+PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzcz1cInRvb2xiYXItY2FwdGlvblwiIFthdHRyLmRhdGEtbDEwbi1pZF09XCJidXR0b24ubDEwbkxhYmVsXCI+e3sgYnV0dG9uLnRpdGxlIH19PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==