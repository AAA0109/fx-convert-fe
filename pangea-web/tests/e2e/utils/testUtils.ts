import fs from 'fs';
import { Locator } from 'playwright';
import { CurrencyPairsType, FwdRfqType, Liquidity } from './testType';

/**
 * Adds commas to a string of digits to make it more readable.
 *
 * @param x - The string of digits to add commas to.
 * @returns A new string with commas added to the original string.
 */
export function numberWithCommas(x: string): string {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Show the mnemonic for certain currencies used in E2E test.
 *
 * @param currency - The string of digits to add commas to.
 * @returns A new string with the currency symbol.
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    GBP: '£',
    EUR: '€',
    CAD: '$',
    ZAR: 'R',
    UGX: '',
    BRL: 'R$',
    TWD: '$',
    GHS: 'GH₵',
    KES: 'KES ',
  };

  // Use the provided currency literal to look up the symbol
  const symbol = symbols[currency];

  // Return the symbol or a default value if not found
  return symbol || '';
}

/**
 * Filters a list of Playwright Locator elements to include only those
 * that do not have the specified attribute.
 *
 * @param allElements - A list of Locators to be filtered.
 * @param attributeName - The name of the attribute to check for exclusion.
 * @returns A filtered list of Locators without the specified attribute.
 */
export async function filterByAttribute(
  allElements: Locator[],
  attributeName: string,
): Promise<Locator[]> {
  const filteredElements: Locator[] = [];

  // Iterate over each Locator and filter based on the absence of the specified attribute
  for (const element of allElements) {
    const attributeValue = await element.getAttribute(attributeName);

    // If the specified attribute is not present, include the element in the filtered list
    if (attributeValue === null) {
      filteredElements.push(element);
    }
  }

  return filteredElements;
}

// Cache variable to store the data so multiple read file is not called
let cachedCurrencyPairs: CurrencyPairsType[] | null = null;

export const getCurrencyPairs = (
  liquidities: Liquidity[],
  fwd_rfq_type: FwdRfqType = 'api',
  count = 1,
): CurrencyPairsType[] => {
  if (!cachedCurrencyPairs) {
    try {
      const data = fs.readFileSync('./testStates/currencyPairs.json', 'utf8');
      cachedCurrencyPairs = JSON.parse(data) as CurrencyPairsType[];
    } catch (error) {
      console.error('Error reading or parsing the file:', error);
      cachedCurrencyPairs = [];
    }
  }

  return liquidities
    .map((liquidity) => {
      const currencyPairs: CurrencyPairsType[] = [];
      if (cachedCurrencyPairs) {
        for (const currencyPair of cachedCurrencyPairs) {
          if (
            liquidity === currencyPair.liquidity &&
            currencyPair.fwd_rfq_type === fwd_rfq_type
          ) {
            currencyPairs.push(currencyPair);
          }

          if (currencyPairs.length === count || currencyPairs.length > count) {
            break;
          }
        }
      }

      return currencyPairs;
    })
    .flat();
};
