import { Badge } from '@mui/material';
import Chip from '@mui/material/Chip';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { CashflowStatusType, CashflowStatuses } from 'lib';
import { PangeaColors } from 'styles';

interface CashflowStatusChipProps {
  status: CashflowStatusType | CashflowStatusType[];
}

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: PangeaColors.SolidSlateMedium,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: PangeaColors.SolidSlateMedium,
  },
}));

export const StatusChip = (props: CashflowStatusChipProps) => {
  let allStatuses: CashflowStatusType[] = Array.isArray(props.status)
    ? props.status
    : [props.status];
  const hasBadge: boolean = allStatuses.length >= 2;
  if (allStatuses.length > 2) {
    allStatuses = allStatuses.slice(0, 2);
  }

  const normalizeStatus = (status: CashflowStatusType): string => {
    return status.toLowerCase().replace(' ', '');
  };

  const colorFromStatus = (
    status: Nullable<CashflowStatusType>,
  ): CashflowStatusType => {
    if (status == null) {
      return 'default';
    }
    const color = normalizeStatus(status) as CashflowStatusType;
    return CashflowStatuses.includes(color) ? color : 'default';
  };
  const displayNameForStatus = (status: CashflowStatusType): string => {
    return (
      {
        active: 'Active',
        pending: 'Pending',
        pending_margin: 'Pending Margin',
        pending_payment: 'Pending Payment',
        pending_approval: 'Pending Approval',
        draft: 'Drafting',
        unhealthy: 'Unhealthy',
        inflight: 'In Flight',
        archived: 'Archived',
        terminated: 'Terminated',
        settledearly: 'Terminated Early',
        settling_soon: '',
        default: 'Pending',
      }[status] ?? 'Pending'
    );
  };
  const MyChip = () => {
    return (
      <Chip
        variant='filled'
        color={colorFromStatus(allStatuses[0])}
        size='small'
        label={displayNameForStatus(allStatuses[0])}
      />
    );
  };
  return (
    <>
      {hasBadge && (
        <StyledTooltip
          title={`${displayNameForStatus(
            allStatuses[0],
          )}, ${displayNameForStatus(allStatuses[1])}`}
          placement='top'
          arrow
        >
          <Badge
            color={colorFromStatus(allStatuses[1])}
            variant='dot'
            sx={{
              '& .MuiBadge-dot': {
                height: '12px',
                width: '12px',
                borderRadius: '6px',
              },
            }}
          >
            <MyChip />
          </Badge>
        </StyledTooltip>
      )}
      {!hasBadge && <MyChip />}
    </>
  );
};
export default StatusChip;
