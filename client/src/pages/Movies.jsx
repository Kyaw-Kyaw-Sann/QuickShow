import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'

const Movies = () => {
  const [movies, setMovies] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { api('/shows/now-playing').then(({ movies }) => setMovies(movies)).catch((err) => setError(err.message)) }, [])
  return movies.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-20 ml-20
        overflow-hidden min-h-[80vh]'>
        <BlurCircle top='150px' left='0px'/>
        <BlurCircle bottom='50px' right='5px'/>
        <h1 className='text-lg font-medium my-4' >Now Showing</h1>
        <div className='flex flex-wrap max-sm:justify-center gap-8'>
            {movies.map((movie) => (
                <MovieCard movie={movie} key={movie.id}/>
            ))}
        </div>
    </div>
  ):(
    <div className=' flex flex-col items-center justify-center h-screen'>
       <h1 className='text-3xl font-bold text-center'>{error || 'No movies available'}</h1>
    </div>
  )
}

export default Movies
