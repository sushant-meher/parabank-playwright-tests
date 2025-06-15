// tests/ui/pages/BasePage.js
const { expect } = require('@playwright/test');

exports.BasePage = class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async navigateTo(path = '/') {
    await this.page.goto(path);
    await expect(this.page).toHaveURL(new RegExp(path + '$|' + path + '/$'));
  }

  async verifyPageTitle(title) {
    await expect(this.page).toHaveTitle(new RegExp(title));
  }

  async verifyElementVisible(selector, name = 'element') {
    await expect(this.page.locator(selector), `${name} should be visible`).toBeVisible();
  }

  async verifyElementText(selector, expectedText, name = 'element') {
    await expect(this.page.locator(selector), `${name} should have text "${expectedText}"`).toHaveText(expectedText);
  }
};