function getSheetList() {

    var sheets = getSpreadsheet().getSheets();
    var sheetList = [];
    _.each(sheets, function(s) {

        var sName = s.getName();
        if(sName[0] !== '_' && hasSheetAccess(sName)) sheetList.push(sName);

    });

    return sheetList;

}


function getSpreadsheet() {

    if (!queryParams.spreadsheetId) throw 'No spreadsheet ID found in URL. ' +
                                     'Please add this to the end of the current URL: ?spreadsheetId=???,' +
                                     'replacing ??? by an ID of a spreadsheet that you have access to.';

    return SpreadsheetApp.openById(queryParams.spreadsheetId);

}


function getFunnels(sheetList) {

    var sheetFunnels = {};
    for(var s in sheetList) {

        var columnNames = getColumnNames(sheetList[s]);
        var funnels = _.filter(columnNames[0], function(n, i) { return _.isArray(columnNames[1][i]['options'])})

        if(funnels.length > 0) {
            sheetFunnels[sheetList[s]] = funnels;
        }

    }

    return sheetFunnels;

}


function copySpreadsheet() {

    var ss = getSpreadsheet();
    var date = moment().format('YYYY-MM-DD');
    var copy = ss.copy('Copy of ' + ss.getName() + ' - ' + date);

    return '<p>Copy successfully created. <a href="' + copy.getUrl() + '" target="_blank">' + copy.getName() + '</a></p>';

}


function searchAll(query) {

    var sheetList = getSheetList();

    var results = {};
    for(var s in sheetList) {

        var rows = getAllRows(sheetList[s]);
        _.each(rows, function(row) {

            var title = getTitle(row);
            if(title.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              results[title] = sheetList[s] + ':' + row[0];
            }

        });

    }

    return results;

}


function setValidationRule(optionsJSONRange) {

    var options = JSON.parse(optionsJSONRange.getValue());
    var type = options['type'];
    var selectOptions = options['options'];
    var columnLetter = optionsJSONRange.getA1Notation().replace(/[0-9]/g, '');
    var startRow = titleRows + 1;

    var rule = SpreadsheetApp.newDataValidation().setAllowInvalid(false);
    switch(type) {
        case 'select':
            if(_.isObject(selectOptions)) {
                selectOptions = _.values(selectOptions);
            }

            if(!_.isString(selectOptions)) {
                rule = rule.requireValueInList(selectOptions)
                           .setHelpText('Selected option not in list');
            }
            break;
        case 'email':
            rule = rule.requireTextIsEmail()
                       .setHelpText('Email is not valid');
            break;
        case 'number':
            rule = rule.requireFormulaSatisfied('=ISNUMBER(' + columnLetter + startRow + ')')
                       .setHelpText('Value is not a number');
            break;
        case 'date':
            rule = rule.requireDate()
                       .setHelpText('Value is not a date');
            break;
    }

    validationRange = optionsJSONRange.getSheet().getRange(columnLetter + startRow + ':' + columnLetter);
    if(rule.getCriteriaType()) {
        validationRange.setDataValidation(rule);
    } else {
        validationRange.clearDataValidations();
    }

}


function setup() {

    var ss = getSpreadsheet();
    var sheetList = getSheetList();

    _.each(sheetList, function(sheetName) {

        var s = ss.getSheetByName(sheetName);

        _.each(_.range(1, s.getLastColumn() + 1), function(i) {

            setValidationRule(s.getRange(titleRows, i));

        })

    });

}



