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
    ARMORY_CONTROLS_HEADER_PUTS_BOX: 'afw_armory_controls_header_puts_box',
    ARMORY_CONTROLS_HEADER_BATTLES_BOX: 'afw_armory_controls_header_battles_box',
    ARMORY_CONTROLS_HEADER_SMITHS_BOX: 'afw_armory_controls_header_smiths_box',
    ARMORY_CONTROLS_BODY_BOX: 'afw_armory_controls_body_box',
    ARMORY_CONTROLS_BODY_PUTS_BOX: 'afw_armory_controls_body_puts_box',
    ARMORY_CONTROLS_BODY_BATTLES_BOX: 'afw_armory_controls_body_battles_box',
    ARMORY_CONTROLS_BODY_SMITHS_BOX: 'afw_armory_controls_body_smiths_box',
    ARMORY_TAKES_BOX: 'afw_armory_takes_box',
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

            this._initArmoryTabsBox();

            this._initArmoryArtsBox();

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
     * @returns {HTMLTableCellElement}
     * @throws {Error} on invalid framework usage
     */
    getArmorySectorsBox() {
        return this._armoryBox.overviewBox.sectorsBox.getInnerBox();
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory controls box"> */

    /**
     * @returns {HTMLTableSectionElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryControlsBox() {
        return this._armoryBox.controlsBox.getInnerBox();
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory repairs box"> */

    /**
     * @returns {HTMLTableSectionElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryRepairs() {
        return this._armoryBox.takesBox.getInnerBox();
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
     * @returns {HTMLFormElement}
     * @throws {Error} on invalid framework usage
     */
    getArtPlaceForm() {
        return this._armoryBox.controlsBox.bodyBox.putsBox.getInnerBox();
    }

    /**
     * @returns {HTMLElement}
     * @throws {Error} on invalid framework usage
     */
    getArtPlaceHeader() {
        return this._armoryBox.controlsBox.headerBox.putsBox.getInnerBox();
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
     * @public
     */
    getInnerBox() {
        return this.getOuterBox();
    }

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

    /**
     * @type {ControlsBox}
     * @public
     * @readonly
     */
    controlsBox;

    /**
     * @type {TakesBox}
     * @public
     * @readonly
     */
    takesBox;

    constructor(anchor) {
        super(anchor);

        this.overviewBox = new OverviewBox(this.getInnerBox());
        this.controlsBox = new ControlsBox(this.getInnerBox());
        this.takesBox = new TakesBox(this.getInnerBox());
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

/* <editor-fold desc="armory overview"> */

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

    /**
     * @type {OverviewSectorsBox}
     * @public
     * @readonly
     */
    sectorsBox;

    constructor(anchor) {
        super(anchor);

        this.infoBox = new OverviewInfoBox(this.getInnerBox());
        this.accountBox = new OverviewAccountBox(this.getInnerBox());
        this.onlineSwitchBox = new OverviewOnlineSwitchBox(this.getInnerBox());
        this.controlSwitchBox = new OverviewControlSwitchBox(this.getInnerBox());
        this.sectorsBox = new OverviewSectorsBox(this.getInnerBox());
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

class OverviewSectorsBox extends Box {
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
            ?.children.item(1) // tr#1 armory overview
            ?.children.item(0); // td#0 armory overview
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_SECTORS_BOX;
    }

    _getBoxTag() {
        return 'TD';
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory controls"> */

class ControlsBox extends Box {
    /**
     * @type {ControlsHeaderBox}
     * @public
     * @readonly
     */
    headerBox;

    /**
     * @type {ControlsBodyBox}
     * @public
     * @readonly
     */
    bodyBox;

    constructor(anchor) {
        super(anchor);

        this.headerBox = new ControlsHeaderBox(this.getInnerBox());
        this.bodyBox = new ControlsBodyBox(this.getInnerBox());
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
            ?.children.item(1); // table#1 armory controls
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROLS_BOX;
    }

    _getBoxTag() {
        return 'TABLE';
    }
}

class ControlsHeaderBox extends Box {
    /**
     * @type {ControlsHeaderPutsBox}
     * @public
     * @readonly
     */
    putsBox;

    /**
     * @type {ControlsHeaderBattlesBox}
     * @public
     * @readonly
     */
    battlesBox;

    /**
     * @type {ControlsHeaderSmithsBox}
     * @public
     * @readonly
     */
    smithsBox;

    constructor(anchor) {
        super(anchor);

        this.putsBox = new ControlsHeaderPutsBox(this.getInnerBox());
        this.battlesBox = new ControlsHeaderBattlesBox(this.getInnerBox());
        this.smithsBox = new ControlsHeaderSmithsBox(this.getInnerBox());
    }

    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableRowElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0); // tr#0 armory controls
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROLS_HEADER_BOX;
    }

    _getBoxTag() {
        return 'TR';
    }
}

/**
 * @abstract
 */
class ControlsHeaderCell extends Box {
    /**
     * @return {HTMLElement}
     */
    getInnerBox() {
        return super.getInnerBox()
            .children.item(0); // b
    }

    _getBoxTag() {
        return 'TD';
    }
}

class ControlsHeaderPutsBox extends ControlsHeaderCell {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor.children.item(0);
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROLS_HEADER_PUTS_BOX;
    }
}

class ControlsHeaderBattlesBox extends ControlsHeaderCell {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor.children.item(1);
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROLS_HEADER_BATTLES_BOX;
    }
}

class ControlsHeaderSmithsBox extends ControlsHeaderCell {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor.children.item(2);
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROLS_HEADER_SMITHS_BOX;
    }
}

class ControlsBodyBox extends Box {
    /**
     * @type {ControlsBodyPutsBox}
     * @public
     * @readonly
     */
    putsBox;

    /**
     * @type {ControlsBodyBattlesBox}
     * @public
     * @readonly
     */
    battlesBox;

    /**
     * @type {ControlsBodySmithsBox}
     * @public
     * @readonly
     */
    smithsBox;

    constructor(anchor) {
        super(anchor);

        this.putsBox = new ControlsBodyPutsBox(this.getInnerBox());
        this.battlesBox = new ControlsBodyBattlesBox(this.getInnerBox());
        this.smithsBox = new ControlsBodySmithsBox(this.getInnerBox());
    }

    /**
     * @return {HTMLTableRowElement}
     */
    getOuterBox() {
        return super.getOuterBox();
    }

    /**
     * @return {HTMLTableRowElement}
     */
    getInnerBox() {
        return this.getOuterBox(); // tr
    }

    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableRowElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(1); // tr#1 armory controls
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROLS_BODY_BOX;
    }

    _getBoxTag() {
        return 'TR';
    }
}

/**
 * @abstract
 */
class ControlsBodyCell extends Box {
    /**
     * @return {HTMLFormElement}
     */
    getInnerBox() {
        return super.getInnerBox()
            .children.item(0); // form
    }

    _getBoxTag() {
        return 'TD';
    }
}

class ControlsBodyPutsBox extends ControlsBodyCell {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor.children.item(0);
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROLS_BODY_PUTS_BOX;
    }
}

class ControlsBodyBattlesBox extends ControlsBodyCell {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor.children.item(1);
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROLS_BODY_BATTLES_BOX;
    }
}

class ControlsBodySmithsBox extends ControlsBodyCell {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor.children.item(2);
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROLS_BODY_SMITHS_BOX;
    }
}

/* </editor-fold> */

class TakesBox extends Box {
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
            ?.children.item(2); // table#0 armory overview
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_TAKES_BOX;
    }

    _getBoxTag() {
        return 'TABLE';
    }
}
