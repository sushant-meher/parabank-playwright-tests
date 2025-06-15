// tests/ui/pages/LoginPage.js
const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

exports.LoginPage = class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('[name="username"]');
    this.passwordInput = page.locator('[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.welcomeMessage = page.locator('#rightPanel p.smallText');
    this.errorMessage = page.locator('.error');
  }

  async navigateToLogin() {
    await this.navigateTo('/parabank/index.htm');
    await this.verifyPageTitle('ParaBank | Welcome | Online Banking');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyLoginSuccess(firstName, lastName) {
    await expect(this.page).toHaveURL(/.*overview.htm/);
    await expect(this.welcomeMessage).toBeVisible();
    await expect(this.welcomeMessage).toHaveText(`Welcome ${firstName} ${lastName}`);
  }

  async verifyLoginFailure() {
    await expect(this.page).toHaveURL(/.*index.htm/);
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText('The username and password could not be verified.');
  }
};