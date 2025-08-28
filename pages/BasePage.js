// export default class BasePage{
export default class BasePage {
    constructor(page) {
        this.page = page
    }
    async goto(url) {
        await this.page.goto(url);

    }

    async clickElement(locator) {
        await locator.click()
        await this.page.waitForLoadState('networkidle');
    }
    async findElementLocator(selector) {
        let element = await this.page.locator(selector)
        return element
    }
    async findAllElementLocators(selector) {
        let arrElements = await this.page.locator(selector).all()
        return arrElements
    }

    async fillInput(locator, text) {
        await locator.fill(text)
    }

    async fillField(selector, text) {
        await this.page.waitForSelector(selector, { state: 'visible' })
        await this.page.fill(selector, text)
    }
    async findElementLocatorWithGetByRole(role, objRoleArgument) {
        let locator = await this.page.getByRole(role, objRoleArgument)
        return locator
    }

    async getIframe(selector) {
        await this.page.waitForSelector(selector, { state: 'visible' });
        return this.page.frameLocator(selector);
    }

    async fillFieldIframe(frameLocator, fieldSelector, text) {
        await frameLocator.locator(fieldSelector).fill(text);
    }

    async findSelectTagOptionElements(selectLocator) {
        //get all option values
        let allOptionElements = await selectLocator.locator('option').all()
        return allOptionElements
    }

    async selectOption(fieldLocator, optionValue) {
        await fieldLocator.selectOption(optionValue)
    }

    async getAttributeFromLocator(locator, value) {
        return await locator.getAttribute(value)
    }

    async uploadFile(locator, filePath) {
        await locator.setInputFiles(filePath)
    }

    async selectDate(day, month, year) {
        //select date picker year dropdown
        await this.page.locator(".react-datepicker__year-dropdown-container").click()

        //select year
        await this.page.locator(".react-datepicker__year-option").filter({ hasText: year }).click();
        //select date picker month dropdown
        await this.page.locator(".react-datepicker__month-dropdown-container").click()

        //select month
        await this.page.locator(".react-datepicker__month-option").filter({ hasText: month }).click();

        //select Date
        let dateLocator
        if (day.toString().length === 1) {
            dateLocator = `div[class*="react-datepicker__day--00${day}"][aria-label*="${month} ${day}"]` //class* for contains
        } else {
            dateLocator = `div[class*="react-datepicker__day--0${day}"][aria-label*="${month} ${day}"]` //class* for contains
        }
        await this.page.locator(dateLocator).click();
    }
    async clickElementWithJs(selector) {
        await this.page.evaluate((sel) => { document.querySelector(sel).click() }, selector)
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');
    }

    async findLocatorAndGetTextConent(selector) {
        let text = await this.page.locator(selector).textContent()
        return text
    }

    async findLocatorAndGetALLTextContent(selector) {
        // Wait for the last cell of the last row
        await this.page.locator('table tr:last-child td:last-child').waitFor({ state: 'visible' });
        let arrtext = await this.page.locator(selector).allTextContents();
        return arrtext
    }

}