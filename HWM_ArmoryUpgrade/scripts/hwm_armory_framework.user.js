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
    ARMORY_DESCRIPTION_BOX: 'afw_armory_description_box',
    ARMORY_DESCRIPTION_FORM_BOX: 'afw_armory_description_FORM',
    ARMORY_ARTS_BOX: 'afw_armory_arts_box',
    ARTS_PLACE_FORM: 'afw_arts_place_form',
    ARTS_PLACE_HEADER: 'afw_arts_place_header',
};

/**
 * @enum
 */
const ArmoryTab = {
    TAB_DESCRIPTION: 0,
    TAB_WEAPON: 1,
    TAB_ARMOR: 2,
    TAB_JEWELRY: 3,
    TAB_BACKPACK: 4,
    TAB_SETS: 5,
    TAB_ON_LEASE: 6,
    TAB_UNAVAILABLE: 7,
};

/**
 * @private
 */
let _ArmoryFrameworkInstance;

class ArmoryFramework
{
    /**
     * @type {boolean}
     * @private
     */
    initialized = false

    /**
     * @type {boolean}
     * @private
     */
    _isManagementMode;

    /**
     * @type {ArmoryBox}
     * @private
     */
    _armoryBox;

    static init() {
        if (!_ArmoryFrameworkInstance || !_ArmoryFrameworkInstance?.initialized) {
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
     * @throws {Error} on any init failure
     * @private
     */
    _initFramework() {
        if (!this.isManagementMode()) {
            throw new Error('Framework doesn\'t support non-management mode yet')
        }

        if (this.initialized) {
            throw new Error('Framework already initialized')
        }

        this._armoryBox = new ArmoryBox(this._findInitialAnchor(), this._findActiveTab());
        this.initialized = true;

        console.info('Armory Framework initialized');
    }

    /**
     * @returns {boolean}
     * @deprecated
     */
    isControlOn() {
        return this.isManagementMode();
    }

    /**
     * @returns {boolean}
     */
    isManagementMode() {
        if (this._isManagementMode === undefined) {
            this._isManagementMode = document.body.innerHTML.search('sklad_rc_on=0') > -1;
        }

        return this._isManagementMode;
    }

    /**
     * @returns {ArmoryTab}
     * @private
     */
    _findActiveTab() {
        const params = new URLSearchParams(window.location.search);

        if (!params.has('cat') || +params.get('cat') < 0) {
            return ArmoryTab.TAB_DESCRIPTION;
        }

        if (Number.isNaN(params.get('cat'))) {
            return ArmoryTab.TAB_WEAPON;
        }

        switch (+params.get('cat')) {
            case 0:
                return ArmoryTab.TAB_WEAPON;
            case 1:
                return ArmoryTab.TAB_ARMOR;
            case 2:
                return ArmoryTab.TAB_JEWELRY;
            case 3:
                return ArmoryTab.TAB_SETS;
            case 4:
                return ArmoryTab.TAB_ON_LEASE;
            case 5:
                return ArmoryTab.TAB_UNAVAILABLE;
            case 6:
            default:
                return ArmoryTab.TAB_BACKPACK;
        }
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

        console.error('Something happen with game layout');
        throw new Error('Initial anchor not found');
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
     * @returns {HTMLTableRowElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryTabsBox() {
        return this._armoryBox.tabsBox.getInnerBox();
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory arts box"> */

    /**
     * @returns {HTMLTableCellElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryArtsBox() {
        return this._armoryBox.artsBox.getInnerBox();
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

    /**
     * @type {TabsBox}
     * @public
     * @readonly
     */
    tabsBox;

    /**
     * @type {DescriptionBox}
     * @public
     * @readonly
     */
    descriptionBox;

    /**
     * @type {DescriptionFormBox}
     * @public
     * @readonly
     */
    descriptionFormBox;

    /**
     * @type {ArtsBox}
     * @public
     * @readonly
     */
    artsBox;

    /**
     * @param {HTMLElement} anchor
     * @param {ArmoryTab} activeTab
     */
    constructor(anchor, activeTab) {
        super(anchor);

        this.overviewBox = new OverviewBox(this.getInnerBox());
        this.controlsBox = new ControlsBox(this.getInnerBox());
        this.takesBox = new TakesBox(this.getInnerBox());
        this.tabsBox = new TabsBox(this.getInnerBox());
        switch (activeTab) {
            case ArmoryTab.TAB_DESCRIPTION:
                this.descriptionBox = new DescriptionBox(this.getInnerBox());
                this.descriptionFormBox = new DescriptionFormBox(this.getInnerBox());
                break;
            case ArmoryTab.TAB_ON_LEASE:
            case ArmoryTab.TAB_WEAPON:
            case ArmoryTab.TAB_ARMOR:
            case ArmoryTab.TAB_JEWELRY:
            case ArmoryTab.TAB_BACKPACK:
            case ArmoryTab.TAB_SETS:
            case ArmoryTab.TAB_UNAVAILABLE:
                this.artsBox = new ArtsBox(this.getInnerBox());
        }
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

/* <editor-fold desc="armory takes"> */

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

/* </editor-fold> */

/* <editor-fold desc="armory tabs"> */

class TabsBox extends Box {
    /**
     * @return {HTMLTableRowElement}
     */
    getInnerBox() {
        return this.getOuterBox()
            .children.item(0) // tbody
            .children.item(0); // tr
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(2); // table#0 armory tabs
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_TABS_BOX;
    }

    _getBoxTag() {
        return 'TABLE';
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory description"> */

class DescriptionBox extends Box {
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
            ?.children.item(4); // table
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_DESCRIPTION_BOX;
    }

    _getBoxTag() {
        return 'TABLE';
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory description form"> */

class DescriptionFormBox extends Box {
    /**
     * @return {HTMLTableSectionElement}
     */
    getInnerBox() {
        return this.getOuterBox()
            .children.item(0) // table
            .children.item(0); // tbody
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLFormElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(5); // form
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_DESCRIPTION_FORM_BOX;
    }

    _getBoxTag() {
        return 'FORM';
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory arts"> */

class ArtsBox extends Box {
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
            ?.children.item(3); // table#0 armory arts
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_ARTS_BOX;
    }

    _getBoxTag() {
        return 'TABLE';
    }
}

/* </editor-fold> */
