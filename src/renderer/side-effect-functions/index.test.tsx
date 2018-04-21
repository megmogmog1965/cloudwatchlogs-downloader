import * as index from './index';

// pure NodeJS cannot import electron modules.
jest.mock('electron', () => ({
  remote: {
    dialog: jest.fn(),
  },
}));

describe('utils/index', () => {
  it('applicationPassphrase: characters.', () => {
    expect(/^[0-9a-z]+_.+$/.test(index.applicationPassphrase())).toBe(true);
  });

  it('createUuid: characters.', () => {
    expect(/^[-0-9a-z]+$/.test(index.createUuid())).toBe(true);
  });

  it('currentDate: current date.', () => {
    expect(index.currentDate().getTime() - new Date().getTime() < 1000).toBe(true); // permit 1 sec delay.
  });
});
