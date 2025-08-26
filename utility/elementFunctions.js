import { fi } from 'faker/lib/locales';

const RandomUtility = require('../utility/randomUtility')
const { test } = require('@playwright/test');
const path = require('path')
//OBJECTS
const objRandomUtility = new RandomUtility()



export default class ElementFunctions {
    constructor(page) {
        this.page = page
    }

    async findOuterHTML(fieldElement) {
        let fieldelementHandle = await fieldElement.elementHandle()
        let fieldOuterHTMLContent = await fieldelementHandle.evaluate(box => box.outerHTML);
        return fieldOuterHTMLContent
    }

    async findFieldNameElement(fieldElement) {
        let fieldNameElement = await fieldElement.locator('label[class*="form-label"]')
        return fieldNameElement
    }

    async findElementsByRoleOptions() {
        // let arrayFieldOptionValueElements = await this.page.getByRole('option').all()
        let arrayFieldOptionValueElements = await this.page.locator('[role="option"]').all()
        return arrayFieldOptionValueElements
    }

    async getVisibleElements(arrayyElements) {
        let visibleElements = []
        for (let element of arrayyElements) {
            if (await element.isVisible()) {
                visibleElements.push(element)
            }
        }
        return visibleElements
    }

    async findCheckboxValueElements(fieldBoxElement) {
        let arrayFieldElements = await fieldBoxElement.locator('input[type="checkbox"]').all()
        return arrayFieldElements
    }

    async findRadioValueElements(fieldBoxElement) {
        let arrayFieldElements = await fieldBoxElement.locator('input[type="radio"]').all()
        return arrayFieldElements
    }

    async findSelectTagOptionElements(fieldBoxElement) {
        //get all option values
        let allOptionElements = await fieldBoxElement.locator('option').all()
        return allOptionElements
    }


    async getFieldElementName(fieldBoxElement) {
        let fieldNameElement = await this.findFieldNameElement(fieldBoxElement) // for $ method , use CSS selector
        let fieldName = await fieldNameElement.textContent()
        return fieldName
    }

    async clickOnMainElementInput(fieldBoxElement) {
        let mainElement = await fieldBoxElement.locator('[data-group-id]')
        await mainElement.click();
    }

    async findInputElement(fieldBoxElement) {
        let inputElement = await fieldBoxElement.locator('input')
        return inputElement
    }

    async findTextElement(fieldBoxElement){
        let inputTextElement = await fieldBoxElement.locator('input[type="text"]')
        return inputTextElement
    }

    async findTextAreaElement(fieldBoxElement){
        let inputTextElement = await fieldBoxElement.locator('textarea')
        return inputTextElement
    }
    async findTextElements(fieldBoxElement){
        let startElement = await fieldBoxElement.locator('input[type="text"]').nth(0)
        let endElement = await fieldBoxElement.locator('input[type="text"]').nth(1)
        return [startElement,endElement]
    }
    async findPasswordElements(fieldBoxElement){
        let startElement = await fieldBoxElement.locator('input[type="password"]').nth(0)
        let endElement = await fieldBoxElement.locator('input[type="password"]').nth(1)
        return [startElement,endElement]
    }

    async selectRandomCheckbox(fieldBoxElement) {
        let arrayFieldValueElements = await this.findCheckboxValueElements(fieldBoxElement)
        let arraySelectedCheckboxElements = await objRandomUtility.getRandomSelectedValuesFromArray(arrayFieldValueElements)
        for (let element of arraySelectedCheckboxElements) {
            await element.click();
        }
        let arraySelecteCheckboxText = []
        for (let element of arraySelectedCheckboxElements) {
            let elementValue = await element.getAttribute('value')
            arraySelecteCheckboxText.push(elementValue)
        }
        return arraySelecteCheckboxText
    }
    async selectRandomSingleDropdown(fieldBoxElement) {

        //click on main element to open dropdown
        await this.clickOnMainElementInput(fieldBoxElement)

        //Get all option by role method 
        let arrayAllFieldOptionValueElements = await this.findElementsByRoleOptions()

        //get visible options
        // let arrayFieldVisibleValueElements = await this.getVisibleElements(arrayAllFieldOptionValueElements)
        let arrayFieldVisibleValueElements = arrayAllFieldOptionValueElements

        // Remove select option from array
        for (let record of arrayFieldVisibleValueElements) {
            if (await record.textContent() === "-- Select --") {
                arrayFieldVisibleValueElements.splice(record, 1)
                break;
            }
        }

        //click any dropdown and return text
        let selectedDropdownElement = await objRandomUtility.getRandomSelectedOneValueFromArray(arrayFieldVisibleValueElements)
        let selectedDropdownElementText = await selectedDropdownElement.textContent()
        await selectedDropdownElement.click();
        return selectedDropdownElementText
    }

