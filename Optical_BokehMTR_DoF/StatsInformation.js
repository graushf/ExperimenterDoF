var FPSNode, ApertureNode, FocalPlaneNode, FocalLengthNode;

function initStatistics() {
	var FPSElement = document.getElementById("time");
	var ApertureElement = document.getElementById("aperture");
	var FocalPlaneElement = document.getElementById("focalplane");
	var FocalLengthElement = document.getElementById("focallength");

	FPSNode = document.createTextNode("");
	ApertureNode = document.createTextNode("");
	FocalPlaneNode = document.createTextNode("");
	FocalLengthNode = document.createTextNode("");

	FPSElement.appendChild(FPSNode);
	ApertureElement.appendChild(ApertureNode);
	FocalPlaneElement.appendChild(FocalPlaneNode);
	FocalLengthElement.appendChild(FocalLengthNode);
	//angleElement.appendChild(angleNode);
}

function handleStatistics() {
	var _deltaTime = 1000/10*deltaTime;
	var _aperture = Aperture;
	var uiFocalplane = _focalPlane*myCamera.GetFarValue();
	var _focallength = focalLength;
	var angle = elapsed;

	//angleNode.nodeValue = _deltaTime.toFixed(5); // 5 decimal values
	FPSNode.nodeValue = _deltaTime.toFixed(0) + "FPS"; 	// 5 decimal values
	ApertureNode.nodeValue = _aperture.toFixed(2);
	FocalPlaneNode.nodeValue = uiFocalplane.toFixed(2);
	FocalLengthNode.nodeValue = _focallength.toFixed(2);
}