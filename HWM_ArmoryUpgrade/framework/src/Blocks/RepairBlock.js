'use strict'

import { BlockElement } from './Base/BlockElement'

export class RepairBlock extends BlockElement {
  static _getStructure () {
    return {
      header: (new BlockElement()).addClass('wblight armory__repair__header'),
      body: (new BlockElement()).addClass('wbwhite armory__repair__body'),
    }
  }

  constructor (baseContainer) {

    const headerContainer = baseContainer.find(
      'table.wb tr:contains(\'Артефакты для ремонта.\')').first()
    const bodyContainer = headerContainer.next()

    const structure = RepairBlock._getStructure()
    super(structure)

    this._rawData = {
      base: headerContainer.closest('table'),
      header: headerContainer.children().eq(0).html(),
      body: bodyContainer.children().eq(0).html(),
    }
  }

  build (previous) {
    this.populate(this._rawData)

    const node = super.build()
    node.addClass('armory__repair')

    if (previous !== undefined) {
      node.insertAfter(previous)
    } else {
      this._rawData.base.replaceWith(node)
    }

    return node
  }
}