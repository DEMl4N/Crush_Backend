const express = require('express');
const loginService = require('../service/login');
const playlistService = require('../service/playlists');

const router = express.Router();

// app.use('/musics', musicRouter);

/* GET every playlist of the user */
router.get('/', async (req, res) => {
  // 토큰 인증 및 유저 아이디 가져오기
  const userID = "Test";
  const playlists = await playlistService.findPlaylistsByUserId(userID);
  console.log(playlists);
  return res.json({
    playlists: [
      {
        A: "A"
      },
      {
        B: "B"
      }
    ]
  });
});

/* Create a playlist */
router.post('/', async (req, res) => {
  // 토큰 인증 및 유저 아이디 가져오기
  const userID = "Test";
  const { playlistName } = req.body;
  const playlist = await playlistService.createNewPlaylist(userID, playlistName);
  console.log(playlist);
  return res.send("B");
});

/* Modify the playlist info */
router.put('/:playlistId', async (req, res) => {
  // 토큰 인증 및 유저 아이디 가져오기
  const userID = "Test";

  return res.send("C");
});

/* Delelte the playlist */
router.delete('/:playlistId', async (req, res) => {
  // 토큰 인증 및 유저 아이디 가져오기
  const userID = "Test";

  return res.send("D");
});


/* GET musics in the playlist */
router.get('/:playlistId/musics', async (req, res) => {
  // 토큰 인증 및 유저 아이디 가져오기
  const userID = "Test";
  const playlistObjectID = req.params.playlistId;
  const musics = await playlistService.findMusicsByPlaylistObjectId(playlistObjectID);

  return res.send("E");
});

/* Add new music to the playlist */
router.post('/:playlistId/musics', async (req, res) => {
  // 토큰 인증 및 유저 아이디 가져오기
  const userID = "Test";
  const playlistObjectID = req.params.playlistId;
  const { musicName, artist, url } = req.body;
  const music = await playlistService.addNewMusic(userID, playlistObjectID, musicName, artist, url);

  return res.send("F");
});

/* Delete a music in the playlist */
router.delete('/:playlistId/musics/:musicId', async (req, res) => {
  // 토큰 인증 및 유저 아이디 가져오기

  return res.send("G");
});

module.exports = router;