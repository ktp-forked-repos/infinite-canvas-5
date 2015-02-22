###*
 #  SpotController
###

class SpotController  
  @$inject: [ '$scope', 'SpotService' ]
  constructor: ( @_scope, @_SpotService ) ->
    @_scope.data = @_getData()

    @_scope.$on 'drawing:save', (event, data) =>
      console.log 'spotControler drawing:save', data
      @_scope.$emit 'spot:save', data
      
    @_scope.$on 'spot:update', (event, data) =>
      if data.hPos is @_scope.spotOpts.x and data.vPos is @_scope.spotOpts.y
        console.log 'spotControler spot:updated', data
        @_scope.$broadcast 'draw:data', data.drawingDataUrl

    @_scope.data.then (res) =>
      if res.data?.drawingDataUrl
        @_scope.$broadcast 'draw:data', res.data.drawingDataUrl
      else
        @_scope.$broadcast 'free:data', res

  _getData: =>
    @_SpotService.getData 
      hPos: @_scope.spotOpts.x 
      vPos: @_scope.spotOpts.y

angular.module('quickstartApp.common.spot.controllers.SpotController', [])
  .controller 'SpotController', SpotController