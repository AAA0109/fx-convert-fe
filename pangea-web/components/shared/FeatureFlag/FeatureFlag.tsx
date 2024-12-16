import { DispatchFlag, FlagName, Flags } from 'lib';
import React from 'react';
import { useFeatureFlags } from './hooks';

export const FeatureFlagContext = React.createContext<Flags>({});
export const FeatureFlagDispatchContext = React.createContext<DispatchFlag>(
  null as unknown as DispatchFlag,
);

type FeatureFlagProps = React.PropsWithChildren<{
  name: FlagName | FlagName[];
  fallback?: React.ReactNode;
}>;

export const FeatureFlag: React.FC<FeatureFlagProps> = ({
  name,
  children,
  fallback,
}): JSX.Element | null => {
  const { isFeatureEnabled } = useFeatureFlags();

  if (isFeatureEnabled(name)) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  return null;
};
