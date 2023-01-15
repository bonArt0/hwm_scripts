// ==UserScript==
// @name          HWM Armory Framework
// @namespace     https://github.com/bonArt0/hwm_scripts
// @version       1.2.3
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

let _ArmoryFrameworkInstance;

class ArmoryFramework
{
    /**
     * @type {boolean}
     * @private
     */
    _initialized = false

    /**
     * @type {boolean}
     * @private
     */
    _isControlOn;

    static init() {
        if (!_ArmoryFrameworkInstance) {
            _ArmoryFrameworkInstance = new ArmoryFramework();
        }

        return _ArmoryFrameworkInstance;
    }

    /**
     * @private use ArmoryFramework.init()
     */
    constructor() {
        this._initFramework();
    }

    /**
     * @returns {boolean}
     */
    isControlOn() {
        if (this._isControlOn === undefined) {
            this._isControlOn = document.body.innerHTML.search('sklad_rc_on=0') > -1;
        }

        return this._isControlOn;
    }

    /**
     * @throws {Error} on init failure
     * @private
     */
    _initFramework() {
        if (!this._initialized && this.isControlOn()) {
            let initialized = this._initArtPlaceBox();
            if (!initialized) {
                this._throwError('ArtPlaceBox');
            }

            initialized = this._initArmoryInfoBox();
            if (!initialized) {
                this._throwError('ArmoryInfoBox');
            }

            this._initialized = true;

            console.info('Armory Framework initialized');
        }
    }

    /**
     * @throws {Error} on init failure
     * @private
     */
    _throwError(component) {
        console.error('Something happen with game layout');
        throw new Error(component);
    }

    /* <editor-fold desc="arts place box"> */

    /**
     * @returns {boolean}
     */
    _initArtPlaceBox() {
        const artsPlaceForm = document.getElementsByName('p_art_id')
            ?.item(0) // select
            ?.parentElement // td
            ?.parentElement // tr
            ?.parentElement // tbody
            ?.parentElement // table
            ?.parentElement;

        if (!artsPlaceForm || artsPlaceForm.tagName !== 'FORM') {
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
            return false;
        }

        artsPlaceHeader?.classList.add(FrameworkClassNames.ARTS_PLACE_HEADER);

        return true;
    }

    /**
     * @returns {HTMLFormElement|null}
     * @throws {Error} on invalid framework usage
     */
    getArtPlaceForm() {
        const form = document.getElementsByClassName(FrameworkClassNames.ARTS_PLACE_FORM)?.item(0);
        if (!form || form.tagName !== 'FORM') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return form;
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory info box"> */

    /**
     * @returns {boolean}
     */
    _initArmoryInfoBox() {
        const box = this.getArtPlaceForm()
            ?.parentElement // td
            ?.parentElement // tr
            ?.parentElement // tbody
            ?.parentElement // table#1
            ?.previousSibling // table#0
            ?.firstChild // tbody
            ?.firstChild // tr
            ?.firstChild; // td

        if (!box || box.tagName !== 'TD') {
            return false;
        }

        box.classList.add(FrameworkClassNames.ARMORY_INFO);

        return true;
    }

    /**
     * @returns {HTMLTableCellElement|null}
     * @throws {Error} on invalid framework usage
     */
    getArmoryInfoBox() {
        const box = document.getElementsByClassName(FrameworkClassNames.ARMORY_INFO)?.item(0);
        if (!box || box.tagName !== 'TD') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return box;
    }

    /**
     * @returns {number}
     */
    getArmoryId() {
        return +this.getArtPlaceForm()?.children?.item(0)?.value;
    }

    /**
     * @returns {string}
     */
    getArtsPlaceSign() {
        return this.getArtPlaceForm()?.children?.item(1)?.value + '';
    }

    /**
     * @returns {number}
     */
    getCurrentCapacity() {
    return +this.getArmoryInfoBox()?.innerHTML.match(/<b>(\d+)<\/b> из \d+/)[1];
}

    /**
     * @returns {number}
     */
    getTotalCapacity() {
    return +this.getArmoryInfoBox()?.innerHTML.match(/<b>\d+<\/b> из (\d+)/)[1];
}

    /* </editor-fold> */

    /*  <editor-fold desc="common"> */

    /**
     * @param {string} name
     * @param {string} innerHTML
     * @returns {HTMLLabelElement}
     */
    buildCheckboxLabel(name, innerHTML) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = name;

        const label = document.createElement('label');
        label.append(checkbox);
        label.append(innerHTML);

        return label;
    }

    /* </editor-fold> */
}
