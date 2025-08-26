import BasePage from "./BasePage";
import RandomUtility from "../utility/RandomUtility";
import Helper from "./Helper";
// import selectors from "./selectors";
let objRandomUtility = new RandomUtility();

export default class FormPage extends BasePage {
    constructor(page) {
        super(page)
        this.page = page
        this.objHelper = new Helper(page);
        this.objRandomUtility = new RandomUtility();
        this.singleLineSelector = '#singleLine'
        this.multiLineSelector = '#multiLine'
        this.editorIframeSelector = 'iframe[id*="tiny-react"]'
        this.editorSelector = '#tinymce'
        this.numberSelector = 'input[id="number"]'
        this.emailSelector = '//input[@id="email"]'
        this.phoneSelector = 'input[type*="tel"]' //contains method
        this.singleSelectionSelector = "#singleSelect"
        this.multiSelectionSelector = "#multiSelect"
        this.fileFieldSelector = '#file'
        this.radioButtonSelector = '//label[contains(text(), "Radio Buttons")]/following-sibling::div/label/input[@type="radio"]'
        this.checkboxSelector = 'input[type="checkbox"]'
        this.datePickerSelector = "#date"
        this.dateRangeStartSelector = "#dateRangeStart"
        this.dateRangeEndSelector = "#dateRangeEnd"
        this.timePickerSelector = "#time"
        this.locationSelector = "#location"
        this.saveButtonSelector = 'button[type="submit"]'
    }

    async fillForm(formData) {
        if (formData.singleLine) {
            await this.fillField(this.singleLineSelector, formData.singleLine)
        }
        if (formData.multiLine) {
            await this.fillField(this.multiLineSelector, formData.multiLine)
        }
        if (formData.editor) {
            const iframe = await this.getIframe(this.editorIframeSelector);
            await this.fillFieldIframe(iframe, this.editorSelector, formData.editor);
        }
        if (formData.number) {
            await this.fillField(this.numberSelector, formData.number)
        }
        if (formData.email) {
            await this.fillField(this.emailSelector, formData.email)
        }
        if (formData.phone) {
            await this.fillField(this.phoneSelector, formData.phone)
        }
        if (formData.singleSelection) {
            let selectLocator = await this.findElementLocator(this.singleSelectionSelector)
            if (formData.singleSelection = "random") {
                let arrayOptionElements = await this.findSelectTagOptionElements(selectLocator)
                let randomOption = await this.objRandomUtility.getRandomSelectedOneValueFromArray(arrayOptionElements)
                let randomOptionValue = await this.getAttributeFromLocator(randomOption, 'value')
                await this.selectOption(selectLocator, randomOptionValue)
                formData.singleSelection = randomOptionValue
            }
            else {
                await this.selectOption(selectLocator, formData.singleSelection)
            }
        }
        if (formData.multiSelection) {
            let selectLocator = await this.findElementLocator(this.multiSelectionSelector)
            if (formData.multiSelection = "random") {
                let arrayOptionElements = await this.findSelectTagOptionElements(selectLocator)
                let randomOptions = await this.objRandomUtility.getRandomSelectedValuesFromArray(arrayOptionElements)
                let arrayRandomOptionValue = await Promise.all(randomOptions.map(async (randomOption) => { return await this.getAttributeFromLocator(randomOption, 'value') }))
                await this.selectOption(selectLocator, arrayRandomOptionValue)
                formData.multiSelection = arrayRandomOptionValue
            }
            else {
                await this.selectOption(selectLocator, formData.multiSelection)
            }
        }
        if (formData.file) {
            let fileFieldLocator = await this.findElementLocator(this.fileFieldSelector)
            await this.uploadFile(fileFieldLocator, formData.file)
        }
        if (formData.radioButton) {
            if (formData.radioButton = "random") {
                let arrayOptionElements = await this.findAllElementLocators(this.radioButtonSelector)
                let randomOption = await this.objRandomUtility.getRandomSelectedOneValueFromArray(arrayOptionElements)
                let randomOptionValue = await this.getAttributeFromLocator(randomOption, 'value')
                await this.clickElement(randomOption)
                formData.radioButton = randomOptionValue
            }
            else {
                await this.clickElement(randomOption)
            }
        }
        if (formData.checkbox) {
            if (formData.checkbox = "random") {
                let arrayOptionElements = await this.findAllElementLocators(this.checkboxSelector)
                let randomOptions = await this.objRandomUtility.getRandomSelectedValuesFromArray(arrayOptionElements)
                let arrayRandomOptionValue = await Promise.all(randomOptions.map(async (randomOption) => { return (await randomOption.locator('xpath=following-sibling::span')).textContent(); }))
                for (let chk of randomOptions) { await this.clickElement(chk) }
                formData.checkbox = arrayRandomOptionValue
            }
            else {
                for (let chk of formData.checkbox) { await this.clickElement(chk) }
            }
        }
        if (formData.datePicker) {
            let datePickerLocator = await this.findElementLocator(this.datePickerSelector)
            await this.clickElement(datePickerLocator)
            let arrayDatePicker = await (formData.datePicker)[0]
            await this.selectDate(...arrayDatePicker)
            formData.datePicker = (formData.datePicker)[1]
        }
        if (formData.dateRange) {
            let startDatePickerLocator = await this.findElementLocator(this.dateRangeStartSelector)
            await this.clickElement(startDatePickerLocator)
            let arrayStartDatePicker = await (formData.dateRange)[0]
            await this.selectDate(...arrayStartDatePicker)

            let endDatePickerLocator = await this.findElementLocator(this.dateRangeEndSelector)
            await this.clickElement(endDatePickerLocator)
            let arrayEndDatePicker = await (formData.dateRange)[2]
            await this.selectDate(...arrayEndDatePicker)

            formData.dateRange = [await (formData.dateRange)[1],await (formData.dateRange)[3]]
        }
        if(formData.timePicker){
            await this.fillField(this.timePickerSelector, formData.timePicker)
        }
        if(formData.location){
            await this.fillField(this.locationSelector, await (formData.location).join(","))
            formData.location = await (formData.location).join(",")
        }
        return formData

    }

    async submitForm() {
        let saveButton  = await this.findElementLocator(this.saveButtonSelector)
        await this.clickElement(saveButton)
    }

}
