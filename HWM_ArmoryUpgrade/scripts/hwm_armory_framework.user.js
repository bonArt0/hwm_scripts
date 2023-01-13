// ==UserScript==
// @name          HWM Armory Framework
// @namespace     https://github.com/bonArt0/hwm_scripts
// @version       1.1.0
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

const FrameworkClassNames = {
    ARTS_PLACE_FORM: 'afw_arts_place_form',
    ARTS_PLACE_HEADER: 'afw_arts_place_header',
    ARMORY_INFO: 'afw_armory_info',
};

if (isControlOn() && initFramework()) {
}

/**
 * @returns {boolean}
 */
function isControlOn() {
    return document.body.innerHTML.search('sklad_rc_on=0') > -1;
}

/**
 * @returns {boolean}
 */
function initFramework() {
    return initArtPlaceBox() && initArmoryInfoBox();
}

/* <editor-fold desc="armory info box"> */

/**
 * @returns {boolean}
 */
function initArmoryInfoBox() {
    const box = getArtPlaceForm()
        ?.parentElement // td
        ?.parentElement // tr
        ?.parentElement // tbody
        ?.parentElement // table#1
        ?.previousSibling // table#0
        ?.firstChild // tbody
        ?.firstChild // tr
        ?.firstChild; // td

    if (!box || box.tagName !== 'TD') {
        console.error('Something happen with game layout');
        return false;
    }

    box.classList.add(FrameworkClassNames.ARMORY_INFO);

    return true;
}

/**
 * @returns {HTMLTableCellElement|null}
 */
function getArmoryInfoBox() {
    const box = document.getElementsByClassName(FrameworkClassNames.ARMORY_INFO)?.item(0);
    if (!box || box.tagName !== 'td') {
        initArmoryInfoBox();
        return document.getElementsByClassName(FrameworkClassNames.ARMORY_INFO)?.item(0) ?? null;
    }
    return box;
}

/**
 * @returns {number}
 */
function getArmoryId() {
    return +getArtPlaceForm()?.children?.item(0)?.value;
}

/**
 * @returns {string}
 */
function getArtsPlaceSign() {
    return getArtPlaceForm()?.children?.item(1)?.value + '';
}

/**
 * @returns {string}
 */
function getCurrentCapacity() {
    return  getArmoryInfoBox()?.innerHTML.match(/<b>(\d+)<\/b> из \d+/)[1];
}

/**
 * @returns {string}
 */
function getTotalCapacity() {
    return  getArmoryInfoBox()?.innerHTML.match(/<b>\d+<\/b> из (\d+)/)[1];
}

/* </editor-fold> */

/* <editor-fold desc="arts place box"> */

/**
 * @returns {boolean}
 */
function initArtPlaceBox() {
    const artsPlaceForm = document.getElementsByName('p_art_id')
        ?.item(0) // select
        ?.parentElement // td
        ?.parentElement // tr
        ?.parentElement // tbody
        ?.parentElement // table
        ?.parentElement;

    if (!artsPlaceForm || artsPlaceForm.tagName !== 'FORM') {
        console.error('Something happen with game layout');
        return false;
    }

    artsPlaceForm.classList.add(FrameworkClassNames.ARTS_PLACE_FORM);

    const artsPlaceHeader = artsPlaceForm
        ?.parentElement // td
        ?.parentElement // tr#1
        ?.parentElement // tbody
        ?.children.item(0) // tr#0
        ?.children.item(0) // td#0
        ?.children.item(0); // b

    if (!artsPlaceHeader || artsPlaceHeader.tagName !== 'B') {
        artsPlaceForm.classList.remove(FrameworkClassNames.ARTS_PLACE_FORM);
        console.error('Something happen with game layout');
        return false;
    }

    artsPlaceHeader?.classList.add(FrameworkClassNames.ARTS_PLACE_HEADER);

    return true;
}

/**
 * @returns {HTMLFormElement|null}
 */
function getArtPlaceForm() {
    const form = document.getElementsByClassName(FrameworkClassNames.ARTS_PLACE_FORM)?.item(0);
    if (!form || form.tagName !== 'FORM') {
        initArtPlaceBox();
        return document.getElementsByClassName(FrameworkClassNames.ARTS_PLACE_FORM)?.item(0) ?? null;
    }
    return form;
}

/* </editor-fold> */

/*  <editor-fold desc="common"> */

/**
 * @param {string} name
 * @param {string} innerHTML
 * @returns {HTMLLabelElement}
 */
function buildCheckboxLabel(name, innerHTML) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = name;

    const label = document.createElement('label');
    label.append(checkbox);
    label.append(innerHTML);

    return label;
}

/* </editor-fold> */
