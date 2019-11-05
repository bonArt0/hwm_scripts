'use strict';

import { BlockElement } from './Base/BlockElement'

export class LeaseBlock extends BlockElement {
  static _getStructure () {
    return {
      header: (new BlockElement()).addClass('wblight armory__lease__header'),
      body: (new BlockElement()).addClass('wbwhite armory__lease__body'),
    }
  }

  constructor (container) {
    const structure = LeaseBlock._getStructure()

    super(structure)

    const headerContainer = container.find('table.wb tr:contains(\'Ваша аренда\')').first()
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
    node.addClass('armory__lease')

    this._rawData.base.replaceWith(node)

    return node
  }
}