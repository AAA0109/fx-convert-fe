import { DispatchArg, Flags } from 'lib';
import React, { useReducer } from 'react';
import { FeatureFlagContext, FeatureFlagDispatchContext } from './FeatureFlag';
import FeatureFlagDevTool from './FeatureFlagDevTool';

type FeatureFlagProviderProps = React.PropsWithChildren<{
  enableDevTool?: boolean;
  features: Flags;
}>;

const reducer = (state: Flags, update: DispatchArg) => {
  if (!update) return state;

  const newState = { ...state };
  Object.entries<boolean>(update).forEach(([key, value]) => {
    const flag = newState[key];
    newState[key] = {
      ...flag,
      enabled: value,
      createdAt: flag?.createdAt ?? new Date(),
    };
  });

  return newState;
};

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({
  features,
  children,
  enableDevTool = false,
}) => {
  const [state, dispatch] = useReducer(reducer, features);
  return (
    <FeatureFlagContext.Provider value={state}>
      <FeatureFlagDispatchContext.Provider value={dispatch}>
        {enableDevTool && <FeatureFlagDevTool />}
        {children}
      </FeatureFlagDispatchContext.Provider>
    </FeatureFlagContext.Provider>
  );
};

export default FeatureFlagProvider;
