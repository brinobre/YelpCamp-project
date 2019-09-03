var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");


//root route
router.get("/", function(req, res){
   res.render("landing"); 
});

//=============
// AUTH ROUTES
//=============

// show register form
router.get("/register", function(req, res) {
   res.render("register"); 
});
//handle sign up logic
router.post("/register", function(req, res) {
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err) {
           console.log(err);
           req.flash("error", err.message);
           res.redirect("register");
       } else {
           passport.authenticate("local")(req, res, function(){
               req.flash("success", "Welcome to YelpCamp " + user.username + "!");
               res.redirect("/campgrounds");
           });
       }
   });
});


// SHOW LOGIN FORM
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "You logged out!")
   res.redirect("/campgrounds");
});

module.exports = router;