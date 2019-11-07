'use strict'

export class CommonElement {
  _node
  _children
  _classes
  _wrapper
  _data

  constructor (children) {
    this._node = ''
    this._children = {}
    this._classes = []
    this._wrapper = ['', '']
    this._data = undefined

    if (typeof children === 'object') {
      this._children = children
    }
  }

  setNode (node) {
    this._node = node
  }

  getChildren () {
    return this._children
  }

  getChild (name) {
    return this._children[name]
  }

  addClass (className) {
    if (typeof className !== 'string' || className === '') {
      return
    }

    for (let c of className.split(' ')) {
      this._classes.push(c)
    }

    return this
  }

  removeClass (className) {
    if (typeof className !== 'string' || className === '') {
      return
    }

    for (let i = 0; i < this._classes.length; i++) {
      if (this._classes[i] === className) {
        this._classes.splice(i, 1)
        i--
      }
    }

    return this
  }

  addWrapper (wrapper) {
    if (!Array.isArray(wrapper) || wrapper.length !== 2) {
      return
    }

    this._wrapper = wrapper

    return this
  }

  getWrapper () {
    return this._wrapper
  }

  populate (data) {
    if (Object.keys(this._children).length > 0) {
      for (let elem in this._children) {
        this._children[elem].populate(data[elem])
      }
    } else {
      this._data = data
    }
  }

  build () {
    if (this._node === '') {
      throw new Error('incorrect element type')
    }

    const node = $(this._node).html(this._data)

    for (let className of this._classes) {
      node.addClass(className)
    }

    return node
  }
}
