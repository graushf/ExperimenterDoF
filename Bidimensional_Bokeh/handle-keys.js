var currentlyPressedKeys = {};

function handleKeyDown(event) {
	//console.log(event.keyCode);
	currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;
}

//var positionFocalPlane = vec3.fromValues(0.0, 0.0, -450.0);
//var positionFocalPlane = vec3.fromValues(0.0, 0.0, 0.0);

function handleKeys() {
	
	//positionFocalPlane = 

	// FORWARD
	if (currentlyPressedKeys[87]) {
		//console.log("forward");
		myCamera.ProcessKeyboard(0, deltaTime); // 0 is forward direction
	}
	// BACKWARD
	if (currentlyPressedKeys[83]) {
		myCamera.ProcessKeyboard(1, deltaTime); // 0 is forward direction
	}
	// RIGHT
	if (currentlyPressedKeys[68]) {
		myCamera.ProcessKeyboard(3, deltaTime); // 0 is forward direction
	}
	// LEFT
	if (currentlyPressedKeys[65]) {
		myCamera.ProcessKeyboard(2, deltaTime); // 0 is forward direction
	}
	if (currentlyPressedKeys[27]) {
		enableMouse = !enableMouse;
	}

	if (currentlyPressedKeys[82]) {
		//console.log(distanceFocalPlane);
		distanceFocalPlane += 10;
		uFocalDistance += 10;
	}
	if (currentlyPressedKeys[70]) {
		//console.log(distanceFocalPlane);
		distanceFocalPlane -= 10;
		uFocalDistance -= 10;
	}
    if (currentlyPressedKeys[84]) {
        bokehStrength += 0.01;
    }
    if (currentlyPressedKeys[71]) {
        if (bokehStrength >= 0.01) {
            bokehStrength -= 0.01;    
        } else {
            bokehStrength = 0.0;
        }
    }
    console.log("BOKEH STRENGTH: " + bokehStrength);
}