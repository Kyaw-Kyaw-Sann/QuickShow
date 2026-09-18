import express from 'express'
import { getNowPLayingMovies } from '../controllers/showController.js'

const showRouter = express.Router()

showRouter.get('/now-playing', getNowPLayingMovies)

export default showRouter;