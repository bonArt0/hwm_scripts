'use strict';

export class CommonElement {
  constructor (children) {
    this._type = ''
    this._children = {}
    this._classes = []
    this._wrapper = '%v'
    this._data = undefined

    if (typeof children === 'object') {
      this._children = children
    }
  }

  addClass (cls) {
    if (typeof cls !== 'string' || cls === '') {
      return
    }

    this._classes.push(cls)

    return this
  }

  addWrapper(wrp) {
    if (typeof wrp !== 'string' || wrp === '') {
      return
    }

    this._wrapper = wrp

    return this
  }

  populate(data) {
    if (Object.keys(this._children).length > 0) {
      for (let elem in this._children) {
          this._children[elem].populate(data[elem])
      }
    } else {
      this._data = data
    }
  }

  build () {
    if (this._type === '') {
      throw new Error('incorrect element type')
    }

    const node = $(this._type).html(this._data)

    for (let cls of this._classes) {
      node.addClass(cls)
    }

    return node
  }
}
