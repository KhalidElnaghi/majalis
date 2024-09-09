import { EventEmitter } from '@angular/core';
export class NgxFormSupport {
    /** Maps the internal ids of the annotations of pdf.js to their field name */
    formIdToFullFieldName = {};
    formIdToField = {};
    radioButtons = {};
    formData = {};
    initialFormDataStoredInThePDF = {};
    formDataChange = new EventEmitter();
    ngZone;
    reset() {
        this.formData = {};
        this.formIdToFullFieldName = {};
    }
    registerFormSupportWithPdfjs(ngZone) {
        this.ngZone = ngZone;
        globalThis.getFormValueFromAngular = (key) => this.getFormValueFromAngular(key);
        globalThis.updateAngularFormValue = (key, value) => this.updateAngularFormValueCalledByPdfjs(key, value);
        globalThis.registerAcroformField = (id, element, value, radioButtonValueName, initialValueFromPDF) => this.registerAcroformField(id, element, value, radioButtonValueName, initialValueFromPDF);
        globalThis.registerXFAField = (element, value, initialValueFromPDF) => this.registerXFAField(element, value, initialValueFromPDF);
    }
    registerAcroformField(id, element, value, radioButtonValueName, initialFormValueFromPDF) {
        const fieldName = element.name;
        this.formIdToField[id] = element;
        this.formIdToFullFieldName[id] = fieldName;
        if (element instanceof HTMLInputElement && element.type === 'radio') {
            const groupName = fieldName;
            this.formIdToFullFieldName[id] = groupName;
            if (value) {
                this.formData[groupName] = radioButtonValueName;
                this.initialFormDataStoredInThePDF[groupName] = initialFormValueFromPDF;
            }
            element.setAttribute('exportValue', radioButtonValueName);
            if (!this.radioButtons[groupName]) {
                this.radioButtons[groupName] = [];
            }
            this.radioButtons[groupName].push(element);
        }
        else if (element instanceof HTMLSelectElement) {
            this.formData[fieldName] = this.getValueOfASelectField(element);
            this.initialFormDataStoredInThePDF[fieldName] = initialFormValueFromPDF;
        }
        else {
            if (value !== undefined) {
                this.formData[fieldName] = value;
            }
            this.initialFormDataStoredInThePDF[fieldName] = initialFormValueFromPDF;
        }
    }
    registerXFAField(element, value, initialFormValueFromPDF) {
        const fullFieldName = this.findFullXFAName(element);
        if (element instanceof HTMLInputElement && element.type === 'radio') {
            const id = element.getAttribute('fieldid') ?? '';
            // remove the xfa name of the radio button itself form the field name,
            // because the field name refers to the entire group of relatated radio buttons
            const groupName = fullFieldName.substring(0, fullFieldName.lastIndexOf('.'));
            this.formIdToFullFieldName[id] = groupName;
            this.formData[groupName] = value?.value;
            this.initialFormDataStoredInThePDF[groupName] = initialFormValueFromPDF;
            if (!this.radioButtons[groupName]) {
                this.radioButtons[groupName] = [];
            }
            this.radioButtons[groupName].push(element);
        }
        else if (element instanceof HTMLInputElement) {
            const id = element.getAttribute('fieldid') ?? '';
            this.formIdToField[id] = element;
            this.formIdToFullFieldName[id] = fullFieldName;
            this.formData[fullFieldName] = value?.value;
            this.initialFormDataStoredInThePDF[fullFieldName] = initialFormValueFromPDF;
        }
        else if (element instanceof HTMLSelectElement) {
            const id = element.getAttribute('fieldid') ?? '';
            this.formIdToField[id] = element;
            this.formIdToFullFieldName[id] = fullFieldName;
            this.formData[fullFieldName] = value?.value;
            this.initialFormDataStoredInThePDF[fullFieldName] = initialFormValueFromPDF;
        }
        else if (element instanceof HTMLTextAreaElement) {
            const id = element.getAttribute('fieldid') ?? '';
            this.formIdToField[id] = element;
            this.formIdToFullFieldName[id] = fullFieldName;
            this.formData[fullFieldName] = value?.value;
            this.initialFormDataStoredInThePDF[fullFieldName] = initialFormValueFromPDF;
        }
        else {
            console.error("Couldn't register an XFA form field", element);
        }
    }
    getValueOfASelectField(selectElement) {
        const { options, multiple } = selectElement;
        if (!multiple) {
            return options.selectedIndex === -1 ? null : options[options.selectedIndex]['value'];
        }
        return Array.prototype.filter.call(options, (option) => option.selected).map((option) => option['value']);
    }
    getFormValueFromAngular(element) {
        let key;
        if (element instanceof HTMLElement) {
            const fieldName = this.findXFAName(element);
            if (fieldName) {
                if (this.formData.hasOwnProperty(fieldName)) {
                    key = fieldName;
                }
                else {
                    key = this.findFullXFAName(element);
                }
            }
            else {
                console.error("Couldn't find the field name or XFA name of the form field", element);
                return { value: null };
            }
        }
        else {
            key = element;
        }
        return { value: this.formData[key] };
    }
    findXFAName(element) {
        let parentElement = element;
        while (!parentElement.getAttribute('xfaname') && parentElement.parentElement) {
            parentElement = parentElement.parentElement;
        }
        if (element instanceof HTMLInputElement && element.type === 'radio') {
            do {
                parentElement = parentElement?.parentElement;
            } while (!parentElement?.getAttribute('xfaname') && parentElement);
        }
        let fieldName = parentElement?.getAttribute('xfaname');
        if (!fieldName) {
            throw new Error("Couldn't find the xfaname of the field");
        }
        return fieldName;
    }
    findFullXFAName(element) {
        let parentElement = element;
        let fieldName = '';
        while (parentElement instanceof HTMLElement && parentElement.parentElement) {
            const xfaName = parentElement.getAttribute('xfaname');
            if (xfaName) {
                fieldName = xfaName + '.' + fieldName;
            }
            parentElement = parentElement.parentElement;
        }
        if (!fieldName) {
            throw new Error("Couldn't find the xfaname of the field");
        }
        fieldName = fieldName.substring(0, fieldName.length - 1);
        if (element instanceof HTMLInputElement && element.type === 'radio') {
            // ignore the last part of the xfaName because it's actually the value of the field
            return fieldName.substring(0, fieldName.lastIndexOf('.'));
        }
        return fieldName;
    }
    updateAngularFormValueCalledByPdfjs(key, value) {
        if (!this.formData) {
            this.formData = {};
        }
        if (typeof key === 'string') {
            const acroFormKey = this.formIdToFullFieldName[key];
            const fullKey = acroFormKey ?? Object.values(this.formIdToFullFieldName).find((k) => k === key || k.endsWith('.' + key));
            if (fullKey) {
                const field = this.formIdToField[key];
                let change = this.doUpdateAngularFormValue(field, value, fullKey);
                if (change) {
                    this.ngZone.run(() => this.formDataChange.emit(this.formData));
                }
            }
            else {
                console.error("Couldn't find the field with the name " + key);
            }
        }
        else {
            let change = false;
            const shortFieldName = this.findXFAName(key);
            if (this.formData.hasOwnProperty(shortFieldName)) {
                change = this.doUpdateAngularFormValue(key, value, shortFieldName);
            }
            const fullFieldName = this.findFullXFAName(key);
            if (fullFieldName !== shortFieldName) {
                change ||= this.doUpdateAngularFormValue(key, value, fullFieldName);
            }
            if (change) {
                this.ngZone.run(() => this.formDataChange.emit(this.formData));
            }
        }
    }
    doUpdateAngularFormValue(field, value, fullKey) {
        let change = false;
        if (field instanceof HTMLInputElement && field.type === 'checkbox') {
            const exportValue = field.getAttribute('exportvalue');
            if (exportValue) {
                if (value.value) {
                    if (this.formData[fullKey] !== exportValue) {
                        this.formData[fullKey] = exportValue;
                        change = true;
                    }
                }
                else {
                    if (this.formData[fullKey] !== false) {
                        this.formData[fullKey] = false;
                        change = true;
                    }
                }
            }
            else {
                if (this.formData[fullKey] !== value.value) {
                    this.formData[fullKey] = value.value;
                    change = true;
                }
            }
        }
        else if (field instanceof HTMLInputElement && field.type === 'radio') {
            const exportValue = field.getAttribute('exportvalue') ?? field.getAttribute('xfaon');
            if (value.value) {
                if (this.formData[fullKey] !== exportValue) {
                    this.formData[fullKey] = exportValue;
                    change = true;
                }
            }
        }
        else {
            if (this.formData[fullKey] !== value.value) {
                this.formData[fullKey] = value.value;
                change = true;
            }
        }
        return change;
    }
    updateFormFieldsInPdfCalledByNgOnChanges(previousFormData) {
        const PDFViewerApplication = window.PDFViewerApplication;
        if (!PDFViewerApplication?.pdfDocument?.annotationStorage) {
            // ngOnChanges calls this method too early - so just ignore it
            return;
        }
        for (const key in this.formData) {
            if (this.formData.hasOwnProperty(key)) {
                const newValue = this.formData[key];
                if (newValue !== previousFormData[key]) {
                    this.setFieldValueAndUpdateAnnotationStorage(key, newValue);
                }
            }
        }
        for (const key in previousFormData) {
            if (previousFormData.hasOwnProperty(key) && previousFormData[key]) {
                let hasPreviousValue = this.formData.hasOwnProperty(key);
                if (!hasPreviousValue) {
                    const fullKey = Object.keys(this.formData).find((k) => k === key || k.endsWith('.' + key));
                    if (fullKey) {
                        hasPreviousValue = this.formData.hasOwnProperty(fullKey);
                    }
                }
                if (!hasPreviousValue) {
                    this.setFieldValueAndUpdateAnnotationStorage(key, null);
                }
            }
        }
    }
    setFieldValueAndUpdateAnnotationStorage(key, newValue) {
        const radios = this.findRadioButtonGroup(key);
        if (radios) {
            radios.forEach((r) => {
                const activeValue = r.getAttribute('exportValue') ?? r.getAttribute('xfaon');
                r.checked = activeValue === newValue;
            });
            const updateFromAngular = new CustomEvent('updateFromAngular', {
                detail: newValue,
            });
            radios[0].dispatchEvent(updateFromAngular);
        }
        else {
            const fieldId = this.findFormIdFromFieldName(key);
            if (fieldId) {
                const htmlField = this.formIdToField[fieldId];
                if (htmlField) {
                    if (htmlField instanceof HTMLInputElement && htmlField.type === 'checkbox') {
                        let activeValue = htmlField.getAttribute('xfaon') ?? htmlField.getAttribute('exportvalue') ?? true;
                        if (newValue === true || newValue === false) {
                            activeValue = true;
                        }
                        htmlField.checked = activeValue === newValue;
                    }
                    else if (htmlField instanceof HTMLSelectElement) {
                        this.populateSelectField(htmlField, newValue);
                    }
                    else {
                        // textareas and input fields
                        htmlField.value = newValue;
                    }
                    const updateFromAngular = new CustomEvent('updateFromAngular', {
                        detail: newValue,
                    });
                    htmlField.dispatchEvent(updateFromAngular);
                }
                else {
                    console.error("Couldn't set the value of the field", key);
                }
            }
        }
    }
    populateSelectField(htmlField, newValue) {
        if (htmlField.multiple) {
            const { options } = htmlField;
            const newValueArray = newValue;
            for (let i = 0; i < options.length; i++) {
                const option = options.item(i);
                if (option) {
                    option.selected = newValueArray.some((o) => o === option.value);
                }
            }
        }
        else {
            htmlField.value = newValue;
        }
    }
    findFormIdFromFieldName(fieldName) {
        if (Object.entries(this.formIdToFullFieldName).length === 0) {
            // sometimes, ngOnChanges() is called before initializing the PDF file
            return undefined;
        }
        const matchingEntries = Object.entries(this.formIdToFullFieldName).filter((entry) => entry[1] === fieldName || entry[1].endsWith('.' + fieldName));
        if (matchingEntries.length > 1) {
            console.log(`More than one field name matches the field name ${fieldName}. Please use the one of these qualified field names:`, matchingEntries.map((f) => f[1]));
            console.log('ngx-extended-pdf-viewer uses the first matching field (which may or may not be the topmost field on your PDF form): ' + matchingEntries[0][0]);
        }
        else if (matchingEntries.length === 0) {
            console.log("Couldn't find the field " + fieldName);
            return undefined;
        }
        return matchingEntries[0][0];
    }
    findRadioButtonGroup(fieldName) {
        const matchingEntries = Object.entries(this.radioButtons).filter((entry) => entry[0].endsWith('.' + fieldName) || entry[0] === fieldName);
        if (matchingEntries.length === 0) {
            return null;
        }
        if (matchingEntries.length > 1) {
            console.log('More than one radio button group name matches this name. Please use the qualified field name', matchingEntries.map((radio) => radio[0]));
            console.log('ngx-extended-pdf-viewer uses the first matching field (which may not be the topmost field on your PDF form): ' + matchingEntries[0][0]);
        }
        return matchingEntries[0][1];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWZvcm0tc3VwcG9ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvbmd4LWZvcm0tc3VwcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBS3JELE1BQU0sT0FBTyxjQUFjO0lBQ3pCLDZFQUE2RTtJQUNyRSxxQkFBcUIsR0FBOEIsRUFBRSxDQUFDO0lBRXRELGFBQWEsR0FBdUMsRUFBRSxDQUFDO0lBRXZELFlBQVksR0FBK0MsRUFBRSxDQUFDO0lBRS9ELFFBQVEsR0FBaUIsRUFBRSxDQUFDO0lBRTVCLDZCQUE2QixHQUFpQixFQUFFLENBQUM7SUFFakQsY0FBYyxHQUFHLElBQUksWUFBWSxFQUFnQixDQUFDO0lBRWpELE1BQU0sQ0FBUztJQUVoQixLQUFLO1FBQ1YsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRU0sNEJBQTRCLENBQUMsTUFBYztRQUNoRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNwQixVQUFrQixDQUFDLHVCQUF1QixHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEcsVUFBa0IsQ0FBQyxzQkFBc0IsR0FBRyxDQUFDLEdBQXdFLEVBQUUsS0FBd0IsRUFBRSxFQUFFLENBQ2xKLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEQsVUFBa0IsQ0FBQyxxQkFBcUIsR0FBRyxDQUMxQyxFQUFVLEVBQ1YsT0FBd0IsRUFDeEIsS0FBNkIsRUFDN0Isb0JBQTRCLEVBQzVCLG1CQUEyQixFQUMzQixFQUFFLENBQUMsSUFB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LEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDekMsQ0FBQztZQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0dBQStHLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdEo7UUFDRCxPQUFPLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybURhdGFUeXBlLCBJUERGVmlld2VyQXBwbGljYXRpb24gfSBmcm9tICcuLi9wdWJsaWNfYXBpJztcblxuZXhwb3J0IHR5cGUgSHRtbEZvcm1FbGVtZW50ID0gSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudDtcblxuZXhwb3J0IGNsYXNzIE5neEZvcm1TdXBwb3J0IHtcbiAgLyoqIE1hcHMgdGhlIGludGVybmFsIGlkcyBvZiB0aGUgYW5ub3RhdGlvbnMgb2YgcGRmLmpzIHRvIHRoZWlyIGZpZWxkIG5hbWUgKi9cbiAgcHJpdmF0ZSBmb3JtSWRUb0Z1bGxGaWVsZE5hbWU6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcblxuICBwcml2YXRlIGZvcm1JZFRvRmllbGQ6IHsgW2tleTogc3RyaW5nXTogSHRtbEZvcm1FbGVtZW50IH0gPSB7fTtcblxuICBwcml2YXRlIHJhZGlvQnV0dG9uczogeyBba2V5OiBzdHJpbmddOiBBcnJheTxIVE1MSW5wdXRFbGVtZW50PiB9ID0ge307XG5cbiAgcHVibGljIGZvcm1EYXRhOiBGb3JtRGF0YVR5cGUgPSB7fTtcblxuICBwdWJsaWMgaW5pdGlhbEZvcm1EYXRhU3RvcmVkSW5UaGVQREY6IEZvcm1EYXRhVHlwZSA9IHt9O1xuXG4gIHB1YmxpYyBmb3JtRGF0YUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Rm9ybURhdGFUeXBlPigpO1xuXG4gIHByaXZhdGUgbmdab25lOiBOZ1pvbmU7XG5cbiAgcHVibGljIHJlc2V0KCkge1xuICAgIHRoaXMuZm9ybURhdGEgPSB7fTtcbiAgICB0aGlzLmZvcm1JZFRvRnVsbEZpZWxkTmFtZSA9IHt9O1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyRm9ybVN1cHBvcnRXaXRoUGRmanMobmdab25lOiBOZ1pvbmUpOiB2b2lkIHtcbiAgICB0aGlzLm5nWm9uZSA9IG5nWm9uZTtcbiAgICAoZ2xvYmFsVGhpcyBhcyBhbnkpLmdldEZvcm1WYWx1ZUZyb21Bbmd1bGFyID0gKGtleTogc3RyaW5nKSA9PiB0aGlzLmdldEZvcm1WYWx1ZUZyb21Bbmd1bGFyKGtleSk7XG4gICAgKGdsb2JhbFRoaXMgYXMgYW55KS51cGRhdGVBbmd1bGFyRm9ybVZhbHVlID0gKGtleTogc3RyaW5nIHwgSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCwgdmFsdWU6IHsgdmFsdWU6IHN0cmluZyB9KSA9PlxuICAgICAgdGhpcy51cGRhdGVBbmd1bGFyRm9ybVZhbHVlQ2FsbGVkQnlQZGZqcyhrZXksIHZhbHVlKTtcbiAgICAoZ2xvYmFsVGhpcyBhcyBhbnkpLnJlZ2lzdGVyQWNyb2Zvcm1GaWVsZCA9IChcbiAgICAgIGlkOiBzdHJpbmcsXG4gICAgICBlbGVtZW50OiBIdG1sRm9ybUVsZW1lbnQsXG4gICAgICB2YWx1ZTogc3RyaW5nIHwgQXJyYXk8c3RyaW5nPixcbiAgICAgIHJhZGlvQnV0dG9uVmFsdWVOYW1lOiBzdHJpbmcsXG4gICAgICBpbml0aWFsVmFsdWVGcm9tUERGOiBzdHJpbmdcbiAgICApID0+IHRoaXMucmVnaXN0ZXJBY3JvZm9ybUZpZWxkKGlkLCBlbGVtZW50LCB2YWx1ZSwgcmFkaW9CdXR0b25WYWx1ZU5hbWUsIGluaXRpYWxWYWx1ZUZyb21QREYpO1xuXG4gICAgKGdsb2JhbFRoaXMgYXMgYW55KS5yZWdpc3RlclhGQUZpZWxkID0gKGVsZW1lbnQ6IEh0bWxGb3JtRWxlbWVudCwgdmFsdWU6IHsgdmFsdWU6IHN0cmluZyB9LCBpbml0aWFsVmFsdWVGcm9tUERGOiBzdHJpbmcpID0+XG4gICAgICB0aGlzLnJlZ2lzdGVyWEZBRmllbGQoZWxlbWVudCwgdmFsdWUsIGluaXRpYWxWYWx1ZUZyb21QREYpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWdpc3RlckFjcm9mb3JtRmllbGQoXG4gICAgaWQ6IHN0cmluZyxcbiAgICBlbGVtZW50OiBIdG1sRm9ybUVsZW1lbnQsXG4gICAgdmFsdWU6IG51bGwgfCBzdHJpbmcgfCBBcnJheTxzdHJpbmc+LFxuICAgIHJhZGlvQnV0dG9uVmFsdWVOYW1lOiBzdHJpbmcsXG4gICAgaW5pdGlhbEZvcm1WYWx1ZUZyb21QREY6IHN0cmluZ1xuICApOiB2b2lkIHtcbiAgICBjb25zdCBmaWVsZE5hbWUgPSBlbGVtZW50Lm5hbWU7XG4gICAgdGhpcy5mb3JtSWRUb0ZpZWxkW2lkXSA9IGVsZW1lbnQ7XG4gICAgdGhpcy5mb3JtSWRUb0Z1bGxGaWVsZE5hbWVbaWRdID0gZmllbGROYW1lO1xuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBlbGVtZW50LnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgIGNvbnN0IGdyb3VwTmFtZSA9IGZpZWxkTmFtZTtcbiAgICAgIHRoaXMuZm9ybUlkVG9GdWxsRmllbGROYW1lW2lkXSA9IGdyb3VwTmFtZTtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB0aGlzLmZvcm1EYXRhW2dyb3VwTmFtZV0gPSByYWRpb0J1dHRvblZhbHVlTmFtZSBhcyBzdHJpbmc7XG4gICAgICAgIHRoaXMuaW5pdGlhbEZvcm1EYXRhU3RvcmVkSW5UaGVQREZbZ3JvdXBOYW1lXSA9IGluaXRpYWxGb3JtVmFsdWVGcm9tUERGO1xuICAgICAgfVxuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2V4cG9ydFZhbHVlJywgcmFkaW9CdXR0b25WYWx1ZU5hbWUgYXMgc3RyaW5nKTtcbiAgICAgIGlmICghdGhpcy5yYWRpb0J1dHRvbnNbZ3JvdXBOYW1lXSkge1xuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uc1tncm91cE5hbWVdID0gW107XG4gICAgICB9XG4gICAgICB0aGlzLnJhZGlvQnV0dG9uc1tncm91cE5hbWVdLnB1c2goZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZm9ybURhdGFbZmllbGROYW1lXSA9IHRoaXMuZ2V0VmFsdWVPZkFTZWxlY3RGaWVsZChlbGVtZW50KTtcbiAgICAgIHRoaXMuaW5pdGlhbEZvcm1EYXRhU3RvcmVkSW5UaGVQREZbZmllbGROYW1lXSA9IGluaXRpYWxGb3JtVmFsdWVGcm9tUERGO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmZvcm1EYXRhW2ZpZWxkTmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5pdGlhbEZvcm1EYXRhU3RvcmVkSW5UaGVQREZbZmllbGROYW1lXSA9IGluaXRpYWxGb3JtVmFsdWVGcm9tUERGO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVnaXN0ZXJYRkFGaWVsZChlbGVtZW50OiBIVE1MRWxlbWVudCwgdmFsdWU6IHsgdmFsdWU6IHN0cmluZyB9LCBpbml0aWFsRm9ybVZhbHVlRnJvbVBERjogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgZnVsbEZpZWxkTmFtZSA9IHRoaXMuZmluZEZ1bGxYRkFOYW1lKGVsZW1lbnQpO1xuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBlbGVtZW50LnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgIGNvbnN0IGlkID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2ZpZWxkaWQnKSA/PyAnJztcbiAgICAgIC8vIHJlbW92ZSB0aGUgeGZhIG5hbWUgb2YgdGhlIHJhZGlvIGJ1dHRvbiBpdHNlbGYgZm9ybSB0aGUgZmllbGQgbmFtZSxcbiAgICAgIC8vIGJlY2F1c2UgdGhlIGZpZWxkIG5hbWUgcmVmZXJzIHRvIHRoZSBlbnRpcmUgZ3JvdXAgb2YgcmVsYXRhdGVkIHJhZGlvIGJ1dHRvbnNcbiAgICAgIGNvbnN0IGdyb3VwTmFtZSA9IGZ1bGxGaWVsZE5hbWUuc3Vic3RyaW5nKDAsIGZ1bGxGaWVsZE5hbWUubGFzdEluZGV4T2YoJy4nKSk7XG4gICAgICB0aGlzLmZvcm1JZFRvRnVsbEZpZWxkTmFtZVtpZF0gPSBncm91cE5hbWU7XG4gICAgICB0aGlzLmZvcm1EYXRhW2dyb3VwTmFtZV0gPSB2YWx1ZT8udmFsdWU7XG4gICAgICB0aGlzLmluaXRpYWxGb3JtRGF0YVN0b3JlZEluVGhlUERGW2dyb3VwTmFtZV0gPSBpbml0aWFsRm9ybVZhbHVlRnJvbVBERjtcblxuICAgICAgaWYgKCF0aGlzLnJhZGlvQnV0dG9uc1tncm91cE5hbWVdKSB7XG4gICAgICAgIHRoaXMucmFkaW9CdXR0b25zW2dyb3VwTmFtZV0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmFkaW9CdXR0b25zW2dyb3VwTmFtZV0ucHVzaChlbGVtZW50KTtcbiAgICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgICBjb25zdCBpZCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdmaWVsZGlkJykgPz8gJyc7XG4gICAgICB0aGlzLmZvcm1JZFRvRmllbGRbaWRdID0gZWxlbWVudDtcbiAgICAgIHRoaXMuZm9ybUlkVG9GdWxsRmllbGROYW1lW2lkXSA9IGZ1bGxGaWVsZE5hbWU7XG4gICAgICB0aGlzLmZvcm1EYXRhW2Z1bGxGaWVsZE5hbWVdID0gdmFsdWU/LnZhbHVlO1xuICAgICAgdGhpcy5pbml0aWFsRm9ybURhdGFTdG9yZWRJblRoZVBERltmdWxsRmllbGROYW1lXSA9IGluaXRpYWxGb3JtVmFsdWVGcm9tUERGO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50KSB7XG4gICAgICBjb25zdCBpZCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdmaWVsZGlkJykgPz8gJyc7XG4gICAgICB0aGlzLmZvcm1JZFRvRmllbGRbaWRdID0gZWxlbWVudDtcbiAgICAgIHRoaXMuZm9ybUlkVG9GdWxsRmllbGROYW1lW2lkXSA9IGZ1bGxGaWVsZE5hbWU7XG4gICAgICB0aGlzLmZvcm1EYXRhW2Z1bGxGaWVsZE5hbWVdID0gdmFsdWU/LnZhbHVlO1xuICAgICAgdGhpcy5pbml0aWFsRm9ybURhdGFTdG9yZWRJblRoZVBERltmdWxsRmllbGROYW1lXSA9IGluaXRpYWxGb3JtVmFsdWVGcm9tUERGO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxUZXh0QXJlYUVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGlkID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2ZpZWxkaWQnKSA/PyAnJztcbiAgICAgIHRoaXMuZm9ybUlkVG9GaWVsZFtpZF0gPSBlbGVtZW50O1xuICAgICAgdGhpcy5mb3JtSWRUb0Z1bGxGaWVsZE5hbWVbaWRdID0gZnVsbEZpZWxkTmFtZTtcbiAgICAgIHRoaXMuZm9ybURhdGFbZnVsbEZpZWxkTmFtZV0gPSB2YWx1ZT8udmFsdWU7XG4gICAgICB0aGlzLmluaXRpYWxGb3JtRGF0YVN0b3JlZEluVGhlUERGW2Z1bGxGaWVsZE5hbWVdID0gaW5pdGlhbEZvcm1WYWx1ZUZyb21QREY7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZG4ndCByZWdpc3RlciBhbiBYRkEgZm9ybSBmaWVsZFwiLCBlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFZhbHVlT2ZBU2VsZWN0RmllbGQoc2VsZWN0RWxlbWVudDogSFRNTFNlbGVjdEVsZW1lbnQpOiBudWxsIHwgc3RyaW5nIHwgQXJyYXk8c3RyaW5nPiB7XG4gICAgY29uc3QgeyBvcHRpb25zLCBtdWx0aXBsZSB9ID0gc2VsZWN0RWxlbWVudDtcbiAgICBpZiAoIW11bHRpcGxlKSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5zZWxlY3RlZEluZGV4ID09PSAtMSA/IG51bGwgOiBvcHRpb25zW29wdGlvbnMuc2VsZWN0ZWRJbmRleF1bJ3ZhbHVlJ107XG4gICAgfVxuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwob3B0aW9ucywgKG9wdGlvbikgPT4gb3B0aW9uLnNlbGVjdGVkKS5tYXAoKG9wdGlvbikgPT4gb3B0aW9uWyd2YWx1ZSddKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Rm9ybVZhbHVlRnJvbUFuZ3VsYXIoZWxlbWVudDogSFRNTEVsZW1lbnQgfCBzdHJpbmcpOiBPYmplY3Qge1xuICAgIGxldCBrZXk6IHN0cmluZztcbiAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICBjb25zdCBmaWVsZE5hbWUgPSB0aGlzLmZpbmRYRkFOYW1lKGVsZW1lbnQpO1xuICAgICAgaWYgKGZpZWxkTmFtZSkge1xuICAgICAgICBpZiAodGhpcy5mb3JtRGF0YS5oYXNPd25Qcm9wZXJ0eShmaWVsZE5hbWUpKSB7XG4gICAgICAgICAga2V5ID0gZmllbGROYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGtleSA9IHRoaXMuZmluZEZ1bGxYRkFOYW1lKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGRuJ3QgZmluZCB0aGUgZmllbGQgbmFtZSBvciBYRkEgbmFtZSBvZiB0aGUgZm9ybSBmaWVsZFwiLCBlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG51bGwgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAga2V5ID0gZWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIHsgdmFsdWU6IHRoaXMuZm9ybURhdGFba2V5XSB9O1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kWEZBTmFtZShlbGVtZW50OiBIVE1MRWxlbWVudCk6IHN0cmluZyB7XG4gICAgbGV0IHBhcmVudEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCB8IHVuZGVmaW5lZCA9IGVsZW1lbnQ7XG4gICAgd2hpbGUgKCFwYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgneGZhbmFtZScpICYmIHBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgcGFyZW50RWxlbWVudCA9IHBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIGVsZW1lbnQudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgZG8ge1xuICAgICAgICBwYXJlbnRFbGVtZW50ID0gcGFyZW50RWxlbWVudD8ucGFyZW50RWxlbWVudDtcbiAgICAgIH0gd2hpbGUgKCFwYXJlbnRFbGVtZW50Py5nZXRBdHRyaWJ1dGUoJ3hmYW5hbWUnKSAmJiBwYXJlbnRFbGVtZW50KTtcbiAgICB9XG4gICAgbGV0IGZpZWxkTmFtZSA9IHBhcmVudEVsZW1lbnQ/LmdldEF0dHJpYnV0ZSgneGZhbmFtZScpO1xuICAgIGlmICghZmllbGROYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIHRoZSB4ZmFuYW1lIG9mIHRoZSBmaWVsZFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkTmFtZTtcbiAgfVxuXG4gIHByaXZhdGUgZmluZEZ1bGxYRkFOYW1lKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogc3RyaW5nIHtcbiAgICBsZXQgcGFyZW50RWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgbGV0IGZpZWxkTmFtZSA9ICcnO1xuICAgIHdoaWxlIChwYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgcGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XG4gICAgICBjb25zdCB4ZmFOYW1lID0gcGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3hmYW5hbWUnKTtcbiAgICAgIGlmICh4ZmFOYW1lKSB7XG4gICAgICAgIGZpZWxkTmFtZSA9IHhmYU5hbWUgKyAnLicgKyBmaWVsZE5hbWU7XG4gICAgICB9XG4gICAgICBwYXJlbnRFbGVtZW50ID0gcGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgICBpZiAoIWZpZWxkTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCB0aGUgeGZhbmFtZSBvZiB0aGUgZmllbGRcIik7XG4gICAgfVxuICAgIGZpZWxkTmFtZSA9IGZpZWxkTmFtZS5zdWJzdHJpbmcoMCwgZmllbGROYW1lLmxlbmd0aCAtIDEpO1xuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBlbGVtZW50LnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgIC8vIGlnbm9yZSB0aGUgbGFzdCBwYXJ0IG9mIHRoZSB4ZmFOYW1lIGJlY2F1c2UgaXQncyBhY3R1YWxseSB0aGUgdmFsdWUgb2YgdGhlIGZpZWxkXG4gICAgICByZXR1cm4gZmllbGROYW1lLnN1YnN0cmluZygwLCBmaWVsZE5hbWUubGFzdEluZGV4T2YoJy4nKSk7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZE5hbWU7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUFuZ3VsYXJGb3JtVmFsdWVDYWxsZWRCeVBkZmpzKGtleTogc3RyaW5nIHwgSFRNTFNlbGVjdEVsZW1lbnQgfCBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCwgdmFsdWU6IHsgdmFsdWU6IHN0cmluZyB9KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmZvcm1EYXRhKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhID0ge307XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBhY3JvRm9ybUtleSA9IHRoaXMuZm9ybUlkVG9GdWxsRmllbGROYW1lW2tleV07XG4gICAgICBjb25zdCBmdWxsS2V5ID0gYWNyb0Zvcm1LZXkgPz8gT2JqZWN0LnZhbHVlcyh0aGlzLmZvcm1JZFRvRnVsbEZpZWxkTmFtZSkuZmluZCgoaykgPT4gayA9PT0ga2V5IHx8IGsuZW5kc1dpdGgoJy4nICsga2V5KSk7XG4gICAgICBpZiAoZnVsbEtleSkge1xuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuZm9ybUlkVG9GaWVsZFtrZXldO1xuICAgICAgICBsZXQgY2hhbmdlID0gdGhpcy5kb1VwZGF0ZUFuZ3VsYXJGb3JtVmFsdWUoZmllbGQsIHZhbHVlLCBmdWxsS2V5KTtcbiAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB0aGlzLmZvcm1EYXRhQ2hhbmdlLmVtaXQodGhpcy5mb3JtRGF0YSkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGRuJ3QgZmluZCB0aGUgZmllbGQgd2l0aCB0aGUgbmFtZSBcIiArIGtleSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBjaGFuZ2UgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHNob3J0RmllbGROYW1lID0gdGhpcy5maW5kWEZBTmFtZShrZXkpO1xuICAgICAgaWYgKHRoaXMuZm9ybURhdGEuaGFzT3duUHJvcGVydHkoc2hvcnRGaWVsZE5hbWUpKSB7XG4gICAgICAgIGNoYW5nZSA9IHRoaXMuZG9VcGRhdGVBbmd1bGFyRm9ybVZhbHVlKGtleSwgdmFsdWUsIHNob3J0RmllbGROYW1lKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZ1bGxGaWVsZE5hbWUgPSB0aGlzLmZpbmRGdWxsWEZBTmFtZShrZXkpO1xuICAgICAgaWYgKGZ1bGxGaWVsZE5hbWUgIT09IHNob3J0RmllbGROYW1lKSB7XG4gICAgICAgIGNoYW5nZSB8fD0gdGhpcy5kb1VwZGF0ZUFuZ3VsYXJGb3JtVmFsdWUoa2V5LCB2YWx1ZSwgZnVsbEZpZWxkTmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB0aGlzLmZvcm1EYXRhQ2hhbmdlLmVtaXQodGhpcy5mb3JtRGF0YSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZG9VcGRhdGVBbmd1bGFyRm9ybVZhbHVlKGZpZWxkOiBIdG1sRm9ybUVsZW1lbnQsIHZhbHVlOiB7IHZhbHVlOiBzdHJpbmcgfSwgZnVsbEtleTogc3RyaW5nKSB7XG4gICAgbGV0IGNoYW5nZSA9IGZhbHNlO1xuICAgIGlmIChmaWVsZCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgZmllbGQudHlwZSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgY29uc3QgZXhwb3J0VmFsdWUgPSBmaWVsZC5nZXRBdHRyaWJ1dGUoJ2V4cG9ydHZhbHVlJyk7XG4gICAgICBpZiAoZXhwb3J0VmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlLnZhbHVlKSB7XG4gICAgICAgICAgaWYgKHRoaXMuZm9ybURhdGFbZnVsbEtleV0gIT09IGV4cG9ydFZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhW2Z1bGxLZXldID0gZXhwb3J0VmFsdWU7XG4gICAgICAgICAgICBjaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5mb3JtRGF0YVtmdWxsS2V5XSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGFbZnVsbEtleV0gPSBmYWxzZTtcbiAgICAgICAgICAgIGNoYW5nZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5mb3JtRGF0YVtmdWxsS2V5XSAhPT0gdmFsdWUudmFsdWUpIHtcbiAgICAgICAgICB0aGlzLmZvcm1EYXRhW2Z1bGxLZXldID0gdmFsdWUudmFsdWU7XG4gICAgICAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIGZpZWxkLnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgIGNvbnN0IGV4cG9ydFZhbHVlID0gZmllbGQuZ2V0QXR0cmlidXRlKCdleHBvcnR2YWx1ZScpID8/IGZpZWxkLmdldEF0dHJpYnV0ZSgneGZhb24nKTtcbiAgICAgIGlmICh2YWx1ZS52YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5mb3JtRGF0YVtmdWxsS2V5XSAhPT0gZXhwb3J0VmFsdWUpIHtcbiAgICAgICAgICB0aGlzLmZvcm1EYXRhW2Z1bGxLZXldID0gZXhwb3J0VmFsdWU7XG4gICAgICAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5mb3JtRGF0YVtmdWxsS2V5XSAhPT0gdmFsdWUudmFsdWUpIHtcbiAgICAgICAgdGhpcy5mb3JtRGF0YVtmdWxsS2V5XSA9IHZhbHVlLnZhbHVlO1xuICAgICAgICBjaGFuZ2UgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2hhbmdlO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZUZvcm1GaWVsZHNJblBkZkNhbGxlZEJ5TmdPbkNoYW5nZXMocHJldmlvdXNGb3JtRGF0YTogT2JqZWN0KSB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcblxuICAgIGlmICghUERGVmlld2VyQXBwbGljYXRpb24/LnBkZkRvY3VtZW50Py5hbm5vdGF0aW9uU3RvcmFnZSkge1xuICAgICAgLy8gbmdPbkNoYW5nZXMgY2FsbHMgdGhpcyBtZXRob2QgdG9vIGVhcmx5IC0gc28ganVzdCBpZ25vcmUgaXRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLmZvcm1EYXRhKSB7XG4gICAgICBpZiAodGhpcy5mb3JtRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5mb3JtRGF0YVtrZXldO1xuICAgICAgICBpZiAobmV3VmFsdWUgIT09IHByZXZpb3VzRm9ybURhdGFba2V5XSkge1xuICAgICAgICAgIHRoaXMuc2V0RmllbGRWYWx1ZUFuZFVwZGF0ZUFubm90YXRpb25TdG9yYWdlKGtleSwgbmV3VmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJldmlvdXNGb3JtRGF0YSkge1xuICAgICAgaWYgKHByZXZpb3VzRm9ybURhdGEuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBwcmV2aW91c0Zvcm1EYXRhW2tleV0pIHtcbiAgICAgICAgbGV0IGhhc1ByZXZpb3VzVmFsdWUgPSB0aGlzLmZvcm1EYXRhLmhhc093blByb3BlcnR5KGtleSk7XG4gICAgICAgIGlmICghaGFzUHJldmlvdXNWYWx1ZSkge1xuICAgICAgICAgIGNvbnN0IGZ1bGxLZXkgPSBPYmplY3Qua2V5cyh0aGlzLmZvcm1EYXRhKS5maW5kKChrKSA9PiBrID09PSBrZXkgfHwgay5lbmRzV2l0aCgnLicgKyBrZXkpKTtcbiAgICAgICAgICBpZiAoZnVsbEtleSkge1xuICAgICAgICAgICAgaGFzUHJldmlvdXNWYWx1ZSA9IHRoaXMuZm9ybURhdGEuaGFzT3duUHJvcGVydHkoZnVsbEtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFoYXNQcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5zZXRGaWVsZFZhbHVlQW5kVXBkYXRlQW5ub3RhdGlvblN0b3JhZ2Uoa2V5LCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0RmllbGRWYWx1ZUFuZFVwZGF0ZUFubm90YXRpb25TdG9yYWdlKGtleTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XG4gICAgY29uc3QgcmFkaW9zID0gdGhpcy5maW5kUmFkaW9CdXR0b25Hcm91cChrZXkpO1xuICAgIGlmIChyYWRpb3MpIHtcbiAgICAgIHJhZGlvcy5mb3JFYWNoKChyKSA9PiB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZVZhbHVlID0gci5nZXRBdHRyaWJ1dGUoJ2V4cG9ydFZhbHVlJykgPz8gci5nZXRBdHRyaWJ1dGUoJ3hmYW9uJyk7XG4gICAgICAgIHIuY2hlY2tlZCA9IGFjdGl2ZVZhbHVlID09PSBuZXdWYWx1ZTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdXBkYXRlRnJvbUFuZ3VsYXIgPSBuZXcgQ3VzdG9tRXZlbnQoJ3VwZGF0ZUZyb21Bbmd1bGFyJywge1xuICAgICAgICBkZXRhaWw6IG5ld1ZhbHVlLFxuICAgICAgfSk7XG4gICAgICByYWRpb3NbMF0uZGlzcGF0Y2hFdmVudCh1cGRhdGVGcm9tQW5ndWxhcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGZpZWxkSWQgPSB0aGlzLmZpbmRGb3JtSWRGcm9tRmllbGROYW1lKGtleSk7XG4gICAgICBpZiAoZmllbGRJZCkge1xuICAgICAgICBjb25zdCBodG1sRmllbGQgPSB0aGlzLmZvcm1JZFRvRmllbGRbZmllbGRJZF07XG5cbiAgICAgICAgaWYgKGh0bWxGaWVsZCkge1xuICAgICAgICAgIGlmIChodG1sRmllbGQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIGh0bWxGaWVsZC50eXBlID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgICBsZXQgYWN0aXZlVmFsdWUgPSBodG1sRmllbGQuZ2V0QXR0cmlidXRlKCd4ZmFvbicpID8/IGh0bWxGaWVsZC5nZXRBdHRyaWJ1dGUoJ2V4cG9ydHZhbHVlJykgPz8gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gdHJ1ZSB8fCBuZXdWYWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgYWN0aXZlVmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaHRtbEZpZWxkLmNoZWNrZWQgPSBhY3RpdmVWYWx1ZSA9PT0gbmV3VmFsdWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChodG1sRmllbGQgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVNlbGVjdEZpZWxkKGh0bWxGaWVsZCwgbmV3VmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0ZXh0YXJlYXMgYW5kIGlucHV0IGZpZWxkc1xuICAgICAgICAgICAgaHRtbEZpZWxkLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHVwZGF0ZUZyb21Bbmd1bGFyID0gbmV3IEN1c3RvbUV2ZW50KCd1cGRhdGVGcm9tQW5ndWxhcicsIHtcbiAgICAgICAgICAgIGRldGFpbDogbmV3VmFsdWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaHRtbEZpZWxkLmRpc3BhdGNoRXZlbnQodXBkYXRlRnJvbUFuZ3VsYXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZG4ndCBzZXQgdGhlIHZhbHVlIG9mIHRoZSBmaWVsZFwiLCBrZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwb3B1bGF0ZVNlbGVjdEZpZWxkKGh0bWxGaWVsZDogSFRNTFNlbGVjdEVsZW1lbnQsIG5ld1ZhbHVlOiBhbnkpIHtcbiAgICBpZiAoaHRtbEZpZWxkLm11bHRpcGxlKSB7XG4gICAgICBjb25zdCB7IG9wdGlvbnMgfSA9IGh0bWxGaWVsZDtcbiAgICAgIGNvbnN0IG5ld1ZhbHVlQXJyYXkgPSBuZXdWYWx1ZSBhcyBBcnJheTxzdHJpbmc+O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IG9wdGlvbnMuaXRlbShpKTtcbiAgICAgICAgaWYgKG9wdGlvbikge1xuICAgICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IG5ld1ZhbHVlQXJyYXkuc29tZSgobykgPT4gbyA9PT0gb3B0aW9uLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBodG1sRmllbGQudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZpbmRGb3JtSWRGcm9tRmllbGROYW1lKGZpZWxkTmFtZTogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoT2JqZWN0LmVudHJpZXModGhpcy5mb3JtSWRUb0Z1bGxGaWVsZE5hbWUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gc29tZXRpbWVzLCBuZ09uQ2hhbmdlcygpIGlzIGNhbGxlZCBiZWZvcmUgaW5pdGlhbGl6aW5nIHRoZSBQREYgZmlsZVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgbWF0Y2hpbmdFbnRyaWVzID0gT2JqZWN0LmVudHJpZXModGhpcy5mb3JtSWRUb0Z1bGxGaWVsZE5hbWUpLmZpbHRlcigoZW50cnkpID0+IGVudHJ5WzFdID09PSBmaWVsZE5hbWUgfHwgZW50cnlbMV0uZW5kc1dpdGgoJy4nICsgZmllbGROYW1lKSk7XG4gICAgaWYgKG1hdGNoaW5nRW50cmllcy5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgYE1vcmUgdGhhbiBvbmUgZmllbGQgbmFtZSBtYXRjaGVzIHRoZSBmaWVsZCBuYW1lICR7ZmllbGROYW1lfS4gUGxlYXNlIHVzZSB0aGUgb25lIG9mIHRoZXNlIHF1YWxpZmllZCBmaWVsZCBuYW1lczpgLFxuICAgICAgICBtYXRjaGluZ0VudHJpZXMubWFwKChmKSA9PiBmWzFdKVxuICAgICAgKTtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAnbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIgdXNlcyB0aGUgZmlyc3QgbWF0Y2hpbmcgZmllbGQgKHdoaWNoIG1heSBvciBtYXkgbm90IGJlIHRoZSB0b3Btb3N0IGZpZWxkIG9uIHlvdXIgUERGIGZvcm0pOiAnICsgbWF0Y2hpbmdFbnRyaWVzWzBdWzBdXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAobWF0Y2hpbmdFbnRyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc29sZS5sb2coXCJDb3VsZG4ndCBmaW5kIHRoZSBmaWVsZCBcIiArIGZpZWxkTmFtZSk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gbWF0Y2hpbmdFbnRyaWVzWzBdWzBdO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kUmFkaW9CdXR0b25Hcm91cChmaWVsZE5hbWU6IHN0cmluZyk6IEFycmF5PEhUTUxJbnB1dEVsZW1lbnQ+IHwgbnVsbCB7XG4gICAgY29uc3QgbWF0Y2hpbmdFbnRyaWVzID0gT2JqZWN0LmVudHJpZXModGhpcy5yYWRpb0J1dHRvbnMpLmZpbHRlcigoZW50cnkpID0+IGVudHJ5WzBdLmVuZHNXaXRoKCcuJyArIGZpZWxkTmFtZSkgfHwgZW50cnlbMF0gPT09IGZpZWxkTmFtZSk7XG4gICAgaWYgKG1hdGNoaW5nRW50cmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAobWF0Y2hpbmdFbnRyaWVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAnTW9yZSB0aGFuIG9uZSByYWRpbyBidXR0b24gZ3JvdXAgbmFtZSBtYXRjaGVzIHRoaXMgbmFtZS4gUGxlYXNlIHVzZSB0aGUgcXVhbGlmaWVkIGZpZWxkIG5hbWUnLFxuICAgICAgICBtYXRjaGluZ0VudHJpZXMubWFwKChyYWRpbykgPT4gcmFkaW9bMF0pXG4gICAgICApO1xuICAgICAgY29uc29sZS5sb2coJ25neC1leHRlbmRlZC1wZGYtdmlld2VyIHVzZXMgdGhlIGZpcnN0IG1hdGNoaW5nIGZpZWxkICh3aGljaCBtYXkgbm90IGJlIHRoZSB0b3Btb3N0IGZpZWxkIG9uIHlvdXIgUERGIGZvcm0pOiAnICsgbWF0Y2hpbmdFbnRyaWVzWzBdWzBdKTtcbiAgICB9XG4gICAgcmV0dXJuIG1hdGNoaW5nRW50cmllc1swXVsxXTtcbiAgfVxufVxuIl19