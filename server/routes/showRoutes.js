import express from 'express'
import { createShow, getMovie, getMovieShows, getNowPLayingMovies, getShow, listShows } from '../controllers/showController.js'
import { requireAdmin } from '../middleware/auth.js'

const showRouter = express.Router()

showRouter.get('/now-playing', getNowPLayingMovies)
showRouter.get('/', requireAdmin, listShows)
showRouter.get('/movie/:movieId', getMovieShows)
showRouter.get('/movie-info/:movieId', getMovie)
showRouter.get('/:showId', getShow)
showRouter.post('/', requireAdmin, createShow)

export default showRouter;
