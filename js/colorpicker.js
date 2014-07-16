/*
ColorPicker - Copyright (c) 2004, 2005 Norman Timmler (inlet media e.K., Hamburg, Germany)
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. The name of the author may not be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* modifications for BCalc implementation */

cp_spacer_image = 'img/spacer.gif';

cp_hexValues = Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
cp_currentColor = '';

function cp_showSatBrightBox(col, key) {
  element = cp_getElementById('cp_satbrightbox'+key);
  html = '';

  s = 16; // steps
  colEnd = Array();

  col[0] = 256 - col[0];
  col[1] = 256 - col[1];
  col[2] = 256 - col[2];


  // calculating row end points
  for (j = 0; j < 3; j++) {
    colEnd[j] = Array();
    for (i = s; i > -1; i--) {
      colEnd[j][i] =  i * Math.round(col[j] / s);
    }
  }

  hexStr = '';
  for (k = s; k > -1; k--) {
    for (i = s; i > -1; i--) {
      for (j = 0; j < 3; j++) {
        dif = 256 - colEnd[j][k];
        quot = (dif != 0) ? Math.round(dif / s) : 0;
        hexStr += cp_toHex(i * quot);
      }
      html += "<span style=\"background-color:#" +
        hexStr + ";\"><a class=\"faux_link\" onclick=\"cp_showColorBox('" +
        hexStr + "', \'"+ key +"\');\"><img src=\"" + cp_spacer_image + "\"/></a></span>";
      hexStr = '';
    }
    html += "<br />";
  }

  element.innerHTML = html;
}

function cp_showSpectrumBox(key) {
  element = cp_getElementById('cp_spectrumbox' + key);
  html = '';

  d = 1; // direction
  c = 0; // count
  v = 0; // value
  s = 16; // steps
  col = Array(256, 0, 0); // color array [0] red, [1] green, [2] blue
  ind = 1; // index
  cel = 256; //ceiling

  while (c < (6 * 256)) {
    html += "<span style=\"background-color:#" + cp_toHex(col[0]) + cp_toHex(col[1]) + cp_toHex(col[2]) +
      "\"><a class=\"faux_link\" onclick=\"cp_showSatBrightBox(Array(" +
      col[0] + "," + col[1] + "," + col[2] + "), \'"+key+"\');\"><img src=\"" + cp_spacer_image + "\" /></a></span>";

    c += s;
    v += (s * d);
    col[ind] = v;

    if (v == cel) {
      ind -= 1;
      if (ind == -1) ind = 2;
      d = d * -1;
    }

    if (v == 0) {
      ind += 2;
      if (ind == 3) ind = 0;
      d = d * -1;
    }
  }
  element.innerHTML = html;

  cp_showSatBrightBox(col, key);
}


function cp_toHex(num) {
  if (num > 0) num -= 1;
  base = num / 16;
  rem = num % 16;
  base = base - (rem / 16);
  return cp_hexValues[base] + cp_hexValues[rem];
}

function cp_showColorBox(hexStr, key){
  colorbox = cp_getElementById('cp_colorbox'+key);
  colorboxhtml = "<span style=\"background-color:#" + hexStr + "\"><img src=\"" + cp_spacer_image + "\" /></span>";
  colorbox.innerHTML = colorboxhtml;

  document.getElementById('hex' + key).value = hexStr;
  cp_currentColor = hexStr;
}

function cp_show(key) {
  if (colorState[key] == false) {
    colorState[key] = true;
    cp_showSpectrumBox(key);
    //element = cp_getElementById('cp_colorpickerbox' + key);
    //element.style.visibility = 'visible';
    $('#cp_colorpickerbox' + key).show();
    cp_currentColor = $('#hex' + key).val();
  } else {
    cp_ok(key);
    //cp_hide(key);
  }
}

function cp_ok(key) {
  document.getElementById('colorbox'+key).style.backgroundColor = "#" + cp_currentColor;
  cp_hide(key);
  //element.style.visibility = 'hidden';
  changeColor(key, cp_currentColor);
}

function cp_hide(key) {
  colorState[key] = false;
  $('#cp_colorpickerbox' + key).hide('fast');
  //element = cp_getElementById('cp_colorpickerbox'+key);
  //element.style.visibility = 'hidden';
  changeColor(key, cp_currentColor);
}

function cp_getElementById(e, f) {
  if (document.getElementById) {
    return document.getElementById(e);
  }
  if(document.all) {
     return document.all[e];
  }
}
