angular.module('quickstartApp.common.spot.directives.SpotDirective', [])
  .directive 'spotTile', ($rootScope) ->
    restrict: 'E'
    scope:
      spotOpts: '='
    controller: 'SpotController'
    templateUrl: 'common/spot/templates/layout.html'
    link: (scope, elem, attr) ->

      elem.bind 'mouseover', ->
        if scope.spotOpts.status is 'free'
          elem.addClass 'hovered'

      elem.bind 'mouseleave', ->
        elem.removeClass 'hovered'
      
      scope.$watch 'spotOpts.status', ( newVal, oldVal ) =>
        if newVal? and newVal isnt oldVal
          switch newVal
            when 'reserved'
              elem.find('.drawing').addClass('connected')
            when 'free'
              elem.find('.drawing').removeClass('connected')

      scope.connectFrame = =>
        # elem.find('.drawing').toggleClass('connected')
        scope.$emit 'spot:connect', 
          scopeRef: scope
          spotOpts: scope.spotOpts
        null

      scope.$on 'free:data', (event, data) =>
        console.log 'free:data', data
        scope.spotOpts.status = 'free'
        
      scope.$on 'draw:data', (event, data) =>
        scope.spotOpts.status = 'drawing'
        event.preventDefault()
        elem.unbind()
        img = new Image()
        img.className = 'drawing'
        img.src = data
        elem.find('.drawing').removeClass('connected')
        elem.find('.drawingCanvas').html(img)
        # elem.find('.drawing').addClass('connected')
