
var express     = require("express"),
    app         = express(),
    passport = require("passport"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    LocalStrategy = require("passport-local").Strategy,
    passportLocalMongoose = require("passport-local-mongoose"),
     Leader = require("./models/auth"),
     Users = require("./models/model");
  
  mongoose.connect("mongodb://localhost/leaderboard");

 app.use(express.static(__dirname + "/public"));
 
 app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(require("express-session")({
    secret: "Rusty",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

// var array=[
//      {
//     image:"avatar.png",
//    id:"1",
//    name:"rhh",
//    score:"8",
//    teamid:"1"

//      },
//       {
//     image:"av2.png",
//    id:"1",
//    name:"ramesh",
//    score:"8",
//    teamid:"2"
//      },
//       {
//     image:"av1.png",
//    id:"1",
//    name:"Jayanth",
//    score:"8",
//    teamid:"3"
//      }
//      ];
// Leader.create(array,function(err, user){
//       if(err){
//           console.log(err);
//       } else {
//           console.log("NEWLY CREATED Service: ");
//           console.log(user);
//       }
//     });


app.get("/", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
   res.render("register"); 
});
app.get("/leaderboard", function(req, res){
	 Leader.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("leaderboard",{Leader:allCampgrounds});
       }
    });
});

app.post("/register", function(req, res){
    var newUser = new Users({username: req.body.username});
    Users.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/leaderboard"); 
        });
    });
});

app.post("/", passport.authenticate("local", 
    {
        successRedirect: "/leaderboard",
        failureRedirect: "/"
    }),function(req, res){
});

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}




app.listen(8000, function(){
   console.log("The leaderboard Server Has Started!");
});








