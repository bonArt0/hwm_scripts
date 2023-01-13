// ==UserScript==
// @name          HWM Armory Framework
// @namespace     https://github.com/bonArt0/hwm_scripts
// @version       1.0.1
// @description   Хелпер для других скриптов склада
// @author        bonArt
// @license       GPL-3.0-only
// @icon          https://dcdn.heroeswm.ru/i/btns/job_fl_btn_warehouse.png
// @match         https://*.heroeswm.ru/sklad_info.php?*
// @match         https://178.248.235.15/sklad_info.php?*
// @match         https://www.lordswm.com/sklad_info.php?*
// @match         https://my.lordswm.com/sklad_info.php?*
// @supportURL    https://www.heroeswm.ru/sms-create.php?mailto_id=117282
// ==/UserScript==

if (isControlOn() && initFramework() !== undefined) {
}

/**
 * @returns {boolean}
 */
function isControlOn() {
    return document.body.innerHTML.search('sklad_rc_on=0') > -1;
}

/**
 * @returns {HTMLTableRowElement[]|undefined}
 */
function initFramework() {
    const artsList = findArtsListBlock();
    if (artsList === undefined) {
        console.debug('something wrong');
        return artsList;
    }

    artsList.map((value) => {
        const id = value.getElementsByTagName('input').namedItem('inv_id').value;
        value.classList.add('art_block', formatArtBlockClassName(id));
    });

    return artsList;
}

/**
 * @returns {HTMLTableRowElement[]|undefined}
 */
function findArtsListBlock() {
    let currentBlock = Array.from(document.getElementsByTagName('body')).pop();
    currentBlock = Array.from(currentBlock.children)[1];
    if (!currentBlock) {
        console.error('Block not found: center #1');
        return undefined;
    }

    currentBlock = Array.from(currentBlock.children).pop()
    if (!currentBlock) {
        console.error('Block not found: table #2');
        return undefined;
    }

    currentBlock = Array.from(currentBlock.getElementsByTagName('table')).pop()
    if (!currentBlock) {
        console.error('Block not found: table #3');
        return undefined;
    }

    currentBlock = Array.from(currentBlock.getElementsByTagName('tr'));
    currentBlock.shift();
    if (!currentBlock) {
        console.error('Block not found: tr\'s');
        return undefined;
    }

    return currentBlock;
}

function formatArtBlockClassName(id) {
    return 'art_block_' + id;
}
