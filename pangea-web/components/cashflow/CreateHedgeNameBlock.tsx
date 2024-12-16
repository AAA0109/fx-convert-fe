import { TextField } from '@mui/material';
import { AnyHedgeItem, Cashflow, HedgeItemComponentProps } from 'lib';
import { ChangeEvent, useMemo } from 'react';
import { PangeaErrorFormHelperText } from '../shared';

export const CreateHedgeNameBlock = (props: HedgeItemComponentProps) => {
  const { isValidForm = true } = props;

  const showHedgeNameError = useMemo(
    () => !isValidForm && !props.value?.name,
    [isValidForm, props.value?.name],
  );

  const handlePropChange = (callback: (hedgeItem: AnyHedgeItem) => void) => {
    if (!props.value || !props.onChange) {
      return;
    }
    const hedgeItem = props.value.clone();
    callback(hedgeItem);
    props.onChange(hedgeItem);
  };
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    handlePropChange(
      (hedgeItem) => (hedgeItem.name = event.currentTarget.value),
    );
  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) =>
    handlePropChange(
      (hedgeItem) =>
        ((hedgeItem as Cashflow).description = event.currentTarget.value),
    );

  return (
    <>
      <TextField
        sx={{ width: '50%' }}
        label='Cash Flow Name'
        variant='filled'
        helperText='Example: 	&ldquo;Materials Purchase.&ldquo;'
        defaultValue={props.value?.name}
        onChange={handleNameChange}
        error={showHedgeNameError}
      />
      {showHedgeNameError && (
        <PangeaErrorFormHelperText
          text='Please fill out the hedge name'
          visible={showHedgeNameError}
        />
      )}
      <TextField
        fullWidth
        label='Cash flow description'
        variant='filled'
        helperText='Example: &ldquo;For international purchases via our partner	&ldquo;'
        defaultValue={props.value?.description}
        onChange={handleDescriptionChange}
      />
    </>
  );
};
export default CreateHedgeNameBlock;
