import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./pdf-zoom-dropdown/pdf-zoom-dropdown.component";
import * as i2 from "./pdf-zoom-in/pdf-zoom-in.component";
import * as i3 from "./pdf-zoom-out/pdf-zoom-out.component";
import * as i4 from "../../responsive-visibility";
export class PdfZoomToolbarComponent {
    showZoomButtons = true;
    zoomLevels = ['auto', 'page-actual', 'page-fit', 'page-width', 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfZoomToolbarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfZoomToolbarComponent, selector: "pdf-zoom-toolbar", inputs: { showZoomButtons: "showZoomButtons", zoomLevels: "zoomLevels" }, ngImport: i0, template: "<div id=\"toolbarViewerMiddle\" [class]=\"showZoomButtons | responsiveCSSClass : 'always-visible'\">\n  <pdf-zoom-out [showZoomButtons]=\"showZoomButtons\"></pdf-zoom-out>\n  <pdf-zoom-in [showZoomButtons]=\"showZoomButtons\"></pdf-zoom-in>\n  <pdf-zoom-dropdown class=\"reset-width-padding\" [zoomLevels]=\"zoomLevels\"> </pdf-zoom-dropdown>\n</div>\n", styles: [".reset-width-padding{width:unset;max-width:unset;padding-top:3px}\n"], dependencies: [{ kind: "component", type: i1.PdfZoomDropdownComponent, selector: "pdf-zoom-dropdown", inputs: ["zoomLevels"] }, { kind: "component", type: i2.PdfZoomInComponent, selector: "pdf-zoom-in", inputs: ["showZoomButtons"] }, { kind: "component", type: i3.PdfZoomOutComponent, selector: "pdf-zoom-out", inputs: ["showZoomButtons"] }, { kind: "pipe", type: i4.ResponsiveCSSClassPipe, name: "responsiveCSSClass" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfZoomToolbarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-zoom-toolbar', template: "<div id=\"toolbarViewerMiddle\" [class]=\"showZoomButtons | responsiveCSSClass : 'always-visible'\">\n  <pdf-zoom-out [showZoomButtons]=\"showZoomButtons\"></pdf-zoom-out>\n  <pdf-zoom-in [showZoomButtons]=\"showZoomButtons\"></pdf-zoom-in>\n  <pdf-zoom-dropdown class=\"reset-width-padding\" [zoomLevels]=\"zoomLevels\"> </pdf-zoom-dropdown>\n</div>\n", styles: [".reset-width-padding{width:unset;max-width:unset;padding-top:3px}\n"] }]
        }], propDecorators: { showZoomButtons: [{
                type: Input
            }], zoomLevels: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXpvb20tdG9vbGJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci9zcmMvbGliL3Rvb2xiYXIvcGRmLXpvb20tdG9vbGJhci9wZGYtem9vbS10b29sYmFyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvdG9vbGJhci9wZGYtem9vbS10b29sYmFyL3BkZi16b29tLXRvb2xiYXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7OztBQVFqRCxNQUFNLE9BQU8sdUJBQXVCO0lBRTNCLGVBQWUsR0FBeUIsSUFBSSxDQUFDO0lBRzdDLFVBQVUsR0FBRyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0dBTDdGLHVCQUF1Qjs0RkFBdkIsdUJBQXVCLGtJQ1JwQyxrV0FLQTs7NEZER2EsdUJBQXVCO2tCQUxuQyxTQUFTOytCQUNFLGtCQUFrQjs4QkFNckIsZUFBZTtzQkFEckIsS0FBSztnQkFJQyxVQUFVO3NCQURoQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUmVzcG9uc2l2ZVZpc2liaWxpdHkgfSBmcm9tICcuLi8uLi9yZXNwb25zaXZlLXZpc2liaWxpdHknO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZGYtem9vbS10b29sYmFyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BkZi16b29tLXRvb2xiYXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9wZGYtem9vbS10b29sYmFyLmNvbXBvbmVudC5jc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgUGRmWm9vbVRvb2xiYXJDb21wb25lbnQge1xuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd1pvb21CdXR0b25zOiBSZXNwb25zaXZlVmlzaWJpbGl0eSA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHpvb21MZXZlbHMgPSBbJ2F1dG8nLCAncGFnZS1hY3R1YWwnLCAncGFnZS1maXQnLCAncGFnZS13aWR0aCcsIDAuNSwgMC43NSwgMSwgMS4yNSwgMS41LCAyLCAzLCA0XTtcbn1cbiIsIjxkaXYgaWQ9XCJ0b29sYmFyVmlld2VyTWlkZGxlXCIgW2NsYXNzXT1cInNob3dab29tQnV0dG9ucyB8IHJlc3BvbnNpdmVDU1NDbGFzcyA6ICdhbHdheXMtdmlzaWJsZSdcIj5cbiAgPHBkZi16b29tLW91dCBbc2hvd1pvb21CdXR0b25zXT1cInNob3dab29tQnV0dG9uc1wiPjwvcGRmLXpvb20tb3V0PlxuICA8cGRmLXpvb20taW4gW3Nob3dab29tQnV0dG9uc109XCJzaG93Wm9vbUJ1dHRvbnNcIj48L3BkZi16b29tLWluPlxuICA8cGRmLXpvb20tZHJvcGRvd24gY2xhc3M9XCJyZXNldC13aWR0aC1wYWRkaW5nXCIgW3pvb21MZXZlbHNdPVwiem9vbUxldmVsc1wiPiA8L3BkZi16b29tLWRyb3Bkb3duPlxuPC9kaXY+XG4iXX0=