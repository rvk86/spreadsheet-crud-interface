
function getPermissions() {

    var sheetExists = getSpreadsheet().getSheetByName('_users');
    if(!sheetExists) { return false; }

    var users = JSON.parse(getAllRowsJSON('_users'));

    var role = _.find(users, function (x) {
        return x[0] === Session.getActiveUser().getEmail()
    });

    if(role) {
        var permJSON = JSON.parse(getAllRowsJSON('_permissions'));
        var permissions = _.find(permJSON, function (x) { return x[0] === role[1] })[1];

        return JSON.parse(permissions);
    } else {
        return {'sheets': {}, 'hidden_fields': []};
    }
}


function hasSheetAccess(sheetName) {

    var permissions = getPermissions();
    if(!permissions) { return true; }

    return permissions['sheets'][sheetName];

}


function operationPermitted(sheetName, operation) {

    var permissions = getPermissions();
    if(!permissions) { return true; }

    return permissions['sheets'][sheetName].indexOf(operation) > -1;

}


function isHiddenField(hide_key) {

    var permissions = getPermissions();
    if(!permissions) { return false; }

    return permissions['hidden_fields'].indexOf(hide_key) > -1;

}