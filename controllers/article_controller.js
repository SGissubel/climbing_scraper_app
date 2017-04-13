var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var Article = require("./../models/Article.js");
var Comment = require("./../models/Comment.js");

router.get("/", function(req, res){
	// Article.findOne
	res.render('index');
});

router.get("/scrape", function(req, res) {

	request("http://gripped.com/", function(error, response, html) {
		var $ = cheerio.load(html);


		//make an array here
		var arr = [];

		$("h3 a").each(function(i, element) {
			var result = {};
			var a = $(this);

			result.title = a.text().trim();

			result.link = a.attr('href');

			//you would push result into the array above
			arr.push(result); 

			var entry = new Article(arr);

			entry.save(function(err, doc) {

				if (err){
					console.log(err);
				}
				else{
					console.log(doc);
				}

			});
		});	
		
		//res.json the array you made above
		res.json(arr);
		// res.redirect('index');
		// res.render(html);

	});
	//res.send("Scrape Complete");
});
router.get("/articles", function(req, res){
	var query = Article.find({}); 
		query.exec(function(error, doc) {
		if (error){
			console.log(error);
		}
		else {
			res.json({Article: doc});
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
