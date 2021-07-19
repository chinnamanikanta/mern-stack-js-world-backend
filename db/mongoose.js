const mongoose = require('mongoose');

module.exports = mongoose.connect('mongodb+srv://mani:Mani4004@cluster0.uda2p.mongodb.net/books-app?retryWrites=true&w=majority',{
     useUnifiedTopology:true,
    useFindAndModify:false,
    useNewUrlParser: true ,
    useCreateIndex:true

})
