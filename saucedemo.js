const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
// const safari = require('selenium-webdriver/safari');

describe('SAUCEDEMO AUTOMATE TESTING WITH SELENIUM-MOCHA', function () {
    const listBrowser = [
        {
            name: "chrome",
            options: new chrome.Options().addArguments("--headless"),
        },
        {
            name: "firefox",
            options: new firefox.Options().addArguments("--headless"),
        },
        // {
        //     name: "safari",
        //     options: new safari.Options(), // Safari tidak mendukung mode headless
        // },
    ];

    listBrowser.forEach(function(browser) {
        describe(`Testing with ${browser.name}`, function() {
            let driver;
            let sessionId;

            before(async function() {
                this.timeout(30000);
                driver = await new Builder()
                    .forBrowser(browser.name)
                    .setChromeOptions(browser.name === "chrome" ? browser.options : undefined)
                    .setFirefoxOptions(browser.name === "firefox" ? browser.options : undefined)
                    // .setSafariOptions(browser.name === "safari" ? browser.options : undefined)
                    .build();

                await driver.get('https://www.saucedemo.com');

                // Tunggu sampai halaman login siap
                await driver.wait(until.elementLocated(By.id('user-name')), 5000);

                //USER SUCCESS LOGIN
                let usernameInput = await driver.findElement(By.id('user-name'));
                let passwordInput = await driver.findElement(By.id('password'));
                let loginButton = await driver.findElement(By.name('login-button'));

                await usernameInput.sendKeys('standard_user');
                await passwordInput.sendKeys('secret_sauce');
                await loginButton.click();

                // Tunggu sampai login berhasil dan halaman inventory muncul
                await driver.wait(until.elementLocated(By.css('.app_logo')), 5000);
                await driver.wait(until.urlContains('inventory.html'), 5000);

                const session = await driver.getSession();
                sessionId = session.getId();
                console.log(`Session ID for ${browser.name}: `, sessionId);
            });

            after(async function() {
                console.log(`Testing Success! with browser: ${browser.name}`);
                if (driver) {
                    await driver.quit();
                }
            });

            it('Validation User After Login', async function() {
                try {
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
                } catch (error) {
                    console.error(`Error in ${browser.name}: `, error);
                }
            });

            it('Add Item to Cart', async function() {
                try {
                    let buttonAddItem = await driver.findElement(By.id("add-to-cart-sauce-labs-backpack"));
                    await buttonAddItem.click();
                } catch (error) {
                    console.error(`Error in ${browser.name}: `, error);
                }
            });

            it('Validation Item Success Added to Cart', async function() {
                try {
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
                    console.error(`Error in ${browser.name}: `, error);
                }
            });
        });
    });
});