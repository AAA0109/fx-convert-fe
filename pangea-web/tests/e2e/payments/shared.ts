/* eslint-disable testing-library/prefer-screen-queries */

import { expect, Locator, Page, test } from '@playwright/test';
import { ValueDateType } from 'atoms';
import {
  formatCurrency,
  PangeaDetailedPaymentRfqResponse,
  PangeaInitialMarketStateResponse,
  PangeaPayment,
  PangeaPaymentExecutionResponse,
  PangeaPaymentExecutionSuccess,
  PangeaPaymentRfq,
  PangeaPaymentStatusEnum,
} from 'lib';
import {
  bookTransactionTestFormValuesType,
  DeliveryMethods,
  Liquidity,
  LiquidityHeading,
  TransactionConfirmationKeyType,
  TransactionConfirmationText,
} from '../utils/testType';
import { filterByAttribute } from '../utils/testUtils';

// Shared export Test functionalities for book transaction
/**
 * Fills the transaction description on the page.
 *
 * @param {Page} page - The Playwright page object.
 * @param {string} description - The description to be filled.
 * @returns {Promise<void>}
 */
export async function setTransactionDescription(
  page: Page,
  description: string,
): Promise<void> {
  await test.step('Filling Description', async () => {
    await page.getByLabel('Description').fill(description);
  });
}

/**
 * Sets the sell currency on the page.
 *
 * @param {Page} page - The Playwright page object.
 * @param {string} currency - The currency to be selected.
 * @returns {Promise<void>}
 */
export async function setSellCurrency(
  page: Page,
  currency: string,
  oldCurrency = 'USD',
): Promise<void> {
  await test.step('Setting Sell Currency', async () => {
    const sellCurrencySelectBtn = page.getByTestId('sellCurrencySelect');

    await sellCurrencySelectBtn.click();
    const initialStateResPromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/v2/marketdata/initial-state') &&
        response.status() === 200,
    );
    await page.getByRole('option', { name: currency }).click();
    if (currency !== oldCurrency) {
      await initialStateResPromise;
    }
    await expect(page.getByTestId('sellCurrencySelect')).toContainText(
      currency,
    );
  });
}

/**
 * Sets the buy currency on the page and validates the initial state response.
 *
 * @param {Page} page - The Playwright page object.
 * @param {bookTransactionTestFormValuesType} formValues - The form values containing currency data.
 * @returns {Promise<void>}
 */
export async function setBuyCurrency(
  page: Page,
  formValues: bookTransactionTestFormValuesType,
): Promise<void> {
  await test.step('Setting Buy Currency', async () => {
    const buyCurrencySelectBtn = page.getByTestId('buyCurrencySelect');
    await buyCurrencySelectBtn.click();
    const initialStateResPromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/v2/marketdata/initial-state') &&
        response.status() === 200,
    );
    await page.getByRole('option', { name: formValues.buyCurrency }).click();

    await test.step('Validating Initial State Response', async () => {
      const initialStateRes = await initialStateResPromise;
      await expect(buyCurrencySelectBtn).toContainText(formValues.buyCurrency);
      const initialStateResponse =
        (await initialStateRes.json()) as PangeaInitialMarketStateResponse;
      expect(initialStateResponse.market).toContain(formValues.buyCurrency);
      expect(initialStateResponse.market).toContain(formValues.sellCurrency);
    });
  });
}

/**
 * Sets the sell amount on the page.
 *
 * @param {Page} page - The Playwright page object.
 * @param {string} sellAmount - The sell amount to be filled.
 * @returns {Promise<void>}
 */
export async function setSellAmount(
  page: Page,
  sellAmount: string,
): Promise<void> {
  await test.step('Setting Sell Amount', async () => {
    const sellCurrencyInput = page.getByTestId('sellCurrencyAmountInput');
    await sellCurrencyInput.locator('#foreign-amount-label').click();
    await sellCurrencyInput.locator('#foreign-amount-label').fill(sellAmount);
    await expect(sellCurrencyInput.getByLabel('Selling Exactly')).toHaveValue(
      sellAmount,
    );
  });
}

/**
 * Selects the origin bank account on the page.
 *
 * @param {Page} page - The Playwright page object.
 * @returns {Promise<void>}
 */
