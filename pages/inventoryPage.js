const { By, until } = require("selenium-webdriver");


class InventoryPage {
    constructor(driver) {
        this.driver = driver;
        this.elementLogo = until.elementLocated(By.css('.app_logo'));
        this.urlInventory = until.urlContains('inventory.html')
    }

    async waitingAppLogo() {
        await this.driver.wait(this.elementLogo), 5000;
    }

    async waitingUrl() {
        await this.driver.wait(this.urlInventory, 5000);
    }
}

module.exports = InventoryPage;