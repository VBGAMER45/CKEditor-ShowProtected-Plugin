CKEditor showprotected Plugin
==========================

A plugin for CKEditor that makes protected source sections visible and editable though a popup.
This fork has a few changes:
Meta areas hidden
Popup is a textbox
The source code is visible on main display not just an icon to click to edit

###Demo

![Screenshot](https://raw.githubusercontent.com/VBGAMER45/CKEditor-ShowProtected-Plugin/refs/heads/master/screen1.JPG)

![Screenshot](https://raw.githubusercontent.com/VBGAMER45/CKEditor-ShowProtected-Plugin/refs/heads/master/screen2.JPG)


####License

Licensed under the terms of the MIT, GPL LGPL and MPL licenses.

####Installation

 1. Extract the contents of the file into the "plugins" folder of CKEditor.
 2. In the CKEditor configuration file (config.js) add the following code:

````
config.extraPlugins = 'showprotected';

// Add regular expressions marking the sections you want protected
// (see http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-protectedSource)
// Examples:
config.protectedSource.push( /<\?[\s\S]*?\?>/g ); // PHP
config.protectedSource.push( /\[@[\s\S]*?\/]/g ); // Freemarker
config.protectedSource.push( /\[#[\s\S]*?]/g ); // Freemarker
config.protectedSource.push( /\[\/#[\s\S]*?]/g ); // Freemarker
config.protectedSource.push( /\${[\s\S]*?}/g ); // Freemarker
````
