import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AnnotationEditorParamsType } from './options/editor-annotations';
import * as i0 from "@angular/core";
export class NgxExtendedPdfViewerService {
    rendererFactory;
    ngxExtendedPdfViewerInitialized = false;
    recalculateSize$ = new Subject();
    secondaryMenuIsEmpty = false;
    renderer;
    constructor(rendererFactory) {
        this.rendererFactory = rendererFactory;
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }
    find(text, options = {}) {
        if (!this.ngxExtendedPdfViewerInitialized) {
            // tslint:disable-next-line:quotemark
            console.error("The PDF viewer hasn't finished initializing. Please call find() later.");
            return false;
        }
        else {
            const highlightAllCheckbox = document.getElementById('findHighlightAll');
            if (highlightAllCheckbox) {
                highlightAllCheckbox.checked = options.highlightAll ?? false;
            }
            const matchCaseCheckbox = document.getElementById('findMatchCase');
            if (matchCaseCheckbox) {
                matchCaseCheckbox.checked = options.matchCase ?? false;
            }
            const entireWordCheckbox = document.getElementById('findEntireWord');
            if (entireWordCheckbox) {
                entireWordCheckbox.checked = options.wholeWords ?? false;
            }
            const matchDiacriticsCheckbox = document.getElementById('findMatchDiacritics');
            if (matchDiacriticsCheckbox) {
                matchDiacriticsCheckbox.checked = options.matchDiacritics ?? false;
            }
            const inputField = document.getElementById('findInput');
            if (inputField) {
                inputField.value = text;
                // todo dirty hack!
                inputField.classList.remove('hidden');
                // end of the dirty hack
                inputField.dispatchEvent(new Event('input'));
                return true;
            }
            else {
                // tslint:disable-next-line:quotemark
                console.error("Unexpected error: the input field used to search isn't part of the DOM.");
                return false;
            }
        }
    }
    findNext() {
        if (!this.ngxExtendedPdfViewerInitialized) {
            // tslint:disable-next-line:quotemark
            console.error("The PDF viewer hasn't finished initializing. Please call findNext() later.");
            return false;
        }
        else {
            const button = document.getElementById('findNext');
            if (button) {
                button.click();
                return true;
            }
            return false;
        }
    }
    findPrevious() {
        if (!this.ngxExtendedPdfViewerInitialized) {
            // tslint:disable-next-line:quotemark
            console.error("The PDF viewer hasn't finished initializing. Please call findPrevious() later.");
            return false;
        }
        else {
            const button = document.getElementById('findPrevious');
            if (button) {
                button.click();
                return true;
            }
            return false;
        }
    }
    print(printRange) {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        if (PDFViewerApplication) {
            const alreadyThere = !!globalThis['isInPDFPrintRange'] && !printRange;
            if (!alreadyThere) {
                if (!printRange) {
                    printRange = {};
                }
                this.setPrintRange(printRange);
            }
            globalThis.printPDF();
            if (!alreadyThere) {
                PDFViewerApplication.eventBus.on('afterprint', () => {
                    this.removePrintRange();
                });
            }
        }
    }
    removePrintRange() {
        globalThis['isInPDFPrintRange'] = undefined;
        globalThis['filteredPageCount'] = undefined;
    }
    setPrintRange(printRange) {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        globalThis['isInPDFPrintRange'] = (page) => this.isInPDFPrintRange(page, printRange);
        globalThis['filteredPageCount'] = this.filteredPageCount(PDFViewerApplication?.pagesCount, printRange);
    }
    filteredPageCount(pageCount, range) {
        let result = 0;
        for (let page = 1; page <= pageCount; page++) {
            if (this.isInPDFPrintRange(page, range)) {
                result++;
            }
        }
        return result;
    }
    isInPDFPrintRange(pageIndex, printRange) {
        const page = pageIndex + 1;
        if (printRange.from) {
            if (page < printRange.from) {
                return false;
            }
        }
        if (printRange.to) {
            if (page > printRange.to) {
                return false;
            }
        }
        if (printRange.excluded) {
            if (printRange.excluded.some((p) => p === page)) {
                return false;
            }
        }
        if (printRange.included) {
            if (!printRange.included.some((p) => p === page)) {
                return false;
            }
        }
        return true;
    }
    async getPageAsLines(pageNumber) {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        if (PDFViewerApplication) {
            const pdfDocument = PDFViewerApplication.pdfDocument;
            const page = await pdfDocument.getPage(pageNumber);
            const textSnippets = (await page.getTextContent()).items //
                .filter((info) => !info['type']); // ignore the TextMarkedContent items
            const snippets = textSnippets;
            let minX = Number.MAX_SAFE_INTEGER;
            let minY = Number.MAX_SAFE_INTEGER;
            let maxX = Number.MIN_SAFE_INTEGER;
            let maxY = Number.MIN_SAFE_INTEGER;
            let countLTR = 0;
            let countRTL = 0;
            let text = '';
            let lines = new Array();
            for (let i = 0; i < snippets.length; i++) {
                const currentSnippet = snippets[i];
                if (!currentSnippet.hasEOL) {
                    const x = currentSnippet.transform[4];
                    const y = -currentSnippet.transform[5];
                    const width = currentSnippet.width;
                    const height = currentSnippet.height;
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x + width);
                    maxY = Math.max(maxY, y + height);
                    text += currentSnippet.str;
                    if (currentSnippet.dir === 'rtl') {
                        countRTL++;
                    }
                    if (currentSnippet.dir === 'ltr') {
                        countLTR++;
                    }
                }
                let addIt = i === snippets.length - 1 || currentSnippet.hasEOL;
                if (addIt) {
                    let direction = undefined;
                    if (countLTR > 0 && countRTL > 0) {
                        direction = 'both';
                    }
                    else if (countLTR > 0) {
                        direction = 'ltr';
                    }
                    else if (countRTL > 0) {
                        direction = 'rtl';
                    }
                    const line = {
                        direction,
                        x: minX,
                        y: minY,
                        width: maxX - minX,
                        height: maxY - minY,
                        text: text.trim(),
                    };
                    lines.push(line);
                    minX = Number.MAX_SAFE_INTEGER;
                    minY = Number.MAX_SAFE_INTEGER;
                    maxX = Number.MIN_SAFE_INTEGER;
                    maxY = Number.MIN_SAFE_INTEGER;
                    countLTR = 0;
                    countRTL = 0;
                    text = '';
                }
            }
            return lines;
        }
        return [];
    }
    async getPageAsText(pageNumber) {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        if (!PDFViewerApplication) {
            return '';
        }
        const pdfDocument = PDFViewerApplication.pdfDocument;
        const page = await pdfDocument.getPage(pageNumber);
        const textSnippets = (await page.getTextContent()).items;
        return this.convertTextInfoToText(textSnippets);
    }
    convertTextInfoToText(textInfoItems) {
        if (!textInfoItems) {
            return '';
        }
        return textInfoItems
            .filter((info) => !info['type'])
            .map((info) => (info.hasEOL ? info.str + '\n' : info.str))
            .join('');
    }
    getPageAsImage(pageNumber, scale, background, backgroundColorToReplace = '#FFFFFF') {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        if (!PDFViewerApplication) {
            return Promise.resolve(undefined);
        }
        const pdfDocument = PDFViewerApplication.pdfDocument;
        const pagePromise = pdfDocument.getPage(pageNumber);
        const imagePromise = (pdfPage) => Promise.resolve(this.draw(pdfPage, scale, background, backgroundColorToReplace));
        return pagePromise.then(imagePromise);
    }
    draw(pdfPage, scale, background, backgroundColorToReplace = '#FFFFFF') {
        let zoomFactor = 1;
        if (scale.scale) {
            zoomFactor = scale.scale;
        }
        else if (scale.width) {
            zoomFactor = scale.width / pdfPage.getViewport({ scale: 1 }).width;
        }
        else if (scale.height) {
            zoomFactor = scale.height / pdfPage.getViewport({ scale: 1 }).height;
        }
        const viewport = pdfPage.getViewport({
            scale: zoomFactor,
        });
        const { ctx, canvas } = this.getPageDrawContext(viewport.width, viewport.height);
        const drawViewport = viewport.clone();
        const renderContext = {
            canvasContext: ctx,
            viewport: drawViewport,
            background,
            backgroundColorToReplace,
        };
        const renderTask = pdfPage.render(renderContext);
        const dataUrlPromise = () => Promise.resolve(canvas.toDataURL());
        return renderTask.promise.then(dataUrlPromise);
    }
    getPageDrawContext(width, height) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) {
            // tslint:disable-next-line: quotemark
            throw new Error("Couldn't create the 2d context");
        }
        canvas.width = width;
        canvas.height = height;
        this.renderer.setStyle(canvas, 'width', `${width}px`);
        this.renderer.setStyle(canvas, 'height', `${height}px`);
        return { ctx, canvas };
    }
    async getCurrentDocumentAsBlob() {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        return await PDFViewerApplication?.export();
    }
    async getFormData(currentFormValues = true) {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        if (!PDFViewerApplication) {
            return [];
        }
        const pdf = PDFViewerApplication.pdfDocument;
        // screen DPI / PDF DPI
        const dpiRatio = 96 / 72;
        const result = [];
        for (let i = 1; i <= pdf?.numPages; i++) {
            // track the current page
            const currentPage /* : PDFPageProxy */ = await pdf.getPage(i);
            const annotations = await currentPage.getAnnotations();
            annotations
                .filter((a) => a.subtype === 'Widget') // get the form field annotations only
                .map((a) => ({ ...a })) // only expose copies of the annotations to avoid side-effects
                .forEach((a) => {
                // get the rectangle that represent the single field
                // and resize it according to the current DPI
                const fieldRect = currentPage.getViewport({ scale: dpiRatio }).convertToViewportRectangle(a.rect);
                // add the corresponding input
                if (currentFormValues && a.fieldName) {
                    try {
                        if (a.exportValue) {
                            const currentValue = PDFViewerApplication.pdfDocument.annotationStorage.getValue(a.id, a.fieldName + '/' + a.exportValue, '');
                            a.value = currentValue?.value;
                        }
                        else if (a.radioButton) {
                            const currentValue = PDFViewerApplication.pdfDocument.annotationStorage.getValue(a.id, a.fieldName + '/' + a.fieldValue, '');
                            a.value = currentValue?.value;
                        }
                        else {
                            const currentValue = PDFViewerApplication.pdfDocument.annotationStorage.getValue(a.id, a.fieldName, '');
                            a.value = currentValue?.value;
                        }
                    }
                    catch (exception) {
                        // just ignore it
                    }
                }
                result.push({ fieldAnnotation: a, fieldRect, pageNumber: i });
            });
        }
        return result;
    }
    /**
     * Adds a page to the rendering queue
     * @param {number} pageIndex Index of the page to render
     * @returns {boolean} false, if the page has already been rendered
     * or if it's out of range
     */
    addPageToRenderQueue(pageIndex) {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        return PDFViewerApplication?.pdfViewer.addPageToRenderQueue(pageIndex);
    }
    isRenderQueueEmpty() {
        const scrolledDown = true;
        const renderExtra = false;
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        const nextPage = PDFViewerApplication?.pdfViewer.renderingQueue.getHighestPriority(PDFViewerApplication.pdfViewer._getVisiblePages(), PDFViewerApplication.pdfViewer._pages, scrolledDown, renderExtra);
        return !nextPage;
    }
    hasPageBeenRendered(pageIndex) {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        if (!PDFViewerApplication) {
            return false;
        }
        const pages = PDFViewerApplication.pdfViewer._pages;
        if (pages.length > pageIndex && pageIndex >= 0) {
            const pageView = pages[pageIndex];
            const hasBeenRendered = pageView.renderingState === 3;
            return hasBeenRendered;
        }
        return false;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async renderPage(pageIndex) {
        if (!this.hasPageBeenRendered(pageIndex)) {
            await this.addPageToRenderQueue(pageIndex);
            while (!this.hasPageBeenRendered(pageIndex)) {
                await this.sleep(7);
            }
        }
    }
    currentlyRenderedPages() {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        if (!PDFViewerApplication) {
            return [];
        }
        const pages = PDFViewerApplication.pdfViewer._pages;
        return pages.filter((page) => page.renderingState === 3).map((page) => page.id);
    }
    numberOfPages() {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        if (!PDFViewerApplication) {
            return 0;
        }
        const pages = PDFViewerApplication.pdfViewer._pages;
        return pages.length;
    }
    getCurrentlyVisiblePageNumbers() {
        const app = globalThis.PDFViewerApplication;
        if (!app) {
            return [];
        }
        const pages = app.pdfViewer._getVisiblePages().views;
        return pages?.map((page) => page.id);
    }
    recalculateSize() {
        this.recalculateSize$.next();
    }
    async listLayers() {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        if (!PDFViewerApplication) {
            return [];
        }
        const optionalContentConfig = await PDFViewerApplication.pdfViewer.optionalContentConfigPromise;
        if (optionalContentConfig) {
            const levelData = optionalContentConfig.getOrder();
            const layerIds = levelData.filter((groupId) => typeof groupId !== 'object');
            return layerIds.map((layerId) => {
                const config = optionalContentConfig.getGroup(layerId);
                return {
                    layerId: layerId,
                    name: config.name,
                    visible: config.visible,
                };
            });
        }
        return undefined;
    }
    async toggleLayer(layerId) {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        if (!PDFViewerApplication) {
            return;
        }
        const optionalContentConfig = await PDFViewerApplication.pdfViewer.optionalContentConfigPromise;
        if (optionalContentConfig) {
            let isVisible = optionalContentConfig.getGroup(layerId).visible;
            const checkbox = document.querySelector(`input[id='${layerId}']`);
            if (checkbox) {
                isVisible = checkbox.checked;
                checkbox.checked = !isVisible;
            }
            optionalContentConfig.setVisibility(layerId, !isVisible);
            PDFViewerApplication.eventBus.dispatch('optionalcontentconfig', {
                source: this,
                promise: Promise.resolve(optionalContentConfig),
            });
        }
    }
    scrollPageIntoView(pageNumber, pageSpot) {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        const viewer = PDFViewerApplication?.pdfViewer;
        viewer?.scrollPagePosIntoView(pageNumber, pageSpot);
    }
    getSerializedAnnotations() {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        return PDFViewerApplication?.pdfViewer.getSerializedAnnotations();
    }
    addEditorAnnotation(serializedAnnotation) {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        PDFViewerApplication?.pdfViewer.addEditorAnnotation(serializedAnnotation);
    }
    removeEditorAnnotations(filter) {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        PDFViewerApplication?.pdfViewer.removeEditorAnnotations(filter);
    }
    async loadImageAsDataURL(imageUrl) {
        if (imageUrl.startsWith('data:')) {
            return imageUrl;
        }
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch the image from ${imageUrl}: ${response.statusText}`);
        }
        const imageBlob = await response.blob();
        return imageBlob;
    }
    async addImageToAnnotationLayer({ urlOrDataUrl, page, left, bottom, right, top, rotation }) {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        if (PDFViewerApplication) {
            if (page !== undefined) {
                if (page !== this.currentPageIndex()) {
                    await this.renderPage(page);
                }
            }
            else {
                page = this.currentPageIndex();
            }
            const previousAnnotationEditorMode = PDFViewerApplication.pdfViewer.annotationEditorMode;
            this.switchAnnotationEdtorMode(13);
            const dataUrl = await this.loadImageAsDataURL(urlOrDataUrl);
            const pageSize = PDFViewerApplication.pdfViewer._pages[page].pdfPage.view;
            const leftDim = pageSize[0];
            const bottomDim = pageSize[1];
            const rightDim = pageSize[2];
            const topDim = pageSize[3];
            const width = rightDim - leftDim;
            const height = topDim - bottomDim;
            const imageWidth = PDFViewerApplication.pdfViewer._pages[page].div.clientWidth;
            const imageHeight = PDFViewerApplication.pdfViewer._pages[page].div.clientHeight;
            const leftPdf = this.convertToPDFCoordinates(left, width, 0, imageWidth);
            const bottomPdf = this.convertToPDFCoordinates(bottom, height, 0, imageHeight);
            const rightPdf = this.convertToPDFCoordinates(right, width, width, imageWidth);
            const topPdf = this.convertToPDFCoordinates(top, height, height, imageHeight);
            const stampAnnotation = {
                annotationType: 13,
                pageIndex: page,
                bitmapUrl: dataUrl,
                rect: [leftPdf, bottomPdf, rightPdf, topPdf],
                rotation: rotation ?? 0,
            };
            this.addEditorAnnotation(stampAnnotation);
            await this.sleep(10);
            this.switchAnnotationEdtorMode(previousAnnotationEditorMode);
        }
    }
    currentPageIndex() {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        return PDFViewerApplication?.pdfViewer.currentPageNumber - 1;
    }
    convertToPDFCoordinates(value, maxValue, defaultValue, imageMaxValue) {
        if (!value) {
            return defaultValue;
        }
        if (typeof value === 'string') {
            if (value.endsWith('%')) {
                return (parseInt(value, 10) / 100) * maxValue;
            }
            else if (value.endsWith('px')) {
                return parseInt(value, 10) * (maxValue / imageMaxValue);
            }
            else {
                return parseInt(value, 10);
            }
        }
        else {
            return value;
        }
    }
    switchAnnotationEdtorMode(mode) {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        PDFViewerApplication?.eventBus.dispatch('switchannotationeditormode', { mode });
    }
    set editorFontSize(size) {
        this.setEditorProperty(AnnotationEditorParamsType.FREETEXT_SIZE, size);
    }
    set editorFontColor(color) {
        this.setEditorProperty(AnnotationEditorParamsType.FREETEXT_COLOR, color);
    }
    set editorInkColor(color) {
        this.setEditorProperty(AnnotationEditorParamsType.INK_COLOR, color);
    }
    set editorInkOpacity(opacity) {
        this.setEditorProperty(AnnotationEditorParamsType.INK_OPACITY, opacity);
    }
    set editorInkThickness(thickness) {
        this.setEditorProperty(AnnotationEditorParamsType.INK_THICKNESS, thickness);
    }
    set editorHighlightColor(color) {
        this.setEditorProperty(AnnotationEditorParamsType.HIGHLIGHT_COLOR, color);
    }
    set editorHighlightDefaultColor(color) {
        this.setEditorProperty(AnnotationEditorParamsType.HIGHLIGHT_DEFAULT_COLOR, color);
    }
    set editorHighlightShowAll(showAll) {
        this.setEditorProperty(AnnotationEditorParamsType.HIGHLIGHT_SHOW_ALL, showAll);
    }
    set editorHighlightThickness(thickness) {
        this.setEditorProperty(AnnotationEditorParamsType.HIGHLIGHT_THICKNESS, thickness);
    }
    setEditorProperty(editorPropertyType, value) {
        const PDFViewerApplication = globalThis.PDFViewerApplication;
        PDFViewerApplication?.eventBus.dispatch('switchannotationeditorparams', { type: editorPropertyType, value });
        PDFViewerApplication?.eventBus.dispatch('annotationeditorparamschanged', { details: [[editorPropertyType, value]] });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: NgxExtendedPdfViewerService, deps: [{ token: i0.RendererFactory2 }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: NgxExtendedPdfViewerService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: NgxExtendedPdfViewerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: i0.RendererFactory2 }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUErQixNQUFNLGVBQWUsQ0FBQztBQUN4RSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSwwQkFBMEIsRUFBMkMsTUFBTSw4QkFBOEIsQ0FBQzs7QUF1RG5ILE1BQU0sT0FBTywyQkFBMkI7SUFTbEI7SUFSYiwrQkFBK0IsR0FBRyxLQUFLLENBQUM7SUFFeEMsZ0JBQWdCLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztJQUV2QyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7SUFFNUIsUUFBUSxDQUFZO0lBRTVCLFlBQW9CLGVBQWlDO1FBQWpDLG9CQUFlLEdBQWYsZUFBZSxDQUFrQjtRQUNuRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRU0sSUFBSSxDQUFDLElBQVksRUFBRSxVQUF1QixFQUFFO1FBQ2pELElBQUksQ0FBQyxJQUFJLENBQUMsK0JBQStCLEVBQUU7WUFDekMscUNBQXFDO1lBQ3JDLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0VBQXdFLENBQUMsQ0FBQztZQUN4RixPQUFPLEtBQUssQ0FBQztTQUNkO2FBQU07WUFDTCxNQUFNLG9CQUFvQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQXFCLENBQUM7WUFDN0YsSUFBSSxvQkFBb0IsRUFBRTtnQkFDeEIsb0JBQW9CLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxZQUFZLElBQUksS0FB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aUJBQWlCLENBQUMsa0JBQTBCLEVBQUUsS0FBVTtRQUM3RCxNQUFNLG9CQUFvQixHQUEyQixVQUFrQixDQUFDLG9CQUFvQixDQUFDO1FBQzdGLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsOEJBQThCLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUM3RyxvQkFBb0IsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLCtCQUErQixFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2SCxDQUFDO3dHQXRtQlUsMkJBQTJCOzRHQUEzQiwyQkFBMkIsY0FGMUIsTUFBTTs7NEZBRVAsMkJBQTJCO2tCQUh2QyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIFJlbmRlcmVyMiwgUmVuZGVyZXJGYWN0b3J5MiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQW5ub3RhdGlvbkVkaXRvclBhcmFtc1R5cGUsIEVkaXRvckFubm90YXRpb24sIFN0YW1wRWRpdG9yQW5ub3RhdGlvbiB9IGZyb20gJy4vb3B0aW9ucy9lZGl0b3ItYW5ub3RhdGlvbnMnO1xuaW1wb3J0IHsgUGRmTGF5ZXIgfSBmcm9tICcuL29wdGlvbnMvb3B0aW9uYWxfY29udGVudF9jb25maWcnO1xuaW1wb3J0IHsgUERGUHJpbnRSYW5nZSB9IGZyb20gJy4vb3B0aW9ucy9wZGYtcHJpbnQtcmFuZ2UnO1xuaW1wb3J0IHsgSVBERlZpZXdlckFwcGxpY2F0aW9uLCBQREZEb2N1bWVudFByb3h5LCBUZXh0SXRlbSwgVGV4dE1hcmtlZENvbnRlbnQgfSBmcm9tICcuL29wdGlvbnMvcGRmLXZpZXdlci1hcHBsaWNhdGlvbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmluZE9wdGlvbnMge1xuICBoaWdobGlnaHRBbGw/OiBib29sZWFuO1xuICBtYXRjaENhc2U/OiBib29sZWFuO1xuICB3aG9sZVdvcmRzPzogYm9vbGVhbjtcbiAgbWF0Y2hEaWFjcml0aWNzPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIERyYXdDb250ZXh0IHtcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUERGRXhwb3J0U2NhbGVGYWN0b3Ige1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBzY2FsZT86IG51bWJlcjtcbn1cblxudHlwZSBEaXJlY3Rpb25UeXBlID0gJ2x0cicgfCAncnRsJyB8ICdib3RoJyB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IGludGVyZmFjZSBQZGZJbWFnZVBhcmFtZXRlcnMge1xuICB1cmxPckRhdGFVcmw6IHN0cmluZztcbiAgcGFnZT86IG51bWJlcjtcbiAgbGVmdD86IG51bWJlciB8IHN0cmluZztcbiAgYm90dG9tPzogbnVtYmVyIHwgc3RyaW5nO1xuICByaWdodD86IG51bWJlciB8IHN0cmluZztcbiAgdG9wPzogbnVtYmVyIHwgc3RyaW5nO1xuICByb3RhdGlvbj86IDAgfCA5MCB8IDE4MCB8IDI3MDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaW5lIHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBkaXJlY3Rpb246IERpcmVjdGlvblR5cGU7XG4gIHRleHQ6IHN0cmluZztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgU2VjdGlvbiB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgZGlyZWN0aW9uOiBEaXJlY3Rpb25UeXBlO1xuICBsaW5lczogQXJyYXk8TGluZT47XG59XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hFeHRlbmRlZFBkZlZpZXdlclNlcnZpY2Uge1xuICBwdWJsaWMgbmd4RXh0ZW5kZWRQZGZWaWV3ZXJJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gIHB1YmxpYyByZWNhbGN1bGF0ZVNpemUkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBwdWJsaWMgc2Vjb25kYXJ5TWVudUlzRW1wdHkgPSBmYWxzZTtcblxuICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlckZhY3Rvcnk6IFJlbmRlcmVyRmFjdG9yeTIpIHtcbiAgICB0aGlzLnJlbmRlcmVyID0gdGhpcy5yZW5kZXJlckZhY3RvcnkuY3JlYXRlUmVuZGVyZXIobnVsbCwgbnVsbCk7XG4gIH1cblxuICBwdWJsaWMgZmluZCh0ZXh0OiBzdHJpbmcsIG9wdGlvbnM6IEZpbmRPcHRpb25zID0ge30pOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMubmd4RXh0ZW5kZWRQZGZWaWV3ZXJJbml0aWFsaXplZCkge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnF1b3RlbWFya1xuICAgICAgY29uc29sZS5lcnJvcihcIlRoZSBQREYgdmlld2VyIGhhc24ndCBmaW5pc2hlZCBpbml0aWFsaXppbmcuIFBsZWFzZSBjYWxsIGZpbmQoKSBsYXRlci5cIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGhpZ2hsaWdodEFsbENoZWNrYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRIaWdobGlnaHRBbGwnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgaWYgKGhpZ2hsaWdodEFsbENoZWNrYm94KSB7XG4gICAgICAgIGhpZ2hsaWdodEFsbENoZWNrYm94LmNoZWNrZWQgPSBvcHRpb25zLmhpZ2hsaWdodEFsbCA/PyBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWF0Y2hDYXNlQ2hlY2tib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZE1hdGNoQ2FzZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICBpZiAobWF0Y2hDYXNlQ2hlY2tib3gpIHtcbiAgICAgICAgbWF0Y2hDYXNlQ2hlY2tib3guY2hlY2tlZCA9IG9wdGlvbnMubWF0Y2hDYXNlID8/IGZhbHNlO1xuICAgICAgfVxuICAgICAgY29uc3QgZW50aXJlV29yZENoZWNrYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRFbnRpcmVXb3JkJykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgIGlmIChlbnRpcmVXb3JkQ2hlY2tib3gpIHtcbiAgICAgICAgZW50aXJlV29yZENoZWNrYm94LmNoZWNrZWQgPSBvcHRpb25zLndob2xlV29yZHMgPz8gZmFsc2U7XG4gICAgICB9XG4gICAgICBjb25zdCBtYXRjaERpYWNyaXRpY3NDaGVja2JveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kTWF0Y2hEaWFjcml0aWNzJykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgIGlmIChtYXRjaERpYWNyaXRpY3NDaGVja2JveCkge1xuICAgICAgICBtYXRjaERpYWNyaXRpY3NDaGVja2JveC5jaGVja2VkID0gb3B0aW9ucy5tYXRjaERpYWNyaXRpY3MgPz8gZmFsc2U7XG4gICAgICB9XG4gICAgICBjb25zdCBpbnB1dEZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRJbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICBpZiAoaW5wdXRGaWVsZCkge1xuICAgICAgICBpbnB1dEZpZWxkLnZhbHVlID0gdGV4dDtcbiAgICAgICAgLy8gdG9kbyBkaXJ0eSBoYWNrIVxuICAgICAgICBpbnB1dEZpZWxkLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgICAvLyBlbmQgb2YgdGhlIGRpcnR5IGhhY2tcbiAgICAgICAgaW5wdXRGaWVsZC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnF1b3RlbWFya1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5leHBlY3RlZCBlcnJvcjogdGhlIGlucHV0IGZpZWxkIHVzZWQgdG8gc2VhcmNoIGlzbid0IHBhcnQgb2YgdGhlIERPTS5cIik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZmluZE5leHQoKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLm5neEV4dGVuZGVkUGRmVmlld2VySW5pdGlhbGl6ZWQpIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpxdW90ZW1hcmtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGUgUERGIHZpZXdlciBoYXNuJ3QgZmluaXNoZWQgaW5pdGlhbGl6aW5nLiBQbGVhc2UgY2FsbCBmaW5kTmV4dCgpIGxhdGVyLlwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmROZXh0Jyk7XG4gICAgICBpZiAoYnV0dG9uKSB7XG4gICAgICAgIGJ1dHRvbi5jbGljaygpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZmluZFByZXZpb3VzKCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5uZ3hFeHRlbmRlZFBkZlZpZXdlckluaXRpYWxpemVkKSB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cXVvdGVtYXJrXG4gICAgICBjb25zb2xlLmVycm9yKFwiVGhlIFBERiB2aWV3ZXIgaGFzbid0IGZpbmlzaGVkIGluaXRpYWxpemluZy4gUGxlYXNlIGNhbGwgZmluZFByZXZpb3VzKCkgbGF0ZXIuXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZFByZXZpb3VzJyk7XG4gICAgICBpZiAoYnV0dG9uKSB7XG4gICAgICAgIGJ1dHRvbi5jbGljaygpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcHJpbnQocHJpbnRSYW5nZT86IFBERlByaW50UmFuZ2UpIHtcbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gKGdsb2JhbFRoaXMgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBpZiAoUERGVmlld2VyQXBwbGljYXRpb24pIHtcbiAgICAgIGNvbnN0IGFscmVhZHlUaGVyZSA9ICEhZ2xvYmFsVGhpc1snaXNJblBERlByaW50UmFuZ2UnXSAmJiAhcHJpbnRSYW5nZTtcbiAgICAgIGlmICghYWxyZWFkeVRoZXJlKSB7XG4gICAgICAgIGlmICghcHJpbnRSYW5nZSkge1xuICAgICAgICAgIHByaW50UmFuZ2UgPSB7fSBhcyBQREZQcmludFJhbmdlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0UHJpbnRSYW5nZShwcmludFJhbmdlKTtcbiAgICAgIH1cbiAgICAgIChnbG9iYWxUaGlzIGFzIGFueSkucHJpbnRQREYoKTtcbiAgICAgIGlmICghYWxyZWFkeVRoZXJlKSB7XG4gICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLm9uKCdhZnRlcnByaW50JywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVtb3ZlUHJpbnRSYW5nZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlUHJpbnRSYW5nZSgpIHtcbiAgICBnbG9iYWxUaGlzWydpc0luUERGUHJpbnRSYW5nZSddID0gdW5kZWZpbmVkO1xuICAgIGdsb2JhbFRoaXNbJ2ZpbHRlcmVkUGFnZUNvdW50J10gPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgc2V0UHJpbnRSYW5nZShwcmludFJhbmdlOiBQREZQcmludFJhbmdlKSB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9IChnbG9iYWxUaGlzIGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgZ2xvYmFsVGhpc1snaXNJblBERlByaW50UmFuZ2UnXSA9IChwYWdlOiBudW1iZXIpID0+IHRoaXMuaXNJblBERlByaW50UmFuZ2UocGFnZSwgcHJpbnRSYW5nZSk7XG4gICAgZ2xvYmFsVGhpc1snZmlsdGVyZWRQYWdlQ291bnQnXSA9IHRoaXMuZmlsdGVyZWRQYWdlQ291bnQoUERGVmlld2VyQXBwbGljYXRpb24/LnBhZ2VzQ291bnQsIHByaW50UmFuZ2UpO1xuICB9XG5cbiAgcHVibGljIGZpbHRlcmVkUGFnZUNvdW50KHBhZ2VDb3VudDogbnVtYmVyLCByYW5nZTogUERGUHJpbnRSYW5nZSk6IG51bWJlciB7XG4gICAgbGV0IHJlc3VsdCA9IDA7XG4gICAgZm9yIChsZXQgcGFnZSA9IDE7IHBhZ2UgPD0gcGFnZUNvdW50OyBwYWdlKyspIHtcbiAgICAgIGlmICh0aGlzLmlzSW5QREZQcmludFJhbmdlKHBhZ2UsIHJhbmdlKSkge1xuICAgICAgICByZXN1bHQrKztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBpc0luUERGUHJpbnRSYW5nZShwYWdlSW5kZXg6IG51bWJlciwgcHJpbnRSYW5nZTogUERGUHJpbnRSYW5nZSkge1xuICAgIGNvbnN0IHBhZ2UgPSBwYWdlSW5kZXggKyAxO1xuICAgIGlmIChwcmludFJhbmdlLmZyb20pIHtcbiAgICAgIGlmIChwYWdlIDwgcHJpbnRSYW5nZS5mcm9tKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByaW50UmFuZ2UudG8pIHtcbiAgICAgIGlmIChwYWdlID4gcHJpbnRSYW5nZS50bykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwcmludFJhbmdlLmV4Y2x1ZGVkKSB7XG4gICAgICBpZiAocHJpbnRSYW5nZS5leGNsdWRlZC5zb21lKChwKSA9PiBwID09PSBwYWdlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwcmludFJhbmdlLmluY2x1ZGVkKSB7XG4gICAgICBpZiAoIXByaW50UmFuZ2UuaW5jbHVkZWQuc29tZSgocCkgPT4gcCA9PT0gcGFnZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRQYWdlQXNMaW5lcyhwYWdlTnVtYmVyOiBudW1iZXIpOiBQcm9taXNlPEFycmF5PExpbmU+PiB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9IChnbG9iYWxUaGlzIGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgaWYgKFBERlZpZXdlckFwcGxpY2F0aW9uKSB7XG4gICAgICBjb25zdCBwZGZEb2N1bWVudCA9IFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZkRvY3VtZW50O1xuXG4gICAgICBjb25zdCBwYWdlID0gYXdhaXQgcGRmRG9jdW1lbnQuZ2V0UGFnZShwYWdlTnVtYmVyKTtcbiAgICAgIGNvbnN0IHRleHRTbmlwcGV0cyA9IChhd2FpdCBwYWdlLmdldFRleHRDb250ZW50KCkpLml0ZW1zIC8vXG4gICAgICAgIC5maWx0ZXIoKGluZm8pID0+ICFpbmZvWyd0eXBlJ10pOyAvLyBpZ25vcmUgdGhlIFRleHRNYXJrZWRDb250ZW50IGl0ZW1zXG5cbiAgICAgIGNvbnN0IHNuaXBwZXRzID0gdGV4dFNuaXBwZXRzIGFzIEFycmF5PFRleHRJdGVtPjtcblxuICAgICAgbGV0IG1pblggPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgIGxldCBtaW5ZID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICBsZXQgbWF4WCA9IE51bWJlci5NSU5fU0FGRV9JTlRFR0VSO1xuICAgICAgbGV0IG1heFkgPSBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUjtcbiAgICAgIGxldCBjb3VudExUUiA9IDA7XG4gICAgICBsZXQgY291bnRSVEwgPSAwO1xuICAgICAgbGV0IHRleHQgPSAnJztcbiAgICAgIGxldCBsaW5lcyA9IG5ldyBBcnJheTxMaW5lPigpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbmlwcGV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyZW50U25pcHBldCA9IHNuaXBwZXRzW2ldO1xuICAgICAgICBpZiAoIWN1cnJlbnRTbmlwcGV0Lmhhc0VPTCkge1xuICAgICAgICAgIGNvbnN0IHggPSBjdXJyZW50U25pcHBldC50cmFuc2Zvcm1bNF07XG4gICAgICAgICAgY29uc3QgeSA9IC1jdXJyZW50U25pcHBldC50cmFuc2Zvcm1bNV07XG4gICAgICAgICAgY29uc3Qgd2lkdGggPSBjdXJyZW50U25pcHBldC53aWR0aDtcbiAgICAgICAgICBjb25zdCBoZWlnaHQgPSBjdXJyZW50U25pcHBldC5oZWlnaHQ7XG4gICAgICAgICAgbWluWCA9IE1hdGgubWluKG1pblgsIHgpO1xuICAgICAgICAgIG1pblkgPSBNYXRoLm1pbihtaW5ZLCB5KTtcbiAgICAgICAgICBtYXhYID0gTWF0aC5tYXgobWF4WCwgeCArIHdpZHRoKTtcbiAgICAgICAgICBtYXhZID0gTWF0aC5tYXgobWF4WSwgeSArIGhlaWdodCk7XG4gICAgICAgICAgdGV4dCArPSBjdXJyZW50U25pcHBldC5zdHI7XG4gICAgICAgICAgaWYgKGN1cnJlbnRTbmlwcGV0LmRpciA9PT0gJ3J0bCcpIHtcbiAgICAgICAgICAgIGNvdW50UlRMKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50U25pcHBldC5kaXIgPT09ICdsdHInKSB7XG4gICAgICAgICAgICBjb3VudExUUisrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBhZGRJdCA9IGkgPT09IHNuaXBwZXRzLmxlbmd0aCAtIDEgfHwgY3VycmVudFNuaXBwZXQuaGFzRU9MO1xuICAgICAgICBpZiAoYWRkSXQpIHtcbiAgICAgICAgICBsZXQgZGlyZWN0aW9uOiBEaXJlY3Rpb25UeXBlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGlmIChjb3VudExUUiA+IDAgJiYgY291bnRSVEwgPiAwKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSAnYm90aCc7XG4gICAgICAgICAgfSBlbHNlIGlmIChjb3VudExUUiA+IDApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9ICdsdHInO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY291bnRSVEwgPiAwKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSAncnRsJztcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbGluZSA9IHtcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHg6IG1pblgsXG4gICAgICAgICAgICB5OiBtaW5ZLFxuICAgICAgICAgICAgd2lkdGg6IG1heFggLSBtaW5YLFxuICAgICAgICAgICAgaGVpZ2h0OiBtYXhZIC0gbWluWSxcbiAgICAgICAgICAgIHRleHQ6IHRleHQudHJpbSgpLFxuICAgICAgICAgIH0gYXMgTGluZTtcbiAgICAgICAgICBsaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICAgIG1pblggPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgICAgICBtaW5ZID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgICAgbWF4WCA9IE51bWJlci5NSU5fU0FGRV9JTlRFR0VSO1xuICAgICAgICAgIG1heFkgPSBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUjtcbiAgICAgICAgICBjb3VudExUUiA9IDA7XG4gICAgICAgICAgY291bnRSVEwgPSAwO1xuICAgICAgICAgIHRleHQgPSAnJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxpbmVzO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0UGFnZUFzVGV4dChwYWdlTnVtYmVyOiBudW1iZXIpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIGlmICghUERGVmlld2VyQXBwbGljYXRpb24pIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgY29uc3QgcGRmRG9jdW1lbnQgPSBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZEb2N1bWVudDtcblxuICAgIGNvbnN0IHBhZ2UgPSBhd2FpdCBwZGZEb2N1bWVudC5nZXRQYWdlKHBhZ2VOdW1iZXIpO1xuICAgIGNvbnN0IHRleHRTbmlwcGV0cyA9IChhd2FpdCBwYWdlLmdldFRleHRDb250ZW50KCkpLml0ZW1zO1xuICAgIHJldHVybiB0aGlzLmNvbnZlcnRUZXh0SW5mb1RvVGV4dCh0ZXh0U25pcHBldHMpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb252ZXJ0VGV4dEluZm9Ub1RleHQodGV4dEluZm9JdGVtczogQXJyYXk8VGV4dEl0ZW0gfCBUZXh0TWFya2VkQ29udGVudD4pOiBzdHJpbmcge1xuICAgIGlmICghdGV4dEluZm9JdGVtcykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gdGV4dEluZm9JdGVtc1xuICAgICAgLmZpbHRlcigoaW5mbykgPT4gIWluZm9bJ3R5cGUnXSlcbiAgICAgIC5tYXAoKGluZm86IFRleHRJdGVtKSA9PiAoaW5mby5oYXNFT0wgPyBpbmZvLnN0ciArICdcXG4nIDogaW5mby5zdHIpKVxuICAgICAgLmpvaW4oJycpO1xuICB9XG5cbiAgcHVibGljIGdldFBhZ2VBc0ltYWdlKHBhZ2VOdW1iZXI6IG51bWJlciwgc2NhbGU6IFBERkV4cG9ydFNjYWxlRmFjdG9yLCBiYWNrZ3JvdW5kPzogc3RyaW5nLCBiYWNrZ3JvdW5kQ29sb3JUb1JlcGxhY2U6IHN0cmluZyA9ICcjRkZGRkZGJyk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9IChnbG9iYWxUaGlzIGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgaWYgKCFQREZWaWV3ZXJBcHBsaWNhdGlvbikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgIH1cbiAgICBjb25zdCBwZGZEb2N1bWVudCA9IFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZkRvY3VtZW50O1xuICAgIGNvbnN0IHBhZ2VQcm9taXNlOiBQcm9taXNlPGFueT4gPSBwZGZEb2N1bWVudC5nZXRQYWdlKHBhZ2VOdW1iZXIpO1xuICAgIGNvbnN0IGltYWdlUHJvbWlzZSA9IChwZGZQYWdlKSA9PiBQcm9taXNlLnJlc29sdmUodGhpcy5kcmF3KHBkZlBhZ2UsIHNjYWxlLCBiYWNrZ3JvdW5kLCBiYWNrZ3JvdW5kQ29sb3JUb1JlcGxhY2UpKTtcblxuICAgIHJldHVybiBwYWdlUHJvbWlzZS50aGVuKGltYWdlUHJvbWlzZSk7XG4gIH1cblxuICBwcml2YXRlIGRyYXcocGRmUGFnZTogYW55LCBzY2FsZTogUERGRXhwb3J0U2NhbGVGYWN0b3IsIGJhY2tncm91bmQ/OiBzdHJpbmcsIGJhY2tncm91bmRDb2xvclRvUmVwbGFjZTogc3RyaW5nID0gJyNGRkZGRkYnKTogUHJvbWlzZTxIVE1MQ2FudmFzRWxlbWVudD4ge1xuICAgIGxldCB6b29tRmFjdG9yID0gMTtcbiAgICBpZiAoc2NhbGUuc2NhbGUpIHtcbiAgICAgIHpvb21GYWN0b3IgPSBzY2FsZS5zY2FsZTtcbiAgICB9IGVsc2UgaWYgKHNjYWxlLndpZHRoKSB7XG4gICAgICB6b29tRmFjdG9yID0gc2NhbGUud2lkdGggLyBwZGZQYWdlLmdldFZpZXdwb3J0KHsgc2NhbGU6IDEgfSkud2lkdGg7XG4gICAgfSBlbHNlIGlmIChzY2FsZS5oZWlnaHQpIHtcbiAgICAgIHpvb21GYWN0b3IgPSBzY2FsZS5oZWlnaHQgLyBwZGZQYWdlLmdldFZpZXdwb3J0KHsgc2NhbGU6IDEgfSkuaGVpZ2h0O1xuICAgIH1cbiAgICBjb25zdCB2aWV3cG9ydCA9IHBkZlBhZ2UuZ2V0Vmlld3BvcnQoe1xuICAgICAgc2NhbGU6IHpvb21GYWN0b3IsXG4gICAgfSk7XG4gICAgY29uc3QgeyBjdHgsIGNhbnZhcyB9ID0gdGhpcy5nZXRQYWdlRHJhd0NvbnRleHQodmlld3BvcnQud2lkdGgsIHZpZXdwb3J0LmhlaWdodCk7XG4gICAgY29uc3QgZHJhd1ZpZXdwb3J0ID0gdmlld3BvcnQuY2xvbmUoKTtcblxuICAgIGNvbnN0IHJlbmRlckNvbnRleHQgPSB7XG4gICAgICBjYW52YXNDb250ZXh0OiBjdHgsXG4gICAgICB2aWV3cG9ydDogZHJhd1ZpZXdwb3J0LFxuICAgICAgYmFja2dyb3VuZCxcbiAgICAgIGJhY2tncm91bmRDb2xvclRvUmVwbGFjZSxcbiAgICB9O1xuICAgIGNvbnN0IHJlbmRlclRhc2sgPSBwZGZQYWdlLnJlbmRlcihyZW5kZXJDb250ZXh0KTtcblxuICAgIGNvbnN0IGRhdGFVcmxQcm9taXNlID0gKCkgPT4gUHJvbWlzZS5yZXNvbHZlKGNhbnZhcy50b0RhdGFVUkwoKSk7XG5cbiAgICByZXR1cm4gcmVuZGVyVGFzay5wcm9taXNlLnRoZW4oZGF0YVVybFByb21pc2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQYWdlRHJhd0NvbnRleHQod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBEcmF3Q29udGV4dCB7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogdHJ1ZSB9KTtcbiAgICBpZiAoIWN0eCkge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBxdW90ZW1hcmtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGNyZWF0ZSB0aGUgMmQgY29udGV4dFwiKTtcbiAgICB9XG5cbiAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY2FudmFzLCAnd2lkdGgnLCBgJHt3aWR0aH1weGApO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY2FudmFzLCAnaGVpZ2h0JywgYCR7aGVpZ2h0fXB4YCk7XG5cbiAgICByZXR1cm4geyBjdHgsIGNhbnZhcyB9O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEN1cnJlbnREb2N1bWVudEFzQmxvYigpOiBQcm9taXNlPEJsb2I+IHtcbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gKGdsb2JhbFRoaXMgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICByZXR1cm4gYXdhaXQgUERGVmlld2VyQXBwbGljYXRpb24/LmV4cG9ydCgpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEZvcm1EYXRhKGN1cnJlbnRGb3JtVmFsdWVzID0gdHJ1ZSk6IFByb21pc2U8QXJyYXk8T2JqZWN0Pj4ge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIGlmICghUERGVmlld2VyQXBwbGljYXRpb24pIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgY29uc3QgcGRmOiBQREZEb2N1bWVudFByb3h5IHwgdW5kZWZpbmVkID0gUERGVmlld2VyQXBwbGljYXRpb24ucGRmRG9jdW1lbnQ7XG4gICAgLy8gc2NyZWVuIERQSSAvIFBERiBEUElcbiAgICBjb25zdCBkcGlSYXRpbyA9IDk2IC8gNzI7XG4gICAgY29uc3QgcmVzdWx0OiBBcnJheTxPYmplY3Q+ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcGRmPy5udW1QYWdlczsgaSsrKSB7XG4gICAgICAvLyB0cmFjayB0aGUgY3VycmVudCBwYWdlXG4gICAgICBjb25zdCBjdXJyZW50UGFnZSAvKiA6IFBERlBhZ2VQcm94eSAqLyA9IGF3YWl0IHBkZi5nZXRQYWdlKGkpO1xuICAgICAgY29uc3QgYW5ub3RhdGlvbnMgPSBhd2FpdCBjdXJyZW50UGFnZS5nZXRBbm5vdGF0aW9ucygpO1xuXG4gICAgICBhbm5vdGF0aW9uc1xuICAgICAgICAuZmlsdGVyKChhKSA9PiBhLnN1YnR5cGUgPT09ICdXaWRnZXQnKSAvLyBnZXQgdGhlIGZvcm0gZmllbGQgYW5ub3RhdGlvbnMgb25seVxuICAgICAgICAubWFwKChhKSA9PiAoeyAuLi5hIH0pKSAvLyBvbmx5IGV4cG9zZSBjb3BpZXMgb2YgdGhlIGFubm90YXRpb25zIHRvIGF2b2lkIHNpZGUtZWZmZWN0c1xuICAgICAgICAuZm9yRWFjaCgoYSkgPT4ge1xuICAgICAgICAgIC8vIGdldCB0aGUgcmVjdGFuZ2xlIHRoYXQgcmVwcmVzZW50IHRoZSBzaW5nbGUgZmllbGRcbiAgICAgICAgICAvLyBhbmQgcmVzaXplIGl0IGFjY29yZGluZyB0byB0aGUgY3VycmVudCBEUElcbiAgICAgICAgICBjb25zdCBmaWVsZFJlY3Q6IEFycmF5PG51bWJlcj4gPSBjdXJyZW50UGFnZS5nZXRWaWV3cG9ydCh7IHNjYWxlOiBkcGlSYXRpbyB9KS5jb252ZXJ0VG9WaWV3cG9ydFJlY3RhbmdsZShhLnJlY3QpO1xuXG4gICAgICAgICAgLy8gYWRkIHRoZSBjb3JyZXNwb25kaW5nIGlucHV0XG4gICAgICAgICAgaWYgKGN1cnJlbnRGb3JtVmFsdWVzICYmIGEuZmllbGROYW1lKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoYS5leHBvcnRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZTogYW55ID0gUERGVmlld2VyQXBwbGljYXRpb24ucGRmRG9jdW1lbnQuYW5ub3RhdGlvblN0b3JhZ2UuZ2V0VmFsdWUoYS5pZCwgYS5maWVsZE5hbWUgKyAnLycgKyBhLmV4cG9ydFZhbHVlLCAnJyk7XG4gICAgICAgICAgICAgICAgYS52YWx1ZSA9IGN1cnJlbnRWYWx1ZT8udmFsdWU7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYS5yYWRpb0J1dHRvbikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZTogYW55ID0gUERGVmlld2VyQXBwbGljYXRpb24ucGRmRG9jdW1lbnQuYW5ub3RhdGlvblN0b3JhZ2UuZ2V0VmFsdWUoYS5pZCwgYS5maWVsZE5hbWUgKyAnLycgKyBhLmZpZWxkVmFsdWUsICcnKTtcbiAgICAgICAgICAgICAgICBhLnZhbHVlID0gY3VycmVudFZhbHVlPy52YWx1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VmFsdWU6IGFueSA9IFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZkRvY3VtZW50LmFubm90YXRpb25TdG9yYWdlLmdldFZhbHVlKGEuaWQsIGEuZmllbGROYW1lLCAnJyk7XG4gICAgICAgICAgICAgICAgYS52YWx1ZSA9IGN1cnJlbnRWYWx1ZT8udmFsdWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAvLyBqdXN0IGlnbm9yZSBpdFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaCh7IGZpZWxkQW5ub3RhdGlvbjogYSwgZmllbGRSZWN0LCBwYWdlTnVtYmVyOiBpIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgcGFnZSB0byB0aGUgcmVuZGVyaW5nIHF1ZXVlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwYWdlSW5kZXggSW5kZXggb2YgdGhlIHBhZ2UgdG8gcmVuZGVyXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBmYWxzZSwgaWYgdGhlIHBhZ2UgaGFzIGFscmVhZHkgYmVlbiByZW5kZXJlZFxuICAgKiBvciBpZiBpdCdzIG91dCBvZiByYW5nZVxuICAgKi9cbiAgcHVibGljIGFkZFBhZ2VUb1JlbmRlclF1ZXVlKHBhZ2VJbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9IChnbG9iYWxUaGlzIGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgcmV0dXJuIFBERlZpZXdlckFwcGxpY2F0aW9uPy5wZGZWaWV3ZXIuYWRkUGFnZVRvUmVuZGVyUXVldWUocGFnZUluZGV4KTtcbiAgfVxuXG4gIHB1YmxpYyBpc1JlbmRlclF1ZXVlRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgc2Nyb2xsZWREb3duID0gdHJ1ZTtcbiAgICBjb25zdCByZW5kZXJFeHRyYSA9IGZhbHNlO1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIGNvbnN0IG5leHRQYWdlID0gUERGVmlld2VyQXBwbGljYXRpb24/LnBkZlZpZXdlci5yZW5kZXJpbmdRdWV1ZS5nZXRIaWdoZXN0UHJpb3JpdHkoXG4gICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIuX2dldFZpc2libGVQYWdlcygpLFxuICAgICAgUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLl9wYWdlcyxcbiAgICAgIHNjcm9sbGVkRG93bixcbiAgICAgIHJlbmRlckV4dHJhXG4gICAgKTtcbiAgICByZXR1cm4gIW5leHRQYWdlO1xuICB9XG5cbiAgcHVibGljIGhhc1BhZ2VCZWVuUmVuZGVyZWQocGFnZUluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gKGdsb2JhbFRoaXMgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBpZiAoIVBERlZpZXdlckFwcGxpY2F0aW9uKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHBhZ2VzID0gUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLl9wYWdlcztcbiAgICBpZiAocGFnZXMubGVuZ3RoID4gcGFnZUluZGV4ICYmIHBhZ2VJbmRleCA+PSAwKSB7XG4gICAgICBjb25zdCBwYWdlVmlldyA9IHBhZ2VzW3BhZ2VJbmRleF07XG4gICAgICBjb25zdCBoYXNCZWVuUmVuZGVyZWQgPSBwYWdlVmlldy5yZW5kZXJpbmdTdGF0ZSA9PT0gMztcbiAgICAgIHJldHVybiBoYXNCZWVuUmVuZGVyZWQ7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgc2xlZXAobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHJlbmRlclBhZ2UocGFnZUluZGV4OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuaGFzUGFnZUJlZW5SZW5kZXJlZChwYWdlSW5kZXgpKSB7XG4gICAgICBhd2FpdCB0aGlzLmFkZFBhZ2VUb1JlbmRlclF1ZXVlKHBhZ2VJbmRleCk7XG4gICAgICB3aGlsZSAoIXRoaXMuaGFzUGFnZUJlZW5SZW5kZXJlZChwYWdlSW5kZXgpKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2xlZXAoNyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGN1cnJlbnRseVJlbmRlcmVkUGFnZXMoKTogQXJyYXk8bnVtYmVyPiB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9IChnbG9iYWxUaGlzIGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgaWYgKCFQREZWaWV3ZXJBcHBsaWNhdGlvbikge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBjb25zdCBwYWdlcyA9IFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5fcGFnZXM7XG4gICAgcmV0dXJuIHBhZ2VzLmZpbHRlcigocGFnZSkgPT4gcGFnZS5yZW5kZXJpbmdTdGF0ZSA9PT0gMykubWFwKChwYWdlKSA9PiBwYWdlLmlkKTtcbiAgfVxuXG4gIHB1YmxpYyBudW1iZXJPZlBhZ2VzKCk6IG51bWJlciB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9IChnbG9iYWxUaGlzIGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgaWYgKCFQREZWaWV3ZXJBcHBsaWNhdGlvbikge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGNvbnN0IHBhZ2VzID0gUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLl9wYWdlcztcbiAgICByZXR1cm4gcGFnZXMubGVuZ3RoO1xuICB9XG5cbiAgcHVibGljIGdldEN1cnJlbnRseVZpc2libGVQYWdlTnVtYmVycygpOiBBcnJheTxudW1iZXI+IHtcbiAgICBjb25zdCBhcHAgPSAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uIGFzIElQREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBpZiAoIWFwcCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBjb25zdCBwYWdlcyA9IChhcHAucGRmVmlld2VyLl9nZXRWaXNpYmxlUGFnZXMoKSBhcyBhbnkpLnZpZXdzIGFzIEFycmF5PGFueT47XG4gICAgcmV0dXJuIHBhZ2VzPy5tYXAoKHBhZ2UpID0+IHBhZ2UuaWQpO1xuICB9XG5cbiAgcHVibGljIHJlY2FsY3VsYXRlU2l6ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnJlY2FsY3VsYXRlU2l6ZSQubmV4dCgpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGxpc3RMYXllcnMoKTogUHJvbWlzZTxBcnJheTxQZGZMYXllcj4gfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gKGdsb2JhbFRoaXMgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBpZiAoIVBERlZpZXdlckFwcGxpY2F0aW9uKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9uYWxDb250ZW50Q29uZmlnID0gYXdhaXQgUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLm9wdGlvbmFsQ29udGVudENvbmZpZ1Byb21pc2U7XG4gICAgaWYgKG9wdGlvbmFsQ29udGVudENvbmZpZykge1xuICAgICAgY29uc3QgbGV2ZWxEYXRhID0gb3B0aW9uYWxDb250ZW50Q29uZmlnLmdldE9yZGVyKCk7XG4gICAgICBjb25zdCBsYXllcklkcyA9IGxldmVsRGF0YS5maWx0ZXIoKGdyb3VwSWQpID0+IHR5cGVvZiBncm91cElkICE9PSAnb2JqZWN0Jyk7XG4gICAgICByZXR1cm4gbGF5ZXJJZHMubWFwKChsYXllcklkKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG9wdGlvbmFsQ29udGVudENvbmZpZy5nZXRHcm91cChsYXllcklkKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsYXllcklkOiBsYXllcklkLFxuICAgICAgICAgIG5hbWU6IGNvbmZpZy5uYW1lLFxuICAgICAgICAgIHZpc2libGU6IGNvbmZpZy52aXNpYmxlLFxuICAgICAgICB9IGFzIFBkZkxheWVyO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgdG9nZ2xlTGF5ZXIobGF5ZXJJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9IChnbG9iYWxUaGlzIGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgaWYgKCFQREZWaWV3ZXJBcHBsaWNhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBvcHRpb25hbENvbnRlbnRDb25maWcgPSBhd2FpdCBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIub3B0aW9uYWxDb250ZW50Q29uZmlnUHJvbWlzZTtcbiAgICBpZiAob3B0aW9uYWxDb250ZW50Q29uZmlnKSB7XG4gICAgICBsZXQgaXNWaXNpYmxlID0gb3B0aW9uYWxDb250ZW50Q29uZmlnLmdldEdyb3VwKGxheWVySWQpLnZpc2libGU7XG4gICAgICBjb25zdCBjaGVja2JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGlucHV0W2lkPScke2xheWVySWR9J11gKTtcbiAgICAgIGlmIChjaGVja2JveCkge1xuICAgICAgICBpc1Zpc2libGUgPSAoY2hlY2tib3ggYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZDtcbiAgICAgICAgKGNoZWNrYm94IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQgPSAhaXNWaXNpYmxlO1xuICAgICAgfVxuICAgICAgb3B0aW9uYWxDb250ZW50Q29uZmlnLnNldFZpc2liaWxpdHkobGF5ZXJJZCwgIWlzVmlzaWJsZSk7XG4gICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5kaXNwYXRjaCgnb3B0aW9uYWxjb250ZW50Y29uZmlnJywge1xuICAgICAgICBzb3VyY2U6IHRoaXMsXG4gICAgICAgIHByb21pc2U6IFByb21pc2UucmVzb2x2ZShvcHRpb25hbENvbnRlbnRDb25maWcpLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNjcm9sbFBhZ2VJbnRvVmlldyhwYWdlTnVtYmVyOiBudW1iZXIsIHBhZ2VTcG90PzogeyB0b3A/OiBudW1iZXIgfCBzdHJpbmc7IGxlZnQ/OiBudW1iZXIgfCBzdHJpbmcgfSk6IHZvaWQge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIGNvbnN0IHZpZXdlciA9IFBERlZpZXdlckFwcGxpY2F0aW9uPy5wZGZWaWV3ZXIgYXMgYW55O1xuICAgIHZpZXdlcj8uc2Nyb2xsUGFnZVBvc0ludG9WaWV3KHBhZ2VOdW1iZXIsIHBhZ2VTcG90KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTZXJpYWxpemVkQW5ub3RhdGlvbnMoKTogRWRpdG9yQW5ub3RhdGlvbltdIHwgbnVsbCB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9IChnbG9iYWxUaGlzIGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgcmV0dXJuIFBERlZpZXdlckFwcGxpY2F0aW9uPy5wZGZWaWV3ZXIuZ2V0U2VyaWFsaXplZEFubm90YXRpb25zKCk7XG4gIH1cblxuICBwdWJsaWMgYWRkRWRpdG9yQW5ub3RhdGlvbihzZXJpYWxpemVkQW5ub3RhdGlvbjogc3RyaW5nIHwgRWRpdG9yQW5ub3RhdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uPy5wZGZWaWV3ZXIuYWRkRWRpdG9yQW5ub3RhdGlvbihzZXJpYWxpemVkQW5ub3RhdGlvbik7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlRWRpdG9yQW5ub3RhdGlvbnMoZmlsdGVyPzogKHNlcmlhbGl6ZWQ6IG9iamVjdCkgPT4gYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uPy5wZGZWaWV3ZXIucmVtb3ZlRWRpdG9yQW5ub3RhdGlvbnMoZmlsdGVyKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbG9hZEltYWdlQXNEYXRhVVJMKGltYWdlVXJsOiBzdHJpbmcpOiBQcm9taXNlPEJsb2IgfCBzdHJpbmc+IHtcbiAgICBpZiAoaW1hZ2VVcmwuc3RhcnRzV2l0aCgnZGF0YTonKSkge1xuICAgICAgcmV0dXJuIGltYWdlVXJsO1xuICAgIH1cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGltYWdlVXJsKTtcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBmZXRjaCB0aGUgaW1hZ2UgZnJvbSAke2ltYWdlVXJsfTogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgIH1cblxuICAgIGNvbnN0IGltYWdlQmxvYiA9IGF3YWl0IHJlc3BvbnNlLmJsb2IoKTtcbiAgICByZXR1cm4gaW1hZ2VCbG9iO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGFkZEltYWdlVG9Bbm5vdGF0aW9uTGF5ZXIoeyB1cmxPckRhdGFVcmwsIHBhZ2UsIGxlZnQsIGJvdHRvbSwgcmlnaHQsIHRvcCwgcm90YXRpb24gfTogUGRmSW1hZ2VQYXJhbWV0ZXJzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9IChnbG9iYWxUaGlzIGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgaWYgKFBERlZpZXdlckFwcGxpY2F0aW9uKSB7XG4gICAgICBpZiAocGFnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChwYWdlICE9PSB0aGlzLmN1cnJlbnRQYWdlSW5kZXgoKSkge1xuICAgICAgICAgIGF3YWl0IHRoaXMucmVuZGVyUGFnZShwYWdlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFnZSA9IHRoaXMuY3VycmVudFBhZ2VJbmRleCgpO1xuICAgICAgfVxuICAgICAgY29uc3QgcHJldmlvdXNBbm5vdGF0aW9uRWRpdG9yTW9kZSA9IFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5hbm5vdGF0aW9uRWRpdG9yTW9kZTtcbiAgICAgIHRoaXMuc3dpdGNoQW5ub3RhdGlvbkVkdG9yTW9kZSgxMyk7XG4gICAgICBjb25zdCBkYXRhVXJsID0gYXdhaXQgdGhpcy5sb2FkSW1hZ2VBc0RhdGFVUkwodXJsT3JEYXRhVXJsKTtcbiAgICAgIGNvbnN0IHBhZ2VTaXplID0gUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLl9wYWdlc1twYWdlXS5wZGZQYWdlLnZpZXc7XG4gICAgICBjb25zdCBsZWZ0RGltID0gcGFnZVNpemVbMF07XG4gICAgICBjb25zdCBib3R0b21EaW0gPSBwYWdlU2l6ZVsxXTtcbiAgICAgIGNvbnN0IHJpZ2h0RGltID0gcGFnZVNpemVbMl07XG4gICAgICBjb25zdCB0b3BEaW0gPSBwYWdlU2l6ZVszXTtcbiAgICAgIGNvbnN0IHdpZHRoID0gcmlnaHREaW0gLSBsZWZ0RGltO1xuICAgICAgY29uc3QgaGVpZ2h0ID0gdG9wRGltIC0gYm90dG9tRGltO1xuICAgICAgY29uc3QgaW1hZ2VXaWR0aCA9IFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5fcGFnZXNbcGFnZV0uZGl2LmNsaWVudFdpZHRoO1xuICAgICAgY29uc3QgaW1hZ2VIZWlnaHQgPSBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIuX3BhZ2VzW3BhZ2VdLmRpdi5jbGllbnRIZWlnaHQ7XG5cbiAgICAgIGNvbnN0IGxlZnRQZGYgPSB0aGlzLmNvbnZlcnRUb1BERkNvb3JkaW5hdGVzKGxlZnQsIHdpZHRoLCAwLCBpbWFnZVdpZHRoKTtcbiAgICAgIGNvbnN0IGJvdHRvbVBkZiA9IHRoaXMuY29udmVydFRvUERGQ29vcmRpbmF0ZXMoYm90dG9tLCBoZWlnaHQsIDAsIGltYWdlSGVpZ2h0KTtcbiAgICAgIGNvbnN0IHJpZ2h0UGRmID0gdGhpcy5jb252ZXJ0VG9QREZDb29yZGluYXRlcyhyaWdodCwgd2lkdGgsIHdpZHRoLCBpbWFnZVdpZHRoKTtcbiAgICAgIGNvbnN0IHRvcFBkZiA9IHRoaXMuY29udmVydFRvUERGQ29vcmRpbmF0ZXModG9wLCBoZWlnaHQsIGhlaWdodCwgaW1hZ2VIZWlnaHQpO1xuXG4gICAgICBjb25zdCBzdGFtcEFubm90YXRpb246IFN0YW1wRWRpdG9yQW5ub3RhdGlvbiA9IHtcbiAgICAgICAgYW5ub3RhdGlvblR5cGU6IDEzLFxuICAgICAgICBwYWdlSW5kZXg6IHBhZ2UsXG4gICAgICAgIGJpdG1hcFVybDogZGF0YVVybCxcbiAgICAgICAgcmVjdDogW2xlZnRQZGYsIGJvdHRvbVBkZiwgcmlnaHRQZGYsIHRvcFBkZl0sXG4gICAgICAgIHJvdGF0aW9uOiByb3RhdGlvbiA/PyAwLFxuICAgICAgfTtcbiAgICAgIHRoaXMuYWRkRWRpdG9yQW5ub3RhdGlvbihzdGFtcEFubm90YXRpb24pO1xuICAgICAgYXdhaXQgdGhpcy5zbGVlcCgxMCk7XG4gICAgICB0aGlzLnN3aXRjaEFubm90YXRpb25FZHRvck1vZGUocHJldmlvdXNBbm5vdGF0aW9uRWRpdG9yTW9kZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGN1cnJlbnRQYWdlSW5kZXgoKTogbnVtYmVyIHtcbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gKGdsb2JhbFRoaXMgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICByZXR1cm4gUERGVmlld2VyQXBwbGljYXRpb24/LnBkZlZpZXdlci5jdXJyZW50UGFnZU51bWJlciAtIDE7XG4gIH1cblxuICBwcml2YXRlIGNvbnZlcnRUb1BERkNvb3JkaW5hdGVzKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQsIG1heFZhbHVlOiBudW1iZXIsIGRlZmF1bHRWYWx1ZTogbnVtYmVyLCBpbWFnZU1heFZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAodmFsdWUuZW5kc1dpdGgoJyUnKSkge1xuICAgICAgICByZXR1cm4gKHBhcnNlSW50KHZhbHVlLCAxMCkgLyAxMDApICogbWF4VmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlLmVuZHNXaXRoKCdweCcpKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSwgMTApICogKG1heFZhbHVlIC8gaW1hZ2VNYXhWYWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzd2l0Y2hBbm5vdGF0aW9uRWR0b3JNb2RlKG1vZGU6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uPy5ldmVudEJ1cy5kaXNwYXRjaCgnc3dpdGNoYW5ub3RhdGlvbmVkaXRvcm1vZGUnLCB7IG1vZGUgfSk7XG4gIH1cblxuICBwdWJsaWMgc2V0IGVkaXRvckZvbnRTaXplKHNpemU6IG51bWJlcikge1xuICAgIHRoaXMuc2V0RWRpdG9yUHJvcGVydHkoQW5ub3RhdGlvbkVkaXRvclBhcmFtc1R5cGUuRlJFRVRFWFRfU0laRSwgc2l6ZSk7XG4gIH1cblxuICBwdWJsaWMgc2V0IGVkaXRvckZvbnRDb2xvcihjb2xvcjogc3RyaW5nKSB7XG4gICAgdGhpcy5zZXRFZGl0b3JQcm9wZXJ0eShBbm5vdGF0aW9uRWRpdG9yUGFyYW1zVHlwZS5GUkVFVEVYVF9DT0xPUiwgY29sb3IpO1xuICB9XG5cbiAgcHVibGljIHNldCBlZGl0b3JJbmtDb2xvcihjb2xvcjogc3RyaW5nKSB7XG4gICAgdGhpcy5zZXRFZGl0b3JQcm9wZXJ0eShBbm5vdGF0aW9uRWRpdG9yUGFyYW1zVHlwZS5JTktfQ09MT1IsIGNvbG9yKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgZWRpdG9ySW5rT3BhY2l0eShvcGFjaXR5OiBudW1iZXIpIHtcbiAgICB0aGlzLnNldEVkaXRvclByb3BlcnR5KEFubm90YXRpb25FZGl0b3JQYXJhbXNUeXBlLklOS19PUEFDSVRZLCBvcGFjaXR5KTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgZWRpdG9ySW5rVGhpY2tuZXNzKHRoaWNrbmVzczogbnVtYmVyKSB7XG4gICAgdGhpcy5zZXRFZGl0b3JQcm9wZXJ0eShBbm5vdGF0aW9uRWRpdG9yUGFyYW1zVHlwZS5JTktfVEhJQ0tORVNTLCB0aGlja25lc3MpO1xuICB9XG5cbiAgcHVibGljIHNldCBlZGl0b3JIaWdobGlnaHRDb2xvcihjb2xvcjogc3RyaW5nKSB7XG4gICAgdGhpcy5zZXRFZGl0b3JQcm9wZXJ0eShBbm5vdGF0aW9uRWRpdG9yUGFyYW1zVHlwZS5ISUdITElHSFRfQ09MT1IsIGNvbG9yKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgZWRpdG9ySGlnaGxpZ2h0RGVmYXVsdENvbG9yKGNvbG9yOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNldEVkaXRvclByb3BlcnR5KEFubm90YXRpb25FZGl0b3JQYXJhbXNUeXBlLkhJR0hMSUdIVF9ERUZBVUxUX0NPTE9SLCBjb2xvcik7XG4gIH1cblxuICBwdWJsaWMgc2V0IGVkaXRvckhpZ2hsaWdodFNob3dBbGwoc2hvd0FsbDogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0RWRpdG9yUHJvcGVydHkoQW5ub3RhdGlvbkVkaXRvclBhcmFtc1R5cGUuSElHSExJR0hUX1NIT1dfQUxMLCBzaG93QWxsKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgZWRpdG9ySGlnaGxpZ2h0VGhpY2tuZXNzKHRoaWNrbmVzczogbnVtYmVyKSB7XG4gICAgdGhpcy5zZXRFZGl0b3JQcm9wZXJ0eShBbm5vdGF0aW9uRWRpdG9yUGFyYW1zVHlwZS5ISUdITElHSFRfVEhJQ0tORVNTLCB0aGlja25lc3MpO1xuICB9XG5cbiAgcHVibGljIHNldEVkaXRvclByb3BlcnR5KGVkaXRvclByb3BlcnR5VHlwZTogbnVtYmVyLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9IChnbG9iYWxUaGlzIGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgUERGVmlld2VyQXBwbGljYXRpb24/LmV2ZW50QnVzLmRpc3BhdGNoKCdzd2l0Y2hhbm5vdGF0aW9uZWRpdG9ycGFyYW1zJywgeyB0eXBlOiBlZGl0b3JQcm9wZXJ0eVR5cGUsIHZhbHVlIH0pO1xuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uPy5ldmVudEJ1cy5kaXNwYXRjaCgnYW5ub3RhdGlvbmVkaXRvcnBhcmFtc2NoYW5nZWQnLCB7IGRldGFpbHM6IFtbZWRpdG9yUHJvcGVydHlUeXBlLCB2YWx1ZV1dIH0pO1xuICB9XG59XG4iXX0=