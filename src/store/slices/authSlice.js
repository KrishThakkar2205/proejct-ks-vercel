import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// --- Async Thunks ---

// Step 1: Initiate signup (sends OTP)
export const signupInitiate = createAsyncThunk(
    'auth/signupInitiate',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/signup-initiate', {
                email_id: payload.email,
                phone_number: payload.phone,
                name: payload.name,
                password: payload.password,
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.detail?.[0]?.msg ||
                error.response?.data?.detail ||
                error.response?.data?.message ||
                'Failed to initiate signup. Please try again.';
            return rejectWithValue(message);
        }
    }
);

// Step 2: Verify OTP
export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/verify-otp', {
                email_id: payload.email,
                otp: parseInt(payload.otp, 10),
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.detail?.[0]?.msg ||
                error.response?.data?.detail ||
                error.response?.data?.message ||
                'OTP verification failed. Please try again.';
            return rejectWithValue(message);
        }
    }
);

// Step 3: Complete signup with additional details
export const signupFinal = createAsyncThunk(
    'auth/signupFinal',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/signup-final', {
                email_id: payload.email,
                min_price: parseInt(payload.priceMin, 10),
                max_price: parseInt(payload.priceMax, 10),
                categories: payload.categories,
                location: payload.location,
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.detail?.[0]?.msg ||
                error.response?.data?.detail ||
                error.response?.data?.message ||
                'Failed to complete signup. Please try again.';
            return rejectWithValue(message);
        }
    }
);

// Login
export const login = createAsyncThunk(
    'auth/login',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', {
                email_id: payload.email,
                password: payload.password,
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.detail?.[0]?.msg ||
                error.response?.data?.detail ||
                error.response?.data?.message ||
                'Invalid email or password.';
            return rejectWithValue(message);
        }
    }
);

// --- Slice ---

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
    },
    extraReducers: (builder) => {
        // Signup Initiate
        builder
            .addCase(signupInitiate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupInitiate.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(signupInitiate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Verify OTP
        builder
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Signup Final
        builder
            .addCase(signupFinal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupFinal.fulfilled, (state, action) => {
                state.loading = false;
                const { access_token, id } = action.payload || {};
                if (access_token) {
                    state.token = access_token;
                    state.isAuthenticated = true;
                    localStorage.setItem('token', access_token);
                }
                const user = { ...(action.payload?.user || {}), ...(id ? { id } : {}) };
                state.user = user;
                localStorage.setItem('user', JSON.stringify(user));
            })
            .addCase(signupFinal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Login
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                const { access_token, id } = action.payload || {};
                if (access_token) {
                    state.token = access_token;
                    state.isAuthenticated = true;
                    localStorage.setItem('token', access_token);
                }
                const user = { ...(action.payload?.user || {}), ...(id ? { id } : {}) };
                state.user = user;
                localStorage.setItem('user', JSON.stringify(user));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
