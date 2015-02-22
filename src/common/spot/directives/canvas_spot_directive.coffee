angular.module('quickstartApp.common.spot.directives.CanvasSpotDirective', [])
  .directive 'canvasSpot', ($rootScope, $compile, $modal, $window, BASEHOST) ->
    restrict: 'A'
    link: (scope, elem, attr) ->

      ###*
       * [scope METHODS]
      ###
      scope._listenForDrawing = (event) =>
        event.preventDefault()
        console.log '_listenForDrawing'
        scope.$broadcast 'drawing:save', 
          hPos: scope.spotOpts.x
          vPos: scope.spotOpts.y
          drawingDataUrl: event.data

      scope._openDrawingFrame = (data) =>
        $modal
          title: 'drawing frame'
          show: true
          animation: 'am-fade-and-scale'
          backdropAnimation: 'am-fade'
          contentTemplate: 'common/spot/templates/draw_canvas_frame.html'
          scope: scope

      scope.saveDrawing = (data) =>
        # $window.frames[0].postMessage 'save.frame', 'http://184df69f.ngrok.com'
        $window.frames[0].postMessage 'save.frame', BASEHOST

      scope._unreserveSpot = (data) =>
        scope.$emit 'spot:unlock', data

      scope._reserveSpot = (data) =>
        scope.$emit 'spot:lock', data

      ###*
       * [scope HANDLERS]
      ###
      scope.$on 'modal.show', (event) =>
        event.stopPropagation()
        $window.addEventListener 'message', scope._listenForDrawing
          
      scope.$on 'modal.hide', (event, data) =>
        event.stopPropagation()
        $window.removeEventListener 'message', scope._listenForDrawing
        scope._unreserveSpot scope.spotOpts

      scope.$on 'spot:connect', (event, data) =>
        event.stopPropagation()
        scope.spotOpts = data.spotOpts
        scope._reserveSpot(data.spotOpts)
        scope._openDrawingFrame(data.spotOpts)


      
