const mongoose = require('mongoose');
const CryptoJS = require("crypto-js");

mongoose.connect(
    'mongodb://localhost:27017/FilmEsV3',
    {useNewUrlParser:true, useUnifiedTopology:true}
);

let pass = 'ramajo1111';
var ciphertext = CryptoJS.AES.encrypt(pass, 'passUsu').toString();

/**Creamos un usuario al que encriptamos su password con AES
 * después de borrar la colección del usuario y salvamos el
 * nuevo documento
 */
function generar(){
    let Usuario = require(__dirname + '/../models/usuario');

    Usuario.collection.drop();

    let usu1 = new Usuario({
        login: 'ramajo',
        password: ciphertext
    });
    
    usu1.save();
    
}

module.exports = {generar: generar};