'use strict';

// var express = require("express");
// var router = express.Router();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var articleController = require("../controllers/article_controller.js");


var ArticleSchema = new Schema({
	title: {
		type: String,
		require: true
	},
	link: {
		type: String,
		require: true
	},
	comment: {
		type: Schema.Types.ObjectId,
		ref: "Comment"
	}
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;