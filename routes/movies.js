//[SECTION] Activity: Dependencies and Modules
const express = require('express');
const movieController = require('../controllers/movie');
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// Public routes
router.get('/getMovies', movieController.getMovies);
router.get('/getMovie/:movieId', movieController.getMovie);

// Comment routes (authenticated users)
router.patch('/addComment/:movieId', verify, movieController.addComment);
router.get('/getComments/:movieId', verify, movieController.getComments);
// router.patch('/updateComment/:movieId/:commentId', verify, movieController.updateComment);
// router.delete('/deleteComment/:movieId/:commentId', verify, movieController.deleteComment);

// Admin-only routes
router.post('/addMovie', verify, verifyAdmin, movieController.addMovie);
router.patch('/updateMovie/:movieId', verify, verifyAdmin, movieController.updateMovie);
router.delete('/deleteMovie/:movieId', verify, verifyAdmin, movieController.deleteMovie);

//[SECTION] Activity: Export Route System
module.exports = router;