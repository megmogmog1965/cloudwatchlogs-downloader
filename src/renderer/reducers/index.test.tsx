import * as index from './index';
import * as enums from '../enums';
import { ActionTypes } from '../constants';
import * as types from '../types';

describe('reducers/index', () => {
  it('window - SHOW_WINDOW_CONTENT', () => {
    // initial state.
    expect(index.window(
      undefined as any,
      {
        type: ActionTypes.SHOW_WINDOW_CONTENT,
        windowContent: enums.WindowContent.Settings,
      },
    )).toEqual(
      { windowContent: enums.WindowContent.LogDownload },
    );

    // SHOW_WINDOW_CONTENT - LogDownload.
    expect(index.window(
      { windowContent: enums.WindowContent.LogDownload },
      {
        type: ActionTypes.SHOW_WINDOW_CONTENT,
        windowContent: enums.WindowContent.LogDownload,
      },
    )).toEqual(
      { windowContent: enums.WindowContent.LogDownload },
    );

    // SHOW_WINDOW_CONTENT - Settings.
    expect(index.window(
      { windowContent: enums.WindowContent.LogDownload },
      {
        type: ActionTypes.SHOW_WINDOW_CONTENT,
        windowContent: enums.WindowContent.Settings,
      },
    )).toEqual(
      { windowContent: enums.WindowContent.Settings },
    );
  });

  it('logGroups - initial state', () => {
    // initial state.
    expect(index.logGroups(
      undefined as any,
      {
        type: ActionTypes.REQUEST_LOG_GROUPS,
      },
    )).toEqual(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
    );
  });

  it('logGroups - REQUEST_LOG_GROUPS', () => {
    // REQUEST_LOG_GROUPS.
    expect(index.logGroups(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.REQUEST_LOG_GROUPS,
      },
    )).toEqual(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
    );
  });

  it('logGroups - ERROR_LOG_GROUPS', () => {
    // ERROR_LOG_GROUPS.
    expect(index.logGroups(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.ERROR_LOG_GROUPS,
        errorMessage: 'message',
      },
    )).toEqual(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: 'message',
        lastModified: new Date(0),
      },
    );
  });

  it('logGroups - RECEIVE_LOG_GROUPS', () => {
    // RECEIVE_LOG_GROUPS - empty.
    expect(index.logGroups(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_LOG_GROUPS,
        logGroups: [],
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(100),
      },
    );

    // RECEIVE_LOG_GROUPS - 2 groups.
    expect(index.logGroups(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_LOG_GROUPS,
        logGroups: [{} as any, {} as any],
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        logGroups: [{} as any, {} as any],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(100),
      },
    );
  });

  it('logGroups - SELECT_LOG_GROUP', () => {
    // SELECT_LOG_GROUP.
    expect(index.logGroups(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.SELECT_LOG_GROUP,
        selectedName: 'name',
      },
    )).toEqual(
      {
        logGroups: [],
        selectedName: 'name',
        errorMessage: undefined,
        lastModified: new Date(0),
      },
    );
  });

  it('logStreams - initial state', () => {
    // initial state.
    expect(index.logStreams(
      undefined as any,
      {
        type: ActionTypes.REQUEST_LOG_STREAMS,
      },
    )).toEqual(
      {
        logStreams: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
    );
  });

  it('logStreams - REQUEST_LOG_STREAMS', () => {
    // REQUEST_LOG_STREAMS.
    expect(index.logStreams(
      {
        logStreams: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.REQUEST_LOG_STREAMS,
      },
    )).toEqual(
      {
        logStreams: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
    );
  });

  it('logStreams - ERROR_LOG_STREAMS', () => {
    // ERROR_LOG_STREAMS.
    expect(index.logStreams(
      {
        logStreams: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.ERROR_LOG_STREAMS,
        errorMessage: 'message',
      },
    )).toEqual(
      {
        logStreams: [],
        selectedName: undefined,
        errorMessage: 'message',
        lastModified: new Date(0),
      },
    );
  });

  it('logStreams - RECEIVE_LOG_STREAMS', () => {
    // RECEIVE_LOG_STREAMS - empty.
    expect(index.logStreams(
      {
        logStreams: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_LOG_STREAMS,
        logStreams: [],
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        logStreams: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(100),
      },
    );

    // RECEIVE_LOG_STREAMS - 2 groups.
    expect(index.logStreams(
      {
        logStreams: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_LOG_STREAMS,
        logStreams: [{} as any, {} as any],
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        logStreams: [{} as any, {} as any],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(100),
      },
    );
  });

  it('logStreams - SELECT_LOG_STREAM', () => {
    // SELECT_LOG_STREAM.
    expect(index.logStreams(
      {
        logStreams: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.SELECT_LOG_STREAM,
        selectedName: 'name',
      },
    )).toEqual(
      {
        logStreams: [],
        selectedName: 'name',
        errorMessage: undefined,
        lastModified: new Date(0),
      },
    );
  });

  it('logStreams - SELECT_LOG_GROUP', () => {
    // SELECT_LOG_GROUP (log group action affects log stream state).
    expect(index.logStreams(
      {
        logStreams: [],
        selectedName: 'name',
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.SELECT_LOG_GROUP,
        selectedName: 'name',
      },
    )).toEqual(
      {
        logStreams: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
    );
  });

  it('logGroups - initial state', () => {
    // initial state.
    expect(index.logGroups(
      undefined as any,
      {
        type: ActionTypes.REQUEST_LOG_GROUPS,
      },
    )).toEqual(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
    );
  });

  it('logGroups - REQUEST_LOG_GROUPS', () => {
    // REQUEST_LOG_GROUPS.
    expect(index.logGroups(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.REQUEST_LOG_GROUPS,
      },
    )).toEqual(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
    );
  });

  it('logGroups - ERROR_LOG_GROUPS', () => {
    // ERROR_LOG_GROUPS.
    expect(index.logGroups(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.ERROR_LOG_GROUPS,
        errorMessage: 'message',
      },
    )).toEqual(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: 'message',
        lastModified: new Date(0),
      },
    );
  });

  it('logGroups - RECEIVE_LOG_GROUPS', () => {
    // RECEIVE_LOG_GROUPS - empty.
    expect(index.logGroups(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_LOG_GROUPS,
        logGroups: [],
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(100),
      },
    );

    // RECEIVE_LOG_GROUPS - 2 groups.
    expect(index.logGroups(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_LOG_GROUPS,
        logGroups: [{} as any, {} as any],
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        logGroups: [{} as any, {} as any],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(100),
      },
    );
  });

  it('logGroups - SELECT_LOG_GROUP', () => {
    // ERROR_LOG_GROUPS.
    expect(index.logGroups(
      {
        logGroups: [],
        selectedName: undefined,
        errorMessage: undefined,
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.SELECT_LOG_GROUP,
        selectedName: 'name',
      },
    )).toEqual(
      {
        logGroups: [],
        selectedName: 'name',
        errorMessage: undefined,
        lastModified: new Date(0),
      },
    );
  });

  it('logText - initial state', () => {
    // initial state.
    expect(index.logText(
      undefined as any,
      {
        type: ActionTypes.RECEIVE_LOG_TEXT,
        text: 'line 1\nline 2\n',
      },
    )).toEqual(
      {
        text: '',
      },
    );
  });

  it('logText - REQUEST_LOG_TEXT', () => {
    // REQUEST_LOG_TEXT.
    expect(index.logText(
      {
        text: 'old',
      },
      {
        type: ActionTypes.REQUEST_LOG_TEXT,
      },
    )).toEqual(
      {
        text: 'old',
      },
    );
  });

  it('logText - RECEIVE_LOG_TEXT', () => {
    // RECEIVE_LOG_TEXT - empty.
    expect(index.logText(
      {
        text: '',
      },
      {
        type: ActionTypes.RECEIVE_LOG_TEXT,
        text: '',
      },
    )).toEqual(
      {
        text: '',
      },
    );

    // RECEIVE_LOG_TEXT - 2 lines.
    expect(index.logText(
      {
        text: '',
      },
      {
        type: ActionTypes.RECEIVE_LOG_TEXT,
        text: 'line 1\nline 2\n',
      },
    )).toEqual(
      {
        text: 'line 1\nline 2\n',
      },
    );

    // RECEIVE_LOG_TEXT - overwrite old text.
    expect(index.logText(
      {
        text: 'old',
      },
      {
        type: ActionTypes.RECEIVE_LOG_TEXT,
        text: 'new',
      },
    )).toEqual(
      {
        text: 'new',
      },
    );
  });

  it('logText - ERROR_LOG_TEXT', () => {
    // ERROR_LOG_TEXT.
    expect(index.logText(
      {
        text: 'old',
      },
      {
        type: ActionTypes.ERROR_LOG_TEXT,
        errorMessage: 'error messages',
      },
    )).toEqual(
      {
        text: '', // clear.
      },
    );
  });

  it('logText - SELECT_LOG_GROUP', () => {
    // SELECT_LOG_GROUP (log group action affects log text state).
    expect(index.logText(
      {
        text: 'line 1\nline 2\n',
      },
      {
        type: ActionTypes.SELECT_LOG_GROUP,
        selectedName: 'name',
      },
    )).toEqual(
      {
        text: '',
      },
    );
  });

  it('logEvents - initial state', () => {
    // initial state.
    expect(index.logEvents(
      undefined as any,
      {
        type: ActionTypes.REQUEST_LOG_EVENTS,
        job: { id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [],
        finishedJobs: [],
        errorJobs: [],
      },
    );
  });

  it('logEvents - REQUEST_LOG_EVENTS', () => {
    // REQUEST_LOG_STREAMS.
    expect(index.logEvents(
      {
        runningJobs: [],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.REQUEST_LOG_EVENTS,
        job: { id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [{ id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0}],
        finishedJobs: [],
        errorJobs: [],
      },
    );
  });

  it('logEvents - PROGRESS_LOG_EVENTS', () => {
    // PROGRESS_LOG_EVENTS.
    expect(index.logEvents(
      {
        runningJobs: [],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.PROGRESS_LOG_EVENTS,
        job: { id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0.5},
      },
    )).toEqual(
      {
        runningJobs: [{ id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0.5}],
        finishedJobs: [],
        errorJobs: [],
      },
    );
  });

  it('logEvents - ERROR_LOG_EVENTS', () => {
    // ERROR_LOG_STREAMS - empty.
    expect(index.logEvents(
      {
        runningJobs: [],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.ERROR_LOG_EVENTS,
        job: { id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [],
        finishedJobs: [],
        errorJobs: [{ id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0}],
      },
    );

    // ERROR_LOG_STREAMS - 1 running.
    expect(index.logEvents(
      {
        runningJobs: [{ id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0}],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.ERROR_LOG_EVENTS,
        job: { id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [],
        finishedJobs: [],
        errorJobs: [{ id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0}],
      },
    );

    // ERROR_LOG_STREAMS - 2 running.
    expect(index.logEvents(
      {
        runningJobs: [
          { id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0},
          { id: 'yyyy', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0},
        ],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.ERROR_LOG_EVENTS,
        job: { id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [{ id: 'yyyy', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0}],
        finishedJobs: [],
        errorJobs: [{ id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0}],
      },
    );
  });

  it('logEvents - RECEIVE_LOG_EVENTS', () => {
    // RECEIVE_LOG_STREAMS - empty.
    expect(index.logEvents(
      {
        runningJobs: [],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.RECEIVE_LOG_EVENTS,
        job: { id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [],
        finishedJobs: [{ id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0}],
        errorJobs: [],
      },
    );

    // RECEIVE_LOG_STREAMS - 1 running.
    expect(index.logEvents(
      {
        runningJobs: [{ id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0}],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.RECEIVE_LOG_EVENTS,
        job: { id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [],
        finishedJobs: [{ id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0}],
        errorJobs: [],
      },
    );

    // RECEIVE_LOG_STREAMS - 2 running.
    expect(index.logEvents(
      {
        runningJobs: [
          { id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0},
          { id: 'yyyy', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0},
        ],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.RECEIVE_LOG_EVENTS,
        job: { id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [{ id: 'yyyy', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0}],
        finishedJobs: [{ id: 'xxxx', logGroupName: 'group', logStreamName: 'stream', startTime: 0, progress: 0}],
        errorJobs: [],
      },
    );
  });

  it('dateRange - SET_DATERANGE', () => {
    // initial state.
    // @fixme NO REFERENCIAL TRANSPARENCY.
    expect(index.dateRange(
      undefined as any,
      {
        type: ActionTypes.SET_DATERANGE,
        startDate: new Date(100),
        endDate: new Date(200),
      },
    )).toEqual(
      types.initialState.dateRange, // @fixme NO REFERENCIAL TRANSPARENCY.
    );

    // SET_DATERANGE.
    expect(index.dateRange(
      {
        startDate: new Date(0),
        endDate: new Date(0),
      },
      {
        type: ActionTypes.SET_DATERANGE,
        startDate: new Date(100),
        endDate: new Date(200),
      },
    )).toEqual(
      {
        startDate: new Date(100),
        endDate: new Date(200),
      },
    );
  });

  it('settings - SAVE_SETTINGS', () => {
    // initial state.
    expect(index.settings(
      undefined as any,
      {
        type: ActionTypes.SAVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'CRLF', filters: [] },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(0),
      },
    );

    // SAVE_SETTINGS - region.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.SAVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(100),
      },
    );

    // SAVE_SETTINGS - awsAccessKeyId.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.SAVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: 'xxxx', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: 'xxxx', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(100),
      },
    );

    // SAVE_SETTINGS - awsSecretAccessKey.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.SAVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: 'xxxx', lineBreak: 'LF', filters: [] },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: 'xxxx', lineBreak: 'LF', filters: [] },
        lastModified: new Date(100),
      },
    );

    // SAVE_SETTINGS - lineBreak.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.SAVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'CRLF', filters: [] },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'CRLF', filters: [] },
        lastModified: new Date(100),
      },
    );

    // SAVE_SETTINGS - filters.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.SAVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [ { type: 'EXTRACT_JSON', key: 'log' } ] },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [ { type: 'EXTRACT_JSON', key: 'log' } ] },
        lastModified: new Date(100),
      },
    );

    // SAVE_SETTINGS - merged partial settings.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.SAVE_SETTINGS,
        settings: { filters: [ { type: 'EXTRACT_JSON', key: 'log' } ] } as any,
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [ { type: 'EXTRACT_JSON', key: 'log' } ] },
        lastModified: new Date(100),
      },
    );
  });

  it('settings - RECEIVE_SETTINGS', () => {
    // RECEIVE_SETTINGS - region.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(100),
      },
    );

    // RECEIVE_SETTINGS - awsAccessKeyId.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: 'xxxx', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: 'xxxx', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(100),
      },
    );

    // RECEIVE_SETTINGS - awsSecretAccessKey.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: 'xxxx', lineBreak: 'LF', filters: [] },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: 'xxxx', lineBreak: 'LF', filters: [] },
        lastModified: new Date(100),
      },
    );

    // RECEIVE_SETTINGS - lineBreak.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'CRLF', filters: [] },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'CRLF', filters: [] },
        lastModified: new Date(100),
      },
    );

    // RECEIVE_SETTINGS - filters.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [ { type: 'EXTRACT_JSON', key: 'log' } ] },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [ { type: 'EXTRACT_JSON', key: 'log' } ] },
        lastModified: new Date(100),
      },
    );

    // RECEIVE_SETTINGS - merged partial settings.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [] },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_SETTINGS,
        settings: { filters: [ { type: 'EXTRACT_JSON', key: 'log' } ] } as any,
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', filters: [ { type: 'EXTRACT_JSON', key: 'log' } ] },
        lastModified: new Date(100),
      },
    );
  });

  it('asyncCalls - initial state', () => {
    // initial state.
    expect(index.asyncCalls(
      undefined as any,
      {
        type: ActionTypes.REQUEST_LOG_GROUPS,
      },
    )).toEqual(
      {
        active: 0,
      },
    );
  });

  it('asyncCalls - negative value is forbidden', () => {
    // negative value is forbidden.
    expect(index.asyncCalls(
      {
        active: 0,
      },
      {
        type: ActionTypes.RECEIVE_LOG_GROUPS,
        logGroups: [],
        lastModified: new Date(0),
      },
    )).toEqual(
      {
        active: 0,
      },
    );
  });

  it('asyncCalls - REQUEST_LOG_GROUPS', () => {
    // REQUEST_LOG_GROUPS.
    expect(index.asyncCalls(
      {
        active: 0,
      },
      {
        type: ActionTypes.REQUEST_LOG_GROUPS,
      },
    )).toEqual(
      {
        active: 1,
      },
    );
  });

  it('asyncCalls - RECEIVE_LOG_GROUPS', () => {
    // RECEIVE_LOG_GROUPS.
    expect(index.asyncCalls(
      {
        active: 1,
      },
      {
        type: ActionTypes.RECEIVE_LOG_GROUPS,
        logGroups: [],
        lastModified: new Date(0),
      },
    )).toEqual(
      {
        active: 0,
      },
    );
  });

  it('asyncCalls - ERROR_LOG_GROUPS', () => {
    // ERROR_LOG_GROUPS.
    expect(index.asyncCalls(
      {
        active: 2,
      },
      {
        type: ActionTypes.ERROR_LOG_GROUPS,
        errorMessage: '',
      },
    )).toEqual(
      {
        active: 1,
      },
    );
  });

  it('asyncCalls - REQUEST_LOG_STREAMS', () => {
    // REQUEST_LOG_STREAMS.
    expect(index.asyncCalls(
      {
        active: 1,
      },
      {
        type: ActionTypes.REQUEST_LOG_STREAMS,
      },
    )).toEqual(
      {
        active: 2,
      },
    );
  });

  it('asyncCalls - RECEIVE_LOG_STREAMS', () => {
    // RECEIVE_LOG_STREAMS.
    expect(index.asyncCalls(
      {
        active: 2,
      },
      {
        type: ActionTypes.RECEIVE_LOG_STREAMS,
        logStreams: [],
        lastModified: new Date(0),
      },
    )).toEqual(
      {
        active: 1,
      },
    );
  });

  it('asyncCalls - ERROR_LOG_STREAMS', () => {
    // ERROR_LOG_STREAMS.
    expect(index.asyncCalls(
      {
        active: 2,
      },
      {
        type: ActionTypes.ERROR_LOG_STREAMS,
        errorMessage: '',
      },
    )).toEqual(
      {
        active: 1,
      },
    );
  });

  it('asyncCalls - REQUEST_LOG_TEXT', () => {
    // REQUEST_LOG_TEXT.
    expect(index.asyncCalls(
      {
        active: 1,
      },
      {
        type: ActionTypes.REQUEST_LOG_TEXT,
      },
    )).toEqual(
      {
        active: 2,
      },
    );
  });

  it('asyncCalls - RECEIVE_LOG_TEXT', () => {
    // RECEIVE_LOG_TEXT.
    expect(index.asyncCalls(
      {
        active: 2,
      },
      {
        type: ActionTypes.RECEIVE_LOG_TEXT,
        text: '',
      },
    )).toEqual(
      {
        active: 1,
      },
    );
  });

  it('asyncCalls - ERROR_LOG_TEXT', () => {
    // ERROR_LOG_TEXT.
    expect(index.asyncCalls(
      {
        active: 2,
      },
      {
        type: ActionTypes.ERROR_LOG_TEXT,
        errorMessage: '',
      },
    )).toEqual(
      {
        active: 1,
      },
    );
  });

  it('message - SHOW_MESSAGE', () => {
    // SHOW_MESSAGE.
    expect(index.message(
      {
        message: 'previous message',
        subMessage: 'previous sub message',
        visible: false,
      },
      {
        type: ActionTypes.SHOW_MESSAGE,
        message: 'message',
      },
    )).toEqual(
      {
        message: 'message',
        subMessage: undefined,
        visible: true,
      },
    );

    // SHOW_MESSAGE - overwrite.
    expect(index.message(
      {
        message: 'previous message',
        subMessage: 'previous sub message',
        visible: true,
      },
      {
        type: ActionTypes.SHOW_MESSAGE,
        message: 'message',
      },
    )).toEqual(
      {
        message: 'message',
        subMessage: undefined,
        visible: true,
      },
    );
  });

  it('message - ERROR_LOG_GROUPS', () => {
    // ERROR_LOG_GROUPS.
    expect(index.message(
      {
        message: 'previous message',
        subMessage: 'previous sub message',
        visible: false,
      },
      {
        type: ActionTypes.ERROR_LOG_GROUPS,
        errorMessage: 'message',
      },
    )).toEqual(
      {
        message: 'Error',
        subMessage: 'message',
        visible: true,
      },
    );
  });

  it('message - ERROR_LOG_STREAMS', () => {
    // ERROR_LOG_STREAMS.
    expect(index.message(
      {
        message: 'previous message',
        subMessage: 'previous sub message',
        visible: false,
      },
      {
        type: ActionTypes.ERROR_LOG_STREAMS,
        errorMessage: 'message',
      },
    )).toEqual(
      {
        message: 'Error',
        subMessage: 'message',
        visible: true,
      },
    );
  });

  it('message - ERROR_LOG_TEXT', () => {
    // ERROR_LOG_TEXT.
    expect(index.message(
      {
        message: 'previous message',
        subMessage: 'previous sub message',
        visible: false,
      },
      {
        type: ActionTypes.ERROR_LOG_TEXT,
        errorMessage: 'message',
      },
    )).toEqual(
      {
        message: 'Error',
        subMessage: 'message',
        visible: true,
      },
    );
  });

  it('message - HIDE_MESSAGE', () => {
    // HIDE_MESSAGE.
    expect(index.message(
      {
        message: 'previous message',
        subMessage: 'previous sub message',
        visible: true,
      },
      {
        type: ActionTypes.HIDE_MESSAGE,
      },
    )).toEqual(
      {
        message: '',
        subMessage: undefined,
        visible: false,
      },
    );

  });
});
