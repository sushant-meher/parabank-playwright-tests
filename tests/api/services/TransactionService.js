// tests/api/services/TransactionService.js
const { expect } = require('@playwright/test');

exports.TransactionService = class TransactionService {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
    
  }

  async getTransactionDetails(transactionId) {
    const response = await this.request.get(`/transactions/${transactionId}`);
    expect(response.ok()).toBeTruthy();
    return response;
  }

  // API scenario: Search transactions by amount for payments
  async findTransactionsByAmount(accountId, amount) {
      const apiBaseUrl = process.env.API_BASE_URL;
      const response = await this.request.get(`${apiBaseUrl}/accounts/${accountId}/transactions`);

    if (!response.ok()) {
      console.error(`Failed to fetch transactions. Status: ${response.status()} Body: ${await response.text()}`);
    }
    expect(response.ok()).toBeTruthy();

    const transactions = await response.json();
    // Filter transactions by amount client-side
    return transactions.filter(txn => txn.amount === amount);
  }

  async loginAPI(username, password) {
    const response = await this.request.get(`/login/${username}/${password}`);
    expect(response.status()).toBe(200);
    return response;
  }
};