    async selectRandomMultiDropdown(fieldBoxElement) {

        //click on main element to open dropdown
        await this.clickOnMainElementInput(fieldBoxElement)

        //Get all option by role method 
        let arrayAllFieldOptionValueElements = await this.findElementsByRoleOptions()

        //get visible options
        // let arrayFieldVisibleValueElements = await this.getVisibleElements(arrayAllFieldOptionValueElements)
        let arrayFieldVisibleValueElements = arrayAllFieldOptionValueElements


        //Remove select all option
        for (let record of arrayFieldVisibleValueElements) {
            if (await record.textContent() === "Select All ") {
                arrayFieldVisibleValueElements.splice(record, 1);
                break;
            }
        }


        let arraySelectedCheckboxElements = await objRandomUtility.getRandomSelectedValuesFromArray(arrayFieldVisibleValueElements)
        for (let element of arraySelectedCheckboxElements) {
            await element.click();
        }
        let arraySelecteCheckboxText = []
        for (let element of arraySelectedCheckboxElements) {
            let elementValue = await element.textContent()
            arraySelecteCheckboxText.push(elementValue)
        }
        await this.clickOnMainElementInput(fieldBoxElement)
        return arraySelecteCheckboxText

    }

    async selectRandomRadio(fieldBoxElement) {
        let arrayFieldValueElements = await this.findRadioValueElements(fieldBoxElement)
        let selectedRadioElement = await objRandomUtility.getRandomSelectedOneValueFromArray(arrayFieldValueElements)
        await selectedRadioElement.click();
        let selectedRadioElementText = await selectedRadioElement.getAttribute('value')
        return selectedRadioElementText
    }

    async selectRandomSingleDropdownSelectOptionForPhoneNumber(fieldBoxElement) {
        //open Drodpdown
        let selectElement = await fieldBoxElement.locator('select')

        //select value
        let allOptionElements = await this.findSelectTagOptionElements(fieldBoxElement);
        let selectedDropdownElement = await objRandomUtility.getRandomSelectedOneValueFromArray(allOptionElements)

        let selectedDropdownElementText = await selectedDropdownElement.getAttribute('value')
        await selectElement.selectOption("India") //selectedDropdownElementText to be passed
        return "India" //selectedDropdownElementText to be return
    }

    async addPhoneNumberCountrywiseForPhoneNumber(fieldBoxElement, selectedDropdownElementText) {
        let phoneNumberInputElement = await this.findInputElement(fieldBoxElement)
        // var phoneNumberValue = await objRandomUtility.generateFakePhoneNumber(selectedDropdownElementText)
        var phoneNumberValue = "8735055461"
        console.log("phoneNumberValue ", phoneNumberValue)
        let countrycodeValue = await phoneNumberInputElement.getAttribute('value')
        console.log("countrycodeValue", countrycodeValue)

        await phoneNumberInputElement.click();
        // await phoneNumberInputElement.focus()
        // await phoneNumberInputElement.pressSequentially('8735055461', { delay: 100 })
        await phoneNumberInputElement.pressSequentially('8735055461') //here pressSequentially is being used instead of fill  
        return countrycodeValue + phoneNumberValue
    }

    async uploadFile(fieldBoxElement) {
        let filePath = `./utility/testImage.png`
        let fileElement = await fieldBoxElement.locator('input[type="file"]')
        let fileName = path.basename(filePath)
        await fileElement.setInputFiles(filePath)
        return fileName
    }

    async selectDate(day, month, year) {
        //select date picker year dropdown
        await this.page.locator(".react-datepicker__year-dropdown-container").click()
        console.log("day",typeof(day))
        //select year
        await this.page.locator(".react-datepicker__year-option", { hasText: year }).click()


        //select date picker month dropdown
        await this.page.locator(".react-datepicker__month-dropdown-container").click()

        //select month
        await this.page.locator(".react-datepicker__month-option", { hasText: month }).click()

    
        //select Date
        let dateLocator
        if (day.toString().length === 1) {
            dateLocator = `div[class*="react-datepicker__day--00${day}"][aria-label*="${month} ${day}"]` //class* for contains
        } else {
            dateLocator = `div[class*="react-datepicker__day--0${day}"][aria-label*="${month} ${day}"]` //class* for contains
        }
        await this.page.locator(dateLocator).click();
        }

    async openFromDateCalender(fieldBoxElement) {
        await fieldBoxElement.locator(".react-datepicker__input-container").first().click()
    }
    async openendDateCalender(fieldBoxElement) {
        await fieldBoxElement.locator(".react-datepicker__input-container").last().click()
    }

    async getiframeElement(fieldBoxElement){
        let iframelocator = await fieldBoxElement.locator('iframe').contentFrame()
        let iframebody = iframelocator.locator('body#tinymce')
        return iframebody
    }
}
// module.exports = ElementFunctions