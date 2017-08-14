// ==UserScript==
// @name            Armory Upgrade framework
// @author          bonArt
// @description     Common interface and options to access your clan's armory upgrades
// @namespace       https://greasyfork.org/en/scripts?set=18284
// @downloadURL
// @updateURL
// @license         Creative Commons Attribution License
// @version	        0.1
// @include         http://www.example.org/*
// @exclude
// @require
// @grant
// @released        2006-04-17
// @updated         2006-04-19
// @compatible      Greasemonkey
// @icon
// ==/UserScript==

/* 
 * This file is a Greasemonkey user script. To install it, you need 
 * the Firefox plugin "Greasemonkey" (URL: http://greasemonkey.mozdev.org/)
 * After you installed the extension, restart Firefox and revisit 
 * this script. Now you will see a new menu item "Install User Script"
 * in your tools menu.
 * 
 * To uninstall this script, go to your "Tools" menu and select 
 * "Manage User Scripts", then select this script from the list
 * and click uninstall :-)
 *
 * Creative Commons Attribution License (--> or Public Domain)
 * http://creativecommons.org/licenses/by/2.5/
*/

(function () {
	var config = ";
	var armoryExo = new ArmoryExosuite(config);
	armoryExo.AppendFrameworkElements();
	armoryExo.AppendAdditionalElements();

    //object constructor
	function ArmoryExosuite(config) {
        // modify the stylesheet
        this.append_stylesheet('body,div { border: 1px solid red; }');

    };
	
    function AppendFrameworkElements() {
		this.CreateSettingsElements();
    };
	
	function AppendFrameworkElements() {
	}
	
	ArmoryExosuite.prototype.CreateSettingsElements = function() {
		var stnButton = $('input').classCss.classJs;
		var stnBlock = $('div').classCss.classJs;
		stnBlock.append(blockTemplate.append(modOptions));
		
		$(domElement).append(stnBlock);
	}

    //create a stylesheet
    example.prototype.append_stylesheet = function (css) {

        var styletag = document.createElement("style");
        styletag.setAttribute('type', 'text/css');
        styletag.setAttribute('media', 'screen');
        styletag.appendChild(document.createTextNode(css));

        document.getElementsByTagName('head')[0].appendChild(styletag);

    };

    //instantiate and run 
    var example = new example();


})();
