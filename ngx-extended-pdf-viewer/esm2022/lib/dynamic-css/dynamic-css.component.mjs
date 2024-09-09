import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CSP_NONCE, Component, Inject, Input, Optional, PLATFORM_ID } from '@angular/core';
import { PdfBreakpoints } from '../responsive-visibility';
import * as i0 from "@angular/core";
import * as i1 from "../pdf-csp-policy.service";
export class DynamicCssComponent {
    renderer;
    document;
    platformId;
    pdfCspPolicyService;
    nonce;
    zoom = 1.0;
    width = 3.14159265359;
    xxs = 455;
    xs = 490;
    sm = 560;
    md = 610;
    lg = 660;
    xl = 740;
    xxl = 830;
    get style() {
        return `
#toolbarContainer .always-in-secondary-menu {
  display: none;
}

#secondaryToolbar .always-in-secondary-menu {
  display: inline-flex;
}

#outerContainer #mainContainer .visibleXXSView,
#outerContainer #mainContainer .visibleTinyView,
#outerContainer #mainContainer .visibleSmallView,
#outerContainer #mainContainer .visibleMediumView,
#outerContainer #mainContainer .visibleLargeView,
#outerContainer #mainContainer .visibleXLView,
#outerContainer #mainContainer .visibleXXLView {
  display: none;
}

.pdf-margin-top-3px {
  margin-top: 3px;
}

.pdf-margin-top--2px {
  margin-top: -2px;
}

@media all and (max-width: ${this.xl}px) {
  #toolbarViewerMiddle {
    display: table;
    margin: auto;
    left: auto;
    position: inherit;
    transform: none;
  }
}

@media all and (max-width: ${this.xxl}) {
  #sidebarContent {
    background-color: rgba(0, 0, 0, 0.7);
  }

  html[dir='ltr'] #outerContainer.sidebarOpen #viewerContainer {
    left: 0px !important;
  }
  html[dir='rtl'] #outerContainer.sidebarOpen #viewerContainer {
    right: 0px !important;
  }

  #outerContainer .hiddenLargeView,
  #outerContainer .hiddenMediumView {
    display: inherit;
  }
}

@media all and (max-width: ${this.lg}px) {
  .toolbarButtonSpacer {
    width: 15px;
  }

  #outerContainer .hiddenLargeView {
    display: none;
  }
  #outerContainer  #mainContainer .visibleLargeView {
    display: inherit;
  }
}

@media all and (max-width: ${this.md}px) {
  .toolbarButtonSpacer {
    display: none;
  }
  #outerContainer .hiddenMediumView {
    display: none;
  }
  #outerContainer  #mainContainer .visibleMediumView {
    display: inherit;
  }
}

@media all and (max-width: ${this.sm}px) {
  #outerContainer .hiddenSmallView,
  #outerContainer .hiddenSmallView * {
    display: none;
  }
  #outerContainer  #mainContainer .visibleSmallView {
    display: inherit;
  }
  .toolbarButtonSpacer {
    width: 0;
  }
  html[dir='ltr'] .findbar {
    left: 38px;
  }
  html[dir='rtl'] .findbar {
    right: 38px;
  }
}

@media all and (max-width: ${this.sm}px) {
  #scaleSelectContainer {
    display: none;
  }
}

#outerContainer .visibleXLView,
#outerContainer .visibleXXLView,
#outerContainer .visibleTinyView {
  display: none;
}

#outerContainer .hiddenXLView,
#outerContainer .hiddenXXLView {
  display: unset;
}

@media all and (max-width: ${this.xl}px) {
  #outerContainer .hiddenXLView {
    display: none;
  }
  #outerContainer .visibleXLView {
    display: inherit;
  }

  #toolbarViewerMiddle {
    -webkit-transform: translateX(-36%);
    transform: translateX(-36%);
    display: unset;
    margin: unset;
    left: 50%;
    position: absolute;
  }
}

@media all and (max-width: ${this.xxl}px) {
  #outerContainer .hiddenXXLView {
    display: none;
  }
  #outerContainer  #mainContainer .visibleXXLView {
    display: inherit;
  }
}

@media all and (max-width: ${this.md}px) {
  #toolbarViewerMiddle {
    -webkit-transform: translateX(-26%);
    transform: translateX(-26%);
  }
}

@media all and (max-width: ${this.xs}px) {
  #outerContainer .hiddenTinyView,
  #outerContainer .hiddenTinyView * {
    display: none;
  }
  #outerContainer  #mainContainer .visibleTinyView {
    display: inherit;
  }
}

@media all and (max-width: ${this.xxs}px) {
  #outerContainer .hiddenXXSView,
  #outerContainer .hiddenXXSView * {
    display: none;
  }
  #outerContainer #mainContainer .visibleXXSView {
    display: inherit;
  }
}
  `;
    }
    constructor(renderer, document, platformId, pdfCspPolicyService, nonce) {
        this.renderer = renderer;
        this.document = document;
        this.platformId = platformId;
        this.pdfCspPolicyService = pdfCspPolicyService;
        this.nonce = nonce;
        if (isPlatformBrowser(this.platformId)) {
            this.width = document.body.clientWidth;
        }
    }
    ngOnInit() {
        this.injectStyle();
    }
    ngOnChanges() {
        const fullWith = this.document.body.clientWidth;
        const partialViewScale = fullWith / this.width;
        const scaleFactor = partialViewScale * (this.zoom ? this.zoom : 1);
        this.xs = scaleFactor * PdfBreakpoints.xs;
        this.sm = scaleFactor * PdfBreakpoints.sm;
        this.md = scaleFactor * PdfBreakpoints.md;
        this.lg = scaleFactor * PdfBreakpoints.lg;
        this.xl = scaleFactor * PdfBreakpoints.xl;
        this.xxl = scaleFactor * PdfBreakpoints.xxl;
        let styles = this.document.getElementById('pdf-dynamic-css');
        if (!styles) {
            styles = this.document.createElement('STYLE');
            styles.id = 'pdf-dynamic-css';
            this.pdfCspPolicyService.addTrustedCSS(styles, this.style);
            if (this.nonce) {
                styles.nonce = this.nonce;
            }
            this.renderer.appendChild(this.document.head, styles);
        }
        else {
            this.pdfCspPolicyService.addTrustedCSS(styles, this.style);
        }
    }
    injectStyle() {
        if (this.width === 3.14159265359) {
            setTimeout(() => this.ngOnChanges(), 1);
        }
    }
    ngOnDestroy() {
        const styles = this.document.getElementById('pdf-dynamic-css');
        if (styles?.parentElement) {
            styles.parentElement.removeChild(styles);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: DynamicCssComponent, deps: [{ token: i0.Renderer2 }, { token: DOCUMENT }, { token: PLATFORM_ID }, { token: i1.PdfCspPolicyService }, { token: CSP_NONCE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: DynamicCssComponent, selector: "pdf-dynamic-css", inputs: { zoom: "zoom", width: "width" }, usesOnChanges: true, ngImport: i0, template: "", styles: [""] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: DynamicCssComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-dynamic-css', template: "" }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i1.PdfCspPolicyService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CSP_NONCE]
                }, {
                    type: Optional
                }] }], propDecorators: { zoom: [{
                type: Input
            }], width: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1jc3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi9keW5hbWljLWNzcy9keW5hbWljLWNzcy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci9zcmMvbGliL2R5bmFtaWMtY3NzL2R5bmFtaWMtY3NzLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFnQyxRQUFRLEVBQUUsV0FBVyxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBRXBJLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7O0FBTzFELE1BQU0sT0FBTyxtQkFBbUI7SUFtTXBCO0lBQ2tCO0lBQ0c7SUFDckI7SUFDK0I7SUFyTWxDLElBQUksR0FBRyxHQUFHLENBQUM7SUFHWCxLQUFLLEdBQUcsYUFBYSxDQUFDO0lBRXRCLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFFVixFQUFFLEdBQUcsR0FBRyxDQUFDO0lBRVQsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUVULEVBQUUsR0FBRyxHQUFHLENBQUM7SUFFVCxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBRVQsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUVULEdBQUcsR0FBRyxHQUFHLENBQUM7SUFFakIsSUFBVyxLQUFLO1FBQ2QsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzZCQTJCa0IsSUFBSSxDQUFDLEVBQUU7Ozs7Ozs7Ozs7NkJBVVAsSUFBSSxDQUFDLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFrQlIsSUFBSSxDQUFDLEVBQUU7Ozs7Ozs7Ozs7Ozs7NkJBYVAsSUFBSSxDQUFDLEVBQUU7Ozs7Ozs7Ozs7Ozs2QkFZUCxJQUFJLENBQUMsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFtQlAsSUFBSSxDQUFDLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7OzZCQWlCUCxJQUFJLENBQUMsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OzZCQWtCUCxJQUFJLENBQUMsR0FBRzs7Ozs7Ozs7OzZCQVNSLElBQUksQ0FBQyxFQUFFOzs7Ozs7OzZCQU9QLElBQUksQ0FBQyxFQUFFOzs7Ozs7Ozs7OzZCQVVQLElBQUksQ0FBQyxHQUFHOzs7Ozs7Ozs7R0FTbEMsQ0FBQztJQUNGLENBQUM7SUFFRCxZQUNVLFFBQW1CLEVBQ0QsUUFBa0IsRUFDZixVQUFVLEVBQy9CLG1CQUF3QyxFQUNULEtBQXFCO1FBSnBELGFBQVEsR0FBUixRQUFRLENBQVc7UUFDRCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2YsZUFBVSxHQUFWLFVBQVUsQ0FBQTtRQUMvQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ1QsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFFNUQsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUN4QztJQUNILENBQUM7SUFFTSxRQUFRO1FBQ2IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxXQUFXO1FBQ2hCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNoRCxNQUFNLGdCQUFnQixHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQy9DLE1BQU0sV0FBVyxHQUFHLGdCQUFnQixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkUsSUFBSSxDQUFDLEVBQUUsR0FBRyxXQUFXLEdBQUcsY0FBYyxDQUFDLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsRUFBRSxHQUFHLFdBQVcsR0FBRyxjQUFjLENBQUMsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxFQUFFLEdBQUcsV0FBVyxHQUFHLGNBQWMsQ0FBQyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxXQUFXLEdBQUcsY0FBYyxDQUFDLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsRUFBRSxHQUFHLFdBQVcsR0FBRyxjQUFjLENBQUMsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxHQUFHLEdBQUcsV0FBVyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUM7UUFFNUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQXFCLENBQUM7UUFDakYsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQXFCLENBQUM7WUFDbEUsTUFBTSxDQUFDLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQztZQUM5QixJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFM0QsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNkLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUMzQjtZQUVELElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZEO2FBQU07WUFDTCxJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUQ7SUFDSCxDQUFDO0lBRU8sV0FBVztRQUNqQixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssYUFBYSxFQUFFO1lBQ2hDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDekM7SUFDSCxDQUFDO0lBRU0sV0FBVztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBZ0IsQ0FBQztRQUM5RSxJQUFJLE1BQU0sRUFBRSxhQUFhLEVBQUU7WUFDeEIsTUFBTSxDQUFDLGFBQXFCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ25EO0lBQ0gsQ0FBQzt3R0F6UFUsbUJBQW1CLDJDQW9NcEIsUUFBUSxhQUNSLFdBQVcsZ0RBRVgsU0FBUzs0RkF2TVIsbUJBQW1CLHNIQ1ZoQyxFQUFBOzs0RkRVYSxtQkFBbUI7a0JBTC9CLFNBQVM7K0JBQ0UsaUJBQWlCOzswQkF3TXhCLE1BQU07MkJBQUMsUUFBUTs7MEJBQ2YsTUFBTTsyQkFBQyxXQUFXOzswQkFFbEIsTUFBTTsyQkFBQyxTQUFTOzswQkFBRyxRQUFRO3lDQXJNdkIsSUFBSTtzQkFEVixLQUFLO2dCQUlDLEtBQUs7c0JBRFgsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5ULCBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDU1BfTk9OQ0UsIENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3B0aW9uYWwsIFBMQVRGT1JNX0lELCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBkZkNzcFBvbGljeVNlcnZpY2UgfSBmcm9tICcuLi9wZGYtY3NwLXBvbGljeS5zZXJ2aWNlJztcbmltcG9ydCB7IFBkZkJyZWFrcG9pbnRzIH0gZnJvbSAnLi4vcmVzcG9uc2l2ZS12aXNpYmlsaXR5JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGRmLWR5bmFtaWMtY3NzJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2R5bmFtaWMtY3NzLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZHluYW1pYy1jc3MuY29tcG9uZW50LmNzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBEeW5hbWljQ3NzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyB6b29tID0gMS4wO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyB3aWR0aCA9IDMuMTQxNTkyNjUzNTk7XG5cbiAgcHVibGljIHh4cyA9IDQ1NTtcblxuICBwdWJsaWMgeHMgPSA0OTA7XG5cbiAgcHVibGljIHNtID0gNTYwO1xuXG4gIHB1YmxpYyBtZCA9IDYxMDtcblxuICBwdWJsaWMgbGcgPSA2NjA7XG5cbiAgcHVibGljIHhsID0gNzQwO1xuXG4gIHB1YmxpYyB4eGwgPSA4MzA7XG5cbiAgcHVibGljIGdldCBzdHlsZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBgXG4jdG9vbGJhckNvbnRhaW5lciAuYWx3YXlzLWluLXNlY29uZGFyeS1tZW51IHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuI3NlY29uZGFyeVRvb2xiYXIgLmFsd2F5cy1pbi1zZWNvbmRhcnktbWVudSB7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xufVxuXG4jb3V0ZXJDb250YWluZXIgI21haW5Db250YWluZXIgLnZpc2libGVYWFNWaWV3LFxuI291dGVyQ29udGFpbmVyICNtYWluQ29udGFpbmVyIC52aXNpYmxlVGlueVZpZXcsXG4jb3V0ZXJDb250YWluZXIgI21haW5Db250YWluZXIgLnZpc2libGVTbWFsbFZpZXcsXG4jb3V0ZXJDb250YWluZXIgI21haW5Db250YWluZXIgLnZpc2libGVNZWRpdW1WaWV3LFxuI291dGVyQ29udGFpbmVyICNtYWluQ29udGFpbmVyIC52aXNpYmxlTGFyZ2VWaWV3LFxuI291dGVyQ29udGFpbmVyICNtYWluQ29udGFpbmVyIC52aXNpYmxlWExWaWV3LFxuI291dGVyQ29udGFpbmVyICNtYWluQ29udGFpbmVyIC52aXNpYmxlWFhMVmlldyB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi5wZGYtbWFyZ2luLXRvcC0zcHgge1xuICBtYXJnaW4tdG9wOiAzcHg7XG59XG5cbi5wZGYtbWFyZ2luLXRvcC0tMnB4IHtcbiAgbWFyZ2luLXRvcDogLTJweDtcbn1cblxuQG1lZGlhIGFsbCBhbmQgKG1heC13aWR0aDogJHt0aGlzLnhsfXB4KSB7XG4gICN0b29sYmFyVmlld2VyTWlkZGxlIHtcbiAgICBkaXNwbGF5OiB0YWJsZTtcbiAgICBtYXJnaW46IGF1dG87XG4gICAgbGVmdDogYXV0bztcbiAgICBwb3NpdGlvbjogaW5oZXJpdDtcbiAgICB0cmFuc2Zvcm06IG5vbmU7XG4gIH1cbn1cblxuQG1lZGlhIGFsbCBhbmQgKG1heC13aWR0aDogJHt0aGlzLnh4bH0pIHtcbiAgI3NpZGViYXJDb250ZW50IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNyk7XG4gIH1cblxuICBodG1sW2Rpcj0nbHRyJ10gI291dGVyQ29udGFpbmVyLnNpZGViYXJPcGVuICN2aWV3ZXJDb250YWluZXIge1xuICAgIGxlZnQ6IDBweCAhaW1wb3J0YW50O1xuICB9XG4gIGh0bWxbZGlyPSdydGwnXSAjb3V0ZXJDb250YWluZXIuc2lkZWJhck9wZW4gI3ZpZXdlckNvbnRhaW5lciB7XG4gICAgcmlnaHQ6IDBweCAhaW1wb3J0YW50O1xuICB9XG5cbiAgI291dGVyQ29udGFpbmVyIC5oaWRkZW5MYXJnZVZpZXcsXG4gICNvdXRlckNvbnRhaW5lciAuaGlkZGVuTWVkaXVtVmlldyB7XG4gICAgZGlzcGxheTogaW5oZXJpdDtcbiAgfVxufVxuXG5AbWVkaWEgYWxsIGFuZCAobWF4LXdpZHRoOiAke3RoaXMubGd9cHgpIHtcbiAgLnRvb2xiYXJCdXR0b25TcGFjZXIge1xuICAgIHdpZHRoOiAxNXB4O1xuICB9XG5cbiAgI291dGVyQ29udGFpbmVyIC5oaWRkZW5MYXJnZVZpZXcge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgI291dGVyQ29udGFpbmVyICAjbWFpbkNvbnRhaW5lciAudmlzaWJsZUxhcmdlVmlldyB7XG4gICAgZGlzcGxheTogaW5oZXJpdDtcbiAgfVxufVxuXG5AbWVkaWEgYWxsIGFuZCAobWF4LXdpZHRoOiAke3RoaXMubWR9cHgpIHtcbiAgLnRvb2xiYXJCdXR0b25TcGFjZXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgI291dGVyQ29udGFpbmVyIC5oaWRkZW5NZWRpdW1WaWV3IHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG4gICNvdXRlckNvbnRhaW5lciAgI21haW5Db250YWluZXIgLnZpc2libGVNZWRpdW1WaWV3IHtcbiAgICBkaXNwbGF5OiBpbmhlcml0O1xuICB9XG59XG5cbkBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6ICR7dGhpcy5zbX1weCkge1xuICAjb3V0ZXJDb250YWluZXIgLmhpZGRlblNtYWxsVmlldyxcbiAgI291dGVyQ29udGFpbmVyIC5oaWRkZW5TbWFsbFZpZXcgKiB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuICAjb3V0ZXJDb250YWluZXIgICNtYWluQ29udGFpbmVyIC52aXNpYmxlU21hbGxWaWV3IHtcbiAgICBkaXNwbGF5OiBpbmhlcml0O1xuICB9XG4gIC50b29sYmFyQnV0dG9uU3BhY2VyIHtcbiAgICB3aWR0aDogMDtcbiAgfVxuICBodG1sW2Rpcj0nbHRyJ10gLmZpbmRiYXIge1xuICAgIGxlZnQ6IDM4cHg7XG4gIH1cbiAgaHRtbFtkaXI9J3J0bCddIC5maW5kYmFyIHtcbiAgICByaWdodDogMzhweDtcbiAgfVxufVxuXG5AbWVkaWEgYWxsIGFuZCAobWF4LXdpZHRoOiAke3RoaXMuc219cHgpIHtcbiAgI3NjYWxlU2VsZWN0Q29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG5cbiNvdXRlckNvbnRhaW5lciAudmlzaWJsZVhMVmlldyxcbiNvdXRlckNvbnRhaW5lciAudmlzaWJsZVhYTFZpZXcsXG4jb3V0ZXJDb250YWluZXIgLnZpc2libGVUaW55VmlldyB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbiNvdXRlckNvbnRhaW5lciAuaGlkZGVuWExWaWV3LFxuI291dGVyQ29udGFpbmVyIC5oaWRkZW5YWExWaWV3IHtcbiAgZGlzcGxheTogdW5zZXQ7XG59XG5cbkBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6ICR7dGhpcy54bH1weCkge1xuICAjb3V0ZXJDb250YWluZXIgLmhpZGRlblhMVmlldyB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuICAjb3V0ZXJDb250YWluZXIgLnZpc2libGVYTFZpZXcge1xuICAgIGRpc3BsYXk6IGluaGVyaXQ7XG4gIH1cblxuICAjdG9vbGJhclZpZXdlck1pZGRsZSB7XG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTM2JSk7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0zNiUpO1xuICAgIGRpc3BsYXk6IHVuc2V0O1xuICAgIG1hcmdpbjogdW5zZXQ7XG4gICAgbGVmdDogNTAlO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgfVxufVxuXG5AbWVkaWEgYWxsIGFuZCAobWF4LXdpZHRoOiAke3RoaXMueHhsfXB4KSB7XG4gICNvdXRlckNvbnRhaW5lciAuaGlkZGVuWFhMVmlldyB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuICAjb3V0ZXJDb250YWluZXIgICNtYWluQ29udGFpbmVyIC52aXNpYmxlWFhMVmlldyB7XG4gICAgZGlzcGxheTogaW5oZXJpdDtcbiAgfVxufVxuXG5AbWVkaWEgYWxsIGFuZCAobWF4LXdpZHRoOiAke3RoaXMubWR9cHgpIHtcbiAgI3Rvb2xiYXJWaWV3ZXJNaWRkbGUge1xuICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0yNiUpO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMjYlKTtcbiAgfVxufVxuXG5AbWVkaWEgYWxsIGFuZCAobWF4LXdpZHRoOiAke3RoaXMueHN9cHgpIHtcbiAgI291dGVyQ29udGFpbmVyIC5oaWRkZW5UaW55VmlldyxcbiAgI291dGVyQ29udGFpbmVyIC5oaWRkZW5UaW55VmlldyAqIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG4gICNvdXRlckNvbnRhaW5lciAgI21haW5Db250YWluZXIgLnZpc2libGVUaW55VmlldyB7XG4gICAgZGlzcGxheTogaW5oZXJpdDtcbiAgfVxufVxuXG5AbWVkaWEgYWxsIGFuZCAobWF4LXdpZHRoOiAke3RoaXMueHhzfXB4KSB7XG4gICNvdXRlckNvbnRhaW5lciAuaGlkZGVuWFhTVmlldyxcbiAgI291dGVyQ29udGFpbmVyIC5oaWRkZW5YWFNWaWV3ICoge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgI291dGVyQ29udGFpbmVyICNtYWluQ29udGFpbmVyIC52aXNpYmxlWFhTVmlldyB7XG4gICAgZGlzcGxheTogaW5oZXJpdDtcbiAgfVxufVxuICBgO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50LFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZCxcbiAgICBwcml2YXRlIHBkZkNzcFBvbGljeVNlcnZpY2U6IFBkZkNzcFBvbGljeVNlcnZpY2UsXG4gICAgQEluamVjdChDU1BfTk9OQ0UpIEBPcHRpb25hbCgpIHByaXZhdGUgbm9uY2U/OiBzdHJpbmcgfCBudWxsXG4gICkge1xuICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICB0aGlzLndpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pbmplY3RTdHlsZSgpO1xuICB9XG5cbiAgcHVibGljIG5nT25DaGFuZ2VzKCkge1xuICAgIGNvbnN0IGZ1bGxXaXRoID0gdGhpcy5kb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xuICAgIGNvbnN0IHBhcnRpYWxWaWV3U2NhbGUgPSBmdWxsV2l0aCAvIHRoaXMud2lkdGg7XG4gICAgY29uc3Qgc2NhbGVGYWN0b3IgPSBwYXJ0aWFsVmlld1NjYWxlICogKHRoaXMuem9vbSA/IHRoaXMuem9vbSA6IDEpO1xuXG4gICAgdGhpcy54cyA9IHNjYWxlRmFjdG9yICogUGRmQnJlYWtwb2ludHMueHM7XG4gICAgdGhpcy5zbSA9IHNjYWxlRmFjdG9yICogUGRmQnJlYWtwb2ludHMuc207XG4gICAgdGhpcy5tZCA9IHNjYWxlRmFjdG9yICogUGRmQnJlYWtwb2ludHMubWQ7XG4gICAgdGhpcy5sZyA9IHNjYWxlRmFjdG9yICogUGRmQnJlYWtwb2ludHMubGc7XG4gICAgdGhpcy54bCA9IHNjYWxlRmFjdG9yICogUGRmQnJlYWtwb2ludHMueGw7XG4gICAgdGhpcy54eGwgPSBzY2FsZUZhY3RvciAqIFBkZkJyZWFrcG9pbnRzLnh4bDtcblxuICAgIGxldCBzdHlsZXMgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwZGYtZHluYW1pYy1jc3MnKSBhcyBIVE1MU3R5bGVFbGVtZW50O1xuICAgIGlmICghc3R5bGVzKSB7XG4gICAgICBzdHlsZXMgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ1NUWUxFJykgYXMgSFRNTFN0eWxlRWxlbWVudDtcbiAgICAgIHN0eWxlcy5pZCA9ICdwZGYtZHluYW1pYy1jc3MnO1xuICAgICAgdGhpcy5wZGZDc3BQb2xpY3lTZXJ2aWNlLmFkZFRydXN0ZWRDU1Moc3R5bGVzLCB0aGlzLnN0eWxlKTtcblxuICAgICAgaWYgKHRoaXMubm9uY2UpIHtcbiAgICAgICAgc3R5bGVzLm5vbmNlID0gdGhpcy5ub25jZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLmRvY3VtZW50LmhlYWQsIHN0eWxlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGRmQ3NwUG9saWN5U2VydmljZS5hZGRUcnVzdGVkQ1NTKHN0eWxlcywgdGhpcy5zdHlsZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbmplY3RTdHlsZSgpIHtcbiAgICBpZiAodGhpcy53aWR0aCA9PT0gMy4xNDE1OTI2NTM1OSkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLm5nT25DaGFuZ2VzKCksIDEpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBzdHlsZXMgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwZGYtZHluYW1pYy1jc3MnKSBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAoc3R5bGVzPy5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAoc3R5bGVzLnBhcmVudEVsZW1lbnQgYXMgYW55KS5yZW1vdmVDaGlsZChzdHlsZXMpO1xuICAgIH1cbiAgfVxufVxuIiwiIl19