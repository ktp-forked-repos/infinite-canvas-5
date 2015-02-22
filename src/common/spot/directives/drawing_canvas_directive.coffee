angular.module('quickstartApp.common.spot.directives.DrawingCanvasDirective', [])
  .directive 'drawingCanvas', ($rootScope, $compile, $window) ->
    restrict: 'E'
    # template: '''<div><canvas id="drawingCanvas" width="500" height="700"> </canvas></div>'''
    template: '''<div><iframe class="drawingCanvasFrame" width="550" height="711" src="harmony_canvas/index.html"> </iframe></div>'''
    link: (scope, elem, attr) ->
      
      scope._initDrawingPad = =>
        iWindow = elem.find('.drawingCanvasFrame')        
        console.log 'contextWindow', angular.element(iWindow)[0]
        console.log 'contextWindow', angular.element(iWindow).contentWindow

      scope._initDrawingPad()
