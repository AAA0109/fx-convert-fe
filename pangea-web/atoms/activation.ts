import { SetupIntent } from '@stripe/stripe-js';
import {
  PangeaCitizenshipEnum,
  PangeaCountryEnum,
  PangeaCurrencyEnum,
  PangeaIBApplication,
  PangeaIBApplications,
  PangeaIBAssociatedEntities,
  PangeaIBAssociatedIndividual,
  PangeaIBAssociatedIndividualIdentification,
  PangeaIBAssociatedIndividualMailingAddress,
  PangeaIBAssociatedIndividualName,
  PangeaIBAssociatedIndividualResidence,
  PangeaIBAssociatedIndividualTaxResidency,
  PangeaIBAssociatedIndividualTitleCodeEnum,
  PangeaIBCustomer,
  PangeaIBMailingAddress,
  PangeaIBOrganization,
  PangeaIBOrganizationIdentification,
  PangeaIBOrganizationTaxResidency,
  PangeaIBPlaceOfBusiness,
  PangeaIdentifierTypeEnum,
  PangeaInstructionTypeEnum,
  PangeaIssuingCountryEnum,
  PangeaLegalResidenceCountryEnum,
  PangeaLegalResidenceStateEnum,
  PangeaPredefinedDestinationInstructionRequest,
  rules,
} from 'lib';
import { env } from 'process';
import { DefaultValue, atom, selector } from 'recoil';
import { localStorageEffect } from './effects';
import { userCompanyState, userState } from './globalstate';
// VALIDATION STATES FOR DIFFERENT PARTS OF ACTIVATION FLOW

// state for validation for accountDetailsAboutYou.tsx
// this isn't using a ValidationType because it is combining multiple states
export const activationAboutYouValidationState = selector<{
  first: boolean;
  last: boolean;
  job_title: boolean;
  salutation: boolean;
  citizenship: boolean;
  dob: boolean;
}>({
  key: 'activationAboutYouValidation',
  get: ({ get }) => {
    const name = get(ibAssociatedIndividualNameState);
    const title = get(ibAssociatedIndividualTitleState);
    const individual = get(ibAssociatedIndividualIdentificationState);
    const dob = get(ibAssociatedIndividualDOBState);
    return {
      first: !!name.first && rules.first(name.first),
      last: !!name.last && rules.last(name.last),
      job_title: !!title && rules.job_title(title),
      salutation: !!name.salutation && name.salutation.length > 0,
      citizenship:
        !!individual.issuing_country &&
        !!individual.legal_residence_country &&
        !!individual.citizenship,
      dob: !!dob && rules.dob(dob),
    };
  },
});

// state for validation for activationDetailsYourAddress.tsx
export const activationYourAddressValidationState = selector<
  ValidationType<PangeaIBAssociatedIndividualResidence>
>({
  key: 'activationYourAddressValidation',
  get: ({ get }) => {
    const residence = get(ibAssociatedIndividualResidenceState);
    return {
      country: !!residence.country,
      street_1: !!residence.street_1 && rules.street_1(residence.street_1),
      city: !!residence.city && rules.city(residence.city),
      state: !!residence.state,
      postal_code:
        !!residence.postal_code && rules.postal_code(residence.postal_code),
    };
  },
});

// state for validation for activationDetailsYourAddress.tsx
// mailing address
export const activationYourAddressMailingValidationState = selector<
  ValidationType<PangeaIBAssociatedIndividualMailingAddress>
>({
  key: 'activationYourAddressMailingValidation',
  get: ({ get }) => {
    const mailing = get(ibAssociatedIndividualMailingAddressState);
    return {
      country: !!mailing.country,
      street_1: !!mailing.street_1 && rules.street_1(mailing.street_1),
      city: !!mailing.city && rules.city(mailing.city),
      state: !!mailing.state,
      postal_code:
        !!mailing.postal_code && rules.postal_code(mailing.postal_code),
    };
  },
});

const activationCompanyDetailValidationDefaultsState = selector<{
  name: boolean;
  type: boolean;
  ein: boolean;
  tax: boolean;
}>({
  key: 'activationCompanyDetailValidationDefaults',
  get: ({ get }) => {
    const orgId = get(ibAppOrganizationIdentificationState);
    return {
      name: rules.name(orgId.name),
      ein: rules.ein(orgId.identification ?? ''),
      type: false,
      tax: false,
    };
  },
});
// state for validation for activationCompanyDetails.tsx
// this doesn't use Validation Type because it isn't part of one type
export const activationCompanyDetailValidationState = atom<{
  name: boolean;
  type: boolean;
  ein: boolean;
  tax: boolean;
}>({
  key: 'activationCompanyDetailValidation',
  default: activationCompanyDetailValidationDefaultsState,
});

