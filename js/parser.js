// Since spaces are irrelevant, we prune them and then
//  do a massive replace of all "--" with "+" and then
//  multiple '+' with a single '+'. The alternative would
//  be to "separate all "--" with "- -" but I think parser
//  would still blow up on that.
function fixer(str) {
  // Remove all whitespaces
  str = str.replace(/\s/g,'');
  // Replace all '--' with '+'
  str = str.replace(/--/g, '+');
  // Replace all '++' '+'
  str = str.replace(/\+{2,}/g, '+');

  // 'x - - - (-1)' = x+-(-1)
  // TODO: Might still be a problem
  //  no good way here to distribute that
  //  negative in

  return str;
}


/* Call this function to perform converting to proper format */
function formatExpression(strInput, type) {

  var parsedString = null;

  if ((strInput == null) || (strInput == '')) {
    return '';
  }

  // Error: Invalid Character
  if (!allValidCharacters(strInput)) return '';

  // Set up allowable variables in FN_LIST
  if(type == 'fx') 
	{
    FN_LIST['x'] = ['x','n',null];
  } 
	else if('polar param'.indexOf(type) != -1) 
	{
    FN_LIST['t'] = ['t','n',null];
  }

  // TODO...please look at fixer(...) to see what it doesn't fix
  strInput = fixer(strInput);

  parsedString = postfixEvaluator(strInput);

  // remove allowable variables
  delete(FN_LIST['x']);
  delete(FN_LIST['t']);

  if(!parsedString) return '';

  return parsedString;
}

/* Validates Input
  returns true/false
  accepts the following tokens:
    * / - + ! . ^ ( )
    digits, letters, space
*/
function allValidCharacters(strInput) {
  var regEx = new RegExp('[/\.\+\*\^\(\)!a-zA-Z0-9 -]+', 'gi');
  var result = regEx.exec(strInput);

  if (result != null) {
    if (result[0].length == strInput.length) {
      delete regEx;
      return true;
    }
  }

  delete regEx;
  return false;
}

function parseError(msg){

  if(DEBUG) con.write('msg',msg);
  return false;
}

/* postfixEvaluator -> turns fnString to sanitized function
 * evaluates the function by turning it into a postfix
 * array, then replacing appropriate expressions
 * with their values by using lookup table
 */
function postfixEvaluator(fnString) {

  //get a postfix array
  var postfixArray = infixToPostfix(fnString);
  if(!postfixArray) return false;


  var next;
  var tokenType;
  var stack = [];
  var opCount;

  for(var i = 0; i < postfixArray.length; i++) {
    next = postfixArray[i];
    tokenType = getTokenType(next);

    if(tokenType == 'n') {
      stack.push(getTrueValue(next));
    }
    //else if ( (tokenType == 'f') || ('^~'.indexOf(next) != -1 ) ) 
		else
		{
      var fnParameters = FN_LIST[next];
      opCount = fnParameters[2];

      //error
      if(stack.length < opCount) {
        var err = 'Error, too few arguments to, ' + next;
        return parseError(err);
      }

      // val is next expression to add to output.
      // because it is a function, it is of the form:
      // fn(arg1,arg2,...,argn)
      var val = getTrueValue(next);
      var args = [];

			// get all arguments
      for(var k = 0; k < opCount; k++)
        args.push(getTrueValue(stack.pop()));

			// put them in the arg list
			for(var k=args.length-1; k>=0 ; k--)
				val = val.replace('?',args.pop());

      stack.push(val);
    }
  }

  if(stack.length != 1) {
    var err = 'Too many inputs, probably missing an operator';
    return parseError(err);
  }

  return stack.pop();
}



