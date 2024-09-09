import { Component } from '@angular/core';
import * as i0 from "@angular/core";
/** List of all fields that can be customized */
const requiredIds = [
    'attachmentsView',
    'authorField',
    'contextFirstPage',
    'contextLastPage',
    'contextPageRotateCcw',
    'contextPageRotateCw',
    'creationDateField',
    'creatorField',
    'currentOutlineItem',
    'cursorHandTool',
    'cursorSelectTool',
    'customScaleOption',
    'documentProperties',
    'documentPropertiesClose',
    'download',
    'editorFreeText',
    'editorHighlight',
    'editorInk',
    'editorStamp',
    'editorModeButtons',
    'editorNone',
    'editorStampAddImage',
    'errorClose',
    'errorMessage',
    'errorMoreInfo',
    'errorShowLess',
    'errorShowMore',
    'errorWrapper',
    'fileNameField',
    'fileSizeField',
    'findbar',
    'findCurrentPage',
    'findEntireWord',
    'findFuzzy',
    'findHighlightAll',
    'findIgnoreAccents',
    'findInput',
    'findInputMultiline',
    'findMatchCase',
    'findMatchDiacritics',
    'findMsg',
    'findMultipleSearchTexts',
    'findNext',
    'findPrevious',
    'findRange',
    'findResultsCount',
    'firstPage',
    'individualWordsMode',
    'individualWordsModeLabel',
    'keywordsField',
    'lastPage',
    'linearizedField',
    'modificationDateField',
    'next',
    'numPages',
    'openFile',
    'outerContainer',
    'outerContainer',
    'outlineOptionsContainer',
    'outlineView',
    'pageCountField',
    'pageNumber',
    'pageRotateCcw',
    'pageRotateCw',
    'pageSizeField',
    'password',
    'passwordCancel',
    'passwordSubmit',
    'passwordText',
    'presentationMode',
    'previous',
    'print',
    'producerField',
    'scaleSelect',
    'scaleSelectContainer',
    'scaleSelectContainer',
    'scrollHorizontal',
    'scrollPage',
    'scrollVertical',
    'scrollWrapped',
    'secondaryDownload',
    'secondaryOpenFile',
    'secondaryPresentationMode',
    'secondaryPrint',
    'secondaryToolbar',
    'secondaryToolbarButtonContainer',
    'secondaryToolbarToggle',
    'secondaryViewBookmark',
    'sidebarResizer',
    'sidebarToggle',
    'spreadEven',
    'spreadNone',
    'spreadOdd',
    'subjectField',
    'thumbnailView',
    'titleField',
    'toolbarViewer',
    'versionField',
    'viewAttachments',
    'viewAttachments',
    'viewBookmark',
    'viewerContainer',
    'viewFind',
    'viewFind',
    'viewLayers',
    'viewOutline',
    'viewOutline',
    'viewThumbnail',
    'viewThumbnail',
    'zoomIn',
    'zoomOut',
];
export class PdfDummyComponentsComponent {
    dummyComponentsContainer;
    addMissingStandardWidgets() {
        this.dummyComponentsContainer = document.getElementsByClassName('dummy-pdf-viewer-components')[0];
        const container = this.dummyComponentsContainer;
        if (!container) {
            return;
        }
        for (let i = 0; i < container.children.length; i++) {
            const child = container.firstChild;
            if (child) {
                container.removeChild(child);
            }
        }
        requiredIds.forEach((id) => {
            if (this.needsDummyWidget(id)) {
                const dummy = document.createElement('span');
                dummy.id = id;
                dummy.className = 'invisible dummy-component';
                this.dummyComponentsContainer.appendChild(dummy);
            }
        });
        if (this.needsDummyWidget('scaleSelect')) {
            const dummy = document.createElement('select');
            dummy.id = 'scaleSelect';
            dummy.className = 'invisible dummy-component';
            this.dummyComponentsContainer.appendChild(dummy);
        }
    }
    needsDummyWidget(id) {
        const widget = document.getElementById(id);
        if (!widget) {
            return true;
        }
        return false;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfDummyComponentsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: PdfDummyComponentsComponent, selector: "pdf-dummy-components", ngImport: i0, template: "<span class=\"invisible dummy-pdf-viewer-components\">\n</span>\n" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: PdfDummyComponentsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-dummy-components', template: "<span class=\"invisible dummy-pdf-viewer-components\">\n</span>\n" }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWR1bW15LWNvbXBvbmVudHMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi9wZGYtZHVtbXktY29tcG9uZW50cy9wZGYtZHVtbXktY29tcG9uZW50cy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci9zcmMvbGliL3BkZi1kdW1teS1jb21wb25lbnRzL3BkZi1kdW1teS1jb21wb25lbnRzLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRTFDLGdEQUFnRDtBQUNoRCxNQUFNLFdBQVcsR0FBRztJQUNsQixpQkFBaUI7SUFDakIsYUFBYTtJQUNiLGtCQUFrQjtJQUNsQixpQkFBaUI7SUFDakIsc0JBQXNCO0lBQ3RCLHFCQUFxQjtJQUNyQixtQkFBbUI7SUFDbkIsY0FBYztJQUNkLG9CQUFvQjtJQUNwQixnQkFBZ0I7SUFDaEIsa0JBQWtCO0lBQ2xCLG1CQUFtQjtJQUNuQixvQkFBb0I7SUFDcEIseUJBQXlCO0lBQ3pCLFVBQVU7SUFDVixnQkFBZ0I7SUFDaEIsaUJBQWlCO0lBQ2pCLFdBQVc7SUFDWCxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLFlBQVk7SUFDWixxQkFBcUI7SUFDckIsWUFBWTtJQUNaLGNBQWM7SUFDZCxlQUFlO0lBQ2YsZUFBZTtJQUNmLGVBQWU7SUFDZixjQUFjO0lBQ2QsZUFBZTtJQUNmLGVBQWU7SUFDZixTQUFTO0lBQ1QsaUJBQWlCO0lBQ2pCLGdCQUFnQjtJQUNoQixXQUFXO0lBQ1gsa0JBQWtCO0lBQ2xCLG1CQUFtQjtJQUNuQixXQUFXO0lBQ1gsb0JBQW9CO0lBQ3BCLGVBQWU7SUFDZixxQkFBcUI7SUFDckIsU0FBUztJQUNULHlCQUF5QjtJ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LFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7d0dBeENVLDJCQUEyQjs0RkFBM0IsMkJBQTJCLDREQ3pIeEMsbUVBRUE7OzRGRHVIYSwyQkFBMkI7a0JBSnZDLFNBQVM7K0JBQ0Usc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKiBMaXN0IG9mIGFsbCBmaWVsZHMgdGhhdCBjYW4gYmUgY3VzdG9taXplZCAqL1xuY29uc3QgcmVxdWlyZWRJZHMgPSBbXG4gICdhdHRhY2htZW50c1ZpZXcnLFxuICAnYXV0aG9yRmllbGQnLFxuICAnY29udGV4dEZpcnN0UGFnZScsXG4gICdjb250ZXh0TGFzdFBhZ2UnLFxuICAnY29udGV4dFBhZ2VSb3RhdGVDY3cnLFxuICAnY29udGV4dFBhZ2VSb3RhdGVDdycsXG4gICdjcmVhdGlvbkRhdGVGaWVsZCcsXG4gICdjcmVhdG9yRmllbGQnLFxuICAnY3VycmVudE91dGxpbmVJdGVtJyxcbiAgJ2N1cnNvckhhbmRUb29sJyxcbiAgJ2N1cnNvclNlbGVjdFRvb2wnLFxuICAnY3VzdG9tU2NhbGVPcHRpb24nLFxuICAnZG9jdW1lbnRQcm9wZXJ0aWVzJyxcbiAgJ2RvY3VtZW50UHJvcGVydGllc0Nsb3NlJyxcbiAgJ2Rvd25sb2FkJyxcbiAgJ2VkaXRvckZyZWVUZXh0JyxcbiAgJ2VkaXRvckhpZ2hsaWdodCcsXG4gICdlZGl0b3JJbmsnLFxuICAnZWRpdG9yU3RhbXAnLFxuICAnZWRpdG9yTW9kZUJ1dHRvbnMnLFxuICAnZWRpdG9yTm9uZScsXG4gICdlZGl0b3JTdGFtcEFkZEltYWdlJyxcbiAgJ2Vycm9yQ2xvc2UnLFxuICAnZXJyb3JNZXNzYWdlJyxcbiAgJ2Vycm9yTW9yZUluZm8nLFxuICAnZXJyb3JTaG93TGVzcycsXG4gICdlcnJvclNob3dNb3JlJyxcbiAgJ2Vycm9yV3JhcHBlcicsXG4gICdmaWxlTmFtZUZpZWxkJyxcbiAgJ2ZpbGVTaXplRmllbGQnLFxuICAnZmluZGJhcicsXG4gICdmaW5kQ3VycmVudFBhZ2UnLFxuICAnZmluZEVudGlyZVdvcmQnLFxuICAnZmluZEZ1enp5JyxcbiAgJ2ZpbmRIaWdobGlnaHRBbGwnLFxuICAnZmluZElnbm9yZUFjY2VudHMnLFxuICAnZmluZElucHV0JyxcbiAgJ2ZpbmRJbnB1dE11bHRpbGluZScsXG4gICdmaW5kTWF0Y2hDYXNlJyxcbiAgJ2ZpbmRNYXRjaERpYWNyaXRpY3MnLFxuICAnZmluZE1zZycsXG4gICdmaW5kTXVsdGlwbGVTZWFyY2hUZXh0cycsXG4gICdmaW5kTmV4dCcsXG4gICdmaW5kUHJldmlvdXMnLFxuICAnZmluZFJhbmdlJyxcbiAgJ2ZpbmRSZXN1bHRzQ291bnQnLFxuICAnZmlyc3RQYWdlJyxcbiAgJ2luZGl2aWR1YWxXb3Jkc01vZGUnLFxuICAnaW5kaXZpZHVhbFdvcmRzTW9kZUxhYmVsJyxcbiAgJ2tleXdvcmRzRmllbGQnLFxuICAnbGFzdFBhZ2UnLFxuICAnbGluZWFyaXplZEZpZWxkJyxcbiAgJ21vZGlmaWNhdGlvbkRhdGVGaWVsZCcsXG4gICduZXh0JyxcbiAgJ251bVBhZ2VzJyxcbiAgJ29wZW5GaWxlJyxcbiAgJ291dGVyQ29udGFpbmVyJyxcbiAgJ291dGVyQ29udGFpbmVyJyxcbiAgJ291dGxpbmVPcHRpb25zQ29udGFpbmVyJyxcbiAgJ291dGxpbmVWaWV3JyxcbiAgJ3BhZ2VDb3VudEZpZWxkJyxcbiAgJ3BhZ2VOdW1iZXInLFxuICAncGFnZVJvdGF0ZUNjdycsXG4gICdwYWdlUm90YXRlQ3cnLFxuICAncGFnZVNpemVGaWVsZCcsXG4gICdwYXNzd29yZCcsXG4gICdwYXNzd29yZENhbmNlbCcsXG4gICdwYXNzd29yZFN1Ym1pdCcsXG4gICdwYXNzd29yZFRleHQnLFxuICAncHJlc2VudGF0aW9uTW9kZScsXG4gICdwcmV2aW91cycsXG4gICdwcmludCcsXG4gICdwcm9kdWNlckZpZWxkJyxcbiAgJ3NjYWxlU2VsZWN0JyxcbiAgJ3NjYWxlU2VsZWN0Q29udGFpbmVyJyxcbiAgJ3NjYWxlU2VsZWN0Q29udGFpbmVyJyxcbiAgJ3Njcm9sbEhvcml6b250YWwnLFxuICAnc2Nyb2xsUGFnZScsXG4gICdzY3JvbGxWZXJ0aWNhbCcsXG4gICdzY3JvbGxXcmFwcGVkJyxcbiAgJ3NlY29uZGFyeURvd25sb2FkJyxcbiAgJ3NlY29uZGFyeU9wZW5GaWxlJyxcbiAgJ3NlY29uZGFyeVByZXNlbnRhdGlvbk1vZGUnLFxuICAnc2Vjb25kYXJ5UHJpbnQnLFxuICAnc2Vjb25kYXJ5VG9vbGJhcicsXG4gICdzZWNvbmRhcnlUb29sYmFyQnV0dG9uQ29udGFpbmVyJyxcbiAgJ3NlY29uZGFyeVRvb2xiYXJUb2dnbGUnLFxuICAnc2Vjb25kYXJ5Vmlld0Jvb2ttYXJrJyxcbiAgJ3NpZGViYXJSZXNpemVyJyxcbiAgJ3NpZGViYXJUb2dnbGUnLFxuICAnc3ByZWFkRXZlbicsXG4gICdzcHJlYWROb25lJyxcbiAgJ3NwcmVhZE9kZCcsXG4gICdzdWJqZWN0RmllbGQnLFxuICAndGh1bWJuYWlsVmlldycsXG4gICd0aXRsZUZpZWxkJyxcbiAgJ3Rvb2xiYXJWaWV3ZXInLFxuICAndmVyc2lvbkZpZWxkJyxcbiAgJ3ZpZXdBdHRhY2htZW50cycsXG4gICd2aWV3QXR0YWNobWVudHMnLFxuICAndmlld0Jvb2ttYXJrJyxcbiAgJ3ZpZXdlckNvbnRhaW5lcicsXG4gICd2aWV3RmluZCcsXG4gICd2aWV3RmluZCcsXG4gICd2aWV3TGF5ZXJzJyxcbiAgJ3ZpZXdPdXRsaW5lJyxcbiAgJ3ZpZXdPdXRsaW5lJyxcbiAgJ3ZpZXdUaHVtYm5haWwnLFxuICAndmlld1RodW1ibmFpbCcsXG4gICd6b29tSW4nLFxuICAnem9vbU91dCcsXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZGYtZHVtbXktY29tcG9uZW50cycsXG4gIHRlbXBsYXRlVXJsOiAnLi9wZGYtZHVtbXktY29tcG9uZW50cy5jb21wb25lbnQuaHRtbCcsXG59KVxuZXhwb3J0IGNsYXNzIFBkZkR1bW15Q29tcG9uZW50c0NvbXBvbmVudCB7XG4gIHByaXZhdGUgZHVtbXlDb21wb25lbnRzQ29udGFpbmVyOiBFbGVtZW50O1xuXG4gIHB1YmxpYyBhZGRNaXNzaW5nU3RhbmRhcmRXaWRnZXRzKCk6IHZvaWQge1xuICAgIHRoaXMuZHVtbXlDb21wb25lbnRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZHVtbXktcGRmLXZpZXdlci1jb21wb25lbnRzJylbMF07XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5kdW1teUNvbXBvbmVudHNDb250YWluZXIgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKCFjb250YWluZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2hpbGQgPSBjb250YWluZXIuZmlyc3RDaGlsZDtcbiAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlcXVpcmVkSWRzLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICBpZiAodGhpcy5uZWVkc0R1bW15V2lkZ2V0KGlkKSkge1xuICAgICAgICBjb25zdCBkdW1teSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgZHVtbXkuaWQgPSBpZDtcbiAgICAgICAgZHVtbXkuY2xhc3NOYW1lID0gJ2ludmlzaWJsZSBkdW1teS1jb21wb25lbnQnO1xuICAgICAgICB0aGlzLmR1bW15Q29tcG9uZW50c0NvbnRhaW5lci5hcHBlbmRDaGlsZChkdW1teSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5uZWVkc0R1bW15V2lkZ2V0KCdzY2FsZVNlbGVjdCcpKSB7XG4gICAgICBjb25zdCBkdW1teSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgICAgZHVtbXkuaWQgPSAnc2NhbGVTZWxlY3QnO1xuICAgICAgZHVtbXkuY2xhc3NOYW1lID0gJ2ludmlzaWJsZSBkdW1teS1jb21wb25lbnQnO1xuICAgICAgdGhpcy5kdW1teUNvbXBvbmVudHNDb250YWluZXIuYXBwZW5kQ2hpbGQoZHVtbXkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbmVlZHNEdW1teVdpZGdldChpZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgd2lkZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIGlmICghd2lkZ2V0KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCI8c3BhbiBjbGFzcz1cImludmlzaWJsZSBkdW1teS1wZGYtdmlld2VyLWNvbXBvbmVudHNcIj5cbjwvc3Bhbj5cbiJdfQ==