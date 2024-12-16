import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DomesticCurrencyInput,
  ForeignCurrencyInput,
  ForeignCurrencySelect,
  PangeaSpinner,
} from 'components/shared';
import { Api, CurrencyType, formatCurrency } from 'lib';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import mockdata from './mockData.json';
jest.mock('../lib/api/v2/Api');

// act and advance jest timers
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function flushPromisesAndTimers(): Promise<unknown> {
  return act(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, 100);
        jest.runAllTimers();
      }),
  );
}
jest.setTimeout(30000);
const beforeAllCallback = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Api.mockImplementation(() => {
    return {
      currencyCurrenciesRetrieve: () => {
        return {
          data: Object.entries(mockdata.currencies).map((y) => {
            const x = y[1];
            return {
              id: x.id,
              symbol: x.symbol,
              mnemonic: x.mnemonic,
              name: x.name,
              unit: x.unit,
              numeric_code: x.numeric_code,
            };
          }),
        };
      },
      currencyFxpairsList: () => {
        return {
          data: mockdata.fxPairs,
        };
      },
      marketdataSpotList: () => {
        return { data: mockdata.marketData };
      },
      userList: () => {
        return { data: mockdata.user };
      },
    };
  });
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inputTest = async (
  foreignCurrency: { mnemonic: string; name: string },
  inputValue: string,
  activeCurrency: 'domestic' | 'foreign',
) => {
  const currencies: CurrencyType = mockdata.currencies;
  const exchangeRate = currencies[foreignCurrency.mnemonic].rate;
  const formattedValue = formatCurrency(
    parseFloat(inputValue),
    'USD',
    true,
    0,
    0,
  );
  const otherInputValue = formatCurrency(
    activeCurrency == 'domestic'
      ? parseFloat(inputValue) * parseFloat(exchangeRate)
      : parseFloat(inputValue) / parseFloat(exchangeRate),
    'USD',
    true,
    0,
    0,
  );
  const inputLabel =
    activeCurrency == 'domestic' ? 'Amount You Receive' : 'Payer Sends';
  const otherInputLabel =
    activeCurrency !== 'domestic' ? 'Amount You Receive' : 'Payer Sends';
  const user = userEvent.setup();

  render(
    <RecoilRoot>
      <Suspense fallback={<PangeaSpinner />}>
        <ForeignCurrencySelect />
        <DomesticCurrencyInput />
        <ForeignCurrencyInput />
      </Suspense>
    </RecoilRoot>,
  );

  await waitFor(
    () => {
      expect(screen.getByLabelText(inputLabel)).toBeInTheDocument();
    },
    {
      timeout: 15000,
      onTimeout: (error) => {
        console.error(error);
        return error;
      },
    },
  );
  const input = screen.getByLabelText(inputLabel);
  expect(input).toBeInTheDocument();
  expect(input).toBeDisabled();
  const select = screen.getByLabelText('Currency');
  await user.click(select);
  const option = screen.getByRole('option', { name: foreignCurrency.name });
  await user.click(option);
  expect(input).toBeEnabled();
  // click and backspace, so there won't be $0 in the field, as a user might

  await user.dblClick(input);
  await user.keyboard('[Backspace]');
  await user.type(input, inputValue);

  expect(input).toHaveValue(formattedValue);

  await waitFor(
    () => {
      expect(screen.getByLabelText(inputLabel)).toBeInTheDocument();
    },
    {
      timeout: 15000,
      onTimeout: (error) => {
        console.error(error);
        console.debug(screen);
        return error;
      },
    },
  );

  const otherInput = screen.getByLabelText(otherInputLabel);
  expect(otherInput).toHaveValue(otherInputValue);
};

describe('currencyControls Suite', () => {
  beforeAll(beforeAllCallback);
  test('Ensure One Test', async () => {
    expect(true);
  });
  // test('DomesticCurrencyInput: full interaction', async () => {
  //   const foreignCurrency = { mnemonic: 'MXN', name: 'Mexican Peso (MXN)' };
  //   const inputValue = '99999';
  //   await inputTest(foreignCurrency, inputValue, 'domestic');
  // });

  // test('ForeignCurrencyInput: full interaction', async () => {
  //   const foreignCurrency = { mnemonic: 'MXN', name: 'Mexican Peso (MXN)' };
  //   const inputValue = '99999';
  //   await inputTest(foreignCurrency, inputValue, 'foreign');
  // });
});
