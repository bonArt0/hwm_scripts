// ==UserScript==
// @name          hwm_armory_framework
// @namespace     https://github.com/bonArt0/hwm_scripts
// @version       1.4.7
// @description   Helper for other hwm_armory scripts
// @author        bonArt
// @license       GPL-3.0-only
// @icon          https://dcdn.heroeswm.ru/i/btns/job_fl_btn_warehouse.png
// @match         https://*.heroeswm.ru/sklad_info.php?*
// @match         https://178.248.235.15/sklad_info.php?*
// @match         https://www.lordswm.com/sklad_info.php?*
// @match         https://my.lordswm.com/sklad_info.php?*
// @supportURL    https://www.heroeswm.ru/sms-create.php?mailto_id=117282
// ==/UserScript==

/**
 * @enum
 */
const FrameworkClassNames = {
    ARMORY_BOX: 'afw_armory_box',
    OVERVIEW_BOX: 'afw_armory_overview_box',
    INFO_BOX: 'afw_armory_info_box',
    ACCOUNT_BOX: 'afw_armory_account_box',
    ONLINE_TOGGLE_BOX: 'afw_armory_online_toggle_box',
    MANAGEMENT_TOGGLE_BOX: 'afw_armory_management_toggle_box',
    SECTORS_BOX: 'afw_armory_sectors_box',
    MANAGEMENT_BOX: 'afw_armory_management_box',
    MANAGEMENT_HEADER_BOX: 'afw_armory_management_header_box',
    MANAGEMENT_HEADER_PUTS_BOX: 'afw_armory_management_header_puts_box',
    MANAGEMENT_HEADER_BATTLES_BOX: 'afw_armory_management_header_battles_box',
    MANAGEMENT_HEADER_SMITHS_BOX: 'afw_armory_management_header_smiths_box',
    MANAGEMENT_BODY_BOX: 'afw_armory_management_body_box',
    MANAGEMENT_BODY_PUTS_BOX: 'afw_armory_management_body_puts_box',
    MANAGEMENT_BODY_BATTLES_BOX: 'afw_armory_management_body_battles_box',
    MANAGEMENT_BODY_SMITHS_BOX: 'afw_armory_management_body_smiths_box',
    TAKES_BOX: 'afw_armory_takes_box',
    TAKES_REPAIRS_HEADER_BOX: 'afw_armory_takes_repairs_header_box',
    TAKES_REPAIRS_BODY_BOX: 'afw_armory_takes_repairs_body_box',
    TAKES_LEASES_HEADER_BOX: 'afw_armory_takes_leases_header_box',
    TAKES_LEASES_BODY_BOX: 'afw_armory_takes_leases_body_box',
    TABS_BOX: 'afw_armory_tabs_box',
    DESCRIPTION_BOX: 'afw_armory_description_box',
    DESCRIPTION_FORM_BOX: 'afw_armory_description_form',
    ARTS_BOX: 'afw_armory_arts_box',
    ARTS_LIST_BOX: 'afw_armory_arts_list_box',
    ARTS_ROW_BOX: 'afw_armory_arts_row_box',
    ARTS_HEADER_BOX: 'afw_armory_arts_header_box',
    ARTS_FOOTER_BOX: 'afw_armory_arts_footer_box',
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

/* <editor-fold desc="errors"> */

class AlreadyInitializedError extends Error {
    constructor() {
        super();

        this.message = 'Framework already initialized';
    }
}

class UnsupportedFeatureError extends Error {
    constructor(feature) {
        super();

        this.message = `Framework doesn't support ${feature} yet`;
    }
}

class FrameworkError extends Error {
    /**
     * @type {object}
     * @public
     */
    context = {};

    constructor(message, context) {
        super(message);

        this.context = context;
    }
}

class OuterBoxError extends FrameworkError {
    constructor(context) {
        super(`Can't get outer box`, context);
    }
}

class InnerBoxError extends FrameworkError {
    constructor(context) {
        super(`Can't get inner box`, context);
    }
}

class LayoutError extends FrameworkError {
    constructor(context) {
        super(`Something happen with game layout`, context);
    }
}

/* </editor-fold> */

class ArmoryFramework {
    /**
     * @type {boolean}
     * @private
     */
    _initialized = false;

    /**
     * @type {boolean}
     * @private
     */
    _isManagementMode;

    /**
     * @type {ArmoryTab}
     */
    activeTab = ArmoryTab.TAB_DESCRIPTION;

    /**
     * @type {ArmoryBox}
     * @public
     * @readonly
     */
    armoryBox;

    /**
     * @return {ArmoryFramework|null}
     */
    static init() {
        if (!_ArmoryFrameworkInstance || !_ArmoryFrameworkInstance?._initialized) {
            console.info('Armory Framework initialization started');

            try {
                _ArmoryFrameworkInstance = new ArmoryFramework();
            } catch (e) {
                if (e instanceof UnsupportedFeatureError) {
                    console.warn(e.message);
                    return null;
                }

                if (e instanceof AlreadyInitializedError) {
                    console.info(e.message);
                    return _ArmoryFrameworkInstance;
                }

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
            throw new UnsupportedFeatureError('non-management mode');
        }

        if (this._initialized) {
            throw new AlreadyInitializedError();
        }

        this.activeTab = this._findActiveTab();
        this.armoryBox = new ArmoryBox(this._findInitialAnchor(), this.activeTab);
        this._initialized = true;
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
     * @throws {LayoutError} on init failure
     * @private
     */
    _findInitialAnchor() {
        const initialAnchor = document.getElementsByClassName('rs').item(0);
        if (initialAnchor && initialAnchor.tagName === 'IMG') {
            return initialAnchor;
        }

        throw new LayoutError({element: this, anchor: initialAnchor});
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

    /* <editor-fold desc="common"> */

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
 * @todo remove inner/outer from public
 */
class Box {
    /**
     * @type {HTMLElement}
     * @public
     * @readonly
     */
    box;

    /**
     * @param {HTMLElement} anchor
     * @throws {LayoutError} on init failure
     */
    constructor(anchor) {
        this._initBox(anchor);
    }

    /**
     * @deprecated use this.box
     * @returns {HTMLElement}
     * @throws {OuterBoxError} on invalid framework usage
     * @public
     */
    getOuterBox() {
        if (this.box?.tagName === this._getBoxTag()) {
            return this.box;
        }

        throw new OuterBoxError( {element: this});
    }

    /**
     * @return {HTMLElement}
     * @throws {InnerBoxError} on invalid framework usage
     * @public
     */
    getInnerBox() {
        const box = this._getInnerBox();
        if (box?.tagName === this._getInnerBoxTag()) {
            return box;
        }

        throw new InnerBoxError({innerBox: box, element: this});
    }

    /**
     * @throws {LayoutError} on init failure
     * @protected
     */
    _initBox(anchor) {
        const box = this._findBox(anchor);

        if (box?.tagName === this._getBoxTag()) {
            box.classList.add(this._getBoxClassName());
            this.box = box;
            return;
        }

        throw new LayoutError({element: this, box: box, anchor: anchor});
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
        return this.box;
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
     * @type {ManagementBox}
     * @public
     * @readonly
     */
    managementBox;

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
        this.managementBox = new ManagementBox(innerBox);
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
                this.artsBox = new ArtsBox(innerBox, activeTab);
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
     * @type {OverviewOnlineToggleBox}
     * @public
     * @readonly
     */
    onlineToggleBox;

    /**
     * @type {OverviewManagementToggleBox}
     * @public
     * @readonly
     */
    managementToggleBox;

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
        this.onlineToggleBox = new OverviewOnlineToggleBox(innerBox);
        this.managementToggleBox = new OverviewManagementToggleBox(innerBox);
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
        return FrameworkClassNames.OVERVIEW_BOX;
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
        return FrameworkClassNames.INFO_BOX;
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
        return FrameworkClassNames.ACCOUNT_BOX;
    }
}

class OverviewOnlineToggleBox extends TableCellBasedBox {
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
        return FrameworkClassNames.ONLINE_TOGGLE_BOX;
    }
}

class OverviewManagementToggleBox extends TableCellBasedBox {
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
        return FrameworkClassNames.MANAGEMENT_TOGGLE_BOX;
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
        return FrameworkClassNames.SECTORS_BOX;
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory management"> */

class ManagementBox extends TableSectionBox {
    /**
     * @type {ManagementHeaderBox}
     * @public
     * @readonly
     */
    headerBox;

    /**
     * @type {ManagementBodyBox}
     * @public
     * @readonly
     */
    bodyBox;

    constructor(anchor) {
        super(anchor);

        const innerBox = this.getInnerBox();

        this.headerBox = new ManagementHeaderBox(innerBox);
        this.bodyBox = new ManagementBodyBox(innerBox);
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement|undefined}
     */
    _findBox(anchor) {
        return anchor.children.item(1); // table
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_BOX;
    }
}

class ManagementHeaderBox extends TableRowBasedBox {
    /**
     * @type {ManagementHeaderPutsBox}
     * @public
     * @readonly
     */
    putsBox;

    /**
     * @type {ManagementHeaderBattlesBox}
     * @public
     * @readonly
     */
    battlesBox;

    /**
     * @type {ManagementHeaderSmithsBox}
     * @public
     * @readonly
     */
    smithsBox;

    constructor(anchor) {
        super(anchor);

        this.putsBox = new ManagementHeaderPutsBox(this.getInnerBox());
        this.battlesBox = new ManagementHeaderBattlesBox(this.getInnerBox());
        this.smithsBox = new ManagementHeaderSmithsBox(this.getInnerBox());
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
        return FrameworkClassNames.MANAGEMENT_HEADER_BOX;
    }
}

/**
 * @abstract
 */
class ManagementHeaderCell extends TableCellBasedBox {
    /**
     * @return {HTMLElement}
     */
    getInnerBox() {
        return super.getInnerBox()
            .children.item(0); // b
    }
}

class ManagementHeaderPutsBox extends ManagementHeaderCell {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor.children.item(0); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_HEADER_PUTS_BOX;
    }
}

class ManagementHeaderBattlesBox extends ManagementHeaderCell {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor.children.item(1); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_HEADER_BATTLES_BOX;
    }
}

class ManagementHeaderSmithsBox extends ManagementHeaderCell {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor.children.item(2); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_HEADER_SMITHS_BOX;
    }
}

class ManagementBodyBox extends TableRowBasedBox {
    /**
     * @type {ManagementBodyPutsBox}
     * @public
     * @readonly
     */
    putsBox;

    /**
     * @type {ManagementBodyBattlesBox}
     * @public
     * @readonly
     */
    battlesBox;

    /**
     * @type {ManagementBodySmithsBox}
     * @public
     * @readonly
     */
    smithsBox;

    constructor(anchor) {
        super(anchor);

        this.putsBox = new ManagementBodyPutsBox(this.getInnerBox());
        this.battlesBox = new ManagementBodyBattlesBox(this.getInnerBox());
        this.smithsBox = new ManagementBodySmithsBox(this.getInnerBox());
    }

    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableRowElement|undefined}
     */
    _findBox(anchor) {
        return anchor.children.item(1); // tr
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_BODY_BOX;
    }
}

/**
 * @abstract
 */
class ManagementBodyCell extends TableCellBasedBox {
    /**
     * @return {HTMLFormElement}
     */
    getInnerBox() {
        return super.getInnerBox().children.item(0); // form
    }
}

class ManagementBodyPutsBox extends ManagementBodyCell {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor.children.item(0);
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_BODY_PUTS_BOX;
    }

    isDisabled() {
        return this.getInnerBox().innerHTML.search('нет доступа') > -1;
    }

    hideForm() {
        this.getInnerBox().style.display = 'none';
    }

    /**
     * @return {(number|string)[][]}
     */
    getArtsList() {
        const artsPutOptions= this.getInnerBox().elements[2].options;
        const arts = Array.from(artsPutOptions).map((option) => [+option.value, option.innerHTML]);
        arts.shift(); // remove first "0" element
        return arts;
    }

    /**
     * @return {number}
     */
    getArmoryId() {
        const id = this.getInnerBox().children.item(0)?.value;

        if (id === undefined) {
            throw new FrameworkError('Armory id not found', this);
        }

        return +id;
    }

    /**
     * @returns {string}
     */
    getArtsPutSign() {
        const sign = this.getInnerBox().children.item(1)?.value;

        if (sign === undefined) {
            throw new FrameworkError('Armory puts sign not found', this);
        }

        return sign + '';
    }
}

