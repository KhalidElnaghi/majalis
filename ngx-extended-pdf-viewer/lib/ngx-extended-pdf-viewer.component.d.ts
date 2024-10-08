import { PlatformLocation } from '@angular/common';
import { ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, TemplateRef } from '@angular/core';
import { FindResultMatchesCount, FindState } from './events/find-result';
import { PageRenderEvent } from './events/page-render-event';
import { PageRenderedEvent } from './events/page-rendered-event';
import { PagesLoadedEvent } from './events/pages-loaded-event';
import { PdfDownloadedEvent } from './events/pdf-downloaded-event';
import { PdfLoadedEvent } from './events/pdf-loaded-event';
import { PdfLoadingStartsEvent } from './events/pdf-loading-starts-event';
import { PdfThumbnailDrawnEvent } from './events/pdf-thumbnail-drawn-event';
import { ProgressBarEvent } from './events/progress-bar-event';
import { TextLayerRenderedEvent } from './events/textlayer-rendered';
import { NgxExtendedPdfViewerService } from './ngx-extended-pdf-viewer.service';
import { PageViewModeType, ScrollModeType } from './options/pdf-viewer';
import { PDFDocumentProxy } from './options/pdf-viewer-application';
import { VerbosityLevel } from './options/verbosity-level';
import { PdfDummyComponentsComponent } from './pdf-dummy-components/pdf-dummy-components.component';
import { PDFNotificationService } from './pdf-notification-service';
import { AnnotationEditorEvent } from './events/annotation-editor-layer-event';
import { AnnotationEditorLayerRenderedEvent } from './events/annotation-editor-layer-rendered-event';
import { AnnotationEditorEditorModeChangedEvent } from './events/annotation-editor-mode-changed-event';
import { AnnotationLayerRenderedEvent } from './events/annotation-layer-rendered-event';
import { AttachmentLoadedEvent } from './events/attachment-loaded-event';
import { LayersLoadedEvent } from './events/layers-loaded-event';
import { OutlineLoadedEvent } from './events/outline-loaded-event';
import { XfaLayerRenderedEvent } from './events/xfa-layer-rendered-event';
import { PdfSidebarView } from './options/pdf-sidebar-views';
import { SpreadType } from './options/spread-type';
import { PdfCspPolicyService } from './pdf-csp-policy.service';
import { ResponsiveVisibility } from './responsive-visibility';
import * as i0 from "@angular/core";
export interface FormDataType {
    [fieldName: string]: null | string | number | boolean | string[];
}
export declare class NgxExtendedPdfViewerComponent implements OnInit, OnChanges, OnDestroy {
    private ngZone;
    private platformId;
    private notificationService;
    private elementRef;
    private platformLocation;
    private cdr;
    service: NgxExtendedPdfViewerService;
    private renderer;
    private pdfCspPolicyService;
    private static originalPrint;
    private PDFViewerApplication;
    private PDFViewerApplicationOptions;
    private PDFViewerApplicationConstants;
    private webViewerLoad;
    ngxExtendedPdfViewerIncompletelyInitialized: boolean;
    private formSupport;
    /**
     * The dummy components are inserted automatically when the user customizes the toolbar
     * without adding every original toolbar item. Without the dummy components, the
     * initialization code of pdf.js crashes because it assume that every standard widget is there.
     */
    dummyComponents: PdfDummyComponentsComponent;
    root: ElementRef;
    annotationEditorEvent: EventEmitter<AnnotationEditorEvent>;
    customFindbarInputArea: TemplateRef<any> | undefined;
    customToolbar: TemplateRef<any> | undefined;
    customFindbar: TemplateRef<any> | undefined;
    customFindbarButtons: TemplateRef<any> | undefined;
    customPdfViewer: TemplateRef<any> | undefined;
    customSecondaryToolbar: TemplateRef<any> | undefined;
    customSidebar: TemplateRef<any> | undefined;
    customThumbnail: TemplateRef<any> | undefined;
    customFreeFloatingBar: TemplateRef<any> | undefined;
    showFreeFloatingBar: boolean;
    enableDragAndDrop: boolean;
    localizationInitialized: boolean;
    private windowSizeRecalculatorSubscription;
    set formData(formData: FormDataType);
    disableForms: boolean;
    get formDataChange(): EventEmitter<FormDataType>;
    _pageViewMode: PageViewModeType;
    baseHref: string;
    /** This flag prevents trying to load a file twice if the user uploads it using the file upload dialog or via drag'n'drop */
    private srcChangeTriggeredByUser;
    get pageViewMode(): PageViewModeType;
    set pageViewMode(viewMode: PageViewModeType);
    pageViewModeChange: EventEmitter<PageViewModeType>;
    progress: EventEmitter<ProgressBarEvent>;
    private secondaryToolbarComponent;
    private sidebarComponent;
    private _src;
    srcChange: EventEmitter<string>;
    private _scrollMode;
    get scrollMode(): ScrollModeType;
    set scrollMode(value: ScrollModeType);
    scrollModeChange: EventEmitter<ScrollModeType>;
    authorization: Object | boolean | undefined;
    httpHeaders: Object | undefined;
    contextMenuAllowed: boolean;
    afterPrint: EventEmitter<void>;
    beforePrint: EventEmitter<void>;
    currentZoomFactor: EventEmitter<number>;
    /** This field stores the previous zoom level if the page is enlarged with a double-tap or double-click */
    private previousZoom;
    enablePrint: boolean;
    showTextEditor: ResponsiveVisibility;
    showStampEditor: ResponsiveVisibility;
    showDrawEditor: ResponsiveVisibility;
    showHighlightEditor: ResponsiveVisibility;
    /** store the timeout id so it can be canceled if user leaves the page before the PDF is shown */
    private initTimeout;
    /** How many log messages should be printed?
     * Legal values: VerbosityLevel.INFOS (= 5), VerbosityLevel.WARNINGS (= 1), VerbosityLevel.ERRORS (= 0) */
    logLevel: VerbosityLevel;
    relativeCoordsOptions: Object;
    /** Use the minified (minifiedJSLibraries="true", which is the default) or the user-readable pdf.js library (minifiedJSLibraries="false") */
    private _minifiedJSLibraries;
    get minifiedJSLibraries(): boolean;
    set minifiedJSLibraries(value: boolean);
    primaryMenuVisible: boolean;
    /** option to increase (or reduce) print resolution. Default is 150 (dpi). Sensible values
     * are 300, 600, and 1200. Note the increase memory consumption, which may even result in a browser crash. */
    printResolution: any;
    rotation: 0 | 90 | 180 | 270;
    rotationChange: EventEmitter<0 | 90 | 180 | 270>;
    annotationLayerRendered: EventEmitter<AnnotationLayerRenderedEvent>;
    annotationEditorLayerRendered: EventEmitter<AnnotationEditorLayerRenderedEvent>;
    xfaLayerRendered: EventEmitter<XfaLayerRenderedEvent>;
    outlineLoaded: EventEmitter<OutlineLoadedEvent>;
    attachmentsloaded: EventEmitter<AttachmentLoadedEvent>;
    layersloaded: EventEmitter<LayersLoadedEvent>;
    hasSignature: boolean;
    set src(url: string | ArrayBuffer | Blob | Uint8Array | URL | {
        range: any;
    });
    set base64Src(base64: string | null | undefined);
    /**
     * The combination of height, minHeight, and autoHeight ensures the PDF height of the PDF viewer is calculated correctly when the height is a percentage.
     * By default, many CSS frameworks make a div with 100% have a height or zero pixels. checkHeigth() fixes this.
     */
    private autoHeight;
    minHeight: string | undefined;
    private _height;
    set height(h: string);
    get height(): string;
    forceUsingLegacyES5: boolean;
    backgroundColor: string;
    /** Allows the user to define the name of the file after clicking "download" */
    filenameForDownload: string | undefined;
    /** Allows the user to disable the keyboard bindings completely */
    ignoreKeyboard: boolean;
    /** Allows the user to disable a list of key bindings. */
    ignoreKeys: Array<string>;
    /** Allows the user to enable a list of key bindings explicitly. If this property is set, every other key binding is ignored. */
    acceptKeys: Array<string>;
    /** Allows the user to put the viewer's svg images into an arbitrary folder */
    imageResourcesPath: string;
    /** Allows the user to put their locale folder into an arbitrary folder */
    localeFolderPath: string;
    /** Override the default locale. This must be the complete locale name, such as "es-ES". The string is allowed to be all lowercase.
     */
    language: string | undefined;
    /** By default, listening to the URL is deactivated because often the anchor tag is used for the Angular router */
    listenToURL: boolean;
    /** Navigate to a certain "named destination" */
    nameddest: string | undefined;
    /** allows you to pass a password to read password-protected files */
    password: string | undefined;
    replaceBrowserPrint: boolean;
    _showSidebarButton: ResponsiveVisibility;
    viewerPositionTop: string;
    /** pdf.js can show signatures, but fails to verify them. So they are switched off by default.
     * Set "[showUnverifiedSignatures]"="true" to display e-signatures nonetheless.
     */
    showUnverifiedSignatures: boolean;
    startTabindex: number | undefined;
    get showSidebarButton(): ResponsiveVisibility;
    set showSidebarButton(show: ResponsiveVisibility);
    private _sidebarVisible;
    get sidebarVisible(): boolean | undefined;
    set sidebarVisible(value: boolean | undefined);
    sidebarVisibleChange: EventEmitter<boolean>;
    activeSidebarView: PdfSidebarView;
    activeSidebarViewChange: EventEmitter<PdfSidebarView>;
    findbarVisible: boolean;
    findbarVisibleChange: EventEmitter<boolean>;
    propertiesDialogVisible: boolean;
    propertiesDialogVisibleChange: EventEmitter<boolean>;
    showFindButton: ResponsiveVisibility | undefined;
    showFindHighlightAll: boolean;
    showFindMatchCase: boolean;
    showFindCurrentPageOnly: boolean;
    showFindPageRange: boolean;
    showFindEntireWord: boolean;
    showFindEntirePhrase: boolean;
    showFindMatchDiacritics: boolean;
    showFindFuzzySearch: boolean;
    showFindResultsCount: boolean;
    showFindMessages: boolean;
    showPagingButtons: ResponsiveVisibility;
    showZoomButtons: ResponsiveVisibility;
    showPresentationModeButton: ResponsiveVisibility;
    showOpenFileButton: ResponsiveVisibility;
    showPrintButton: ResponsiveVisibility;
    showDownloadButton: ResponsiveVisibility;
    theme: 'dark' | 'light' | 'custom' | string;
    showToolbar: boolean;
    showSecondaryToolbarButton: ResponsiveVisibility;
    showSinglePageModeButton: ResponsiveVisibility;
    showVerticalScrollButton: ResponsiveVisibility;
    showHorizontalScrollButton: ResponsiveVisibility;
    showWrappedScrollButton: ResponsiveVisibility;
    showInfiniteScrollButton: ResponsiveVisibility;
    showBookModeButton: ResponsiveVisibility;
    set showRotateButton(visibility: ResponsiveVisibility);
    showRotateCwButton: ResponsiveVisibility;
    showRotateCcwButton: ResponsiveVisibility;
    private _handTool;
    set handTool(handTool: boolean);
    get handTool(): boolean;
    handToolChange: EventEmitter<boolean>;
    showHandToolButton: ResponsiveVisibility;
    private _showScrollingButton;
    get showScrollingButton(): ResponsiveVisibility;
    set showScrollingButton(val: ResponsiveVisibility);
    showSpreadButton: ResponsiveVisibility;
    showPropertiesButton: ResponsiveVisibility;
    showBorders: boolean;
    spread: SpreadType;
    spreadChange: EventEmitter<"off" | "even" | "odd">;
    thumbnailDrawn: EventEmitter<PdfThumbnailDrawnEvent>;
    private _page;
    get page(): number | undefined;
    set page(p: number | undefined);
    pageChange: EventEmitter<number>;
    pageLabel: string | undefined;
    pageLabelChange: EventEmitter<string>;
    pagesLoaded: EventEmitter<PagesLoadedEvent>;
    pageRender: EventEmitter<PageRenderEvent>;
    pageRendered: EventEmitter<PageRenderedEvent>;
    pdfDownloaded: EventEmitter<PdfDownloadedEvent>;
    pdfLoaded: EventEmitter<PdfLoadedEvent>;
    pdfLoadingStarts: EventEmitter<PdfLoadingStartsEvent>;
    pdfLoadingFailed: EventEmitter<Error>;
    textLayer: boolean | undefined;
    textLayerRendered: EventEmitter<TextLayerRenderedEvent>;
    annotationEditorModeChanged: EventEmitter<AnnotationEditorEditorModeChangedEvent>;
    updateFindMatchesCount: EventEmitter<FindResultMatchesCount>;
    updateFindState: EventEmitter<FindState>;
    /** Legal values: undefined, 'auto', 'page-actual', 'page-fit', 'page-width', or '50' (or any other percentage) */
    zoom: string | number | undefined;
    zoomChange: EventEmitter<string | number>;
    zoomLevels: (string | number)[];
    maxZoom: number;
    minZoom: number;
    /** This attribute allows you to increase the size of the UI elements so you can use them on small mobile devices.
     * This attribute is a string with a percent character at the end (e.g. "150%").
     */
    _mobileFriendlyZoom: string;
    mobileFriendlyZoomScale: number;
    toolbarMarginTop: string;
    toolbarWidth: string;
    private toolbar;
    onToolbarLoaded(toolbarElement: HTMLElement): void;
    toolbarWidthInPixels: number;
    secondaryToolbarTop: string | undefined;
    sidebarPositionTop: string | undefined;
    findbarTop: string | undefined;
    findbarLeft: string | undefined;
    get mobileFriendlyZoom(): string;
    get pdfJsVersion(): string;
    get majorMinorPdfJsVersion(): string;
    /**
     * This attributes allows you to increase the size of the UI elements so you can use them on small mobile devices.
     * This attribute is a string with a percent character at the end (e.g. "150%").
     */
    set mobileFriendlyZoom(zoom: string);
    private shuttingDown;
    serverSideRendering: boolean;
    calcViewerPositionTop(): void;
    constructor(ngZone: NgZone, platformId: any, notificationService: PDFNotificationService, elementRef: ElementRef, platformLocation: PlatformLocation, cdr: ChangeDetectorRef, service: NgxExtendedPdfViewerService, renderer: Renderer2, pdfCspPolicyService: PdfCspPolicyService);
    private iOSVersionRequiresES5;
    private needsES5;
    private ngxExtendedPdfViewerCanRunModernJSCode;
    private addScriptOpChainingSupport;
    private createScriptElement;
    private createScriptImportElement;
    private getPdfJsPath;
    private loadViewer;
    private addFeatures;
    ngOnInit(): void;
    private loadPdfJs;
    private assignTabindexes;
    private showElementsRecursively;
    private collectElementPositions;
    private afterPrintListener;
    private beforePrintListener;
    private doInitPDFViewer;
    private addTranslationsUnlessProvidedByTheUser;
    private hideToolbarIfItIsEmpty;
    /** Notifies every widget that implements onLibraryInit() that the PDF viewer objects are available */
    private afterLibraryInit;
    checkHeight(): void;
    private calculateBorderMargin;
    onSpreadChange(newSpread: 'off' | 'even' | 'odd'): void;
    private activateTextlayerIfNecessary;
    private overrideDefaultSettings;
    private openPDF;
    private registerEventListeners;
    private removeScrollbarInInfiniteScrollMode;
    openPDF2(): Promise<void>;
    private selectCursorTool;
    ngOnDestroy(): Promise<void>;
    private isPrimaryMenuVisible;
    ngOnChanges(changes: SimpleChanges): Promise<void>;
    private setZoom;
    onResize(): void;
    onContextMenu(): boolean;
    scrollSignatureWarningIntoView(pdf: PDFDocumentProxy): Promise<void>;
    zoomToPageWidth(event: MouseEvent): Promise<void>;
    private enableOrDisableForms;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxExtendedPdfViewerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxExtendedPdfViewerComponent, "ngx-extended-pdf-viewer", never, { "customFindbarInputArea": { "alias": "customFindbarInputArea"; "required": false; }; "customToolbar": { "alias": "customToolbar"; "required": false; }; "customFindbar": { "alias": "customFindbar"; "required": false; }; "customFindbarButtons": { "alias": "customFindbarButtons"; "required": false; }; "customPdfViewer": { "alias": "customPdfViewer"; "required": false; }; "customSecondaryToolbar": { "alias": "customSecondaryToolbar"; "required": false; }; "customSidebar": { "alias": "customSidebar"; "required": false; }; "customThumbnail": { "alias": "customThumbnail"; "required": false; }; "customFreeFloatingBar": { "alias": "customFreeFloatingBar"; "required": false; }; "showFreeFloatingBar": { "alias": "showFreeFloatingBar"; "required": false; }; "enableDragAndDrop": { "alias": "enableDragAndDrop"; "required": false; }; "formData": { "alias": "formData"; "required": false; }; "disableForms": { "alias": "disableForms"; "required": false; }; "pageViewMode": { "alias": "pageViewMode"; "required": false; }; "scrollMode": { "alias": "scrollMode"; "required": false; }; "authorization": { "alias": "authorization"; "required": false; }; "httpHeaders": { "alias": "httpHeaders"; "required": false; }; "contextMenuAllowed": { "alias": "contextMenuAllowed"; "required": false; }; "enablePrint": { "alias": "enablePrint"; "required": false; }; "showTextEditor": { "alias": "showTextEditor"; "required": false; }; "showStampEditor": { "alias": "showStampEditor"; "required": false; }; "showDrawEditor": { "alias": "showDrawEditor"; "required": false; }; "showHighlightEditor": { "alias": "showHighlightEditor"; "required": false; }; "logLevel": { "alias": "logLevel"; "required": false; }; "relativeCoordsOptions": { "alias": "relativeCoordsOptions"; "required": false; }; "minifiedJSLibraries": { "alias": "minifiedJSLibraries"; "required": false; }; "printResolution": { "alias": "printResolution"; "required": false; }; "rotation": { "alias": "rotation"; "required": false; }; "src": { "alias": "src"; "required": false; }; "base64Src": { "alias": "base64Src"; "required": false; }; "minHeight": { "alias": "minHeight"; "required": false; }; "height": { "alias": "height"; "required": false; }; "forceUsingLegacyES5": { "alias": "forceUsingLegacyES5"; "required": false; }; "backgroundColor": { "alias": "backgroundColor"; "required": false; }; "filenameForDownload": { "alias": "filenameForDownload"; "required": false; }; "ignoreKeyboard": { "alias": "ignoreKeyboard"; "required": false; }; "ignoreKeys": { "alias": "ignoreKeys"; "required": false; }; "acceptKeys": { "alias": "acceptKeys"; "required": false; }; "imageResourcesPath": { "alias": "imageResourcesPath"; "required": false; }; "localeFolderPath": { "alias": "localeFolderPath"; "required": false; }; "language": { "alias": "language"; "required": false; }; "listenToURL": { "alias": "listenToURL"; "required": false; }; "nameddest": { "alias": "nameddest"; "required": false; }; "password": { "alias": "password"; "required": false; }; "replaceBrowserPrint": { "alias": "replaceBrowserPrint"; "required": false; }; "showUnverifiedSignatures": { "alias": "showUnverifiedSignatures"; "required": false; }; "startTabindex": { "alias": "startTabindex"; "required": false; }; "showSidebarButton": { "alias": "showSidebarButton"; "required": false; }; "sidebarVisible": { "alias": "sidebarVisible"; "required": false; }; "activeSidebarView": { "alias": "activeSidebarView"; "required": false; }; "findbarVisible": { "alias": "findbarVisible"; "required": false; }; "propertiesDialogVisible": { "alias": "propertiesDialogVisible"; "required": false; }; "showFindButton": { "alias": "showFindButton"; "required": false; }; "showFindHighlightAll": { "alias": "showFindHighlightAll"; "required": false; }; "showFindMatchCase": { "alias": "showFindMatchCase"; "required": false; }; "showFindCurrentPageOnly": { "alias": "showFindCurrentPageOnly"; "required": false; }; "showFindPageRange": { "alias": "showFindPageRange"; "required": false; }; "showFindEntireWord": { "alias": "showFindEntireWord"; "required": false; }; "showFindEntirePhrase": { "alias": "showFindEntirePhrase"; "required": false; }; "showFindMatchDiacritics": { "alias": "showFindMatchDiacritics"; "required": false; }; "showFindFuzzySearch": { "alias": "showFindFuzzySearch"; "required": false; }; "showFindResultsCount": { "alias": "showFindResultsCount"; "required": false; }; "showFindMessages": { "alias": "showFindMessages"; "required": false; }; "showPagingButtons": { "alias": "showPagingButtons"; "required": false; }; "showZoomButtons": { "alias": "showZoomButtons"; "required": false; }; "showPresentationModeButton": { "alias": "showPresentationModeButton"; "required": false; }; "showOpenFileButton": { "alias": "showOpenFileButton"; "required": false; }; "showPrintButton": { "alias": "showPrintButton"; "required": false; }; "showDownloadButton": { "alias": "showDownloadButton"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; "showToolbar": { "alias": "showToolbar"; "required": false; }; "showSecondaryToolbarButton": { "alias": "showSecondaryToolbarButton"; "required": false; }; "showSinglePageModeButton": { "alias": "showSinglePageModeButton"; "required": false; }; "showVerticalScrollButton": { "alias": "showVerticalScrollButton"; "required": false; }; "showHorizontalScrollButton": { "alias": "showHorizontalScrollButton"; "required": false; }; "showWrappedScrollButton": { "alias": "showWrappedScrollButton"; "required": false; }; "showInfiniteScrollButton": { "alias": "showInfiniteScrollButton"; "required": false; }; "showBookModeButton": { "alias": "showBookModeButton"; "required": false; }; "showRotateButton": { "alias": "showRotateButton"; "required": false; }; "showRotateCwButton": { "alias": "showRotateCwButton"; "required": false; }; "showRotateCcwButton": { "alias": "showRotateCcwButton"; "required": false; }; "handTool": { "alias": "handTool"; "required": false; }; "showHandToolButton": { "alias": "showHandToolButton"; "required": false; }; "showScrollingButton": { "alias": "showScrollingButton"; "required": false; }; "showSpreadButton": { "alias": "showSpreadButton"; "required": false; }; "showPropertiesButton": { "alias": "showPropertiesButton"; "required": false; }; "showBorders": { "alias": "showBorders"; "required": false; }; "spread": { "alias": "spread"; "required": false; }; "page": { "alias": "page"; "required": false; }; "pageLabel": { "alias": "pageLabel"; "required": false; }; "textLayer": { "alias": "textLayer"; "required": false; }; "zoom": { "alias": "zoom"; "required": false; }; "zoomLevels": { "alias": "zoomLevels"; "required": false; }; "maxZoom": { "alias": "maxZoom"; "required": false; }; "minZoom": { "alias": "minZoom"; "required": false; }; "mobileFriendlyZoom": { "alias": "mobileFriendlyZoom"; "required": false; }; }, { "annotationEditorEvent": "annotationEditorEvent"; "formDataChange": "formDataChange"; "pageViewModeChange": "pageViewModeChange"; "progress": "progress"; "srcChange": "srcChange"; "scrollModeChange": "scrollModeChange"; "afterPrint": "afterPrint"; "beforePrint": "beforePrint"; "currentZoomFactor": "currentZoomFactor"; "rotationChange": "rotationChange"; "annotationLayerRendered": "annotationLayerRendered"; "annotationEditorLayerRendered": "annotationEditorLayerRendered"; "xfaLayerRendered": "xfaLayerRendered"; "outlineLoaded": "outlineLoaded"; "attachmentsloaded": "attachmentsloaded"; "layersloaded": "layersloaded"; "sidebarVisibleChange": "sidebarVisibleChange"; "activeSidebarViewChange": "activeSidebarViewChange"; "findbarVisibleChange": "findbarVisibleChange"; "propertiesDialogVisibleChange": "propertiesDialogVisibleChange"; "handToolChange": "handToolChange"; "spreadChange": "spreadChange"; "thumbnailDrawn": "thumbnailDrawn"; "pageChange": "pageChange"; "pageLabelChange": "pageLabelChange"; "pagesLoaded": "pagesLoaded"; "pageRender": "pageRender"; "pageRendered": "pageRendered"; "pdfDownloaded": "pdfDownloaded"; "pdfLoaded": "pdfLoaded"; "pdfLoadingStarts": "pdfLoadingStarts"; "pdfLoadingFailed": "pdfLoadingFailed"; "textLayerRendered": "textLayerRendered"; "annotationEditorModeChanged": "annotationEditorModeChanged"; "updateFindMatchesCount": "updateFindMatchesCount"; "updateFindState": "updateFindState"; "zoomChange": "zoomChange"; }, never, ["*", "*"], false, never>;
}
