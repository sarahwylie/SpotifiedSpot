import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "./app-reducer";

import fetchFromSpotify from "../services/api";

const artistsInitialState = {
  genre: undefined,
  artists: [],
  activeArtistIndex: 0,
  currentArtistID: undefined,
  artistsSongs: [],
  randomArtists: [],
  choices: [],
  quizSongsPerArtist: 1,
  errorMessage: undefined
};

const artistsSlice = createSlice({
  name: "artists",
  initialState: artistsInitialState,
  reducers: {
    setGenre(state, action) {
      state.genre = [];
      localStorage.setItem("genre", JSON.stringify(action.payload));
      state.genre = action.payload;
    },

    forwardActiveArtistIndex(state) {
      state.activeArtistIndex =
        state.activeArtistIndex < state.artists.length - 1
          ? ++state.activeArtistIndex
          : state.artists.length - 1;
      state.currentArtistID = state.artists[state.activeArtistIndex].id;
      localStorage.setItem(
        "currentArtistID",
        JSON.stringify(state.currentArtistID)
      );
    },
    resetActiveArtistIndex(state) {
      state.activeArtistIndex = 0;
    },

    setArtists(state, action) {
      state.artists = [];
      action.payload.map((val) => state.artists.push(val));
      state.currentArtistID = state.artists[0].id;
      localStorage.setItem(
        "currentArtistID",
        JSON.stringify(state.currentArtistID)
      );
    },

    setArtistSongs(state, action) {
      state.artistsSongs = [];
      localStorage.setItem("songs", JSON.stringify(action.payload));
      state.artistsSongs = state.artistsSongs.concat(action.payload);
    },

    setRandomArtists(state, action) {
      state.randomArtists = [];
      localStorage.setItem("randomArtists", JSON.stringify(action.payload));
      state.randomArtists = state.randomArtists.concat(action.payload);
    },

    setchoices(state, action) {
      state.choices = [];
      localStorage.setItem("choices", JSON.stringify(action.payload));
      state.choices = action.payload;
    },

    setquizSongsPerArtist(state, action) {
      localStorage.setItem("songsPerArtist", JSON.stringify(action.payload));
      state.quizSongsPerArtist = action.payload;
    },

    setErrorMessage(state, action) {
      state.errorMessage = action.payload;
    },

    resetArtists(state) {
      state.genre = undefined;
      state.artists = [];
      state.activeArtistIndex = 0;
      state.currentArtistID = undefined;
      state.artistsSongs = [];
      state.randomArtists = [];
      state.choices = [];
      state.quizSongsPerArtist = 1;
      state.errorMessage = undefined;
    }

  }
});

export const TotalArtists = 5;
export const TotalRandomArtists = TotalArtists <= 10 ? TotalArtists * 4 : 50;
export let backgroundImage;

export const GetGenreArtists = (genre, token) => {
  return async (dispatch) => {
    dispatch(appActions.toggleLoading());

    const response = await fetchFromSpotify({
      token: token,
      endpoint: `search?q=genre:${genre}&type=artist&limit=${TotalArtists}`
    });
    let img = response.artists.items[0]["images"][0].url;
    backgroundImage = img;

    dispatch(artistsActions.setArtists(response.artists.items));
    localStorage.setItem("artists", JSON.stringify(response.artists.items));

    dispatch(appActions.toggleLoading());
  };
};

export const artistsActions = artistsSlice.actions;

export default artistsSlice.reducer;
