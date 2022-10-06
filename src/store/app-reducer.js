import { createSlice } from "@reduxjs/toolkit";

const appInitialState = {
    loading: false,
    token: null
}

const appSlice = createSlice({
    name: 'app',
    initialState: appInitialState,
    reducers: {
        toggleLoading(state) {
            state.loading = !state.loading;
        },
        setToken(state, action) {
            state.token = action.payload
        }
    }
});

export const appActions = appSlice.actions;

export default appSlice.reducer;