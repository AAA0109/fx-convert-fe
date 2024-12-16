import { safeWindow } from 'lib';
import { AtomEffect, DefaultValue } from 'recoil';
import { userState } from './';

export const localStorageEffect =
  <T>(key: string): AtomEffect<T> =>
  ({ setSelf, onSet, getPromise }) => {
    getPromise(userState).then((user) => {
      const email = user?.email;
      if (!email) {
        return;
      }
      key = email + '-' + key;
      const savedValue = safeWindow()?.localStorage.getItem(key);
      if (savedValue != null) {
        try {
          setSelf(JSON.parse(savedValue));
        } catch {
          setSelf(new DefaultValue());
        }
      }

      onSet((newValue, _, isReset) => {
        isReset
          ? safeWindow()?.localStorage.removeItem(key)
          : safeWindow()?.localStorage.setItem(key, JSON.stringify(newValue));
      });
    });
  };

export const plainLocalStorageEffect =
  <T>(key: string): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    const savedValue = safeWindow()?.localStorage.getItem(key);
    if (savedValue != null) {
      try {
        setSelf(JSON.parse(savedValue));
      } catch {
        setSelf(new DefaultValue());
      }
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? safeWindow()?.localStorage.removeItem(key)
        : safeWindow()?.localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
