var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");
    
var dataCampgrounds = [
    {
        name: "Yellow Stone",
        image: "https://www.gannett-cdn.com/-mm-/123a9632d20f8337c599f6e9f28314a1e275e3e3/c=3-0-1362-768/local/-/media/2018/03/06/USATODAY/USATODAY/636559460866264567-1-Yellowstone-Kris-Wiktor-shutterstock-96972083.jpg?width=1600&height=800&fit=crop",
    },
    {
        name: "Banff",
        image: "https://samesun.com/wp-content/uploads/2018/04/Banff.4x6.hikerlake.jpg",
    },
    {
        name: "Mt Blanc",
        image: "https://www.rei.com/adventures/assets/adventures/images/trip/core/europe/tmx_hero",
    }
];

function seedDB() {
    Campground.remove({}, function(err, result){
        if(err) {
            console.log("err removing all campgrounds.");
            console.log(err);
        } else {
            console.log("successfully removed all campgrounds.");
            console.log(result);
            Comment.remove({}, function(err, result){
                if(err) {
                    console.log("err removing all comments.");
                    console.log(err);
                } else {/*
                    console.log("successfully removed all comments.");
                    console.log(result);
                    dataCampgrounds.forEach(function(dataCampground) {
                        Campground.create(dataCampground, function(err, createdCampground){
                            if(err) {
                                console.log("err:");
                                console.log(err);
                            } else {
                                console.log("successfully created campground:");
                                console.log(createdCampground);
                                Comment.create({
                                    author: "Xiaohuan Li",
                                    text: "The first comment for Camp " + createdCampground.name + "!",
                                }, function(err, createdComment) {
                                    if(err) {
                                       console.log("err:");
                                       console.log(err);
                                   } else {
                                       console.log("successfully created comment:");
                                       console.log(createdComment);
                                       createdCampground.comments.push(createdComment);
                                       createdCampground.save();
                                       console.log("and associated and saved with campground.");
                                   }
                                });
                            }
                        });
                    });                      */
                }
            });
        }
    });
}

module.exports = seedDB;