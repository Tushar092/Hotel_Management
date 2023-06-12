const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
    owner_name: String,
    email: String,
    password: String,
    phone: String,
    age: Number,
    city: String
});

const OwnerModel = mongoose.model("owner", ownerSchema);

module.exports = OwnerModel;