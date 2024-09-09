// tslint:disable:max-line-length
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicCssComponent } from './dynamic-css/dynamic-css.component';
import { NgxExtendedPdfViewerComponent } from './ngx-extended-pdf-viewer.component';
import { NgxExtendedPdfViewerService } from './ngx-extended-pdf-viewer.service';
import { NgxConsole } from './options/ngx-console';
import { PdfAltTextDialogComponent } from './pdf-dialog/pdf-alt-text-dialog/pdf-alt-text-dialog.component';
import { PdfDocumentPropertiesDialogComponent } from './pdf-dialog/pdf-document-properties-dialog/pdf-document-properties-dialog.component';
import { PdfErrorMessageComponent } from './pdf-dialog/pdf-error-message/pdf-error-message.component';
import { PdfPasswordDialogComponent } from './pdf-dialog/pdf-password-dialog/pdf-password-dialog.component';
import { PdfPreparePrintingDialogComponent } from './pdf-dialog/pdf-prepare-printing-dialog/pdf-prepare-printing-dialog.component';
import { PdfDummyComponentsComponent } from './pdf-dummy-components/pdf-dummy-components.component';
import { NegativeResponsiveCSSClassPipe, ResponsiveCSSClassPipe } from './responsive-visibility';
import { PdfSecondaryToolbarComponent } from './secondary-toolbar/pdf-secondary-toolbar/pdf-secondary-toolbar.component';
import { PdfSidebarContentComponent } from './sidebar/pdf-sidebar/pdf-sidebar-content/pdf-sidebar-content.component';
import { PdfSidebarToolbarComponent } from './sidebar/pdf-sidebar/pdf-sidebar-toolbar/pdf-sidebar-toolbar.component';
import { PdfSidebarComponent } from './sidebar/pdf-sidebar/pdf-sidebar.component';
import { PdfAcroformDefaultThemeComponent } from './theme/acroform-default-theme/pdf-acroform-default-theme.component';
import { PdfDarkThemeComponent } from './theme/pdf-dark-theme/pdf-dark-theme.component';
import { PdfLightThemeComponent } from './theme/pdf-light-theme/pdf-light-theme.component';
import { PdfBookModeComponent } from './toolbar/pdf-book-mode/pdf-book-mode.component';
import { PdfContextMenuComponent } from './toolbar/pdf-context-menu/pdf-context-menu.component';
import { PdfDocumentPropertiesComponent } from './toolbar/pdf-document-properties/pdf-document-properties.component';
import { PdfDownloadComponent } from './toolbar/pdf-download/pdf-download.component';
import { PdfDrawEditorComponent } from './toolbar/pdf-draw-editor/pdf-draw-editor.component';
import { PdfEditorComponent } from './toolbar/pdf-editor/pdf-editor.component';
import { PdfEvenSpreadComponent } from './toolbar/pdf-even-spread/pdf-even-spread.component';
import { PdfFindButtonComponent } from './toolbar/pdf-find-button/pdf-find-button.component';
import { PdfFindInputAreaComponent } from './toolbar/pdf-findbar/pdf-find-input-area/pdf-find-input-area.component';
import { PdfFindNextComponent } from './toolbar/pdf-findbar/pdf-find-next/pdf-find-next.component';
import { PdfFindPreviousComponent } from './toolbar/pdf-findbar/pdf-find-previous/pdf-find-previous.component';
import { PdfFindbarMessageContainerComponent } from './toolbar/pdf-findbar/pdf-findbar-message-container/pdf-findbar-message-container.component';
import { PdfFindHighlightAllComponent } from './toolbar/pdf-findbar/pdf-findbar-options-one-container/pdf-find-highlight-all/pdf-find-highlight-all.component';
import { PdfFindMatchCaseComponent } from './toolbar/pdf-findbar/pdf-findbar-options-one-container/pdf-find-match-case/pdf-find-match-case.component';
import { PdfFindResultsCountComponent } from './toolbar/pdf-findbar/pdf-findbar-options-three-container/pdf-find-results-count/pdf-find-results-count.component';
import { PdfFindEntireWordComponent } from './toolbar/pdf-findbar/pdf-findbar-options-two-container/pdf-find-entire-word/pdf-find-entire-word.component';
import { PdfMatchDiacriticsComponent } from './toolbar/pdf-findbar/pdf-findbar-options-two-container/pdf-match-diacritics/pdf-match-diacritics.component';
import { PdfFindbarComponent } from './toolbar/pdf-findbar/pdf-findbar.component';
import { PdfSearchInputFieldComponent } from './toolbar/pdf-findbar/pdf-search-input-field/pdf-search-input-field.component';
import { PdfHandToolComponent } from './toolbar/pdf-hand-tool/pdf-hand-tool.component';
import { PdfHighlightEditorComponent } from './toolbar/pdf-highlight-editor/pdf-highlight-editor.component';
import { PdfHorizontalScrollComponent } from './toolbar/pdf-horizontal-scroll/pdf-horizontal-scroll.component';
import { PdfInfiniteScrollComponent } from './toolbar/pdf-infinite-scroll/pdf-infinite-scroll.component';
import { PdfNoSpreadComponent } from './toolbar/pdf-no-spread/pdf-no-spread.component';
import { PdfOddSpreadComponent } from './toolbar/pdf-odd-spread/pdf-odd-spread.component';
import { PdfOpenFileComponent } from './toolbar/pdf-open-file/pdf-open-file.component';
import { PdfFirstPageComponent } from './toolbar/pdf-paging-area/pdf-first-page/pdf-first-page.component';
import { PdfLastPageComponent } from './toolbar/pdf-paging-area/pdf-last-page/pdf-last-page.component';
import { PdfNextPageComponent } from './toolbar/pdf-paging-area/pdf-next-page/pdf-next-page.component';
import { PdfPageNumberComponent } from './toolbar/pdf-paging-area/pdf-page-number/pdf-page-number.component';
import { PdfPagingAreaComponent } from './toolbar/pdf-paging-area/pdf-paging-area.component';
import { PdfPreviousPageComponent } from './toolbar/pdf-paging-area/pdf-previous-page/pdf-previous-page.component';
import { PdfPresentationModeComponent } from './toolbar/pdf-presentation-mode/pdf-presentation-mode.component';
import { PdfPrintComponent } from './toolbar/pdf-print/pdf-print.component';
import { PdfRotatePageCcwComponent } from './toolbar/pdf-rotate-page-ccw/pdf-rotate-page-ccw.component';
import { PdfRotatePageCwComponent } from './toolbar/pdf-rotate-page-cw/pdf-rotate-page-cw.component';
import { PdfRotatePageComponent } from './toolbar/pdf-rotate-page/pdf-rotate-page.component';
import { PdfSelectToolComponent } from './toolbar/pdf-select-tool/pdf-select-tool.component';
import { PdfShyButtonComponent } from './toolbar/pdf-shy-button/pdf-shy-button.component';
import { PdfSinglePageModeComponent } from './toolbar/pdf-single-page-mode/pdf-single-page-mode.component';
import { PdfStampEditorComponent } from './toolbar/pdf-stamp-editor/pdf-stamp-editor.component';
import { PdfTextEditorComponent } from './toolbar/pdf-text-editor/pdf-text-editor.component';
import { PdfToggleSecondaryToolbarComponent } from './toolbar/pdf-toggle-secondary-toolbar/pdf-toggle-secondary-toolbar.component';
import { PdfToggleSidebarComponent } from './toolbar/pdf-toggle-sidebar/pdf-toggle-sidebar.component';
import { PdfToolbarComponent } from './toolbar/pdf-toolbar/pdf-toolbar.component';
import { PdfVerticalScrollModeComponent } from './toolbar/pdf-vertical-scroll-button/pdf-vertical-scroll-mode.component';
import { PdfWrappedScrollModeComponent } from './toolbar/pdf-wrapped-scroll-mode/pdf-wrapped-scroll-mode.component';
import { PdfZoomDropdownComponent } from './toolbar/pdf-zoom-toolbar/pdf-zoom-dropdown/pdf-zoom-dropdown.component';
import { PdfZoomInComponent } from './toolbar/pdf-zoom-toolbar/pdf-zoom-in/pdf-zoom-in.component';
import { PdfZoomOutComponent } from './toolbar/pdf-zoom-toolbar/pdf-zoom-out/pdf-zoom-out.component';
import { PdfZoomToolbarComponent } from './toolbar/pdf-zoom-toolbar/pdf-zoom-toolbar.component';
import { TranslatePipe } from './translate.pipe';
import * as i0 from "@angular/core";
if (new Date().getTime() === 0) {
    new NgxConsole().log('');
}
if (!Promise['allSettled']) {
    if (!!window['Zone'] && !window['__zone_symbol__Promise.allSettled']) {
        console.error("Please update zone.js to version 0.10.3 or higher. Otherwise, you'll run the slow ECMAScript 5 version even on modern browser that can run the fast ESMAScript 2015 version.");
    }
}
function isKeyIgnored(cmd, keycode) {
    const PDFViewerApplicationOptions = window.PDFViewerApplicationOptions;
    const ignoreKeys = PDFViewerApplicationOptions.get('ignoreKeys');
    const acceptKeys = PDFViewerApplicationOptions.get('acceptKeys');
    if (keycode === 'WHEEL') {
        if (!!ignoreKeys && isKeyInList(ignoreKeys, cmd, 'WHEEL')) {
            return true;
        }
        if (!!acceptKeys && acceptKeys.length > 0) {
            return !isKeyInList(acceptKeys, cmd, 'WHEEL');
        }
        return false;
    }
    if (keycode === 16 || keycode === 17 || keycode === 18 || keycode === 224) {
        // ignore solitary SHIFT, ALT, CMD, and CTRL because they only make sense as two-key-combinations
        return true;
    }
    // cmd is a bit-array:
    // 1 == CTRL
    // 2 == ALT
    // 4 == SHIFT
    // 8 == META
    const ignoreKeyboard = PDFViewerApplicationOptions.get('ignoreKeyboard');
    if (!!ignoreKeyboard) {
        return true;
    }
    if (!!ignoreKeys && ignoreKeys.length > 0) {
        if (isKeyInList(ignoreKeys, cmd, keycode)) {
            return true;
        }
    }
    if (!!acceptKeys && acceptKeys.length > 0) {
        return !isKeyInList(acceptKeys, cmd, keycode);
    }
    return false;
}
function isKeyInList(settings, cmd, keycode) {
    if (!settings) {
        return true;
    }
    return settings.some((keyDef) => isKey(keyDef, cmd, keycode));
}
function isKey(keyDef, cmd, keycode) {
    let cmdDef = 0;
    let key = 0;
    keyDef = keyDef.toLowerCase();
    // tslint:disable: no-bitwise
    if (keyDef.includes('ctrl+')) {
        cmdDef |= 1;
        keyDef = keyDef.replace('ctrl+', '');
    }
    if (keyDef.includes('cmd+')) {
        cmdDef |= 8;
        keyDef = keyDef.replace('cmd+', '');
    }
    if (keyDef.includes('alt+')) {
        cmdDef |= 2;
        keyDef = keyDef.replace('alt+', '');
    }
    if (keyDef.includes('shift+')) {
        cmdDef |= 4;
        keyDef = keyDef.replace('shift+', '');
    }
    if (keyDef.includes('meta+')) {
        cmdDef |= 8;
        keyDef = keyDef.replace('meta+', '');
    }
    if (keyDef === 'up') {
        key = 38;
    }
    else if (keyDef === 'down') {
        key = 40;
    }
    else if (keyDef === '+' || keyDef === '"+"') {
        key = 171;
    }
    else if (keyDef === '-' || keyDef === '"-"') {
        key = 173;
    }
    else if (keyDef === 'esc') {
        key = 27;
    }
    else if (keyDef === 'enter') {
        key = 13;
    }
    else if (keyDef === 'space') {
        key = 32;
    }
    else if (keyDef === 'f4') {
        key = 115;
    }
    else if (keyDef === 'backspace') {
        key = 8;
    }
    else if (keyDef === 'home') {
        key = 36;
    }
    else if (keyDef === 'end') {
        key = 35;
    }
    else if (keyDef === 'left') {
        key = 37;
    }
    else if (keyDef === 'right') {
        key = 39;
    }
    else if (keyDef === 'pagedown') {
        key = 34;
    }
    else if (keyDef === 'pageup') {
        key = 33;
    }
    else {
        key = keyDef.toUpperCase().charCodeAt(0);
    }
    if (keycode === 'WHEEL') {
        return keyDef === 'wheel' && cmd === cmdDef;
    }
    return key === keycode && cmd === cmdDef;
}
if (typeof window !== 'undefined') {
    window.isKeyIgnored = isKeyIgnored;
}
export class NgxExtendedPdfViewerModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: NgxExtendedPdfViewerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.11", ngImport: i0, type: NgxExtendedPdfViewerModule, declarations: [DynamicCssComponent,
            NegativeResponsiveCSSClassPipe,
            NgxExtendedPdfViewerComponent,
            PdfAcroformDefaultThemeComponent,
            PdfBookModeComponent,
            PdfContextMenuComponent,
            PdfDarkThemeComponent,
            PdfDrawEditorComponent,
            PdfAltTextDialogComponent,
            PdfDocumentPropertiesComponent,
            PdfDocumentPropertiesDialogComponent,
            PdfDownloadComponent,
            PdfDummyComponentsComponent,
            PdfEditorComponent,
            PdfErrorMessageComponent,
            PdfEvenSpreadComponent,
            PdfFindbarComponent,
            PdfFindbarMessageContainerComponent,
            PdfFindButtonComponent,
            PdfFindEntireWordComponent,
            PdfFindHighlightAllComponent,
            PdfFindInputAreaComponent,
            PdfFindMatchCaseComponent,
            PdfFindNextComponent,
            PdfFindPreviousComponent,
            PdfFindResultsCountComponent,
            PdfFirstPageComponent,
            PdfHandToolComponent,
            PdfHighlightEditorComponent,
            PdfHorizontalScrollComponent,
            PdfInfiniteScrollComponent,
            PdfLastPageComponent,
            PdfLightThemeComponent,
            PdfMatchDiacriticsComponent,
            PdfNextPageComponent,
            PdfNoSpreadComponent,
            PdfOddSpreadComponent,
            PdfOpenFileComponent,
            PdfPageNumberComponent,
            PdfPagingAreaComponent,
            PdfPasswordDialogComponent,
            PdfPreparePrintingDialogComponent,
            PdfPresentationModeComponent,
            PdfPreviousPageComponent,
            PdfPrintComponent,
            PdfRotatePageComponent,
            PdfRotatePageCwComponent,
            PdfRotatePageCcwComponent,
            PdfSearchInputFieldComponent,
            PdfSecondaryToolbarComponent,
            PdfSelectToolComponent,
            PdfShyButtonComponent,
            PdfSidebarComponent,
            PdfSidebarContentComponent,
            PdfSidebarToolbarComponent,
            PdfSinglePageModeComponent,
            PdfStampEditorComponent,
            PdfTextEditorComponent,
            PdfToggleSecondaryToolbarComponent,
            PdfToggleSidebarComponent,
            PdfToolbarComponent,
            PdfVerticalScrollModeComponent,
            PdfWrappedScrollModeComponent,
            PdfZoomDropdownComponent,
            PdfZoomInComponent,
            PdfZoomOutComponent,
            PdfZoomToolbarComponent,
            ResponsiveCSSClassPipe,
            TranslatePipe], imports: [CommonModule, FormsModule], exports: [NegativeResponsiveCSSClassPipe,
            NgxExtendedPdfViewerComponent,
            PdfAcroformDefaultThemeComponent,
            PdfBookModeComponent,
            PdfContextMenuComponent,
            PdfDarkThemeComponent,
            PdfDrawEditorComponent,
            PdfAltTextDialogComponent,
            PdfDocumentPropertiesDialogComponent,
            PdfDownloadComponent,
            PdfEditorComponent,
            PdfErrorMessageComponent,
            PdfEvenSpreadComponent,
            PdfFindbarComponent,
            PdfFindbarMessageContainerComponent,
            PdfFindButtonComponent,
            PdfFindEntireWordComponent,
            PdfFindHighlightAllComponent,
            PdfFindInputAreaComponent,
            PdfFindMatchCaseComponent,
            PdfFindNextComponent,
            PdfFindPreviousComponent,
            PdfFindResultsCountComponent,
            PdfFirstPageComponent,
            PdfHandToolComponent,
            PdfHighlightEditorComponent,
            PdfHorizontalScrollComponent,
            PdfInfiniteScrollComponent,
            PdfLastPageComponent,
            PdfLightThemeComponent,
            PdfMatchDiacriticsComponent,
            PdfNextPageComponent,
            PdfNoSpreadComponent,
            PdfOddSpreadComponent,
            PdfOpenFileComponent,
            PdfPageNumberComponent,
            PdfPagingAreaComponent,
            PdfPasswordDialogComponent,
            PdfPreparePrintingDialogComponent,
            PdfPresentationModeComponent,
            PdfPreviousPageComponent,
            PdfPrintComponent,
            PdfRotatePageComponent,
            PdfSearchInputFieldComponent,
            PdfSecondaryToolbarComponent,
            PdfSelectToolComponent,
            PdfShyButtonComponent,
            PdfSidebarComponent,
            PdfSidebarContentComponent,
            PdfSidebarToolbarComponent,
            PdfSinglePageModeComponent,
            PdfStampEditorComponent,
            PdfTextEditorComponent,
            PdfToggleSecondaryToolbarComponent,
            PdfToggleSidebarComponent,
            PdfToolbarComponent,
            PdfVerticalScrollModeComponent,
            PdfWrappedScrollModeComponent,
            PdfZoomDropdownComponent,
            PdfZoomInComponent,
            PdfZoomOutComponent,
            PdfZoomToolbarComponent,
            ResponsiveCSSClassPipe] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: NgxExtendedPdfViewerModule, providers: [NgxExtendedPdfViewerService], imports: [CommonModule, FormsModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: NgxExtendedPdfViewerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule],
                    declarations: [
                        DynamicCssComponent,
                        NegativeResponsiveCSSClassPipe,
                        NgxExtendedPdfViewerComponent,
                        PdfAcroformDefaultThemeComponent,
                        PdfBookModeComponent,
                        PdfContextMenuComponent,
                        PdfDarkThemeComponent,
                        PdfDrawEditorComponent,
                        PdfAltTextDialogComponent,
                        PdfDocumentPropertiesComponent,
                        PdfDocumentPropertiesDialogComponent,
                        PdfDownloadComponent,
                        PdfDummyComponentsComponent,
                        PdfEditorComponent,
                        PdfErrorMessageComponent,
                        PdfEvenSpreadComponent,
                        PdfFindbarComponent,
                        PdfFindbarMessageContainerComponent,
                        PdfFindButtonComponent,
                        PdfFindEntireWordComponent,
                        PdfFindHighlightAllComponent,
                        PdfFindInputAreaComponent,
                        PdfFindMatchCaseComponent,
                        PdfFindNextComponent,
                        PdfFindPreviousComponent,
                        PdfFindResultsCountComponent,
                        PdfFirstPageComponent,
                        PdfHandToolComponent,
                        PdfHighlightEditorComponent,
                        PdfHorizontalScrollComponent,
                        PdfInfiniteScrollComponent,
                        PdfLastPageComponent,
                        PdfLightThemeComponent,
                        PdfMatchDiacriticsComponent,
                        PdfNextPageComponent,
                        PdfNoSpreadComponent,
                        PdfOddSpreadComponent,
                        PdfOpenFileComponent,
                        PdfPageNumberComponent,
                        PdfPagingAreaComponent,
                        PdfPasswordDialogComponent,
                        PdfPreparePrintingDialogComponent,
                        PdfPresentationModeComponent,
                        PdfPreviousPageComponent,
                        PdfPrintComponent,
                        PdfRotatePageComponent,
                        PdfRotatePageCwComponent,
                        PdfRotatePageCcwComponent,
                        PdfSearchInputFieldComponent,
                        PdfSecondaryToolbarComponent,
                        PdfSelectToolComponent,
                        PdfShyButtonComponent,
                        PdfSidebarComponent,
                        PdfSidebarContentComponent,
                        PdfSidebarToolbarComponent,
                        PdfSinglePageModeComponent,
                        PdfStampEditorComponent,
                        PdfTextEditorComponent,
                        PdfToggleSecondaryToolbarComponent,
                        PdfToggleSidebarComponent,
                        PdfToolbarComponent,
                        PdfVerticalScrollModeComponent,
                        PdfWrappedScrollModeComponent,
                        PdfZoomDropdownComponent,
                        PdfZoomInComponent,
                        PdfZoomOutComponent,
                        PdfZoomToolbarComponent,
                        ResponsiveCSSClassPipe,
                        TranslatePipe,
                    ],
                    providers: [NgxExtendedPdfViewerService],
                    exports: [
                        NegativeResponsiveCSSClassPipe,
                        NgxExtendedPdfViewerComponent,
                        PdfAcroformDefaultThemeComponent,
                        PdfBookModeComponent,
                        PdfContextMenuComponent,
                        PdfDarkThemeComponent,
                        PdfDrawEditorComponent,
                        PdfAltTextDialogComponent,
                        PdfDocumentPropertiesDialogComponent,
                        PdfDownloadComponent,
                        PdfEditorComponent,
                        PdfErrorMessageComponent,
                        PdfEvenSpreadComponent,
                        PdfFindbarComponent,
                        PdfFindbarMessageContainerComponent,
                        PdfFindButtonComponent,
                        PdfFindEntireWordComponent,
                        PdfFindHighlightAllComponent,
                        PdfFindInputAreaComponent,
                        PdfFindMatchCaseComponent,
                        PdfFindNextComponent,
                        PdfFindPreviousComponent,
                        PdfFindResultsCountComponent,
                        PdfFirstPageComponent,
                        PdfHandToolComponent,
                        PdfHighlightEditorComponent,
                        PdfHorizontalScrollComponent,
                        PdfInfiniteScrollComponent,
                        PdfLastPageComponent,
                        PdfLightThemeComponent,
                        PdfMatchDiacriticsComponent,
                        PdfNextPageComponent,
                        PdfNoSpreadComponent,
                        PdfOddSpreadComponent,
                        PdfOpenFileComponent,
                        PdfPageNumberComponent,
                        PdfPagingAreaComponent,
                        PdfPasswordDialogComponent,
                        PdfPreparePrintingDialogComponent,
                        PdfPresentationModeComponent,
                        PdfPreviousPageComponent,
                        PdfPrintComponent,
                        PdfRotatePageComponent,
                        PdfSearchInputFieldComponent,
                        PdfSecondaryToolbarComponent,
                        PdfSelectToolComponent,
                        PdfShyButtonComponent,
                        PdfSidebarComponent,
                        PdfSidebarContentComponent,
                        PdfSidebarToolbarComponent,
                        PdfSinglePageModeComponent,
                        PdfStampEditorComponent,
                        PdfTextEditorComponent,
                        PdfToggleSecondaryToolbarComponent,
                        PdfToggleSidebarComponent,
                        PdfToolbarComponent,
                        PdfVerticalScrollModeComponent,
                        PdfWrappedScrollModeComponent,
                        PdfZoomDropdownComponent,
                        PdfZoomInComponent,
                        PdfZoomOutComponent,
                        PdfZoomToolbarComponent,
                        ResponsiveCSSClassPipe,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvc3JjL2xpYi9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsaUNBQWlDO0FBQ2pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNwRixPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNoRixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFbkQsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0VBQWdFLENBQUM7QUFDM0csT0FBTyxFQUFFLG9DQUFvQyxFQUFFLE1BQU0sc0ZBQXNGLENBQUM7QUFDNUksT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDdEcsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sZ0VBQWdFLENBQUM7QUFDNUcsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sZ0ZBQWdGLENBQUM7QUFDbkksT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sdURBQXVELENBQUM7QUFDcEcsT0FBTyxFQUFFLDhCQUE4QixFQUFFLHNCQUFzQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDakcsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sMkVBQTJFLENBQUM7QUFDekgsT0FBTyxFQUFF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QkFDckIsbUJBQW1CO3dCQUNuQiwwQkFBMEI7d0JBQzFCLDBCQUEwQjt3QkFDMUIsMEJBQTBCO3dCQUMxQix1QkFBdUI7d0JBQ3ZCLHNCQUFzQjt3QkFDdEIsa0NBQWtDO3dCQUNsQyx5QkFBeUI7d0JBQ3pCLG1CQUFtQjt3QkFDbkIsOEJBQThCO3dCQUM5Qiw2QkFBNkI7d0JBQzdCLHdCQUF3Qjt3QkFDeEIsa0JBQWtCO3dCQUNsQixtQkFBbUI7d0JBQ25CLHVCQUF1Qjt3QkFDdkIsc0JBQXNCO3FCQUN2QjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aFxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IER5bmFtaWNDc3NDb21wb25lbnQgfSBmcm9tICcuL2R5bmFtaWMtY3NzL2R5bmFtaWMtY3NzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hFeHRlbmRlZFBkZlZpZXdlckNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE5neEV4dGVuZGVkUGRmVmlld2VyU2VydmljZSB9IGZyb20gJy4vbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBOZ3hDb25zb2xlIH0gZnJvbSAnLi9vcHRpb25zL25neC1jb25zb2xlJztcbmltcG9ydCB7IElQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnMgfSBmcm9tICcuL29wdGlvbnMvcGRmLXZpZXdlci1hcHBsaWNhdGlvbi1vcHRpb25zJztcbmltcG9ydCB7IFBkZkFsdFRleHREaWFsb2dDb21wb25lbnQgfSBmcm9tICcuL3BkZi1kaWFsb2cvcGRmLWFsdC10ZXh0LWRpYWxvZy9wZGYtYWx0LXRleHQtZGlhbG9nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZEb2N1bWVudFByb3BlcnRpZXNEaWFsb2dDb21wb25lbnQgfSBmcm9tICcuL3BkZi1kaWFsb2cvcGRmLWRvY3VtZW50LXByb3BlcnRpZXMtZGlhbG9nL3BkZi1kb2N1bWVudC1wcm9wZXJ0aWVzLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmRXJyb3JNZXNzYWdlQ29tcG9uZW50IH0gZnJvbSAnLi9wZGYtZGlhbG9nL3BkZi1lcnJvci1tZXNzYWdlL3BkZi1lcnJvci1tZXNzYWdlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZQYXNzd29yZERpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4vcGRmLWRpYWxvZy9wZGYtcGFzc3dvcmQtZGlhbG9nL3BkZi1wYXNzd29yZC1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZlByZXBhcmVQcmludGluZ0RpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4vcGRmLWRpYWxvZy9wZGYtcHJlcGFyZS1wcmludGluZy1kaWFsb2cvcGRmLXByZXBhcmUtcHJpbnRpbmctZGlhbG9nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZEdW1teUNvbXBvbmVudHNDb21wb25lbnQgfSBmcm9tICcuL3BkZi1kdW1teS1jb21wb25lbnRzL3BkZi1kdW1teS1jb21wb25lbnRzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZWdhdGl2ZVJlc3BvbnNpdmVDU1NDbGFzc1BpcGUsIFJlc3BvbnNpdmVDU1NDbGFzc1BpcGUgfSBmcm9tICcuL3Jlc3BvbnNpdmUtdmlzaWJpbGl0eSc7XG5pbXBvcnQgeyBQZGZTZWNvbmRhcnlUb29sYmFyQ29tcG9uZW50IH0gZnJvbSAnLi9zZWNvbmRhcnktdG9vbGJhci9wZGYtc2Vjb25kYXJ5LXRvb2xiYXIvcGRmLXNlY29uZGFyeS10b29sYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZTaWRlYmFyQ29udGVudENvbXBvbmVudCB9IGZyb20gJy4vc2lkZWJhci9wZGYtc2lkZWJhci9wZGYtc2lkZWJhci1jb250ZW50L3BkZi1zaWRlYmFyLWNvbnRlbnQuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZlNpZGViYXJUb29sYmFyQ29tcG9uZW50IH0gZnJvbSAnLi9zaWRlYmFyL3BkZi1zaWRlYmFyL3BkZi1zaWRlYmFyLXRvb2xiYXIvcGRmLXNpZGViYXItdG9vbGJhci5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmU2lkZWJhckNvbXBvbmVudCB9IGZyb20gJy4vc2lkZWJhci9wZGYtc2lkZWJhci9wZGYtc2lkZWJhci5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmQWNyb2Zvcm1EZWZhdWx0VGhlbWVDb21wb25lbnQgfSBmcm9tICcuL3RoZW1lL2Fjcm9mb3JtLWRlZmF1bHQtdGhlbWUvcGRmLWFjcm9mb3JtLWRlZmF1bHQtdGhlbWUuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZkRhcmtUaGVtZUNvbXBvbmVudCB9IGZyb20gJy4vdGhlbWUvcGRmLWRhcmstdGhlbWUvcGRmLWRhcmstdGhlbWUuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZkxpZ2h0VGhlbWVDb21wb25lbnQgfSBmcm9tICcuL3RoZW1lL3BkZi1saWdodC10aGVtZS9wZGYtbGlnaHQtdGhlbWUuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZkJvb2tNb2RlQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi1ib29rLW1vZGUvcGRmLWJvb2stbW9kZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmQ29udGV4dE1lbnVDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLWNvbnRleHQtbWVudS9wZGYtY29udGV4dC1tZW51LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZEb2N1bWVudFByb3BlcnRpZXNDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLWRvY3VtZW50LXByb3BlcnRpZXMvcGRmLWRvY3VtZW50LXByb3BlcnRpZXMuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZkRvd25sb2FkQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi1kb3dubG9hZC9wZGYtZG93bmxvYWQuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZkRyYXdFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLWRyYXctZWRpdG9yL3BkZi1kcmF3LWVkaXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi1lZGl0b3IvcGRmLWVkaXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmRXZlblNwcmVhZENvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9wZGYtZXZlbi1zcHJlYWQvcGRmLWV2ZW4tc3ByZWFkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZGaW5kQnV0dG9uQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi1maW5kLWJ1dHRvbi9wZGYtZmluZC1idXR0b24uY29tcG9uZW50JztcbmltcG9ydCB7IFBkZkZpbmRJbnB1dEFyZWFDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLWZpbmRiYXIvcGRmLWZpbmQtaW5wdXQtYXJlYS9wZGYtZmluZC1pbnB1dC1hcmVhLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZGaW5kTmV4dENvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9wZGYtZmluZGJhci9wZGYtZmluZC1uZXh0L3BkZi1maW5kLW5leHQuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZkZpbmRQcmV2aW91c0NvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9wZGYtZmluZGJhci9wZGYtZmluZC1wcmV2aW91cy9wZGYtZmluZC1wcmV2aW91cy5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmRmluZGJhck1lc3NhZ2VDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLWZpbmRiYXIvcGRmLWZpbmRiYXItbWVzc2FnZS1jb250YWluZXIvcGRmLWZpbmRiYXItbWVzc2FnZS1jb250YWluZXIuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZkZpbmRIaWdobGlnaHRBbGxDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLWZpbmRiYXIvcGRmLWZpbmRiYXItb3B0aW9ucy1vbmUtY29udGFpbmVyL3BkZi1maW5kLWhpZ2hsaWdodC1hbGwvcGRmLWZpbmQtaGlnaGxpZ2h0LWFsbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmRmluZE1hdGNoQ2FzZUNvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9wZGYtZmluZGJhci9wZGYtZmluZGJhci1vcHRpb25zLW9uZS1jb250YWluZXIvcGRmLWZpbmQtbWF0Y2gtY2FzZS9wZGYtZmluZC1tYXRjaC1jYXNlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZGaW5kUmVzdWx0c0NvdW50Q29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi1maW5kYmFyL3BkZi1maW5kYmFyLW9wdGlvbnMtdGhyZWUtY29udGFpbmVyL3BkZi1maW5kLXJlc3VsdHMtY291bnQvcGRmLWZpbmQtcmVzdWx0cy1jb3VudC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmRmluZEVudGlyZVdvcmRDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLWZpbmRiYXIvcGRmLWZpbmRiYXItb3B0aW9ucy10d28tY29udGFpbmVyL3BkZi1maW5kLWVudGlyZS13b3JkL3BkZi1maW5kLWVudGlyZS13b3JkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZNYXRjaERpYWNyaXRpY3NDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLWZpbmRiYXIvcGRmLWZpbmRiYXItb3B0aW9ucy10d28tY29udGFpbmVyL3BkZi1tYXRjaC1kaWFjcml0aWNzL3BkZi1tYXRjaC1kaWFjcml0aWNzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZGaW5kYmFyQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi1maW5kYmFyL3BkZi1maW5kYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZTZWFyY2hJbnB1dEZpZWxkQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi1maW5kYmFyL3BkZi1zZWFyY2gtaW5wdXQtZmllbGQvcGRmLXNlYXJjaC1pbnB1dC1maWVsZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmSGFuZFRvb2xDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLWhhbmQtdG9vbC9wZGYtaGFuZC10b29sLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZIaWdobGlnaHRFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLWhpZ2hsaWdodC1lZGl0b3IvcGRmLWhpZ2hsaWdodC1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZkhvcml6b250YWxTY3JvbGxDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLWhvcml6b250YWwtc2Nyb2xsL3BkZi1ob3Jpem9udGFsLXNjcm9sbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmSW5maW5pdGVTY3JvbGxDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLWluZmluaXRlLXNjcm9sbC9wZGYtaW5maW5pdGUtc2Nyb2xsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZOb1NwcmVhZENvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9wZGYtbm8tc3ByZWFkL3BkZi1uby1zcHJlYWQuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZk9kZFNwcmVhZENvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9wZGYtb2RkLXNwcmVhZC9wZGYtb2RkLXNwcmVhZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmT3BlbkZpbGVDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLW9wZW4tZmlsZS9wZGYtb3Blbi1maWxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZGaXJzdFBhZ2VDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLXBhZ2luZy1hcmVhL3BkZi1maXJzdC1wYWdlL3BkZi1maXJzdC1wYWdlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZMYXN0UGFnZUNvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9wZGYtcGFnaW5nLWFyZWEvcGRmLWxhc3QtcGFnZS9wZGYtbGFzdC1wYWdlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZOZXh0UGFnZUNvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9wZGYtcGFnaW5nLWFyZWEvcGRmLW5leHQtcGFnZS9wZGYtbmV4dC1wYWdlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZQYWdlTnVtYmVyQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi1wYWdpbmctYXJlYS9wZGYtcGFnZS1udW1iZXIvcGRmLXBhZ2UtbnVtYmVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZQYWdpbmdBcmVhQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi1wYWdpbmctYXJlYS9wZGYtcGFnaW5nLWFyZWEuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZlByZXZpb3VzUGFnZUNvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9wZGYtcGFnaW5nLWFyZWEvcGRmLXByZXZpb3VzLXBhZ2UvcGRmLXByZXZpb3VzLXBhZ2UuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZlByZXNlbnRhdGlvbk1vZGVDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLXByZXNlbnRhdGlvbi1tb2RlL3BkZi1wcmVzZW50YXRpb24tbW9kZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmUHJpbnRDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLXByaW50L3BkZi1wcmludC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmUm90YXRlUGFnZUNjd0NvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9wZGYtcm90YXRlLXBhZ2UtY2N3L3BkZi1yb3RhdGUtcGFnZS1jY3cuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZlJvdGF0ZVBhZ2VDd0NvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9wZGYtcm90YXRlLXBhZ2UtY3cvcGRmLXJvdGF0ZS1wYWdlLWN3LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZSb3RhdGVQYWdlQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi1yb3RhdGUtcGFnZS9wZGYtcm90YXRlLXBhZ2UuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZlNlbGVjdFRvb2xDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLXNlbGVjdC10b29sL3BkZi1zZWxlY3QtdG9vbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmU2h5QnV0dG9uQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi1zaHktYnV0dG9uL3BkZi1zaHktYnV0dG9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZTaW5nbGVQYWdlTW9kZUNvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9wZGYtc2luZ2xlLXBhZ2UtbW9kZS9wZGYtc2luZ2xlLXBhZ2UtbW9kZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmU3RhbXBFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLXN0YW1wLWVkaXRvci9wZGYtc3RhbXAtZWRpdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZUZXh0RWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi10ZXh0LWVkaXRvci9wZGYtdGV4dC1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZlRvZ2dsZVNlY29uZGFyeVRvb2xiYXJDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLXRvZ2dsZS1zZWNvbmRhcnktdG9vbGJhci9wZGYtdG9nZ2xlLXNlY29uZGFyeS10b29sYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZUb2dnbGVTaWRlYmFyQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi10b2dnbGUtc2lkZWJhci9wZGYtdG9nZ2xlLXNpZGViYXIuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZlRvb2xiYXJDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLXRvb2xiYXIvcGRmLXRvb2xiYXIuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZlZlcnRpY2FsU2Nyb2xsTW9kZUNvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9wZGYtdmVydGljYWwtc2Nyb2xsLWJ1dHRvbi9wZGYtdmVydGljYWwtc2Nyb2xsLW1vZGUuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZldyYXBwZWRTY3JvbGxNb2RlQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi13cmFwcGVkLXNjcm9sbC1tb2RlL3BkZi13cmFwcGVkLXNjcm9sbC1tb2RlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZab29tRHJvcGRvd25Db21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLXpvb20tdG9vbGJhci9wZGYtem9vbS1kcm9wZG93bi9wZGYtem9vbS1kcm9wZG93bi5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmWm9vbUluQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL3BkZi16b29tLXRvb2xiYXIvcGRmLXpvb20taW4vcGRmLXpvb20taW4uY29tcG9uZW50JztcbmltcG9ydCB7IFBkZlpvb21PdXRDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIvcGRmLXpvb20tdG9vbGJhci9wZGYtem9vbS1vdXQvcGRmLXpvb20tb3V0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZab29tVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9wZGYtem9vbS10b29sYmFyL3BkZi16b29tLXRvb2xiYXIuY29tcG9uZW50JztcbmltcG9ydCB7IFRyYW5zbGF0ZVBpcGUgfSBmcm9tICcuL3RyYW5zbGF0ZS5waXBlJztcblxuaWYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpID09PSAwKSB7XG4gIG5ldyBOZ3hDb25zb2xlKCkubG9nKCcnKTtcbn1cblxuaWYgKCFQcm9taXNlWydhbGxTZXR0bGVkJ10pIHtcbiAgaWYgKCEhd2luZG93Wydab25lJ10gJiYgIXdpbmRvd1snX196b25lX3N5bWJvbF9fUHJvbWlzZS5hbGxTZXR0bGVkJ10pIHtcbiAgICBjb25zb2xlLmVycm9yKFxuICAgICAgXCJQbGVhc2UgdXBkYXRlIHpvbmUuanMgdG8gdmVyc2lvbiAwLjEwLjMgb3IgaGlnaGVyLiBPdGhlcndpc2UsIHlvdSdsbCBydW4gdGhlIHNsb3cgRUNNQVNjcmlwdCA1IHZlcnNpb24gZXZlbiBvbiBtb2Rlcm4gYnJvd3NlciB0aGF0IGNhbiBydW4gdGhlIGZhc3QgRVNNQVNjcmlwdCAyMDE1IHZlcnNpb24uXCJcbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzS2V5SWdub3JlZChjbWQ6IG51bWJlciwga2V5Y29kZTogbnVtYmVyIHwgJ1dIRUVMJyk6IGJvb2xlYW4ge1xuICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnM6IElQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnMgPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb25PcHRpb25zO1xuXG4gIGNvbnN0IGlnbm9yZUtleXM6IEFycmF5PHN0cmluZz4gPSBQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnMuZ2V0KCdpZ25vcmVLZXlzJyk7XG4gIGNvbnN0IGFjY2VwdEtleXM6IEFycmF5PHN0cmluZz4gPSBQREZWaWV3ZXJBcHBsaWNhdGlvbk9wdGlvbnMuZ2V0KCdhY2NlcHRLZXlzJyk7XG4gIGlmIChrZXljb2RlID09PSAnV0hFRUwnKSB7XG4gICAgaWYgKCEhaWdub3JlS2V5cyAmJiBpc0tleUluTGlzdChpZ25vcmVLZXlzLCBjbWQsICdXSEVFTCcpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCEhYWNjZXB0S2V5cyAmJiBhY2NlcHRLZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiAhaXNLZXlJbkxpc3QoYWNjZXB0S2V5cywgY21kLCAnV0hFRUwnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoa2V5Y29kZSA9PT0gMTYgfHwga2V5Y29kZSA9PT0gMTcgfHwga2V5Y29kZSA9PT0gMTggfHwga2V5Y29kZSA9PT0gMjI0KSB7XG4gICAgLy8gaWdub3JlIHNvbGl0YXJ5IFNISUZULCBBTFQsIENNRCwgYW5kIENUUkwgYmVjYXVzZSB0aGV5IG9ubHkgbWFrZSBzZW5zZSBhcyB0d28ta2V5LWNvbWJpbmF0aW9uc1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIC8vIGNtZCBpcyBhIGJpdC1hcnJheTpcbiAgLy8gMSA9PSBDVFJMXG4gIC8vIDIgPT0gQUxUXG4gIC8vIDQgPT0gU0hJRlRcbiAgLy8gOCA9PSBNRVRBXG4gIGNvbnN0IGlnbm9yZUtleWJvYXJkID0gUERGVmlld2VyQXBwbGljYXRpb25PcHRpb25zLmdldCgnaWdub3JlS2V5Ym9hcmQnKTtcbiAgaWYgKCEhaWdub3JlS2V5Ym9hcmQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICghIWlnbm9yZUtleXMgJiYgaWdub3JlS2V5cy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKGlzS2V5SW5MaXN0KGlnbm9yZUtleXMsIGNtZCwga2V5Y29kZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghIWFjY2VwdEtleXMgJiYgYWNjZXB0S2V5cy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuICFpc0tleUluTGlzdChhY2NlcHRLZXlzLCBjbWQsIGtleWNvZGUpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNLZXlJbkxpc3Qoc2V0dGluZ3M6IEFycmF5PHN0cmluZz4sIGNtZDogbnVtYmVyLCBrZXljb2RlOiBudW1iZXIgfCAnV0hFRUwnKTogYm9vbGVhbiB7XG4gIGlmICghc2V0dGluZ3MpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gc2V0dGluZ3Muc29tZSgoa2V5RGVmKSA9PiBpc0tleShrZXlEZWYsIGNtZCwga2V5Y29kZSkpO1xufVxuXG5mdW5jdGlvbiBpc0tleShrZXlEZWY6IHN0cmluZywgY21kOiBudW1iZXIsIGtleWNvZGU6IG51bWJlciB8ICdXSEVFTCcpOiBib29sZWFuIHtcbiAgbGV0IGNtZERlZiA9IDA7XG4gIGxldCBrZXkgPSAwO1xuICBrZXlEZWYgPSBrZXlEZWYudG9Mb3dlckNhc2UoKTtcbiAgLy8gdHNsaW50OmRpc2FibGU6IG5vLWJpdHdpc2VcbiAgaWYgKGtleURlZi5pbmNsdWRlcygnY3RybCsnKSkge1xuICAgIGNtZERlZiB8PSAxO1xuICAgIGtleURlZiA9IGtleURlZi5yZXBsYWNlKCdjdHJsKycsICcnKTtcbiAgfVxuICBpZiAoa2V5RGVmLmluY2x1ZGVzKCdjbWQrJykpIHtcbiAgICBjbWREZWYgfD0gODtcbiAgICBrZXlEZWYgPSBrZXlEZWYucmVwbGFjZSgnY21kKycsICcnKTtcbiAgfVxuICBpZiAoa2V5RGVmLmluY2x1ZGVzKCdhbHQrJykpIHtcbiAgICBjbWREZWYgfD0gMjtcbiAgICBrZXlEZWYgPSBrZXlEZWYucmVwbGFjZSgnYWx0KycsICcnKTtcbiAgfVxuICBpZiAoa2V5RGVmLmluY2x1ZGVzKCdzaGlmdCsnKSkge1xuICAgIGNtZERlZiB8PSA0O1xuICAgIGtleURlZiA9IGtleURlZi5yZXBsYWNlKCdzaGlmdCsnLCAnJyk7XG4gIH1cbiAgaWYgKGtleURlZi5pbmNsdWRlcygnbWV0YSsnKSkge1xuICAgIGNtZERlZiB8PSA4O1xuICAgIGtleURlZiA9IGtleURlZi5yZXBsYWNlKCdtZXRhKycsICcnKTtcbiAgfVxuXG4gIGlmIChrZXlEZWYgPT09ICd1cCcpIHtcbiAgICBrZXkgPSAzODtcbiAgfSBlbHNlIGlmIChrZXlEZWYgPT09ICdkb3duJykge1xuICAgIGtleSA9IDQwO1xuICB9IGVsc2UgaWYgKGtleURlZiA9PT0gJysnIHx8IGtleURlZiA9PT0gJ1wiK1wiJykge1xuICAgIGtleSA9IDE3MTtcbiAgfSBlbHNlIGlmIChrZXlEZWYgPT09ICctJyB8fCBrZXlEZWYgPT09ICdcIi1cIicpIHtcbiAgICBrZXkgPSAxNzM7XG4gIH0gZWxzZSBpZiAoa2V5RGVmID09PSAnZXNjJykge1xuICAgIGtleSA9IDI3O1xuICB9IGVsc2UgaWYgKGtleURlZiA9PT0gJ2VudGVyJykge1xuICAgIGtleSA9IDEzO1xuICB9IGVsc2UgaWYgKGtleURlZiA9PT0gJ3NwYWNlJykge1xuICAgIGtleSA9IDMyO1xuICB9IGVsc2UgaWYgKGtleURlZiA9PT0gJ2Y0Jykge1xuICAgIGtleSA9IDExNTtcbiAgfSBlbHNlIGlmIChrZXlEZWYgPT09ICdiYWNrc3BhY2UnKSB7XG4gICAga2V5ID0gODtcbiAgfSBlbHNlIGlmIChrZXlEZWYgPT09ICdob21lJykge1xuICAgIGtleSA9IDM2O1xuICB9IGVsc2UgaWYgKGtleURlZiA9PT0gJ2VuZCcpIHtcbiAgICBrZXkgPSAzNTtcbiAgfSBlbHNlIGlmIChrZXlEZWYgPT09ICdsZWZ0Jykge1xuICAgIGtleSA9IDM3O1xuICB9IGVsc2UgaWYgKGtleURlZiA9PT0gJ3JpZ2h0Jykge1xuICAgIGtleSA9IDM5O1xuICB9IGVsc2UgaWYgKGtleURlZiA9PT0gJ3BhZ2Vkb3duJykge1xuICAgIGtleSA9IDM0O1xuICB9IGVsc2UgaWYgKGtleURlZiA9PT0gJ3BhZ2V1cCcpIHtcbiAgICBrZXkgPSAzMztcbiAgfSBlbHNlIHtcbiAgICBrZXkgPSBrZXlEZWYudG9VcHBlckNhc2UoKS5jaGFyQ29kZUF0KDApO1xuICB9XG4gIGlmIChrZXljb2RlID09PSAnV0hFRUwnKSB7XG4gICAgcmV0dXJuIGtleURlZiA9PT0gJ3doZWVsJyAmJiBjbWQgPT09IGNtZERlZjtcbiAgfVxuICByZXR1cm4ga2V5ID09PSBrZXljb2RlICYmIGNtZCA9PT0gY21kRGVmO1xufVxuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgKHdpbmRvdyBhcyBhbnkpLmlzS2V5SWdub3JlZCA9IGlzS2V5SWdub3JlZDtcbn1cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBEeW5hbWljQ3NzQ29tcG9uZW50LFxuICAgIE5lZ2F0aXZlUmVzcG9uc2l2ZUNTU0NsYXNzUGlwZSxcbiAgICBOZ3hFeHRlbmRlZFBkZlZpZXdlckNvbXBvbmVudCxcbiAgICBQZGZBY3JvZm9ybURlZmF1bHRUaGVtZUNvbXBvbmVudCxcbiAgICBQZGZCb29rTW9kZUNvbXBvbmVudCxcbiAgICBQZGZDb250ZXh0TWVudUNvbXBvbmVudCxcbiAgICBQZGZEYXJrVGhlbWVDb21wb25lbnQsXG4gICAgUGRmRHJhd0VkaXRvckNvbXBvbmVudCxcbiAgICBQZGZBbHRUZXh0RGlhbG9nQ29tcG9uZW50LFxuICAgIFBkZkRvY3VtZW50UHJvcGVydGllc0NvbXBvbmVudCxcbiAgICBQZGZEb2N1bWVudFByb3BlcnRpZXNEaWFsb2dDb21wb25lbnQsXG4gICAgUGRmRG93bmxvYWRDb21wb25lbnQsXG4gICAgUGRmRHVtbXlDb21wb25lbnRzQ29tcG9uZW50LFxuICAgIFBkZkVkaXRvckNvbXBvbmVudCxcbiAgICBQZGZFcnJvck1lc3NhZ2VDb21wb25lbnQsXG4gICAgUGRmRXZlblNwcmVhZENvbXBvbmVudCxcbiAgICBQZGZGaW5kYmFyQ29tcG9uZW50LFxuICAgIFBkZkZpbmRiYXJNZXNzYWdlQ29udGFpbmVyQ29tcG9uZW50LFxuICAgIFBkZkZpbmRCdXR0b25Db21wb25lbnQsXG4gICAgUGRmRmluZEVudGlyZVdvcmRDb21wb25lbnQsXG4gICAgUGRmRmluZEhpZ2hsaWdodEFsbENvbXBvbmVudCxcbiAgICBQZGZGaW5kSW5wdXRBcmVhQ29tcG9uZW50LFxuICAgIFBkZkZpbmRNYXRjaENhc2VDb21wb25lbnQsXG4gICAgUGRmRmluZE5leHRDb21wb25lbnQsXG4gICAgUGRmRmluZFByZXZpb3VzQ29tcG9uZW50LFxuICAgIFBkZkZpbmRSZXN1bHRzQ291bnRDb21wb25lbnQsXG4gICAgUGRmRmlyc3RQYWdlQ29tcG9uZW50LFxuICAgIFBkZkhhbmRUb29sQ29tcG9uZW50LFxuICAgIFBkZkhpZ2hsaWdodEVkaXRvckNvbXBvbmVudCxcbiAgICBQZGZIb3Jpem9udGFsU2Nyb2xsQ29tcG9uZW50LFxuICAgIFBkZkluZmluaXRlU2Nyb2xsQ29tcG9uZW50LFxuICAgIFBkZkxhc3RQYWdlQ29tcG9uZW50LFxuICAgIFBkZkxpZ2h0VGhlbWVDb21wb25lbnQsXG4gICAgUGRmTWF0Y2hEaWFjcml0aWNzQ29tcG9uZW50LFxuICAgIFBkZk5leHRQYWdlQ29tcG9uZW50LFxuICAgIFBkZk5vU3ByZWFkQ29tcG9uZW50LFxuICAgIFBkZk9kZFNwcmVhZENvbXBvbmVudCxcbiAgICBQZGZPcGVuRmlsZUNvbXBvbmVudCxcbiAgICBQZGZQYWdlTnVtYmVyQ29tcG9uZW50LFxuICAgIFBkZlBhZ2luZ0FyZWFDb21wb25lbnQsXG4gICAgUGRmUGFzc3dvcmREaWFsb2dDb21wb25lbnQsXG4gICAgUGRmUHJlcGFyZVByaW50aW5nRGlhbG9nQ29tcG9uZW50LFxuICAgIFBkZlByZXNlbnRhdGlvbk1vZGVDb21wb25lbnQsXG4gICAgUGRmUHJldmlvdXNQYWdlQ29tcG9uZW50LFxuICAgIFBkZlByaW50Q29tcG9uZW50LFxuICAgIFBkZlJvdGF0ZVBhZ2VDb21wb25lbnQsXG4gICAgUGRmUm90YXRlUGFnZUN3Q29tcG9uZW50LFxuICAgIFBkZlJvdGF0ZVBhZ2VDY3dDb21wb25lbnQsXG4gICAgUGRmU2VhcmNoSW5wdXRGaWVsZENvbXBvbmVudCxcbiAgICBQZGZTZWNvbmRhcnlUb29sYmFyQ29tcG9uZW50LFxuICAgIFBkZlNlbGVjdFRvb2xDb21wb25lbnQsXG4gICAgUGRmU2h5QnV0dG9uQ29tcG9uZW50LFxuICAgIFBkZlNpZGViYXJDb21wb25lbnQsXG4gICAgUGRmU2lkZWJhckNvbnRlbnRDb21wb25lbnQsXG4gICAgUGRmU2lkZWJhclRvb2xiYXJDb21wb25lbnQsXG4gICAgUGRmU2luZ2xlUGFnZU1vZGVDb21wb25lbnQsXG4gICAgUGRmU3RhbXBFZGl0b3JDb21wb25lbnQsXG4gICAgUGRmVGV4dEVkaXRvckNvbXBvbmVudCxcbiAgICBQZGZUb2dnbGVTZWNvbmRhcnlUb29sYmFyQ29tcG9uZW50LFxuICAgIFBkZlRvZ2dsZVNpZGViYXJDb21wb25lbnQsXG4gICAgUGRmVG9vbGJhckNvbXBvbmVudCxcbiAgICBQZGZWZXJ0aWNhbFNjcm9sbE1vZGVDb21wb25lbnQsXG4gICAgUGRmV3JhcHBlZFNjcm9sbE1vZGVDb21wb25lbnQsXG4gICAgUGRmWm9vbURyb3Bkb3duQ29tcG9uZW50LFxuICAgIFBkZlpvb21JbkNvbXBvbmVudCxcbiAgICBQZGZab29tT3V0Q29tcG9uZW50LFxuICAgIFBkZlpvb21Ub29sYmFyQ29tcG9uZW50LFxuICAgIFJlc3BvbnNpdmVDU1NDbGFzc1BpcGUsXG4gICAgVHJhbnNsYXRlUGlwZSxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbTmd4RXh0ZW5kZWRQZGZWaWV3ZXJTZXJ2aWNlXSxcbiAgZXhwb3J0czogW1xuICAgIE5lZ2F0aXZlUmVzcG9uc2l2ZUNTU0NsYXNzUGlwZSxcbiAgICBOZ3hFeHRlbmRlZFBkZlZpZXdlckNvbXBvbmVudCxcbiAgICBQZGZBY3JvZm9ybURlZmF1bHRUaGVtZUNvbXBvbmVudCxcbiAgICBQZGZCb29rTW9kZUNvbXBvbmVudCxcbiAgICBQZGZDb250ZXh0TWVudUNvbXBvbmVudCxcbiAgICBQZGZEYXJrVGhlbWVDb21wb25lbnQsXG4gICAgUGRmRHJhd0VkaXRvckNvbXBvbmVudCxcbiAgICBQZGZBbHRUZXh0RGlhbG9nQ29tcG9uZW50LFxuICAgIFBkZkRvY3VtZW50UHJvcGVydGllc0RpYWxvZ0NvbXBvbmVudCxcbiAgICBQZGZEb3dubG9hZENvbXBvbmVudCxcbiAgICBQZGZFZGl0b3JDb21wb25lbnQsXG4gICAgUGRmRXJyb3JNZXNzYWdlQ29tcG9uZW50LFxuICAgIFBkZkV2ZW5TcHJlYWRDb21wb25lbnQsXG4gICAgUGRmRmluZGJhckNvbXBvbmVudCxcbiAgICBQZGZGaW5kYmFyTWVzc2FnZUNvbnRhaW5lckNvbXBvbmVudCxcbiAgICBQZGZGaW5kQnV0dG9uQ29tcG9uZW50LFxuICAgIFBkZkZpbmRFbnRpcmVXb3JkQ29tcG9uZW50LFxuICAgIFBkZkZpbmRIaWdobGlnaHRBbGxDb21wb25lbnQsXG4gICAgUGRmRmluZElucHV0QXJlYUNvbXBvbmVudCxcbiAgICBQZGZGaW5kTWF0Y2hDYXNlQ29tcG9uZW50LFxuICAgIFBkZkZpbmROZXh0Q29tcG9uZW50LFxuICAgIFBkZkZpbmRQcmV2aW91c0NvbXBvbmVudCxcbiAgICBQZGZGaW5kUmVzdWx0c0NvdW50Q29tcG9uZW50LFxuICAgIFBkZkZpcnN0UGFnZUNvbXBvbmVudCxcbiAgICBQZGZIYW5kVG9vbENvbXBvbmVudCxcbiAgICBQZGZIaWdobGlnaHRFZGl0b3JDb21wb25lbnQsXG4gICAgUGRmSG9yaXpvbnRhbFNjcm9sbENvbXBvbmVudCxcbiAgICBQZGZJbmZpbml0ZVNjcm9sbENvbXBvbmVudCxcbiAgICBQZGZMYXN0UGFnZUNvbXBvbmVudCxcbiAgICBQZGZMaWdodFRoZW1lQ29tcG9uZW50LFxuICAgIFBkZk1hdGNoRGlhY3JpdGljc0NvbXBvbmVudCxcbiAgICBQZGZOZXh0UGFnZUNvbXBvbmVudCxcbiAgICBQZGZOb1NwcmVhZENvbXBvbmVudCxcbiAgICBQZGZPZGRTcHJlYWRDb21wb25lbnQsXG4gICAgUGRmT3BlbkZpbGVDb21wb25lbnQsXG4gICAgUGRmUGFnZU51bWJlckNvbXBvbmVudCxcbiAgICBQZGZQYWdpbmdBcmVhQ29tcG9uZW50LFxuICAgIFBkZlBhc3N3b3JkRGlhbG9nQ29tcG9uZW50LFxuICAgIFBkZlByZXBhcmVQcmludGluZ0RpYWxvZ0NvbXBvbmVudCxcbiAgICBQZGZQcmVzZW50YXRpb25Nb2RlQ29tcG9uZW50LFxuICAgIFBkZlByZXZpb3VzUGFnZUNvbXBvbmVudCxcbiAgICBQZGZQcmludENvbXBvbmVudCxcbiAgICBQZGZSb3RhdGVQYWdlQ29tcG9uZW50LFxuICAgIFBkZlNlYXJjaElucHV0RmllbGRDb21wb25lbnQsXG4gICAgUGRmU2Vjb25kYXJ5VG9vbGJhckNvbXBvbmVudCxcbiAgICBQZGZTZWxlY3RUb29sQ29tcG9uZW50LFxuICAgIFBkZlNoeUJ1dHRvbkNvbXBvbmVudCxcbiAgICBQZGZTaWRlYmFyQ29tcG9uZW50LFxuICAgIFBkZlNpZGViYXJDb250ZW50Q29tcG9uZW50LFxuICAgIFBkZlNpZGViYXJUb29sYmFyQ29tcG9uZW50LFxuICAgIFBkZlNpbmdsZVBhZ2VNb2RlQ29tcG9uZW50LFxuICAgIFBkZlN0YW1wRWRpdG9yQ29tcG9uZW50LFxuICAgIFBkZlRleHRFZGl0b3JDb21wb25lbnQsXG4gICAgUGRmVG9nZ2xlU2Vjb25kYXJ5VG9vbGJhckNvbXBvbmVudCxcbiAgICBQZGZUb2dnbGVTaWRlYmFyQ29tcG9uZW50LFxuICAgIFBkZlRvb2xiYXJDb21wb25lbnQsXG4gICAgUGRmVmVydGljYWxTY3JvbGxNb2RlQ29tcG9uZW50LFxuICAgIFBkZldyYXBwZWRTY3JvbGxNb2RlQ29tcG9uZW50LFxuICAgIFBkZlpvb21Ecm9wZG93bkNvbXBvbmVudCxcbiAgICBQZGZab29tSW5Db21wb25lbnQsXG4gICAgUGRmWm9vbU91dENvbXBvbmVudCxcbiAgICBQZGZab29tVG9vbGJhckNvbXBvbmVudCxcbiAgICBSZXNwb25zaXZlQ1NTQ2xhc3NQaXBlLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hFeHRlbmRlZFBkZlZpZXdlck1vZHVsZSB7fVxuIl19