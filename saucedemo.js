const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

async function saucedemoTest() {
    let driver = new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://www.saucedemo.com');

        //USER SUCCESS LOGIN
        let usernameInput = await driver.findElement(By.id('user-name'));
        let passwordInput = await driver.findElement(By.id('password'));
        let loginButton = await driver.findElement(By.name('login-button'));

        await usernameInput.sendKeys('standard_user');
        await passwordInput.sendKeys('secret_sauce');
        await loginButton.click();

        //VALIDATE USER ON DASHBOARD AFTER LOGIN
        let titleText = await driver.findElement(By.xpath("//div[@class='app_logo']")).getText();
        assert.strictEqual(
            titleText.includes('Swag Labs'),
            true,
            'Swag Labs is not contain on page'
        );

        let currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(
            currentUrl.includes('https://www.saucedemo.com/inventory.html'),
            true,
            'URL does not match, user is not on the dashboard page.'
        );

        //ADD ITEM TO CART
        let buttonAddItem = await driver.findElement(By.id("add-to-cart-sauce-labs-backpack"));
        await buttonAddItem.click();

        //VALIDATE ITEM SUCCESS ADDED TO CART
        let buttonRemoveEnabled = await driver.findElement(By.id("remove-sauce-labs-backpack")).getText();
        assert.strictEqual(
            buttonRemoveEnabled.includes('Remove'), 
            true, 
            'Button Remove not Exists'
        );

        let buttonRemove = await driver.findElement(By.id("remove-sauce-labs-backpack")).isEnabled();
        assert.strictEqual(
            buttonRemove,
            true, 
            'Button Remove is not Enabled'
        );

        let shoppingCart = await driver.findElement(By.css(".shopping_cart_badge")).isDisplayed();
        assert.strictEqual(
            shoppingCart,
            true, 
            'Shopping Cart is not displayed'
        );

        
    } catch (error) {
        console.error('Login failed: ', error);
    } finally {
        await driver.quit();
    }
}



saucedemoTest();