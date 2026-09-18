import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'

const Favorite = () => {
  return <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-20 ml-20 overflow-hidden min-h-[80vh]'>
        <BlurCircle top='150px' left='0px'/>
        <BlurCircle bottom='50px' right='5px'/>
        <h1 className='text-lg font-medium my-4'>Your Favorite Movies</h1>
        <p className='text-gray-400'>Favorites will appear here after you save a movie.</p>
    </div>
}

export default Favorite
