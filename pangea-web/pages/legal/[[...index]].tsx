import {
  LegalDisclosuresTab,
  LegalPrivacyPolicyTab,
  LegalTermsAndConditionsTab,
} from 'components/legal';
import { TabbedPage } from 'components/shared';
import type { NextPage } from 'next';

const Legal: NextPage = () => {
  return (
    <TabbedPage
      pageRoute='/legal/'
      pageTitle='Legal'
      tabs={[
        {
          label: 'Privacy Policy',
          dataRoute: 'privacy',
          component: LegalPrivacyPolicyTab,
        },
        {
          label: 'Terms and Conditions',
          dataRoute: 'terms',
          component: LegalTermsAndConditionsTab,
        },
        {
          label: 'Disclosures',
          dataRoute: 'disclosures',
          component: LegalDisclosuresTab,
        },
      ]}
    />
  );
};

export default Legal;
