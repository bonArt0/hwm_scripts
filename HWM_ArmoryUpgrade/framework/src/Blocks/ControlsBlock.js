'use strict';

import { InlineElement } from './Base/InlineElement'
import { BlockElement } from './Base/BlockElement'

export class ControlsBlock extends BlockElement {
  static _getStructure () {
    return {
      header: (new BlockElement({
        input: (new BlockElement()).addClass('wblight armory__controls_header__input js-controls_header-input'),
        balance: (new BlockElement({
          label: new InlineElement(),
          value: new InlineElement().addClass('js-controls_header-balance-value').addWrapper('(клан: %v)'),
        })).addClass('wblight armory__controls_header__balance js-controls_header-balance'),
        max_battles: (new BlockElement()).addClass('wblight armory__controls_header__max-battles js-controls_header-max_battles'),
        smith_percent: (new BlockElement()).addClass('wblight armory__controls_header__smith-percent js-controls_header-smith_percent'),
        capacity: (new BlockElement()).addClass('wblight armory__controls_header__capacity js-controls_header-capacity'),
      })).addClass('armory__controls__header'),
      body: (new BlockElement({
        input: (new BlockElement()).addClass('armory__controls_header__input js-controls_body-input'),
        balance: (new BlockElement()).addClass('armory__controls_header__balance js-controls_body-balance'),
        max_battles: (new BlockElement()).addClass('armory__controls_header__max-battles js-controls_body-max_battles'),
        smith_percent: (new BlockElement()).addClass('armory__controls_header__smith-percent js-controls_body-smith_percent'),
        capacity: (new BlockElement()).addClass('armory__controls_header__capacity js-controls_body-capacity'),
      })).addClass('wbwhite armory__controls__body'),
    }
  }

  constructor (baseContainer) {
    const structure = ControlsBlock._getStructure()

    super(structure)

    const headerContainer = baseContainer.find('table.wb tr:contains(\'Поместить артефакт\')').first()
    const bodyContainer = headerContainer.next()

    const header = {}, body = {}, elements = {
      0: 'input',
      1: 'balance',
      2: 'max_battles',
      3: 'smith_percent',
      4: 'capacity',
    }
    for (let id in elements) {
      // children.length === structure.header.length
      header[elements[id]] = headerContainer.children().eq(id).html()
      body[elements[id]] = bodyContainer.children().eq(id).html()
    }

    this._rawData = {
      base: headerContainer.closest('table'),
      header: {
        input: header.input,
        balance: {
          label: header.balance.match(/<b>Баланс<\/b> /),
          value: header.balance.match(/[\d,]+/),
        },
        max_battles: header.max_battles,
        smith_percent: header.smith_percent,
        capacity: header.capacity,
      },
      body: {
        input: body.input,
        balance: body.balance,
        max_battles: body.max_battles,
        smith_percent: body.smith_percent,
        capacity: body.capacity,
      },
    }
  }

  build () {
    this.populate(this._rawData)

    const node = super.build()
    node.addClass('armory__controls')

    this._rawData.base.replaceWith(node)

    return node
  }
}