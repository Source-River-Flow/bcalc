
/*************************************************
 * Dispatch functions
 * ***********************************************/
function calculate_derivative(){

	var ansID = '#derivative_answer';

	// get the point
	var pt = parseFloat($("#derivative_pt").val());
	if(isNaN(pt)){
		var errormsg = '<font color="FF0000"> <b>Point is not a number</b><font>';
		$(ansID).prepend(errormsg);
		return;
	}

	// get the function
	var fnString = $("#derivative_function").val();
	fnString = formatExpression(fnString,'fx');
	if(!fnString){
		var errormsg = '<font color="FF0000"><b>Not a valid function</b><font>';
		$(ansID).prepend(errormsg);
		return;
	}

	var fn = new Function('x','return '+fnString);
	var tangentLineString = getTangentLineString(fn,pt);

	var label = "Tangent line of: <b>" + document.getElementById('derivative_function').value + "</b>" + " at " + pt;
	document.getElementById('drawGraphNumerical').style.display = 'block';
	el = createEquationElement('fx',tangentLineString);
	$(ansID).prepend(el);
	$(ansID).prepend(label);
	$(ansID + ' input').attr('readonly',true);
}

/* calculate_integral -> calculate and display area under fn
 */
function calculate_integral(){
	
	ansID = '#integral_answer';
	// Get values
	var fnString = $("#integral_function").val();
	var a = parseFloat($("#integral_lower_bound").val());
	var b = parseFloat($("#integral_upper_bound").val());

	//error checking
	var fnString = formatExpression(fnString,'fx');
	if(isNaN(a)){
		$(ansID).html('<font color="FF0000"><b>Left Bound is not a number</b></font>');
		return;
	} else if(isNaN(b)){
		$(ansID).html('<font color="FF0000"><b>Right Bound is not a number</b></font>');
		return;
	} else if(b < a){
		$(ansID).html('<font color="FF0000"><b>Right Bound must be greater than Left</b></font>');
		return;
	} else if(!fnString) {
		$(ansID).html('<font color="FF0000"><b>Not a valid function</b></font>');
	}
	var fn = new Function("x","return "+fnString);
	var integral = getIntegralArea(fn,a,b);
	var label = "Integral of <b>" + document.getElementById('integral_function').value + "</b>: ";
	$(ansID).text(integral+='');
	$(ansID).prepend(label);
}

/*************************************************
 * numerical functions
 * ***********************************************/
function getTangentLineString(fn,pt){
	// http://en.wikipedia.org/wiki/Numerical_differentiation#Higher_order_methods
	
	var h = .00001; //smaller -> more precise
	var fprime = -fn(pt+2*h) + 8*fn(pt+h) - 8*fn(pt-h) + fn(pt-2*h);
	fprime = roundNumber(fprime/(12*h),5);


	var y = fn(pt);
	var b = y - fprime*pt;

	return fprime + '*x + ' + b;

}

function getIntegralArea(fn,a,b){
	
	//setup
	var numTraps = 1000; //precision of integration
	var step = (b-a)/numTraps;
	var x = a;
	var fa = fn(x);
	var fb = 0;
	var sum = 0;
	for(i=0;i<numTraps;i++){
		//integrate
		x = x+step;
		fb = fn(x);
		sum += fa + fb;

		//iterate
		fa = fb;
	}

	//round the number a little to trim inconsistency
	return roundNumber(sum*0.5*step,5);
}

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}


/*************************************************
 * Plot the numerical functions
 * ***********************************************/

function plotDerivative(){
	var fnString = $('#derivative_answer').text();
	

}

