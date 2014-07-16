function init() {
	PRINT = false;
  con = new myConsole;

  /* Initialize the table contents */
  init_tables();

  // If window is not properly initialized, stop loading content
  if ((typeof window != "undefined") && (window != null)) {
    var urlvars = getURLVars(); //from urlfunctions.js
		addEquation('fx');
		addEquation('polar');
		addEquation('param');
  }
	if(urlvars['print'])
		printSetup();
  resetAdvanced();
}

function resetAdvanced() {
  $('#advanced_content :checkbox' ).attr("checked", true);
  $('input#firstStrokeOption').attr("checked", true);
}

function restoreDefaults(){
	plotSeparate = true;
	window.restoreDefaults();
}

function hideFnSelect() {
  $('#fnSelect').hide('fast');
}

function init_tables() {
  plotsList['col_1'] = new tableObj('x', 'x', new Function('x', 'return x'));
  makeColumnHeaderEditable('#cell_0_1', 1);

  appendRow();
  appendRow();

  // Checks for [ENTER] key
  $('#new_column').keypress(function (e) {
      if(e.keyCode == 13) {
        appendColumn();
      }
    });

  /* jQuery plugin to handle drag-n-drop row */
  $('#plot_table').tableDnD();

  // TODO: Need to style the table which hopefully will not break the code

  // TODO: We need to be able to click header of a column to EDIT (?) and REMOVE

  // TODO: Can consider setting the row/column value to "" as delete

  // TODO: Style even/odd rows differently

  // TODO: Consider creating a button that will load all the exisitng plots
  //  into this table.

  // TODO: Issue with rows being moved around, their ID is not changed (which is normal)
  //  re-word some features so the user won't know. Either that or we update the ID
  //  which I'm not sure if it's a good idea or not.

}



/****************************************************************
 * Add Equations to Equation List
 */

function createSymbolContainer(key, type) {
  return '<a class="faux_link" onClick="toggle(\'symbols_' + key + '\');"><img title="symbols" src="img/equation_symbols.png" /></a> ' +
  '<div id="symbols_container">' +
    '<div id=\'symbols_' + key + '\' class="symbols">' +
      '<input id="sin" type="button" value="sin(' + type + ')" onClick="add_item(this, \'' + key + '\')" />' +
      '<input id="cos" type="button" value="cos(' + type + ')" onClick="add_item(this, \'' + key + '\')" />' +
      '<input id="tan" type="button" value="tan(' + type + ')" onClick="add_item(this, \'' + key + '\')" /><br />' +

      '<input id="csc" type="button" value="csc(' + type + ')" onClick="add_item(this, \'' + key + '\')" />' +
      '<input id="sec" type="button" value="sec(' + type + ')" onClick="add_item(this, \'' + key + '\')" />' +
      '<input id="cot" type="button" value="cot(' + type + ')" onClick="add_item(this, \'' + key + '\')" /><br />' +

      '<input id="acos" type="button" value="acos(' + type + ')" onClick="add_item(this, \'' + key + '\')" />' +
      '<input id="asin" type="button" value="asin(' + type + ')" onClick="add_item(this, \'' + key + '\')" />' +
      '<input id="atan" type="button" value="atan(' + type + ')" onClick="add_item(this, \'' + key + '\')" /><br />' +

      '<input id="abs" type="button" value="abs(' + type + ')" onClick="add_item(this, \'' + key + '\')" />' +
      '<input id="pi" type="button" value="pi" onClick="add_item(this, \'' + key + '\')" />' +
      '<input id="e" type="button" value="e" onClick="add_item(this, \'' + key + '\')" /><br />' +

      '<input id="log" type="button" value="log(' + type + ')" onClick="add_item(this, \'' + key + '\')" />' +
      '<input id="ln" type="button" value="ln(' + type + ')" onClick="add_item(this, \'' + key + '\')" />' +
      '<input id="lg" type="button" value="lg(' + type + ')" onClick="add_item(this, \'' + key + '\')" /><br />' +

      '<input id="exp" type="button" value="exp(' + type + ')" onClick="add_item(this, \'' + key + '\')" />' +
      '<input id="pow" type="button" value="^(' + type + ')" onClick="add_item(this, \'' + key + '\')" />' +
      '<input id="rad" type="button" value="&radic;(' + type + ')" onClick="add_item(this, \'' + key + '\')"/><br />' +

      '<div align="center"><a class="faux_link" onClick="toggle(\'symbols_' + key + '\')">hide</a></div>' +
    '</div>' +
  '</div>';
}