class ManagementBodyBattlesBox extends ManagementBodyCell {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor.children.item(1);
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_BODY_BATTLES_BOX;
    }
}

class ManagementBodySmithsBox extends ManagementBodyCell {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor.children.item(2);
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_BODY_SMITHS_BOX;
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory takes"> */

class TakesBox extends TableSectionBox {
    /**
     * @type {TakesRepairsHeaderBox|null}
     * @public
     * @readonly
     */
    repairHeaderBox;

    /**
     * @type {TakesRepairsBodyBox|null}
     * @public
     * @readonly
     */
    repairBodyBox;

    /**
     * @type {TakesLeasesHeaderBox|null}
     * @public
     * @readonly
     */
    leasesHeaderBox;

    /**
     * @type {TakesLeasesBodyBox|null}
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
        if (innerBox === null) {
            this.repairHeaderBox = null;
            this.repairBodyBox = null;
            this.leasesHeaderBox = null;
            this.leasesBodyBox = null;
        } else if (innerBox.children.length === 4) {
            // box has both repairs and leases row pairs
            this.repairHeaderBox = new TakesRepairsHeaderBox(innerBox, 0);
            this.repairBodyBox = new TakesRepairsBodyBox(innerBox, 1);
            this.leasesHeaderBox = new TakesLeasesHeaderBox(innerBox, 2);
            this.leasesBodyBox = new TakesLeasesBodyBox(innerBox, 3);
        } else if (innerBox.innerHTML.search('action=repair') > -1) {
            // "Repair" button exists, so box has only repairs row pair
            this.repairHeaderBox = new TakesRepairsHeaderBox(innerBox, 0);
            this.repairBodyBox = new TakesRepairsBodyBox(innerBox, 1);
            this.leasesHeaderBox = null;
            this.leasesBodyBox = null;
        } else {
            // box has only leases row pair
            this.repairHeaderBox = null;
            this.repairBodyBox = null;
            this.leasesHeaderBox = new TakesLeasesHeaderBox(innerBox, 0);
            this.leasesBodyBox = new TakesLeasesBodyBox(innerBox, 1);
        }
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement|undefined}
     */
    _findBox(anchor) {
        return anchor.children.item(2); // table
    }

