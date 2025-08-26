import BasePage from "./BasePage";

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
}