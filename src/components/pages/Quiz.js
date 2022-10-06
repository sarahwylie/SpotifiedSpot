import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import { artistsActions } from "../../store/artists-reducer";

import { Howl } from "howler";

import Spinner from "../utils/Spinner";
import "../utils/utilStylez.css";
import ResultModal from "../utils/ResultModal";
import { quizActions } from "../../store/quiz-reducer";
import fetchFromSpotify from "../../services/api";

const Quiz = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const answerRef = useRef();

  const successTitle = "That is correct! Way to go!";
  const incorrectTitle = "Oh no! That wasn't the right one.";

  const token = useSelector((state) => state.app.token);

  const totalCorrect = useSelector((state) => state.quiz.totalCorrect);
  const gameOver = useSelector((state) => state.quiz.gameOver);

  const loading = useSelector((state) => state.app.loading);

  const artists = useSelector((state) => state.artists.artists);
  const activeArtistIndex = useSelector(
    (state) => state.artists.activeArtistIndex
  );
  const currentArtistID = useSelector((state) => state.artists.currentArtistID);
  const artistsSongs = useSelector((state) => state.artists.artistsSongs);
  const randomArtists = useSelector((state) => state.artists.randomArtists);
  const storeChoices = useSelector((state) => state.artists.choices);
  const errorMessage = useSelector((state) => state.artists.errorMessage);
  const quizSongsPerArtist = useSelector(
    (state) => state.artists.quizSongsPerArtist
  );

  const localGenre = JSON.parse(localStorage.getItem("genre"));
  const localArtists = JSON.parse(localStorage.getItem("artists"));
  const localRandomArtists = JSON.parse(localStorage.getItem("randomArtists"));
  const localSongs = JSON.parse(localStorage.getItem("songs"));
  // const localChoices = JSON.parse(localStorage.getItem("choices"));
  const localSongsPerArtist = JSON.parse(
    localStorage.getItem("songsPerArtist")
  );

  const randomArtistIdx = Math.floor(Math.random() * 5) + 5;
  const choicesRandomIdx = Math.floor(Math.random() * 4);

  const [isCorrectModalOpen, setIsCorrectModalOpen] = useState(false);
  const [isWrongModalOpen, setIsWrongModalOpen] = useState(false);
  const [isSongPlaying, setisSongPlaying] = useState(false);
  const [selectedArtistID, setSelectedArtistID] = useState("");
  const [selectedArtistName, setSelectedArtistName] = useState();

  const generateChoices = () => {
    const randoms = randomArtists.slice(randomArtistIdx, randomArtistIdx + 4);
    const arr = [...randoms];
    arr.splice(choicesRandomIdx, 0, artists[activeArtistIndex]);
    const choices = ["", ...arr];
    dispatch(artistsActions.setchoices(choices));
  };

  // CHOICES INIT
  if (storeChoices == [] || storeChoices == ["", null]) {
    generateChoices();
  }

  const getArtistRandomSongs = (artistID) => {
    // Pull the correct artist's songs from the store
    const songObj = artistsSongs.filter((song) => song.artistID === artistID);
    const artistSongs = songObj.flatMap((song) => [...song.songs]);

    // Select a randomized slice from those songs
    const rand = Math.floor(Math.random() * 4);
    const songsSlice = artistSongs.slice(rand, rand + 5);

    // Pull out the keys from the song object
    let extractedSongs = songsSlice.reduce((acc, song, i) => {
      let sgArr = [];
      for (const key in song) {
        const element = song[key];
        sgArr.push(element);
      }
      acc.push(sgArr);
      return acc;
    }, []);

    // Pull out the preview_url from each song and return the list of previews
    let previewLinks = [];
    let extractedPreviews = extractedSongs.map((song, i) => {
      previewLinks.push(song[13]);
    });

    return previewLinks;
  };

  const handleAnswerSubmit = () => {


    if (selectedArtistID === currentArtistID) {
      dispatch(quizActions.addCorrect());
      setIsCorrectModalOpen(true);
    } else {
      dispatch(quizActions.addWrong());
      setIsWrongModalOpen(true);
    }
  };

  const toggleCorrectModal = () => {
    if (activeArtistIndex === artists.length - 1)
    dispatch(quizActions.endGame());

    setIsCorrectModalOpen(!isCorrectModalOpen);
    dispatch(artistsActions.forwardActiveArtistIndex());
  };
  const toggleWrongModal = () => {
    if (activeArtistIndex === artists.length - 1)
    dispatch(quizActions.endGame());
    
    setIsWrongModalOpen(!isWrongModalOpen);
    dispatch(artistsActions.forwardActiveArtistIndex());
  };

  // UPDATE CHOICES WHEN THE ARTIST CHANGES
  useEffect(() => {
    generateChoices();
  }, [activeArtistIndex]);

  // INITIALIZATION LOGIC
  useEffect(() => {
    if (localGenre) dispatch(artistsActions.setGenre(localGenre));
    if (localArtists) dispatch(artistsActions.setArtists(localArtists));
    if (localRandomArtists)
      dispatch(artistsActions.setRandomArtists(localRandomArtists));
    if (localSongs) dispatch(artistsActions.setArtistSongs(localSongs));

    if (localSongsPerArtist) {
      dispatch(artistsActions.setquizSongsPerArtist(localSongsPerArtist));
    } else if (!localSongsPerArtist) {
      localStorage.setItem("songsPerArtist", 1);
    }
    generateChoices();
  }, []);

  if (loading || errorMessage) {
    return (
      <div>
        <Spinner />
        <p>{errorMessage}</p>
      </div>
    );
  }

  let artistSongs = getArtistRandomSongs(currentArtistID);
  console.log(artistSongs);

  const sprite1 = new Howl({
    src: [artistSongs[0]],
    html5: true,
    sprite: { id1: [0, 4000] }
  });
  const sprite2 = new Howl({
    src: [artistSongs[1]],
    html5: true,
    sprite: { id2: [0, 4000] }
  });
  const sprite3 = new Howl({
    src: [artistSongs[2]],
    html5: true,
    sprite: { id3: [0, 4000] }
  });
  const sprite4 = new Howl({
    src: [artistSongs[3]],
    html5: true,
    sprite: { id4: [0, 4000] }
  });
  const sprite5 = new Howl({
    src: [artistSongs[4]],
    html5: true,
    sprite: { id5: [0, 4000] }
  });

  const id1 = () => sprite1.play("id1");
  const id2 = () => sprite2.play("id2");
  const id3 = () => sprite3.play("id3");
  const id4 = () => sprite4.play("id4");
  const id5 = () => sprite5.play("id5");

  return (
    <div
      className="background"
      style={{
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh"
      }}
    >
      {gameOver && <Redirect to="/stats" /> }
      <div className="container">
        <div className="cardholder">
          <span className="songcard single rounded animate__animated animate__slideInLeft">
            Play your <br />
            {quizSongsPerArtist == 1 ? "" : "first"} song:{" "}
            <img
              src={artists[activeArtistIndex]?.images[2]?.url}
              className="rounded"
              onClick={id1}
            />
          </span>
          <span
            className="songcard single rounded animate__animated animate__slideInLeft"
            style={{ display: quizSongsPerArtist >= 2 ? "block" : "none" }}
          >
            Play your <br />
            second song:{" "}
            <img
              src={artists[activeArtistIndex]?.images[2]?.url}
              className="rounded"
              onClick={id2}
            />{" "}
          </span>
          <span
            className="songcard single rounded animate__animated animate__slideInDown"
            style={{ display: quizSongsPerArtist >= 3 ? "block" : "none" }}
          >
            Play your <br /> third song:{" "}
            <img
              src={artists[activeArtistIndex]?.images[2]?.url}
              className="rounded"
              onClick={id3}
            />{" "}
          </span>
          <span
            className="songcard single rounded animate__animated animate__slideInRight"
            style={{ display: quizSongsPerArtist >= 4 ? "block" : "none" }}
          >
            Play your <br /> fourth song:{" "}
            <img
              src={artists[activeArtistIndex]?.images[2]?.url}
              className="rounded"
              onClick={id4}
            />{" "}
          </span>
          <span
            className="songcard single rounded animate__animated animate__slideInRight"
            style={{ display: quizSongsPerArtist >= 5 ? "block" : "none" }}
          >
            Play your <br />
            fifth song:{" "}
            <img
              src={artists[activeArtistIndex]?.images[2]?.url}
              className="rounded"
              onClick={id5}
            />{" "}
          </span>
        </div>
      </div>

      {isCorrectModalOpen && (
        <ResultModal onClose={toggleCorrectModal} title={successTitle} />
      )}
      {isWrongModalOpen && (
        <ResultModal onClose={toggleWrongModal} title={incorrectTitle} />
      )}

      <div className="d-flex justify-content-center">
        <div className="songcard rounded col-10 col-md-8 col-xl-6 animate__animated animate__slideInUp">
          <div className="my-5">
            <label>
              Guess that artist!
              <select
                ref={answerRef}
                value={selectedArtistName}
                onChange={(event) => setSelectedArtistID(event.target.value)}
              >
                {storeChoices.map((artist, i) => (
                  <option
                    key={i}
                    value={artist.id}
                    onChange={(event) => setSelectedArtistName(artist.name)}
                  >
                    {artist.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="m-5">
            <button
              type="button"
              className="btn btn-lg btn-dark"
              onClick={handleAnswerSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
