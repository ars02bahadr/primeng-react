'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { useEffect } from 'react';
import { initializeAuth } from './store/slices/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        store.dispatch(initializeAuth());
    }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
