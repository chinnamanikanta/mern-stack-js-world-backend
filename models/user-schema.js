require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        trim:true
    },
    email: {
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    password: {
        type:String,
        required:true,
        trim:true,
        
    },
    role: {
        type:String,
        default:"user"


    },
    aboutStatus: {
        type:String,
        default:""
    },
    profile: {
        type:Buffer
    },
    verified: {
        type:Boolean,
        default:false

    },
    tokens: [{
        token: {
            type:String,
            required:true
        }
    }


    ],
    mybooks:[{}]

},{
    timestamps:true
})

userSchema.virtual('books', {
    ref:'Books',
    localField: '_id',
    foreignField:'owner'
})

userSchema.statics.findCredentials = async (email,password) => {
    
    
    const user = await User.findOne({email});

    if(!user) {
        return user;
    }

    const isMatch = await bcrypt.compare(password,user.password);




    if(!isMatch) {
        throw new Error('Unable to match password')
    }

    return user

} 

userSchema.methods.generateToken = async function() {
    const user = this;


    const token  = jwt.sign({_id:user._id.toString()}, process.env.SECREY_KEY);

    user.tokens = user.tokens.concat({token});
    console.log(user)
    await user.save();

    return token;



}


userSchema.pre('save', async function(next) {
    let user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }

    next();




} )

const User = mongoose.model('User',userSchema);
module.exports = User;