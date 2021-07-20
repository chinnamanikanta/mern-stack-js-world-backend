const express = require("express");
const User = require('../models/user-schema');
const multer = require('multer');
const sharp = require('sharp')
const authMiddleware = require('../middlewares/authMiddleware')




const router = new express.Router();

router.post('/signup', async(req,res) => {
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })

    try {
        await user.save();
        
        res.send({"success":true,"message":"User Signup Successfully"});

    }
    catch(error) {
        res.send({"error":error})

    }
    


})

router.post('/signin', async(req,res) => {


    try {
    const user = await User.findCredentials(req.body.email,req.body.password);

   

    const token = await user.generateToken()
 
 
    res.send({
        "success":true,
        "message":"User LoggedIn Successfully",
        "token":token,
        "Email":user.email
    })

    }
    catch(err) {
        res.send({"success":false, "message":"You dont have an account please register"})
    }



})

router.get("/getuser/:email", async function(req,res){

    const email = req.params.email
    try {
    const user = await User.findOne({email});


    res.send({
        "success":true,
        "data":user
    })




    }
    catch(err) {
    res.send({"error":"this is not valid email"})
    }


})

router.patch('/editprofile',authMiddleware, async(req,res) => {
    

    const updates = Object.keys(req.body);
    const allowedKeys = ['name','password','aboutStatus'];
    const isValidateKeys = updates.every((key) => allowedKeys.includes(key));
    


    try {

     

        updates.forEach((key) => req.user[key] = req.body[key]);
        
        await req.user.save();
        res.send({
            "success":true,
            "message":"Profile updated SuccessFully",
            "data":req.user
        })
    }
    catch(err) {
        res.send({"error":err})
    }

})

router.delete('/deleteAccout', async function(req,res) {
    try {
        await req.user.remove();
        res.send({
            "success":true,
            "message":"Deleted account permnantly"
        })
    }
    catch(error) {
        res.send({"error":"unable to delete"})
    }

})

router.post('/logoutall', authMiddleware, async function(req,res) {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send({
            "success":true,
            "message":"Logout SuccussFully"
        })
    }
    catch(err) {
        res.send({"error":"Unable to logout"})
    }
})










module.exports = router