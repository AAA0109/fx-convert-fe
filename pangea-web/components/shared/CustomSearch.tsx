import { Box } from '@mui/material';
import { CustomSearchControl } from './CustomSearchControl';
import PangeaButton from './PangeaButton';
import { PangeaColors } from 'styles';
import { resetHedgeState } from 'atoms';
import { useSetRecoilState } from 'recoil';

export const CustomSearch = (props: any) => {
  const { apiRef } = props;

  const resetAllHedgeState = useSetRecoilState(resetHedgeState);
  const handleCreateHedgeClick = () => {
    resetAllHedgeState(null);
  };
  return (
    <Box
      display='flex'
      justifyContent='flex-end'
      width='auto'
      py={2}
      my={2}
      columnGap={2}
    >
      <CustomSearchControl apiRef={apiRef} labelText='Search' />
      <PangeaButton
        href='/cashflow'
        onClick={handleCreateHedgeClick}
        sx={{
          height: '40px',
          backgroundColor: PangeaColors.SolidSlateMedium,
          color: PangeaColors.White,
          border: 0,
          '&.Mui-selected': { color: PangeaColors.White },
        }}
      >
        Create Hedge
      </PangeaButton>
    </Box>
  );
};
export default CustomSearch;
