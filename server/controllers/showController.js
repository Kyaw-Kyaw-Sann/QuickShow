import axios from "axios"

export const getNowPLayingMovies = async (req, res) => {
    try{
     const { data } = await axios.get(`
https://api.themoviedb.org/4/account/{account_object_id}/movie/watchlist`,{
            headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
        })

        const movies = data.results
        res.json({scccess: true, movies: movies})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}