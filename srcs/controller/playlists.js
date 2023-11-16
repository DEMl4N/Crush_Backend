const express = require('express');
const { v4: uuidv4 } = require('uuid');
const loginService = require('../service/login');
const playlistService = require('../service/playlists');
const jwtService = require('../service/jwt');
const imageService = require('../service/image');
const multer = require('../config/multer');
require('dotenv').config();

const router = express.Router();

/* GET every playlist of the user */
router.get('/', async (req, res) => {
  // 토큰 인증 및 유저 아이디 가져오기
  const token = req.headers.authorization.split(' ')[1];
  const verify_ret = jwtService.verifyToken(token, process.env.SECRET_KEY);

  if (!verify_ret.ok) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const user = await loginService.findUserById(verify_ret.id);

  if (user == null) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const playlists = await playlistService.findPlaylistsByUserId(verify_ret.id);
  console.log(playlists);

  if (playlists === undefined) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }
  
  return res.json({
    code: 200,
    message: "playlists found",
    playlists: playlists
  });
});

/* Create a playlist */
router.post('/', multer.sigle('image'), async (req, res) => {
  // 토큰 인증 및 유저 아이디 가져오기  
  const token = req.headers.authorization.split(' ')[1];
  const verify_ret = jwtService.verifyToken(token, process.env.SECRET_KEY);

  if (!verify_ret.ok) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const user = await loginService.findUserById(verify_ret.id);

  if (user == null) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const { playlistName } = req.body;
  const playlist = await playlistService.createNewPlaylist(verify_ret.id, playlistName);
  console.log(playlist);

  if (playlist === undefined) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  return res.json({
    code: 200,
    message: "playlist created"
  });
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
  const token = req.headers.authorization.split(' ')[1];
  const verify_ret = jwtService.verifyToken(token, process.env.SECRET_KEY);

  if (!verify_ret.ok) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const isDeleted = await playlistService.deletePlaylist(verify_ret.id, req.params.playlistId);

  if (isDeleted === undefined) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  return res.json({
    code: 200,
    message: "playlist deleted"
  });
});


/* GET musics in the playlist */
router.get('/:playlistId/musics', async (req, res) => {
  // 토큰 인증 및 유저 아이디 가져오기 
  const token = req.headers.authorization.split(' ')[1];
  const verify_ret = jwtService.verifyToken(token, process.env.SECRET_KEY);

  if (!verify_ret.ok) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const user = await loginService.findUserById(verify_ret.id);

  if (user == null) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const playlistObjectID = req.params.playlistId;
  const musics = await playlistService.findMusicsByPlaylistObjectId(playlistObjectID);

  if (musics === undefined) {
    return res.json({
      code: 401,
      message: "somthing is wrong"
    });
  }

  return res.json({
    code: 200,
    message: "musics found",
    musics: musics
  });
});

/* Add new music to the playlist */
router.post('/:playlistId/musics', async (req, res) => {
  // 토큰 인증 및 유저 아이디 가져오기
  const token = req.headers.authorization.split(' ')[1];
  const verify_ret = jwtService.verifyToken(token, process.env.SECRET_KEY);

  if (!verify_ret.ok) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const user = await loginService.findUserById(verify_ret.id);

  if (user == null) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const playlistObjectID = req.params.playlistId;
  const { musicName, artist, url } = req.body;
  const music = await playlistService.addNewMusic(verify_ret.id, playlistObjectID, musicName, artist, url);

  if (music === undefined) {
    return res.json({
      code: 401,
      message: "somthing is wrong"
    });
  }

  return res.json({
    code: 200,
    message: "music added"
  });
});

/* Delete a music in the playlist */
router.delete('/:playlistId/musics/:musicId', async (req, res) => {
  // 토큰 인증 및 유저 아이디 가져오기
  const token = req.headers.authorization.split(' ')[1];
  const verify_ret = jwtService.verifyToken(token, process.env.SECRET_KEY);

  if (!verify_ret.ok) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const isDeleted = await playlistService.deleteMusic(verify_ret.id, req.params.playlistId, req.params.musicId);

  if (isDeleted === undefined) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  return res.json({
    code: 200,
    message: "playlist deleted"
  });
});

module.exports = router;