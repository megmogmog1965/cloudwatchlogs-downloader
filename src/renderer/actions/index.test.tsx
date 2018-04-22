import * as index from './index';
import * as enums from '../enums';
import { ActionTypes } from '../constants';
import { LogGroup, LogStream } from '../common-interfaces/Aws';
import { Settings } from '../common-interfaces/Settings';
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
    store.dispatch(index.fetchLogGroups(settings, getCloudWatchLogGroups));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_GROUPS,
          },
          {
            type: ActionTypes.RECEIVE_LOG_GROUPS,
            logGroups: ['a' as any, 'b' as any],
            lastModified: new Date(1),
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
    store.dispatch(index.fetchLogStreams(settings, 'loggroup', getCloudWatchLogStreams));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_STREAMS,
          },
          {
            type: ActionTypes.RECEIVE_LOG_STREAMS,
            logStreams: ['a' as any, 'b' as any],
            lastModified: new Date(1),
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

  it('receiveLogText', () => {
    expect(index.receiveLogText('line 1\nline 2\n'))
      .toEqual({
        type: ActionTypes.RECEIVE_LOG_TEXT,
        text: 'line 1\nline 2\n',
      });
  });

  it('fetchLogText - Start/End without line break', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'NO_MODIFICATION',
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
            type: ActionTypes.RECEIVE_LOG_TEXT,
            text: 'log line 1\r\nlog line 2\r\n',
          },
        ]);
    }, 100);
  });

  it('requestLogEvents', () => {
    expect(index.requestLogEvents('xxxx'))
      .toEqual({
        type: ActionTypes.REQUEST_LOG_EVENTS,
        id: 'xxxx',
      });
  });

  it('receiveLogEvents', () => {
    expect(index.receiveLogEvents('xxxx'))
      .toEqual({
        type: ActionTypes.RECEIVE_LOG_EVENTS,
        id: 'xxxx',
      });
  });

  it('errorLogEvents', () => {
    expect(index.errorLogEvents('xxxx'))
      .toEqual({
        type: ActionTypes.ERROR_LOG_EVENTS,
        id: 'xxxx',
      });
  });

  it('downloadLogs - cancel selected', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'CRLF',
    };

    let fileChooser = () => undefined; // stream.Writable | undefined

    let createJobId = () => 'jobid';

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
      callbackError: (err: AWS.AWSError) => void,
      callbackEnd: () => void,
    ) => 0;

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.downloadLogs(settings, fileChooser, createJobId, getCloudWatchLogsEvents));

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
    };

    let mockWrite = jest.fn();
    let mockEnd = jest.fn();
    let fileChooser = () => ({ write: mockWrite, end: mockEnd }) as any; // stream.Writable | undefined

    let createJobId = () => 'jobid';

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
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
      });
      callbackData({
        events: [
          {
            timestamp: new Date(3).getTime(),
            message: 'log line 3\r\n',
          },
        ],
      });
      callbackEnd();
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.downloadLogs(settings, fileChooser, createJobId, getCloudWatchLogsEvents));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_EVENTS,
            id: 'jobid',
          },
          {
            type: ActionTypes.RECEIVE_LOG_EVENTS,
            id: 'jobid',
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
    };

    let mockWrite = jest.fn();
    let mockEnd = jest.fn();
    let fileChooser = () => ({ write: mockWrite, end: mockEnd }) as any; // stream.Writable | undefined

    let createJobId = () => 'jobid';

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
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
      });
      callbackData({
        events: [
          {
            timestamp: new Date(3).getTime(),
            message: 'log line 3\r\n',
          },
        ],
      });
      callbackEnd();
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.downloadLogs(settings, fileChooser, createJobId, getCloudWatchLogsEvents));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_EVENTS,
            id: 'jobid',
          },
          {
            type: ActionTypes.RECEIVE_LOG_EVENTS,
            id: 'jobid',
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
    };

    let mockWrite = jest.fn();
    let mockEnd = jest.fn();
    let fileChooser = () => ({ write: mockWrite, end: mockEnd }) as any; // stream.Writable | undefined

    let createJobId = () => 'jobid';

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
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
      });
      callbackData({
        events: [
          {
            timestamp: new Date(3).getTime(),
            message: 'log line 3\r\n',
          },
        ],
      });
      callbackEnd();
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.downloadLogs(settings, fileChooser, createJobId, getCloudWatchLogsEvents));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_EVENTS,
            id: 'jobid',
          },
          {
            type: ActionTypes.RECEIVE_LOG_EVENTS,
            id: 'jobid',
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

  it('downloadLogs - Start/Error', () => {
    let settings: Settings = {
      region: 'ap-northeast-1',
      awsAccessKeyId: 'xxxx',
      awsSecretAccessKey: 'yyyy',
      lineBreak: 'CRLF',
    };

    let mockWrite = jest.fn();
    let mockEnd = jest.fn();
    let fileChooser = () => ({ write: mockWrite, end: mockEnd }) as any; // stream.Writable | undefined

    let createJobId = () => 'jobid';

    let getCloudWatchLogsEvents = (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
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
      });
      callbackError({ message: 'message' } as any);
    };

    let store = mockStore({});

    // dispatch.
    store.dispatch(index.downloadLogs(settings, fileChooser, createJobId, getCloudWatchLogsEvents));

    setTimeout(() => {
      expect(store.getActions())
        .toEqual([
          {
            type: ActionTypes.REQUEST_LOG_EVENTS,
            id: 'jobid',
          },
          {
            type: ActionTypes.ERROR_LOG_EVENTS,
            id: 'jobid',
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
});
