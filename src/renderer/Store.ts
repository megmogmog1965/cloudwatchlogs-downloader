import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { StoreState } from './types';

const store = createStore<StoreState>(reducers, applyMiddleware(thunk));

export default store;
