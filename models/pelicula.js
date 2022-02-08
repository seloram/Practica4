const mongoose = require("mongoose");

let plataformaScheme = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 2,
        trim:true
    },
    fecha: {
        type:Date,
        default:Date.now()
    },
    cantidad: {
        type: Boolean,
        default:false
    }

})

let peliculasScheme = new mongoose.Schema({
    titulo: {
        type:String,
        required:true,
        minlength:2,
        trim:true
    },
    sinopsis: {
        type:String,
        required:true,
        minlength:10,        
    },
    duracion: {
        type:Number,
        required:true,
        min:0
    },
    genero: {
        type:String,
        required:true,
        enum: ['comedia', 'terror', 'drama', 'aventuras', 'otros']
    },
    imagen: {
        type:String
    },
    valoracion: {
        type:Number,
        min:0,
        max:5
    },
    plataforma: [plataformaScheme],
    director: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'directores'
    }]
})

let Pelicula = mongoose.model('peliculas', peliculasScheme);
module.exports = Pelicula;