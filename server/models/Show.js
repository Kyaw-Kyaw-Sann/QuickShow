import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
    {
        movie: {type: String, requied: true, ref: 'MOvie'},
        showDateTime: {type: Date, requied: true},
        showPrice: {type: Number, requied: true},
        occupiedSeats: {type: Object, default:{}},
    }, {minimize: false}
)

const Show = mongoose.model("Show",showSchema)

export default Show;