// Convert infix to postfix format
// using dijkstra's shunting yard algorithm
// returns array
function infixToPostfix(fnString) {

  var tokenArray = tokenizer(fnString);
  if (!tokenArray) return false; // error in tokenizing

  var next;
  var tokenType;
  var i;
  var output = [];
  var stack = [];

  // While there are tokens to be read:
  for(i = 0; i < tokenArray.length; i++) {
    next = tokenArray[i];
    tokenType = getTokenType(next);

    switch (tokenType)
    {
      case 'n':
        output.push(next);
        break;

      case 'f':
        stack.push(next);
        break;

      case 'o':
        while ( (stack.length > 0) && hasLowerPrecedence(next, stack[stack.length - 1]) ) {
          output.push(stack.pop());
        }

        stack.push(next);
        break;

      case 'l':
        stack.push(next);
        break;

      case 'r':
        var topStack;
        var matched = false;
        do
        {
          topStack = stack.pop();

          if (topStack == '(') {
            matched = true;
          }
          else {
            output.push(topStack);
          }

        } while( !matched && (stack.length > 0) );

        //mismatched paren
        //need better error message
        if (!matched){
          var err = 'Mismatched parenthesis';
          return parseError(err);
        }

        if (stack.length == 0) break;

        if (getTokenType(stack[stack.length-1]) == 'f')
          output.push(stack.pop());

        break;

      // if token doesn't exist anywhere, it is malformed
      default:
        var err = 'Unknown variable: ' + next;
        return parseError(err);
    }
  }

  while(stack.length > 0)
  {
    next = stack.pop();
    tokenType = getTokenType(next);

    //mismatched paren
    if( '()'.indexOf(next) != -1 ){
      var err = 'Mismatched parenthesis';
      return parseError(err);
    }

    output.push(next);
  }

  return output;
}

//tokenizer
// takes:   input string
// returns: array of tokens
function tokenizer(str) {
  var nextChar;
  var charType;
  var tokens = [];
  var returnHandler = [];
  var currentToken = '';
  var tokenType = null;
  var i = 0;
  do
  {
    nextChar = str.charAt(i);
    charType = getCharType(nextChar);

    switch (charType)
    {
      case 'w':
        returnHandler = handleWhitespace(tokens, tokenType, currentToken, nextChar);
        break;

      case 'n':
        returnHandler = handleNumber(tokens, tokenType, currentToken, nextChar);
        break;

      case 's':
        returnHandler = handleString(tokens, tokenType, currentToken, nextChar);
        break;

      case 'o':
        returnHandler = handleOperator(tokens, tokenType, currentToken, nextChar);
        break;

      case 'p':
        returnHandler = handleParen(tokens, tokenType, currentToken, nextChar);
        break;
    }

    // something bad happened, return false
    if(!returnHandler) return false;

    //update vars
    currentToken = returnHandler[0];
    tokenType = returnHandler[1];
    i++;

  } while(i < str.length);

  //flush token buffer
  addToken(tokens, currentToken);
  return tokens;
}


/* handle different cases of new char input
 * returns [newCurrentToken, newTokenType]
 */

function handleOperator(tokenArray, currentTokenType, currentToken, op) {
  var toRet = [currentToken, currentTokenType];

  // unary minus only occurs if '-' found at
  // 1) beginning of string -> tokenArray.length = 0, currentToken = ''
  // 2) after another operator -> currentTokenType = 'o';

  if( (op == '-') &&
      ( (currentTokenType == 'o') ||
        (currentToken == '(') ||
        ( (tokenArray.length == 0) &&
          (currentToken == '') ))) // oh god it looks like scheme
  {
    addToken(tokenArray, currentToken);
    toRet[0] = '~';
    toRet[1] = 'o';
  }

  // operators should not follow each other besides unary minus
  else if(currentTokenType == 'o')
  {
    var err = 'Operations cannot follow each other: ' + currentToken + ' ' + op;
    return parseError(err);
  }

  // flush buffer return tokens
  else
  {
    addToken(tokenArray, currentToken);
    toRet[0] = op;
    toRet[1] = 'o';
  }

  return toRet;

}

function handleString(tokenArray, currentTokenType, currentToken, str) {
  var toRet = [currentToken, currentTokenType];

  //current token is number or a parenthesis
  //implied multiplication
  //3x -> 3*x
  //sin(x)cos(x) -> sin(x) * cos(x)
  if( (currentTokenType == 'n') || (currentToken == ')') )
  {
    addToken(tokenArray, currentToken);
    addToken(tokenArray,'*')
    toRet[0] = str;
    toRet[1] = 's';
  }

  // current token is string, just append char to it
  else if( currentTokenType == 's' )
  {
    toRet[0] = currentToken + str;
    toRet[1] = 's';
  }

  else
  {
    addToken(tokenArray, currentToken);
    toRet[0] = str;
    toRet[1] = 's';
  }

  return toRet;
}

function handleNumber(tokenArray, currentTokenType, currentToken, num) {
  var toRet = [currentToken, currentTokenType];

  //current token is string/number, just append char to it
  if(currentTokenType == 's')
  {
    toRet[0] = currentToken + num;
    toRet[1] = 's';
  }
  if(currentTokenType == 'n')
  {
    toRet[0] = currentToken + num;
    toRet[1] = 'n';
  }
  else
  {
    addToken(tokenArray, currentToken);
    toRet[0] = num;
    toRet[1] = 'n';
  }
  return toRet;
}

