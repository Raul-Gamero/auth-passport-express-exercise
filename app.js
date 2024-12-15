const express = require('express');
const PORT = process.env.PORT || 3000;
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const path = require('path');

const {engine} = require('express-handlebars');

dotenv.config();
const app = express();

app.engine('hbs', engine({ extname: '.hbs' }));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

require('./utils/passportConfig')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', require('./routes/authRoutes'));
app.use('/forum', require('./routes/forumRoutes'));




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
