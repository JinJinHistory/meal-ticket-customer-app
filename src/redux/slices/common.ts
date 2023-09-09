import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  isLoading: false,
  token: null,
};
const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setUser(state, action) {
      state.isLoading = action.payload.isLoading;
    },
    setToken(state, action) {
      console.log('action.payload.token:', action.payload.token);
      state.token = action.payload.token;
    }
  },
});

export default commonSlice;
