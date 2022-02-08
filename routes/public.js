const express = require("express");
let Pelicula = require(__dirname + '/../models/pelicula');
let Director = require(__dirname + '/../models/director');
let router = express.Router();

/**ruta para conseguir todas las películas */
router.get('/', (req, res) => {
    
    Pelicula.find().then(resultado =>{
        if(resultado)
            res.render('public_index', {peliculas: resultado });
        else
            res.render('public_error', {error: "No se encontraron películas"})
    }).catch(error => {res.render('public_error');})
});

/**ruta para buscar una película por título */
router.get('/public/buscar/titulo', (req, res) => {

    Pelicula.find({titulo: req.query['titulo']}).then(resultado =>{
        if(resultado)
            res.render('public_index', {peliculas: resultado });
        else
            res.render('public_error', {error: "No se encontraron películas"})
    }).catch(error => {res.render('public_error');})
    
});

/**Ruta para ver la ficha de una película concreta */
router.get('/pelicula/:id', (req, res) => {
    Pelicula.findById(req.params.id).populate('director').then(resultado => {
        if(resultado){
            res.render('public_pelicula', {pelicula: resultado});
        }else{
            res.render('public_error', {error: "Pelicula no encontrada"});
        }
    }).catch(error => {res.render('public_error');})
});

module.exports = router;