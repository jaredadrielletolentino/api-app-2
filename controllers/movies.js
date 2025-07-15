const Movie = require('../models/Movie');
const User = require('../models/User');
const auth = require('../auth');

// Add a movie (Admin only)
module.exports.addMovie = (req, res) => {
    const { title, director, year, description, genre } = req.body;

    const newMovie = new Movie({
        title,
        director,
        year,
        description,
        genre
    });

    newMovie.save()
        .then(savedMovie => {
            res.status(201).json(savedMovie);
        })
        .catch(error => auth.errorHandler(error, req, res));
};

// Get all movies
module.exports.getMovies = (req, res) => {
    Movie.find()
        .sort({ createdAt: -1 })
        .then(movies => {
            res.status(200).json(movies);
        })
        .catch(error => auth.errorHandler(error, req, res));
};

// Get single movie
module.exports.getMovie = (req, res) => {
    Movie.findById(req.params.movieId)
        .then(movie => {
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
            res.status(200).json(movie);
        })
        .catch(error => auth.errorHandler(error, req, res));
};

// Update a movie (Admin only)
module.exports.updateMovie = (req, res) => {
    const { title, director, year, description, genre } = req.body;

    Movie.findByIdAndUpdate(
        req.params.movieId,
        { title, director, year, description, genre },
        { new: true, runValidators: true }
    )
    .then(updatedMovie => {
        if (!updatedMovie) {
            return res.status(200).json({ message: 'Movie not found' });
        }
        res.status(200).json({
            message: 'Movie updated successfully',
            updatedMovie: updatedMovie
        });
    })
    .catch(error => auth.errorHandler(error, req, res));
};

// Delete a movie (Admin only)
module.exports.deleteMovie = (req, res) => {
    Movie.findByIdAndDelete(req.params.movieId) // Changed from req.params.id
        .then(deletedMovie => {
            if (!deletedMovie) {
                return res.status(200).json({ message: 'Movie not found' });
            }
            res.status(200).json({ message: 'Movie deleted successfully' });
        })
        .catch(error => auth.errorHandler(error, req, res));
};

// Add comment to a movie
module.exports.addComment = (req, res) => {
    const { comment } = req.body;

    Movie.findById(req.params.movieId)
        .then(movie => {
            if (!movie) {
                return res.status(200).json({ message: 'Movie not found' });
            }

            movie.comments.push({
                userId: req.user.id,
                comment
            });

            return movie.save();
        })
        .then(updatedMovie => {
            res.status(200).json({
                message: 'Comment added successfully',
                updatedMovie: updatedMovie
            });
        })
        .catch(error => auth.errorHandler(error, req, res));
};

// Get all comments for a movie
module.exports.getComments = (req, res) => {
    Movie.findById(req.params.movieId)
        .select('comments')
        .populate('comments.userId', 'email')
        .then(movie => {
            if (!movie) {
                return res.status(200).json({ message: 'Movie not found' });
            }
            res.status(200).json({ comments: movie.comments });
        })
        .catch(error => auth.errorHandler(error, req, res));
};

// Update a comment
module.exports.updateComment = (req, res) => {
    const { comment: newComment } = req.body;

    Movie.findById(req.params.movieId)
        .then(movie => {
            if (!movie) {
                return res.status(200).json({ message: 'Movie not found' });
            }

            const comment = movie.comments.id(req.params.commentId);
            if (!comment) {
                return res.status(200).json({ message: 'Comment not found' });
            }

            if (comment.userId.toString() !== req.user.id) {
                return res.status(200).json({ message: 'Unauthorized to update this comment' });
            }

            comment.comment = newComment;
            return movie.save();
        })
        .then(updatedMovie => {
            const updatedComment = updatedMovie.comments.id(req.params.commentId);
            res.status(200).json({
                message: 'Comment updated successfully',
                updatedComment,
                updatedMovie
            });
        })
        .catch(error => auth.errorHandler(error, req, res));
};

// Delete a comment
module.exports.deleteComment = (req, res) => {
    Movie.findById(req.params.movieId)
        .then(movie => {
            if (!movie) {
                return res.status(200).json({ message: 'Movie not found' });
            }

            const commentIndex = movie.comments.findIndex(
                comment => comment._id.toString() === req.params.commentId
            );

            if (commentIndex === -1) {
                return res.status(200).json({ message: 'Comment not found' });
            }

            const comment = movie.comments[commentIndex];
            if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
                return res.status(200).json({ message: 'Unauthorized to delete this comment' });
            }

            movie.comments.splice(commentIndex, 1);
            
            return movie.save();
        })
        .then((updatedMovie) => {
            res.status(200).json({ 
                message: 'Comment deleted successfully',
                updatedMovie 
            });
        })
        .catch(error => auth.errorHandler(error, req, res));
};