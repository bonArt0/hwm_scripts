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
     * @type {HTMLTableCellElement}
     * @private
     */
    _armoryBox;

    /**
     * @type {HTMLTableSectionElement}
     * @private
     */
    _armoryOverviewBox;

    /**
     * @type {HTMLTableCellElement}
     * @private
     */
    _armoryInfoBox;

    /**
     * @type {HTMLTableCellElement}
     * @private
     */
    _armoryAccountBox;

    /**
     * @type {HTMLTableCellElement}
     * @private
     */
    _armoryOnlineSwitchBox;

    /**
     * @type {HTMLTableCellElement}
     * @private
     */
    _armoryControlSwitchBox;

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
     * @type {HTMLTableCellElement}
     * @private
     */
    _armoryArtsBox;

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

            this._initArmoryBox(initialAnchor);

            this._initArmoryOverviewBox();
            this._initArmoryInfoBox();
            this._initArmoryAccountBox();
            this._initArmoryOnlineSwitchBox();
            this._initArmoryControlSwitchBox();
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
     * @param {HTMLImageElement} initialAnchor
     * @throws {Error} on init failure
     * @private
     */
    _initArmoryBox(initialAnchor) {
        const armoryBox = initialAnchor
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
            ?.parentElement; // td#0, armory box

        if (armoryBox && armoryBox.tagName === 'TD') {
            armoryBox.classList.add(FrameworkClassNames.ARMORY_BOX);
            this._armoryBox = armoryBox;
            return;
        }

        this._throwError('ArmoryBox');
    }

    /**
     * @returns {HTMLTableCellElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryBox() {
        if (!this._armoryBox || this._armoryBox.tagName !== 'TD') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return this._armoryBox;
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory overview box"> */

    /**
     * @throws {Error} on init failure
     */
    _initArmoryOverviewBox() {
        const armoryOverviewBox = this.getArmoryBox()
            ?.children.item(0) // table#0 armory overview
            ?.children.item(0); // tbody#0 armory overview

        if (armoryOverviewBox && armoryOverviewBox.tagName === 'TBODY') {
            armoryOverviewBox.classList.add(FrameworkClassNames.ARMORY_OVERVIEW_BOX);
            this._armoryOverviewBox = armoryOverviewBox;
            return;
        }

        this._throwError('ArmoryOverviewBox');
    }

    /**
     * @returns {HTMLTableSectionElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryOverviewBox() {
        if (!this._armoryOverviewBox || this._armoryOverviewBox.tagName !== 'TBODY') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return this._armoryOverviewBox;
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory info box"> */

    /**
     * @throws {Error} on init failure
     */
    _initArmoryInfoBox() {
        const armoryInfoBox = this.getArmoryOverviewBox()
            ?.children.item(0) // tr#0 armory overview
            ?.children.item(0); // td#0 armory overview

        if (armoryInfoBox && armoryInfoBox.tagName === 'TD') {
            armoryInfoBox.classList.add(FrameworkClassNames.ARMORY_INFO_BOX);
            this._armoryInfoBox = armoryInfoBox;
            return;
        }

        this._throwError('ArmoryInfoBox');
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

    /* <editor-fold desc="armory account box"> */

    /**
     * @throws {Error} on init failure
     */
    _initArmoryAccountBox() {
        const armoryAccountBox = this.getArmoryOverviewBox()
            ?.children.item(0) // tr#0 armory overview
            ?.children.item(1); // td#1 armory overview

        if (armoryAccountBox && armoryAccountBox.tagName === 'TD') {
            armoryAccountBox.classList.add(FrameworkClassNames.ARMORY_ACCOUNT_BOX);
            this._armoryAccountBox = armoryAccountBox;
            return;
        }

        this._throwError('ArmoryAccountBox');
    }

    /**
     * @returns {HTMLTableCellElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryAccountBox() {
        if (!this._armoryAccountBox || this._armoryAccountBox.tagName !== 'TD') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return this._armoryAccountBox;
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory online switch box"> */

    /**
     * @throws {Error} on init failure
     */
    _initArmoryOnlineSwitchBox() {
        const armoryOnlineSwitchBox = this.getArmoryOverviewBox()
            ?.children.item(0) // tr#0 armory overview
            ?.children.item(2); // td#2 armory overview

        if (armoryOnlineSwitchBox && armoryOnlineSwitchBox.tagName === 'TD') {
            armoryOnlineSwitchBox.classList.add(FrameworkClassNames.ARMORY_ONLINE_SWITCH_BOX);
            this._armoryOnlineSwitchBox = armoryOnlineSwitchBox;
            return;
        }

        this._throwError('ArmoryOnlineSwitchBox');
    }

    /**
     * @returns {HTMLTableCellElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryOnlineBox() {
        if (!this._armoryOnlineSwitchBox || this._armoryOnlineSwitchBox.tagName !== 'TD') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return this._armoryOnlineSwitchBox;
    }

    /* </editor-fold> */

    /* <editor-fold desc="armory control switch box"> */

    /**
     * @throws {Error} on init failure
     */
    _initArmoryControlSwitchBox() {
        const armoryControlSwitchBox = this.getArmoryOverviewBox()
            ?.children.item(0) // tr#0 armory overview
            ?.children.item(3); // td#3 armory overview

        if (armoryControlSwitchBox && armoryControlSwitchBox.tagName === 'TD') {
            armoryControlSwitchBox.classList.add(FrameworkClassNames.ARMORY_CONTROL_SWITCH_BOX);
            this._armoryControlSwitchBox = armoryControlSwitchBox;
            return;
        }

        this._throwError('ArmoryControlSwitchBox');
    }

    /**
     * @returns {HTMLTableCellElement}
     * @throws {Error} on invalid framework usage
     */
    getArmoryControlSwitchBox() {
        if (!this._armoryControlSwitchBox || this._armoryControlSwitchBox.tagName !== 'TD') {
            this._throwError('Invalid ArmoryFramework usage, use ArmoryFramework.init() first');
        }
        return this._armoryControlSwitchBox;
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
        const armoryControlsBox = this.getArmoryBox()
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
        const armoryRepairsBox = this.getArmoryBox()
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
        const armoryTabsBox = this.getArmoryBox()
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
        const armoryArtsBox = this.getArmoryBox()
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
