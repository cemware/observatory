import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  selectedTab: 'view',

  visible: {
    atmosphere: false,
    landscapes: false,
    milkyway: false,
    dss: false,
    stars: false,
    dsos: false,
    planets: false,
    minorPlanets: false,
    comets: false,
    satellites: false,

    eclipticLine: false,
    meridianLine: false,
    equatorialLine: false,
    azimuthalLine: false,
  },

  time: {
    dateTime: 0,
    timeSpeed: 0,
    longitude: 0,
    latitude: 0,
  },

  locationName: '',
};

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {

    toggleOpen(state) {
      state.isOpen = !state.isOpen;
    },

    setSelectedTab(state, { payload }: PayloadAction<string>) {
      state.selectedTab = payload;
    },

    setVisibleSetting(state, { payload }: PayloadAction<{ key: keyof typeof state['visible'], visible: boolean }>) {
      state.visible[payload.key] = payload.visible;
    },

    setTimeSetting(state, { payload }: PayloadAction<{ key: keyof typeof state['time'], value: number }>) {
      state.time[payload.key] = payload.value;
    },

    setLocationName(state, { payload }: PayloadAction<string>) {
      state.locationName = payload;
    },
  },
});
