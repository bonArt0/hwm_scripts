'use strict';

import { SummaryBlock } from './Blocks/SummaryBlock'
import { SectorsBlock } from './Blocks/SectorsBlock'
// import { ControlsBlock } from './Blocks/ControlsBlock'
// import { LeaseBlock } from './Blocks/LeaseBlock'
// import { RepairBlock } from './Blocks/RepairBlock'
// import { TabsBlock } from './Blocks/TabsBlock'
// import { BodyBlock } from './Blocks/BodyBlock'

export class ArmoryFramework {
  constructor (config) {
    this._config = config

    this._baseContainer = $('body > center:last-child > table:last-child')
      .find('td').first()
  }

  AssembleFramework () {
    this._initBlocks()
    this._rebuildElements()
    //this.CreateSettingsElements()
  }

  _initBlocks () {
    this._summaryBlock = new SummaryBlock(this._baseContainer)
    this._sectorsBlock = new SectorsBlock(this._baseContainer)
    //this._controlsBlock = new ControlsBlock(this._baseContainer)
    //this._leaseBlock = new LeaseBlock(this._baseContainer)
    // this._repairBlock = new RepairBlock(this._baseContainer)
    // this._tabsBlock = new TabsBlock(this._baseContainer)
    // this._bodyBlock = new BodyBlock(this._baseContainer)
  }

  _rebuildElements () {
     const summary = this._summaryBlock.build()
     this._sectorsBlock.build(summary)
  }
}