export async function setOriginBankAccount(page: Page): Promise<void> {
  await test.step('Select Origin Bank Accounts', async () => {
    await page.getByLabel('Origin').click();
    const allOriginBankAccounts = await page
      .getByTestId('originBankAccount')
      .all();
    const originBackAccounts = await filterByAttribute(
      allOriginBankAccounts,
      'aria-disabled',
    );

    const allOriginWallets = await page.getByTestId('originWallet').all();
    const originWallets = await filterByAttribute(
      allOriginWallets,
      'aria-disabled',
    );

    if (originBackAccounts.length > 0) {
      await originBackAccounts[0].click();
    } else if (originWallets.length > 0) {
      await originWallets[0].click();
    } else {
      throw new Error('No Origin bank account or wallet found');
    }
    await expect(
      page.getByRole('button', { name: 'Account Details' }),
    ).toBeVisible();
  });
}

/**
 * Selects the destination bank account on the page.
 *
 * @param {Page} page - The Playwright page object.
 * @returns {Promise<void>}
 */
export async function setDestinationBankAccount(page: Page): Promise<void> {
  await test.step('Select Destination Bank Accounts', async () => {
    await page.getByLabel('Destination').click();
    const allDestinationBankAccounts = await page
      .getByTestId('destinationBankAccount')
      .all();
    const destinationBankAccounts = await filterByAttribute(
      allDestinationBankAccounts,
      'aria-disabled',
    );
    const allDestinationWallets = await page
      .getByTestId('destinationWallet')
      .all();
    const destinationWallets = await filterByAttribute(
      allDestinationWallets,
      'aria-disabled',
    );

    if (destinationBankAccounts.length > 0) {
      await destinationBankAccounts[0].click();
    } else if (destinationWallets.length > 0) {
      await destinationWallets[0].click();
    } else {
      throw new Error('No destination bank account or wallet found');
    }

    await expect(
      page.getByRole('button', { name: 'Account Details' }).nth(1),
    ).toBeVisible();
  });
}

/**
 * Selects the purpose of payment on the page.
 *
 * @param {Page} page - The Playwright page object.
 * @param {string} purposeOfPayment - The purpose of payment to be selected.
 * @returns {Promise<void>}
 */
export async function setPaymentPurpose(
  page: Page,
  purposeOfPayment: string,
): Promise<void> {
  await test.step('Select Purpose of Payment', async () => {
    await page.getByLabel('Purpose of Payment').click();
    await page.getByRole('option', { name: purposeOfPayment }).click();
  });
}

/**
 * Sets the delivery method on the page and captures the PangeaPayment API response.
 *
 * @param page - The page object representing the web page.
 * @returns A Promise that resolves to the PangeaPayment API response.
 * @throws An error if the PangeaPayment response is not set.
 */
export async function setDeliveryMethod(
  page: Page,
  deliveryMethod: DeliveryMethods,
  liquidity: Liquidity,
): Promise<PangeaPayment> {
  let pangeaPaymentResponse: PangeaPayment | undefined;

  await test.step('Select Delivery Method', async () => {
    await expect(
      page.getByRole('heading', { name: LiquidityHeading[liquidity] }),
    ).toBeVisible();

    await expect(page.getByText(deliveryMethod)).toBeVisible();
    await page.getByText(deliveryMethod).click();

    // Wait for the payments API response
    const paymentsResPromise = page.waitForResponse((response) => {
      const url = new URL(response.url());

      return (
        url.pathname.startsWith('/api/v2/payments/') &&
        url.search === '' &&
        response.status() === 200
      );
    });

    // Click on the Next button
    await page.getByRole('button', { name: 'Next' }).click();

    // Capture PangeaPayment API Response
    const paymentsRes = await paymentsResPromise;
    pangeaPaymentResponse = (await paymentsRes.json()) as PangeaPayment;
  });

  if (!pangeaPaymentResponse) {
    throw new Error('PangeaPayment response is not set.');
  }

  return pangeaPaymentResponse;
}

/**
 * Validates the Pangea payment response.
 *
 * @param pangeaPaymentResponse - The Pangea payment response object.
 * @param formValues - The form values used for validation.
 * @returns {Promise<void>} - A promise that resolves when the validation is complete.
 */
