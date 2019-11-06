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
      const childNode = this._children[child].build()
      const wrapper = this._children[child].getWrapper()
      node.append(childNode)
      childNode.before(wrapper[0])
      childNode.after(wrapper[1])
    }

    return node
  }
}