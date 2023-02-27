import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CemStellarium, SkyObject } from '@/cem-stellarium';
import { CemBlockly } from '@/cem-blockly';

const initialState = {
  cemStellarium: null as CemStellarium | null,
  cemBlockly: null as CemBlockly | null,
  selectObject: undefined as SkyObject | undefined,
  executable: false,

  title: '',
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {

    setCemStellarium(state, { payload }: PayloadAction<CemStellarium | null>) {
      return {
        ...state,
        cemStellarium: payload,
      } as any;
    },

    setCemBlockly(state, { payload }: PayloadAction<CemBlockly | null>) {
      return {
        ...state,
        cemBlockly: payload,
      };
    },

    setSelectObject(state, { payload }: PayloadAction<SkyObject>) {
      state.selectObject = payload;
    },

    unselectObject(state) {
      state.selectObject = undefined;
    },

    setExcutable(state, { payload }: PayloadAction<boolean>) {
      state.executable = payload;
    },

    setTitle(state, { payload }: PayloadAction<string>) {
      state.title = payload;
    }
  },
});
