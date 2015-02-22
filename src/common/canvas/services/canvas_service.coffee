angular.module('quickstartApp.common.canvas.services.CanvasService', [])
  .service 'CanvasService', class Canvas
    _Proportions:
      width: 150
      height: 194
    _coordonates: 
      lat: 0
      long: 0

    increaseProportions: =>
      @_Proportions.width += 10
      @_Proportions.height += 14

    decreaseProportions: =>
      @_Proportions.width -= 15
      @_Proportions.height -= 21

    reserveSpot: (spot, spots) =>
      for row in spots.rows
        for tile in row.tiles
          if tile.y is spot.y and tile.x is spot.x
            tile.status = 'reserved'

    unreserveSpot: (spot, spots) =>
      console.log 'CanvasService', spot, spots
      for row in spots.rows
        for tile in row.tiles
          if tile.y is spot.y and tile.x is spot.x
            tile.status = 'free'

    addRow: (spots, direction) =>
      console.log spots, direction
      if direction is 'up'
          spots.rows.unshift
            tiles: _.map _.first(spots.rows).tiles, (tile,i) =>
              y: tile.y-1
              x: tile.x
              height: @_Proportions.height
              width: @_Proportions.width
          spots.rows.pop()
      if direction is 'down'
          spots.rows.push
            tiles: _.map _.last(spots.rows).tiles, (tile,i) =>
              y: tile.y+1
              x: tile.x
              height: @_Proportions.height
              width: @_Proportions.width
          spots.rows.shift()

    addColumn: (spots, direction) =>
      if direction is 'right'
        _.map spots.rows, (row,i) =>
          row.tiles.push
            x: _.last(row.tiles).x+1
            y: _.first(row.tiles).y
            height: @_Proportions.height
            width: @_Proportions.width
          row.tiles.shift()
      else if direction is 'left'
        _.map spots.rows, (row,i) =>
          row.tiles.unshift
            x: _.first(row.tiles).x-1
            y: _.first(row.tiles).y
            height: @_Proportions.height
            width: @_Proportions.width
          row.tiles.pop()

    setCoordinates: (props) =>
      @_coordonates.lat = props.lat
      @_coordonates.long = props.long

    getSpotsForProportions: (props) =>
      # rows = 10
      # tilesPerRow = 20
      rows = Math.floor(props.height / @_Proportions.height)
      tilesPerRow = Math.floor(props.width / @_Proportions.width)
      rows: for i in [@_coordonates.long...@_coordonates.long+rows]
        tiles: for j in [@_coordonates.lat...@_coordonates.lat+tilesPerRow]
          x: j
          y: i
          height: @_Proportions.height
          width: @_Proportions.width
          status: 'loading'
