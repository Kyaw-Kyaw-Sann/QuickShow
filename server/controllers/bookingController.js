import { getAuth } from '@clerk/express';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';

export const createBooking = async (req, res) => {
  const { userId } = getAuth(req);
  const { showId, seats } = req.body;
  const uniqueSeats = [...new Set(seats || [])];
  if (!showId || !uniqueSeats.length || uniqueSeats.length > 5) return res.status(400).json({ success: false, message: 'Choose between 1 and 5 seats' });
  const available = uniqueSeats.map((seat) => ({ [`occupiedSeats.${seat}`]: { $exists: false } }));
  const occupied = Object.fromEntries(uniqueSeats.map((seat) => [`occupiedSeats.${seat}`, userId]));
  const show = await Show.findOneAndUpdate({ _id: showId, $and: available }, { $set: occupied }, { new: true }).populate('movie');
  if (!show) return res.status(409).json({ success: false, message: 'One or more selected seats are no longer available' });
  const booking = await Booking.create({ user: userId, show: show._id, bookedSeats: uniqueSeats, amount: show.showPrice * uniqueSeats.length });
  res.status(201).json({ success: true, booking: { ...booking.toObject(), show } });
};

export const getMyBookings = async (req, res) => {
  const { userId } = getAuth(req);
  const bookings = await Booking.find({ user: userId }).populate({ path: 'show', populate: { path: 'movie' } }).sort('-createdAt');
  res.json({ success: true, bookings });
};

export const payBooking = async (req, res) => {
  const { userId } = getAuth(req);
  const booking = await Booking.findOneAndUpdate({ _id: req.params.bookingId, user: userId }, { isPaid: true }, { new: true });
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, booking });
};
