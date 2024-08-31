import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import APP_HOST from '@/redux/slices/appHost';

interface Deed {
  deedid: string;
  title: string;
  description: string;
  userId: string;
}
interface FriendDeed {
  deedId: string;
  title: string;
  description: string;
  userId: string;
}

interface DeedsState {
  deeds: Deed[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  friendDeeds: Deed[];
}

const initialState: DeedsState = {
  deeds: [],
  status: 'idle',
  error: null,
  friendDeeds: []
};

export const createDeed = createAsyncThunk(
  'deeds/createDeed',
  async ({ title, description }: { title: string; description: string }, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const { token } = state.user;

    if (!token) {
      return rejectWithValue('No token provided');
    }

    try {
      const response = await axios.post(`http://${APP_HOST}/deeds`, { title, description }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to create deed');
    }
  }
);

export const fetchDeeds = createAsyncThunk(
  'deeds/fetchDeeds',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const { token } = state.user;

    if (!token) {
      return rejectWithValue('No token provided');
    }

    try {
      const response = await axios.get(`http://${APP_HOST}/deeds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch deeds');
    }
  }
);

export const updateDeed = createAsyncThunk(
  'deeds/updateDeed',
  async ({ deedid, title, description }: { deedid: string; title: string; description: string }, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const { token } = state.user;

    if (!token) {
      return rejectWithValue('No token provided');
    }

    try {
      const response = await axios.put(`http://${APP_HOST}/deeds/${deedid}`, { title, description }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to update deed');
    }
  }
);

export const deleteDeed = createAsyncThunk(
  'deeds/deleteDeed',
  async (deedid: string, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const { token } = state.user;

    if (!token) {
      return rejectWithValue('No token provided');
    }

    try {
      await axios.delete(`http://${APP_HOST}/deeds/${deedid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return deedid;
    } catch (err) {
      return rejectWithValue('Failed to delete deed');
    }
  }
);

export const fetchFriendDeeds = createAsyncThunk(
  'deeds/fetchFriendDeeds',
  async ({ userId, friendIdDeed }: { userId: string, friendIdDeed: string }, { getState,rejectWithValue }) => {
    const state = getState() as any;
    const { token } = state.user;
    try {

      const response = await axios.get(`http://${APP_HOST}/deeds/${friendIdDeed}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      return response.data;
    } catch (err) {
      return rejectWithValue("failed to add friend");
    }
  }
);

export const addFriend = createAsyncThunk(
  'deeds/addFriend',
  async ({ userId, friendId }: { userId: string; friendId: string }, { getState,rejectWithValue }) => {
    const state = getState() as any;
    const { token } = state.user;
    try {

      const response = await axios.post(`http://${APP_HOST}/deeds/${friendId}`,
        { userId, friendId },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      return response.data;
    } catch (err) {
      return rejectWithValue("failed to add friend");
    }
  }
);

const deedsSlice = createSlice({
  name: 'deeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDeed.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createDeed.fulfilled, (state, action: PayloadAction<Deed>) => {
        state.deeds.push(action.payload);
        state.status = 'idle';
      })
      .addCase(createDeed.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchDeeds.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeeds.fulfilled, (state, action: PayloadAction<Deed[]>) => {
        state.deeds = action.payload;
        state.status = 'idle';
      })
      .addCase(fetchDeeds.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateDeed.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateDeed.fulfilled, (state, action: PayloadAction<Deed>) => {
        const index = state.deeds.findIndex(deed => deed.deedid === action.payload.deedid);
        if (index >= 0) {
          state.deeds[index] = action.payload;
        }
        state.status = 'idle';
      })
      .addCase(updateDeed.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteDeed.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteDeed.fulfilled, (state, action: PayloadAction<string>) => {
        state.deeds = state.deeds.filter(deed => deed.deedid !== action.payload);
        state.status = 'idle';
      })
      .addCase(deleteDeed.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchFriendDeeds.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFriendDeeds.fulfilled, (state, action) => {
        state.status = 'idle';
        state.friendDeeds = action.payload;
      })
      .addCase(fetchFriendDeeds.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addFriend.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addFriend.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(addFriend.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default deedsSlice.reducer;
