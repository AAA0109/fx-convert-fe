/* eslint-disable testing-library/prefer-screen-queries */
import { test } from '@playwright/test';
import { PangeaBestExecutionTiming, PangeaPayment } from 'lib';
import path from 'path';
import { goToBookTransactionPage } from 'tests/e2e/utils/navigations';
import {
  bookTransactionTestFormValuesType,
  CurrencyPairsType,
  DeliveryMethods,
  Liquidity,
} from 'tests/e2e/utils/testType';
import { getCurrencyPairs } from 'tests/e2e/utils/testUtils';
import {
  goBackToEdit,
  setBuyCurrency,
  setDeliveryMethod,
  setDestinationBankAccount,
  setForwardExecutionDate,
  setOriginBankAccount,
  setPaymentPurpose,
  setSellAmount,
  setSellCurrency,
  setTransactionDescription,
  validatePangeaPaymentResponse,
  validateStrategicReviewAndConfirmPage,
  validateStrategicTransactionPaymentViewPage,
  validateTransactionConfirmationPage,
} from '../shared';

const currencyPairs = getCurrencyPairs(['acceptable', 'poor']);
let executionTimingPromise: Promise<Response>;

currencyPairs.forEach((currencyPair: CurrencyPairsType) => {
  test.describe(`Strategic Forward Execution Payment Workflow buying ${currencyPair.buy} selling ${currencyPair.sell} with ${currencyPair.liquidity} liquidity`, () => {
    test.beforeEach(async ({ page }, testInfo) => {
      await page.route('**/api/v2/**', (route) => route.continue());
      console.log(`Running: ${testInfo.title}`);
      await goToBookTransactionPage(page);
      executionTimingPromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/v2/oems/best-execution-timing/') &&
          response.status() === 200,
      ) as unknown as Promise<Response>;
    });

    test.afterEach(async ({ page }, testInfo) => {
      if (testInfo.status !== testInfo.expectedStatus) {
        const screenshotPath = path.join(
          'test-results',
          'screenshots',
          `${testInfo.title.replace(/\s+/g, '_')}.png`,
        );

        testInfo.attachments.push({
          name: 'screenshot',
          path: screenshotPath,
          contentType: 'image/png',
        });
        await page.screenshot({ path: screenshotPath, timeout: 5000 });
      }
    });

    test(`should be able to book transaction with strategic execution in normal flow buying ${currencyPair.buy} selling ${currencyPair.sell}`, async ({
      page,
    }) => {
      // Setting Variables for the test specs
      const formValues: bookTransactionTestFormValuesType = {
        description: `${currencyPair.buy} ${currencyPair.sell} Strategic Forward Execution Flow with ${currencyPair.liquidity} liquidity e2e test`,
        sellCurrency: currencyPair.sell,
        buyCurrency: currencyPair.buy,
        sellAmount: '10.00',
        purposeOfPayment: 'Intercompany payment',
      };
      let pangeaPaymentResponse: PangeaPayment = {} as PangeaPayment;

      await setTransactionDescription(page, formValues.description);
      await setSellCurrency(page, formValues.sellCurrency);
      await setBuyCurrency(page, formValues);
      await setSellAmount(page, formValues.sellAmount);
      await setForwardExecutionDate(page);
      await setOriginBankAccount(page);
      await setDestinationBankAccount(page);
      await setPaymentPurpose(page, formValues.purposeOfPayment);
      const executionTimingRes = await executionTimingPromise;
      const executionTimingResponse =
        (await executionTimingRes.json()) as PangeaBestExecutionTiming;

      pangeaPaymentResponse = await setDeliveryMethod(
        page,
        DeliveryMethods.ForwardStrategic,
        (executionTimingResponse.execution_data?.liquidity_insight
          .liquidity as Liquidity) || currencyPair.liquidity,
      );
      await validatePangeaPaymentResponse(pangeaPaymentResponse, formValues);
      const executeResponse = await validateStrategicReviewAndConfirmPage(
        page,
        pangeaPaymentResponse,
      );
      await validateTransactionConfirmationPage(page);
      await validateStrategicTransactionPaymentViewPage(
        page,
        pangeaPaymentResponse,
        executeResponse.success[0],
      );
    });

    test(`should be able to book transaction that with strategic execution after editing amount, description and purpose of payment along with refresh rate for ${currencyPair.buy} selling ${currencyPair.sell}`, async ({
      page,
    }) => {
      // Setting Variables for the test specs
      const initialFormValues: bookTransactionTestFormValuesType = {
        description: `${currencyPair.buy} ${currencyPair.sell} Strategic Forward Execution Workflow with ${currencyPair.liquidity} liquidity e2e test`,
        sellCurrency: currencyPair.sell,
        buyCurrency: currencyPair.buy,
        sellAmount: '10.00',
        purposeOfPayment: 'Intercompany payment',
      };
      const finalFormValues: bookTransactionTestFormValuesType = {
        description: `Update ${currencyPair.buy} ${currencyPair.sell} Strategic Forward Execution Workflow with ${currencyPair.liquidity} liquidity  e2e test`,
        sellCurrency: currencyPair.sell,
        buyCurrency: currencyPair.buy,
        sellAmount: '15.00',
        purposeOfPayment: 'BUSINESS VENTURE',
      };

      let pangeaPaymentResponse: PangeaPayment = {} as PangeaPayment;

      await setTransactionDescription(page, initialFormValues.description);
      await setSellCurrency(page, initialFormValues.sellCurrency);
      await setBuyCurrency(page, initialFormValues);
      await setSellAmount(page, initialFormValues.sellAmount);
      await setForwardExecutionDate(page);
      await setOriginBankAccount(page);
      await setDestinationBankAccount(page);
      await setPaymentPurpose(page, initialFormValues.purposeOfPayment);

      const executionTimingRes = await executionTimingPromise;
      const executionTimingResponse =
        (await executionTimingRes.json()) as PangeaBestExecutionTiming;

      pangeaPaymentResponse = await setDeliveryMethod(
        page,
        DeliveryMethods.ForwardStrategic,
        (executionTimingResponse.execution_data?.liquidity_insight
          .liquidity as Liquidity) || currencyPair.liquidity,
      );
      await validatePangeaPaymentResponse(
        pangeaPaymentResponse,
        initialFormValues,
      );

      await goBackToEdit(page, finalFormValues);

      pangeaPaymentResponse = await setDeliveryMethod(
        page,
        DeliveryMethods.ForwardStrategic,
        (executionTimingResponse.execution_data?.liquidity_insight
          .liquidity as Liquidity) || currencyPair.liquidity,
      );
      await validatePangeaPaymentResponse(
        pangeaPaymentResponse,
        finalFormValues,
      );
      const executeResponse = await validateStrategicReviewAndConfirmPage(
        page,
        pangeaPaymentResponse,
      );
      await validateTransactionConfirmationPage(page);
      await validateStrategicTransactionPaymentViewPage(
        page,
        pangeaPaymentResponse,
        executeResponse.success[0],
      );
    });
  });
});
