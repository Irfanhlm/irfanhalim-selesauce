const { By } = require("selenium-webdriver");


class CartPage {
    constructor(driver) {
        this.driver = driver;
        this.cartTitle = By.css(".cart_desc_label");
        this.checkoutButton = By.id("checkout");
    }
    async getLabelDescription() {
        return await this.driver.findElement(this.cartTitle).getText();
    }

    async clickCheckoutButton() {
        await this.driver.findElement(this.checkoutButton).click();
    }

}

module.exports = CartPage;