//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");



const app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'Our secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/meetDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



//////////////////////////////schema/////////////////////////////////

const userSchema = new mongoose.Schema({
  email: String,
  name: {
    type: String,
    unique: true,
  },
  password: String,
});

//////////////////////////////////////////////////////////////////
userSchema.plugin(passportLocalMongoose);

//////////////////////////model//////////////////////////////////

const User = new mongoose.model("User", userSchema);

////////////////////////////////////////////////////////////////

/////////////////////////passport//////////////////////////////
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


///////////////////////////get////////////////////////////////////


app.get("/", function(req, res) {
  res.render("index")
  // console.log(req.user);
})

app.get("/login", function(req, res) {
  res.render("login")
})

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/register", function(req, res) {
  res.render("register");
});


app.get("/:customGroupName", function(req, res) {
      const iD = req.params.customGroupName
      const useriD = req.body.user
      if (req.isAuthenticated()) {
        User.find(function(err, founditems) {
          res.render("home")
        });
      } else {
        res.redirect("/login");
      }
      });

    ////////////////////////post///////////////////
    app.post("/login", function(req, res) {
      const user = new User({
        username: req.body.username,
        password: req.body.password
      });
      req.login(user, function(err) {
        if (err) {
          res.render("error", {
            error: "unauthorized"
          });
        } else {
          passport.authenticate("local")(req, res, function() {
            res.redirect("/");
          });
        }
      });
    });


    app.post("/register", function(req, res) {
      const nameOfUser = req.body.name;
      User.register({
        username: req.body.username,
        name: nameOfUser,
      }, req.body.password, function(err, user) {
        if (err) {
          res.render("error", {
            error: "username or mail already exist please try with other credentials"
          });
          res.redirect("/");
        } else {
          passport.authenticate("local")(req, res, function() {
            res.redirect("/");
          });
        }
      });
    });



    /////////////////////////////listen///////////////////////////////

    let port = process.env.PORT;
    if (port == null || port == "") {
      port = 3000;
    }

    app.listen(port, function() {
      console.log("in port 3000");
    });
