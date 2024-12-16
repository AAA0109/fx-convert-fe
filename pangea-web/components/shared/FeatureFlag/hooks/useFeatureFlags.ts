import { FlagName, Flags } from 'lib';
import { useCallback, useContext } from 'react';
import { FeatureFlagContext } from '../FeatureFlag';

export function useFeatureFlags(): {
  flags: Flags;
  isFeatureEnabled: (name: FlagName | FlagName[]) => boolean;
} {
  const flags = useContext(FeatureFlagContext);

  if (!flags) {
    throw Error('this hook must be used within a FeatureFlagProvider');
  }

  const isFeatureEnabled = useCallback(
    (name: string | string[]): boolean => {
      if (typeof name === 'string') {
        const flag = flags[name];
        return Boolean(flag?.enabled);
      }
      return name.every((n) => isFeatureEnabled(n));
    },
    [flags],
  );

  return { flags, isFeatureEnabled };
}

export default useFeatureFlags;
