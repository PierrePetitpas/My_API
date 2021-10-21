const mongoose = require('mongoose');

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
    Imagepath: String,
    Active: Boolean
});

//creating genreSchema
let genreSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Description: {type: String, required: true}
});

//creating lableSchema
let labelSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Bio: {type: String, required: true},
    Creation: Number,
    Country: String
});

//creating userSchema
let userSchema = mongoose.Schema({
    Username: {type: String, require: true},
    Firstname: String,
    Lastname: String,
    Password: {type: String, require: true},
    Email: {type: String, require: true},
    DOB: Date,
    Favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Band'}]
});


let Band = mongoose.model('Band', bandSchema);
let Genre = mongoose.model('Genre', userSchema);
let Label = mongoose.model('Label', userSchema);
let User = mongoose.model('User', userSchema);


module.exports.Band = Band;
module.exports.Genre = Genre;
module.exports.Label = Label;
module.exports.User = User;