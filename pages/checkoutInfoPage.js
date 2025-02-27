const { By } = require("selenium-webdriver");


class CheckoutInfoPage {
    constructor(driver) {
        this.driver = driver;
        this.checkoutInfo = By.css(".title");
        this.firstName = By.id('first-name');
        this.lastName = By.id('last-name');
        this.postalCode = By.id('postal-code');
        this.continueButton = By.id('continue');
        this.checkoutOverviewTitle = By.css('.title');
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

    async getTitleText() {
        return await this.driver.findElement(this.checkoutOverviewTitle).getText();
    }

}

module.exports = CheckoutInfoPage;