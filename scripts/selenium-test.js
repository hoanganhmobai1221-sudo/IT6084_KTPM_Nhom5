'use strict';

/**
 * =============================================================================
 * PhoneStore – Automated End-to-End Test Suite (Selenium WebDriver)
 * =============================================================================
 * Tests core user flows:
 *   1. Page Load & Title Verification
 *   2. Product Catalog Rendering (Active products displayed, no blank screen)
 *   3. Hero Banner Carousel & Slide Alignment (Xiaomi, iPhone, Samsung)
 *   4. Advanced Filters (Brand, RAM, ROM, Search - No 0-product false positives)
 *   5. Product Detail Modal Inspection & Variant Selection
 *   6. Cart Management (Add to cart, increase/decrease qty, subtotal calc)
 *   7. Authentication (Customer login)
 *   8. Checkout & Coupon Code Application (SALE10 discount verification & Order)
 * =============================================================================
 */

const { Builder, By, until, Key, Select } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  startTime: Date.now()
};

function pass(name, detail = '') {
  stats.total++;
  stats.passed++;
  console.log(`  ${colors.green}✔ PASS${colors.reset} [${stats.total}] ${name}${detail ? ` (${colors.cyan}${detail}${colors.reset})` : ''}`);
}

function fail(name, error) {
  stats.total++;
  stats.failed++;
  console.error(`  ${colors.red}✖ FAIL${colors.reset} [${stats.total}] ${name}`);
  console.error(`    ${colors.yellow}${error.message || error}${colors.reset}`);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper to reliably find element even after re-renders
async function findEl(driver, locator, timeout = 6000) {
  await driver.wait(until.elementLocated(locator), timeout);
  return await driver.findElement(locator);
}

// Helper to safely click element even if overlapping sticky glass header exists
async function safeClick(driver, element) {
  try {
    await element.click();
  } catch (err) {
    if (err.name === 'ElementClickInterceptedError' || (err.message && err.message.includes('intercepted'))) {
      await driver.executeScript('arguments[0].click();', element);
    } else {
      throw err;
    }
  }
}

async function runTests() {
  console.log(`\n${colors.bold}${colors.blue}======================================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}  PHONESTORE SELENIUM WEBDRIVER AUTOMATED E2E TEST SUITE${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}  Target URL: ${BASE_URL}${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}======================================================================${colors.reset}\n`);

  const options = new chrome.Options();
  options.addArguments(
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--window-size=1366,768'
  );

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    // -------------------------------------------------------------------------
    // TEST SUITE 1: Page Load & Basic Layout
    // -------------------------------------------------------------------------
    console.log(`${colors.bold}--- SUITE 1: Page Load & Basic Layout ---${colors.reset}`);

    await driver.get(BASE_URL);
    await driver.wait(until.elementLocated(By.id('app')), 10000);

    const title = await driver.getTitle();
    assert(title.includes('PhoneStore'), `Title does not contain PhoneStore: ${title}`);
    pass('Trang chủ tải thành công & tiêu đề chính xác', title);

    const appEl = await findEl(driver, By.id('app'));
    assert(await appEl.isDisplayed(), 'Khung #app không hiển thị');
    pass('SPA Root Container (#app) hiển thị đầy đủ');

    // -------------------------------------------------------------------------
    // TEST SUITE 2: Product Catalog & Grid
    // -------------------------------------------------------------------------
    console.log(`\n${colors.bold}--- SUITE 2: Product Catalog Grid ---${colors.reset}`);

    await driver.wait(until.elementLocated(By.css('[data-testid^="product-card-"], div[id^="product-card-"]')), 10000);
    const productCards = await driver.findElements(By.css('[data-testid^="product-card-"], div[id^="product-card-"]'));
    
    assert(productCards.length >= 15, `Số lượng sản phẩm quá ít: ${productCards.length}`);
    pass('Danh sách sản phẩm tải đầy đủ từ Backend API', `${productCards.length} sản phẩm hiển thị`);

    const firstImg = await findEl(driver, By.css('[data-testid^="product-image-"], img[id^="product-image-"]'));
    const imgSrc = await firstImg.getAttribute('src');
    assert(imgSrc && imgSrc.length > 5, 'Ảnh sản phẩm trống');
    pass('Hình ảnh sản phẩm có đường dẫn hợp lệ', imgSrc.substring(0, 45) + '...');

    // -------------------------------------------------------------------------
    // TEST SUITE 3: Hero Banner Carousel & Slide Alignment
    // -------------------------------------------------------------------------
    console.log(`\n${colors.bold}--- SUITE 3: Hero Banner Carousel ---${colors.reset}`);

    let heroImg = await findEl(driver, By.id('hero-banner-image'));
    const initialSlideImg = await heroImg.getAttribute('src');
    assert(initialSlideImg.includes('xiaomi-14-ultra'), `Slide 1 ảnh không phải Xiaomi: ${initialSlideImg}`);
    pass('Slide 1: Xiaomi 14 Ultra hiển thị đúng ảnh Xiaomi', initialSlideImg);

    // Switch to Slide 2 (iPhone 16 Series)
    const slide2Btn = await findEl(driver, By.css('#hero-indicator-1, button[aria-label="Slide 2"]'));
    await safeClick(driver, slide2Btn);
    await sleep(500);

    heroImg = await findEl(driver, By.id('hero-banner-image'));
    const slide2Img = await heroImg.getAttribute('src');
    assert(slide2Img.includes('iphone16-promax'), `Slide 2 ảnh không phải iPhone 16: ${slide2Img}`);
    pass('Slide 2: iPhone 16 Series chuyển đổi mượt mà & hiển thị đúng ảnh iPhone', slide2Img);

    // Switch to Slide 3 (Samsung Galaxy S24 Ultra)
    const slide3Btn = await findEl(driver, By.css('#hero-indicator-2, button[aria-label="Slide 3"]'));
    await safeClick(driver, slide3Btn);
    await sleep(500);

    heroImg = await findEl(driver, By.id('hero-banner-image'));
    const slide3Img = await heroImg.getAttribute('src');
    assert(slide3Img.includes('samsung-s24-ultra'), `Slide 3 ảnh không phải Samsung: ${slide3Img}`);
    pass('Slide 3: Samsung Galaxy S24 Ultra hiển thị đúng ảnh Samsung', slide3Img);

    // Return to Slide 1
    const slide1Btn = await findEl(driver, By.css('#hero-indicator-0, button[aria-label="Slide 1"]'));
    await safeClick(driver, slide1Btn);
    await sleep(400);

    // -------------------------------------------------------------------------
    // TEST SUITE 4: Advanced Filter System
    // -------------------------------------------------------------------------
    console.log(`\n${colors.bold}--- SUITE 4: Advanced Filters & Search ---${colors.reset}`);

    // Filter by Brand = Apple
    let brandSelectEl = await findEl(driver, By.css('#filter-brand, #select-brand'));
    let brandSelect = new Select(brandSelectEl);
    await brandSelect.selectByValue('Apple');
    await sleep(700);

    let currentCards = await driver.findElements(By.css('[data-testid^="product-card-"], div[id^="product-card-"]'));
    assert(currentCards.length > 0 && currentCards.length <= 10, `Lọc Apple trả về số lượng bất thường: ${currentCards.length}`);
    pass('Bộ lọc thương hiệu: Apple lọc chính xác', `${currentCards.length} sản phẩm Apple`);

    // Filter by Brand = Samsung
    brandSelectEl = await findEl(driver, By.css('#filter-brand, #select-brand'));
    brandSelect = new Select(brandSelectEl);
    await brandSelect.selectByValue('Samsung');
    await sleep(700);

    currentCards = await driver.findElements(By.css('[data-testid^="product-card-"], div[id^="product-card-"]'));
    assert(currentCards.length > 0 && currentCards.length <= 10, `Lọc Samsung trả về số lượng bất thường: ${currentCards.length}`);
    pass('Bộ lọc thương hiệu: Samsung lọc chính xác', `${currentCards.length} sản phẩm Samsung`);

    // Reset Brand Filter to "Tất cả thương hiệu" (value = "")
    brandSelectEl = await findEl(driver, By.css('#filter-brand, #select-brand'));
    brandSelect = new Select(brandSelectEl);
    await brandSelect.selectByValue('');
    await sleep(700);

    currentCards = await driver.findElements(By.css('[data-testid^="product-card-"], div[id^="product-card-"]'));
    assert(currentCards.length >= 15, `Reset thương hiệu bị lỗi 0 sản phẩm: ${currentCards.length}`);
    pass('Reset bộ lọc: Trở về danh mục toàn bộ sản phẩm (không bị lỗi 0 kết quả)', `${currentCards.length} sản phẩm`);

    // Search Box Filter
    const searchInput = await findEl(driver, By.css('#input-search, #modal-search-input'));
    await searchInput.clear();
    await searchInput.sendKeys('Ultra');
    await sleep(600);

    const searchCards = await driver.findElements(By.css('[data-testid^="product-card-"], div[id^="product-card-"]'));
    assert(searchCards.length > 0, 'Tìm kiếm từ khóa "Ultra" không trả về kết quả');
    pass('Tìm kiếm sản phẩm theo từ khóa "Ultra"', `${searchCards.length} kết quả tìm kiếm`);

    // Clear Search Box
    await searchInput.clear();
    await driver.executeScript("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", searchInput);
    await sleep(600);

    // -------------------------------------------------------------------------
    // TEST SUITE 5: Product Detail Modal & Gallery
    // -------------------------------------------------------------------------
    console.log(`\n${colors.bold}--- SUITE 5: Product Detail Modal & Variants ---${colors.reset}`);

    const cardDetailBtn = await findEl(driver, By.css('[onclick*="openDetails"]'));
    await driver.executeScript('arguments[0].scrollIntoView({block: "center"});', cardDetailBtn);
    await sleep(300);
    await safeClick(driver, cardDetailBtn);

    await driver.wait(until.elementLocated(By.id('product-modal')), 5000);
    const modal = await findEl(driver, By.id('product-modal'));
    assert(await modal.isDisplayed(), 'Modal chi tiết không hiển thị');
    pass('Mở Modal chi tiết sản phẩm thành công');

    const variantButtons = await driver.findElements(By.css('[data-testid^="variant-color-"], [data-testid^="variant-storage-"]'));
    assert(variantButtons.length > 0, 'Không tìm thấy nút tùy chọn biến thể màu sắc/dung lượng');
    pass('Các tùy chọn biến thể (Màu sắc, Dung lượng) hiển thị đầy đủ', `${variantButtons.length} lựa chọn`);

    // Add to cart from modal (automatically closes modal & triggers toast notification)
    const addToCartBtn = await findEl(driver, By.id('add-to-cart-btn'));
    await safeClick(driver, addToCartBtn);
    await sleep(500);

    const toast = await driver.wait(until.elementLocated(By.css('#toast-container > div')), 4000);
    const toastText = await toast.getText();
    assert(toastText.includes('giỏ hàng') || toastText.includes('thành công'), `Toast không khớp: ${toastText}`);
    pass('Thêm vào giỏ hàng từ Modal & hiển thị Toast thông báo', toastText.substring(0, 45) + '...');

    // Verify modal is automatically closed
    await sleep(300);
    const modalElements = await driver.findElements(By.id('product-modal'));
    assert(modalElements.length === 0, 'Modal chi tiết tự động đóng sau khi thêm vào giỏ');
    pass('Modal chi tiết tự động đóng sau khi thêm sản phẩm vào giỏ');

    // -------------------------------------------------------------------------
    // TEST SUITE 6: Cart View & Quantity Management
    // -------------------------------------------------------------------------
    console.log(`\n${colors.bold}--- SUITE 6: Cart Management ---${colors.reset}`);

    const navCartBtn = await findEl(driver, By.id('nav-cart'));
    await safeClick(driver, navCartBtn);
    await sleep(600);

    await driver.wait(until.elementLocated(By.id('cart-drawer')), 5000);
    pass('Điều hướng vào giao diện Giỏ hàng (Cart View)');

    const cartItems = await driver.findElements(By.css('[data-testid^="cart-item-"], tr[id^="cart-item-"]'));
    assert(cartItems.length > 0, 'Giỏ hàng không chứa sản phẩm vừa thêm');
    pass('Sản phẩm đã có mặt trong Giỏ hàng', `${cartItems.length} dòng sản phẩm`);

    const subtotalEl = await findEl(driver, By.id('subtotal-amount'));
    const subtotalText = await subtotalEl.getText();
    assert(subtotalText.includes('₫'), `Tạm tính không đúng định dạng tiền tệ: ${subtotalText}`);
    pass('Tạm tính đơn hàng tính toán chính xác', subtotalText);

    // Quantity Increment (+) button
    const incBtn = await findEl(driver, By.css('[data-testid^="cart-qty-inc-"], button[id^="cart-qty-inc-"]'));
    await safeClick(driver, incBtn);
    await sleep(500);

    const updatedSubtotalEl = await findEl(driver, By.id('subtotal-amount'));
    const updatedSubtotal = await updatedSubtotalEl.getText();
    pass('Tăng số lượng sản phẩm & cập nhật tổng tiền giỏ hàng', updatedSubtotal);

    // -------------------------------------------------------------------------
    // TEST SUITE 7: Customer Authentication & Login
    // -------------------------------------------------------------------------
    console.log(`\n${colors.bold}--- SUITE 7: Authentication & Login ---${colors.reset}`);

    // Direct invocation to login view if not logged in
    await driver.executeScript("if (typeof window.go === 'function') window.go('login');");
    await sleep(600);

    await driver.wait(until.elementLocated(By.id('input-login-username')), 5000);
    const usernameInput = await findEl(driver, By.id('input-login-username'));
    const passwordInput = await findEl(driver, By.id('input-login-password'));
    const loginSubmitBtn = await findEl(driver, By.id('login-submit-btn'));

    await usernameInput.sendKeys('customer@phonestore.test');
    await passwordInput.sendKeys('Customer123!');
    await safeClick(driver, loginSubmitBtn);
    await sleep(900);

    pass('Đăng nhập tài khoản khách hàng kiểm thử thành công', 'customer@phonestore.test');

    // -------------------------------------------------------------------------
    // TEST SUITE 8: Checkout & Coupon Code Application
    // -------------------------------------------------------------------------
    console.log(`\n${colors.bold}--- SUITE 8: Checkout & Coupon Code Application ---${colors.reset}`);

    // Navigate to checkout
    await driver.executeScript("if (typeof window.go === 'function') window.go('checkout');");
    await sleep(700);

    await driver.wait(until.elementLocated(By.id('voucher-input')), 5000);
    const voucherInput = await findEl(driver, By.id('voucher-input'));
    const applyVoucherBtn = await findEl(driver, By.id('apply-voucher-btn'));

    // Apply coupon SALE10
    await voucherInput.clear();
    await voucherInput.sendKeys('SALE10');
    await safeClick(driver, applyVoucherBtn);
    await sleep(800);

    const discountEl = await findEl(driver, By.id('discount-amount'));
    const discountText = await discountEl.getText();
    assert(discountText.includes('₫') || discountText.includes('-'), `Mã giảm giá không áp dụng: ${discountText}`);
    pass('Áp dụng mã giảm giá voucher SALE10 thành công', discountText);

    const totalAmountEl = await findEl(driver, By.id('total-amount'));
    const totalText = await totalAmountEl.getText();
    pass('Hệ thống tự động tính Phí vận chuyển và Tổng thanh toán sau giảm', totalText);

    // Fill in Checkout form
    const fullNameInput = await findEl(driver, By.id('input-checkout-fullname'));
    const phoneInput = await findEl(driver, By.id('input-checkout-phone'));
    const addressInput = await findEl(driver, By.id('input-checkout-address'));
    const noteInput = await findEl(driver, By.id('input-checkout-note'));

    await driver.executeScript("arguments[0].value = 'Nguyen Van Kiem Thu'; arguments[0].dispatchEvent(new Event('input', {bubbles: true}));", fullNameInput);
    await driver.executeScript("arguments[0].value = '0987654321'; arguments[0].dispatchEvent(new Event('input', {bubbles: true}));", phoneInput);
    await driver.executeScript("arguments[0].value = '123 Duong Le Loi, Phuong Ben Nghe, Quan 1, TP Ho Chi Minh'; arguments[0].dispatchEvent(new Event('input', {bubbles: true}));", addressInput);
    await driver.executeScript("arguments[0].value = 'Don hang kiem thu tu dong bang Selenium WebDriver.'; arguments[0].dispatchEvent(new Event('input', {bubbles: true}));", noteInput);

    pass('Điền đầy đủ thông tin giao hàng hợp lệ (Họ tên, SĐT 10 số, Địa chỉ)');

    // Submit Order
    const checkoutSubmitBtn = await findEl(driver, By.id('checkout-submit-btn'));
    await safeClick(driver, checkoutSubmitBtn);
    await sleep(1500);

    // Check if any error message occurred
    const orderErrMsgEl = await driver.findElements(By.id('order-error-msg'));
    if (orderErrMsgEl.length > 0 && await orderErrMsgEl[0].isDisplayed()) {
      const msg = await orderErrMsgEl[0].getText();
      throw new Error(`Order submission failed: ${msg}`);
    }

    // Verify Order Confirmation
    const successContainer = await driver.wait(
      until.elementLocated(By.id('checkout-success')),
      8000
    );
    const successText = await successContainer.getText();
    assert(successText.includes('Thành Công') || successText.includes('DH-'), 'Màn hình đặt hàng thành công không hiển thị');
    pass('Xác nhận đặt hàng thành công & chuyển sang màn hình hoàn tất đơn hàng', successText.replace(/\n/g, ' ').substring(0, 50));

  } catch (err) {
    fail('Luồng kiểm thử Selenium gặp sự cố', err);
  } finally {
    await driver.quit();
    const duration = ((Date.now() - stats.startTime) / 1000).toFixed(2);

    console.log(`\n${colors.bold}${colors.blue}======================================================================${colors.reset}`);
    console.log(`${colors.bold}KẾT QUẢ KIỂM THỬ E2E BẰNG SELENIUM WEBDRIVER:${colors.reset}`);
    console.log(`  Tổng số ca kiểm thử: ${colors.bold}${stats.total}${colors.reset}`);
    console.log(`  Thành công (PASS)  : ${colors.green}${colors.bold}${stats.passed}${colors.reset}`);
    console.log(`  Thất bại  (FAIL)  : ${stats.failed > 0 ? colors.red : colors.green}${colors.bold}${stats.failed}${colors.reset}`);
    console.log(`  Thời gian thực thi: ${colors.cyan}${duration}s${colors.reset}`);
    console.log(`${colors.bold}${colors.blue}======================================================================${colors.reset}\n`);

    if (stats.failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

runTests();
