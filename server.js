//MONGODB_URI: mongodb://heroku_8s39hndv:dhmvn2d1sv1qq00s31jqtts9vq@ds159180.mlab.com:59180/heroku_8s39hndv
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var methodOverride = require("method-override")
var path = require("path")


var articleController = require("./controllers/article_controller.js");


var request = require("request");
var cheerio = require("cheerio");
mongoose.Promise = Promise;
var app = express();

app.use(logger("dev"));
 

 app.use(express.static(process.cwd() + "/public"));
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(methodOverride("_method"));


 var exphbs = require("express-handlebars");

 app.engine("handlebars", exphbs({ defaultLayout: "main"}));
 
 app.set("view engine", "handlebars");

 app.use('/', articleController);

mongoose.connect("mongodb://heroku_8s39hndv:dhmvn2d1sv1qq00s31jqtts9vq@ds159180.mlab.com:59180/heroku_8s39hndv");
var db = mongoose.connection;

db.on("error", function(error) {
	console.log("Mongoose Error: ", erorr);
});

db.once("open", function(){
	console.log("Mongoose connection sucessful.");
});




var PORT = proncess.env.PORT || 3000;


app.listen(3000, function(){
	console.log("App Running on Port 3000");
	});



