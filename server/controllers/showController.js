import axios from "axios";
import Show from '../models/Show.js';
import Movie from '../models/Movie.js';

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
});

const toMovieDocument = (movie, credits = {}) => ({
  _id: String(movie.id || movie._id), title: movie.title, overview: movie.overview || 'No overview available.',
  poster_path: movie.poster_path?.startsWith('http') ? movie.poster_path : (movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : ''),
  backdrop_path: movie.backdrop_path?.startsWith('http') ? movie.backdrop_path : (movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : ''),
  release_date: movie.release_date || '', original_language: movie.original_language,
  tagline: movie.tagline || '', genres: movie.genres || [], casts: credits.cast || movie.casts || [],
  vote_average: movie.vote_average || 0, runtime: movie.runtime || 0,
});

export const getNowPLayingMovies = async (req, res) => {
    try{
     const { data } = await tmdb.get('/movie/now_playing', { params: { language: 'en-US', page: 1 } });
        res.json({success: true, movies: data.results.map((movie) => ({
          ...movie, _id: String(movie.id), genres: [], runtime: 0,
          poster_path: movie.poster_path && `https://image.tmdb.org/t/p/original${movie.poster_path}`,
          backdrop_path: movie.backdrop_path && `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        }))})
    } catch (error) {
        console.error(error);
        res.status(error.response?.status || 500).json({success: false, message: 'Unable to load now-playing movies'})
    }
}

export const getMovieShows = async (req, res) => {
  const shows = await Show.find({ movie: req.params.movieId, showDateTime: { $gte: new Date() } }).sort('showDateTime');
  const movie = await Movie.findById(req.params.movieId);
  if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
  const dateTime = shows.reduce((result, show) => {
    const date = show.showDateTime.toISOString().slice(0, 10);
    (result[date] ||= []).push({ time: show.showDateTime, showId: show._id });
    return result;
  }, {});
  res.json({ success: true, show: { movie, dateTime } });
};

export const getMovie = async (req, res) => {
  let movie = await Movie.findById(req.params.movieId);
  if (!movie) {
    const [{ data }, { data: credits }] = await Promise.all([
      tmdb.get(`/movie/${req.params.movieId}`), tmdb.get(`/movie/${req.params.movieId}/credits`),
    ]);
    movie = toMovieDocument(data, credits);
  }
  res.json({ success: true, movie });
};

export const getShow = async (req, res) => {
  const show = await Show.findById(req.params.showId).populate('movie');
  if (!show) return res.status(404).json({ success: false, message: 'Show not found' });
  res.json({ success: true, show });
};

export const createShow = async (req, res) => {
  const { movieId, showDateTimes, showPrice } = req.body;
  if (!movieId || !Array.isArray(showDateTimes) || !showDateTimes.length || Number(showPrice) < 0) {
    return res.status(400).json({ success: false, message: 'Movie, price, and at least one show time are required' });
  }
  const [{ data }, { data: credits }] = await Promise.all([
    tmdb.get(`/movie/${movieId}`), tmdb.get(`/movie/${movieId}/credits`),
  ]);
  const movie = toMovieDocument(data, credits);
  await Movie.findByIdAndUpdate(movie._id, movie, { upsert: true, new: true, runValidators: true });
  const shows = await Show.insertMany(showDateTimes.map((showDateTime) => ({ movie: movie._id, showDateTime, showPrice })));
  res.status(201).json({ success: true, shows });
};

export const listShows = async (_req, res) => {
  const shows = await Show.find().populate('movie').sort('-showDateTime');
  res.json({ success: true, shows });
};
