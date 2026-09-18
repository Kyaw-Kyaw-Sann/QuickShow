import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { api } from '../lib/api'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$'
  const { isSignedIn, getToken } = useAuth(); const { state } = useLocation()
  const [bookings, setBookings] = useState([]); const [loading, setLoading] = useState(true)
  const loadBookings = useCallback(async () => {
    if (!isSignedIn) { setLoading(false); return }
    try { setBookings((await api('/bookings/my', { headers: { Authorization: `Bearer ${await getToken()}` } })).bookings) } catch (error) { toast.error(error.message) } finally { setLoading(false) }
  }, [getToken, isSignedIn])
  useEffect(() => { loadBookings() }, [loadBookings])
  useEffect(() => {
    const create = async () => {
      if (!state?.showId || !isSignedIn) return
      try { await api('/bookings', { method: 'POST', headers: { Authorization: `Bearer ${await getToken()}` }, body: JSON.stringify(state) }); toast.success('Booking reserved'); loadBookings() } catch (error) { toast.error(error.message) }
    }
    create()
  }, [getToken, isSignedIn, loadBookings, state])
  const pay = async (id) => { try { await api(`/bookings/${id}/pay`, { method: 'POST', headers: { Authorization: `Bearer ${await getToken()}` } }); toast.success('Payment status updated'); loadBookings() } catch (error) { toast.error(error.message) } }
  if (loading) return <Loading />
  if (!isSignedIn) return <div className='pt-40 text-center'>Please sign in to view or make bookings.</div>
  return <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'><BlurCircle top='100px' left='100px'/><h1 className='text-lg font-semibold mb-4'>My Bookings</h1>{!bookings.length && <p className='text-gray-400'>You have no bookings yet.</p>}{bookings.map((item) => <div key={item._id} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'><div className='flex flex-col md:flex-row'><img src={item.show.movie.poster_path} alt={`${item.show.movie.title} poster`} className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'/><div className='flex flex-col p-4'><p className='text-lg font-semibold'>{item.show.movie.title}</p><p className='text-gray-400'>{timeFormat(item.show.movie.runtime)}</p><p className='text-gray-400 text-sm mt-auto'>{dateFormat(item.show.showDateTime)}</p></div></div><div className='flex flex-col md:items-end md:text-right justify-between p-4'><div className='flex items-center gap-4'><p className='text-2xl font-semibold mb-3'>{currency}{item.amount}</p>{!item.isPaid && <button onClick={() => pay(item._id)} className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full'>Mark Paid</button>}</div><div className='text-sm'><p><span className='text-gray-400'>Tickets: </span>{item.bookedSeats.length}</p><p><span className='text-gray-400'>Seats: </span>{item.bookedSeats.join(', ')}</p></div></div></div>)}</div>
}
export default MyBookings
