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
    ARMORY_TAKES_REPAIRS_HEADER_BOX: 'afw_armory_takes_repairs_header_box',
    ARMORY_TAKES_REPAIRS_BODY_BOX: 'afw_armory_takes_repairs_body_box',
    ARMORY_TAKES_LEASES_HEADER_BOX: 'afw_armory_takes_leases_header_box',
    ARMORY_TAKES_LEASES_BODY_BOX: 'afw_armory_takes_leases_body_box',
    ARMORY_TABS_BOX: 'afw_armory_tabs_box',
    ARMORY_DESCRIPTION_BOX: 'afw_armory_description_box',
    ARMORY_DESCRIPTION_FORM_BOX: 'afw_armory_description_form',
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
 * @type {ArmoryFramework} _ArmoryFrameworkInstance
 * @private
 */
let _ArmoryFrameworkInstance;

class FrameworkError extends Error {
    /**
     * @type {object}
     * @public
     */
    context = {};

    constructor(props, context) {
        super(props);

        this.context = context;
    }
}

class ArmoryFramework {
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

    /**
     * @return {ArmoryFramework}
     */
    static init() {
        if (!_ArmoryFrameworkInstance || !_ArmoryFrameworkInstance?.initialized) {
            console.info('Armory Framework initialization started');

            try {
                _ArmoryFrameworkInstance = new ArmoryFramework();
            } catch (e) {
                console.error('Something happen while framework initializing', e.context);
                throw e;
            }

            console.info('Armory Framework initialized');
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
            throw new Error('Framework doesn\'t support non-management mode yet');
        }

        if (this.initialized) {
            throw new Error('Framework already initialized')
        }

        this._armoryBox = new ArmoryBox(this._findInitialAnchor(), this._findActiveTab());
        this.initialized = true;
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
     * @returns {HTMLImageElement}
     * @throws {Error} on init failure
     * @private
     */
    _findInitialAnchor() {
        const initialAnchor = document.getElementsByClassName('rs').item(0);
        if (initialAnchor && initialAnchor.tagName === 'IMG') {
            return initialAnchor;
        }

        throw new FrameworkError('Something happen with game layout (initial anchor not found)', {anchor: initialAnchor});
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

    /**
     * @param {HTMLElement} anchor
     * @throws {Error} on init failure
     */
    constructor(anchor) {
        this._initBox(anchor);
    }

    /**
     * @returns {HTMLElement}
     * @throws {Error} on invalid framework usage
     * @public
     */
    getOuterBox() {
        if (this._box?.tagName === this._getBoxTag()) {
            return this._box;
        }

        throw new FrameworkError(`Can't get outer box`, {element: this});
    }

    /**
     * @return {HTMLElement}
     * @throws {Error} on invalid framework usage
     * @public
     */
    getInnerBox() {
        const box = this._getInnerBox();
        if (box?.tagName === this._getInnerBoxTag()) {
            return box;
        }

        throw new FrameworkError(`Can't get inner box`, {innerBox: box, element: this});
    }

    /**
     * @throws {Error} on init failure
     * @protected
     */
    _initBox(anchor) {
        const box = this._findBox(anchor);

        if (box?.tagName === this._getBoxTag()) {
            box.classList.add(this._getBoxClassName());
            this._box = box;
            return;
        }

        throw new FrameworkError(`Something happen with game layout`, {element: this, box: box, anchor: anchor});
    }

    /**
     * @return {HTMLElement}
     * @abstract
     * @protected
     */
    _findBox(anchor) {}

    /**
     * @todo replace name
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
    _getInnerBoxTag() {}

    /**
     * @return {string}
     * @abstract
     * @protected
     */
    _getBoxClassName() {}

    /**
     * @return {HTMLElement}
     * @private
     */
    _getInnerBox() {
        return this.getOuterBox();
    }
}

/**
 * @abstract
 */
class TableBasedBox extends Box {
    _getBoxTag() {
        return 'TABLE';
    }

    _getInnerBoxTag() {
        return 'TABLE';
    }
}

/**
 * @abstract
 */
class TableSectionBox extends TableBasedBox {
    /**
     * @type {number}
     * @protected
     */
    _tbodyId = 0;

    _getInnerBoxTag() {
        return 'TBODY';
    }

    /**
     * @return {HTMLTableSectionElement}
     * @protected
     */
    _getInnerBox() {
        return super._getInnerBox().children.item(this._tbodyId);
    }
}

/**
 * @abstract
 */
class TableRowBox extends TableSectionBox {
    /**
     * @type {number}
     * @protected
     */
    _trId = 0;

    _getInnerBoxTag() {
        return 'TR';
    }

    /**
     * @return {HTMLTableRowElement}
     * @protected
     */
    _getInnerBox() {
        return super._getInnerBox().children.item(this._trId);
    }
}

/**
 * @abstract
 */
class TableCellBox extends TableRowBox {
    /**
     * @type {number}
     * @protected
     */
    _tdId = 0;

    _getInnerBoxTag() {
        return 'TD';
    }

    /**
     * @return {HTMLTableCellElement}
     * @protected
     */
    _getInnerBox() {
        return super._getInnerBox().children.item(this._tdId);
    }
}

/**
 * @abstract
 */
class TableRowBasedBox extends Box {
    _getBoxTag() {
        return 'TR';
    }

    _getInnerBoxTag() {
        return 'TR';
    }
}

/**
 * @abstract
 */
class TableCellBasedBox extends Box {
    _getBoxTag() {
        return 'TD';
    }

    _getInnerBoxTag() {
        return 'TD';
    }
}

class ArmoryBox extends TableCellBox {
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
     * @throws {Error} on init failure
     */
    constructor(anchor, activeTab) {
        super(anchor);

        const innerBox = this.getInnerBox();

        this.overviewBox = new OverviewBox(innerBox);
        this.controlsBox = new ControlsBox(innerBox);
        this.takesBox = new TakesBox(innerBox);
        this.tabsBox = new TabsBox(innerBox);
        switch (activeTab) {
            case ArmoryTab.TAB_DESCRIPTION:
                this.descriptionBox = new DescriptionBox(innerBox);
                this.descriptionFormBox = new DescriptionFormBox(innerBox);
                break;
            case ArmoryTab.TAB_ON_LEASE:
            case ArmoryTab.TAB_WEAPON:
            case ArmoryTab.TAB_ARMOR:
            case ArmoryTab.TAB_JEWELRY:
            case ArmoryTab.TAB_BACKPACK:
            case ArmoryTab.TAB_SETS:
            case ArmoryTab.TAB_UNAVAILABLE:
                this.artsBox = new ArtsBox(innerBox);
        }
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
}

/* <editor-fold desc="armory overview"> */

class OverviewBox extends TableSectionBox {
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

        const innerBox = this.getInnerBox();

        this.infoBox = new OverviewInfoBox(innerBox);
        this.accountBox = new OverviewAccountBox(innerBox);
        this.onlineSwitchBox = new OverviewOnlineSwitchBox(innerBox);
        this.controlSwitchBox = new OverviewControlSwitchBox(innerBox);
        this.sectorsBox = new OverviewSectorsBox(innerBox);
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0); // table
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_OVERVIEW_BOX;
    }
}

class OverviewInfoBox extends TableCellBasedBox {
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
            ?.children.item(0) // tr
            ?.children.item(0); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_INFO_BOX;
    }
}

