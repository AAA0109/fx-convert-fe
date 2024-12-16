import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useRouterParts = () => {
  const router = useRouter();
  const [routerParts, setRouterParts] = useState<string[]>([]);
  useEffect(() => {
    if (router.isReady) {
      setRouterParts(
        router.asPath.toLowerCase().substring(1).split('?')[0].split('/'),
      );
    }
  }, [router]);

  return {
    router,
    routerParts,
    isRouterReady: router.isReady,
  };
};

export default useRouterParts;
