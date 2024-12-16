import { Alert, Box, Stack } from '@mui/material';
import { ArrayFieldTemplateProps } from 'react-jsonschema-form';
import PangeaButton from '../PangeaButton';

export const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  return (
    <Stack direction='column' rowGap={1}>
      <props.TitleField
        id={props.schema.$id ?? ''}
        title={props.title}
        required={props.required}
      />
      {props.items.length === 0 && (
        <Alert severity='warning'>No {props.title}</Alert>
      )}
      {props.items.map(
        ({ children, onDropIndexClick, hasRemove, key, index }) => (
          <Stack key={key} direction='row' columnGap={2}>
            <Box flex={1}>{children}</Box>
            {hasRemove && (
              <PangeaButton
                type='button'
                variant='text'
                color='error'
                onClick={(event) => onDropIndexClick(index)(event)}
                sx={{
                  minWidth: '100px',
                }}
              >
                Remove
              </PangeaButton>
            )}
          </Stack>
        ),
      )}
      {props.canAdd && (
        <PangeaButton type='button' onClick={props.onAddClick}>
          Add {props.title}
        </PangeaButton>
      )}
    </Stack>
  );
};

export default ArrayFieldTemplate;
