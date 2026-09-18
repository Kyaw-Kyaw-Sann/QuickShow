import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: String, required: true, ref: 'User', index: true },
  show: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Show', index: true },
  bookedSeats: { type: [String], required: true, validate: [(seats) => seats.length > 0, 'Select at least one seat'] },
  amount: { type: Number, required: true, min: 0 },
  isPaid: { type: Boolean, default: false },
}, { timestamps: true });

bookingSchema.index({ show: 1, bookedSeats: 1 });
export default mongoose.model('Booking', bookingSchema);
