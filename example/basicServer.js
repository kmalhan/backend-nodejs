var http = require("http");
var server = http.createServer(function(inRequest, inResponse) {
	inResponse.writeHead(200, { "Content-Type": "text/plain"} );
	inResponse.end("Hello from first Node.js server!");
});
server.listen(1234, "127.0.0.1");