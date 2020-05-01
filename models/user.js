var mongoose = require('mongoose');
var crypto = require('crypto')
var uuidv1 = require('uuid/v1')

var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        maxlength:32,
        trim:true
    },
    lastname:{
        type:String,
        maxlength:32,
        trim:true
    },
    email:{
        type: String,
        required:true,
        trim:true,
        unique:true
    },
    userinfo:{
        type:String,
        trim:true
    },
    ency_password:{
        type:String,
        required:true
    },
    salt:String,
    //we always have a administrator for our website so to define this we just use
    role:{
        type:Number,  //higher the number heigher the privileges eg 0 = user, 1 = administrator
        default:0
    },
    purchess:{
        type:Array,
        default: []
    }
},{timestamps:true});

userSchema.virtual("password")
    .set(function(password){
        this._password = password
        this.salt = uuidv1();
        this.ency_password = this.securePassword(password);
    })
    .get(function(){
        return this._password;
    })



userSchema.methods = {

    authenticate : function(plainPassword){
        return this.securePassword(plainPassword) === this.ency_password
    },


    securePassword : function(plainPassword){
        if(!plainPassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
            .update(plainPassword)
            .digest('hex');
        } catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model('User',userSchema)