    _getBoxClassName() {
        return FrameworkClassNames.TAKES_BOX;
    }

    /**
     * @return {HTMLElement|null}
     */
    getInnerBox() {
        try {
            return super.getInnerBox();
        } catch (e) {
            // TakesBox table is empty
            if (e instanceof FrameworkError && e.context.box === undefined) {
                return null;
            }
            throw e;
        }
    }
}

/**
 * @abstract
 */
class TakesRowBox extends TableCellBasedBox {
    /**
     * BEWARE OF MAGIC!
     * For variadic TR id usage
     * @todo refactor this
     * @type {number}
     * @private
     */
    static _currentRowId;

    /**
     * @param {HTMLElement} anchor
     * @param {number} trId
     */
    constructor(anchor, trId) {
        TakesRowBox._currentRowId = trId;
        super(anchor);
    }

    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableRowElement|undefined}
     */
    _findBox(anchor) {
        return anchor
            .children.item(TakesRowBox._currentRowId) // tr
            .children.item(0); // td
    }
}

class TakesRepairsHeaderBox extends TakesRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.TAKES_REPAIRS_HEADER_BOX;
    }
}

class TakesRepairsBodyBox extends TakesRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.TAKES_REPAIRS_BODY_BOX;
    }
}

class TakesLeasesHeaderBox extends TakesRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.TAKES_LEASES_HEADER_BOX;
    }
}

