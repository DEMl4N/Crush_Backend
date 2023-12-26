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

const musicSchema = mongoose.Schema({
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
      return [];
    }

    logger.info(`find_playlists by ${userID}: ${isSuccessful}`);

    const playlists = isSuccessful.map((playlist) => {
      return {
        playlistID: playlist._id.toString(),
        playlistName: playlist.name,
        numberOfMusics: playlist.numberOfMusics,
        thumbnailUrl: playlist.thumbnail.url
      };
    });

    return playlists;
  })
  .catch((error) => {
    logger.error(error);
    return undefined;
  });

  return playlists;
};

const findMusicsByPlaylistObjectId = async (playlistObjectID) => {
  const musics = await musicModel.find({
    playlistID: new mongoose.Types.ObjectId(playlistObjectID)
  })
  .then((isSuccessful) => {
    if (!isSuccessful) {
      return undefined;
    }
    logger.info(`find_musics in ${playlistObjectID} by ${userID}: ${isSuccessful}`);

    const musics = []
    isSuccessful.forEach((music) => {
      musics.push({
        musicID: music._id.toString(),
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
      console.log("E1");
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
      return isSuccessful;
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
    _id: new mongoose.Types.ObjectId(playlistObjectID),
  })
  .then((isSuccessful) => {
    if (isSuccessful === undefined) {
      return false;
    }
    return isSuccessful;
  })
  .catch((error) => {
    logger.error(error);
    return undefined;
  });

  if (isValid === undefined || isValid === false) {
    return undefined;
  }

  const newMusic = await musicModel.create({
    playlistID: new mongoose.Types.ObjectId(playlistObjectID),
    name: musicName,
    artist: artist,
    url: url
  })
  .then((isSuccessful) => {
    if (isSuccessful) {
      logger.info(`add music ${musicName} to ${playlistObjectID} by ${userID}`);
      return isSuccessful;
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
    _id: new mongoose.Types.ObjectId(playlistObjectID)
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
  });

  return isDeleted;
}

const deleteMusic = async (userID, playlistObjectID, musicID) => {
  const imageName = undefined;

  const isOwned = await playlistModel.findOne({
    userID: userID,
    _id: new mongoose.Types.ObjectId(playlistObjectID)
  })
  .then((isSuccessful) => {
    if (isSuccessful === undefined) {
      return undefined;
    }
    imageName = isSuccessful.thumbnail.name;
  })
  .catch((error) => {
    logger.error(error)
    return undefined
  })

  const isDeleted = await musicModel.deleteOne({
    _id: musicID,
    playlistID: new mongoose.Types.ObjectId(playlistObjectID)
  })
  .then((isSuccessful) => {
    if (isSuccessful === undefined) {
      return undefined;
    }
    logger.info(`delete playlist ${playlistObjectID} by ${userID}`);
  })
  .catch((error) => {
    logger.error(error);
    return undefined;
  });

  if (imageName !== undefined) {
    const blob = bucket.file(imageName);
    if (blob == null) {
      return undefined;
    }
    blob.delete();
  }
  
  return isDeleted;
}

module.exports = {
  findPlaylistsByUserId,
  findMusicsByPlaylistObjectId,
  createNewPlaylist,
  addNewMusic,
  deletePlaylist,
  deleteMusic
};
