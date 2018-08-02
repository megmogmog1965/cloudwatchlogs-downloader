import * as index from './index';
import * as enums from '../enums';
import { ActionTypes } from '../constants';
import { LogGroup, LogStream, Settings } from '../common-interfaces';
import { extractJson } from '../utils';
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/index', () => {

  it('showWindowContent', () => {
    expect(index.showWindowContent(enums.WindowContent.LogDownload))
      .toEqual({
        type: ActionTypes.SHOW_WINDOW_CONTENT,
        windowContent: enums.WindowContent.LogDownload,
      });

    expect(index.showWindowContent(enums.WindowContent.Settings))
      .toEqual({
        type: ActionTypes.SHOW_WINDOW_CONTENT,
        windowContent: enums.WindowContent.Settings,
      });
  });

  it('requestLogGroups', () => {
    expect(index.requestLogGroups())
      .toEqual({
        type: ActionTypes.REQUEST_LOG_GROUPS,
      });
  });

  it('receiveLogGroups', () => {
    expect(index.receiveLogGroups([], new Date(100)))
      .toEqual({
        type: ActionTypes.RECEIVE_LOG_GROUPS,
        logGroups: [],
        lastModified: new Date(100),
      });

    expect(index.receiveLogGroups(['a' as any, 'b' as any], new Date(200)))
      .toEqual({
        type: ActionTypes.RECEIVE_LOG_GROUPS,
        logGroups: ['a' as any, 'b' as any],
        lastModified: new Date(200),
        nextToken: undefined,
      });
  });

  it('errorLogGroups', () => {
    expect(index.errorLogGroups('message'))
      .toEqual({
        type: ActionTypes.ERROR_LOG_GROUPS,
        errorMessage: 'message',
      });
  });

  it('fetchLogGroups - Start/End', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'CRLF',
      filters: [],
    };

    let getCloudWatchLogGroups = (
      callbackStart: (time: Date) => void,
      callbackError: (time: Date, err: AWS.AWSError) => void,
      callbackEnd: (time: Date, logGroups: LogGroup[]) => void,
    ) => {
      callbackStart(new Date(0));
      callbackEnd(new Date(1), ['a' as any, 'b' as any]);
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.fetchLogGroups(settings, getCloudWatchLogGroups, ['c' as any]));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_GROUPS,
          },
          {
            type: ActionTypes.RECEIVE_LOG_GROUPS,
            logGroups: ['c' as any, 'a' as any, 'b' as any],
            lastModified: new Date(1),
            nextToken: undefined,
          },
        ]);
    }, 100);
  });

  it('fetchLogGroups - Start/Error', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'CRLF',
      filters: [],
    };

    let getCloudWatchLogGroups = (
      callbackStart: (time: Date) => void,
      callbackError: (time: Date, err: AWS.AWSError) => void,
      callbackEnd: (time: Date, logGroups: LogGroup[]) => void,
    ) => {
      callbackStart(new Date(0));
      callbackError(new Date(1), { message: 'message' } as any);
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.fetchLogGroups(settings, getCloudWatchLogGroups));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_GROUPS,
          },
          {
            type: ActionTypes.ERROR_LOG_GROUPS,
            errorMessage: 'message',
          },
        ]);
    }, 100);
  });

  it('selectLogGroup', () => {
    expect(index.selectLogGroup(undefined))
      .toEqual({
        type: ActionTypes.SELECT_LOG_GROUP,
        selectedName: undefined,
      });

    expect(index.selectLogGroup('name'))
      .toEqual({
        type: ActionTypes.SELECT_LOG_GROUP,
        selectedName: 'name',
      });
  });

  it('requestLogStreams', () => {
    expect(index.requestLogStreams())
      .toEqual({
        type: ActionTypes.REQUEST_LOG_STREAMS,
      });
  });

  it('receiveLogStreams', () => {
    expect(index.receiveLogStreams([], new Date(100)))
      .toEqual({
        type: ActionTypes.RECEIVE_LOG_STREAMS,
        logStreams: [],
        lastModified: new Date(100),
      });

    expect(index.receiveLogStreams(['a' as any, 'b' as any], new Date(200)))
      .toEqual({
        type: ActionTypes.RECEIVE_LOG_STREAMS,
        logStreams: ['a' as any, 'b' as any],
        lastModified: new Date(200),
        nextToken: undefined,
      });
  });

  it('errorLogGroups', () => {
    expect(index.errorLogStreams('message'))
      .toEqual({
        type: ActionTypes.ERROR_LOG_STREAMS,
        errorMessage: 'message',
      });
  });

  it('fetchLogStreams - Start/End', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'CRLF',
      filters: [],
    };

    let getCloudWatchLogStreams = (
      callbackStart: (time: Date) => void,
      callbackError: (time: Date, err: AWS.AWSError) => void,
      callbackEnd: (time: Date, logStreams: LogStream[]) => void,
    ) => {
      callbackStart(new Date(0));
      callbackEnd(new Date(1), ['a' as any, 'b' as any]);
    }

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.fetchLogStreams(settings, 'loggroup', getCloudWatchLogStreams, ['c' as any]));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_STREAMS,
          },
          {
            type: ActionTypes.RECEIVE_LOG_STREAMS,
            logStreams: ['c' as any, 'a' as any, 'b' as any],
            lastModified: new Date(1),
            nextToken: undefined,
          },
        ]);
    }, 100);
  });

  it('fetchLogStreams - Start/Error', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'CRLF',
      filters: [],
    };

    let getCloudWatchLogStreams = (
      callbackStart: (time: Date) => void,
      callbackError: (time: Date, err: AWS.AWSError) => void,
      callbackEnd: (time: Date, logStreams: LogStream[]) => void,
    ) => {
      callbackStart(new Date(0));
      callbackError(new Date(1), { message: 'message' } as any);
    }

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.fetchLogStreams(settings, 'loggroup', getCloudWatchLogStreams));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_STREAMS,
          },
          {
            type: ActionTypes.ERROR_LOG_STREAMS,
            errorMessage: 'message',
          },
        ]);
    }, 100);
  });

  it('selectLogStream', () => {
    expect(index.selectLogStream(undefined))
      .toEqual({
        type: ActionTypes.SELECT_LOG_STREAM,
        selectedName: undefined,
      });

    expect(index.selectLogStream('name'))
      .toEqual({
        type: ActionTypes.SELECT_LOG_STREAM,
        selectedName: 'name',
      });
  });

  it('setDateRange', () => {
    expect(index.setDateRange(new Date(100), new Date(200)))
      .toEqual({
        type: ActionTypes.SET_DATERANGE,
        startDate: new Date(100),
        endDate: new Date(200),
      });
  });

  it('requestLogText', () => {
    expect(index.requestLogText())
      .toEqual({
        type: ActionTypes.REQUEST_LOG_TEXT,
      });
  });

  it('receiveLogText', () => {
    expect(index.receiveLogText('line 1\nline 2\n'))
      .toEqual({
        type: ActionTypes.RECEIVE_LOG_TEXT,
        text: 'line 1\nline 2\n',
      });
  });

  it('errorLogText', () => {
    expect(index.errorLogText('error messages'))
      .toEqual({
        type: ActionTypes.ERROR_LOG_TEXT,
        errorMessage: 'error messages',
      });
  });

  it('fetchLogText - Start/End without line break', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'NO_MODIFICATION',
      filters: [],
    };

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
      callbackError: (err: AWS.AWSError) => void,
      callbackEnd: () => void,
    ) => {
      callbackData({
        events: [
          {
            timestamp: new Date(1).getTime(),
            message: 'log line 1\n',
          },
          {
            timestamp: new Date(2).getTime(),
            message: 'log line 2\r\n',
          },
        ],
      });
      callbackEnd();
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.fetchLogText(settings, getCloudWatchLogsEvents));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_TEXT,
          },
          {
            type: ActionTypes.RECEIVE_LOG_TEXT,
            text: 'log line 1\nlog line 2\r\n',
          },
        ]);
    }, 100);
  });

  it('fetchLogText - Start/End with LF', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'LF',
      filters: [],
    };

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
      callbackError: (err: AWS.AWSError) => void,
      callbackEnd: () => void,
    ) => {
      callbackData({
        events: [
          {
            timestamp: new Date(1).getTime(),
            message: 'log line 1\n',
          },
          {
            timestamp: new Date(2).getTime(),
            message: 'log line 2\r\n',
          },
        ],
      });
      callbackEnd();
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.fetchLogText(settings, getCloudWatchLogsEvents));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_TEXT,
          },
          {
            type: ActionTypes.RECEIVE_LOG_TEXT,
            text: 'log line 1\nlog line 2\n',
          },
        ]);
    }, 100);
  });

  it('fetchLogText - Start/End with CRLF', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'CRLF',
      filters: [],
    };

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
      callbackError: (err: AWS.AWSError) => void,
      callbackEnd: () => void,
    ) => {
      callbackData({
        events: [
          {
            timestamp: new Date(1).getTime(),
            message: 'log line 1\n',
          },
          {
            timestamp: new Date(2).getTime(),
            message: 'log line 2\r\n',
          },
        ],
      });
      callbackEnd();
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.fetchLogText(settings, getCloudWatchLogsEvents));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_TEXT,
          },
          {
            type: ActionTypes.RECEIVE_LOG_TEXT,
            text: 'log line 1\r\nlog line 2\r\n',
          },
        ]);
    }, 100);
  });

  it('fetchLogText - Start/Error', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'CRLF',
      filters: [],
    };

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
      callbackError: (err: AWS.AWSError) => void,
      callbackEnd: () => void,
    ) => {
      callbackData({
        events: [
          {
            timestamp: new Date(1).getTime(),
            message: 'log line 1\n',
          },
        ],
      });
      callbackError({ message: 'error message' } as any);
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.fetchLogText(settings, getCloudWatchLogsEvents));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_TEXT,
          },
          {
            type: ActionTypes.ERROR_LOG_TEXT,
            errorMessage: 'error message',
          },
        ]);
    }, 100);
  });

  it('requestLogEvents', () => {
    expect(index.requestLogEvents({ id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 }))
      .toEqual({
        type: ActionTypes.REQUEST_LOG_EVENTS,
        job: { id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 },
      });
  });

  it('receiveLogEvents', () => {
    expect(index.receiveLogEvents({ id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 }))
      .toEqual({
        type: ActionTypes.RECEIVE_LOG_EVENTS,
        job: { id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 },
      });
  });

  it('errorLogEvents', () => {
    expect(index.errorLogEvents({ id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 }))
      .toEqual({
        type: ActionTypes.ERROR_LOG_EVENTS,
        job: { id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 },
      });
  });

  it('downloadLogs - cancel selected', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'CRLF',
      filters: [],
    };

    let fileChooser = () => undefined; // stream.Writable | undefined

    let job = { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 };

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse, progress: number) => void,
      callbackError: (err: AWS.AWSError) => void,
      callbackEnd: () => void,
    ) => 0;

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.downloadLogs(settings, fileChooser, job, getCloudWatchLogsEvents));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([]);
    }, 100);
  });

  it('downloadLogs - Start/End without line break', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'NO_MODIFICATION',
      filters: [],
    };

    let mockWrite = jest.fn();
    let mockEnd = jest.fn();
    let fileChooser = () => ({ write: mockWrite, end: mockEnd }) as any; // stream.Writable | undefined

    let job = { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 };

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse, progress: number) => void,
      callbackError: (err: AWS.AWSError) => void,
      callbackEnd: () => void,
    ) => {
      callbackData({
        events: [
          {
            timestamp: new Date(1).getTime(),
            message: 'log line 1',
          },
          {
            timestamp: new Date(2).getTime(),
            message: 'log line 2\n',
          },
        ],
      }, 0.5);
      callbackData({
        events: [
          {
            timestamp: new Date(3).getTime(),
            message: 'log line 3\r\n',
          },
        ],
      }, 0.9);
      callbackEnd();
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.downloadLogs(settings, fileChooser, job, getCloudWatchLogsEvents));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 },
          },
          {
            type: ActionTypes.PROGRESS_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0.5 },
          },
          {
            type: ActionTypes.PROGRESS_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0.9 },
          },
          {
            type: ActionTypes.RECEIVE_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 1.0 },
          },
        ]);

      expect(mockWrite.mock.calls.length).toBe(4); // message chunk + linefeed ==> 2 writes.
      expect(mockEnd.mock.calls.length).toBe(1);

      expect(mockWrite.mock.calls[0][0]).toBe('log line 1log line 2\n');
      expect(mockWrite.mock.calls[1][0]).toBe('');
      expect(mockWrite.mock.calls[2][0]).toBe('log line 3\r\n');
      expect(mockWrite.mock.calls[3][0]).toBe('');
    }, 100);
  });

  it('downloadLogs - Start/End with LF', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'LF',
      filters: [],
    };

    let mockWrite = jest.fn();
    let mockEnd = jest.fn();
    let fileChooser = () => ({ write: mockWrite, end: mockEnd }) as any; // stream.Writable | undefined

    let job = { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 };

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse, progress: number) => void,
      callbackError: (err: AWS.AWSError) => void,
      callbackEnd: () => void,
    ) => {
      callbackData({
        events: [
          {
            timestamp: new Date(1).getTime(),
            message: 'log line 1',
          },
          {
            timestamp: new Date(2).getTime(),
            message: 'log line 2\n',
          },
        ],
      }, 0.5);
      callbackData({
        events: [
          {
            timestamp: new Date(3).getTime(),
            message: 'log line 3\r\n',
          },
        ],
      }, 0.9);
      callbackEnd();
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.downloadLogs(settings, fileChooser, job, getCloudWatchLogsEvents));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 },
          },
          {
            type: ActionTypes.PROGRESS_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0.5 },
          },
          {
            type: ActionTypes.PROGRESS_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0.9 },
          },
          {
            type: ActionTypes.RECEIVE_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 1.0 },
          },
        ]);

      expect(mockWrite.mock.calls.length).toBe(4); // message chunk + linefeed ==> 2 writes.
      expect(mockEnd.mock.calls.length).toBe(1);

      expect(mockWrite.mock.calls[0][0]).toBe('log line 1\nlog line 2');
      expect(mockWrite.mock.calls[1][0]).toBe('\n');
      expect(mockWrite.mock.calls[2][0]).toBe('log line 3');
      expect(mockWrite.mock.calls[3][0]).toBe('\n');
    }, 100);
  });

  it('downloadLogs - Start/End with CRLF', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'CRLF',
      filters: [],
    };

    let mockWrite = jest.fn();
    let mockEnd = jest.fn();
    let fileChooser = () => ({ write: mockWrite, end: mockEnd }) as any; // stream.Writable | undefined

    let job = { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 };

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse, progress: number) => void,
      callbackError: (err: AWS.AWSError) => void,
      callbackEnd: () => void,
    ) => {
      callbackData({
        events: [
          {
            timestamp: new Date(1).getTime(),
            message: 'log line 1',
          },
          {
            timestamp: new Date(2).getTime(),
            message: 'log line 2\n',
          },
        ],
      }, 0.5);
      callbackData({
        events: [
          {
            timestamp: new Date(3).getTime(),
            message: 'log line 3\r\n',
          },
        ],
      }, 0.9);
      callbackEnd();
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.downloadLogs(settings, fileChooser, job, getCloudWatchLogsEvents));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 },
          },
          {
            type: ActionTypes.PROGRESS_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0.5 },
          },
          {
            type: ActionTypes.PROGRESS_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0.9 },
          },
          {
            type: ActionTypes.RECEIVE_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 1.0 },
          },
        ]);

      expect(mockWrite.mock.calls.length).toBe(4); // message chunk + linefeed ==> 2 writes.
      expect(mockEnd.mock.calls.length).toBe(1);

      expect(mockWrite.mock.calls[0][0]).toBe('log line 1\r\nlog line 2');
      expect(mockWrite.mock.calls[1][0]).toBe('\r\n');
      expect(mockWrite.mock.calls[2][0]).toBe('log line 3');
      expect(mockWrite.mock.calls[3][0]).toBe('\r\n');
    }, 100);
  });

  it('downloadLogs - Start/End with transformer function', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'LF',
      filters: [{ type: 'EXTRACT_JSON', key: 'log' }],
    };

    let mockWrite = jest.fn();
    let mockEnd = jest.fn();
    let fileChooser = () => ({ write: mockWrite, end: mockEnd }) as any; // stream.Writable | undefined

    let job = { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 };

    let transformer = (line: string) => extractJson(line, 'log');

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse, progress: number) => void,
      callbackError: (err: AWS.AWSError) => void,
      callbackEnd: () => void,
    ) => {
      callbackData({
        events: [
          {
            timestamp: new Date(1).getTime(),
            message: '{ "log": "log line 1" }',
          },
          {
            timestamp: new Date(2).getTime(),
            message: '{ "log": "log line 2\\r\\n" }\n',
          },
        ],
      }, 0.5);
      callbackData({
        events: [
          {
            timestamp: new Date(3).getTime(),
            message: '{ "log": "log line 3\\n" }\r\n',
          },
        ],
      }, 0.9);
      callbackEnd();
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.downloadLogs(settings, fileChooser, job, getCloudWatchLogsEvents, transformer));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 },
          },
          {
            type: ActionTypes.PROGRESS_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0.5 },
          },
          {
            type: ActionTypes.PROGRESS_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0.9 },
          },
          {
            type: ActionTypes.RECEIVE_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 1.0 },
          },
        ]);

      expect(mockWrite.mock.calls.length).toBe(4); // message chunk + linefeed ==> 2 writes.
      expect(mockEnd.mock.calls.length).toBe(1);

      expect(mockWrite.mock.calls[0][0]).toBe('log line 1\nlog line 2');
      expect(mockWrite.mock.calls[1][0]).toBe('\n');
      expect(mockWrite.mock.calls[2][0]).toBe('log line 3');
      expect(mockWrite.mock.calls[3][0]).toBe('\n');
    }, 100);
  });

  it('downloadLogs - Start/Error', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'CRLF',
      filters: [],
    };

    let mockWrite = jest.fn();
    let mockEnd = jest.fn();
    let fileChooser = () => ({ write: mockWrite, end: mockEnd }) as any; // stream.Writable | undefined

    let job = { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 };

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse, progress: number) => void,
      callbackError: (err: AWS.AWSError) => void,
      callbackEnd: () => void,
    ) => {
      callbackData({
        events: [
          {
            timestamp: new Date(1).getTime(),
            message: 'log line 1',
          },
          {
            timestamp: new Date(2).getTime(),
            message: 'log line 2\n',
          },
        ],
      }, 0.5);
      callbackError({ message: 'message' } as any);
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.downloadLogs(settings, fileChooser, job, getCloudWatchLogsEvents));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0 },
          },
          {
            type: ActionTypes.PROGRESS_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0.5 },
          },
          {
            type: ActionTypes.ERROR_LOG_EVENTS,
            job: { id: 'jobid', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0.5 },
          },
        ]);

      expect(mockWrite.mock.calls.length).toBe(2); // message chunk + linefeed ==> 2 writes.
      expect(mockEnd.mock.calls.length).toBe(1);

      expect(mockWrite.mock.calls[0][0]).toBe('log line 1\r\nlog line 2');
      expect(mockWrite.mock.calls[1][0]).toBe('\r\n');
    }, 100);
  });

  it('saveSettings', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'CRLF',
      filters: [],
    };

    let mockSave = jest.fn();

    expect(index.saveSettings(
      settings,
      new Date(100),
      mockSave,
    ))
      .toEqual({
        type: ActionTypes.SAVE_SETTINGS,
        settings: settings,
        lastModified: new Date(100),
      });

    expect(mockSave.mock.calls[0][0]).toEqual(settings);
  });

  it('loadSettings', (done) => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'CRLF',
      filters: [],
    };

    let load = () => {
      return new Promise<Settings>((resolve, reject) => {
        resolve(settings);
      });
    };

    let now = () => new Date(100);

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.loadSettings(load, now));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.RECEIVE_SETTINGS,
            settings: settings,
            lastModified: new Date(100),
          },
        ]);

      done();
    }, 100);
  });

  it('saveSettings', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'CRLF',
      filters: [],
    };

    expect(index.receiveSettings(
      settings,
      new Date(100),
    ))
      .toEqual({
        type: ActionTypes.RECEIVE_SETTINGS,
        settings: settings,
        lastModified: new Date(100),
      });
  });

  it('showMessage', () => {
    expect(index.showMessage(''))
      .toEqual({
        type: ActionTypes.SHOW_MESSAGE,
        message: '',
      });

    expect(index.showMessage('message'))
      .toEqual({
        type: ActionTypes.SHOW_MESSAGE,
        message: 'message',
      });
  });

  it('hideMessage', () => {
    expect(index.hideMessage())
      .toEqual({
        type: ActionTypes.HIDE_MESSAGE,
      });
  });

});
