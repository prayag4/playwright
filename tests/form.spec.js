import { test, expect } from '@playwright/test'
import FormPage from "../pages/FormPage"
import ListingPage from "../pages/ListingPage"
import RandomUtility from "../utility/RandomUtility"


let formPage
let listingPage
let objRandomUtility
let formData = {}

test.describe('CRUD operations',()=>{
    test.beforeEach('Make page objects',async ({page})=>{
        if((process.env.BASE_URL).includes("localhost")){
            await page.evaluate(() => {
            document.querySelectorAll('nextjs-portal').forEach(el => el.style.display = 'none'); 
          });
        }
        formPage = new FormPage(page)
        listingPage = new ListingPage(page)
        objRandomUtility = new RandomUtility()
    })
    test('Verify that record can be added',async({page})=>{
        await listingPage.goToListingPage();
        await listingPage.clickOnAddButton();

        //data preparation
        formData.singleLine = await objRandomUtility.generateRandomString()
        formData.multiLine = await objRandomUtility.generateMultipleLineContent()
        formData.editor = await objRandomUtility.generateMultipleLineContent()
        formData.number = await objRandomUtility.generateRandomNumber()
        formData.email =  await objRandomUtility.generateRandomEmail()
        formData.phone = await objRandomUtility.generateFakePhoneNumber()
        formData.singleSelection = "random"
        formData.multiSelection = "random"
        formData.file = "utility/test.png" //always set according to on which level playwright is executing
        formData.radioButton = "random"
        formData.checkbox = "random"
        formData.datePicker = await objRandomUtility.getRandomDate()
        formData.dateRange = await objRandomUtility.getRandomDateRange()
        formData.timePicker =  await objRandomUtility.generateRandomTime()
        formData.location =  await objRandomUtility.getRandomLatLong()

        let updatedFormData = await formPage.fillForm(formData)
        await formPage.submitForm()
        console.log(updatedFormData)

    })
})
