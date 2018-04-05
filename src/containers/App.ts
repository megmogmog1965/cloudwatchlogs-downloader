// src/containers/App.ts

import * as enums from '../enums';
import App from '../components/App';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({ window }: StoreState) {
  return {
    windowContent: window.windowContent,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.WindowAction>) {
  return {
    ShowWindowContent: (windowContent: enums.WindowContent) => dispatch(actions.showWindowContent(windowContent)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