export async function validatePangeaPaymentResponse(
  pangeaPaymentResponse: PangeaPayment,
  formValues: bookTransactionTestFormValuesType,
): Promise<void> {
  await test.step('Validate Pangea Payment Response', async () => {
    expect(pangeaPaymentResponse).toHaveProperty('origin_account_id');
    expect(pangeaPaymentResponse).toHaveProperty('id');
    expect(pangeaPaymentResponse.amount).toEqual(
      parseInt(formValues.sellAmount),
    );
    expect(pangeaPaymentResponse.buy_currency).toEqual(formValues.buyCurrency);
    expect(pangeaPaymentResponse.sell_currency).toEqual(
      formValues.sellCurrency,
    );
    expect(pangeaPaymentResponse.name).toEqual(formValues.description);
    expect(pangeaPaymentResponse.purpose_of_payment).toEqual(
      formValues.purposeOfPayment.toUpperCase(),
    );
  });
}

/**
 * Validates the Review and Confirm page and returns the successful RFQ response.
 *
 * @param {Page} page - The page object representing the web page.
 * @param {PangeaPayment} pangeaPaymentResponse - The payment response object from Pangea.
 * @returns {Promise<PangeaPaymentRfq>} - A promise that resolves to the successful RFQ response.
 * @throws {Error} - If the RFQ success response is not set.
 */
