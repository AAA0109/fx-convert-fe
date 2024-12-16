// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';

let uuidInt = 0;
jest.mock('uuid', () => ({
  v4: () => {
    uuidInt++;
    return '00000000-0000-0000-0000-' + uuidInt.toString().padStart(12, '0');
  },
}));
