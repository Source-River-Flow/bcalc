/* COLORS */
var GREEN = '#00AA00';
var RED = '#FF0000';
var BLACK = '#000000';
var GREY_BACK = '#F5F5F5';
var LIGHTGREY = '#D3D3D3';
var GREY = '#808080';
var DIMGREY = '#696969';


/* ******************* parser.js ******************* */


/* Lookup table for special vars
 * special vars return an array of the
 * following format:
 *
 * [0]:  replacement string
 *  - Use to replace input value of special var with its true value.
 *
 * [1]:  variable type
 *	- function -> "f"
 *	- number or constant -> "n"
 *
 * [2]: argument number
 *	- if variable is a function, states
 *	- number of args it takes
 *	-
 *	- if variable is a number, returns null
 */
var FN_LIST = new Array();

	//functions
	FN_LIST['acos'] = ['Math.acos(?)','f',1];
	FN_LIST['asin'] = ['Math.asin(?)','f',1];
	FN_LIST['atan'] = ['Math.atan(?)','f',1];
	FN_LIST['atan2'] = ['Math.atan2(?,?)','f',2];
	FN_LIST['sqrt'] = ['Math.sqrt(?)','f',1];
	FN_LIST['ln'] = ['Math.log(?)','f',1];
	FN_LIST['log'] = ['(Math.log(?)/Math.LN10)','f',1];
	FN_LIST['lg'] = ['(Math.log(?)/Math.LN2)','f',1];
	FN_LIST['sin'] = ['Math.sin(?)','f',1];
	FN_LIST['cos'] = ['Math.cos(?)','f',1];
	FN_LIST['tan'] = ['Math.tan(?)','f',1];
	FN_LIST['sec'] = ['(1/Math.cos(?))','f',1];
	FN_LIST['csc'] = ['(1/Math.sin(?))','f',1];
	FN_LIST['cot'] = ['(1/Math.tan(?))','f',1];
	FN_LIST['exp'] = ['Math.exp(?)','f',1];
	FN_LIST['abs'] = ['Math.abs(?)','f',1];

	//constants
	FN_LIST['pi'] = ['Math.PI','n',null];
	FN_LIST['e'] = ['Math.E','n',null];

	//operators
	FN_LIST['^'] = ['Math.pow(?,?)','f',2]; // special case
	FN_LIST['~'] = ['-(?)','o',1]; // special case
	FN_LIST['+'] = ['(?+?)','o',2];
	FN_LIST['-'] = ['(?-?)','o',2];
	FN_LIST['*'] = ['(?*?)','o',2];
	FN_LIST['/'] = ['(?/?)','o',2];

// whether or not to display error messages
var DEBUG = true;

var precedenceOrder = new Array();
precedenceOrder['+'] = 0;
precedenceOrder['-'] = 0;
precedenceOrder['*'] = 1;
precedenceOrder['/'] = 1;
precedenceOrder['^'] = 2;
precedenceOrder['~'] = 3;

operatorAssociativity = new Array();
operatorAssociativity['+'] = 'l';
operatorAssociativity['-'] = 'l';
operatorAssociativity['*'] = 'l';
operatorAssociativity['/'] = 'l';
operatorAssociativity['^'] = 'r';
operatorAssociativity['~'] = 'r';

validOperators = '+-*/^~';

/* ********************** util.js ************** */
//fnSelect
var fnSelected1;
var fnSelected2;

//The console object
var con;

// add function code
var current = 0;
// Keeps track of the color of each function based on its key
var funcColor = new Array();

// KEYS WILL NOW BE
// {type}_{KEY_PREFIX}{current}_{extra}
//  where {type} = ['fx', 'polar', 'param']
//  where {current} = some integer
//  where key = {type}_{KEY_PREFIX}{current}
//  where {extra} = [x, y] if {type} == 'param'
var KEY_PREFIX = "eq";

// Controls the default color
var PRESET_HEX_COLORS = Array('0f0fff', 'dfdf1b', '0db5df', '1d9f09', 'cf0c0c', 'efa40e', 'cf1b96', '0ddfdf'
  , '9400D3', 'FF69B4', 'FFA07A', '0000CD', 'DDA0DD', '8a2be2', '7fff00', 'dc143c', 'FFFF00', '87CEEB');  // this line contains newly added colors
var DEFAULT_HEX_COLOR = "#000080";
var DEFAULT_HEX_VALUE = "000080";
