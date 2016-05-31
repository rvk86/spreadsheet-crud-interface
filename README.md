# Google Spreadsheets CRUD interface
A CRUD interface for managing Google spreadsheets like a database.

Check it out here: https://script.google.com/macros/s/AKfycbyxwOdf4-TqNH86tKhA8Q9MCUT1uGqFKPV3JOzNh2lJtfDDnRM/exec

## Features

 * Add, edit and delete rows from a spreadsheets
 * Add data types to form input for columns
 * Save date created, date updated and user who made the change
 * Have relationships between sheets (available as dropdowns in the input forms)
 * For select columns show drag & drop funnel
 * Copy spreadsheet for further data analysis

## Usage

 * When accessing the app, add a query parameter to the url "?spreadsheetId=???", replacing ??? by your spreadsheet ID.
 * Each sheet represents a model (person, organization, deal). Names should not contain spaces & should be singular.
 * Each column represents a data field. Put the field names on the first row of the sheet. Names without spaces.
 * On the second row of each sheet a JSON string should be defined with the characteristics of the field.

```js

{
    "type": "text",
    "value": undefined,
    "label": undefined,
    "options": undefined,
    "required": false,
    "disabled": false
}

```

 * Valid options for the JSON are: type, value, label, options, required and disabled.
     * type: can be "text", "textarea", "number", "date", "select". (see http://www.w3schools.com/tags/att_input_type.asp for more info)
     * value: sets the default value in the form view.
     * label: set a label for the field in the form interface. Should be a string.
     * options: only applicable with 'type' is set to "select". This can be an array, object or string, see 'Options' chapter below.
     * required: if required is set to true, the form won't submit unless the field has a value.
     * disabled: Boolean value that disables the field in the form view.

## Options

For fields that have {"type": "select"}, you should also define the "options" attribute. This can be three things:

 * An array [1,2,3]
 * An object {"key1": "val1", "key2": "val2"}
 * A string (reference to another sheet)

If "options" is defined as an array, automatically a funnel view becomes available for this field under the "funnels" item in the menu.

```js

{"type": "select", "label": "status", "options": ["Pending", "Active", "Canceled"}

```

If you set it to a string, it should reference another sheet in the same spreadsheet. The form interface will show a dropdown with all rows from the referenced sheet.

```js

{"type": "select", "label": "Person", "options": "person"}

```

## Side notes

 * In both the options dropdown referencing another sheet and the funnel view, the first two columns of the sheet are shown. So make sure those two columns are unique enough to determine which row it is.

## Known limitations

 * Makes use of html5 field types, so only works in modern browsers. (Chrome preferred)
