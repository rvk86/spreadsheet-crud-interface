function getColumnNames(sheetName) {

    var s = getSpreadsheet().getSheetByName(sheetName);

    var columns = s.getRange(1, 1, titleColumns, s.getLastColumn()).getValues();
    return columns;

}


function getAllRows(sheetName) {

    var s = getSpreadsheet().getSheetByName(sheetName);

    var rows = getFullDataRange(s).getValues();

    // Stringify is necessary because of dates, probably
    return JSON.stringify(rows);

}


function findRow(sheetName, rowId) {

    var s = getSpreadsheet().getSheetByName(sheetName);

    var rows = JSON.parse(getAllRows(sheetName));
    var row = _.filter(rows, function(r) { return Number(r[0]) === Number(rowId); })[0];

    var columns = getColumnNames(sheetName);
    if(row) columns.push(row);

    return columns;

}


function getFullDataRange(s) {

    return s.getRange(1 + titleColumns, 1, s.getLastRow() - titleColumns, s.getLastColumn());
    
}