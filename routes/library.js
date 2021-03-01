const path = require('path');

const express = require('express');

const libraryController = require('../controllers/library');

const router = express.Router();

router.get('/', libraryController.getVideos);

router.get('/add-video', libraryController.getAddVideo);

router.post('/add-video', libraryController.postAddVideo);

router.post('/star-video', libraryController.postStarVideo);

router.post('/star-videos', libraryController.postStarVideos);

router.post('/tag-video', libraryController.postTagVideo);

router.post('/tag-videos', libraryController.postTagVideos);

router.get('/featured', libraryController.getStarredVideos);

router.get('/search', libraryController.getSearch);

router.get('/search/videos', libraryController.getSearchedVideos);

router.get('/tags', libraryController.getTags);

module.exports = router;
