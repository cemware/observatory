import { commonSlice } from './common-slice';
import { settingSlice } from './setting-slice';
import { tabSlice } from './tab-slice';

export const reducers = {
  common: commonSlice.reducer,
  setting: settingSlice.reducer,
  tab: tabSlice.reducer,
};

export const ACTIONS = {
  common: commonSlice.actions,
  setting: settingSlice.actions,
  tab: tabSlice.actions,
};
