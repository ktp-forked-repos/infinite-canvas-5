###
    An object that adds extra functionality to a basic class
###
angular.module('quickstartApp.common.utils.services.Module', [])
  .factory 'Module', () -> class Module
    ###
        Attaches every property of the obj directly on the function constructor

        @param [Object] obj and object representing the extension properties
    ###
    @extend: (obj) ->
      for key, value of obj when key not in ['extend','include']
        @[key] = value
      obj.extended?.apply(@)
      this

    ###
        Attaches every property of the obj to the
        prototype of the function constructor

        @param [Object] obj an object representing the included properties
        @param [Function] decorator a decorator function applied
        for every property's value
    ###
    @include: (obj, decorator) ->
      for key, value of obj when key  not in ['extend','include']
        if decorator and typeof value is 'Function'
          value = decorator(value)
        @::[key] = value
      obj.included?.apply(@)
      this

