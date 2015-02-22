###   
  RequestAborterMixin creates a deffered on current instance for delegating request timeouts
  [ how to use ]

  ##  before constructor    (  current class must have Module as superclass  )
  1.  @include RequestAborterMixin  (if extends Module)  ||   angular.extend @, RequestAborterMixin   (if does not extend Module)
  
  ##  inside constructor 
  2. call @registerPendingRequest to create a deffered on current instance
  
  ##  after constructor 
  3. pass @_aborter to resource timeout config properties
  4. call @killRequest when scope "$destroy" event fires 

###

angular.module('quickstartApp.common.utils.services.RequestAborterMixin', [])
  .factory 'RequestAborterMixin', [ '$q', ($q) -> 
    registerPendingRequest: ->
      @_deferred = $q.defer()
      @_aborter = @_deferred.promise
    killRequest: ->
      @_deferred.resolve()
  ]
  
