// TODO call trimmer on user input to store the original string

/*****************************
  GLOBAL VARIABLES
*****************************/

/* Keep track of the number of rows and columns */
var rowCount = 1;
var colCount = 2;

/* Used to prevent updating when clearing a row or column  */
var silencer = false;

/* All the user input is stored here */
var plotsList = new Array();

/*****************************
  GLOBAL CONSTANTS
*****************************/

/* Used in createCellString() */
var CELL_HEADER_PREFIX = '<td align="center" style="min-width:60px;" id="';
var CELL_HEADER_SUFFIX = '">';
var CELL_END = '</td>';

/* Used in createRowString() */
var ROW_HEADER_PREFIX = '<tr id="row_';
var ROW_HEADER_SUFFIX = '">'
var ROW_END = '</tr>';

/* Used in createCellID() */
var CELL_ID_HEADER = 'cell_';

/* Used in createRowString() */
var DEFAULT_X_VALUE = 0;

/* Header of key of {plotsList} array */
var KEY_HEADER = 'col_';

/* Invalid Cell Vaue */
var INVALID = '---';

var INPUT_ID = '#new_column';

var DEFAULT_TABLE_HTML =
  '<table id="plot_table" border="1" cellspacing="0" cellpadding="2">' +
    '<tbody>' +
      '<tr id="row_0" class="nodrop nodrag rowHead">' +
        '<td id="cell_0_0" align="center" class="">X-Value</td>' +
        '<td id="cell_0_1" align="center" class="" style="min-width:60px">x</td>' +
      '</tr>' +
    '</tbody>' +
  '</table>';

/*****************************
  Reads the cell and plots them
*****************************/

function tablePlot() {
  var r = 0, c = 0;
  var ptLst = null;
  var thisCol = null;
  var xValue = null;
  var yValue = null;
  var obj = null;

  for (c = 0; c < colCount; c++) {
    thisCol = KEY_HEADER + c
    if ((thisCol in plotsList) && (plotsList[thisCol] != null)) {
      ptLst = new Array();
      for (r = 1; r < rowCount; r++) {
        xValue = $('#row_' + r + ' td:first').html();
        if (xValue != INVALID) {
          yValue = $(createCellID(r, c, '#')).html();
          if (yValue != INVALID) {
            if ((isFinite(xValue) == true) && (isFinite(yValue))) {
              ptLst[xValue] = yValue;
            }
          }
        }
      }

      obj = new plotObj('#' + PRESET_HEX_COLORS[c % (PRESET_HEX_COLORS.length - 1)],
        ptLst, $('#dotSize').val());

      plotPointObj(KEY_HEADER + c, obj);
    }
  }
}

/*****************************
  CREATOR OF ROW and COLUMN
  - Only creates the string, it is the job of the caller
    to append it to the correct location.
*****************************/

/* Creates a string containing a cell with given id and value */
/* ID of each cell = 'cell_{row}_{column}' */
function createCellString(id, cellStr) {
  // TODO STYLE THE CELL
  return CELL_HEADER_PREFIX + id + CELL_HEADER_SUFFIX + cellStr + CELL_END;
}

/* Creates a string containg an entire row. */
function createRowString(row) {

  /* Create the first first column of row {row} */
  var cellID = createCellID(row, '0', '');
  var cellContent = DEFAULT_X_VALUE;
  var body = createCellString(cellID, cellContent);
  var thisCol = null;

  /* Create the rest of the column(s) */
    for (var i = 1; i < colCount; i++) {
    cellID = createCellID(row, i, '');
    thisCol = KEY_HEADER + i;

    if ((thisCol in plotsList) && (plotsList[thisCol] != null)) {
      try {
        cellContent = plotsList[thisCol].fnPtr(DEFAULT_X_VALUE);
        if (isFinite(cellContent) == false) {
          cellContent = INVALID;
        }
      } catch (err) {
        cellContent = INVALID;
      }
    }

    body += createCellString(cellID, cellContent);
  }

  return ROW_HEADER_PREFIX + row + ROW_HEADER_SUFFIX + body + ROW_END;
}

/*****************************
  ALLOWS INLINE EDITING OF CELLS
*****************************/

