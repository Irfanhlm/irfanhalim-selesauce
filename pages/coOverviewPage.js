const { By } = require("selenium-webdriver");


class CheckoutOverviewPage {
    constructor(driver) {
        this.driver = driver;
        this.checkoutOverviewTitle = By.css(".title");
        this.paymentInfo = By.xpath("//div[.='Payment Information:']");
        this.shippingInfo = By.xpath("//div[.='Shipping Information:']");
        this.priceInfo = By.xpath("//div[.='Price Total']");
        this.finishButton = By.id("finish");
    }

    async getTitleText() {
        return await this.driver.findElement(this.checkoutOverviewTitle).getText();
    }

    async getPaymentInfo() {
        return await this.driver.findElement(this.paymentInfo).getText();
    }

    async getShippingInfo() {
        return await this.driver.findElement(this.shippingInfo).getText();
    }

    async getPriceInfo() {
        return await this.driver.findElement(this.priceInfo).getText();
    }

    async clickFinishButton() {
        await this.driver.findElement(this.finishButton).click();
    }

}

module.exports = CheckoutOverviewPage;