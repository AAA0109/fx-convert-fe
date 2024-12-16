import { render, screen } from '@testing-library/react';
import { LinkTab, PangeaSpinner, StepperShell } from 'components/shared';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Cashflow, PangeaGroupEnum } from 'lib';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { PangeaColors } from 'styles';
import mockdata from './mockData.json';
expect.extend(toHaveNoViolations);

const tabs = (canCreateHedge: boolean, hasCorpaySettings: boolean) => {
  return [
    ...(canCreateHedge
      ? [
          {
            label: 'Cash Flows',
            dataRoute: 'cashflows',
          },
        ]
      : []),

    ...(hasCorpaySettings
      ? [
          {
            label: 'Wallets',
            dataRoute: 'wallets',
          },
        ]
      : []),
    ...(canCreateHedge
      ? [
          {
            label: 'Margin',
            dataRoute: 'margin',
          },
        ]
      : []),
  ];
};
describe('Permissions Tests', () => {
  test('Should display create hedge button', () => {
    const isAdminOrCreator = [PangeaGroupEnum.CustomerAdmin].some((val) => {
      return (mockdata.user.groups?.map((group) => group.name) ?? []).includes(
        val,
      );
    });
    const hasIbkrCompanySettings =
      mockdata.user.company.settings.ibkr.spot ?? false;

    const canCreateHedge = hasIbkrCompanySettings && isAdminOrCreator;
    render(
      <RecoilRoot>
        <Suspense fallback={<PangeaSpinner />}>
          {canCreateHedge && (
            <LinkTab
              data-testid='create-hedge'
              label='Create Hedge'
              to='/cashflow/'
              sx={{
                backgroundColor: PangeaColors.SolidSlateMedium,
                color: PangeaColors.White,
                border: 0,
                '&.Mui-selected': { color: PangeaColors.White },
              }}
              value='create'
            />
          )}
        </Suspense>
      </RecoilRoot>,
    );
    const createHedgeButton = screen.getByTestId('create-hedge');
    expect(createHedgeButton).toBeInTheDocument();
  });
  test('Should display hedge tabs', () => {
    const isAdminOrCreator = [PangeaGroupEnum.CustomerAdmin].some((val) => {
      return (mockdata.user.groups?.map((group) => group.name) ?? []).includes(
        val,
      );
    });
    const hasIbkrCompanySettings =
      mockdata.user.company.settings.ibkr.spot ?? false;
    const hasCorpaySettings = mockdata.user.company.settings.corpay.wallet;
    const hasCorpayForwardsSettings =
      mockdata.user.company.settings.corpay.forwards;
    const canCreateHedge =
      (hasIbkrCompanySettings || hasCorpayForwardsSettings) && isAdminOrCreator;

    expect(tabs(canCreateHedge, hasCorpaySettings)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Margin',
        }),
      ]),
    );
    expect(tabs(canCreateHedge, hasCorpaySettings)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Cash Flows',
        }),
      ]),
    );
  });
  test('Should not display wallet tabs', () => {
    const isAdminOrCreator = [PangeaGroupEnum.CustomerAdmin].some((val) => {
      return (mockdata.user.groups?.map((group) => group.name) ?? []).includes(
        val,
      );
    });
    const hasIbkrCompanySettings =
      mockdata.user.company.settings.ibkr.spot ?? false;
    const hasCorpaySettings = mockdata.user.company.settings.corpay.wallet;
    const canCreateHedge = hasIbkrCompanySettings && isAdminOrCreator;

    expect(tabs(canCreateHedge, hasCorpaySettings)).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Wallets',
        }),
      ]),
    );
  });
  test('Should display correct review button with no violations', async () => {
    const cf = new Cashflow();
    const isCashflowPendingApproval = cf.ui_status.includes('pending_approval');
    const isAdminOrManager = [
      PangeaGroupEnum.CustomerAdmin,
      PangeaGroupEnum.CustomerManager,
    ].some((val) => {
      return (mockdata.user.groups?.map((group) => group.name) ?? []).includes(
        val,
      );
    });
    const shouldApproveHedge = isCashflowPendingApproval && isAdminOrManager;
    const continueButtonText = shouldApproveHedge
      ? 'Approve'
      : isAdminOrManager
      ? 'Execute Hedge'
      : 'Submit for Approval';
    const { container } = render(
      <RecoilRoot>
        <Suspense fallback={<PangeaSpinner />}>
          <StepperShell
            title='Review your hedge'
            titleDescription='You can learn more about the margin and fees required for this action.'
            continueButtonText={continueButtonText}
            continueButtonEnabled={!!mockdata.user.company?.stripe_customer_id}
            continueButtonProps={{
              color: isAdminOrManager ? 'secondary' : 'primary',
              endIcon: undefined,
            }}
          >
            <></>
          </StepperShell>
        </Suspense>
      </RecoilRoot>,
    );
    const shellButton = screen.getByText(continueButtonText);
    expect(shellButton).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
