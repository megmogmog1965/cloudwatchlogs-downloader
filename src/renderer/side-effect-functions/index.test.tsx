import * as index from './index';

// pure NodeJS cannot import electron modules.
jest.mock('electron', () => ({
  remote: {
    dialog: jest.fn(),
  },
}));

describe('utils/index', () => {
  it('applicationPassphrase: characters.', () => {
    expect(/^[-+.0-9a-z]+_.+$/.test(index.applicationPassphrase())).toBe(true);
  });

  it('createUuid: characters.', () => {
    expect(/^[-0-9a-z]+$/.test(index.createUuid())).toBe(true);
  });

  it('currentDate: current date.', () => {
    expect(index.currentDate().getTime() - new Date().getTime() < 1000).toBe(true); // permit 1 sec delay.
  });

  it('getCloudWatchLogGroups: 0 logs (0 times).', () => {
    let mockDescribeLogGroups = jest.fn();
    let mockCallbackStart = jest.fn();
    let mockCallbackError = jest.fn();
    let mockCallbackEnd = jest.fn();

    // call test target.
    index.getCloudWatchLogGroups(
      { describeLogGroups: mockDescribeLogGroups } as any,
      mockCallbackStart,
      mockCallbackError,
      mockCallbackEnd,
    );

    expect(mockDescribeLogGroups.mock.calls.length).toBe(1);
    expect(mockDescribeLogGroups.mock.calls[0].length).toBe(2);
    expect(mockDescribeLogGroups.mock.calls[0][0]).toEqual({ nextToken: undefined });

    // call inside callback.
    let callback = mockDescribeLogGroups.mock.calls[0][1];
    callback(undefined, { logGroups: [] })

    // CallbackStart.
    expect(mockCallbackStart.mock.calls.length).toBe(1);
    expect(mockCallbackStart.mock.calls[0].length).toBe(1);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(0);

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(1);
    expect(mockCallbackEnd.mock.calls[0].length).toBe(2);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());
    expect(mockCallbackEnd.mock.calls[0][1]).toEqual([]);
  });

  it('getCloudWatchLogGroups: 10 logs (1 times).', () => {
    let mockDescribeLogGroups = jest.fn();
    let mockCallbackStart = jest.fn();
    let mockCallbackError = jest.fn();
    let mockCallbackEnd = jest.fn();

    // call test target.
    index.getCloudWatchLogGroups(
      { describeLogGroups: mockDescribeLogGroups } as any,
      mockCallbackStart,
      mockCallbackError,
      mockCallbackEnd,
    );

    expect(mockDescribeLogGroups.mock.calls.length).toBe(1);
    expect(mockDescribeLogGroups.mock.calls[0].length).toBe(2);
    expect(mockDescribeLogGroups.mock.calls[0][0]).toEqual({ nextToken: undefined });

    // call inside callback.
    let callback = mockDescribeLogGroups.mock.calls[0][1];
    callback(undefined, { logGroups:
      [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ].map(i => ({ arn: '' + i, logGroupName: 'group ' + i, creationTime: 0, storedBytes: 0 })),
    });

    // CallbackStart.
    expect(mockCallbackStart.mock.calls.length).toBe(1);
    expect(mockCallbackStart.mock.calls[0].length).toBe(1);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(0);

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(1);
    expect(mockCallbackEnd.mock.calls[0].length).toBe(2);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());
    expect(mockCallbackEnd.mock.calls[0][1]).toEqual(
      [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ].map(i => ({ arn: '' + i, logGroupName: 'group ' + i, creationTime: 0, storedBytes: 0 })),
    );
  });
});
