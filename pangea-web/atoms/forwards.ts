import { atom } from 'recoil';

export const forwardsModalState = atom<boolean>({
  key: 'forwardsModalState',
  default: false,
});
