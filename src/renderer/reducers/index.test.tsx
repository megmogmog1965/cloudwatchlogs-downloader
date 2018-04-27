import * as index from './index';
import * as enums from '../enums';
import { ActionTypes } from '../constants';
import * as types from '../types';

describe('reducers/index', () => {
  it('window', () => {
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

  it('logGroups', () => {
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

  it('logStreams', () => {
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

  it('logGroups', () => {
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

  it('logText', () => {
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

    // RECEIVE_LOG_STREAMS - empty.
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

    // RECEIVE_LOG_STREAMS - 2 lines.
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
  });

  it('logEvents', () => {
    // initial state.
    expect(index.logEvents(
      undefined as any,
      {
        type: ActionTypes.REQUEST_LOG_EVENTS,
        job: { id: 'xxxx', progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [],
        finishedJobs: [],
        errorJobs: [],
      },
    );

    // REQUEST_LOG_STREAMS.
    expect(index.logEvents(
      {
        runningJobs: [],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.REQUEST_LOG_EVENTS,
        job: { id: 'xxxx', progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [{ id: 'xxxx', progress: 0}],
        finishedJobs: [],
        errorJobs: [],
      },
    );

    // PROGRESS_LOG_EVENTS.
    expect(index.logEvents(
      {
        runningJobs: [],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.PROGRESS_LOG_EVENTS,
        job: { id: 'xxxx', progress: 0.5},
      },
    )).toEqual(
      {
        runningJobs: [{ id: 'xxxx', progress: 0.5}],
        finishedJobs: [],
        errorJobs: [],
      },
    );

    // ERROR_LOG_STREAMS - empty.
    expect(index.logEvents(
      {
        runningJobs: [],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.ERROR_LOG_EVENTS,
        job: { id: 'xxxx', progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [],
        finishedJobs: [],
        errorJobs: [{ id: 'xxxx', progress: 0}],
      },
    );

    // ERROR_LOG_STREAMS - 1 running.
    expect(index.logEvents(
      {
        runningJobs: [{ id: 'xxxx', progress: 0}],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.ERROR_LOG_EVENTS,
        job: { id: 'xxxx', progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [],
        finishedJobs: [],
        errorJobs: [{ id: 'xxxx', progress: 0}],
      },
    );

    // ERROR_LOG_STREAMS - 2 running.
    expect(index.logEvents(
      {
        runningJobs: [{ id: 'xxxx', progress: 0}, { id: 'yyyy', progress: 0}],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.ERROR_LOG_EVENTS,
        job: { id: 'xxxx', progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [{ id: 'yyyy', progress: 0}],
        finishedJobs: [],
        errorJobs: [{ id: 'xxxx', progress: 0}],
      },
    );

    // RECEIVE_LOG_STREAMS - empty.
    expect(index.logEvents(
      {
        runningJobs: [],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.RECEIVE_LOG_EVENTS,
        job: { id: 'xxxx', progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [],
        finishedJobs: [{ id: 'xxxx', progress: 0}],
        errorJobs: [],
      },
    );

    // RECEIVE_LOG_STREAMS - 1 running.
    expect(index.logEvents(
      {
        runningJobs: [{ id: 'xxxx', progress: 0}],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.RECEIVE_LOG_EVENTS,
        job: { id: 'xxxx', progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [],
        finishedJobs: [{ id: 'xxxx', progress: 0}],
        errorJobs: [],
      },
    );

    // RECEIVE_LOG_STREAMS - 2 running.
    expect(index.logEvents(
      {
        runningJobs: [{ id: 'xxxx', progress: 0}, { id: 'yyyy', progress: 0}],
        finishedJobs: [],
        errorJobs: [],
      },
      {
        type: ActionTypes.RECEIVE_LOG_EVENTS,
        job: { id: 'xxxx', progress: 0},
      },
    )).toEqual(
      {
        runningJobs: [{ id: 'yyyy', progress: 0}],
        finishedJobs: [{ id: 'xxxx', progress: 0}],
        errorJobs: [],
      },
    );
  });

  it('dateRange', () => {
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

  it('settings', () => {
    // initial state.
    expect(index.settings(
      undefined as any,
      {
        type: ActionTypes.SAVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'CRLF', jsonKey: '' },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(0),
      },
    );

    // SAVE_SETTINGS - region.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.SAVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(100),
      },
    );

    // SAVE_SETTINGS - awsAccessKeyId.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.SAVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: 'xxxx', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: 'xxxx', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(100),
      },
    );

    // SAVE_SETTINGS - awsSecretAccessKey.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.SAVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: 'xxxx', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: 'xxxx', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(100),
      },
    );

    // SAVE_SETTINGS - lineBreak.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.SAVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'CRLF', jsonKey: '' },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'CRLF', jsonKey: '' },
        lastModified: new Date(100),
      },
    );

    // RECEIVE_SETTINGS - region.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(100),
      },
    );

    // RECEIVE_SETTINGS - awsAccessKeyId.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: 'xxxx', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: 'xxxx', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(100),
      },
    );

    // RECEIVE_SETTINGS - awsSecretAccessKey.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: 'xxxx', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: 'xxxx', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(100),
      },
    );

    // RECEIVE_SETTINGS - lineBreak.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'CRLF', jsonKey: '' },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'CRLF', jsonKey: '' },
        lastModified: new Date(100),
      },
    );

    // RECEIVE_SETTINGS - jsonKey.
    expect(index.settings(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: '' },
        lastModified: new Date(0),
      },
      {
        type: ActionTypes.RECEIVE_SETTINGS,
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: 'key' },
        lastModified: new Date(100),
      },
    )).toEqual(
      {
        settings: { region: 'ap-northeast-1', awsAccessKeyId: '', awsSecretAccessKey: '', lineBreak: 'LF', jsonKey: 'key' },
        lastModified: new Date(100),
      },
    );
  });
});
