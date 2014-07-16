function start_print() {
	PRINT = true;
  // If window is not properly initialized, stop loading content
  if ((typeof window != "undefined") && (window != null)) {
    var urlvars = getURLVars(); //from urlfunctions.js
		var eqDiv = document.getElementById('equations');
		window.setInit(urlvars['w']);
		var j = 0;
		for(i in urlvars){
			if(i != 'w'){
				var newdiv = document.createElement('div');
				newdiv.innerHTML = (urlvars[i]['f']);
				newdiv.style.color = (urlvars[i]['c']);
				eqDiv.appendChild(newdiv);
/*					addEquation(urlvars[i]['t']);
				var key = urlvars[i]['t']+"_eq"+j;
				if(urlvars[i]['t'] == 'param'){
					var fs = urlvars[i]['f'].split(';');
					document.getElementById(key).value = fs[0];
					document.getElementById(key+'_y').value = fs[1];
				}else{
					document.getElementById(key).value = urlvars[i]['f'];
				}
				if(urlvars[i]['t'] != 'fx'){
					document.getElementById(key+'_start').value = urlvars[i]['s'];
					document.getElementById(key+'_end').value = urlvars[i]['e'];
				}
				document.getElementById('colorbox'+key).style.backgroundColor = urlvars[i]['c'];
				changeColor(key,urlvars[i]['c'].substring(1));
				if(urlvars[i]['v'] == 'false')
					toggleVisibilityHandler(key+'_visi');
				j++;
				*/
			}
		}
//		generate_graph();
  }
}
