require './controllers/canvas_controller'
require './services/canvas_service'
require './services/live_canvas_service'
require './directives/canvas_directive'

###*
 # @name canvas
###

angular.module 'quickstartApp.common.canvas', [
  'quickstartApp.common.canvas.services.CanvasService'
	'quickstartApp.common.canvas.services.LiveCanvasService'
	'quickstartApp.common.canvas.controllers.CanvasController'
	'quickstartApp.common.canvas.directives.CanvasDirective'
] 
