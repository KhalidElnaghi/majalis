import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Inject, Input, Output, PLATFORM_ID, ViewChild, } from '@angular/core';
import { PdfCursorTools } from './options/pdf-cursor-tools';
import { assetsUrl, getVersionSuffix, pdfDefaultOptions } from './options/pdf-default-options';
import { ScrollModeType } from './options/pdf-viewer';
import { VerbosityLevel } from './options/verbosity-level';
import { PdfDummyComponentsComponent } from './pdf-dummy-components/pdf-dummy-components.component';
import { UnitToPx } from './unit-to-px';
import { NgxFormSupport } from './ngx-form-support';
import { NgxConsole } from './options/ngx-console';
import { PdfSidebarView } from './options/pdf-sidebar-views';
import * as i0 from "@angular/core";
import * as i1 from "./pdf-notification-service";
import * as i2 from "@angular/common";
import * as i3 from "./ngx-extended-pdf-viewer.service";
import * as i4 from "./pdf-csp-policy.service";
import * as i5 from "./dynamic-css/dynamic-css.component";
import * as i6 from "./theme/acroform-default-theme/pdf-acroform-default-theme.component";
import * as i7 from "./toolbar/pdf-context-menu/pdf-context-menu.component";
import * as i8 from "./theme/pdf-dark-theme/pdf-dark-theme.component";
import * as i9 from "./pdf-dialog/pdf-alt-text-dialog/pdf-alt-text-dialog.component";
import * as i10 from "./pdf-dialog/pdf-document-properties-dialog/pdf-document-properties-dialog.component";
import * as i11 from "./pdf-dummy-components/pdf-dummy-components.component";
import * as i12 from "./pdf-dialog/pdf-error-message/pdf-error-message.component";
import * as i13 from "./toolbar/pdf-findbar/pdf-findbar.component";
import * as i14 from "./theme/pdf-light-theme/pdf-light-theme.component";
import * as i15 from "./pdf-dialog/pdf-password-dialog/pdf-password-dialog.component";
import * as i16 from "./pdf-dialog/pdf-prepare-printing-dialog/pdf-prepare-printing-dialog.component";
import * as i17 from "./secondary-toolbar/pdf-secondary-toolbar/pdf-secondary-toolbar.component";
import * as i18 from "./sidebar/pdf-sidebar/pdf-sidebar.component";
import * as i19 from "./toolbar/pdf-toolbar/pdf-toolbar.component";
import * as i20 from "./translate.pipe";
function isIOS() {
    if (typeof window === 'undefined') {
        // server-side rendering
        return false;
    }
    return (['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document));
}
export class NgxExtendedPdfViewerComponent {
    ngZone;
    platformId;
    notificationService;
    elementRef;
    platformLocation;
    cdr;
    service;
    renderer;
    pdfCspPolicyService;
    static originalPrint = typeof window !== 'undefined' ? window.print : undefined;
    PDFViewerApplication;
    PDFViewerApplicationOptions;
    PDFViewerApplicationConstants;
    webViewerLoad;
    ngxExtendedPdfViewerIncompletelyInitialized = true;
    formSupport = new NgxFormSupport();
    /**
     * The dummy components are inserted automatically when the user customizes the toolbar
     * without adding every original toolbar item. Without the dummy components, the
     * initialization code of pdf.js crashes because it assume that every standard widget is there.
     */
    dummyComponents;
    root;
    annotationEditorEvent = new EventEmitter();
    /* UI templates */
    customFindbarInputArea;
    customToolbar;
    customFindbar;
    customFindbarButtons;
    customPdfViewer;
    customSecondaryToolbar;
    customSidebar;
    customThumbnail;
    customFreeFloatingBar;
    showFreeFloatingBar = true;
    enableDragAndDrop = true;
    localizationInitialized = false;
    windowSizeRecalculatorSubscription;
    set formData(formData) {
        this.formSupport.formData = formData;
    }
    disableForms = false;
    get formDataChange() {
        return this.formSupport.formDataChange;
    }
    _pageViewMode = 'multiple';
    baseHref;
    /** This flag prevents trying to load a file twice if the user uploads it using the file upload dialog or via drag'n'drop */
    srcChangeTriggeredByUser = false;
    get pageViewMode() {
        return this._pageViewMode;
    }
    set pageViewMode(viewMode) {
        if (isPlatformBrowser(this.platformId)) {
            const hasChanged = this._pageViewMode !== viewMode;
            if (hasChanged) {
                const mustRedraw = !this.ngxExtendedPdfViewerIncompletelyInitialized && (this._pageViewMode === 'book' || viewMode === 'book');
                this._pageViewMode = viewMode;
                this.pageViewModeChange.emit(this._pageViewMode);
                const PDFViewerApplicationOptions = this.PDFViewerApplicationOptions;
                PDFViewerApplicationOptions?.set('pageViewMode', this.pageViewMode);
                const PDFViewerApplication = this.PDFViewerApplication;
                if (PDFViewerApplication) {
                    PDFViewerApplication.pdfViewer.pageViewMode = this._pageViewMode;
                    PDFViewerApplication.findController.pageViewMode = this._pageViewMode;
                }
                if (viewMode === 'infinite-scroll') {
                    if (this.scrollMode === ScrollModeType.page || this.scrollMode === ScrollModeType.horizontal) {
                        this.scrollMode = ScrollModeType.vertical;
                        PDFViewerApplication.eventBus.dispatch('switchscrollmode', { mode: Number(this.scrollMode) });
                    }
                    this.removeScrollbarInInfiniteScrollMode(false);
                }
                else if (viewMode !== 'multiple') {
                    this.scrollMode = ScrollModeType.vertical;
                }
                else {
                    if (this.scrollMode === ScrollModeType.page) {
                        this.scrollMode = ScrollModeType.vertical;
                    }
                    this.removeScrollbarInInfiniteScrollMode(true);
                }
                if (viewMode === 'single') {
                    // since pdf.js, our custom single-page-mode has been replaced by the standard scrollMode="page"
                    this.scrollMode = ScrollModeType.page;
                    this._pageViewMode = viewMode;
                }
                if (viewMode === 'book') {
                    this.showBorders = false;
                    if (this.scrollMode !== ScrollModeType.vertical) {
                        this.scrollMode = ScrollModeType.vertical;
                    }
                }
                if (mustRedraw) {
                    if (viewMode !== 'book') {
                        const ngx = this.elementRef.nativeElement;
                        const viewerContainer = ngx.querySelector('#viewerContainer');
                        viewerContainer.style.width = '';
                        viewerContainer.style.overflow = '';
                        viewerContainer.style.marginRight = '';
                        viewerContainer.style.marginLeft = '';
                        const viewer = ngx.querySelector('#viewer');
                        viewer.style.maxWidth = '';
                        viewer.style.minWidth = '';
                    }
                    this.openPDF2();
                }
            }
        }
    }
    pageViewModeChange = new EventEmitter();
    progress = new EventEmitter();
    secondaryToolbarComponent;
    sidebarComponent;
    /* regular attributes */
    _src;
    srcChange = new EventEmitter();
    _scrollMode = ScrollModeType.vertical;
    get scrollMode() {
        return this._scrollMode;
    }
    set scrollMode(value) {
        if (this._scrollMode !== value) {
            const PDFViewerApplication = this.PDFViewerApplication;
            if (PDFViewerApplication?.pdfViewer) {
                if (PDFViewerApplication.pdfViewer.scrollMode !== Number(this.scrollMode)) {
                    PDFViewerApplication.eventBus.dispatch('switchscrollmode', { mode: Number(this.scrollMode) });
                }
            }
            this._scrollMode = value;
            if (this._scrollMode === ScrollModeType.page) {
                if (this.pageViewMode !== 'single') {
                    this._pageViewMode = 'single';
                    this.pageViewModeChange.emit(this.pageViewMode);
                }
            }
            else if (this.pageViewMode === 'single' || this._scrollMode === ScrollModeType.horizontal) {
                this._pageViewMode = 'multiple';
                this.pageViewModeChange.emit(this.pageViewMode);
            }
        }
    }
    scrollModeChange = new EventEmitter();
    authorization = undefined;
    httpHeaders = undefined;
    contextMenuAllowed = true;
    afterPrint = new EventEmitter();
    beforePrint = new EventEmitter();
    currentZoomFactor = new EventEmitter();
    /** This field stores the previous zoom level if the page is enlarged with a double-tap or double-click */
    previousZoom;
    enablePrint = true;
    showTextEditor = true;
    showStampEditor = true;
    showDrawEditor = true;
    showHighlightEditor = true;
    /** store the timeout id so it can be canceled if user leaves the page before the PDF is shown */
    initTimeout;
    /** How many log messages should be printed?
     * Legal values: VerbosityLevel.INFOS (= 5), VerbosityLevel.WARNINGS (= 1), VerbosityLevel.ERRORS (= 0) */
    logLevel = VerbosityLevel.WARNINGS;
    relativeCoordsOptions = {};
    /** Use the minified (minifiedJSLibraries="true", which is the default) or the user-readable pdf.js library (minifiedJSLibraries="false") */
    _minifiedJSLibraries = true;
    get minifiedJSLibraries() {
        return this._minifiedJSLibraries;
    }
    set minifiedJSLibraries(value) {
        this._minifiedJSLibraries = value;
        if (value) {
            pdfDefaultOptions._internalFilenameSuffix = '.min';
        }
        else {
            pdfDefaultOptions._internalFilenameSuffix = '';
        }
    }
    primaryMenuVisible = true;
    /** option to increase (or reduce) print resolution. Default is 150 (dpi). Sensible values
     * are 300, 600, and 1200. Note the increase memory consumption, which may even result in a browser crash. */
    printResolution = null;
    rotation;
    rotationChange = new EventEmitter();
    annotationLayerRendered = new EventEmitter();
    annotationEditorLayerRendered = new EventEmitter();
    xfaLayerRendered = new EventEmitter();
    outlineLoaded = new EventEmitter();
    attachmentsloaded = new EventEmitter();
    layersloaded = new EventEmitter();
    hasSignature;
    set src(url) {
        if (url instanceof Uint8Array) {
            this._src = url.buffer;
        }
        else if (url instanceof URL) {
            this._src = url.toString();
        }
        else if (typeof Blob !== 'undefined' && url instanceof Blob) {
            // additional check introduced to support server side rendering
            const reader = new FileReader();
            reader.onloadend = () => {
                setTimeout(() => {
                    this.src = new Uint8Array(reader.result);
                    if (this.service.ngxExtendedPdfViewerInitialized) {
                        if (this.ngxExtendedPdfViewerIncompletelyInitialized) {
                            this.openPDF();
                        }
                        else {
                            (async () => this.openPDF2())();
                        }
                        // else openPDF is called later, so we do nothing to prevent loading the PDF file twice
                    }
                });
            };
            reader.readAsArrayBuffer(url);
        }
        else if (typeof url === 'string') {
            this._src = url;
            if (url.length > 980) {
                // minimal length of a base64 encoded PDF
                if (url.length % 4 === 0) {
                    if (/^[a-zA-Z\d/+]+={0,2}$/.test(url)) {
                        console.error('The URL looks like a base64 encoded string. If so, please use the attribute [base64Src] instead of [src]');
                    }
                }
            }
        }
        else {
            this._src = url;
        }
    }
    set base64Src(base64) {
        if (base64) {
            if (typeof window === 'undefined') {
                // server-side rendering
                return;
            }
            const binary_string = atob(base64);
            const len = binary_string.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            this.src = bytes.buffer;
        }
        else {
            this._src = undefined;
        }
    }
    /**
     * The combination of height, minHeight, and autoHeight ensures the PDF height of the PDF viewer is calculated correctly when the height is a percentage.
     * By default, many CSS frameworks make a div with 100% have a height or zero pixels. checkHeigth() fixes this.
     */
    autoHeight = false;
    minHeight = undefined;
    _height = '100%';
    set height(h) {
        this.minHeight = undefined;
        this.autoHeight = false;
        if (h) {
            if (h === 'auto') {
                this.autoHeight = true;
                this._height = undefined;
            }
            else {
                this._height = h;
            }
        }
        else {
            this.height = '100%';
        }
        setTimeout(() => {
            this.checkHeight();
        });
    }
    get height() {
        return this._height;
    }
    forceUsingLegacyES5 = false;
    backgroundColor = '#e8e8eb';
    /** Allows the user to define the name of the file after clicking "download" */
    filenameForDownload = undefined;
    /** Allows the user to disable the keyboard bindings completely */
    ignoreKeyboard = false;
    /** Allows the user to disable a list of key bindings. */
    ignoreKeys = [];
    /** Allows the user to enable a list of key bindings explicitly. If this property is set, every other key binding is ignored. */
    acceptKeys = [];
    /** Allows the user to put the viewer's svg images into an arbitrary folder */
    imageResourcesPath = assetsUrl(pdfDefaultOptions.assetsFolder) + '/images/';
    /** Allows the user to put their locale folder into an arbitrary folder */
    localeFolderPath = assetsUrl(pdfDefaultOptions.assetsFolder) + '/locale';
    /** Override the default locale. This must be the complete locale name, such as "es-ES". The string is allowed to be all lowercase.
     */
    language = undefined;
    /** By default, listening to the URL is deactivated because often the anchor tag is used for the Angular router */
    listenToURL = false;
    /** Navigate to a certain "named destination" */
    nameddest = undefined;
    /** allows you to pass a password to read password-protected files */
    password = undefined;
    replaceBrowserPrint = true;
    _showSidebarButton = true;
    viewerPositionTop = '32px';
    /** pdf.js can show signatures, but fails to verify them. So they are switched off by default.
     * Set "[showUnverifiedSignatures]"="true" to display e-signatures nonetheless.
     */
    showUnverifiedSignatures = false;
    startTabindex;
    get showSidebarButton() {
        return this._showSidebarButton;
    }
    set showSidebarButton(show) {
        if (typeof window === 'undefined') {
            // server-side rendering
            this._showSidebarButton = false;
            return;
        }
        this._showSidebarButton = show;
        if (this._showSidebarButton) {
            const isIE = /msie\s|trident\//i.test(window.navigator.userAgent);
            let factor = 1;
            if (isIE) {
                factor = Number((this._mobileFriendlyZoom || '100').replace('%', '')) / 100;
            }
            this.findbarLeft = (68 * factor).toString() + 'px';
            return;
        }
        this.findbarLeft = '0px';
    }
    _sidebarVisible = undefined;
    get sidebarVisible() {
        return this._sidebarVisible;
    }
    set sidebarVisible(value) {
        if (value !== this._sidebarVisible) {
            this.sidebarVisibleChange.emit(value);
        }
        this._sidebarVisible = value;
        const PDFViewerApplication = this.PDFViewerApplication;
        if (PDFViewerApplication?.pdfSidebar) {
            if (this.sidebarVisible) {
                PDFViewerApplication.pdfSidebar.open();
                const view = Number(this.activeSidebarView);
                if (view === 1 || view === 2 || view === 3 || view === 4) {
                    PDFViewerApplication.pdfSidebar.switchView(view, true);
                }
                else {
                    console.error('[activeSidebarView] must be an integer value between 1 and 4');
                }
            }
            else {
                PDFViewerApplication.pdfSidebar.close();
            }
        }
    }
    sidebarVisibleChange = new EventEmitter();
    activeSidebarView = PdfSidebarView.OUTLINE;
    activeSidebarViewChange = new EventEmitter();
    findbarVisible = false;
    findbarVisibleChange = new EventEmitter();
    propertiesDialogVisible = false;
    propertiesDialogVisibleChange = new EventEmitter();
    showFindButton = undefined;
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
    showPagingButtons = true;
    showZoomButtons = true;
    showPresentationModeButton = false;
    showOpenFileButton = true;
    showPrintButton = true;
    showDownloadButton = true;
    theme = 'light';
    showToolbar = true;
    showSecondaryToolbarButton = true;
    showSinglePageModeButton = true;
    showVerticalScrollButton = true;
    showHorizontalScrollButton = true;
    showWrappedScrollButton = true;
    showInfiniteScrollButton = true;
    showBookModeButton = true;
    set showRotateButton(visibility) {
        this.showRotateCwButton = visibility;
        this.showRotateCcwButton = visibility;
    }
    showRotateCwButton = true;
    showRotateCcwButton = true;
    _handTool = !isIOS();
    set handTool(handTool) {
        if (isIOS() && handTool) {
            console.log("On iOS, the handtool doesn't work reliably. Plus, you don't need it because touch gestures allow you to distinguish easily between swiping and selecting text. Therefore, the library ignores your setting.");
            return;
        }
        this._handTool = handTool;
    }
    get handTool() {
        return this._handTool;
    }
    handToolChange = new EventEmitter();
    showHandToolButton = false;
    _showScrollingButton = true;
    get showScrollingButton() {
        if (this.pageViewMode === 'multiple') {
            return this._showScrollingButton;
        }
        return false;
    }
    set showScrollingButton(val) {
        this._showScrollingButton = val;
    }
    showSpreadButton = true;
    showPropertiesButton = true;
    showBorders = true;
    spread;
    spreadChange = new EventEmitter();
    thumbnailDrawn = new EventEmitter();
    _page = undefined;
    get page() {
        return this._page;
    }
    set page(p) {
        if (p) {
            // silently cope with strings
            this._page = Number(p);
        }
        else {
            this._page = undefined;
        }
    }
    pageChange = new EventEmitter();
    pageLabel = undefined;
    pageLabelChange = new EventEmitter();
    pagesLoaded = new EventEmitter();
    pageRender = new EventEmitter();
    pageRendered = new EventEmitter();
    pdfDownloaded = new EventEmitter();
    pdfLoaded = new EventEmitter();
    pdfLoadingStarts = new EventEmitter();
    pdfLoadingFailed = new EventEmitter();
    textLayer = undefined;
    textLayerRendered = new EventEmitter();
    annotationEditorModeChanged = new EventEmitter();
    updateFindMatchesCount = new EventEmitter();
    updateFindState = new EventEmitter();
    /** Legal values: undefined, 'auto', 'page-actual', 'page-fit', 'page-width', or '50' (or any other percentage) */
    zoom = undefined;
    zoomChange = new EventEmitter();
    zoomLevels = ['auto', 'page-actual', 'page-fit', 'page-width', 0.5, 1, 1.25, 1.5, 2, 3, 4];
    maxZoom = 10;
    minZoom = 0.1;
    /** This attribute allows you to increase the size of the UI elements so you can use them on small mobile devices.
     * This attribute is a string with a percent character at the end (e.g. "150%").
     */
    _mobileFriendlyZoom = '100%';
    mobileFriendlyZoomScale = 1;
    toolbarMarginTop = '0px';
    toolbarWidth = '100%';
    toolbar = undefined;
    onToolbarLoaded(toolbarElement) {
        this.toolbar = toolbarElement;
    }
    toolbarWidthInPixels = 3.14159265359; // magic number indicating the toolbar size hasn't been determined yet
    secondaryToolbarTop = undefined;
    sidebarPositionTop = undefined;
    // dirty IE11 hack - temporary solution
    findbarTop = undefined;
    // dirty IE11 hack - temporary solution
    findbarLeft = undefined;
    get mobileFriendlyZoom() {
        return this._mobileFriendlyZoom;
    }
    get pdfJsVersion() {
        return getVersionSuffix(pdfDefaultOptions.assetsFolder);
    }
    get majorMinorPdfJsVersion() {
        const fullVersion = this.pdfJsVersion;
        const pos = fullVersion.lastIndexOf('.');
        return fullVersion.substring(0, pos).replace('.', '-');
    }
    /**
     * This attributes allows you to increase the size of the UI elements so you can use them on small mobile devices.
     * This attribute is a string with a percent character at the end (e.g. "150%").
     */
    set mobileFriendlyZoom(zoom) {
        // tslint:disable-next-line:triple-equals - the type conversion is intended
        if (zoom == 'true') {
            zoom = '150%';
            // tslint:disable-next-line:triple-equals - the type conversion is intended
        }
        else if (zoom == 'false' || zoom === undefined || zoom === null) {
            zoom = '100%';
        }
        this._mobileFriendlyZoom = zoom;
        let factor = 1;
        if (!String(zoom).includes('%')) {
            zoom = 100 * Number(zoom) + '%';
        }
        factor = Number((zoom || '100').replace('%', '')) / 100;
        this.mobileFriendlyZoomScale = factor;
        this.toolbarWidth = (100 / factor).toString() + '%';
        this.toolbarMarginTop = (factor - 1) * 16 + 'px';
        setTimeout(() => this.calcViewerPositionTop());
    }
    shuttingDown = false;
    serverSideRendering = true;
    calcViewerPositionTop() {
        if (this.toolbar === undefined) {
            this.sidebarPositionTop = '0';
            return;
        }
        let top = this.toolbar.getBoundingClientRect().height;
        if (top < 33) {
            this.viewerPositionTop = '33px';
        }
        else {
            this.viewerPositionTop = top + 'px';
        }
        const factor = top / 33;
        if (this.primaryMenuVisible) {
            this.sidebarPositionTop = (33 + 33 * (factor - 1)).toString() + 'px';
        }
        else {
            this.sidebarPositionTop = '0';
        }
        this.secondaryToolbarTop = (33 + 38 * (factor - 1)).toString() + 'px';
        this.findbarTop = (33 + 38 * (factor - 1)).toString() + 'px';
        const findButton = document.getElementById('primaryViewFind');
        if (findButton) {
            const containerPositionLeft = this.toolbar.getBoundingClientRect().left;
            const findButtonPosition = findButton.getBoundingClientRect();
            const left = Math.max(0, findButtonPosition.left - containerPositionLeft);
            this.findbarLeft = left + 'px';
        }
        else if (this.showSidebarButton) {
            this.findbarLeft = 34 + (32 * factor).toString() + 'px';
        }
        else {
            this.findbarLeft = '0';
        }
    }
    constructor(ngZone, platformId, notificationService, elementRef, platformLocation, cdr, service, renderer, pdfCspPolicyService) {
        this.ngZone = ngZone;
        this.platformId = platformId;
        this.notificationService = notificationService;
        this.elementRef = elementRef;
        this.platformLocation = platformLocation;
        this.cdr = cdr;
        this.service = service;
        this.renderer = renderer;
        this.pdfCspPolicyService = pdfCspPolicyService;
        this.baseHref = this.platformLocation.getBaseHrefFromDOM();
        this.windowSizeRecalculatorSubscription = this.service.recalculateSize$.subscribe(() => this.onResize());
        if (isPlatformBrowser(this.platformId)) {
            this.serverSideRendering = false;
            this.toolbarWidth = String(document.body.clientWidth);
            if (globalThis.pdfDefaultOptions) {
                for (const key in globalThis.pdfDefaultOptions) {
                    pdfDefaultOptions[key] = globalThis.pdfDefaultOptions[key];
                }
            }
            else {
                globalThis.pdfDefaultOptions = pdfDefaultOptions;
            }
        }
    }
    iOSVersionRequiresES5() {
        if (typeof window === 'undefined') {
            // server-side rendering
            return false;
        }
        const match = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
        if (match !== undefined && match !== null) {
            return parseInt(match[1], 10) < 14;
        }
        return false;
    }
    async needsES5() {
        if (typeof window === 'undefined') {
            // server-side rendering
            return false;
        }
        const isIE = !!globalThis.MSInputMethodContext && !!document.documentMode;
        const isEdge = /Edge\/\d./i.test(navigator.userAgent);
        const isIOs13OrBelow = this.iOSVersionRequiresES5();
        let needsES5 = typeof ReadableStream === 'undefined' || typeof Promise['allSettled'] === 'undefined';
        if (needsES5 || isIE || isEdge || isIOs13OrBelow || this.forceUsingLegacyES5) {
            return true;
        }
        return !(await this.ngxExtendedPdfViewerCanRunModernJSCode());
    }
    ngxExtendedPdfViewerCanRunModernJSCode() {
        return new Promise((resolve) => {
            const support = globalThis.ngxExtendedPdfViewerCanRunModernJSCode;
            support !== undefined ? resolve(support) : resolve(this.addScriptOpChainingSupport());
        });
    }
    addScriptOpChainingSupport() {
        return new Promise((resolve) => {
            const script = this.createScriptElement(pdfDefaultOptions.assetsFolder + '/op-chaining-support.js');
            script.onload = () => {
                script.remove();
                script.onload = null;
                resolve(globalThis.ngxExtendedPdfViewerCanRunModernJSCode);
            };
            script.onerror = () => {
                script.remove();
                globalThis.ngxExtendedPdfViewerCanRunModernJSCode = false;
                resolve(false);
                script.onerror = null;
            };
            document.body.appendChild(script);
        });
    }
    createScriptElement(sourcePath) {
        const script = document.createElement('script');
        script.async = true;
        script.type = sourcePath.endsWith('.mjs') ? 'module' : 'text/javascript';
        script.className = `ngx-extended-pdf-viewer-script`;
        this.pdfCspPolicyService.addTrustedJavaScript(script, sourcePath);
        return script;
    }
    createScriptImportElement(sourcePath) {
        const script = document.createElement('script');
        script.async = true;
        script.type = 'module';
        script.className = `ngx-extended-pdf-viewer-script`;
        // this.pdfCspPolicyService.addTrustedJavaScript(script, sourcePath);
        const body = `
    import { webViewerLoad, PDFViewerApplication, PDFViewerApplicationConstants, PDFViewerApplicationOptions } from './${sourcePath}';
    const event = new CustomEvent("ngxViewerFileHasBeenLoaded", {
      detail: {
        PDFViewerApplication,
        PDFViewerApplicationConstants,
        PDFViewerApplicationOptions,
        webViewerLoad
      }
    });
    document.dispatchEvent(event);
    `;
        script.text = body;
        return script;
    }
    getPdfJsPath(artifact, needsES5) {
        let suffix = this.minifiedJSLibraries && !needsES5 ? '.min.js' : '.js';
        const assets = pdfDefaultOptions.assetsFolder;
        const versionSuffix = getVersionSuffix(assets);
        if (versionSuffix.startsWith('4')) {
            suffix = suffix.replace('.js', '.mjs');
        }
        const artifactPath = `/${artifact}-`;
        const es5 = needsES5 ? '-es5' : '';
        return assets + artifactPath + versionSuffix + es5 + suffix;
    }
    loadViewer() {
        this.ngZone.runOutsideAngular(async () => {
            const needsES5 = await this.needsES5();
            setTimeout(() => {
                const viewerPath = this.getPdfJsPath('viewer', needsES5);
                document.addEventListener('ngxViewerFileHasBeenLoaded', (event) => {
                    const { PDFViewerApplication, PDFViewerApplicationOptions, PDFViewerApplicationConstants, webViewerLoad } = event.detail;
                    this.ngZone.runOutsideAngular(() => {
                        this.PDFViewerApplication = PDFViewerApplication;
                        this.PDFViewerApplicationOptions = PDFViewerApplicationOptions;
                        this.PDFViewerApplicationConstants = PDFViewerApplicationConstants;
                        this.webViewerLoad = webViewerLoad;
                        this.doInitPDFViewer();
                    });
                });
                const script = this.createScriptImportElement(viewerPath);
                document.getElementsByTagName('head')[0].appendChild(script);
            });
        });
    }
    addFeatures() {
        return new Promise((resolve) => {
            const script = this.createScriptElement(pdfDefaultOptions.assetsFolder + '/additional-features.js');
            script.onload = () => {
                script.remove();
            };
            script.onerror = () => {
                script.remove();
                resolve();
            };
            document.body.appendChild(script);
        });
    }
    ngOnInit() {
        globalThis['ngxZone'] = this.ngZone;
        NgxConsole.init();
        if (isPlatformBrowser(this.platformId)) {
            this.addTranslationsUnlessProvidedByTheUser();
            this.loadPdfJs();
            this.hideToolbarIfItIsEmpty();
        }
    }
    loadPdfJs() {
        const alreadyLoaded = document.getElementsByClassName('ngx-extended-pdf-viewer-script');
        if (alreadyLoaded.length > 0) {
            setTimeout(() => {
                this.loadPdfJs();
            }, 10);
            return;
        }
        globalThis['setNgxExtendedPdfViewerSource'] = (url) => {
            this._src = url;
            this.srcChangeTriggeredByUser = true;
            this.srcChange.emit(url);
        };
        this.formSupport.registerFormSupportWithPdfjs(this.ngZone);
        globalThis['ngxZone'] = this.ngZone;
        this.ngZone.runOutsideAngular(async () => {
            const needsES5 = await this.needsES5();
            if (needsES5) {
                if (!pdfDefaultOptions.needsES5) {
                    console.log("If you see the error message \"expected expression, got '='\" above: you can safely ignore it as long as you know what you're doing. It means your browser is out-of-date. Please update your browser to benefit from the latest security updates and to enjoy a faster PDF viewer.");
                }
                pdfDefaultOptions.needsES5 = true;
                console.log('Using the ES5 version of the PDF viewer. Your PDF files show faster if you update your browser.');
            }
            if (this.minifiedJSLibraries && !needsES5) {
                if (!pdfDefaultOptions.workerSrc().endsWith('.min.mjs')) {
                    const src = pdfDefaultOptions.workerSrc();
                    pdfDefaultOptions.workerSrc = () => src.replace('.mjs', '.min.mjs');
                }
            }
            const pdfJsPath = this.getPdfJsPath('pdf', needsES5);
            if (pdfJsPath.endsWith('.mjs')) {
                const src = pdfDefaultOptions.workerSrc();
                if (src.endsWith('.js')) {
                    pdfDefaultOptions.workerSrc = () => src.substring(0, src.length - 3) + '.mjs';
                }
            }
            const script = this.createScriptElement(pdfJsPath);
            script.onload = () => {
                this.loadViewer();
            };
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }
    assignTabindexes() {
        if (this.startTabindex) {
            const r = this.root.nativeElement.cloneNode(true);
            r.classList.add('offscreen');
            this.showElementsRecursively(r);
            document.body.appendChild(r);
            const elements = this.collectElementPositions(r, this.root.nativeElement, []);
            document.body.removeChild(r);
            const topRightGreaterThanBottomLeftComparator = (a, b) => {
                if (a.y - b.y > 15) {
                    return 1;
                }
                if (b.y - a.y > 15) {
                    return -1;
                }
                return a.x - b.x;
            };
            const sorted = [...elements].sort(topRightGreaterThanBottomLeftComparator);
            for (let i = 0; i < sorted.length; i++) {
                sorted[i].element.tabIndex = this.startTabindex + i;
            }
        }
    }
    showElementsRecursively(root) {
        root.classList.remove('hidden');
        root.classList.remove('invisible');
        root.classList.remove('hiddenXXLView');
        root.classList.remove('hiddenXLView');
        root.classList.remove('hiddenLargeView');
        root.classList.remove('hiddenMediumView');
        root.classList.remove('hiddenSmallView');
        root.classList.remove('hiddenTinyView');
        root.classList.remove('visibleXXLView');
        root.classList.remove('visibleXLView');
        root.classList.remove('visibleLargeView');
        root.classList.remove('visibleMediumView');
        root.classList.remove('visibleSmallView');
        root.classList.remove('visibleTinyView');
        if (root instanceof HTMLButtonElement || root instanceof HTMLAnchorElement || root instanceof HTMLInputElement || root instanceof HTMLSelectElement) {
            return;
        }
        else if (root.childElementCount > 0) {
            for (let i = 0; i < root.childElementCount; i++) {
                const c = root.children.item(i);
                if (c) {
                    this.showElementsRecursively(c);
                }
            }
        }
    }
    collectElementPositions(copy, original, elements) {
        if (copy instanceof HTMLButtonElement || copy instanceof HTMLAnchorElement || copy instanceof HTMLInputElement || copy instanceof HTMLSelectElement) {
            const rect = copy.getBoundingClientRect();
            const elementAndPos = {
                element: original,
                x: Math.round(rect.left),
                y: Math.round(rect.top),
            };
            elements.push(elementAndPos);
        }
        else if (copy.childElementCount > 0) {
            for (let i = 0; i < copy.childElementCount; i++) {
                const c = copy.children.item(i);
                const o = original.children.item(i);
                if (c && o) {
                    elements = this.collectElementPositions(c, o, elements);
                }
            }
        }
        return elements;
    }
    afterPrintListener = () => {
        this.afterPrint.emit();
    };
    beforePrintListener = () => {
        this.beforePrint.emit();
    };
    doInitPDFViewer() {
        if (typeof window === 'undefined') {
            // server-side rendering
            return;
        }
        window.addEventListener('afterprint', this.afterPrintListener);
        window.addEventListener('beforeprint', this.beforePrintListener);
        if (this.service.ngxExtendedPdfViewerInitialized) {
            // tslint:disable-next-line:quotemark
            console.error("You're trying to open two instances of the PDF viewer. Most likely, this will result in errors.");
        }
        const onLoaded = () => {
            document.removeEventListener('webviewerinitialized', onLoaded);
            if (!this.PDFViewerApplication.eventBus) {
                console.error("Eventbus is null? Let's try again.");
                setTimeout(() => {
                    onLoaded();
                }, 10);
            }
            else {
                globalThis.PDFViewerApplication = this.PDFViewerApplication;
                this.overrideDefaultSettings();
                this.localizationInitialized = true;
                //        this.initTimeout = setTimeout(async () => {
                if (!this.shuttingDown) {
                    // hurried users sometimes reload the PDF before it has finished initializing
                    this.calcViewerPositionTop();
                    this.afterLibraryInit();
                    this.openPDF();
                    this.assignTabindexes();
                    if (this.replaceBrowserPrint) {
                        window.print = window.printPDF;
                    }
                }
                //        }, 10);
            }
        };
        document.addEventListener('webviewerinitialized', onLoaded);
        this.activateTextlayerIfNecessary(null);
        setTimeout(() => {
            if (!this.shuttingDown) {
                // hurried users sometimes reload the PDF before it has finished initializing
                // This initializes the webviewer, the file may be passed in to it to initialize the viewer with a pdf directly
                this.onResize();
                this.hideToolbarIfItIsEmpty();
                this.dummyComponents.addMissingStandardWidgets();
                this.ngZone.runOutsideAngular(() => this.webViewerLoad());
                const PDFViewerApplication = this.PDFViewerApplication;
                PDFViewerApplication.appConfig.defaultUrl = ''; // IE bugfix
                if (this.filenameForDownload) {
                    PDFViewerApplication.appConfig.filenameForDownload = this.filenameForDownload;
                }
                const PDFViewerApplicationOptions = this.PDFViewerApplicationOptions;
                PDFViewerApplicationOptions.set('enableDragAndDrop', this.enableDragAndDrop);
                let language = this.language === '' ? undefined : this.language;
                if (!language) {
                    if (typeof window === 'undefined') {
                        // server-side rendering
                        language = 'en';
                    }
                    else {
                        language = navigator.language;
                    }
                }
                PDFViewerApplicationOptions.set('locale', language);
                PDFViewerApplicationOptions.set('imageResourcesPath', this.imageResourcesPath);
                PDFViewerApplicationOptions.set('minZoom', this.minZoom);
                PDFViewerApplicationOptions.set('maxZoom', this.maxZoom);
                PDFViewerApplicationOptions.set('pageViewMode', this.pageViewMode);
                PDFViewerApplicationOptions.set('verbosity', this.logLevel);
                PDFViewerApplicationOptions.set('initialZoom', this.zoom);
                PDFViewerApplication.isViewerEmbedded = true;
                if (PDFViewerApplication.printKeyDownListener) {
                    window.addEventListener('keydown', PDFViewerApplication.printKeyDownListener, true);
                }
                const body = document.getElementsByTagName('body');
                if (body[0]) {
                    const topLevelElements = body[0].children;
                    for (let i = topLevelElements.length - 1; i >= 0; i--) {
                        const e = topLevelElements.item(i);
                        if (e && e.id === 'printContainer') {
                            body[0].removeChild(e);
                        }
                    }
                }
                const pc = document.getElementById('printContainer');
                if (pc) {
                    document.getElementsByTagName('body')[0].appendChild(pc);
                }
            }
        }, 0);
    }
    addTranslationsUnlessProvidedByTheUser() {
        const link = this.renderer.createElement('link');
        link.rel = 'resource';
        link.type = 'application/l10n';
        link.href = this.localeFolderPath + '/locale.json';
        link.setAttribute('origin', 'ngx-extended-pdf-viewer');
        this.renderer.appendChild(this.elementRef.nativeElement, link);
    }
    hideToolbarIfItIsEmpty() {
        this.primaryMenuVisible = this.showToolbar;
        if (!this.showSecondaryToolbarButton || this.service.secondaryMenuIsEmpty) {
            if (!this.isPrimaryMenuVisible()) {
                this.primaryMenuVisible = false;
            }
        }
    }
    /** Notifies every widget that implements onLibraryInit() that the PDF viewer objects are available */
    afterLibraryInit() {
        this.notificationService.onPDFJSInitSignal.set(this.PDFViewerApplication);
    }
    checkHeight() {
        if (this._height) {
            if (isNaN(Number(this._height.replace('%', '')))) {
                // The height is defined with one of the units vh, vw, em, rem, etc.
                // So the height check isn't necessary.
                return;
            }
        }
        if (document.querySelector('[data-pdfjsprinting]')) {
            // #1702 workaround to a Firefox bug: when printing, container.clientHeight is temporarily 0,
            // causing ngx-extended-pdf-viewer to default to 100 pixels height. So it's better
            // to do nothing.
            return;
        }
        if (typeof document !== 'undefined') {
            const container = document.getElementsByClassName('zoom')[0];
            if (container) {
                if (container.clientHeight === 0) {
                    if (this.logLevel >= VerbosityLevel.WARNINGS && !this.autoHeight) {
                        console.warn("The height of the PDF viewer widget is zero pixels. Please check the height attribute. Is there a syntax error? Or are you using a percentage with a CSS framework that doesn't support this? The height is adjusted automatedly.");
                    }
                    this.autoHeight = true;
                }
                if (this.autoHeight) {
                    const available = window.innerHeight;
                    const rect = container.getBoundingClientRect();
                    const top = rect.top;
                    let maximumHeight = available - top;
                    // take the margins and paddings of the parent containers into account
                    const padding = this.calculateBorderMargin(container);
                    maximumHeight -= padding;
                    if (maximumHeight > 100) {
                        this.minHeight = `${maximumHeight}px`;
                    }
                    else {
                        this.minHeight = '100px';
                    }
                    this.cdr.markForCheck();
                }
            }
        }
    }
    calculateBorderMargin(container) {
        if (container) {
            const computedStyle = window.getComputedStyle(container);
            const padding = UnitToPx.toPx(computedStyle.paddingBottom);
            const margin = UnitToPx.toPx(computedStyle.marginBottom);
            if (container.style.zIndex) {
                return padding + margin;
            }
            return padding + margin + this.calculateBorderMargin(container.parentElement);
        }
        return 0;
    }
    onSpreadChange(newSpread) {
        this.spreadChange.emit(newSpread);
    }
    activateTextlayerIfNecessary(options) {
        if (this.textLayer === undefined) {
            if (!this.handTool) {
                if (options) {
                    options.set('textLayerMode', pdfDefaultOptions.textLayerMode);
                }
                this.textLayer = true;
                if (this.showFindButton === undefined) {
                    this.showFindButton = true;
                    setTimeout(() => {
                        // todo remove this hack:
                        const viewFind = document.getElementById('viewFind');
                        if (viewFind) {
                            viewFind.classList.remove('invisible');
                        }
                        const findbar = document.getElementById('findbar');
                        if (findbar) {
                            findbar.classList.remove('invisible');
                        }
                    });
                }
            }
            else {
                if (options) {
                    options.set('textLayerMode', this.showHandToolButton ? pdfDefaultOptions.textLayerMode : 0);
                }
                if (!this.showHandToolButton) {
                    if (this.showFindButton || this.showFindButton === undefined) {
                        this.ngZone.run(() => {
                            this.showFindButton = false;
                        });
                        if (this.logLevel >= VerbosityLevel.WARNINGS) {
                            console.warn(
                            // tslint:disable-next-line:max-line-length
                            'Hiding the "find" button because the text layer of the PDF file is not rendered. Use [textLayer]="true" to enable the find button.');
                        }
                    }
                    if (this.showHandToolButton) {
                        if (this.logLevel >= VerbosityLevel.WARNINGS) {
                            console.warn(
                            // tslint:disable-next-line:max-line-length
                            'Hiding the "hand tool / selection mode" menu because the text layer of the PDF file is not rendered. Use [textLayer]="true" to enable the the menu items.');
                            this.showHandToolButton = false;
                        }
                    }
                }
            }
        }
        else {
            if (this.textLayer) {
                // todo: is this a redundant check?
                if (options) {
                    options.set('textLayerMode', pdfDefaultOptions.textLayerMode);
                }
                this.textLayer = true;
                if (this.showFindButton === undefined) {
                    this.showFindButton = true;
                    setTimeout(() => {
                        // todo remove this hack:
                        const viewFind = document.getElementById('viewFind');
                        if (viewFind) {
                            viewFind.classList.remove('invisible');
                        }
                        const findbar = document.getElementById('findbar');
                        if (findbar) {
                            findbar.classList.remove('invisible');
                        }
                    });
                }
            }
            else {
                // todo: is the else branch dead code?
                if (options) {
                    options.set('textLayerMode', 0);
                }
                this.textLayer = false;
                if (this.showFindButton) {
                    if (this.logLevel >= VerbosityLevel.WARNINGS) {
                        // tslint:disable-next-line:max-line-length
                        console.warn('Hiding the "find" button because the text layer of the PDF file is not rendered. Use [textLayer]="true" to enable the find button.');
                        this.ngZone.run(() => {
                            this.showFindButton = false;
                        });
                    }
                }
                if (this.showHandToolButton) {
                    if (this.logLevel >= VerbosityLevel.WARNINGS) {
                        console.warn(
                        // tslint:disable-next-line:max-line-length
                        'Hiding the "hand tool / selection mode" menu because the text layer of the PDF file is not rendered. Use [textLayer]="true" to enable the the menu items.');
                        this.showHandToolButton = false;
                    }
                }
            }
        }
    }
    async overrideDefaultSettings() {
        if (typeof window === 'undefined') {
            return; // server side rendering
        }
        const options = this.PDFViewerApplicationOptions;
        // tslint:disable-next-line:forin
        for (const key in pdfDefaultOptions) {
            options.set(key, pdfDefaultOptions[key]);
        }
        options.set('disablePreferences', true);
        await this.setZoom();
        options.set('ignoreKeyboard', this.ignoreKeyboard);
        options.set('ignoreKeys', this.ignoreKeys);
        options.set('acceptKeys', this.acceptKeys);
        this.activateTextlayerIfNecessary(options);
        if (this.scrollMode || this.scrollMode === ScrollModeType.vertical) {
            options.set('scrollModeOnLoad', this.scrollMode);
        }
        const sidebarVisible = this.sidebarVisible;
        const PDFViewerApplication = this.PDFViewerApplication;
        if (sidebarVisible !== undefined) {
            PDFViewerApplication.sidebarViewOnLoad = sidebarVisible ? 1 : 0;
            if (PDFViewerApplication.appConfig) {
                PDFViewerApplication.appConfig.sidebarViewOnLoad = sidebarVisible ? this.activeSidebarView : PdfSidebarView.NONE;
            }
            options.set('sidebarViewOnLoad', this.sidebarVisible ? this.activeSidebarView : 0);
        }
        if (this.spread === 'even') {
            options.set('spreadModeOnLoad', 2);
            if (PDFViewerApplication.pdfViewer) {
                PDFViewerApplication.pdfViewer.spreadMode = 2;
            }
            this.onSpreadChange('even');
        }
        else if (this.spread === 'odd') {
            options.set('spreadModeOnLoad', 1);
            if (PDFViewerApplication.pdfViewer) {
                PDFViewerApplication.pdfViewer.spreadMode = 1;
            }
            this.onSpreadChange('odd');
        }
        else {
            options.set('spreadModeOnLoad', 0);
            if (PDFViewerApplication.pdfViewer) {
                PDFViewerApplication.pdfViewer.spreadMode = 0;
            }
            this.onSpreadChange('off');
        }
        if (this.printResolution) {
            options.set('printResolution', this.printResolution);
        }
        if (this.showBorders === false) {
            options.set('removePageBorders', !this.showBorders);
        }
    }
    openPDF() {
        ServiceWorkerOptions.showUnverifiedSignatures = this.showUnverifiedSignatures;
        const PDFViewerApplication = this.PDFViewerApplication;
        PDFViewerApplication.enablePrint = this.enablePrint;
        this.service.ngxExtendedPdfViewerInitialized = true;
        this.registerEventListeners(PDFViewerApplication);
        this.selectCursorTool();
        if (!this.listenToURL) {
            PDFViewerApplication.pdfLinkService.setHash = undefined;
        }
        if (this._src) {
            this.ngxExtendedPdfViewerIncompletelyInitialized = false;
            this.initTimeout = undefined;
            setTimeout(async () => this.checkHeight(), 100);
            // open a file in the viewer
            if (!!this._src) {
                const options = {
                    password: this.password,
                    verbosity: this.logLevel,
                };
                if (this._src['range']) {
                    options.range = this._src['range'];
                }
                if (this.httpHeaders) {
                    options.httpHeaders = this.httpHeaders;
                }
                if (this.authorization) {
                    options.withCredentials = true;
                    if (typeof this.authorization != 'boolean') {
                        if (!options.httpHeaders)
                            options.httpHeaders = {};
                        options.httpHeaders.Authorization = this.authorization;
                    }
                }
                options.baseHref = this.baseHref;
                PDFViewerApplication.onError = (error) => this.pdfLoadingFailed.emit(error);
                this.ngZone.runOutsideAngular(async () => {
                    if (typeof this._src === 'string') {
                        options.url = this._src;
                    }
                    else if (this._src instanceof ArrayBuffer) {
                        options.data = this._src;
                    }
                    else if (this._src instanceof Uint8Array) {
                        options.data = this._src;
                    }
                    options.rangeChunkSize = pdfDefaultOptions.rangeChunkSize;
                    await PDFViewerApplication.open(options);
                    this.pdfLoadingStarts.emit({});
                    setTimeout(async () => this.setZoom());
                });
            }
            setTimeout(() => {
                if (!this.shuttingDown) {
                    // hurried users sometimes reload the PDF before it has finished initializing
                    if (this.page) {
                        PDFViewerApplication.page = Number(this.page);
                    }
                }
            }, 100);
        }
    }
    registerEventListeners(PDFViewerApplication) {
        PDFViewerApplication.eventBus.on('annotation-editor-event', (x) => {
            this.ngZone.run(() => {
                this.annotationEditorEvent.emit(x);
            });
        });
        PDFViewerApplication.eventBus.on('toggleSidebar', (x) => {
            this.ngZone.run(() => {
                this.sidebarVisible = x.visible;
                this.sidebarVisibleChange.emit(x.visible);
            });
        });
        PDFViewerApplication.eventBus.on('textlayerrendered', (x) => {
            this.ngZone.run(() => this.textLayerRendered.emit(x));
        });
        PDFViewerApplication.eventBus.on('annotationeditormodechanged', (x) => {
            // we're using a timeout here to make sure the editor is already visible
            // when the event is caught. Pdf.js fires it a bit early.
            setTimeout(() => this.annotationEditorModeChanged.emit(x));
            if (x.mode === 0) {
                document.body.classList.remove('ngx-extended-pdf-viewer-prevent-touch-move');
            }
            else {
                document.body.classList.add('ngx-extended-pdf-viewer-prevent-touch-move');
            }
        });
        PDFViewerApplication.eventBus.on('scrollmodechanged', (x) => {
            this.ngZone.run(() => {
                this._scrollMode = x.mode;
                this.scrollModeChange.emit(x.mode);
                if (x.mode === ScrollModeType.page) {
                    if (this.pageViewMode !== 'single') {
                        this.pageViewModeChange.emit('single');
                        this._pageViewMode = 'single';
                    }
                }
            });
        });
        PDFViewerApplication.eventBus.on('progress', (x) => {
            this.ngZone.run(() => this.progress.emit(x));
        });
        PDFViewerApplication.eventBus.on('findbarclose', () => {
            this.ngZone.run(() => {
                this.findbarVisible = false;
                this.findbarVisibleChange.emit(false);
                this.cdr.markForCheck();
            });
        });
        PDFViewerApplication.eventBus.on('findbaropen', () => {
            this.ngZone.run(() => {
                this.findbarVisible = true;
                this.findbarVisibleChange.emit(true);
                this.cdr.markForCheck();
            });
        });
        PDFViewerApplication.eventBus.on('propertiesdialogclose', () => {
            this.propertiesDialogVisible = false;
            this.ngZone.run(() => this.propertiesDialogVisibleChange.emit(false));
        });
        PDFViewerApplication.eventBus.on('propertiesdialogopen', () => {
            this.propertiesDialogVisible = true;
            this.ngZone.run(() => this.propertiesDialogVisibleChange.emit(true));
        });
        PDFViewerApplication.eventBus.on('pagesloaded', (x) => {
            this.ngZone.run(() => this.pagesLoaded.emit(x));
            this.removeScrollbarInInfiniteScrollMode(false);
            if (this.rotation !== undefined && this.rotation !== null) {
                const r = Number(this.rotation);
                if (r === 0 || r === 90 || r === 180 || r === 270) {
                    PDFViewerApplication.pdfViewer.pagesRotation = r;
                }
            }
            setTimeout(() => {
                if (!this.shuttingDown) {
                    // hurried users sometimes reload the PDF before it has finished initializing
                    if (this.nameddest) {
                        PDFViewerApplication.pdfLinkService.goToDestination(this.nameddest);
                    }
                    else if (this.page) {
                        PDFViewerApplication.page = Number(this.page);
                    }
                    else if (this.pageLabel) {
                        PDFViewerApplication.pdfViewer.currentPageLabel = this.pageLabel;
                    }
                }
            });
            this.setZoom();
        });
        PDFViewerApplication.eventBus.on('pagerendered', (x) => {
            this.ngZone.run(() => {
                this.pageRendered.emit(x);
                this.removeScrollbarInInfiniteScrollMode(false);
            });
        });
        PDFViewerApplication.eventBus.on('pagerender', (x) => {
            this.ngZone.run(() => {
                this.pageRender.emit(x);
            });
        });
        PDFViewerApplication.eventBus.on('download', (x) => {
            this.ngZone.run(() => {
                this.pdfDownloaded.emit(x);
            });
        });
        PDFViewerApplication.eventBus.on('scalechanging', (x) => {
            setTimeout(() => {
                this.currentZoomFactor.emit(x.scale);
                this.cdr.markForCheck();
            });
            if (x.presetValue !== 'auto' && x.presetValue !== 'page-fit' && x.presetValue !== 'page-actual' && x.presetValue !== 'page-width') {
                // ignore rounding differences
                if (Math.abs(x.previousScale - x.scale) > 0.000001) {
                    this.zoom = x.scale * 100;
                    this.zoomChange.emit(x.scale * 100);
                }
            }
            else if (x.previousPresetValue !== x.presetValue) {
                // called when the user selects one of the text values of the zoom select dropdown
                this.zoomChange.emit(x.presetValue);
            }
        });
        PDFViewerApplication.eventBus.on('rotationchanging', (x) => {
            this.ngZone.run(() => {
                this.rotationChange.emit(x.pagesRotation);
            });
        });
        PDFViewerApplication.eventBus.on('fileinputchange', (x) => {
            this.ngZone.run(() => {
                if (x.fileInput.files && x.fileInput.files.length >= 1) {
                    // drag and drop
                    this.srcChange.emit(x.fileInput.files[0].name);
                }
                else {
                    // regular file open dialog
                    const path = x.fileInput?.value?.replace('C:\\fakepath\\', '');
                    this.srcChange.emit(path);
                }
            });
        });
        PDFViewerApplication.eventBus.on('cursortoolchanged', (x) => {
            this.ngZone.run(() => {
                this.handTool = x.tool === PdfCursorTools.HAND;
                this.handToolChange.emit(x.tool === PdfCursorTools.HAND);
            });
        });
        PDFViewerApplication.eventBus.on('sidebarviewchanged', (x) => {
            this.ngZone.run(() => {
                this.sidebarVisibleChange.emit(x.view > 0);
                if (x.view > 0) {
                    this.activeSidebarViewChange.emit(x.view);
                }
                if (this.sidebarComponent) {
                    this.sidebarComponent.showToolbarWhenNecessary();
                }
            });
        });
        PDFViewerApplication.eventBus.on('documentloaded', (pdfLoadedEvent) => {
            this.ngZone.run(() => {
                const pages = pdfLoadedEvent.source.pagesCount;
                this.pageLabel = undefined;
                if (this.page && this.page >= pages) {
                    this.page = pages;
                }
                this.scrollSignatureWarningIntoView(pdfLoadedEvent.source.pdfDocument);
                this.pdfLoaded.emit({ pagesCount: pdfLoadedEvent.source.pdfDocument?.numPages });
                if (this.findbarVisible) {
                    PDFViewerApplication.findBar.open();
                }
                if (this.propertiesDialogVisible) {
                    PDFViewerApplication.pdfDocumentProperties.open();
                }
            });
        });
        PDFViewerApplication.eventBus.on('spreadmodechanged', (event) => {
            this.ngZone.run(() => {
                const modes = ['off', 'odd', 'even'];
                this.spread = modes[event.mode];
                this.spreadChange.emit(this.spread);
            });
        });
        const hideSidebarToolbar = () => {
            this.ngZone.run(() => {
                if (this.sidebarComponent) {
                    this.sidebarComponent.showToolbarWhenNecessary();
                }
            });
        };
        PDFViewerApplication.eventBus.on('outlineloaded', hideSidebarToolbar);
        PDFViewerApplication.eventBus.on('attachmentsloaded', hideSidebarToolbar);
        PDFViewerApplication.eventBus.on('layersloaded', hideSidebarToolbar);
        PDFViewerApplication.eventBus.on('annotationlayerrendered', (event) => {
            const div = event.source.div;
            this.ngZone.run(() => {
                event.initialFormDataStoredInThePDF = this.formSupport.initialFormDataStoredInThePDF;
                this.annotationLayerRendered.emit(event);
                this.enableOrDisableForms(div, true);
            });
        });
        PDFViewerApplication.eventBus.on('annotationeditorlayerrendered', (event) => this.ngZone.run(() => this.annotationEditorLayerRendered.emit(event)));
        PDFViewerApplication.eventBus.on('xfalayerrendered', (event) => this.ngZone.run(() => this.xfaLayerRendered.emit(event)));
        PDFViewerApplication.eventBus.on('outlineloaded', (event) => this.ngZone.run(() => this.outlineLoaded.emit(event)));
        PDFViewerApplication.eventBus.on('attachmentsloaded', (event) => this.ngZone.run(() => this.attachmentsloaded.emit(event)));
        PDFViewerApplication.eventBus.on('layersloaded', (event) => this.ngZone.run(() => this.layersloaded.emit(event)));
        PDFViewerApplication.eventBus.on('presentationmodechanged', (event) => {
            const PDFViewerApplication = this.PDFViewerApplication;
            PDFViewerApplication?.pdfViewer?.destroyBookMode();
        });
        PDFViewerApplication.eventBus.on('updatefindcontrolstate', (x) => {
            this.ngZone.run(() => {
                let type = PDFViewerApplication.findController.state.type || 'find';
                if (type === 'again') {
                    type = 'findagain';
                }
                const result = {
                    caseSensitive: PDFViewerApplication.findController.state.caseSensitive,
                    entireWord: PDFViewerApplication.findController.state.entireWord,
                    findPrevious: PDFViewerApplication.findController.state.findPrevious,
                    highlightAll: PDFViewerApplication.findController.state.highlightAll,
                    matchDiacritics: PDFViewerApplication.findController.state.matchDiacritics,
                    query: PDFViewerApplication.findController.state.query,
                    type,
                };
                this.updateFindMatchesCount.emit({
                    ...result,
                    current: x.matchesCount.current,
                    total: x.matchesCount.total,
                    matches: PDFViewerApplication.findController._pageMatches,
                    matchesLength: PDFViewerApplication.findController._pageMatchesLength,
                });
                if (this.updateFindState) {
                    this.updateFindState.emit(x.state);
                }
            });
        });
        PDFViewerApplication.eventBus.on('updatefindmatchescount', (x) => {
            x.matchesCount.matches = PDFViewerApplication.findController._pageMatches;
            x.matchesCount.matchesLength = PDFViewerApplication.findController._pageMatchesLength;
            this.ngZone.run(() => this.updateFindMatchesCount.emit({
                caseSensitive: PDFViewerApplication.findController.state.caseSensitive,
                entireWord: PDFViewerApplication.findController.state.entireWord,
                findPrevious: PDFViewerApplication.findController.state.findPrevious,
                highlightAll: PDFViewerApplication.findController.state.highlightAll,
                matchDiacritics: PDFViewerApplication.findController.state.matchDiacritics,
                query: PDFViewerApplication.findController.state.query,
                type: PDFViewerApplication.findController.state.type,
                current: x.matchesCount.current,
                total: x.matchesCount.total,
                matches: x.matchesCount.matches,
                matchesLength: x.matchesCount.matchesLength,
            }));
        });
        PDFViewerApplication.eventBus.on('pagechanging', (x) => {
            if (!this.shuttingDown) {
                // hurried users sometimes reload the PDF before it has finished initializing
                this.ngZone.run(() => {
                    const currentPage = PDFViewerApplication.pdfViewer.currentPageNumber;
                    const currentPageLabel = PDFViewerApplication.pdfViewer.currentPageLabel;
                    if (currentPage !== this.page) {
                        this.pageChange.emit(currentPage);
                    }
                    if (currentPageLabel !== this.pageLabel) {
                        this.pageLabelChange.emit(currentPageLabel);
                    }
                });
            }
        });
    }
    removeScrollbarInInfiniteScrollMode(restoreHeight) {
        if (this.pageViewMode === 'infinite-scroll' || restoreHeight) {
            const viewer = document.getElementById('viewer');
            const zoom = document.getElementsByClassName('zoom')[0];
            if (viewer) {
                setTimeout(() => {
                    if (this.pageViewMode === 'infinite-scroll') {
                        const height = viewer.clientHeight + 17;
                        if (this.primaryMenuVisible) {
                            this.height = height + 35 + 'px';
                        }
                        else if (height > 17) {
                            this.height = height + 'px';
                        }
                        else if (this.height === undefined) {
                            this.height = '100%';
                        }
                        if (zoom) {
                            zoom.style.height = this.height;
                        }
                    }
                    else if (restoreHeight) {
                        this.autoHeight = true;
                        this._height = undefined;
                        this.checkHeight();
                    }
                });
            }
        }
    }
    async openPDF2() {
        this.overrideDefaultSettings();
        const PDFViewerApplication = this.PDFViewerApplication;
        PDFViewerApplication.pdfViewer.destroyBookMode();
        PDFViewerApplication.pdfViewer.stopRendering();
        PDFViewerApplication.pdfThumbnailViewer.stopRendering();
        // #802 clear the form data; otherwise the "download" dialogs opens
        PDFViewerApplication.pdfDocument?.annotationStorage?.resetModified();
        await PDFViewerApplication.close();
        this.formSupport?.reset();
        const options = {
            password: this.password,
            verbosity: this.logLevel,
        };
        if (this._src?.['range']) {
            options.range = this._src['range'];
        }
        if (this.httpHeaders) {
            options.httpHeaders = this.httpHeaders;
        }
        if (this.authorization) {
            options.withCredentials = true;
            if (typeof this.authorization != 'boolean') {
                if (!options.httpHeaders)
                    options.httpHeaders = {};
                options.httpHeaders.Authorization = this.authorization;
            }
        }
        options.baseHref = this.baseHref;
        try {
            if (typeof this._src === 'string') {
                options.url = this._src;
            }
            else if (this._src instanceof ArrayBuffer) {
                options.data = this._src;
                if (this._src.byteLength === 0) {
                    // sometimes ngOnInit() calls openPdf2 too early
                    // so let's ignore empty arrays
                    return;
                }
            }
            else if (this._src instanceof Uint8Array) {
                options.data = this._src;
                if (this._src.length === 0) {
                    // sometimes ngOnInit() calls openPdf2 too early
                    // so let's ignore empty arrays
                    return;
                }
            }
            options.rangeChunkSize = pdfDefaultOptions.rangeChunkSize;
            await PDFViewerApplication.open(options);
        }
        catch (error) {
            this.pdfLoadingFailed.emit(error);
        }
    }
    selectCursorTool() {
        const PDFViewerApplication = this.PDFViewerApplication;
        PDFViewerApplication.eventBus.dispatch('switchcursortool', { tool: this.handTool ? 1 : 0 });
    }
    async ngOnDestroy() {
        this.shuttingDown = true;
        this.service.ngxExtendedPdfViewerInitialized = false;
        if (typeof window === 'undefined') {
            return; // fast escape for server side rendering
        }
        delete globalThis['setNgxExtendedPdfViewerSource'];
        window.removeEventListener('afterprint', this.afterPrintListener);
        window.removeEventListener('beforeprint', this.beforePrintListener);
        delete globalThis['ngxZone'];
        delete globalThis['ngxConsole'];
        const PDFViewerApplication = this.PDFViewerApplication;
        PDFViewerApplication?.pdfViewer?.destroyBookMode();
        PDFViewerApplication?.pdfViewer?.stopRendering();
        PDFViewerApplication?.pdfThumbnailViewer?.stopRendering();
        if (PDFViewerApplication) {
            PDFViewerApplication.onError = undefined;
        }
        const originalPrint = NgxExtendedPdfViewerComponent.originalPrint;
        if (window && originalPrint && !originalPrint.toString().includes('printPdf')) {
            window.print = originalPrint;
        }
        const printContainer = document.querySelector('#printContainer');
        if (printContainer) {
            printContainer.parentElement?.removeChild(printContainer);
        }
        if (this.initTimeout) {
            clearTimeout(this.initTimeout);
            this.initTimeout = undefined;
        }
        if (PDFViewerApplication) {
            // #802 clear the form data; otherwise the "download" dialogs opens
            PDFViewerApplication.pdfDocument?.annotationStorage?.resetModified();
            this.formSupport?.reset();
            this.formSupport = undefined;
            PDFViewerApplication.unbindWindowEvents();
            PDFViewerApplication._cleanup();
            try {
                await PDFViewerApplication.close();
            }
            catch (error) {
                // just ignore it
                // for example, the secondary toolbar may have not been initialized yet, so
                // trying to destroy it result in errors
            }
            if (PDFViewerApplication.printKeyDownListener) {
                removeEventListener('keydown', PDFViewerApplication.printKeyDownListener, true);
            }
            const bus = PDFViewerApplication.eventBus;
            if (bus) {
                PDFViewerApplication.unbindEvents();
                bus.destroy();
            }
            PDFViewerApplication.eventBus = undefined;
        }
        const w = window;
        delete w.getFormValueFromAngular;
        delete w.registerAcroformAnnotations;
        delete w.getFormValue;
        delete w.setFormValue;
        delete w.assignFormIdAndFieldName;
        delete w.registerAcroformField;
        delete w.registerXFAField;
        delete w.assignFormIdAndFieldName;
        delete w.updateAngularFormValue;
        delete w.ngxConsoleFilter;
        delete w.pdfViewerSanitizer;
        delete w.pdfjsLib;
        this.windowSizeRecalculatorSubscription?.unsubscribe();
        this.notificationService.onPDFJSInitSignal.set(undefined);
        document.querySelectorAll('.ngx-extended-pdf-viewer-script').forEach((e) => {
            e.onload = null;
            e.remove();
        });
        document.querySelectorAll('.ngx-extended-pdf-viewer-file-input').forEach((e) => {
            e.remove();
        });
    }
    isPrimaryMenuVisible() {
        if (this.showToolbar) {
            const visible = this.showDownloadButton ||
                this.showDrawEditor ||
                this.showHighlightEditor ||
                this.showTextEditor ||
                this.showFindButton ||
                this.showOpenFileButton ||
                this.showPagingButtons ||
                this.showPresentationModeButton ||
                this.showPrintButton ||
                this.showPropertiesButton ||
                this.showRotateCwButton ||
                this.showRotateCcwButton ||
                this.showHandToolButton ||
                this.showScrollingButton ||
                this.showSpreadButton ||
                this.showSidebarButton ||
                this.showZoomButtons;
            if (visible) {
                return true;
            }
        }
        return false;
    }
    async ngOnChanges(changes) {
        if (typeof window === 'undefined') {
            return; // server side rendering
        }
        const PDFViewerApplication = this.PDFViewerApplication;
        const PDFViewerApplicationOptions = this.PDFViewerApplicationOptions;
        if (this.service.ngxExtendedPdfViewerInitialized) {
            if ('src' in changes || 'base64Src' in changes) {
                if (this.srcChangeTriggeredByUser) {
                    this.srcChangeTriggeredByUser = false;
                }
                else {
                    if (this.pageViewMode === 'book') {
                        const PDFViewerApplication = this.PDFViewerApplication;
                        PDFViewerApplication?.pdfViewer?.destroyBookMode();
                        PDFViewerApplication?.pdfViewer?.stopRendering();
                        PDFViewerApplication?.pdfThumbnailViewer?.stopRendering();
                    }
                    if (!!this._src) {
                        if (this.ngxExtendedPdfViewerIncompletelyInitialized) {
                            this.openPDF();
                        }
                        else {
                            await this.openPDF2();
                        }
                    }
                    else {
                        // #802 clear the form data; otherwise the "download" dialogs opens
                        PDFViewerApplication.pdfDocument?.annotationStorage?.resetModified();
                        this.formSupport?.reset();
                        let inputField = PDFViewerApplication.appConfig?.openFileInput;
                        if (!inputField) {
                            inputField = document.querySelector('#fileInput');
                        }
                        if (inputField) {
                            inputField.value = '';
                        }
                        await PDFViewerApplication.close();
                    }
                }
            }
            if ('enableDragAndDrop' in changes) {
                PDFViewerApplicationOptions.set('enableDragAndDrop', this.enableDragAndDrop);
            }
            if ('findbarVisible' in changes) {
                if (changes['findbarVisible'].currentValue) {
                    PDFViewerApplication.findBar.open();
                }
                else {
                    PDFViewerApplication.findBar.close();
                }
            }
            if ('propertiesDialogVisible' in changes) {
                if (this.propertiesDialogVisible) {
                    PDFViewerApplication.pdfDocumentProperties.open();
                }
                else {
                    PDFViewerApplication.pdfDocumentProperties.close();
                }
            }
            if ('zoom' in changes) {
                await this.setZoom();
            }
            if ('maxZoom' in changes) {
                PDFViewerApplicationOptions.set('maxZoom', this.maxZoom);
            }
            if ('minZoom' in changes) {
                PDFViewerApplicationOptions.set('minZoom', this.minZoom);
            }
            if ('handTool' in changes) {
                this.selectCursorTool();
            }
            if ('page' in changes) {
                if (this.page) {
                    // tslint:disable-next-line: triple-equals
                    if (this.page != PDFViewerApplication.page) {
                        PDFViewerApplication.page = this.page;
                    }
                }
            }
            if ('pageLabel' in changes) {
                if (this.pageLabel) {
                    if (this.pageLabel !== PDFViewerApplication.pdfViewer.currentPageLabel) {
                        PDFViewerApplication.pdfViewer.currentPageLabel = this.pageLabel;
                    }
                }
            }
            if ('rotation' in changes) {
                if (this.rotation) {
                    const r = Number(this.rotation);
                    if (r === 0 || r === 90 || r === 180 || r === 270) {
                        PDFViewerApplication.pdfViewer.pagesRotation = r;
                    }
                }
                else {
                    PDFViewerApplication.pdfViewer.pagesRotation = 0;
                }
            }
            if ('scrollMode' in changes) {
                if (this.scrollMode || this.scrollMode === ScrollModeType.vertical) {
                    if (PDFViewerApplication.pdfViewer.scrollMode !== Number(this.scrollMode)) {
                        PDFViewerApplication.eventBus.dispatch('switchscrollmode', { mode: Number(this.scrollMode) });
                    }
                }
            }
            if ('activeSidebarView' in changes) {
                if (this.sidebarVisible) {
                    PDFViewerApplication.pdfSidebar.open();
                    const view = Number(this.activeSidebarView);
                    if (view === 1 || view === 2 || view === 3 || view === 4) {
                        PDFViewerApplication.pdfSidebar.switchView(view, true);
                    }
                    else {
                        console.error('[activeSidebarView] must be an integer value between 1 and 4');
                    }
                }
                else {
                    PDFViewerApplication.pdfSidebar.close();
                }
            }
            if ('filenameForDownload' in changes) {
                PDFViewerApplication.appConfig.filenameForDownload = this.filenameForDownload;
            }
            if ('nameddest' in changes) {
                if (this.nameddest) {
                    PDFViewerApplication.pdfLinkService.goToDestination(this.nameddest);
                }
            }
            if ('spread' in changes) {
                if (this.spread === 'even') {
                    PDFViewerApplication.spreadModeOnLoad = 2;
                    PDFViewerApplication.pdfViewer.spreadMode = 2;
                    this.onSpreadChange('even');
                }
                else if (this.spread === 'odd') {
                    PDFViewerApplication.spreadModeOnLoad = 1;
                    PDFViewerApplication.pdfViewer.spreadMode = 1;
                    this.onSpreadChange('odd');
                }
                else {
                    PDFViewerApplication.spreadModeOnLoad = 0;
                    PDFViewerApplication.pdfViewer.spreadMode = 0;
                    this.onSpreadChange('off');
                }
            }
            this.hideToolbarIfItIsEmpty();
            setTimeout(() => this.calcViewerPositionTop());
        } // end of if (NgxExtendedPdfViewerComponent.ngxExtendedPdfViewerInitialized)
        if ('printResolution' in changes) {
            const options = PDFViewerApplicationOptions;
            if (options) {
                options.set('printResolution', this.printResolution);
            }
        }
        if ('ignoreKeyboard' in changes) {
            const options = PDFViewerApplicationOptions;
            if (options) {
                this.overrideDefaultSettings();
            }
        }
        if ('ignoreKeys' in changes) {
            const options = PDFViewerApplicationOptions;
            if (options) {
                this.overrideDefaultSettings();
            }
        }
        if ('acceptKeys' in changes) {
            const options = PDFViewerApplicationOptions;
            if (options) {
                this.overrideDefaultSettings();
            }
        }
        if ('showBorders' in changes) {
            if (!changes['showBorders'].isFirstChange()) {
                const options = PDFViewerApplicationOptions;
                if (options) {
                    this.overrideDefaultSettings();
                    const viewer = document.getElementById('viewer');
                    if (this.showBorders) {
                        viewer.classList.remove('removePageBorders');
                    }
                    else {
                        viewer.classList.add('removePageBorders');
                    }
                    if (PDFViewerApplication.pdfViewer) {
                        PDFViewerApplication.pdfViewer.removePageBorders = !this.showBorders;
                    }
                    const zoomEvent = {
                        source: viewer,
                        // tslint:disable-next-line:no-bitwise
                        scale: (Number(this.zoom) | 100) / 100,
                        presetValue: this.zoom,
                    };
                    PDFViewerApplication.eventBus.dispatch('scalechanging', zoomEvent);
                }
            }
        }
        if ('showUnverifiedSignatures' in changes) {
            if (PDFViewerApplication?.pdfDocument) {
                PDFViewerApplication.pdfDocument._transport.messageHandler.send('showUnverifiedSignatures', this.showUnverifiedSignatures);
            }
        }
        if ('formData' in changes) {
            if (!changes['formData'].isFirstChange()) {
                this.formSupport.updateFormFieldsInPdfCalledByNgOnChanges(changes['formData'].previousValue);
            }
        }
        if ('enablePrint' in changes) {
            if (!changes['enablePrint'].isFirstChange()) {
                PDFViewerApplication.enablePrint = this.enablePrint;
            }
        }
        if (('customFindbar' in changes && !changes['customFindbar'].isFirstChange()) ||
            ('customFindbarButtons' in changes && !changes['customFindbarButtons'].isFirstChange()) ||
            ('customFindbarInputArea' in changes && !changes['customFindbarInputArea'].isFirstChange()) ||
            ('customToolbar' in changes && !changes['customToolbar'].isFirstChange())) {
            if (this.dummyComponents) {
                this.dummyComponents.addMissingStandardWidgets();
            }
        }
        if ('pageViewMode' in changes && !changes['pageViewMode'].isFirstChange()) {
            this.pageViewMode = changes['pageViewMode'].currentValue;
        }
        if ('replaceBrowserPrint' in changes && typeof window !== 'undefined') {
            if (this.replaceBrowserPrint) {
                if (window.printPDF) {
                    window.print = window.printPDF;
                }
            }
            else {
                const originalPrint = NgxExtendedPdfViewerComponent.originalPrint;
                if (originalPrint && !originalPrint.toString().includes('printPdf')) {
                    window.print = originalPrint;
                }
            }
        }
        if ('disableForms' in changes) {
            this.enableOrDisableForms(this.elementRef.nativeElement, false);
        }
        setTimeout(() => this.calcViewerPositionTop());
    }
    async setZoom() {
        if (typeof window === 'undefined') {
            return; // server side rendering
        }
        // sometimes ngOnChanges calls this method before the page is initialized,
        // so let's check if this.root is already defined
        if (this.root) {
            const PDFViewerApplication = this.PDFViewerApplication;
            let zoomAsNumber = this.zoom;
            if (String(zoomAsNumber).endsWith('%')) {
                zoomAsNumber = Number(String(zoomAsNumber).replace('%', '')) / 100;
            }
            else if (!isNaN(Number(zoomAsNumber))) {
                zoomAsNumber = Number(zoomAsNumber) / 100;
            }
            if (!zoomAsNumber) {
                if (!PDFViewerApplication.store) {
                    // It's difficult to prevent calling this method to early, so we need this check.
                    // setZoom() is called later again, when the PDF document has been loaded and its
                    // fingerprint has been calculated.
                }
                else {
                    const userSetting = await PDFViewerApplication.store.get('zoom');
                    if (userSetting) {
                        if (!isNaN(Number(userSetting))) {
                            zoomAsNumber = Number(userSetting) / 100;
                        }
                        else {
                            zoomAsNumber = userSetting;
                        }
                    }
                    else {
                        zoomAsNumber = 'auto';
                    }
                }
            }
            if (PDFViewerApplication) {
                const PDFViewerApplicationOptions = this.PDFViewerApplicationOptions;
                PDFViewerApplicationOptions.set('defaultZoomValue', zoomAsNumber);
            }
            const scaleDropdownField = this.root.nativeElement.querySelector('#scaleSelect');
            if (scaleDropdownField) {
                if (this.zoom === 'auto' || this.zoom === 'page-fit' || this.zoom === 'page-actual' || this.zoom === 'page-width') {
                    scaleDropdownField.value = this.zoom;
                }
                else {
                    scaleDropdownField.value = 'custom';
                    if (scaleDropdownField.options) {
                        for (const option of scaleDropdownField.options) {
                            if (option.value === 'custom') {
                                option.textContent = `${Math.round(Number(zoomAsNumber) * 100000) / 1000}%`;
                            }
                        }
                    }
                }
            }
            if (PDFViewerApplication.pdfViewer) {
                PDFViewerApplication.pdfViewer.currentScaleValue = zoomAsNumber ?? 'auto';
            }
        }
    }
    onResize() {
        const pdfViewer = document.getElementsByClassName('html');
        if (pdfViewer && pdfViewer.length > 0) {
            const container = document.getElementById('outerContainer');
            if (container) {
                const width = container.clientWidth;
                this.toolbarWidthInPixels = width;
                if (this.secondaryToolbarComponent) {
                    this.secondaryToolbarComponent.checkVisibility();
                }
            }
            this.checkHeight();
        }
        try {
            const observer = new ResizeObserver(() => this.removeScrollbarInInfiniteScrollMode(false));
            const viewer = document.getElementById('viewer');
            if (viewer) {
                observer.observe(viewer);
            }
        }
        catch (exception) {
            console.log('ResizeObserver is not supported by your browser');
        }
    }
    onContextMenu() {
        return this.contextMenuAllowed;
    }
    async scrollSignatureWarningIntoView(pdf) {
        /** This method has been inspired by https://medium.com/factory-mind/angular-pdf-forms-fa72b15c3fbd. Thanks, Jonny Fox! */
        this.hasSignature = false;
        for (let i = 1; i <= pdf?.numPages; i++) {
            // track the current page
            const page = await pdf.getPage(i);
            const annotations = await page.getAnnotations();
            // Check if there is at least one 'Sig' fieldType in annotations
            this.hasSignature = annotations.some((a) => a.fieldType === 'Sig');
            if (this.hasSignature) {
                this.ngZone.run(() => {
                    // Defer scrolling to ensure it happens after any other UI updates
                    setTimeout(() => {
                        const viewerContainer = document.querySelector('#viewerContainer');
                        viewerContainer?.scrollBy(0, -32); // Adjust the scroll position
                    });
                });
                break; // stop looping through the pages as soon as we find a signature
            }
        }
    }
    async zoomToPageWidth(event) {
        if (this.handTool) {
            if (!pdfDefaultOptions.doubleTapZoomsInHandMode) {
                return;
            }
        }
        else {
            if (!pdfDefaultOptions.doubleTapZoomsInTextSelectionMode) {
                return;
            }
        }
        if (this.pageViewMode === 'book') {
            // scaling doesn't work in book mode
            return;
        }
        const PDFViewerApplication = this.PDFViewerApplication;
        const desiredCenterY = event.clientY;
        const previousScale = PDFViewerApplication.pdfViewer.currentScale;
        if (this.zoom !== pdfDefaultOptions.doubleTapZoomFactor && this.zoom + '%' !== pdfDefaultOptions.doubleTapZoomFactor) {
            this.previousZoom = this.zoom;
            this.zoom = pdfDefaultOptions.doubleTapZoomFactor; // by default: 'page-width';
            await this.setZoom();
        }
        else if (pdfDefaultOptions.doubleTapResetsZoomOnSecondDoubleTap) {
            if (this.previousZoom) {
                this.zoom = this.previousZoom;
            }
            else {
                this.zoom = 'page-width';
            }
            await this.setZoom();
        }
        else {
            return;
        }
        const currentScale = PDFViewerApplication.pdfViewer.currentScale;
        const scaleCorrectionFactor = currentScale / previousScale - 1;
        const rect = PDFViewerApplication.pdfViewer.container.getBoundingClientRect();
        const dy = desiredCenterY - rect.top;
        PDFViewerApplication.pdfViewer.container.scrollTop += dy * scaleCorrectionFactor;
    }
    enableOrDisableForms(div, doNotEnable) {
        if (!this.disableForms && doNotEnable) {
            return;
        }
        const xfaLayers = Array.from(div.querySelectorAll('.xfaLayer'));
        const acroFormLayers = Array.from(div.querySelectorAll('.annotationLayer'));
        const layers = xfaLayers.concat(...acroFormLayers);
        layers.forEach((layer) => layer.querySelectorAll('input').forEach((x) => (x.disabled = this.disableForms)));
        layers.forEach((layer) => layer.querySelectorAll('select').forEach((x) => (x.disabled = this.disableForms)));
        layers.forEach((layer) => layer.querySelectorAll('textarea').forEach((x) => (x.disabled = this.disableForms)));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: NgxExtendedPdfViewerComponent, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }, { token: i1.PDFNotificationService }, { token: i0.ElementRef }, { token: i2.PlatformLocation }, { token: i0.ChangeDetectorRef }, { token: i3.NgxExtendedPdfViewerService }, { token: i0.Renderer2 }, { token: i4.PdfCspPolicyService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: NgxExtendedPdfViewerComponent, selector: "ngx-extended-pdf-viewer", inputs: { customFindbarInputArea: "customFindbarInputArea", customToolbar: "customToolbar", customFindbar: "customFindbar", customFindbarButtons: "customFindbarButtons", customPdfViewer: "customPdfViewer", customSecondaryToolbar: "customSecondaryToolbar", customSidebar: "customSidebar", customThumbnail: "customThumbnail", customFreeFloatingBar: "customFreeFloatingBar", showFreeFloatingBar: "showFreeFloatingBar", enableDragAndDrop: "enableDragAndDrop", formData: "formData", disableForms: "disableForms", pageViewMode: "pageViewMode", scrollMode: "scrollMode", authorization: "authorization", httpHeaders: "httpHeaders", contextMenuAllowed: "contextMenuAllowed", enablePrint: "enablePrint", showTextEditor: "showTextEditor", showStampEditor: "showStampEditor", showDrawEditor: "showDrawEditor", showHighlightEditor: "showHighlightEditor", logLevel: "logLevel", relativeCoordsOptions: "relativeCoordsOptions", minifiedJSLibraries: "minifiedJSLibraries", printResolution: "printResolution", rotation: "rotation", src: "src", base64Src: "base64Src", minHeight: "minHeight", height: "height", forceUsingLegacyES5: "forceUsingLegacyES5", backgroundColor: "backgroundColor", filenameForDownload: "filenameForDownload", ignoreKeyboard: "ignoreKeyboard", ignoreKeys: "ignoreKeys", acceptKeys: "acceptKeys", imageResourcesPath: "imageResourcesPath", localeFolderPath: "localeFolderPath", language: "language", listenToURL: "listenToURL", nameddest: "nameddest", password: "password", replaceBrowserPrint: "replaceBrowserPrint", showUnverifiedSignatures: "showUnverifiedSignatures", startTabindex: "startTabindex", showSidebarButton: "showSidebarButton", sidebarVisible: "sidebarVisible", activeSidebarView: "activeSidebarView", findbarVisible: "findbarVisible", propertiesDialogVisible: "propertiesDialogVisible", showFindButton: "showFindButton", showFindHighlightAll: "showFindHighlightAll", showFindMatchCase: "showFindMatchCase", showFindCurrentPageOnly: "showFindCurrentPageOnly", showFindPageRange: "showFindPageRange", showFindEntireWord: "showFindEntireWord", showFindEntirePhrase: "showFindEntirePhrase", showFindMatchDiacritics: "showFindMatchDiacritics", showFindFuzzySearch: "showFindFuzzySearch", showFindResultsCount: "showFindResultsCount", showFindMessages: "showFindMessages", showPagingButtons: "showPagingButtons", showZoomButtons: "showZoomButtons", showPresentationModeButton: "showPresentationModeButton", showOpenFileButton: "showOpenFileButton", showPrintButton: "showPrintButton", showDownloadButton: "showDownloadButton", theme: "theme", showToolbar: "showToolbar", showSecondaryToolbarButton: "showSecondaryToolbarButton", showSinglePageModeButton: "showSinglePageModeButton", showVerticalScrollButton: "showVerticalScrollButton", showHorizontalScrollButton: "showHorizontalScrollButton", showWrappedScrollButton: "showWrappedScrollButton", showInfiniteScrollButton: "showInfiniteScrollButton", showBookModeButton: "showBookModeButton", showRotateButton: "showRotateButton", showRotateCwButton: "showRotateCwButton", showRotateCcwButton: "showRotateCcwButton", handTool: "handTool", showHandToolButton: "showHandToolButton", showScrollingButton: "showScrollingButton", showSpreadButton: "showSpreadButton", showPropertiesButton: "showPropertiesButton", showBorders: "showBorders", spread: "spread", page: "page", pageLabel: "pageLabel", textLayer: "textLayer", zoom: "zoom", zoomLevels: "zoomLevels", maxZoom: "maxZoom", minZoom: "minZoom", mobileFriendlyZoom: "mobileFriendlyZoom" }, outputs: { annotationEditorEvent: "annotationEditorEvent", formDataChange: "formDataChange", pageViewModeChange: "pageViewModeChange", progress: "progress", srcChange: "srcChange", scrollModeChange: "scrollModeChange", afterPrint: "afterPrint", beforePrint: "beforePrint", currentZoomFactor: "currentZoomFactor", rotationChange: "rotationChange", annotationLayerRendered: "annotationLayerRendered", annotationEditorLayerRendered: "annotationEditorLayerRendered", xfaLayerRendered: "xfaLayerRendered", outlineLoaded: "outlineLoaded", attachmentsloaded: "attachmentsloaded", layersloaded: "layersloaded", sidebarVisibleChange: "sidebarVisibleChange", activeSidebarViewChange: "activeSidebarViewChange", findbarVisibleChange: "findbarVisibleChange", propertiesDialogVisibleChange: "propertiesDialogVisibleChange", handToolChange: "handToolChange", spreadChange: "spreadChange", thumbnailDrawn: "thumbnailDrawn", pageChange: "pageChange", pageLabelChange: "pageLabelChange", pagesLoaded: "pagesLoaded", pageRender: "pageRender", pageRendered: "pageRendered", pdfDownloaded: "pdfDownloaded", pdfLoaded: "pdfLoaded", pdfLoadingStarts: "pdfLoadingStarts", pdfLoadingFailed: "pdfLoadingFailed", textLayerRendered: "textLayerRendered", annotationEditorModeChanged: "annotationEditorModeChanged", updateFindMatchesCount: "updateFindMatchesCount", updateFindState: "updateFindState", zoomChange: "zoomChange" }, host: { listeners: { "contextmenu": "onContextMenu()" } }, viewQueries: [{ propertyName: "dummyComponents", first: true, predicate: PdfDummyComponentsComponent, descendants: true }, { propertyName: "root", first: true, predicate: ["root"], descendants: true }, { propertyName: "secondaryToolbarComponent", first: true, predicate: ["pdfSecondaryToolbarComponent"], descendants: true }, { propertyName: "sidebarComponent", first: true, predicate: ["pdfsidebar"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<pdf-dark-theme *ngIf=\"theme === 'dark'\"></pdf-dark-theme>\n<pdf-light-theme *ngIf=\"theme === 'light'\"></pdf-light-theme>\n<pdf-acroform-default-theme></pdf-acroform-default-theme>\n\n<pdf-dynamic-css [zoom]=\"mobileFriendlyZoomScale\" [width]=\"toolbarWidthInPixels\"></pdf-dynamic-css>\n<ng-content *ngTemplateOutlet=\"customPdfViewer ? customPdfViewer : defaultPdfViewer\"></ng-content>\n\n<ng-template #defaultPdfViewer>\n  <div class=\"zoom\" [style.height]=\"minHeight ? minHeight : height\" #root>\n    <div class=\"html\">\n      <div class=\"body pdf-js-version-{{ majorMinorPdfJsVersion }}\" [style.backgroundColor]=\"backgroundColor\">\n        <div id=\"outerContainer\" (window:resize)=\"onResize()\">\n          <div class=\"free-floating-bar\" *ngIf=\"showFreeFloatingBar\">\n            <ng-content *ngTemplateOutlet=\"customFreeFloatingBar ? customFreeFloatingBar : defaultFreeFloatingBar\"> </ng-content>\n          </div>\n          <pdf-sidebar\n            #pdfsidebar\n            [sidebarVisible]=\"sidebarVisible || false\"\n            [showSidebarButton]=\"showSidebarButton\"\n            [customSidebar]=\"customSidebar\"\n            [customThumbnail]=\"customThumbnail\"\n            (thumbnailDrawn)=\"thumbnailDrawn.emit($event)\"\n            [mobileFriendlyZoomScale]=\"mobileFriendlyZoomScale\"\n            [sidebarPositionTop]=\"sidebarPositionTop\"\n          >\n          </pdf-sidebar>\n          <div id=\"mainContainer\" [class.toolbar-hidden]=\"!primaryMenuVisible\">\n            <pdf-dummy-components></pdf-dummy-components>\n\n            <pdf-toolbar\n              (onToolbarLoaded)=\"onToolbarLoaded($event)\"\n              [sidebarVisible]=\"sidebarVisible\"\n              [class.server-side-rendering]=\"serverSideRendering\"\n              [customToolbar]=\"customToolbar\"\n              [mobileFriendlyZoomScale]=\"mobileFriendlyZoomScale\"\n              [(pageViewMode)]=\"pageViewMode\"\n              [primaryMenuVisible]=\"primaryMenuVisible\"\n              [scrollMode]=\"scrollMode ?? 0\"\n              [showPropertiesButton]=\"showPropertiesButton\"\n              [showBookModeButton]=\"showBookModeButton\"\n              [showDownloadButton]=\"showDownloadButton\"\n              [showDrawEditor]=\"showDrawEditor\"\n              [showHighlightEditor]=\"showHighlightEditor\"\n              [showFindButton]=\"showFindButton\"\n              [showHandToolButton]=\"showHandToolButton\"\n              [handTool]=\"handTool\"\n              [showHorizontalScrollButton]=\"showHorizontalScrollButton\"\n              [showInfiniteScrollButton]=\"showInfiniteScrollButton\"\n              [showOpenFileButton]=\"showOpenFileButton\"\n              [showPagingButtons]=\"showPagingButtons\"\n              [showPresentationModeButton]=\"showPresentationModeButton && pageViewMode !== 'book'\"\n              [showPrintButton]=\"showPrintButton && enablePrint\"\n              [showRotateCwButton]=\"showRotateCwButton\"\n              [showRotateCcwButton]=\"showRotateCcwButton\"\n              [showSecondaryToolbarButton]=\"showSecondaryToolbarButton && !service.secondaryMenuIsEmpty\"\n              [showSidebarButton]=\"showSidebarButton\"\n              [showSinglePageModeButton]=\"showSinglePageModeButton\"\n              [showSpreadButton]=\"showSpreadButton\"\n              [showStampEditor]=\"showStampEditor\"\n              [showTextEditor]=\"showTextEditor\"\n              [showVerticalScrollButton]=\"showVerticalScrollButton\"\n              [showWrappedScrollButton]=\"showWrappedScrollButton\"\n              [showZoomButtons]=\"showZoomButtons && pageViewMode !== 'book'\"\n              [spread]=\"spread\"\n              [textLayer]=\"textLayer\"\n              [toolbarMarginTop]=\"toolbarMarginTop\"\n              [toolbarWidth]=\"toolbarWidth\"\n              [zoomLevels]=\"zoomLevels\"\n              [findbarVisible]=\"findbarVisible\"\n            ></pdf-toolbar>\n\n            <div class=\"editorParamsToolbar hidden doorHangerRight\" id=\"editorHighlightParamsToolbar\">\n              <div id=\"highlightParamsToolbarContainer\" class=\"editorParamsToolbarContainer\">\n                <div id=\"editorHighlightColorPicker\" class=\"colorPicker\">\n                  <span id=\"highlightColorPickerLabel\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-highlight-colorpicker-label\">Highlight color</span>\n                </div>\n                <div id=\"editorHighlightThickness\">\n                  <label for=\"editorFreeHighlightThickness\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-free-highlight-thickness-input\"\n                    >Thickness</label\n                  >\n                  <div class=\"thicknessPicker\">\n                    <input\n                      type=\"range\"\n                      id=\"editorFreeHighlightThickness\"\n                      class=\"editorParamsSlider\"\n                      data-l10n-id=\"pdfjs-editor-free-highlight-thickness-title\"\n                      value=\"12\"\n                      min=\"8\"\n                      max=\"24\"\n                      step=\"1\"\n                    />\n                  </div>\n                </div>\n                <div id=\"editorHighlightVisibility\">\n                  <div class=\"divider\"></div>\n                  <div class=\"toggler\">\n                    <label for=\"editorHighlightShowAll\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-highlight-show-all-button-label\">Show all</label>\n                    <button\n                      id=\"editorHighlightShowAll\"\n                      class=\"toggle-button\"\n                      data-l10n-id=\"pdfjs-editor-highlight-show-all-button\"\n                      aria-pressed=\"true\"\n                    ></button>\n                  </div>\n                </div>\n              </div>\n            </div>\n\n            <div class=\"editorParamsToolbar hidden doorHangerRight\" id=\"editorFreeTextParamsToolbar\" [class.server-side-rendering]=\"serverSideRendering\">\n              <div class=\"editorParamsToolbarContainer\">\n                <div class=\"editorParamsSetter\">\n                  <label for=\"editorFreeTextColor\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-free-text-color-input\">Font Color</label>\n                  <input type=\"color\" id=\"editorFreeTextColor\" class=\"editorParamsColor\" />\n                </div>\n                <div class=\"editorParamsSetter\">\n                  <label for=\"editorFreeTextFontSize\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-free-text-size-input\">Font Size</label>\n                  <input type=\"range\" id=\"editorFreeTextFontSize\" class=\"editorParamsSlider\" value=\"10\" min=\"5\" max=\"100\" step=\"1\" />\n                </div>\n              </div>\n            </div>\n\n            <div class=\"editorParamsToolbar hidden doorHangerRight\" id=\"editorInkParamsToolbar\" [class.server-side-rendering]=\"serverSideRendering\">\n              <div class=\"editorParamsToolbarContainer\">\n                <div class=\"editorParamsSetter\">\n                  <label for=\"editorInkColor\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-ink-color-input\">Color</label>\n                  <input type=\"color\" id=\"editorInkColor\" class=\"editorParamsColor\" />\n                </div>\n                <div class=\"editorParamsSetter\">\n                  <label for=\"editorInkThickness\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-ink-thickness-input\">Thickness</label>\n                  <input type=\"range\" id=\"editorInkThickness\" class=\"editorParamsSlider\" value=\"1\" min=\"1\" max=\"20\" step=\"1\" />\n                </div>\n                <div class=\"editorParamsSetter\">\n                  <label for=\"editorInkOpacity\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-ink-opacity-input\">Opacity</label>\n                  <input type=\"range\" id=\"editorInkOpacity\" class=\"editorParamsSlider\" value=\"100\" min=\"1\" max=\"100\" step=\"1\" />\n                </div>\n              </div>\n            </div>\n\n            <pdf-secondary-toolbar\n              #pdfSecondaryToolbarComponent\n              [class.server-side-rendering]=\"serverSideRendering\"\n              [customSecondaryToolbar]=\"customSecondaryToolbar\"\n              [secondaryToolbarTop]=\"secondaryToolbarTop\"\n              [mobileFriendlyZoomScale]=\"mobileFriendlyZoomScale\"\n              (spreadChange)=\"onSpreadChange($event)\"\n              [localizationInitialized]=\"localizationInitialized\"\n            >\n            </pdf-secondary-toolbar>\n\n            <pdf-findbar\n              [class.server-side-rendering]=\"serverSideRendering\"\n              [findbarLeft]=\"findbarLeft\"\n              [findbarTop]=\"findbarTop\"\n              [mobileFriendlyZoomScale]=\"mobileFriendlyZoomScale\"\n              [showFindButton]=\"showFindButton || false\"\n              [customFindbarInputArea]=\"customFindbarInputArea\"\n              [customFindbarButtons]=\"customFindbarButtons\"\n              [showFindCurrentPageOnly]=\"showFindCurrentPageOnly\"\n              [showFindEntirePhrase]=\"showFindEntirePhrase\"\n              [showFindEntireWord]=\"showFindEntireWord\"\n              [showFindFuzzySearch]=\"showFindFuzzySearch\"\n              [showFindHighlightAll]=\"showFindHighlightAll\"\n              [showFindMatchDiacritics]=\"showFindMatchDiacritics\"\n              [showFindMatchCase]=\"showFindMatchCase\"\n              [showFindMessages]=\"showFindMessages\"\n              [showFindPageRange]=\"showFindPageRange\"\n              [showFindResultsCount]=\"showFindResultsCount\"\n            >\n            </pdf-findbar>\n\n            <pdf-context-menu></pdf-context-menu>\n\n            <div id=\"viewerContainer\" [style.top]=\"viewerPositionTop\" [style.backgroundColor]=\"backgroundColor\" role=\"document\">\n              <div class=\"unverified-signature-warning\" *ngIf=\"hasSignature && showUnverifiedSignatures\">\n                {{\n                  'unverified-signature-warning'\n                    | translate\n                      : \"This PDF file contains a digital signature. The PDF viewer can't verify if the signature is valid.\n                Please download the file and open it in Acrobat Reader to verify the signature is valid.\"\n                    | async\n                }}\n              </div>\n              <div id=\"viewer\" class=\"pdfViewer\" (dblclick)=\"zoomToPageWidth($event)\"></div>\n            </div>\n            <pdf-error-message></pdf-error-message>\n          </div>\n          <!-- mainContainer -->\n\n          <div id=\"dialogContainer\">\n            <pdf-password-dialog></pdf-password-dialog>\n            <pdf-document-properties-dialog></pdf-document-properties-dialog>\n            <pdf-alt-text-dialog></pdf-alt-text-dialog>\n            <pdf-prepare-printing-dialog></pdf-prepare-printing-dialog>\n          </div>\n          <!-- dialogContainer -->\n        </div>\n        <!-- outerContainer -->\n        <div id=\"printContainer\"></div>\n      </div>\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #defaultFreeFloatingBar> </ng-template>\n", styles: ["#mainContainer.toolbar-hidden{margin-top:-30px}.server-side-rendering,.hidden{display:none}\n"], dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i5.DynamicCssComponent, selector: "pdf-dynamic-css", inputs: ["zoom", "width"] }, { kind: "component", type: i6.PdfAcroformDefaultThemeComponent, selector: "pdf-acroform-default-theme" }, { kind: "component", type: i7.PdfContextMenuComponent, selector: "pdf-context-menu" }, { kind: "component", type: i8.PdfDarkThemeComponent, selector: "pdf-dark-theme" }, { kind: "component", type: i9.PdfAltTextDialogComponent, selector: "pdf-alt-text-dialog" }, { kind: "component", type: i10.PdfDocumentPropertiesDialogComponent, selector: "pdf-document-properties-dialog" }, { kind: "component", type: i11.PdfDummyComponentsComponent, selector: "pdf-dummy-components" }, { kind: "component", type: i12.PdfErrorMessageComponent, selector: "pdf-error-message" }, { kind: "component", type: i13.PdfFindbarComponent, selector: "pdf-findbar", inputs: ["showFindButton", "mobileFriendlyZoomScale", "findbarLeft", "findbarTop", "customFindbarInputArea", "customFindbar", "customFindbarButtons", "showFindHighlightAll", "showFindMatchCase", "showFindCurrentPageOnly", "showFindPageRange", "showFindEntireWord", "showFindEntirePhrase", "showFindMatchDiacritics", "showFindFuzzySearch", "showFindResultsCount", "showFindMessages"] }, { kind: "component", type: i14.PdfLightThemeComponent, selector: "pdf-light-theme" }, { kind: "component", type: i15.PdfPasswordDialogComponent, selector: "pdf-password-dialog" }, { kind: "component", type: i16.PdfPreparePrintingDialogComponent, selector: "pdf-prepare-printing-dialog" }, { kind: "component", type: i17.PdfSecondaryToolbarComponent, selector: "pdf-secondary-toolbar", inputs: ["customSecondaryToolbar", "secondaryToolbarTop", "mobileFriendlyZoomScale", "localizationInitialized"], outputs: ["spreadChange"] }, { kind: "component", type: i18.PdfSidebarComponent, selector: "pdf-sidebar", inputs: ["sidebarPositionTop", "sidebarVisible", "mobileFriendlyZoomScale", "showSidebarButton", "customSidebar", "customThumbnail"], outputs: ["thumbnailDrawn"] }, { kind: "component", type: i19.PdfToolbarComponent, selector: "pdf-toolbar", inputs: ["customToolbar", "mobileFriendlyZoomScale", "primaryMenuVisible", "showDownloadButton", "showDrawEditor", "showHighlightEditor", "showTextEditor", "showStampEditor", "showFindButton", "showHandToolButton", "handTool", "showOpenFileButton", "showPrintButton", "showPagingButtons", "showPresentationModeButton", "showRotateCwButton", "showRotateCcwButton", "showSecondaryToolbarButton", "showSidebarButton", "sidebarVisible", "showZoomButtons", "textLayer", "toolbarMarginTop", "toolbarWidth", "zoomLevels", "pageViewMode", "spread", "scrollMode", "showPropertiesButton", "showSpreadButton", "showSinglePageModeButton", "showVerticalScrollButton", "showHorizontalScrollButton", "showWrappedScrollButton", "showInfiniteScrollButton", "showBookModeButton", "findbarVisible"], outputs: ["pageViewModeChange", "onToolbarLoaded"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }, { kind: "pipe", type: i20.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: NgxExtendedPdfViewerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-extended-pdf-viewer', changeDetection: ChangeDetectionStrategy.OnPush, template: "<pdf-dark-theme *ngIf=\"theme === 'dark'\"></pdf-dark-theme>\n<pdf-light-theme *ngIf=\"theme === 'light'\"></pdf-light-theme>\n<pdf-acroform-default-theme></pdf-acroform-default-theme>\n\n<pdf-dynamic-css [zoom]=\"mobileFriendlyZoomScale\" [width]=\"toolbarWidthInPixels\"></pdf-dynamic-css>\n<ng-content *ngTemplateOutlet=\"customPdfViewer ? customPdfViewer : defaultPdfViewer\"></ng-content>\n\n<ng-template #defaultPdfViewer>\n  <div class=\"zoom\" [style.height]=\"minHeight ? minHeight : height\" #root>\n    <div class=\"html\">\n      <div class=\"body pdf-js-version-{{ majorMinorPdfJsVersion }}\" [style.backgroundColor]=\"backgroundColor\">\n        <div id=\"outerContainer\" (window:resize)=\"onResize()\">\n          <div class=\"free-floating-bar\" *ngIf=\"showFreeFloatingBar\">\n            <ng-content *ngTemplateOutlet=\"customFreeFloatingBar ? customFreeFloatingBar : defaultFreeFloatingBar\"> </ng-content>\n          </div>\n          <pdf-sidebar\n            #pdfsidebar\n            [sidebarVisible]=\"sidebarVisible || false\"\n            [showSidebarButton]=\"showSidebarButton\"\n            [customSidebar]=\"customSidebar\"\n            [customThumbnail]=\"customThumbnail\"\n            (thumbnailDrawn)=\"thumbnailDrawn.emit($event)\"\n            [mobileFriendlyZoomScale]=\"mobileFriendlyZoomScale\"\n            [sidebarPositionTop]=\"sidebarPositionTop\"\n          >\n          </pdf-sidebar>\n          <div id=\"mainContainer\" [class.toolbar-hidden]=\"!primaryMenuVisible\">\n            <pdf-dummy-components></pdf-dummy-components>\n\n            <pdf-toolbar\n              (onToolbarLoaded)=\"onToolbarLoaded($event)\"\n              [sidebarVisible]=\"sidebarVisible\"\n              [class.server-side-rendering]=\"serverSideRendering\"\n              [customToolbar]=\"customToolbar\"\n              [mobileFriendlyZoomScale]=\"mobileFriendlyZoomScale\"\n              [(pageViewMode)]=\"pageViewMode\"\n              [primaryMenuVisible]=\"primaryMenuVisible\"\n              [scrollMode]=\"scrollMode ?? 0\"\n              [showPropertiesButton]=\"showPropertiesButton\"\n              [showBookModeButton]=\"showBookModeButton\"\n              [showDownloadButton]=\"showDownloadButton\"\n              [showDrawEditor]=\"showDrawEditor\"\n              [showHighlightEditor]=\"showHighlightEditor\"\n              [showFindButton]=\"showFindButton\"\n              [showHandToolButton]=\"showHandToolButton\"\n              [handTool]=\"handTool\"\n              [showHorizontalScrollButton]=\"showHorizontalScrollButton\"\n              [showInfiniteScrollButton]=\"showInfiniteScrollButton\"\n              [showOpenFileButton]=\"showOpenFileButton\"\n              [showPagingButtons]=\"showPagingButtons\"\n              [showPresentationModeButton]=\"showPresentationModeButton && pageViewMode !== 'book'\"\n              [showPrintButton]=\"showPrintButton && enablePrint\"\n              [showRotateCwButton]=\"showRotateCwButton\"\n              [showRotateCcwButton]=\"showRotateCcwButton\"\n              [showSecondaryToolbarButton]=\"showSecondaryToolbarButton && !service.secondaryMenuIsEmpty\"\n              [showSidebarButton]=\"showSidebarButton\"\n              [showSinglePageModeButton]=\"showSinglePageModeButton\"\n              [showSpreadButton]=\"showSpreadButton\"\n              [showStampEditor]=\"showStampEditor\"\n              [showTextEditor]=\"showTextEditor\"\n              [showVerticalScrollButton]=\"showVerticalScrollButton\"\n              [showWrappedScrollButton]=\"showWrappedScrollButton\"\n              [showZoomButtons]=\"showZoomButtons && pageViewMode !== 'book'\"\n              [spread]=\"spread\"\n              [textLayer]=\"textLayer\"\n              [toolbarMarginTop]=\"toolbarMarginTop\"\n              [toolbarWidth]=\"toolbarWidth\"\n              [zoomLevels]=\"zoomLevels\"\n              [findbarVisible]=\"findbarVisible\"\n            ></pdf-toolbar>\n\n            <div class=\"editorParamsToolbar hidden doorHangerRight\" id=\"editorHighlightParamsToolbar\">\n              <div id=\"highlightParamsToolbarContainer\" class=\"editorParamsToolbarContainer\">\n                <div id=\"editorHighlightColorPicker\" class=\"colorPicker\">\n                  <span id=\"highlightColorPickerLabel\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-highlight-colorpicker-label\">Highlight color</span>\n                </div>\n                <div id=\"editorHighlightThickness\">\n                  <label for=\"editorFreeHighlightThickness\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-free-highlight-thickness-input\"\n                    >Thickness</label\n                  >\n                  <div class=\"thicknessPicker\">\n                    <input\n                      type=\"range\"\n                      id=\"editorFreeHighlightThickness\"\n                      class=\"editorParamsSlider\"\n                      data-l10n-id=\"pdfjs-editor-free-highlight-thickness-title\"\n                      value=\"12\"\n                      min=\"8\"\n                      max=\"24\"\n                      step=\"1\"\n                    />\n                  </div>\n                </div>\n                <div id=\"editorHighlightVisibility\">\n                  <div class=\"divider\"></div>\n                  <div class=\"toggler\">\n                    <label for=\"editorHighlightShowAll\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-highlight-show-all-button-label\">Show all</label>\n                    <button\n                      id=\"editorHighlightShowAll\"\n                      class=\"toggle-button\"\n                      data-l10n-id=\"pdfjs-editor-highlight-show-all-button\"\n                      aria-pressed=\"true\"\n                    ></button>\n                  </div>\n                </div>\n              </div>\n            </div>\n\n            <div class=\"editorParamsToolbar hidden doorHangerRight\" id=\"editorFreeTextParamsToolbar\" [class.server-side-rendering]=\"serverSideRendering\">\n              <div class=\"editorParamsToolbarContainer\">\n                <div class=\"editorParamsSetter\">\n                  <label for=\"editorFreeTextColor\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-free-text-color-input\">Font Color</label>\n                  <input type=\"color\" id=\"editorFreeTextColor\" class=\"editorParamsColor\" />\n                </div>\n                <div class=\"editorParamsSetter\">\n                  <label for=\"editorFreeTextFontSize\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-free-text-size-input\">Font Size</label>\n                  <input type=\"range\" id=\"editorFreeTextFontSize\" class=\"editorParamsSlider\" value=\"10\" min=\"5\" max=\"100\" step=\"1\" />\n                </div>\n              </div>\n            </div>\n\n            <div class=\"editorParamsToolbar hidden doorHangerRight\" id=\"editorInkParamsToolbar\" [class.server-side-rendering]=\"serverSideRendering\">\n              <div class=\"editorParamsToolbarContainer\">\n                <div class=\"editorParamsSetter\">\n                  <label for=\"editorInkColor\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-ink-color-input\">Color</label>\n                  <input type=\"color\" id=\"editorInkColor\" class=\"editorParamsColor\" />\n                </div>\n                <div class=\"editorParamsSetter\">\n                  <label for=\"editorInkThickness\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-ink-thickness-input\">Thickness</label>\n                  <input type=\"range\" id=\"editorInkThickness\" class=\"editorParamsSlider\" value=\"1\" min=\"1\" max=\"20\" step=\"1\" />\n                </div>\n                <div class=\"editorParamsSetter\">\n                  <label for=\"editorInkOpacity\" class=\"editorParamsLabel\" data-l10n-id=\"pdfjs-editor-ink-opacity-input\">Opacity</label>\n                  <input type=\"range\" id=\"editorInkOpacity\" class=\"editorParamsSlider\" value=\"100\" min=\"1\" max=\"100\" step=\"1\" />\n                </div>\n              </div>\n            </div>\n\n            <pdf-secondary-toolbar\n              #pdfSecondaryToolbarComponent\n              [class.server-side-rendering]=\"serverSideRendering\"\n              [customSecondaryToolbar]=\"customSecondaryToolbar\"\n              [secondaryToolbarTop]=\"secondaryToolbarTop\"\n              [mobileFriendlyZoomScale]=\"mobileFriendlyZoomScale\"\n              (spreadChange)=\"onSpreadChange($event)\"\n              [localizationInitialized]=\"localizationInitialized\"\n            >\n            </pdf-secondary-toolbar>\n\n            <pdf-findbar\n              [class.server-side-rendering]=\"serverSideRendering\"\n              [findbarLeft]=\"findbarLeft\"\n              [findbarTop]=\"findbarTop\"\n              [mobileFriendlyZoomScale]=\"mobileFriendlyZoomScale\"\n              [showFindButton]=\"showFindButton || false\"\n              [customFindbarInputArea]=\"customFindbarInputArea\"\n              [customFindbarButtons]=\"customFindbarButtons\"\n              [showFindCurrentPageOnly]=\"showFindCurrentPageOnly\"\n              [showFindEntirePhrase]=\"showFindEntirePhrase\"\n              [showFindEntireWord]=\"showFindEntireWord\"\n              [showFindFuzzySearch]=\"showFindFuzzySearch\"\n              [showFindHighlightAll]=\"showFindHighlightAll\"\n              [showFindMatchDiacritics]=\"showFindMatchDiacritics\"\n              [showFindMatchCase]=\"showFindMatchCase\"\n              [showFindMessages]=\"showFindMessages\"\n              [showFindPageRange]=\"showFindPageRange\"\n              [showFindResultsCount]=\"showFindResultsCount\"\n            >\n            </pdf-findbar>\n\n            <pdf-context-menu></pdf-context-menu>\n\n            <div id=\"viewerContainer\" [style.top]=\"viewerPositionTop\" [style.backgroundColor]=\"backgroundColor\" role=\"document\">\n              <div class=\"unverified-signature-warning\" *ngIf=\"hasSignature && showUnverifiedSignatures\">\n                {{\n                  'unverified-signature-warning'\n                    | translate\n                      : \"This PDF file contains a digital signature. The PDF viewer can't verify if the signature is valid.\n                Please download the file and open it in Acrobat Reader to verify the signature is valid.\"\n                    | async\n                }}\n              </div>\n              <div id=\"viewer\" class=\"pdfViewer\" (dblclick)=\"zoomToPageWidth($event)\"></div>\n            </div>\n            <pdf-error-message></pdf-error-message>\n          </div>\n          <!-- mainContainer -->\n\n          <div id=\"dialogContainer\">\n            <pdf-password-dialog></pdf-password-dialog>\n            <pdf-document-properties-dialog></pdf-document-properties-dialog>\n            <pdf-alt-text-dialog></pdf-alt-text-dialog>\n            <pdf-prepare-printing-dialog></pdf-prepare-printing-dialog>\n          </div>\n          <!-- dialogContainer -->\n        </div>\n        <!-- outerContainer -->\n        <div id=\"printContainer\"></div>\n      </div>\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #defaultFreeFloatingBar> </ng-template>\n", styles: ["#mainContainer.toolbar-hidden{margin-top:-30px}.server-side-rendering,.hidden{display:none}\n"] }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i1.PDFNotificationService }, { type: i0.ElementRef }, { type: i2.PlatformLocation }, { type: i0.ChangeDetectorRef }, { type: i3.NgxExtendedPdfViewerService }, { type: i0.Renderer2 }, { type: i4.PdfCspPolicyService }], propDecorators: { dummyComponents: [{
                type: ViewChild,
                args: [PdfDummyComponentsComponent]
            }], root: [{
                type: ViewChild,
                args: ['root']
            }], annotationEditorEvent: [{
                type: Output
            }], customFindbarInputArea: [{
                type: Input
            }], customToolbar: [{
                type: Input
            }], customFindbar: [{
                type: Input
            }], customFindbarButtons: [{
                type: Input
            }], customPdfViewer: [{
                type: Input
            }], customSecondaryToolbar: [{
                type: Input
            }], customSidebar: [{
                type: Input
            }], customThumbnail: [{
                type: Input
            }], customFreeFloatingBar: [{
                type: Input
            }], showFreeFloatingBar: [{
                type: Input
            }], enableDragAndDrop: [{
                type: Input
            }], formData: [{
                type: Input
            }], disableForms: [{
                type: Input
            }], formDataChange: [{
                type: Output
            }], pageViewMode: [{
                type: Input
            }], pageViewModeChange: [{
                type: Output
            }], progress: [{
                type: Output
            }], secondaryToolbarComponent: [{
                type: ViewChild,
                args: ['pdfSecondaryToolbarComponent']
            }], sidebarComponent: [{
                type: ViewChild,
                args: ['pdfsidebar']
            }], srcChange: [{
                type: Output
            }], scrollMode: [{
                type: Input
            }], scrollModeChange: [{
                type: Output
            }], authorization: [{
                type: Input
            }], httpHeaders: [{
                type: Input
            }], contextMenuAllowed: [{
                type: Input
            }], afterPrint: [{
                type: Output
            }], beforePrint: [{
                type: Output
            }], currentZoomFactor: [{
                type: Output
            }], enablePrint: [{
                type: Input
            }], showTextEditor: [{
                type: Input
            }], showStampEditor: [{
                type: Input
            }], showDrawEditor: [{
                type: Input
            }], showHighlightEditor: [{
                type: Input
            }], logLevel: [{
                type: Input
            }], relativeCoordsOptions: [{
                type: Input
            }], minifiedJSLibraries: [{
                type: Input
            }], printResolution: [{
                type: Input
            }], rotation: [{
                type: Input
            }], rotationChange: [{
                type: Output
            }], annotationLayerRendered: [{
                type: Output
            }], annotationEditorLayerRendered: [{
                type: Output
            }], xfaLayerRendered: [{
                type: Output
            }], outlineLoaded: [{
                type: Output
            }], attachmentsloaded: [{
                type: Output
            }], layersloaded: [{
                type: Output
            }], src: [{
                type: Input
            }], base64Src: [{
                type: Input
            }], minHeight: [{
                type: Input
            }], height: [{
                type: Input
            }], forceUsingLegacyES5: [{
                type: Input
            }], backgroundColor: [{
                type: Input
            }], filenameForDownload: [{
                type: Input
            }], ignoreKeyboard: [{
                type: Input
            }], ignoreKeys: [{
                type: Input
            }], acceptKeys: [{
                type: Input
            }], imageResourcesPath: [{
                type: Input
            }], localeFolderPath: [{
                type: Input
            }], language: [{
                type: Input
            }], listenToURL: [{
                type: Input
            }], nameddest: [{
                type: Input
            }], password: [{
                type: Input
            }], replaceBrowserPrint: [{
                type: Input
            }], showUnverifiedSignatures: [{
                type: Input
            }], startTabindex: [{
                type: Input
            }], showSidebarButton: [{
                type: Input
            }], sidebarVisible: [{
                type: Input
            }], sidebarVisibleChange: [{
                type: Output
            }], activeSidebarView: [{
                type: Input
            }], activeSidebarViewChange: [{
                type: Output
            }], findbarVisible: [{
                type: Input
            }], findbarVisibleChange: [{
                type: Output
            }], propertiesDialogVisible: [{
                type: Input
            }], propertiesDialogVisibleChange: [{
                type: Output
            }], showFindButton: [{
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
            }], showPagingButtons: [{
                type: Input
            }], showZoomButtons: [{
                type: Input
            }], showPresentationModeButton: [{
                type: Input
            }], showOpenFileButton: [{
                type: Input
            }], showPrintButton: [{
                type: Input
            }], showDownloadButton: [{
                type: Input
            }], theme: [{
                type: Input
            }], showToolbar: [{
                type: Input
            }], showSecondaryToolbarButton: [{
                type: Input
            }], showSinglePageModeButton: [{
                type: Input
            }], showVerticalScrollButton: [{
                type: Input
            }], showHorizontalScrollButton: [{
                type: Input
            }], showWrappedScrollButton: [{
                type: Input
            }], showInfiniteScrollButton: [{
                type: Input
            }], showBookModeButton: [{
                type: Input
            }], showRotateButton: [{
                type: Input
            }], showRotateCwButton: [{
                type: Input
            }], showRotateCcwButton: [{
                type: Input
            }], handTool: [{
                type: Input
            }], handToolChange: [{
                type: Output
            }], showHandToolButton: [{
                type: Input
            }], showScrollingButton: [{
                type: Input
            }], showSpreadButton: [{
                type: Input
            }], showPropertiesButton: [{
                type: Input
            }], showBorders: [{
                type: Input
            }], spread: [{
                type: Input
            }], spreadChange: [{
                type: Output
            }], thumbnailDrawn: [{
                type: Output
            }], page: [{
                type: Input
            }], pageChange: [{
                type: Output
            }], pageLabel: [{
                type: Input
            }], pageLabelChange: [{
                type: Output
            }], pagesLoaded: [{
                type: Output
            }], pageRender: [{
                type: Output
            }], pageRendered: [{
                type: Output
            }], pdfDownloaded: [{
                type: Output
            }], pdfLoaded: [{
                type: Output
            }], pdfLoadingStarts: [{
                type: Output
            }], pdfLoadingFailed: [{
                type: Output
            }], textLayer: [{
                type: Input
            }], textLayerRendered: [{
                type: Output
            }], annotationEditorModeChanged: [{
                type: Output
            }], updateFindMatchesCount: [{
                type: Output
            }], updateFindState: [{
                type: Output
            }], zoom: [{
                type: Input
            }], zoomChange: [{
                type: Output
            }], zoomLevels: [{
                type: Input
            }], maxZoom: [{
                type: Input
            }], minZoom: [{
                type: Input
            }], mobileFriendlyZoom: [{
                type: Input
            }], onContextMenu: [{
                type: HostListener,
                args: ['contextmenu']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci9zcmMvbGliL25neC1leHRlbmRlZC1wZGYtdmlld2VyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBb0IsTUFBTSxpQkFBaUIsQ0FBQztBQUN0RSxPQUFPLEVBQ0wsdUJBQXVCLEVBRXZCLFNBQVMsRUFFVCxZQUFZLEVBQ1osWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBS0wsTUFBTSxFQUNOLFdBQVcsRUFJWCxTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFtQnZCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDL0YsT0FBTyxFQUE0QyxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUloRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDM0QsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sdURBQXVELENBQUM7QUFJcEcsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQVd4QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztB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dGZvcm1Ccm93c2VyLCBQbGF0Zm9ybUxvY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGRmRG9jdW1lbnRMb2FkZWRFdmVudCB9IGZyb20gJy4vZXZlbnRzL2RvY3VtZW50LWxvYWRlZC1ldmVudCc7XG5pbXBvcnQgeyBGaWxlSW5wdXRDaGFuZ2VkIH0gZnJvbSAnLi9ldmVudHMvZmlsZS1pbnB1dC1jaGFuZ2VkJztcbmltcG9ydCB7IEZpbmRSZXN1bHQsIEZpbmRSZXN1bHRNYXRjaGVzQ291bnQsIEZpbmRTdGF0ZSB9IGZyb20gJy4vZXZlbnRzL2ZpbmQtcmVzdWx0JztcbmltcG9ydCB7IEhhbmR0b29sQ2hhbmdlZCB9IGZyb20gJy4vZXZlbnRzL2hhbmR0b29sLWNoYW5nZWQnO1xuaW1wb3J0IHsgUGFnZU51bWJlckNoYW5nZSB9IGZyb20gJy4vZXZlbnRzL3BhZ2UtbnVtYmVyLWNoYW5nZSc7XG5pbXBvcnQgeyBQYWdlUmVuZGVyRXZlbnQgfSBmcm9tICcuL2V2ZW50cy9wYWdlLXJlbmRlci1ldmVudCc7XG5pbXBvcnQgeyBQYWdlUmVuZGVyZWRFdmVudCB9IGZyb20gJy4vZXZlbnRzL3BhZ2UtcmVuZGVyZWQtZXZlbnQnO1xuaW1wb3J0IHsgUGFnZXNMb2FkZWRFdmVudCB9IGZyb20gJy4vZXZlbnRzL3BhZ2VzLWxvYWRlZC1ldmVudCc7XG5pbXBvcnQgeyBQYWdlc1JvdGF0aW9uRXZlbnQgfSBmcm9tICcuL2V2ZW50cy9wYWdlcy1yb3RhdGlvbi1ldmVudCc7XG5pbXBvcnQgeyBQZGZEb3dubG9hZGVkRXZlbnQgfSBmcm9tICcuL2V2ZW50cy9wZGYtZG93bmxvYWRlZC1ldmVudCc7XG5pbXBvcnQgeyBQZGZMb2FkZWRFdmVudCB9IGZyb20gJy4vZXZlbnRzL3BkZi1sb2FkZWQtZXZlbnQnO1xuaW1wb3J0IHsgUGRmTG9hZGluZ1N0YXJ0c0V2ZW50IH0gZnJvbSAnLi9ldmVudHMvcGRmLWxvYWRpbmctc3RhcnRzLWV2ZW50JztcbmltcG9ydCB7IFBkZlRodW1ibmFpbERyYXduRXZlbnQgfSBmcm9tICcuL2V2ZW50cy9wZGYtdGh1bWJuYWlsLWRyYXduLWV2ZW50JztcbmltcG9ydCB7IFByb2dyZXNzQmFyRXZlbnQgfSBmcm9tICcuL2V2ZW50cy9wcm9ncmVzcy1iYXItZXZlbnQnO1xuaW1wb3J0IHsgU2NhbGVDaGFuZ2luZ0V2ZW50IH0gZnJvbSAnLi9ldmVudHMvc2NhbGUtY2hhbmdpbmctZXZlbnQnO1xuaW1wb3J0IHsgU2lkZWJhcnZpZXdDaGFuZ2UgfSBmcm9tICcuL2V2ZW50cy9zaWRlYmFydmlldy1jaGFuZ2VkJztcbmltcG9ydCB7IFRleHRMYXllclJlbmRlcmVkRXZlbnQgfSBmcm9tICcuL2V2ZW50cy90ZXh0bGF5ZXItcmVuZGVyZWQnO1xuaW1wb3J0IHsgTmd4RXh0ZW5kZWRQZGZWaWV3ZXJTZXJ2aWNlIH0gZnJvbSAnLi9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBkZkN1cnNvclRvb2xzIH0gZnJvbSAnLi9vcHRpb25zL3BkZi1jdXJzb3ItdG9vbHMnO1xuaW1wb3J0IHsgYXNzZXRzVXJsLCBnZXRWZXJzaW9uU3VmZml4LCBwZGZEZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4vb3B0aW9ucy9wZGYtZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7IFBhZ2VWaWV3TW9kZVR5cGUsIFNjcm9sbE1vZGVDaGFuZ2VkRXZlbnQsIFNjcm9sbE1vZGVUeXBlIH0gZnJvbSAnLi9vcHRpb25zL3BkZi12aWV3ZXInO1xuaW1wb3J0IHsgSVBERlZpZXdlckFwcGxpY2F0aW9uLCBQREZEb2N1bWVudFByb3h5IH0gZnJvbSAnLi9vcHRpb25zL3BkZi12aWV3ZXItYXBwbGljYXRpb24nO1xuaW1wb3J0IHsgSVBERlZpZXdlckFwcGxpY2F0aW9uT3B0aW9ucyB9IGZyb20gJy4vb3B0aW9ucy9wZGYtdmlld2VyLWFwcGxpY2F0aW9uLW9wdGlvbnMnO1xuaW1wb3J0IHsgU2VydmljZVdvcmtlck9wdGlvbnNUeXBlIH0gZnJvbSAnLi9vcHRpb25zL3NlcnZpY2Utd29ya2VyLW9wdGlvbnMnO1xuaW1wb3J0IHsgVmVyYm9zaXR5TGV2ZWwgfSBmcm9tICcuL29wdGlvbnMvdmVyYm9zaXR5LWxldmVsJztcbmltcG9ydCB7IFBkZkR1bW15Q29tcG9uZW50c0NvbXBvbmVudCB9IGZyb20gJy4vcGRmLWR1bW15LWNvbXBvbmVudHMvcGRmLWR1bW15LWNvbXBvbmVudHMuY29tcG9uZW50JztcbmltcG9ydCB7IFBERk5vdGlmaWNhdGlvblNlcnZpY2UgfSBmcm9tICcuL3BkZi1ub3RpZmljYXRpb24tc2VydmljZSc7XG5pbXBvcnQgeyBQZGZTZWNvbmRhcnlUb29sYmFyQ29tcG9uZW50IH0gZnJvbSAnLi9zZWNvbmRhcnktdG9vbGJhci9wZGYtc2Vjb25kYXJ5LXRvb2xiYXIvcGRmLXNlY29uZGFyeS10b29sYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZTaWRlYmFyQ29tcG9uZW50IH0gZnJvbSAnLi9zaWRlYmFyL3BkZi1zaWRlYmFyL3BkZi1zaWRlYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBVbml0VG9QeCB9IGZyb20gJy4vdW5pdC10by1weCc7XG5cbmltcG9ydCB7IEFubm90YXRpb25FZGl0b3JFdmVudCB9IGZyb20gJy4vZXZlbnRzL2Fubm90YXRpb24tZWRpdG9yLWxheWVyLWV2ZW50JztcbmltcG9ydCB7IEFubm90YXRpb25FZGl0b3JMYXllclJlbmRlcmVkRXZlbnQgfSBmcm9tICcuL2V2ZW50cy9hbm5vdGF0aW9uLWVkaXRvci1sYXllci1yZW5kZXJlZC1ldmVudCc7XG5pbXBvcnQgeyBBbm5vdGF0aW9uRWRpdG9yRWRpdG9yTW9kZUNoYW5nZWRFdmVudCB9IGZyb20gJy4vZXZlbnRzL2Fubm90YXRpb24tZWRpdG9yLW1vZGUtY2hhbmdlZC1ldmVudCc7XG5pbXBvcnQgeyBBbm5vdGF0aW9uTGF5ZXJSZW5kZXJlZEV2ZW50IH0gZnJvbSAnLi9ldmVudHMvYW5ub3RhdGlvbi1sYXllci1yZW5kZXJlZC1ldmVudCc7XG5pbXBvcnQgeyBBdHRhY2htZW50TG9hZGVkRXZlbnQgfSBmcm9tICcuL2V2ZW50cy9hdHRhY2htZW50LWxvYWRlZC1ldmVudCc7XG5pbXBvcnQgeyBMYXllcnNMb2FkZWRFdmVudCB9IGZyb20gJy4vZXZlbnRzL2xheWVycy1sb2FkZWQtZXZlbnQnO1xuaW1wb3J0IHsgT3V0bGluZUxvYWRlZEV2ZW50IH0gZnJvbSAnLi9ldmVudHMvb3V0bGluZS1sb2FkZWQtZXZlbnQnO1xuaW1wb3J0IHsgVG9nZ2xlU2lkZWJhckV2ZW50IH0gZnJvbSAnLi9ldmVudHMvdG9nZ2xlLXNpZGViYXItZXZlbnQnO1xuaW1wb3J0IHsgWGZhTGF5ZXJSZW5kZXJlZEV2ZW50IH0gZnJvbSAnLi9ldmVudHMveGZhLWxheWVyLXJlbmRlcmVkLWV2ZW50JztcbmltcG9ydCB7IE5neEZvcm1TdXBwb3J0IH0gZnJvbSAnLi9uZ3gtZm9ybS1zdXBwb3J0JztcbmltcG9ydCB7IE5neENvbnNvbGUgfSBmcm9tICcuL29wdGlvbnMvbmd4LWNvbnNvbGUnO1xuaW1wb3J0IHsgUGRmU2lkZWJhclZpZXcgfSBmcm9tICcuL29wdGlvbnMvcGRmLXNpZGViYXItdmlld3MnO1xuaW1wb3J0IHsgU3ByZWFkVHlwZSB9IGZyb20gJy4vb3B0aW9ucy9zcHJlYWQtdHlwZSc7XG5pbXBvcnQgeyBQZGZDc3BQb2xpY3lTZXJ2aWNlIH0gZnJvbSAnLi9wZGYtY3NwLXBvbGljeS5zZXJ2aWNlJztcbmltcG9ydCB7IFJlc3BvbnNpdmVWaXNpYmlsaXR5IH0gZnJvbSAnLi9yZXNwb25zaXZlLXZpc2liaWxpdHknO1xuXG5kZWNsYXJlIGNvbnN0IFNlcnZpY2VXb3JrZXJPcHRpb25zOiBTZXJ2aWNlV29ya2VyT3B0aW9uc1R5cGU7IC8vIGRlZmluZWQgaW4gdmlld2VyLmpzXG5kZWNsYXJlIGNsYXNzIFJlc2l6ZU9ic2VydmVyIHtcbiAgY29uc3RydWN0b3IocGFyYW06ICgpID0+IHZvaWQpO1xuICBwdWJsaWMgb2JzZXJ2ZShkaXY6IEhUTUxFbGVtZW50KTtcbn1cblxuaW50ZXJmYWNlIEVsZW1lbnRBbmRQb3NpdGlvbiB7XG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGb3JtRGF0YVR5cGUge1xuICBbZmllbGROYW1lOiBzdHJpbmddOiBudWxsIHwgc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHN0cmluZ1tdO1xufVxuXG5mdW5jdGlvbiBpc0lPUygpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gc2VydmVyLXNpZGUgcmVuZGVyaW5nXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiAoXG4gICAgWydpUGFkIFNpbXVsYXRvcicsICdpUGhvbmUgU2ltdWxhdG9yJywgJ2lQb2QgU2ltdWxhdG9yJywgJ2lQYWQnLCAnaVBob25lJywgJ2lQb2QnXS5pbmNsdWRlcyhuYXZpZ2F0b3IucGxhdGZvcm0pIHx8XG4gICAgLy8gaVBhZCBvbiBpT1MgMTMgZGV0ZWN0aW9uXG4gICAgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5jbHVkZXMoJ01hYycpICYmICdvbnRvdWNoZW5kJyBpbiBkb2N1bWVudClcbiAgKTtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci5jb21wb25lbnQuY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hFeHRlbmRlZFBkZlZpZXdlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIHN0YXRpYyBvcmlnaW5hbFByaW50ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cucHJpbnQgOiB1bmRlZmluZWQ7XG5cbiAgcHJpdmF0ZSBQREZWaWV3ZXJBcHBsaWNhdGlvbiE6IElQREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgcHJpdmF0ZSBQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnMhOiBJUERGVmlld2VyQXBwbGljYXRpb25PcHRpb25zO1xuICBwcml2YXRlIFBERlZpZXdlckFwcGxpY2F0aW9uQ29uc3RhbnRzOiBhbnk7XG4gIHByaXZhdGUgd2ViVmlld2VyTG9hZDogKCkgPT4gdm9pZDtcblxuICBwdWJsaWMgbmd4RXh0ZW5kZWRQZGZWaWV3ZXJJbmNvbXBsZXRlbHlJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgcHJpdmF0ZSBmb3JtU3VwcG9ydCA9IG5ldyBOZ3hGb3JtU3VwcG9ydCgpO1xuXG4gIC8qKlxuICAgKiBUaGUgZHVtbXkgY29tcG9uZW50cyBhcmUgaW5zZXJ0ZWQgYXV0b21hdGljYWxseSB3aGVuIHRoZSB1c2VyIGN1c3RvbWl6ZXMgdGhlIHRvb2xiYXJcbiAgICogd2l0aG91dCBhZGRpbmcgZXZlcnkgb3JpZ2luYWwgdG9vbGJhciBpdGVtLiBXaXRob3V0IHRoZSBkdW1teSBjb21wb25lbnRzLCB0aGVcbiAgICogaW5pdGlhbGl6YXRpb24gY29kZSBvZiBwZGYuanMgY3Jhc2hlcyBiZWNhdXNlIGl0IGFzc3VtZSB0aGF0IGV2ZXJ5IHN0YW5kYXJkIHdpZGdldCBpcyB0aGVyZS5cbiAgICovXG4gIEBWaWV3Q2hpbGQoUGRmRHVtbXlDb21wb25lbnRzQ29tcG9uZW50KVxuICBwdWJsaWMgZHVtbXlDb21wb25lbnRzOiBQZGZEdW1teUNvbXBvbmVudHNDb21wb25lbnQ7XG5cbiAgQFZpZXdDaGlsZCgncm9vdCcpXG4gIHB1YmxpYyByb290OiBFbGVtZW50UmVmO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgYW5ub3RhdGlvbkVkaXRvckV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjxBbm5vdGF0aW9uRWRpdG9yRXZlbnQ+KCk7XG4gIC8qIFVJIHRlbXBsYXRlcyAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgY3VzdG9tRmluZGJhcklucHV0QXJlYTogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgY3VzdG9tVG9vbGJhcjogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgY3VzdG9tRmluZGJhcjogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgY3VzdG9tRmluZGJhckJ1dHRvbnM6IFRlbXBsYXRlUmVmPGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGN1c3RvbVBkZlZpZXdlcjogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgY3VzdG9tU2Vjb25kYXJ5VG9vbGJhcjogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgY3VzdG9tU2lkZWJhcjogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgY3VzdG9tVGh1bWJuYWlsOiBUZW1wbGF0ZVJlZjxhbnk+IHwgdW5kZWZpbmVkO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBjdXN0b21GcmVlRmxvYXRpbmdCYXI6IFRlbXBsYXRlUmVmPGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dGcmVlRmxvYXRpbmdCYXIgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBlbmFibGVEcmFnQW5kRHJvcCA9IHRydWU7XG5cbiAgcHVibGljIGxvY2FsaXphdGlvbkluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSB3aW5kb3dTaXplUmVjYWxjdWxhdG9yU3Vic2NyaXB0aW9uOiBhbnk7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNldCBmb3JtRGF0YShmb3JtRGF0YTogRm9ybURhdGFUeXBlKSB7XG4gICAgdGhpcy5mb3JtU3VwcG9ydC5mb3JtRGF0YSA9IGZvcm1EYXRhO1xuICB9XG5cbiAgQElucHV0KClcbiAgcHVibGljIGRpc2FibGVGb3JtcyA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgZ2V0IGZvcm1EYXRhQ2hhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm1TdXBwb3J0LmZvcm1EYXRhQ2hhbmdlO1xuICB9XG5cbiAgcHVibGljIF9wYWdlVmlld01vZGU6IFBhZ2VWaWV3TW9kZVR5cGUgPSAnbXVsdGlwbGUnO1xuXG4gIHB1YmxpYyBiYXNlSHJlZjogc3RyaW5nO1xuXG4gIC8qKiBUaGlzIGZsYWcgcHJldmVudHMgdHJ5aW5nIHRvIGxvYWQgYSBmaWxlIHR3aWNlIGlmIHRoZSB1c2VyIHVwbG9hZHMgaXQgdXNpbmcgdGhlIGZpbGUgdXBsb2FkIGRpYWxvZyBvciB2aWEgZHJhZyduJ2Ryb3AgKi9cbiAgcHJpdmF0ZSBzcmNDaGFuZ2VUcmlnZ2VyZWRCeVVzZXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwdWJsaWMgZ2V0IHBhZ2VWaWV3TW9kZSgpOiBQYWdlVmlld01vZGVUeXBlIHtcbiAgICByZXR1cm4gdGhpcy5fcGFnZVZpZXdNb2RlO1xuICB9XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNldCBwYWdlVmlld01vZGUodmlld01vZGU6IFBhZ2VWaWV3TW9kZVR5cGUpIHtcbiAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgY29uc3QgaGFzQ2hhbmdlZCA9IHRoaXMuX3BhZ2VWaWV3TW9kZSAhPT0gdmlld01vZGU7XG4gICAgICBpZiAoaGFzQ2hhbmdlZCkge1xuICAgICAgICBjb25zdCBtdXN0UmVkcmF3ID0gIXRoaXMubmd4RXh0ZW5kZWRQZGZWaWV3ZXJJbmNvbXBsZXRlbHlJbml0aWFsaXplZCAmJiAodGhpcy5fcGFnZVZpZXdNb2RlID09PSAnYm9vaycgfHwgdmlld01vZGUgPT09ICdib29rJyk7XG4gICAgICAgIHRoaXMuX3BhZ2VWaWV3TW9kZSA9IHZpZXdNb2RlO1xuICAgICAgICB0aGlzLnBhZ2VWaWV3TW9kZUNoYW5nZS5lbWl0KHRoaXMuX3BhZ2VWaWV3TW9kZSk7XG4gICAgICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uT3B0aW9uczogSVBERlZpZXdlckFwcGxpY2F0aW9uT3B0aW9ucyA9IHRoaXMuUERGVmlld2VyQXBwbGljYXRpb25PcHRpb25zO1xuICAgICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnM/LnNldCgncGFnZVZpZXdNb2RlJywgdGhpcy5wYWdlVmlld01vZGUpO1xuICAgICAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICAgICAgaWYgKFBERlZpZXdlckFwcGxpY2F0aW9uKSB7XG4gICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLnBhZ2VWaWV3TW9kZSA9IHRoaXMuX3BhZ2VWaWV3TW9kZTtcbiAgICAgICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5maW5kQ29udHJvbGxlci5wYWdlVmlld01vZGUgPSB0aGlzLl9wYWdlVmlld01vZGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZpZXdNb2RlID09PSAnaW5maW5pdGUtc2Nyb2xsJykge1xuICAgICAgICAgIGlmICh0aGlzLnNjcm9sbE1vZGUgPT09IFNjcm9sbE1vZGVUeXBlLnBhZ2UgfHwgdGhpcy5zY3JvbGxNb2RlID09PSBTY3JvbGxNb2RlVHlwZS5ob3Jpem9udGFsKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbE1vZGUgPSBTY3JvbGxNb2RlVHlwZS52ZXJ0aWNhbDtcbiAgICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLmRpc3BhdGNoKCdzd2l0Y2hzY3JvbGxtb2RlJywgeyBtb2RlOiBOdW1iZXIodGhpcy5zY3JvbGxNb2RlKSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5yZW1vdmVTY3JvbGxiYXJJbkluZmluaXRlU2Nyb2xsTW9kZShmYWxzZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodmlld01vZGUgIT09ICdtdWx0aXBsZScpIHtcbiAgICAgICAgICB0aGlzLnNjcm9sbE1vZGUgPSBTY3JvbGxNb2RlVHlwZS52ZXJ0aWNhbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5zY3JvbGxNb2RlID09PSBTY3JvbGxNb2RlVHlwZS5wYWdlKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbE1vZGUgPSBTY3JvbGxNb2RlVHlwZS52ZXJ0aWNhbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5yZW1vdmVTY3JvbGxiYXJJbkluZmluaXRlU2Nyb2xsTW9kZSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmlld01vZGUgPT09ICdzaW5nbGUnKSB7XG4gICAgICAgICAgLy8gc2luY2UgcGRmLmpzLCBvdXIgY3VzdG9tIHNpbmdsZS1wYWdlLW1vZGUgaGFzIGJlZW4gcmVwbGFjZWQgYnkgdGhlIHN0YW5kYXJkIHNjcm9sbE1vZGU9XCJwYWdlXCJcbiAgICAgICAgICB0aGlzLnNjcm9sbE1vZGUgPSBTY3JvbGxNb2RlVHlwZS5wYWdlO1xuICAgICAgICAgIHRoaXMuX3BhZ2VWaWV3TW9kZSA9IHZpZXdNb2RlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2aWV3TW9kZSA9PT0gJ2Jvb2snKSB7XG4gICAgICAgICAgdGhpcy5zaG93Qm9yZGVycyA9IGZhbHNlO1xuICAgICAgICAgIGlmICh0aGlzLnNjcm9sbE1vZGUgIT09IFNjcm9sbE1vZGVUeXBlLnZlcnRpY2FsKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbE1vZGUgPSBTY3JvbGxNb2RlVHlwZS52ZXJ0aWNhbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG11c3RSZWRyYXcpIHtcbiAgICAgICAgICBpZiAodmlld01vZGUgIT09ICdib29rJykge1xuICAgICAgICAgICAgY29uc3Qgbmd4ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCB2aWV3ZXJDb250YWluZXIgPSBuZ3gucXVlcnlTZWxlY3RvcignI3ZpZXdlckNvbnRhaW5lcicpIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgICAgICAgICAgdmlld2VyQ29udGFpbmVyLnN0eWxlLndpZHRoID0gJyc7XG4gICAgICAgICAgICB2aWV3ZXJDb250YWluZXIuc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgICAgICAgIHZpZXdlckNvbnRhaW5lci5zdHlsZS5tYXJnaW5SaWdodCA9ICcnO1xuICAgICAgICAgICAgdmlld2VyQ29udGFpbmVyLnN0eWxlLm1hcmdpbkxlZnQgPSAnJztcbiAgICAgICAgICAgIGNvbnN0IHZpZXdlciA9IG5neC5xdWVyeVNlbGVjdG9yKCcjdmlld2VyJykgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICAgICAgICB2aWV3ZXIuc3R5bGUubWF4V2lkdGggPSAnJztcbiAgICAgICAgICAgIHZpZXdlci5zdHlsZS5taW5XaWR0aCA9ICcnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMub3BlblBERjIoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgcGFnZVZpZXdNb2RlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxQYWdlVmlld01vZGVUeXBlPigpO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgcHJvZ3Jlc3MgPSBuZXcgRXZlbnRFbWl0dGVyPFByb2dyZXNzQmFyRXZlbnQ+KCk7XG5cbiAgQFZpZXdDaGlsZCgncGRmU2Vjb25kYXJ5VG9vbGJhckNvbXBvbmVudCcpXG4gIHByaXZhdGUgc2Vjb25kYXJ5VG9vbGJhckNvbXBvbmVudDogUGRmU2Vjb25kYXJ5VG9vbGJhckNvbXBvbmVudDtcblxuICBAVmlld0NoaWxkKCdwZGZzaWRlYmFyJylcbiAgcHJpdmF0ZSBzaWRlYmFyQ29tcG9uZW50OiBQZGZTaWRlYmFyQ29tcG9uZW50O1xuXG4gIC8qIHJlZ3VsYXIgYXR0cmlidXRlcyAqL1xuXG4gIHByaXZhdGUgX3NyYzogc3RyaW5nIHwgQXJyYXlCdWZmZXIgfCBVaW50OEFycmF5IHwgeyByYW5nZTogYW55IH0gfCB1bmRlZmluZWQ7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBzcmNDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBwcml2YXRlIF9zY3JvbGxNb2RlOiBTY3JvbGxNb2RlVHlwZSA9IFNjcm9sbE1vZGVUeXBlLnZlcnRpY2FsO1xuXG4gIHB1YmxpYyBnZXQgc2Nyb2xsTW9kZSgpOiBTY3JvbGxNb2RlVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1vZGU7XG4gIH1cblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2V0IHNjcm9sbE1vZGUodmFsdWU6IFNjcm9sbE1vZGVUeXBlKSB7XG4gICAgaWYgKHRoaXMuX3Njcm9sbE1vZGUgIT09IHZhbHVlKSB7XG4gICAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICAgIGlmIChQREZWaWV3ZXJBcHBsaWNhdGlvbj8ucGRmVmlld2VyKSB7XG4gICAgICAgIGlmIChQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIuc2Nyb2xsTW9kZSAhPT0gTnVtYmVyKHRoaXMuc2Nyb2xsTW9kZSkpIHtcbiAgICAgICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5kaXNwYXRjaCgnc3dpdGNoc2Nyb2xsbW9kZScsIHsgbW9kZTogTnVtYmVyKHRoaXMuc2Nyb2xsTW9kZSkgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuX3Njcm9sbE1vZGUgPSB2YWx1ZTtcbiAgICAgIGlmICh0aGlzLl9zY3JvbGxNb2RlID09PSBTY3JvbGxNb2RlVHlwZS5wYWdlKSB7XG4gICAgICAgIGlmICh0aGlzLnBhZ2VWaWV3TW9kZSAhPT0gJ3NpbmdsZScpIHtcbiAgICAgICAgICB0aGlzLl9wYWdlVmlld01vZGUgPSAnc2luZ2xlJztcbiAgICAgICAgICB0aGlzLnBhZ2VWaWV3TW9kZUNoYW5nZS5lbWl0KHRoaXMucGFnZVZpZXdNb2RlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhZ2VWaWV3TW9kZSA9PT0gJ3NpbmdsZScgfHwgdGhpcy5fc2Nyb2xsTW9kZSA9PT0gU2Nyb2xsTW9kZVR5cGUuaG9yaXpvbnRhbCkge1xuICAgICAgICB0aGlzLl9wYWdlVmlld01vZGUgPSAnbXVsdGlwbGUnO1xuICAgICAgICB0aGlzLnBhZ2VWaWV3TW9kZUNoYW5nZS5lbWl0KHRoaXMucGFnZVZpZXdNb2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBAT3V0cHV0KClcbiAgcHVibGljIHNjcm9sbE1vZGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFNjcm9sbE1vZGVUeXBlPigpO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBhdXRob3JpemF0aW9uOiBPYmplY3QgfCBib29sZWFuIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBodHRwSGVhZGVyczogT2JqZWN0IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBjb250ZXh0TWVudUFsbG93ZWQgPSB0cnVlO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgYWZ0ZXJQcmludCA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIGJlZm9yZVByaW50ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgY3VycmVudFpvb21GYWN0b3IgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAvKiogVGhpcyBmaWVsZCBzdG9yZXMgdGhlIHByZXZpb3VzIHpvb20gbGV2ZWwgaWYgdGhlIHBhZ2UgaXMgZW5sYXJnZWQgd2l0aCBhIGRvdWJsZS10YXAgb3IgZG91YmxlLWNsaWNrICovXG4gIHByaXZhdGUgcHJldmlvdXNab29tOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGVuYWJsZVByaW50ID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd1RleHRFZGl0b3I6IFJlc3BvbnNpdmVWaXNpYmlsaXR5ID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd1N0YW1wRWRpdG9yOiBSZXNwb25zaXZlVmlzaWJpbGl0eSA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dEcmF3RWRpdG9yOiBSZXNwb25zaXZlVmlzaWJpbGl0eSA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dIaWdobGlnaHRFZGl0b3I6IFJlc3BvbnNpdmVWaXNpYmlsaXR5ID0gdHJ1ZTtcblxuICAvKiogc3RvcmUgdGhlIHRpbWVvdXQgaWQgc28gaXQgY2FuIGJlIGNhbmNlbGVkIGlmIHVzZXIgbGVhdmVzIHRoZSBwYWdlIGJlZm9yZSB0aGUgUERGIGlzIHNob3duICovXG4gIHByaXZhdGUgaW5pdFRpbWVvdXQ6IGFueTtcblxuICAvKiogSG93IG1hbnkgbG9nIG1lc3NhZ2VzIHNob3VsZCBiZSBwcmludGVkP1xuICAgKiBMZWdhbCB2YWx1ZXM6IFZlcmJvc2l0eUxldmVsLklORk9TICg9IDUpLCBWZXJib3NpdHlMZXZlbC5XQVJOSU5HUyAoPSAxKSwgVmVyYm9zaXR5TGV2ZWwuRVJST1JTICg9IDApICovXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBsb2dMZXZlbCA9IFZlcmJvc2l0eUxldmVsLldBUk5JTkdTO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByZWxhdGl2ZUNvb3Jkc09wdGlvbnM6IE9iamVjdCA9IHt9O1xuXG4gIC8qKiBVc2UgdGhlIG1pbmlmaWVkIChtaW5pZmllZEpTTGlicmFyaWVzPVwidHJ1ZVwiLCB3aGljaCBpcyB0aGUgZGVmYXVsdCkgb3IgdGhlIHVzZXItcmVhZGFibGUgcGRmLmpzIGxpYnJhcnkgKG1pbmlmaWVkSlNMaWJyYXJpZXM9XCJmYWxzZVwiKSAqL1xuICBwcml2YXRlIF9taW5pZmllZEpTTGlicmFyaWVzID0gdHJ1ZTtcblxuICBwdWJsaWMgZ2V0IG1pbmlmaWVkSlNMaWJyYXJpZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21pbmlmaWVkSlNMaWJyYXJpZXM7XG4gIH1cblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2V0IG1pbmlmaWVkSlNMaWJyYXJpZXModmFsdWUpIHtcbiAgICB0aGlzLl9taW5pZmllZEpTTGlicmFyaWVzID0gdmFsdWU7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBwZGZEZWZhdWx0T3B0aW9ucy5faW50ZXJuYWxGaWxlbmFtZVN1ZmZpeCA9ICcubWluJztcbiAgICB9IGVsc2Uge1xuICAgICAgcGRmRGVmYXVsdE9wdGlvbnMuX2ludGVybmFsRmlsZW5hbWVTdWZmaXggPSAnJztcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcHJpbWFyeU1lbnVWaXNpYmxlID0gdHJ1ZTtcblxuICAvKiogb3B0aW9uIHRvIGluY3JlYXNlIChvciByZWR1Y2UpIHByaW50IHJlc29sdXRpb24uIERlZmF1bHQgaXMgMTUwIChkcGkpLiBTZW5zaWJsZSB2YWx1ZXNcbiAgICogYXJlIDMwMCwgNjAwLCBhbmQgMTIwMC4gTm90ZSB0aGUgaW5jcmVhc2UgbWVtb3J5IGNvbnN1bXB0aW9uLCB3aGljaCBtYXkgZXZlbiByZXN1bHQgaW4gYSBicm93c2VyIGNyYXNoLiAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgcHJpbnRSZXNvbHV0aW9uID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcm90YXRpb246IDAgfCA5MCB8IDE4MCB8IDI3MDtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHJvdGF0aW9uQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjwwIHwgOTAgfCAxODAgfCAyNzA+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBhbm5vdGF0aW9uTGF5ZXJSZW5kZXJlZCA9IG5ldyBFdmVudEVtaXR0ZXI8QW5ub3RhdGlvbkxheWVyUmVuZGVyZWRFdmVudD4oKTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIGFubm90YXRpb25FZGl0b3JMYXllclJlbmRlcmVkID0gbmV3IEV2ZW50RW1pdHRlcjxBbm5vdGF0aW9uRWRpdG9yTGF5ZXJSZW5kZXJlZEV2ZW50PigpO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgeGZhTGF5ZXJSZW5kZXJlZCA9IG5ldyBFdmVudEVtaXR0ZXI8WGZhTGF5ZXJSZW5kZXJlZEV2ZW50PigpO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgb3V0bGluZUxvYWRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8T3V0bGluZUxvYWRlZEV2ZW50PigpO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgYXR0YWNobWVudHNsb2FkZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEF0dGFjaG1lbnRMb2FkZWRFdmVudD4oKTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIGxheWVyc2xvYWRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8TGF5ZXJzTG9hZGVkRXZlbnQ+KCk7XG5cbiAgcHVibGljIGhhc1NpZ25hdHVyZTogYm9vbGVhbjtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2V0IHNyYyh1cmw6IHN0cmluZyB8IEFycmF5QnVmZmVyIHwgQmxvYiB8IFVpbnQ4QXJyYXkgfCBVUkwgfCB7IHJhbmdlOiBhbnkgfSkge1xuICAgIGlmICh1cmwgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICB0aGlzLl9zcmMgPSB1cmwuYnVmZmVyO1xuICAgIH0gZWxzZSBpZiAodXJsIGluc3RhbmNlb2YgVVJMKSB7XG4gICAgICB0aGlzLl9zcmMgPSB1cmwudG9TdHJpbmcoKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJyAmJiB1cmwgaW5zdGFuY2VvZiBCbG9iKSB7XG4gICAgICAvLyBhZGRpdGlvbmFsIGNoZWNrIGludHJvZHVjZWQgdG8gc3VwcG9ydCBzZXJ2ZXIgc2lkZSByZW5kZXJpbmdcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICByZWFkZXIub25sb2FkZW5kID0gKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnNyYyA9IG5ldyBVaW50OEFycmF5KHJlYWRlci5yZXN1bHQgYXMgQXJyYXlCdWZmZXIpO1xuICAgICAgICAgIGlmICh0aGlzLnNlcnZpY2Uubmd4RXh0ZW5kZWRQZGZWaWV3ZXJJbml0aWFsaXplZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMubmd4RXh0ZW5kZWRQZGZWaWV3ZXJJbmNvbXBsZXRlbHlJbml0aWFsaXplZCkge1xuICAgICAgICAgICAgICB0aGlzLm9wZW5QREYoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIChhc3luYyAoKSA9PiB0aGlzLm9wZW5QREYyKCkpKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbHNlIG9wZW5QREYgaXMgY2FsbGVkIGxhdGVyLCBzbyB3ZSBkbyBub3RoaW5nIHRvIHByZXZlbnQgbG9hZGluZyB0aGUgUERGIGZpbGUgdHdpY2VcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcih1cmwpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHVybCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX3NyYyA9IHVybDtcbiAgICAgIGlmICh1cmwubGVuZ3RoID4gOTgwKSB7XG4gICAgICAgIC8vIG1pbmltYWwgbGVuZ3RoIG9mIGEgYmFzZTY0IGVuY29kZWQgUERGXG4gICAgICAgIGlmICh1cmwubGVuZ3RoICUgNCA9PT0gMCkge1xuICAgICAgICAgIGlmICgvXlthLXpBLVpcXGQvK10rPXswLDJ9JC8udGVzdCh1cmwpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGUgVVJMIGxvb2tzIGxpa2UgYSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuIElmIHNvLCBwbGVhc2UgdXNlIHRoZSBhdHRyaWJ1dGUgW2Jhc2U2NFNyY10gaW5zdGVhZCBvZiBbc3JjXScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAodGhpcy5fc3JjIGFzIGFueSkgPSB1cmw7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNldCBiYXNlNjRTcmMoYmFzZTY0OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKSB7XG4gICAgaWYgKGJhc2U2NCkge1xuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIHNlcnZlci1zaWRlIHJlbmRlcmluZ1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBiaW5hcnlfc3RyaW5nID0gYXRvYihiYXNlNjQpO1xuICAgICAgY29uc3QgbGVuID0gYmluYXJ5X3N0cmluZy5sZW5ndGg7XG4gICAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbik7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGJ5dGVzW2ldID0gYmluYXJ5X3N0cmluZy5jaGFyQ29kZUF0KGkpO1xuICAgICAgfVxuICAgICAgdGhpcy5zcmMgPSBieXRlcy5idWZmZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NyYyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNvbWJpbmF0aW9uIG9mIGhlaWdodCwgbWluSGVpZ2h0LCBhbmQgYXV0b0hlaWdodCBlbnN1cmVzIHRoZSBQREYgaGVpZ2h0IG9mIHRoZSBQREYgdmlld2VyIGlzIGNhbGN1bGF0ZWQgY29ycmVjdGx5IHdoZW4gdGhlIGhlaWdodCBpcyBhIHBlcmNlbnRhZ2UuXG4gICAqIEJ5IGRlZmF1bHQsIG1hbnkgQ1NTIGZyYW1ld29ya3MgbWFrZSBhIGRpdiB3aXRoIDEwMCUgaGF2ZSBhIGhlaWdodCBvciB6ZXJvIHBpeGVscy4gY2hlY2tIZWlndGgoKSBmaXhlcyB0aGlzLlxuICAgKi9cbiAgcHJpdmF0ZSBhdXRvSGVpZ2h0ID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgcHVibGljIG1pbkhlaWdodDogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIHByaXZhdGUgX2hlaWdodDogc3RyaW5nIHwgdW5kZWZpbmVkID0gJzEwMCUnO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzZXQgaGVpZ2h0KGgpIHtcbiAgICB0aGlzLm1pbkhlaWdodCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmF1dG9IZWlnaHQgPSBmYWxzZTtcbiAgICBpZiAoaCkge1xuICAgICAgaWYgKGggPT09ICdhdXRvJykge1xuICAgICAgICB0aGlzLmF1dG9IZWlnaHQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9oZWlnaHQgPSB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9oZWlnaHQgPSBoO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhlaWdodCA9ICcxMDAlJztcbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmNoZWNrSGVpZ2h0KCk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICB9XG5cbiAgQElucHV0KClcbiAgcHVibGljIGZvcmNlVXNpbmdMZWdhY3lFUzUgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgYmFja2dyb3VuZENvbG9yID0gJyNlOGU4ZWInO1xuXG4gIC8qKiBBbGxvd3MgdGhlIHVzZXIgdG8gZGVmaW5lIHRoZSBuYW1lIG9mIHRoZSBmaWxlIGFmdGVyIGNsaWNraW5nIFwiZG93bmxvYWRcIiAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgZmlsZW5hbWVGb3JEb3dubG9hZDogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIC8qKiBBbGxvd3MgdGhlIHVzZXIgdG8gZGlzYWJsZSB0aGUga2V5Ym9hcmQgYmluZGluZ3MgY29tcGxldGVseSAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgaWdub3JlS2V5Ym9hcmQgPSBmYWxzZTtcblxuICAvKiogQWxsb3dzIHRoZSB1c2VyIHRvIGRpc2FibGUgYSBsaXN0IG9mIGtleSBiaW5kaW5ncy4gKi9cbiAgQElucHV0KClcbiAgcHVibGljIGlnbm9yZUtleXM6IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICAvKiogQWxsb3dzIHRoZSB1c2VyIHRvIGVuYWJsZSBhIGxpc3Qgb2Yga2V5IGJpbmRpbmdzIGV4cGxpY2l0bHkuIElmIHRoaXMgcHJvcGVydHkgaXMgc2V0LCBldmVyeSBvdGhlciBrZXkgYmluZGluZyBpcyBpZ25vcmVkLiAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgYWNjZXB0S2V5czogQXJyYXk8c3RyaW5nPiA9IFtdO1xuXG4gIC8qKiBBbGxvd3MgdGhlIHVzZXIgdG8gcHV0IHRoZSB2aWV3ZXIncyBzdmcgaW1hZ2VzIGludG8gYW4gYXJiaXRyYXJ5IGZvbGRlciAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgaW1hZ2VSZXNvdXJjZXNQYXRoID0gYXNzZXRzVXJsKHBkZkRlZmF1bHRPcHRpb25zLmFzc2V0c0ZvbGRlcikgKyAnL2ltYWdlcy8nO1xuXG4gIC8qKiBBbGxvd3MgdGhlIHVzZXIgdG8gcHV0IHRoZWlyIGxvY2FsZSBmb2xkZXIgaW50byBhbiBhcmJpdHJhcnkgZm9sZGVyICovXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBsb2NhbGVGb2xkZXJQYXRoID0gYXNzZXRzVXJsKHBkZkRlZmF1bHRPcHRpb25zLmFzc2V0c0ZvbGRlcikgKyAnL2xvY2FsZSc7XG5cbiAgLyoqIE92ZXJyaWRlIHRoZSBkZWZhdWx0IGxvY2FsZS4gVGhpcyBtdXN0IGJlIHRoZSBjb21wbGV0ZSBsb2NhbGUgbmFtZSwgc3VjaCBhcyBcImVzLUVTXCIuIFRoZSBzdHJpbmcgaXMgYWxsb3dlZCB0byBiZSBhbGwgbG93ZXJjYXNlLlxuICAgKi9cbiAgQElucHV0KClcbiAgcHVibGljIGxhbmd1YWdlOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgLyoqIEJ5IGRlZmF1bHQsIGxpc3RlbmluZyB0byB0aGUgVVJMIGlzIGRlYWN0aXZhdGVkIGJlY2F1c2Ugb2Z0ZW4gdGhlIGFuY2hvciB0YWcgaXMgdXNlZCBmb3IgdGhlIEFuZ3VsYXIgcm91dGVyICovXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBsaXN0ZW5Ub1VSTCA9IGZhbHNlO1xuXG4gIC8qKiBOYXZpZ2F0ZSB0byBhIGNlcnRhaW4gXCJuYW1lZCBkZXN0aW5hdGlvblwiICovXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBuYW1lZGRlc3Q6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICAvKiogYWxsb3dzIHlvdSB0byBwYXNzIGEgcGFzc3dvcmQgdG8gcmVhZCBwYXNzd29yZC1wcm90ZWN0ZWQgZmlsZXMgKi9cbiAgQElucHV0KClcbiAgcHVibGljIHBhc3N3b3JkOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJlcGxhY2VCcm93c2VyUHJpbnQgPSB0cnVlO1xuXG4gIHB1YmxpYyBfc2hvd1NpZGViYXJCdXR0b246IFJlc3BvbnNpdmVWaXNpYmlsaXR5ID0gdHJ1ZTtcblxuICBwdWJsaWMgdmlld2VyUG9zaXRpb25Ub3AgPSAnMzJweCc7XG5cbiAgLyoqIHBkZi5qcyBjYW4gc2hvdyBzaWduYXR1cmVzLCBidXQgZmFpbHMgdG8gdmVyaWZ5IHRoZW0uIFNvIHRoZXkgYXJlIHN3aXRjaGVkIG9mZiBieSBkZWZhdWx0LlxuICAgKiBTZXQgXCJbc2hvd1VudmVyaWZpZWRTaWduYXR1cmVzXVwiPVwidHJ1ZVwiIHRvIGRpc3BsYXkgZS1zaWduYXR1cmVzIG5vbmV0aGVsZXNzLlxuICAgKi9cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dVbnZlcmlmaWVkU2lnbmF0dXJlcyA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzdGFydFRhYmluZGV4OiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgcHVibGljIGdldCBzaG93U2lkZWJhckJ1dHRvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvd1NpZGViYXJCdXR0b247XG4gIH1cbiAgQElucHV0KClcbiAgcHVibGljIHNldCBzaG93U2lkZWJhckJ1dHRvbihzaG93OiBSZXNwb25zaXZlVmlzaWJpbGl0eSkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gc2VydmVyLXNpZGUgcmVuZGVyaW5nXG4gICAgICB0aGlzLl9zaG93U2lkZWJhckJ1dHRvbiA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9zaG93U2lkZWJhckJ1dHRvbiA9IHNob3c7XG4gICAgaWYgKHRoaXMuX3Nob3dTaWRlYmFyQnV0dG9uKSB7XG4gICAgICBjb25zdCBpc0lFID0gL21zaWVcXHN8dHJpZGVudFxcLy9pLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgbGV0IGZhY3RvciA9IDE7XG4gICAgICBpZiAoaXNJRSkge1xuICAgICAgICBmYWN0b3IgPSBOdW1iZXIoKHRoaXMuX21vYmlsZUZyaWVuZGx5Wm9vbSB8fCAnMTAwJykucmVwbGFjZSgnJScsICcnKSkgLyAxMDA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZmluZGJhckxlZnQgPSAoNjggKiBmYWN0b3IpLnRvU3RyaW5nKCkgKyAncHgnO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmZpbmRiYXJMZWZ0ID0gJzBweCc7XG4gIH1cblxuICBwcml2YXRlIF9zaWRlYmFyVmlzaWJsZTogYm9vbGVhbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgcHVibGljIGdldCBzaWRlYmFyVmlzaWJsZSgpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fc2lkZWJhclZpc2libGU7XG4gIH1cbiAgQElucHV0KClcbiAgcHVibGljIHNldCBzaWRlYmFyVmlzaWJsZSh2YWx1ZTogYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fc2lkZWJhclZpc2libGUpIHtcbiAgICAgIHRoaXMuc2lkZWJhclZpc2libGVDaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gICAgfVxuICAgIHRoaXMuX3NpZGViYXJWaXNpYmxlID0gdmFsdWU7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9IHRoaXMuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgaWYgKFBERlZpZXdlckFwcGxpY2F0aW9uPy5wZGZTaWRlYmFyKSB7XG4gICAgICBpZiAodGhpcy5zaWRlYmFyVmlzaWJsZSkge1xuICAgICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZTaWRlYmFyLm9wZW4oKTtcbiAgICAgICAgY29uc3QgdmlldyA9IE51bWJlcih0aGlzLmFjdGl2ZVNpZGViYXJWaWV3KTtcbiAgICAgICAgaWYgKHZpZXcgPT09IDEgfHwgdmlldyA9PT0gMiB8fCB2aWV3ID09PSAzIHx8IHZpZXcgPT09IDQpIHtcbiAgICAgICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZTaWRlYmFyLnN3aXRjaFZpZXcodmlldywgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignW2FjdGl2ZVNpZGViYXJWaWV3XSBtdXN0IGJlIGFuIGludGVnZXIgdmFsdWUgYmV0d2VlbiAxIGFuZCA0Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlNpZGViYXIuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBAT3V0cHV0KClcbiAgcHVibGljIHNpZGViYXJWaXNpYmxlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBhY3RpdmVTaWRlYmFyVmlldzogUGRmU2lkZWJhclZpZXcgPSBQZGZTaWRlYmFyVmlldy5PVVRMSU5FO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgYWN0aXZlU2lkZWJhclZpZXdDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFBkZlNpZGViYXJWaWV3PigpO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBmaW5kYmFyVmlzaWJsZSA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgZmluZGJhclZpc2libGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHByb3BlcnRpZXNEaWFsb2dWaXNpYmxlID0gZmFsc2U7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBwcm9wZXJ0aWVzRGlhbG9nVmlzaWJsZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd0ZpbmRCdXR0b246IFJlc3BvbnNpdmVWaXNpYmlsaXR5IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93RmluZEhpZ2hsaWdodEFsbCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dGaW5kTWF0Y2hDYXNlID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd0ZpbmRDdXJyZW50UGFnZU9ubHkgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93RmluZFBhZ2VSYW5nZSA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dGaW5kRW50aXJlV29yZCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dGaW5kRW50aXJlUGhyYXNlID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd0ZpbmRNYXRjaERpYWNyaXRpY3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93RmluZEZ1enp5U2VhcmNoID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd0ZpbmRSZXN1bHRzQ291bnQgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93RmluZE1lc3NhZ2VzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd1BhZ2luZ0J1dHRvbnM6IFJlc3BvbnNpdmVWaXNpYmlsaXR5ID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd1pvb21CdXR0b25zOiBSZXNwb25zaXZlVmlzaWJpbGl0eSA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dQcmVzZW50YXRpb25Nb2RlQnV0dG9uOiBSZXNwb25zaXZlVmlzaWJpbGl0eSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93T3BlbkZpbGVCdXR0b246IFJlc3BvbnNpdmVWaXNpYmlsaXR5ID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd1ByaW50QnV0dG9uOiBSZXNwb25zaXZlVmlzaWJpbGl0eSA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dEb3dubG9hZEJ1dHRvbjogUmVzcG9uc2l2ZVZpc2liaWxpdHkgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyB0aGVtZTogJ2RhcmsnIHwgJ2xpZ2h0JyB8ICdjdXN0b20nIHwgc3RyaW5nID0gJ2xpZ2h0JztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd1Rvb2xiYXIgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93U2Vjb25kYXJ5VG9vbGJhckJ1dHRvbjogUmVzcG9uc2l2ZVZpc2liaWxpdHkgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93U2luZ2xlUGFnZU1vZGVCdXR0b246IFJlc3BvbnNpdmVWaXNpYmlsaXR5ID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd1ZlcnRpY2FsU2Nyb2xsQnV0dG9uOiBSZXNwb25zaXZlVmlzaWJpbGl0eSA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dIb3Jpem9udGFsU2Nyb2xsQnV0dG9uOiBSZXNwb25zaXZlVmlzaWJpbGl0eSA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dXcmFwcGVkU2Nyb2xsQnV0dG9uOiBSZXNwb25zaXZlVmlzaWJpbGl0eSA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dJbmZpbml0ZVNjcm9sbEJ1dHRvbjogUmVzcG9uc2l2ZVZpc2liaWxpdHkgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93Qm9va01vZGVCdXR0b246IFJlc3BvbnNpdmVWaXNpYmlsaXR5ID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2V0IHNob3dSb3RhdGVCdXR0b24odmlzaWJpbGl0eTogUmVzcG9uc2l2ZVZpc2liaWxpdHkpIHtcbiAgICB0aGlzLnNob3dSb3RhdGVDd0J1dHRvbiA9IHZpc2liaWxpdHk7XG4gICAgdGhpcy5zaG93Um90YXRlQ2N3QnV0dG9uID0gdmlzaWJpbGl0eTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93Um90YXRlQ3dCdXR0b246IFJlc3BvbnNpdmVWaXNpYmlsaXR5ID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd1JvdGF0ZUNjd0J1dHRvbjogUmVzcG9uc2l2ZVZpc2liaWxpdHkgPSB0cnVlO1xuXG4gIHByaXZhdGUgX2hhbmRUb29sID0gIWlzSU9TKCk7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNldCBoYW5kVG9vbChoYW5kVG9vbDogYm9vbGVhbikge1xuICAgIGlmIChpc0lPUygpICYmIGhhbmRUb29sKSB7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgXCJPbiBpT1MsIHRoZSBoYW5kdG9vbCBkb2Vzbid0IHdvcmsgcmVsaWFibHkuIFBsdXMsIHlvdSBkb24ndCBuZWVkIGl0IGJlY2F1c2UgdG91Y2ggZ2VzdHVyZXMgYWxsb3cgeW91IHRvIGRpc3Rpbmd1aXNoIGVhc2lseSBiZXR3ZWVuIHN3aXBpbmcgYW5kIHNlbGVjdGluZyB0ZXh0LiBUaGVyZWZvcmUsIHRoZSBsaWJyYXJ5IGlnbm9yZXMgeW91ciBzZXR0aW5nLlwiXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9oYW5kVG9vbCA9IGhhbmRUb29sO1xuICB9XG5cbiAgcHVibGljIGdldCBoYW5kVG9vbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faGFuZFRvb2w7XG4gIH1cblxuICBAT3V0cHV0KClcbiAgcHVibGljIGhhbmRUb29sQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93SGFuZFRvb2xCdXR0b246IFJlc3BvbnNpdmVWaXNpYmlsaXR5ID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfc2hvd1Njcm9sbGluZ0J1dHRvbjogUmVzcG9uc2l2ZVZpc2liaWxpdHkgPSB0cnVlO1xuXG4gIHB1YmxpYyBnZXQgc2hvd1Njcm9sbGluZ0J1dHRvbigpIHtcbiAgICBpZiAodGhpcy5wYWdlVmlld01vZGUgPT09ICdtdWx0aXBsZScpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zaG93U2Nyb2xsaW5nQnV0dG9uO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2V0IHNob3dTY3JvbGxpbmdCdXR0b24odmFsOiBSZXNwb25zaXZlVmlzaWJpbGl0eSkge1xuICAgIHRoaXMuX3Nob3dTY3JvbGxpbmdCdXR0b24gPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd1NwcmVhZEJ1dHRvbjogUmVzcG9uc2l2ZVZpc2liaWxpdHkgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93UHJvcGVydGllc0J1dHRvbjogUmVzcG9uc2l2ZVZpc2liaWxpdHkgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93Qm9yZGVycyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNwcmVhZDogU3ByZWFkVHlwZTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHNwcmVhZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8J29mZicgfCAnZXZlbicgfCAnb2RkJz4oKTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHRodW1ibmFpbERyYXduID0gbmV3IEV2ZW50RW1pdHRlcjxQZGZUaHVtYm5haWxEcmF3bkV2ZW50PigpO1xuXG4gIHByaXZhdGUgX3BhZ2U6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICBwdWJsaWMgZ2V0IHBhZ2UoKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fcGFnZTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzZXQgcGFnZShwOiBudW1iZXIgfCB1bmRlZmluZWQpIHtcbiAgICBpZiAocCkge1xuICAgICAgLy8gc2lsZW50bHkgY29wZSB3aXRoIHN0cmluZ3NcbiAgICAgIHRoaXMuX3BhZ2UgPSBOdW1iZXIocCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3BhZ2UgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBwYWdlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXIgfCB1bmRlZmluZWQ+KCk7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHBhZ2VMYWJlbDogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgcGFnZUxhYmVsQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmcgfCB1bmRlZmluZWQ+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBwYWdlc0xvYWRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8UGFnZXNMb2FkZWRFdmVudD4oKTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHBhZ2VSZW5kZXIgPSBuZXcgRXZlbnRFbWl0dGVyPFBhZ2VSZW5kZXJFdmVudD4oKTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHBhZ2VSZW5kZXJlZCA9IG5ldyBFdmVudEVtaXR0ZXI8UGFnZVJlbmRlcmVkRXZlbnQ+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBwZGZEb3dubG9hZGVkID0gbmV3IEV2ZW50RW1pdHRlcjxQZGZEb3dubG9hZGVkRXZlbnQ+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBwZGZMb2FkZWQgPSBuZXcgRXZlbnRFbWl0dGVyPFBkZkxvYWRlZEV2ZW50PigpO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgcGRmTG9hZGluZ1N0YXJ0cyA9IG5ldyBFdmVudEVtaXR0ZXI8UGRmTG9hZGluZ1N0YXJ0c0V2ZW50PigpO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgcGRmTG9hZGluZ0ZhaWxlZCA9IG5ldyBFdmVudEVtaXR0ZXI8RXJyb3I+KCk7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHRleHRMYXllcjogYm9vbGVhbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHRleHRMYXllclJlbmRlcmVkID0gbmV3IEV2ZW50RW1pdHRlcjxUZXh0TGF5ZXJSZW5kZXJlZEV2ZW50PigpO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgYW5ub3RhdGlvbkVkaXRvck1vZGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxBbm5vdGF0aW9uRWRpdG9yRWRpdG9yTW9kZUNoYW5nZWRFdmVudD4oKTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHVwZGF0ZUZpbmRNYXRjaGVzQ291bnQgPSBuZXcgRXZlbnRFbWl0dGVyPEZpbmRSZXN1bHRNYXRjaGVzQ291bnQ+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyB1cGRhdGVGaW5kU3RhdGUgPSBuZXcgRXZlbnRFbWl0dGVyPEZpbmRTdGF0ZT4oKTtcblxuICAvKiogTGVnYWwgdmFsdWVzOiB1bmRlZmluZWQsICdhdXRvJywgJ3BhZ2UtYWN0dWFsJywgJ3BhZ2UtZml0JywgJ3BhZ2Utd2lkdGgnLCBvciAnNTAnIChvciBhbnkgb3RoZXIgcGVyY2VudGFnZSkgKi9cbiAgQElucHV0KClcbiAgcHVibGljIHpvb206IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHpvb21DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZD4oKTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgem9vbUxldmVscyA9IFsnYXV0bycsICdwYWdlLWFjdHVhbCcsICdwYWdlLWZpdCcsICdwYWdlLXdpZHRoJywgMC41LCAxLCAxLjI1LCAxLjUsIDIsIDMsIDRdO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBtYXhab29tID0gMTA7XG5cbiAgQElucHV0KClcbiAgcHVibGljIG1pblpvb20gPSAwLjE7XG5cbiAgLyoqIFRoaXMgYXR0cmlidXRlIGFsbG93cyB5b3UgdG8gaW5jcmVhc2UgdGhlIHNpemUgb2YgdGhlIFVJIGVsZW1lbnRzIHNvIHlvdSBjYW4gdXNlIHRoZW0gb24gc21hbGwgbW9iaWxlIGRldmljZXMuXG4gICAqIFRoaXMgYXR0cmlidXRlIGlzIGEgc3RyaW5nIHdpdGggYSBwZXJjZW50IGNoYXJhY3RlciBhdCB0aGUgZW5kIChlLmcuIFwiMTUwJVwiKS5cbiAgICovXG4gIHB1YmxpYyBfbW9iaWxlRnJpZW5kbHlab29tOiBzdHJpbmcgPSAnMTAwJSc7XG5cbiAgcHVibGljIG1vYmlsZUZyaWVuZGx5Wm9vbVNjYWxlID0gMTtcblxuICBwdWJsaWMgdG9vbGJhck1hcmdpblRvcCA9ICcwcHgnO1xuXG4gIHB1YmxpYyB0b29sYmFyV2lkdGggPSAnMTAwJSc7XG5cbiAgcHJpdmF0ZSB0b29sYmFyOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICBwdWJsaWMgb25Ub29sYmFyTG9hZGVkKHRvb2xiYXJFbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIHRoaXMudG9vbGJhciA9IHRvb2xiYXJFbGVtZW50O1xuICB9XG5cbiAgcHVibGljIHRvb2xiYXJXaWR0aEluUGl4ZWxzID0gMy4xNDE1OTI2NTM1OTsgLy8gbWFnaWMgbnVtYmVyIGluZGljYXRpbmcgdGhlIHRvb2xiYXIgc2l6ZSBoYXNuJ3QgYmVlbiBkZXRlcm1pbmVkIHlldFxuXG4gIHB1YmxpYyBzZWNvbmRhcnlUb29sYmFyVG9wOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgcHVibGljIHNpZGViYXJQb3NpdGlvblRvcDogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIC8vIGRpcnR5IElFMTEgaGFjayAtIHRlbXBvcmFyeSBzb2x1dGlvblxuICBwdWJsaWMgZmluZGJhclRvcDogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIC8vIGRpcnR5IElFMTEgaGFjayAtIHRlbXBvcmFyeSBzb2x1dGlvblxuICBwdWJsaWMgZmluZGJhckxlZnQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICBwdWJsaWMgZ2V0IG1vYmlsZUZyaWVuZGx5Wm9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbW9iaWxlRnJpZW5kbHlab29tO1xuICB9XG5cbiAgcHVibGljIGdldCBwZGZKc1ZlcnNpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZ2V0VmVyc2lvblN1ZmZpeChwZGZEZWZhdWx0T3B0aW9ucy5hc3NldHNGb2xkZXIpO1xuICB9XG5cbiAgcHVibGljIGdldCBtYWpvck1pbm9yUGRmSnNWZXJzaW9uKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZnVsbFZlcnNpb24gPSB0aGlzLnBkZkpzVmVyc2lvbjtcbiAgICBjb25zdCBwb3MgPSBmdWxsVmVyc2lvbi5sYXN0SW5kZXhPZignLicpO1xuICAgIHJldHVybiBmdWxsVmVyc2lvbi5zdWJzdHJpbmcoMCwgcG9zKS5yZXBsYWNlKCcuJywgJy0nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGF0dHJpYnV0ZXMgYWxsb3dzIHlvdSB0byBpbmNyZWFzZSB0aGUgc2l6ZSBvZiB0aGUgVUkgZWxlbWVudHMgc28geW91IGNhbiB1c2UgdGhlbSBvbiBzbWFsbCBtb2JpbGUgZGV2aWNlcy5cbiAgICogVGhpcyBhdHRyaWJ1dGUgaXMgYSBzdHJpbmcgd2l0aCBhIHBlcmNlbnQgY2hhcmFjdGVyIGF0IHRoZSBlbmQgKGUuZy4gXCIxNTAlXCIpLlxuICAgKi9cbiAgQElucHV0KClcbiAgcHVibGljIHNldCBtb2JpbGVGcmllbmRseVpvb20oem9vbTogc3RyaW5nKSB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnRyaXBsZS1lcXVhbHMgLSB0aGUgdHlwZSBjb252ZXJzaW9uIGlzIGludGVuZGVkXG4gICAgaWYgKHpvb20gPT0gJ3RydWUnKSB7XG4gICAgICB6b29tID0gJzE1MCUnO1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnRyaXBsZS1lcXVhbHMgLSB0aGUgdHlwZSBjb252ZXJzaW9uIGlzIGludGVuZGVkXG4gICAgfSBlbHNlIGlmICh6b29tID09ICdmYWxzZScgfHwgem9vbSA9PT0gdW5kZWZpbmVkIHx8IHpvb20gPT09IG51bGwpIHtcbiAgICAgIHpvb20gPSAnMTAwJSc7XG4gICAgfVxuICAgIHRoaXMuX21vYmlsZUZyaWVuZGx5Wm9vbSA9IHpvb207XG4gICAgbGV0IGZhY3RvciA9IDE7XG4gICAgaWYgKCFTdHJpbmcoem9vbSkuaW5jbHVkZXMoJyUnKSkge1xuICAgICAgem9vbSA9IDEwMCAqIE51bWJlcih6b29tKSArICclJztcbiAgICB9XG4gICAgZmFjdG9yID0gTnVtYmVyKCh6b29tIHx8ICcxMDAnKS5yZXBsYWNlKCclJywgJycpKSAvIDEwMDtcbiAgICB0aGlzLm1vYmlsZUZyaWVuZGx5Wm9vbVNjYWxlID0gZmFjdG9yO1xuICAgIHRoaXMudG9vbGJhcldpZHRoID0gKDEwMCAvIGZhY3RvcikudG9TdHJpbmcoKSArICclJztcbiAgICB0aGlzLnRvb2xiYXJNYXJnaW5Ub3AgPSAoZmFjdG9yIC0gMSkgKiAxNiArICdweCc7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuY2FsY1ZpZXdlclBvc2l0aW9uVG9wKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzaHV0dGluZ0Rvd24gPSBmYWxzZTtcblxuICBwdWJsaWMgc2VydmVyU2lkZVJlbmRlcmluZyA9IHRydWU7XG5cbiAgcHVibGljIGNhbGNWaWV3ZXJQb3NpdGlvblRvcCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50b29sYmFyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2lkZWJhclBvc2l0aW9uVG9wID0gJzAnO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgdG9wID0gdGhpcy50b29sYmFyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICBpZiAodG9wIDwgMzMpIHtcbiAgICAgIHRoaXMudmlld2VyUG9zaXRpb25Ub3AgPSAnMzNweCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlld2VyUG9zaXRpb25Ub3AgPSB0b3AgKyAncHgnO1xuICAgIH1cblxuICAgIGNvbnN0IGZhY3RvciA9IHRvcCAvIDMzO1xuXG4gICAgaWYgKHRoaXMucHJpbWFyeU1lbnVWaXNpYmxlKSB7XG4gICAgICB0aGlzLnNpZGViYXJQb3NpdGlvblRvcCA9ICgzMyArIDMzICogKGZhY3RvciAtIDEpKS50b1N0cmluZygpICsgJ3B4JztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaWRlYmFyUG9zaXRpb25Ub3AgPSAnMCc7XG4gICAgfVxuICAgIHRoaXMuc2Vjb25kYXJ5VG9vbGJhclRvcCA9ICgzMyArIDM4ICogKGZhY3RvciAtIDEpKS50b1N0cmluZygpICsgJ3B4JztcbiAgICB0aGlzLmZpbmRiYXJUb3AgPSAoMzMgKyAzOCAqIChmYWN0b3IgLSAxKSkudG9TdHJpbmcoKSArICdweCc7XG5cbiAgICBjb25zdCBmaW5kQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByaW1hcnlWaWV3RmluZCcpO1xuICAgIGlmIChmaW5kQnV0dG9uKSB7XG4gICAgICBjb25zdCBjb250YWluZXJQb3NpdGlvbkxlZnQgPSB0aGlzLnRvb2xiYXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICAgIGNvbnN0IGZpbmRCdXR0b25Qb3NpdGlvbiA9IGZpbmRCdXR0b24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCBsZWZ0ID0gTWF0aC5tYXgoMCwgZmluZEJ1dHRvblBvc2l0aW9uLmxlZnQgLSBjb250YWluZXJQb3NpdGlvbkxlZnQpO1xuICAgICAgdGhpcy5maW5kYmFyTGVmdCA9IGxlZnQgKyAncHgnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zaG93U2lkZWJhckJ1dHRvbikge1xuICAgICAgdGhpcy5maW5kYmFyTGVmdCA9IDM0ICsgKDMyICogZmFjdG9yKS50b1N0cmluZygpICsgJ3B4JztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5maW5kYmFyTGVmdCA9ICcwJztcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZCxcbiAgICBwcml2YXRlIG5vdGlmaWNhdGlvblNlcnZpY2U6IFBERk5vdGlmaWNhdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgcGxhdGZvcm1Mb2NhdGlvbjogUGxhdGZvcm1Mb2NhdGlvbixcbiAgICBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHVibGljIHNlcnZpY2U6IE5neEV4dGVuZGVkUGRmVmlld2VyU2VydmljZSxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBwZGZDc3BQb2xpY3lTZXJ2aWNlOiBQZGZDc3BQb2xpY3lTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMuYmFzZUhyZWYgPSB0aGlzLnBsYXRmb3JtTG9jYXRpb24uZ2V0QmFzZUhyZWZGcm9tRE9NKCk7XG4gICAgdGhpcy53aW5kb3dTaXplUmVjYWxjdWxhdG9yU3Vic2NyaXB0aW9uID0gdGhpcy5zZXJ2aWNlLnJlY2FsY3VsYXRlU2l6ZSQuc3Vic2NyaWJlKCgpID0+IHRoaXMub25SZXNpemUoKSk7XG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHRoaXMuc2VydmVyU2lkZVJlbmRlcmluZyA9IGZhbHNlO1xuICAgICAgdGhpcy50b29sYmFyV2lkdGggPSBTdHJpbmcoZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCk7XG4gICAgICBpZiAoKDxhbnk+Z2xvYmFsVGhpcykucGRmRGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gKDxhbnk+Z2xvYmFsVGhpcykucGRmRGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgICAgICBwZGZEZWZhdWx0T3B0aW9uc1trZXldID0gKDxhbnk+Z2xvYmFsVGhpcykucGRmRGVmYXVsdE9wdGlvbnNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgKDxhbnk+Z2xvYmFsVGhpcykucGRmRGVmYXVsdE9wdGlvbnMgPSBwZGZEZWZhdWx0T3B0aW9ucztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGlPU1ZlcnNpb25SZXF1aXJlc0VTNSgpOiBib29sZWFuIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIHNlcnZlci1zaWRlIHJlbmRlcmluZ1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBtYXRjaCA9IG5hdmlnYXRvci5hcHBWZXJzaW9uLm1hdGNoKC9PUyAoXFxkKylfKFxcZCspXz8oXFxkKyk/Lyk7XG4gICAgaWYgKG1hdGNoICE9PSB1bmRlZmluZWQgJiYgbWF0Y2ggIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBwYXJzZUludChtYXRjaFsxXSwgMTApIDwgMTQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBuZWVkc0VTNSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIHNlcnZlci1zaWRlIHJlbmRlcmluZ1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBpc0lFID0gISEoPGFueT5nbG9iYWxUaGlzKS5NU0lucHV0TWV0aG9kQ29udGV4dCAmJiAhISg8YW55PmRvY3VtZW50KS5kb2N1bWVudE1vZGU7XG4gICAgY29uc3QgaXNFZGdlID0gL0VkZ2VcXC9cXGQuL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICBjb25zdCBpc0lPczEzT3JCZWxvdyA9IHRoaXMuaU9TVmVyc2lvblJlcXVpcmVzRVM1KCk7XG4gICAgbGV0IG5lZWRzRVM1ID0gdHlwZW9mIFJlYWRhYmxlU3RyZWFtID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgUHJvbWlzZVsnYWxsU2V0dGxlZCddID09PSAndW5kZWZpbmVkJztcbiAgICBpZiAobmVlZHNFUzUgfHwgaXNJRSB8fCBpc0VkZ2UgfHwgaXNJT3MxM09yQmVsb3cgfHwgdGhpcy5mb3JjZVVzaW5nTGVnYWN5RVM1KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuICEoYXdhaXQgdGhpcy5uZ3hFeHRlbmRlZFBkZlZpZXdlckNhblJ1bk1vZGVybkpTQ29kZSgpKTtcbiAgfVxuXG4gIHByaXZhdGUgbmd4RXh0ZW5kZWRQZGZWaWV3ZXJDYW5SdW5Nb2Rlcm5KU0NvZGUoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBjb25zdCBzdXBwb3J0ID0gKDxhbnk+Z2xvYmFsVGhpcykubmd4RXh0ZW5kZWRQZGZWaWV3ZXJDYW5SdW5Nb2Rlcm5KU0NvZGU7XG4gICAgICBzdXBwb3J0ICE9PSB1bmRlZmluZWQgPyByZXNvbHZlKHN1cHBvcnQpIDogcmVzb2x2ZSh0aGlzLmFkZFNjcmlwdE9wQ2hhaW5pbmdTdXBwb3J0KCkpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRTY3JpcHRPcENoYWluaW5nU3VwcG9ydCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IHNjcmlwdCA9IHRoaXMuY3JlYXRlU2NyaXB0RWxlbWVudChwZGZEZWZhdWx0T3B0aW9ucy5hc3NldHNGb2xkZXIgKyAnL29wLWNoYWluaW5nLXN1cHBvcnQuanMnKTtcbiAgICAgIHNjcmlwdC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHNjcmlwdC5yZW1vdmUoKTtcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IG51bGw7XG4gICAgICAgIHJlc29sdmUoKDxhbnk+Z2xvYmFsVGhpcykubmd4RXh0ZW5kZWRQZGZWaWV3ZXJDYW5SdW5Nb2Rlcm5KU0NvZGUgYXMgYm9vbGVhbik7XG4gICAgICB9O1xuICAgICAgc2NyaXB0Lm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIHNjcmlwdC5yZW1vdmUoKTtcbiAgICAgICAgKDxhbnk+Z2xvYmFsVGhpcykubmd4RXh0ZW5kZWRQZGZWaWV3ZXJDYW5SdW5Nb2Rlcm5KU0NvZGUgPSBmYWxzZTtcbiAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgIHNjcmlwdC5vbmVycm9yID0gbnVsbDtcbiAgICAgIH07XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU2NyaXB0RWxlbWVudChzb3VyY2VQYXRoOiBzdHJpbmcpOiBIVE1MU2NyaXB0RWxlbWVudCB7XG4gICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgICBzY3JpcHQudHlwZSA9IHNvdXJjZVBhdGguZW5kc1dpdGgoJy5tanMnKSA/ICdtb2R1bGUnIDogJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgc2NyaXB0LmNsYXNzTmFtZSA9IGBuZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci1zY3JpcHRgO1xuICAgIHRoaXMucGRmQ3NwUG9saWN5U2VydmljZS5hZGRUcnVzdGVkSmF2YVNjcmlwdChzY3JpcHQsIHNvdXJjZVBhdGgpO1xuICAgIHJldHVybiBzY3JpcHQ7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVNjcmlwdEltcG9ydEVsZW1lbnQoc291cmNlUGF0aDogc3RyaW5nKTogSFRNTFNjcmlwdEVsZW1lbnQge1xuICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gICAgc2NyaXB0LnR5cGUgPSAnbW9kdWxlJztcbiAgICBzY3JpcHQuY2xhc3NOYW1lID0gYG5neC1leHRlbmRlZC1wZGYtdmlld2VyLXNjcmlwdGA7XG4gICAgLy8gdGhpcy5wZGZDc3BQb2xpY3lTZXJ2aWNlLmFkZFRydXN0ZWRKYXZhU2NyaXB0KHNjcmlwdCwgc291cmNlUGF0aCk7XG4gICAgY29uc3QgYm9keSA9IGBcbiAgICBpbXBvcnQgeyB3ZWJWaWV3ZXJMb2FkLCBQREZWaWV3ZXJBcHBsaWNhdGlvbiwgUERGVmlld2VyQXBwbGljYXRpb25Db25zdGFudHMsIFBERlZpZXdlckFwcGxpY2F0aW9uT3B0aW9ucyB9IGZyb20gJy4vJHtzb3VyY2VQYXRofSc7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJuZ3hWaWV3ZXJGaWxlSGFzQmVlbkxvYWRlZFwiLCB7XG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24sXG4gICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uQ29uc3RhbnRzLFxuICAgICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnMsXG4gICAgICAgIHdlYlZpZXdlckxvYWRcbiAgICAgIH1cbiAgICB9KTtcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICBgO1xuICAgIHNjcmlwdC50ZXh0ID0gYm9keTtcbiAgICByZXR1cm4gc2NyaXB0O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQZGZKc1BhdGgoYXJ0aWZhY3Q6ICdwZGYnIHwgJ3ZpZXdlcicsIG5lZWRzRVM1OiBib29sZWFuKSB7XG4gICAgbGV0IHN1ZmZpeCA9IHRoaXMubWluaWZpZWRKU0xpYnJhcmllcyAmJiAhbmVlZHNFUzUgPyAnLm1pbi5qcycgOiAnLmpzJztcbiAgICBjb25zdCBhc3NldHMgPSBwZGZEZWZhdWx0T3B0aW9ucy5hc3NldHNGb2xkZXI7XG4gICAgY29uc3QgdmVyc2lvblN1ZmZpeCA9IGdldFZlcnNpb25TdWZmaXgoYXNzZXRzKTtcbiAgICBpZiAodmVyc2lvblN1ZmZpeC5zdGFydHNXaXRoKCc0JykpIHtcbiAgICAgIHN1ZmZpeCA9IHN1ZmZpeC5yZXBsYWNlKCcuanMnLCAnLm1qcycpO1xuICAgIH1cbiAgICBjb25zdCBhcnRpZmFjdFBhdGggPSBgLyR7YXJ0aWZhY3R9LWA7XG4gICAgY29uc3QgZXM1ID0gbmVlZHNFUzUgPyAnLWVzNScgOiAnJztcblxuICAgIHJldHVybiBhc3NldHMgKyBhcnRpZmFjdFBhdGggKyB2ZXJzaW9uU3VmZml4ICsgZXM1ICsgc3VmZml4O1xuICB9XG5cbiAgcHJpdmF0ZSBsb2FkVmlld2VyKCk6IHZvaWQge1xuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG5lZWRzRVM1ID0gYXdhaXQgdGhpcy5uZWVkc0VTNSgpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHZpZXdlclBhdGggPSB0aGlzLmdldFBkZkpzUGF0aCgndmlld2VyJywgbmVlZHNFUzUpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCduZ3hWaWV3ZXJGaWxlSGFzQmVlbkxvYWRlZCcsIChldmVudDogQ3VzdG9tRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCB7IFBERlZpZXdlckFwcGxpY2F0aW9uLCBQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnMsIFBERlZpZXdlckFwcGxpY2F0aW9uQ29uc3RhbnRzLCB3ZWJWaWV3ZXJMb2FkIH0gPSBldmVudC5kZXRhaWw7XG4gICAgICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbiA9IFBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgICAgICAgICAgdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnMgPSBQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnM7XG4gICAgICAgICAgICB0aGlzLlBERlZpZXdlckFwcGxpY2F0aW9uQ29uc3RhbnRzID0gUERGVmlld2VyQXBwbGljYXRpb25Db25zdGFudHM7XG4gICAgICAgICAgICB0aGlzLndlYlZpZXdlckxvYWQgPSB3ZWJWaWV3ZXJMb2FkO1xuICAgICAgICAgICAgdGhpcy5kb0luaXRQREZWaWV3ZXIoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IHRoaXMuY3JlYXRlU2NyaXB0SW1wb3J0RWxlbWVudCh2aWV3ZXJQYXRoKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFkZEZlYXR1cmVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgY29uc3Qgc2NyaXB0ID0gdGhpcy5jcmVhdGVTY3JpcHRFbGVtZW50KHBkZkRlZmF1bHRPcHRpb25zLmFzc2V0c0ZvbGRlciArICcvYWRkaXRpb25hbC1mZWF0dXJlcy5qcycpO1xuICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgc2NyaXB0LnJlbW92ZSgpO1xuICAgICAgfTtcbiAgICAgIHNjcmlwdC5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICBzY3JpcHQucmVtb3ZlKCk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH07XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICBnbG9iYWxUaGlzWyduZ3hab25lJ10gPSB0aGlzLm5nWm9uZTtcbiAgICBOZ3hDb25zb2xlLmluaXQoKTtcbiAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgdGhpcy5hZGRUcmFuc2xhdGlvbnNVbmxlc3NQcm92aWRlZEJ5VGhlVXNlcigpO1xuICAgICAgdGhpcy5sb2FkUGRmSnMoKTtcbiAgICAgIHRoaXMuaGlkZVRvb2xiYXJJZkl0SXNFbXB0eSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbG9hZFBkZkpzKCk6IHZvaWQge1xuICAgIGNvbnN0IGFscmVhZHlMb2FkZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCduZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci1zY3JpcHQnKTtcblxuICAgIGlmIChhbHJlYWR5TG9hZGVkLmxlbmd0aCA+IDApIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmxvYWRQZGZKcygpO1xuICAgICAgfSwgMTApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGdsb2JhbFRoaXNbJ3NldE5neEV4dGVuZGVkUGRmVmlld2VyU291cmNlJ10gPSAodXJsOiBzdHJpbmcpID0+IHtcbiAgICAgIHRoaXMuX3NyYyA9IHVybDtcbiAgICAgIHRoaXMuc3JjQ2hhbmdlVHJpZ2dlcmVkQnlVc2VyID0gdHJ1ZTtcbiAgICAgIHRoaXMuc3JjQ2hhbmdlLmVtaXQodXJsKTtcbiAgICB9O1xuICAgIHRoaXMuZm9ybVN1cHBvcnQucmVnaXN0ZXJGb3JtU3VwcG9ydFdpdGhQZGZqcyh0aGlzLm5nWm9uZSk7XG5cbiAgICBnbG9iYWxUaGlzWyduZ3hab25lJ10gPSB0aGlzLm5nWm9uZTtcbiAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcihhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBuZWVkc0VTNSA9IGF3YWl0IHRoaXMubmVlZHNFUzUoKTtcbiAgICAgIGlmIChuZWVkc0VTNSkge1xuICAgICAgICBpZiAoIXBkZkRlZmF1bHRPcHRpb25zLm5lZWRzRVM1KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIklmIHlvdSBzZWUgdGhlIGVycm9yIG1lc3NhZ2UgXFxcImV4cGVjdGVkIGV4cHJlc3Npb24sIGdvdCAnPSdcXFwiIGFib3ZlOiB5b3UgY2FuIHNhZmVseSBpZ25vcmUgaXQgYXMgbG9uZyBhcyB5b3Uga25vdyB3aGF0IHlvdSdyZSBkb2luZy4gSXQgbWVhbnMgeW91ciBicm93c2VyIGlzIG91dC1vZi1kYXRlLiBQbGVhc2UgdXBkYXRlIHlvdXIgYnJvd3NlciB0byBiZW5lZml0IGZyb20gdGhlIGxhdGVzdCBzZWN1cml0eSB1cGRhdGVzIGFuZCB0byBlbmpveSBhIGZhc3RlciBQREYgdmlld2VyLlwiXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBwZGZEZWZhdWx0T3B0aW9ucy5uZWVkc0VTNSA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUubG9nKCdVc2luZyB0aGUgRVM1IHZlcnNpb24gb2YgdGhlIFBERiB2aWV3ZXIuIFlvdXIgUERGIGZpbGVzIHNob3cgZmFzdGVyIGlmIHlvdSB1cGRhdGUgeW91ciBicm93c2VyLicpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWluaWZpZWRKU0xpYnJhcmllcyAmJiAhbmVlZHNFUzUpIHtcbiAgICAgICAgaWYgKCFwZGZEZWZhdWx0T3B0aW9ucy53b3JrZXJTcmMoKS5lbmRzV2l0aCgnLm1pbi5tanMnKSkge1xuICAgICAgICAgIGNvbnN0IHNyYyA9IHBkZkRlZmF1bHRPcHRpb25zLndvcmtlclNyYygpO1xuICAgICAgICAgIHBkZkRlZmF1bHRPcHRpb25zLndvcmtlclNyYyA9ICgpID0+IHNyYy5yZXBsYWNlKCcubWpzJywgJy5taW4ubWpzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHBkZkpzUGF0aCA9IHRoaXMuZ2V0UGRmSnNQYXRoKCdwZGYnLCBuZWVkc0VTNSk7XG4gICAgICBpZiAocGRmSnNQYXRoLmVuZHNXaXRoKCcubWpzJykpIHtcbiAgICAgICAgY29uc3Qgc3JjID0gcGRmRGVmYXVsdE9wdGlvbnMud29ya2VyU3JjKCk7XG4gICAgICAgIGlmIChzcmMuZW5kc1dpdGgoJy5qcycpKSB7XG4gICAgICAgICAgcGRmRGVmYXVsdE9wdGlvbnMud29ya2VyU3JjID0gKCkgPT4gc3JjLnN1YnN0cmluZygwLCBzcmMubGVuZ3RoIC0gMykgKyAnLm1qcyc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHNjcmlwdCA9IHRoaXMuY3JlYXRlU2NyaXB0RWxlbWVudChwZGZKc1BhdGgpO1xuXG4gICAgICBzY3JpcHQub25sb2FkID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmxvYWRWaWV3ZXIoKTtcbiAgICAgIH07XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzc2lnblRhYmluZGV4ZXMoKSB7XG4gICAgaWYgKHRoaXMuc3RhcnRUYWJpbmRleCkge1xuICAgICAgY29uc3QgciA9IHRoaXMucm9vdC5uYXRpdmVFbGVtZW50LmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgIHIuY2xhc3NMaXN0LmFkZCgnb2Zmc2NyZWVuJyk7XG4gICAgICB0aGlzLnNob3dFbGVtZW50c1JlY3Vyc2l2ZWx5KHIpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyKTtcbiAgICAgIGNvbnN0IGVsZW1lbnRzID0gdGhpcy5jb2xsZWN0RWxlbWVudFBvc2l0aW9ucyhyLCB0aGlzLnJvb3QubmF0aXZlRWxlbWVudCwgW10pO1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChyKTtcbiAgICAgIGNvbnN0IHRvcFJpZ2h0R3JlYXRlclRoYW5Cb3R0b21MZWZ0Q29tcGFyYXRvciA9IChhLCBiKSA9PiB7XG4gICAgICAgIGlmIChhLnkgLSBiLnkgPiAxNSkge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiLnkgLSBhLnkgPiAxNSkge1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYS54IC0gYi54O1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHNvcnRlZCA9IFsuLi5lbGVtZW50c10uc29ydCh0b3BSaWdodEdyZWF0ZXJUaGFuQm90dG9tTGVmdENvbXBhcmF0b3IpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3J0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc29ydGVkW2ldLmVsZW1lbnQudGFiSW5kZXggPSB0aGlzLnN0YXJ0VGFiaW5kZXggKyBpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2hvd0VsZW1lbnRzUmVjdXJzaXZlbHkocm9vdDogRWxlbWVudCk6IHZvaWQge1xuICAgIHJvb3QuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgcm9vdC5jbGFzc0xpc3QucmVtb3ZlKCdpbnZpc2libGUnKTtcbiAgICByb290LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlblhYTFZpZXcnKTtcbiAgICByb290LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlblhMVmlldycpO1xuICAgIHJvb3QuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuTGFyZ2VWaWV3Jyk7XG4gICAgcm9vdC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW5NZWRpdW1WaWV3Jyk7XG4gICAgcm9vdC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW5TbWFsbFZpZXcnKTtcbiAgICByb290LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlblRpbnlWaWV3Jyk7XG4gICAgcm9vdC5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlWFhMVmlldycpO1xuICAgIHJvb3QuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZVhMVmlldycpO1xuICAgIHJvb3QuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZUxhcmdlVmlldycpO1xuICAgIHJvb3QuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZU1lZGl1bVZpZXcnKTtcbiAgICByb290LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGVTbWFsbFZpZXcnKTtcbiAgICByb290LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGVUaW55VmlldycpO1xuXG4gICAgaWYgKHJvb3QgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCB8fCByb290IGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQgfHwgcm9vdCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgfHwgcm9vdCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChyb290LmNoaWxkRWxlbWVudENvdW50ID4gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb290LmNoaWxkRWxlbWVudENvdW50OyBpKyspIHtcbiAgICAgICAgY29uc3QgYyA9IHJvb3QuY2hpbGRyZW4uaXRlbShpKTtcbiAgICAgICAgaWYgKGMpIHtcbiAgICAgICAgICB0aGlzLnNob3dFbGVtZW50c1JlY3Vyc2l2ZWx5KGMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjb2xsZWN0RWxlbWVudFBvc2l0aW9ucyhjb3B5OiBFbGVtZW50LCBvcmlnaW5hbDogRWxlbWVudCwgZWxlbWVudHM6IEFycmF5PEVsZW1lbnRBbmRQb3NpdGlvbj4pOiBBcnJheTxFbGVtZW50QW5kUG9zaXRpb24+IHtcbiAgICBpZiAoY29weSBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50IHx8IGNvcHkgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCB8fCBjb3B5IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCB8fCBjb3B5IGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IHJlY3QgPSBjb3B5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgZWxlbWVudEFuZFBvcyA9IHtcbiAgICAgICAgZWxlbWVudDogb3JpZ2luYWwsXG4gICAgICAgIHg6IE1hdGgucm91bmQocmVjdC5sZWZ0KSxcbiAgICAgICAgeTogTWF0aC5yb3VuZChyZWN0LnRvcCksXG4gICAgICB9IGFzIEVsZW1lbnRBbmRQb3NpdGlvbjtcbiAgICAgIGVsZW1lbnRzLnB1c2goZWxlbWVudEFuZFBvcyk7XG4gICAgfSBlbHNlIGlmIChjb3B5LmNoaWxkRWxlbWVudENvdW50ID4gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3B5LmNoaWxkRWxlbWVudENvdW50OyBpKyspIHtcbiAgICAgICAgY29uc3QgYyA9IGNvcHkuY2hpbGRyZW4uaXRlbShpKTtcbiAgICAgICAgY29uc3QgbyA9IG9yaWdpbmFsLmNoaWxkcmVuLml0ZW0oaSk7XG4gICAgICAgIGlmIChjICYmIG8pIHtcbiAgICAgICAgICBlbGVtZW50cyA9IHRoaXMuY29sbGVjdEVsZW1lbnRQb3NpdGlvbnMoYywgbywgZWxlbWVudHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50cztcbiAgfVxuXG4gIHByaXZhdGUgYWZ0ZXJQcmludExpc3RlbmVyID0gKCkgPT4ge1xuICAgIHRoaXMuYWZ0ZXJQcmludC5lbWl0KCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBiZWZvcmVQcmludExpc3RlbmVyID0gKCkgPT4ge1xuICAgIHRoaXMuYmVmb3JlUHJpbnQuZW1pdCgpO1xuICB9O1xuXG4gIHByaXZhdGUgZG9Jbml0UERGVmlld2VyKCkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gc2VydmVyLXNpZGUgcmVuZGVyaW5nXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2FmdGVycHJpbnQnLCB0aGlzLmFmdGVyUHJpbnRMaXN0ZW5lcik7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXByaW50JywgdGhpcy5iZWZvcmVQcmludExpc3RlbmVyKTtcblxuICAgIGlmICh0aGlzLnNlcnZpY2Uubmd4RXh0ZW5kZWRQZGZWaWV3ZXJJbml0aWFsaXplZCkge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnF1b3RlbWFya1xuICAgICAgY29uc29sZS5lcnJvcihcIllvdSdyZSB0cnlpbmcgdG8gb3BlbiB0d28gaW5zdGFuY2VzIG9mIHRoZSBQREYgdmlld2VyLiBNb3N0IGxpa2VseSwgdGhpcyB3aWxsIHJlc3VsdCBpbiBlcnJvcnMuXCIpO1xuICAgIH1cbiAgICBjb25zdCBvbkxvYWRlZCA9ICgpID0+IHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3dlYnZpZXdlcmluaXRpYWxpemVkJywgb25Mb2FkZWQpO1xuICAgICAgaWYgKCF0aGlzLlBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFdmVudGJ1cyBpcyBudWxsPyBMZXQncyB0cnkgYWdhaW4uXCIpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBvbkxvYWRlZCgpO1xuICAgICAgICB9LCAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uID0gdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICAgICAgdGhpcy5vdmVycmlkZURlZmF1bHRTZXR0aW5ncygpO1xuICAgICAgICB0aGlzLmxvY2FsaXphdGlvbkluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgLy8gICAgICAgIHRoaXMuaW5pdFRpbWVvdXQgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnNodXR0aW5nRG93bikge1xuICAgICAgICAgIC8vIGh1cnJpZWQgdXNlcnMgc29tZXRpbWVzIHJlbG9hZCB0aGUgUERGIGJlZm9yZSBpdCBoYXMgZmluaXNoZWQgaW5pdGlhbGl6aW5nXG4gICAgICAgICAgdGhpcy5jYWxjVmlld2VyUG9zaXRpb25Ub3AoKTtcbiAgICAgICAgICB0aGlzLmFmdGVyTGlicmFyeUluaXQoKTtcbiAgICAgICAgICB0aGlzLm9wZW5QREYoKTtcbiAgICAgICAgICB0aGlzLmFzc2lnblRhYmluZGV4ZXMoKTtcbiAgICAgICAgICBpZiAodGhpcy5yZXBsYWNlQnJvd3NlclByaW50KSB7XG4gICAgICAgICAgICB3aW5kb3cucHJpbnQgPSAod2luZG93IGFzIGFueSkucHJpbnRQREY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICB9LCAxMCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd3ZWJ2aWV3ZXJpbml0aWFsaXplZCcsIG9uTG9hZGVkKTtcblxuICAgIHRoaXMuYWN0aXZhdGVUZXh0bGF5ZXJJZk5lY2Vzc2FyeShudWxsKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnNodXR0aW5nRG93bikge1xuICAgICAgICAvLyBodXJyaWVkIHVzZXJzIHNvbWV0aW1lcyByZWxvYWQgdGhlIFBERiBiZWZvcmUgaXQgaGFzIGZpbmlzaGVkIGluaXRpYWxpemluZ1xuICAgICAgICAvLyBUaGlzIGluaXRpYWxpemVzIHRoZSB3ZWJ2aWV3ZXIsIHRoZSBmaWxlIG1heSBiZSBwYXNzZWQgaW4gdG8gaXQgdG8gaW5pdGlhbGl6ZSB0aGUgdmlld2VyIHdpdGggYSBwZGYgZGlyZWN0bHlcbiAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xuICAgICAgICB0aGlzLmhpZGVUb29sYmFySWZJdElzRW1wdHkoKTtcbiAgICAgICAgdGhpcy5kdW1teUNvbXBvbmVudHMuYWRkTWlzc2luZ1N0YW5kYXJkV2lkZ2V0cygpO1xuICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLndlYlZpZXdlckxvYWQoKSk7XG5cbiAgICAgICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9IHRoaXMuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmFwcENvbmZpZy5kZWZhdWx0VXJsID0gJyc7IC8vIElFIGJ1Z2ZpeFxuICAgICAgICBpZiAodGhpcy5maWxlbmFtZUZvckRvd25sb2FkKSB7XG4gICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24uYXBwQ29uZmlnLmZpbGVuYW1lRm9yRG93bmxvYWQgPSB0aGlzLmZpbGVuYW1lRm9yRG93bmxvYWQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb25PcHRpb25zOiBJUERGVmlld2VyQXBwbGljYXRpb25PcHRpb25zID0gdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnM7XG5cbiAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb25PcHRpb25zLnNldCgnZW5hYmxlRHJhZ0FuZERyb3AnLCB0aGlzLmVuYWJsZURyYWdBbmREcm9wKTtcbiAgICAgICAgbGV0IGxhbmd1YWdlID0gdGhpcy5sYW5ndWFnZSA9PT0gJycgPyB1bmRlZmluZWQgOiB0aGlzLmxhbmd1YWdlO1xuICAgICAgICBpZiAoIWxhbmd1YWdlKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAvLyBzZXJ2ZXItc2lkZSByZW5kZXJpbmdcbiAgICAgICAgICAgIGxhbmd1YWdlID0gJ2VuJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGFuZ3VhZ2UgPSBuYXZpZ2F0b3IubGFuZ3VhZ2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uT3B0aW9ucy5zZXQoJ2xvY2FsZScsIGxhbmd1YWdlKTtcbiAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb25PcHRpb25zLnNldCgnaW1hZ2VSZXNvdXJjZXNQYXRoJywgdGhpcy5pbWFnZVJlc291cmNlc1BhdGgpO1xuICAgICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnMuc2V0KCdtaW5ab29tJywgdGhpcy5taW5ab29tKTtcbiAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb25PcHRpb25zLnNldCgnbWF4Wm9vbScsIHRoaXMubWF4Wm9vbSk7XG4gICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uT3B0aW9ucy5zZXQoJ3BhZ2VWaWV3TW9kZScsIHRoaXMucGFnZVZpZXdNb2RlKTtcbiAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb25PcHRpb25zLnNldCgndmVyYm9zaXR5JywgdGhpcy5sb2dMZXZlbCk7XG4gICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uT3B0aW9ucy5zZXQoJ2luaXRpYWxab29tJywgdGhpcy56b29tKTtcblxuICAgICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5pc1ZpZXdlckVtYmVkZGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKFBERlZpZXdlckFwcGxpY2F0aW9uLnByaW50S2V5RG93bkxpc3RlbmVyKSB7XG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wcmludEtleURvd25MaXN0ZW5lciwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKTtcbiAgICAgICAgaWYgKGJvZHlbMF0pIHtcbiAgICAgICAgICBjb25zdCB0b3BMZXZlbEVsZW1lbnRzID0gYm9keVswXS5jaGlsZHJlbjtcbiAgICAgICAgICBmb3IgKGxldCBpID0gdG9wTGV2ZWxFbGVtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgZSA9IHRvcExldmVsRWxlbWVudHMuaXRlbShpKTtcbiAgICAgICAgICAgIGlmIChlICYmIGUuaWQgPT09ICdwcmludENvbnRhaW5lcicpIHtcbiAgICAgICAgICAgICAgYm9keVswXS5yZW1vdmVDaGlsZChlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJpbnRDb250YWluZXInKTtcbiAgICAgICAgaWYgKHBjKSB7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZChwYyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCAwKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkVHJhbnNsYXRpb25zVW5sZXNzUHJvdmlkZWRCeVRoZVVzZXIoKSB7XG4gICAgY29uc3QgbGluayA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgIGxpbmsucmVsID0gJ3Jlc291cmNlJztcbiAgICBsaW5rLnR5cGUgPSAnYXBwbGljYXRpb24vbDEwbic7XG4gICAgbGluay5ocmVmID0gdGhpcy5sb2NhbGVGb2xkZXJQYXRoICsgJy9sb2NhbGUuanNvbic7XG5cbiAgICBsaW5rLnNldEF0dHJpYnV0ZSgnb3JpZ2luJywgJ25neC1leHRlbmRlZC1wZGYtdmlld2VyJyk7XG4gICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgbGluayk7XG4gIH1cblxuICBwcml2YXRlIGhpZGVUb29sYmFySWZJdElzRW1wdHkoKSB7XG4gICAgdGhpcy5wcmltYXJ5TWVudVZpc2libGUgPSB0aGlzLnNob3dUb29sYmFyO1xuICAgIGlmICghdGhpcy5zaG93U2Vjb25kYXJ5VG9vbGJhckJ1dHRvbiB8fCB0aGlzLnNlcnZpY2Uuc2Vjb25kYXJ5TWVudUlzRW1wdHkpIHtcbiAgICAgIGlmICghdGhpcy5pc1ByaW1hcnlNZW51VmlzaWJsZSgpKSB7XG4gICAgICAgIHRoaXMucHJpbWFyeU1lbnVWaXNpYmxlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIE5vdGlmaWVzIGV2ZXJ5IHdpZGdldCB0aGF0IGltcGxlbWVudHMgb25MaWJyYXJ5SW5pdCgpIHRoYXQgdGhlIFBERiB2aWV3ZXIgb2JqZWN0cyBhcmUgYXZhaWxhYmxlICovXG4gIHByaXZhdGUgYWZ0ZXJMaWJyYXJ5SW5pdCgpIHtcbiAgICB0aGlzLm5vdGlmaWNhdGlvblNlcnZpY2Uub25QREZKU0luaXRTaWduYWwuc2V0KHRoaXMuUERGVmlld2VyQXBwbGljYXRpb24pO1xuICB9XG5cbiAgcHVibGljIGNoZWNrSGVpZ2h0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9oZWlnaHQpIHtcbiAgICAgIGlmIChpc05hTihOdW1iZXIodGhpcy5faGVpZ2h0LnJlcGxhY2UoJyUnLCAnJykpKSkge1xuICAgICAgICAvLyBUaGUgaGVpZ2h0IGlzIGRlZmluZWQgd2l0aCBvbmUgb2YgdGhlIHVuaXRzIHZoLCB2dywgZW0sIHJlbSwgZXRjLlxuICAgICAgICAvLyBTbyB0aGUgaGVpZ2h0IGNoZWNrIGlzbid0IG5lY2Vzc2FyeS5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtcGRmanNwcmludGluZ10nKSkge1xuICAgICAgLy8gIzE3MDIgd29ya2Fyb3VuZCB0byBhIEZpcmVmb3ggYnVnOiB3aGVuIHByaW50aW5nLCBjb250YWluZXIuY2xpZW50SGVpZ2h0IGlzIHRlbXBvcmFyaWx5IDAsXG4gICAgICAvLyBjYXVzaW5nIG5neC1leHRlbmRlZC1wZGYtdmlld2VyIHRvIGRlZmF1bHQgdG8gMTAwIHBpeGVscyBoZWlnaHQuIFNvIGl0J3MgYmV0dGVyXG4gICAgICAvLyB0byBkbyBub3RoaW5nLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnem9vbScpWzBdIGFzIEhUTUxFbGVtZW50O1xuICAgICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICBpZiAoY29udGFpbmVyLmNsaWVudEhlaWdodCA9PT0gMCkge1xuICAgICAgICAgIGlmICh0aGlzLmxvZ0xldmVsID49IFZlcmJvc2l0eUxldmVsLldBUk5JTkdTICYmICF0aGlzLmF1dG9IZWlnaHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgXCJUaGUgaGVpZ2h0IG9mIHRoZSBQREYgdmlld2VyIHdpZGdldCBpcyB6ZXJvIHBpeGVscy4gUGxlYXNlIGNoZWNrIHRoZSBoZWlnaHQgYXR0cmlidXRlLiBJcyB0aGVyZSBhIHN5bnRheCBlcnJvcj8gT3IgYXJlIHlvdSB1c2luZyBhIHBlcmNlbnRhZ2Ugd2l0aCBhIENTUyBmcmFtZXdvcmsgdGhhdCBkb2Vzbid0IHN1cHBvcnQgdGhpcz8gVGhlIGhlaWdodCBpcyBhZGp1c3RlZCBhdXRvbWF0ZWRseS5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hdXRvSGVpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hdXRvSGVpZ2h0KSB7XG4gICAgICAgICAgY29uc3QgYXZhaWxhYmxlID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgIGNvbnN0IHJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgY29uc3QgdG9wID0gcmVjdC50b3A7XG4gICAgICAgICAgbGV0IG1heGltdW1IZWlnaHQgPSBhdmFpbGFibGUgLSB0b3A7XG4gICAgICAgICAgLy8gdGFrZSB0aGUgbWFyZ2lucyBhbmQgcGFkZGluZ3Mgb2YgdGhlIHBhcmVudCBjb250YWluZXJzIGludG8gYWNjb3VudFxuICAgICAgICAgIGNvbnN0IHBhZGRpbmcgPSB0aGlzLmNhbGN1bGF0ZUJvcmRlck1hcmdpbihjb250YWluZXIpO1xuICAgICAgICAgIG1heGltdW1IZWlnaHQgLT0gcGFkZGluZztcbiAgICAgICAgICBpZiAobWF4aW11bUhlaWdodCA+IDEwMCkge1xuICAgICAgICAgICAgdGhpcy5taW5IZWlnaHQgPSBgJHttYXhpbXVtSGVpZ2h0fXB4YDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5taW5IZWlnaHQgPSAnMTAwcHgnO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2FsY3VsYXRlQm9yZGVyTWFyZ2luKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBudWxsKTogbnVtYmVyIHtcbiAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICBjb25zdCBjb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoY29udGFpbmVyKTtcblxuICAgICAgY29uc3QgcGFkZGluZyA9IFVuaXRUb1B4LnRvUHgoY29tcHV0ZWRTdHlsZS5wYWRkaW5nQm90dG9tKTtcbiAgICAgIGNvbnN0IG1hcmdpbiA9IFVuaXRUb1B4LnRvUHgoY29tcHV0ZWRTdHlsZS5tYXJnaW5Cb3R0b20pO1xuICAgICAgaWYgKGNvbnRhaW5lci5zdHlsZS56SW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHBhZGRpbmcgKyBtYXJnaW47XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFkZGluZyArIG1hcmdpbiArIHRoaXMuY2FsY3VsYXRlQm9yZGVyTWFyZ2luKGNvbnRhaW5lci5wYXJlbnRFbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBwdWJsaWMgb25TcHJlYWRDaGFuZ2UobmV3U3ByZWFkOiAnb2ZmJyB8ICdldmVuJyB8ICdvZGQnKTogdm9pZCB7XG4gICAgdGhpcy5zcHJlYWRDaGFuZ2UuZW1pdChuZXdTcHJlYWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhY3RpdmF0ZVRleHRsYXllcklmTmVjZXNzYXJ5KG9wdGlvbnM6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnRleHRMYXllciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIXRoaXMuaGFuZFRvb2wpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgICBvcHRpb25zLnNldCgndGV4dExheWVyTW9kZScsIHBkZkRlZmF1bHRPcHRpb25zLnRleHRMYXllck1vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGV4dExheWVyID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuc2hvd0ZpbmRCdXR0b24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMuc2hvd0ZpbmRCdXR0b24gPSB0cnVlO1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gdG9kbyByZW1vdmUgdGhpcyBoYWNrOlxuICAgICAgICAgICAgY29uc3Qgdmlld0ZpbmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlld0ZpbmQnKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGlmICh2aWV3RmluZCkge1xuICAgICAgICAgICAgICB2aWV3RmluZC5jbGFzc0xpc3QucmVtb3ZlKCdpbnZpc2libGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGZpbmRiYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZGJhcicpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgaWYgKGZpbmRiYXIpIHtcbiAgICAgICAgICAgICAgZmluZGJhci5jbGFzc0xpc3QucmVtb3ZlKCdpbnZpc2libGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgICBvcHRpb25zLnNldCgndGV4dExheWVyTW9kZScsIHRoaXMuc2hvd0hhbmRUb29sQnV0dG9uID8gcGRmRGVmYXVsdE9wdGlvbnMudGV4dExheWVyTW9kZSA6IDApO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5zaG93SGFuZFRvb2xCdXR0b24pIHtcbiAgICAgICAgICBpZiAodGhpcy5zaG93RmluZEJ1dHRvbiB8fCB0aGlzLnNob3dGaW5kQnV0dG9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuc2hvd0ZpbmRCdXR0b24gPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHRoaXMubG9nTGV2ZWwgPj0gVmVyYm9zaXR5TGV2ZWwuV0FSTklOR1MpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICAgICAgICAnSGlkaW5nIHRoZSBcImZpbmRcIiBidXR0b24gYmVjYXVzZSB0aGUgdGV4dCBsYXllciBvZiB0aGUgUERGIGZpbGUgaXMgbm90IHJlbmRlcmVkLiBVc2UgW3RleHRMYXllcl09XCJ0cnVlXCIgdG8gZW5hYmxlIHRoZSBmaW5kIGJ1dHRvbi4nXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLnNob3dIYW5kVG9vbEJ1dHRvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMubG9nTGV2ZWwgPj0gVmVyYm9zaXR5TGV2ZWwuV0FSTklOR1MpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICAgICAgICAnSGlkaW5nIHRoZSBcImhhbmQgdG9vbCAvIHNlbGVjdGlvbiBtb2RlXCIgbWVudSBiZWNhdXNlIHRoZSB0ZXh0IGxheWVyIG9mIHRoZSBQREYgZmlsZSBpcyBub3QgcmVuZGVyZWQuIFVzZSBbdGV4dExheWVyXT1cInRydWVcIiB0byBlbmFibGUgdGhlIHRoZSBtZW51IGl0ZW1zLidcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgdGhpcy5zaG93SGFuZFRvb2xCdXR0b24gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMudGV4dExheWVyKSB7XG4gICAgICAgIC8vIHRvZG86IGlzIHRoaXMgYSByZWR1bmRhbnQgY2hlY2s/XG4gICAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgICAgb3B0aW9ucy5zZXQoJ3RleHRMYXllck1vZGUnLCBwZGZEZWZhdWx0T3B0aW9ucy50ZXh0TGF5ZXJNb2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRleHRMYXllciA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLnNob3dGaW5kQnV0dG9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLnNob3dGaW5kQnV0dG9uID0gdHJ1ZTtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIC8vIHRvZG8gcmVtb3ZlIHRoaXMgaGFjazpcbiAgICAgICAgICAgIGNvbnN0IHZpZXdGaW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXdGaW5kJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAodmlld0ZpbmQpIHtcbiAgICAgICAgICAgICAgdmlld0ZpbmQuY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBmaW5kYmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRiYXInKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGlmIChmaW5kYmFyKSB7XG4gICAgICAgICAgICAgIGZpbmRiYXIuY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHRvZG86IGlzIHRoZSBlbHNlIGJyYW5jaCBkZWFkIGNvZGU/XG4gICAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgICAgb3B0aW9ucy5zZXQoJ3RleHRMYXllck1vZGUnLCAwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRleHRMYXllciA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5zaG93RmluZEJ1dHRvbikge1xuICAgICAgICAgIGlmICh0aGlzLmxvZ0xldmVsID49IFZlcmJvc2l0eUxldmVsLldBUk5JTkdTKSB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0hpZGluZyB0aGUgXCJmaW5kXCIgYnV0dG9uIGJlY2F1c2UgdGhlIHRleHQgbGF5ZXIgb2YgdGhlIFBERiBmaWxlIGlzIG5vdCByZW5kZXJlZC4gVXNlIFt0ZXh0TGF5ZXJdPVwidHJ1ZVwiIHRvIGVuYWJsZSB0aGUgZmluZCBidXR0b24uJyk7XG4gICAgICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnNob3dGaW5kQnV0dG9uID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2hvd0hhbmRUb29sQnV0dG9uKSB7XG4gICAgICAgICAgaWYgKHRoaXMubG9nTGV2ZWwgPj0gVmVyYm9zaXR5TGV2ZWwuV0FSTklOR1MpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICAgICAgICAnSGlkaW5nIHRoZSBcImhhbmQgdG9vbCAvIHNlbGVjdGlvbiBtb2RlXCIgbWVudSBiZWNhdXNlIHRoZSB0ZXh0IGxheWVyIG9mIHRoZSBQREYgZmlsZSBpcyBub3QgcmVuZGVyZWQuIFVzZSBbdGV4dExheWVyXT1cInRydWVcIiB0byBlbmFibGUgdGhlIHRoZSBtZW51IGl0ZW1zLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLnNob3dIYW5kVG9vbEJ1dHRvbiA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgb3ZlcnJpZGVEZWZhdWx0U2V0dGluZ3MoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47IC8vIHNlcnZlciBzaWRlIHJlbmRlcmluZ1xuICAgIH1cbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnMgYXMgSVBERlZpZXdlckFwcGxpY2F0aW9uT3B0aW9ucztcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Zm9yaW5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBwZGZEZWZhdWx0T3B0aW9ucykge1xuICAgICAgb3B0aW9ucy5zZXQoa2V5LCBwZGZEZWZhdWx0T3B0aW9uc1trZXldKTtcbiAgICB9XG4gICAgb3B0aW9ucy5zZXQoJ2Rpc2FibGVQcmVmZXJlbmNlcycsIHRydWUpO1xuICAgIGF3YWl0IHRoaXMuc2V0Wm9vbSgpO1xuXG4gICAgb3B0aW9ucy5zZXQoJ2lnbm9yZUtleWJvYXJkJywgdGhpcy5pZ25vcmVLZXlib2FyZCk7XG4gICAgb3B0aW9ucy5zZXQoJ2lnbm9yZUtleXMnLCB0aGlzLmlnbm9yZUtleXMpO1xuICAgIG9wdGlvbnMuc2V0KCdhY2NlcHRLZXlzJywgdGhpcy5hY2NlcHRLZXlzKTtcbiAgICB0aGlzLmFjdGl2YXRlVGV4dGxheWVySWZOZWNlc3Nhcnkob3B0aW9ucyk7XG5cbiAgICBpZiAodGhpcy5zY3JvbGxNb2RlIHx8IHRoaXMuc2Nyb2xsTW9kZSA9PT0gU2Nyb2xsTW9kZVR5cGUudmVydGljYWwpIHtcbiAgICAgIG9wdGlvbnMuc2V0KCdzY3JvbGxNb2RlT25Mb2FkJywgdGhpcy5zY3JvbGxNb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBzaWRlYmFyVmlzaWJsZSA9IHRoaXMuc2lkZWJhclZpc2libGU7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9IHRoaXMuUERGVmlld2VyQXBwbGljYXRpb247XG5cbiAgICBpZiAoc2lkZWJhclZpc2libGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgUERGVmlld2VyQXBwbGljYXRpb24uc2lkZWJhclZpZXdPbkxvYWQgPSBzaWRlYmFyVmlzaWJsZSA/IDEgOiAwO1xuICAgICAgaWYgKFBERlZpZXdlckFwcGxpY2F0aW9uLmFwcENvbmZpZykge1xuICAgICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5hcHBDb25maWcuc2lkZWJhclZpZXdPbkxvYWQgPSBzaWRlYmFyVmlzaWJsZSA/IHRoaXMuYWN0aXZlU2lkZWJhclZpZXcgOiBQZGZTaWRlYmFyVmlldy5OT05FO1xuICAgICAgfVxuICAgICAgb3B0aW9ucy5zZXQoJ3NpZGViYXJWaWV3T25Mb2FkJywgdGhpcy5zaWRlYmFyVmlzaWJsZSA/IHRoaXMuYWN0aXZlU2lkZWJhclZpZXcgOiAwKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc3ByZWFkID09PSAnZXZlbicpIHtcbiAgICAgIG9wdGlvbnMuc2V0KCdzcHJlYWRNb2RlT25Mb2FkJywgMik7XG4gICAgICBpZiAoUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyKSB7XG4gICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5zcHJlYWRNb2RlID0gMjtcbiAgICAgIH1cbiAgICAgIHRoaXMub25TcHJlYWRDaGFuZ2UoJ2V2ZW4nKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3ByZWFkID09PSAnb2RkJykge1xuICAgICAgb3B0aW9ucy5zZXQoJ3NwcmVhZE1vZGVPbkxvYWQnLCAxKTtcbiAgICAgIGlmIChQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIpIHtcbiAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLnNwcmVhZE1vZGUgPSAxO1xuICAgICAgfVxuICAgICAgdGhpcy5vblNwcmVhZENoYW5nZSgnb2RkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMuc2V0KCdzcHJlYWRNb2RlT25Mb2FkJywgMCk7XG4gICAgICBpZiAoUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyKSB7XG4gICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5zcHJlYWRNb2RlID0gMDtcbiAgICAgIH1cbiAgICAgIHRoaXMub25TcHJlYWRDaGFuZ2UoJ29mZicpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcmludFJlc29sdXRpb24pIHtcbiAgICAgIG9wdGlvbnMuc2V0KCdwcmludFJlc29sdXRpb24nLCB0aGlzLnByaW50UmVzb2x1dGlvbik7XG4gICAgfVxuICAgIGlmICh0aGlzLnNob3dCb3JkZXJzID09PSBmYWxzZSkge1xuICAgICAgb3B0aW9ucy5zZXQoJ3JlbW92ZVBhZ2VCb3JkZXJzJywgIXRoaXMuc2hvd0JvcmRlcnMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb3BlblBERigpIHtcbiAgICBTZXJ2aWNlV29ya2VyT3B0aW9ucy5zaG93VW52ZXJpZmllZFNpZ25hdHVyZXMgPSB0aGlzLnNob3dVbnZlcmlmaWVkU2lnbmF0dXJlcztcbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5lbmFibGVQcmludCA9IHRoaXMuZW5hYmxlUHJpbnQ7XG4gICAgdGhpcy5zZXJ2aWNlLm5neEV4dGVuZGVkUGRmVmlld2VySW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudExpc3RlbmVycyhQREZWaWV3ZXJBcHBsaWNhdGlvbik7XG4gICAgdGhpcy5zZWxlY3RDdXJzb3JUb29sKCk7XG4gICAgaWYgKCF0aGlzLmxpc3RlblRvVVJMKSB7XG4gICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZMaW5rU2VydmljZS5zZXRIYXNoID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zcmMpIHtcbiAgICAgIHRoaXMubmd4RXh0ZW5kZWRQZGZWaWV3ZXJJbmNvbXBsZXRlbHlJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgICAgdGhpcy5pbml0VGltZW91dCA9IHVuZGVmaW5lZDtcblxuICAgICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB0aGlzLmNoZWNrSGVpZ2h0KCksIDEwMCk7XG4gICAgICAvLyBvcGVuIGEgZmlsZSBpbiB0aGUgdmlld2VyXG4gICAgICBpZiAoISF0aGlzLl9zcmMpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogYW55ID0ge1xuICAgICAgICAgIHBhc3N3b3JkOiB0aGlzLnBhc3N3b3JkLFxuICAgICAgICAgIHZlcmJvc2l0eTogdGhpcy5sb2dMZXZlbCxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMuX3NyY1sncmFuZ2UnXSkge1xuICAgICAgICAgIG9wdGlvbnMucmFuZ2UgPSB0aGlzLl9zcmNbJ3JhbmdlJ107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaHR0cEhlYWRlcnMpIHtcbiAgICAgICAgICBvcHRpb25zLmh0dHBIZWFkZXJzID0gdGhpcy5odHRwSGVhZGVycztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hdXRob3JpemF0aW9uKSB7XG4gICAgICAgICAgb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmF1dGhvcml6YXRpb24gIT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuaHR0cEhlYWRlcnMpIG9wdGlvbnMuaHR0cEhlYWRlcnMgPSB7fTtcblxuICAgICAgICAgICAgb3B0aW9ucy5odHRwSGVhZGVycy5BdXRob3JpemF0aW9uID0gdGhpcy5hdXRob3JpemF0aW9uO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLmJhc2VIcmVmID0gdGhpcy5iYXNlSHJlZjtcbiAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24ub25FcnJvciA9IChlcnJvcjogRXJyb3IpID0+IHRoaXMucGRmTG9hZGluZ0ZhaWxlZC5lbWl0KGVycm9yKTtcbiAgICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5fc3JjID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgb3B0aW9ucy51cmwgPSB0aGlzLl9zcmM7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9zcmMgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgICAgICAgb3B0aW9ucy5kYXRhID0gdGhpcy5fc3JjO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fc3JjIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICAgICAgb3B0aW9ucy5kYXRhID0gdGhpcy5fc3JjO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvcHRpb25zLnJhbmdlQ2h1bmtTaXplID0gcGRmRGVmYXVsdE9wdGlvbnMucmFuZ2VDaHVua1NpemU7XG4gICAgICAgICAgYXdhaXQgUERGVmlld2VyQXBwbGljYXRpb24ub3BlbihvcHRpb25zKTtcbiAgICAgICAgICB0aGlzLnBkZkxvYWRpbmdTdGFydHMuZW1pdCh7fSk7XG4gICAgICAgICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB0aGlzLnNldFpvb20oKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5zaHV0dGluZ0Rvd24pIHtcbiAgICAgICAgICAvLyBodXJyaWVkIHVzZXJzIHNvbWV0aW1lcyByZWxvYWQgdGhlIFBERiBiZWZvcmUgaXQgaGFzIGZpbmlzaGVkIGluaXRpYWxpemluZ1xuICAgICAgICAgIGlmICh0aGlzLnBhZ2UpIHtcbiAgICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBhZ2UgPSBOdW1iZXIodGhpcy5wYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZWdpc3RlckV2ZW50TGlzdGVuZXJzKFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24pIHtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbignYW5ub3RhdGlvbi1lZGl0b3ItZXZlbnQnLCAoeDogQW5ub3RhdGlvbkVkaXRvckV2ZW50KSA9PiB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmFubm90YXRpb25FZGl0b3JFdmVudC5lbWl0KHgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbigndG9nZ2xlU2lkZWJhcicsICh4OiBUb2dnbGVTaWRlYmFyRXZlbnQpID0+IHtcbiAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMuc2lkZWJhclZpc2libGUgPSB4LnZpc2libGU7XG4gICAgICAgIHRoaXMuc2lkZWJhclZpc2libGVDaGFuZ2UuZW1pdCh4LnZpc2libGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbigndGV4dGxheWVycmVuZGVyZWQnLCAoeDogVGV4dExheWVyUmVuZGVyZWRFdmVudCkgPT4ge1xuICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHRoaXMudGV4dExheWVyUmVuZGVyZWQuZW1pdCh4KSk7XG4gICAgfSk7XG5cbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbignYW5ub3RhdGlvbmVkaXRvcm1vZGVjaGFuZ2VkJywgKHg6IEFubm90YXRpb25FZGl0b3JFZGl0b3JNb2RlQ2hhbmdlZEV2ZW50KSA9PiB7XG4gICAgICAvLyB3ZSdyZSB1c2luZyBhIHRpbWVvdXQgaGVyZSB0byBtYWtlIHN1cmUgdGhlIGVkaXRvciBpcyBhbHJlYWR5IHZpc2libGVcbiAgICAgIC8vIHdoZW4gdGhlIGV2ZW50IGlzIGNhdWdodC4gUGRmLmpzIGZpcmVzIGl0IGEgYml0IGVhcmx5LlxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmFubm90YXRpb25FZGl0b3JNb2RlQ2hhbmdlZC5lbWl0KHgpKTtcbiAgICAgIGlmICh4Lm1vZGUgPT09IDApIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCduZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci1wcmV2ZW50LXRvdWNoLW1vdmUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXItcHJldmVudC10b3VjaC1tb3ZlJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbignc2Nyb2xsbW9kZWNoYW5nZWQnLCAoeDogU2Nyb2xsTW9kZUNoYW5nZWRFdmVudCkgPT4ge1xuICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsTW9kZSA9IHgubW9kZTtcbiAgICAgICAgdGhpcy5zY3JvbGxNb2RlQ2hhbmdlLmVtaXQoeC5tb2RlKTtcbiAgICAgICAgaWYgKHgubW9kZSA9PT0gU2Nyb2xsTW9kZVR5cGUucGFnZSkge1xuICAgICAgICAgIGlmICh0aGlzLnBhZ2VWaWV3TW9kZSAhPT0gJ3NpbmdsZScpIHtcbiAgICAgICAgICAgIHRoaXMucGFnZVZpZXdNb2RlQ2hhbmdlLmVtaXQoJ3NpbmdsZScpO1xuICAgICAgICAgICAgdGhpcy5fcGFnZVZpZXdNb2RlID0gJ3NpbmdsZSc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbigncHJvZ3Jlc3MnLCAoeDogUHJvZ3Jlc3NCYXJFdmVudCkgPT4ge1xuICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHRoaXMucHJvZ3Jlc3MuZW1pdCh4KSk7XG4gICAgfSk7XG4gICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMub24oJ2ZpbmRiYXJjbG9zZScsICgpID0+IHtcbiAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMuZmluZGJhclZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5maW5kYmFyVmlzaWJsZUNoYW5nZS5lbWl0KGZhbHNlKTtcbiAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbignZmluZGJhcm9wZW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmZpbmRiYXJWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5maW5kYmFyVmlzaWJsZUNoYW5nZS5lbWl0KHRydWUpO1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLm9uKCdwcm9wZXJ0aWVzZGlhbG9nY2xvc2UnLCAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BlcnRpZXNEaWFsb2dWaXNpYmxlID0gZmFsc2U7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4gdGhpcy5wcm9wZXJ0aWVzRGlhbG9nVmlzaWJsZUNoYW5nZS5lbWl0KGZhbHNlKSk7XG4gICAgfSk7XG4gICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMub24oJ3Byb3BlcnRpZXNkaWFsb2dvcGVuJywgKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wZXJ0aWVzRGlhbG9nVmlzaWJsZSA9IHRydWU7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4gdGhpcy5wcm9wZXJ0aWVzRGlhbG9nVmlzaWJsZUNoYW5nZS5lbWl0KHRydWUpKTtcbiAgICB9KTtcblxuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLm9uKCdwYWdlc2xvYWRlZCcsICh4OiBQYWdlc0xvYWRlZEV2ZW50KSA9PiB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4gdGhpcy5wYWdlc0xvYWRlZC5lbWl0KHgpKTtcbiAgICAgIHRoaXMucmVtb3ZlU2Nyb2xsYmFySW5JbmZpbml0ZVNjcm9sbE1vZGUoZmFsc2UpO1xuICAgICAgaWYgKHRoaXMucm90YXRpb24gIT09IHVuZGVmaW5lZCAmJiB0aGlzLnJvdGF0aW9uICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHIgPSBOdW1iZXIodGhpcy5yb3RhdGlvbik7XG4gICAgICAgIGlmIChyID09PSAwIHx8IHIgPT09IDkwIHx8IHIgPT09IDE4MCB8fCByID09PSAyNzApIHtcbiAgICAgICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIucGFnZXNSb3RhdGlvbiA9IHI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuc2h1dHRpbmdEb3duKSB7XG4gICAgICAgICAgLy8gaHVycmllZCB1c2VycyBzb21ldGltZXMgcmVsb2FkIHRoZSBQREYgYmVmb3JlIGl0IGhhcyBmaW5pc2hlZCBpbml0aWFsaXppbmdcbiAgICAgICAgICBpZiAodGhpcy5uYW1lZGRlc3QpIHtcbiAgICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZkxpbmtTZXJ2aWNlLmdvVG9EZXN0aW5hdGlvbih0aGlzLm5hbWVkZGVzdCk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBhZ2UpIHtcbiAgICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBhZ2UgPSBOdW1iZXIodGhpcy5wYWdlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFnZUxhYmVsKSB7XG4gICAgICAgICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIuY3VycmVudFBhZ2VMYWJlbCA9IHRoaXMucGFnZUxhYmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnNldFpvb20oKTtcbiAgICB9KTtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbigncGFnZXJlbmRlcmVkJywgKHg6IFBhZ2VSZW5kZXJlZEV2ZW50KSA9PiB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnBhZ2VSZW5kZXJlZC5lbWl0KHgpO1xuICAgICAgICB0aGlzLnJlbW92ZVNjcm9sbGJhckluSW5maW5pdGVTY3JvbGxNb2RlKGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLm9uKCdwYWdlcmVuZGVyJywgKHg6IFBhZ2VSZW5kZXJFdmVudCkgPT4ge1xuICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5wYWdlUmVuZGVyLmVtaXQoeCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLm9uKCdkb3dubG9hZCcsICh4OiBQZGZEb3dubG9hZGVkRXZlbnQpID0+IHtcbiAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMucGRmRG93bmxvYWRlZC5lbWl0KHgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMub24oJ3NjYWxlY2hhbmdpbmcnLCAoeDogU2NhbGVDaGFuZ2luZ0V2ZW50KSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5jdXJyZW50Wm9vbUZhY3Rvci5lbWl0KHguc2NhbGUpO1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoeC5wcmVzZXRWYWx1ZSAhPT0gJ2F1dG8nICYmIHgucHJlc2V0VmFsdWUgIT09ICdwYWdlLWZpdCcgJiYgeC5wcmVzZXRWYWx1ZSAhPT0gJ3BhZ2UtYWN0dWFsJyAmJiB4LnByZXNldFZhbHVlICE9PSAncGFnZS13aWR0aCcpIHtcbiAgICAgICAgLy8gaWdub3JlIHJvdW5kaW5nIGRpZmZlcmVuY2VzXG4gICAgICAgIGlmIChNYXRoLmFicyh4LnByZXZpb3VzU2NhbGUgLSB4LnNjYWxlKSA+IDAuMDAwMDAxKSB7XG4gICAgICAgICAgdGhpcy56b29tID0geC5zY2FsZSAqIDEwMDtcbiAgICAgICAgICB0aGlzLnpvb21DaGFuZ2UuZW1pdCh4LnNjYWxlICogMTAwKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh4LnByZXZpb3VzUHJlc2V0VmFsdWUgIT09IHgucHJlc2V0VmFsdWUpIHtcbiAgICAgICAgLy8gY2FsbGVkIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBvbmUgb2YgdGhlIHRleHQgdmFsdWVzIG9mIHRoZSB6b29tIHNlbGVjdCBkcm9wZG93blxuICAgICAgICB0aGlzLnpvb21DaGFuZ2UuZW1pdCh4LnByZXNldFZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLm9uKCdyb3RhdGlvbmNoYW5naW5nJywgKHg6IFBhZ2VzUm90YXRpb25FdmVudCkgPT4ge1xuICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5yb3RhdGlvbkNoYW5nZS5lbWl0KHgucGFnZXNSb3RhdGlvbik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbignZmlsZWlucHV0Y2hhbmdlJywgKHg6IEZpbGVJbnB1dENoYW5nZWQpID0+IHtcbiAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIGlmICh4LmZpbGVJbnB1dC5maWxlcyAmJiB4LmZpbGVJbnB1dC5maWxlcy5sZW5ndGggPj0gMSkge1xuICAgICAgICAgIC8vIGRyYWcgYW5kIGRyb3BcbiAgICAgICAgICB0aGlzLnNyY0NoYW5nZS5lbWl0KHguZmlsZUlucHV0LmZpbGVzWzBdLm5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHJlZ3VsYXIgZmlsZSBvcGVuIGRpYWxvZ1xuICAgICAgICAgIGNvbnN0IHBhdGggPSB4LmZpbGVJbnB1dD8udmFsdWU/LnJlcGxhY2UoJ0M6XFxcXGZha2VwYXRoXFxcXCcsICcnKTtcbiAgICAgICAgICB0aGlzLnNyY0NoYW5nZS5lbWl0KHBhdGgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbignY3Vyc29ydG9vbGNoYW5nZWQnLCAoeDogSGFuZHRvb2xDaGFuZ2VkKSA9PiB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmhhbmRUb29sID0geC50b29sID09PSBQZGZDdXJzb3JUb29scy5IQU5EO1xuICAgICAgICB0aGlzLmhhbmRUb29sQ2hhbmdlLmVtaXQoeC50b29sID09PSBQZGZDdXJzb3JUb29scy5IQU5EKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMub24oJ3NpZGViYXJ2aWV3Y2hhbmdlZCcsICh4OiBTaWRlYmFydmlld0NoYW5nZSkgPT4ge1xuICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5zaWRlYmFyVmlzaWJsZUNoYW5nZS5lbWl0KHgudmlldyA+IDApO1xuICAgICAgICBpZiAoeC52aWV3ID4gMCkge1xuICAgICAgICAgIHRoaXMuYWN0aXZlU2lkZWJhclZpZXdDaGFuZ2UuZW1pdCh4LnZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNpZGViYXJDb21wb25lbnQpIHtcbiAgICAgICAgICB0aGlzLnNpZGViYXJDb21wb25lbnQuc2hvd1Rvb2xiYXJXaGVuTmVjZXNzYXJ5KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMub24oJ2RvY3VtZW50bG9hZGVkJywgKHBkZkxvYWRlZEV2ZW50OiBQZGZEb2N1bWVudExvYWRlZEV2ZW50KSA9PiB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBwYWdlcyA9IHBkZkxvYWRlZEV2ZW50LnNvdXJjZS5wYWdlc0NvdW50O1xuICAgICAgICB0aGlzLnBhZ2VMYWJlbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHRoaXMucGFnZSAmJiB0aGlzLnBhZ2UgPj0gcGFnZXMpIHtcbiAgICAgICAgICB0aGlzLnBhZ2UgPSBwYWdlcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjcm9sbFNpZ25hdHVyZVdhcm5pbmdJbnRvVmlldyhwZGZMb2FkZWRFdmVudC5zb3VyY2UucGRmRG9jdW1lbnQpO1xuICAgICAgICB0aGlzLnBkZkxvYWRlZC5lbWl0KHsgcGFnZXNDb3VudDogcGRmTG9hZGVkRXZlbnQuc291cmNlLnBkZkRvY3VtZW50Py5udW1QYWdlcyB9IGFzIFBkZkxvYWRlZEV2ZW50KTtcbiAgICAgICAgaWYgKHRoaXMuZmluZGJhclZpc2libGUpIHtcbiAgICAgICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5maW5kQmFyLm9wZW4oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcm9wZXJ0aWVzRGlhbG9nVmlzaWJsZSkge1xuICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZkRvY3VtZW50UHJvcGVydGllcy5vcGVuKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMub24oJ3NwcmVhZG1vZGVjaGFuZ2VkJywgKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RlcyA9IFsnb2ZmJywgJ29kZCcsICdldmVuJ10gYXMgQXJyYXk8U3ByZWFkVHlwZT47XG4gICAgICAgIHRoaXMuc3ByZWFkID0gbW9kZXNbZXZlbnQubW9kZV07XG4gICAgICAgIHRoaXMuc3ByZWFkQ2hhbmdlLmVtaXQodGhpcy5zcHJlYWQpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBoaWRlU2lkZWJhclRvb2xiYXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zaWRlYmFyQ29tcG9uZW50KSB7XG4gICAgICAgICAgdGhpcy5zaWRlYmFyQ29tcG9uZW50LnNob3dUb29sYmFyV2hlbk5lY2Vzc2FyeSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMub24oJ291dGxpbmVsb2FkZWQnLCBoaWRlU2lkZWJhclRvb2xiYXIpO1xuXG4gICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMub24oJ2F0dGFjaG1lbnRzbG9hZGVkJywgaGlkZVNpZGViYXJUb29sYmFyKTtcblxuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLm9uKCdsYXllcnNsb2FkZWQnLCBoaWRlU2lkZWJhclRvb2xiYXIpO1xuXG4gICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMub24oJ2Fubm90YXRpb25sYXllcnJlbmRlcmVkJywgKGV2ZW50OiBBbm5vdGF0aW9uTGF5ZXJSZW5kZXJlZEV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBkaXYgPSBldmVudC5zb3VyY2UuZGl2O1xuICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgZXZlbnQuaW5pdGlhbEZvcm1EYXRhU3RvcmVkSW5UaGVQREYgPSB0aGlzLmZvcm1TdXBwb3J0LmluaXRpYWxGb3JtRGF0YVN0b3JlZEluVGhlUERGO1xuICAgICAgICB0aGlzLmFubm90YXRpb25MYXllclJlbmRlcmVkLmVtaXQoZXZlbnQpO1xuICAgICAgICB0aGlzLmVuYWJsZU9yRGlzYWJsZUZvcm1zKGRpdiwgdHJ1ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbignYW5ub3RhdGlvbmVkaXRvcmxheWVycmVuZGVyZWQnLCAoZXZlbnQpID0+IHRoaXMubmdab25lLnJ1bigoKSA9PiB0aGlzLmFubm90YXRpb25FZGl0b3JMYXllclJlbmRlcmVkLmVtaXQoZXZlbnQpKSk7XG4gICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMub24oJ3hmYWxheWVycmVuZGVyZWQnLCAoZXZlbnQpID0+IHRoaXMubmdab25lLnJ1bigoKSA9PiB0aGlzLnhmYUxheWVyUmVuZGVyZWQuZW1pdChldmVudCkpKTtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbignb3V0bGluZWxvYWRlZCcsIChldmVudCkgPT4gdGhpcy5uZ1pvbmUucnVuKCgpID0+IHRoaXMub3V0bGluZUxvYWRlZC5lbWl0KGV2ZW50KSkpO1xuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLm9uKCdhdHRhY2htZW50c2xvYWRlZCcsIChldmVudCkgPT4gdGhpcy5uZ1pvbmUucnVuKCgpID0+IHRoaXMuYXR0YWNobWVudHNsb2FkZWQuZW1pdChldmVudCkpKTtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbignbGF5ZXJzbG9hZGVkJywgKGV2ZW50KSA9PiB0aGlzLm5nWm9uZS5ydW4oKCkgPT4gdGhpcy5sYXllcnNsb2FkZWQuZW1pdChldmVudCkpKTtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbigncHJlc2VudGF0aW9ubW9kZWNoYW5nZWQnLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSB0aGlzLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgICAgUERGVmlld2VyQXBwbGljYXRpb24/LnBkZlZpZXdlcj8uZGVzdHJveUJvb2tNb2RlKCk7XG4gICAgfSk7XG5cbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbigndXBkYXRlZmluZGNvbnRyb2xzdGF0ZScsICh4OiBGaW5kUmVzdWx0KSA9PiB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBsZXQgdHlwZSA9IFBERlZpZXdlckFwcGxpY2F0aW9uLmZpbmRDb250cm9sbGVyLnN0YXRlLnR5cGUgfHwgJ2ZpbmQnO1xuICAgICAgICBpZiAodHlwZSA9PT0gJ2FnYWluJykge1xuICAgICAgICAgIHR5cGUgPSAnZmluZGFnYWluJztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgICAgY2FzZVNlbnNpdGl2ZTogUERGVmlld2VyQXBwbGljYXRpb24uZmluZENvbnRyb2xsZXIuc3RhdGUuY2FzZVNlbnNpdGl2ZSxcbiAgICAgICAgICBlbnRpcmVXb3JkOiBQREZWaWV3ZXJBcHBsaWNhdGlvbi5maW5kQ29udHJvbGxlci5zdGF0ZS5lbnRpcmVXb3JkLFxuICAgICAgICAgIGZpbmRQcmV2aW91czogUERGVmlld2VyQXBwbGljYXRpb24uZmluZENvbnRyb2xsZXIuc3RhdGUuZmluZFByZXZpb3VzLFxuICAgICAgICAgIGhpZ2hsaWdodEFsbDogUERGVmlld2VyQXBwbGljYXRpb24uZmluZENvbnRyb2xsZXIuc3RhdGUuaGlnaGxpZ2h0QWxsLFxuICAgICAgICAgIG1hdGNoRGlhY3JpdGljczogUERGVmlld2VyQXBwbGljYXRpb24uZmluZENvbnRyb2xsZXIuc3RhdGUubWF0Y2hEaWFjcml0aWNzLFxuICAgICAgICAgIHF1ZXJ5OiBQREZWaWV3ZXJBcHBsaWNhdGlvbi5maW5kQ29udHJvbGxlci5zdGF0ZS5xdWVyeSxcbiAgICAgICAgICB0eXBlLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZUZpbmRNYXRjaGVzQ291bnQuZW1pdCh7XG4gICAgICAgICAgLi4ucmVzdWx0LFxuICAgICAgICAgIGN1cnJlbnQ6IHgubWF0Y2hlc0NvdW50LmN1cnJlbnQsXG4gICAgICAgICAgdG90YWw6IHgubWF0Y2hlc0NvdW50LnRvdGFsLFxuICAgICAgICAgIG1hdGNoZXM6IFBERlZpZXdlckFwcGxpY2F0aW9uLmZpbmRDb250cm9sbGVyLl9wYWdlTWF0Y2hlcyxcbiAgICAgICAgICBtYXRjaGVzTGVuZ3RoOiBQREZWaWV3ZXJBcHBsaWNhdGlvbi5maW5kQ29udHJvbGxlci5fcGFnZU1hdGNoZXNMZW5ndGgsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLnVwZGF0ZUZpbmRTdGF0ZSkge1xuICAgICAgICAgIHRoaXMudXBkYXRlRmluZFN0YXRlLmVtaXQoeC5zdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLm9uKCd1cGRhdGVmaW5kbWF0Y2hlc2NvdW50JywgKHg6IEZpbmRSZXN1bHQpID0+IHtcbiAgICAgIHgubWF0Y2hlc0NvdW50Lm1hdGNoZXMgPSBQREZWaWV3ZXJBcHBsaWNhdGlvbi5maW5kQ29udHJvbGxlci5fcGFnZU1hdGNoZXM7XG4gICAgICB4Lm1hdGNoZXNDb3VudC5tYXRjaGVzTGVuZ3RoID0gUERGVmlld2VyQXBwbGljYXRpb24uZmluZENvbnRyb2xsZXIuX3BhZ2VNYXRjaGVzTGVuZ3RoO1xuICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+XG4gICAgICAgIHRoaXMudXBkYXRlRmluZE1hdGNoZXNDb3VudC5lbWl0KHtcbiAgICAgICAgICBjYXNlU2Vuc2l0aXZlOiBQREZWaWV3ZXJBcHBsaWNhdGlvbi5maW5kQ29udHJvbGxlci5zdGF0ZS5jYXNlU2Vuc2l0aXZlLFxuICAgICAgICAgIGVudGlyZVdvcmQ6IFBERlZpZXdlckFwcGxpY2F0aW9uLmZpbmRDb250cm9sbGVyLnN0YXRlLmVudGlyZVdvcmQsXG4gICAgICAgICAgZmluZFByZXZpb3VzOiBQREZWaWV3ZXJBcHBsaWNhdGlvbi5maW5kQ29udHJvbGxlci5zdGF0ZS5maW5kUHJldmlvdXMsXG4gICAgICAgICAgaGlnaGxpZ2h0QWxsOiBQREZWaWV3ZXJBcHBsaWNhdGlvbi5maW5kQ29udHJvbGxlci5zdGF0ZS5oaWdobGlnaHRBbGwsXG4gICAgICAgICAgbWF0Y2hEaWFjcml0aWNzOiBQREZWaWV3ZXJBcHBsaWNhdGlvbi5maW5kQ29udHJvbGxlci5zdGF0ZS5tYXRjaERpYWNyaXRpY3MsXG4gICAgICAgICAgcXVlcnk6IFBERlZpZXdlckFwcGxpY2F0aW9uLmZpbmRDb250cm9sbGVyLnN0YXRlLnF1ZXJ5LFxuICAgICAgICAgIHR5cGU6IFBERlZpZXdlckFwcGxpY2F0aW9uLmZpbmRDb250cm9sbGVyLnN0YXRlLnR5cGUsXG4gICAgICAgICAgY3VycmVudDogeC5tYXRjaGVzQ291bnQuY3VycmVudCxcbiAgICAgICAgICB0b3RhbDogeC5tYXRjaGVzQ291bnQudG90YWwsXG4gICAgICAgICAgbWF0Y2hlczogeC5tYXRjaGVzQ291bnQubWF0Y2hlcyxcbiAgICAgICAgICBtYXRjaGVzTGVuZ3RoOiB4Lm1hdGNoZXNDb3VudC5tYXRjaGVzTGVuZ3RoLFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLm9uKCdwYWdlY2hhbmdpbmcnLCAoeDogUGFnZU51bWJlckNoYW5nZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnNodXR0aW5nRG93bikge1xuICAgICAgICAvLyBodXJyaWVkIHVzZXJzIHNvbWV0aW1lcyByZWxvYWQgdGhlIFBERiBiZWZvcmUgaXQgaGFzIGZpbmlzaGVkIGluaXRpYWxpemluZ1xuICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYWdlID0gUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLmN1cnJlbnRQYWdlTnVtYmVyO1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYWdlTGFiZWwgPSBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIuY3VycmVudFBhZ2VMYWJlbDtcblxuICAgICAgICAgIGlmIChjdXJyZW50UGFnZSAhPT0gdGhpcy5wYWdlKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VDaGFuZ2UuZW1pdChjdXJyZW50UGFnZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50UGFnZUxhYmVsICE9PSB0aGlzLnBhZ2VMYWJlbCkge1xuICAgICAgICAgICAgdGhpcy5wYWdlTGFiZWxDaGFuZ2UuZW1pdChjdXJyZW50UGFnZUxhYmVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVTY3JvbGxiYXJJbkluZmluaXRlU2Nyb2xsTW9kZShyZXN0b3JlSGVpZ2h0OiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGFnZVZpZXdNb2RlID09PSAnaW5maW5pdGUtc2Nyb2xsJyB8fCByZXN0b3JlSGVpZ2h0KSB7XG4gICAgICBjb25zdCB2aWV3ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlld2VyJyk7XG4gICAgICBjb25zdCB6b29tID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnem9vbScpWzBdO1xuICAgICAgaWYgKHZpZXdlcikge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5wYWdlVmlld01vZGUgPT09ICdpbmZpbml0ZS1zY3JvbGwnKSB7XG4gICAgICAgICAgICBjb25zdCBoZWlnaHQgPSB2aWV3ZXIuY2xpZW50SGVpZ2h0ICsgMTc7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmltYXJ5TWVudVZpc2libGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQgKyAzNSArICdweCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGhlaWdodCA+IDE3KSB7XG4gICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9ICcxMDAlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh6b29tKSB7XG4gICAgICAgICAgICAgICg8SFRNTEVsZW1lbnQ+em9vbSkuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN0b3JlSGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLmF1dG9IZWlnaHQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5jaGVja0hlaWdodCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzeW5jIG9wZW5QREYyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMub3ZlcnJpZGVEZWZhdWx0U2V0dGluZ3MoKTtcbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIuZGVzdHJveUJvb2tNb2RlKCk7XG4gICAgUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLnN0b3BSZW5kZXJpbmcoKTtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZUaHVtYm5haWxWaWV3ZXIuc3RvcFJlbmRlcmluZygpO1xuXG4gICAgLy8gIzgwMiBjbGVhciB0aGUgZm9ybSBkYXRhOyBvdGhlcndpc2UgdGhlIFwiZG93bmxvYWRcIiBkaWFsb2dzIG9wZW5zXG4gICAgUERGVmlld2VyQXBwbGljYXRpb24ucGRmRG9jdW1lbnQ/LmFubm90YXRpb25TdG9yYWdlPy5yZXNldE1vZGlmaWVkKCk7XG5cbiAgICBhd2FpdCBQREZWaWV3ZXJBcHBsaWNhdGlvbi5jbG9zZSgpO1xuICAgIHRoaXMuZm9ybVN1cHBvcnQ/LnJlc2V0KCk7XG5cbiAgICBjb25zdCBvcHRpb25zOiBhbnkgPSB7XG4gICAgICBwYXNzd29yZDogdGhpcy5wYXNzd29yZCxcbiAgICAgIHZlcmJvc2l0eTogdGhpcy5sb2dMZXZlbCxcbiAgICB9O1xuICAgIGlmICh0aGlzLl9zcmM/LlsncmFuZ2UnXSkge1xuICAgICAgb3B0aW9ucy5yYW5nZSA9IHRoaXMuX3NyY1sncmFuZ2UnXTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaHR0cEhlYWRlcnMpIHtcbiAgICAgIG9wdGlvbnMuaHR0cEhlYWRlcnMgPSB0aGlzLmh0dHBIZWFkZXJzO1xuICAgIH1cbiAgICBpZiAodGhpcy5hdXRob3JpemF0aW9uKSB7XG4gICAgICBvcHRpb25zLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5hdXRob3JpemF0aW9uICE9ICdib29sZWFuJykge1xuICAgICAgICBpZiAoIW9wdGlvbnMuaHR0cEhlYWRlcnMpIG9wdGlvbnMuaHR0cEhlYWRlcnMgPSB7fTtcblxuICAgICAgICBvcHRpb25zLmh0dHBIZWFkZXJzLkF1dGhvcml6YXRpb24gPSB0aGlzLmF1dGhvcml6YXRpb247XG4gICAgICB9XG4gICAgfVxuICAgIG9wdGlvbnMuYmFzZUhyZWYgPSB0aGlzLmJhc2VIcmVmO1xuICAgIHRyeSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMuX3NyYyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgb3B0aW9ucy51cmwgPSB0aGlzLl9zcmM7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3NyYyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgIG9wdGlvbnMuZGF0YSA9IHRoaXMuX3NyYztcbiAgICAgICAgaWYgKHRoaXMuX3NyYy5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgLy8gc29tZXRpbWVzIG5nT25Jbml0KCkgY2FsbHMgb3BlblBkZjIgdG9vIGVhcmx5XG4gICAgICAgICAgLy8gc28gbGV0J3MgaWdub3JlIGVtcHR5IGFycmF5c1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9zcmMgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgIG9wdGlvbnMuZGF0YSA9IHRoaXMuX3NyYztcbiAgICAgICAgaWYgKHRoaXMuX3NyYy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAvLyBzb21ldGltZXMgbmdPbkluaXQoKSBjYWxscyBvcGVuUGRmMiB0b28gZWFybHlcbiAgICAgICAgICAvLyBzbyBsZXQncyBpZ25vcmUgZW1wdHkgYXJyYXlzXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvcHRpb25zLnJhbmdlQ2h1bmtTaXplID0gcGRmRGVmYXVsdE9wdGlvbnMucmFuZ2VDaHVua1NpemU7XG4gICAgICBhd2FpdCBQREZWaWV3ZXJBcHBsaWNhdGlvbi5vcGVuKG9wdGlvbnMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLnBkZkxvYWRpbmdGYWlsZWQuZW1pdChlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZWxlY3RDdXJzb3JUb29sKCkge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSB0aGlzLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLmRpc3BhdGNoKCdzd2l0Y2hjdXJzb3J0b29sJywgeyB0b29sOiB0aGlzLmhhbmRUb29sID8gMSA6IDAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgbmdPbkRlc3Ryb3koKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5zaHV0dGluZ0Rvd24gPSB0cnVlO1xuICAgIHRoaXMuc2VydmljZS5uZ3hFeHRlbmRlZFBkZlZpZXdlckluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47IC8vIGZhc3QgZXNjYXBlIGZvciBzZXJ2ZXIgc2lkZSByZW5kZXJpbmdcbiAgICB9XG4gICAgZGVsZXRlIGdsb2JhbFRoaXNbJ3NldE5neEV4dGVuZGVkUGRmVmlld2VyU291cmNlJ107XG5cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWZ0ZXJwcmludCcsIHRoaXMuYWZ0ZXJQcmludExpc3RlbmVyKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmVmb3JlcHJpbnQnLCB0aGlzLmJlZm9yZVByaW50TGlzdGVuZXIpO1xuICAgIGRlbGV0ZSBnbG9iYWxUaGlzWyduZ3hab25lJ107XG4gICAgZGVsZXRlIGdsb2JhbFRoaXNbJ25neENvbnNvbGUnXTtcblxuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSB0aGlzLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uPy5wZGZWaWV3ZXI/LmRlc3Ryb3lCb29rTW9kZSgpO1xuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uPy5wZGZWaWV3ZXI/LnN0b3BSZW5kZXJpbmcoKTtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbj8ucGRmVGh1bWJuYWlsVmlld2VyPy5zdG9wUmVuZGVyaW5nKCk7XG4gICAgaWYgKFBERlZpZXdlckFwcGxpY2F0aW9uKSB7XG4gICAgICAoUERGVmlld2VyQXBwbGljYXRpb24ub25FcnJvciBhcyBhbnkpID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpbmFsUHJpbnQgPSBOZ3hFeHRlbmRlZFBkZlZpZXdlckNvbXBvbmVudC5vcmlnaW5hbFByaW50O1xuICAgIGlmICh3aW5kb3cgJiYgb3JpZ2luYWxQcmludCAmJiAhb3JpZ2luYWxQcmludC50b1N0cmluZygpLmluY2x1ZGVzKCdwcmludFBkZicpKSB7XG4gICAgICB3aW5kb3cucHJpbnQgPSBvcmlnaW5hbFByaW50O1xuICAgIH1cbiAgICBjb25zdCBwcmludENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcmludENvbnRhaW5lcicpO1xuICAgIGlmIChwcmludENvbnRhaW5lcikge1xuICAgICAgcHJpbnRDb250YWluZXIucGFyZW50RWxlbWVudD8ucmVtb3ZlQ2hpbGQocHJpbnRDb250YWluZXIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmluaXRUaW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5pbml0VGltZW91dCk7XG4gICAgICB0aGlzLmluaXRUaW1lb3V0ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoUERGVmlld2VyQXBwbGljYXRpb24pIHtcbiAgICAgIC8vICM4MDIgY2xlYXIgdGhlIGZvcm0gZGF0YTsgb3RoZXJ3aXNlIHRoZSBcImRvd25sb2FkXCIgZGlhbG9ncyBvcGVuc1xuICAgICAgUERGVmlld2VyQXBwbGljYXRpb24ucGRmRG9jdW1lbnQ/LmFubm90YXRpb25TdG9yYWdlPy5yZXNldE1vZGlmaWVkKCk7XG4gICAgICB0aGlzLmZvcm1TdXBwb3J0Py5yZXNldCgpO1xuICAgICAgKHRoaXMuZm9ybVN1cHBvcnQgYXMgYW55KSA9IHVuZGVmaW5lZDtcbiAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnVuYmluZFdpbmRvd0V2ZW50cygpO1xuXG4gICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5fY2xlYW51cCgpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBQREZWaWV3ZXJBcHBsaWNhdGlvbi5jbG9zZSgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8ganVzdCBpZ25vcmUgaXRcbiAgICAgICAgLy8gZm9yIGV4YW1wbGUsIHRoZSBzZWNvbmRhcnkgdG9vbGJhciBtYXkgaGF2ZSBub3QgYmVlbiBpbml0aWFsaXplZCB5ZXQsIHNvXG4gICAgICAgIC8vIHRyeWluZyB0byBkZXN0cm95IGl0IHJlc3VsdCBpbiBlcnJvcnNcbiAgICAgIH1cbiAgICAgIGlmIChQREZWaWV3ZXJBcHBsaWNhdGlvbi5wcmludEtleURvd25MaXN0ZW5lcikge1xuICAgICAgICByZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgUERGVmlld2VyQXBwbGljYXRpb24ucHJpbnRLZXlEb3duTGlzdGVuZXIsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBidXMgPSBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cztcbiAgICAgIGlmIChidXMpIHtcbiAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24udW5iaW5kRXZlbnRzKCk7XG4gICAgICAgIGJ1cy5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgICAoUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMgYXMgYW55KSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgdyA9IHdpbmRvdyBhcyBhbnk7XG4gICAgZGVsZXRlIHcuZ2V0Rm9ybVZhbHVlRnJvbUFuZ3VsYXI7XG4gICAgZGVsZXRlIHcucmVnaXN0ZXJBY3JvZm9ybUFubm90YXRpb25zO1xuICAgIGRlbGV0ZSB3LmdldEZvcm1WYWx1ZTtcbiAgICBkZWxldGUgdy5zZXRGb3JtVmFsdWU7XG4gICAgZGVsZXRlIHcuYXNzaWduRm9ybUlkQW5kRmllbGROYW1lO1xuICAgIGRlbGV0ZSB3LnJlZ2lzdGVyQWNyb2Zvcm1GaWVsZDtcbiAgICBkZWxldGUgdy5yZWdpc3RlclhGQUZpZWxkO1xuICAgIGRlbGV0ZSB3LmFzc2lnbkZvcm1JZEFuZEZpZWxkTmFtZTtcbiAgICBkZWxldGUgdy51cGRhdGVBbmd1bGFyRm9ybVZhbHVlO1xuICAgIGRlbGV0ZSB3Lm5neENvbnNvbGVGaWx0ZXI7XG4gICAgZGVsZXRlIHcucGRmVmlld2VyU2FuaXRpemVyO1xuICAgIGRlbGV0ZSB3LnBkZmpzTGliO1xuICAgIHRoaXMud2luZG93U2l6ZVJlY2FsY3VsYXRvclN1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLm5vdGlmaWNhdGlvblNlcnZpY2Uub25QREZKU0luaXRTaWduYWwuc2V0KHVuZGVmaW5lZCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5neC1leHRlbmRlZC1wZGYtdmlld2VyLXNjcmlwdCcpLmZvckVhY2goKGU6IEhUTUxTY3JpcHRFbGVtZW50KSA9PiB7XG4gICAgICBlLm9ubG9hZCA9IG51bGw7XG4gICAgICBlLnJlbW92ZSgpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci1maWxlLWlucHV0JykuZm9yRWFjaCgoZTogSFRNTElucHV0RWxlbWVudCkgPT4ge1xuICAgICAgZS5yZW1vdmUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaXNQcmltYXJ5TWVudVZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuc2hvd1Rvb2xiYXIpIHtcbiAgICAgIGNvbnN0IHZpc2libGUgPVxuICAgICAgICB0aGlzLnNob3dEb3dubG9hZEJ1dHRvbiB8fFxuICAgICAgICB0aGlzLnNob3dEcmF3RWRpdG9yIHx8XG4gICAgICAgIHRoaXMuc2hvd0hpZ2hsaWdodEVkaXRvciB8fFxuICAgICAgICB0aGlzLnNob3dUZXh0RWRpdG9yIHx8XG4gICAgICAgIHRoaXMuc2hvd0ZpbmRCdXR0b24gfHxcbiAgICAgICAgdGhpcy5zaG93T3BlbkZpbGVCdXR0b24gfHxcbiAgICAgICAgdGhpcy5zaG93UGFnaW5nQnV0dG9ucyB8fFxuICAgICAgICB0aGlzLnNob3dQcmVzZW50YXRpb25Nb2RlQnV0dG9uIHx8XG4gICAgICAgIHRoaXMuc2hvd1ByaW50QnV0dG9uIHx8XG4gICAgICAgIHRoaXMuc2hvd1Byb3BlcnRpZXNCdXR0b24gfHxcbiAgICAgICAgdGhpcy5zaG93Um90YXRlQ3dCdXR0b24gfHxcbiAgICAgICAgdGhpcy5zaG93Um90YXRlQ2N3QnV0dG9uIHx8XG4gICAgICAgIHRoaXMuc2hvd0hhbmRUb29sQnV0dG9uIHx8XG4gICAgICAgIHRoaXMuc2hvd1Njcm9sbGluZ0J1dHRvbiB8fFxuICAgICAgICB0aGlzLnNob3dTcHJlYWRCdXR0b24gfHxcbiAgICAgICAgdGhpcy5zaG93U2lkZWJhckJ1dHRvbiB8fFxuICAgICAgICB0aGlzLnNob3dab29tQnV0dG9ucztcblxuICAgICAgaWYgKHZpc2libGUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47IC8vIHNlcnZlciBzaWRlIHJlbmRlcmluZ1xuICAgIH1cbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnM6IElQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnMgPSB0aGlzLlBERlZpZXdlckFwcGxpY2F0aW9uT3B0aW9ucztcblxuICAgIGlmICh0aGlzLnNlcnZpY2Uubmd4RXh0ZW5kZWRQZGZWaWV3ZXJJbml0aWFsaXplZCkge1xuICAgICAgaWYgKCdzcmMnIGluIGNoYW5nZXMgfHwgJ2Jhc2U2NFNyYycgaW4gY2hhbmdlcykge1xuICAgICAgICBpZiAodGhpcy5zcmNDaGFuZ2VUcmlnZ2VyZWRCeVVzZXIpIHtcbiAgICAgICAgICB0aGlzLnNyY0NoYW5nZVRyaWdnZXJlZEJ5VXNlciA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLnBhZ2VWaWV3TW9kZSA9PT0gJ2Jvb2snKSB7XG4gICAgICAgICAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uPy5wZGZWaWV3ZXI/LmRlc3Ryb3lCb29rTW9kZSgpO1xuICAgICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24/LnBkZlZpZXdlcj8uc3RvcFJlbmRlcmluZygpO1xuICAgICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24/LnBkZlRodW1ibmFpbFZpZXdlcj8uc3RvcFJlbmRlcmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoISF0aGlzLl9zcmMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5neEV4dGVuZGVkUGRmVmlld2VySW5jb21wbGV0ZWx5SW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5vcGVuUERGKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLm9wZW5QREYyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICM4MDIgY2xlYXIgdGhlIGZvcm0gZGF0YTsgb3RoZXJ3aXNlIHRoZSBcImRvd25sb2FkXCIgZGlhbG9ncyBvcGVuc1xuICAgICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24ucGRmRG9jdW1lbnQ/LmFubm90YXRpb25TdG9yYWdlPy5yZXNldE1vZGlmaWVkKCk7XG4gICAgICAgICAgICB0aGlzLmZvcm1TdXBwb3J0Py5yZXNldCgpO1xuXG4gICAgICAgICAgICBsZXQgaW5wdXRGaWVsZCA9IFBERlZpZXdlckFwcGxpY2F0aW9uLmFwcENvbmZpZz8ub3BlbkZpbGVJbnB1dDtcbiAgICAgICAgICAgIGlmICghaW5wdXRGaWVsZCkge1xuICAgICAgICAgICAgICBpbnB1dEZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZpbGVJbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXRGaWVsZCkge1xuICAgICAgICAgICAgICBpbnB1dEZpZWxkLnZhbHVlID0gJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IFBERlZpZXdlckFwcGxpY2F0aW9uLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoJ2VuYWJsZURyYWdBbmREcm9wJyBpbiBjaGFuZ2VzKSB7XG4gICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uT3B0aW9ucy5zZXQoJ2VuYWJsZURyYWdBbmREcm9wJywgdGhpcy5lbmFibGVEcmFnQW5kRHJvcCk7XG4gICAgICB9XG5cbiAgICAgIGlmICgnZmluZGJhclZpc2libGUnIGluIGNoYW5nZXMpIHtcbiAgICAgICAgaWYgKGNoYW5nZXNbJ2ZpbmRiYXJWaXNpYmxlJ10uY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24uZmluZEJhci5vcGVuKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24uZmluZEJhci5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICgncHJvcGVydGllc0RpYWxvZ1Zpc2libGUnIGluIGNoYW5nZXMpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcGVydGllc0RpYWxvZ1Zpc2libGUpIHtcbiAgICAgICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZEb2N1bWVudFByb3BlcnRpZXMub3BlbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZkRvY3VtZW50UHJvcGVydGllcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICgnem9vbScgaW4gY2hhbmdlcykge1xuICAgICAgICBhd2FpdCB0aGlzLnNldFpvb20oKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCdtYXhab29tJyBpbiBjaGFuZ2VzKSB7XG4gICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uT3B0aW9ucy5zZXQoJ21heFpvb20nLCB0aGlzLm1heFpvb20pO1xuICAgICAgfVxuXG4gICAgICBpZiAoJ21pblpvb20nIGluIGNoYW5nZXMpIHtcbiAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb25PcHRpb25zLnNldCgnbWluWm9vbScsIHRoaXMubWluWm9vbSk7XG4gICAgICB9XG5cbiAgICAgIGlmICgnaGFuZFRvb2wnIGluIGNoYW5nZXMpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RDdXJzb3JUb29sKCk7XG4gICAgICB9XG4gICAgICBpZiAoJ3BhZ2UnIGluIGNoYW5nZXMpIHtcbiAgICAgICAgaWYgKHRoaXMucGFnZSkge1xuICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogdHJpcGxlLWVxdWFsc1xuICAgICAgICAgIGlmICh0aGlzLnBhZ2UgIT0gUERGVmlld2VyQXBwbGljYXRpb24ucGFnZSkge1xuICAgICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24ucGFnZSA9IHRoaXMucGFnZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICgncGFnZUxhYmVsJyBpbiBjaGFuZ2VzKSB7XG4gICAgICAgIGlmICh0aGlzLnBhZ2VMYWJlbCkge1xuICAgICAgICAgIGlmICh0aGlzLnBhZ2VMYWJlbCAhPT0gUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLmN1cnJlbnRQYWdlTGFiZWwpIHtcbiAgICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5jdXJyZW50UGFnZUxhYmVsID0gdGhpcy5wYWdlTGFiZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICgncm90YXRpb24nIGluIGNoYW5nZXMpIHtcbiAgICAgICAgaWYgKHRoaXMucm90YXRpb24pIHtcbiAgICAgICAgICBjb25zdCByID0gTnVtYmVyKHRoaXMucm90YXRpb24pO1xuICAgICAgICAgIGlmIChyID09PSAwIHx8IHIgPT09IDkwIHx8IHIgPT09IDE4MCB8fCByID09PSAyNzApIHtcbiAgICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5wYWdlc1JvdGF0aW9uID0gcjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLnBhZ2VzUm90YXRpb24gPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoJ3Njcm9sbE1vZGUnIGluIGNoYW5nZXMpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsTW9kZSB8fCB0aGlzLnNjcm9sbE1vZGUgPT09IFNjcm9sbE1vZGVUeXBlLnZlcnRpY2FsKSB7XG4gICAgICAgICAgaWYgKFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5zY3JvbGxNb2RlICE9PSBOdW1iZXIodGhpcy5zY3JvbGxNb2RlKSkge1xuICAgICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMuZGlzcGF0Y2goJ3N3aXRjaHNjcm9sbG1vZGUnLCB7IG1vZGU6IE51bWJlcih0aGlzLnNjcm9sbE1vZGUpIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCdhY3RpdmVTaWRlYmFyVmlldycgaW4gY2hhbmdlcykge1xuICAgICAgICBpZiAodGhpcy5zaWRlYmFyVmlzaWJsZSkge1xuICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlNpZGViYXIub3BlbigpO1xuICAgICAgICAgIGNvbnN0IHZpZXcgPSBOdW1iZXIodGhpcy5hY3RpdmVTaWRlYmFyVmlldyk7XG4gICAgICAgICAgaWYgKHZpZXcgPT09IDEgfHwgdmlldyA9PT0gMiB8fCB2aWV3ID09PSAzIHx8IHZpZXcgPT09IDQpIHtcbiAgICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlNpZGViYXIuc3dpdGNoVmlldyh2aWV3LCB0cnVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW2FjdGl2ZVNpZGViYXJWaWV3XSBtdXN0IGJlIGFuIGludGVnZXIgdmFsdWUgYmV0d2VlbiAxIGFuZCA0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlNpZGViYXIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCdmaWxlbmFtZUZvckRvd25sb2FkJyBpbiBjaGFuZ2VzKSB7XG4gICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmFwcENvbmZpZy5maWxlbmFtZUZvckRvd25sb2FkID0gdGhpcy5maWxlbmFtZUZvckRvd25sb2FkO1xuICAgICAgfVxuICAgICAgaWYgKCduYW1lZGRlc3QnIGluIGNoYW5nZXMpIHtcbiAgICAgICAgaWYgKHRoaXMubmFtZWRkZXN0KSB7XG4gICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24ucGRmTGlua1NlcnZpY2UuZ29Ub0Rlc3RpbmF0aW9uKHRoaXMubmFtZWRkZXN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoJ3NwcmVhZCcgaW4gY2hhbmdlcykge1xuICAgICAgICBpZiAodGhpcy5zcHJlYWQgPT09ICdldmVuJykge1xuICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnNwcmVhZE1vZGVPbkxvYWQgPSAyO1xuICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5zcHJlYWRNb2RlID0gMjtcbiAgICAgICAgICB0aGlzLm9uU3ByZWFkQ2hhbmdlKCdldmVuJyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zcHJlYWQgPT09ICdvZGQnKSB7XG4gICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24uc3ByZWFkTW9kZU9uTG9hZCA9IDE7XG4gICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLnNwcmVhZE1vZGUgPSAxO1xuICAgICAgICAgIHRoaXMub25TcHJlYWRDaGFuZ2UoJ29kZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnNwcmVhZE1vZGVPbkxvYWQgPSAwO1xuICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5zcHJlYWRNb2RlID0gMDtcbiAgICAgICAgICB0aGlzLm9uU3ByZWFkQ2hhbmdlKCdvZmYnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmhpZGVUb29sYmFySWZJdElzRW1wdHkoKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5jYWxjVmlld2VyUG9zaXRpb25Ub3AoKSk7XG4gICAgfSAvLyBlbmQgb2YgaWYgKE5neEV4dGVuZGVkUGRmVmlld2VyQ29tcG9uZW50Lm5neEV4dGVuZGVkUGRmVmlld2VySW5pdGlhbGl6ZWQpXG5cbiAgICBpZiAoJ3ByaW50UmVzb2x1dGlvbicgaW4gY2hhbmdlcykge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IFBERlZpZXdlckFwcGxpY2F0aW9uT3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMuc2V0KCdwcmludFJlc29sdXRpb24nLCB0aGlzLnByaW50UmVzb2x1dGlvbik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgnaWdub3JlS2V5Ym9hcmQnIGluIGNoYW5nZXMpIHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICB0aGlzLm92ZXJyaWRlRGVmYXVsdFNldHRpbmdzKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgnaWdub3JlS2V5cycgaW4gY2hhbmdlcykge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IFBERlZpZXdlckFwcGxpY2F0aW9uT3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgIHRoaXMub3ZlcnJpZGVEZWZhdWx0U2V0dGluZ3MoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCdhY2NlcHRLZXlzJyBpbiBjaGFuZ2VzKSB7XG4gICAgICBjb25zdCBvcHRpb25zID0gUERGVmlld2VyQXBwbGljYXRpb25PcHRpb25zO1xuICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vdmVycmlkZURlZmF1bHRTZXR0aW5ncygpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoJ3Nob3dCb3JkZXJzJyBpbiBjaGFuZ2VzKSB7XG4gICAgICBpZiAoIWNoYW5nZXNbJ3Nob3dCb3JkZXJzJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnM7XG4gICAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgICAgdGhpcy5vdmVycmlkZURlZmF1bHRTZXR0aW5ncygpO1xuICAgICAgICAgIGNvbnN0IHZpZXdlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3ZXInKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICBpZiAodGhpcy5zaG93Qm9yZGVycykge1xuICAgICAgICAgICAgdmlld2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbW92ZVBhZ2VCb3JkZXJzJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZpZXdlci5jbGFzc0xpc3QuYWRkKCdyZW1vdmVQYWdlQm9yZGVycycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIpIHtcbiAgICAgICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5yZW1vdmVQYWdlQm9yZGVycyA9ICF0aGlzLnNob3dCb3JkZXJzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCB6b29tRXZlbnQgPSB7XG4gICAgICAgICAgICBzb3VyY2U6IHZpZXdlcixcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1iaXR3aXNlXG4gICAgICAgICAgICBzY2FsZTogKE51bWJlcih0aGlzLnpvb20pIHwgMTAwKSAvIDEwMCxcbiAgICAgICAgICAgIHByZXNldFZhbHVlOiB0aGlzLnpvb20sXG4gICAgICAgICAgfSBhcyBTY2FsZUNoYW5naW5nRXZlbnQ7XG4gICAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMuZGlzcGF0Y2goJ3NjYWxlY2hhbmdpbmcnLCB6b29tRXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCdzaG93VW52ZXJpZmllZFNpZ25hdHVyZXMnIGluIGNoYW5nZXMpIHtcbiAgICAgIGlmIChQREZWaWV3ZXJBcHBsaWNhdGlvbj8ucGRmRG9jdW1lbnQpIHtcbiAgICAgICAgUERGVmlld2VyQXBwbGljYXRpb24ucGRmRG9jdW1lbnQuX3RyYW5zcG9ydC5tZXNzYWdlSGFuZGxlci5zZW5kKCdzaG93VW52ZXJpZmllZFNpZ25hdHVyZXMnLCB0aGlzLnNob3dVbnZlcmlmaWVkU2lnbmF0dXJlcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCdmb3JtRGF0YScgaW4gY2hhbmdlcykge1xuICAgICAgaWYgKCFjaGFuZ2VzWydmb3JtRGF0YSddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgICB0aGlzLmZvcm1TdXBwb3J0LnVwZGF0ZUZvcm1GaWVsZHNJblBkZkNhbGxlZEJ5TmdPbkNoYW5nZXMoY2hhbmdlc1snZm9ybURhdGEnXS5wcmV2aW91c1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoJ2VuYWJsZVByaW50JyBpbiBjaGFuZ2VzKSB7XG4gICAgICBpZiAoIWNoYW5nZXNbJ2VuYWJsZVByaW50J10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmVuYWJsZVByaW50ID0gdGhpcy5lbmFibGVQcmludDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKFxuICAgICAgKCdjdXN0b21GaW5kYmFyJyBpbiBjaGFuZ2VzICYmICFjaGFuZ2VzWydjdXN0b21GaW5kYmFyJ10uaXNGaXJzdENoYW5nZSgpKSB8fFxuICAgICAgKCdjdXN0b21GaW5kYmFyQnV0dG9ucycgaW4gY2hhbmdlcyAmJiAhY2hhbmdlc1snY3VzdG9tRmluZGJhckJ1dHRvbnMnXS5pc0ZpcnN0Q2hhbmdlKCkpIHx8XG4gICAgICAoJ2N1c3RvbUZpbmRiYXJJbnB1dEFyZWEnIGluIGNoYW5nZXMgJiYgIWNoYW5nZXNbJ2N1c3RvbUZpbmRiYXJJbnB1dEFyZWEnXS5pc0ZpcnN0Q2hhbmdlKCkpIHx8XG4gICAgICAoJ2N1c3RvbVRvb2xiYXInIGluIGNoYW5nZXMgJiYgIWNoYW5nZXNbJ2N1c3RvbVRvb2xiYXInXS5pc0ZpcnN0Q2hhbmdlKCkpXG4gICAgKSB7XG4gICAgICBpZiAodGhpcy5kdW1teUNvbXBvbmVudHMpIHtcbiAgICAgICAgdGhpcy5kdW1teUNvbXBvbmVudHMuYWRkTWlzc2luZ1N0YW5kYXJkV2lkZ2V0cygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICgncGFnZVZpZXdNb2RlJyBpbiBjaGFuZ2VzICYmICFjaGFuZ2VzWydwYWdlVmlld01vZGUnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIHRoaXMucGFnZVZpZXdNb2RlID0gY2hhbmdlc1sncGFnZVZpZXdNb2RlJ10uY3VycmVudFZhbHVlO1xuICAgIH1cbiAgICBpZiAoJ3JlcGxhY2VCcm93c2VyUHJpbnQnIGluIGNoYW5nZXMgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICh0aGlzLnJlcGxhY2VCcm93c2VyUHJpbnQpIHtcbiAgICAgICAgaWYgKCh3aW5kb3cgYXMgYW55KS5wcmludFBERikge1xuICAgICAgICAgIHdpbmRvdy5wcmludCA9ICh3aW5kb3cgYXMgYW55KS5wcmludFBERjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxQcmludCA9IE5neEV4dGVuZGVkUGRmVmlld2VyQ29tcG9uZW50Lm9yaWdpbmFsUHJpbnQ7XG4gICAgICAgIGlmIChvcmlnaW5hbFByaW50ICYmICFvcmlnaW5hbFByaW50LnRvU3RyaW5nKCkuaW5jbHVkZXMoJ3ByaW50UGRmJykpIHtcbiAgICAgICAgICB3aW5kb3cucHJpbnQgPSBvcmlnaW5hbFByaW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgnZGlzYWJsZUZvcm1zJyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLmVuYWJsZU9yRGlzYWJsZUZvcm1zKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBmYWxzZSk7XG4gICAgfVxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5jYWxjVmlld2VyUG9zaXRpb25Ub3AoKSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNldFpvb20oKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47IC8vIHNlcnZlciBzaWRlIHJlbmRlcmluZ1xuICAgIH1cbiAgICAvLyBzb21ldGltZXMgbmdPbkNoYW5nZXMgY2FsbHMgdGhpcyBtZXRob2QgYmVmb3JlIHRoZSBwYWdlIGlzIGluaXRpYWxpemVkLFxuICAgIC8vIHNvIGxldCdzIGNoZWNrIGlmIHRoaXMucm9vdCBpcyBhbHJlYWR5IGRlZmluZWRcbiAgICBpZiAodGhpcy5yb290KSB7XG4gICAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcblxuICAgICAgbGV0IHpvb21Bc051bWJlciA9IHRoaXMuem9vbTtcbiAgICAgIGlmIChTdHJpbmcoem9vbUFzTnVtYmVyKS5lbmRzV2l0aCgnJScpKSB7XG4gICAgICAgIHpvb21Bc051bWJlciA9IE51bWJlcihTdHJpbmcoem9vbUFzTnVtYmVyKS5yZXBsYWNlKCclJywgJycpKSAvIDEwMDtcbiAgICAgIH0gZWxzZSBpZiAoIWlzTmFOKE51bWJlcih6b29tQXNOdW1iZXIpKSkge1xuICAgICAgICB6b29tQXNOdW1iZXIgPSBOdW1iZXIoem9vbUFzTnVtYmVyKSAvIDEwMDtcbiAgICAgIH1cbiAgICAgIGlmICghem9vbUFzTnVtYmVyKSB7XG4gICAgICAgIGlmICghUERGVmlld2VyQXBwbGljYXRpb24uc3RvcmUpIHtcbiAgICAgICAgICAvLyBJdCdzIGRpZmZpY3VsdCB0byBwcmV2ZW50IGNhbGxpbmcgdGhpcyBtZXRob2QgdG8gZWFybHksIHNvIHdlIG5lZWQgdGhpcyBjaGVjay5cbiAgICAgICAgICAvLyBzZXRab29tKCkgaXMgY2FsbGVkIGxhdGVyIGFnYWluLCB3aGVuIHRoZSBQREYgZG9jdW1lbnQgaGFzIGJlZW4gbG9hZGVkIGFuZCBpdHNcbiAgICAgICAgICAvLyBmaW5nZXJwcmludCBoYXMgYmVlbiBjYWxjdWxhdGVkLlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHVzZXJTZXR0aW5nID0gYXdhaXQgUERGVmlld2VyQXBwbGljYXRpb24uc3RvcmUuZ2V0KCd6b29tJyk7XG4gICAgICAgICAgaWYgKHVzZXJTZXR0aW5nKSB7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKE51bWJlcih1c2VyU2V0dGluZykpKSB7XG4gICAgICAgICAgICAgIHpvb21Bc051bWJlciA9IE51bWJlcih1c2VyU2V0dGluZykgLyAxMDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB6b29tQXNOdW1iZXIgPSB1c2VyU2V0dGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgem9vbUFzTnVtYmVyID0gJ2F1dG8nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoUERGVmlld2VyQXBwbGljYXRpb24pIHtcbiAgICAgICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb25PcHRpb25zOiBJUERGVmlld2VyQXBwbGljYXRpb25PcHRpb25zID0gdGhpcy5QREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnM7XG4gICAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uT3B0aW9ucy5zZXQoJ2RlZmF1bHRab29tVmFsdWUnLCB6b29tQXNOdW1iZXIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzY2FsZURyb3Bkb3duRmllbGQgPSAodGhpcy5yb290Lm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnF1ZXJ5U2VsZWN0b3IoJyNzY2FsZVNlbGVjdCcpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgdW5kZWZpbmVkO1xuICAgICAgaWYgKHNjYWxlRHJvcGRvd25GaWVsZCkge1xuICAgICAgICBpZiAodGhpcy56b29tID09PSAnYXV0bycgfHwgdGhpcy56b29tID09PSAncGFnZS1maXQnIHx8IHRoaXMuem9vbSA9PT0gJ3BhZ2UtYWN0dWFsJyB8fCB0aGlzLnpvb20gPT09ICdwYWdlLXdpZHRoJykge1xuICAgICAgICAgIHNjYWxlRHJvcGRvd25GaWVsZC52YWx1ZSA9IHRoaXMuem9vbTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzY2FsZURyb3Bkb3duRmllbGQudmFsdWUgPSAnY3VzdG9tJztcbiAgICAgICAgICBpZiAoc2NhbGVEcm9wZG93bkZpZWxkLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIHNjYWxlRHJvcGRvd25GaWVsZC5vcHRpb25zIGFzIGFueSkge1xuICAgICAgICAgICAgICBpZiAob3B0aW9uLnZhbHVlID09PSAnY3VzdG9tJykge1xuICAgICAgICAgICAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IGAke01hdGgucm91bmQoTnVtYmVyKHpvb21Bc051bWJlcikgKiAxMDBfMDAwKSAvIDEwMDB9JWA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlcikge1xuICAgICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIuY3VycmVudFNjYWxlVmFsdWUgPSB6b29tQXNOdW1iZXIgPz8gJ2F1dG8nO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvblJlc2l6ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBwZGZWaWV3ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdodG1sJyk7XG4gICAgaWYgKHBkZlZpZXdlciAmJiBwZGZWaWV3ZXIubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dGVyQ29udGFpbmVyJyk7XG4gICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gY29udGFpbmVyLmNsaWVudFdpZHRoO1xuICAgICAgICB0aGlzLnRvb2xiYXJXaWR0aEluUGl4ZWxzID0gd2lkdGg7XG4gICAgICAgIGlmICh0aGlzLnNlY29uZGFyeVRvb2xiYXJDb21wb25lbnQpIHtcbiAgICAgICAgICB0aGlzLnNlY29uZGFyeVRvb2xiYXJDb21wb25lbnQuY2hlY2tWaXNpYmlsaXR5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuY2hlY2tIZWlnaHQoKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKCgpID0+IHRoaXMucmVtb3ZlU2Nyb2xsYmFySW5JbmZpbml0ZVNjcm9sbE1vZGUoZmFsc2UpKTtcbiAgICAgIGNvbnN0IHZpZXdlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3ZXInKTtcbiAgICAgIGlmICh2aWV3ZXIpIHtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSh2aWV3ZXIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgY29uc29sZS5sb2coJ1Jlc2l6ZU9ic2VydmVyIGlzIG5vdCBzdXBwb3J0ZWQgYnkgeW91ciBicm93c2VyJyk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY29udGV4dG1lbnUnKVxuICBwdWJsaWMgb25Db250ZXh0TWVudSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0TWVudUFsbG93ZWQ7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2Nyb2xsU2lnbmF0dXJlV2FybmluZ0ludG9WaWV3KHBkZjogUERGRG9jdW1lbnRQcm94eSk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8qKiBUaGlzIG1ldGhvZCBoYXMgYmVlbiBpbnNwaXJlZCBieSBodHRwczovL21lZGl1bS5jb20vZmFjdG9yeS1taW5kL2FuZ3VsYXItcGRmLWZvcm1zLWZhNzJiMTVjM2ZiZC4gVGhhbmtzLCBKb25ueSBGb3ghICovXG4gICAgdGhpcy5oYXNTaWduYXR1cmUgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHBkZj8ubnVtUGFnZXM7IGkrKykge1xuICAgICAgLy8gdHJhY2sgdGhlIGN1cnJlbnQgcGFnZVxuICAgICAgY29uc3QgcGFnZSA9IGF3YWl0IHBkZi5nZXRQYWdlKGkpO1xuICAgICAgY29uc3QgYW5ub3RhdGlvbnMgPSBhd2FpdCBwYWdlLmdldEFubm90YXRpb25zKCk7XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSAnU2lnJyBmaWVsZFR5cGUgaW4gYW5ub3RhdGlvbnNcbiAgICAgIHRoaXMuaGFzU2lnbmF0dXJlID0gYW5ub3RhdGlvbnMuc29tZSgoYSkgPT4gYS5maWVsZFR5cGUgPT09ICdTaWcnKTtcblxuICAgICAgaWYgKHRoaXMuaGFzU2lnbmF0dXJlKSB7XG4gICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgLy8gRGVmZXIgc2Nyb2xsaW5nIHRvIGVuc3VyZSBpdCBoYXBwZW5zIGFmdGVyIGFueSBvdGhlciBVSSB1cGRhdGVzXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2aWV3ZXJDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdmlld2VyQ29udGFpbmVyJyk7XG4gICAgICAgICAgICB2aWV3ZXJDb250YWluZXI/LnNjcm9sbEJ5KDAsIC0zMik7IC8vIEFkanVzdCB0aGUgc2Nyb2xsIHBvc2l0aW9uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBicmVhazsgLy8gc3RvcCBsb29waW5nIHRocm91Z2ggdGhlIHBhZ2VzIGFzIHNvb24gYXMgd2UgZmluZCBhIHNpZ25hdHVyZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyB6b29tVG9QYWdlV2lkdGgoZXZlbnQ6IE1vdXNlRXZlbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5oYW5kVG9vbCkge1xuICAgICAgaWYgKCFwZGZEZWZhdWx0T3B0aW9ucy5kb3VibGVUYXBab29tc0luSGFuZE1vZGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXBkZkRlZmF1bHRPcHRpb25zLmRvdWJsZVRhcFpvb21zSW5UZXh0U2VsZWN0aW9uTW9kZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnBhZ2VWaWV3TW9kZSA9PT0gJ2Jvb2snKSB7XG4gICAgICAvLyBzY2FsaW5nIGRvZXNuJ3Qgd29yayBpbiBib29rIG1vZGVcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9IHRoaXMuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgY29uc3QgZGVzaXJlZENlbnRlclkgPSBldmVudC5jbGllbnRZO1xuICAgIGNvbnN0IHByZXZpb3VzU2NhbGUgPSAoUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyIGFzIGFueSkuY3VycmVudFNjYWxlO1xuXG4gICAgaWYgKHRoaXMuem9vbSAhPT0gcGRmRGVmYXVsdE9wdGlvbnMuZG91YmxlVGFwWm9vbUZhY3RvciAmJiB0aGlzLnpvb20gKyAnJScgIT09IHBkZkRlZmF1bHRPcHRpb25zLmRvdWJsZVRhcFpvb21GYWN0b3IpIHtcbiAgICAgIHRoaXMucHJldmlvdXNab29tID0gdGhpcy56b29tO1xuICAgICAgdGhpcy56b29tID0gcGRmRGVmYXVsdE9wdGlvbnMuZG91YmxlVGFwWm9vbUZhY3RvcjsgLy8gYnkgZGVmYXVsdDogJ3BhZ2Utd2lkdGgnO1xuICAgICAgYXdhaXQgdGhpcy5zZXRab29tKCk7XG4gICAgfSBlbHNlIGlmIChwZGZEZWZhdWx0T3B0aW9ucy5kb3VibGVUYXBSZXNldHNab29tT25TZWNvbmREb3VibGVUYXApIHtcbiAgICAgIGlmICh0aGlzLnByZXZpb3VzWm9vbSkge1xuICAgICAgICB0aGlzLnpvb20gPSB0aGlzLnByZXZpb3VzWm9vbTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuem9vbSA9ICdwYWdlLXdpZHRoJztcbiAgICAgIH1cbiAgICAgIGF3YWl0IHRoaXMuc2V0Wm9vbSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudFNjYWxlID0gKFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlciBhcyBhbnkpLmN1cnJlbnRTY2FsZTtcbiAgICBjb25zdCBzY2FsZUNvcnJlY3Rpb25GYWN0b3IgPSBjdXJyZW50U2NhbGUgLyBwcmV2aW91c1NjYWxlIC0gMTtcbiAgICBjb25zdCByZWN0ID0gKFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlciBhcyBhbnkpLmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBkeSA9IGRlc2lyZWRDZW50ZXJZIC0gcmVjdC50b3A7XG4gICAgKFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlciBhcyBhbnkpLmNvbnRhaW5lci5zY3JvbGxUb3AgKz0gZHkgKiBzY2FsZUNvcnJlY3Rpb25GYWN0b3I7XG4gIH1cblxuICBwcml2YXRlIGVuYWJsZU9yRGlzYWJsZUZvcm1zKGRpdjogSFRNTEVsZW1lbnQsIGRvTm90RW5hYmxlOiBib29sZWFuKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVGb3JtcyAmJiBkb05vdEVuYWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB4ZmFMYXllcnMgPSBBcnJheS5mcm9tKGRpdi5xdWVyeVNlbGVjdG9yQWxsKCcueGZhTGF5ZXInKSk7XG4gICAgY29uc3QgYWNyb0Zvcm1MYXllcnMgPSBBcnJheS5mcm9tKGRpdi5xdWVyeVNlbGVjdG9yQWxsKCcuYW5ub3RhdGlvbkxheWVyJykpO1xuICAgIGNvbnN0IGxheWVycyA9IHhmYUxheWVycy5jb25jYXQoLi4uYWNyb0Zvcm1MYXllcnMpO1xuICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKS5mb3JFYWNoKCh4KSA9PiAoeC5kaXNhYmxlZCA9IHRoaXMuZGlzYWJsZUZvcm1zKSkpO1xuICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIucXVlcnlTZWxlY3RvckFsbCgnc2VsZWN0JykuZm9yRWFjaCgoeCkgPT4gKHguZGlzYWJsZWQgPSB0aGlzLmRpc2FibGVGb3JtcykpKTtcbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IGxheWVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RleHRhcmVhJykuZm9yRWFjaCgoeCkgPT4gKHguZGlzYWJsZWQgPSB0aGlzLmRpc2FibGVGb3JtcykpKTtcbiAgfVxufVxuIiwiPHBkZi1kYXJrLXRoZW1lICpuZ0lmPVwidGhlbWUgPT09ICdkYXJrJ1wiPjwvcGRmLWRhcmstdGhlbWU+XG48cGRmLWxpZ2h0LXRoZW1lICpuZ0lmPVwidGhlbWUgPT09ICdsaWdodCdcIj48L3BkZi1saWdodC10aGVtZT5cbjxwZGYtYWNyb2Zvcm0tZGVmYXVsdC10aGVtZT48L3BkZi1hY3JvZm9ybS1kZWZhdWx0LXRoZW1lPlxuXG48cGRmLWR5bmFtaWMtY3NzIFt6b29tXT1cIm1vYmlsZUZyaWVuZGx5Wm9vbVNjYWxlXCIgW3dpZHRoXT1cInRvb2xiYXJXaWR0aEluUGl4ZWxzXCI+PC9wZGYtZHluYW1pYy1jc3M+XG48bmctY29udGVudCAqbmdUZW1wbGF0ZU91dGxldD1cImN1c3RvbVBkZlZpZXdlciA/IGN1c3RvbVBkZlZpZXdlciA6IGRlZmF1bHRQZGZWaWV3ZXJcIj48L25nLWNvbnRlbnQ+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdFBkZlZpZXdlcj5cbiAgPGRpdiBjbGFzcz1cInpvb21cIiBbc3R5bGUuaGVpZ2h0XT1cIm1pbkhlaWdodCA/IG1pbkhlaWdodCA6IGhlaWdodFwiICNyb290PlxuICAgIDxkaXYgY2xhc3M9XCJodG1sXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiYm9keSBwZGYtanMtdmVyc2lvbi17eyBtYWpvck1pbm9yUGRmSnNWZXJzaW9uIH19XCIgW3N0eWxlLmJhY2tncm91bmRDb2xvcl09XCJiYWNrZ3JvdW5kQ29sb3JcIj5cbiAgICAgICAgPGRpdiBpZD1cIm91dGVyQ29udGFpbmVyXCIgKHdpbmRvdzpyZXNpemUpPVwib25SZXNpemUoKVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmcmVlLWZsb2F0aW5nLWJhclwiICpuZ0lmPVwic2hvd0ZyZWVGbG9hdGluZ0JhclwiPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjdXN0b21GcmVlRmxvYXRpbmdCYXIgPyBjdXN0b21GcmVlRmxvYXRpbmdCYXIgOiBkZWZhdWx0RnJlZUZsb2F0aW5nQmFyXCI+IDwvbmctY29udGVudD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8cGRmLXNpZGViYXJcbiAgICAgICAgICAgICNwZGZzaWRlYmFyXG4gICAgICAgICAgICBbc2lkZWJhclZpc2libGVdPVwic2lkZWJhclZpc2libGUgfHwgZmFsc2VcIlxuICAgICAgICAgICAgW3Nob3dTaWRlYmFyQnV0dG9uXT1cInNob3dTaWRlYmFyQnV0dG9uXCJcbiAgICAgICAgICAgIFtjdXN0b21TaWRlYmFyXT1cImN1c3RvbVNpZGViYXJcIlxuICAgICAgICAgICAgW2N1c3RvbVRodW1ibmFpbF09XCJjdXN0b21UaHVtYm5haWxcIlxuICAgICAgICAgICAgKHRodW1ibmFpbERyYXduKT1cInRodW1ibmFpbERyYXduLmVtaXQoJGV2ZW50KVwiXG4gICAgICAgICAgICBbbW9iaWxlRnJpZW5kbHlab29tU2NhbGVdPVwibW9iaWxlRnJpZW5kbHlab29tU2NhbGVcIlxuICAgICAgICAgICAgW3NpZGViYXJQb3NpdGlvblRvcF09XCJzaWRlYmFyUG9zaXRpb25Ub3BcIlxuICAgICAgICAgID5cbiAgICAgICAgICA8L3BkZi1zaWRlYmFyPlxuICAgICAgICAgIDxkaXYgaWQ9XCJtYWluQ29udGFpbmVyXCIgW2NsYXNzLnRvb2xiYXItaGlkZGVuXT1cIiFwcmltYXJ5TWVudVZpc2libGVcIj5cbiAgICAgICAgICAgIDxwZGYtZHVtbXktY29tcG9uZW50cz48L3BkZi1kdW1teS1jb21wb25lbnRzPlxuXG4gICAgICAgICAgICA8cGRmLXRvb2xiYXJcbiAgICAgICAgICAgICAgKG9uVG9vbGJhckxvYWRlZCk9XCJvblRvb2xiYXJMb2FkZWQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgIFtzaWRlYmFyVmlzaWJsZV09XCJzaWRlYmFyVmlzaWJsZVwiXG4gICAgICAgICAgICAgIFtjbGFzcy5zZXJ2ZXItc2lkZS1yZW5kZXJpbmddPVwic2VydmVyU2lkZVJlbmRlcmluZ1wiXG4gICAgICAgICAgICAgIFtjdXN0b21Ub29sYmFyXT1cImN1c3RvbVRvb2xiYXJcIlxuICAgICAgICAgICAgICBbbW9iaWxlRnJpZW5kbHlab29tU2NhbGVdPVwibW9iaWxlRnJpZW5kbHlab29tU2NhbGVcIlxuICAgICAgICAgICAgICBbKHBhZ2VWaWV3TW9kZSldPVwicGFnZVZpZXdNb2RlXCJcbiAgICAgICAgICAgICAgW3ByaW1hcnlNZW51VmlzaWJsZV09XCJwcmltYXJ5TWVudVZpc2libGVcIlxuICAgICAgICAgICAgICBbc2Nyb2xsTW9kZV09XCJzY3JvbGxNb2RlID8/IDBcIlxuICAgICAgICAgICAgICBbc2hvd1Byb3BlcnRpZXNCdXR0b25dPVwic2hvd1Byb3BlcnRpZXNCdXR0b25cIlxuICAgICAgICAgICAgICBbc2hvd0Jvb2tNb2RlQnV0dG9uXT1cInNob3dCb29rTW9kZUJ1dHRvblwiXG4gICAgICAgICAgICAgIFtzaG93RG93bmxvYWRCdXR0b25dPVwic2hvd0Rvd25sb2FkQnV0dG9uXCJcbiAgICAgICAgICAgICAgW3Nob3dEcmF3RWRpdG9yXT1cInNob3dEcmF3RWRpdG9yXCJcbiAgICAgICAgICAgICAgW3Nob3dIaWdobGlnaHRFZGl0b3JdPVwic2hvd0hpZ2hsaWdodEVkaXRvclwiXG4gICAgICAgICAgICAgIFtzaG93RmluZEJ1dHRvbl09XCJzaG93RmluZEJ1dHRvblwiXG4gICAgICAgICAgICAgIFtzaG93SGFuZFRvb2xCdXR0b25dPVwic2hvd0hhbmRUb29sQnV0dG9uXCJcbiAgICAgICAgICAgICAgW2hhbmRUb29sXT1cImhhbmRUb29sXCJcbiAgICAgICAgICAgICAgW3Nob3dIb3Jpem9udGFsU2Nyb2xsQnV0dG9uXT1cInNob3dIb3Jpem9udGFsU2Nyb2xsQnV0dG9uXCJcbiAgICAgICAgICAgICAgW3Nob3dJbmZpbml0ZVNjcm9sbEJ1dHRvbl09XCJzaG93SW5maW5pdGVTY3JvbGxCdXR0b25cIlxuICAgICAgICAgICAgICBbc2hvd09wZW5GaWxlQnV0dG9uXT1cInNob3dPcGVuRmlsZUJ1dHRvblwiXG4gICAgICAgICAgICAgIFtzaG93UGFnaW5nQnV0dG9uc109XCJzaG93UGFnaW5nQnV0dG9uc1wiXG4gICAgICAgICAgICAgIFtzaG93UHJlc2VudGF0aW9uTW9kZUJ1dHRvbl09XCJzaG93UHJlc2VudGF0aW9uTW9kZUJ1dHRvbiAmJiBwYWdlVmlld01vZGUgIT09ICdib29rJ1wiXG4gICAgICAgICAgICAgIFtzaG93UHJpbnRCdXR0b25dPVwic2hvd1ByaW50QnV0dG9uICYmIGVuYWJsZVByaW50XCJcbiAgICAgICAgICAgICAgW3Nob3dSb3RhdGVDd0J1dHRvbl09XCJzaG93Um90YXRlQ3dCdXR0b25cIlxuICAgICAgICAgICAgICBbc2hvd1JvdGF0ZUNjd0J1dHRvbl09XCJzaG93Um90YXRlQ2N3QnV0dG9uXCJcbiAgICAgICAgICAgICAgW3Nob3dTZWNvbmRhcnlUb29sYmFyQnV0dG9uXT1cInNob3dTZWNvbmRhcnlUb29sYmFyQnV0dG9uICYmICFzZXJ2aWNlLnNlY29uZGFyeU1lbnVJc0VtcHR5XCJcbiAgICAgICAgICAgICAgW3Nob3dTaWRlYmFyQnV0dG9uXT1cInNob3dTaWRlYmFyQnV0dG9uXCJcbiAgICAgICAgICAgICAgW3Nob3dTaW5nbGVQYWdlTW9kZUJ1dHRvbl09XCJzaG93U2luZ2xlUGFnZU1vZGVCdXR0b25cIlxuICAgICAgICAgICAgICBbc2hvd1NwcmVhZEJ1dHRvbl09XCJzaG93U3ByZWFkQnV0dG9uXCJcbiAgICAgICAgICAgICAgW3Nob3dTdGFtcEVkaXRvcl09XCJzaG93U3RhbXBFZGl0b3JcIlxuICAgICAgICAgICAgICBbc2hvd1RleHRFZGl0b3JdPVwic2hvd1RleHRFZGl0b3JcIlxuICAgICAgICAgICAgICBbc2hvd1ZlcnRpY2FsU2Nyb2xsQnV0dG9uXT1cInNob3dWZXJ0aWNhbFNjcm9sbEJ1dHRvblwiXG4gICAgICAgICAgICAgIFtzaG93V3JhcHBlZFNjcm9sbEJ1dHRvbl09XCJzaG93V3JhcHBlZFNjcm9sbEJ1dHRvblwiXG4gICAgICAgICAgICAgIFtzaG93Wm9vbUJ1dHRvbnNdPVwic2hvd1pvb21CdXR0b25zICYmIHBhZ2VWaWV3TW9kZSAhPT0gJ2Jvb2snXCJcbiAgICAgICAgICAgICAgW3NwcmVhZF09XCJzcHJlYWRcIlxuICAgICAgICAgICAgICBbdGV4dExheWVyXT1cInRleHRMYXllclwiXG4gICAgICAgICAgICAgIFt0b29sYmFyTWFyZ2luVG9wXT1cInRvb2xiYXJNYXJnaW5Ub3BcIlxuICAgICAgICAgICAgICBbdG9vbGJhcldpZHRoXT1cInRvb2xiYXJXaWR0aFwiXG4gICAgICAgICAgICAgIFt6b29tTGV2ZWxzXT1cInpvb21MZXZlbHNcIlxuICAgICAgICAgICAgICBbZmluZGJhclZpc2libGVdPVwiZmluZGJhclZpc2libGVcIlxuICAgICAgICAgICAgPjwvcGRmLXRvb2xiYXI+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlZGl0b3JQYXJhbXNUb29sYmFyIGhpZGRlbiBkb29ySGFuZ2VyUmlnaHRcIiBpZD1cImVkaXRvckhpZ2hsaWdodFBhcmFtc1Rvb2xiYXJcIj5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cImhpZ2hsaWdodFBhcmFtc1Rvb2xiYXJDb250YWluZXJcIiBjbGFzcz1cImVkaXRvclBhcmFtc1Rvb2xiYXJDb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiZWRpdG9ySGlnaGxpZ2h0Q29sb3JQaWNrZXJcIiBjbGFzcz1cImNvbG9yUGlja2VyXCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cImhpZ2hsaWdodENvbG9yUGlja2VyTGFiZWxcIiBjbGFzcz1cImVkaXRvclBhcmFtc0xhYmVsXCIgZGF0YS1sMTBuLWlkPVwicGRmanMtZWRpdG9yLWhpZ2hsaWdodC1jb2xvcnBpY2tlci1sYWJlbFwiPkhpZ2hsaWdodCBjb2xvcjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiZWRpdG9ySGlnaGxpZ2h0VGhpY2tuZXNzXCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZWRpdG9yRnJlZUhpZ2hsaWdodFRoaWNrbmVzc1wiIGNsYXNzPVwiZWRpdG9yUGFyYW1zTGFiZWxcIiBkYXRhLWwxMG4taWQ9XCJwZGZqcy1lZGl0b3ItZnJlZS1oaWdobGlnaHQtdGhpY2tuZXNzLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgPlRoaWNrbmVzczwvbGFiZWxcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aGlja25lc3NQaWNrZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICAgICAgICBpZD1cImVkaXRvckZyZWVIaWdobGlnaHRUaGlja25lc3NcIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZWRpdG9yUGFyYW1zU2xpZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhLWwxMG4taWQ9XCJwZGZqcy1lZGl0b3ItZnJlZS1oaWdobGlnaHQtdGhpY2tuZXNzLXRpdGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT1cIjEyXCJcbiAgICAgICAgICAgICAgICAgICAgICBtaW49XCI4XCJcbiAgICAgICAgICAgICAgICAgICAgICBtYXg9XCIyNFwiXG4gICAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjFcIlxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImVkaXRvckhpZ2hsaWdodFZpc2liaWxpdHlcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaXZpZGVyXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9nZ2xlclwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZWRpdG9ySGlnaGxpZ2h0U2hvd0FsbFwiIGNsYXNzPVwiZWRpdG9yUGFyYW1zTGFiZWxcIiBkYXRhLWwxMG4taWQ9XCJwZGZqcy1lZGl0b3ItaGlnaGxpZ2h0LXNob3ctYWxsLWJ1dHRvbi1sYWJlbFwiPlNob3cgYWxsPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZWRpdG9ySGlnaGxpZ2h0U2hvd0FsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ0b2dnbGUtYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhLWwxMG4taWQ9XCJwZGZqcy1lZGl0b3ItaGlnaGxpZ2h0LXNob3ctYWxsLWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgYXJpYS1wcmVzc2VkPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICAgID48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZWRpdG9yUGFyYW1zVG9vbGJhciBoaWRkZW4gZG9vckhhbmdlclJpZ2h0XCIgaWQ9XCJlZGl0b3JGcmVlVGV4dFBhcmFtc1Rvb2xiYXJcIiBbY2xhc3Muc2VydmVyLXNpZGUtcmVuZGVyaW5nXT1cInNlcnZlclNpZGVSZW5kZXJpbmdcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVkaXRvclBhcmFtc1Rvb2xiYXJDb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZWRpdG9yUGFyYW1zU2V0dGVyXCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZWRpdG9yRnJlZVRleHRDb2xvclwiIGNsYXNzPVwiZWRpdG9yUGFyYW1zTGFiZWxcIiBkYXRhLWwxMG4taWQ9XCJwZGZqcy1lZGl0b3ItZnJlZS10ZXh0LWNvbG9yLWlucHV0XCI+Rm9udCBDb2xvcjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNvbG9yXCIgaWQ9XCJlZGl0b3JGcmVlVGV4dENvbG9yXCIgY2xhc3M9XCJlZGl0b3JQYXJhbXNDb2xvclwiIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVkaXRvclBhcmFtc1NldHRlclwiPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImVkaXRvckZyZWVUZXh0Rm9udFNpemVcIiBjbGFzcz1cImVkaXRvclBhcmFtc0xhYmVsXCIgZGF0YS1sMTBuLWlkPVwicGRmanMtZWRpdG9yLWZyZWUtdGV4dC1zaXplLWlucHV0XCI+Rm9udCBTaXplPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBpZD1cImVkaXRvckZyZWVUZXh0Rm9udFNpemVcIiBjbGFzcz1cImVkaXRvclBhcmFtc1NsaWRlclwiIHZhbHVlPVwiMTBcIiBtaW49XCI1XCIgbWF4PVwiMTAwXCIgc3RlcD1cIjFcIiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZWRpdG9yUGFyYW1zVG9vbGJhciBoaWRkZW4gZG9vckhhbmdlclJpZ2h0XCIgaWQ9XCJlZGl0b3JJbmtQYXJhbXNUb29sYmFyXCIgW2NsYXNzLnNlcnZlci1zaWRlLXJlbmRlcmluZ109XCJzZXJ2ZXJTaWRlUmVuZGVyaW5nXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlZGl0b3JQYXJhbXNUb29sYmFyQ29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVkaXRvclBhcmFtc1NldHRlclwiPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImVkaXRvcklua0NvbG9yXCIgY2xhc3M9XCJlZGl0b3JQYXJhbXNMYWJlbFwiIGRhdGEtbDEwbi1pZD1cInBkZmpzLWVkaXRvci1pbmstY29sb3ItaW5wdXRcIj5Db2xvcjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNvbG9yXCIgaWQ9XCJlZGl0b3JJbmtDb2xvclwiIGNsYXNzPVwiZWRpdG9yUGFyYW1zQ29sb3JcIiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlZGl0b3JQYXJhbXNTZXR0ZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJlZGl0b3JJbmtUaGlja25lc3NcIiBjbGFzcz1cImVkaXRvclBhcmFtc0xhYmVsXCIgZGF0YS1sMTBuLWlkPVwicGRmanMtZWRpdG9yLWluay10aGlja25lc3MtaW5wdXRcIj5UaGlja25lc3M8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIGlkPVwiZWRpdG9ySW5rVGhpY2tuZXNzXCIgY2xhc3M9XCJlZGl0b3JQYXJhbXNTbGlkZXJcIiB2YWx1ZT1cIjFcIiBtaW49XCIxXCIgbWF4PVwiMjBcIiBzdGVwPVwiMVwiIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVkaXRvclBhcmFtc1NldHRlclwiPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImVkaXRvcklua09wYWNpdHlcIiBjbGFzcz1cImVkaXRvclBhcmFtc0xhYmVsXCIgZGF0YS1sMTBuLWlkPVwicGRmanMtZWRpdG9yLWluay1vcGFjaXR5LWlucHV0XCI+T3BhY2l0eTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgaWQ9XCJlZGl0b3JJbmtPcGFjaXR5XCIgY2xhc3M9XCJlZGl0b3JQYXJhbXNTbGlkZXJcIiB2YWx1ZT1cIjEwMFwiIG1pbj1cIjFcIiBtYXg9XCIxMDBcIiBzdGVwPVwiMVwiIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxwZGYtc2Vjb25kYXJ5LXRvb2xiYXJcbiAgICAgICAgICAgICAgI3BkZlNlY29uZGFyeVRvb2xiYXJDb21wb25lbnRcbiAgICAgICAgICAgICAgW2NsYXNzLnNlcnZlci1zaWRlLXJlbmRlcmluZ109XCJzZXJ2ZXJTaWRlUmVuZGVyaW5nXCJcbiAgICAgICAgICAgICAgW2N1c3RvbVNlY29uZGFyeVRvb2xiYXJdPVwiY3VzdG9tU2Vjb25kYXJ5VG9vbGJhclwiXG4gICAgICAgICAgICAgIFtzZWNvbmRhcnlUb29sYmFyVG9wXT1cInNlY29uZGFyeVRvb2xiYXJUb3BcIlxuICAgICAgICAgICAgICBbbW9iaWxlRnJpZW5kbHlab29tU2NhbGVdPVwibW9iaWxlRnJpZW5kbHlab29tU2NhbGVcIlxuICAgICAgICAgICAgICAoc3ByZWFkQ2hhbmdlKT1cIm9uU3ByZWFkQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgICBbbG9jYWxpemF0aW9uSW5pdGlhbGl6ZWRdPVwibG9jYWxpemF0aW9uSW5pdGlhbGl6ZWRcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgPC9wZGYtc2Vjb25kYXJ5LXRvb2xiYXI+XG5cbiAgICAgICAgICAgIDxwZGYtZmluZGJhclxuICAgICAgICAgICAgICBbY2xhc3Muc2VydmVyLXNpZGUtcmVuZGVyaW5nXT1cInNlcnZlclNpZGVSZW5kZXJpbmdcIlxuICAgICAgICAgICAgICBbZmluZGJhckxlZnRdPVwiZmluZGJhckxlZnRcIlxuICAgICAgICAgICAgICBbZmluZGJhclRvcF09XCJmaW5kYmFyVG9wXCJcbiAgICAgICAgICAgICAgW21vYmlsZUZyaWVuZGx5Wm9vbVNjYWxlXT1cIm1vYmlsZUZyaWVuZGx5Wm9vbVNjYWxlXCJcbiAgICAgICAgICAgICAgW3Nob3dGaW5kQnV0dG9uXT1cInNob3dGaW5kQnV0dG9uIHx8IGZhbHNlXCJcbiAgICAgICAgICAgICAgW2N1c3RvbUZpbmRiYXJJbnB1dEFyZWFdPVwiY3VzdG9tRmluZGJhcklucHV0QXJlYVwiXG4gICAgICAgICAgICAgIFtjdXN0b21GaW5kYmFyQnV0dG9uc109XCJjdXN0b21GaW5kYmFyQnV0dG9uc1wiXG4gICAgICAgICAgICAgIFtzaG93RmluZEN1cnJlbnRQYWdlT25seV09XCJzaG93RmluZEN1cnJlbnRQYWdlT25seVwiXG4gICAgICAgICAgICAgIFtzaG93RmluZEVudGlyZVBocmFzZV09XCJzaG93RmluZEVudGlyZVBocmFzZVwiXG4gICAgICAgICAgICAgIFtzaG93RmluZEVudGlyZVdvcmRdPVwic2hvd0ZpbmRFbnRpcmVXb3JkXCJcbiAgICAgICAgICAgICAgW3Nob3dGaW5kRnV6enlTZWFyY2hdPVwic2hvd0ZpbmRGdXp6eVNlYXJjaFwiXG4gICAgICAgICAgICAgIFtzaG93RmluZEhpZ2hsaWdodEFsbF09XCJzaG93RmluZEhpZ2hsaWdodEFsbFwiXG4gICAgICAgICAgICAgIFtzaG93RmluZE1hdGNoRGlhY3JpdGljc109XCJzaG93RmluZE1hdGNoRGlhY3JpdGljc1wiXG4gICAgICAgICAgICAgIFtzaG93RmluZE1hdGNoQ2FzZV09XCJzaG93RmluZE1hdGNoQ2FzZVwiXG4gICAgICAgICAgICAgIFtzaG93RmluZE1lc3NhZ2VzXT1cInNob3dGaW5kTWVzc2FnZXNcIlxuICAgICAgICAgICAgICBbc2hvd0ZpbmRQYWdlUmFuZ2VdPVwic2hvd0ZpbmRQYWdlUmFuZ2VcIlxuICAgICAgICAgICAgICBbc2hvd0ZpbmRSZXN1bHRzQ291bnRdPVwic2hvd0ZpbmRSZXN1bHRzQ291bnRcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgPC9wZGYtZmluZGJhcj5cblxuICAgICAgICAgICAgPHBkZi1jb250ZXh0LW1lbnU+PC9wZGYtY29udGV4dC1tZW51PlxuXG4gICAgICAgICAgICA8ZGl2IGlkPVwidmlld2VyQ29udGFpbmVyXCIgW3N0eWxlLnRvcF09XCJ2aWV3ZXJQb3NpdGlvblRvcFwiIFtzdHlsZS5iYWNrZ3JvdW5kQ29sb3JdPVwiYmFja2dyb3VuZENvbG9yXCIgcm9sZT1cImRvY3VtZW50XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1bnZlcmlmaWVkLXNpZ25hdHVyZS13YXJuaW5nXCIgKm5nSWY9XCJoYXNTaWduYXR1cmUgJiYgc2hvd1VudmVyaWZpZWRTaWduYXR1cmVzXCI+XG4gICAgICAgICAgICAgICAge3tcbiAgICAgICAgICAgICAgICAgICd1bnZlcmlmaWVkLXNpZ25hdHVyZS13YXJuaW5nJ1xuICAgICAgICAgICAgICAgICAgICB8IHRyYW5zbGF0ZVxuICAgICAgICAgICAgICAgICAgICAgIDogXCJUaGlzIFBERiBmaWxlIGNvbnRhaW5zIGEgZGlnaXRhbCBzaWduYXR1cmUuIFRoZSBQREYgdmlld2VyIGNhbid0IHZlcmlmeSBpZiB0aGUgc2lnbmF0dXJlIGlzIHZhbGlkLlxuICAgICAgICAgICAgICAgIFBsZWFzZSBkb3dubG9hZCB0aGUgZmlsZSBhbmQgb3BlbiBpdCBpbiBBY3JvYmF0IFJlYWRlciB0byB2ZXJpZnkgdGhlIHNpZ25hdHVyZSBpcyB2YWxpZC5cIlxuICAgICAgICAgICAgICAgICAgICB8IGFzeW5jXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgaWQ9XCJ2aWV3ZXJcIiBjbGFzcz1cInBkZlZpZXdlclwiIChkYmxjbGljayk9XCJ6b29tVG9QYWdlV2lkdGgoJGV2ZW50KVwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8cGRmLWVycm9yLW1lc3NhZ2U+PC9wZGYtZXJyb3ItbWVzc2FnZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8IS0tIG1haW5Db250YWluZXIgLS0+XG5cbiAgICAgICAgICA8ZGl2IGlkPVwiZGlhbG9nQ29udGFpbmVyXCI+XG4gICAgICAgICAgICA8cGRmLXBhc3N3b3JkLWRpYWxvZz48L3BkZi1wYXNzd29yZC1kaWFsb2c+XG4gICAgICAgICAgICA8cGRmLWRvY3VtZW50LXByb3BlcnRpZXMtZGlhbG9nPjwvcGRmLWRvY3VtZW50LXByb3BlcnRpZXMtZGlhbG9nPlxuICAgICAgICAgICAgPHBkZi1hbHQtdGV4dC1kaWFsb2c+PC9wZGYtYWx0LXRleHQtZGlhbG9nPlxuICAgICAgICAgICAgPHBkZi1wcmVwYXJlLXByaW50aW5nLWRpYWxvZz48L3BkZi1wcmVwYXJlLXByaW50aW5nLWRpYWxvZz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8IS0tIGRpYWxvZ0NvbnRhaW5lciAtLT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDwhLS0gb3V0ZXJDb250YWluZXIgLS0+XG4gICAgICAgIDxkaXYgaWQ9XCJwcmludENvbnRhaW5lclwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0RnJlZUZsb2F0aW5nQmFyPiA8L25nLXRlbXBsYXRlPlxuIl19