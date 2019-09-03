var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")

// ================
// COMMENTS ROUTES
//=================

//comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find campground by ID
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
          res.render("comments/new", {campground: campground});   
        }
    });
});

//comments create
router.post("/", middleware.isLoggedIn, function(req, res){
    // look up campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
           Comment.create(req.body.comment, function(err, comment){
              if(err) {
                  req.flash("error", "Oops! Something went wrong!");
                  console.log(err);
              } else {
                  //add user name and id to comment
                  //comment.author.id = req.user._id;
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //save comment
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  console.log(comment);
                  req.flash("success", "Success!");
                  res.redirect("/campgrounds/" + campground._id);
              }
           });
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
            res.redirect("back");
            console.log(err);
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment}); 
        }
    });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Success! Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;