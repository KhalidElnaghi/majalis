import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./pdf-findbar-message-container/pdf-findbar-message-container.component";
import * as i3 from "./pdf-findbar-options-two-container/pdf-find-entire-word/pdf-find-entire-word.component";
import * as i4 from "./pdf-findbar-options-one-container/pdf-find-highlight-all/pdf-find-highlight-all.component";
import * as i5 from "./pdf-find-input-area/pdf-find-input-area.component";
import * as i6 from "./pdf-findbar-options-one-container/pdf-find-match-case/pdf-find-match-case.component";
import * as i7 from "./pdf-findbar-options-three-container/pdf-find-results-count/pdf-find-results-count.component";
import * as i8 from "./pdf-findbar-options-two-container/pdf-match-diacritics/pdf-match-diacritics.component";
export class PdfFindbarComponent {
    showFindButton = true;
    mobileFriendlyZoomScale;
    findbarLeft;
    findbarTop;
    /* UI templates */
    customFindbarInputArea;
    customFindbar;
    customFindbarButtons;
    showFindHighlightAll = true;
    showFindMatchCase = true;
    showFindCurrentPageOnly = true;
    showFindPageRange = true;
    showFindEntireWord = true;
    showFindEntirePhrase = true;
    showFindMatchDiacritics = true;
    showFindFuzzySearch = true;
    showFindResultsCount = true;
    showFindMessages = true;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfFindbarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfFindbarComponent, selector: "pdf-findbar", inputs: { showFindButton: "showFindButton", mobileFriendlyZoomScale: "mobileFriendlyZoomScale", findbarLeft: "findbarLeft", findbarTop: "findbarTop", customFindbarInputArea: "customFindbarInputArea", customFindbar: "customFindbar", customFindbarButtons: "customFindbarButtons", showFindHighlightAll: "showFindHighlightAll", showFindMatchCase: "showFindMatchCase", showFindCurrentPageOnly: "showFindCurrentPageOnly", showFindPageRange: "showFindPageRange", showFindEntireWord: "showFindEntireWord", showFindEntirePhrase: "showFindEntirePhrase", showFindMatchDiacritics: "showFindMatchDiacritics", showFindFuzzySearch: "showFindFuzzySearch", showFindResultsCount: "showFindResultsCount", showFindMessages: "showFindMessages" }, ngImport: i0, template: "<ng-container [ngTemplateOutlet]=\"customFindbar ? customFindbar : defaultFindbar\"> </ng-container>\n\n<ng-template #defaultFindbar>\n  <div\n    class=\"findbar hidden doorHanger\"\n    id=\"findbar\"\n    [style.transform]=\"'scale(' + mobileFriendlyZoomScale + ')'\"\n    [style.transformOrigin]=\"'left top'\"\n    [style.left]=\"findbarLeft\"\n    [style.top]=\"findbarTop\"\n  >\n    <ng-container [ngTemplateOutlet]=\"customFindbarButtons ? customFindbarButtons : defaultFindbarButtons\"> </ng-container>\n  </div>\n</ng-template>\n\n<ng-template #defaultFindbarButtons>\n  <pdf-find-input-area [customFindbarInputArea]=\"customFindbarInputArea\"></pdf-find-input-area>\n  <pdf-find-highlight-all [class.hidden]=\"!showFindHighlightAll\"></pdf-find-highlight-all>\n  <pdf-find-match-case [class.hidden]=\"!showFindMatchCase\"></pdf-find-match-case>\n  <pdf-match-diacritics [class.hidden]=\"!showFindMatchDiacritics\"></pdf-match-diacritics>\n  <pdf-find-entire-word [class.hidden]=\"!showFindEntireWord\"></pdf-find-entire-word>\n  <pdf-find-results-count [class.hidden]=\"!showFindResultsCount\"></pdf-find-results-count>\n  <pdf-findbar-message-container [class.hidden]=\"!showFindMessages\"></pdf-findbar-message-container>\n</ng-template>\n", styles: [""], dependencies: [{ kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i2.PdfFindbarMessageContainerComponent, selector: "pdf-findbar-message-container" }, { kind: "component", type: i3.PdfFindEntireWordComponent, selector: "pdf-find-entire-word" }, { kind: "component", type: i4.PdfFindHighlightAllComponent, selector: "pdf-find-highlight-all" }, { kind: "component", type: i5.PdfFindInputAreaComponent, selector: "pdf-find-input-area", inputs: ["customFindbarInputArea"] }, { kind: "component", type: i6.PdfFindMatchCaseComponent, selector: "pdf-find-match-case" }, { kind: "component", type: i7.PdfFindResultsCountComponent, selector: "pdf-find-results-count" }, { kind: "component", type: i8.PdfMatchDiacriticsComponent, selector: "pdf-match-diacritics" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfFindbarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-findbar', template: "<ng-container [ngTemplateOutlet]=\"customFindbar ? customFindbar : defaultFindbar\"> </ng-container>\n\n<ng-template #defaultFindbar>\n  <div\n    class=\"findbar hidden doorHanger\"\n    id=\"findbar\"\n    [style.transform]=\"'scale(' + mobileFriendlyZoomScale + ')'\"\n    [style.transformOrigin]=\"'left top'\"\n    [style.left]=\"findbarLeft\"\n    [style.top]=\"findbarTop\"\n  >\n    <ng-container [ngTemplateOutlet]=\"customFindbarButtons ? customFindbarButtons : defaultFindbarButtons\"> </ng-container>\n  </div>\n</ng-template>\n\n<ng-template #defaultFindbarButtons>\n  <pdf-find-input-area [customFindbarInputArea]=\"customFindbarInputArea\"></pdf-find-input-area>\n  <pdf-find-highlight-all [class.hidden]=\"!showFindHighlightAll\"></pdf-find-highlight-all>\n  <pdf-find-match-case [class.hidden]=\"!showFindMatchCase\"></pdf-find-match-case>\n  <pdf-match-diacritics [class.hidden]=\"!showFindMatchDiacritics\"></pdf-match-diacritics>\n  <pdf-find-entire-word [class.hidden]=\"!showFindEntireWord\"></pdf-find-entire-word>\n  <pdf-find-results-count [class.hidden]=\"!showFindResultsCount\"></pdf-find-results-count>\n  <pdf-findbar-message-container [class.hidden]=\"!showFindMessages\"></pdf-findbar-message-container>\n</ng-template>\n" }]
        }], propDecorators: { showFindButton: [{
                type: Input
            }], mobileFriendlyZoomScale: [{
                type: Input
            }], findbarLeft: [{
                type: Input
            }], findbarTop: [{
                type: Input
            }], customFindbarInputArea: [{
                type: Input
            }], customFindbar: [{
                type: Input
            }], customFindbarButtons: [{
                type: Input
            }], showFindHighlightAll: [{
                type: Input
            }], showFindMatchCase: [{
                type: Input
            }], showFindCurrentPageOnly: [{
                type: Input
            }], showFindPageRange: [{
                type: Input
            }], showFindEntireWord: [{
                type: Input
            }], showFindEntirePhrase: [{
                type: Input
            }], showFindMatchDiacritics: [{
                type: Input
            }], showFindFuzzySearch: [{
                type: Input
            }], showFindResultsCount: [{
                type: Input
            }], showFindMessages: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWZpbmRiYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi90b29sYmFyL3BkZi1maW5kYmFyL3BkZi1maW5kYmFyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvdG9vbGJhci9wZGYtZmluZGJhci9wZGYtZmluZGJhci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBZSxNQUFNLGVBQWUsQ0FBQzs7Ozs7Ozs7OztBQVE5RCxNQUFNLE9BQU8sbUJBQW1CO0lBRXZCLGNBQWMsR0FBeUIsSUFBSSxDQUFDO0lBRzVDLHVCQUF1QixDQUFTO0lBR2hDLFdBQVcsQ0FBcUI7SUFHaEMsVUFBVSxDQUFxQjtJQUV0QyxrQkFBa0I7SUFFWCxzQkFBc0IsQ0FBK0I7SUFHckQsYUFBYSxDQUFtQjtJQUdoQyxvQkFBb0IsQ0FBK0I7SUFHbkQsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0lBRzVCLGlCQUFpQixHQUFHLElBQUksQ0FBQztJQUd6Qix1QkFBdUIsR0FBRyxJQUFJLENBQUM7SUFHL0IsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBR3pCLGtCQUFrQixHQUFHLElBQUksQ0FBQztJQUcxQixvQkFBb0IsR0FBRyxJQUFJLENBQUM7SUFHNUIsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO0lBRy9CLG1CQUFtQixHQUFHLElBQUksQ0FBQztJQUczQixvQkFBb0IsR0FBRyxJQUFJLENBQUM7SUFHNUIsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO3dHQW5EcEIsbUJBQW1COzRGQUFuQixtQkFBbUIseXdCQ1JoQyx1dUNBd0JBOzs0RkRoQmEsbUJBQW1CO2tCQUwvQixTQUFTOytCQUNFLGFBQWE7OEJBTWhCLGNBQWM7c0JBRHBCLEtBQUs7Z0JBSUMsdUJBQXVCO3NCQUQ3QixLQUFLO2dCQUlDLFdBQVc7c0JBRGpCLEtBQUs7Z0JBSUMsVUFBVTtzQkFEaEIsS0FBSztnQkFLQyxzQkFBc0I7c0JBRDVCLEtBQUs7Z0JBSUMsYUFBYTtzQkFEbkIsS0FBSztnQkFJQyxvQkFBb0I7c0JBRDFCLEtBQUs7Z0JBSUMsb0JBQW9CO3NCQUQxQixLQUFLO2dCQUlDLGlCQUFpQjtzQkFEdkIsS0FBSztnQkFJQyx1QkFBdUI7c0JBRDdCLEtBQUs7Z0JBSUMsaUJBQWlCO3NCQUR2QixLQUFLO2dCQUlDLGtCQUFrQjtzQkFEeEIsS0FBSztnQkFJQyxvQkFBb0I7c0JBRDFCLEtBQUs7Z0JBSUMsdUJBQXVCO3NCQUQ3QixLQUFLO2dCQUlDLG1CQUFtQjtzQkFEekIsS0FBSztnQkFJQyxvQkFBb0I7c0JBRDFCLEtBQUs7Z0JBSUMsZ0JBQWdCO3NCQUR0QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJlc3BvbnNpdmVWaXNpYmlsaXR5IH0gZnJvbSAnLi4vLi4vcmVzcG9uc2l2ZS12aXNpYmlsaXR5JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGRmLWZpbmRiYXInLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLWZpbmRiYXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9wZGYtZmluZGJhci5jb21wb25lbnQuY3NzJ10sXG59KVxuZXhwb3J0IGNsYXNzIFBkZkZpbmRiYXJDb21wb25lbnQge1xuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd0ZpbmRCdXR0b246IFJlc3BvbnNpdmVWaXNpYmlsaXR5ID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgbW9iaWxlRnJpZW5kbHlab29tU2NhbGU6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgZmluZGJhckxlZnQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgZmluZGJhclRvcDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qIFVJIHRlbXBsYXRlcyAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgY3VzdG9tRmluZGJhcklucHV0QXJlYTogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgY3VzdG9tRmluZGJhcjogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgY3VzdG9tRmluZGJhckJ1dHRvbnM6IFRlbXBsYXRlUmVmPGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dGaW5kSGlnaGxpZ2h0QWxsID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd0ZpbmRNYXRjaENhc2UgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93RmluZEN1cnJlbnRQYWdlT25seSA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dGaW5kUGFnZVJhbmdlID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd0ZpbmRFbnRpcmVXb3JkID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd0ZpbmRFbnRpcmVQaHJhc2UgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93RmluZE1hdGNoRGlhY3JpdGljcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dGaW5kRnV6enlTZWFyY2ggPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93RmluZFJlc3VsdHNDb3VudCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dGaW5kTWVzc2FnZXMgPSB0cnVlO1xufVxuIiwiPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21GaW5kYmFyID8gY3VzdG9tRmluZGJhciA6IGRlZmF1bHRGaW5kYmFyXCI+IDwvbmctY29udGFpbmVyPlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHRGaW5kYmFyPlxuICA8ZGl2XG4gICAgY2xhc3M9XCJmaW5kYmFyIGhpZGRlbiBkb29ySGFuZ2VyXCJcbiAgICBpZD1cImZpbmRiYXJcIlxuICAgIFtzdHlsZS50cmFuc2Zvcm1dPVwiJ3NjYWxlKCcgKyBtb2JpbGVGcmllbmRseVpvb21TY2FsZSArICcpJ1wiXG4gICAgW3N0eWxlLnRyYW5zZm9ybU9yaWdpbl09XCInbGVmdCB0b3AnXCJcbiAgICBbc3R5bGUubGVmdF09XCJmaW5kYmFyTGVmdFwiXG4gICAgW3N0eWxlLnRvcF09XCJmaW5kYmFyVG9wXCJcbiAgPlxuICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwiY3VzdG9tRmluZGJhckJ1dHRvbnMgPyBjdXN0b21GaW5kYmFyQnV0dG9ucyA6IGRlZmF1bHRGaW5kYmFyQnV0dG9uc1wiPiA8L25nLWNvbnRhaW5lcj5cbiAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHRGaW5kYmFyQnV0dG9ucz5cbiAgPHBkZi1maW5kLWlucHV0LWFyZWEgW2N1c3RvbUZpbmRiYXJJbnB1dEFyZWFdPVwiY3VzdG9tRmluZGJhcklucHV0QXJlYVwiPjwvcGRmLWZpbmQtaW5wdXQtYXJlYT5cbiAgPHBkZi1maW5kLWhpZ2hsaWdodC1hbGwgW2NsYXNzLmhpZGRlbl09XCIhc2hvd0ZpbmRIaWdobGlnaHRBbGxcIj48L3BkZi1maW5kLWhpZ2hsaWdodC1hbGw+XG4gIDxwZGYtZmluZC1tYXRjaC1jYXNlIFtjbGFzcy5oaWRkZW5dPVwiIXNob3dGaW5kTWF0Y2hDYXNlXCI+PC9wZGYtZmluZC1tYXRjaC1jYXNlPlxuICA8cGRmLW1hdGNoLWRpYWNyaXRpY3MgW2NsYXNzLmhpZGRlbl09XCIhc2hvd0ZpbmRNYXRjaERpYWNyaXRpY3NcIj48L3BkZi1tYXRjaC1kaWFjcml0aWNzPlxuICA8cGRmLWZpbmQtZW50aXJlLXdvcmQgW2NsYXNzLmhpZGRlbl09XCIhc2hvd0ZpbmRFbnRpcmVXb3JkXCI+PC9wZGYtZmluZC1lbnRpcmUtd29yZD5cbiAgPHBkZi1maW5kLXJlc3VsdHMtY291bnQgW2NsYXNzLmhpZGRlbl09XCIhc2hvd0ZpbmRSZXN1bHRzQ291bnRcIj48L3BkZi1maW5kLXJlc3VsdHMtY291bnQ+XG4gIDxwZGYtZmluZGJhci1tZXNzYWdlLWNvbnRhaW5lciBbY2xhc3MuaGlkZGVuXT1cIiFzaG93RmluZE1lc3NhZ2VzXCI+PC9wZGYtZmluZGJhci1tZXNzYWdlLWNvbnRhaW5lcj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=