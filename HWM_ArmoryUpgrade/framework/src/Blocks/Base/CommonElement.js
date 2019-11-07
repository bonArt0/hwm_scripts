'use strict'

export class CommonElement {
  constructor (children) {
    this._type = ''
    this._children = {}
    this._classes = []
    this._wrapper = ['', '']
    this._data = undefined

    if (typeof children === 'object') {
      this._children = children
    }
  }

  getChild(name) {
    return this._children[name]
  }

  addClass (cls) {
    if (typeof cls !== 'string' || cls === '') {
      return
    }

    for (let c of cls.split(' ')) {
      this._classes.push(c)
    }

    return this
  }

  removeClass(cls) {
    if (typeof cls !== 'string' || cls === '') {
      return
    }

    for (let i = 0; i < this._classes.length; i++) {
      if (this._classes[i] === cls) {
        this._classes.splice(i, 1)
        i--
      }
    }

    return this
  }

  addWrapper(wrp) {
    if (!Array.isArray(wrp) || wrp.length !== 2) {
      return
    }

    this._wrapper = wrp

    return this
  }

  getWrapper() {
    return this._wrapper
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
