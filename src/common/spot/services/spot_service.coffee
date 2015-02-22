angular.module('quickstartApp.common.spot.services.SpotService', [])
  .factory 'SpotService', ($http, BASEURL) ->
    
    saveData: (data) ->
      $http.post "#{BASEURL}/api/spot/", data: data

    getData: (opts) ->
      $http
        url:"#{BASEURL}/api/spot/"
        params: opts
        # cache: true 
