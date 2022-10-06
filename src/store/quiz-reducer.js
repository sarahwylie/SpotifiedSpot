import { createSlice } from "@reduxjs/toolkit";

const quizInitialState = {
  totalCorrect: 0,
  totalWrong: 0,
  gameOver: false,
  errorMessage: undefined
};

const quizSlice = createSlice({
  name: "quiz",
  initialState: quizInitialState,
  reducers: {
    addCorrect(state) {
      ++state.totalCorrect;
    },
    addWrong(state) {
      ++state.totalWrong;
    },
    endGame(state) {
      state.gameOver = true;
    },
    resetQuiz(state) {
      state.totalCorrect = 0;
      state.totalWrong = 0;
      state.gameOver = false;
      state.errorMessage = undefined;
    }
  }
});

export const quizActions = quizSlice.actions;

export default quizSlice.reducer;
