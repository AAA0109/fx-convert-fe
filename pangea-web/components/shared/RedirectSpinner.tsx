import { PangeaLoading } from './PangeaLoading';

export const RedirectSpinner = ({
  loadingPhrase = 'Verifying your session...',
}: {
  loadingPhrase?: string;
}) => {
  return <PangeaLoading loadingPhrase={loadingPhrase} centerPhrase />;
};
export default RedirectSpinner;
