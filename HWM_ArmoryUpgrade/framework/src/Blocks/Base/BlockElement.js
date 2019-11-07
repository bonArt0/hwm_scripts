'use strict'

import { CommonElement } from './CommonElement'

export class BlockElement extends CommonElement {
  constructor (children) {
    super(children)

    this.setNode('<div>')
  }

  build () {
    const node = super.build()
    const children = this.getChildren()

    for (let childName in children) {
      const childNode = children[childName].build()

      node.append(childNode)
      children[childName].wrap(childNode)
    }

    return node
  }

  // оборачивает содержимое узла
  wrap (node) {
    const wrapper = this.getWrapper()
    if (wrapper[0] !== '' && wrapper[1] !== '') {
      node.html(wrapper[0] + node.html() + wrapper[1])
    }
  }
}