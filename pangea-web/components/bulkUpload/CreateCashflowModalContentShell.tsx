import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import {
  AnyHedgeItem,
  Cashflow,
  CashflowDirectionType,
  FrequencyType,
  getFirstBusinessDayOfFollowingWeek,
  getStartOfToday,
  Installment,
} from 'lib';
import { useState } from 'react';
import { PangeaColors } from 'styles';
import { CreateHedgeCurrencyBlock } from '../cashflow/CreateHedgeCurrencyBlock';
import { CreateHedgeCurrencyPricingBlock } from '../cashflow/CreateHedgeCurrencyPricingBlock';
import { CreateHedgeDatePicker } from '../cashflow/CreateHedgeDatePicker';
import { CreateHedgeInstallmentsTableBlock } from '../cashflow/CreateHedgeInstallmentsTableBlock';
import { CreateHedgeNameBlock } from '../cashflow/CreateHedgeNameBlock';
import { CreateHedgeRecurringCashFlowToggle } from '../cashflow/CreateHedgeRecurringCashFlowToggle';
import { PaymentSummary } from '../cashflow/PaymentSummary';
import { StepperShell } from '../shared';

type BulkUploadCreateHedgeStepType = 'details' | FrequencyType;

export const CreateCashflowModalContentShell = ({
  doneButtonClicked,
  hedgeItem,
}: {
  doneButtonClicked?: (hedgeItem: AnyHedgeItem) => void;
  hedgeItem?: AnyHedgeItem;
}) => {
  const [activeStep, setActiveStep] = useState<BulkUploadCreateHedgeStepType>(
    hedgeItem?.type ?? 'details',
  );
  const [editableHedge, setEditableHedge] = useState<AnyHedgeItem>(
    hedgeItem ?? new Cashflow(),
  );
  const handleDone = () => editableHedge && doneButtonClicked?.(editableHedge);

  return (
    <>
      {activeStep === 'details' && (
        <StepperShell
          sx={{ border: 'none', padding: 0 }}
          bgColor='transparent'
          title={'Cash flow Details'}
          continueButtonText='Next'
          backButtonVisible={false}
          continueButtonEnabled={
            !!editableHedge?.type &&
            !!editableHedge.name &&
            !!editableHedge.currency
          }
          onClickContinueButton={() => {
            setActiveStep(
              (editableHedge?.type ??
                'details') as BulkUploadCreateHedgeStepType,
            );
          }}
        >
          <CashFlowDetailsStep
            initialState={editableHedge}
            onChange={(hI) => {
              setEditableHedge(hI);
            }}
          />
        </StepperShell>
      )}
      {activeStep === 'onetime' && (
        <StepperShell
          sx={{ border: 'none', padding: 0 }}
          bgColor='transparent'
          title={'One-Time Cash Flow'}
          continueButtonText='Done'
          onClickBackButton={() => {
            setActiveStep('details');
          }}
          continueButtonEnabled={
            (editableHedge?.amount ?? -1) > 0 &&
            (editableHedge as Cashflow).date >
              getFirstBusinessDayOfFollowingWeek(getStartOfToday())
          }
          onClickContinueButton={handleDone}
        >
          <OneTimeCashFlowStep
            initialState={editableHedge}
            onChange={setEditableHedge}
          />
        </StepperShell>
      )}
      {activeStep === 'recurring' && (
        <StepperShell
          sx={{ border: 'none', padding: 0 }}
          bgColor='transparent'
          title={'Recurring Cash Flow'}
          continueButtonText='Done'
          onClickBackButton={() => {
            setActiveStep('details');
          }}
          continueButtonEnabled={
            (editableHedge?.amount ?? -1) > 0 &&
            (editableHedge as Cashflow).isValidRRulePattern()
          }
          onClickContinueButton={handleDone}
        >
          <RecurringFlowStep
            initialState={editableHedge}
            onChange={(hI) => setEditableHedge(hI)}
          />
        </StepperShell>
      )}
      {activeStep === 'installments' && (
        <StepperShell
          sx={{ border: 'none', padding: 0 }}
          bgColor='transparent'
          title={'Installments'}
          continueButtonText='Done'
          onClickBackButton={() => {
            setActiveStep('details');
          }}
          continueButtonEnabled={(editableHedge?.amount ?? -1) > 0}
          onClickContinueButton={handleDone}
        >
          <InstallmentsStep
            initialState={editableHedge}
            onChange={(hI) => setEditableHedge(hI)}
          />
        </StepperShell>
      )}
    </>
  );
};

