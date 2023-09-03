import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
};
const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setUser(state, action) {
      state.isLoading = action.payload.isLoading;
    },
  },
});

export default commonSlice;
