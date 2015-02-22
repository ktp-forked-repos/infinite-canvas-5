###*
 # Index file 
 ## declare dependency modules
###
require './app/state/index'
require './common/canvas/index'
require './common/spot/index'
require './common/utils/index'
config = require './config.json'

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
  .constant('BASEURL', config.baseurl)
  .constant('BASEHOST', config.basehost)
