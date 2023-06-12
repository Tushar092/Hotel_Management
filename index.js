const express = require("express");
const hotelRouter = require("./routes/hotel.route");
const ownerRouter = require("./routes/owner.route");
const connection = require("./db");

const app = express();
app.use(express.json());

app.use("/owners", ownerRouter);
app.use("/hotels", hotelRouter);

app.listen(4500, async () => {
    try {
        await connection;
        console.log("Connected and Server is running at port 4500");
    } catch (error) {
        console.log(error.message);
    }
});