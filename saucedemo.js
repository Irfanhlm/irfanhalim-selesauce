const { Builder, By } = require('selenium-webdriver');
const assert = require('assert');

const LoginPage = require('./pages/loginPage');
const InventoryPage = require('./pages/inventoryPage');
const chrome = require('selenium-webdriver/chrome');
// const firefox = require('selenium-webdriver/firefox');

// const fs = require('fs');
// const path = require('path');


async function saucedemoTest() {
    describe('SAUCEDEMO AUTOMATE TESTING WITH SELENIUM-MOCHA', function () {
        const listBrowser = [
            {
                name: "chrome",
                options: new chrome.Options().addArguments("--headless"),
                displayName: "Chrome"
            },
            // {
            //     name: "firefox",
            //     options: new firefox.Options().addArguments("--headless"),
            //     displayName: "Firefox"
            // },
            // {
            //     name: "chrome",
            //     options: new chrome.Options()
            //         .addArguments("--headless")
            //         .addArguments("--disable-gpu")
            //         .addArguments("--no-sandbox")
            //         .addArguments("--disable-dev-shm-usage")
            //         .setBinaryPath("/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"),
            //     displayName: "Brave"
            // },
        ];

        for (const browser of listBrowser) {
            describe(`Testing with ${browser.displayName}`, function () {
                let driver;
                let sessionId;
                let loginPage;
                let inventoryPage;
                // let testCaseName;

                // Membuat direktori screenshots jika belum ada
                // const screenshotDir = path.join(__dirname, './screenshots');
                // if (!fs.existsSync(screenshotDir)) {
                //     fs.mkdirSync(screenshotDir);
                // }

                before(async function () {
                    this.timeout(30000);
                    driver = await new Builder()
                        .forBrowser(browser.name)
                        .setChromeOptions(
                            (browser.name === "chrome" || browser.name === "brave")
                                ? browser.options
                                : undefined
                        )
                        .setFirefoxOptions(browser.name === "firefox" ? browser.options : undefined)
                        .build();
                    loginPage = new LoginPage(driver);
                    inventoryPage = new InventoryPage(driver);

                    await loginPage.open('https://www.saucedemo.com');
                    // Tunggu sampai halaman login siap
                    await loginPage.waitingFieldUsername();
                    //USER SUCCESS LOGIN
                    await loginPage.login("standard_user", "secret_sauce");
                    // Tunggu sampai login berhasil dan halaman inventory muncul
                    await inventoryPage.waitingAppLogo();
                    await inventoryPage.waitingUrl();
                    // Mendapatkan session ID sekarang
                    const session = await driver.getSession();
                    sessionId = session.getId();
                    console.log(`Session ID for ${browser.displayName}: `, sessionId);
                });

                // beforeEach(function () {
                //     // Mengambil nama test case yang sedang berjalan
                //     testCaseName = this.currentTest.title;
                // });

                // afterEach(async function () {
                //     // Membuat nama file dengan format: browser_testcase_status_timestamp.png
                //     const screenshotPath = path.join(
                //         screenshotDir, 
                //         `${browser.displayName}_${testCaseName.replace(/\s+/g, '_')}.png`
                //     );

                //     // Mengambil screenshot
                //     const image = await driver.takeScreenshot();

                //     // Menyimpan screenshot
                //     fs.writeFileSync(screenshotPath, image, 'base64');
                //     // console.log(`Screenshot saved: ${screenshotPath}`);
                // });

                after(async function () {
                    if (driver) {
                        await driver.quit();
                    }
                    console.log(`Testing Success! with browser: ${browser.displayName}\n\n`);
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

}

saucedemoTest();