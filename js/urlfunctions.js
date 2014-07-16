function buildURL(printOff){
	var url = window.location.href.split('?')[0]+"?";
	var center = window.getCenter();
	url +="w=["+center+','
						+window.getValueToPixelScale()+','
						+window.getOffset()+"]";
	var curFuncObjs = window.getFuncObjs();
	var j = 0;
	for(var i in curFuncObjs){
		if(curFuncObjs[i].originalFn != ""){
			url+= "&f"+j+"=["+
						"f="+curFuncObjs[i].originalFn+','+
						"v="+curFuncObjs[i].visibility+','+
						"c="+curFuncObjs[i].color+','+
						"t="+curFuncObjs[i].type;
			if(curFuncObjs[i].type != 'fx')
				url+= ",s="+curFuncObjs[i].tStart+','+
							"e="+curFuncObjs[i].tEnd;
			url+= "]";
			j++;
		}
	}
	if(printOff){
		document.getElementById("url").value=url;
		document.getElementById("share-url").style.display = 'block';
	}else{
		url+= "&print=true";
	}
	if(plotSeparate)
		url+= "&sep=true";
	return url;
}

function getURLVars(){
	var vars = [];
	var values = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(i in values){
		var key = values[i].split('=')[0];
		vars[key] = parseVars(values[i].slice(values[i].indexOf('=') + 1));
	}
	return vars;
}
//need for testing
/*function isArray(obj) {
   if (obj.constructor.toString().indexOf("Array") == -1)
      return false;
   else
      return true;
}
*/

function parseVars(str){
	if(str.match(/\[/)){
		var subVars = [];
		str = str.replace(/[\[\]]/g, '');
		var subValues = str.split(',');
		var j=0;
		for(i in subValues){
			if(subValues[i].match(/=/))
				var key = subValues[i].split('=')[0];
			else{
				var key = j;
				j++;
			}
			subVars[key] = subValues[i].slice(subValues[i].indexOf('=')+1);
		}
		return subVars;
	}
	return str;
}