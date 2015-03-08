angular.module('quickstartApp.common.canvas.services.LiveCanvasService', [])
  .factory 'LiveCanvasService', ['socketFactory' , 'BASEHOST', (socketFactory, BASEHOST) ->
    ioSocket = io.connect "#{BASEHOST}/LiveCanvas"
    randomRoomSocket = socketFactory
      ioSocket: ioSocket
    return randomRoomSocket
  ]
