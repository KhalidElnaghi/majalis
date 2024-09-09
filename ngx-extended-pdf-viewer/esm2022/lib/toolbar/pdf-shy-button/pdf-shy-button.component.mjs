import { Component, Input, ViewChild, effect } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./pdf-shy-button-service";
import * as i2 from "@angular/platform-browser";
import * as i3 from "../../pdf-notification-service";
import * as i4 from "@angular/common";
export class PdfShyButtonComponent {
    pdfShyButtonServiceService;
    sanitizer;
    renderer;
    notificationService;
    primaryToolbarId;
    secondaryMenuId;
    cssClass;
    eventBusName = undefined;
    l10nId;
    l10nLabel;
    title;
    toggled;
    disabled;
    order;
    action = undefined;
    closeOnClick = true;
    onlySecondaryMenu = false;
    PDFViewerApplication;
    buttonRef;
    _imageHtml;
    get imageHtml() {
        return this._imageHtml;
    }
    set image(value) {
        const svgTags = [
            // 'a' is not allowed!
            'animate',
            'animateMotion',
            'animateTransform',
            'audio',
            'canvas',
            'circle',
            'clipPath',
            'defs',
            'desc',
            'discard',
            'ellipse',
            'feBlend',
            'feColorMatrix',
            'feComponentTransfer',
            'feComposite',
            'feConvolveMatrix',
            'feDiffuseLighting',
            'feDisplacementMap',
            'feDistantLight',
            'feDropShadow',
            'feFlood',
            'feFuncA',
            'feFuncB',
            'feFuncG',
            'feFuncR',
            'feGaussianBlur',
            'feImage',
            'feMerge',
            'feMergeNode',
            'feMorphology',
            'feOffset',
            'fePointLight',
            'feSpecularLighting',
            'feSpotLight',
            'feTile',
            'feTurbulence',
            'filter',
            'foreignObject',
            'g',
            'iframe',
            'image',
            'line',
            'linearGradient',
            'marker',
            'mask',
            'metadata',
            'mpath',
            'path',
            'pattern',
            'polygon',
            'polyline',
            'radialGradient',
            'rect',
            'script',
            'set',
            'stop',
            'style',
            'svg',
            'switch',
            'symbol',
            'text',
            'textPath',
            'title',
            'tspan',
            'unknown',
            'use',
            'video',
            'view',
        ];
        // only <svg> and SVG tags are allowed
        const tags = value.split('<').filter((tag) => tag.length > 0);
        const legal = tags.every((tag) => tag.startsWith('svg') || tag.startsWith('/') || svgTags.includes(tag.split(/\s|>/)[0]));
        if (!legal) {
            throw new Error('Illegal image for PDFShyButton. Only SVG images are allowed. Please use only the tags <svg> and <path>. ' + value);
        }
        this._imageHtml = this.sanitizeHtml(value);
    }
    constructor(pdfShyButtonServiceService, sanitizer, renderer, notificationService) {
        this.pdfShyButtonServiceService = pdfShyButtonServiceService;
        this.sanitizer = sanitizer;
        this.renderer = renderer;
        this.notificationService = notificationService;
        console.log('PdfRotatePageComponent.constructor');
        effect(() => {
            this.PDFViewerApplication = notificationService.onPDFJSInitSignal();
            console.log('Setting PDFViewerApplication to ', this.PDFViewerApplication);
            if (this.PDFViewerApplication) {
            }
            else {
                console.log('PdfRotatePageComponent.PDFViewerApplication is undefined');
            }
        });
    }
    ngAfterViewInit() {
        this.updateButtonImage();
    }
    ngOnInit() {
        this.pdfShyButtonServiceService.add(this);
    }
    ngOnChanges(changes) {
        this.pdfShyButtonServiceService.update(this);
    }
    sanitizeHtml(html) {
        return this.sanitizer.bypassSecurityTrustHtml(html); // NOSONAR
    }
    onClick(htmlEvent) {
        if (this.action) {
            this.action(htmlEvent, false);
            htmlEvent.preventDefault();
        }
        else if (this.eventBusName) {
            const PDFViewerApplication = window.PDFViewerApplication;
            PDFViewerApplication.eventBus.dispatch(this.eventBusName);
            htmlEvent.preventDefault();
        }
    }
    updateButtonImage() {
        if (this.buttonRef) {
            const el = this.buttonRef.nativeElement;
            if (this._imageHtml) {
                const temp = this.renderer.createElement('div');
                temp.innerHTML = this._imageHtml;
                const image = temp.children[0];
                if (!el.innerHTML.includes(image.innerHTML)) {
                    // if using SSR, the HTML code may already be there
                    this.renderer.appendChild(el, image);
                }
            }
            else {
                const childNodes = el.childNodes;
                for (let child of childNodes) {
                    this.renderer.removeChild(el, child);
                }
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfShyButtonComponent, deps: [{ token: i1.PdfShyButtonService }, { token: i2.DomSanitizer }, { token: i0.Renderer2 }, { token: i3.PDFNotificationService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfShyButtonComponent, selector: "pdf-shy-button", inputs: { primaryToolbarId: "primaryToolbarId", secondaryMenuId: "secondaryMenuId", cssClass: "cssClass", eventBusName: "eventBusName", l10nId: "l10nId", l10nLabel: "l10nLabel", title: "title", toggled: "toggled", disabled: "disabled", order: "order", action: "action", closeOnClick: "closeOnClick", onlySecondaryMenu: "onlySecondaryMenu", image: "image" }, viewQueries: [{ propertyName: "buttonRef", first: true, predicate: ["buttonRef"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<button\n  *ngIf=\"!onlySecondaryMenu\"\n  type=\"button\"\n  [id]=\"primaryToolbarId\"\n  class=\"toolbarButton\"\n  [class]=\"cssClass\"\n  [title]=\"title\"\n  [attr.data-l10n-id]=\"l10nId\"\n  [class.toggled]=\"toggled\"\n  [disabled]=\"disabled\"\n  (click)=\"onClick($event)\"\n  [attr.aria-label]=\"title\"\n  role=\"button\"\n  #buttonRef\n></button>\n", dependencies: [{ kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfShyButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-shy-button', template: "<button\n  *ngIf=\"!onlySecondaryMenu\"\n  type=\"button\"\n  [id]=\"primaryToolbarId\"\n  class=\"toolbarButton\"\n  [class]=\"cssClass\"\n  [title]=\"title\"\n  [attr.data-l10n-id]=\"l10nId\"\n  [class.toggled]=\"toggled\"\n  [disabled]=\"disabled\"\n  (click)=\"onClick($event)\"\n  [attr.aria-label]=\"title\"\n  role=\"button\"\n  #buttonRef\n></button>\n" }]
        }], ctorParameters: () => [{ type: i1.PdfShyButtonService }, { type: i2.DomSanitizer }, { type: i0.Renderer2 }, { type: i3.PDFNotificationService }], propDecorators: { primaryToolbarId: [{
                type: Input
            }], secondaryMenuId: [{
                type: Input
            }], cssClass: [{
                type: Input
            }], eventBusName: [{
                type: Input
            }], l10nId: [{
                type: Input
            }], l10nLabel: [{
                type: Input
            }], title: [{
                type: Input
            }], toggled: [{
                type: Input
            }], disabled: [{
                type: Input
            }], order: [{
                type: Input
            }], action: [{
                type: Input
            }], closeOnClick: [{
                type: Input
            }], onlySecondaryMenu: [{
                type: Input
            }], buttonRef: [{
                type: ViewChild,
                args: ['buttonRef', { static: false }]
            }], image: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXNoeS1idXR0b24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi90b29sYmFyL3BkZi1zaHktYnV0dG9uL3BkZi1zaHktYnV0dG9uLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvdG9vbGJhci9wZGYtc2h5LWJ1dHRvbi9wZGYtc2h5LWJ1dHRvbi5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWlCLFNBQVMsRUFBYyxLQUFLLEVBQWdDLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7OztBQVc3SCxNQUFNLE9BQU8scUJBQXFCO0lBc0l0QjtJQUNBO0lBQ0E7SUFDQTtJQXZJSCxnQkFBZ0IsQ0FBUztJQUd6QixlQUFlLENBQVM7SUFHeEIsUUFBUSxDQUFxQjtJQUc3QixZQUFZLEdBQXVCLFNBQVMsQ0FBQztJQUc3QyxNQUFNLENBQVM7SUFHZixTQUFTLENBQVM7SUFHbEIsS0FBSyxDQUFTO0lBR2QsT0FBTyxDQUFVO0lBR2pCLFFBQVEsQ0FBVTtJQUdsQixLQUFLLENBQVM7SUFHZCxNQUFNLEdBQTBFLFNBQVMsQ0FBQztJQUcxRixZQUFZLEdBQVksSUFBSSxDQUFDO0lBRzdCLGlCQUFpQixHQUFZLEtBQUssQ0FBQztJQUVsQyxvQkFBb0IsQ0FBb0M7SUFFckIsU0FBUyxDQUFhO0lBRXpELFVBQVUsQ0FBVztJQUU3QixJQUFXLFNBQVM7UUFDbEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUNXLEtBQUssQ0FBQyxLQUFhO1FBQzVCLE1BQU0sT0FBTyxHQUFHO1lBQ2Qsc0JBQXNCO1lBQ3RCLFNBQVM7WUFDVCxlQUFlO1lBQ2Ysa0JBQWtC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QkFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUN0QzthQUNGO2lCQUFNO2dCQUNMLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ2pDLEtBQUssSUFBSSxLQUFLLElBQUksVUFBVSxFQUFFO29CQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ3RDO2FBQ0Y7U0FDRjtJQUNILENBQUM7d0dBbk1VLHFCQUFxQjs0RkFBckIscUJBQXFCLHloQkNYbEMsMFdBZUE7OzRGREphLHFCQUFxQjtrQkFKakMsU0FBUzsrQkFDRSxnQkFBZ0I7Z0xBS25CLGdCQUFnQjtzQkFEdEIsS0FBSztnQkFJQyxlQUFlO3NCQURyQixLQUFLO2dCQUlDLFFBQVE7c0JBRGQsS0FBSztnQkFJQyxZQUFZO3NCQURsQixLQUFLO2dCQUlDLE1BQU07c0JBRFosS0FBSztnQkFJQyxTQUFTO3NCQURmLEtBQUs7Z0JBSUMsS0FBSztzQkFEWCxLQUFLO2dCQUlDLE9BQU87c0JBRGIsS0FBSztnQkFJQyxRQUFRO3NCQURkLEtBQUs7Z0JBSUMsS0FBSztzQkFEWCxLQUFLO2dCQUlDLE1BQU07c0JBRFosS0FBSztnQkFJQyxZQUFZO3NCQURsQixLQUFLO2dCQUlDLGlCQUFpQjtzQkFEdkIsS0FBSztnQkFLcUMsU0FBUztzQkFBbkQsU0FBUzt1QkFBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dCQVM5QixLQUFLO3NCQURmLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBPbkNoYW5nZXMsIE9uSW5pdCwgUmVuZGVyZXIyLCBWaWV3Q2hpbGQsIGVmZmVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgSVBERlZpZXdlckFwcGxpY2F0aW9uIH0gZnJvbSAnLi4vLi4vb3B0aW9ucy9wZGYtdmlld2VyLWFwcGxpY2F0aW9uJztcbmltcG9ydCB7IFBERk5vdGlmaWNhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9wZGYtbm90aWZpY2F0aW9uLXNlcnZpY2UnO1xuaW1wb3J0IHsgUmVzcG9uc2l2ZUNTU0NsYXNzIH0gZnJvbSAnLi4vLi4vcmVzcG9uc2l2ZS12aXNpYmlsaXR5JztcbmltcG9ydCB7IFBkZlNoeUJ1dHRvblNlcnZpY2UgfSBmcm9tICcuL3BkZi1zaHktYnV0dG9uLXNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZGYtc2h5LWJ1dHRvbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9wZGYtc2h5LWJ1dHRvbi5jb21wb25lbnQuaHRtbCcsXG59KVxuZXhwb3J0IGNsYXNzIFBkZlNoeUJ1dHRvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KClcbiAgcHVibGljIHByaW1hcnlUb29sYmFySWQ6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2Vjb25kYXJ5TWVudUlkOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGNzc0NsYXNzOiBSZXNwb25zaXZlQ1NTQ2xhc3M7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGV2ZW50QnVzTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBsMTBuSWQ6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgbDEwbkxhYmVsOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHRpdGxlOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHRvZ2dsZWQ6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgcHVibGljIGRpc2FibGVkOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBvcmRlcjogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBhY3Rpb246ICgoaHRtbEV2ZW50PzogRXZlbnQsIGlzU2Vjb25kYXJ5TWVudWU/OiBib29sZWFuKSA9PiB2b2lkKSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgY2xvc2VPbkNsaWNrOiBib29sZWFuID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgb25seVNlY29uZGFyeU1lbnU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gfCB1bmRlZmluZWQ7XG5cbiAgQFZpZXdDaGlsZCgnYnV0dG9uUmVmJywgeyBzdGF0aWM6IGZhbHNlIH0pIGJ1dHRvblJlZjogRWxlbWVudFJlZjtcblxuICBwcml2YXRlIF9pbWFnZUh0bWw6IFNhZmVIdG1sO1xuXG4gIHB1YmxpYyBnZXQgaW1hZ2VIdG1sKCk6IFNhZmVIdG1sIHtcbiAgICByZXR1cm4gdGhpcy5faW1hZ2VIdG1sO1xuICB9XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNldCBpbWFnZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgc3ZnVGFncyA9IFtcbiAgICAgIC8vICdhJyBpcyBub3QgYWxsb3dlZCFcbiAgICAgICdhbmltYXRlJyxcbiAgICAgICdhbmltYXRlTW90aW9uJyxcbiAgICAgICdhbmltYXRlVHJhbnNmb3JtJyxcbiAgICAgICdhdWRpbycsXG4gICAgICAnY2FudmFzJyxcbiAgICAgICdjaXJjbGUnLFxuICAgICAgJ2NsaXBQYXRoJyxcbiAgICAgICdkZWZzJyxcbiAgICAgICdkZXNjJyxcbiAgICAgICdkaXNjYXJkJyxcbiAgICAgICdlbGxpcHNlJyxcbiAgICAgICdmZUJsZW5kJyxcbiAgICAgICdmZUNvbG9yTWF0cml4JyxcbiAgICAgICdmZUNvbXBvbmVudFRyYW5zZmVyJyxcbiAgICAgICdmZUNvbXBvc2l0ZScsXG4gICAgICAnZmVDb252b2x2ZU1hdHJpeCcsXG4gICAgICAnZmVEaWZmdXNlTGlnaHRpbmcnLFxuICAgICAgJ2ZlRGlzcGxhY2VtZW50TWFwJyxcbiAgICAgICdmZURpc3RhbnRMaWdodCcsXG4gICAgICAnZmVEcm9wU2hhZG93JyxcbiAgICAgICdmZUZsb29kJyxcbiAgICAgICdmZUZ1bmNBJyxcbiAgICAgICdmZUZ1bmNCJyxcbiAgICAgICdmZUZ1bmNHJyxcbiAgICAgICdmZUZ1bmNSJyxcbiAgICAgICdmZUdhdXNzaWFuQmx1cicsXG4gICAgICAnZmVJbWFnZScsXG4gICAgICAnZmVNZXJnZScsXG4gICAgICAnZmVNZXJnZU5vZGUnLFxuICAgICAgJ2ZlTW9ycGhvbG9neScsXG4gICAgICAnZmVPZmZzZXQnLFxuICAgICAgJ2ZlUG9pbnRMaWdodCcsXG4gICAgICAnZmVTcGVjdWxhckxpZ2h0aW5nJyxcbiAgICAgICdmZVNwb3RMaWdodCcsXG4gICAgICAnZmVUaWxlJyxcbiAgICAgICdmZVR1cmJ1bGVuY2UnLFxuICAgICAgJ2ZpbHRlcicsXG4gICAgICAnZm9yZWlnbk9iamVjdCcsXG4gICAgICAnZycsXG4gICAgICAnaWZyYW1lJyxcbiAgICAgICdpbWFnZScsXG4gICAgICAnbGluZScsXG4gICAgICAnbGluZWFyR3JhZGllbnQnLFxuICAgICAgJ21hcmtlcicsXG4gICAgICAnbWFzaycsXG4gICAgICAnbWV0YWRhdGEnLFxuICAgICAgJ21wYXRoJyxcbiAgICAgICdwYXRoJyxcbiAgICAgICdwYXR0ZXJuJyxcbiAgICAgICdwb2x5Z29uJyxcbiAgICAgICdwb2x5bGluZScsXG4gICAgICAncmFkaWFsR3JhZGllbnQnLFxuICAgICAgJ3JlY3QnLFxuICAgICAgJ3NjcmlwdCcsXG4gICAgICAnc2V0JyxcbiAgICAgICdzdG9wJyxcbiAgICAgICdzdHlsZScsXG4gICAgICAnc3ZnJyxcbiAgICAgICdzd2l0Y2gnLFxuICAgICAgJ3N5bWJvbCcsXG4gICAgICAndGV4dCcsXG4gICAgICAndGV4dFBhdGgnLFxuICAgICAgJ3RpdGxlJyxcbiAgICAgICd0c3BhbicsXG4gICAgICAndW5rbm93bicsXG4gICAgICAndXNlJyxcbiAgICAgICd2aWRlbycsXG4gICAgICAndmlldycsXG4gICAgXTtcblxuICAgIC8vIG9ubHkgPHN2Zz4gYW5kIFNWRyB0YWdzIGFyZSBhbGxvd2VkXG4gICAgY29uc3QgdGFncyA9IHZhbHVlLnNwbGl0KCc8JykuZmlsdGVyKCh0YWcpID0+IHRhZy5sZW5ndGggPiAwKTtcbiAgICBjb25zdCBsZWdhbCA9IHRhZ3MuZXZlcnkoKHRhZykgPT4gdGFnLnN0YXJ0c1dpdGgoJ3N2ZycpIHx8IHRhZy5zdGFydHNXaXRoKCcvJykgfHwgc3ZnVGFncy5pbmNsdWRlcyh0YWcuc3BsaXQoL1xcc3w+LylbMF0pKTtcbiAgICBpZiAoIWxlZ2FsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lsbGVnYWwgaW1hZ2UgZm9yIFBERlNoeUJ1dHRvbi4gT25seSBTVkcgaW1hZ2VzIGFyZSBhbGxvd2VkLiBQbGVhc2UgdXNlIG9ubHkgdGhlIHRhZ3MgPHN2Zz4gYW5kIDxwYXRoPi4gJyArIHZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy5faW1hZ2VIdG1sID0gdGhpcy5zYW5pdGl6ZUh0bWwodmFsdWUpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwZGZTaHlCdXR0b25TZXJ2aWNlU2VydmljZTogUGRmU2h5QnV0dG9uU2VydmljZSxcbiAgICBwcml2YXRlIHNhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIG5vdGlmaWNhdGlvblNlcnZpY2U6IFBERk5vdGlmaWNhdGlvblNlcnZpY2VcbiAgKSB7XG4gICAgY29uc29sZS5sb2coJ1BkZlJvdGF0ZVBhZ2VDb21wb25lbnQuY29uc3RydWN0b3InKTtcbiAgICBlZmZlY3QoKCkgPT4ge1xuICAgICAgdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbiA9IG5vdGlmaWNhdGlvblNlcnZpY2Uub25QREZKU0luaXRTaWduYWwoKTtcbiAgICAgIGNvbnNvbGUubG9nKCdTZXR0aW5nIFBERlZpZXdlckFwcGxpY2F0aW9uIHRvICcsIHRoaXMuUERGVmlld2VyQXBwbGljYXRpb24pO1xuICAgICAgaWYgKHRoaXMuUERGVmlld2VyQXBwbGljYXRpb24pIHtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdQZGZSb3RhdGVQYWdlQ29tcG9uZW50LlBERlZpZXdlckFwcGxpY2F0aW9uIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZUJ1dHRvbkltYWdlKCk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5wZGZTaHlCdXR0b25TZXJ2aWNlU2VydmljZS5hZGQodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogYW55KTogdm9pZCB7XG4gICAgdGhpcy5wZGZTaHlCdXR0b25TZXJ2aWNlU2VydmljZS51cGRhdGUodGhpcyk7XG4gIH1cblxuICBwcml2YXRlIHNhbml0aXplSHRtbChodG1sOiBzdHJpbmcpOiBTYWZlSHRtbCB7XG4gICAgcmV0dXJuIHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKGh0bWwpOyAvLyBOT1NPTkFSXG4gIH1cblxuICBwdWJsaWMgb25DbGljayhodG1sRXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYWN0aW9uKSB7XG4gICAgICB0aGlzLmFjdGlvbihodG1sRXZlbnQsIGZhbHNlKTtcbiAgICAgIGh0bWxFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ldmVudEJ1c05hbWUpIHtcbiAgICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5kaXNwYXRjaCh0aGlzLmV2ZW50QnVzTmFtZSk7XG4gICAgICBodG1sRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlQnV0dG9uSW1hZ2UoKSB7XG4gICAgaWYgKHRoaXMuYnV0dG9uUmVmKSB7XG4gICAgICBjb25zdCBlbCA9IHRoaXMuYnV0dG9uUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBpZiAodGhpcy5faW1hZ2VIdG1sKSB7XG4gICAgICAgIGNvbnN0IHRlbXAgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0ZW1wLmlubmVySFRNTCA9IHRoaXMuX2ltYWdlSHRtbDtcbiAgICAgICAgY29uc3QgaW1hZ2UgPSB0ZW1wLmNoaWxkcmVuWzBdO1xuICAgICAgICBpZiAoIWVsLmlubmVySFRNTC5pbmNsdWRlcyhpbWFnZS5pbm5lckhUTUwpKSB7XG4gICAgICAgICAgLy8gaWYgdXNpbmcgU1NSLCB0aGUgSFRNTCBjb2RlIG1heSBhbHJlYWR5IGJlIHRoZXJlXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZChlbCwgaW1hZ2UpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBjaGlsZE5vZGVzID0gZWwuY2hpbGROb2RlcztcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGROb2Rlcykge1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQoZWwsIGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiPGJ1dHRvblxuICAqbmdJZj1cIiFvbmx5U2Vjb25kYXJ5TWVudVwiXG4gIHR5cGU9XCJidXR0b25cIlxuICBbaWRdPVwicHJpbWFyeVRvb2xiYXJJZFwiXG4gIGNsYXNzPVwidG9vbGJhckJ1dHRvblwiXG4gIFtjbGFzc109XCJjc3NDbGFzc1wiXG4gIFt0aXRsZV09XCJ0aXRsZVwiXG4gIFthdHRyLmRhdGEtbDEwbi1pZF09XCJsMTBuSWRcIlxuICBbY2xhc3MudG9nZ2xlZF09XCJ0b2dnbGVkXCJcbiAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50KVwiXG4gIFthdHRyLmFyaWEtbGFiZWxdPVwidGl0bGVcIlxuICByb2xlPVwiYnV0dG9uXCJcbiAgI2J1dHRvblJlZlxuPjwvYnV0dG9uPlxuIl19