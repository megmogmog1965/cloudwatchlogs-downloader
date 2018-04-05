import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers/index';
import { StoreState } from './types/index';

const store = createStore<StoreState>(reducers, applyMiddleware(thunk));

export default store;
