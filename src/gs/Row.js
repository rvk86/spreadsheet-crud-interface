function submitForm(atts) {

    var s = getSpreadsheet().getSheetByName(atts.sheetName);

    var columns = getColumnNames(atts.sheetName);

    var isNew = atts.formValues[0] === '';
    atts.formValues[1] = Session.getActiveUser().getEmail();

    if(isNew) {
        var result = _appendRow(s, atts.formValues);
    } else {
        var result = updateRow(s, atts.formValues);
    }

    runTriggers(atts.sheetName, isNew, atts.formValues);

    return {'rowId': result[0]};

}


function _appendRow(s, values) {

    var lastId = s.getRange(_getLastRowWithData(s), 1).getValue();
    values[0] = _.isNumber(lastId) ? lastId + 1 : 1;

    // The append row method doesn't detect the validations at first, so appending a row with invalid data is possible.
    // That's why this is necessary to catch errors right away. Not the most elegant way, think about alternatives.
    try {

        var result = s.getRange(_getLastRowWithData(s) + 1, 1, 1, s.getLastColumn()).setValues([values]);
        SpreadsheetApp.flush();

    } catch (e) {

        deleteRow({'sheetName': s.getName(), 'rowId': values[0]});
        throw e;

    }

    return values;

}


function duplicateRow(atts) {

    var s = getSpreadsheet().getSheetByName(atts.sheetName);
    var values = findRow(atts.sheetName, atts.rowId);

    _appendRow(s, stripFormulas(values));

    return {'rowId': values[0]};

}


function stripFormulas(values) {

    for(var i in values) {
        values[i] = values[i][0] === '=' ? '' : values[i];
    }

    return values;

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
    s.getRange(position, 1, 1, s.getLastColumn()).setValues([values]);

    return values;

}


function getTitle(row) {

    return row[auditColumns] + ' - ' + row[auditColumns + 1] + ' (' + row[0] + ')';

}


function getRelationships(atts) {

    var sheetNames = getSheetList();

    var relationships = {};
    _.each(sheetNames, function(name) {
        var rows = getAllRows(name);

        for(var i in rows[0]) {

            if(JSON.parse(rows[1][i])['options'] === atts.sheetName) {

                relationships[name] = _.filter(rows, function(row) { return row[i] === atts.rowId; });
                break;

            }

        }

    });

    return relationships;

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