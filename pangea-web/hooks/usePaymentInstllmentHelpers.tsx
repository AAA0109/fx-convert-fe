import { isValid, parseISO } from 'date-fns';
import { useCallback, useMemo } from 'react';


export const usePaymentInstallmentHelpers = () => {
  const isValueDateValid = useCallback((valueDate: string) => {
    return isValid(parseISO(valueDate));
  }, []);
  const isDescriptionValid = useCallback((description: string) => {
    return /^[\w\s\W]{1,150}$/.test(description);
  }, []);
  const isAmountValid = useCallback((amount: number) => {
    return amount > 0;
  }, []);

  return useMemo(
    () => ({
      isValueDateValid,
      isDescriptionValid,
      isAmountValid,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};
