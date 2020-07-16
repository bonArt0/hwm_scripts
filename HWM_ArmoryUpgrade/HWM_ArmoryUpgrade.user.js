// ==UserScript==
// @name            Armory Upgrade framework
// @author          bonArt
// @description     Common interface and options to access your clan's armory upgrades
// @namespace       https://greasyfork.org/en/scripts?set=18284
// @downloadURL
// @updateURL
// @license         Creative Commons Attribution License
// @version          0.1
// @include         *localhost:3000/index.php*
// @include         https://www.heroeswm.ru/sklad_info.php*
// exclude
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// require          armory.css
// require          armory-framework.js
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

'use strict';

import {ArmoryFramework} from './framework/src/ArmoryFramework'

(function () {
  alert('start')
  const config = ''
  const armFrm = new ArmoryFramework(config)
  armFrm.AssembleFramework()
  alert('done')
  return 0
//  this.SetConfig(config);
//  armFrm.AssembleModules();
})()
