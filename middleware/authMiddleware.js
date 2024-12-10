module.exports = {
    ensureAuthenticated: (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Por favor, inicia sesión para acceder a esta página');
      res.redirect('/login');
    },
  };
  