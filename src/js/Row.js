function submitForm(sheetName, values) {

    var s = getSpreadsheet().getSheetByName(sheetName);

    // If _id column does not exist, create and populate audit columns
    var columns = getColumnNames(s);

    if(columns[0][0] !== '_id') {
        setAuditColumns(s);
        values.unshift('', '');
    }

    values[1] = Session.getActiveUser().getEmail();

    if(values[0] === '') {
        values[0] = s.getRange(s.getLastRow(), 1).getValue() + 1;
        return s.appendRow(values);
    } else {
        updateRow(s, values);
    }

}


function deleteRow(atts) {

    var s = getSpreadsheet().getSheetByName(atts.sheetName);

    var position = getRowPosition(s, atts.rowId);

    if(position > -1) {
        s.deleteRow(position);
    } else {
        throw 'No record found with this id';
    }

}


function getRowPosition(s, rowId) {

    var ids = _.map(
                    _.flatten(getFullDataRange(s, 1).getValues()), function(id) { return Number(id); }
                );

    var index = ids.indexOf(Number(rowId));
    return index > - 1 ? index + titleColumns + 1 : -1;

}


function setAuditColumns(s) {

    var numRows = s.getLastRow();

    s.insertColumnBefore(1);
    s.getRange(1, 1).setValue('_id');
    s.getRange(2, 1).setValue('{"type": "hidden"}');

    var ids = _.map(_.range(1, numRows - 1), function(num) { return [num]; });
    s.getRange(1 + titleColumns, 1, numRows - titleColumns).setValues(ids);

    s.insertColumnAfter(1);
    s.getRange(1, 2).setValue('_created_by');
    s.getRange(2, 2).setValue('{"type": "hidden"}');
    s.hideColumns(1, 2);

}

function updateRow(s, values) {

    var position = getRowPosition(s, values[0]);
    s.getRange(position, 1, 1, s.getLastColumn()).setValues([values]);

}