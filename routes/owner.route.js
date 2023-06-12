const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const OwnerModel = require("../models/owner.model");
const { TokenModel } = require("../models/token.model");
const { auth } = require("../middlewares/auth.middleware");

const ownerRouter = express.Router();

/**
 * @swagger
 * /owners/signup:
 *   post:
 *     summary: Signup for owners.
 *     description: 
 *     responses:
 *       200:
 *         description: Hotel Owners can signup through this API.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the user.
 *                       email:
 *                         type: string
 *                         description: The owner's email.
 *                       age:
 *                         type: string
 *                         description: age.
 *                       password:
 *                         type: string
 *                         description: password.
 *                       city:
 *                         type: string
 *                         description: Auto-generated ID of the user.
 *                       phone:
 *                         type: number
 *                         description: Name of the respective user.
 */

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

/**
 * @swagger
 * /owners/login:
 *   post:
 *     summary: Login for owners.
 *     description: 
 *     responses:
 *       200:
 *         description: Hotel Owners can login through this API.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         description: The owner's email.
 *                       password:
 *                         type: string
 *                         description: password.
 */

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

/**
 * @swagger
 * /owners/login:
 *   get:
 *     summary: Signup for owners.
 *     description: 
 *     responses:
 *       200:
 *         description: Hotel Owners can signup through this API.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         description: The owner's email.
 *                       password:
 *                         type: string
 *                         description: password.
 */


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