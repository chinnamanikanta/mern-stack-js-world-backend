require('dotenv').config();
const express = require('express');
const mongo = require('./db/mongoose');
const logger = require('morgan');
const path = require('path');
const cors = require("cors");
const booksRoute = require('./routes/books-route');
const userRoute = require('./routes/user-routes');

const app = express();


const port = process.env.PORT || 8000

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(logger('dev'))


app.use(cors({origin: "http://localhost:5500", credentials: true}));

app.get('/', (req,res) => {
    res.send("hello world")
})
app.use('/users',userRoute);
app.use('/books',booksRoute);

mongo.then(()=> {
    app.listen(port, () => {
        console.log("Server is connecting!!!!")
})

})
.catch(err => {
    console.log(err)
})
