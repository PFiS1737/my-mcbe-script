import { each, eachAsync, isAsyncFunc } from "./util/index"

export class EventEmitter {
  _events: Record<string, Function[]> = {}

  on(eventName: string, listener: Function) {
    if (isAsyncFunc(listener)) {
      const _eventName = `${eventName}.async`
      if (this._events[_eventName]) this._events[_eventName].push(listener)
      else this._events[_eventName] = [listener]
    } else {
      if (this._events[eventName]) this._events[eventName].push(listener)
      else this._events[eventName] = [listener]
    }
    return this
  }
  once(eventName: string, listener: Function) {
    if (isAsyncFunc(listener)) {
      const _eventName = `${eventName}.async`
      const _listener = async (...args: any[]) => {
        await listener(...args)
        this.removeListener(_eventName, _listener)
      }
      if (this._events[_eventName]) this._events[_eventName].push(_listener)
      else this._events[_eventName] = [_listener]
    } else {
      const _listener = (...args: any[]) => {
        listener(...args)
        this.removeListener(eventName, _listener)
      }
      if (this._events[eventName]) this._events[eventName].push(_listener)
      else this._events[eventName] = [_listener]
    }
    return this
  }
  removeListener(eventName: string, listener: Function) {
    if (this._events[eventName]) {
      const newListeners: Function[] = []
      each(this._events[eventName], (_listener) => {
        if (_listener !== listener) newListeners.push(_listener)
      })
      this._events[eventName] = newListeners
    }
    return this
  }
  async emit(eventName: string, ...args: any[]) {
    if (this._events[eventName]) {
      each(this._events[eventName], (listener) => listener(...args))
    }
    await this.asyncEmit(eventName, ...args)
  }
  async asyncEmit(eventName: string, ...args: any[]) {
    const _eventName = `${eventName}.async`
    if (this._events[_eventName]) {
      await eachAsync(
        this._events[_eventName],
        async (listener) => await listener(...args)
      )
    }
  }
  addListener(eventName: string, listener: Function) {
    return this.on(eventName, listener)
  }
  off(eventName: string, listener: Function) {
    return this.removeListener(eventName, listener)
  }
}

export default EventEmitter
