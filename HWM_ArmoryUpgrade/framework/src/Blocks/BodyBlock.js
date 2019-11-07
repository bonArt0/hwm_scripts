'use strict'

import { BlockElement } from './Base/BlockElement'

export class BodyBlock extends BlockElement {
  static _getStructure () {
    return {
      content: (new BlockElement()).addClass('wbwhite armory__body__content'),
      controls: (new BlockElement({
        text: (new BlockElement()).addClass(
          'wbwhite armory__body__controls__text'),
        button: (new BlockElement()).addClass(
          'wblight armory__body__controls__button'),
      })).addClass('armory__body__controls'),
    }
  }

  constructor (baseContainer) {
    const contentContainer = baseContainer.children('table').last()
    const controlsContainer = contentContainer.next('form')

    const structure = BodyBlock._getStructure()
    structure.controls.
      addWrapper($('<div>').append(controlsContainer).html().
        replace(/<table([\r\n]|.)+<\/form>/, '|</form>').split('|'))

    super(structure)

    this._rawData = {
      base: contentContainer.closest('table'),
      content: contentContainer.
        find('tbody > tr > td').first().
        html(),
      controls: {
        text: controlsContainer.
          find('table > tbody > tr').first().
          children().first().
          html(),
        button: controlsContainer.
          find('table > tbody > tr').last().
          children().first().
          html(),
      },
    }
  }

  build () {
    this.populate(this._rawData)

    const node = super.build()
    node.addClass('armory__body')

    this._rawData.base.next().remove()
    this._rawData.base.replaceWith(node)

    return node
  }
}