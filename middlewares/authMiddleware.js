require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user-schema');

const authMiddleware = async function(req,res,next) {

    try {
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(token,process.env.SECREY_KEY);
        const user = await User.findOne({_id:decoded._id, 'tokens.token':token})
        if(!user) {
            throw new Error("Invalid verification")
        }


        req.token = token;
        req.user = user;

        next()

    }

    catch(error) {
        res.status(401).send({"Error":error})
    }




}

module.exports = authMiddleware