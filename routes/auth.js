/**Carga de librerías */
const express = require("express");
const session = require("express-session");
const CryptoJS = require("crypto-js");
const Usuario = require("../models/usuario");
const usuarios = require("../utils/generar_usuarios");

/**Introducimos el nuevo usuario */
usuarios.generar();
let router = express.Router();

let app = express();
app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Vista de login
router.get('/login', (req, res) => {
    res.render('auth_login');
});

/**Se busca un usuario con el mismo nombre y contraseña introducidos
 * Primero se desencripta el pass de la BD para compararlo con 
 * el pass introducido por teclado
 * Luego se almacena la sesión
 */
router.post('/login', (req, res) => {
    let login = req.body.login;
    let password = req.body.password;
    let existeUsuario;
    Usuario.find().then(usuarios => {
        existeUsuario = usuarios.filter(usu => {
     
            let passEncripted  = CryptoJS.AES.decrypt(usu.password, 'passUsu');
            let originalText = passEncripted.toString(CryptoJS.enc.Utf8);            
            if(usu.login == login && password == originalText)
                return true;          
        })   
        if(existeUsuario.length>0){   
            req.session.login = existeUsuario[0].login;
            req.session.password = existeUsuario[0].password;            
            res.redirect("/admin/");
        }else{
            res.render('auth_login', {error: "Usuario o contraseña incorrectos"});
        }  
    });
});

// Ruta para logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;