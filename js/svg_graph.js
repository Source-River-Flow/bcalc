// Trims string of whitespace (in front and at end)
function trimmer(str) {
  str = str + ""; // In case we get passed a number
  str = str.replace(/^\s+/,'');
  for (var i = str.length - 1; i > -1; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return str;
}

// Create a basic object to pass data into
function eqObj(fn, originalFn, vis, color, type) {
  // Used by regular functions
  this.fn = fn;
  // Used for URL parsing
  this.originalFn = originalFn;
  // Toggles visibility (boolean)
  this.visibility = vis;
  // #HEX representation of the color
  this.color = color;
  // {"fx", "param", "polar"}
  this.type = type;
	// Used by fx
	this.func = null;
  // Used by Polar and Parametric functions
  this.xFunc = null;
  this.yFunc = null;
  // Denotes the start and end range of Polar and Parametric functions
  this.tStart = null;
  this.tEnd = null;
}


var plotSeparate = true;

function generate_graph() {

  // Grab all inputs and sanitize them
  var inArray = $(".equation");
  var equationList = [];
  var keyInfo = null;
  var key = null;
  var fnString = null;
  var visible = true;

  var selectedType = (plotSeparate == true) ? $('.selected')[0].id : '';

  if (selectedType == 'equations') {
    selectedType = 'fx';
  } else {
    if (selectedType == 'polar') {
      selectedType = 'polar';
    } else {
      if (selectedType == 'parametric') {
        selectedType = 'param';
      } else {
        selectedType = '';
      }
    }
  }

  var bad_list = new Array();

  for(var i = 0; i < inArray.length; i++) {
    key = inArray[i].id;
    keyInfo = key.split('_');

    if ((selectedType != '') && (selectedType != keyInfo[0])) {
      continue;
    }

    //find if invisible by looking at image
    visible = true;

    // TODO Perhaps we should use a variable to keep track of the visibility state?
    if (keyInfo.length != 3) {
      if(document.getElementById(key + "_visi").src.match(/invisible.png/) != null)
        visible = false;
    } else {
      key = keyInfo[0] + "_" + keyInfo[1];
      visible = document.getElementById(key + "_visi").src.match(/invisible.png/) == null;
    }

    //equationList[key].color = "#" + funcColor[key];

    fnString = trimmer(inArray[i].value);

    // Parse the function string
    if(fnString == '') {
      bad_list[keyInfo[0] + "_" + keyInfo[1]] = true;
      continue; //exit loop if there is not input
    } else {
      fnString = formatExpression(fnString, keyInfo[0]);
    }

    if (!fnString) { // error with input string
      con.write('msg', 'In Function: ' + inArray[i].value);
      bad_list[keyInfo[0] + "_" + keyInfo[1]] = true;
      delete equationList[key];
      continue;
    }

    // This is to handle the case of one valid in parametric and one invalid
    if (key in bad_list) {
      delete equationList[key];
      continue;
    }

    // Split up the string (primarily for parametric)
    if (keyInfo[0] == 'param') {
      if (equationList[key] == null)
        equationList[key] = new eqObj("", null, visible, "#" + funcColor[key], keyInfo[0]);
    } else {
      equationList[key] = new eqObj("", null, visible, "#" + funcColor[key], keyInfo[0]);
    }

    // Fill in the original function string for URL parsing (separated by ';' where needed)
    if (equationList[key].originalFn == null)
      equationList[key].originalFn = inArray[i].value;
    else
      equationList[key].originalFn += ";" + inArray[i].value;

		// REGULAR
		if (keyInfo[0] == 'fx') {
			equationList[key].fn = fnString;
		}
		else
		{
			// POLAR and PARAMETRIC
			if (equationList[key].tStart == null) {
				equationList[key].tStart = document.getElementById(key + "_start").value;
				equationList[key].tEnd = document.getElementById(key + "_end").value;
			}

			// POLAR
			if (keyInfo[0] == 'polar') {
				equationList[key].fn = fnString;
				equationList[key].xFunc = new Function("t", "return " + fnString + " * (Math.cos(t))");
				equationList[key].yFunc = new Function("t", "return " + fnString + " * (Math.sin(t))");
			}
			else if (keyInfo[0] == 'param')
			{
				// PARAMETRIC
				// Function string separated by ';'
				if (equationList[key].fn == "")
					equationList[key].fn = fnString;
				else
					equationList[key].fn += ";" + fnString;

				// Fill in x and y function
				if (keyInfo.length == 3) {
					equationList[key].yFunc = new Function ("t", "return " + fnString);
				} else {
					equationList[key].xFunc = new Function ("t", "return " + fnString);
				}
			}
		}
	}

  delete bad_list;

  //now graph it
  window.graph(equationList);

	fnSelectUpdate();
  //return the result (mainly checks for errors)
  return true;
}
