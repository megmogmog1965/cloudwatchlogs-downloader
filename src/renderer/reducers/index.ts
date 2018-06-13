// src/reducers/index.tsx

import { combineReducers, Reducer } from 'redux';
import { LogGroupAction, LogStreamAction, LogTextAction, LogEventAction, WindowAction, DateRangeAction, SettingsAction } from '../actions';
import { LogGroupsState, LogStreamsState, LogTextState, LogEventsState, WindowState, DateRangeState, SettingsState, AsyncCallState, initialState } from '../types';
import { ActionTypes } from '../constants';
import { DownloadJob } from '../common-interfaces';
import { reducer as formReducer } from 'redux-form';

export function window(state: WindowState, action: WindowAction): WindowState {
  if (!state) {
    return { ...initialState.window };
  }

  switch (action.type) {
    case ActionTypes.SHOW_WINDOW_CONTENT:
      return { ...state, windowContent: action.windowContent };
    default:
      return state;
  }
}

export function logGroups(state: LogGroupsState, action: LogGroupAction): LogGroupsState {
  if (!state) {
    return { ...initialState.logGroups };
  }

  switch (action.type) {
    case ActionTypes.REQUEST_LOG_GROUPS:
      return { ...state };
    case ActionTypes.RECEIVE_LOG_GROUPS:
      return { ...state, logGroups: action.logGroups, lastModified: action.lastModified, errorMessage: undefined };
    case ActionTypes.ERROR_LOG_GROUPS:
      return { ...state, errorMessage: action.errorMessage };
    case ActionTypes.SELECT_LOG_GROUP:
      return { ...state, selectedName: action.selectedName };
    default:
      return state;
  }
}

export function logStreams(state: LogStreamsState, action: LogStreamAction | LogGroupAction): LogStreamsState {
  if (!state) {
    return { ...initialState.logStreams };
  }

  switch (action.type) {
    case ActionTypes.REQUEST_LOG_STREAMS:
      return { ...state };
    case ActionTypes.RECEIVE_LOG_STREAMS:
      return { ...state, logStreams: action.logStreams, lastModified: action.lastModified, errorMessage: undefined };
    case ActionTypes.ERROR_LOG_STREAMS:
      return { ...state, errorMessage: action.errorMessage };
    case ActionTypes.SELECT_LOG_STREAM:
      return { ...state, selectedName: action.selectedName };
    // SHOULD respond to LogGroupAction.
    case ActionTypes.SELECT_LOG_GROUP:
      return { ...state, selectedName: undefined }; // clear log stream state when log group is updated.
    default:
      return state;
  }
}

export function logText(state: LogTextState, action: LogTextAction): LogTextState {
  if (!state) {
    return { ...initialState.logText };
  }

  switch (action.type) {
    case ActionTypes.REQUEST_LOG_TEXT:
      return { ...state };
    case ActionTypes.RECEIVE_LOG_TEXT:
      return { ...state, text: action.text };
    case ActionTypes.ERROR_LOG_TEXT:
      return { ...state, text: '' }; // clear on error.
    default:
      return state;
  }
}

export function logEvents(state: LogEventsState, action: LogEventAction): LogEventsState {
  if (!state) {
    return { ...initialState.logEvents };
  }

  let filteredRunningJobs = (job: DownloadJob) => state.runningJobs.filter(j => j.id !== job.id);

  switch (action.type) {
    case ActionTypes.REQUEST_LOG_EVENTS:
      return { ...state, runningJobs: state.runningJobs.concat(action.job) };
    case ActionTypes.PROGRESS_LOG_EVENTS:
      return { ...state, runningJobs: filteredRunningJobs(action.job).concat(action.job) };
    case ActionTypes.RECEIVE_LOG_EVENTS:
      return { ...state, runningJobs: filteredRunningJobs(action.job), finishedJobs: state.finishedJobs.concat(action.job) };
    case ActionTypes.ERROR_LOG_EVENTS:
      return { ...state, runningJobs: filteredRunningJobs(action.job), errorJobs: state.errorJobs.concat(action.job) };
    default:
      return state;
  }
}

export function dateRange(state: DateRangeState, action: DateRangeAction): DateRangeState {
  if (!state) {
    return { ...initialState.dateRange };
  }

  switch (action.type) {
    case ActionTypes.SET_DATERANGE:
      return { ...state, startDate: action.startDate, endDate: action.endDate };
    default:
      return state;
  }
}

export function settings(state: SettingsState, action: SettingsAction): SettingsState {
  if (!state) {
    return { ...initialState.settings };
  }

  switch (action.type) {
    case ActionTypes.SAVE_SETTINGS:
      return { ...state, settings: action.settings, lastModified: action.lastModified };
    case ActionTypes.RECEIVE_SETTINGS:
      return { ...state, settings: action.settings, lastModified: action.lastModified };
    default:
      return state;
  }
}

export function asyncCalls(state: AsyncCallState, action: LogGroupAction | LogStreamAction | LogTextAction): AsyncCallState {
  if (!state) {
    return { ...initialState.asyncCalls };
  }

  switch (action.type) {
    case ActionTypes.REQUEST_LOG_GROUPS:
    case ActionTypes.REQUEST_LOG_STREAMS:
    case ActionTypes.REQUEST_LOG_TEXT:
      return { ...state, active: state.active + 1 }; // increment count.
    case ActionTypes.RECEIVE_LOG_GROUPS:
    case ActionTypes.RECEIVE_LOG_STREAMS:
    case ActionTypes.RECEIVE_LOG_TEXT:
    case ActionTypes.ERROR_LOG_GROUPS:
    case ActionTypes.ERROR_LOG_STREAMS:
    case ActionTypes.ERROR_LOG_TEXT:
      return { ...state, active: (state.active > 0) ? state.active - 1 : 0 }; // decrement count.
    default:
      return state;
  }
}

const reducers: Reducer<any> = combineReducers({
  window,
  logGroups,
  logStreams,
  logText,
  logEvents,
  dateRange,
  settings,
  asyncCalls,
  form: formReducer,
});

export default reducers;
