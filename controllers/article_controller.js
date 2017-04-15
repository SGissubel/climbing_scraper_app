var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var Article = require("./../models/Article.js");
var Comment = require("./../models/Comment.js");

// router.get("/", function(req, res){
// 	// Article.findOne
// 	res.render('index');
// });

router.get("/", function(req, res){
	Article.find({
  }).then(function(article){
    res.render('index', {
      articles: article
    })
  })
 });

router.get("/scrape", function(req, res) {

	request("http://gripped.com/", function(error, response, html) {
		var $ = cheerio.load(html);


		//make an array here
		var arr = [];

		$("h3 a").each(function(i, element) {
			var result = {};
			var a = $(this);

			result['title'] = a.text().trim();

			result['link'] = a.attr('href');

			//you would push result into the array above
			arr.push(result); 

			var entry = new Article(result);
			
			Article.collection.insert(entry, onInsert);

			function onInsert(err, docs) {
			    if (err) {
			        // TODO: handle error
			    } else {
			        console.info('%d potatoes were successfully stored.', docs.length);
			    }
			}
			// entry.save(function(err, doc) {

			// 	if (err){
			// 		console.log(err);
			// 	}
			// 	else{
			// 		console.log(doc);
			// 	}

			// });
		});	
		
		//res.json the array you made above
		res.json(arr);
		// res.redirect('index');
		// res.render(html);

	});
	//res.send("Scrape Complete");
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

// Grab an article by it's ObjectId
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("comment")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

router.post("/articles/:id", function(req, res) {
	
	var newComment = new Comment(req.body);

	newComment.save(function(error, doc) {
		console.log(doc);
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
