###*
 # Index file 
 ## declare dependency modules
###
require './app/state/index'
require './common/canvas/index'
require './common/spot/index'
require './common/utils/index'

angular
  .module('application', [
    'templates'
    'ngAnimate'
    'ngResource'
    # 'ngMockE2E'
    'lodash'
    'ui.router'
    'btford.socket-io'
    'mgcrea.ngStrap'
    
    'quickstartApp.common.utils'
    'quickstartApp.common.canvas'
    'quickstartApp.common.spot'
    'quickstartApp.state' 

  ])
  # .constant('BASEURL', 'http://localhost:9000')
  # .constant('BASEHOST', 'http://localhost:5000')
  .constant('BASEURL', 'http://5caf19d0.ngrok.com')
  .constant('BASEHOST', 'http://56167789.ngrok.com')
