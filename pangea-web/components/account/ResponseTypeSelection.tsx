import RadioButtonCheckedOutlined from '@mui/icons-material/RadioButtonCheckedOutlined';
import RadioButtonUncheckedOutlined from '@mui/icons-material/RadioButtonUncheckedOutlined';
import { Box, FormControlLabel, Radio, Stack, Typography } from '@mui/material';
import { MessageMode } from 'lib';
import { ReactNode } from 'react';
import { PangeaColors } from 'styles';

export const ResponseTypeSelection = (
  value: MessageMode,
  label: string,
  contactData: string,
  icon: ReactNode,
): ReactNode => {
  return (
    <FormControlLabel
      value={value}
      control={
        <Radio
          icon={<RadioButtonUncheckedOutlined />}
          checkedIcon={<RadioButtonCheckedOutlined />}
          size={'medium'}
          sx={{
            // '& .MuiSvgIcon-root': {
            //   fontSize: '28',
            // },
            margin: '0',
            padding: '0',
          }}
        />
      }
      labelPlacement={'start'}
      label={
        <Stack
          direction={'row'}
          justifyItems={'space-between'}
          alignItems={'center'}
          spacing={1}
          sx={{ width: '500px', height: '63pxf' }}
        >
          {icon}
          <Box>
            <Typography variant={'body1'}>{label}</Typography>
            <Typography variant={'body2'} color={PangeaColors.SolidSlateLight}>
              {contactData}
            </Typography>
          </Box>
        </Stack>
      }
      sx={{
        width: '526px',
        marginLeft: 0,
        borderWidth: '1px',
        borderColor: PangeaColors.Gray,
        borderStyle: 'solid',
        padding: 1.3125,
      }}
    />
  );
};
export default ResponseTypeSelection;
