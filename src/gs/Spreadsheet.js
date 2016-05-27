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