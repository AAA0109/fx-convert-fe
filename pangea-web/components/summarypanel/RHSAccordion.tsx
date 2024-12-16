import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { PangeaColors } from 'styles';

export const RHSAccordion = ({
  title,
  children,
  lockOpen = false,
  defaultExpanded = true,
  showDivider = true,
  showHeaderDivider = true,
}: {
  title: string;
  children: ReactNode | ReactNode[];
  lockOpen?: boolean;
  defaultExpanded?: boolean;
  showDivider?: boolean;
  showHeaderDivider?: boolean;
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <Accordion
      sx={{
        backgroundColor: PangeaColors.White,
        borderRadius: '8px',
        border: '1px solid ' + PangeaColors.Gray,
        mb: '8px',
      }}
      expanded={expanded}
      disableGutters={true}
      defaultExpanded={defaultExpanded}
      onChange={(_, isExpanded) => {
        //this seems stupid but you have to do something here to get it to draw expanded.
        setExpanded(lockOpen || isExpanded);
      }}
    >
      <AccordionSummary
        expandIcon={lockOpen ? null : <ExpandMore />}
        sx={{ paddingX: '12px', paddingY: 0 }}
      >
        <Typography variant='body1'>{title}</Typography>
      </AccordionSummary>
      {showHeaderDivider ? (
        <Divider
          sx={{
            borderColor: PangeaColors.Gray,
            marginX: '12px',
          }}
        />
      ) : null}
      <AccordionDetails sx={{ paddingX: '12px' }}>
        <Stack
          spacing={1}
          sx={{ '& hr:last-child': { display: 'none' } }}
          divider={
            showDivider ? (
              <Divider
                sx={{
                  borderColor: PangeaColors.Gray,
                }}
              />
            ) : null
          }
        >
          {children}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
export default RHSAccordion;
