import { configureStore } from '@reduxjs/toolkit'
import user from '@/redux/slices/userSlice';
import deeds from '@/redux/slices/deedsSlice';
import account from '@/redux/slices/accountSlice';

export const store = configureStore({
   reducer: {
     user: user,
     deeds: deeds,
     accountUser: account,
   }
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch