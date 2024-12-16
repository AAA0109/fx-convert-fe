import { Stack, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { StepperShell } from '../shared';
import { DocumentCard } from './DocumentCard';

export const AccountCollectingDocuments = () => {
  const [checked, setChecked] = useState({
    proofOfIdentity: false,
    operationalAddress: false,
    placeOfBusiness: false,
    authorizationToOpenMarginAccount: false,
    proofOfExistence: false,
  });

  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked({ ...checked, [event.target.name]: event.target.checked });
  };

  return (
    <StepperShell
      title={'Collecting Documents'}
      titleDescription={
        'Please collect the following documents required for verification with our broker partner, Interactive Brokers (IB). Click Alternatives to view all acceptable documents. '
      }
      continueButtonEnabled={Object.values(checked).every((value) => value)}
      continueButtonHref={'/activation/finalization/portal-access'}
      backButtonHref={'/activation/details/your-address'}
    >
      <Typography variant='body2' color='textSecondary'>
        Check all boxes to move on to the next step.
      </Typography>
      <Stack spacing={1}>
        <Typography variant='body2' color='textSecondary'>
          Required for you
        </Typography>
        <DocumentCard
          title='Proof of identity and date of birth'
          description='Examples: Passport, valid driver’s license'
          onCheck={handleCheck}
          name='proofOfIdentity'
          checked={checked.proofOfIdentity}
          tooltipText={[
            'National ID card',
            'US State ID Card',
            'Visa',
            'Green Card',
          ]}
        />
      </Stack>
      <Stack spacing={1}>
        <Typography variant='body2' color='textSecondary'>
          Required for your company
        </Typography>
        <DocumentCard
          title='Confirmation of operational address'
          description='Examples: Water bill, lease agreement'
          onCheck={handleCheck}
          name='operationalAddress'
          checked={checked.operationalAddress}
          tooltipText={[
            'Mortgage Statement',
            'Deed',
            'Current Lease (Fully-Executed Copy)',
            'Utility Bill',
          ]}
        />
        <DocumentCard
          title='Proof of principal place of business address'
          description='Examples: Water bill, lease agreement'
          onCheck={handleCheck}
          name='placeOfBusiness'
          checked={checked.placeOfBusiness}
          tooltipText={[
            'Mortgage Statement',
            'Deed',
            'Current Lease (Fully-Executed Copy)',
            'Utility Bill',
          ]}
        />
        <DocumentCard
          title='Authorization to open margin account'
          description='Examples: official letter'
          onCheck={handleCheck}
          name='authorizationToOpenMarginAccount'
          checked={checked.authorizationToOpenMarginAccount}
          tooltipText={['Corporate Charter', 'Bylaws', 'Corporate Resolution']}
        />

        <DocumentCard
          title='Proof of existence'
          description='Example: Driver’s License'
          onCheck={handleCheck}
          name='proofOfExistence'
          checked={checked.proofOfExistence}
          tooltipText={[
            'National ID card',
            'Passport',
            'Article of Incorporation',
            'Business License',
          ]}
        />
      </Stack>
    </StepperShell>
  );
};
export default AccountCollectingDocuments;
