import axios from 'axios';
import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';

export default function useNewRelicLogger(): (logData: {
  Component?: FC<any>;
  message: string;
  customName?: string;
}) => Promise<string> {
  const router = useRouter();
  return useCallback(async (logData) => {
    const { Component, message, customName } = logData;
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const componentName = customName ?? getComponentName(Component!);
      await axios.post('/api/logger', {
        title: `${componentName} redirecting to dashboard`,
        application: 'Pangea Web logging',
        pathname: router.asPath,
        message,
      });
      router.push('/dashboard');
      return `Error occurred in ${componentName}`;
    } catch (error) {
      console.log('errro in logging');
      return '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function getComponentName(Component: FC) {
  return Component.displayName || Component.name || 'Component';
}
