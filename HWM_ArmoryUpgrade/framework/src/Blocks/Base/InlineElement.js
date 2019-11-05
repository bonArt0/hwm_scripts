'use strict';

import { CommonElement } from './CommonElement'

export class InlineElement extends CommonElement {
  constructor (children) {
    super(children)

    this._type = '<span>'
  }

  build () {
    this._data = this._wrapper.replace('%v', this._data)

    const node = super.build()

    for (let child in this._children) {
      node.text(this._children[child].build())
    }

    return node
  }
}