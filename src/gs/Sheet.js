function getColumnNames(sheetName) {

    var s = getSpreadsheet().getSheetByName(sheetName);

    var columnNames = s.getRange(1, 1, titleColumns, s.getLastColumn()).getValues();
    columnNames[1] = _.map(columnNames[1], function(cell) { return JSON.parse(cell); })

    return columnNames;

}


function getAllRows(sheetName) {

    var s = getSpreadsheet().getSheetByName(sheetName);

    var rows = _getFullDataRange(s).getValues();

    // Stringify is necessary because of dates, probably
    return JSON.stringify(rows);

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
        options['value'] = row ? row[i] : '';

        fields.push(options);

    };

    return fields;

}


function _getFullDataRange(s, columns) {

    var columns = columns || s.getLastColumn();

    return s.getRange(1, 1, s.getLastRow(), columns);

}


function getDataOnly(rows) {
    return _.each(_.range(titleColumns), function() { rows.shift(); });
}