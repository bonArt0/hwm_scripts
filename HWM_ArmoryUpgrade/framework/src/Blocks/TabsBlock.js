'use strict';

import { BlockElement } from './Base/BlockElement'

export class TabsBlock extends BlockElement {
  static _getStructure () {
    return {
      tabs: new BlockElement({
        info: (new BlockElement()).addClass('wblight armory__tabs__info'),
        weapon: (new BlockElement()).addClass('wblight armory__tabs__weapon'),
        armor: (new BlockElement()).addClass('wblight armory__tabs__armor'),
        jewelry: (new BlockElement()).addClass('wblight armory__tabs__jewelry'),
        backpack: (new BlockElement()).addClass('wblight armory__tabs__backpack'),
        sets: (new BlockElement()).addClass('wblight armory__tabs__sets'),
        lease: (new BlockElement()).addClass('wblight armory__tabs__lease'),
        unavailable: (new BlockElement()).addClass('wblight armory__tabs__unavailable'),
      })
    }
  }

  constructor (baseContainer) {
    super(TabsBlock._getStructure())

    const container = baseContainer.find('table.wb tr:contains(\'Инф-я\')').first()

    const tabs = {}, elements = {
      0: 'info',
      1: 'weapon',
      2: 'armor',
      3: 'jewelry',
      4: 'backpack',
      5: 'sets',
      6: 'lease',
      7: 'unavailable',
    }

    this._rawData = {
      base: container.closest('table'),
      tabs: {},
    }

    for (let id in elements) {
      // children.length === structure.header.length
      this._rawData.tabs[elements[id]] = container.children().eq(id).html()
    }
  }

  getActive () {
    if (this._active === undefined) {
      const map = {
        'Инф-я': 'info',
        'Оружие': 'weapon',
        'Броня': 'armor',
        'Ювелирка': 'jewelry',
        'Рюкзак': 'backpack',
        'Комплекты': 'sets',
        'В аренде': 'lease',
        'Недоступные': 'unavailable',
      }

      const text = this._rawData.base.find('.wbwhite').text().
        replace(/ \([\d:]+\)/, '')

      this._active = map[text]
    }

    return this._active
  }

  build (activeTab) {
    this.populate(this._rawData)

    this._children.tabs._children[this.getActive()].removeClass('wblight').addClass('wbwhite')

    const node = super.build()
    node.addClass('armory__tabs')

    this._rawData.base.replaceWith(node)

    return node
  }
}