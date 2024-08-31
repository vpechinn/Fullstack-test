import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import APP_HOST from '@/redux/slices/appHost';

interface UserState {
  token: string | null;
  userId: string | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

interface SignInOrUpReq {
  name: string;
  password: string;
}

const initialState: UserState = {
  token: typeof window !== "undefined" ? localStorage.getItem('auth:token') : null,
  userId: null,
  status: 'idle',
  error: null,
};

export const signIn = createAsyncThunk(
  'user/signIn',
  async ({ name, password }: SignInOrUpReq, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://${APP_HOST}/auth/sign-in`, { name, password });
      return response.data; // Expect { token }
    } catch (err) {
      return rejectWithValue('Failed to sign in');
    }
  }
);


export const signUp = createAsyncThunk(
  'user/signUp',
  async ({ name, password }: SignInOrUpReq, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://${APP_HOST}/auth/sign-up`, { name, password });
      return response.data; // Expect { token }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        return rejectWithValue('Username already exists');
      }
      return rejectWithValue('Failed to sign up');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ name, password }: SignInOrUpReq, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const { token } = state.user;

    if (!token) {
      return rejectWithValue('No token provided');
    }

    try {
      await axios.put(`http://${APP_HOST}/auth/me`, { name, password }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      return rejectWithValue('Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const { token } = state.user;

    if (!token) {
      return rejectWithValue('No token provided');
    }

    try {
      await axios.delete(`http://${APP_HOST}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      return rejectWithValue('Failed to delete user');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        let lsToken = localStorage.getItem('auth:token');
        if(lsToken)
        {
          state.status='idle'
          state.token=lsToken
        }
        else
          state.status = 'loading';
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
        state.token = action.payload.token;
        state.status = 'idle';
        localStorage.setItem("auth:token",action.payload.token)

      })
      .addCase(signIn.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(signUp.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
        state.token = action.payload.token;
        state.status = 'idle';
      })
      .addCase(signUp.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(updateUser.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.token = null;
        state.userId = null;
        state.status = 'idle';
      })
      .addCase(deleteUser.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;