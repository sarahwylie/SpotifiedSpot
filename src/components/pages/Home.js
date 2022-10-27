import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  artistsActions,
  backgroundImage,
  GetGenreArtists,
  TotalArtists,
  TotalRandomArtists
} from "../../store/artists-reducer";
import { appActions } from "../../store/app-reducer";

import fetchFromSpotify, { request } from "../../services/api";

import Dropdown from "../utils/Dropdown";
import Spinner from "../utils/Spinner";
import 'animate.css';

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

const bannedGenres = [
  "bossanova",
  "children",
  "holidays",
  "new-release",
  "metal-misc",
  "movies",
  "opera",
  "philippines-opm",
  "post-dubstep",
  "rainy-day",
  "road-trip",
  "rockabilly"
];

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const loading = useSelector((state) => state.app.loading);
  const selectedGenre = useSelector((state) => state.artists.genre);
  const artists = useSelector((state) => state.artists.artists);
  // const artistsSongs = useSelector((state) => state.artists.artistsSongs);
  const errorMessage = useSelector((state) => state.artists.errorMessage);
  const token = useSelector((state) => state.app.token);

  const [genres, setGenres] = useState([]);
  const [isShown, setIsShown] = useState(false);

  const genreRef = useRef();

  // INITIALIZATION LOGIC
  useEffect(() => {
    dispatch(appActions.toggleLoading());

    const localGenre = JSON.parse(localStorage.getItem("genre"));
    const localArtists = JSON.parse(localStorage.getItem("artists"));
    const localRandomArtists = JSON.parse(
      localStorage.getItem("randomArtists")
    );
    const localSongs = JSON.parse(localStorage.getItem("songs"));
    const localSongsPerArtist = JSON.parse(
      localStorage.getItem("songsPerArtist")
    );

    if (localGenre) {
      dispatch(artistsActions.setGenre(localGenre));
      setIsShown(true);
    }
    if (localArtists) dispatch(artistsActions.setArtists(localArtists));
    if (localRandomArtists)
      dispatch(artistsActions.setRandomArtists(localRandomArtists));
    if (localSongs) dispatch(artistsActions.setArtistSongs(localSongs));

    if (localSongsPerArtist) {
      dispatch(artistsActions.setquizSongsPerArtist(localSongsPerArtist));
    } else if (!localSongsPerArtist) {
      localStorage.setItem("songsPerArtist", 1);
    }

    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        dispatch(appActions.toggleLoading());
        dispatch(appActions.setToken(storedToken.value));
        loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      dispatch(appActions.setToken(newToken.value));
      loadGenres(newToken.value);
      dispatch(appActions.toggleLoading());
    });
  }, []);

  // GET GENRE LIST FROM SPOTIFY TO POPULATE OPTIONS
  const loadGenres = async (t) => {
    dispatch(appActions.toggleLoading());
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds"
    });
    const cleanedResponse = response.genres.filter((genre) => genre == bannedGenres ? false : true)
    setGenres(cleanedResponse);
    dispatch(appActions.toggleLoading());
  };

  // GET A LIST OF ARTISTS ON GENRE SELECT
  const getArtists = async (genre, token) => {
    dispatch(GetGenreArtists(genre, token));
  };

  // GET THE TOP 10 SONGS FROM EACH ARTIST
  const getArtistsSongs = async (artists) => {
    dispatch(appActions.toggleLoading());
    let arr = [];
    artists.forEach(async (artist) => {
      let response = await fetchFromSpotify({
        token: token,
        endpoint: `artists/${artist.id}/top-tracks?market=US`
      });

      arr.push({
        artistID: artist.id,
        songs: response.tracks
      });

      dispatch(artistsActions.setArtistSongs(arr));
    });
    dispatch(appActions.toggleLoading());
  };

  const getRandomArtists = async (qArtists) => {
    // Get a list of random artists from the same genre
    const response = await fetchFromSpotify({
      token: token,
      endpoint: `search?q=genre:${genreRef.current?.value}&type=artist&limit=${TotalRandomArtists}`
    });

    let randomArtists = response.artists.items;

    dispatch(
      artistsActions.setRandomArtists(
        randomArtists.slice(TotalArtists, randomArtists.length + 1)
      )
    );
  };

  const handleGenreSelect = async (event) => {
    event.preventDefault();
    // setSelectedGenre(event.target.value);
    dispatch(artistsActions.setGenre(event.target.value));
    getArtists(event.target.value, token);
    getRandomArtists(artists);
    setIsShown(true);
  };

  // GET OR UPDATE ARTIST SONGS WHEN THE ARTISTS ARE ASSIGNED OR CHANGED
  useEffect(() => {
    getArtistsSongs(artists);
  }, [artists]);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        height: "100vh",
        backgroundColor: "rgba(55, 63, 81,  0.9)",
        backgroundImage: `url("${backgroundImage}")`,
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
    >
      <div
        className="songcard rounded animate__animated animate__slideInDown"
      >
        <div>
          <h1 className="text-center mb-5 fs-1 fw-bold">Name That Spot!</h1>
          <h3>
            Do you have the musical skillz <br/>to guess the artist after just a few
            songs?
            <br />
            Think you can guess after only ONE? <br/>Think you can beat your high
            score?
            <br />
            Pick a genre and let’s get started!
            <br />
          </h3>
        </div>
        <div>
        <div className="cardholder">
          <label>        
            <div className="guess">
              Genre:
              </div>
              <div className="input">
              <select
                value={selectedGenre ? selectedGenre : ""}
                ref={genreRef}
                onChange={handleGenreSelect}
              >
                <option value="" />
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              </div>
            </label>
          </div>
          <div className="m-2">
            {isShown && <Dropdown className="hide-card dropdown" />}
          </div>
          <div className="m-5">
            {isShown && (
              <Link to="/quiz" className="text-decoration-none text-light">
                <button type="button" className="btn btn-lg btn-dark">
                  Let's Play!
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {loading && <Spinner />}
      {!errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Home;
