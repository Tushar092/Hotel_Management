const mongoose = require("mongoose");

const hotelSchema = mongoose.Schema({
    hotel_name: String,
    location: String,
    rating: Number,
    serve_food: Boolean,
    ownerID: String,
    owner: String
});

const HotelModel = mongoose.model("hotel", hotelSchema);

module.exports = HotelModel;