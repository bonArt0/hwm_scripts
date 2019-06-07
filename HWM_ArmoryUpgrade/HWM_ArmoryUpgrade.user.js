// ==UserScript==
// @name            Armory Upgrade framework
// @author          bonArt
// @description     Common interface and options to access your clan's armory upgrades
// @namespace       https://greasyfork.org/en/scripts?set=18284
// @downloadURL
// @updateURL
// @license         Creative Commons Attribution License
// @version	        0.1
// @include         https://www.heroeswm.ru/sklad_info.php*
// exclude
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// require			armory.css
// require			armory-framework.js
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

(function() {
  const config = '';
  const armFrm = new ArmoryFramework(config);
  armFrm.AssembleFramework();
  alert('done');
  return 0;
  this.SetConfig(config);
  armFrm.AssembleModules();
  
  // ========================= //
  
  // Constructor
  function ArmoryFramework(config) {
    ArmoryFramework.prototype.AssembleFramework = function() {
      this.ConstructWrapper();
      this.CreateSettingsElements();
    };
    
    ArmoryFramework.prototype.AssembleModules = function() {
    
    };
    
    ArmoryFramework.prototype.ConstructWrapper = function() {
      const body = $('body center table:last-child');
      const bodyContainer = body.find('td').first();
      
      let tableCounter = 0;
      
      // =======================================================================
      
      const commonParams = bodyContainer.children('table:eq(' + tableCounter++ + ')');
      
      let trCounter = 0;
      
      // -----------------------------------------------------------------------
      
      const commonParamsContainer = commonParams.find('tr:eq(' + trCounter++ + ')');
      
      let container = commonParamsContainer.find('td:eq(0)');
      const clan = $('<div>' + container.html().match(/(.+?)<br>/)[1] + '</span>').addClass('js-props-clan'); // TODO: replace to div?
      const capacity = $('<span>' + container.html().match(/<br>(.+\.) \(/)[1] + '</span>').addClass('js-props-capacity');
      const log = $('<span>' + container.html().match(/ \(.+\)/) + '</span>').addClass('js-props-log');
      container.empty().append(clan, capacity, log);
      
      container = commonParamsContainer.find('td:eq(1)');
      let css = {
        'display': 'table-cell',
        'vertical-align': 'middle',
      };
      const goldIcon = $('<span>' + container.find('td:first td:first').html() + '</span>').addClass('js-props-gold_icon').css(css); // TODO: to class css
      const goldDepositValue = $('<span>' + container.find('td:first td:last').html() + '</span>').addClass('js-props-gold_deposit').css(css); // TODO: to class css
      const goldFreezedValue = $('<span>' + container.find('td:last').html() + '</span>').addClass('js-props-gold_freezed').css(css); // TODO: to class css
      container.empty().append(goldIcon, goldDepositValue, goldFreezedValue);
      
      const enableSwitch = commonParamsContainer.find('td:eq(2) a').wrap('<span class="js-settings-online">');
      const editSwitch = commonParamsContainer.find('td:eq(3) a').wrap('<span class="js-settings-edit">');
      
      // -----------------------------------------------------------------------
      
      const sectorParamsContainer = commonParams.find('tr:eq(' + trCounter++ + ') td');
      const sectors = $('<div>' + sectorParamsContainer.html().match(/(.+?)<br>/)[1] + '</span>').addClass('js-props-sectors'); // TODO: replace to div?
      const access = $('<div>' + sectorParamsContainer.html().match(/<br>(.+)/)[1] + '</span>').addClass('js-props-access_level');
      sectorParamsContainer.empty().append(sectors, access);
      
      // -----------------------------------------------------------------------
      
      const repairConditionsContainer = commonParams.find('tr:eq(' + trCounter++ + ') td');
      const repairArtsContainer = commonParams.find('tr:eq(' + trCounter + ') td table tbody tr');
      if (repairArtsContainer.find('div.arts_info').length > 0) {
        const repairLabel = '<b class="armory__repair-conditions repair-conditions__label">' + repairConditionsContainer.find('b').first().html().replace(/<b>\d+%<\/b>/, '') + '</b>';
        const repairValue = '<b class="armory__repair-conditions repair-conditions__value">' + repairConditionsContainer.find('b').last().html() + '</b>';
        repairConditionsContainer.empty().append(repairLabel, repairValue);
        
        const repairArts = repairArtsContainer.children();
      }
      
      // =======================================================================
      
      const tabs = bodyContainer.children('table:eq(' + tableCounter + ')');
      css = {
        'display': 'grid',
        'grid-template-columns': '0.073fr 0.132fr 0.133fr 0.132fr 0.133fr 0.132fr 0.133fr 0.132fr',
        
      };
      const div = $('<div class="armory__tabs">').css('text-align', 'center').css(css);
      tabs.find('a').each(function() {
        const tabClasses = {
          'Инф-я': {class: 'armory-tab__info wbwhite', 'border-left-width': '1px'},
          'Оружие': {class: 'armory-tab__weapon wblight', 'border-left-width': '0px'},
          'Броня': {class: 'armory-tab__armor wblight', 'border-left-width': '0px'},
          'Ювелирка': {class: 'armory-tab__jewelry wblight', 'border-left-width': '0px'},
          'Рюкзак': {class: 'armory-tab__backpack wblight', 'border-left-width': '0px'},
          'Комплекты': {class: 'armory-tab__sets wblight', 'border-left-width': '0px'},
          'В аренде': {class: 'armory-tab__on-lease wblight', 'border-left-width': '0px'},
          'Недоступные': {class: 'armory-tab__unavailable wblight', 'border-left-width': '0px'},
          'Info': {class: 'armory-tab__info wbwhite', 'border-left-width': '1px'},
          'Weapon': {class: 'armory-tab__weapon wblight', 'border-left-width': '0px'},
          'Armor': {class: 'armory-tab__armor wblight', 'border-left-width': '0px'},
          'Jewelry': {class: 'armory-tab__jewelry wblight', 'border-left-width': '0px'},
          'Backpack': {class: 'armory-tab__backpack wblight', 'border-left-width': '0px'},
          'Sets': {class: 'armory-tab__sets wblight', 'border-left-width': '0px'},
          'On lease': {class: 'armory-tab__on-lease wblight', 'border-left-width': '0px'},
          'Unavailable': {class: 'armory-tab__unavailable wblight', 'border-left-width': '0px'},
        };
        const tabName = this.innerText.replace(/ \([\d:]+\)/, '');
        div.append($(this).addClass(tabClasses[tabName]['class']).css('border-top', 'none').css('padding', '4px').css('border-left-width', tabClasses[tabName]['border-left-width']));
      });
      tabs.replaceWith(div);
      
      // =======================================================================
      
      const content = bodyContainer.children('table:last');
      if (content.find('div.arts_info').length === 0) { // info page // TODO: to separate class
        content.find('td').wrapInner('<div class="armory__desc wbwhite" style="border-top:none;padding:4px;">'); // TODO: styles out of here
        content.replaceWith(content.find('.armory__desc'));
      } else {
      
      }
    };
    
    ArmoryFramework.prototype.CreateSettingsElements = function() {
      const toggleButton = $('input').addClass('af_btn-toggle');//.classJs;
      const parentBlock = $('div').addClass('af_settings-block');//.classJs;
      //parentBlock.append(templateBlock.append(modOptions));
      
      $(domElement).append(toggleButton);
      $(domElement).append(parentBlock);
    };
    
    // modify the stylesheet
    //this.append_stylesheet('body,div { border: 1px solid red; }')
    
  }
  
  //instantiate and run
  //var example = new example();
  
  //create a stylesheet
  //example.prototype.append_stylesheet = function (css) {
  
  //    var styletag = document.createElement("style");
  //    styletag.setAttribute('type', 'text/css');
  //    styletag.setAttribute('media', 'screen');
  //    styletag.appendChild(document.createTextNode(css));
  
  //    document.getElementsByTagName('head')[0].appendChild(styletag);

//};

})();