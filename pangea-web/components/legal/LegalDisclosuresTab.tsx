import { Box, Typography } from '@mui/material';
import { PangeaColors } from 'styles';
import { ActionContainer } from '../shared';

export const LegalDisclosuresTab = () => {
  return (
    <Box
      marginTop={'4rem'}
      sx={{
        bgcolor: PangeaColors.White,
        border: `1px solid ${PangeaColors.Gray}`,
        borderRadius: '4px',
        padding: '24px',
      }}
    >
      <ActionContainer>
        <Typography
          variant='body1'
          sx={{
            color: PangeaColors.BlackSemiTransparent60,
          }}
        >
          Updated 07/28/2022
        </Typography>
        <Typography variant='h4'>Disclosures</Typography>
        <Typography component='p'>
          Pangea Technologies, Inc. (“Pangea”) is a registered Commodity Trading
          Advisor with the Commodity Futures Trading Commission (“CFTC”) and a
          Member of the National Futures Association (“NFA”).
        </Typography>
        <Typography component='p'>
          This material does not constitute an offer to sell or solicitation of
          an offer to purchase securities or other investments and is purely
          informational only. All prospective investors must be “qualified
          eligible persons” as defined in CFTC Regulation 4.7.
        </Typography>
        <Typography component='p'>
          This material is not required to be and has not been filed with the
          CFTC, NFA or other regulatory authority. This material has been
          prepared from original sources and data believed to be reliable.
          However, no representations are made as to the accuracy or
          completeness thereof. Certain information included herein reflects the
          opinion of Pangea and is subject to change without further notice.
        </Typography>
        <Typography component='p'>
          Investment in Pangea is speculative and involves significant risk of
          loss. There can be no assurance that Pangea will be able to realize
          its objectives. Investments may not be suitable for all investors.
          Past performance is not necessarily indicative of future results.
        </Typography>
      </ActionContainer>
    </Box>
  );
};
export default LegalDisclosuresTab;
