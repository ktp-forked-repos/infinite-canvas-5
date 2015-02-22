require './controllers/spot_controller'
require './services/spot_service'
require './directives/spot_directive'
require './directives/canvas_spot_directive'
require './directives/drawing_canvas_directive'
###*
 # @name spot
###
angular.module 'quickstartApp.common.spot', [
	'quickstartApp.common.spot.services.SpotService'
	'quickstartApp.common.spot.controllers.SpotController'
  'quickstartApp.common.spot.directives.SpotDirective'
  'quickstartApp.common.spot.directives.CanvasSpotDirective'
	'quickstartApp.common.spot.directives.DrawingCanvasDirective'
] 
