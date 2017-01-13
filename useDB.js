// Import Mongoose into our application
var mongoose = require("mongoose");

// Connect to the example database on the MongoDB server running locally
mongoose.connect("mongodb://localhost/example");
// Create Person model
var Person = mongoose.model(
	"Person",
	mongoose.Schema({
		firstName : String, lastName : String, age : Number
	})
);

// Create two people (which are instances of People)
var p1 = new Person({
	firstName : 'John', lastName : 'King', age : 23
});
var p2 = new Person({
	firstName : 'Tim', lastName : 'Jordan', age : 19
});

// Save our people to the database
p1.save();
p2.save();

// Retrieve a person from the database
Person.find({ firstName : 'Tim' }, function(err, person) {
	console.log(person);
});
