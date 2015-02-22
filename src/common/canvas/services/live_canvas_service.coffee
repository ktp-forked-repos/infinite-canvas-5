angular.module('quickstartApp.common.canvas.services.LiveCanvasService', [])
  .factory 'LiveCanvasService', ['socketFactory' , 'BASEURL', (socketFactory, BASEURL) ->
    ioSocket = io.connect "#{BASEURL}/LiveCanvas"
    randomRoomSocket = socketFactory
      ioSocket: ioSocket
    return randomRoomSocket
  ]
