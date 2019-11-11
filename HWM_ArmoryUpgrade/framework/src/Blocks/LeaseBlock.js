'use strict'

import { BlockElement } from './Base/BlockElement'

export class LeaseBlock extends BlockElement {
  static _getStructure () {
    return {
      header: (new BlockElement()).addClass('wblight armory__lease__header'),
      body: (new BlockElement()).addClass('wbwhite armory__lease__body'),
    }
  }

  constructor (baseContainer) {
    const headerContainer = baseContainer.find(
      'table.wb tr:contains(\'Ваша аренда\')').first()
    const bodyContainer = headerContainer.next()

    const structure = LeaseBlock._getStructure()

    const artBlocks = {}
    const blocks = bodyContainer.children('td').first().
      children('table').first().
      children('tbody').first().
      children('tr').first().
      children('td')
    blocks.each(function (index) {
      const container = $(this).
        children('table').first().
        children('tbody').first().
        children('tr')
      const artContainer = container.first().children('td').first().html()
      const label = container.last().children('td').first().html()

      structure.body._children[index] = new BlockElement()
      artBlocks[index] = artContainer + label
    })

    super(structure)

    this._rawData = {
      base: headerContainer.closest('table'),
      header: headerContainer.children().eq(0).html(),
      body: artBlocks,// bodyContainer.children().eq(0).html(),
    }
  }

  build (previous) {
    this.populate(this._rawData)

    const node = super.build()
    node.addClass('armory__lease')

    if (previous !== undefined) {
      node.insertAfter(previous)
    } else {
      this._rawData.base.replaceWith(node)
    }

    return node
  }
}