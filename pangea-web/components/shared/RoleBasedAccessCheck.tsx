import useNewRelicLogger from 'hooks/useLogger';
import { PropsWithChildren } from 'react';
import { useFeatureFlags } from './FeatureFlag/hooks';

type Props = PropsWithChildren & {
  userGroups: string[];
  allowedGroups: string[];
  fallbackComponent?: React.ReactNode;
};

export const RoleBasedAccessCheck: React.FC<Props> = ({
  userGroups,
  allowedGroups,
  fallbackComponent,
  children,
}) => {
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldDisableRedirect = isFeatureEnabled('disable-error-redirects');
  const newRelicLogger = useNewRelicLogger();
  if (allowedGroups.some((group) => userGroups.includes(group))) {
    return <>{children}</>;
  } else if (shouldDisableRedirect) {
    newRelicLogger({
      Component: RoleBasedAccessCheck,
      message: 'Access check failed',
    });
    return <></>;
  }

  return <>{fallbackComponent ?? null}</>;
};

export default RoleBasedAccessCheck;
