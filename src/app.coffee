require './index'

###*
 # # Quickstart Application
###
class MainApplication

  constructor: ->
    $(document).ready ->
      angular.bootstrap document, ['quickstartApp'],
        strictDi: true

  run: -> ['$rootScope', '$state', '$httpBackend', ( $rootScope, $state, $httpBackend ) ->
    $rootScope.$state = $state
    
    $rootScope.$on '$stateChangeStart', (event, toState, toParams, fromState, fromParams) =>
      # console.log(event, toState, toParams, fromState, fromParams) 
    $rootScope.$on '$stateChangeError', (event, toState, toParams, fromState, fromParams, error) ->
      console.error(event, toState, toParams, fromState, fromParams) 
    
  ]

  config: -> [ '$urlRouterProvider', '$provide', ($urlRouterProvider, $provide) ->
    
    $urlRouterProvider
      .otherwise '/'
    $provide.decorator '$exceptionHandler', [ '$delegate', ($delegate) ->
      (exception, cause) ->
        $delegate exception, cause
        errorData =
          exception: exception,
          cause: cause
        #### @TODO PROVIDE PROPPER HANDLING AND LOGGING
        console.error '$exceptionHandler::ERROR:', exception.msg, errorData
    ]
  ]

app = new MainApplication()

angular
  .module('quickstartApp',['application']).config( app.config() ).run app.run()