/* Column Header */
function makeColumnHeaderEditable(id, column) {
  $(id).editable(function(value, settings) {
      var thisCol = KEY_HEADER + column;

      if (value == '') {
        if (plotsList[thisCol] != null) {
          delete plotsList[thisCol].fnPtr;
          delete plotsList[thisCol];
          plotsList[thisCol] = null;
        }
        silencer = true;
        return INVALID;
      } else {
        if (addFunction(column, value) == true) {
          return value;
        }
        return plotsList[thisCol].origFnStr;
      }
    }, {
      type: 'text',
      onblur: 'submit',
      width: 'auto',
      tooltip: 'Double Click to Edit This Function',
      select: true,
      event: 'dblclick',
      callback: function() { updateColumnX(column); }
    });
}

/* Row Header */
function makeRowHeaderEditable(id, row) {
  $(id).editable(function(value, settings) {
      if (value == '') {
        silencer = true;
        return INVALID;
      }

      try {
        var result = eval(value);
        if (isFinite(result)) {
          return result;
        }
      } catch (err) {
        return DEFAULT_X_VALUE;
      }

      return DEFAULT_X_VALUE;
    }, {
      type: 'text',
      onblur: 'submit',
      width: 'auto',
      tooltip: 'Double Click to Edit This X-Value',
      select: true,
      event: 'dblclick',
      callback: function() { updateRowX(row); }
    });
}

/*****************************
  ADDS ROW/COLUMN
*****************************/

function appendRow() {
  // TODO: Issue that the table has to contain at least ONE row
  //  maybe create a hidden row?

  var tmpRow = rowCount;
  $('#plot_table tr:last').after(createRowString(tmpRow));

  // TODO: Here we can use jQuery selectors to style the components
  //  programatically, or you can do it via createCellString.

  // TODO: Style even/odd rows differently?

  makeRowHeaderEditable(createCellID(tmpRow, 0, '#'), tmpRow);
  $(createCellID(tmpRow, 0, '#')).addClass('colHead');

  rowCount++;
}

function appendColumn() {
  /* Check to make sure the function is not empty - write error message if so */
  if ($('#new_column').val() != "") {

    var newColumnCell = "";
    var tmpCol = colCount;
    var thisCol = KEY_HEADER + tmpCol;
    var newFuncStr = $(INPUT_ID).val();

    if (addFunction(tmpCol, newFuncStr) == false) {
      writeError('Error: Invalid function string');
      $(INPUT_ID).focus();
      return false;
    }

    /* First row of new column */
    newColumnCell = createCellString(createCellID(0, tmpCol, ''), newFuncStr);
    $('#row_0 td:last').after(newColumnCell);

    makeColumnHeaderEditable(createCellID(0, tmpCol, '#'), tmpCol);

    /* Clean input field */
    $(INPUT_ID).val('');

    /* Begin handling of the remaining rows */
    var cellID = '';
    var cellContent = '';
    var xValue = '';

    for (var i = 1; i < rowCount; i++) {
      cellID = createCellID(i, tmpCol, '');

      xValue = $('#row_' + i + ' td:first').html();
      if (xValue != INVALID) {
        xValue = parseFloat(xValue);
        try {
          cellContent = plotsList[thisCol].fnPtr(xValue);
          if (isFinite(cellContent) == false) {
            cellContent = INVALID;
          }
        } catch (err) {
          cellContent = INVALID;
        }
      } else {
        cellContent = INVALID;
      }

      newColumnCell = createCellString(cellID, cellContent);

      /* Add the cell */
      $('#row_' + i + ' td:last').after(newColumnCell);
    }

    colCount++;
  } else {
    // Change this to delete this column
    $(INPUT_ID).focus();
    writeError('Error: Cannot add an empty function');
  }
}

/*****************************
  ROW/COLUMN UPDATE FUNCTIONS
  - called when the header of each row or column
    is updated
*****************************/

/* Update row {x} */
function updateRowX(x) {
  if ((x != 0) && (x < rowCount)) {

    /* Cannot find row x */
    if ($('#row_' + x + ' td:first') == null) {
      return false;
    }

    /* Extract the x value */
    var xValue = $('#row_' + x + ' td:first').html();
    var result = null;
    var thisCol = null;

    /* Check conditions and xValue */
    if ((silencer == false) && (xValue != '---')) {
      xValue = parseFloat(xValue);
    } else {
      silencer = true;
    }

    /* Row header (ie the x-value) does not need to be updated */
    for (var i = 1; i < colCount; i++) {
      thisCol = KEY_HEADER + i;
      result = INVALID;

      if ((silencer == false) && (thisCol in plotsList) && (plotsList[thisCol] != null)) {
        result = plotsList[thisCol].fnPtr(xValue);

        /* Make sure the result is finite */
        if (isFinite(result) == false) {
          result = 'NaN';
        }
      }

      /* Update the cell */
      $('#cell_' + x + '_' + i).html(result);
    }
    silencer = false;
  }
}

