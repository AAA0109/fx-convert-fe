import { DispatchFlag } from 'lib';
import { useContext } from 'react';
import { FeatureFlagDispatchContext } from '../FeatureFlag';

export const useToggleFeatureFlags = (): DispatchFlag =>
  useContext(FeatureFlagDispatchContext);

export default useToggleFeatureFlags;
