import { expect } from "@playwright/test";
import BasePage from "./BasePage";

let singleLineIndex
export default class ListingPage extends BasePage{
    constructor(page){
        super(page)
        this.page = page
    }

    async goToListingPage(){
        await this.goto("/records")
    }

    async clickOnAddButton(){
        let element = await this.findElementLocatorWithGetByRole('button',{name:"Add Record"});
        await this.clickElement(element)
    }

    async verifyInTable(formData){
        // let id = await this.findElementLocator('table tr td:first-child') //first column
        // let id = await this.findElementLocator('table tr:last-child td:first-child') //last row , first child
      
        let arrFieldNamesInTable = await this.findLocatorAndGetALLTextContent('table thead tr th')
        console.log(arrFieldNamesInTable)
        singleLineIndex = (await arrFieldNamesInTable.indexOf("Single Line")) + 1
        console.log(singleLineIndex)
        let latestsinglelineSelector = `table tr:last-child td:nth-child(${singleLineIndex})`
        console.log(latestsinglelineSelector)
        let addedSingleLineText = await this.findLocatorAndGetTextConent(latestsinglelineSelector)
        expect(addedSingleLineText).toBe(await formData.singleLine)

    }0
}