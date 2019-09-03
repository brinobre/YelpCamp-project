var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    flash           = require("connect-flash"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    SeedDB          = require("./seeds");

//requiring routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

console.log(process.env.DATABASEURL);

 mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
// I moved this over from /v12/app.js for you - Ian
/*mongoose.connect("mongodb+srv://brino:yelpcamp12d@cluster0-9titf.mongodb.net/test?retryWrites=true", {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(()=> {
    console.log("connected to DB");
}).catch(err => {
    console.log("error:", err.message);
}); */


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seed the database
 //SeedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I like perky hamburgers",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server is running.. Better go catch it!");
});