import { configureStore } from '@reduxjs/toolkit';
import promiseMiddleware from 'redux-promise-middleware';
import rootReducer from './model/root-reducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(promiseMiddleware),
});

export default store;
