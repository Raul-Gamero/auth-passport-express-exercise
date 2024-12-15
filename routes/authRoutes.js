const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash('error_msg', 'Las contraseñas no coinciden');
    return res.redirect('/register');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    req.flash('success_msg', 'Te has registrado exitosamente, ahora puedes iniciar sesión');
    res.redirect('/login');
  } catch (err) {
    req.flash('error_msg', 'Error al registrar el usuario');
    res.redirect('/register');
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/forum',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'Has cerrado sesión exitosamente');
    res.redirect('/login');
  });
});

module.exports = router;