const ibApplicationStateDefaultSelector = selector<PangeaIBApplications>({
  key: 'ibApplicationStateDefault',
  get: ({ get }) => {
    const user = get(userState);
    const userCompany = get(userCompanyState);
    return {
      application: [
        {
          customers: [
            {
              email: user ? user.email : '',
              external_id: userCompany ? userCompany.id : '',
              md_status_nonpro: false, // default is false
              prefix: 'pangea',
              type: 'ORG',
              organization: {
                identification: {
                  name: userCompany?.legal_name ?? userCompany?.name,
                  identification: userCompany?.ein,
                  formation_country: 'US',
                  identification_country: 'US',
                  same_mail_address: false, // default is false
                  place_of_business: {
                    street_1: userCompany?.address_1,
                    street_2: userCompany?.address_2,
                    city: userCompany?.city,
                    postal_code: userCompany?.zip_code,
                    state: userCompany?.state,
                  },
                  mailing_address: {
                    street_1: userCompany?.address_1,
                    street_2: userCompany?.address_2,
                    city: userCompany?.city,
                    postal_code: userCompany?.zip_code,
                    state: userCompany?.state,
                  },
                },
                tax_residencies: [
                  {
                    country: PangeaCountryEnum.US,
                    tin: userCompany?.ein,
                  },
                ],
                associated_entities: {
                  associated_individual: [
                    {
                      email: user ? user.email : '',
                      identification: {
                        issuing_country: PangeaIssuingCountryEnum.US,
                        citizenship: PangeaCitizenshipEnum.US,
                        legal_residence_country:
                          PangeaLegalResidenceCountryEnum.US,
                      },
                      tax_residencies: [
                        {
                          tin_type: 'SSN',
                          country: PangeaCountryEnum.US,
                        },
                      ],
                      name: {
                        first: user?.first_name,
                        last: user?.last_name,
                      },
                      authorized_person: true,
                      external_id: user ? user.id : '',
                    },
                  ],
                },
              },
            },
          ],
          accounts: [
            {
              base_currency: 'USD',
              external_id: userCompany ? userCompany.id : '',
              margin: 'CASH',
              multicurrency: true,
              fees: {
                template_name: env.NEXT_PUBLIC_IB_TEMPLATE_NAME ?? 'test123',
              },
            },
          ],
          users: [
            {
              external_individual_id: user ? user.id : '',
              external_user_id: user ? user.id : '',
              prefix: 'pangea',
            },
          ],
        },
      ],
    } as PangeaIBApplications;
  },
});

export const ibApplicationsState = atom<PangeaIBApplications>({
  key: 'IBApplicationList',
  default: ibApplicationStateDefaultSelector,
  effects: [localStorageEffect('ibApplications')],
});

const ibApplicationState = selector<PangeaIBApplication>({
  key: 'ibApplication',
  get: ({ get }) => {
    const ibApplications = get(ibApplicationsState);
    return ibApplications.application.length > 0
      ? ibApplications.application[0]
      : ({} as PangeaIBApplication);
  },
  set: ({ set }, newValue) => {
    const newApplication =
      newValue instanceof DefaultValue ? ({} as PangeaIBApplication) : newValue;
    set(ibApplicationsState, { application: [newApplication] });
  },
});

export const ibAppCustomersState = selector<PangeaIBCustomer>({
  key: 'ibCustomerState',
  get: ({ get }) => {
    const application = get(ibApplicationState);
    return application.customers?.length > 0
      ? application.customers[0]
      : ({} as PangeaIBCustomer);
  },
  set: ({ get, set }, newValue) => {
    const application = get(ibApplicationState);
    if (newValue instanceof DefaultValue) {
      set(ibApplicationState, { ...application, customers: [] });
      return;
    }

    set(ibApplicationState, { ...application, customers: [newValue] });
  },
});

// SETTING THE ORGANIZATION STATE
export const ibAppCustomerOrganizationState = selector<PangeaIBOrganization>({
  key: 'ibCustomerOrganization',
  get: ({ get }) => {
    const customer = get(ibAppCustomersState);
    return customer.organization ?? '';
  },
  set: ({ get, set }, newValue) => {
    const customer = get(ibAppCustomersState);
    set(ibAppCustomersState, {
      ...customer,
      organization:
        newValue instanceof DefaultValue
          ? ({} as PangeaIBOrganization)
          : (newValue as PangeaIBOrganization),
    });
  },
});

