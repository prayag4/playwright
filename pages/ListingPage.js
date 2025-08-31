import { expect } from "@playwright/test";
import BasePage from "./BasePage";

let singleLineIndex
export default class ListingPage extends BasePage {
    constructor(page) {
        super(page)
        this.page = page
        this.deleteButtonSelector = '//button[text()="Delete"]'
    }

    async goToListingPage() {
        await this.goto("/records")
    }

    async clickOnAddButton() {
        let element = await this.findElementLocatorWithGetByRole('button', { name: "Add Record" });
        await this.clickElement(element)
    }

    async getLatestTableValue(columnName) {
        let arrFieldNamesInTable = await this.findLocatorAndGetALLFieldNamesInTable('table thead tr th')
        let columnIndex = (await arrFieldNamesInTable.indexOf(columnName)) + 1
        let latestColumnNameSelector = `table tr:last-child td:nth-child(${columnIndex})`
        let cellValue = await this.findLocatorAndGetTextConent(latestColumnNameSelector)
        return cellValue
    }

    async deleteRecord(fieldValue) {
        let row = await this.findLocatorWithFilterText("table tr", fieldValue)
        let deleteButtonLocator = await this.findLocatorFromLocator(row, this.deleteButtonSelector)
        await this.waitForDialogAndAccept()
        await this.clickElement(deleteButtonLocator)
    }
}