const CashFlowDetailsStep = ({
  initialState,
  onChange,
}: {
  initialState?: AnyHedgeItem;
  onChange?: (value: AnyHedgeItem) => void;
}) => {
  const [hedgeItem, setHedgeItem] = useState(initialState);
  const handleHedgeItemChange = (hI: AnyHedgeItem) => {
    onChange?.(hI);
    setHedgeItem(hI);
  };
  const handleCashFlowDirectionStateChange = (
    _event: React.MouseEvent<HTMLElement>,
    passedValue: CashflowDirectionType,
  ) => {
    if (!hedgeItem || !passedValue) {
      return;
    }
    const hi = hedgeItem.clone();
    hi.direction = passedValue;
    handleHedgeItemChange(hi);
  };

  const handleFrequencyStateChange = (
    _event: React.MouseEvent<HTMLElement>,
    passedValue: FrequencyType,
  ) => {
    if (!hedgeItem || !passedValue) {
      return;
    }
    let hi = hedgeItem.clone();
    if (hi.type !== passedValue && passedValue === 'installments') {
      //switching to installment
      const i = Installment.fromObject(hi);
      hi = i;
    } else if (hi.type !== passedValue && hi.type === 'installments') {
      hi.type = passedValue;
      const c = Cashflow.fromObject({
        id: Cashflow.DEFAULT_ID,
        ...hi.toObject(),
      }).clone();
      hi = c;
    }
    hi.type = passedValue;
    handleHedgeItemChange(hi);
  };
  return (
    <>
      <CreateHedgeNameBlock
        value={hedgeItem}
        onChange={(hI) => handleHedgeItemChange(hI)}
      />
      <CreateHedgeCurrencyBlock
        value={hedgeItem}
        onChange={(hI) => handleHedgeItemChange(hI)}
      />
      {/* <Stack direction={'row'} alignItems={'center'}>
        <Checkbox />
        <Typography variant='body2' component={'span'}>
          Exclude this cash flow from optimization
        </Typography>
      </Stack> */}
      <Typography>Choose a cash flow direction</Typography>
      <ToggleButtonGroup
        value={hedgeItem?.direction ?? 'paying'}
        exclusive
        onChange={handleCashFlowDirectionStateChange}
        sx={{
          '& .MuiButtonBase-root': {
            width: '50%',
            fontSize: '16px',
            borderColor: PangeaColors.BlackSemiTransparent50,
          },
        }}
      >
        <ToggleButton value='paying'>Paying</ToggleButton>
        <ToggleButton value='receiving'>Receiving</ToggleButton>
      </ToggleButtonGroup>
      <Typography>Choose a frequency</Typography>
      <ToggleButtonGroup
        value={hedgeItem?.type ?? 'onetime'}
        exclusive
        onChange={handleFrequencyStateChange}
        sx={{
          '& .MuiButtonBase-root': {
            width: '50%',
            fontSize: '16px',
            borderColor: PangeaColors.BlackSemiTransparent50,
          },
        }}
      >
        <ToggleButton value='onetime'>One-time</ToggleButton>
        <ToggleButton value='recurring'>Recurring</ToggleButton>
        <ToggleButton value='installments'>Installments</ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};

const OneTimeCashFlowStep = ({
  initialState,
  onChange,
}: {
  initialState?: AnyHedgeItem;
  onChange?: (value: AnyHedgeItem) => void;
}) => {
  return (
    <>
      <CreateHedgeCurrencyPricingBlock
        value={initialState}
        onChange={onChange}
      />
      <CreateHedgeDatePicker value={initialState} onChange={onChange} />
    </>
  );
};

const RecurringFlowStep = ({
  initialState,
  onChange,
}: {
  initialState?: AnyHedgeItem;
  onChange?: (value: AnyHedgeItem) => void;
}) => {
  return (
    <>
      <CreateHedgeCurrencyPricingBlock
        value={initialState}
        onChange={onChange}
      />
      <CreateHedgeRecurringCashFlowToggle
        value={initialState}
        onChange={onChange}
      />
      <PaymentSummary value={initialState} />
    </>
  );
};

const InstallmentsStep = ({
  initialState,
  onChange,
}: {
  initialState?: AnyHedgeItem;
  onChange?: (value: AnyHedgeItem) => void;
}) => {
  return (
    <>
      <CreateHedgeInstallmentsTableBlock
        value={initialState}
        onChange={onChange}
      />
      <PaymentSummary value={initialState} />
    </>
  );
};
export default CreateCashflowModalContentShell;
