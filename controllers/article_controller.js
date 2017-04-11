var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var Article = require("./../models/Article.js");
var Comment = require("./../models/Comment.js");


router.get("/", function(req, res) {

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
		// res.send(response);
		res.json(html);

	});
	res.send("Scrape Complete");
});
router.get("/articles", function(req, res){
	Article.find({}, function(error, doc) {
		if (error){
			console.log(error);
		}
		else {
			res.json(doc);
		}
	});
});

router.post("/articles/:id", function(req, res) {
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

module.exports = router;
