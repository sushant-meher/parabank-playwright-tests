// tests/ui/pages/TransferFundsPage.js
const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

exports.TransferFundsPage = class TransferFundsPage extends BasePage {
  constructor(page) {
    super(page);
    this.amountInput = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');
    this.transferButton = page.getByRole('button', { name: 'Transfer' });
    this.transferCompleteMessage = page.locator('#showResult h1.title');
  }

  async navigateToTransferFunds() {
    await this.navigateTo('/parabank/transfer.htm');
    await this.verifyPageTitle('ParaBank | Transfer Funds');
  }

  async transferFunds(amount, fromAccount, toAccount) {
    await this.amountInput.fill(amount.toString());
    await this.fromAccountSelect.selectOption({ label: fromAccount.toString() });
    await this.toAccountSelect.selectOption({ label: toAccount.toString() });
    await this.transferButton.click();
  }

  async verifyTransferSuccess(amount, fromAccount, toAccount) {
    await expect(this.transferCompleteMessage).toBeVisible();
    await expect(this.transferCompleteMessage).toHaveText('Transfer Complete!');
    await expect(this.page.locator('#showResult').filter({hasText: `$${amount}`})).toBeVisible();
    await expect(this.page.locator('#showResult').filter({hasText: `from account #${fromAccount}`})).toBeVisible();
    await expect(this.page.locator('#showResult').filter({hasText: `to account #${toAccount}`})).toBeVisible();
  }
};