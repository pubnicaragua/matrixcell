import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDevices } from '../api/devices';

export const loadDevices = createAsyncThunk('devices/load', async () => {
  const devices = await fetchDevices();
  return devices;
});

const devicesSlice = createSlice({
  name: 'devices',
  initialState: { devices: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDevices.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadDevices.fulfilled, (state, action) => {
        state.devices = action.payload;
        state.loading = false;
      });
  },
});

export default devicesSlice.reducer;
