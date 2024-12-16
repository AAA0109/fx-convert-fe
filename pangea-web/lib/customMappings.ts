import { PangeaGroupEnum } from './api/v2/data-contracts';

export const GROUPS_LABEL_MAP: Record<
  Exclude<
    PangeaGroupEnum,
    PangeaGroupEnum.AdminCustomerSuccess | PangeaGroupEnum.AdminReadOnly
  >,
  string
> = {
  [PangeaGroupEnum.CustomerAdmin]: 'Admin',
  [PangeaGroupEnum.CustomerManager]: 'Manager',
  [PangeaGroupEnum.CustomerCreator]: 'Creator',
  [PangeaGroupEnum.CustomerViewer]: 'Viewer',
  [PangeaGroupEnum.CustomerCorpay]: 'CorPay',
  [PangeaGroupEnum.CustomerIbkr]: 'IBKR',
  [PangeaGroupEnum.AdminGroup]: 'Approval Admin Group',
  [PangeaGroupEnum.AccountOwnerGroup]: 'Approval Owner Group',
  [PangeaGroupEnum.ManagerGroup]: 'Approval Manager Group',
};
