import * as index from './index';
import { range } from '../utils';

// pure NodeJS cannot import electron modules.
jest.mock('electron', () => ({
  remote: {
    dialog: jest.fn(),
  },
}));

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
      10,
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
      10,
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
      10,
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
    await timeout(100);

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
      10,
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
    await timeout(100);

    // call inside callback (3rd).
    callback = mockDescribeLogGroups.mock.calls[2][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(100);

    // call inside callback (4th).
    callback = mockDescribeLogGroups.mock.calls[3][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(100);

    // call inside callback (5th).
    callback = mockDescribeLogGroups.mock.calls[4][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(100);

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
      10,
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
      10,
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
      10,
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
    await timeout(100);

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
      10,
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
    await timeout(100);

    // call inside callback (3rd).
    callback = mockDescribeLogStreams.mock.calls[2][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(100);

    // call inside callback (4th).
    callback = mockDescribeLogStreams.mock.calls[3][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(100);

    // call inside callback (5th).
    callback = mockDescribeLogStreams.mock.calls[4][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(100);

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

  it('getCloudWatchLogsEvents: 0 events.', () => {
    let mockGetLogEvents = jest.fn();
    let mockCallbackData = jest.fn();
    let mockCallbackError = jest.fn();
    let mockCallbackEnd = jest.fn();

    let params = (token?: string) => ({
      logGroupName: 'log group',
      logStreamName: 'log stream',
      startTime: new Date(0).getTime(),
      endTime: new Date(100).getTime(),
      limit: undefined,
      nextToken: token,
      startFromHead: true,
    });

    // call test target.
    index.getCloudWatchLogsEvents(
      { getLogEvents: mockGetLogEvents } as any,
      'log group',
      'log stream',
      new Date(0),
      new Date(100),
      mockCallbackData,
      mockCallbackError,
      mockCallbackEnd,
      true,
      undefined,
      10,
    );

    // 1st call inside callback.
    let callback = mockGetLogEvents.mock.calls[0][1];
    callback(undefined, {
      nextForwardToken: 'last-token',
      events: [],
    });

    // 2nd call inside callback.
    callback = mockGetLogEvents.mock.calls[1][1];
    callback(undefined, {
      nextForwardToken: 'last-token',
      events: [],
    });

    expect(mockGetLogEvents.mock.calls.length).toBe(2);
    expect(mockGetLogEvents.mock.calls[0].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[0][0]).toEqual(params(undefined));
    expect(mockGetLogEvents.mock.calls[1].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[1][0]).toEqual(params('last-token'));

    // CallbackData.
    expect(mockCallbackData.mock.calls.length).toBe(0);

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(0);

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(1);
    expect(mockCallbackEnd.mock.calls[0].length).toBe(0);
  });

  it('getCloudWatchLogsEvents: 10 events.', () => {
    let mockGetLogEvents = jest.fn();
    let mockCallbackData = jest.fn();
    let mockCallbackError = jest.fn();
    let mockCallbackEnd = jest.fn();

    let params = (token?: string) => ({
      logGroupName: 'log group',
      logStreamName: 'log stream',
      startTime: new Date(0).getTime(),
      endTime: new Date(100).getTime(),
      limit: undefined,
      nextToken: token,
      startFromHead: true,
    });

    // call test target.
    index.getCloudWatchLogsEvents(
      { getLogEvents: mockGetLogEvents } as any,
      'log group',
      'log stream',
      new Date(0),
      new Date(100),
      mockCallbackData,
      mockCallbackError,
      mockCallbackEnd,
      true,
      undefined,
      10,
    );

    // 1st call inside callback.
    let callback = mockGetLogEvents.mock.calls[0][1];
    callback(undefined, {
      nextForwardToken: 'last-token',
      events: range(0, 10).map(i => ({
        timestamp: i + 1,
        message: 'message ' + i,
      })),
    });

    // 2nd call inside callback.
    callback = mockGetLogEvents.mock.calls[1][1];
    callback(undefined, {
      nextForwardToken: 'last-token',
      events: [],
    });

    expect(mockGetLogEvents.mock.calls.length).toBe(2);
    expect(mockGetLogEvents.mock.calls[0].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[0][0]).toEqual(params(undefined));
    expect(mockGetLogEvents.mock.calls[1].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[1][0]).toEqual(params('last-token'));

    // CallbackData.
    expect(mockCallbackData.mock.calls.length).toBe(1);
    expect(mockCallbackData.mock.calls[0].length).toBe(2);
    expect(mockCallbackData.mock.calls[0][0]).toEqual({
      nextForwardToken: 'last-token',
      events: range(0, 10).map(i => ({
        timestamp: i + 1,
        message: 'message ' + i,
      })),
    });
    expect(mockCallbackData.mock.calls[0][1]).toBeCloseTo(0.1);

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(0);

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(1);
    expect(mockCallbackEnd.mock.calls[0].length).toBe(0);
  });

  it('getCloudWatchLogsEvents: 50 -> 13 events.', () => {
    let mockGetLogEvents = jest.fn();
    let mockCallbackData = jest.fn();
    let mockCallbackError = jest.fn();
    let mockCallbackEnd = jest.fn();

    let params = (token?: string) => ({
      logGroupName: 'log group',
      logStreamName: 'log stream',
      startTime: new Date(0).getTime(),
      endTime: new Date(100).getTime(),
      limit: undefined,
      nextToken: token,
      startFromHead: true,
    });

    // call test target.
    index.getCloudWatchLogsEvents(
      { getLogEvents: mockGetLogEvents } as any,
      'log group',
      'log stream',
      new Date(0),
      new Date(100),
      mockCallbackData,
      mockCallbackError,
      mockCallbackEnd,
      true,
      undefined,
      10,
    );

    // 1st call inside callback.
    let callback = mockGetLogEvents.mock.calls[0][1];
    callback(undefined, {
      nextForwardToken: '1st-token',
      events: range(0, 50).map(i => ({
        timestamp: i + 1,
        message: 'message ' + i,
      })),
    });

    // 2nd call inside callback.
    callback = mockGetLogEvents.mock.calls[1][1];
    callback(undefined, {
      nextForwardToken: 'last-token',
      events: range(50, 100).map(i => ({
        timestamp: i + 1,
        message: 'message ' + i,
      })),
    });

    // 3rd call inside callback.
    callback = mockGetLogEvents.mock.calls[2][1];
    callback(undefined, {
      nextForwardToken: 'last-token',
      events: [],
    });

    expect(mockGetLogEvents.mock.calls.length).toBe(3);
    expect(mockGetLogEvents.mock.calls[0].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[0][0]).toEqual(params(undefined));
    expect(mockGetLogEvents.mock.calls[1].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[1][0]).toEqual(params('1st-token'));
    expect(mockGetLogEvents.mock.calls[2].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[2][0]).toEqual(params('last-token'));

    // CallbackData.
    expect(mockCallbackData.mock.calls.length).toBe(2);
    expect(mockCallbackData.mock.calls[0].length).toBe(2);
    expect(mockCallbackData.mock.calls[0][0]).toEqual({
      nextForwardToken: '1st-token',
      events: range(0, 50).map(i => ({
        timestamp: i + 1,
        message: 'message ' + i,
      })),
    });
    expect(mockCallbackData.mock.calls[0][1]).toBeCloseTo(0.5);
    expect(mockCallbackData.mock.calls[1].length).toBe(2);
    expect(mockCallbackData.mock.calls[1][0]).toEqual({
      nextForwardToken: 'last-token',
      events: range(50, 100).map(i => ({
        timestamp: i + 1,
        message: 'message ' + i,
      })),
    });
    expect(mockCallbackData.mock.calls[1][1]).toBeCloseTo(1.0);

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(0);

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(1);
    expect(mockCallbackEnd.mock.calls[0].length).toBe(0);
  });

  it('getCloudWatchLogsEvents: 50 -> Error -> 13 events.', async () => {
    let mockGetLogEvents = jest.fn();
    let mockCallbackData = jest.fn();
    let mockCallbackError = jest.fn();
    let mockCallbackEnd = jest.fn();

    let params = (token?: string) => ({
      logGroupName: 'log group',
      logStreamName: 'log stream',
      startTime: new Date(0).getTime(),
      endTime: new Date(100).getTime(),
      limit: undefined,
      nextToken: token,
      startFromHead: true,
    });

    // call test target.
    index.getCloudWatchLogsEvents(
      { getLogEvents: mockGetLogEvents } as any,
      'log group',
      'log stream',
      new Date(0),
      new Date(100),
      mockCallbackData,
      mockCallbackError,
      mockCallbackEnd,
      true,
      undefined,
      10,
    );

    // 1st call inside callback.
    let callback = mockGetLogEvents.mock.calls[0][1];
    callback(undefined, {
      nextForwardToken: '1st-token',
      events: range(0, 50).map(i => ({
        timestamp: i + 1,
        message: 'message ' + i,
      })),
    });

    // 2nd call inside callback.
    callback = mockGetLogEvents.mock.calls[1][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(100);

    // 3rd call inside callback.
    callback = mockGetLogEvents.mock.calls[2][1];
    callback(undefined, {
      nextForwardToken: 'last-token',
      events: range(50, 100).map(i => ({
        timestamp: i + 1,
        message: 'message ' + i,
      })),
    });

    // 4th call inside callback.
    callback = mockGetLogEvents.mock.calls[3][1];
    callback(undefined, {
      nextForwardToken: 'last-token',
      events: [],
    });

    expect(mockGetLogEvents.mock.calls.length).toBe(4);
    expect(mockGetLogEvents.mock.calls[0].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[0][0]).toEqual(params(undefined));
    expect(mockGetLogEvents.mock.calls[1].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[1][0]).toEqual(params('1st-token'));
    expect(mockGetLogEvents.mock.calls[2].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[2][0]).toEqual(params('1st-token'));
    expect(mockGetLogEvents.mock.calls[3].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[3][0]).toEqual(params('last-token'));

    // CallbackData.
    expect(mockCallbackData.mock.calls.length).toBe(2);
    expect(mockCallbackData.mock.calls[0].length).toBe(2);
    expect(mockCallbackData.mock.calls[0][0]).toEqual({
      nextForwardToken: '1st-token',
      events: range(0, 50).map(i => ({
        timestamp: i + 1,
        message: 'message ' + i,
      })),
    });
    expect(mockCallbackData.mock.calls[0][1]).toBeCloseTo(0.5);
    expect(mockCallbackData.mock.calls[1].length).toBe(2);
    expect(mockCallbackData.mock.calls[1][0]).toEqual({
      nextForwardToken: 'last-token',
      events: range(50, 100).map(i => ({
        timestamp: i + 1,
        message: 'message ' + i,
      })),
    });
    expect(mockCallbackData.mock.calls[1][1]).toBeCloseTo(1.0);

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(0);

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(1);
    expect(mockCallbackEnd.mock.calls[0].length).toBe(0);
  });

  it('getCloudWatchLogsEvents: 50 -> Error -> Error -> Error.', async () => {
    let mockGetLogEvents = jest.fn();
    let mockCallbackData = jest.fn();
    let mockCallbackError = jest.fn();
    let mockCallbackEnd = jest.fn();

    let params = (token?: string) => ({
      logGroupName: 'log group',
      logStreamName: 'log stream',
      startTime: new Date(0).getTime(),
      endTime: new Date(100).getTime(),
      limit: undefined,
      nextToken: token,
      startFromHead: true,
    });

    // call test target.
    index.getCloudWatchLogsEvents(
      { getLogEvents: mockGetLogEvents } as any,
      'log group',
      'log stream',
      new Date(0),
      new Date(100),
      mockCallbackData,
      mockCallbackError,
      mockCallbackEnd,
      true,
      undefined,
      10,
    );

    // 1st call inside callback.
    let callback = mockGetLogEvents.mock.calls[0][1];
    callback(undefined, {
      nextForwardToken: '1st-token',
      events: range(0, 50).map(i => ({
        timestamp: i + 1,
        message: 'message ' + i,
      })),
    });

    // 2nd call inside callback.
    callback = mockGetLogEvents.mock.calls[1][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(100);

    // 3rd call inside callback.
    callback = mockGetLogEvents.mock.calls[2][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(100);

    // 4th call inside callback.
    callback = mockGetLogEvents.mock.calls[3][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(100);

    // 5th call inside callback.
    callback = mockGetLogEvents.mock.calls[4][1];
    callback({ message: 'error messages.' }, undefined);
    await timeout(100);

    expect(mockGetLogEvents.mock.calls.length).toBe(5);
    expect(mockGetLogEvents.mock.calls[0].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[0][0]).toEqual(params(undefined));
    expect(mockGetLogEvents.mock.calls[1].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[1][0]).toEqual(params('1st-token'));
    expect(mockGetLogEvents.mock.calls[2].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[2][0]).toEqual(params('1st-token'));
    expect(mockGetLogEvents.mock.calls[3].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[3][0]).toEqual(params('1st-token'));
    expect(mockGetLogEvents.mock.calls[4].length).toBe(2);
    expect(mockGetLogEvents.mock.calls[4][0]).toEqual(params('1st-token'));

    // CallbackData.
    expect(mockCallbackData.mock.calls.length).toBe(1);
    expect(mockCallbackData.mock.calls[0].length).toBe(2);
    expect(mockCallbackData.mock.calls[0][0]).toEqual({
      nextForwardToken: '1st-token',
      events: range(0, 50).map(i => ({
        timestamp: i + 1,
        message: 'message ' + i,
      })),
    });
    expect(mockCallbackData.mock.calls[0][1]).toBeCloseTo(0.5);

    // CallbackError.
    expect(mockCallbackError.mock.calls.length).toBe(1);
    expect(mockCallbackError.mock.calls[0].length).toBe(1);
    expect(mockCallbackError.mock.calls[0][0]).toEqual({ message: 'error messages.' });

    // CallbackEnd.
    expect(mockCallbackEnd.mock.calls.length).toBe(0);
  });

});
