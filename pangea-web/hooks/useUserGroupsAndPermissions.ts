import { userAccountGroupsState, userAccountPermissionsState } from 'atoms';
import { PangeaGroup, PangeaGroupEnum } from 'lib';
import { useMemo } from 'react';
import { useRecoilValueLoadable } from 'recoil';

export const useUserGroupsAndPermissions = () => {
  const userGroupsLoadable = useRecoilValueLoadable(userAccountGroupsState);
  const userPermissionsLoadable = useRecoilValueLoadable(
    userAccountPermissionsState,
  );
  return useMemo(() => {
    const userGroups =
      userGroupsLoadable.state === 'hasValue'
        ? userGroupsLoadable.contents
        : [];
    const mappedUserGroups =
      userGroups?.map((group: PangeaGroup) => group.name) ?? [];
    const userPermissions =
      userPermissionsLoadable.state === 'hasValue'
        ? userPermissionsLoadable.contents
        : [];
    return {
      userGroups: mappedUserGroups,
      userPermissions: userPermissions,
      isManager: mappedUserGroups.includes(PangeaGroupEnum.CustomerManager),
      isAdmin: mappedUserGroups.includes(PangeaGroupEnum.CustomerAdmin),
      isCreator: mappedUserGroups.includes(PangeaGroupEnum.CustomerCreator),
      isViewer:
        mappedUserGroups.includes(PangeaGroupEnum.CustomerViewer) ||
        mappedUserGroups.length === 0,
      isCorpay: mappedUserGroups.includes(PangeaGroupEnum.CustomerCorpay),
      isIbkr: mappedUserGroups.includes(PangeaGroupEnum.CustomerIbkr),
      isLoaded:
        userGroupsLoadable.state === 'hasValue' &&
        userPermissionsLoadable.state === 'hasValue' &&
        userGroupsLoadable.contents !== null &&
        userPermissionsLoadable.contents !== null,
    };
  }, [userGroupsLoadable, userPermissionsLoadable]);
};

export default useUserGroupsAndPermissions;
