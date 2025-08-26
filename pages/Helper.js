import BasePage from "./BasePage";

export default class Helper extends BasePage{
    constructor(page){
        super(page)
        this.page = page
    }

    async addTextInField(selector,randomText){
        let elementLocator = await this.findElementLocator(selector)
        await this.fillInput(elementLocator,randomText)
    }

}