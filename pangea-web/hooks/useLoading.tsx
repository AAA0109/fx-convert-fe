import { useCallback, useState } from 'react';

export const useLoading = () => {
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    hasError: false,
  });

  const loadingPromise = useCallback(async (fn: Promise<void>) => {
    setLoadingState({ isLoading: true, hasError: false });
    let hasError = false;
    try {
      await fn;
    } catch {
      hasError = true;
    } finally {
      setLoadingState({ isLoading: false, hasError });
    }
  }, []);

  return { loadingState, setLoadingState, loadingPromise };
};
