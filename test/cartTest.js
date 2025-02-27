const { Builder, By } = require('selenium-webdriver');
const assert = require('assert');

const LoginPage = require('../pages/loginPage');
const InventoryPage = require('../pages/inventoryPage');
const CartPage = require('../pages/cartPage');
const chrome = require('selenium-webdriver/chrome');
// const firefox = require('selenium-webdriver/firefox');

// const fs = require('fs');
// const path = require('path');


async function cartTest() {
    describe('Add Item to Cart Test Case', function () {
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
                let cartPage;
                // let testCaseName;

                // Membuat direktori screenshots jika belum ada
                // const screenshotDir = path.join(__dirname, '../screenshots');
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
                    cartPage = new CartPage(driver);

                    await loginPage.open('https://www.saucedemo.com');
                    // Tunggu sampai halaman login siap
                    await loginPage.waitingFieldUsername();
                    //USER SUCCESS LOGIN
                    await loginPage.login("standard_user", "secret_sauce");
                    // Tunggu sampai login berhasil dan halaman inventory muncul
                    await inventoryPage.waitingAppLogo();
                    await inventoryPage.waitingUrl();
                    // Mendapatkan session ID sekarang
                    // const session = await driver.getSession();
                    // sessionId = session.getId();
                    // console.log(`Session ID for ${browser.displayName}: `, sessionId);

                    await inventoryPage.clickAddItem();
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
                    console.log(`Add Item to Cart Testing Success! with browser: ${browser.displayName}\n`);
                });

                it('Go to Cart Page', async function () {
                    await inventoryPage.clickCartButton();
                    const labelDescription = await cartPage.getLabelDescription();

                    assert.strictEqual(
                        labelDescription.includes('Description'),
                        true,
                        'Label Description not Exists'
                    );
                });

                it('Checkout Product Item', async function () {
                    await cartPage.clickCheckoutButton();
                    const checkoutInfo = await cartPage.getCheckoutInfo();

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

cartTest();