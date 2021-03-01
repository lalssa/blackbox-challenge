const fs = require('fs');
const path = require('path');

const Video = require('../models/video');
const Tag = require('../models/tag');

exports.getVideos = (req, res, next) => {
  Video.find()
    .then((videos) => {
      res.render('library/video-list', {
        videos: videos,
        pageTitle: 'Personal Library',
        path: '/videos',
        searchMode: false,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // res.render('library/video-list', {
  //   pageTitle: 'Personal Library',
  // });
};

exports.getStarredVideos = (req, res, next) => {
  Video.find({ isStarred: true })
    .then((videos) => {
      res.render('library/video-list', {
        videos: videos,
        pageTitle: 'Featured Library',
        path: '/featured-videos',
        searchMode: false,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // res.render('library/video-list', {
  //   pageTitle: 'Personal Library',
  // });
};

exports.getAddVideo = (req, res, next) => {
  res.render('library/edit-video', {
    pageTitle: 'Add Video',
    path: '/library/add-video',
    hasError: false,
    editing: false,
    errorMessage: null,
    searchMode: false,
  });
};

exports.postAddVideo = (req, res, next) => {
  const { title, description } = req.body;
  const author = 'Elie Haddad';
  const image = req.file;
  if (!image) {
    return res.status(422).render('library/edit-video', {
      pageTitle: 'Add Video',
      path: '/library/add-product',
      editing: false,
      hasError: true,
      video: {
        title,
        author,
      },
      errorMessage: 'Attached file is not an image',
    });
  }

  const imageUrl = image.path;

  const video = new Video({
    title,
    author,
    description,
    imageUrl,
  });

  video
    .save()
    .then((result) => {
      res.redirect('/library');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postStarVideo = (req, res, next) => {
  const { videoId } = req.body;
  Video.findById(videoId)
    .then((video) => {
      video.isStarred = video.isStarred ? false : true;
      return video.save();
    })
    .then((result) => {
      res.redirect('/library');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postStarVideos = (req, res, next) => {
  const { videos } = req.body;
  videos.forEach((videoId) => {
    Video.findById(videoId)
      .then((video) => {
        video.isStarred = video.isStarred ? false : true;
        return video.save();
      })
      .then((result) => {
        res.send({ message: 'ok' });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.postTagVideo = (req, res, next) => {
  const { videoId, title } = req.body;
  let tag;
  let savedTag;
  let savedVideo;

  Tag.findOne({ title: title.toLowerCase() })
    .exec()
    .then((result) => {
      if (!result) {
        tag = new Tag({
          title,
        });
      } else {
        tag = result;
      }
      return tag.save();
    })
    .then((result) => {
      savedTag = result;
      return Video.findById(videoId);
    })
    .then((video) => {
      video.tags = [...video.tags, savedTag._id];
      return video.save();
    })
    .then((result) => {
      savedVideo = result;
      return Tag.findById(savedTag._id);
    })
    .then((foundTag) => {
      foundTag.videos = [...foundTag.videos, savedVideo._id];
      return foundTag.save();
    })
    .then(() => {
      res.redirect('/library');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postTagVideos = (req, res, next) => {
  const { videos, title } = req.body;
  let tag;
  let savedTag;
  let savedVideo;
  let promises = [];

  videos.forEach((videoId) => {
    promises.push(
      Tag.findOne({ title: title.toLowerCase() })
        .exec()
        .then((result) => {
          if (!result) {
            tag = new Tag({
              title,
            });
            return tag.save();
          } else {
            return result;
          }
        })
        .then((result) => {
          savedTag = result;
          console.log(
            'Logged Output ~ file: library.js ~ line 199 ~ .then ~ savedTag',
            savedTag
          );
          return Video.findById(videoId);
        })
        .then((video) => {
          newVidTags = [...video.tags, savedTag._id];
          console.log(
            'Logged Output ~ file: library.js ~ line 213 ~ .then ~ savedTag',
            savedTag
          );
          return video.update({ ...video._doc, tags: newVidTags });
        })
        .then((result) => {
          savedVideo = result;
          newTagVideos = [...savedTag.videos, savedVideo._id];
          return savedTag.update({ ...savedTag._doc, videos: newTagVideos });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        })
    );
  });
  Promise.all(promises).then(() => {
    res.status(200).send({ message: 'ok' });
  });
};

exports.getSearch = (req, res, next) => {
  Video.find()
    .then((videos) => {
      res.render('library/video-list', {
        videos: videos,
        pageTitle: 'Search Videos',
        path: '/search',
        searchMode: true,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getSearchedVideos = (req, res, next) => {
  const { searchQuery } = req.query;

  Video.find({
    description: { $regex: '.*' + searchQuery.toLowerCase() + '.*' },
  })
    .then((videos) => {
      res.render('library/video-list', {
        videos: videos,
        pageTitle: 'Search Videos',
        path: '/search/videos',
        searchMode: true,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getTags = (req, res, next) => {
  Tag.find({})
    .then((tags) => {
      res.status(200).json(tags);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
