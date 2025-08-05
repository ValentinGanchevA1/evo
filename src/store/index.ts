import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice.ts';
// import other reducers...

const store = configureStore({
  reducer: {
    theme: themeReducer,
    // other reducers...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;