class OverviewAccountBox extends TableRowBox {
    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0) // tr
            ?.children.item(1) // td
            ?.children.item(0); // table
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_ACCOUNT_BOX;
    }
}

class OverviewOnlineSwitchBox extends TableCellBasedBox {
    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableCellElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0) // tr
            ?.children.item(2); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_ONLINE_SWITCH_BOX;
    }
}

class OverviewControlSwitchBox extends TableCellBasedBox {
    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableCellElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0) // tr
            ?.children.item(3); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROL_SWITCH_BOX;
    }
}

class OverviewSectorsBox extends TableCellBasedBox {
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
}

/* </editor-fold> */

/* <editor-fold desc="armory controls"> */

class ControlsBox extends TableSectionBox {
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

        const innerBox = this.getInnerBox();

        this.headerBox = new ControlsHeaderBox(innerBox);
        this.bodyBox = new ControlsBodyBox(innerBox);
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement|undefined}
     */
    _findBox(anchor) {
        return anchor.children.item(1); // table
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROLS_BOX;
    }
}

class ControlsHeaderBox extends TableRowBasedBox {
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
            ?.children.item(0); // tr
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROLS_HEADER_BOX;
    }
}

/**
 * @abstract
 */
class ControlsHeaderCell extends TableCellBasedBox {
    /**
     * @return {HTMLElement}
     */
    getInnerBox() {
        return super.getInnerBox()
            .children.item(0); // b
    }
}

