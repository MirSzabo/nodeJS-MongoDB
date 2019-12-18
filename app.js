const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');

//const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
/*const passport = require('passport');
const config = require('./config/database');*/

//mongoose.connect("mongodb://localhost/newDB");
mongoose.connect('mongodb://localhost/newDB', {
    useNewUrlParser: true
});
const db = mongoose.connection;

//check connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//check for db errors
db.on("error", err => {
  console.log(err);
});

const port = 3000;
//init app
const app = express();
app.use(expressValidator());

//bring in models
const Article = require("./models/article");

//load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set public folder 
app.use(express.static(path.join(__dirname, "public")));

//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//home route
app.get("/", (req, res) => {
  //  res.send("Hello World");
  Article.find({}, function(err, articles) {
    if(err){
      console.log(err);
    } else {
      res.render("index", {
        title: "Articles",
        articles: articles
      });
    }
  });
});

//route files
let articles = require ("./routes/articles");
let users = require ("./routes/users");
app.use("/articles", articles);
app.use("/users", users);

//start server
app.listen(port, () => console.log(`Server on port ${port}`));
