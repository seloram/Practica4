let auth = (req, res, next) => {
    if (req.session && req.session.login)
        return next();
    else{
        res.render('auth_login');
    }
};

module.exports = {auth:auth} ;