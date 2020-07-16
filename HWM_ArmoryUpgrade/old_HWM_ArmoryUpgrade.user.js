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

import {ArmoryFramework} from './framework/src/ArmoryFramework'

(function () {
  'use strict'
  alert('start')
  const config = ''
  const armFrm = new ArmoryFramework(config)
  armFrm.AssembleFramework()
  alert('done')
  return 0
//  this.SetConfig(config);
//  armFrm.AssembleModules();

  // ========================= //

  // Constructor
  // function ArmoryFramework1 (config) {
  //   ArmoryFramework.prototype.AssembleFramework = function () {
  //     this.IdentifyType()
  //     this.ConstructWrapper()
  //     this.CreateSettingsElements()
  //   }
  //
  //   ArmoryFramework.prototype.IdentifyType = function () {
  //     // TODO: separate to different objects
  //
  //     this.baseContainer = $('body center table:last-child').find('td').first()
  //
  //     this.editing = !(+this.baseContainer.find('tr').
  //       first().
  //       children('td').
  //       eq(3).
  //       find('a').
  //       attr('href').
  //       match(/sklad_rc_on=[01]/)[1])
  //
  //     this.activeTab = this.baseContainer.find(
  //       'table.wb tr:contains(\'Инф-я\') td.wbwhite').
  //       first().
  //       text().
  //       replace(/ \([\d:]+\)/, '')
  //
  //     this.homeSector = ['Инф-я', 'В аренде'].indexOf(this.tab) ||
  //       this.baseContainer.find(
  //         'font:contains(\'из данного района нет доступа к складу\')',
  //       ) !== undefined
  //   }
  //
  //   ArmoryFramework.prototype.ConstructWrapper = function () {
  //     const body = $('body center table:last-child')
  //     const bodyContainer = body.find('td').first()
  //     let tableCounter = 0
  //
  //     let container1 = bodyContainer.addClass('js-block-summary1')
  //     let container2 = bodyContainer.addClass('js-block-summary2')
  //     let containerRepair1 = bodyContainer.addClass('js-block-repair_label')
  //     let containerRepair2 = containerRepair1.addClass('js-block-repair_label')
  //     let containerRent1 = bodyContainer.addClass('js-block-rent_label')
  //     let containerRent2 = containerRent1.addClass('js-block-rent_label')
  //     let container3 = bodyContainer.addClass('js-block-tabs')
  //     let container4 = bodyContainer.addClass('js-block-content')
  //
  //     const classes = {
  //       container1: {
  //         clan: 'js-summary-clan',
  //         capacity: 'js-summary-capacity',
  //         log: 'js-summary-log',
  //         gold_icon: 'js-summary-gold_icon',
  //         gold_deposit: 'js-summary-gold_deposit',
  //         gold_freezed: 'js-summary-gold_freezed',
  //         online: 'js-summary-online',
  //         edit: 'js-summary-edit',
  //       },
  //       container2: {
  //         sectors: 'js-summary-sectors',
  //         access_level: 'js-summary-access_level',
  //       },
  //       containerRepair1: {
  //         label: 'js-repair-label',
  //       },
  //       containerRepair2: {
  //         conditions: 'js-repair-conditions',
  //       },
  //       container3: {
  //         info: 'js-tabs-tab_info',
  //         weapon: 'js-tabs-tab_weapon',
  //         armor: 'js-tabs-tab_armor',
  //         jewelry: 'js-tabs-tab_jewelry',
  //         backpack: 'js-tabs-tab_backpack',
  //         sets: 'js-tabs-tab_sets',
  //         on_lease: 'js-tabs-tab_on_lease',
  //         unavailable: 'js-tabs-tab_unavailable',
  //       },
  //       container4: {
  //         body: 'js-content-body',
  //       },
  //     }
  //
  //     // =======================================================================
  //
  //     let trCounter = 0
  //
  //     // -----------------------------------------------------------------------
  //
  //     let container = container1.find('td:eq(0)')
  //
  //     const clan = $('<span>').
  //       text(container.html().match(/(.+?)<br>/)[1]).
  //       addClass(classes.container1.clan) // TODO: replace to div?
  //     const capacity = $(
  //       '<span>' + container.html().match(/<br>(.+\.) \(/)[1] + '</span>').
  //       addClass(classes.container1.capacity)
  //     const log = $('<span>' + container.html().match(/ \(.+\)/) + '</span>').
  //       addClass(classes.container1.log)
  //     container.empty().append(clan, capacity, log)
  //
  //     container = container1.find('td:eq(1)')
  //     let css = {
  //       'display': 'table-cell',
  //       'vertical-align': 'middle',
  //     }
  //     const goldIcon = $(
  //       '<span>' + container.find('td:first td:first').html() + '</span>').
  //       addClass(classes.container1.gold_icon).
  //       css(css) // TODO: to class css
  //     const goldDepositValue = $(
  //       '<span>' + container.find('td:first td:last').html() + '</span>').
  //       addClass(classes.container1.gold_deposit).
  //       css(css) // TODO: to class css
  //     const goldFreezedValue = $(
  //       '<span>' + container.find('td:last').html() + '</span>').
  //       addClass(classes.container1.gold_freezed).
  //       css(css) // TODO: to class css
  //     container.empty().append(goldIcon, goldDepositValue, goldFreezedValue)
  //
  //     const enableSwitch = container1.find('td:eq(2) a').
  //       wrap('<span class="js-summary-online">')
  //     const editSwitch = container1.find('td:eq(3) a').
  //       wrap('<span class="js-summary-edit">')
  //
  //     // -----------------------------------------------------------------------
  //
  //     const sectorParamsContainer = container2.find('td:eq(0)')
  //     const sectors = $(
  //       '<div>' + sectorParamsContainer.html().match(/(.+?)<br>/)[1] +
  //       '</span>').addClass(classes.container2.sectors) // TODO: replace to div?
  //     const access = $(
  //       '<div>' + sectorParamsContainer.html().match(/<br>(.+)/)[1] +
  //       '</span>').addClass(classes.container2.access_level)
  //     sectorParamsContainer.empty().append(sectors, access)
  //
  //     // -----------------------------------------------------------------------
  //
  //     if (containerRepair1) {
  //       const repairConditionsContainer = containerRepair2.find(
  //         'tr:eq(' + trCounter++ + ') td')
  //       const repairArtsContainer = containerRepair2.find(
  //         'tr:eq(' + trCounter + ') td table tbody tr')
  //       if (repairArtsContainer.find('div.arts_info').length > 0) {
  //         const repairLabel = $('<b>').
  //           addClass(classes.containerRepair1.label).
  //           append(
  //             repairConditionsContainer.find('b').
  //               first().
  //               html().
  //               replace(/<b>\d+%<\/b>/, ''))
  //         const repairValue = $('<b>').
  //           addClass(classes.containerRepair1.label).
  //           append(
  //             repairConditionsContainer.find('b').last().html())
  //         repairConditionsContainer.empty().append(repairLabel, repairValue)
  //
  //         const repairArts = repairArtsContainer.children()
  //       }
  //     }
  //
  //     // =======================================================================
  //
  //     const tabs = container3
  //     css = {
  //       'display': 'grid',
  //       'grid-template-columns': '0.073fr 0.132fr 0.133fr 0.132fr 0.133fr 0.132fr 0.133fr 0.132fr',
  //
  //     }
  //     const div = $('<div>').
  //       addClass('armory__tabs').
  //       css('text-align', 'center').
  //       css(css)
  //     tabs.find('a').each(function () {
  //       const tabClasses = {
  //         'Инф-я': {
  //           class: 'armory-tab__info wbwhite',
  //           'border-left-width': '1px',
  //         },
  //         'Оружие': {
  //           class: 'armory-tab__weapon wblight',
  //           'border-left-width': '0px',
  //         },
  //         'Броня': {
  //           class: 'armory-tab__armor wblight',
  //           'border-left-width': '0px',
  //         },
  //         'Ювелирка': {
  //           class: 'armory-tab__jewelry wblight',
  //           'border-left-width': '0px',
  //         },
  //         'Рюкзак': {
  //           class: 'armory-tab__backpack wblight',
  //           'border-left-width': '0px',
  //         },
  //         'Комплекты': {
  //           class: 'armory-tab__sets wblight',
  //           'border-left-width': '0px',
  //         },
  //         'В аренде': {
  //           class: 'armory-tab__on-lease wblight',
  //           'border-left-width': '0px',
  //         },
  //         'Недоступные': {
  //           class: 'armory-tab__unavailable wblight',
  //           'border-left-width': '0px',
  //         },
  //         'Info': {
  //           class: 'armory-tab__info wbwhite',
  //           'border-left-width': '1px',
  //         },
  //         'Weapon': {
  //           class: 'armory-tab__weapon wblight',
  //           'border-left-width': '0px',
  //         },
  //         'Armor': {
  //           class: 'armory-tab__armor wblight',
  //           'border-left-width': '0px',
  //         },
  //         'Jewelry': {
  //           class: 'armory-tab__jewelry wblight',
  //           'border-left-width': '0px',
  //         },
  //         'Backpack': {
  //           class: 'armory-tab__backpack wblight',
  //           'border-left-width': '0px',
  //         },
  //         'Sets': {
  //           class: 'armory-tab__sets wblight',
  //           'border-left-width': '0px',
  //         },
  //         'On lease': {
  //           class: 'armory-tab__on-lease wblight',
  //           'border-left-width': '0px',
  //         },
  //         'Unavailable': {
  //           class: 'armory-tab__unavailable wblight',
  //           'border-left-width': '0px',
  //         },
  //       }
  //       const tabName = this.innerText.replace(/ \([\d:]+\)/, '')
  //       div.append($(this).
  //         addClass(tabClasses[tabName]['class']).
  //         css('border-top', 'none').
  //         css('padding', '4px').
  //         css('border-left-width', tabClasses[tabName]['border-left-width']))
  //     })
  //     tabs.replaceWith(div)
  //
  //     // =======================================================================
  //
  //     const content = container4
  //     if (content.find('div.arts_info').length === 0) { // info page // TODO: to separate class
  //       content.find('td').
  //         wrapInner(
  //           '<div class="js-content-body wbwhite" style="border-top:none;padding:4px;">') // TODO: styles out of here
  //       content.replaceWith(content.find('.js-content-body'))
  //     } else {
  //
  //     }
  //   }
  //
  //   ArmoryFramework.prototype.CreateSettingsElements = function () {
  //     const toggleButton = $('input').addClass('af_btn-toggle')//.classJs;
  //     const parentBlock = $('div').addClass('af_settings-block')//.classJs;
  //     //parentBlock.append(templateBlock.append(modOptions));
  //
  //     $(domElement).append(toggleButton)
  //     $(domElement).append(parentBlock)
  //   }
  //
  //   // modify the stylesheet
  //   //this.append_stylesheet('body,div { border: 1px solid red; }')
  //
  // }

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

})()
