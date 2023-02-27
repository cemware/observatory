import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
};

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {

    toggleOpen(state) {
      state.isOpen = !state.isOpen;
    },

  },
});
