import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Heart, PlayCircle, StarIcon } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'
import DateSelect from '../components/DateSelect'
import Loading from '../components/Loading'
import timeFormat from '../lib/timeFormat'
import { api } from '../lib/api'

const MovieDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [show, setShow] = useState(null)
  const [error, setError] = useState('')
  const getShow = useCallback(async () => {
    try {
      const [{ movie }, showData] = await Promise.all([
        api(`/shows/movie-info/${id}`),
        api(`/shows/movie/${id}`).catch(() => ({ show: { dateTime: {} } })),
      ])
      setShow({ movie, dateTime: showData.show.dateTime })
    } catch (err) { setError(err.message) }
  }, [id])
  useEffect(() => { getShow() }, [getShow])
  if (error) return <div className='pt-40 text-center text-red-300'>{error}</div>
  if (!show) return <Loading />
  const { movie } = show
  return <div className='px-5 md:px-16 lg:px-35 pt-30 md:pt-50'>
    <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
      <img src={movie.poster_path} alt={`${movie.title} poster`} className='max-md:mx-auto rounded-xl h-140 max-w-70 object-cover'/>
      <div className='relative flex flex-col gap-3'><BlurCircle top='-100px' left='-100px' />
        <p className='text-primary'>{movie.original_language?.toUpperCase()}</p><h1 className='text-4xl font-semibold max-w-96 text-balance'>{movie.title}</h1>
        <div className='flex items-center gap-2 text-gray-300'><StarIcon className='w-5 h-5 text-primary fill-primary' />{Number(movie.vote_average).toFixed(1)} User Rating</div>
        <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>{movie.overview}</p><p>{timeFormat(movie.runtime)} · {(movie.genres || []).map((genre) => genre.name).join(', ')} · {movie.release_date?.split('-')[0]}</p>
        <div className='flex items-center flex-wrap gap-4 mt-4'><a href='#trailers' className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium'><PlayCircle className='w-5 h-5'/>Watch Trailer</a><a href='#dateSelect' className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium'>Buy Tickets</a><button aria-label='Add to favorites' className='bg-gray-700 p-2.5 rounded-full'><Heart className='w-5 h-5'/></button></div>
      </div>
    </div>
    <p className='text-lg font-medium mt-20'>Cast</p><div className='overflow-x-auto no-scrollbar mt-8 pb-4'><div className='flex items-center gap-4 w-max px-4'>{(movie.casts || []).slice(0, 12).map((cast) => <div key={`${cast.id}-${cast.name}`} className='flex flex-col items-center text-center'><img src={cast.profile_path?.startsWith('http') ? cast.profile_path : `https://image.tmdb.org/t/p/w185${cast.profile_path}`} alt={cast.name} className='rounded-full h-20 aspect-square object-cover'/><p className='font-medium text-xs mt-3'>{cast.name}</p></div>)}</div></div>
    {Object.keys(show.dateTime).length ? <DateSelect dateTime={show.dateTime} id={id}/> : <p className='mt-16 text-gray-400'>There are no scheduled screenings for this movie yet.</p>}
    <div className='flex justify-center mt-20'><button onClick={() => { navigate('/movies'); scrollTo(0, 0) }} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium'>Browse movies</button></div>
  </div>
}
export default MovieDetails
