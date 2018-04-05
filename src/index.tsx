import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './Store';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { loadSettings } from './actions';
import { load } from './side-effect-functions';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

// call async functions for initialization.
store.dispatch(loadSettings(load));
