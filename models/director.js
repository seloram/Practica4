const mongoose = require("mongoose");

let directorScheme = new mongoose.Schema({
    nombre: {
        type:String,
        required:true,
        minlength:5
    },
    nacimiento: {
        type:Date
    }
})

let Director = mongoose.model('directores', directorScheme);
module.exports = Director;