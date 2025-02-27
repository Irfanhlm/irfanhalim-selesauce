const { Builder } = require('selenium-webdriver');
const assert = require('assert');

const LoginPage = require('../pages/loginPage');
const InventoryPage = require('../pages/inventoryPage');
const CartPage = require('../pages/cartPage');
const CheckoutInfoPage = require('../pages/coInfoPage');
const CheckoutOverviewPage = require('../pages/coOverviewPage');
const CheckoutCompletePage = require('../pages/coCompletePage');
const data = require('../fixtures/testData.json');

const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

const fs = require('fs');
const path = require('path');


async function coCompleteTest() {
    describe('Checkout COMPLETE Page Test Case', function () {
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
                let loginPage;
                let inventoryPage;
                let cartPage;
                let checkoutInfoPage;
                let checkoutOverviewPage;
                let checkoutCompletePage;
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
                    checkoutOverviewPage = new CheckoutOverviewPage(driver);
                    checkoutCompletePage = new CheckoutCompletePage(driver);

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

                    //click button add item
                    await inventoryPage.clickAddItem();
                    //click button cart to cart page
                    await inventoryPage.clickCartButton();
                    //click button checkout to checkout information
                    await cartPage.clickCheckoutButton();
                    //fill form checkout information
                    await checkoutInfoPage.fillCheckoutInfo("irfan", "halim", 12345);
                    //click button finish checkout
                    await checkoutOverviewPage.clickFinishButton();
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
                    console.log(`${data.log.testCoComplete}${browser.displayName}\n`);
                });



                it('Checkout: Complete!', async function () {
                    const iconComplete = await checkoutCompletePage.getIconComplete();
                    const checkoutCompletedTitle = await checkoutCompletePage.getHeaderComplete();
                    const checkoutCompletedMessage = await checkoutCompletePage.getTextComplete();
                    const buttonBackhomeEnabled = await checkoutCompletePage.backHomeButtonEnabled();

                    assert.strictEqual(
                        iconComplete,
                        true,
                        'Icon Complete not Exists'
                    );
                    assert.strictEqual(
                        checkoutCompletedTitle.includes('Thank you for your order!'),
                        true,
                        'Checkout Complete Title not Exists'
                    );
                    assert.strictEqual(
                        checkoutCompletedMessage.includes('Your order has been dispatched, and will arrive just as fast as the pony can get there!'),
                        true,
                        'Checkout Complete Message not Exists'
                    );
                    assert.strictEqual(
                        buttonBackhomeEnabled,
                        true,
                        'Back to Home Button not Enabled'
                    );
                });

                it('Back to Home Page or Inventory Page', async function () {
                    await checkoutCompletePage.clickBackHomeButton();
                    const titleText = await inventoryPage.getTitleText();

                    assert.strictEqual(
                        titleText.includes('Swag Labs'),
                        true,
                        'Swag Labs is not contain on page'
                    );

                });

                

            });
        }
    });

}

coCompleteTest();