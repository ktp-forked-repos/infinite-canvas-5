
###
    Given a list of callback functions it iterates through it
    and calls each function alongside the passed arguments

    Thanks to Jeremy Ashkenas @see https://github.com/jashkenas/backbone/

    @param [Array] callbacks the list of callback functions to be called
    @param [Array] args the arguments array passed to EventBus::trigger
###
triggerEventCallbacks = (callbacks, args) ->
  [a1, a2, a3] = [args[0], args[1], args[2]]
  cbLen = callbacks?.length || 0
  i = -1
 
  switch args.length
    when 0
      while (++i < cbLen)
        callbacks[i].cb.call(callbacks[i].ctx)
    when 1
      while (++i < cbLen)
        callbacks[i].cb.call(callbacks[i].ctx, a1)
    when 2
      while (++i < cbLen)
        callbacks[i].cb.call(callbacks[i].ctx, a1, a2)
    when 3
      while (++i < cbLen)
        callbacks[i].cb.call(callbacks[i].ctx, a1, a2, a3)
    else
      while (++i < cbLen)
        callbacks[i].cb.apply(callbacks[i].ctx, args)

###
    Dispatching mechanism for centralizing application-wide events

    The internal structure of the event list looks like this:
        events = {
            callbacks: [{cb, ctx}, {cb, ctx}, ...]
        }
    where each object corresponding to the "eventName" array,
    represents a set containing a callback and a context
###
ObservableMixin =
  ###
      Attaches an event to a callback

      @param [String] event the name of the event it will monitor
      @param [Function] fn the callback function triggered for event
      @param [Object] ctx Context in which the callback function will be called

      @return [EventBus]
  ###
  on: (event, cb, ctx) ->
    if typeof cb is 'function' and typeof event is 'string'
      # construct the events list and add an empty array at key 'event'
      @_events ?= {}
      @_events[event] ?= []
      # construct events if not already defined, then push a new callback
      @_events[event].push { cb, ctx }
    return @

  ###
      Removes a callback function for a given event and
      deletes the event if the callback list becomes empty

      @param [String] event the name of the event
      @param [Function] fn the callback to be removed from the callback list
  ###
  off: (event, cb) ->
    callbackList = @_events?[event]
    if event and cb and callbackList?.length
      # small tweak borrowed from Backbone.Event
      @_events[event] = retain = []
      for callback, i in callbackList
        retain.push callback unless callback.cb is cb
      if retain.length
        @_events[event] = retain
      else
        delete @_events[event]
      ###
          Check made to remove all the callbacks for the event
          if there was no callback specified
      ###
    else if event and typeof cb is 'undefined' and callbackList?.length
      delete @_events[event]
    return @

  ###
      Triggers the event specified and calls the
      attached callback functions

      @param [String] event the name of the event that will be triggered
  ###
  trigger: (event, args...) ->
    eventCallbacks = @_events?[event]
    allCallbacks = @_events?.all

    if event and eventCallbacks or allCallbacks
      if eventCallbacks?.length
        triggerEventCallbacks(eventCallbacks, args)
      if allCallbacks?.length
        tmpArgs = args
        # add the event name to the from of the callback params
        tmpArgs.unshift event
        triggerEventCallbacks(allCallbacks, tmpArgs)
    return @

angular.module('quickstartApp.common.utils.services.ObservableMixin', [])
  .factory 'ObservableMixin', () -> ObservableMixin