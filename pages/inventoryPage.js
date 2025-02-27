const { By, until } = require("selenium-webdriver");


class InventoryPage {
    constructor(driver) {
        this.driver = driver;
        this.elementLogo = until.elementLocated(By.css('.app_logo'));
        this.urlInventory = until.urlContains('inventory.html')
        this.appLogo = By.css('.app_logo');
        this.addButton = By.id("add-to-cart-sauce-labs-backpack");
        this.removeButton = By.id("remove-sauce-labs-backpack");
        this.shoppingCartButton = By.css('.shopping_cart_link');
    }

    async waitingAppLogo() {
        await this.driver.wait(this.elementLogo), 5000;
    }

    async waitingUrl() {
        await this.driver.wait(this.urlInventory, 5000);
    }

    async getTitleText() {
        return await this.driver.findElement(this.appLogo).getText();
    }

    async clickAddItem() {
        await this.driver.findElement(this.addButton).click();
    }

    async isRemoveButtonText() {
        return await this.driver.findElement(this.removeButton).getText();
    }

    async isRemoveButtonEnabled() {
        return await this.driver.findElement(this.removeButton).isEnabled();
    }

    async isCartButtonDisplayed() {
        return await this.driver.findElement(this.shoppingCartButton).isDisplayed();
    }

    async clickCartButton() {
        await this.driver.findElement(this.shoppingCartButton).click();
    }
}

module.exports = InventoryPage;