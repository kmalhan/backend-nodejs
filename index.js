var http = require("http");
var DAO = require("./DAO");

var reqID = 1;

var server = http.createServer(serverCore);
server.listen("1234", "127.0.0.1");
console.log("\nApp available at http://127.0.0.1:1234\n");

function serverCore(req, resp) {
	try {
		reqID = reqID + 1;
		var dataObj = {
			id : new Date().getTime() + reqID, req : req, resp : resp,
			data : null, ident : null
		};
		console.log(dataObj.id + " : " + req.method + " " + req.url);

		if (req.method == "OPTIONS") {
			resp.writeHead(
				200, {
					"Content-Type" : "text/plain",
					"Access-Control-Allow-Origin" : "*",
					"Access-Control-Allow-Methods" : "GET,POST,DELETE,OPTIONS",
					"Access-Control-Max_Age" : "1000",
					"Access-Control-Allow-Headers" : "origin,x-csrftoken,content-type,accept"
				}
			);
			resp.end("");
			return;
		}

		if (req.method != "POST") {
			dataObj.ident = req.url.substr(req.url.lastIndexOf("/") + 1);
		}
		if (dataObj.ident != null) {
			dataObj.ident = dataObj.ident.match(/^[a-f0-9]{24}$/i);
		}

		if (req.method == "GET" || req.method == "DELETE") {

			serverCorePart2(dataObj);

		} else if (req.method == "POST" || req.method == "PUT") {

			var body = "";
			req.on("data", function (inData) {
				body += inData;
			});
			req.on("end", function() {
				if (body == null) {
					body = "";
				}
				dataObj.data = JSON.parse(body);
				serverCorePart2(dataObj);
			});
		} else {

			console.log(dataObj.id + ": Unsupported method: " + req.method);
			completeResponse(
				dataObj, 405, "text", "Unsupported method: " + req.method
			);
		}
	} catch (e) {
		console.log(dataObj.id + ": Exception processing request (part 1): " + e);
		completeResponse(dataObj, 500, "text", "Exception: " + e);
	}
}

function serverCorePart2(dataObj) {

	try {
		console.log(dataObj.id + ": ident: " + dataObj.ident);
		console.log(dataObj.id + ": data: " + JSON.stringify(dataObj.data));

		var opType = "";
		if (dataObj.req.url.toLowerCase().indexOf("/appointment") != -1) {
			onType = "appointment";
		} else if (dataObj.req.url.toLowerCase().indexOf("/contact") != -1) {
			onType = "contact";
		} else if (dataObj.req.url.toLowerCase().indexOf("/note") != -1) {
			onType = "note";
		} else if (dataObj.req.url.toLowerCase().indexOf("/task") != -1) {
			onType = "task";
		} else if (dataObj.req.url.toLowerCase().indexOf("/clear") != -1) {
			onType = "clear";
		} else {
			console.log(dataObj.id + ": Unsupported operation: " + dataObj.req.url);
			completeResponse(
				dataObj, 403, "text", "Unsupported operation: " + dataObj.req.url
			);
			return;
		}

		// Dynamic DAO call
		if (opType == "clear") {
			DAO.CLEAR_DATA(dataObj);
		} else if (dataObj.ident == null && dataObj.req.method == "GET") {
			DAO.GET_ALL(onType, dataObj);
		} else {
			DAO[dataObj.req.method](onType, dataObj);
		}
	} catch (e) {
		console.log(dataObj.id + ": Exception processing request (part 2): " + e);
		completeResponse(dataObj, 500, "text", "Exception: " + e);
	}
}

completeResponse = function(dataObj, statusCode, contentType, content) {

	var ct = "text/plain";
	if (contentType == "json") {
		ct = "application/json";
	}
	dataObj.resp.writeHead(
		statusCode, { "Content-Type" : ct, "Access-Control-Allow-Origin" : "*" }
	);
	dataObj.resp.end(content);
}







