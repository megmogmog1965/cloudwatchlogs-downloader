import * as index from './index';

// pure NodeJS cannot import electron modules.
jest.mock('electron', () => ({
  remote: {
    dialog: jest.fn(),
  },
}));

function range(begin: number, end: number): number[] {
  return Array.from({ length: end }, (v, k) => begin + k);
}

function timeout(ms: number) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

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

  it('getCloudWatchLogGroups: 0 logs.', () => {
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

    // CallbackStart.
    expect(mockCallbackStart.mock.calls.length).toBe(1);
    expect(mockCallbackStart.mock.calls[0].length).toBe(1);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());

    // call inside callback.
    let callback = mockDescribeLogGroups.mock.calls[0][1];
    callback(undefined, { logGroups: [] })

    expect(mockDescribeLogGroups.mock.calls.length).toBe(1);
    expect(mockDescribeLogGroups.mock.calls[0].length).toBe(2);
    expect(mockDescribeLogGroups.mock.calls[0][0]).toEqual({ nextToken: undefined });

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(0);

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(1);
    expect(mockCallbackEnd.mock.calls[0].length).toBe(2);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());
    expect(mockCallbackEnd.mock.calls[0][1]).toEqual([]);
  });

  it('getCloudWatchLogGroups: 10 groups.', () => {
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

    // CallbackStart.
    expect(mockCallbackStart.mock.calls.length).toBe(1);
    expect(mockCallbackStart.mock.calls[0].length).toBe(1);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());

    // call inside callback.
    let callback = mockDescribeLogGroups.mock.calls[0][1];
    callback(undefined, {
      logGroups:
        range(0, 10).map(i => ({ arn: '' + i, logGroupName: 'group ' + i, creationTime: 0, storedBytes: 0 })),
    });

    expect(mockDescribeLogGroups.mock.calls.length).toBe(1);
    expect(mockDescribeLogGroups.mock.calls[0].length).toBe(2);
    expect(mockDescribeLogGroups.mock.calls[0][0]).toEqual({ nextToken: undefined });

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(0);

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(1);
    expect(mockCallbackEnd.mock.calls[0].length).toBe(2);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());
    expect(mockCallbackEnd.mock.calls[0][1]).toEqual(
      range(0, 10).map(i => ({ arn: '' + i, logGroupName: 'group ' + i, creationTime: 0, storedBytes: 0 })),
    );
  });

  it('getCloudWatchLogGroups: 50 -> Error -> 13 groups.', async () => {
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

    // CallbackStart.
    expect(mockCallbackStart.mock.calls.length).toBe(1);
    expect(mockCallbackStart.mock.calls[0].length).toBe(1);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());

    // call inside callback (1st).
    let callback = mockDescribeLogGroups.mock.calls[0][1];
    callback(undefined, {
      logGroups:
        range(0, 50).map(i => ({ arn: '1-' + i, logGroupName: 'group 1-' + i, creationTime: 0, storedBytes: 0 })),
      nextToken: '1st-token',
    });

    // call inside callback (2nd).
    callback = mockDescribeLogGroups.mock.calls[1][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(1100);

    // call inside callback (3rd).
    callback = mockDescribeLogGroups.mock.calls[2][1];
    callback(undefined, {
      logGroups:
        range(0, 13).map(i => ({ arn: '2-' + i, logGroupName: 'group 2-' + i, creationTime: 0, storedBytes: 0 })),
    });

    expect(mockDescribeLogGroups.mock.calls.length).toBe(3);
    expect(mockDescribeLogGroups.mock.calls[0].length).toBe(2);
    expect(mockDescribeLogGroups.mock.calls[1].length).toBe(2);
    expect(mockDescribeLogGroups.mock.calls[2].length).toBe(2);
    expect(mockDescribeLogGroups.mock.calls[0][0]).toEqual({ nextToken: undefined });
    expect(mockDescribeLogGroups.mock.calls[1][0]).toEqual({ nextToken: '1st-token' });
    expect(mockDescribeLogGroups.mock.calls[2][0]).toEqual({ nextToken: '1st-token' });

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(0);

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(1);
    expect(mockCallbackEnd.mock.calls[0].length).toBe(2);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());
    expect(mockCallbackEnd.mock.calls[0][1]).toEqual(
      range(0, 50).map(i => ({ arn: '1-' + i, logGroupName: 'group 1-' + i, creationTime: 0, storedBytes: 0 }))
        .concat(
          range(0, 13).map(i => ({ arn: '2-' + i, logGroupName: 'group 2-' + i, creationTime: 0, storedBytes: 0 })),
      ),
    );
  });

  it('getCloudWatchLogGroups: 50 -> Error -> Error -> Error.', async () => {
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

    // CallbackStart.
    expect(mockCallbackStart.mock.calls.length).toBe(1);
    expect(mockCallbackStart.mock.calls[0].length).toBe(1);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());

    // call inside callback (1st).
    let callback = mockDescribeLogGroups.mock.calls[0][1];
    callback(undefined, {
      logGroups:
        range(0, 50).map(i => ({ arn: '1-' + i, logGroupName: 'group 1-' + i, creationTime: 0, storedBytes: 0 })),
      nextToken: '1st-token',
    });

    // call inside callback (2nd).
    callback = mockDescribeLogGroups.mock.calls[1][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(1100);

    // call inside callback (3rd).
    callback = mockDescribeLogGroups.mock.calls[2][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(1100);

    // call inside callback (4th).
    callback = mockDescribeLogGroups.mock.calls[3][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(1100);

    // call inside callback (5th).
    callback = mockDescribeLogGroups.mock.calls[4][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(1100);

    expect(mockDescribeLogGroups.mock.calls.length).toBe(5);
    expect(mockDescribeLogGroups.mock.calls[0].length).toBe(2);
    expect(mockDescribeLogGroups.mock.calls[1].length).toBe(2);
    expect(mockDescribeLogGroups.mock.calls[2].length).toBe(2);
    expect(mockDescribeLogGroups.mock.calls[3].length).toBe(2);
    expect(mockDescribeLogGroups.mock.calls[4].length).toBe(2);
    expect(mockDescribeLogGroups.mock.calls[0][0]).toEqual({ nextToken: undefined });
    expect(mockDescribeLogGroups.mock.calls[1][0]).toEqual({ nextToken: '1st-token' });
    expect(mockDescribeLogGroups.mock.calls[2][0]).toEqual({ nextToken: '1st-token' });
    expect(mockDescribeLogGroups.mock.calls[3][0]).toEqual({ nextToken: '1st-token' });
    expect(mockDescribeLogGroups.mock.calls[4][0]).toEqual({ nextToken: '1st-token' });

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(1);
    expect(mockCallbackError.mock.calls[0].length).toBe(2);
    expect(mockCallbackError.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackError.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());
    expect(mockCallbackError.mock.calls[0][1]).toEqual({ message: 'error messages.' });

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(0);
  });

  it('getCloudWatchLogStreams: 0 streams.', () => {
    let mockDescribeLogStreams = jest.fn();
    let mockCallbackStart = jest.fn();
    let mockCallbackError = jest.fn();
    let mockCallbackEnd = jest.fn();

    // call test target.
    index.getCloudWatchLogStreams(
      { describeLogStreams: mockDescribeLogStreams } as any,
      'log group',
      mockCallbackStart,
      mockCallbackError,
      mockCallbackEnd,
    );

    // CallbackStart.
    expect(mockCallbackStart.mock.calls.length).toBe(1);
    expect(mockCallbackStart.mock.calls[0].length).toBe(1);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());

    // call inside callback.
    let callback = mockDescribeLogStreams.mock.calls[0][1];
    callback(undefined, { logStreams: [] });

    expect(mockDescribeLogStreams.mock.calls.length).toBe(1);
    expect(mockDescribeLogStreams.mock.calls[0].length).toBe(2);
    expect(mockDescribeLogStreams.mock.calls[0][0]).toEqual({ logGroupName: 'log group', descending: true, orderBy: 'LastEventTime', nextToken: undefined });

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(0);

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(1);
    expect(mockCallbackEnd.mock.calls[0].length).toBe(2);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());
    expect(mockCallbackEnd.mock.calls[0][1]).toEqual([]);
  });

  it('getCloudWatchLogStreams: 10 streams.', () => {
    let mockDescribeLogStreams = jest.fn();
    let mockCallbackStart = jest.fn();
    let mockCallbackError = jest.fn();
    let mockCallbackEnd = jest.fn();

    // call test target.
    index.getCloudWatchLogStreams(
      { describeLogStreams: mockDescribeLogStreams } as any,
      'log group',
      mockCallbackStart,
      mockCallbackError,
      mockCallbackEnd,
    );

    // CallbackStart.
    expect(mockCallbackStart.mock.calls.length).toBe(1);
    expect(mockCallbackStart.mock.calls[0].length).toBe(1);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());

    // call inside callback.
    let callback = mockDescribeLogStreams.mock.calls[0][1];
    callback(undefined, {
      logStreams:
        range(0, 10).map(i => ({ arn: '' + i, logStreamName: 'stream ' + i, creationTime: 0, firstEventTimestamp: 0, lastEventTimestamp: 0, storedBytes: 0 })),
    });

    expect(mockDescribeLogStreams.mock.calls.length).toBe(1);
    expect(mockDescribeLogStreams.mock.calls[0].length).toBe(2);
    expect(mockDescribeLogStreams.mock.calls[0][0]).toEqual({ logGroupName: 'log group', descending: true, orderBy: 'LastEventTime', nextToken: undefined });

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(0);

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(1);
    expect(mockCallbackEnd.mock.calls[0].length).toBe(2);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());
    expect(mockCallbackEnd.mock.calls[0][1]).toEqual(
      range(0, 10).map(i => ({ arn: '' + i, logStreamName: 'stream ' + i, creationTime: 0, firstEventTimestamp: 0, lastEventTimestamp: 0, storedBytes: 0 })),
    );
  });

  it('getCloudWatchLogStreams: 50 -> Error -> 13 streams.', async () => {
    let mockDescribeLogStreams = jest.fn();
    let mockCallbackStart = jest.fn();
    let mockCallbackError = jest.fn();
    let mockCallbackEnd = jest.fn();

    // call test target.
    index.getCloudWatchLogStreams(
      { describeLogStreams: mockDescribeLogStreams } as any,
      'log group',
      mockCallbackStart,
      mockCallbackError,
      mockCallbackEnd,
    );

    // CallbackStart.
    expect(mockCallbackStart.mock.calls.length).toBe(1);
    expect(mockCallbackStart.mock.calls[0].length).toBe(1);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());

    // call inside callback (1st).
    let callback = mockDescribeLogStreams.mock.calls[0][1];
    callback(undefined, {
      logStreams:
        range(0, 50).map(i => ({ arn: '' + i, logStreamName: 'stream ' + i, creationTime: 0, firstEventTimestamp: 0, lastEventTimestamp: 0, storedBytes: 0 })),
      nextToken: '1st-token',
    });

    // call inside callback (2nd).
    callback = mockDescribeLogStreams.mock.calls[1][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(1100);

    // call inside callback (3rd).
    callback = mockDescribeLogStreams.mock.calls[2][1];
    callback(undefined, {
      logStreams:
        range(0, 13).map(i => ({ arn: '' + i, logStreamName: 'stream ' + i, creationTime: 0, firstEventTimestamp: 0, lastEventTimestamp: 0, storedBytes: 0 })),
    });

    expect(mockDescribeLogStreams.mock.calls.length).toBe(3);
    expect(mockDescribeLogStreams.mock.calls[0].length).toBe(2);
    expect(mockDescribeLogStreams.mock.calls[1].length).toBe(2);
    expect(mockDescribeLogStreams.mock.calls[2].length).toBe(2);
    expect(mockDescribeLogStreams.mock.calls[0][0]).toEqual({ logGroupName: 'log group', descending: true, orderBy: 'LastEventTime', nextToken: undefined });
    expect(mockDescribeLogStreams.mock.calls[1][0]).toEqual({ logGroupName: 'log group', descending: true, orderBy: 'LastEventTime', nextToken: '1st-token' });
    expect(mockDescribeLogStreams.mock.calls[2][0]).toEqual({ logGroupName: 'log group', descending: true, orderBy: 'LastEventTime', nextToken: '1st-token' });

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(0);

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(1);
    expect(mockCallbackEnd.mock.calls[0].length).toBe(2);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackEnd.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());
    expect(mockCallbackEnd.mock.calls[0][1]).toEqual(
      range(0, 50).map(i => ({ arn: '' + i, logStreamName: 'stream ' + i, creationTime: 0, firstEventTimestamp: 0, lastEventTimestamp: 0, storedBytes: 0 }))
        .concat(
          range(0, 13).map(i => ({ arn: '' + i, logStreamName: 'stream ' + i, creationTime: 0, firstEventTimestamp: 0, lastEventTimestamp: 0, storedBytes: 0 })),
      ),
    );
  });

  it('getCloudWatchLogStreams: 50 -> Error -> Error -> Error.', async () => {
    let mockDescribeLogStreams = jest.fn();
    let mockCallbackStart = jest.fn();
    let mockCallbackError = jest.fn();
    let mockCallbackEnd = jest.fn();

    // call test target.
    index.getCloudWatchLogStreams(
      { describeLogStreams: mockDescribeLogStreams } as any,
      'log group',
      mockCallbackStart,
      mockCallbackError,
      mockCallbackEnd,
    );

    // CallbackStart.
    expect(mockCallbackStart.mock.calls.length).toBe(1);
    expect(mockCallbackStart.mock.calls[0].length).toBe(1);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackStart.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());

    // call inside callback (1st).
    let callback = mockDescribeLogStreams.mock.calls[0][1];
    callback(undefined, {
      logStreams:
        range(0, 50).map(i => ({ arn: '' + i, logStreamName: 'stream ' + i, creationTime: 0, firstEventTimestamp: 0, lastEventTimestamp: 0, storedBytes: 0 })),
      nextToken: '1st-token',
    });

    // call inside callback (2nd).
    callback = mockDescribeLogStreams.mock.calls[1][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(1100);

    // call inside callback (3rd).
    callback = mockDescribeLogStreams.mock.calls[2][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(1100);

    // call inside callback (4th).
    callback = mockDescribeLogStreams.mock.calls[3][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(1100);

    // call inside callback (5th).
    callback = mockDescribeLogStreams.mock.calls[4][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(1100);

    expect(mockDescribeLogStreams.mock.calls.length).toBe(5);
    expect(mockDescribeLogStreams.mock.calls[0].length).toBe(2);
    expect(mockDescribeLogStreams.mock.calls[1].length).toBe(2);
    expect(mockDescribeLogStreams.mock.calls[2].length).toBe(2);
    expect(mockDescribeLogStreams.mock.calls[3].length).toBe(2);
    expect(mockDescribeLogStreams.mock.calls[4].length).toBe(2);
    expect(mockDescribeLogStreams.mock.calls[0][0]).toEqual({ logGroupName: 'log group', descending: true, orderBy: 'LastEventTime', nextToken: undefined });
    expect(mockDescribeLogStreams.mock.calls[1][0]).toEqual({ logGroupName: 'log group', descending: true, orderBy: 'LastEventTime', nextToken: '1st-token' });
    expect(mockDescribeLogStreams.mock.calls[2][0]).toEqual({ logGroupName: 'log group', descending: true, orderBy: 'LastEventTime', nextToken: '1st-token' });
    expect(mockDescribeLogStreams.mock.calls[3][0]).toEqual({ logGroupName: 'log group', descending: true, orderBy: 'LastEventTime', nextToken: '1st-token' });
    expect(mockDescribeLogStreams.mock.calls[4][0]).toEqual({ logGroupName: 'log group', descending: true, orderBy: 'LastEventTime', nextToken: '1st-token' });

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(1);
    expect(mockCallbackError.mock.calls[0].length).toBe(2);
    expect(mockCallbackError.mock.calls[0][0].getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 5000);
    expect(mockCallbackError.mock.calls[0][0].getTime()).toBeLessThanOrEqual(new Date().getTime());
    expect(mockCallbackError.mock.calls[0][1]).toEqual({ message: 'error messages.' });

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(0);
  });

});