export async function validateReviewAndConfirmPage(
  page: Page,
  pangeaPaymentResponse: PangeaPayment,
): Promise<PangeaPaymentRfq> {
  let rfqSuccessResponse: PangeaPaymentRfq | undefined;

  await test.step('Review and Confirm Page', async () => {
    const handleRfqResponse = (response: any, pangeaPaymentId: number) => {
      const url = `/api/v2/payments/${pangeaPaymentId}/rfq`;
      if (response.url().includes(url) && !response.ok()) {
        response.body().then((res: any) => {
          console.log('RFQ Response');
          console.log(response.url());
          console.log(JSON.parse(res.toString('utf-8')));
          console.log('==============================');
        });
      }
      return response.url().includes(url) && response.status() === 200;
    };

    const RFQ_RESPONSE_TIMEOUT = 30000;

    const rfqResPromise = page.waitForResponse(
      (response) => handleRfqResponse(response, pangeaPaymentResponse.id),
      { timeout: RFQ_RESPONSE_TIMEOUT },
    );

    await expect(
      page.getByRole('heading', { name: 'Review & Confirm' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: `${pangeaPaymentResponse.amount?.toFixed(2)} ${
          pangeaPaymentResponse.sell_currency
        }`,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Refresh Rate' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Refresh Rate' }).click();
    const rfqRes = await rfqResPromise;
    const rfqResponse =
      (await rfqRes.json()) as PangeaDetailedPaymentRfqResponse;
    rfqSuccessResponse = rfqResponse.success[0];
    await expect(page.getByText('Rate expires in')).toBeVisible();
    const transactionExecutePromise = page.waitForResponse((response) =>
      response
        .url()
        .includes(`/api/v2/payments/${pangeaPaymentResponse.id}/execute`),
    );
    await page.getByRole('button', { name: 'Confirm' }).click();
    const transactionExecuteRes = await transactionExecutePromise;
    const transactionExecuteResponse: PangeaPaymentExecutionResponse =
      (await transactionExecuteRes.json()) as PangeaPaymentExecutionResponse;
    if (transactionExecuteResponse.error.length > 0) {
      console.log('Transaction Execute Response');
      console.log(transactionExecuteRes.url());
      console.log(transactionExecuteResponse);
      console.log('==============================');
    }
  });

  if (!rfqSuccessResponse) {
    throw new Error('RFQ Success response is not set.');
  }

  return rfqSuccessResponse;
}

/**
 * Validates the Strategic Review and Confirm page.
 *
 * @param {Page} page - The page object representing the web page.
 * @param {PangeaPayment} pangeaPaymentResponse - The PangeaPayment response object.
 * @returns {Promise<void>} - A promise that resolves when the validation is complete.
 */
export async function validateStrategicReviewAndConfirmPage(
  page: Page,
  pangeaPaymentResponse: PangeaPayment,
): Promise<PangeaPaymentExecutionResponse> {
  let transactionExecuteResponse: PangeaPaymentExecutionResponse | undefined;

  await test.step('Review and Confirm Page', async () => {
    await expect(
      page.getByRole('heading', { name: 'Review & Confirm' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: `${pangeaPaymentResponse.amount?.toFixed(2)} ${
          pangeaPaymentResponse.sell_currency
        }`,
      }),
    ).toBeVisible();
    const transactionExecutePromise = page.waitForResponse(
      (response) => {
        const url = `/api/v2/payments/${pangeaPaymentResponse.id}/execute`;
        if (response.url().includes(url) && !response.ok()) {
          response.body().then((res) => {
            console.log('Transaction Execute Response');
            console.log(response.url());
            console.log(JSON.parse(res.toString('utf-8')));
            console.log('==============================');
          });
        }
        return response.url().includes(url) && response.status() === 200;
      },
      { timeout: 30000 },
    );
    await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();

    await page.getByRole('button', { name: 'Confirm' }).click();
    const transactionExecuteRes = await transactionExecutePromise;
    transactionExecuteResponse =
      (await transactionExecuteRes.json()) as PangeaPaymentExecutionResponse;
  });

  if (!transactionExecuteResponse) {
    throw new Error('Transaction Execute response is not set.');
  }

  return transactionExecuteResponse;
}

/**
 * Validates the transaction confirmation page.
 *
 * @param {Page} page - The page object representing the transaction confirmation page.
 * @returns {Promise<void>} - A promise that resolves once the validation is complete.
 */
export async function validateTransactionConfirmationPage(
  page: Page,
  paymentType: TransactionConfirmationKeyType = 'default',
): Promise<void> {
  await test.step('Transaction Confirmation Page', async () => {
    await expect(
      page.getByRole('heading', {
        name: TransactionConfirmationText[paymentType].heading,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(TransactionConfirmationText[paymentType].subHeading),
    ).toBeVisible();
    const returnToDashboardBtn = page.getByRole('button', {
      name: 'Return to Dashboard',
    });

    // Back To Dashboard
    await expect(returnToDashboardBtn).toBeVisible();
    await returnToDashboardBtn.click();
    await expect(page).toHaveURL(/\/dashboard$/);
    expect(page.getByTestId('signOutButton')).toBeVisible();
  });
}

/**
 * Validates the Transaction in Payment View Page.
 *
 * @param {Page} page - The page object representing the web page.
 * @param {PangeaPayment} pangeaPaymentResponse - The PangeaPayment response object.
 * @param {PangeaPaymentRfq} rfqSuccessResponse - The PangeaPaymentRfq response object.
 * @returns {Promise<void>} - A promise that resolves once the validation is complete.
 */
export async function validateTransactionPaymentViewPage(
  page: Page,
  pangeaPaymentResponse: PangeaPayment,
  rfqSuccessResponse: PangeaPaymentRfq,
): Promise<void> {
  await test.step('Validate Transaction in Payment View Page', async () => {
    const paymentResPromise = page.waitForResponse(
      (response) =>
        response
          .url()
          .includes(`/api/v2/payments/${pangeaPaymentResponse.id}/`) &&
        response.status() === 200,
    );
    await page.goto(`/payments/view?id=${pangeaPaymentResponse.id}`);
    await page.waitForURL(`**/payments/view?id=${pangeaPaymentResponse.id}`);
    const paymentRes = await paymentResPromise;
    const paymentResponse = (await paymentRes.json()) as PangeaPayment;
    await expect(
      page.getByRole('heading', {
        name: pangeaPaymentResponse.name.toUpperCase(),
      }),
    ).toBeVisible();

    // Summary
    await expect(
      page.getByText(`Ticket ID${rfqSuccessResponse.ticket_id}`),
    ).toBeVisible();
    await expect(
      page.getByText(`Payment ID${pangeaPaymentResponse.id}`),
    ).toBeVisible();

    // Cost Summary
    const isBookedDeliveredOrInTransit = [
      PangeaPaymentStatusEnum.Booked,
      PangeaPaymentStatusEnum.InTransit,
      PangeaPaymentStatusEnum.Delivered,
    ].includes(paymentResponse.payment_status);
    await expect(
      page.getByText(
        `Transaction Amount ${
          isBookedDeliveredOrInTransit ? '' : '*'
        }${formatCurrency(
          rfqSuccessResponse.transaction_amount ?? '-',
          rfqSuccessResponse.buy_currency,
          true,
          2,
          4,
        )}`,
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        `Total Cost ${isBookedDeliveredOrInTransit ? '' : '*'}${formatCurrency(
          rfqSuccessResponse.total_cost ?? '-',
          rfqSuccessResponse.sell_currency,
          true,
          2,
          4,
        )}`,
      ),
    ).toBeVisible();
  });
}

/**
 * Validates the Transaction in the Payment View Page for strategic execution.
 *
 * @param page - The page object representing the web page.
 * @param pangeaPaymentResponse - The PangeaPayment response object.
 * @param executeResponse - The PangeaPaymentExecutionSuccess response object.
 * @returns A Promise that resolves when the validation is complete.
 */
export async function validateStrategicTransactionPaymentViewPage(
  page: Page,
  pangeaPaymentResponse: PangeaPayment,
  executeResponse: PangeaPaymentExecutionSuccess,
): Promise<void> {
  await test.step('Validate Transaction in Payment View Page', async () => {
    const paymentResPromise = page.waitForResponse(
      (response) => {
        const url = `/api/v2/payments/${pangeaPaymentResponse.id}`;
        if (response.url().includes(url) && !response.ok()) {
          response.body().then((res) => {
            console.log('Payments Response');
            console.log(response.url());
            console.log(JSON.parse(res.toString('utf-8')));
            console.log('==============================');
          });
        }

        return response.url().includes(url) && response.status() === 200;
      },
      { timeout: 30000 },
    );

    await page.goto(`/payments/view?id=${pangeaPaymentResponse.id}`);
    await page.waitForURL(`**/payments/view?id=${pangeaPaymentResponse.id}`);
    const paymentRes = await paymentResPromise;
    const paymentResponse = (await paymentRes.json()) as PangeaPayment;
    expect(paymentResponse).toHaveProperty('payment_status');
    const FAILURE_STATUSES = Object.freeze([
      PangeaPaymentStatusEnum.SettlementIssue,
      PangeaPaymentStatusEnum.Failed,
      PangeaPaymentStatusEnum.Expired,
    ]);
    if (FAILURE_STATUSES.includes(paymentResponse.payment_status)) {
      console.log('Payment Response');
      console.log(paymentResponse);
      console.log('==============================');
      throw new Error('Payment Failed');
    }

    await expect(
      page.getByRole('heading', {
        name: pangeaPaymentResponse.name.toUpperCase(),
      }),
    ).toBeVisible();

    // Summary
    await expect(
      page.getByText(`Ticket ID${executeResponse.ticket_id}`),
    ).toBeVisible();
    await expect(
      page.getByText(`Payment ID${pangeaPaymentResponse.id}`),
    ).toBeVisible();

    // Cost Summary
    await expect(
      page.getByText(`Selling ${pangeaPaymentResponse.sell_currency}`),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: `${formatCurrency(
          pangeaPaymentResponse.amount ?? '-',
          pangeaPaymentResponse.sell_currency,
          true,
          2,
          4,
        )} ${pangeaPaymentResponse.sell_currency}`,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(
        `Buying ${pangeaPaymentResponse.cashflows[0].buy_currency}`,
      ),
    ).toBeVisible();
  });
}

/**
 * Navigates back to edit the values of a transaction form.
 *
 * @param page - The page object representing the web page.
 * @param finalFormValues - The final form values to be edited.
 * @returns A promise that resolves when the values are edited.
 */
export async function goBackToEdit(
  page: Page,
  finalFormValues: bookTransactionTestFormValuesType,
): Promise<void> {
  await test.step('Go Back Edit Values', async () => {
    await page.getByRole('button', { name: 'Back' }).click();

    await setTransactionDescription(page, finalFormValues.description);
    await setSellAmount(page, finalFormValues.sellAmount);
    await page.waitForTimeout(2000);
    await setPaymentPurpose(page, finalFormValues.purposeOfPayment);
  });
}

/**
 * Checks the Review and Confirm page by checking the rate multiple times.
 *
 * @param {Page} page - The page object representing the web page.
 * @param {PangeaPayment} pangeaPaymentResponse - The PangeaPayment response object.
 * @returns {PangeaPaymentRfq} - The PangeaPaymentRfq response object.
 */
export async function checkReviewAndConfirmWithMultipleRateCheck(
  page: Page,
  pangeaPaymentResponse: PangeaPayment,
): Promise<PangeaPaymentRfq> {
  let rfqSuccessResponse: PangeaPaymentRfq = {} as PangeaPaymentRfq;

  await test.step('Review and Confirm page by checking rate multiple times', async () => {
    await expect(
      page.getByRole('heading', { name: 'Review & Confirm' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: `${pangeaPaymentResponse.amount?.toFixed(2)} ${
          pangeaPaymentResponse.sell_currency
        }`,
      }),
    ).toBeVisible();

    const rfqResPromise = page.waitForResponse(
      (response) =>
        response
          .url()
          .includes(`/api/v2/payments/${pangeaPaymentResponse.id}/rfq`) &&
        response.status() === 200,
    );

    const refreshRateButton = page.getByRole('button', {
      name: 'Refresh Rate',
    });
    const confirmButton = page.getByRole('button', {
      name: 'Confirm',
    });
    const expiresInText = page.getByText('Rate expires in');

    await refreshRateButton.click();
    let rfqRes = await rfqResPromise;
    let rfqResponse = (await rfqRes.json()) as PangeaDetailedPaymentRfqResponse;
    rfqSuccessResponse = rfqResponse.success[0];

    await expect(expiresInText).toBeVisible();
    await expect(confirmButton).toBeVisible();

    await page.waitForTimeout(12000);

    await expect(expiresInText).toBeHidden();
    await expect(confirmButton).toBeHidden();

    await refreshRateButton.click();
    rfqRes = await rfqResPromise;
    rfqResponse = (await rfqRes.json()) as PangeaDetailedPaymentRfqResponse;
    rfqSuccessResponse = rfqResponse.success[0];

    await expect(expiresInText).toBeVisible();
    await expect(confirmButton).toBeVisible();

    await confirmButton.click();
  });

  return rfqSuccessResponse;
}

/**
 * Sets the spot execution date on the page.
 *
 * @param {Page} page - The Playwright page object.
 * @param {string} valueDate - The spot execution date to be selected.
 * @returns {Promise<void>}
 */
export async function setSpotExecutionDate(page: Page): Promise<void> {
  await test.step('Selecting Spot execution date', async () => {
    await page.getByLabel('Choose date').click();
    const valueDatePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/v2/payments/calendar/value-date/') &&
        response.status() === 200,
    );
    const calender = page.getByRole('dialog');
    await expect(calender).toBeVisible();
    await valueDatePromise;
    const spotDate = page.locator(
      `[aria-label="${ValueDateType.SPOT.toUpperCase()}"]`,
    );
    const valueDateInputValue = await spotDate.innerText();
    await spotDate.click();
    const valueDateInput = page
      .getByTestId('valueDateInput')
      .getByPlaceholder('MM/DD/YYYY');
    expect((await valueDateInput.inputValue()).split('/')[1]).toEqual(
      valueDateInputValue.padStart(2, '0'),
    );
  });
}

/**
 * Sets the forward execution date on the page.
 *
 * @param {Page} page - The Playwright page object.
 * @returns {Promise<void>}
 */
export async function setForwardExecutionDate(page: Page): Promise<void> {
  await test.step('Selecting Forward execution date', async () => {
    await page.getByLabel('Choose date').click();
    const calender = page.getByRole('dialog');
    await expect(calender).toBeVisible();
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const formatter = new Intl.DateTimeFormat('en', {
      month: 'long',
      year: 'numeric',
    });
    const formattedMonthYear = formatter.format(date);
    await ensureMonthIsVisible(page, formattedMonthYear);

    let isDisabled = true;
    let valueDateMatch = false;
    let forwardDate: Locator | null = null;

    while (isDisabled || !valueDateMatch) {
      date.setDate(date.getDate() + 1);
      const currentMonth = formatter.format(date);
      if (currentMonth !== formattedMonthYear) {
        await ensureMonthIsVisible(page, currentMonth);
      }
      forwardDate = page.getByRole('button', {
        name: date.getDate().toString(),
        exact: true,
      });
      const disabledValue = await forwardDate.getAttribute('disabled');
      isDisabled = !(disabledValue === null);
      const forwardDateParent = forwardDate.locator('..');
      const label = await forwardDateParent.getAttribute('aria-label');
      valueDateMatch = !(label === ValueDateType.FORWARD);
    }

    if (forwardDate) {
      const forwardDateValue = await forwardDate.innerText();
      await forwardDate.click();
      const valueDateInputValue = await page
        .getByTestId('valueDateInput')
        .getByPlaceholder('MM/DD/YYYY')
        .inputValue();
      expect(valueDateInputValue.split('/')[1]).toEqual(
        forwardDateValue.padStart(2, '0'),
      );
    } else {
      throw new Error('Forward Date not found');
    }
  });
}

async function ensureMonthIsVisible(
  page: Page,
  formattedMonthYear: string,
): Promise<void> {
  let monthYearElement = page.getByText(formattedMonthYear);
  const isVisible = await monthYearElement.isVisible();
  if (!isVisible) {
    await page.getByLabel('Next month').click();
    monthYearElement = page.getByText(formattedMonthYear);
    await monthYearElement.isVisible();
  }
}
