// tests/ui/pages/OpenNewAccountPage.js
const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

exports.OpenNewAccountPage = class OpenNewAccountPage extends BasePage {
  constructor(page) {
    super(page);
    this.accountTypeSelect = page.locator('#type');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.openNewAccountButton = page.locator('input.button[value="Open New Account"]');
    this.newAccountIdLink = page.locator('#newAccountId');
    this.successMessage = page.locator('#openAccountResult > h1');
  }

  async navigateToOpenNewAccount() {
    await this.navigateTo('/parabank/openaccount.htm');
    await this.verifyPageTitle('ParaBank | Open Account');
  }

  async openNewAccount(accountType, fromAccountId = null) {
    await this.accountTypeSelect.selectOption(accountType);
    if (fromAccountId) {
      await this.fromAccountSelect.selectOption({ label: fromAccountId.toString() });
    }
    await expect(this.openNewAccountButton).toBeVisible();
    await expect(this.openNewAccountButton).toBeEnabled();
    await this.page.waitForTimeout(200);
    await this.openNewAccountButton.click({ force: true });
  }

  async getNewAccountNumber() {
    await expect(this.newAccountIdLink).toBeVisible();
    const accountNumber = await this.newAccountIdLink.textContent();
    return accountNumber.trim();
  }
  
  async verifyAccountCreationSuccess(accountType) {
  // Wait until success header is visible and has expected text
  await expect(this.successMessage).toHaveText('Account Opened!', { timeout: 10000 });

  // Validate paragraph with success message
  const congratsText = 'Congratulations, your account is now open';
  await expect(this.page.locator('#rightPanel p').filter({ hasText: congratsText })).toBeVisible({ timeout: 10000 });

  // Get the new account number (this internally waits for visibility of #newAccountId)
  const newAccountNumber = await this.getNewAccountNumber();

  // Validate account number message
  await expect(
    this.page.locator('#rightPanel p').filter({ hasText: `Your new account number: ${newAccountNumber}` })
  ).toBeVisible({ timeout: 10000 });
}

};