'use strict'

import { CommonElement } from './CommonElement'

export class InlineElement extends CommonElement {
  constructor (children) {
    super(children)

    this.setNode('<span>')
  }

  build () {
    const node = super.build()
    const children = this.getChildren()

    for (let childName in children) {
      const childNode = children[childName].build()
      node.text(childNode)
    }

    return node
  }

  // оборачивает узел
  wrap (node) {
    const wrapper = this.getWrapper()
    if (wrapper[0] !== '' && wrapper[1] !== '') {
      node.before(wrapper[0])
      node.after(wrapper[1])
    }
  }
}