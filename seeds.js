var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");
    
var data = [
    {   name: "Södertälje öken", 
        image: "https://miljonytta.se/wp-content/uploads/2013/04/%C3%96ken-1-2-1.jpg",
        description: "nice öken, var är kamelerna?"
    },
     {  name: "Södertälje Centrum parkering", 
        image: "https://www.fotoakuten.se/albums/maspalomas110611/maspalomas110611-18.jpg",
        description: "Östersjön är så fin på den här bilden"
    },
     {  name: "Södertälje Rebuplik", 
        image: "http://www.wardwines.se/wp-content/uploads/2018/08/ar_marockanskt_vin_oken_large.jpg",
        description: "Nice kameler!"
    }
];    

function SeedDB(){
    //remove all campgrounds
        Campground.deleteMany({}, function(err){
            if(err){
                console.log(err);
            } else{
                console.log("Remove campgrounds");  
            }
            //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log("Added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "Vart kan man hyra en kamel?",
                            author: "Jimmy Åkesson"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        } else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment");
                        }
                    });
                }
            });
        });
    });

    //add a few comments
}    

module.exports = SeedDB;