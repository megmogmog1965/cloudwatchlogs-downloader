// src/reducers/index.tsx

import { combineReducers, Reducer } from 'redux';
import { LogGroupAction, WindowAction, SettingsAction } from '../actions';
import { LogGroupsState, WindowState, SettingsState, initialState } from '../types';
import { ActionTypes } from '../constants';
import { reducer as formReducer } from 'redux-form';

export function window(state: WindowState, action: WindowAction): WindowState {
  if (!state) {
    return initialState.window;
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
    return initialState.logGroups;
  }

  switch (action.type) {
    case ActionTypes.REQUEST_LOG_GROUPS:
      return { ...state };
    case ActionTypes.RECEIVE_LOG_GROUPS:
      return { ...state, logGroups: action.logGroups };
    case ActionTypes.SELECT_LOG_GROUP:
      return { ...state, selectedArn: action.selectedArn };
    default:
      return state;
  }
}

export function settings(state: SettingsState, action: SettingsAction): SettingsState {
  if (!state) {
    return initialState.settings;
  }

  switch (action.type) {
    case ActionTypes.SAVE_SETTINGS:
      return { ...state, settings: action.settings };
    case ActionTypes.RECEIVE_SETTINGS:
      return { ...state, settings: action.settings };
    default:
      return state;
  }
}

const reducers: Reducer<any> = combineReducers({
  window,
  logGroups,
  settings,
  form: formReducer,
});

export default reducers;