class ControlsHeaderPutsBox extends ControlsHeaderCell {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor.children.item(0); // td
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
        return anchor.children.item(1); // td
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
        return anchor.children.item(2); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROLS_HEADER_SMITHS_BOX;
    }
}

class ControlsBodyBox extends TableRowBasedBox {
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
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableRowElement|undefined}
     */
    _findBox(anchor) {
        return anchor.children.item(1); // tr
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_CONTROLS_BODY_BOX;
    }
}

/**
 * @abstract
 */
class ControlsBodyCell extends TableCellBasedBox {
    /**
     * @return {HTMLFormElement}
     */
    getInnerBox() {
        return super.getInnerBox().children.item(0); // form
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

class TakesBox extends TableSectionBox {
    /**
     * @type {TakesRepairsHeaderBox}
     * @public
     * @readonly
     */
    repairHeaderBox;

    /**
     * @type {TakesRepairsBodyBox}
     * @public
     * @readonly
     */
    repairBodyBox;

    /**
     * @type {TakesLeasesHeaderBox}
     * @public
     * @readonly
     */
    leasesHeaderBox;

    /**
     * @type {TakesLeasesBodyBox}
     * @public
     * @readonly
     */
    leasesBodyBox;

    /**
     * @param {HTMLElement} anchor
     * @throws {Error} on init failure
     */
    constructor(anchor) {
        super(anchor);

        const innerBox = this.getInnerBox();

        this.repairHeaderBox = new TakesRepairsHeaderBox(innerBox);
        this.repairBodyBox = new TakesRepairsBodyBox(innerBox);
        this.leasesHeaderBox = new TakesLeasesHeaderBox(innerBox);
        this.leasesBodyBox = new TakesLeasesBodyBox(innerBox);
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement|undefined}
     */
    _findBox(anchor) {
        return anchor.children.item(2); // table
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_TAKES_BOX;
    }
}

/**
 * @abstract
 */
class TakesRowBox extends TableCellBasedBox {
    /**
     * @type {number}
     * @protected
     */
    _trId = -1;

    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableRowElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            .children.item(this._getTableRowId()) // tr
            .children.item(0); // td
    }

    /**
     * @return {number}
     * @abstract
     * @protected
     */
    _getTableRowId() {}
}

class TakesRepairsHeaderBox extends TakesRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_TAKES_REPAIRS_HEADER_BOX;
    }

    _getTableRowId() {
        return 0;
    }
}

class TakesRepairsBodyBox extends TakesRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_TAKES_REPAIRS_BODY_BOX;
    }

    _getTableRowId() {
        return 1;
    }
}

class TakesLeasesHeaderBox extends TakesRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_TAKES_LEASES_HEADER_BOX;
    }

    _getTableRowId() {
        return 2;
    }
}

class TakesLeasesBodyBox extends TakesRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_TAKES_LEASES_BODY_BOX;
    }

    _getTableRowId() {
        return 3;
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory tabs"> */

class TabsBox extends TableRowBox {
    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement|undefined}
     */
    _findBox(anchor) {
        return anchor.children.item(3); // table
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_TABS_BOX;
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory description"> */

class DescriptionBox extends TableCellBox {
    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement|undefined}
     */
    _findBox(anchor) {
        return anchor.children.item(4); // table
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_DESCRIPTION_BOX;
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory description form"> */

/**
 * @todo move to DescriptionBox?
 */
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

    _getInnerBoxTag() {
        return 'TBODY';
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory arts"> */

class ArtsBox extends TableCellBox {
    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement|undefined}
     */
    _findBox(anchor) {
        return anchor.children.item(4); // table
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_ARTS_BOX;
    }
}

/* </editor-fold> */
