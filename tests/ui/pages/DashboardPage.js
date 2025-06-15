// tests/ui/pages/DashboardPage.js
const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

exports.DashboardPage = class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.globalNavigation = {
      openNewAccount: page.locator('text=Open New Account'),
      accountsOverview: page.locator('text=Accounts Overview'),
      transferFunds: page.locator('text=Transfer Funds'),
      billPay: page.locator('text=Bill Pay'),
      findTransactions: page.locator('text=Find Transactions'),
      updateContactInfo: page.locator('text=Update Contact Info'),
      requestLoan: page.locator('text=Request Loan'),
      logout: page.locator('text=Log Out')
    };
    this.welcomeMessage = page.locator('#rightPanel > h1');
    this.accountsOverviewTable = page.locator('#accountTable');
  }

  async verifyDashboardLoaded() {
    await expect(this.page).toHaveURL(/.*overview.htm/);
    await expect(this.accountsOverviewTable).toBeVisible();
  }

  async navigateGlobal(menuItem) {
    switch (menuItem) {
      case 'Open New Account':
        await this.globalNavigation.openNewAccount.click();
        await expect(this.page).toHaveURL(/.*openaccount.htm/);
        break;
      case 'Accounts Overview':
        await this.globalNavigation.accountsOverview.click();
        await expect(this.page).toHaveURL(/.*overview.htm/);
        break;
      case 'Transfer Funds':
        await this.globalNavigation.transferFunds.click();
        await expect(this.page).toHaveURL(/.*transfer.htm/);
        break;
      case 'Bill Pay':
        await this.globalNavigation.billPay.click();
        await expect(this.page).toHaveURL(/.*billpay.htm/);
        break;
      case 'Find Transactions':
        await this.globalNavigation.findTransactions.click();
        await expect(this.page).toHaveURL(/.*findtrans.htm/);
        break;
      case 'Update Contact Info':
        await this.globalNavigation.updateContactInfo.click();
        await expect(this.page).toHaveURL(/.*updateprofile.htm/);
        break;
      case 'Request Loan':
        await this.globalNavigation.requestLoan.click();
        await expect(this.page).toHaveURL(/.*requestloan.htm/);
        break;
      case 'Log Out':
        await this.globalNavigation.logout.click();
        await expect(this.page).toHaveURL(/.*index.htm/);
        break;
      default:
        throw new Error(`Unknown navigation menu item: ${menuItem}`);
    }
  }

  async getAccountBalance(accountNumber) {
    const accountRow = this.page.locator(`#accountTable tbody tr:has-text("${accountNumber}")`);
    await expect(accountRow).toBeVisible();
    const balanceColumn = accountRow.locator('td').nth(1);
    const balanceText = await balanceColumn.textContent();
    return parseFloat(balanceText.replace(/[^0-9.-]+/g,""));
  }

  async getAllAccountNumbers() {
    await this.page.waitForSelector('#accountTable tbody tr td a', { timeout: 5000 });

    const accountLinks = this.page.locator('#accountTable tbody tr td a');
    const count = await accountLinks.count();
    console.log(`Found ${count} account links.`);

    const accountNumbers = await accountLinks.allTextContents();
    const trimmedAccountNumbers = accountNumbers.map(text => text.trim());
    return trimmedAccountNumbers;
  }
};