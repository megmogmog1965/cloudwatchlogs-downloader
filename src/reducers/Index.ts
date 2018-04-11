// src/reducers/index.tsx

import { combineReducers, Reducer } from 'redux';
import { LogGroupAction, LogStreamAction, LogEventAction, WindowAction, DateRangeAction, SettingsAction } from '../actions';
import { LogGroupsState, LogStreamsState, LogEventsState, WindowState, DateRangeState, SettingsState, initialState } from '../types';
import { ActionTypes } from '../constants';
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

export function logStreams(state: LogStreamsState, action: LogStreamAction): LogStreamsState {
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
    default:
      return state;
  }
}

export function logEvents(state: LogEventsState, action: LogEventAction): LogEventsState {
  if (!state) {
    return { ...initialState.logEvents };
  }

  let filteredRunningIds = (id: string) => state.runningIds.filter(i => i !== id);

  switch (action.type) {
    case ActionTypes.REQUEST_LOG_EVENTS:
      return { ...state, runningIds: state.runningIds.concat(action.id) };
    case ActionTypes.RECEIVE_LOG_EVENTS:
      return { ...state, runningIds: filteredRunningIds(action.id), finishedIds: state.finishedIds.concat(action.id) };
    case ActionTypes.ERROR_LOG_EVENTS:
      return { ...state, runningIds: filteredRunningIds(action.id), errorIds: state.errorIds.concat(action.id) };
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

const reducers: Reducer<any> = combineReducers({
  window,
  logGroups,
  logStreams,
  logEvents,
  dateRange,
  settings,
  form: formReducer,
});

export default reducers;
