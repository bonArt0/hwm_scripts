'use strict'

import { BlockElement } from './Base/BlockElement'
import { InlineElement } from './Base/InlineElement'

export class SectorsBlock extends BlockElement {
  static _getStructure () {
    return {
      overview: (new InlineElement()).addClass('js-sectors-overview'),
      control: (new InlineElement()).addClass('js-sectors-control'),
      level: (new InlineElement()).addClass('js-sectors-level'),
    }
  }

  constructor (baseContainer) {
    const container = baseContainer.find(
      'table.wb tr:contains(\'Районы доступа: \') td').first()
    const control = container.html().match(/<form(.|\n)+<\/form><br>/);

    const structure = SectorsBlock._getStructure()
    super(structure)

    this._rawData = {
      base: container.closest('table'),
      overview: container.html().match(/^.+<\/a>/)[0],
      control: control !== null ? control[0] : null,
      level: container.html().match(/Ваш уровень.+<\/b>/)[0],
    }
  }

  build (previous) {
    this.populate(this._rawData)

    const node = super.build()

    node.addClass('wbwhite armory__sectors').insertAfter(previous)
  }
}