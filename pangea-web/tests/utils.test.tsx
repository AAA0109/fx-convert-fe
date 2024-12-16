import { addDays } from 'date-fns';
import * as utils from 'lib';
import { FrequencyType, IMarginProjectionData } from 'lib';
import { replace } from 'lodash';

const HAPPY_RRULES = [
  'RRULE:FREQ=WEEKLY;COUNT=30;INTERVAL=1;WKST=MO',
  'DTSTART:20220614T103000Z\nRRULE:FREQ=MONTHLY;COUNT=20;INTERVAL=1;WKST=MO;BYDAY=TU,FR;BYMONTH=5',
  'RRULE:FREQ=WEEKLY;INTERVAL=1;WKST=MO',
];
const SAD_RRULES: Nullable<string>[] = [
  'RRULE:FREQ=FOOBAR;COUNT=30;INTERVAL=1;WKST=MO',
  '',
  null,
  'flurben knuckles',
];

describe('Utility Functions Suite', () => {
  test('getOccurrencesFromPattern parses happy path', () => {
    HAPPY_RRULES.forEach((r) => {
      const occurrences = utils.getOccurrencesFromPattern(r);
      // console.debug(r, occurrences.length);
      expect(occurrences.length).toBeGreaterThan(10);
      expect(Number(occurrences[0])).toBeLessThan(Number(occurrences[1]));
    });
  });
  test('getOccurrencesFromPattern upper limit works', () => {
    const unendingPattern = HAPPY_RRULES[2];
    let unendingOne = utils.getOccurrencesFromPattern(unendingPattern);
    expect(unendingOne.length).toBeLessThanOrEqual(730);

    // try setting a limit
    const upperLimit = 300;
    unendingOne = utils.getOccurrencesFromPattern(unendingPattern, upperLimit);
    expect(unendingOne.length).toBeLessThanOrEqual(upperLimit);
  });
  test('getOccurrencesFromPattern does not throw with bad input', () => {
    SAD_RRULES.forEach((r) => {
      const result = utils.getOccurrencesFromPattern(r);
      expect(result.length).toBe(0);
    });
  });
  test('accounts cashflows types convert to uuid and back', () => {
    const safeTestNumbers = [0, 1, 10, 1000, 10001, 823940234, 2 ** 32 - 1];
    Array<boolean>(10)
      .fill(true)
      .forEach(() => {
        safeTestNumbers.push(Math.floor(Math.random() * 2 ** 32));
      });
    const safeFreqTypes: FrequencyType[] = [
      'installments',
      'recurring',
      'onetime',
    ];
    safeTestNumbers.forEach((accountId) => {
      safeTestNumbers.forEach((cashflowId) => {
        safeFreqTypes.forEach((freqType) => {
          const uuid = utils.uuidFromCashflowIds(
            accountId,
            cashflowId,
            freqType,
          );
          expect(uuid.length).toBe(36);
          const cashflowIds = utils.cashflowIdsFromUuid(uuid);
          expect(cashflowId).toBe(cashflowIds.cashflowId);
          expect(accountId).toBe(cashflowIds.accountId);
          expect(freqType).toBe(cashflowIds.cashflowType);
        });
      });
    });
  });
  test('Margin Health - returns empty array on null', () => {
    const testData: IMarginProjectionData[] = [];
    const returnVal = utils.calculateHealthScores(testData, 0);
    expect(returnVal.length).toBe(0);
  });
  test('Margin Health - ', () => {
    const baseDate = new Date();
    const days = Array.from({ length: 30 }, (_, index) => index);
    const rndAmount = (min: number) => {
      return Math.floor(min + Math.random() * 10000);
    };
    const testData: IMarginProjectionData[] = days.map((d) => {
      const liquid_level = rndAmount(10000);
      const maintenance_level = rndAmount(liquid_level);
      const buffer_level = rndAmount(maintenance_level);
      const margin_amt = Math.floor(2 * Math.random() * maintenance_level);
      return {
        date: addDays(baseDate, d).toISOString(),
        liquid_level,
        maintenance_level,
        buffer_level,
        margin_amt,
      };
    });
    const returnVal = utils.calculateHealthScores(testData, 0);
    expect(returnVal.length).toBe(30);
    expect(
      returnVal.reduce((prev, curr) => {
        return prev.score >= curr.score ? prev : curr;
      }).score,
    ).toBeLessThanOrEqual(120);
  });

  test('create good dates from standardizeDate method', () => {
    expect(utils.standardizeDate().getUTCHours()).toBe(9);
    expect(utils.standardizeDate(new Date()).getUTCHours()).toBe(9);
    expect(utils.standardizeDate(Number(4)).getUTCHours()).toBe(9);
    expect(utils.standardizeDate('8-22-2022').getUTCHours()).toBe(9);
  });

  test('getIpAddressEndpoint works', async () => {
    const ip = await utils.getIPAddressAsync();
    expect(ip).not.toBeNull();
    expect(replace(ip, ':', '.')).toContain('.'); //support for ipv6
  }, 30000);
});