/* Updates column {x} */
function updateColumnX(x) {
  if ((x != 0) && (x < colCount)) {

    /* Cannot find the first row, column x */
    if ($('#cell_0_' + x) == null) {
      return false;
    }

    var xValue = '';
    var thisCol = KEY_HEADER + x;
    var result = null;

    /* Cannot find the plot information */
    if (!(thisCol in plotsList) || (plotsList[thisCol] == null)) {
      silencer = true;
    }

    /* Do not update the column header which contains the function */
    for (var i = 1; i < rowCount; i++) {
      result = '---';

      if (silencer == false) {
        /* Extract the x-value */
        xValue = $('#cell_' + i + '_0').html();

        /* Check the x-value */
        if (xValue != INVALID) {
          xValue = parseFloat(xValue);
          result = plotsList[thisCol].fnPtr(xValue);

          /* Make sure the result is finite */
          if (isFinite(result) == false) {
            result = 'NaN';
          }
        }
      }

      /* Update the value of the cell */
      $('#cell_' + i + '_' + x).html(result);
    }
    silencer = false;
  }
}

/*****************************
  HELPER FUNCTION(S)
*****************************/

/* Resets the table to initial state */
function resetTable() {
  $('#table_wrapper').html(DEFAULT_TABLE_HTML);
  rowCount = 1;
  colCount = 2;
	for (i in plotsList) {
		delete plotsList[i];
	}
	plotsList['col_1'] = new tableObj('x', 'x', new Function('x', 'return x'));
	makeColumnHeaderEditable('#cell_0_1', 1);
  appendRow();
  appendRow();
  unplotTable();
}

/* Wrapper for writting error to console */
function writeError(errMsg) {
  con.write('msg', errMsg, '#FF0000');
}

/* Create an object to store data to */
function tableObj(origFnStr, parsedFnStr, fnPtr) {

  /* The original function string (ie user input) */
  this.origFnStr = origFnStr;

  /* The parsed function string (ie the sanitized input) */
  this.parsedFnStr = parsedFnStr;

  /* The actual function used to calculate values (takes one argument) */
  this.fnPtr = fnPtr;
}

/* Wraps our data to pass to plot.svg */
function plotObj(color, ptLst, radius) {
  this.color = color;
  this.ptLst = ptLst;
  this.radius = radius;
}

/* Creates a string containing cell id */
function createCellID(row, column, prefix) {
  return prefix + CELL_ID_HEADER + row + '_' + column;
}

/* Sanitizes {fnStr} and adds it to the global variable if valid */
function addFunction(column, fnStr) {
  var orig = fnStr;

  /* We do not allow polar or parametric */
  fnStr = formatExpression(trimmer(fnStr), 'fx');

  if (fnStr != '') {
    var thisCol = KEY_HEADER + column;

    /* Remove old plot if we are changing it */
    if ((thisCol in plotsList) && (plotsList[thisCol] != null)) {
      delete plotsList[thisCol].fnPtr;
      delete plotsList[thisCol];
    }

    plotsList[thisCol] = new tableObj(orig, fnStr, new Function('x', 'return ' + fnStr));

    return true;
  }

  return false;
}

/*****************************
  UNUSED FUNCTION(S)
*****************************/

function hideRowX(x) {
  if ((rowCount != 2) && (x != 0)) {
    $('#row_' + x).attr({'display':'none'});
    rowCount--;
  } else {
    writeError('Error: Cannot remove last row');
  }
}

function hideColumnX(x) {
  if ((colCount != 2) && (x != 0)) {
    for (var i = 0; i < rowCount; i++) {
      $('#cell_' + i + '_' + x).attr({'display':'none'});
    }
    colCount--;
  } else {
    writeError('Error: Cannot remove last column');
  }
}

// Removes row X
function removeRowX(x) {
  if ((rowCount != 2) && (x != 0)) {
    $('#row_' + x).remove();
    rowCount--;
  } else {
    writeError('Error: Cannot remove last row');
  }
}

// Removes column X
function removeColumnX(x) {
  // TODO: Maybe we can add a class into it and retrieve it using jQuery selector?
  if ((colCount != 2) && (x != 0)) {
    for (var i = 0; i < rowCount; i++) {
      $('#cell_' + i + '_' + x).remove();
    }
    colCount--;
  } else {
    writeError('Error: Cannot remove last column');
  }
}