function createColorPicker(key) {
  var def_color_num = current % (PRESET_HEX_COLORS.length - 1);
  var def_color = PRESET_HEX_COLORS[def_color_num];
  funcColor[key] = def_color;

	return '<div id="colorbox' + key + '" class="colorbox faux_link" style="background-color:#' + def_color + '" title="color" onclick="cp_show(\'' + key + '\');"> </div>' +
    '<div id="cp_colorpickerbox' + key + '" class="cp_colorpickerbox">' +
    '<div id="cp_spectrumbox' + key + '" class="cp_spectrumbox">&nbsp;</div>' +
    '<div id="cp_satbrightbox' + key + '" class="cp_satbrightbox">&nbsp;</div>' +
    '<div class="cp_currentcolor">Current:</div>' +
    '<div id="cp_colorbox' + key + '" class="cp_colorbox" style="background-color:#' + def_color + '"><img src="img/spacer.gif" /></div>' +
    '<div id="cp_hexvaluebox' + key + '" class="cp_hexvaluebox"><span style="position:relative; float:left;"># </span> <input id="hex' + key + '" type="text" value="' + def_color + '" READONLY /></div>' +
    '<div class="cp_controlbox">' +
      '<button type="button" onclick="cp_ok(\'' + key + '\');" > Update </button>' + // TODO We need to align the text
      '<button type="button" onclick="cp_hide(\'' + key + '\');" > Cancel </button>' +
    '</div>' +
  '</div>';
}

var colorState = new Array();

// Comments wouldn't hurt anyone
function addEquation(type) {

	eqStr = createEquationElement(type);

	// get necessary equation type
	// and append it to the correct set
  if (type == 'fx') { // RECTANGLULAR
		$('#equation_set').append(eqStr);
  } else if (type == 'polar') { // POLAR
		$('#polarequations_set').append(eqStr);
  } else if (type == 'param') { // PARAMETRIC
		$('#parametricequations_set').append(eqStr);
	}

  if ((type == 'polar') || (type == 'param')) {
    var key = type + '_' + KEY_PREFIX + (current - 1);

    $('#' + key + '_start').blur(function() {
        var value = $('#' + key + '_start').val();

        try {
          value = eval(formatExpression(value, 'dummy'));
        } catch (err) { /* do nothing */ }

        if ((isFinite(value) == false) || (value == '')) {
          $('#' + key + '_start').val(0);
        } else {
          $('#' + key + '_start').val(value);
        }
      });

    $('#' + key + '_end').blur(function() {
        var value = $('#' + key + '_end').val();

        try {
          value = eval(formatExpression(value, 'dummy'));
        } catch (err) { /* do nothing */ }

        if ((isFinite(value) == false) || (value == '')) {
          $('#' + key + '_end').val(6.28);
        } else {
          $('#' + key + '_end').val(value);
        }
      });
  }

  var key = type + '_' + KEY_PREFIX + (current - 1);
  colorState[key] = false;
}

function createEquationElement(type, defaultText){

  var key = type + "_" + KEY_PREFIX + current;
  var key2 = type + "_" + KEY_PREFIX + current;
  var tmpKey = "";
  if (type == 'param') { // PARAMETRIC
    //key += "_x";  // TODO changing the key here breaks the graphing (double check)
    key2 += "_y";
  }

  var feat_prefix =
  '<div class="features">' +
    createColorPicker(key);

  var eqStr = '<div id="' + key + '_container" class="clear">';

  var feat_suffix =
    '<a class="faux_link" onClick="toggleVisibilityHandler(\'' + key + '_visi\')"><img title="visibility" id="' + key + '_visi" src="img/equation_visible.png"></a> ' +
    '<a class="faux_link" onClick="removeEquation(\'#' + key + '_container\')"><img title="delete" src="img/equation_delete.png"></a> ' +
  '</div>';

  var tRange = '<label class="fx">&nbsp;</label> <div class="left" style="margin:0px 5px 10px 0px"><b>t = </b></div> <input id="'
    + key + '_start" class="short" type="text" onKeyDown="enterCheck(event)" value="0" /> <div class="left" style="margin:0px 5px 0px 5px">to</div> <input id="'
    + key + '_end" class="short" type="text" onKeyDown="enterCheck(event)" value="6.28" />';

	if (!defaultText) defaultText = '';


  // Now add the correct input values into the correct location

  if (type == 'fx') { // RECTANGLULAR
    eqStr +=
      '<label class="fx">f(x)=</label><input id="' + key + '" class="equation" type="text" onKeyDown="enterCheck(event)" value="' + defaultText + '" />' +
      feat_prefix + createSymbolContainer(key, 'x') + feat_suffix + '</div>';

  } else if (type == 'polar') { // POLAR
    eqStr +=
      '<label class="fx">r(t)=</label><input id="' + key + '" class="equation" type="text" onKeyDown="enterCheck(event)" value="" />' +
      feat_prefix + createSymbolContainer(key, 't') + feat_suffix + '<br />' + tRange + '</div>';

  } else if (type == 'param') { // PARAMETRIC
    eqStr +=
      '<label class="fx">x(t)=</label><input id="' + key + '" class="equation" type="text" onKeyDown="enterCheck(event)" value="" />' +
      feat_prefix + createSymbolContainer(key, 't') + feat_suffix + '<br />' +
      '<label class="fx">y(t)=</label><input id="' + key2 + '" class="equation" type="text" onKeyDown="enterCheck(event)" value="" />' +
      '<div class="features">' + createSymbolContainer(key2, 't') + '<div style="display:inline-block; height:16px;"></div></div><br />' +
      tRange + '</div>';
	}

  current++;
	return eqStr;
}

