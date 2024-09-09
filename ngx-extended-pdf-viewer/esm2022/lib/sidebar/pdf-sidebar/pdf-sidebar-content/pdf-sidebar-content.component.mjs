import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import * as i0 from "@angular/core";
export class PdfSidebarContentComponent {
    customThumbnail;
    hideSidebarToolbar = false;
    mobileFriendlyZoomScale = 1.0;
    defaultThumbnail;
    linkService;
    thumbnailDrawn = new EventEmitter();
    get top() {
        let top = 0;
        if (!this.hideSidebarToolbar) {
            top = 32 * this.mobileFriendlyZoomScale;
            if (top === 32) {
                top = 33; // prevent the border of the sidebar toolbar from being cut off
            }
        }
        return `${top}px`;
    }
    constructor() {
        if (typeof window !== 'undefined') {
            window.pdfThumbnailGeneratorReady = () => this.pdfThumbnailGeneratorReady();
            window.pdfThumbnailGenerator = (pdfThumbnailView, linkService, id, container, thumbPageTitlePromiseOrPageL10nArgs) => this.createThumbnail(pdfThumbnailView, linkService, id, container, thumbPageTitlePromiseOrPageL10nArgs);
        }
    }
    ngOnDestroy() {
        this.linkService = undefined;
        const w = window;
        delete w.pdfThumbnailGeneratorReady;
        delete w.pdfThumbnailGenerator;
    }
    pdfThumbnailGeneratorReady() {
        if (!this.defaultThumbnail) {
            return false;
        }
        const t = this.defaultThumbnail.elementRef.nativeElement;
        return !!t && !!t.innerHTML && t.innerHTML.length > 0;
    }
    createThumbnail(pdfThumbnailView, linkService, id, container, thumbPageTitlePromiseOrPageL10nArgs) {
        this.linkService = linkService;
        const template = this.customThumbnail ?? this.defaultThumbnail;
        const view = template.createEmbeddedView(null);
        const newElement = view.rootNodes[0];
        newElement.classList.remove('pdf-viewer-template');
        const anchor = newElement;
        anchor.href = linkService.getAnchorUrl(`#page=${id}`);
        anchor.setAttribute('data-l10n-id', 'pdfjs-thumb-page-title');
        anchor.setAttribute('data-l10n-args', thumbPageTitlePromiseOrPageL10nArgs);
        this.replacePageNuberEverywhere(newElement, id.toString());
        anchor.onclick = () => {
            linkService.page = id;
            return false;
        };
        pdfThumbnailView.anchor = anchor;
        const img = newElement.getElementsByTagName('img')[0];
        pdfThumbnailView.div = newElement.getElementsByClassName('thumbnail')[0];
        container.appendChild(newElement);
        const thumbnailDrawnEvent = {
            thumbnail: newElement,
            container: container,
            pageId: id,
        };
        this.thumbnailDrawn.emit(thumbnailDrawnEvent);
        return img;
    }
    onKeyDown(event) {
        if (event.code === 'ArrowDown') {
            if (this.linkService) {
                if (event.ctrlKey || event.metaKey) {
                    this.linkService.page = this.linkService.pagesCount;
                }
                else if (this.linkService.page < this.linkService.pagesCount) {
                    this.linkService.page = this.linkService.page + 1;
                }
                event.preventDefault();
            }
        }
        else if (event.code === 'ArrowUp') {
            if (this.linkService) {
                if (event.ctrlKey || event.metaKey) {
                    this.linkService.page = 1;
                }
                else if (this.linkService.page > 1) {
                    this.linkService.page = this.linkService.page - 1;
                }
                event.preventDefault();
            }
        }
    }
    replacePageNuberEverywhere(element, pageNumber) {
        if (element.attributes) {
            Array.from(element.attributes).forEach((attr) => {
                if (attr.value.includes('PAGE_NUMBER')) {
                    attr.value = attr.value.replace('PAGE_NUMBER', pageNumber);
                }
            });
        }
        element.childNodes.forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                this.replacePageNuberEverywhere(child, pageNumber);
            }
            else if (child.nodeType === Node.TEXT_NODE) {
                if (child.nodeValue?.includes('PAGE_NUMBER')) {
                    child.nodeValue = child.nodeValue.replace('PAGE_NUMBER', pageNumber);
                }
            }
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfSidebarContentComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfSidebarContentComponent, selector: "pdf-sidebar-content", inputs: { customThumbnail: "customThumbnail", hideSidebarToolbar: "hideSidebarToolbar", mobileFriendlyZoomScale: "mobileFriendlyZoomScale" }, outputs: { thumbnailDrawn: "thumbnailDrawn" }, viewQueries: [{ propertyName: "defaultThumbnail", first: true, predicate: ["defaultThumbnail"], descendants: true, read: TemplateRef }], ngImport: i0, template: "<div id=\"sidebarContent\" [style.top]=\"top\">\n  <div id=\"thumbnailView\" (keydown)=\"onKeyDown($event)\"></div>\n  <div id=\"outlineView\" class=\"hidden\"></div>\n  <div id=\"attachmentsView\" class=\"hidden\"></div>\n  <div id=\"layersView\" class=\"hidden\"></div>\n</div>\n\n<ng-template #defaultThumbnail>\n  <a class=\"pdf-viewer-template\">\n    <div class=\"thumbnail\" data-page-number=\"PAGE_NUMBER\">\n      <img class=\"thumbnailImage\" alt=\"miniature of the page\" />\n    </div>\n  </a>\n</ng-template>\n", styles: [""] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfSidebarContentComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-sidebar-content', template: "<div id=\"sidebarContent\" [style.top]=\"top\">\n  <div id=\"thumbnailView\" (keydown)=\"onKeyDown($event)\"></div>\n  <div id=\"outlineView\" class=\"hidden\"></div>\n  <div id=\"attachmentsView\" class=\"hidden\"></div>\n  <div id=\"layersView\" class=\"hidden\"></div>\n</div>\n\n<ng-template #defaultThumbnail>\n  <a class=\"pdf-viewer-template\">\n    <div class=\"thumbnail\" data-page-number=\"PAGE_NUMBER\">\n      <img class=\"thumbnailImage\" alt=\"miniature of the page\" />\n    </div>\n  </a>\n</ng-template>\n" }]
        }], ctorParameters: () => [], propDecorators: { customThumbnail: [{
                type: Input
            }], hideSidebarToolbar: [{
                type: Input
            }], mobileFriendlyZoomScale: [{
                type: Input
            }], defaultThumbnail: [{
                type: ViewChild,
                args: ['defaultThumbnail', { read: TemplateRef }]
            }], thumbnailDrawn: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXNpZGViYXItY29udGVudC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci9zcmMvbGliL3NpZGViYXIvcGRmLXNpZGViYXIvcGRmLXNpZGViYXItY29udGVudC9wZGYtc2lkZWJhci1jb250ZW50LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvc2lkZWJhci9wZGYtc2lkZWJhci9wZGYtc2lkZWJhci1jb250ZW50L3BkZi1zaWRlYmFyLWNvbnRlbnQuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFhLE1BQU0sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQXFCMUcsTUFBTSxPQUFPLDBCQUEwQjtJQUU5QixlQUFlLENBQStCO0lBRzlDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztJQUczQix1QkFBdUIsR0FBRyxHQUFHLENBQUM7SUFHOUIsZ0JBQWdCLENBQW9CO0lBRW5DLFdBQVcsQ0FBNkI7SUFHekMsY0FBYyxHQUFHLElBQUksWUFBWSxFQUEwQixDQUFDO0lBRW5FLElBQVcsR0FBRztRQUNaLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDNUIsR0FBRyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUM7WUFDeEMsSUFBSSxHQUFHLEtBQUssRUFBRSxFQUFFO2dCQUNkLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQywrREFBK0Q7YUFDMUU7U0FDRjtRQUNELE9BQU8sR0FBRyxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBRUQ7UUFDRSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtZQUNoQyxNQUFjLENBQUMsMEJBQTBCLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7WUFDcEYsTUFBYyxDQUFDLHFCQUFxQixHQUFHLENBQ3RDLGdCQUFrQyxFQUNsQyxXQUFnQixFQUNoQixFQUFVLEVBQ1YsU0FBeUIsRUFDekIsbUNBQTJDLEVBQzNDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLG1DQUFtQyxDQUFDLENBQUM7U0FDOUc7SUFDSCxDQUFDO0lBRU0sV0FBVztRQUNoQixJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztRQUM3QixNQUFNLENBQUMsR0FBRyxNQUFhLENBQUM7UUFDeEIsT0FBTyxDQUFDLENBQUMsMEJBQTBCLENBQUM7UUFDcEMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUM7SUFDakMsQ0FBQztJQUVNLDBCQUEwQjtRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLGFBQTRCLENBQUM7UUFDeEUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU8sZUFBZSxDQUNyQixnQkFBa0MsRUFDbEMsV0FBMkIsRUFDM0IsRUFBVSxFQUNWLFNBQXlCLEVBQ3pCLG1DQUEyQztRQUUzQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUMvRCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQWdCLENBQUM7UUFDcEQsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUVuRCxNQUFNLE1BQU0sR0FBRyxVQUErQixDQUFDO1FBQy9DLE1BQU0sQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFdEQsTUFBTSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztRQUM5RCxNQUFNLENBQUMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLG1DQUFtQyxDQUFDLENBQUM7UUFFM0UsSUFBSSxDQUFDLDBCQUEwQixDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUUzRCxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUNwQixXQUFXLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUN0QixPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQztRQUNGLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFakMsTUFBTSxHQUFHLEdBQWlDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRixnQkFBZ0IsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBZ0IsQ0FBQztRQUV4RixTQUFTLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWxDLE1BQU0sbUJBQW1CLEdBQTJCO1lBQ2xELFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLE1BQU0sRUFBRSxFQUFFO1NBQ1gsQ0FBQztRQUNGLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDOUMsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRU0sU0FBUyxDQUFDLEtBQW9CO1FBQ25DLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7WUFDOUIsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNwQixJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtvQkFDbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7aUJBQ3JEO3FCQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUU7b0JBQzlELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztpQkFDbkQ7Z0JBQ0QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3hCO1NBQ0Y7YUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQ25DLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIsSUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7b0JBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztpQkFDM0I7cUJBQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7b0JBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztpQkFDbkQ7Z0JBQ0QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3hCO1NBQ0Y7SUFDSCxDQUFDO0lBRU8sMEJBQTBCLENBQUMsT0FBZ0IsRUFBRSxVQUFrQjtRQUNyRSxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQzlDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUU7b0JBQ3RDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2lCQUM1RDtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ25DLElBQUksS0FBSyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN4QyxJQUFJLENBQUMsMEJBQTBCLENBQUMsS0FBZ0IsRUFBRSxVQUFVLENBQUMsQ0FBQzthQUMvRDtpQkFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDNUMsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRTtvQkFDNUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7aUJBQ3RFO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7d0dBMUlVLDBCQUEwQjs0RkFBMUIsMEJBQTBCLHlWQVVFLFdBQVcsNkJDL0JwRCw2Z0JBY0E7OzRGRE9hLDBCQUEwQjtrQkFMdEMsU0FBUzsrQkFDRSxxQkFBcUI7d0RBTXhCLGVBQWU7c0JBRHJCLEtBQUs7Z0JBSUMsa0JBQWtCO3NCQUR4QixLQUFLO2dCQUlDLHVCQUF1QjtzQkFEN0IsS0FBSztnQkFJQyxnQkFBZ0I7c0JBRHRCLFNBQVM7dUJBQUMsa0JBQWtCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO2dCQU03QyxjQUFjO3NCQURwQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkRlc3Ryb3ksIE91dHB1dCwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGRmVGh1bWJuYWlsRHJhd25FdmVudCB9IGZyb20gJy4uLy4uLy4uL2V2ZW50cy9wZGYtdGh1bWJuYWlsLWRyYXduLWV2ZW50JztcbmRlY2xhcmUgY2xhc3MgUERGVGh1bWJuYWlsVmlldyB7XG4gIGFuY2hvcjogSFRNTEFuY2hvckVsZW1lbnQ7XG4gIGRpdjogSFRNTEVsZW1lbnQ7XG4gIHJpbmc6IEhUTUxFbGVtZW50O1xuICBjYW52YXNXaWR0aDogbnVtYmVyO1xuICBjYW52YXNIZWlnaHQ6IG51bWJlcjtcbn1cblxuZGVjbGFyZSBjbGFzcyBQREZMaW5rU2VydmljZSB7XG4gIHB1YmxpYyBwYWdlOiBudW1iZXI7XG4gIHB1YmxpYyBwYWdlc0NvdW50OiBudW1iZXI7XG4gIHB1YmxpYyBnZXRBbmNob3JVcmwodGFyZ2V0VXJsOiBzdHJpbmcpOiBzdHJpbmc7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BkZi1zaWRlYmFyLWNvbnRlbnQnLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLXNpZGViYXItY29udGVudC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3BkZi1zaWRlYmFyLWNvbnRlbnQuY29tcG9uZW50LmNzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBQZGZTaWRlYmFyQ29udGVudENvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBjdXN0b21UaHVtYm5haWw6IFRlbXBsYXRlUmVmPGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGhpZGVTaWRlYmFyVG9vbGJhciA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBtb2JpbGVGcmllbmRseVpvb21TY2FsZSA9IDEuMDtcblxuICBAVmlld0NoaWxkKCdkZWZhdWx0VGh1bWJuYWlsJywgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICBwdWJsaWMgZGVmYXVsdFRodW1ibmFpbCE6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgcHJpdmF0ZSBsaW5rU2VydmljZTogUERGTGlua1NlcnZpY2UgfCB1bmRlZmluZWQ7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyB0aHVtYm5haWxEcmF3biA9IG5ldyBFdmVudEVtaXR0ZXI8UGRmVGh1bWJuYWlsRHJhd25FdmVudD4oKTtcblxuICBwdWJsaWMgZ2V0IHRvcCgpOiBzdHJpbmcge1xuICAgIGxldCB0b3AgPSAwO1xuICAgIGlmICghdGhpcy5oaWRlU2lkZWJhclRvb2xiYXIpIHtcbiAgICAgIHRvcCA9IDMyICogdGhpcy5tb2JpbGVGcmllbmRseVpvb21TY2FsZTtcbiAgICAgIGlmICh0b3AgPT09IDMyKSB7XG4gICAgICAgIHRvcCA9IDMzOyAvLyBwcmV2ZW50IHRoZSBib3JkZXIgb2YgdGhlIHNpZGViYXIgdG9vbGJhciBmcm9tIGJlaW5nIGN1dCBvZmZcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGAke3RvcH1weGA7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICh3aW5kb3cgYXMgYW55KS5wZGZUaHVtYm5haWxHZW5lcmF0b3JSZWFkeSA9ICgpID0+IHRoaXMucGRmVGh1bWJuYWlsR2VuZXJhdG9yUmVhZHkoKTtcbiAgICAgICh3aW5kb3cgYXMgYW55KS5wZGZUaHVtYm5haWxHZW5lcmF0b3IgPSAoXG4gICAgICAgIHBkZlRodW1ibmFpbFZpZXc6IFBERlRodW1ibmFpbFZpZXcsXG4gICAgICAgIGxpbmtTZXJ2aWNlOiBhbnksXG4gICAgICAgIGlkOiBudW1iZXIsXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQsXG4gICAgICAgIHRodW1iUGFnZVRpdGxlUHJvbWlzZU9yUGFnZUwxMG5BcmdzOiBzdHJpbmdcbiAgICAgICkgPT4gdGhpcy5jcmVhdGVUaHVtYm5haWwocGRmVGh1bWJuYWlsVmlldywgbGlua1NlcnZpY2UsIGlkLCBjb250YWluZXIsIHRodW1iUGFnZVRpdGxlUHJvbWlzZU9yUGFnZUwxMG5BcmdzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5saW5rU2VydmljZSA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCB3ID0gd2luZG93IGFzIGFueTtcbiAgICBkZWxldGUgdy5wZGZUaHVtYm5haWxHZW5lcmF0b3JSZWFkeTtcbiAgICBkZWxldGUgdy5wZGZUaHVtYm5haWxHZW5lcmF0b3I7XG4gIH1cblxuICBwdWJsaWMgcGRmVGh1bWJuYWlsR2VuZXJhdG9yUmVhZHkoKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRUaHVtYm5haWwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgdCA9IHRoaXMuZGVmYXVsdFRodW1ibmFpbC5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgcmV0dXJuICEhdCAmJiAhIXQuaW5uZXJIVE1MICYmIHQuaW5uZXJIVE1MLmxlbmd0aCA+IDA7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVRodW1ibmFpbChcbiAgICBwZGZUaHVtYm5haWxWaWV3OiBQREZUaHVtYm5haWxWaWV3LFxuICAgIGxpbmtTZXJ2aWNlOiBQREZMaW5rU2VydmljZSxcbiAgICBpZDogbnVtYmVyLFxuICAgIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQsXG4gICAgdGh1bWJQYWdlVGl0bGVQcm9taXNlT3JQYWdlTDEwbkFyZ3M6IHN0cmluZ1xuICApOiBIVE1MSW1hZ2VFbGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICB0aGlzLmxpbmtTZXJ2aWNlID0gbGlua1NlcnZpY2U7XG4gICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLmN1c3RvbVRodW1ibmFpbCA/PyB0aGlzLmRlZmF1bHRUaHVtYm5haWw7XG4gICAgY29uc3QgdmlldyA9IHRlbXBsYXRlLmNyZWF0ZUVtYmVkZGVkVmlldyhudWxsKTtcbiAgICBjb25zdCBuZXdFbGVtZW50ID0gdmlldy5yb290Tm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgbmV3RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdwZGYtdmlld2VyLXRlbXBsYXRlJyk7XG5cbiAgICBjb25zdCBhbmNob3IgPSBuZXdFbGVtZW50IGFzIEhUTUxBbmNob3JFbGVtZW50O1xuICAgIGFuY2hvci5ocmVmID0gbGlua1NlcnZpY2UuZ2V0QW5jaG9yVXJsKGAjcGFnZT0ke2lkfWApO1xuXG4gICAgYW5jaG9yLnNldEF0dHJpYnV0ZSgnZGF0YS1sMTBuLWlkJywgJ3BkZmpzLXRodW1iLXBhZ2UtdGl0bGUnKTtcbiAgICBhbmNob3Iuc2V0QXR0cmlidXRlKCdkYXRhLWwxMG4tYXJncycsIHRodW1iUGFnZVRpdGxlUHJvbWlzZU9yUGFnZUwxMG5BcmdzKTtcblxuICAgIHRoaXMucmVwbGFjZVBhZ2VOdWJlckV2ZXJ5d2hlcmUobmV3RWxlbWVudCwgaWQudG9TdHJpbmcoKSk7XG5cbiAgICBhbmNob3Iub25jbGljayA9ICgpID0+IHtcbiAgICAgIGxpbmtTZXJ2aWNlLnBhZ2UgPSBpZDtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIHBkZlRodW1ibmFpbFZpZXcuYW5jaG9yID0gYW5jaG9yO1xuXG4gICAgY29uc3QgaW1nOiBIVE1MSW1hZ2VFbGVtZW50IHwgdW5kZWZpbmVkID0gbmV3RWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW1nJylbMF07XG4gICAgcGRmVGh1bWJuYWlsVmlldy5kaXYgPSBuZXdFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RodW1ibmFpbCcpWzBdIGFzIEhUTUxFbGVtZW50O1xuXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG5ld0VsZW1lbnQpO1xuXG4gICAgY29uc3QgdGh1bWJuYWlsRHJhd25FdmVudDogUGRmVGh1bWJuYWlsRHJhd25FdmVudCA9IHtcbiAgICAgIHRodW1ibmFpbDogbmV3RWxlbWVudCxcbiAgICAgIGNvbnRhaW5lcjogY29udGFpbmVyLFxuICAgICAgcGFnZUlkOiBpZCxcbiAgICB9O1xuICAgIHRoaXMudGh1bWJuYWlsRHJhd24uZW1pdCh0aHVtYm5haWxEcmF3bkV2ZW50KTtcbiAgICByZXR1cm4gaW1nO1xuICB9XG5cbiAgcHVibGljIG9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudC5jb2RlID09PSAnQXJyb3dEb3duJykge1xuICAgICAgaWYgKHRoaXMubGlua1NlcnZpY2UpIHtcbiAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkge1xuICAgICAgICAgIHRoaXMubGlua1NlcnZpY2UucGFnZSA9IHRoaXMubGlua1NlcnZpY2UucGFnZXNDb3VudDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmxpbmtTZXJ2aWNlLnBhZ2UgPCB0aGlzLmxpbmtTZXJ2aWNlLnBhZ2VzQ291bnQpIHtcbiAgICAgICAgICB0aGlzLmxpbmtTZXJ2aWNlLnBhZ2UgPSB0aGlzLmxpbmtTZXJ2aWNlLnBhZ2UgKyAxO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChldmVudC5jb2RlID09PSAnQXJyb3dVcCcpIHtcbiAgICAgIGlmICh0aGlzLmxpbmtTZXJ2aWNlKSB7XG4gICAgICAgIGlmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkpIHtcbiAgICAgICAgICB0aGlzLmxpbmtTZXJ2aWNlLnBhZ2UgPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubGlua1NlcnZpY2UucGFnZSA+IDEpIHtcbiAgICAgICAgICB0aGlzLmxpbmtTZXJ2aWNlLnBhZ2UgPSB0aGlzLmxpbmtTZXJ2aWNlLnBhZ2UgLSAxO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZXBsYWNlUGFnZU51YmVyRXZlcnl3aGVyZShlbGVtZW50OiBFbGVtZW50LCBwYWdlTnVtYmVyOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoZWxlbWVudC5hdHRyaWJ1dGVzKSB7XG4gICAgICBBcnJheS5mcm9tKGVsZW1lbnQuYXR0cmlidXRlcykuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICBpZiAoYXR0ci52YWx1ZS5pbmNsdWRlcygnUEFHRV9OVU1CRVInKSkge1xuICAgICAgICAgIGF0dHIudmFsdWUgPSBhdHRyLnZhbHVlLnJlcGxhY2UoJ1BBR0VfTlVNQkVSJywgcGFnZU51bWJlcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGVsZW1lbnQuY2hpbGROb2Rlcy5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICB0aGlzLnJlcGxhY2VQYWdlTnViZXJFdmVyeXdoZXJlKGNoaWxkIGFzIEVsZW1lbnQsIHBhZ2VOdW1iZXIpO1xuICAgICAgfSBlbHNlIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgaWYgKGNoaWxkLm5vZGVWYWx1ZT8uaW5jbHVkZXMoJ1BBR0VfTlVNQkVSJykpIHtcbiAgICAgICAgICBjaGlsZC5ub2RlVmFsdWUgPSBjaGlsZC5ub2RlVmFsdWUucmVwbGFjZSgnUEFHRV9OVU1CRVInLCBwYWdlTnVtYmVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iLCI8ZGl2IGlkPVwic2lkZWJhckNvbnRlbnRcIiBbc3R5bGUudG9wXT1cInRvcFwiPlxuICA8ZGl2IGlkPVwidGh1bWJuYWlsVmlld1wiIChrZXlkb3duKT1cIm9uS2V5RG93bigkZXZlbnQpXCI+PC9kaXY+XG4gIDxkaXYgaWQ9XCJvdXRsaW5lVmlld1wiIGNsYXNzPVwiaGlkZGVuXCI+PC9kaXY+XG4gIDxkaXYgaWQ9XCJhdHRhY2htZW50c1ZpZXdcIiBjbGFzcz1cImhpZGRlblwiPjwvZGl2PlxuICA8ZGl2IGlkPVwibGF5ZXJzVmlld1wiIGNsYXNzPVwiaGlkZGVuXCI+PC9kaXY+XG48L2Rpdj5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0VGh1bWJuYWlsPlxuICA8YSBjbGFzcz1cInBkZi12aWV3ZXItdGVtcGxhdGVcIj5cbiAgICA8ZGl2IGNsYXNzPVwidGh1bWJuYWlsXCIgZGF0YS1wYWdlLW51bWJlcj1cIlBBR0VfTlVNQkVSXCI+XG4gICAgICA8aW1nIGNsYXNzPVwidGh1bWJuYWlsSW1hZ2VcIiBhbHQ9XCJtaW5pYXR1cmUgb2YgdGhlIHBhZ2VcIiAvPlxuICAgIDwvZGl2PlxuICA8L2E+XG48L25nLXRlbXBsYXRlPlxuIl19