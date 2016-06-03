# Google Spreadsheets CRUD interface
A CRUD interface for managing Google spreadsheets like a database.

Check it out here: https://script.google.com/macros/s/AKfycbyxwOdf4-TqNH86tKhA8Q9MCUT1uGqFKPV3JOzNh2lJtfDDnRM/exec

## Features

 * Add, edit and delete rows from a spreadsheets
 * Add data types to form input for columns
 * Save date created, date updated and user who made the change
 * Have relationships between sheets (available as dropdowns in the input forms)
 * For 'select' columns show drag & drop funnel
 * Create triggers to send emails on add or update of rows
 * Copy spreadsheet for further data analysis

## Usage

 * When accessing the app, add a query parameter to the url "?spreadsheetId=???", replacing ??? by your spreadsheet ID.
 * Each sheet represents a data type (person, organization, deal). Names should not contain spaces & should be singular. Sheets with a name that starts with an underscore will not show up in the interface.
 * Each column represents a data field. Put the field names on the first row of the sheet. Names should be unique and should not contain spaces.
 * On the second row of each sheet a JSON string should be defined with the characteristics of the field.

```js

{
    "type": "text",
    "value": undefined,
    "label": undefined,
    "help": undefined,
    "options": undefined,
    "required": false,
    "disabled": false
}

```

 * Valid options for the JSON are: type, value, label, options, required and disabled.
     * type: can be "text", "textarea", "number", "date", "select". (see http://www.w3schools.com/tags/att_input_type.asp for more info)
     * value: sets the default value in the form view.
     * label: set a label for the field in the form interface. Should be a string.
     * help: a help text displayed directly below the field.
     * options: only applicable with 'type' is set to "select". This can be an array, object or string, see 'Options' chapter below.
     * required: if required is set to true, the form won't submit unless the field has a value.
     * disabled: Boolean value that disables the field in the form view.
 * Besides the spreadsheetId query parameter which is obligatory, you can pass two optional ones: template and atts. Template should be the name of a template part. The most interesting templates are part_funnel and part_table. atts should be a JSON string without spaces with necessary attributes. For part_funnel those are 'sheetName', 'funnelField' and optional 'user'. For part_table just needs 'sheetName'. example: `https://script.google.com/a/macros/polymathventures.co/s/AKfycbzzThAJUlhrYxUA0D-q24gjjVV9qK6oQ2HsEqMq-RE/dev?spreadsheetId=1Lzk4E1S69vbRvLGLn6NU0sjERLhKDxmX3Jeqnkmt0Ik&template=part_funnel&atts={"sheetName":"deal","funnelField":"stage"}`



## Options

For fields that have {"type": "select"}, you should also define the "options" attribute. This can be three things:

 * An array [1,2,3]
 * An object {"key1": "val1", "key2": "val2"}
 * A string (reference to another sheet)

If "options" is defined as an array, automatically a funnel view becomes available for this field under the "funnels" item in the menu.

```js

{"type": "select", "label": "status", "options": ["Pending", "Active", "Canceled"]}

```

If you set it to a string, it should reference another sheet in the same spreadsheet. The form interface will show a dropdown with all rows from the referenced sheet.

```js

{"type": "select", "label": "Person", "options": "person"}

```

## Side notes

 * In both the options drop down referencing another sheet, the funnel view and the search box, the first two columns of the sheet are shown. So make sure those two columns are unique enough to determine which row it is.
 * The main advantage of using this tool is that you think more explicitly about the data structure of your process.

## Known limitations

 * The back button on your browser doesn't work because it's a one page app. See Usage for a way to redirect to a specific page directly from the url
 * Makes use of html5 field types, so only works in modern browsers. (Chrome preferred)
 * When deleting rows, relationships will not be deleted. This means that rows might point to a non-existing row in the related sheet.
 * With a lot of rows, the tool can become slow. A solution could be to archive the file (make a copy through the interface) and delete rows from the original file.
