import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { artistsActions } from "../../store/artists-reducer";

import { Howl } from "howler";

import Button from "../utils/Button";
import Spinner from "../utils/Spinner";
import Slider from "../utils/Slider";
import { chain, indexOf } from "lodash";

const Quiz = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const loading = useSelector((state) => state.app.loading);
  const artists = useSelector((state) => state.artists.artists);
  const activeArtistIndex = useSelector(
    (state) => state.artists.activeArtistIndex
  );
  // console.log(activeArtistIndex);

  let currIdx =
    activeArtistIndex <= artists.length - 1
      ? activeArtistIndex
      : artists.length - 1;

  const artistsSongs = useSelector((state) => state.artists.artistsSongs);
  const randomArtists = useSelector((state) => state.artists.randomArtists);
  const errorMessage = useSelector((state) => state.artists.errorMessage);
  const quizSongsPerArtist = useSelector(
    (state) => state.artists.quizSongsPerArtist
  );
  let numOfSongs = quizSongsPerArtist;
  const randomArtistIdx = Math.floor(Math.random() * 5) + 5;
  const choicesRandomIdx = Math.floor(Math.random() * 3);

  // CURRENT ACTIVE ARTIST INIT
  let currentArtist;
  useEffect(() => {
    currentArtist = artists[activeArtistIndex];
  }, [activeArtistIndex]);
  currentArtist = artists[activeArtistIndex];
  let activeArtistImage;
  let activeArtistID;
  let activeArtistName;

  for (const key in currentArtist) {
    activeArtistImage = currentArtist["images"][2].url;
    activeArtistID = currentArtist["id"];
    activeArtistName = currentArtist["name"];
  }

  // OTHER ARTISTS INIT
  const selectRandomArtists = () => {
    return randomArtists.slice(randomArtistIdx, randomArtistIdx + 4);
  };

  // CHOICES INIT
  const randomChoices = selectRandomArtists();
  randomChoices.splice(choicesRandomIdx, 0, currentArtist);
  const choices = randomChoices;

  let extractedChoices = choices.reduce((acc, ch, i) => {
    let chArr = [];
    for (const key in ch) {
      const element = ch[key];
      chArr.push(element);
    }
    acc.push(chArr);
    return acc;
  }, []);
  // console.log(extractedChoices)

  const [isCorrectModalOpen, setIsCorrectModalOpen] = useState(false);
  const [isWrongModalOpen, setIsWrongModalOpen] = useState(false);
  const [isLoseModalOpen, setIsLoseModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState("");

  const getArtistRandomSongs = (artistID) => {
    // Pull the correct artist's songs from the store
    const songObj = artistsSongs.filter((song) => song.artistID === artistID);
    const artistSongs = songObj.flatMap((song) => [...song.songs]);

    // Select a randomized slice from those songs
    const rand = Math.floor(Math.random() * 4);
    const songsSlice = artistSongs.slice(rand, quizSongsPerArtist + rand);

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
    extractedSongs.map((song, i) => {
      previewLinks.push(song[13]);
    });

    return previewLinks;
  };
  let artistSong = getArtistRandomSongs(activeArtistID);
  console.log(artistSong);

  // INITIALIZATION LOGIC
  useEffect(() => {
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
  }, []);

  const advanceArtists = () => {
    dispatch(artistsActions.forwardActiveArtistIndex());
  };

  const toggleCorrectModal = () => {
    setIsCorrectModalOpen(!isCorrectModalOpen);
  };
  const toggleWrongModal = () => {
    setIsWrongModalOpen(!isWrongModalOpen);
  };

  // output a list of quiz questions (artists + songs) that advance through the
  // list of artists and 5 random songs from their song list

  // select 5 randoms from randomArtists to output as choices

  if (loading || errorMessage) {
    return (
      <div>
        <Spinner />
        <p>{errorMessage}</p>
      </div>
    );
  }

  // const song = new Howl({
  //   src: [getArtistRandomSong],
  //   html5: true
  // });

  // const song = new Howl({
  //   src: ['https://p.scdn.co/mp3-preview/8e0fc132fd4a8b535d124648576c981dbcfce8e5?cid=74f434552d40467782bc1bc64b12b2e9'],
  //   html5: true
  // })

  const sprite = new Howl({
    src: [
      "https://p.scdn.co/mp3-preview/8e0fc132fd4a8b535d124648576c981dbcfce8e5?cid=74f434552d40467782bc1bc64b12b2e9"
    ],
    html5: true,
    sprite: {
      id1: [0, 4000],
      id2: [0, 4000],
      id3: [0, 4000],
      id4: [0, 4000],
      id5: [0, 4000]
    }
  });

  const id1 = () => sprite.play("id1");
  const id2 = () => sprite.play("id2");
  const id3 = () => sprite.play("id3");
  const id4 = () => sprite.play("id4");
  const id5 = () => sprite.play("id5");

  // const randomSong = () => {
  //   artistsSongs.map((song) => (
  //          song.href
  // ))}
  //   const avatar = () => {
  //     artists.map((artist) => (
  //       <img src={artist.images[2].url} className="rounded" />
  // ))}

  // const handleAnchorClick = () => {
  //   sprite.on('onunlock', function(){
  //     sprite.play('id1')
  //   })
  // }

  // console.log(artists);
  // console.log(artistsSongs);

  // choice[6] = Choice artist's name
  return (
    <div className="d-flex flex-column justify-items-center align-items-center my-5">
      <p>Correct Answer: {activeArtistName}</p>

      <div className="d-flex">
        {extractedChoices.map((choice, i) => (
          <span key={i} className="btn btn-secondary m-2">
            {choice[6]}
          </span>
        ))}
      </div>
      <button className="btn btn-info my-5" onClick={advanceArtists}>
        Next
      </button>

      <div>
<span>
  Play your {numOfSongs == 1 ? '' : 'first'} song: {artists.map((artist, i) => (
    <div key={i}>
      <img src={artist.images[2].url} className="rounded" onClick={id1} /> <br />
    </div>
  ))}
  {/* <Slider>{id1}</Slider> */}
</span><span style={{ display: numOfSongs >= 2 ? "block" : "none" }}>
    Play your second song: {artists.map((artist, i) => (
      <div key={i}>
        <img src={artist.images[2].url} className="rounded" onClick={id2} /> <br />
      </div>
    ))}
    {/* <Slider>{id2}</Slider> */}
  </span><span style={{ display: numOfSongs >= 3 ? "block" : "none" }}>
    Play your third song: {artists.map((artist, i) => (
      <div key={i}>
        <img src={artist.images[2].url} className="rounded" onClick={id3} /> <br />
      </div>
    ))}
    {/* <Slider>{id3}</Slider> */}
  </span><span style={{ display: numOfSongs >= 4 ? "block" : "none" }}>
    Play your fourth song: {artists.map((artist, i) => (
      <div key={i}>
        <img src={artist.images[2].url} className="rounded" onClick={id4} /> <br />
      </div>
    ))}
    {/* <Slider>{id4}</Slider> */}
  </span><span style={{ display: numOfSongs >= 5 ? "block" : "none" }}>
    Play your fifth song: {artists.map((artist, i) => (
      <div key={i}>
        <img src={artist.images[2].url} className="rounded" onClick={id5} /> <br />
      </div>
    ))}
    {/* <Slider>{id5}</Slider> */}
  </span><div>
    <label>
      Guess that artist!
      <select
        value={selectedArtist}
        onChange={(event) => setSelectedArtist(event.target.value)}
      >
        <option value="" />
        {randomArtists.map((artist) => (
          <option key={artist.id} value={artist.name}>
            {artist.name}
          </option>
        ))}
      </select>
    </label>

    <div>
      <Button type="submit">
        {/* logic to toggle modals depending on correct answer! */}
        I'm feeling lucky!
      </Button>
    </div>
  </div>
</div>

      {/* <div>
        <div className="d-flex">
          {artists.map((artist, i) => (
            <div key={i}>
              <span className="fs-2">{artist.name}</span>{" "}
              <img src={artist.images[2].url} className="rounded" /> <br />
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Quiz;