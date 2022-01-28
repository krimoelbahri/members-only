var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	title: { type: String, required: true },
	body: { type: String, required: true },
	author: { type: Schema.Types.ObjectId, ref: "User" },
	date: { type: Date, default: Date.now },
});

//Export model
module.exports = mongoose.model("Message", MessageSchema);
