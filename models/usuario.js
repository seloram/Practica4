const mongoose = require("mongoose");

let usuariosScheme = new mongoose.Schema({
    login: {
        type:String,
        required:true,
        minlength: 5,
        unique: true
    },
    password: {
        type: String,
        minlength: 8
    }
})

let Usuario = mongoose.model('usuarios', usuariosScheme);
module.exports = Usuario;