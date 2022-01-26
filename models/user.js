var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String, required: true },
	password: { type: String, required: true },
});

//Export model
module.exports = mongoose.model("USER", UserSchema);
