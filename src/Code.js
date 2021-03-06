var _ = Underscore.load();
var moment = Moment.load();
var userProperties = PropertiesService.getUserProperties();
var scriptProperties = PropertiesService.getScriptProperties();
var queryParams = JSON.parse(userProperties.getProperty('params'));

var titleRows = 2;
var auditColumns = 2;
var createdBy = 1;
var dateFormat = 'DD-MM-YYYY';

/**
* Renders html output
*
* @param {object} e the query parameter object
*/
function doGet(e) {

    var t = HtmlService.createTemplateFromFile('index');
    t.params = e.parameters;
    t.params.dateFormat = dateFormat;

    userProperties.setProperty('params', JSON.stringify(e.parameters));
    queryParams.spreadsheetId = t.params.spreadsheetId;

    return t.evaluate()
            .setTitle('Spreadsheet CRUD interface')
            .setFaviconUrl('http://www.polymathv.com/wp-content/uploads/cropped-pv_favi-e1468429129936-32x32.png')
            .setSandboxMode(HtmlService.SandboxMode.IFRAME);

};


/**
* Renders html template parts
*
* @param {string} name the name of the template part
* @param {object} atts the attribute object that will be available in the template part
*/
function templatePart(name, atts) {

    var t = HtmlService.createTemplateFromFile(name);
    atts = atts || {};
    t.atts = atts;

    return t.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();

};


/**
* Including files without injecting variables and without templating
*
* @param {string} name the name of the file to be included
*/
function include(name) {

  return HtmlService.createHtmlOutputFromFile(name)
  .setSandboxMode(HtmlService.SandboxMode.IFRAME)
  .getContent();

}