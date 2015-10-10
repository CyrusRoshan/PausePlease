//Type "Hello World" then press enter.
var dispatcher = require('httpdispatcher');
var robot = require("robotjs");
//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT=8080;

var on = true;

//Lets use our dispatcher
function handleRequest(request, response){
	try {
		//log the request on console
		//console.log(request.url);
		if(on){
			on = false;
		}
		else{
			on = true;
		}
		robot.typeString("k");
		console.log(on);
		//Disptach
		dispatcher.dispatch(request, response);
	} catch(err) {
		console.log(err);
	}
}

//For all your static (js/css/images/etc.) set the directory name (relative path).
dispatcher.setStatic('resources');

//A sample GET request
dispatcher.onGet("/page1", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Page One');
});

//A sample POST request
dispatcher.onPost("/post1", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Got Post Data');
});

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
	//Callback triggered when server is successfully listening. Hurray!
	console.log("Server listening on: http://localhost:", PORT);
});



