import { test, expect, chromium } from "@playwright/test"
import RandomUtility from "../utility/RandomUtility"
import BasePage from "../pages/BasePage"
import { verify } from "crypto"


let formData = {}
let objRandomUtility
test.describe("Verify form journey", () => {
    test.beforeAll('Intialize objects', async () => {
        objRandomUtility = new RandomUtility();
    })

    test("Verify Record can be added or not", async ({ page }) => {
        let objBasePage = new BasePage(page);

        //data preparation
        formData.singleLine = await objRandomUtility.generateRandomString()
        formData.multiLine = await objRandomUtility.generateMultipleLineContent()
        formData.editor = await objRandomUtility.generateMultipleLineContent()
        formData.number = await objRandomUtility.generateRandomNumber()
        formData.email = await objRandomUtility.generateRandomEmail()
        formData.phone = await objRandomUtility.generateFakePhoneNumber()
        formData.singleSelection = "option1"
        formData.multiSelection = ["option1", "option2"]
        formData.file = "utility/test.png" //always set according to on which level playwright is executing
        formData.radioButton = "option1"
        formData.checkbox = ["option1", "option2"]
        formData.datePicker = await objRandomUtility.getRandomDate()
        formData.dateRange = await objRandomUtility.getRandomDateRange()
        formData.timePicker = await objRandomUtility.generateRandomTime()
        formData.location = await objRandomUtility.getRandomLatLong()

        console.log(formData)
        //selectors list
        let singleLineSelector = '#singleLine'
        let multiLineSelector = '#multiLine'
        let editorIframeSelector = 'iframe[id*="tiny-react"]'
        let editorSelector = 'body#tinymce'
        let numberSelector = 'input[id="number"]'
        let emailSelector = '//input[@id="email"]'
        let phoneSelector = 'input[type*="tel"]' //contains method
        let singleSelectionSelector = "#singleSelect"
        let multiSelectionSelector = "#multiSelect"
        let fileFieldSelector = '#file'
        let radioButtonSelector = '//label[contains(text(), "Radio Buttons")]/following-sibling::div/label/input[@type="radio"]'
        let checkboxSelector = 'input[type="checkbox"]'
        let datePickerSelector = "#date"
        let dateRangeStartSelector = "#dateRangeStart"
        let dateRangeEndSelector = "#dateRangeEnd"
        let timePickerSelector = "#time"
        let locationSelector = "#location"
        let saveButtonSelector = 'button[type="submit"]'


        await page.goto("/records")
        await page.getByRole("button", { name: "Add Record" }).click();
        await page.locator(singleLineSelector).fill(formData.singleLine)
        await page.locator(multiLineSelector).fill(formData.multiLine)

        //editor
        await page.waitForSelector(editorIframeSelector, { state: 'visible' })
        const iframe = page.frameLocator(editorIframeSelector)
        await iframe.locator(editorSelector).fill(formData.editor)

        await page.locator(numberSelector).fill(formData.number)
        await page.locator(emailSelector).fill(formData.email)
        await page.locator(phoneSelector).fill(formData.phone)

        //single selection and multi selection 
        await page.locator(singleSelectionSelector).selectOption(formData.singleSelection)
        await page.locator(multiSelectionSelector).selectOption(formData.multiSelection)

        //file field 
        await page.locator(fileFieldSelector).setInputFiles(formData.file)

        //radio button and checkbox 
        await page.locator(radioButtonSelector).first().click();
        await page.locator(checkboxSelector).check(formData.checkboxSelector)

        //Date
        await page.locator(datePickerSelector).click();
        let arrayDatePicker = await (formData.datePicker)[0]
        await objBasePage.selectDate(...arrayDatePicker)

        //Date range
        await page.locator(dateRangeStartSelector).click();
        let arrayStartDatePicker = await (formData.dateRange)[0]
        await objBasePage.selectDate(...arrayStartDatePicker)

        await page.locator(dateRangeEndSelector).click();
        let arrayEndDatePicker = await (formData.dateRange)[0]
        await objBasePage.selectDate(...arrayEndDatePicker)

        await page.locator(timePickerSelector).fill(formData.timePicker)
        await page.locator(locationSelector).fill(await (formData.location).join(","))

        await Promise.all([
            page.getByRole('button', { name: 'Save' }).click(),
            page.waitForURL(),
        ]);

        //verify the record 
        await page.locator('table tr:last-child td:last-child').waitFor({ state: 'visible' });
        let arrtext = await page.locator("table thead tr th").allTextContents();
        let columnIndex = (await arrtext.indexOf("Single Line")) + 1
        let latestColumnNameSelector = `table tr:last-child td:nth-child(${columnIndex})`
        let text = await page.locator(latestColumnNameSelector).textContent()
        expect(text, "verify single line value").toBe(formData.singleLine)

    })
})