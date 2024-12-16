import AddBox from '@mui/icons-material/AddBox';
import LibraryAdd from '@mui/icons-material/LibraryAdd';
import useEventCallback from '@mui/utils/useEventCallback';
import { useAuthHelper } from 'hooks';
import { useState } from 'react';
import { ListItemWithCheckbox, StepperShell } from '../shared';

export const CreateHedgeQuantityStep = () => {
  const [nextPage, setNextPage] = useState<string>('frequency');
  const [quantity, setQuantity] = useState<Optional<string>>(undefined);
  const userAuth = useAuthHelper();
  const handleRadioSelectValue = useEventCallback((selection: string) => {
    setNextPage(selection === 'one' ? 'frequency' : 'advanced');
    setQuantity(selection);
  });
  return (
    <StepperShell
      continueButtonHref={`/cashflow/details/${nextPage}`}
      title="I'm hedging:"
      backButtonVisible={false}
      continueButtonEnabled={!!quantity && userAuth.canTrade}
    >
      <ListItemWithCheckbox
        value={quantity}
        onChange={handleRadioSelectValue}
        listData={[
          {
            icon: <AddBox />,
            primaryText: 'One cash flow',
            secondaryText:
              'Hedge a single cash flow, which can be a one-time, installment-based, or recurring transaction.',
            value: 'one',
          },
          {
            icon: <LibraryAdd />,
            primaryText: 'Multiple cash flows',
            secondaryText:
              'Bulk upload multiple cash flows with a csv file or manual entry.',
            value: 'multiple',
          },
        ]}
      />
    </StepperShell>
  );
};
export default CreateHedgeQuantityStep;
