var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var ArticleSchema = new Schema({

  title: {
    type: String
  }
  // Just a string
  // body: {
  //   link: String
  // }
});


var Article = mongoose.model("Article", ArticleSchema);

// Export the Note model
module.exports = Article;