// SETTING THE ORGANIZATION TAX RESIDENCY STATE
export const ibAppOrgTaxResidencyState =
  selector<PangeaIBOrganizationTaxResidency>({
    key: 'ibAppOrgTaxResidency',
    get: ({ get }) => {
      const organization = get(ibAppCustomerOrganizationState);
      return organization?.tax_residencies[0] ?? {};
    },
    set: ({ get, set }, newValue) => {
      const organization = get(ibAppCustomerOrganizationState);
      set(ibAppCustomerOrganizationState, {
        ...organization,
        tax_residencies:
          newValue instanceof DefaultValue
            ? ([] as PangeaIBOrganizationTaxResidency[])
            : [newValue],
      });
    },
  });

const ibAppAssociatedEntitiesState = selector<PangeaIBAssociatedEntities>({
  key: 'ibAppAssociatedEntities',
  get: ({ get }) => {
    const organization = get(ibAppCustomerOrganizationState);
    return organization?.associated_entities;
  },
  set: ({ get, set }, newValue) => {
    const organization = get(ibAppCustomerOrganizationState);
    set(ibAppCustomerOrganizationState, {
      ...organization,
      associated_entities:
        newValue instanceof DefaultValue
          ? ({} as PangeaIBAssociatedEntities)
          : newValue,
    });
  },
});

// Setting Associated Individual
const ibAssociatedIndividualState = selector<PangeaIBAssociatedIndividual>({
  key: 'ibAssociatedIndividual',
  get: ({ get }) => {
    const associatedEntities = get(ibAppAssociatedEntitiesState);
    return associatedEntities?.associated_individual[0] ?? [];
  },
  set: ({ get, set }, newValue) => {
    const associatedEntities = get(ibAppAssociatedEntitiesState);

    set(ibAppAssociatedEntitiesState, {
      ...associatedEntities,
      associated_individual:
        newValue instanceof DefaultValue
          ? ([] as PangeaIBAssociatedIndividual[])
          : [newValue],
    });
  },
});

// Setting Individual Name
export const ibAssociatedIndividualNameState =
  selector<PangeaIBAssociatedIndividualName>({
    key: 'ibAssociatedIndividualName',
    get: ({ get }) => {
      const ibAssociatedIndividual = get(ibAssociatedIndividualState);
      return ibAssociatedIndividual?.name ?? {};
    },
    set: ({ get, set }, newValue) => {
      const ibAssociatedIndividual = get(ibAssociatedIndividualState);
      set(ibAssociatedIndividualState, {
        ...ibAssociatedIndividual,
        name:
          newValue instanceof DefaultValue
            ? ({} as PangeaIBAssociatedIndividualName[])
            : newValue,
      } as PangeaIBAssociatedIndividual);
    },
  });

// SETTING INDIVIDUAL DOB
export const ibAssociatedIndividualDOBState = selector<string>({
  key: 'ibAssociatedIndividualDOB',
  get: ({ get }) => {
    const ibAssociatedIndividual = get(ibAssociatedIndividualState);
    return ibAssociatedIndividual?.dob ?? '';
  },
  set: ({ get, set }, newValue) => {
    const ibAssociatedIndividual = get(ibAssociatedIndividualState);
    set(ibAssociatedIndividualState, {
      ...ibAssociatedIndividual,
      dob: newValue,
    } as PangeaIBAssociatedIndividual);
  },
});

// SETTING INDIVIDUAL RESIDENCE
export const ibAssociatedIndividualResidenceState =
  selector<PangeaIBAssociatedIndividualResidence>({
    key: 'ibAssociatedIndividualResidence',
    get: ({ get }) => {
      const ibAssociatedIndividual = get(ibAssociatedIndividualState);
      return ibAssociatedIndividual?.residence ?? '';
    },
    set: ({ set }, newValue) => {
      set(
        ibAssociatedIndividualState,
        (ibAssociatedIndividual) =>
          ({
            ...ibAssociatedIndividual,
            residence:
              newValue instanceof DefaultValue
                ? ({} as PangeaIBAssociatedIndividualResidence)
                : newValue,
            identification: {
              ...ibAssociatedIndividual.identification,
              legal_residence_state: (newValue instanceof DefaultValue
                ? ''
                : newValue.state) as PangeaLegalResidenceStateEnum,
            },
          } as PangeaIBAssociatedIndividual),
      );
    },
  });

// SETTING INDIVIDUAL MAILING ADDRESS
export const ibAssociatedIndividualMailingAddressState =
  selector<PangeaIBAssociatedIndividualMailingAddress>({
    key: 'ibAssociatedIndividualMailingAddress',
    get: ({ get }) => {
      const ibAssociatedIndividual = get(ibAssociatedIndividualState);
      return (
        ibAssociatedIndividual?.mailing_address ??
        ({} as PangeaIBAssociatedIndividualMailingAddress)
      );
    },
    set: ({ get, set }, newValue) => {
      const ibAssociatedIndividual = get(ibAssociatedIndividualState);
      set(ibAssociatedIndividualState, {
        ...ibAssociatedIndividual,
        mailing_address:
          newValue instanceof DefaultValue
            ? ({} as PangeaIBAssociatedIndividualMailingAddress)
            : newValue,
      } as PangeaIBAssociatedIndividual);
    },
  });

export const individualMailAndResidenceEqualState = atom<boolean>({
  key: 'individualMailAndResidenceEqual',
  default: false,
});

// SETTING INDIVIDUAL IDENTIFICATION
export const ibAssociatedIndividualIdentificationState =
  selector<PangeaIBAssociatedIndividualIdentification>({
    key: 'ibAssociatedIndividualIdentification',
    get: ({ get }) => {
      const ibAssociatedIndividual = get(ibAssociatedIndividualState);
      return ibAssociatedIndividual?.identification ?? '';
    },
    set: ({ get, set }, newValue) => {
      const ibAssociatedIndividual = get(ibAssociatedIndividualState);
      set(ibAssociatedIndividualState, {
        ...ibAssociatedIndividual,
        identification:
          newValue instanceof DefaultValue
            ? ({} as PangeaIBAssociatedIndividualIdentification[])
            : newValue,
      } as PangeaIBAssociatedIndividual);
    },
  });

// SETTING INDIVIDUAL TAX RESIDENCY
export const ibAssociatedIndividualTaxResidencyState =
  selector<PangeaIBAssociatedIndividualTaxResidency>({
    key: 'ibAssociatedIndividualTaxResidency',
    get: ({ get }) => {
      const ibAssociatedIndividual = get(ibAssociatedIndividualState);
      // Not sure if it should be ibAssociatedIndividual?.tax_residencies[0] because that wont always exist
      return ibAssociatedIndividual?.tax_residencies[0] ?? {};
    },
    set: ({ get, set }, newValue) => {
      const ibAssociatedIndividual = get(ibAssociatedIndividualState);
      set(ibAssociatedIndividualState, {
        ...ibAssociatedIndividual,
        tax_residencies:
          newValue instanceof DefaultValue
            ? ([] as PangeaIBAssociatedIndividualTaxResidency[])
            : [newValue],
      });
    },
  });

// SETTING INDIVIDUAL TITLE STATE
export const ibAssociatedIndividualTitleState =
  selector<PangeaIBAssociatedIndividualTitleCodeEnum>({
    key: 'ibAssociatedIndividualTitleSelector',
    get: ({ get }) => {
      const ibAssociatedIndividual = get(ibAssociatedIndividualState);
      return ibAssociatedIndividual?.title?.code ?? '';
    },
    set: ({ get, set }, newValue) => {
      const ibAssociatedIndividual = get(ibAssociatedIndividualState);
      set(ibAssociatedIndividualState, {
        ...ibAssociatedIndividual,
        title: {
          code: newValue,
        },
      } as unknown as PangeaIBAssociatedIndividual);
    },
  });

// SETTING THE ORGANIZATION IDENTIFICATION STATE
export const ibAppOrganizationIdentificationState =
  selector<PangeaIBOrganizationIdentification>({
    key: 'ibAppOrganizationIdentification',
    get: ({ get }) => {
      const organization = get(ibAppCustomerOrganizationState);
      return organization?.identification ?? '';
    },
    set: ({ get, set }, newValue) => {
      const organization = get(ibAppCustomerOrganizationState);
      set(ibAppCustomerOrganizationState, {
        ...organization,
        identification:
          newValue instanceof DefaultValue
            ? ({} as PangeaIBOrganizationIdentification)
            : newValue,
      });
    },
  });

// SETTING THE ORGANIZATION PLACE OF BUSINESS STATE
const ibAppOrganizationPlaceOfBusinessState = selector<PangeaIBPlaceOfBusiness>(
  {
    key: 'ibAppOrganizationPlaceOfBusiness',
    get: ({ get }) => {
      const identification = get(ibAppOrganizationIdentificationState);
      return identification.place_of_business;
    },
    set: ({ get, set }, newValue) => {
      const identification = get(ibAppOrganizationIdentificationState);
      set(ibAppOrganizationIdentificationState, {
        ...identification,
        place_of_business:
          newValue instanceof DefaultValue
            ? ({} as PangeaIBPlaceOfBusiness)
            : newValue,
      });
    },
  },
);

