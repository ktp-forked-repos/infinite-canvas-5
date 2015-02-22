angular.module('quickstartApp.common.canvas.directives.CanvasDirective', [])
  .directive 'magicCanvas', ($rootScope, $window) ->
    restrict: 'E'
    controller: 'CanvasController'
    templateUrl: 'common/canvas/templates/layout.html'
    link: (scope, elem, attr) ->
      _handleResize = ->
        scope.$emit 'canvas:resize'
        elem.find('.canvas_wrapper').css
          height: $window.innerHeight
          width: $window.innerWidth

      _applyResized = =>
        scope.$apply _handleResize

      _handleResize()

      angular.element($window).bind 'resize', _.throttle _applyResized , 1000