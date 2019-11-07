'use strict'

import { CommonElement } from './CommonElement'

export class BlockElement extends CommonElement {
  constructor (children) {
    super(children)

    this._type = '<div>'
  }

  build () {
    const node = super.build()

    for (let child in this._children) {
      const childNode = this._children[child].build()

      node.append(childNode)

      this._children[child].wrap(childNode)
    }

    return node
  }

  // оборачивает содержимое узла
  wrap (node) {
    if (this._wrapper[0] !== '' && this._wrapper[1] !== '') {
      node.html(this._wrapper[0] + node.html() + this._wrapper[1])
    }
  }
}