/**Carga de librerías */
const express = require("express");
const multer = require("multer");
let Pelicula = require(__dirname + '/../models/pelicula');
let autenticacion  = require("../utils/auth");
let router = express.Router();
let Director = require (__dirname + '/../models/director');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
    }
})

let upload = multer({storage: storage});

/**Listado de películas */
router.get('/', autenticacion.auth, (req, res) => {

    Pelicula.find().then(resultado => {     
        if(resultado){
            res.render('admin_peliculas' , {peliculas: resultado });
        }
    }).catch(error => {
        res.render('admin_error');
    })    
});

/**Crear película */
router.get('/peliculas/nueva', autenticacion.auth, (req, res) => {

    Director.find().then(resultado=> {
        res.render('admin_peliculas_form', {directores:resultado});
    })   
})

/**Editamos película por id. Mandamos tambien directores
 * para mostrarlos en una select
 */
router.get('/peliculas/editar/:id', autenticacion.auth, (req, res) => {   

    let directores;
    Director.find().then(resultado=> {
        directores = resultado;        
    })

    Pelicula.findById(req.params['id']).populate('director').then(resultado => {
        if(resultado){
            res.render('admin_peliculas_form', {pelicula: {resultado,directores}});          
        }else  
            res.render('admin_error' , {error: "Pelicula no encontrada"});   
    }).catch(error=>{
        res.render('admin_error');
    })
});

/**Creamos película, usando upload para subir imagenes */
router.post('/peliculas', upload.single('imagen'), autenticacion.auth, (req, res) => {

    let imagen="";    
    if(req.file)
        imagen=req.file.filename; 
    let abonado=false;
    if(req.body.abonar)
        abonado=true;

    let nuevaPelicula= new Pelicula;
    if(req.body.director)
        nuevaPelicula.director.push(req.body.director)
    if(req.body.nombrePlataforma){
        nuevaPelicula.plataforma.push({
            nombre:req.body.nombrePlataforma,
            date:req.body.fechaCaducidad,
            abonado:abonado
        })
    }
    nuevaPelicula.titulo = req.body.titulo;
    nuevaPelicula.sinopsis= req.body.sinopsis;
    nuevaPelicula.duracion = req.body.duracion;
    nuevaPelicula.genero = req.body.genero;
    nuevaPelicula.imagen = imagen;
    nuevaPelicula.valoracion= req.body.valoracion;    

    nuevaPelicula.save().then(resultado => {

        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error');
    })
});

/**Hacemos un post también para editar, ya que put da problemas
 * con subir ficheros
 */
router.post('/peliculas/:id',  autenticacion.auth, upload.single('imagen'), (req, res) => {    
    let imagen="";

    let abonado=false;
    if(req.body.abonar)
        abonado=true;
    
    const nuevaPlataforma = {
        nombre:req.body.nombrePlataforma,
        fecha:req.body.fechaCaducidad,
        cantidad:abonado
    }    
    Pelicula.findByIdAndUpdate(req.params['id']).then(resultado=>{

        if(nuevaPlataforma.nombre!=""){
            resultado.plataforma.push(nuevaPlataforma);
        }
        if(req.body.director)
            resultado.director.push(req.body.director)
        if(req.file)
            imagen=req.file.filename
            else
                imagen=resultado.imagen
        resultado.titulo=req.body.titulo,
        resultado.sinopsis=req.body.sinopsis,
        resultado.duracion=req.body.duracion,
        resultado.genero=req.body.genero,
        resultado.imagen=imagen,
        resultado.valoracion=req.body.valoracion,       
        resultado.save().then(r=>{
            res.redirect(req.baseUrl);
        }).catch(() => {
            res.render('admin_error');
        })
    }).catch(error => {
            res.render('admin_error');
    })       
});

/**Borramos una película por id */
router.delete('/peliculas/:id', autenticacion.auth, (req, res) => {

    Pelicula.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {res.render('admin_error')})
  
});

