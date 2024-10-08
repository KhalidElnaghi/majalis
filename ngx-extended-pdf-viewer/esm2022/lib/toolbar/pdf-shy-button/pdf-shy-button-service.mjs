import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class PdfShyButtonService {
    buttons = [];
    add(button) {
        const id = button.secondaryMenuId ?? this.addDefaultPrefix(button);
        const previousDefinition = this.buttons.findIndex((b) => b.id === id);
        const description = {
            id,
            cssClass: button.cssClass,
            l10nId: button.l10nId,
            l10nLabel: button.l10nLabel,
            title: button.title,
            toggled: button.toggled,
            disabled: button.disabled,
            order: button.order ?? 99999,
            image: button.imageHtml,
            action: button.action,
            eventBusName: button.eventBusName,
            closeOnClick: button.closeOnClick,
        };
        if (previousDefinition >= 0) {
            this.buttons[previousDefinition] = description;
            setTimeout(() => {
                const PDFViewerApplication = window.PDFViewerApplication;
                if (PDFViewerApplication?.l10n) {
                    const element = document.getElementById(id);
                    PDFViewerApplication.l10n.translate(element).then(() => {
                        // Dispatch the 'localized' event on the `eventBus` once the viewer
                        // has been fully initialized and translated.
                    });
                }
            }, 0);
        }
        else {
            this.buttons.push(description);
        }
        this.buttons.sort((a, b) => a.order - b.order);
    }
    addDefaultPrefix(button) {
        if (button.primaryToolbarId.startsWith('primary')) {
            return button.primaryToolbarId.replace('primary', 'secondary');
        }
        return 'secondary' + button.primaryToolbarId.substring(0, 1).toUpperCase() + button.primaryToolbarId.substring(1);
    }
    update(button) {
        const id = button.secondaryMenuId ?? this.addDefaultPrefix(button);
        if (this.buttons.some((b) => b.id === id)) {
            this.add(button);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfShyButtonService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfShyButtonService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfShyButtonService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXNoeS1idXR0b24tc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvdG9vbGJhci9wZGYtc2h5LWJ1dHRvbi9wZGYtc2h5LWJ1dHRvbi1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBd0IzQyxNQUFNLE9BQU8sbUJBQW1CO0lBQ3ZCLE9BQU8sR0FBOEIsRUFBRSxDQUFDO0lBRXhDLEdBQUcsQ0FBQyxNQUE2QjtRQUN0QyxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRSxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sV0FBVyxHQUE0QjtZQUMzQyxFQUFFO1lBQ0YsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO1lBQ3pCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtZQUNyQixTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVM7WUFDM0IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO1lBQ25CLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTztZQUN2QixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7WUFDekIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksS0FBSztZQUM1QixLQUFLLEVBQUUsTUFBTSxDQUFDLFNBQVM7WUFDdkIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO1lBQ3JCLFlBQVksRUFBRSxNQUFNLENBQUMsWUFBWTtZQUNqQyxZQUFZLEVBQUUsTUFBTSxDQUFDLFlBQVk7U0FDbEMsQ0FBQztRQUNGLElBQUksa0JBQWtCLElBQUksQ0FBQyxFQUFFO1lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsR0FBRyxXQUFXLENBQUM7WUFDL0MsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxNQUFNLG9CQUFvQixHQUFJLE1BQWMsQ0FBQyxvQkFBNkMsQ0FBQztnQkFDM0YsSUFBSSxvQkFBb0IsRUFBRSxJQUFJLEVBQUU7b0JBQzlCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzVDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTt3QkFDckQsbUVBQW1FO3dCQUNuRSw2Q0FBNkM7b0JBQy9DLENBQUMsQ0FBQyxDQUFDO2lCQUNKO1lBQ0gsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ1A7YUFBTTtZQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU8sZ0JBQWdCLENBQUMsTUFBNkI7UUFDcEQsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2pELE9BQU8sTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDaEU7UUFDRCxPQUFPLFdBQVcsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BILENBQUM7SUFFTSxNQUFNLENBQUMsTUFBNkI7UUFDekMsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFbkUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRTtZQUN6QyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQzt3R0FuRFUsbUJBQW1COzRHQUFuQixtQkFBbUIsY0FGbEIsTUFBTTs7NEZBRVAsbUJBQW1CO2tCQUgvQixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFNhZmVIdG1sIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBJUERGVmlld2VyQXBwbGljYXRpb24gfSBmcm9tICcuLi8uLi9vcHRpb25zL3BkZi12aWV3ZXItYXBwbGljYXRpb24nO1xuaW1wb3J0IHsgUmVzcG9uc2l2ZUNTU0NsYXNzIH0gZnJvbSAnLi4vLi4vcmVzcG9uc2l2ZS12aXNpYmlsaXR5JztcbmltcG9ydCB7IFBkZlNoeUJ1dHRvbkNvbXBvbmVudCB9IGZyb20gJy4vcGRmLXNoeS1idXR0b24uY29tcG9uZW50JztcblxuZXhwb3J0IGludGVyZmFjZSBQZGZTaHlCdXR0b25EZXNjcmlwdGlvbiB7XG4gIGlkOiBzdHJpbmc7XG4gIGNzc0NsYXNzOiBSZXNwb25zaXZlQ1NTQ2xhc3M7XG4gIGwxMG5JZDogc3RyaW5nO1xuICBsMTBuTGFiZWw6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgdG9nZ2xlZDogYm9vbGVhbjtcbiAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIG9yZGVyOiBudW1iZXI7XG4gIGltYWdlOiBTYWZlSHRtbDtcbiAgYWN0aW9uPzogKCkgPT4gdm9pZDtcbiAgZXZlbnRCdXNOYW1lPzogc3RyaW5nO1xuICBjbG9zZU9uQ2xpY2s/OiBib29sZWFuO1xufVxuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgUGRmU2h5QnV0dG9uU2VydmljZSB7XG4gIHB1YmxpYyBidXR0b25zOiBQZGZTaHlCdXR0b25EZXNjcmlwdGlvbltdID0gW107XG5cbiAgcHVibGljIGFkZChidXR0b246IFBkZlNoeUJ1dHRvbkNvbXBvbmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGlkID0gYnV0dG9uLnNlY29uZGFyeU1lbnVJZCA/PyB0aGlzLmFkZERlZmF1bHRQcmVmaXgoYnV0dG9uKTtcbiAgICBjb25zdCBwcmV2aW91c0RlZmluaXRpb24gPSB0aGlzLmJ1dHRvbnMuZmluZEluZGV4KChiKSA9PiBiLmlkID09PSBpZCk7XG4gICAgY29uc3QgZGVzY3JpcHRpb246IFBkZlNoeUJ1dHRvbkRlc2NyaXB0aW9uID0ge1xuICAgICAgaWQsXG4gICAgICBjc3NDbGFzczogYnV0dG9uLmNzc0NsYXNzLFxuICAgICAgbDEwbklkOiBidXR0b24ubDEwbklkLFxuICAgICAgbDEwbkxhYmVsOiBidXR0b24ubDEwbkxhYmVsLFxuICAgICAgdGl0bGU6IGJ1dHRvbi50aXRsZSxcbiAgICAgIHRvZ2dsZWQ6IGJ1dHRvbi50b2dnbGVkLFxuICAgICAgZGlzYWJsZWQ6IGJ1dHRvbi5kaXNhYmxlZCxcbiAgICAgIG9yZGVyOiBidXR0b24ub3JkZXIgPz8gOTk5OTksXG4gICAgICBpbWFnZTogYnV0dG9uLmltYWdlSHRtbCxcbiAgICAgIGFjdGlvbjogYnV0dG9uLmFjdGlvbixcbiAgICAgIGV2ZW50QnVzTmFtZTogYnV0dG9uLmV2ZW50QnVzTmFtZSxcbiAgICAgIGNsb3NlT25DbGljazogYnV0dG9uLmNsb3NlT25DbGljayxcbiAgICB9O1xuICAgIGlmIChwcmV2aW91c0RlZmluaXRpb24gPj0gMCkge1xuICAgICAgdGhpcy5idXR0b25zW3ByZXZpb3VzRGVmaW5pdGlvbl0gPSBkZXNjcmlwdGlvbjtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbiBhcyBJUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgICAgIGlmIChQREZWaWV3ZXJBcHBsaWNhdGlvbj8ubDEwbikge1xuICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24ubDEwbi50cmFuc2xhdGUoZWxlbWVudCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgJ2xvY2FsaXplZCcgZXZlbnQgb24gdGhlIGBldmVudEJ1c2Agb25jZSB0aGUgdmlld2VyXG4gICAgICAgICAgICAvLyBoYXMgYmVlbiBmdWxseSBpbml0aWFsaXplZCBhbmQgdHJhbnNsYXRlZC5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYnV0dG9ucy5wdXNoKGRlc2NyaXB0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5idXR0b25zLnNvcnQoKGEsIGIpID0+IGEub3JkZXIgLSBiLm9yZGVyKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkRGVmYXVsdFByZWZpeChidXR0b246IFBkZlNoeUJ1dHRvbkNvbXBvbmVudCk6IHN0cmluZyB7XG4gICAgaWYgKGJ1dHRvbi5wcmltYXJ5VG9vbGJhcklkLnN0YXJ0c1dpdGgoJ3ByaW1hcnknKSkge1xuICAgICAgcmV0dXJuIGJ1dHRvbi5wcmltYXJ5VG9vbGJhcklkLnJlcGxhY2UoJ3ByaW1hcnknLCAnc2Vjb25kYXJ5Jyk7XG4gICAgfVxuICAgIHJldHVybiAnc2Vjb25kYXJ5JyArIGJ1dHRvbi5wcmltYXJ5VG9vbGJhcklkLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgYnV0dG9uLnByaW1hcnlUb29sYmFySWQuc3Vic3RyaW5nKDEpO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZShidXR0b246IFBkZlNoeUJ1dHRvbkNvbXBvbmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGlkID0gYnV0dG9uLnNlY29uZGFyeU1lbnVJZCA/PyB0aGlzLmFkZERlZmF1bHRQcmVmaXgoYnV0dG9uKTtcblxuICAgIGlmICh0aGlzLmJ1dHRvbnMuc29tZSgoYikgPT4gYi5pZCA9PT0gaWQpKSB7XG4gICAgICB0aGlzLmFkZChidXR0b24pO1xuICAgIH1cbiAgfVxufVxuIl19