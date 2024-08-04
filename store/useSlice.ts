import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userEmail: string | null;
}

const initialState: UserState = {
  userEmail: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserEmail(state, action: PayloadAction<string | null>) {
      state.userEmail = action.payload;
    },
  },
});

export const { setUserEmail } = userSlice.actions;
export default userSlice.reducer;