// SETTING THE ORGANIZATION MAILING ADDRESS STATE
const ibAppOrganizationMailingAddressState = selector<PangeaIBMailingAddress>({
  key: 'ibAppOrganizationMailingAddress',
  get: ({ get }) => {
    const identification = get(ibAppOrganizationIdentificationState);
    return identification.mailing_address ?? ({} as PangeaIBMailingAddress);
  },
  set: ({ get, set }, newValue) => {
    const identification = get(ibAppOrganizationIdentificationState);
    set(ibAppOrganizationIdentificationState, {
      ...identification,
      mailing_address:
        newValue instanceof DefaultValue
          ? ({} as PangeaIBMailingAddress)
          : newValue,
    });
  },
});

export type CompanyAddressForm = {
  pob: PangeaIBMailingAddress;
  mailing?: PangeaIBMailingAddress;
  use_same_addr: boolean;
};
export const ibCompanyAddressState = selector<CompanyAddressForm>({
  key: 'ibCompanyMailingAddresss',
  get: ({ get }) => {
    const pob = get(ibAppOrganizationPlaceOfBusinessState);
    const mailing = get(ibAppOrganizationMailingAddressState);

    return {
      pob,
      mailing,
      use_same_addr: get(ibAppOrganizationIdentificationState)
        .same_mail_address,
    } as CompanyAddressForm;
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      set(ibAppOrganizationPlaceOfBusinessState, {} as PangeaIBMailingAddress);
      set(ibAppOrganizationMailingAddressState, {} as PangeaIBMailingAddress);
    } else {
      set(ibAppOrganizationIdentificationState, (prevVal) => ({
        ...prevVal,
        place_of_business: newValue.pob,
        mailing_address: newValue.use_same_addr ? undefined : newValue.mailing,
        same_mail_address: newValue.use_same_addr,
      }));
    }
  },
});

export const ibCompanyAddressIsValidState = selector<{
  pob: ValidationType<PangeaIBMailingAddress>;
  mailing: ValidationType<PangeaIBMailingAddress>;
}>({
  key: 'ibCompanyAddressIsValid',
  get: ({ get }) => {
    const compMail = get(ibCompanyAddressState);
    return {
      mailing: {
        street_1:
          compMail.use_same_addr ||
          (!!compMail.mailing && rules.street_1(compMail.mailing.street_1)),
        street_2: true,
        city:
          compMail.use_same_addr ||
          (!!compMail.mailing?.city && rules.city(compMail.mailing.city)),
        state: compMail.use_same_addr || !!compMail.mailing?.state,
        postal_code:
          compMail.use_same_addr ||
          (!!compMail.mailing &&
            rules.postal_code(compMail.mailing.postal_code)),
        country: true,
      },
      pob: {
        street_1: rules.street_1(compMail.pob.street_1),
        street_2: true,
        city: !!compMail.pob.city && rules.city(compMail.pob.city),
        state: !!compMail.pob.state,
        postal_code:
          !!compMail.pob.postal_code &&
          rules.postal_code(compMail.pob.postal_code),
        country: true,
      },
    };
  },
});
export const ibCompanyAddressFormIsValidState = selector<boolean>({
  key: 'ibCompanyAddressFormIsValid',
  get: ({ get }) => {
    const validation = get(ibCompanyAddressIsValidState);
    return (
      Object.values(validation.mailing).every((v) => v) &&
      Object.values(validation.pob).every((v) => v)
    );
  },
});

type StripeStatus = SetupIntent.Status | 'loading_stripe' | 'loading_intnet';

export const stripeAccountState = atom<Nullable<StripeStatus>>({
  key: 'stripeAccountState',
  default: null,
});

export const linkWithdrawalAccountState =
  atom<PangeaPredefinedDestinationInstructionRequest>({
    key: 'LinkWithdrawalAccountState',
    default: {
      broker_account_id: 0,
      instruction_name: '',
      instruction_type: PangeaInstructionTypeEnum.WIRE,
      financial_institution: {
        name: '',
        identifier: '',
        identifier_type: PangeaIdentifierTypeEnum.IFSC,
      },
      financial_institution_client_acct_id: '',
      currency: PangeaCurrencyEnum.USD,
    },
  });
