function getColumnNames(sheetName) {

    var s = getSpreadsheet().getSheetByName(sheetName);

    var columnNames = s.getRange(1, 1, titleColumns, s.getLastColumn()).getValues();
    columnNames[1] = _.map(columnNames[1], function(cell) {

        try {
            return JSON.parse(cell);
        } catch(err) {
            throw 'It seems like you have some badly formatted JSON in your sheet.' +
                  'These are some examples of well formatted settings:' +
                  '{"type": "text", "label": "First Name"}, ' +
                  '\n{"type": "select", "options": ["Option 1", "Option 2", "Option 3"]}. ' +
                  'Please review all your columns and refreh this page.';
        }


    })

    return columnNames;

}


function getAllRows(sheetName) {

    var s = getSpreadsheet().getSheetByName(sheetName);

    var rows = _getFullDataRange(s).getValues();

    // Stringify is necessary because of dates, probably
    return JSON.stringify(rows);

}

// Generating the html on the backend is a looot faster than doing the loop in the template itself.
function getHtmlRows(sheetName) {

    var rows = getDataOnly(JSON.parse(getAllRows(sheetName)));

    var htmlRows = '';

    for(var i in rows) {

        var htmlRow = '<tr>';
        for(var c = auditRows; c < rows[i].length; c++) {
            htmlRow +=  '<td>' +
                            '<a class="trigger-action"' +
                               'href="#"' +
                               'data-sheet-name="' + sheetName + '"' +
                               'data-row-id="' + rows[i][0] + '"' +
                               'data-template="part_form">' +
                               rows[i][c] +
                            '</a>' +
                        '</td>';
        }

        htmlRow += '</tr>';

        htmlRows += htmlRow;
    }

    return htmlRows;

}


function getFormFields(sheetName, rowId) {

    var s = getSpreadsheet().getSheetByName(sheetName);

    var columnNames = getColumnNames(sheetName);
    var rowPosition = rowId ? getRowPosition(s, rowId) : -1;
    var row = rowPosition > -1 ? s.getRange(rowPosition, 1, 1, s.getLastColumn()).getValues()[0] : false;



    var fields = [];
    for (var i in columnNames[0]) {

        var options = columnNames[1][i];
        options['id'] = options['id'] || columnNames[0][i];
        options['value'] = row ? row[i] : options['value'] ? options['value'] : '';

        fields.push(options);

    };

    return fields;

}


function _getFullDataRange(s, fromCol, numCols) {

    var fromCol = fromCol || 1;
    var numCols = numCols || s.getLastColumn();

    return s.getRange(1, fromCol, s.getLastRow(), numCols);

}


function getDataOnly(rows) {

    var data = rows.slice(titleColumns);

    return data;

}


function getUsers(sheetName) {

    var s = getSpreadsheet().getSheetByName(sheetName);

    var userList = _getFullDataRange(s, 2, 1).getValues();
    userList = _.flatten(userList);

    return getDataOnly(userList);

}