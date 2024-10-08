import { AnnotationEditorTypeValue } from '../options/editor-annotations';
import { PDFPageView } from '../options/pdf_page_view';
export interface AnnotationEditorEditorModeChangedEvent {
    source: PDFPageView;
    mode: AnnotationEditorTypeValue;
}
