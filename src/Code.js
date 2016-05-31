var _ = Underscore.load();
var moment = Moment.load();
var userProperties = PropertiesService.getUserProperties();
var queryParams = JSON.parse(userProperties.getProperty('params'));

var titleColumns = 2;
var auditRows = 2;
var createdBy = 1;

/**
* Renders html output
*
* @param {object} e the query parameter object
*/
function doGet(e) {

    var t = HtmlService.createTemplateFromFile('index');
    t.params = e.parameters;

    userProperties.setProperty('params', JSON.stringify(e.parameters));

    return t.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);

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