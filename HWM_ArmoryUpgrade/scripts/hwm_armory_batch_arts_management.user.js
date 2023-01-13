// ==UserScript==
// @name          HWM Armory Batch Arts Management
// @namespace     https://github.com/bonArt0/hwm_scripts
// @version       1.1.0
// @description   Движение артов пачкой
// @author        bonArt
// @license       GPL-3.0-only
// @icon          https://dcdn.heroeswm.ru/i/btns/job_fl_btn_warehouse.png
// @match         https://*.heroeswm.ru/sklad_info.php?*
// @match         https://178.248.235.15/sklad_info.php?*
// @match         https://www.lordswm.com/sklad_info.php?*
// @match         https://my.lordswm.com/sklad_info.php?*
// @require       https://greasyfork.org/scripts/457946-hwm-armory-framework/code/HWM%20Armory%20Framework.js?version=1138244
// @supportURL    https://www.heroeswm.ru/sms-create.php?mailto_id=117282
// ==/UserScript==

const LocalClassNames = {
    ARTS_PLACE_FORM: 'abam_arts_place_form',
    ARTS_PLACE_COUNTER: 'abam_arts_place_counter',
};

if (isControlOn()) {
    if (getArtPlaceForm()) { // framework
        initControls();

        console.info('HWM Armory Batch Arts Management initiated');
    } else {
        console.warn('HWM Armory Batch Arts Management failed');
    }
}

function initControls() {
    initArtsPlaceBox();
    initArmoryInfoBox();
    //initArtsCheckboxes();
}

function initArtsPlaceBox() {
    const artsPlaceForm = getArtPlaceForm();
    artsPlaceForm.style.display = 'none';

    const artsToPlace = getArtsToPlace(artsPlaceForm.elements[2].options);
    artsPlaceForm.parentElement.append(buildNewPlaceBox(artsToPlace));

    const artsPlaceHeader = document.getElementsByClassName(FrameworkClassNames.ARTS_PLACE_HEADER).item(0);
    artsPlaceHeader.innerHTML = artsPlaceHeader.innerHTML.replace('артефакт', 'артефакты');
    artsPlaceHeader.parentElement.append(buildArtsPlaceSubmitButton());
    artsPlaceHeader.parentElement.prepend(buildArtsPlaceCounterLabel(artsToPlace.length));
}

/*  <editor-fold desc="arts place box"> */

/**
 * @returns {HTMLButtonElement}
 */
function buildArtsPlaceSubmitButton() {
    const button = document.createElement('button');
    button.style.position = 'relative';
    button.style.left = '32%';
    button.innerHTML = 'Поместить';
    button.onclick = () => handleArtsPlaceSubmit();

    return button;
}

/**
 * @param {number} artsToPlaceCount
 * @returns {HTMLLabelElement}
 */
function buildArtsPlaceCounterLabel(artsToPlaceCount) {
    const label = document.createElement('label');
    label.style.position = 'relative';
    label.style.left = '-32%';
    label.style.width = '0';
    label.style.whiteSpace = 'nowrap';
    label.dataset.current = '0';
    label.dataset.total = artsToPlaceCount + '';
    label.classList.add(LocalClassNames.ARTS_PLACE_COUNTER);
    label.recalculate = () => {
        label.innerHTML = `Выбрано: ${label.dataset.current} из ${label.dataset.total}`;
        label.style.display = +label.dataset.current ? 'inline-block' : 'none';
    }
    label.recalculate();

    return label;
}

function getArtsPlaceCounterLabel() {
    const counter = document.getElementsByClassName(LocalClassNames.ARTS_PLACE_COUNTER).item(0);
    if (!counter) {
        console.error('Arts place counter not found');
        return null;
    }

    return counter;
}

async function handleArtsPlaceSubmit() {
    const infoBox = getArmoryInfoBox();
    const armory_id = getArmoryId();
    let sign = getArtsPlaceSign();

    for (const artBox of getArtsPlaceBoxes() ?? []) {
        const currentCapacity = getCurrentCapacity();
        const TotalCapacity = getTotalCapacity();
        if (currentCapacity === TotalCapacity) {
            break;
        }

        const checkbox = artBox?.children?.item(0);
        if (!checkbox?.checked) {
            continue;
        }

        const url = new URL('sklad_info.php', window.location.origin);
        url.searchParams.append('id', `${armory_id}`);
        url.searchParams.append('sign', sign);
        url.searchParams.append('p_art_id', checkbox.name);

        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8');
        request.setRequestHeader('Upgrade-Insecure-Requests', '1');
        request.onload = () => {
            infoBox.innerHTML = infoBox.innerHTML.replace(`<b>${currentCapacity}</b>`, `<b>${+currentCapacity + 1}</b>`);
            checkbox.checked = false;
            handleArtsPlaceCheckboxChange(checkbox.checked);
        };
        request.onerror = (ev) => console.error(ev);

        request.send();

        await new Promise((executor) => setTimeout(executor, 1000));
    }

    window.location.reload();
}

/**
 * @returns {HTMLCollection|null}
 */
function getArtsPlaceBoxes() {
    const artsBoxes = document.getElementsByClassName(LocalClassNames.ARTS_PLACE_FORM).item(0).children;
    if (!artsBoxes) {
        console.error('Updated arts place form not found');
        return null;
    }

    return artsBoxes;
}

/**
 * @param {HTMLOptionsCollection} artsPlaceOptions
 * @returns {(number|string)[][]}
 */
function getArtsToPlace(artsPlaceOptions) {
    const arts = Array.from(artsPlaceOptions).map((option) => [+option.value, option.innerHTML]);
    arts.shift(); // remove first "0" element
    return arts;
}

/**
 * @param {(number|string)[][]} artsList
 * @returns {HTMLDivElement}
 */
function buildNewPlaceBox(artsList) {
    const newPlaceBox = document.createElement('div');
    newPlaceBox.style.maxHeight = '150px';
    newPlaceBox.style.overflowY = 'scroll';
    newPlaceBox.style.display = 'flex';
    newPlaceBox.style.flexDirection = 'column';
    newPlaceBox.style.paddingLeft = '20px';
    newPlaceBox.classList.add(LocalClassNames.ARTS_PLACE_FORM);

    let art_id, art_name;
    for ([art_id, art_name] of artsList) {
        const box = buildCheckboxLabel(art_id, art_name);
        box.children.item(0).onchange = (ev) => handleArtsPlaceCheckboxChange(ev.target.checked);
        newPlaceBox.append(box);
    }

    return newPlaceBox;
}

function handleArtsPlaceCheckboxChange(checked) {
    const counter = getArtsPlaceCounterLabel();
    const mod = checked ? 1 : -1;
    counter.dataset.current = +counter.dataset.current + mod + '';
    counter.recalculate();
    return true;
}

/* </editor-fold> */
