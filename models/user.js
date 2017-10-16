var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");
    //var bcrypt = require("bcrypt-nodejs");

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    avatar: String,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose); //WARNING: COMES AFTER SCHEMA DEFINITION

module.exports = mongoose.model("User", userSchema);