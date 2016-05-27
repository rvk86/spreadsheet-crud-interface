function submitForm(sheetName, values) {

    var s = getSpreadsheet().getSheetByName(sheetName);

    setAuditColumns(sheetName);

    values[1] = Session.getActiveUser().getEmail();

    Logger.log(values);
    if(values[0] === '') {
        values[0] = s.getRange(s.getLastRow(), 1).getValue() + 1;
        return s.appendRow(values);
    } else {
        updateRow(s, values);
    }

}

function setAuditColumns(sheetName) {

    var s = getSpreadsheet().getSheetByName(sheetName);

    var columns = getColumnNames(sheetName);
    var numRows = s.getLastRow();

    // If _id column does not exist, create and populate
    if(columns[0][0] !== '_id') {
        s.insertColumnBefore(1);
        s.getRange(1, 1).setValue('_id');
        s.hideColumns(1);


        var ids = _.map(_.range(1, numRows - 1), function(num) { return [num]; });
        s.getRange(1 + titleColumns, 1, numRows - titleColumns).setValues(ids);
    }

    // If _user column does not exist, create
    if(columns[0][1] !== '_created_by') {
        s.insertColumnAfter(1);
        s.getRange(1, 2).setValue('_created_by');
        s.hideColumns(2);
    }

}

function updateRow(s, values) {

    var rows = JSON.parse(getAllRows(sheetName));

    rows = _.map(rows, function(r) {
        if(Number(r[0]) === Number(values[0])) {
            return values;
        } else {
            return r;
        }
    });

    getFullDataRange(s).setValues(rows);

}