import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import isoTimeFormat from '../lib/isoTimeFormat'
import { api } from '../lib/api'

const SeatLayout = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  const { id, date } = useParams(); const navigate = useNavigate()
  const [selectedSeats, setSelectedSeats] = useState([]); const [selectedTime, setSelectedTime] = useState(null); const [show, setShow] = useState(null)
  const getShow = useCallback(async () => { try { setShow((await api(`/shows/movie/${id}`)).show) } catch { setShow(false) } }, [id])
  useEffect(() => { getShow() }, [getShow])
  const selectSeat = (seat) => { if (!selectedTime) return toast('Please select a screening time first'); if (!selectedSeats.includes(seat) && selectedSeats.length === 5) return toast('You can select up to 5 seats'); setSelectedSeats((current) => current.includes(seat) ? current.filter((item) => item !== seat) : [...current, seat]) }
  if (!show) return <div className='pt-40 text-center'>{show === false ? 'This screening is unavailable.' : 'Loading...'}</div>
  const times = show.dateTime[date] || []
  return <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-32 md:pt-52 gap-12'><aside className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max'><p className='text-lg font-semibold px-6'>Available Timings</p><div className='mt-5 space-y-1'>{times.map((item) => <button key={item.showId} onClick={() => setSelectedTime(item)} className={`flex items-center gap-2 px-6 py-2 w-full text-left ${selectedTime?.showId === item.showId ? 'bg-primary text-white' : 'hover:bg-primary/20'}`}><ClockIcon className='w-4 h-4'/>{isoTimeFormat(item.time)}</button>)}</div></aside><main className='relative flex-1 flex flex-col items-center'><BlurCircle top='-100px' left='-100px'/><h1 className='text-2xl font-semibold mb-4'>Select your seats</h1><img src={assets.screenImage} alt='Cinema screen layout' /><p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p><div className='grid grid-cols-2 gap-3 max-w-md'>{rows.map((row) => <div key={row} className='flex gap-2'>{Array.from({ length: 9 }, (_, index) => { const seat = `${row}${index + 1}`; return <button key={seat} onClick={() => selectSeat(seat)} aria-pressed={selectedSeats.includes(seat)} className={`h-8 w-8 rounded border border-primary/60 ${selectedSeats.includes(seat) ? 'bg-primary text-white' : ''}`}>{seat}</button> })}</div>)}</div><button disabled={!selectedTime || !selectedSeats.length} onClick={() => navigate('/my-bookings', { state: { showId: selectedTime.showId, seats: selectedSeats } })} className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary rounded-full disabled:opacity-50'>Proceed to Checkout <ArrowRightIcon className='w-4 h-4'/></button></main></div>
}
export default SeatLayout
