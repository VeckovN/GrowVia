
import storage from 'redux-persist/lib/storage'
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Reducer } from 'redux';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistReducer } from 'redux-persist';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api';

const persistConfig = {
    key: 'root',
    storage: storage,
    //This props we aren't going to persist in the storage -> //clientApi props from redux-toolkit
    blacklist: ['clientApi', '_persist'] //won't store any data with 'clientAPI' key -> defined in api.ts as createApi

}

//we'll have multiple reducers -> 'authReducer', 'customerReducer', etc, ->reducers from features/service files
export const combineReducer = combineReducers({
    [api.reducerPath]: api.reducer,
});

export const rootReducers: Reducer = (state, action) => {
    if (action.type === 'logout') {
        state = {} as RootState;
    }
    return combineReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
    devTools: true,
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    }).concat(api.middleware)
});
setupListeners(store.dispatch);

//whatever the return type of store.getState() will be return
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;