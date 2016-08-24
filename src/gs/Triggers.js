function getTriggers() {

    var triggers = JSON.parse(scriptProperties.getProperty(queryParams.spreadsheetId));
    triggers = _.isArray(triggers) ? triggers : [];

    return triggers;

}


function deleteTrigger(atts) {

    var triggers = _.filter(getTriggers(), function(val, i) { return i !== atts.triggerIndex; });

    scriptProperties.setProperty(queryParams.spreadsheetId, JSON.stringify(triggers));

}


function saveTrigger(atts) {

    var triggers = getTriggers();

    if(!_.isArray(triggers)) {
        triggers = [atts.formValues];
    } else {
        triggers.push(atts.formValues);
    }

    scriptProperties.setProperty(queryParams.spreadsheetId, JSON.stringify(triggers));

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
                if(values[columnIndex] !== '') emails.push(values[columnIndex]);

            }

            if(triggers[t][3] !== '') emails.push(triggers[t][3]);

            GmailApp.sendEmail('', subject, '', {
                bcc: emails.join(','),
                htmlBody: triggers[t][5] !== '' ? triggers[t][5] : body
            })

        }

    }

}