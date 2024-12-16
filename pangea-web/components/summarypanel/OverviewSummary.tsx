import ListIcon from '@mui/icons-material/List';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
} from '@mui/material';
import {
  activeHedgeState,
  activeOriginalHedgeState,
  allAccountsState,
  forwardsModalState,
  manageHedgeTypeUrlState,
} from 'atoms';
import { useCashflow, useUserGroupsAndPermissions } from 'hooks';
import {
  Cashflow,
  PangeaCashflowStatusEnum,
  PangeaGroupEnum,
  PangeaUpdateRequestTypeEnum,
  titleCase,
} from 'lib';
import { isUndefined } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import SwapHoriz from '../../public/images/SwapHorizontalCircleFilled.svg';
import RiskSvg from '../../public/images/type-high.svg';
import { RoleBasedAccessCheck, StatusChip } from '../shared';
import { AccordionContentBlock } from './AccordionContentBlock';
import { DeleteDraftButton } from './DeleteDraftButton';
import { ManageMenuButton } from './ManageMenuButton';
import { SettleHedgeButton } from './SettleHedgeButton';

import { PangeaSimpleDialog } from 'components/modals';
import { ForwardManagementModalContent } from 'components/modals/forwards';
import { useMemo, useState } from 'react';
import { RHSAccordion } from './RHSAccordion';

export const OverviewSummary = () => {
  const { isLoaded, qs } = useCashflow({
    useRouter: true,
    loadDraftIfAvailable: false,
    force: true,
  });
  const activeHedge = useRecoilValue(activeHedgeState);
  const activeOriginalHedge = useRecoilValue(activeOriginalHedgeState);
  const { userGroups } = useUserGroupsAndPermissions();
  const isSettled =
    activeHedge?.ui_status.indexOf('archived') == 0 ||
    activeHedge?.ui_status.indexOf('terminated') == 0;
  const accounts = useRecoilValue(allAccountsState);
  const linkUrl = useRecoilValue(manageHedgeTypeUrlState);
  const originalAccount = accounts.find(
    (a) => a.id == activeOriginalHedge?.accountId,
  );
  const riskReduction: number =
    (originalAccount?.hedge_settings.custom.vol_target_reduction ?? NaN) * 100;
  const cashflowStatus = activeOriginalHedge?.ui_status ?? ['default'];
  const [visible, setVisible] = useRecoilState(forwardsModalState);
  const [dialogMode, setDialogMode] = useState<PangeaUpdateRequestTypeEnum>(
    PangeaUpdateRequestTypeEnum.CashflowDetails,
  );
  const disableCashflowUpdate = useMemo(() => {
    return (
      (activeOriginalHedge as Cashflow)?.status ===
      PangeaCashflowStatusEnum.Active
    );
  }, [activeOriginalHedge]);
  return isLoaded ? (
    <>
      <Stack spacing={2}>
        <RHSAccordion title='Summary' defaultExpanded={true}>
          <AccordionContentBlock label='Status' autoWidthRight>
            <StatusChip status={cashflowStatus} />
          </AccordionContentBlock>
          <AccordionContentBlock label='TYPE'>
            {!activeHedge.is_forward ? 'Zero' : 'Auto-Pilot (Forward)'}
          </AccordionContentBlock>
          {!activeHedge.is_forward && (
            <AccordionContentBlock label='Portfolio'>
              {isUndefined(originalAccount)
                ? 'None'
                : titleCase(originalAccount?.name)}
            </AccordionContentBlock>
          )}
          <AccordionContentBlock label='Risk Reduction'>
            {isNaN(riskReduction) ? 'N/A' : `${riskReduction.toFixed(2)}%`}
          </AccordionContentBlock>
          <AccordionContentBlock label=''>
            <RoleBasedAccessCheck
              userGroups={userGroups}
              allowedGroups={[
                PangeaGroupEnum.CustomerCreator,
                PangeaGroupEnum.CustomerManager,
                PangeaGroupEnum.CustomerAdmin,
              ]}
            >
              <FormControl fullWidth>
                <InputLabel
                  style={{
                    transform: 'translate(18px, 9px) scale(1)',
                    fontWeight: '500',
                  }}
                >
                  Manage{' '}
                </InputLabel>
                <Select
                  variant={'outlined'}
                  size={'small'}
                  MenuProps={{ MenuListProps: { disablePadding: true } }}
                >
                  <ManageMenuButton
                    icon={<ListIcon />}
                    title={'Edit cash flow details'}
                    description={'Edit cash flow name, payments and dates'}
                    href={
                      !disableCashflowUpdate ? `${linkUrl}?${qs}` : undefined
                    }
                    onClick={() => {
                      if (disableCashflowUpdate) {
                        setVisible(!visible);
                        setDialogMode(
                          PangeaUpdateRequestTypeEnum.CashflowDetails,
                        );
                      }
                    }}
                  />
                  <MenuItem divider sx={{ padding: 0 }} />
                  <ManageMenuButton
                    icon={<RiskSvg />}
                    title={'Edit risk details'}
                    description={
                      'Choose a different risk portfolio or create a new one.'
                    }
                    href={
                      !disableCashflowUpdate ? `/manage/hedge?${qs}` : undefined
                    }
                    onClick={() => {
                      if (disableCashflowUpdate) {
                        setVisible(!visible);
                        setDialogMode(PangeaUpdateRequestTypeEnum.RiskDetails);
                      }
                    }}
                  />
                  {activeHedge.is_forward && (
                    <MenuItem divider sx={{ padding: 0 }} />
                  )}
                  {activeHedge.is_forward && (
                    <ManageMenuButton
                      icon={<SwapHoriz />}
                      title={'Edit Settlement details'}
                      description={'Adjust this forward’s settlement details'}
                      href={
                        !disableCashflowUpdate
                          ? `/manage/hedge?${qs}`
                          : undefined
                      }
                      onClick={() => {
                        if (disableCashflowUpdate) {
                          setVisible(!visible);
                          setDialogMode(PangeaUpdateRequestTypeEnum.Ndf);
                        }
                      }}
                    />
                  )}

                  {!isSettled && <MenuItem divider sx={{ padding: 0 }} />}
                  {!isSettled && cashflowStatus.includes('draft') ? (
                    <DeleteDraftButton />
                  ) : null}
                  {!isSettled && !cashflowStatus.includes('draft') ? (
                    <SettleHedgeButton
                      label={
                        activeHedge.is_forward ? 'Drawdown Early' : undefined
                      }
                      onClick={
                        activeHedge.is_forward
                          ? () => {
                              setVisible(!visible);
                              setDialogMode(
                                PangeaUpdateRequestTypeEnum.RiskDetails,
                              );
                            }
                          : null
                      }
                    />
                  ) : null}
                </Select>
              </FormControl>
            </RoleBasedAccessCheck>
          </AccordionContentBlock>
        </RHSAccordion>
      </Stack>
      <PangeaSimpleDialog
        openModal={visible}
        onClose={() => {
          setVisible(!visible);
        }}
      >
        <ForwardManagementModalContent
          mode={dialogMode}
          forwardId={qs}
          onClose={() => {
            setVisible(!visible);
          }}
        />
      </PangeaSimpleDialog>
    </>
  ) : (
    <Skeleton />
  );
};
export default OverviewSummary;
