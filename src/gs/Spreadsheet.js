function getSheetList() {

    var sheets = getSpreadsheet().getSheets();

    var sheetList = [];
    for(var i in sheets) {
        sheetList.push(sheets[i].getName());
    };

    return sheetList;

}


function getSpreadsheet() {

    if (!queryParams.spreadsheetId) throw 'No spreadsheet ID found in URL. ' +
                                     'Please add this to the end of the current URL: ?spreadsheetId=???,' +
                                     'replacing ??? by an ID of a spreadsheet that you have access to.';

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

    var triggers = userProperties.getProperty(queryParams.spreadsheetId);
    triggers = _.isArray(triggers) ? JSON.parse(triggers) : [];

    return triggers;

}


function deleteTrigger(atts) {

    var triggers = _.filter(getTriggers(), function(val, i) { return i !== atts.triggerIndex; });

    userProperties.setProperty(userProperties.getProperty(queryParams.spreadsheetId);, JSON.stringify(triggers));

}


function saveTrigger(atts) {

    var triggers = getTriggers();

    if(!_.isArray(triggers)) {
        triggers = [atts.formValues];
    } else {
        triggers.push(atts.formValues);
    }

    userProperties.setProperty(userProperties.getProperty(queryParams.spreadsheetId), JSON.stringify(triggers));

}


function runTriggers(sheetName, isNew, values) {

    var action = isNew ? 'On add' : 'On edit';
    var triggers = getTriggers();

    var columnNames = getColumnNames(sheetName);

    for(var t in triggers) {

        if(triggers[t][0] === sheetName && triggers[t][1] == action) {

            var emails = [];

            var body = '<table>';
            _.each(values, function(val, index) { body += '<tr><td>' + columnNames[0][index] + '</td><td>' + val + '</td></tr>'; });
            body += '</table>';

            var subject = triggers[t][4] !== '' ? triggers[t][4] : 'Trigger fired ' + action;

            if(triggers[t][2] !== '') {

                var columnIndex = columnNames[0].indexOf(triggers[t][2]);
                emails.push(values[columnIndex]);

            }

            if(triggers[t][3] !== '') emails.push(triggers[t][3]);

            GmailApp.sendEmail('', subject, '', {
                bcc: emails.join(','),
                htmlBody: triggers[t][5] !== '' ? triggers[t][5] : body
            })

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