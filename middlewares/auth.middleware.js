const jwt = require("jsonwebtoken");
const { TokenModel } = require("../models/token.model");

const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        let bltoken = await TokenModel.find({ token });
        if (bltoken.length != 0) {
            res.status(200).json({ msg: "Please Login again!!" });
        } else {
            try {
                jwt.verify(token, "hotel_management", (error, decoded) => {
                    if (decoded) {
                        req.body.ownerID = decoded.ownerID;
                        req.body.owner = decoded.owner;
                        console.log(req.body.ownerID, req.body.owner);
                        next();
                    } else {
                        res.status(200).json({ msg: error.message });
                    }
                });
            } catch (error) {
                res.status(400).json({ err: error.message });
            }
        }
    } else {
        res.status(200).json({ msg: "Please Login first!!" });
    }
}

module.exports = { auth }