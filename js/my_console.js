function myConsole(){
  this.location = document.getElementById("concont");
  this.inarray = [];
  this.outarray = [];
  this.hcount = -1;
  this.farray = [];
  this.output = document.createElement("div");
  this.output.className = "container";
  this.location.insertBefore(this.output, this.location.firstChild);
}



/* write to console:
 * type = type of console output
 * value = string that console should output
 * color = color of text
 *
 * types are in {in,out,msg}
 * in => aligned left with bullet
 * out => aligned right
 * msg => aligned left
 */
myConsole.prototype.write = function(type, value, color){
  var newdiv = document.createElement("div");
  newdiv.className = type;
	newdiv.style.color = color;
  if(type == 'in')
    value = "&bull; "+value;
  newdiv.innerHTML = value;
	this.output.appendChild(newdiv);
	this.output.scrollTop = this.output.scrollHeight;
}

//on key press
myConsole.prototype.key = function(e){
  // TODO Firefox throws a warning on the next line
  var t = document.text.text;
  //enter
  if(e.keyCode == 13){
		this.enter();
  //up
  }else if (e.keyCode == 38 && this.inarray.length != 0){
    this.hcount++;
    if(this.hcount == this.inarray.length)
      this.hcount = this.inarray.length - 1;
    t.value = this.inarray[this.hcount];

  //down
  }else if (e.keyCode == 40){
    this.hcount--;
    if(this.hcount < 0){
      this.hcount = -1;
      t.value = '';
    }else
      t.value = this.inarray[this.hcount];
  }
}

Math.pow_ = Math.pow;
Math.pow = function(_base, _exponent) {
  if (_base < 0) {
    if (Math.abs(_exponent) < 1) {
      //we're calculating nth root of _base, where n === 1/_exponent
      if (1 / _exponent % 2 === 0) {
        //nth root of a negative number is imaginary when n is even, we could return
        //a string like "123i" but this would completely mess up further computation
        return NaN;
      }/*else if (1 / _exponent % 2 !== 0)*/
      //nth root of a negative number when n is odd
      return -Math.pow_(Math.abs(_base), _exponent);
    }
  }/*else if (_base >=0)*/
  //run the original method, nothing will go wrong
  return Math.pow_(_base, _exponent);
};

myConsole.prototype.enter = function(){
  var t = document.text.text;
  var spaceval = " "+t.value;
	this.write('in',spaceval, BLACK);
	this.inarray.unshift(t.value);
	setTimeout(function() { t.value = ''; }, 0);
	this.hcount = -1;

	//replaces all ans(xxx) with the previous answers
	if(spaceval.match(/([^a-z0-9])ans\([0-9]{1,}\)/i)){
		var reg = /([^a-z0-9])ans\([0-9]{1,}\)/gi;
		var ansarray = spaceval.match(reg);
		for (var i=0;i<ansarray.length;i++){
			var num = ansarray[i].match(/\d{1,}/);
			spaceval = spaceval.replace(ansarray[i],ansarray[i].substring(0,1)+this.outarray[num-1]);
		}
	}

	//if graphing
	if(t.value.match(/^[\s]*graph[\s]*\(/)){
		var out = 'hi';
	//if programming function
	}else if(t.value.match(/^[\s]*function\s/)){
		var out = t.value.split(/^[\s]*function[\s]*/)[1].split(/\(/)[0];
		this.farray[out]=t.value;

	//if accessing function
	}else if(t.value.match(/\(/) && this.farray[t.value.split(/[\s]*\(/)[0]]){
		var out = eval(this.farray[t.value.split(/[\s]*\(/)[0]]+spaceval);
	//normal input
	}else{
		var out = formatExpression(spaceval,'fx');
		//not x to take into account fx
		if(out && out != 'x'){
			out = eval(out);
		} else {
			out = '';
		}
	}

	//if clearing
	if(t.value=="clear")
		this.output.innerHTML="";
	else{
		this.outarray.unshift(out);
		this.write('out',out,GREEN);
	}
}
