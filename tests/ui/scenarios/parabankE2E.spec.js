// tests/ui/scenarios/parabankE2E.spec.js
const { test, expect } = require('@playwright/test');
const { generateUniqueUsername, generateUniqueEmail } = require('../../../utils/uniqueGenerator');
const { RegisterPage } = require('../pages/RegisterPage');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { OpenNewAccountPage } = require('../pages/OpenNewAccountPage');
const { TransferFundsPage } = require('../pages/TransferFundsPage');
const { BillPayPage } = require('../pages/BillPayPage');
const { TransactionService } = require('../../api/services/TransactionService');

test.describe('ParaBank End-to-End Flow', () => {
  let registerPage;
  let loginPage;
  let dashboardPage;
  let openNewAccountPage;
  let transferFundsPage;
  let billPayPage;
  let transactionService;

  // Data to be shared across steps
  let createdUsername;
  let createdPassword = 'password123'; // Using a fixed password for simplicity
  let createdFirstName = 'Test';
  let createdLastName = 'User';
  let savingsAccountNumber;
  let checkingAccountNumber; // To transfer funds to
  let billPaymentAmount = 100; // Amount for bill payment

  test.beforeEach(async ({ page, request }) => {
    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    openNewAccountPage = new OpenNewAccountPage(page);
    transferFundsPage = new TransferFundsPage(page);
    billPayPage = new BillPayPage(page);
    transactionService = new TransactionService(request); // Initialize API service
  });

  test('Complete ParaBank E2E Flow: Register, Login, Account, Transfer, Bill Pay, and API Validate', async ({ page, request }) => {
    // Step 1: Navigate to Para bank application (Done by LoginPage navigation)
    await loginPage.navigateToLogin();
    await expect(page).toHaveURL(/.*parabank\/index.htm/);

    // Step 2: Create a new user from user registration page
    createdUsername = generateUniqueUsername();
    
    const userData = {
      firstName: createdFirstName,
      lastName: createdLastName,
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      phone: '123-456-7890',
      ssn: '123-45-6789',
      username: createdUsername,
      password: createdPassword
    };

    await registerPage.navigateToRegister();
    await registerPage.fillRegistrationForm(userData);
    await registerPage.clickRegister();
    await registerPage.verifyRegistrationSuccess(createdUsername);
    console.log(`User created: ${createdUsername}`);
    
    // Step 3: Auto-Login with the newly created user
    await expect(dashboardPage.welcomeMessage).toHaveText(`Welcome ${createdUsername}`);

    // Step 4: Verify if the Global navigation menu in home page is working as expected.
    await dashboardPage.navigateGlobal('Open New Account');
    await dashboardPage.navigateGlobal('Accounts Overview'); // Navigate back to dashboard

    // Step 5: Create a Savings account and capture the account number.
    await dashboardPage.navigateGlobal('Open New Account');
    await openNewAccountPage.openNewAccount('SAVINGS');
    await openNewAccountPage.verifyAccountCreationSuccess('SAVINGS');
    savingsAccountNumber = await openNewAccountPage.getNewAccountNumber();
    console.log(`Savings Account Created: ${savingsAccountNumber}`);
    await expect(page).toHaveURL(/.*openaccount.htm/); // After account creation, it stays on this page

    // ParaBank UI sometimes requires navigating back to Accounts Overview to see updates
    await dashboardPage.navigateGlobal('Accounts Overview');
    await dashboardPage.verifyDashboardLoaded();

    // Create a CHECKING account too, to use as the "to account" for fund transfer
    await dashboardPage.navigateGlobal('Open New Account');
    await openNewAccountPage.openNewAccount('CHECKING');
    await openNewAccountPage.verifyAccountCreationSuccess('CHECKING');
    checkingAccountNumber = await openNewAccountPage.getNewAccountNumber();
    console.log(`Checking Account Created: ${checkingAccountNumber}`);
    await dashboardPage.navigateGlobal('Accounts Overview');
    await dashboardPage.verifyDashboardLoaded();
    const allAccountNumbers = await dashboardPage.getAllAccountNumbers(); // Ensure this method gets all displayed accounts
    expect(allAccountNumbers).toContain(savingsAccountNumber);
    expect(allAccountNumbers).toContain(checkingAccountNumber);

    // Step 6: Validate if Accounts overview page is displaying the balance details as expected.
    const initialSavingsBalance = await dashboardPage.getAccountBalance(savingsAccountNumber); // Ensure this method extracts balance by account
    expect(initialSavingsBalance).toBe(100.00);
    const initialCheckingBalance = await dashboardPage.getAccountBalance(checkingAccountNumber);
    expect(initialCheckingBalance).toBe(100.00);

    // Step 7: Transfer funds from savings account to checking account.
    const transferAmount = 50;
    await dashboardPage.navigateGlobal('Transfer Funds');
    await transferFundsPage.transferFunds(transferAmount, savingsAccountNumber, checkingAccountNumber);
    await transferFundsPage.verifyTransferSuccess(transferAmount, savingsAccountNumber, checkingAccountNumber);
    console.log(`Transferred $${transferAmount} from ${savingsAccountNumber} to ${checkingAccountNumber}`);
    await dashboardPage.navigateGlobal('Accounts Overview'); // Navigate back to refresh balances

    // Verify balances after transfer
    const savingsBalanceAfterTransfer = await dashboardPage.getAccountBalance(savingsAccountNumber);
    expect(savingsBalanceAfterTransfer).toBe(initialSavingsBalance - transferAmount);
    const checkingBalanceAfterTransfer = await dashboardPage.getAccountBalance(checkingAccountNumber);
    expect(checkingBalanceAfterTransfer).toBe(initialCheckingBalance + transferAmount);

    // Step 8: Pay the bill with account created in step 5 (savings account).
    await dashboardPage.navigateGlobal('Bill Pay');
    const billDetails = {
      payeeName: 'Utility Company',
      address: '456 Bill St',
      city: 'Billington',
      state: 'BP',
      zipCode: '67890',
      phone: '987-654-3210',
      accountNumber: '123456789', // Arbitrary bill account number
      amount: billPaymentAmount,
      fromAccount: savingsAccountNumber
    };
    await billPayPage.payBill(billDetails);
    await billPayPage.verifyBillPaymentSuccess(billDetails.payeeName, billDetails.amount);
    console.log(`Paid bill for $${billPaymentAmount} from ${savingsAccountNumber}`);

    await dashboardPage.navigateGlobal('Accounts Overview'); // Navigate back to refresh balances
    const savingsBalanceAfterBillPay = await dashboardPage.getAccountBalance(savingsAccountNumber);
    expect(savingsBalanceAfterBillPay).toBe(initialSavingsBalance - transferAmount - billPaymentAmount);

    // --- API Test Scenario (Integrated with UI flow for data) ---

    // Step 9: Search the transactions using “Find transactions” API call by amount for the payment transactions made in Step 8.
    console.log(`Searching transactions for account ${savingsAccountNumber} with amount ${billPaymentAmount}`);
    const apiResponse = await transactionService.findTransactionsByAmount(
      savingsAccountNumber,
      billPaymentAmount
    );
    const responseBody = await apiResponse;

    // Step 10: Validate the details displayed in Json response
    expect(Array.isArray(responseBody)).toBeTruthy();
    expect(responseBody.length).toBeGreaterThan(0);

    const billPayTransaction = responseBody.find(
      (transaction) => transaction.type === 'Debit' && transaction.amount === billPaymentAmount && transaction.description.includes('Bill Payment')
    );

    expect(billPayTransaction).toBeDefined();
    expect(billPayTransaction.accountId).toBe(parseInt(savingsAccountNumber));
    expect(billPayTransaction.amount).toBe(billPaymentAmount);
    expect(billPayTransaction.type).toBe('Debit');
    expect(billPayTransaction.description).toContain('Bill Payment');
    console.log('Successfully found and validated bill payment transaction via API.');

    // Log out
    await dashboardPage.navigateGlobal('Log Out');
    await loginPage.navigateToLogin(); // Verify landed back on login page
  });
});