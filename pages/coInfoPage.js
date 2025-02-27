const { By } = require("selenium-webdriver");


class CheckoutInfoPage {
    constructor(driver) {
        this.driver = driver;
        this.checkoutInfo = By.css(".title");
        this.firstName = By.id("first-name");
        this.lastName = By.id("last-name");
        this.postalCode = By.id("postal-code");
        this.continueButton = By.id("continue");


        this.checkoutCompleteTitle = By.css(".title");
        this.iconComplete = By.css("[alt='Pony Express']");
        this.headerComplete = By.css(".complete-header");
        this.textComplete = By.css(".complete-text");
        this.backHomeButton = By.id("back-to-products");
    }

    async getCheckoutInfo() {
        return await this.driver.findElement(this.checkoutInfo).getText();
    }

    async fillCheckoutInfo(firstName, lastName, postalCode) {
        await this.driver.findElement(this.firstName).sendKeys(firstName);
        await this.driver.findElement(this.lastName).sendKeys(lastName);
        await this.driver.findElement(this.postalCode).sendKeys(postalCode);
        await this.driver.findElement(this.continueButton).click();
    }





    async getCheckoutComplete() {
        return await this.driver.findElement(this.checkoutCompleteTitle).getText();
    }

    async getIconComplete() {
        return await this.driver.findElement(this.iconComplete).isDisplayed();
    }

    async getHeaderComplete() {
        return await this.driver.findElement(this.headerComplete).getText();
    }

    async getTextComplete() {
        return await this.driver.findElement(this.textComplete).getText();
    }

    async backHomeButtonEnabled() {
        return await this.driver.findElement(this.backHomeButton).isDisplayed();
    }

    async clickBackHomeButton() {
        await this.driver.findElement(this.backHomeButton).click();
    }

}

module.exports = CheckoutInfoPage;