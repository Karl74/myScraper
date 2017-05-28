var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var logger = require("morgan");
var mongoose = require("mongoose");


// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");


var port = 3000;

var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

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
		       	
			console.log(result);
		});  //end of method each
			res.json(result);

	}); //end of cheerio
});//end of app.get

// |B|- ALL ARTICLES VIEW ::::::::::::::::::::::::::::
app.get("/articles", function(req, res){
	res.render("articles");
});


// |END|- LISTENER FUNCTION :::::::::::::::::::::::::::
app.listen(3000, function(){
	console.log("App running on port 3000!")
});