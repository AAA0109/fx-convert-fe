import HorizontalRuleOutlinedIcon from '@mui/icons-material/HorizontalRuleOutlined';
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { DocumentCardProps } from 'lib';
import { PangeaColors } from 'styles';

export const DocumentCard = (props: DocumentCardProps) => {
  const { title, description, onCheck, name, checked, tooltipText } = props;

  return (
    <Card
      variant='outlined'
      sx={{
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        boxShadow: 'none',
        backgroundColor: PangeaColors.White,
      }}
    >
      <CardContent>
        <Stack direction='row' alignItems={'center'} spacing={2}>
          <Checkbox checked={checked} onChange={onCheck} name={name} />
          <Stack direction={'column'}>
            <Typography variant='body2'>{title}</Typography>
            <Typography variant='body2' color='textSecondary'>
              {description}
            </Typography>
          </Stack>
          <Stack direction={'column'} alignItems={'flex-end'} flexGrow={1}>
            <Tooltip
              title={
                <>
                  {tooltipText.map((text, index) => {
                    return (
                      <Stack direction={'row'} spacing={1} key={index}>
                        <HorizontalRuleOutlinedIcon fontSize='small' />
                        <Typography variant='body2'>{text}</Typography>
                      </Stack>
                    );
                  })}
                </>
              }
              placement='right-start'
            >
              <Button
                variant='text'
                size='medium'
                sx={{
                  color: PangeaColors.EarthBlueMedium,
                }}
              >
                Alternatives
              </Button>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
