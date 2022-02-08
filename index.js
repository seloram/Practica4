/**Carga de librerías */
const express = require('express');
const nunjucks = require('nunjucks');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
/**Enrutadores */
const auth = require(__dirname + '/routes/auth');
const peliculas = require(__dirname + '/routes/peliculas');
const public = require(__dirname + '/routes/public');

const bodyParser = require('body-parser');
const session = require('express-session');

/**Conectar con una base de datos */
mongoose.connect(
    'mongodb://localhost:27017/FilmEsV3',
    {useNewUrlParser:true, useUnifiedTopology:true}
);
/**Recoger express en una variable */
let app = express();
/**configurar el motor de plantillas */
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
/**estableciendo el motor de plantillas */
app.set('view engine', 'njk');

/**configurar una session con express */
app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false
}));

/**Asociar la sesión con los recursos de la vista */
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

/**Carga de bodyparser para peticiones put y post 
/** datos en el body */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

/**Módulo override para mandar delete y put en oculto */
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));

/**establecemos el contenido stático
 * estilos bootstrap y directorio public
 */
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

app.use('/public', express.static(__dirname + '/public'));
// Enrutadores para cada grupo de rutas
app.use('/auth', auth);
app.use('/admin', peliculas);
app.use('/' , public);
/**puesta en marcha */
app.listen(8080);