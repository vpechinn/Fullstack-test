import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  password: string;
}

const initialState: UserState = {
  name: '',
  password: '',
};

const accountSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

export const { setName, setPassword } = accountSlice.actions;

export default accountSlice.reducer;
