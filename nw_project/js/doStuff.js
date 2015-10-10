$(document).ready(function() {

	$("#state").click(function(){
		alert("asdf");
		var robot = require("robotjs");

		//Get the mouse position, retuns an object with x and y.
		var mouse=robot.getMousePos();
		console.log("Mouse is at x:" + mouse.x + " y:" + mouse.y);

		//Move the mouse down by 100 pixels.
		robot.moveMouse(mouse.x,mouse.y+100);

		//Left click!
		robot.mouseClick();
		//$(".overlayContent").fadeOut("slow");
		//$(".signupForm").slideUp("slow");
		//$(".loginForm").slideUp("slow");
	});


});
