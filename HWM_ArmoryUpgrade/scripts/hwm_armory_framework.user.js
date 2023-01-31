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
    ARMORY_BOX: 'afw_armory_box',
    ARMORY_OVERVIEW_BOX: 'afw_armory_overview_box',
    ARMORY_INFO_BOX: 'afw_armory_info_box',
    ARMORY_ACCOUNT_BOX: 'afw_armory_account_box',
    ARMORY_ONLINE_SWITCH_BOX: 'afw_armory_online_box',
    ARMORY_CONTROL_SWITCH_BOX: 'afw_armory_control_box',
    ARMORY_SECTORS_BOX: 'afw_armory_sectors_box',
    ARMORY_CONTROLS_BOX: 'afw_armory_controls_box',
    ARMORY_CONTROLS_HEADER_BOX: 'afw_armory_controls_header_box',
    ARMORY_CONTROLS_HEADER_PUT_BOX: 'afw_armory_controls_header_put_box',
    ARMORY_CONTROLS_HEADER_BATTLES_BOX: 'afw_armory_controls_header_battles_box',
    ARMORY_CONTROLS_HEADER_SMITHS_BOX: 'afw_armory_controls_header_smiths_box',
    ARMORY_CONTROLS_BODY_BOX: 'afw_armory_controls_body_box',
    ARMORY_CONTROLS_BODY_PUT_BOX: 'afw_armory_controls_body_put_box',
    ARMORY_CONTROLS_BODY_BATTLES_BOX: 'afw_armory_controls_body_battles_box',
    ARMORY_CONTROLS_BODY_SMITHS_BOX: 'afw_armory_controls_body_smiths_box',
    ARMORY_REPAIRS_BOX: 'afw_armory_repairs_box',
    ARMORY_TABS_BOX: 'afw_armory_tabs_box',
    ARMORY_ARTS_BOX: 'afw_armory_arts_box',
    ARTS_PLACE_FORM: 'afw_arts_place_form',
    ARTS_PLACE_HEADER: 'afw_arts_place_header',
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
     * @type {ArmoryBox}
     * @private
     */
    _armoryBox;

    /**
     * @type {HTMLTableCellElement}
     * @private
     */
    _armorySectorsBox;

    /**
     * @type {HTMLTableSectionElement}
     * @private
     */
    _armoryControlsBox;

    /**
     * @type {HTMLTableRowElement}
     * @private
     */
    _armoryControlsHeaderBox;

    /**
     * @type {HTMLTableCellElement}
     * @private
     */
    _armoryControlsHeaderPutBox;

    /**
     * @type {HTMLTableCellElement}
     * @private
     */
    _armoryControlsHeaderBattlesBox;

    /**
     * @type {HTMLTableCellElement}
     * @private
     */
    _armoryControlsHeaderSmithsBox;

    /**
     * @type {HTMLTableRowElement}
     * @private
     */
    _armoryControlsBodyBox;

    /**
     * @type {HTMLTableCellElement}
     * @private
     */
    _armoryControlsBodyPutBox;

    /**
     * @type {HTMLTableCellElement}
     * @private
     */
    _armoryControlsBodyBattlesBox;

    /**
     * @type {HTMLTableCellElement}
     * @private
     */
    _armoryControlsBodySmithsBox;

    /**
     * @type {HTMLTableElement}
     * @private
     */
    _armoryRepairsBox;

    /**
     * @type {HTMLTableRowElement}
     * @private
     */
    _armoryTabsBox;

    /**
     * @type {ArtsBox}
     * @private
     */
    _artsBox;

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
     * @throws {Error} on any init failure
     * @private
     */
    _initFramework() {
        if (!this._initialized && this.isControlOn()) {
            const initialAnchor = this._findInitialAnchor();

            this._armoryBox = new ArmoryBox(initialAnchor);

            this._initArmorySectorsBox();

            this._initArmoryControlsBox();

            this._initArmoryRepairsBox();

            this._initArmoryTabsBox();

            this._initArmoryArtsBox();

            let initialized = this._initArtPlaceBox();
            if (!initialized) {
                this._throwError('ArtPlaceBox');
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

    /**
     * @returns {HTMLImageElement}
     * @throws {Error} on init failure
     * @private
     */
    _findInitialAnchor() {
        const initialAnchor = document.getElementsByClassName('rs').item(0);
        if (initialAnchor && initialAnchor.tagName === 'IMG') {
            return initialAnchor;
        }

        this._throwError('InitialAnchor');
    }

    /* <editor-fold desc="armory box"> */

    /**
     * @returns {HTMLTableCellElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryBox() {
        return this._armoryBox.getInnerBox();
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory overview box"> */

    /**
     * @returns {HTMLTableSectionElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryOverviewBox() {
        return this._armoryBox.overviewBox.getInnerBox();
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory info box"> */

    /**
     * @returns {HTMLTableCellElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryInfoBox() {
        return this._armoryBox.overviewBox.infoBox.getInnerBox();
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory account box"> */

    /**
     * @returns {HTMLTableRowElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryAccountBox() {
        return this._armoryBox.overviewBox.accountBox.getInnerBox();
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory online switch box"> */

    /**
     * @returns {HTMLTableCellElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryOnlineBox() {
        return this._armoryBox.overviewBox.onlineSwitchBox.getInnerBox();
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory control switch box"> */

    /**
     * @returns {HTMLTableCellElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryControlSwitchBox() {
        return this._armoryBox.overviewBox.controlSwitchBox.getInnerBox();
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory sectors box"> */

    /**
     * @throws {Error} on init failure
     */
    _initArmorySectorsBox() {
        const armorySectorsBox = this.getArmoryOverviewBox()
            ?.children.item(1) // tr#1 armory overview
            ?.children.item(0); // td#0 armory overview

        if (armorySectorsBox && armorySectorsBox.tagName === 'TD') {
            armorySectorsBox.classList.add(FrameworkClassNames.ARMORY_SECTORS_BOX);
            this._armorySectorsBox = armorySectorsBox;
            return;
        }

        this._throwError('ArmorySectorsBox');
    }

    /**
     * @returns {HTMLTableCellElement}
     * @throws {Error} on invalid framework usage
     */
    getArmorySectorsBox() {
        if (!this._armorySectorsBox || this._armorySectorsBox.tagName !== 'TD') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return this._armorySectorsBox;
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory controls box"> */

    /**
     * @throws {Error} on init failure
     */
    _initArmoryControlsBox() {
        const armoryControlsBox = this._armoryBox.getInnerBox()
            ?.children.item(1) // table#1 armory controls
            ?.children.item(0); // tbody#0 armory controls

        if (armoryControlsBox && armoryControlsBox.tagName === 'TBODY') {
            armoryControlsBox.classList.add(FrameworkClassNames.ARMORY_CONTROLS_BOX);
            this._armoryControlsBox = armoryControlsBox;
            return;
        }

        this._throwError('ArmoryControlsBox');
    }

    /**
     * @returns {HTMLTableSectionElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryControlsBox() {
        if (!this._armoryControlsBox || this._armoryControlsBox.tagName !== 'TBODY') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return this._armoryControlsBox;
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory repairs box"> */

    /**
     * @throws {Error} on init failure
     */
    _initArmoryRepairsBox() {
        const armoryRepairsBox = this._armoryBox.getInnerBox()
            ?.children.item(2); // table#2 armory repairs

        if (armoryRepairsBox && armoryRepairsBox.tagName === 'TABLE') {
            armoryRepairsBox.classList.add(FrameworkClassNames.ARMORY_REPAIRS_BOX);
            this._armoryRepairsBox = armoryRepairsBox;
            return;
        }

        this._throwError('ArmoryRepairsBox');
    }

    /**
     * @returns {HTMLTableElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryRepairs() {
        if (!this._armoryRepairsBox || this._armoryRepairsBox.tagName !== 'TABLE') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return this._armoryRepairsBox;
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory tabs box"> */

    /**
     * @throws {Error} on init failure
     */
    _initArmoryTabsBox() {
        const armoryTabsBox = this._armoryBox.getInnerBox()
            ?.children.item(3) // table#3 armory tabs
            ?.children.item(0) // tbody#0 armory tabs
            ?.children.item(0); // tr#0 armory tabs

        if (armoryTabsBox && armoryTabsBox.tagName === 'TR') {
            armoryTabsBox.classList.add(FrameworkClassNames.ARMORY_TABS_BOX);
            this._armoryTabsBox = armoryTabsBox;
            return;
        }

        this._throwError('ArmoryTabsBox');
    }

    /**
     * @returns {HTMLTableRowElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryTabsBox() {
        if (!this._armoryTabsBox || this._armoryTabsBox.tagName !== 'TR') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return this._armoryTabsBox;
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory arts box"> */

    /**
     * @throws {Error} on init failure
     */
    _initArmoryArtsBox() {
        const armoryArtsBox = this._armoryBox.getInnerBox()
            ?.children.item(4) // table#4 armory arts
            ?.children.item(0) // tbody#0 armory arts
            ?.children.item(0) // tr#0 armory arts
            ?.children.item(0); // td#0 armory arts

        if (armoryArtsBox && armoryArtsBox.tagName === 'TD') {
            armoryArtsBox.classList.add(FrameworkClassNames.ARMORY_ARTS_BOX);
            this._armoryArtsBox = armoryArtsBox;
            return;
        }

        this._throwError('ArmoryArtsBox');
    }

    /**
     * @returns {HTMLTableCellElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryArtsBox() {
        if (!this._armoryArtsBox || this._armoryArtsBox.tagName !== 'TD') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return this._armoryArtsBox;
    }

    /* </editor-fold> */

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

/**
 * @abstract
 */
class Box {
    /**
     * @type {HTMLElement}
     * @private
     */
    _box;

    constructor(anchor) {
        this._initBox(anchor);
    }

    /**
     * @returns {HTMLElement}
     * @throws {Error} on invalid framework usage
     * @public
     */
    getOuterBox() {
        if (!this._box || this._box.tagName !== this._getBoxTag()) {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return this._box;
    }

    /**
     * @returns {HTMLElement}
     * @abstract
     * @public
     */
    getInnerBox() {}

    /**
     * @throws {Error} on init failure
     */
    _initBox(anchor) {
        const box = this._findBox(anchor);

        if (box && box.tagName === this._getBoxTag()) {
            box.classList.add(this._getBoxClassName());
            this._box = box;
            return;
        }

        this._throwError('ArmoryOverviewBox');
    }

    /**
     * @return {HTMLElement}
     * @abstract
     * @protected
     */
    _findBox(anchor) {}

    /**
     * @return {string}
     * @abstract
     * @protected
     */
    _getBoxTag() {}

    /**
     * @return {string}
     * @abstract
     * @protected
     */
    _getBoxClassName() {}

    /**
     * @throws {Error} on init failure
     * @private
     */
    _throwError(component) {
        console.error('Something happen with game layout');
        throw new Error(component);
    }
}

class ArmoryBox extends Box {
    /**
     * @type {OverviewBox}
     * @public
     * @readonly
     */
    overviewBox;

    constructor(anchor) {
        super(anchor);

        this.overviewBox = new OverviewBox(this.getInnerBox());
    }

    /**
     * @return {HTMLTableElement}
     */
    getOuterBox() {
        return super.getOuterBox();
    }

    /**
     * @return {HTMLTableCellElement}
     */
    getInnerBox() {
        return this.getOuterBox()
            .children.item(0) // tbody
            .children.item(0) // tr
            .children.item(0); // td
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            ?.parentElement // td#0, armory account clear part
            ?.parentElement // tr#0, armory account clear part
            ?.parentElement // tbody, armory account clear part
            ?.parentElement // table, armory account clear part
            ?.parentElement // td#0, armory account
            ?.parentElement // tr#0, armory account
            ?.parentElement // tbody, armory account
            ?.parentElement // table, armory account
            ?.parentElement // td#1, armory overview
            ?.parentElement // tr#0, armory overview
            ?.parentElement // tbody#0, armory overview
            ?.parentElement // table#0, armory overview
            ?.parentElement // td#0, armory box
            ?.parentElement // tr#0, armory box
            ?.parentElement // tbody#0, armory box
            ?.parentElement // table, page content
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_BOX;
    }

    _getBoxTag() {
        return 'TABLE';
    }
}

class OverviewBox extends Box {
    /**
     * @type {OverviewInfoBox}
     * @public
     * @readonly
     */
    infoBox;

    /**
     * @type {OverviewAccountBox}
     * @public
     * @readonly
     */
    accountBox;

    /**
     * @type {OverviewOnlineSwitchBox}
     * @public
     * @readonly
     */
    onlineSwitchBox;

    /**
     * @type {OverviewControlSwitchBox}
     * @public
     * @readonly
     */
    controlSwitchBox;

    constructor(anchor) {
        super(anchor);

        this.infoBox = new OverviewInfoBox(this.getInnerBox());
        this.accountBox = new OverviewAccountBox(this.getInnerBox());
        this.onlineSwitchBox = new OverviewOnlineSwitchBox(this.getInnerBox());
        this.controlSwitchBox = new OverviewControlSwitchBox(this.getInnerBox());
    }

    /**
     * @return {HTMLTableElement}
     */
    getOuterBox() {
        return super.getOuterBox();
    }

    /**
     * @return {HTMLTableSectionElement}
     */
    getInnerBox() {
        return this.getOuterBox()
            .children.item(0); // tbody
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0); // table#0 armory overview
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_OVERVIEW_BOX;
    }

    _getBoxTag() {
        return 'TABLE';
    }
}

class OverviewInfoBox extends Box {
    /**
     * @return {HTMLTableCellElement}
     */
    getOuterBox() {
        return super.getOuterBox();
    }

    /**
     * @return {HTMLTableCellElement}
     */
    getInnerBox() {
        return this.getOuterBox();
    }

    /**
     * @returns {number}
     */
    getCurrentCapacity() {
        return +this.getInnerBox().innerHTML.match(/<b>(\d+)<\/b> из \d+/)?.at(1);
    }

    /**
     * @returns {number}
     */
    getTotalCapacity() {
        return +this.getInnerBox().innerHTML.match(/<b>\d+<\/b> из (\d+)/).at(1);
    }

    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableCellElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0) // tr#0 armory overview
            ?.children.item(0); // td#0 armory overview
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_INFO_BOX;
    }

    _getBoxTag() {
        return 'TD';
    }
}

class OverviewAccountBox extends Box {
    /**
     * @return {HTMLTableElement}
     */
    getOuterBox() {
        return super.getOuterBox();
    }

    /**
     * @return {HTMLTableRowElement}
     */
    getInnerBox() {
        return this.getOuterBox()
            .children.item(0) // tbody#0 armory account
            .children.item(0); // tr#0 armory account
    }

    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0) // tr#0 armory overview
            ?.children.item(1) // td#1 armory overview
            ?.children.item(0); // table#0 armory account
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_ACCOUNT_BOX;
    }

    _getBoxTag() {
        return 'TABLE';
    }
}

class OverviewOnlineSwitchBox extends Box {
    /**
     * @return {HTMLTableCellElement}
     */
    getOuterBox() {
        return super.getOuterBox();
    }

    /**
     * @return {HTMLTableCellElement}
     */
    getInnerBox() {
        return this.getOuterBox();
    }

    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableCellElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0) // tr#0 armory overview
            ?.children.item(2); // td#2 armory overview
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_ONLINE_SWITCH_BOX;
    }

    _getBoxTag() {
        return 'TD';
    }
}

class OverviewControlSwitchBox extends Box {
    /**
     * @return {HTMLTableCellElement}
     */
    getOuterBox() {
        return super.getOuterBox();
    }

    /**
     * @return {HTMLTableCellElement}
     */
    getInnerBox() {
        return this.getOuterBox();
    }

    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableCellElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0) // tr#0 armory overview
            ?.children.item(3); // td#3 armory overview
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROL_SWITCH_BOX;
    }

    _getBoxTag() {
        return 'TD';
    }
}
