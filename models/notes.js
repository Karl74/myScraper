var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var NoteSchema = new Schema({
  
  text: {
    type: String,
    required: true
  },
  
  
  // This only saves one note's ObjectId, ref refers to the Note model
    article: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  }
});

// 
var Note = mongoose.model("Note", NoteSchema);

// Export the model
module.exports = Note;