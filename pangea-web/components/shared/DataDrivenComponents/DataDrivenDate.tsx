import { FormControl } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { format, isValid } from 'date-fns';
import { WidgetProps } from 'react-jsonschema-form';

export const DataDrivenDate = ({
  value,
  onChange,
  schema,
}: WidgetProps): JSX.Element => {
  const { description } = schema;
  const dateValue = value ? new Date(value) : null;
  return (
    <FormControl>
      <DesktopDatePicker<Date>
        label={description}
        value={dateValue}
        format='yyyy-MM-dd'
        views={['year', 'month', 'day']}
        reduceAnimations
        onChange={(value) => {
          if (isValid(value) && value) {
            onChange(format(value, 'yyyy-MM-dd'));
          }
        }}
        slotProps={{
          popper: {
            modifiers: [
              {
                name: 'viewHeightModifier',
                enabled: true,
                phase: 'beforeWrite',
                fn: ({ state }: { state: Partial<any> }) => {
                  state.styles.popper.height = '320px';
                  if (state.placement.includes('top-start')) {
                    state.styles.popper = {
                      ...state.styles.popper,
                      display: 'flex',
                      alignItems: 'flex-end',
                    };
                  }
                  if (state.placement.includes('bottom')) {
                    state.styles.popper = {
                      ...state.styles.popper,
                      display: 'block',
                    };
                  }
                },
              },
            ],
          },
        }}
      />
    </FormControl>
  );
};

export default DataDrivenDate;