class TakesLeasesBodyBox extends TakesRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.TAKES_LEASES_BODY_BOX;
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
        return FrameworkClassNames.TABS_BOX;
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
        return FrameworkClassNames.DESCRIPTION_BOX;
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
        return this.box
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
        return FrameworkClassNames.DESCRIPTION_FORM_BOX;
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
     * @type {ArtsListBox}
     * @public
     * @readonly
     */
    artsList;

    /**
     * @type {ArtsHeaderBox}
     * @public
     * @readonly
     */
    artsHeader;

    /**
     * @type {ArtsFooterBox|null}
     * @public
     * @readonly
     */
    artsFooter;

    /**
     * @type {ArtsRowBox[]}
     * @public
     * @readonly
     */
    artsRows;

    /**
     * @param {HTMLTableCellElement} anchor
     * @param {ArmoryTab} activeTab
     */
    constructor(anchor, activeTab) {
        super(anchor);

        this.artsList = new ArtsListBox(this.getInnerBox(), activeTab);
        this.artsHeader = this.artsList.artsHeader;
        this.artsFooter = this.artsList.artsFooter;
        this.artsRows = this.artsList.artsRows;
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement|undefined}
     */
    _findBox(anchor) {
        return anchor.children.item(4); // table
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARTS_BOX;
    }
}