function handleWhitespace(tokenArray, currentTokenType, currentToken, white) {
  addToken(tokenArray, currentToken);
  return ['', currentTokenType];
}

function handleParen(tokenArray, currentTokenType, currentToken, paren) {

  addToken(tokenArray, currentToken);

  // number followed by paren is multiplication
  // 9(1 + x) -> 9 * (1+x)
  if ( (currentTokenType == 'n') && (paren == '(') )
    addToken(tokenArray,'*');

  // right paren followed by left paren is multiplication
  // sin(x)(1+x) -> sin(x)*(1+x)
  if ( (currentToken == ')') && (paren == '(') )
    addToken(tokenArray,'*');

  var type = (paren == '(') ? 'l' : 'r';
  return [paren,'p'];
}

// Add a token to an array,
// but try to convert it into its correct type first
function addToken(tokenArray, val) {
  var n;

  if(val == '') return;

  // try to make it a number
  n = parseFloat(val);
  if (!isNaN(n)) {
    tokenArray.push(n);
    return;
  }

  //it's just a normal string
  tokenArray.push(val);
  return;
}


/* getCharType -> Return type of char
 * Types are:
 * w - whitespace
 * n - numeric
 * o - operator
 * s - string (for variables)
 */
function getCharType(charToCheck) {

  /* these errors should not have messages
  if(charToCheck == undefined){
    var err = 'Error: getCharType\n';
    err += 'character to check is undefined';
    return parseError(err);
  }

  if(charToCheck.length > 1){
    var err = 'Error: getCharType\n';
    err += 'character to check has length > 1: ' + charToCheck;
    return parseError(err);
  }
  */
  if(charToCheck == undefined) return false;
  if(charToCheck.length > 1) return false;

  //whitespace
  if(' \t\n\r\f'.indexOf(charToCheck) != -1) return 'w';

  //number
  if('0123456789.'.indexOf(charToCheck) != -1) return 'n';

  //operator
  if (validOperators.indexOf(charToCheck) != -1) return 'o';

  if ('()'.indexOf(charToCheck) != -1) return 'p';

  //string
  return 's'; // string, either a list of numbers or vars
}

/* getTokenType -> Return the type of the token
 * Types are:
 * n - number or variable
 * f - mathematical function (e.g. sin)
 * o - operator (e.g. +,-...)
 * r - right parenthesis
 * l - left parenthesis
 */
function getTokenType(token){
//  if(token == null) return null;

  // check if it is a number
  if(typeof(token) == 'number') return 'n';

  // left paren
  if(token == '(') return 'l';

  // right paren
  if(token == ')') return 'r';

  // operator
  if( (token.length == 1) && (validOperators.indexOf(token) != -1) )
    return 'o';

  // some string, check if it is in lookup table
  var type = FN_LIST[token];
  if (type != undefined) return type[1];

  // user doesn't need to know THIS error
  /*
  var err = 'Error: getTokenType\n';
  err += 'Could not determine type of: ' + token;
  return parseError(err);
  */
  return false;
}


/* getTrueValue -> get javascript readable value of token
 *
 * if value is number or operator, just return value
 * otherwise, return its val from lookup table
 *
 * assumes if val is a variable, it exists
 * in FN_LIST. This sanitation is done elsewhere
 */
function getTrueValue(val) {
  var fnLookup = FN_LIST[val];
  if(fnLookup != undefined) return fnLookup[0];
  return ''+val;
}

/* Get the precedence of two operators
 * essentially order of operations
 * but it has to deal with associativity
 * as well.
 *
 * a has lower precedence than b if:
 *  a is left associative and precedence of a is <= to b
 *
 *  a is right associative and precedence of a is < b
 *
 *  precedence is defined by order of operations
 */
function hasLowerPrecedence(a, b) {

  if( validOperators.indexOf(b) == -1 ) return false;

  var aPrecedence = -1;
  var bPrecedence = -1;

  aPrecedence = precedenceOrder[a];
  bPrecedence = precedenceOrder[b];

  if(operatorAssociativity[a] == 'l'){
    if(aPrecedence > bPrecedence){
      return false;
    } else {
      return true;
    }
  } else {
    if(aPrecedence >= bPrecedence){
      return false;
    } else {
      return true;
    }
  }
}
