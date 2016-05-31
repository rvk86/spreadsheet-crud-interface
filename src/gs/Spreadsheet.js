function getSheetList() {

    var sheets = getSpreadsheet().getSheets();

    var sheetList = [];
    for(var i in sheets) {
        sheetList.push(sheets[i].getName());
    };

    return sheetList;

}


function getSpreadsheet() {

    var scriptProperties = PropertiesService.getScriptProperties();
    var params = JSON.parse(scriptProperties.getProperty('params'));

    if (!params.spreadsheetId) throw '<p>No spreadsheet ID found in URL.</p>' +
                                     '<p>Please add this to the end of the current URL: ?spreadsheetId=???,' +
                                     'replacing ??? by an ID of a spreadsheet that you have access to.</p>';

    return SpreadsheetApp.openById(params.spreadsheetId);

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


function getTriggers() {

    var triggers = userProperties.getProperty('triggers');

    return JSON.parse(triggers);

}


function deleteTrigger(atts) {

    var triggers = _.filter(getTriggers(), function(val, i) { return i !== atts.triggerIndex; });

    userProperties.setProperty('triggers', JSON.stringify(triggers));

}


function saveTrigger(atts) {

    var triggers = getTriggers();

    if(!_.isArray(triggers)) {
        triggers = [atts.formValues];
    } else {
        triggers.push(atts.formValues);
    }

    userProperties.setProperty('triggers', JSON.stringify(triggers));

}


function runTriggers(sheetName, isNew, values) {

    var action = isNew ? 'On add' : 'On edit';
    var triggers = getTriggers();

    var columnNames = getColumnNames(sheetName);

    for(var t in triggers) {

        if(triggers[t][0] === action && triggers[t][1] == sheetName) {

            var body = '<table>';

            _.each(values, function(val, index) { body += '<tr><td>' + columnNames[0][index] + '</td><td>' + val + '</td></tr>'; });

            body += '</table>';

            GmailApp.sendEmail(triggers[t][2], 'Trigger fired ' + action, '', {htmlBody: body})

        }

    }

}


function getAllDataList(query) {

    var sheetList = getSheetList();

    var results = {};
    for(var s in sheetList) {
        var rows = JSON.parse(getAllRows(sheetList[s]));
        _.each(rows, function(row) {
            var title = getTitle(row);
            if(title.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              results[title] = sheetList[s] + ':' + row[0];
            }
        });
    }

    return results;

}