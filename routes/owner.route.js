const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const OwnerModel = require("../models/owner.model");
const { TokenModel } = require("../models/token.model");
const { auth } = require("../middlewares/auth.middleware");

const ownerRouter = express.Router();

ownerRouter.post("/signup", async (req, res) => {
    const { owner_name, email, password, phone, age, city } = req.body;
    console.log(owner_name, email, password, phone, age, city);
    let existing = await OwnerModel.findOne({ email });
    if (!existing) {
        try {
            bcrypt.hash(password, 3, async function (err, hash) {
                if (err) {
                    res.status(200).json({ msg: err.message });
                } else {
                    let new_owner = new OwnerModel({ owner_name, email, password: hash, phone, age, city });
                    await new_owner.save();
                    res.status(200).json({ msg: `Owner ${owner_name} has been successfully registered!!` });
                }
            });
        } catch (error) {
            res.status(400).json({ err: err.message });
        }
    } else {
        res.status(200).json({ msg: `Owner with email ${email} already exists!!` });
    }
});

ownerRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const owner = await OwnerModel.findOne({ email });
        if (owner) {
            bcrypt.compare(password, owner.password, function (err, result) {
                if (result) {
                    var token = jwt.sign({
                        owner: owner.
                            owner_name, ownerID: owner._id
                    }, 'hotel_management', { expiresIn: '7d' });
                    res.status(200).json({ msg: `${owner.owner_name} Logged In!!`, token });
                } else {
                    res.status(200).json({ msg: "Wrong Credentials!!" });
                }
            });
        } else {
            res.status(200).json({ msg: "Signup First" });
        }
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
});


// userRoute.get("/logout", checkuser, async (req, res) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     try {
//         let bltoken = new TokenModel({token});
//         await bltoken.save();
//         res.status(200).json({msg: "User has been logged out"});
//     } catch (error) {
//         res.status(400).json({error: error.message});
//     }
// });


ownerRouter.get("/logout", auth, async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        let bltoken = new TokenModel({ token });
        await bltoken.save();
        res.status(200).json({ msg: "User has been logged out" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = ownerRouter;