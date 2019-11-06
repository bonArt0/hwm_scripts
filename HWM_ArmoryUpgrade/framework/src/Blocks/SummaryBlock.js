'use strict'

import { BlockElement } from './Base/BlockElement'
import { InlineElement } from './Base/InlineElement'

export class SummaryBlock extends BlockElement {
  static _getStructure () {
    return {
      overview: (new BlockElement({
        clan: (new BlockElement()).addClass('js-summary-clan'),
        capacity: (new InlineElement()).addClass('js-summary-capacity'),
        log: (new InlineElement()).addClass('js-summary-log'),
      })).addClass('wblight armory__summary__overview'),
      gold: (new BlockElement({
        gold_icon: (new InlineElement()).addClass('js-summary-gold_icon'),
        gold_deposit: (new InlineElement()).addClass('js-summary-gold_deposit'),
        gold_freezed: (new InlineElement()).addClass('js-summary-gold_freezed'),
      })).addClass('wblight armory__summary__gold'),
      online: (new BlockElement()).addClass(
        'wblight armory__summary__online js-summary-online'),
      control: (new BlockElement()).addClass(
        'wblight armory__summary__control js-summary-control'),
    }
  }

  constructor (baseContainer) {
    super(SummaryBlock._getStructure())

    const container = baseContainer.find(
      'table.wb tr:contains(\'Склад клана \')').first()

    const overviewContainer = container.children('td').first()
    const goldContainer = overviewContainer.next()
    const onlineContainer = goldContainer.next()
    const controlContainer = onlineContainer.next()

    this._rawData = {
      base: container.closest('table'),
      overview: {
        clan: overviewContainer.html().match(/(.+?)<br>/)[1],
        capacity: overviewContainer.html().match(/<br>(.+\.) \(/)[1],
        log: overviewContainer.html().match(/ \(.+\)/),
      },
      gold: {
        gold_icon: goldContainer.find('td:first td:first').html(),
        gold_deposit: goldContainer.find('td:first td:last').html(),
        gold_freezed: goldContainer.find('td:last').html(),
      },
      online: onlineContainer.find('a'),
      control: controlContainer.find('a'),
    }
  }

  get editing () {
    if (this._editing === undefined) {
      this._editing = !(+this._rawData.control.
        attr('href').
        match(/sklad_rc_on=[01]/)[1])
    }

    return this._editing
  }

  build () {
    this.populate(this._rawData)

    const summary = $('<div>')
    summary.addClass('armory__summary').append(super.build())

    this._rawData.base.replaceWith(summary)

    return summary
  }
}