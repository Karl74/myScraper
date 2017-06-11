// |I|- DEPENDENCIES ::::::::::::::::::::::::::::::::

var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var logger = require("morgan");
var mongoose = require("mongoose");


// |II|- SCRAPING TOOLS :::::::::::::::::::::::::::::
var request = require("request");
var cheerio = require("cheerio");

// |III|- MONGOOSE DATA MODULES :::::::::::::::::::::
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

// |II|- SET PACKAGES :::::::::::::::::::::::::::::::
mongoose.Promise = Promise;


var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect("mongodb://localhost/scraper");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.


// |A|- SCRAP THE ARTICLES::::::::::::::::::::::::::::

app.get("/scrape", function(req, res){

	request("https://www.theatlantic.com/", function(error, response, html){

		var $ = cheerio.load(html);
		var result = [];
		
		$("p").each(function(i, element){

			var title = $(this).text();
		    var link = $(this).attr("href");
		    result.push({
			    title: title,
			    link: link
			  });
		       	
			// console.log(result);
		});  //end of method each
			res.json(result);

	}); //end of cheerio
});//end of app.get

// |B|- ALL ARTICLES VIEW ::::::::::::::::::::::::::::
app.get("/articles", function(req, res){
	res.render("articles");
});

// |C|- SAVE AN ARTICLE ::::::::::::::::::::::::::::::
app.post("/saveArticle", function(req, res){
	
	var newArticle = new Article(req.body);
	newArticle.save(function(error, doc){
		if (error) {
			console.log(error);
		} else {
			console.log(doc);
			res.send(doc);
		}

	});
});

// |D|-  SEND SAVED ARTICLES ::::::::::::::::::::::::::::

app.get("/saved", function(req, res){
	Article.find({}, function(error, doc){
		if(error){
			console.log(error);
		} else {
			console.log(doc);
		res.json(doc);
		}
	});
});

// |E|-  RENDERPAGE WITH SAVED ARTICLES ::::::::::::::::::::::::::::

app.get("/seesaved", function(req, res){
		res.render("saved");
});

// |F|- DELETE AN ARTICLE ::::::::::::::::::::::::::::::
app.post("/deleteArticle", function(req, res){
	
	var deleteThis = req.body.id;
	console.log("delete: " +  deleteThis);
	Article.findByIdAndRemove({"_id": deleteThis}, function(err, Article){
		var response = "the item was deleted";
		res.send(response);
	});

});


// |G|- ADD A NOTE ::::::::::::::::::::::::::::::
app.post("/savenote", function(req, res){
	console.log(req.body)
	var newNote = new Note(req.body);
		newNote.save(function(error, doc){
			if (error) {
				console.log(error);
			} else {
				var response = "I got your note" + doc;
				console.log(response);
				res.send(response);
			}

		});
});

// |H|- ADD A NOTE ::::::::::::::::::::::::::::::

app.get("/looknotes/:artId", function(req, res){
	var artId = req.params.artId;
			console.log(artId)
			Article.findById(artId).populate("Notes").exec(function(err, Article){
			if(err){
				console.log(err);
			} else{
				console.log(Article.note.text);
				return res.json(Article.note.text);
			}
		});
	
});

// app.get("/looknotes", function(req, res){
// 	var articleRef = req.body.id;
// 	console.log(req.body.id);
// 	console.log(articleRef); 
// 	Note.find({"article": articleRef},function(err, Note){
// 		if(err){
// 			console.log(err);
// 		} else{
// 			console.log(Note);
// 			res.send(Note);
// 		}
// 	});
// });

// |END|- LISTENER FUNCTION :::::::::::::::::::::::::::
app.listen(3000, function(){
	console.log("App running on port 3000!")
});