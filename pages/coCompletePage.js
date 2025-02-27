const { By } = require("selenium-webdriver");


class CheckoutCompletePage {
    constructor(driver) {
        this.driver = driver;
        this.checkoutCompleteTitle = By.css(".title");
        this.iconComplete = By.css("[alt='Pony Express']");
        this.headerComplete = By.css(".complete-header");
        this.textComplete = By.css(".complete-text");
        this.backHomeButton = By.id("back-to-products");
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

module.exports = CheckoutCompletePage;