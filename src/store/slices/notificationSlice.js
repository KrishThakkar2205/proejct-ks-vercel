import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        banner: {
            visible: false,
            title: '',
            body: '',
        },
    },
    reducers: {
        showBanner: (state, action) => {
            state.banner.visible = true;
            state.banner.title = action.payload.title || '';
            state.banner.body = action.payload.body || '';
        },
        hideBanner: (state) => {
            state.banner.visible = false;
            state.banner.title = '';
            state.banner.body = '';
        },
    },
});

export const { showBanner, hideBanner } = notificationSlice.actions;
export default notificationSlice.reducer;
