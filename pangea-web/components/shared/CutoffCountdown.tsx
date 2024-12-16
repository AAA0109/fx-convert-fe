import { Stack, Typography } from '@mui/material';
import { transactionRequestDataState } from 'atoms';
import { differenceInMinutes, format, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

interface CutoffCountdownProps {
  cutoffDate: string;
  showOnlyTimer?: boolean;
}

const CutoffCountdown: React.FC<CutoffCountdownProps> = ({
  cutoffDate,
  showOnlyTimer = false,
}) => {
  const transactionRequestData = useRecoilValue(transactionRequestDataState);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [standardDelivery, setStandardDelivery] = useState<string>('');
  const [isExpired, setIsExpired] = useState<boolean>(false);
  useEffect(() => {
    const targetTime = parseISO(cutoffDate);

    const updateCountdown = () => {
      const now = new Date();
      if (now >= targetTime) {
        setTimeLeft('Time is up!');
        setIsExpired(true);
      } else {
        const diffInMinutes = differenceInMinutes(targetTime, now);
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;
        setTimeLeft(() => {
          const hourText = hours === 1 ? 'Hour' : 'Hours';
          const minuteText = minutes === 1 ? 'Minute' : 'Minutes';

          if (hours > 0) {
            return `${hours} ${hourText}${
              minutes > 0 ? ` ${minutes} ${minuteText}` : ''
            }`;
          } else {
            return `${minutes} ${minuteText}`;
          }
        });
      }
    };
    if (transactionRequestData.delivery_date) {
      setStandardDelivery(
        format(transactionRequestData.delivery_date, 'MMMM do'),
      );
    }
    updateCountdown();

    const timer = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [cutoffDate, transactionRequestData.delivery_date]);

  return isExpired ? (
    <Typography
      variant='dataBody'
      color={PangeaColors.WarmOrangeMedium}
      sx={{ flex: 1 }}
    >
      Bank Cutoff Expired
      <br />
      Choose A New Value Date
    </Typography>
  ) : showOnlyTimer ? (
    <Typography
      fontFamily='SuisseIntl'
      fontSize={'14px'}
      color={PangeaColors.WarmOrangeMedium}
      fontWeight={700}
      sx={{ display: 'inline' }}
    >
      {timeLeft}
    </Typography>
  ) : (
    <Stack flex={1}>
      {transactionRequestData.delivery_date && (
        <Typography variant='dataBody'>
          Standard Delivery: {standardDelivery}
        </Typography>
      )}
      <Typography variant='dataBody' color={PangeaColors.WarmOrangeMedium}>
        Execute within {timeLeft}
      </Typography>
    </Stack>
  );
};

export default CutoffCountdown;
