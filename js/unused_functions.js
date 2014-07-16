////////////////////////////////  From plot.svg ////////////////////////////
//get first function of type
function getFirstNType(n, type) {
  var tmp = null;
  var result = new Array();
  var count = 0;
  for (var i in curFuncObjs) {
    if (curFuncObjs[i].type == type) {
      result[count] = i;
      count++;
    }
    if (count == n)
      return result;
  }
  if (count == 0)
    return null;

  return result;
}


// TESTING FUNCTION - NOT WORKING YET
// THESE MAY BE NEEDED AT THE HTML LEVEL (maybe)
function hasFocus(evt) {
  alert("I have control");
}

// TESTING FUNCTION - NOT WORKING YET
// THESE MAY BE NEEDED AT THE HTML LEVEL (maybe)
function lostFocus(evt) {
  // Update the X value
  guiElements['xMouseValue'].childNodes[0].nodeValue = "x: ---";

  // Update the Y value
  guiElements['yMouseValue'].childNodes[0].nodeValue = "y: ---";
}

//buggy and currently it's not used
function newtonMethod(fxn, lowX, upX) {
  // var fnString = formatExpression(fxn); // doesn't work for me
  var fn = new Function("x","return " + fxn);
  var x = lowX;
  // alert(x);
  if (Math.abs(fn(lowX)) &lt;= TOLERANCE) {
    alert("Answer: " + lowX);
    delete fn;
    return lowX;
  }
  if (Math.abs(fn(upX)) &lt;= TOLERANCE) {
    alert("Answer: " + upX);
    delete fn;
    return upX;
  }
  while (x &lt;= upX) {
    // from numerical.js
    fprime = roundNumber((-fn(x+2*H) + 8*fn(x+H) - 8*fn(x-H) + fn(x-2*H))/(12*H),6);
    //Newton's Method
    // alert("fprime: " + fprime);
    if (isNaN(fprime) || fprime == 0) {
      // TODO What is this?
      return zeroIterator(fn,lowX,upX);
    }
    else {
      // alert("fn(x)= " + fn(x));
      newtonValue = x - fn(x) / fprime;
      // alert("newtonValue: "+newtonValue);
      // alert("y: "+fn(newtonValue));
      if (Math.abs(fn(newtonValue)) &lt;= TOLERANCE) {
        alert("Answer: " + roundNumber(newtonValue, 5));
        alert(fn(newtonValue));
        delete fn;
        return newtonValue;
      }
      else {
        x = newtonValue;
        // alert("new newton value: " + x);
      }
    }
  }
  delete fn;
  alert("No intersection exists");
}

// TODO CURRENTLY NOT USED
// Checks to see if the coordinate is within our current view window
function withinWindow(x, y) {
  if (x &lt; absXMax) {
    if (x &gt; absXMin) {
      if (y &lt; absYMax) {
        if (y &gt; absYMin) {
          return true;
        }
      }
    }
  }

  return false;
}

////////////////////////////////////////////////////////////////////////////
