import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import { Box, Dialog, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query';
import {
  beneficiaryCreatePayloadState,
  beneficiaryValidationSchemaRequestDataState,
  bookInstructDealRequestDataState,
  clientApiState,
  pangeaAlertNotificationMessageState,
  universalBeneficiaryAccountsDataState,
  userState,
} from 'atoms';
import {
  useBeneficiaryManagement,
  useLoading,
  useWalletAndPaymentHelpers,
} from 'hooks';
import { JSONSchema6 } from 'json-schema';
import {
  PangeaBeneficiary,
  PangeaBeneficiaryAccountTypeEnum,
  PangeaClassificationEnum,
  PangeaDefaultPurposeEnum_LABEL_MAP,
  PangeaUser,
} from 'lib';
import { isError } from 'lodash';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  useRecoilCallback,
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import {
  BankAddress,
  BankDetails,
  BANK_ADDRESS_STYLE,
  BENEFICIARY_STYLE_1,
  BENEFICIARY_STYLE_2,
  BeneficiaryAddress,
  BeneficiaryDetails,
  StepForm,
  StepOne,
} from '.';
import { PangeaButton, PangeaLoading, StepperShell } from '..';

type StepIdentifier = 0 | 1 | 2 | 3 | 4;
type StepperDataType = {
  title: string;
  content: ReactNode;
  continueButtonText: string;
  onContinue?: () => void;
  onBack?: () => void;
};
type StepperMapType = Record<StepIdentifier, StepperDataType>;
type AddBeneficiaryFormProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  editMode?: boolean;
  isWithdrawalAccount?: boolean;
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    maxWidth: '80%',
  },
}));

const pangeaBeneficiaryPayload = (
  createBeneficiaryDataSnapshot: PangeaBeneficiary,
  user: Nullable<PangeaUser>,
): PangeaBeneficiary => {
  const classification: PangeaClassificationEnum =
    createBeneficiaryDataSnapshot.beneficiary_account_type ===
    PangeaBeneficiaryAccountTypeEnum.Corporate
      ? PangeaClassificationEnum.Business
      : PangeaClassificationEnum.Individual;
  return {
    ...createBeneficiaryDataSnapshot,
    client_legal_entity: user?.company.country as string,
    classification: classification,
    preferred_method: createBeneficiaryDataSnapshot.payment_methods[0],
    settlement_methods: [...createBeneficiaryDataSnapshot.payment_methods],
    destination_country: createBeneficiaryDataSnapshot.bank_country,
    default_purpose_description:
      createBeneficiaryDataSnapshot.default_purpose as unknown as string,
  };
};

