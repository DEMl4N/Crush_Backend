const express = require('express');
const { v4: uuidv4 } = require('uuid');
const loginService = require('../service/login');
const playlistService = require('../service/playlists');
const imageService = require('../service/image');
const multer = require('../config/multer');
require('dotenv').config();

const router = express.Router();

/* GET every playlist of the user */
router.get('/', async (req, res) => {
  res.setHeader('Access-Control-Allow-origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용
  // 토큰 인증 및 유저 아이디 가져오기
  const loginInfo = await loginService.checkUser(req.headers, process.env.SECRET_KEY);

  if (!loginInfo.ok) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const playlists = await playlistService.findPlaylistsByUserId(loginInfo.id);
  // const playlists = await playlistService.findPlaylistsByUserId("brandnewworld");

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
router.post('/', multer.single('image'), async (req, res) => {
  // 토큰 인증 및 유저 아이디 가져오기  
  const loginInfo = await loginService.checkUser(req.headers, process.env.SECRET_KEY);

  if (!loginInfo.ok) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }


  const { playlistName } = req.body;
  const playlist = await playlistService.createNewPlaylist(loginInfo.id, playlistName, req.file);
  // const playlist = await playlistService.createNewPlaylist("brandnewworld", playlistName, req.file);
  console.log(playlist);

  if (playlist === undefined) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  return res.json({
    code: 200,
    message: "playlist created",
    playlistId: playlist._id
  });
});

/* Modify the playlist info */
router.put('/:playlistId', async (req, res) => {
  res.setHeader('Access-Control-Allow-origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용
  // 토큰 인증 및 유저 아이디 가져오기
  const userID = 'Test';

  return res.send('C');
});

/* Delelte the playlist */
router.delete('/:playlistId', async (req, res) => {
  res.setHeader('Access-Control-Allow-origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용
  // 토큰 인증 및 유저 아이디 가져오기
  const loginInfo = await loginService.checkUser(req.headers, process.env.SECRET_KEY);

  if (!loginInfo.ok) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const isDeleted = await playlistService.deletePlaylist(loginInfo.id, req.params.playlistId);
  // const isDeleted = await playlistService.deletePlaylist("brandnewworld", req.params.playlistId);

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
  const loginInfo = await loginService.checkUser(req.headers, process.env.SECRET_KEY);

  if (!loginInfo.ok) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const playlistObjectID = req.params.playlistId;
  const musics = await playlistService.findMusicsByPlaylistObjectId(loginInfo.id, playlistObjectID);
  // const musics = await playlistService.findMusicsByPlaylistObjectId("brandnewworld", playlistObjectID);

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
  res.setHeader('Access-Control-Allow-origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용
  // 토큰 인증 및 유저 아이디 가져오기
  const loginInfo = await loginService.checkUser(req.headers, process.env.SECRET_KEY);

  if (!loginInfo.ok) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const playlistObjectID = req.params.playlistId;
  const { musicName, artist, url } = req.body;
  const music = await playlistService.addNewMusic(loginInfo.id, playlistObjectID, musicName, artist, url);
  // const music = await playlistService.addNewMusic("brandnewworld", playlistObjectID, musicName, artist, url);

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
  res.setHeader('Access-Control-Allow-origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용
  // 토큰 인증 및 유저 아이디 가져오기
  const loginInfo = await loginService.checkUser(req.headers, process.env.SECRET_KEY);

  if (!loginInfo.ok) {
    return res.status(401).json({
      code: 401,
      message: "something is wrong"
    });
  }

  const isDeleted = await playlistService.deleteMusic(loginInfo.id, req.params.playlistId, req.params.musicId);
  // const isDeleted = await playlistService.deleteMusic("brandnewworld", req.params.playlistId, req.params.musicId);

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
