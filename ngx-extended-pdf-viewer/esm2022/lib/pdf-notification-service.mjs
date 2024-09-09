import { Injectable, effect, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { getVersionSuffix, pdfDefaultOptions } from './options/pdf-default-options';
import * as i0 from "@angular/core";
export class PDFNotificationService {
    // this event is fired when the pdf.js library has been loaded and objects like PDFApplication are available
    onPDFJSInitSignal = signal(undefined);
    onPDFJSInit = new Subject();
    pdfjsVersion = getVersionSuffix(pdfDefaultOptions.assetsFolder);
    constructor() {
        effect(() => {
            if (this.onPDFJSInitSignal()) {
                this.pdfjsVersion = getVersionSuffix(pdfDefaultOptions.assetsFolder);
                this.onPDFJSInit.next();
            }
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PDFNotificationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PDFNotificationService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PDFNotificationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLW5vdGlmaWNhdGlvbi1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi9wZGYtbm90aWZpY2F0aW9uLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLE1BQU0sK0JBQStCLENBQUM7O0FBTXBGLE1BQU0sT0FBTyxzQkFBc0I7SUFDakMsNEdBQTRHO0lBQ3JHLGlCQUFpQixHQUFHLE1BQU0sQ0FBb0MsU0FBUyxDQUFDLENBQUM7SUFFekUsV0FBVyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7SUFFbEMsWUFBWSxHQUFHLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRXZFO1FBQ0UsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3JFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDekI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7d0dBZlUsc0JBQXNCOzRHQUF0QixzQkFBc0IsY0FGckIsTUFBTTs7NEZBRVAsc0JBQXNCO2tCQUhsQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIGVmZmVjdCwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBnZXRWZXJzaW9uU3VmZml4LCBwZGZEZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4vb3B0aW9ucy9wZGYtZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7IElQREZWaWV3ZXJBcHBsaWNhdGlvbiB9IGZyb20gJy4vb3B0aW9ucy9wZGYtdmlld2VyLWFwcGxpY2F0aW9uJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFBERk5vdGlmaWNhdGlvblNlcnZpY2Uge1xuICAvLyB0aGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIHBkZi5qcyBsaWJyYXJ5IGhhcyBiZWVuIGxvYWRlZCBhbmQgb2JqZWN0cyBsaWtlIFBERkFwcGxpY2F0aW9uIGFyZSBhdmFpbGFibGVcbiAgcHVibGljIG9uUERGSlNJbml0U2lnbmFsID0gc2lnbmFsPElQREZWaWV3ZXJBcHBsaWNhdGlvbiB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcblxuICBwdWJsaWMgb25QREZKU0luaXQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIHB1YmxpYyBwZGZqc1ZlcnNpb24gPSBnZXRWZXJzaW9uU3VmZml4KHBkZkRlZmF1bHRPcHRpb25zLmFzc2V0c0ZvbGRlcik7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgIGVmZmVjdCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5vblBERkpTSW5pdFNpZ25hbCgpKSB7XG4gICAgICAgIHRoaXMucGRmanNWZXJzaW9uID0gZ2V0VmVyc2lvblN1ZmZpeChwZGZEZWZhdWx0T3B0aW9ucy5hc3NldHNGb2xkZXIpO1xuICAgICAgICB0aGlzLm9uUERGSlNJbml0Lm5leHQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19