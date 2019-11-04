'use strict';

import { CommonElement } from './CommonElement'

export class BlockElement extends CommonElement {
  constructor (children) {
    super(children)

    this._type = '<div>'
  }

  build () {
    const node = super.build()

    for (let child in this._children) {
      node.append(this._children[child].build())
    }

    return node
  }
}