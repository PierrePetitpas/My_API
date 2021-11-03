const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//creating bandSchema
let bandSchema = mongoose.Schema({
    Name: {type: String, require: true},
    Description: {type: String, require: true },
    Genre: {
        Name: String,
        Description: String
    },
    Label: {
        Name: String,
        Bio: String,
        Creation: Number,
        Country: String
    },
    Country: String,
    Continent: String,
    Creation: Number,
    ImagePath: String,
    Active: Boolean
});

//creating userSchema
let userSchema = mongoose.Schema({
    Username: {type: String, require: true},
    Password: {type: String, require: true},
    Firstname: String,
    Lastname: String,
    Email: {type: String, require: true},
    DOB: Date,
    Favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Band'}]
});

//Hashing of Password//
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  //Compares Passwords that have been hashed//
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };

let Band = mongoose.model('Band', bandSchema);
let User = mongoose.model('User', userSchema);


module.exports.Band = Band;
module.exports.User = User;