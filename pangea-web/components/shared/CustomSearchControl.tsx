import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { GridSearchIcon } from '@mui/x-data-grid-pro';

export const CustomSearchControl = (props: any) => {
  const { apiRef, labelText, placeholder, sxProps = {} } = props;
  const handleOnSearch = useEventCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      apiRef.current.setQuickFilterValues(event.target.value.split(' '));
    },
  );
  return (
    <FormControl>
      {labelText && (
        <InputLabel size='small' variant='outlined' shrink>
          {labelText}
        </InputLabel>
      )}
      <OutlinedInput
        size='small'
        onBlur={handleOnSearch}
        onKeyDown={(
          e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
        ) => {
          if (e.key === 'Enter') {
            handleOnSearch(
              e as unknown as React.ChangeEvent<
                HTMLTextAreaElement | HTMLInputElement
              >,
            );
          }
        }}
        sx={{
          width: '400px',
          backgroundColor: 'transparent',
          '& input': {
            backgroundColor: 'transparent',
          },
          ...sxProps,
        }}
        endAdornment={<GridSearchIcon />}
        placeholder={placeholder ?? 'Search by name or currency'}
        label={labelText}
        aria-label={labelText}
        notched={!!labelText}
      />
    </FormControl>
  );
};
export default CustomSearchControl;
