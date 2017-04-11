//MONGODB_URI: mongodb://heroku_8s39hndv:dhmvn2d1sv1qq00s31jqtts9vq@ds159180.mlab.com:59180/heroku_8s39hndv
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

//requiring models
var Article = require("./models/Article.js")
var Comment = require("./models/Comment.js")



var request = require("request");
var cheerio = require("cheerio");
mongoose.Promise = Promise;
var app = express();

app.use(logger("dev"));
app. use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://heroku_8s39hndv:dhmvn2d1sv1qq00s31jqtts9vq@ds159180.mlab.com:59180/heroku_8s39hndv");
var db = mongoose.connection;

db.on("error", function(error) {
	console.log("Mongoose Erro: ", erorr);
});

db.once("open", function(){
	console.log("Mongoose connection sucessful.");
});

app.get("/scrape", function(req, res) {

	request("http://www.climbing.com/", function(error, response, html) {
		var $ = cheerio.load(html);

		$("article h2").each(function(i, element) {
			var result = {};

			result.title = $(this).children("a").text();
			result.link = $(this).children("a").attr("href");

			var entry = new Article(result);

			entry.save(function(err, doc) {

				if (err){
					console.log(err);
				}
				else{
					console.log(doc);
				}
			});
		});
	});
	res.send("Scrape Complete");
});
app.get("/articles", function(req, res){
	Article.find({}, function(error, doc) {
		if (error){
			console.log(error);
		}
		else {
			res.json(doc);
		}
	});
});

app.post("/articles/:id", function(req, res) {
	var newComment = new Comment(req.body);

	newComment.save(function(error, doc) {
		if (error) {
			console.log(error);
		}
		else {
			Article.findOneAndUpdate({ "_id": req.params.id }, { "comment": doc._id})

			.exec(function(err, doc) {
				if (err) {
					console.log(err);
				}
				else {
					res.send(doc);
				}
			});
		}
	});
});


app.listen(3000, function(){
	console.log("App Running on Port 3000");
	});



