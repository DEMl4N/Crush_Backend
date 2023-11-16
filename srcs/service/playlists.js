/* eslint-disable camelcase */
// mongoose 불러오기
const mongoose = require('../database/mongoose');
const { v4: uuidv4 } = require('uuid');

const logger = require('../config/logger');
const { log } = require('winston');

const imageService = require('../service/image');

const playlistSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  thumbnail: {
    type: imageService.image_schema
  },
  numberOfMusics: {
    type: Number,
    default: 0
  }
});

const playlistModel = mongoose.model('playlist', playlistSchema);

const musicSchema = new mongoose.Schema({
  playlistID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const musicModel = mongoose.model('music', musicSchema);

const findPlaylistsByUserId = async (userID) => {
  const playlists = await playlistModel.find({
    userID: userID
  })
  .then((isSuccessful) => {
    if (!isSuccessful) {
      return undefined;
    }

    logger.info(`find_playlists by ${userID}: ${isSuccessful}`);

    const playlists = [];
    isSuccessful.forEach((playlist) => {
      playlists.push({
        playlistID: playlist._id,
        playlistName: playlist.name,
        numberOfMusics: playlist.numberOfMusics,
        thumbnailUrl: playlist.thumbnail.url
      })
    })

    return playlists;
  })
  .catch((error) => {
    logger.error(error);
    return undefined;
  });
};

const findMusicsByPlaylistObjectId = async (playlistObjectID) => {
  const musics = await musicModel.find({
    playlistID: mongoose.Types.ObjectId(playlistObjectID)
  })
  .then((isSuccessful) => {
    if (!isSuccessful) {
      return undefined;
    }
    logger.info(`find_musics in ${playlistObjectID} by ${userID}: ${isSuccessful}`);

    const musics = []
    isSuccessful.forEach((music) => {
      musics.push({
        musicID: music._id,
        musicName: music.name,
        artist: music.artist,
        url: music.url
      })
    })

    return musics;
  })
  .catch((error) => {
    logger.error(error);
    return undefined;
  });
};

const createNewPlaylist = async (userID, playlistName, imageFile) => {
  let playlistImage = undefined

  if (imageFile) {
    const uuid = uuidv4();
    const filename = uuid + imageFile.originalname;
    playlistImage = await imageService.createImage(imageFile, filename)
    .catch((error) => {
      return undefined;
    });
  }
  
  const newPlaylist = await playlistModel.create({
    userID: userID,
    name: playlistName,
    thumbnail: playlistImage
  })
  .then((isSuccessful) => {
    if (isSuccessful) {
      logger.info(`playlist created ${isSuccessful}`);
      return newPlaylist;
    }
  })
  .catch((error) => {
    logger.error(error);
    return undefined;
  });

  return newPlaylist;
};

const addNewMusic = async (userID, playlistObjectID, musicName, artist, url) => {
  const isValid = await playlistModel.findOne({
    userID: userID,
    _id: mongoose.Types.ObjectId(playlistObjectID),
  })
  .then((isSuccessful) => {
    if (isSuccessful === undefined) {
      return undefined;
    }
  })
  .catch((error) => {
    logger.error(error);
    return undefined;
  });

  const newMusic = musicModel.create({
    playlistID: mongoose.Types.ObjectId(playlistObjectID),
    name: musicName,
    artist: artist,
    url: url
  })
  .then((isSuccessful) => {
    if (isSuccessful) {
      logger.info(`add music ${musicName} to ${playlistObjectID} by ${userID}`);
    }
  })
  .catch((error) => {
    logger.error(error);
    return undefined;
  })

  return newMusic;
};

const deletePlaylist = async (userID, playlistObjectID) => {
  const isDeleted = await playlistModel.deleteOne({
    userID: userID,
    _id: mongoose.Types.ObjectId(playlistObjectID)
  })
  .then((isSuccessful) => {
    if (isSuccessful === undefined) {
      return undefined;
    }

    logger.info(`delete playlist ${playlistObjectID} by ${userID}`);
    return isSuccessful;
  })
  .catch((error) => {
    logger.error(error);
    return undefined;
  })
}

const deleteMusic = async (userID, playlistObjectID, musicID) => {
  const isOwned = await playlistModel.findOne({
    userID: userID,
    _id: mongoose.Types.ObjectId(playlistObjectID)
  })
  .then((isSuccessful) => {
    if (isSuccessful === undefined) {
      return undefined;
    }
  })
  .catch((error) => {
    logger.error(error)
    return undefined
  })

  const isDeleted = await musicModel.deleteOne({
    _id: musicID,
    playlistID: mongoose.Types.ObjectId(playlistObjectID)
  })
  .then((isSuccessful) => {
    if (isSuccessful === undefined) {
      return undefined;
    }

    logger.info(`delete playlist ${playlistObjectID} by ${userID}`);
    return isSuccessful
  })
  .catch((error) => {
    logger.error(error);
    return undefined;
  })
}

module.exports = {
  findPlaylistsByUserId,
  findMusicsByPlaylistObjectId,
  createNewPlaylist,
  addNewMusic,
  deletePlaylist,
  deleteMusic
};
