var dns = require("dns");

dns.lookup("www.google.com", function(inError, inAddress) {
	if (inError) {
		console.log("Error: " + inError);
	} else {
		console.log(
			"Address for www.google.com = " + JSON.stringify(inAddress)
			);
		dns.reverse(inAddress, function(inError, inDomain) {
			if (inError) {
				console.log("Error: " + inError);
			} else {
				console.log(
					"Domain for IP " + inAddress + " = " + JSON.stringify(inDomain)
					);
			}
		});
	}
});