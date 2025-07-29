import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss';
import App from './App.tsx'
import { Persistor, persistStore } from 'redux-persist';
import { store } from './store/store.ts';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const persistor: Persistor = persistStore(store);

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  // </StrictMode>,
)
