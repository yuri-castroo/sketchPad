
// Copyright 2010 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var canvas;
var context;
var canvasWidth = 500;
var canvasHeight = 500;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickTool = new Array();
var clickColor = new Array();
var clickSize = new Array();
var curTool = "marker";
var curColor = "#df4b26";
var curSize = "normal";
var paint;
/**
* Calls the redraw function after all neccessary resources are loaded.
*/
function resourceLoaded()
{
	if(++curLoadResNum >= totalLoadResources){
		redraw();
	}
}

/**
* Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
*/
function prepareCanvas()
{
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d"); // Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
	//     context = document.getElementById('canvas').getContext("2d");

	// Add mouse events
	// ----------------
	$('#canvas').mousedown(function(e)
	{
		// Mouse down location
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		
		paint_simpleSizes = true;
		addClickSimpleSizes(mouseX, mouseY, false);
		redrawSimpleSizes();
	});
	
	$('#canvas').mousemove(function(e){
		if(paint){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
	});
	
	$('#canvas').mouseup(function(e){
		paint = false;
	});
	
	$('#canvas').mouseleave(function(e){
		paint = false;
	});

	$('#chooseMarker').mousedown(function(e){
		curTool= "marker";
	});

	$('#chooseEraser').mousedown(function(e){
		curTool = "eraser";
	});
	
	$('#chooseNormal').mousedown(function(e){
		curSize = "normal";
	});

	$('#chooseLarge').mousedown(function(e){
		curSize = "large";
	});
	
	$('#clearCanvas').mousedown(function(e){
		clickX = new Array();
		clickY = new Array();
		clickDrag = new Array();
		clickSize = new Array();
		clearCanvas();
	});
}

/**
* Adds a point to the drawing array.
* @param x
* @param y
* @param dragging
*/
function addClick(x, y, dragging)
{
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
	clickTool.push(curTool);
	clickSize.push(curSize);
	if(curTool == "eraser"){
		clickColor.push("#ffffff");
	}else{
		clickColor.push("#df4b26");
	}
}

/**
* Clears the canvas.
*/
function clearCanvas()
{
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

/**
* Redraws the canvas.
*/
function redraw()
{
	// // Make sure required resources are loaded before redrawing
	// if(curLoadResNum < totalLoadResources){ return; }
	clearCanvas();

	var radius;
	context.lineJoin = "round";
				
	for(var i=0; i < clickX.length; i++) {	
		if(clickSize[i] == "normal"){
			radius = 5;
		}else if(clickSize[i] == "large"){
			radius = 10;
		}

		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX[i]-1, clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		context.strokeStyle = clickColor[i];
		context.lineWidth = radius;
		context.stroke();
	}
}
