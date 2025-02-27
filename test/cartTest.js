const { Builder } = require('selenium-webdriver');
const assert = require('assert');

const LoginPage = require('../pages/loginPage');
const InventoryPage = require('../pages/inventoryPage');
const CartPage = require('../pages/cartPage');
const CheckoutInfoPage = require('../pages/coInfoPage');
const data = require('../fixtures/testData.json');

const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

const fs = require('fs');
const path = require('path');


async function cartTest() {
    describe('Add Item to CART Test Case', function () {
        const listBrowser = [
            {
                name: "chrome",
                options: new chrome.Options().addArguments("--headless"),
                displayName: "Chrome"
            },
            {
                name: "firefox",
                options: new firefox.Options().addArguments("--headless"),
                displayName: "Firefox"
            },
            {
                name: "chrome",
                options: new chrome.Options()
                    .addArguments("--headless")
                    .addArguments("--disable-gpu")
                    .addArguments("--no-sandbox")
                    .addArguments("--disable-dev-shm-usage")
                    .setBinaryPath("/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"),
                displayName: "Brave"
            },
        ];

        for (const browser of listBrowser) {
            describe(`Testing with ${browser.displayName}`, function () {
                let driver;
                let sessionId;
                let loginPage;
                let inventoryPage;
                let cartPage;
                let checkoutInfoPage;
                let testCaseName;

                // Membuat direktori screenshots jika belum ada
                const screenshotDir = path.join(__dirname, '../screenshots');
                if (!fs.existsSync(screenshotDir)) {
                    fs.mkdirSync(screenshotDir);
                }


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
                    checkoutInfoPage = new CheckoutInfoPage(driver);

                    await loginPage.open(data.baseUrl);
                    // Tunggu sampai halaman login siap
                    await loginPage.waitingFieldUsername();
                    //USER SUCCESS LOGIN
                    await loginPage.login(data.User.username, data.User.password);
                    // Tunggu sampai login berhasil dan halaman inventory muncul
                    await inventoryPage.waitingAppLogo();
                    await inventoryPage.waitingUrl();
                    // Mendapatkan session ID sekarang
                    // const session = await driver.getSession();
                    // sessionId = session.getId();
                    // console.log(`Session ID for ${browser.displayName}: `, sessionId);

                    await inventoryPage.clickAddItem();
                });

                beforeEach(function () {
                    // Mengambil nama test case yang sedang berjalan
                    testCaseName = this.currentTest.title;
                });

                afterEach(async function () {
                    // Membuat nama file dengan format: browser_testcase_status_timestamp.png
                    const screenshotPath = path.join(
                        screenshotDir, 
                        `${browser.displayName}_${testCaseName.replace(/\s+/g, '_')}.png`
                    );

                    // Mengambil screenshot
                    const image = await driver.takeScreenshot();

                    // Menyimpan screenshot
                    fs.writeFileSync(screenshotPath, image, 'base64');
                    // console.log(`Screenshot saved: ${screenshotPath}`);
                });

                after(async function () {
                    if (driver) {
                        await driver.quit();
                    }
                    console.log(`${data.log.testCart}${browser.displayName}\n`);
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
                    const checkoutInfo = await checkoutInfoPage.getCheckoutInfo();

                    assert.strictEqual(
                        checkoutInfo.includes('Checkout: Your Information'),
                        true,
                        'Checkout Info not Exists'
                    );
                });
                
                

            });
        }
    });

}

cartTest();