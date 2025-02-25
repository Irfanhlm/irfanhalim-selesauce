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

    for (const browser of listBrowser) {
        describe(`Testing with ${browser.name}`, function () {
            let driver;
            let sessionId;

            before(async function () {
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

            after(async function () {
                console.log(`Testing Success! with browser: ${browser.name}`);
                if (driver) {
                    await driver.quit();
                }
            });

            it('User Success Login', async function () {
                let titleText = await driver.findElement(By.xpath("//div[@class='app_logo']")).getText();
                assert.strictEqual(
                    titleText.includes('Swag Labs'),
                    true,
                    'Swag Labs is not contain on page'
                );
            });

            it('Validation User After Login', async function () {
                let currentUrl = await driver.getCurrentUrl();
                assert.strictEqual(
                    currentUrl.includes('https://www.saucedemo.com/inventory.html'),
                    true,
                    'URL does not match, user is not on the dashboard page.'
                );
            });

            it('Add Item to Cart', async function () {
                let buttonAddItem = await driver.findElement(By.id("add-to-cart-sauce-labs-backpack"));
                await buttonAddItem.click();
            });

            it('Validation Item Success Added to Cart', async function () {
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
            });

            it('Go to Cart Page', async function () {
                let buttonCart = await driver.findElement(By.css(".shopping_cart_link"));
                await buttonCart.click();

                let labelDescription = await driver.findElement(By.css(".cart_desc_label")).getText();
                assert.strictEqual(
                    labelDescription.includes('Description'),
                    true,
                    'Label Description not Exists'
                );
            });

            it('Checkout Product Item', async function () {
                let buttonCheckout = await driver.findElement(By.id("checkout"));
                await buttonCheckout.click();

                let checkoutInfo = await driver.findElement(By.css(".title")).getText();
                assert.strictEqual(
                    checkoutInfo.includes('Checkout: Your Information'),
                    true,
                    'Checkout Info not Exists'
                );
            });

            it('Fill Checkout: Your Information', async function () {
                let firstName = await driver.findElement(By.id('first-name'));
                let lastName = await driver.findElement(By.id('last-name'));
                let zip = await driver.findElement(By.id('postal-code'));
                let continueButton = await driver.findElement(By.id('continue'));

                await firstName.sendKeys('Irfan');
                await lastName.sendKeys('Halim');
                await zip.sendKeys('12345');
                await continueButton.click();

                let checkoutOverview = await driver.findElement(By.css('.title')).getText();
                assert.strictEqual(
                    checkoutOverview.includes('Checkout: Overview'),
                    true,
                    'Checkout Overview not Exists'
                );
            });
        });
    }
});