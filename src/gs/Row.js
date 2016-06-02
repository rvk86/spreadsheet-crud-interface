function submitForm(atts) {

    var s = getSpreadsheet().getSheetByName(atts.sheetName);

    var columns = getColumnNames(atts.sheetName);

    // If _id column does not exist, create and populate audit columns
    if(columns[0][0] !== '_id') {
        setAuditColumns(s);
        atts.formValues.unshift('', '');
    }

    var isNew = atts.formValues[0] === '';
    atts.formValues[1] = Session.getActiveUser().getEmail();

    if(isNew) {
        var lastId = s.getRange(s.getLastRow(), 1).getValue();
        atts.formValues[0] = _.isNumber(lastId) ? lastId + 1 : 1;

        var result = s.appendRow(atts.formValues);
    } else {
        var result = updateRow(s, atts.formValues);
    }

    runTriggers(atts.sheetName, isNew, atts.formValues);

    return {'rowId': atts.formValues[0]};

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
              _.flatten(_getFullDataRange(s, 1, 1).getValues()), function(id) { return Number(id); }
                );

    var index = ids.indexOf(Number(rowId));
    return index > - 1 ? index + 1 : -1;

}


function setAuditColumns(s) {

    var numRows = s.getLastRow();

    s.insertColumnBefore(1);
    s.getRange(1, 1).setValue('_id');
    s.getRange(2, 1).setValue('{"type": "hidden"}');

    if(numRows > titleRows) {
        var ids = _.map(_.range(1, numRows - 1), function(num) { return [num]; });
        s.getRange(1 + titleRows, 1, numRows - titleRows).setValues(ids);
    }

    s.insertColumnAfter(1);
    s.getRange(1, 2).setValue('_created_by');
    s.getRange(2, 2).setValue('{"type": "hidden"}');
    s.hideColumns(1, 2);

}


function updateCell(atts) {

    var s = getSpreadsheet().getSheetByName(atts.sheetName);

    var position = getRowPosition(s, atts.rowId);
    var range = s.getRange(position, 1, 1, s.getLastColumn());

    var values = range.getValues()[0];
    values[atts.columnIndex] = atts.value;

    range.setValues([values]);

    runTriggers(atts.sheetName, false, values);

}


function updateRow(s, values) {

    var position = getRowPosition(s, values[0]);
    return s.getRange(position, 1, 1, s.getLastColumn()).setValues([values]);

}


function getTitle(row) {

    return row[auditColumns] + ' - ' + row[auditColumns + 1] + ' (' + row[0] + ')';

}

// Generating the html on the backend is a looot faster than doing the loop in the template itself.
function createOptionsObject(options, value) {

    if(_.isArray(options)) {

        var options =  _.object(options, options);

    } else if(_.isString(options)) {

        var rows = getAllRows(options);
        rows = getDataOnly(rows);

        var options =   _.object(
                        _.map(rows, function(row) { return getTitle(row); }),
                        _.map(rows, function(row) { return row[0]; }));

    } else {

        var options = options;

    }


    var htmlOptions = '';
    for(var key in options) {
        var selected = options[key] === value ? 'selected' : '';
        htmlOptions += '<option value="' + options[key] + '"' + selected + '>' + key + '</option>';
    }

    return htmlOptions;

}