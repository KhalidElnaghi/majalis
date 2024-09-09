import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class PdfCspPolicyService {
    sanitizer = undefined; // TrustedTypePolicy;
    constructor() { }
    init() {
        if (typeof window === 'undefined') {
            // server-side rendering
            return;
        }
        if (globalThis.pdfViewerSanitizer) {
            // already initialized
            return;
        }
        const ttWindow = globalThis;
        if (ttWindow.trustedTypes) {
            this.sanitizer = ttWindow.trustedTypes.createPolicy('pdf-viewer', {
                createHTML: (input) => input,
                createScriptURL: (input) => input,
            });
        }
        globalThis.pdfViewerSanitizer = this.sanitizer;
    }
    addTrustedCSS(styles, css) {
        if (typeof window === 'undefined') {
            // server-side rendering
            return;
        }
        this.init();
        if (this.sanitizer) {
            styles.textContent = this.sanitizer.createHTML(css);
        }
        else {
            styles.textContent = css;
        }
    }
    addTrustedJavaScript(scripts, css) {
        if (typeof window === 'undefined') {
            // server-side rendering
            return;
        }
        this.init();
        if (this.sanitizer) {
            scripts.src = this.sanitizer.createScriptURL(css);
        }
        else {
            scripts.src = css;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfCspPolicyService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfCspPolicyService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfCspPolicyService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWNzcC1wb2xpY3kuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvcGRmLWNzcC1wb2xpY3kuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQU0zQyxNQUFNLE9BQU8sbUJBQW1CO0lBQ3RCLFNBQVMsR0FBUSxTQUFTLENBQUMsQ0FBQyxxQkFBcUI7SUFFekQsZ0JBQWUsQ0FBQztJQUVULElBQUk7UUFDVCxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtZQUNqQyx3QkFBd0I7WUFDeEIsT0FBTztTQUNSO1FBQ0QsSUFBSyxVQUFrQixDQUFDLGtCQUFrQixFQUFFO1lBQzFDLHNCQUFzQjtZQUN0QixPQUFPO1NBQ1I7UUFDRCxNQUFNLFFBQVEsR0FBRyxVQUEyQyxDQUFDO1FBQzdELElBQUksUUFBUSxDQUFDLFlBQVksRUFBRTtZQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRTtnQkFDaEUsVUFBVSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLO2dCQUM1QixlQUFlLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUs7YUFDbEMsQ0FBQyxDQUFDO1NBQ0o7UUFDQSxVQUFrQixDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUQsQ0FBQztJQUVNLGFBQWEsQ0FBQyxNQUFtQixFQUFFLEdBQVc7UUFDbkQsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7WUFDakMsd0JBQXdCO1lBQ3hCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNaLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBbUIsQ0FBQztTQUN2RTthQUFNO1lBQ0wsTUFBTSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBRU0sb0JBQW9CLENBQUMsT0FBMEIsRUFBRSxHQUFXO1FBQ2pFLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxFQUFFO1lBQ2pDLHdCQUF3QjtZQUN4QixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQW1CLENBQUM7U0FDckU7YUFBTTtZQUNMLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1NBQ25CO0lBQ0gsQ0FBQzt3R0FoRFUsbUJBQW1COzRHQUFuQixtQkFBbUIsY0FGbEIsTUFBTTs7NEZBRVAsbUJBQW1CO2tCQUgvQixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRydXN0ZWRUeXBlc1dpbmRvdyB9IGZyb20gJ3RydXN0ZWQtdHlwZXMvbGliJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFBkZkNzcFBvbGljeVNlcnZpY2Uge1xuICBwcml2YXRlIHNhbml0aXplcjogYW55ID0gdW5kZWZpbmVkOyAvLyBUcnVzdGVkVHlwZVBvbGljeTtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgcHVibGljIGluaXQoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyBzZXJ2ZXItc2lkZSByZW5kZXJpbmdcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKChnbG9iYWxUaGlzIGFzIGFueSkucGRmVmlld2VyU2FuaXRpemVyKSB7XG4gICAgICAvLyBhbHJlYWR5IGluaXRpYWxpemVkXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHR0V2luZG93ID0gZ2xvYmFsVGhpcyBhcyB1bmtub3duIGFzIFRydXN0ZWRUeXBlc1dpbmRvdztcbiAgICBpZiAodHRXaW5kb3cudHJ1c3RlZFR5cGVzKSB7XG4gICAgICB0aGlzLnNhbml0aXplciA9IHR0V2luZG93LnRydXN0ZWRUeXBlcy5jcmVhdGVQb2xpY3koJ3BkZi12aWV3ZXInLCB7XG4gICAgICAgIGNyZWF0ZUhUTUw6IChpbnB1dCkgPT4gaW5wdXQsXG4gICAgICAgIGNyZWF0ZVNjcmlwdFVSTDogKGlucHV0KSA9PiBpbnB1dCxcbiAgICAgIH0pO1xuICAgIH1cbiAgICAoZ2xvYmFsVGhpcyBhcyBhbnkpLnBkZlZpZXdlclNhbml0aXplciA9IHRoaXMuc2FuaXRpemVyO1xuICB9XG5cbiAgcHVibGljIGFkZFRydXN0ZWRDU1Moc3R5bGVzOiBIVE1MRWxlbWVudCwgY3NzOiBzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIHNlcnZlci1zaWRlIHJlbmRlcmluZ1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmluaXQoKTtcbiAgICBpZiAodGhpcy5zYW5pdGl6ZXIpIHtcbiAgICAgIHN0eWxlcy50ZXh0Q29udGVudCA9IHRoaXMuc2FuaXRpemVyLmNyZWF0ZUhUTUwoY3NzKSBhcyB1bmtub3duIGFzIGFueTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGVzLnRleHRDb250ZW50ID0gY3NzO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhZGRUcnVzdGVkSmF2YVNjcmlwdChzY3JpcHRzOiBIVE1MU2NyaXB0RWxlbWVudCwgY3NzOiBzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIHNlcnZlci1zaWRlIHJlbmRlcmluZ1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmluaXQoKTtcbiAgICBpZiAodGhpcy5zYW5pdGl6ZXIpIHtcbiAgICAgIHNjcmlwdHMuc3JjID0gdGhpcy5zYW5pdGl6ZXIuY3JlYXRlU2NyaXB0VVJMKGNzcykgYXMgdW5rbm93biBhcyBhbnk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjcmlwdHMuc3JjID0gY3NzO1xuICAgIH1cbiAgfVxufVxuIl19