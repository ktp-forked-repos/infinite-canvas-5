###*
 #  CanvasController
###

class CanvasController  
  @$inject: [ '$scope', 'CanvasService', 'SpotService', 'LiveCanvasService', '$interval', '$window']
  constructor: ( @_scope, @_CanvasService, @_SpotService, @_LiveCanvasService, $interval, @_window ) ->
    @_scope.stop = undefined

    ###*
     * Handlers for scope EVENTS
    ###
    @_scope.$on 'canvas:resize', @_handleResize
    @_scope.$on 'spot:lock', @_handleReserveSpot
    @_scope.$on 'spot:unlock', @_handleUnlockSpot
    @_scope.$on 'spot:save', @_handleDrawingSave

    ###*
     * Spot Handlers for SOCKETS
    ###
    @_LiveCanvasService.on 'spot.updated', (data) =>
      console.log('LiveCanvasService spot.updated', data)
      @_scope.$broadcast 'spot:update', data

    @_LiveCanvasService.on 'spot.reserved', (data) =>
      @_CanvasService.reserveSpot data, @_scope.spots

    @_LiveCanvasService.on 'spot.unreserved', (data) =>
      console.log 'spot.unreserved', data
      @_CanvasService.unreserveSpot data, @_scope.spots

    @_LiveCanvasService.on 'hello', (data) =>
      console.log 'hello from ', data

    ###*
     * Handlers for canvas navigation FUNCTIONS
    ###
    @_scope.refreshCanvas = (props) =>
      @_CanvasService.setCoordinates
        lat: props?.lat ? 0
        long: props?.long  ? 0
      @_getSpots
        height: @_window.innerHeight
        width: @_window.innerWidth

    @_scope.addRowInterval = (opts) =>
      tick = => 
        @_addRow(opts)
      @_scope.stop = $interval( tick, 500)

    @_scope.addColumnInterval = (opts) =>
      tick = => 
        @_addColumn(opts)
      @_scope.stop = $interval( tick, 500)

    @_scope.stopInterval = =>
      if angular.isDefined @_scope.stop 
        $interval.cancel @_scope.stop
        @_scope.stop = undefined

    @_scope.zoomIn = =>
      @_CanvasService.increaseProportions()
      @_scope.refreshCanvas @_scope.getCurrentPosition()
        
    @_scope.zoomOut = =>
      @_CanvasService.decreaseProportions()
      @_scope.refreshCanvas @_scope.getCurrentPosition()

    @_scope.getCurrentPosition = =>
      lat: @_scope.spots.rows[0].tiles[0].x
      long: @_scope.spots.rows[0].tiles[0].y

  _handleDrawingSave: (event, data) =>
    event.stopPropagation()
    console.log 'CanvasController spot:save', data
    @_scope.$broadcast 'spot:update', data
    @_SpotService.saveData data

    @_LiveCanvasService.emit 'spot.update', data

  _handleReserveSpot: (event, data) =>
    event.stopPropagation()
    @_LiveCanvasService.emit 'spot.lock', data  
  
  _handleUnlockSpot: (event, data) =>
    event.stopPropagation()
    @_LiveCanvasService.emit 'spot.unlock', data
    @_scope.$apply =>
      @_CanvasService.unreserveSpot data, @_scope.spots

  _handleResize: (event, data) =>
    event.stopPropagation()
    @_scope.refreshCanvas()

  _getSpots: (props) =>
    @_scope.spots = @_CanvasService.getSpotsForProportions props

  _addRow: (direction) =>
    @_CanvasService.addRow @_scope.spots, direction

  _addColumn: (direction) =>
    @_CanvasService.addColumn @_scope.spots, direction


angular.module('quickstartApp.common.canvas.controllers.CanvasController', [])
  .controller 'CanvasController', CanvasController