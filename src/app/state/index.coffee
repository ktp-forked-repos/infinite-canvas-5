require './controllers/state_controller'
###*
 # # quickstartApp / state
###
angular.module('quickstartApp.state', [
  'quickstartApp.state.controllers.StateController'
]).config ($stateProvider) ->
  $stateProvider
    .state 'myState',
      url: '/'
      templateUrl: 'app/state/templates/layout.html'
      controller: 'StateController' 
