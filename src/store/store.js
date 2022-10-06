import { configureStore } from "@reduxjs/toolkit";

import appReducer from './app-reducer';
import artistsReducer from './artists-reducer';
import quizReducer from "./quiz-reducer";

const store = configureStore({
    reducer: {
        app: appReducer,
        artists: artistsReducer,
        quiz: quizReducer
    }
});

export default store;