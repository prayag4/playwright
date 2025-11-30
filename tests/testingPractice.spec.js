import { test, expect, context } from '@playwright/test';
import RandomUtility from '../utility/RandomUtility';
import BasePage from '../pages/BasePage';

let formData = {}
let objRandomUtility
let objBasePage

test.describe('Verify crud screen', () => {
  test.beforeAll('generate utilioty fucntion', () => {
    objRandomUtility = new RandomUtility();
  })
  test("verify the crud screen @smoke", async ({ page }) => {
    let objBasePage = new BasePage(page)

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

    let singleLineSelector = '#singleLine'
    let multiLineSelector = '#multiLine'
    let editorIframeSelector = 'iframe[id*="tiny-react"]'
    let editorSelector = 'body#tinymce'
    let numberSelector = 'input[id="number"]'
    let emailSelector = '//input[@id="email"]'
    let phoneSelector = 'input[type*="tel"]' //contains method
    let singleSelectionSelector = "#singleSelect"
    let multiSelectionSelector = "#multiSelect"
    let fileFieldSelector = 'input[type="file"]'
    let radioButtonSelector = '//label[contains(text(), "Radio Buttons")]/following-sibling::div/label/input'
    let checkboxSelector = 'input[type="checkbox"]'
    let datePickerSelector = "#date"
    let dateRangeStartSelector = "#dateRangeStart"
    let dateRangeEndSelector = "#dateRangeEnd"
    let timePickerSelector = "#time"
    let locationSelector = "#location"
    let saveButtonSelector = 'button[type="submit"]'

    await page.goto('/records')
    await page.getByRole('button', { name: "Add Record" }).click();

    await page.locator(singleLineSelector).fill(formData.singleLine)
    await page.locator(multiLineSelector).fill(formData.multiLine)

    //editor - iframe
    await page
      .frameLocator(editorIframeSelector)
      .locator(editorSelector)
      .fill(formData.editor);


    await page.locator(emailSelector).fill(formData.email)
    await page.locator(numberSelector).fill(formData.number)
    await page.locator(phoneSelector).fill(formData.phone)

    await page.locator(singleSelectionSelector).selectOption(formData.singleSelection)
    await page.locator(multiSelectionSelector).selectOption(formData.multiSelection)

    //file upload case
    await page.locator(fileFieldSelector).setInputFiles(formData.file)
    await page.locator(radioButtonSelector).first().check()
    await page.locator(checkboxSelector).check()

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

    await page.getByText("Save").click()
    await page.waitForURL()

    await page.locator('table tr:last-child td:last-child').waitFor({ state: "visible" })
    let arrText = page.locator('table thead tr th').allTextContents()
    let columnIndex = (await arrText).indexOf("Single Line") + 1
    let latestcolumnSelector = `table tr:last-child td:nth-child(${columnIndex})`
    let text = await page.locator(latestcolumnSelector).textContent()
    expect(text, "Verify single line record").toBe(formData.singleLine)

    //dialog
    page.on('dialog', async dialog => {
      console.log("Herllo")
      await dialog.accept()
    })

    await page.locator('table tr:last-child').getByRole('button', { name: "Delete" }).click();
    await page.waitForTimeout(5000)


    const context = page.context();
    await page.goto('https://the-internet.herokuapp.com/windows');
    await page.waitForLoadState()
    // Click the link that opens new window/tab
    const [newPage] = await Promise.all([
      context.waitForEvent('page'), // wait for the new tab to open
      page.click('a[href="/windows/new"]')
    ]);
    await newPage.waitForLoadState();


    await page.goto('https://the-internet.herokuapp.com/download');

    // Click a file link (choose the first)
    const downloadLink = page.locator('div.example a').first();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadLink.click()
    ]);

    const downloadsPath = path.join(process.cwd(), 'tmp-downloads');
    const suggested = await download.suggestedFilename();
    const savePath = path.join(downloadsPath, suggested);
    await download.saveAs(savePath);
    await page.waitForTimeout(20000)

    await page.route("**/users", route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { id: 23, first_name: 'Mock', last_name: 'User' } })

      })
    })


  })
})
