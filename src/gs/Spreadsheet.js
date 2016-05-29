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
    for(var s in sheets) {

        var columnNames = getColumnNames(sheets[s]);
        var funnels = _.filter(columnNames[0], function(n, i) { return _.isArray(columnNames[1][i]['options'])})

        if(funnels.length > 0) {
            sheetFunnels[sheets[s]] = funnels;
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