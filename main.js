console.log("hello")
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session')
const expressValidator = require('express-validator')
const app = express();

// tell express to use mustache
app.engine('handlebars', handlebars());
app.set('views', './views');
app.set('view engine', 'handlebars');

// tell express how to serve static files
app.use(express.static('public'));

// tell express to use the bodyParser middleware to parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressValidator());

// session
app.use(session({
  secret: 'jk rowling',
  resave: false,
  saveUninitialized: true
}))
// log request
app.use(morgan('dev'));
// create session
app.use((req, res, next) => {
  if (!req.session.bookList) {
    req.session.bookList = [];
  }

  console.log(req.session);
  next();

})

// configure the webroot
app.get('/', function(req, res) {
  if (req.session.bookList.length === 0) {
    res.redirect('bookForm')

  } else {
    res.render('home', {
      myBooks: req.session.bookList

    });
  }
});

app.get('/bookform', function(req, res) {
  res.render('bookForm');
});

app.get('/del/:index', function(req, res) {
  req.session.bookList.splice(req.params.index, 1);
  res.redirect('/');
})

app.post('/newBook', function(req, res) {
  let book = req.body;
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.render('bookForm', {

      errorsList: errors,
      bookFields: book

    });
  } else {

    req.session.bookList.push(book);
    res.redirect('/');

  }

})


app.listen(3000, function() {
  console.log('App is running...');
});
