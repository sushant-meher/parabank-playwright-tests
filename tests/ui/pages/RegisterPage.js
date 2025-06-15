// tests/ui/pages/RegisterPage.js
const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

exports.RegisterPage = class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameInput = page.locator('#customer\\.firstName');
    this.lastNameInput = page.locator('#customer\\.lastName');
    this.addressInput = page.locator('#customer\\.address\\.street');
    this.cityInput = page.locator('#customer\\.address\\.city');
    this.stateInput = page.locator('#customer\\.address\\.state');
    this.zipCodeInput = page.locator('#customer\\.address\\.zipCode');
    this.phoneInput = page.locator('#customer\\.phoneNumber');
    this.ssnInput = page.locator('#customer\\.ssn');
    this.usernameInput = page.locator('#customer\\.username');
    this.passwordInput = page.locator('#customer\\.password');
    this.confirmPasswordInput = page.locator('#repeatedPassword');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.welcomeMessage = page.locator('#rightPanel h1.title');
  }

  async navigateToRegister() {
    await this.navigateTo('/parabank/register.htm');
    await this.verifyPageTitle('ParaBank | Register');
  }

  async fillRegistrationForm(userData) {
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.addressInput.fill(userData.address);
    await this.cityInput.fill(userData.city);
    await this.stateInput.fill(userData.state);
    await this.zipCodeInput.fill(userData.zipCode);
    await this.phoneInput.fill(userData.phone);
    await this.ssnInput.fill(userData.ssn);
    await this.usernameInput.fill(userData.username);
    await this.passwordInput.fill(userData.password);
    await this.confirmPasswordInput.fill(userData.password);
  }

  async clickRegister() {
    await this.registerButton.click();
  }

  async verifyRegistrationSuccess(username) {
    // First, verify the success message on the page that loads after clicking register.
    await expect(this.welcomeMessage).toBeVisible();
    await expect(this.welcomeMessage).toHaveText(`Welcome ${username}`);
    // Then, assert the final URL.
    await expect(this.page).toHaveURL(/.*register.htm/); 
  }
};