function changeColor(key, color) {
  // Update the appropriate div
  $('#color' + key + ' div').css('backgroundColor', '#' + color);

  // Update the internal object
  funcColor[key] = color;

  // Update the plot
  window.updateColor(key, '#' + funcColor[key]);
}

// TODO -- Currently broken (temp fix)
function removeEquation(id) {
  $(id).remove();

  var tmp = id.split('_');
  var key = tmp[0] + "_" + tmp[1];
  key = key.replace(/#/g, '');  // Strip the # out of the key

  delete funcColor[key];

  //var key = id.match(/eq\d{1,}/); // TODO Be sure to update this if KEY_PREFIX changes
  //unplots based on the number id of equation
  window.unplot(key);
	fnSelectUpdate();
}

/****************************************************************
 * Toggle the tabs in the graphing window
 * works under assumption that there is only 1 open tab
 */
function toggleTabs(caller) {
  if ((caller.id == "equations") || (caller.id == "polar") || (caller.id == "parametric")) {
	document.getElementById("legend").style.display = 'block';
  } else {
	document.getElementById("legend").style.display = 'none';
  }

  var currentTab = $(".selected")[0];
  currentTab.className = "notSelected";
  $("#"+currentTab.id+"_content")[0].className = "notSelectedContent";

  caller.className = "selected";
  $("#"+caller.id+"_content")[0].className = "selectedContent";
}
/****************************************************************
* Toggle equation visibility
*/
function toggleVisibilityHandler(id) {
  var elem = document.getElementById(id);

  //alert(id.split('_'));

  var tmp = id.split('_');
  var key = tmp[0] + "_" + tmp[1];

  //var key = id.match(/eq\d{1,}/); // TODO Be sure to update this if KEY_PREFIX changes
  window.toggleVisibility(key);
  //flip the image
  if(elem.src.match(/invisible.png/))
    elem.src = "img/equation_visible.png";
  else
    elem.src = "img/equation_invisible.png";
	fnSelectUpdate();
}

/****************************************************************
 * Toggle the symbol popup menu
 */
function add_item(caller, input)
{
  var equation = document.getElementById(input).value;
  var new_equation = null;
  if (caller.id == 'rad') {
    if (caller.value.search(/x/i) == -1) {
      new_equation = equation + 'sqrt(t)';
    } else {
      new_equation = equation + 'sqrt(x)';
    }
  } else {
    new_equation = equation + caller.value;
  }

  document.getElementById(input).value = new_equation;
}

function toggle(id) {
  var elem = document.getElementById(id);
  if (elem.style.display == 'block') {
    elem.style.display = 'none';
  } else {
    elem.style.display = 'block';
	elem.focus();
  }
}

function fnSelectToggle(toggle, multi){
  var elem = document.getElementById('fnSelect');
	var fn2 = document.getElementById('fnSelect2');
	if(elem){
		if (toggle){
			elem.style.display = 'block';
			if(multi)
				fn2.style.display = 'block';
			else
				fn2.style.display = 'none';
		}else
			elem.style.display = 'none';
	}
}

function fnSelectUpdate(){
	var curFuncObjs = window.getFuncObjs();
	var fn1 = document.getElementById('fnSelect1');
	var fn2 = document.getElementById('fnSelect2');
	for(var i in fn1){
		fn1.remove(i);
		fn2.remove(i);
	}
	for(var i in curFuncObjs){
		if(curFuncObjs[i].visibility && curFuncObjs[i].type == 'fx'){
			addOption(fn1,curFuncObjs[i].originalFn,i,curFuncObjs[i].color);
			addOption(fn2,curFuncObjs[i].originalFn,i,curFuncObjs[i].color);
		}
	}
	if(!fn1[0]){
		addOption(fn1,'No Applicable Function',null,BLACK);
		addOption(fn2,'No Applicable Function',null,BLACK);
    fn1.style.color = BLACK;
    fn2.style.color = BLACK;
	}
	if(fn2[1])
		fn2.selectedIndex = 1;
	fnSelectChange();
}

function fnSelectChange(){
	var fn1 = document.getElementById('fnSelect1');
	var fn2 = document.getElementById('fnSelect2');
	var curFuncObjs = window.getFuncObjs();
	fnSelected1 = fn1.value;
	fnSelected2 = fn2.value;
	if(curFuncObjs && fnSelected1){
		fn1.style.color = curFuncObjs[fnSelected1].color;
		fn2.style.color = curFuncObjs[fnSelected2].color;
	}
}

function addOption(selectbox,text,value,color) {
  var optn = document.createElement("OPTION");
  optn.text = text;
  optn.value = value;
  optn.style.color = color;
  selectbox.options.add(optn);
  return optn;
}
/****************************************************************
 * Clearing default text in the console
 */
 //var DEFAULT_CONSOLE_EX = "Ex: 5+6";

function clearConsoleDefault() {
  //if (document.text.text.value == DEFAULT_CONSOLE_EX) {
  document.text.text.style.color = BLACK;
	document.text.text.value = "";
  //}
}

//We don't need this function for artistic reasons
/*
function restoreConsoleDefault() {
  if (document.text.text.value == "") {
	document.text.text.style.color = '#afafaf';
	document.text.text.value += DEFAULT_CONSOLE_EX;
  }
}
*/
function enterCheck(key){
	if(key.keyCode == 13)
		generate_graph();
}

/****************************************************************
 * "Deleting" the share-graph URL
 */
function deleteURL() {
	document.getElementById("url").value = '';
	document.getElementById("share-url").style.display = 'none';
}

function printSetup(){
	document.getElementById('left').style.display = 'none';
	document.getElementById('function-tabs').style.display = 'none';
	document.getElementById('main-tabs').style.display = 'none';
	window.print();
	document.getElementById('pageBody').style.backgroundColor = '#FFFFFF';
	var newdiv = document.createElement('div')
	newdiv.setAttribute('id','printDiv');
	newdiv.innerHTML = '<b>Equations</b>';
	var right = document.getElementById('right');
	var curFuncObjs = window.getFuncObjs();
	var fx = document.createElement('div');
	fx.innerHTML = 'Functions';
	var polar = document.createElement('div');
	polar.innerHTML = 'Polar';
	var param = document.createElement('div');
	param.innerHTML = 'Parametric';
	newdiv.appendChild(fx);
	newdiv.appendChild(polar);	
	newdiv.appendChild(param);
	fx.setAttribute('id','printfx');
	polar.setAttribute('id','printpolar');
	param.setAttribute('id','printparam');
	for(var i in curFuncObjs){
		var newindiv = document.createElement('div');
		newindiv.style.color = curFuncObjs[i].color;
		var type = curFuncObjs[i].type;
		if(type == 'polar'){
			newindiv.innerHTML += 'r(t): '+curFuncObjs[i].originalFn+
														'<br />start: '+curFuncObjs[i].tStart+
														'<br />end: '+curFuncObjs[i].tEnd;
			polar.appendChild(newindiv);
			polar.style.display = 'block';
		}else if(type == 'param'){
			var fnarray = curFuncObjs[i].originalFn.split(';');
			newindiv.innerHTML += 'x(t): '+fnarray[0]+'<br />'+
														'y(t): '+fnarray[1]+'<br />'+
														'start: '+curFuncObjs[i].tStart+'<br />'+
														'end: '+curFuncObjs[i].tEnd+'<br />';
			param.appendChild(newindiv);
			param.style.display = 'block';
		}else{
			newindiv.innerHTML += 'f(x): '+curFuncObjs[i].originalFn;
			fx.appendChild(newindiv);
			fx.style.display = 'block';
		}
	}
	right.appendChild(newdiv);
}