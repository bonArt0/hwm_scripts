// ==UserScript==
// @name          hwm_armory_framework
// @namespace     https://github.com/bonArt0/hwm_scripts
// @version       1.3.0
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

    /**
     * @type {HTMLTableCellElement}
     * @private
     */
    _armoryInfoBox;

    /**
     * @type {HTMLElement}
     * @private
     */
    _artsPlaceHeader;

    /**
     * @type {HTMLFormElement}
     * @private
     */
    _artsPlaceForm;

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
        this._artsPlaceForm = artsPlaceForm;

        const artsPlaceHeader = artsPlaceForm
            ?.parentElement // td
            ?.parentElement // tr#1
            ?.parentElement // tbody
            ?.children.item(0) // tr#0
            ?.children.item(0) // td#0
            ?.children.item(0); // b

        if (!artsPlaceHeader || artsPlaceHeader.tagName !== 'B') {
            this._artsPlaceForm.classList.remove(FrameworkClassNames.ARTS_PLACE_FORM);
            return false;
        }

        this._artsPlaceHeader = artsPlaceHeader;
        this._artsPlaceHeader.classList.add(FrameworkClassNames.ARTS_PLACE_HEADER);

        return true;
    }

    /**
     * @returns {HTMLFormElement}
     * @throws {Error} on invalid framework usage
     */
    getArtPlaceForm() {
        if (!this._artsPlaceForm || this._artsPlaceForm.tagName !== 'FORM') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return this._artsPlaceForm;
    }

    /**
     * @returns {HTMLElement}
     * @throws {Error} on invalid framework usage
     */
    getArtPlaceHeader() {
        if (!this._artsPlaceHeader || this._artsPlaceHeader.tagName !== 'B') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return this._artsPlaceHeader;
    }

    /**
     * @returns {number}
     */
    getArmoryId() {
        return +this.getArtPlaceForm().children.item(0)?.value;
    }

    /**
     * @returns {string}
     */
    getArtsPlaceSign() {
        return this.getArtPlaceForm().children.item(1)?.value + '';
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory info box"> */

    /**
     * @returns {boolean}
     */
    _initArmoryInfoBox() {
        const armoryInfoBox = this.getArtPlaceForm()
            ?.parentElement // td
            ?.parentElement // tr
            ?.parentElement // tbody
            ?.parentElement // table#1
            ?.previousSibling // table#0
            ?.firstChild // tbody
            ?.firstChild // tr
            ?.firstChild; // td

        if (!armoryInfoBox || armoryInfoBox.tagName !== 'TD') {
            return false;
        }

        armoryInfoBox.classList.add(FrameworkClassNames.ARMORY_INFO);
        this._armoryInfoBox = armoryInfoBox;

        return true;
    }

    /**
     * @returns {HTMLTableCellElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryInfoBox() {
        if (!this._armoryInfoBox || this._armoryInfoBox.tagName !== 'TD') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return this._armoryInfoBox;
    }

    /**
     * @returns {number}
     */
    getCurrentCapacity() {
    return +this.getArmoryInfoBox().innerHTML.match(/<b>(\d+)<\/b> из \d+/)?.at(1);
}

    /**
     * @returns {number}
     */
    getTotalCapacity() {
    return +this.getArmoryInfoBox().innerHTML.match(/<b>\d+<\/b> из (\d+)/).at(1);
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
