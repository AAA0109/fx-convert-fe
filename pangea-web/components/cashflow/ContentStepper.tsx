import { CashflowDetailsStep } from './CashflowDetailsStep';
import { CreateHedgeDirectionStep } from './CreateHedgeDirectionStep';
import { CreateHedgeFrequencyStep } from './CreateHedgeFrequencyStep';
import { CreateHedgeQuantityStep } from './CreateHedgeQuantityStep';
interface ContentStepperProps {
  pageToDisplay: string;
}
export const ContentStepper = ({ pageToDisplay }: ContentStepperProps) => {
  switch (pageToDisplay) {
    case 'quantity':
      return <CreateHedgeQuantityStep />;
    case 'frequency':
      return <CreateHedgeFrequencyStep />;
    case 'direction':
      return <CreateHedgeDirectionStep />;
    default:
      return <CashflowDetailsStep pageToDisplay={pageToDisplay} />;
  }
};
export default ContentStepper;
