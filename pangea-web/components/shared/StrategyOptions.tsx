import { CashflowStrategyEnum } from 'lib';
import { ReactNode } from 'react';
import ParachuteIcon from '../../public/images/Parachute.svg';
import AutoPilotIcon from '../../public/images/auto-pilot.svg';
import ZeroGravityIcon from '../../public/images/zero-gravity.svg';

export type StrategyData = {
  label: string;
  reviewLabel: string;
  description: string;
  icon: ReactNode;
};

const STRATEGY_OPTIONS: Record<CashflowStrategyEnum, StrategyData> =
  Object.freeze({
    [CashflowStrategyEnum.ZEROGRAVITY]: {
      label: 'Zero-Gravity (Portfolios)',
      reviewLabel: 'Zero-Gravity',
      description:
        'Utilizes Pangea or custom portfolios to provide protection as volatility increases.',
      icon: <ZeroGravityIcon sx={{ width: '34px' }} />,
    },
    [CashflowStrategyEnum.AUTOPILOT]: {
      label: 'Auto-Pilot',
      reviewLabel: 'Auto-Pilot',
      description:
        'Leverages programmatic forwards at scale with custom options around volatility reduction & price targets.',
      icon: <AutoPilotIcon sx={{ width: '34px' }} />,
    },
    [CashflowStrategyEnum.PARACHUTE]: {
      label: 'Parachute',
      reviewLabel: 'Parachute',
      description:
        'Leverages AI hedging to actively manage both downside risk and upside potential on a cash flow.',
      icon: <ParachuteIcon sx={{ width: '34px' }} />,
    },
  });

export default STRATEGY_OPTIONS;
