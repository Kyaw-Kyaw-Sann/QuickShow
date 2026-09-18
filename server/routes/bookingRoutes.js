import express from 'express';
import { requireAuth } from '@clerk/express';
import { createBooking, getMyBookings, payBooking } from '../controllers/bookingController.js';

const bookingRouter = express.Router();
bookingRouter.use(requireAuth());
bookingRouter.get('/my', getMyBookings);
bookingRouter.post('/', createBooking);
bookingRouter.post('/:bookingId/pay', payBooking);
export default bookingRouter;
