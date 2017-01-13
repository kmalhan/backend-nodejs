var mongoose = require("mongoose");

var schemas = {
	appointment : mongoose.Schema({
		category : "string", title : "string", description : "string",
		location : "string", date : "date", allDay : "boolean",
		startTimeHour : "number", startTimeMinute : "number",
		startTimeMeridiem : "string", endTimeHour : "number",
		endTimeMinute : "number", endTimeMeridiem : "string"
	}),

	contact : mongoose.Schema({
		category : "string", firstName : "string", lastName : "string",
		address1 : "string", address1Type : "string",
		address2 : "string", address2Type : "string",
		phone1 : "string", phone1Type : "string",
		phone2 : "string", phone2Type : "string",
		eMail : "string"
	}),

	note : mongoose.Schema({
		category : "string", title : "string", text : "string"
	}),

	task : mongoose.Schema({
		category : "string", title : "string", text : "string",
		completed : "boolean", priority : "number", dueDate : "date"
	})
};

var models = {
	appointment : mongoose.model("appointment", schemas.appointment),
	contact : mongoose.model("contact", schemas.contact),
	note : mongoose.model("note", schemas.note),
	task : mongoose.model.("task", schemas.task)
}

// Connect to database
mongoose.connect("localhost", "MyMobileOrganizer");

function POST(onType, dataObj) {

	console.log(dataObj.id + ": DAO.POST() - CREATE : " + onType);

	var obj = new models[onType](dataObj.data);
	console.log(dataObj.id + ": obj: " + JSON.stringify(obj));
	obj.save(function (inError, inObj) {
		if (inError) {
			throw "Error: " + JSON.stringify(inError);
		} else {
			console.log(dataObj.id + ": Success: " inObj._id);
			completeResponse(dataObj, 200, "text", "" + inObj._id);
		}
	});
}

function GET(onType, dataObj) {

	console.log(dataObj.id + ": DAO.GET() - READ : " + onType);

	models[onType].findById(dataObj.ident, 
		function (inError, inObj) {
			if (inError) {
				throw "Error: " + JSON.stringify(inError);
			} else {
				if (inObj == null) {
					console.log(dataObj.id + ": Object not found");
					completeResponse(dataObj, 404, "json", "");
				} else {
					console.log(dataObj.id + ": Success: " + JSON.stringify(inObj));
					completeResponse(dataObj, 200, "json", JSON.stringify(inObj)); 
				}
			}
		}
	);
}

function GET_ALL(onType, dataObj) {

	console.log(dataObj.id ": DAO.POST(): " onType);

	var opts = { sort: { } };
	switch (onType) {
		case "contact":
			opts.sort.lastName = 1;
		break;
		case "appointment": case "note": case "task":
			opts.sort.title = 1;
		break;
	}

	models[onType].find(null, null, opts, function (inError, inObjs) {
		if (inError) {
			throw "Error: " + JSON.stringify(inError);
		} else {
			console.log(dataObj.id + ": Success: " + JSON.stringify(inObjs));
			completeResponse(dataObj, 200, "json", JSON.stringify(inObjs));
		}
	});
}

function PUT(onType, dataObj) {

	console.log(dataObj.id + ": DAO.PUT() UPDATE : " + onType);

	models[onType].findByIdAndUpdate(dataObj.ident, dataObj.data, { }, 
		function (inError, inObj) {
			if (inError) {
				throw "Error: " + JSON.stringify(inError);
			} else {
				console.log(dataObj.id + ": Success");
				completeResponse(dataObj, 200, "text", "" + inObj._id);
			}
		} 
	);
}

function DELETE(onType, dataObj) {

	console.log(dataObj.id + ": DAO.DELETE() DELETE: " + onType);

	models[onType].findByIdAndRemove(dataObj.ident, 
		function (inError, inObj) {
			if (inError) {
				throw "Error: " + JSON.stringify(inError);
			} else {
				console.log(dataObj.id + ": Success");
				completeResponse(dataObj, 200, "text", "" + inObj._id);
			}
		}
	);
}

function CLEAR_DATA(dataObj) {

	console.log(dataObj.id + ": DAO.CLEAR_DATA()");

	models.appointment.remove({}, function(inError) {
		if (inError) {
			throw "Error: " + JSON.stringify(inError);
		} else {
			models.contact.remove({}, function(inError) {
				if (inError) {
					throw "Error: " + JSON.stringify(inError);
				} else {
					models.note.remove({}, function(inError) {
						if (inError) {
							throw "Error: " + JSON.stringify(inError);
						} else {
							models.task.remove({}, function(inError) {
								if (inError) {
									throw "Error: " + JSON.stringify(inError);
								} else {
									console.log(dataObj.id + ": Success");
									completeResponse(dataObj, 200, "text", "");
								}
							});
						}
					});
				}
			});
		}
	});
}

exports.POST = POST;
exports.GET = GET;
exports.PUT = PUT;
exports.DELETE = DELETE;
exports.GET_ALL = GET_ALL;
exports.CLEAR_DATA = CLEAR_DATA;