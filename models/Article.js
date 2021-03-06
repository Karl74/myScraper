var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var ArticleSchema = new Schema({

  title: {
    type: String
  },
  
  note: [{
  	type: Schema.Types.ObjectId,
  	ref: "Note"
  }]
  
});


var Article = mongoose.model("Article", ArticleSchema);

// Export the Note model
module.exports = Article;
