const express = require("express");
const HotelModel = require("../models/hotel.model");
const { auth } = require("../middlewares/auth.middleware");


const hotelRouter = express.Router();
hotelRouter.use(auth);

hotelRouter.get("/", async (req, res) => {
    try {
        const hotels_arr = await HotelModel.find({ ownerID: req.body.ownerID });
        res.status(200).json({ hotels: hotels_arr });
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
});

hotelRouter.post("/add", async (req, res) => {
    try {
        const hotel = new HotelModel(req.body);
        await hotel.save();
        res.status(200).json({ msg: "New hotel has been added", hotel: req.body });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

hotelRouter.patch("/update/:id", async (req, res) => {
    const ownerIDinOwnerDoc = req.body.ownerID;
    let hotelID = req.params.id;
    try {
        const hotel = await HotelModel.findOne({ _id: hotelID });
        console.log(hotel);
        const ownerIDinHotelDoc = hotel.ownerID;
        console.log("OwnerID owner Doc", ownerIDinOwnerDoc, "OwnerID in hotel Doc", ownerIDinHotelDoc);
        if (ownerIDinHotelDoc === ownerIDinOwnerDoc) {
            await HotelModel.findByIdAndUpdate({ _id: hotelID }, req.body);
            res.status(200).json({ msg: "Hotel's Details Updated" });
        } else {
            res.status(200).json({ msg: "Not Authorized" });
        }
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
});

hotelRouter.delete("/delete/:id", async (req, res) => {
    const ownerIDinOwnerDoc = req.body.ownerID;
    let { hotelID } = req.params;
    try {
        const hotel = await HotelModel.findOne({ _id: hotelID });
        // console.log(note);
        const ownerIDinHotelDoc = hotel.ownerID;
        if (ownerIDinOwnerDoc === ownerIDinHotelDoc) {
            await HotelModel.findByIdAndDelete({ _id: hotelID });
            res.json({ msg: "Hotel Deleted" });
        } else {
            res.json({ msg: "Not Authorized" });
        }
    } catch (error) {
        res.json({ err: error.message });
    }
});

module.exports = hotelRouter;