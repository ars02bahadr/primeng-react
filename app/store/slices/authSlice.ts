import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import HttpService from '../../shared/HttpService';

export interface UserModel {
    id: string;
    name: string;
    email: string;
    userName: string;
}

export interface AuthState {
    user: UserModel | null;
    token: string | null;
    isAuthenticated: boolean;
    error: SerializableError | null;
}

interface LoginResponse {
    data: {
        token: string;
    };
}

export interface LoginCredentials {
    emailOrUserName: string;
    password: string;
}

export interface SerializableError {
    message: string;
    status?: number;
    errorMessages?: string[];
}

// Initial state without localStorage
const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    error: null
};

// Helper function to safely use localStorage
const getStorageItem = (key: string): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
    }
    return null;
};

const setStorageItem = (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
    }
};

const removeStorageItem = (key: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
    }
};

export const login = createAsyncThunk<
    { token: string; user: UserModel },
    LoginCredentials,
    { rejectValue: SerializableError }
>('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await HttpService.post<LoginResponse>('Auth/Login', credentials);
        const token = response.data.data.token;

        if (!token) {
            return rejectWithValue({
                message: 'Token alınamadı',
                errorMessages: ['Token alınamadı']
            });
        }

        setStorageItem('token', token);
        const decoded: any = jwtDecode(token);

        const user: UserModel = {
            id: decoded['Id'],
            name: decoded['Name'],
            email: decoded['Email'],
            userName: decoded['UserName']
        };

        return { token, user };
    } catch (error: any) {
        return rejectWithValue({
            message: error.response?.data?.message || error.message || 'Bir hata oluştu',
            status: error.response?.status,
            errorMessages: error.response?.data?.ErrorMessages || [error.message || 'Bir hata oluştu']
        });
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    removeStorageItem('token');
    return true;
});

// Initialize auth state from storage
export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
    const token = getStorageItem('token');
    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            const user: UserModel = {
                id: decoded['Id'],
                name: decoded['Name'],
                email: decoded['Email'],
                userName: decoded['UserName']
            };
            return { token, user };
        } catch {
            removeStorageItem('token');
        }
    }
    return null;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || { message: 'Giriş başarısız' };
                removeStorageItem('token');
            })
            .addCase(logout.fulfilled, (state) => {
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                if (action.payload) {
                    state.token = action.payload.token;
                    state.user = action.payload.user;
                    state.isAuthenticated = true;
                }
            });
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
