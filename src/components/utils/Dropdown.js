import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { artistsActions } from "../../store/artists-reducer";

const Dropdown = () => {
  const dispatch = useDispatch();
  const quizSongsPerArtist = useSelector(
    (state) => state.artists.quizSongsPerArtist
  );
  const localSongsPerArtist = JSON.parse(
    localStorage.getItem("songsPerArtist")
  );

  const numOfSongs = useRef();

  const handleSongsSelect = (event) => {
    dispatch(artistsActions.setquizSongsPerArtist(+event.target.value));
  };

  return (
    <div className="cardholder">
      <label>
        <div className="guess2">
          How many songs would you like to play to guess the artist?
        </div>
        <div className="input">
          <select
            ref={numOfSongs}
            onChange={handleSongsSelect}
            value={localSongsPerArtist ? localSongsPerArtist : quizSongsPerArtist}
          >
            <option value="1"> 1 </option>
            <option value="2"> 2 </option>
            <option value="3"> 3 </option>
            <option value="4"> 4 </option>
            <option value="5"> 5 </option>
          </select>
        </div>
      </label>
    </div>);
};

export default Dropdown;
