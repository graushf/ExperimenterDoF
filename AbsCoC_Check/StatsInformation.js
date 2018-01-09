var FPSNode, ApertureNode, FocalPlaneNode, FocalLengthNode, CoCScaleNode, CoCBiasNode, CoCDiffNode, BokehStrengthNode;

function initStatistics() {
	var FPSElement = document.getElementById("time");
	var ApertureElement = document.getElementById("aperture");
	var FocalPlaneElement = document.getElementById("focalplane");
	var FocalLengthElement = document.getElementById("focallength");
	var CoCScaleElement = document.getElementById("cocscale");
	var CoCBiasElement = document.getElementById("cocbias");
	var CoCDiffElement = document.getElementById("cocdiff");
	var BokehStrengthElement = document.getElementById("bokehstrength");

	FPSNode = document.createTextNode("");
	ApertureNode = document.createTextNode("");
	FocalPlaneNode = document.createTextNode("");
	FocalLengthNode = document.createTextNode("");
	CoCScaleNode = document.createTextNode("");
	CoCBiasNode = document.createTextNode("");
	CoCDiffNode = document.createTextNode("");
	BokehStrengthNode = document.createTextNode("");

	FPSElement.appendChild(FPSNode);
	ApertureElement.appendChild(ApertureNode);
	FocalPlaneElement.appendChild(FocalPlaneNode);
	FocalLengthElement.appendChild(FocalLengthNode);
	CoCScaleElement.appendChild(CoCScaleNode);
	CoCBiasElement.appendChild(CoCBiasNode);
	CoCDiffElement.appendChild(CoCDiffNode);
	BokehStrengthElement.appendChild(BokehStrengthNode);
}

function handleStatistics() {
	var _deltaTime = 1000/deltaTime;
	var _aperture = Aperture;
	var uiFocalplane = _focalPlane*myCamera.GetFarValue();
	var _focallength = focalLength;
	var angle = elapsed;
	var cocscale = CoCScale; 
	var cocbias = CoCBias;
	var cocdiff = CoCScale + CoCBias;
	var bokehstrength = bokehStrength;

	//angleNode.nodeValue = _deltaTime.toFixed(5); // 5 decimal values
	FPSNode.nodeValue = _deltaTime.toFixed(0) + "FPS"; 	// 5 decimal values
	ApertureNode.nodeValue = _aperture.toFixed(2);
	FocalPlaneNode.nodeValue = uiFocalplane.toFixed(2);
	FocalLengthNode.nodeValue = _focallength.toFixed(2);
	CoCScaleNode.nodeValue = cocscale.toFixed(2);
	CoCBiasNode.nodeValue = cocbias.toFixed(2);
	CoCDiffNode.nodeValue = cocdiff.toFixed(2);
	BokehStrengthNode.nodeValue = bokehstrength.toFixed(2);	
}