class ArtsListBox extends TableSectionBox {
    /**
     * @type {ArtsHeaderBox}
     * @public
     * @readonly
     */
    artsHeader;

    /**
     * @type {ArtsFooterBox|null}
     * @public
     * @readonly
     */
    artsFooter;

    /**
     * @type {ArtsRowBox[]}
     * @public
     * @readonly
     */
    artsRows;

    /**
     * @param {HTMLTableCellElement} anchor
     * @param {ArmoryTab} activeTab
     */
    constructor(anchor, activeTab) {
        super(anchor);

        const rows = Array.from(this.getInnerBox().children)
            .filter(ArtsListBox._filterTagsCallback.bind({tag: 'TR'}));

        this.artsHeader = new ArtsHeaderBox(rows.shift());
        this.artsFooter = activeTab === ArmoryTab.TAB_UNAVAILABLE ? new ArtsFooterBox(rows.pop()) : null;
        this.artsRows = rows.map((row) => new ArtsRowBox(row));
    }


    _findBox(anchor) {
        return Array.from(anchor.children)
            .filter(ArtsListBox._filterTagsCallback.bind({tag: 'TABLE'}))
            .shift();
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARTS_LIST_BOX;
    }

    static _filterTagsCallback(row) {
        return row.tagName === this.tag; // there is a <script> here besides correct tags
    }
}

class ArtsRowBox extends TableRowBasedBox {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableRowElement}
     */
    _findBox(anchor) {
        return anchor;
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARTS_ROW_BOX;
    }
}

class ArtsHeaderBox extends ArtsRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.ARTS_HEADER_BOX;
    }
}

class ArtsFooterBox extends ArtsRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.ARTS_FOOTER_BOX;
    }
}

/* </editor-fold> */
