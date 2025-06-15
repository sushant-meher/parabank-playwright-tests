// tests/ui/pages/BillPayPage.js
const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

exports.BillPayPage = class BillPayPage extends BasePage {
  constructor(page) {
    super(page);
    this.payeeNameInput = page.locator('[name="payee\\.name"]');
    this.addressInput = page.locator('[name="payee\\.address\\.street"]');
    this.cityInput = page.locator('[name="payee\\.address\\.city"]');
    this.stateInput = page.locator('[name="payee\\.address\\.state"]');
    this.zipCodeInput = page.locator('[name="payee\\.address\\.zipCode"]');
    this.phoneInput = page.locator('[name="payee\\.phoneNumber"]');
    this.accountNumberInput = page.locator('[name="payee\\.accountNumber"]');
    this.verifyAccountNumberInput = page.locator('[name="verifyAccount"]');
    this.amountInput = page.locator('[name="amount"]');
    this.fromAccountSelect = page.locator('[name="fromAccountId"]');
    this.sendPaymentButton = page.locator('[value="Send Payment"]');
    this.billPaySuccessMessage = page.locator('#billpayResult > h1');
  }

  async navigateToBillPay() {
    await this.navigateTo('/parabank/billpay.htm');
    await this.verifyPageTitle('ParaBank | Bill Pay');
  }

  async payBill(billDetails) {
    await this.payeeNameInput.fill(billDetails.payeeName);
    await this.addressInput.fill(billDetails.address);
    await this.cityInput.fill(billDetails.city);
    await this.stateInput.fill(billDetails.state);
    await this.zipCodeInput.fill(billDetails.zipCode);
    await this.phoneInput.fill(billDetails.phone);
    await this.accountNumberInput.fill(billDetails.accountNumber);
    await this.verifyAccountNumberInput.fill(billDetails.accountNumber);
    await this.amountInput.fill(billDetails.amount.toString());
    await this.fromAccountSelect.selectOption({ label: billDetails.fromAccount.toString() });
    await this.sendPaymentButton.click();
  }

  async verifyBillPaymentSuccess(payeeName, amount) {
    await expect(this.billPaySuccessMessage).toBeVisible();
    await expect(this.billPaySuccessMessage).toHaveText('Bill Payment Complete');
    await expect(this.page.locator('#billpayResult').filter({hasText: `Bill Payment to ${payeeName}`})).toBeVisible();
    await expect(this.page.locator('#billpayResult').filter({hasText: `amount of $${amount}`})).toBeVisible();
  }
};