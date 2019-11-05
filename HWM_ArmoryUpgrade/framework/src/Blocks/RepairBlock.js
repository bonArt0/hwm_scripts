'use strict';

import { BlockElement } from './Base/BlockElement'

export class RepairBlock extends BlockElement {
  static _getStructure () {
    return {
      header: (new BlockElement()).addClass('wblight armory__repair__header'),
      body: (new BlockElement()).addClass('wbwhite armory__repair__body'),
    }
  }

  constructor (baseContainer) {
    const structure = RepairBlock._getStructure()

    super(structure)

    const headerContainer = baseContainer.find('table.wb tr:contains(\'Артефакты для ремонта.\')').first()
    const bodyContainer = headerContainer.next()

    this._rawData = {
      base: headerContainer.closest('table'),
      header: headerContainer.children().eq(0).html(),
      body: bodyContainer.children().eq(0).html(),
    }
  }

  build () {
    this.populate(this._rawData)

    const node = super.build()
    node.addClass('armory__repair')

    this._rawData.base.replaceWith(node)

    return node
  }
}