/**Ruta para borrar un director buscado por id */
router.delete('/directores/borrar/:id', autenticacion.auth, (req, res) => {

    Pelicula.find({director:{$eq:req.params['id']}}).then(resultado=>{      
        if(resultado.length > 0){
            res.render('admin_error', {error:"Director asignado a película"});         
        }else{
            Director.findByIdAndRemove(req.params['id']).then(resultado => {
                res.redirect(req.baseUrl);
            }).catch(
                error => {
                    res.render('admin_error')
                }
            )         
        }
    }).catch(()=>{
        res.render('admin_error');
    })
});

/**Buscamos todos los directores para alimentar la view */
router.get('/director', autenticacion.auth, (req, res) => {

    Director.find().then(resultado=> {
        res.render('admin_listaDirectores', {directores:resultado});
    })  
});

/**Ruta para editar un director por id */
router.get('/director/editar/:id', autenticacion.auth, (req,res)=>{
    Director.findById(req.params['id']).then(resultado=>{
        res.render('admin_director', {director: resultado});
    })
});

/**Ruta para crear un nuevo director */
router.get('/director/nuevo', autenticacion.auth, (req, res)=>{
    res.render('admin_director');
});

/**Buscamos todos los directores de una pelicula para borrarlas de una lista */
router.get('/peliculas/directores/:id', autenticacion.auth, (req, res) => {

    Pelicula.findById(req.params['id']).populate('director').then(resultado=>{
            res.render('admin_peliculas_DirectoresPlataformas', {pelicula:resultado});
    }).catch(
        error => { res.render('admin_error')}
    )  
});

/**Buscamos todas las plataformas de una película para borrarlas de una lista */
router.get('/peliculas/plataformas/:id', autenticacion.auth, (req, res) => {
    Pelicula.findById(req.params['id']).then(resultado=>{
            res.render('admin_peliculas_DirectoresPlataformas', {peliculaPlataforma:resultado});
    }).catch(
        error => { res.render('admin_error')}
    )  
});

/**Ruta para crear directores  */
router.post('/directores', autenticacion.auth, (req, res) => {

    let nuevoDirector = new Director({
        nombre: req.body.nombre,
        nacimiento: req.body.nacimiento
    });

    nuevoDirector.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(
        error => { res.render('admin_error')}
    )    
});

/**Modificación de director por id */
router.put('/directores/modificacion/:id', autenticacion.auth, (req, res) =>{
  
    let fecha;
    if(req.body.nacimiento)
        fecha = req.body.nacimiento;
    Director.findByIdAndUpdate(req.params.id, {        
        $set: {
            nombre: req.body.nombre,
            nacimiento: fecha
        }
    }, {new: true}).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(
        error => { res.render('admin_error')}
    )
});

/**Eliminación de director de una película */
router.delete('/peliculas/directores/borrar/:id', autenticacion.auth, (req, res) => {
    let directores = [];

    Pelicula.findById(req.params['id']).then(resultado=>{
        resultado.director.forEach(dir =>{
            if(dir!=req.body.directorId)
                directores=dir;            
        })        
        resultado.director=directores;
        resultado.save().then(resultado=>{
            res.redirect(req.baseUrl);
        })
    })
    .catch(error=>{
                res.render('admin_error',{error:error})
    })
});

/**Ruta para borrar plataforma de una película */
router.delete('/peliculas/plataformas/borrar/:id', autenticacion.auth, (req, res) => {
    let plataforma = [];

    Pelicula.findById(req.params['id']).then(resultado=>{
        resultado.plataforma.forEach(dir =>{
            if(dir.id!=req.body.plataformaId)
                plataforma=dir;            
        })        
        resultado.plataforma=plataforma;
        resultado.save().then(resultado=>{
            res.redirect(req.baseUrl);
        })
    })
    .catch(error=>{
                res.render('admin_error',{error:error})
    })
});

module.exports = router;