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

const upload = multer({
    limits: {
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload the Image"))
        }

        cb(undefined,true)


    }
})

router.post('/profile/me', authMiddleware, upload.single('profile'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.profile = buffer;
    await req.user.save();
    res.send({ 
        "success":true,
        "message":"profile updloaded"
    })
}, (error,req,res,next) => {
    res.send({"error":error.message})
} 
)

router.delete('/profile/me/delete', authMiddleware, async (req, res) => {
    req.user.profile = undefined
    await req.user.save()
    res.send()
})

router.get('/profile/:id/me', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.profile) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send({profile: user.profile})
    } catch (e) {
        res.send({"Error":"Didnt find profile"})
    }
})










module.exports = router