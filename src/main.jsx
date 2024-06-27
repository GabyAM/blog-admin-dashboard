import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Router } from './Router.jsx';
import { AuthProvider } from './context/auth.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchProvider } from './context/search.jsx';

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <SearchProvider>
                <React.StrictMode>
                    <Router></Router>
                </React.StrictMode>
            </SearchProvider>
        </AuthProvider>
    </QueryClientProvider>
);