export function BeneficaryForm({
  open,
  setOpen,
  editMode,
  isWithdrawalAccount,
}: AddBeneficiaryFormProps): JSX.Element {
  const queryClient = useQueryClient();
  const {
    loadingPromise: addBeneficiaryPromise,
    loadingState: addBeneficiaryLoadingState,
  } = useLoading();

  const [validationSchema, setValidationSchema] = useState<JSONSchema6>({});
  const validationSchemaRequest = useRecoilValue(
    beneficiaryValidationSchemaRequestDataState,
  );
  const resetValidationSchemaRequest = useResetRecoilState(
    beneficiaryValidationSchemaRequestDataState,
  );
  const resetBeneficiaryCreatePayload = useResetRecoilState(
    beneficiaryCreatePayloadState,
  );
  const { getValidationSchema, splitPropertiesIntoGroups } =
    useBeneficiaryManagement();

  const setPaymentRequestData = useSetRecoilState(
    bookInstructDealRequestDataState,
  );

  const authHelper = useRecoilValue(clientApiState);
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const [activeStep, setActiveStep] = useState<StepIdentifier>(0);
  const [isActiveStepValid, setActiveStepValid] = useState(false);
  const isStatusStep = activeStep !== 4;
  const refreshBeneficiaryList = useRecoilRefresher_UNSTABLE(
    universalBeneficiaryAccountsDataState,
  );
  const { mergedValidationSchema, availableAccountTypes } = useMemo(
    () => ({
      mergedValidationSchema:
        (validationSchema as unknown as Record<string, JSONSchema6>)?.merged ??
        {},
      availableAccountTypes:
        (
          validationSchema as unknown as Record<string, Array<JSONSchema6>>
        )?.schemas?.map((schema) => schema.title) ?? [],
    }),
    [validationSchema],
  );
  const requiredFields = useMemo(
    () => mergedValidationSchema.required ?? [],
    [mergedValidationSchema],
  );
  const user = useRecoilValue(userState);

  const [
    beneficiaryDetailsSchema,
    beneficiaryAddressSchema,
    bankDetailsSchema,
    bankAddressSchema,
    additionalFieldsSchema,
  ] = splitPropertiesIntoGroups({
    properties: mergedValidationSchema.properties
      ? ({
          ...mergedValidationSchema.properties,
          default_purpose: {
            ...((mergedValidationSchema.properties.default_purpose ??
              {}) as Record<string, unknown>),
            enumNames: Object.values(PangeaDefaultPurposeEnum_LABEL_MAP).map(
              (label) => label,
            ),
          },
        } as unknown as JSONSchema6)
      : {},
    required: mergedValidationSchema.required ?? [],
    steps: [BeneficiaryDetails, BeneficiaryAddress, BankDetails, BankAddress],
  });

  const additionalFieldsPresent = useCallback(() => {
    return (
      additionalFieldsSchema &&
      additionalFieldsSchema.properties &&
      Object.keys(additionalFieldsSchema.properties).length > 0
    );
  }, [additionalFieldsSchema]);

  const handleClose = (
    _event: Record<string, unknown>,
    reason: 'backdropClick' | 'escapeKeyDown',
  ) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
    setOpen(false);
  };
  const { openDialog, setOpenDialog, CustomDialog } =
    useWalletAndPaymentHelpers();
  const handleCloseConfirmation = useCallback(() => {
    setOpen(false);
    setActiveStep(0);
    resetValidationSchemaRequest();
    resetBeneficiaryCreatePayload();
  }, [resetValidationSchemaRequest, setOpen, resetBeneficiaryCreatePayload]);

  const handleCreateOrUpdateBeneficiary = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const submitBeneficiaryDetails = async () => {
          try {
            const api = authHelper.getAuthenticatedApiHelper();
            const createBeneficiaryDataSnapshot = await snapshot.getPromise(
              beneficiaryCreatePayloadState,
            );

            if (editMode) {
              await api
                .patchSettlementBeneficiaryAsync(
                  (createBeneficiaryDataSnapshot as { beneficiary_id: string })
                    .beneficiary_id,
                  {
                    ...pangeaBeneficiaryPayload(
                      createBeneficiaryDataSnapshot as PangeaBeneficiary,
                      user,
                    ),
                  },
                )
                .then((response) => {
                  if (!isError(response)) {
                    refreshBeneficiaryList();
                    resetBeneficiaryCreatePayload();
                    queryClient.invalidateQueries({
                      queryKey: ['allBeneficiaries'],
                    });
                    setPaymentRequestData((payload) => {
                      return {
                        ...payload,
                        instruct_request: {
                          ...payload.instruct_request,
                          payments: [
                            {
                              ...payload.instruct_request.payments[0],
                              beneficiary_id: response.beneficiary_id,
                            },
                          ],
                        },
                      };
                    });
                    setActiveStep(4);
                  } else {
                    const error = (
                      (response as unknown as Record<'response', object>)
                        .response as { data: unknown }
                    ).data;
                    const errorMessage = Object.keys(error as object).map(
                      (key) =>
                        (error as Record<string, string[]>)[key].join(', '),
                    );
                    setPangeaAlertNotificationMessage({
                      severity: 'error',
                      text: errorMessage.join(', '),
                      timeout: 5000,
                    });
                  }
                });
            } else {
              await api
                .createSettlementBeneficiaryAsync({
                  ...pangeaBeneficiaryPayload(
                    createBeneficiaryDataSnapshot as PangeaBeneficiary,
                    user,
                  ),
                })
                .then((response) => {
                  if (!isError(response)) {
                    refreshBeneficiaryList();
                    resetBeneficiaryCreatePayload();
                    queryClient.invalidateQueries({
                      queryKey: ['allBeneficiaries'],
                    });
                    setPaymentRequestData((payload) => {
                      return {
                        ...payload,
                        instruct_request: {
                          ...payload.instruct_request,
                          payments: [
                            {
                              ...payload.instruct_request.payments[0],
                              beneficiary_id: response.beneficiary_id,
                            },
                          ],
                        },
                      };
                    });
                    setActiveStep(4);
                  } else {
                    const error = (
                      (response as unknown as Record<'response', object>)
                        .response as { data: unknown }
                    ).data;
                    const errorMessage = Object.keys(error as object).map(
                      (key) =>
                        (error as Record<string, string[]>)[key].join(', '),
                    );
                    setPangeaAlertNotificationMessage({
                      severity: 'error',
                      text: errorMessage.join(', '),
                      timeout: 5000,
                    });
                  }
                });
            }
          } catch (error) {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: 'There was an error creating beneficiary.',
            });
          }
        };
        await addBeneficiaryPromise(submitBeneficiaryDetails());
      },
    [
      addBeneficiaryPromise,
      authHelper,
      queryClient,
      editMode,
      refreshBeneficiaryList,
      resetBeneficiaryCreatePayload,
      setPangeaAlertNotificationMessage,
      setPaymentRequestData,
      user,
    ],
  );

  const handleGetSchema = useCallback(async () => {
    const getValidationSchemaData = async () => {
      setPangeaAlertNotificationMessage(null);
      setValidationSchema({});
      const schema = await getValidationSchema({ validationSchemaRequest });
      if (schema && !isError(schema)) {
        setValidationSchema(schema);
      } else {
        setValidationSchema({});
        if (isError(schema)) {
          const message = (
            schema as unknown as { response: { data: string[] } }
          ).response.data.join(',');
          setPangeaAlertNotificationMessage({
            severity: 'error',
            text: message,
          });
        }
      }
    };
    await addBeneficiaryPromise(getValidationSchemaData());
  }, [
    addBeneficiaryPromise,
    setPangeaAlertNotificationMessage,
    getValidationSchema,
    validationSchemaRequest,
  ]);

  const [createBeneficiaryPayload, setCreateBeneficiaryPayload] =
    useRecoilState(beneficiaryCreatePayloadState);

  const STEPPER_CONTENT_MAP: StepperMapType = useMemo(
    () => ({
      0: {
        title: 'STEP 1 OF  3',
        content: (
          <StepOne
            setValidity={setActiveStepValid}
            isWithdrawalAccount={isWithdrawalAccount}
            onValueUpdate={handleGetSchema}
            applicableAccounts={availableAccountTypes}
          />
        ),
        onBack: () => {
          setOpen(false);
          resetValidationSchemaRequest();
          resetBeneficiaryCreatePayload();
        },
        onContinue: () => {
          handleGetSchema();
          setActiveStep(1);
          setCreateBeneficiaryPayload(() => {
            return {
              ...createBeneficiaryPayload,
              ...validationSchemaRequest,
              payment_methods: [validationSchemaRequest.payment_method],
            };
          });
        },
        continueButtonText: 'Continue',
      },
      1: {
        title: 'STEP 2 OF 3',
        content: (
          <StepForm
            setValidity={setActiveStepValid}
            schema1={beneficiaryDetailsSchema}
            schema2={beneficiaryAddressSchema}
            title1='Beneficiary Details'
            title2='Beneficiary Address'
            sx1={BENEFICIARY_STYLE_1}
            sx2={BENEFICIARY_STYLE_2}
            requiredFields={requiredFields}
            loading={addBeneficiaryLoadingState.isLoading}
          />
        ),
        onBack: () => setActiveStep(0),
        onContinue: () => setActiveStep(2),
        continueButtonText: 'Continue',
      },
      2: {
        title: 'STEP 3 OF 3',
        content: (
          <StepForm
            setValidity={setActiveStepValid}
            schema1={bankDetailsSchema}
            schema2={bankAddressSchema}
            title1='Bank Account Details'
            title2='Bank Address'
            sx1={BENEFICIARY_STYLE_2}
            sx2={BANK_ADDRESS_STYLE}
            requiredFields={requiredFields}
            loading={addBeneficiaryLoadingState.isLoading}
          />
        ),
        onBack: () => setActiveStep(1),
        onContinue: () =>
          additionalFieldsPresent()
            ? setActiveStep(3)
            : handleCreateOrUpdateBeneficiary(),
        continueButtonText: additionalFieldsPresent() ? 'Continue' : 'Finish',
      },
      3: {
        title: 'A Few Last Details',
        content: (
          <StepForm
            setValidity={setActiveStepValid}
            schema1={additionalFieldsSchema}
            title1='Given the nature of this beneficiary and involved countries and currencies, there are a few last details we need to successfully verify.'
            requiredFields={requiredFields}
            loading={addBeneficiaryLoadingState.isLoading}
          />
        ),
        onBack: () => setActiveStep(2),
        onContinue: () => handleCreateOrUpdateBeneficiary(),
        continueButtonText: editMode
          ? 'Update Beneficiary'
          : 'Create Beneficiary',
      },
      4: {
        title: '',
        content: (
          <Stack alignItems='center'>
            <CheckCircleOutlineIcon
              sx={{
                width: 59,
                height: 59,
                color: PangeaColors.SecurityGreenMedium,
                marginBottom: '32px',
              }}
            />
            <Typography variant='heroBody'>
              {editMode ? 'Beneficiary Updated' : 'New Beneficiary Created'}
            </Typography>
            <Typography
              variant='body1'
              sx={{
                marginBottom: '32px',
                marginTop: '32px',
                textAlign: 'center',
              }}
            >
              We may need to verify a few things before this beneficiary is
              activated.
            </Typography>
            <PangeaButton
              onClick={handleCloseConfirmation}
              sx={{ minWidth: 'auto' }}
            >
              Got it
            </PangeaButton>
          </Stack>
        ),
        continueButtonText: '',
      },
    }),
    [
      isWithdrawalAccount,
      editMode,
      handleGetSchema,
      requiredFields,
      availableAccountTypes,
      beneficiaryDetailsSchema,
      beneficiaryAddressSchema,
      bankDetailsSchema,
      bankAddressSchema,
      handleCloseConfirmation,
      setOpen,
      resetValidationSchemaRequest,
      handleCreateOrUpdateBeneficiary,
      resetBeneficiaryCreatePayload,
      addBeneficiaryLoadingState.isLoading,
      additionalFieldsSchema,
      additionalFieldsPresent,
      createBeneficiaryPayload,
      setCreateBeneficiaryPayload,
      validationSchemaRequest,
    ],
  );
  const [
    stepperSubTitle,
    StepperContent,
    onBack,
    onContinue,
    continueButtonText,
  ] = useMemo(
    () => [
      STEPPER_CONTENT_MAP[activeStep].title,
      STEPPER_CONTENT_MAP[activeStep].content,
      STEPPER_CONTENT_MAP[activeStep].onBack,
      STEPPER_CONTENT_MAP[activeStep].onContinue,
      STEPPER_CONTENT_MAP[activeStep].continueButtonText,
    ],
    [STEPPER_CONTENT_MAP, activeStep],
  );

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby='add-beneficiary-dialog'
        open={open}
        disableEscapeKeyDown
      >
        <IconButton
          aria-label='close'
          onClick={() => {
            if (isStatusStep) {
              setOpenDialog(true);
            } else {
              handleCloseConfirmation();
            }
          }}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            minWidth: '564px',
            maxWidth: '564px',
          }}
        >
          <StepperShell
            title={
              activeStep === 3
                ? stepperSubTitle
                : isStatusStep
                ? `${
                    editMode ? 'EDIT' : 'ADD'
                  } BENEFICIARY : ${stepperSubTitle}`
                : ''
            }
            onClickBackButton={onBack}
            onClickContinueButton={onContinue}
            continueButtonEnabled={isActiveStepValid}
            continueButtonProps={{
              loading: addBeneficiaryLoadingState.isLoading,
            }}
            backButtonProps={{
              variant: 'text',
              disabled: addBeneficiaryLoadingState.isLoading,
            }}
            backButtonVisible={isStatusStep}
            continueButtonVisible={isStatusStep}
            continueButtonText={continueButtonText}
          >
            <Suspense fallback={<PangeaLoading />}>{StepperContent}</Suspense>
          </StepperShell>
        </Box>
      </BootstrapDialog>

      <CustomDialog onClose={handleCloseConfirmation} open={openDialog}>
        <Stack alignItems='center'>
          <ErrorIcon
            sx={{
              width: 59,
              height: 59,
              color: PangeaColors.CautionYellowMedium,
            }}
          />
          <Typography
            variant='body1'
            sx={{
              marginBottom: '32px',
              marginTop: '32px',
              textAlign: 'center',
            }}
          >
            Are you sure you want to close this? All your data will be lost.
          </Typography>
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <PangeaButton
              variant='outlined'
              onClick={() => {
                setOpenDialog(false);
              }}
              sx={{ minWidth: 'auto' }}
            >
              Cancel
            </PangeaButton>
            <PangeaButton
              onClick={() => {
                setOpenDialog(false);
                handleCloseConfirmation();
              }}
              sx={{ minWidth: 'auto' }}
            >
              Got it
            </PangeaButton>{' '}
          </Box>
        </Stack>
      </CustomDialog>
    </>
  );
}
export default BeneficaryForm;
