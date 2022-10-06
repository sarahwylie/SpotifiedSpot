export const GetArtistRandomSong = (artistID, artistsSongs) => {
  const songObj = artistsSongs.filter((song) => song.artistID === artistID);
  const artistSongs = songObj.flatMap((song) => [...song.songs]);

  const rand = Math.floor(Math.random() * 10);
  return artistSongs[rand];
};
