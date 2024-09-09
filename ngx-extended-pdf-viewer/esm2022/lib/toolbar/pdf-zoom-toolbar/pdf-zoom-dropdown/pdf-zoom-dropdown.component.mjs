import { Component, Input, ViewChild } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
export class PdfZoomDropdownComponent {
    element;
    _zoomLevels = [];
    set zoomLevels(levels) {
        this._zoomLevels = levels.map((l) => this.valueToZoomLevel(l));
    }
    sizeSelector;
    constructor(element) {
        this.element = element;
    }
    valueToZoomLevel(value) {
        // const new TranslatePipe().transform('pdfjs-page-scale-percent', '{ $scale } %');
        if (value.toString().endsWith('%')) {
            value = value.toString().replace('%', '');
            value = Number(value) / 100;
        }
        const numericalValue = Number(value);
        if (!numericalValue) {
            const v = String(value);
            return {
                id: this.snakeToCamel(value + 'Option'),
                value: v,
                dataL10nId: 'pdfjs-page-scale-' + v.replace('page-', ''),
                dataL10nArgs: undefined,
                displayValue: v,
            };
        }
        const percentage = Math.round(numericalValue * 100);
        const percentageAsString = isNaN(percentage) ? '' : String(percentage);
        return {
            id: `scale_${percentage}`,
            value: String(numericalValue),
            dataL10nId: 'pdfjs-page-scale-percent',
            dataL10nArgs: `{ "scale": ${percentageAsString} }`,
            displayValue: '',
        };
    }
    snakeToCamel(str) {
        // idea found here: https://hisk.io/javascript-snake-to-camel/
        return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfZoomDropdownComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfZoomDropdownComponent, selector: "pdf-zoom-dropdown", inputs: { zoomLevels: "zoomLevels" }, viewQueries: [{ propertyName: "sizeSelector", first: true, predicate: ["sizeSelector"], descendants: true }], ngImport: i0, template: "<span id=\"scaleSelectContainer\">\n  <select id=\"scaleSelect\" title=\"Zoom\" data-l10n-id=\"pdfjs-zoom-select\" #sizeSelector>\n    <option\n      *ngFor=\"let level of _zoomLevels\"\n      [id]=\"level.id\"\n      [attr.value]=\"level.value\"\n      [attr.data-l10n-id]=\"level.dataL10nId\"\n      [attr.data-l10n-args]=\"level.dataL10nArgs\"\n    >\n      {{ level.displayValue }}\n    </option>\n    <option\n      id=\"customScaleOption\"\n      title=\"\"\n      value=\"custom\"\n      disabled=\"disabled\"\n      hidden=\"true\"\n      data-l10n-id=\"pdfjs-page-scale-percent\"\n      data-l10n-args='{ \"scale\": 0 }'\n    >\n      0%\n    </option>\n  </select>\n</span>\n", styles: ["select{font-size:12px;height:26px;cursor:pointer;border-radius:2px;border-width:1px;border-style:solid;padding-top:0;padding-bottom:0}#customScaleOption{display:none}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgSelectOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i2.ɵNgSelectMultipleOption, selector: "option", inputs: ["ngValue", "value"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfZoomDropdownComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-zoom-dropdown', template: "<span id=\"scaleSelectContainer\">\n  <select id=\"scaleSelect\" title=\"Zoom\" data-l10n-id=\"pdfjs-zoom-select\" #sizeSelector>\n    <option\n      *ngFor=\"let level of _zoomLevels\"\n      [id]=\"level.id\"\n      [attr.value]=\"level.value\"\n      [attr.data-l10n-id]=\"level.dataL10nId\"\n      [attr.data-l10n-args]=\"level.dataL10nArgs\"\n    >\n      {{ level.displayValue }}\n    </option>\n    <option\n      id=\"customScaleOption\"\n      title=\"\"\n      value=\"custom\"\n      disabled=\"disabled\"\n      hidden=\"true\"\n      data-l10n-id=\"pdfjs-page-scale-percent\"\n      data-l10n-args='{ \"scale\": 0 }'\n    >\n      0%\n    </option>\n  </select>\n</span>\n", styles: ["select{font-size:12px;height:26px;cursor:pointer;border-radius:2px;border-width:1px;border-style:solid;padding-top:0;padding-bottom:0}#customScaleOption{display:none}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { zoomLevels: [{
                type: Input
            }], sizeSelector: [{
                type: ViewChild,
                args: ['sizeSelector']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXpvb20tZHJvcGRvd24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi90b29sYmFyL3BkZi16b29tLXRvb2xiYXIvcGRmLXpvb20tZHJvcGRvd24vcGRmLXpvb20tZHJvcGRvd24uY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi90b29sYmFyL3BkZi16b29tLXRvb2xiYXIvcGRmLXpvb20tZHJvcGRvd24vcGRmLXpvb20tZHJvcGRvd24uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBY3hFLE1BQU0sT0FBTyx3QkFBd0I7SUFVZjtJQVRiLFdBQVcsR0FBcUIsRUFBRSxDQUFDO0lBRTFDLElBQ1csVUFBVSxDQUFDLE1BQThCO1FBQ2xELElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUUwQixZQUFZLENBQU07SUFFN0MsWUFBb0IsT0FBbUI7UUFBbkIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtJQUFHLENBQUM7SUFFbkMsZ0JBQWdCLENBQUMsS0FBc0I7UUFDN0MsbUZBQW1GO1FBRW5GLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNsQyxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDMUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7U0FDN0I7UUFDRCxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNuQixNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIsT0FBTztnQkFDTCxFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO2dCQUN2QyxLQUFLLEVBQUUsQ0FBQztnQkFDUixVQUFVLEVBQUUsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO2dCQUN4RCxZQUFZLEVBQUUsU0FBUztnQkFDdkIsWUFBWSxFQUFFLENBQUM7YUFDaEIsQ0FBQztTQUNIO1FBQ0QsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDcEQsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZFLE9BQU87WUFDTCxFQUFFLEVBQUUsU0FBUyxVQUFVLEVBQUU7WUFDekIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUM7WUFDN0IsVUFBVSxFQUFFLDBCQUEwQjtZQUN0QyxZQUFZLEVBQUUsY0FBYyxrQkFBa0IsSUFBSTtZQUNsRCxZQUFZLEVBQUUsRUFBRTtTQUNqQixDQUFDO0lBQ0osQ0FBQztJQUVPLFlBQVksQ0FBQyxHQUFXO1FBQzlCLDhEQUE4RDtRQUM5RCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdkcsQ0FBQzt3R0E1Q1Usd0JBQXdCOzRGQUF4Qix3QkFBd0IsNk1DZHJDLCtxQkF3QkE7OzRGRFZhLHdCQUF3QjtrQkFMcEMsU0FBUzsrQkFDRSxtQkFBbUI7K0VBUWxCLFVBQVU7c0JBRHBCLEtBQUs7Z0JBS3FCLFlBQVk7c0JBQXRDLFNBQVM7dUJBQUMsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbnRlcmZhY2UgWm9vbUxldmVsIHtcbiAgaWQ6IHN0cmluZztcbiAgZGF0YUwxMG5JZDogc3RyaW5nO1xuICBkYXRhTDEwbkFyZ3M6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgdmFsdWU6IHN0cmluZztcbiAgZGlzcGxheVZhbHVlOiBzdHJpbmc7XG59XG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZGYtem9vbS1kcm9wZG93bicsXG4gIHRlbXBsYXRlVXJsOiAnLi9wZGYtem9vbS1kcm9wZG93bi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3BkZi16b29tLWRyb3Bkb3duLmNvbXBvbmVudC5jc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgUGRmWm9vbURyb3Bkb3duQ29tcG9uZW50IHtcbiAgcHVibGljIF96b29tTGV2ZWxzOiBBcnJheTxab29tTGV2ZWw+ID0gW107XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNldCB6b29tTGV2ZWxzKGxldmVsczogQXJyYXk8c3RyaW5nIHwgbnVtYmVyPikge1xuICAgIHRoaXMuX3pvb21MZXZlbHMgPSBsZXZlbHMubWFwKChsKSA9PiB0aGlzLnZhbHVlVG9ab29tTGV2ZWwobCkpO1xuICB9XG5cbiAgQFZpZXdDaGlsZCgnc2l6ZVNlbGVjdG9yJykgc2l6ZVNlbGVjdG9yOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmKSB7fVxuXG4gIHByaXZhdGUgdmFsdWVUb1pvb21MZXZlbCh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogWm9vbUxldmVsIHtcbiAgICAvLyBjb25zdCBuZXcgVHJhbnNsYXRlUGlwZSgpLnRyYW5zZm9ybSgncGRmanMtcGFnZS1zY2FsZS1wZXJjZW50JywgJ3sgJHNjYWxlIH0gJScpO1xuXG4gICAgaWYgKHZhbHVlLnRvU3RyaW5nKCkuZW5kc1dpdGgoJyUnKSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLnJlcGxhY2UoJyUnLCAnJyk7XG4gICAgICB2YWx1ZSA9IE51bWJlcih2YWx1ZSkgLyAxMDA7XG4gICAgfVxuICAgIGNvbnN0IG51bWVyaWNhbFZhbHVlID0gTnVtYmVyKHZhbHVlKTtcbiAgICBpZiAoIW51bWVyaWNhbFZhbHVlKSB7XG4gICAgICBjb25zdCB2ID0gU3RyaW5nKHZhbHVlKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiB0aGlzLnNuYWtlVG9DYW1lbCh2YWx1ZSArICdPcHRpb24nKSxcbiAgICAgICAgdmFsdWU6IHYsXG4gICAgICAgIGRhdGFMMTBuSWQ6ICdwZGZqcy1wYWdlLXNjYWxlLScgKyB2LnJlcGxhY2UoJ3BhZ2UtJywgJycpLFxuICAgICAgICBkYXRhTDEwbkFyZ3M6IHVuZGVmaW5lZCxcbiAgICAgICAgZGlzcGxheVZhbHVlOiB2LFxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgcGVyY2VudGFnZSA9IE1hdGgucm91bmQobnVtZXJpY2FsVmFsdWUgKiAxMDApO1xuICAgIGNvbnN0IHBlcmNlbnRhZ2VBc1N0cmluZyA9IGlzTmFOKHBlcmNlbnRhZ2UpID8gJycgOiBTdHJpbmcocGVyY2VudGFnZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBgc2NhbGVfJHtwZXJjZW50YWdlfWAsXG4gICAgICB2YWx1ZTogU3RyaW5nKG51bWVyaWNhbFZhbHVlKSxcbiAgICAgIGRhdGFMMTBuSWQ6ICdwZGZqcy1wYWdlLXNjYWxlLXBlcmNlbnQnLFxuICAgICAgZGF0YUwxMG5BcmdzOiBgeyBcInNjYWxlXCI6ICR7cGVyY2VudGFnZUFzU3RyaW5nfSB9YCxcbiAgICAgIGRpc3BsYXlWYWx1ZTogJycsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgc25ha2VUb0NhbWVsKHN0cjogc3RyaW5nKSB7XG4gICAgLy8gaWRlYSBmb3VuZCBoZXJlOiBodHRwczovL2hpc2suaW8vamF2YXNjcmlwdC1zbmFrZS10by1jYW1lbC9cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbLV9dW2Etel0pL2csIChncm91cCkgPT4gZ3JvdXAudG9VcHBlckNhc2UoKS5yZXBsYWNlKCctJywgJycpLnJlcGxhY2UoJ18nLCAnJykpO1xuICB9XG59XG4iLCI8c3BhbiBpZD1cInNjYWxlU2VsZWN0Q29udGFpbmVyXCI+XG4gIDxzZWxlY3QgaWQ9XCJzY2FsZVNlbGVjdFwiIHRpdGxlPVwiWm9vbVwiIGRhdGEtbDEwbi1pZD1cInBkZmpzLXpvb20tc2VsZWN0XCIgI3NpemVTZWxlY3Rvcj5cbiAgICA8b3B0aW9uXG4gICAgICAqbmdGb3I9XCJsZXQgbGV2ZWwgb2YgX3pvb21MZXZlbHNcIlxuICAgICAgW2lkXT1cImxldmVsLmlkXCJcbiAgICAgIFthdHRyLnZhbHVlXT1cImxldmVsLnZhbHVlXCJcbiAgICAgIFthdHRyLmRhdGEtbDEwbi1pZF09XCJsZXZlbC5kYXRhTDEwbklkXCJcbiAgICAgIFthdHRyLmRhdGEtbDEwbi1hcmdzXT1cImxldmVsLmRhdGFMMTBuQXJnc1wiXG4gICAgPlxuICAgICAge3sgbGV2ZWwuZGlzcGxheVZhbHVlIH19XG4gICAgPC9vcHRpb24+XG4gICAgPG9wdGlvblxuICAgICAgaWQ9XCJjdXN0b21TY2FsZU9wdGlvblwiXG4gICAgICB0aXRsZT1cIlwiXG4gICAgICB2YWx1ZT1cImN1c3RvbVwiXG4gICAgICBkaXNhYmxlZD1cImRpc2FibGVkXCJcbiAgICAgIGhpZGRlbj1cInRydWVcIlxuICAgICAgZGF0YS1sMTBuLWlkPVwicGRmanMtcGFnZS1zY2FsZS1wZXJjZW50XCJcbiAgICAgIGRhdGEtbDEwbi1hcmdzPSd7IFwic2NhbGVcIjogMCB9J1xuICAgID5cbiAgICAgIDAlXG4gICAgPC9vcHRpb24+XG4gIDwvc2VsZWN0PlxuPC9zcGFuPlxuIl19