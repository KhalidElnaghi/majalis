import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class TranslatePipe {
    transform(key, fallback) {
        return this.translate(key, fallback);
    }
    async translate(key, englishText) {
        const PDFViewerApplication = window.PDFViewerApplication;
        return PDFViewerApplication.l10n.get(key, null, englishText);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: TranslatePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.11", ngImport: i0, type: TranslatePipe, name: "translate" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: TranslatePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'translate'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci9zcmMvbGliL3RyYW5zbGF0ZS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDOztBQU1wRCxNQUFNLE9BQU8sYUFBYTtJQUV4QixTQUFTLENBQUMsR0FBVyxFQUFFLFFBQWdCO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVNLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBVyxFQUFFLFdBQW1CO1FBQ3JELE1BQU0sb0JBQW9CLEdBQTJCLE1BQWMsQ0FBQyxvQkFBb0IsQ0FBQztRQUV6RixPQUFPLG9CQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMvRCxDQUFDO3dHQVZVLGFBQWE7c0dBQWIsYUFBYTs7NEZBQWIsYUFBYTtrQkFIekIsSUFBSTttQkFBQztvQkFDSixJQUFJLEVBQUUsV0FBVztpQkFDbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJUERGVmlld2VyQXBwbGljYXRpb24gfSBmcm9tICcuL29wdGlvbnMvcGRmLXZpZXdlci1hcHBsaWNhdGlvbic7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ3RyYW5zbGF0ZSdcbn0pXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gIHRyYW5zZm9ybShrZXk6IHN0cmluZywgZmFsbGJhY2s6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlKGtleSwgZmFsbGJhY2spO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHRyYW5zbGF0ZShrZXk6IHN0cmluZywgZW5nbGlzaFRleHQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcblxuICAgIHJldHVybiBQREZWaWV3ZXJBcHBsaWNhdGlvbi5sMTBuLmdldChrZXksIG51bGwsIGVuZ2xpc2hUZXh0KTtcbiAgfVxufVxuIl19