const express = require('express');


const Books = require('../models/books-schema')



const router = new express.Router();




router.post('/addbooks',async function(req,res){

    

    const books = new Books(req.body);


    try {
        await books.save();
        
        res.send({"success":true,"message":"book Successfully added"});

    }
    catch(error) {
        res.send({"error":error})

    }



})

router.get("/allbooks", async function(req,res) {

    try {
    const books = await Books.find({});
    

    res.status(200).send({
        "success":true,
        "data":books
    })


    }
    catch(error) {
        res.status(401).send({"error":"can't find url"})
    }



})

router.get('/singlebook/:id', async function(req,res) {
    const bookId = req.params.id;

    try {
        const book = await Books.findOne({_id:bookId})
       

        res.send({
            "success":true,
            "data":book
        })

    }
    catch(error) {
        res.status(401).send({"Error":"This is not required"})
    }


})





module.exports = router