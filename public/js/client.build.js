(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MainApplication, app;

require('./index');


/**
  * # Quickstart Application
 */

MainApplication = (function() {
  function MainApplication() {
    $(document).ready(function() {
      return angular.bootstrap(document, ['quickstartApp'], {
        strictDi: true
      });
    });
  }

  MainApplication.prototype.run = function() {
    return [
      '$rootScope', '$state', '$httpBackend', function($rootScope, $state, $httpBackend) {
        $rootScope.$state = $state;
        $rootScope.$on('$stateChangeStart', (function(_this) {
          return function(event, toState, toParams, fromState, fromParams) {};
        })(this));
        return $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
          return console.error(event, toState, toParams, fromState, fromParams);
        });
      }
    ];
  };

  MainApplication.prototype.config = function() {
    return [
      '$urlRouterProvider', '$provide', function($urlRouterProvider, $provide) {
        $urlRouterProvider.otherwise('/');
        return $provide.decorator('$exceptionHandler', [
          '$delegate', function($delegate) {
            return function(exception, cause) {
              var errorData;
              $delegate(exception, cause);
              errorData = {
                exception: exception,
                cause: cause
              };
              return console.error('$exceptionHandler::ERROR:', exception.msg, errorData);
            };
          }
        ]);
      }
    ];
  };

  return MainApplication;

})();

app = new MainApplication();

angular.module('quickstartApp', ['application']).config(app.config()).run(app.run());



},{"./index":20}],2:[function(require,module,exports){

/**
  * @ngdoc controller
  * @name StateController
 */
var StateController;

StateController = (function() {
  StateController.$inject = ['$scope'];

  function StateController($scope) {
    this.$scope = $scope;
  }

  return StateController;

})();

angular.module('quickstartApp.state.controllers.StateController', []).controller('StateController', StateController);



},{}],3:[function(require,module,exports){
require('./controllers/state_controller');


/**
  * # quickstartApp / state
 */

angular.module('quickstartApp.state', ['quickstartApp.state.controllers.StateController']).config(["$stateProvider", function($stateProvider) {
  return $stateProvider.state('myState', {
    url: '/',
    templateUrl: 'app/state/templates/layout.html',
    controller: 'StateController'
  });
}]);



},{"./controllers/state_controller":2}],4:[function(require,module,exports){

/**
  *  CanvasController
 */
var CanvasController,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

CanvasController = (function() {
  CanvasController.$inject = ['$scope', 'CanvasService', 'SpotService', 'LiveCanvasService', '$interval', '$window'];

  function CanvasController(_scope, _CanvasService, _SpotService, _LiveCanvasService, $interval, _window) {
    this._scope = _scope;
    this._CanvasService = _CanvasService;
    this._SpotService = _SpotService;
    this._LiveCanvasService = _LiveCanvasService;
    this._window = _window;
    this._addColumn = bind(this._addColumn, this);
    this._addRow = bind(this._addRow, this);
    this._getSpots = bind(this._getSpots, this);
    this._handleResize = bind(this._handleResize, this);
    this._handleUnlockSpot = bind(this._handleUnlockSpot, this);
    this._handleReserveSpot = bind(this._handleReserveSpot, this);
    this._handleDrawingSave = bind(this._handleDrawingSave, this);
    this._scope.stop = void 0;

    /**
     * Handlers for scope EVENTS
     */
    this._scope.$on('canvas:resize', this._handleResize);
    this._scope.$on('spot:lock', this._handleReserveSpot);
    this._scope.$on('spot:unlock', this._handleUnlockSpot);
    this._scope.$on('spot:save', this._handleDrawingSave);

    /**
     * Spot Handlers for SOCKETS
     */
    this._LiveCanvasService.on('spot.updated', (function(_this) {
      return function(data) {
        console.log('LiveCanvasService spot.updated', data);
        return _this._scope.$broadcast('spot:update', data);
      };
    })(this));
    this._LiveCanvasService.on('spot.reserved', (function(_this) {
      return function(data) {
        return _this._CanvasService.reserveSpot(data, _this._scope.spots);
      };
    })(this));
    this._LiveCanvasService.on('spot.unreserved', (function(_this) {
      return function(data) {
        console.log('spot.unreserved', data);
        return _this._CanvasService.unreserveSpot(data, _this._scope.spots);
      };
    })(this));
    this._LiveCanvasService.on('hello', (function(_this) {
      return function(data) {
        return console.log('hello from ', data);
      };
    })(this));

    /**
     * Handlers for canvas navigation FUNCTIONS
     */
    this._scope.refreshCanvas = (function(_this) {
      return function(props) {
        var ref, ref1;
        _this._CanvasService.setCoordinates({
          lat: (ref = props != null ? props.lat : void 0) != null ? ref : 0,
          long: (ref1 = props != null ? props.long : void 0) != null ? ref1 : 0
        });
        return _this._getSpots({
          height: _this._window.innerHeight,
          width: _this._window.innerWidth
        });
      };
    })(this);
    this._scope.addRowInterval = (function(_this) {
      return function(opts) {
        var tick;
        tick = function() {
          return _this._addRow(opts);
        };
        return _this._scope.stop = $interval(tick, 500);
      };
    })(this);
    this._scope.addColumnInterval = (function(_this) {
      return function(opts) {
        var tick;
        tick = function() {
          return _this._addColumn(opts);
        };
        return _this._scope.stop = $interval(tick, 500);
      };
    })(this);
    this._scope.stopInterval = (function(_this) {
      return function() {
        if (angular.isDefined(_this._scope.stop)) {
          $interval.cancel(_this._scope.stop);
          return _this._scope.stop = void 0;
        }
      };
    })(this);
    this._scope.zoomIn = (function(_this) {
      return function() {
        _this._CanvasService.increaseProportions();
        return _this._scope.refreshCanvas(_this._scope.getCurrentPosition());
      };
    })(this);
    this._scope.zoomOut = (function(_this) {
      return function() {
        _this._CanvasService.decreaseProportions();
        return _this._scope.refreshCanvas(_this._scope.getCurrentPosition());
      };
    })(this);
    this._scope.getCurrentPosition = (function(_this) {
      return function() {
        return {
          lat: _this._scope.spots.rows[0].tiles[0].x,
          long: _this._scope.spots.rows[0].tiles[0].y
        };
      };
    })(this);
  }

  CanvasController.prototype._handleDrawingSave = function(event, data) {
    event.stopPropagation();
    console.log('CanvasController spot:save', data);
    this._scope.$broadcast('spot:update', data);
    this._SpotService.saveData(data);
    return this._LiveCanvasService.emit('spot.update', data);
  };

  CanvasController.prototype._handleReserveSpot = function(event, data) {
    event.stopPropagation();
    return this._LiveCanvasService.emit('spot.lock', data);
  };

  CanvasController.prototype._handleUnlockSpot = function(event, data) {
    event.stopPropagation();
    this._LiveCanvasService.emit('spot.unlock', data);
    return this._scope.$apply((function(_this) {
      return function() {
        return _this._CanvasService.unreserveSpot(data, _this._scope.spots);
      };
    })(this));
  };

  CanvasController.prototype._handleResize = function(event, data) {
    event.stopPropagation();
    return this._scope.refreshCanvas();
  };

  CanvasController.prototype._getSpots = function(props) {
    return this._scope.spots = this._CanvasService.getSpotsForProportions(props);
  };

  CanvasController.prototype._addRow = function(direction) {
    return this._CanvasService.addRow(this._scope.spots, direction);
  };

  CanvasController.prototype._addColumn = function(direction) {
    return this._CanvasService.addColumn(this._scope.spots, direction);
  };

  return CanvasController;

})();

angular.module('quickstartApp.common.canvas.controllers.CanvasController', []).controller('CanvasController', CanvasController);



},{}],5:[function(require,module,exports){
angular.module('quickstartApp.common.canvas.directives.CanvasDirective', []).directive('magicCanvas', ["$rootScope", "$window", function($rootScope, $window) {
  return {
    restrict: 'E',
    controller: 'CanvasController',
    templateUrl: 'common/canvas/templates/layout.html',
    link: function(scope, elem, attr) {
      var _applyResized, _handleResize;
      _handleResize = function() {
        scope.$emit('canvas:resize');
        return elem.find('.canvas_wrapper').css({
          height: $window.innerHeight,
          width: $window.innerWidth
        });
      };
      _applyResized = (function(_this) {
        return function() {
          return scope.$apply(_handleResize);
        };
      })(this);
      _handleResize();
      return angular.element($window).bind('resize', _.throttle(_applyResized, 1000));
    }
  };
}]);



},{}],6:[function(require,module,exports){
require('./controllers/canvas_controller');

require('./services/canvas_service');

require('./services/live_canvas_service');

require('./directives/canvas_directive');


/**
  * @name canvas
 */

angular.module('quickstartApp.common.canvas', ['quickstartApp.common.canvas.services.CanvasService', 'quickstartApp.common.canvas.services.LiveCanvasService', 'quickstartApp.common.canvas.controllers.CanvasController', 'quickstartApp.common.canvas.directives.CanvasDirective']);



},{"./controllers/canvas_controller":4,"./directives/canvas_directive":5,"./services/canvas_service":7,"./services/live_canvas_service":8}],7:[function(require,module,exports){
var Canvas,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular.module('quickstartApp.common.canvas.services.CanvasService', []).service('CanvasService', Canvas = (function() {
  function Canvas() {
    this.getSpotsForProportions = bind(this.getSpotsForProportions, this);
    this.setCoordinates = bind(this.setCoordinates, this);
    this.addColumn = bind(this.addColumn, this);
    this.addRow = bind(this.addRow, this);
    this.unreserveSpot = bind(this.unreserveSpot, this);
    this.reserveSpot = bind(this.reserveSpot, this);
    this.decreaseProportions = bind(this.decreaseProportions, this);
    this.increaseProportions = bind(this.increaseProportions, this);
  }

  Canvas.prototype._Proportions = {
    width: 150,
    height: 194
  };

  Canvas.prototype._coordonates = {
    lat: 0,
    long: 0
  };

  Canvas.prototype.increaseProportions = function() {
    this._Proportions.width += 10;
    return this._Proportions.height += 14;
  };

  Canvas.prototype.decreaseProportions = function() {
    this._Proportions.width -= 15;
    return this._Proportions.height -= 21;
  };

  Canvas.prototype.reserveSpot = function(spot, spots) {
    var k, len, ref, results, row, tile;
    ref = spots.rows;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      row = ref[k];
      results.push((function() {
        var l, len1, ref1, results1;
        ref1 = row.tiles;
        results1 = [];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          tile = ref1[l];
          if (tile.y === spot.y && tile.x === spot.x) {
            results1.push(tile.status = 'reserved');
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      })());
    }
    return results;
  };

  Canvas.prototype.unreserveSpot = function(spot, spots) {
    var k, len, ref, results, row, tile;
    console.log('CanvasService', spot, spots);
    ref = spots.rows;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      row = ref[k];
      results.push((function() {
        var l, len1, ref1, results1;
        ref1 = row.tiles;
        results1 = [];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          tile = ref1[l];
          if (tile.y === spot.y && tile.x === spot.x) {
            results1.push(tile.status = 'free');
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      })());
    }
    return results;
  };

  Canvas.prototype.addRow = function(spots, direction) {
    console.log(spots, direction);
    if (direction === 'up') {
      spots.rows.unshift({
        tiles: _.map(_.first(spots.rows).tiles, (function(_this) {
          return function(tile, i) {
            return {
              y: tile.y - 1,
              x: tile.x,
              height: _this._Proportions.height,
              width: _this._Proportions.width
            };
          };
        })(this))
      });
      spots.rows.pop();
    }
    if (direction === 'down') {
      spots.rows.push({
        tiles: _.map(_.last(spots.rows).tiles, (function(_this) {
          return function(tile, i) {
            return {
              y: tile.y + 1,
              x: tile.x,
              height: _this._Proportions.height,
              width: _this._Proportions.width
            };
          };
        })(this))
      });
      return spots.rows.shift();
    }
  };

  Canvas.prototype.addColumn = function(spots, direction) {
    if (direction === 'right') {
      return _.map(spots.rows, (function(_this) {
        return function(row, i) {
          row.tiles.push({
            x: _.last(row.tiles).x + 1,
            y: _.first(row.tiles).y,
            height: _this._Proportions.height,
            width: _this._Proportions.width
          });
          return row.tiles.shift();
        };
      })(this));
    } else if (direction === 'left') {
      return _.map(spots.rows, (function(_this) {
        return function(row, i) {
          row.tiles.unshift({
            x: _.first(row.tiles).x - 1,
            y: _.first(row.tiles).y,
            height: _this._Proportions.height,
            width: _this._Proportions.width
          });
          return row.tiles.pop();
        };
      })(this));
    }
  };

  Canvas.prototype.setCoordinates = function(props) {
    this._coordonates.lat = props.lat;
    return this._coordonates.long = props.long;
  };

  Canvas.prototype.getSpotsForProportions = function(props) {
    var i, j, rows, tilesPerRow;
    rows = Math.floor(props.height / this._Proportions.height);
    tilesPerRow = Math.floor(props.width / this._Proportions.width);
    return {
      rows: (function() {
        var k, ref, ref1, results;
        results = [];
        for (i = k = ref = this._coordonates.long, ref1 = this._coordonates.long + rows; ref <= ref1 ? k < ref1 : k > ref1; i = ref <= ref1 ? ++k : --k) {
          results.push({
            tiles: (function() {
              var l, ref2, ref3, results1;
              results1 = [];
              for (j = l = ref2 = this._coordonates.lat, ref3 = this._coordonates.lat + tilesPerRow; ref2 <= ref3 ? l < ref3 : l > ref3; j = ref2 <= ref3 ? ++l : --l) {
                results1.push({
                  x: j,
                  y: i,
                  height: this._Proportions.height,
                  width: this._Proportions.width,
                  status: 'loading'
                });
              }
              return results1;
            }).call(this)
          });
        }
        return results;
      }).call(this)
    };
  };

  return Canvas;

})());



},{}],8:[function(require,module,exports){
angular.module('quickstartApp.common.canvas.services.LiveCanvasService', []).factory('LiveCanvasService', [
  'socketFactory', 'BASEURL', function(socketFactory, BASEURL) {
    var ioSocket, randomRoomSocket;
    ioSocket = io.connect(BASEURL + "/LiveCanvas");
    randomRoomSocket = socketFactory({
      ioSocket: ioSocket
    });
    return randomRoomSocket;
  }
]);



},{}],9:[function(require,module,exports){

/**
  *  SpotController
 */
var SpotController,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

SpotController = (function() {
  SpotController.$inject = ['$scope', 'SpotService'];

  function SpotController(_scope, _SpotService) {
    this._scope = _scope;
    this._SpotService = _SpotService;
    this._getData = bind(this._getData, this);
    this._scope.data = this._getData();
    this._scope.$on('drawing:save', (function(_this) {
      return function(event, data) {
        console.log('spotControler drawing:save', data);
        return _this._scope.$emit('spot:save', data);
      };
    })(this));
    this._scope.$on('spot:update', (function(_this) {
      return function(event, data) {
        if (data.hPos === _this._scope.spotOpts.x && data.vPos === _this._scope.spotOpts.y) {
          console.log('spotControler spot:updated', data);
          return _this._scope.$broadcast('draw:data', data.drawingDataUrl);
        }
      };
    })(this));
    this._scope.data.then((function(_this) {
      return function(res) {
        var ref;
        if ((ref = res.data) != null ? ref.drawingDataUrl : void 0) {
          return _this._scope.$broadcast('draw:data', res.data.drawingDataUrl);
        } else {
          return _this._scope.$broadcast('free:data', res);
        }
      };
    })(this));
  }

  SpotController.prototype._getData = function() {
    return this._SpotService.getData({
      hPos: this._scope.spotOpts.x,
      vPos: this._scope.spotOpts.y
    });
  };

  return SpotController;

})();

angular.module('quickstartApp.common.spot.controllers.SpotController', []).controller('SpotController', SpotController);



},{}],10:[function(require,module,exports){
angular.module('quickstartApp.common.spot.directives.CanvasSpotDirective', []).directive('canvasSpot', ["$rootScope", "$compile", "$modal", "$window", "BASEHOST", function($rootScope, $compile, $modal, $window, BASEHOST) {
  return {
    restrict: 'A',
    link: function(scope, elem, attr) {

      /**
       * [scope METHODS]
       */
      scope._listenForDrawing = (function(_this) {
        return function(event) {
          event.preventDefault();
          console.log('_listenForDrawing');
          return scope.$broadcast('drawing:save', {
            hPos: scope.spotOpts.x,
            vPos: scope.spotOpts.y,
            drawingDataUrl: event.data
          });
        };
      })(this);
      scope._openDrawingFrame = (function(_this) {
        return function(data) {
          return $modal({
            title: 'drawing frame',
            show: true,
            animation: 'am-fade-and-scale',
            backdropAnimation: 'am-fade',
            contentTemplate: 'common/spot/templates/draw_canvas_frame.html',
            scope: scope
          });
        };
      })(this);
      scope.saveDrawing = (function(_this) {
        return function(data) {
          return $window.frames[0].postMessage('save.frame', BASEHOST);
        };
      })(this);
      scope._unreserveSpot = (function(_this) {
        return function(data) {
          return scope.$emit('spot:unlock', data);
        };
      })(this);
      scope._reserveSpot = (function(_this) {
        return function(data) {
          return scope.$emit('spot:lock', data);
        };
      })(this);

      /**
       * [scope HANDLERS]
       */
      scope.$on('modal.show', (function(_this) {
        return function(event) {
          event.stopPropagation();
          return $window.addEventListener('message', scope._listenForDrawing);
        };
      })(this));
      scope.$on('modal.hide', (function(_this) {
        return function(event, data) {
          event.stopPropagation();
          $window.removeEventListener('message', scope._listenForDrawing);
          return scope._unreserveSpot(scope.spotOpts);
        };
      })(this));
      return scope.$on('spot:connect', (function(_this) {
        return function(event, data) {
          event.stopPropagation();
          scope.spotOpts = data.spotOpts;
          scope._reserveSpot(data.spotOpts);
          return scope._openDrawingFrame(data.spotOpts);
        };
      })(this));
    }
  };
}]);



},{}],11:[function(require,module,exports){
angular.module('quickstartApp.common.spot.directives.DrawingCanvasDirective', []).directive('drawingCanvas', ["$rootScope", "$compile", "$window", function($rootScope, $compile, $window) {
  return {
    restrict: 'E',
    template: '<div><iframe class="drawingCanvasFrame" width="550" height="711" src="harmony_canvas/index.html"> </iframe></div>',
    link: function(scope, elem, attr) {
      scope._initDrawingPad = (function(_this) {
        return function() {
          var iWindow;
          return iWindow = elem.find('.drawingCanvasFrame');
        };
      })(this);
      return scope._initDrawingPad();
    }
  };
}]);



},{}],12:[function(require,module,exports){
angular.module('quickstartApp.common.spot.directives.SpotDirective', []).directive('spotTile', ["$rootScope", function($rootScope) {
  return {
    restrict: 'E',
    scope: {
      spotOpts: '='
    },
    controller: 'SpotController',
    templateUrl: 'common/spot/templates/layout.html',
    link: function(scope, elem, attr) {
      elem.bind('mouseover', function() {
        if (scope.spotOpts.status === 'free') {
          return elem.addClass('hovered');
        }
      });
      elem.bind('mouseleave', function() {
        return elem.removeClass('hovered');
      });
      scope.$watch('spotOpts.status', (function(_this) {
        return function(newVal, oldVal) {
          if ((newVal != null) && newVal !== oldVal) {
            switch (newVal) {
              case 'reserved':
                return elem.find('.drawing').addClass('connected');
              case 'free':
                return elem.find('.drawing').removeClass('connected');
            }
          }
        };
      })(this));
      scope.connectFrame = (function(_this) {
        return function() {
          scope.$emit('spot:connect', {
            scopeRef: scope,
            spotOpts: scope.spotOpts
          });
          return null;
        };
      })(this);
      scope.$on('free:data', (function(_this) {
        return function(event, data) {
          console.log('free:data', data);
          return scope.spotOpts.status = 'free';
        };
      })(this));
      return scope.$on('draw:data', (function(_this) {
        return function(event, data) {
          var img;
          scope.spotOpts.status = 'drawing';
          event.preventDefault();
          elem.unbind();
          img = new Image();
          img.className = 'drawing';
          img.src = data;
          elem.find('.drawing').removeClass('connected');
          return elem.find('.drawingCanvas').html(img);
        };
      })(this));
    }
  };
}]);



},{}],13:[function(require,module,exports){
require('./controllers/spot_controller');

require('./services/spot_service');

require('./directives/spot_directive');

require('./directives/canvas_spot_directive');

require('./directives/drawing_canvas_directive');


/**
  * @name spot
 */

angular.module('quickstartApp.common.spot', ['quickstartApp.common.spot.services.SpotService', 'quickstartApp.common.spot.controllers.SpotController', 'quickstartApp.common.spot.directives.SpotDirective', 'quickstartApp.common.spot.directives.CanvasSpotDirective', 'quickstartApp.common.spot.directives.DrawingCanvasDirective']);



},{"./controllers/spot_controller":9,"./directives/canvas_spot_directive":10,"./directives/drawing_canvas_directive":11,"./directives/spot_directive":12,"./services/spot_service":14}],14:[function(require,module,exports){
angular.module('quickstartApp.common.spot.services.SpotService', []).factory('SpotService', ["$http", "BASEURL", function($http, BASEURL) {
  return {
    saveData: function(data) {
      return $http.post(BASEURL + "/api/spot/", {
        data: data
      });
    },
    getData: function(opts) {
      return $http({
        url: BASEURL + "/api/spot/",
        params: opts
      });
    }
  };
}]);



},{}],15:[function(require,module,exports){
require('./services/module_extension');

require('./services/observable_mixin');

require('./services/request_aborter_service');

angular.module('quickstartApp.common.utils', ['quickstartApp.common.utils.services.Module', 'quickstartApp.common.utils.services.ObservableMixin', 'quickstartApp.common.utils.services.RequestAborterMixin']);



},{"./services/module_extension":16,"./services/observable_mixin":17,"./services/request_aborter_service":18}],16:[function(require,module,exports){

/*
    An object that adds extra functionality to a basic class
 */
angular.module('quickstartApp.common.utils.services.Module', []).factory('Module', function() {
  var Module;
  return Module = (function() {
    function Module() {}


    /*
        Attaches every property of the obj directly on the function constructor
    
        @param [Object] obj and object representing the extension properties
     */

    Module.extend = function(obj) {
      var key, ref, value;
      for (key in obj) {
        value = obj[key];
        if (key !== 'extend' && key !== 'include') {
          this[key] = value;
        }
      }
      if ((ref = obj.extended) != null) {
        ref.apply(this);
      }
      return this;
    };


    /*
        Attaches every property of the obj to the
        prototype of the function constructor
    
        @param [Object] obj an object representing the included properties
        @param [Function] decorator a decorator function applied
        for every property's value
     */

    Module.include = function(obj, decorator) {
      var key, ref, value;
      for (key in obj) {
        value = obj[key];
        if (!(key !== 'extend' && key !== 'include')) {
          continue;
        }
        if (decorator && typeof value === 'Function') {
          value = decorator(value);
        }
        this.prototype[key] = value;
      }
      if ((ref = obj.included) != null) {
        ref.apply(this);
      }
      return this;
    };

    return Module;

  })();
});



},{}],17:[function(require,module,exports){

/*
    Given a list of callback functions it iterates through it
    and calls each function alongside the passed arguments

    Thanks to Jeremy Ashkenas @see https://github.com/jashkenas/backbone/

    @param [Array] callbacks the list of callback functions to be called
    @param [Array] args the arguments array passed to EventBus::trigger
 */
var ObservableMixin, triggerEventCallbacks,
  slice = [].slice;

triggerEventCallbacks = function(callbacks, args) {
  var a1, a2, a3, cbLen, i, ref, results, results1, results2, results3, results4;
  ref = [args[0], args[1], args[2]], a1 = ref[0], a2 = ref[1], a3 = ref[2];
  cbLen = (callbacks != null ? callbacks.length : void 0) || 0;
  i = -1;
  switch (args.length) {
    case 0:
      results = [];
      while (++i < cbLen) {
        results.push(callbacks[i].cb.call(callbacks[i].ctx));
      }
      return results;
      break;
    case 1:
      results1 = [];
      while (++i < cbLen) {
        results1.push(callbacks[i].cb.call(callbacks[i].ctx, a1));
      }
      return results1;
      break;
    case 2:
      results2 = [];
      while (++i < cbLen) {
        results2.push(callbacks[i].cb.call(callbacks[i].ctx, a1, a2));
      }
      return results2;
      break;
    case 3:
      results3 = [];
      while (++i < cbLen) {
        results3.push(callbacks[i].cb.call(callbacks[i].ctx, a1, a2, a3));
      }
      return results3;
      break;
    default:
      results4 = [];
      while (++i < cbLen) {
        results4.push(callbacks[i].cb.apply(callbacks[i].ctx, args));
      }
      return results4;
  }
};


/*
    Dispatching mechanism for centralizing application-wide events

    The internal structure of the event list looks like this:
        events = {
            callbacks: [{cb, ctx}, {cb, ctx}, ...]
        }
    where each object corresponding to the "eventName" array,
    represents a set containing a callback and a context
 */

ObservableMixin = {

  /*
      Attaches an event to a callback
  
      @param [String] event the name of the event it will monitor
      @param [Function] fn the callback function triggered for event
      @param [Object] ctx Context in which the callback function will be called
  
      @return [EventBus]
   */
  on: function(event, cb, ctx) {
    var base;
    if (typeof cb === 'function' && typeof event === 'string') {
      if (this._events == null) {
        this._events = {};
      }
      if ((base = this._events)[event] == null) {
        base[event] = [];
      }
      this._events[event].push({
        cb: cb,
        ctx: ctx
      });
    }
    return this;
  },

  /*
      Removes a callback function for a given event and
      deletes the event if the callback list becomes empty
  
      @param [String] event the name of the event
      @param [Function] fn the callback to be removed from the callback list
   */
  off: function(event, cb) {
    var callback, callbackList, i, j, len, ref, retain;
    callbackList = (ref = this._events) != null ? ref[event] : void 0;
    if (event && cb && (callbackList != null ? callbackList.length : void 0)) {
      this._events[event] = retain = [];
      for (i = j = 0, len = callbackList.length; j < len; i = ++j) {
        callback = callbackList[i];
        if (callback.cb !== cb) {
          retain.push(callback);
        }
      }
      if (retain.length) {
        this._events[event] = retain;
      } else {
        delete this._events[event];
      }

      /*
          Check made to remove all the callbacks for the event
          if there was no callback specified
       */
    } else if (event && typeof cb === 'undefined' && (callbackList != null ? callbackList.length : void 0)) {
      delete this._events[event];
    }
    return this;
  },

  /*
      Triggers the event specified and calls the
      attached callback functions
  
      @param [String] event the name of the event that will be triggered
   */
  trigger: function() {
    var allCallbacks, args, event, eventCallbacks, ref, ref1, tmpArgs;
    event = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    eventCallbacks = (ref = this._events) != null ? ref[event] : void 0;
    allCallbacks = (ref1 = this._events) != null ? ref1.all : void 0;
    if (event && eventCallbacks || allCallbacks) {
      if (eventCallbacks != null ? eventCallbacks.length : void 0) {
        triggerEventCallbacks(eventCallbacks, args);
      }
      if (allCallbacks != null ? allCallbacks.length : void 0) {
        tmpArgs = args;
        tmpArgs.unshift(event);
        triggerEventCallbacks(allCallbacks, tmpArgs);
      }
    }
    return this;
  }
};

angular.module('quickstartApp.common.utils.services.ObservableMixin', []).factory('ObservableMixin', function() {
  return ObservableMixin;
});



},{}],18:[function(require,module,exports){

/*   
  RequestAborterMixin creates a deffered on current instance for delegating request timeouts
  [ how to use ]

  ##  before constructor    (  current class must have Module as superclass  )
  1.  @include RequestAborterMixin  (if extends Module)  ||   angular.extend @, RequestAborterMixin   (if does not extend Module)
  
  ##  inside constructor 
  2. call @registerPendingRequest to create a deffered on current instance
  
  ##  after constructor 
  3. pass @_aborter to resource timeout config properties
  4. call @killRequest when scope "$destroy" event fires
 */
angular.module('quickstartApp.common.utils.services.RequestAborterMixin', []).factory('RequestAborterMixin', [
  '$q', function($q) {
    return {
      registerPendingRequest: function() {
        this._deferred = $q.defer();
        return this._aborter = this._deferred.promise;
      },
      killRequest: function() {
        return this._deferred.resolve();
      }
    };
  }
]);



},{}],19:[function(require,module,exports){
module.exports={"baseurl":"http://localhost:5000","basehost":"http://localhost:3000"}
},{}],20:[function(require,module,exports){

/**
  * Index file 
 ## declare dependency modules
 */
var config;

require('./app/state/index');

require('./common/canvas/index');

require('./common/spot/index');

require('./common/utils/index');

config = require('./config.json');

angular.module('application', ['templates', 'ngAnimate', 'ngResource', 'lodash', 'ui.router', 'btford.socket-io', 'mgcrea.ngStrap', 'quickstartApp.common.utils', 'quickstartApp.common.canvas', 'quickstartApp.common.spot', 'quickstartApp.state']).constant('BASEURL', config.baseurl).constant('BASEHOST', config.basehost);



},{"./app/state/index":3,"./common/canvas/index":6,"./common/spot/index":13,"./common/utils/index":15,"./config.json":19}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxpbmZpbml0ZS1jYW52YXNcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImQ6XFxpbmZpbml0ZS1jYW52YXNcXHNyY1xcYXBwLmNvZmZlZSIsImQ6XFxpbmZpbml0ZS1jYW52YXNcXHNyY1xcYXBwXFxzdGF0ZVxcY29udHJvbGxlcnNcXHN0YXRlX2NvbnRyb2xsZXIuY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxhcHBcXHN0YXRlXFxpbmRleC5jb2ZmZWUiLCJkOlxcaW5maW5pdGUtY2FudmFzXFxzcmNcXGNvbW1vblxcY2FudmFzXFxjb250cm9sbGVyc1xcY2FudmFzX2NvbnRyb2xsZXIuY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxjb21tb25cXGNhbnZhc1xcZGlyZWN0aXZlc1xcY2FudmFzX2RpcmVjdGl2ZS5jb2ZmZWUiLCJkOlxcaW5maW5pdGUtY2FudmFzXFxzcmNcXGNvbW1vblxcY2FudmFzXFxpbmRleC5jb2ZmZWUiLCJkOlxcaW5maW5pdGUtY2FudmFzXFxzcmNcXGNvbW1vblxcY2FudmFzXFxzZXJ2aWNlc1xcY2FudmFzX3NlcnZpY2UuY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxjb21tb25cXGNhbnZhc1xcc2VydmljZXNcXGxpdmVfY2FudmFzX3NlcnZpY2UuY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxjb21tb25cXHNwb3RcXGNvbnRyb2xsZXJzXFxzcG90X2NvbnRyb2xsZXIuY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxjb21tb25cXHNwb3RcXGRpcmVjdGl2ZXNcXGNhbnZhc19zcG90X2RpcmVjdGl2ZS5jb2ZmZWUiLCJkOlxcaW5maW5pdGUtY2FudmFzXFxzcmNcXGNvbW1vblxcc3BvdFxcZGlyZWN0aXZlc1xcZHJhd2luZ19jYW52YXNfZGlyZWN0aXZlLmNvZmZlZSIsImQ6XFxpbmZpbml0ZS1jYW52YXNcXHNyY1xcY29tbW9uXFxzcG90XFxkaXJlY3RpdmVzXFxzcG90X2RpcmVjdGl2ZS5jb2ZmZWUiLCJkOlxcaW5maW5pdGUtY2FudmFzXFxzcmNcXGNvbW1vblxcc3BvdFxcaW5kZXguY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxjb21tb25cXHNwb3RcXHNlcnZpY2VzXFxzcG90X3NlcnZpY2UuY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxjb21tb25cXHV0aWxzXFxpbmRleC5jb2ZmZWUiLCJkOlxcaW5maW5pdGUtY2FudmFzXFxzcmNcXGNvbW1vblxcdXRpbHNcXHNlcnZpY2VzXFxtb2R1bGVfZXh0ZW5zaW9uLmNvZmZlZSIsImQ6XFxpbmZpbml0ZS1jYW52YXNcXHNyY1xcY29tbW9uXFx1dGlsc1xcc2VydmljZXNcXG9ic2VydmFibGVfbWl4aW4uY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxjb21tb25cXHV0aWxzXFxzZXJ2aWNlc1xccmVxdWVzdF9hYm9ydGVyX3NlcnZpY2UuY29mZmVlIiwiZDovaW5maW5pdGUtY2FudmFzL3NyYy9jb25maWcuanNvbiIsImQ6XFxpbmZpbml0ZS1jYW52YXNcXHNyY1xcaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxvQkFBQTs7QUFBQSxPQUFBLENBQVEsU0FBUixDQUFBLENBQUE7O0FBRUE7QUFBQTs7R0FGQTs7QUFBQTtBQU9lLEVBQUEseUJBQUEsR0FBQTtBQUNYLElBQUEsQ0FBQSxDQUFFLFFBQUYsQ0FBVyxDQUFDLEtBQVosQ0FBa0IsU0FBQSxHQUFBO2FBQ2hCLE9BQU8sQ0FBQyxTQUFSLENBQWtCLFFBQWxCLEVBQTRCLENBQUMsZUFBRCxDQUE1QixFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsSUFBVjtPQURGLEVBRGdCO0lBQUEsQ0FBbEIsQ0FBQSxDQURXO0VBQUEsQ0FBYjs7QUFBQSw0QkFLQSxHQUFBLEdBQUssU0FBQSxHQUFBO1dBQUc7TUFBQyxZQUFELEVBQWUsUUFBZixFQUF5QixjQUF6QixFQUF5QyxTQUFFLFVBQUYsRUFBYyxNQUFkLEVBQXNCLFlBQXRCLEdBQUE7QUFDL0MsUUFBQSxVQUFVLENBQUMsTUFBWCxHQUFvQixNQUFwQixDQUFBO0FBQUEsUUFFQSxVQUFVLENBQUMsR0FBWCxDQUFlLG1CQUFmLEVBQW9DLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixRQUFqQixFQUEyQixTQUEzQixFQUFzQyxVQUF0QyxHQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBDLENBRkEsQ0FBQTtlQUlBLFVBQVUsQ0FBQyxHQUFYLENBQWUsbUJBQWYsRUFBb0MsU0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixRQUFqQixFQUEyQixTQUEzQixFQUFzQyxVQUF0QyxFQUFrRCxLQUFsRCxHQUFBO2lCQUNsQyxPQUFPLENBQUMsS0FBUixDQUFjLEtBQWQsRUFBcUIsT0FBckIsRUFBOEIsUUFBOUIsRUFBd0MsU0FBeEMsRUFBbUQsVUFBbkQsRUFEa0M7UUFBQSxDQUFwQyxFQUwrQztNQUFBLENBQXpDO01BQUg7RUFBQSxDQUxMLENBQUE7O0FBQUEsNEJBZUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtXQUFHO01BQUUsb0JBQUYsRUFBd0IsVUFBeEIsRUFBb0MsU0FBQyxrQkFBRCxFQUFxQixRQUFyQixHQUFBO0FBRTdDLFFBQUEsa0JBQ0UsQ0FBQyxTQURILENBQ2EsR0FEYixDQUFBLENBQUE7ZUFFQSxRQUFRLENBQUMsU0FBVCxDQUFtQixtQkFBbkIsRUFBd0M7VUFBRSxXQUFGLEVBQWUsU0FBQyxTQUFELEdBQUE7bUJBQ3JELFNBQUMsU0FBRCxFQUFZLEtBQVosR0FBQTtBQUNFLGtCQUFBLFNBQUE7QUFBQSxjQUFBLFNBQUEsQ0FBVSxTQUFWLEVBQXFCLEtBQXJCLENBQUEsQ0FBQTtBQUFBLGNBQ0EsU0FBQSxHQUNFO0FBQUEsZ0JBQUEsU0FBQSxFQUFXLFNBQVg7QUFBQSxnQkFDQSxLQUFBLEVBQU8sS0FEUDtlQUZGLENBQUE7cUJBS0EsT0FBTyxDQUFDLEtBQVIsQ0FBYywyQkFBZCxFQUEyQyxTQUFTLENBQUMsR0FBckQsRUFBMEQsU0FBMUQsRUFORjtZQUFBLEVBRHFEO1VBQUEsQ0FBZjtTQUF4QyxFQUo2QztNQUFBLENBQXBDO01BQUg7RUFBQSxDQWZSLENBQUE7O3lCQUFBOztJQVBGLENBQUE7O0FBQUEsR0FxQ0EsR0FBVSxJQUFBLGVBQUEsQ0FBQSxDQXJDVixDQUFBOztBQUFBLE9Bd0NFLENBQUMsTUFESCxDQUNVLGVBRFYsRUFDMEIsQ0FBQyxhQUFELENBRDFCLENBQzBDLENBQUMsTUFEM0MsQ0FDbUQsR0FBRyxDQUFDLE1BQUosQ0FBQSxDQURuRCxDQUNpRSxDQUFDLEdBRGxFLENBQ3NFLEdBQUcsQ0FBQyxHQUFKLENBQUEsQ0FEdEUsQ0F2Q0EsQ0FBQTs7Ozs7QUNBQTtBQUFBOzs7R0FBQTtBQUFBLElBQUEsZUFBQTs7QUFBQTtBQUtFLEVBQUEsZUFBQyxDQUFBLE9BQUQsR0FBVSxDQUFFLFFBQUYsQ0FBVixDQUFBOztBQUNhLEVBQUEseUJBQUMsTUFBRCxHQUFBO0FBQVcsSUFBVixJQUFDLENBQUEsU0FBRCxNQUFVLENBQVg7RUFBQSxDQURiOzt5QkFBQTs7SUFMRixDQUFBOztBQUFBLE9BU08sQ0FBQyxNQUFSLENBQWUsaURBQWYsRUFBa0UsRUFBbEUsQ0FDRSxDQUFDLFVBREgsQ0FDYyxpQkFEZCxFQUNpQyxlQURqQyxDQVRBLENBQUE7Ozs7O0FDQUEsT0FBQSxDQUFRLGdDQUFSLENBQUEsQ0FBQTs7QUFDQTtBQUFBOztHQURBOztBQUFBLE9BSU8sQ0FBQyxNQUFSLENBQWUscUJBQWYsRUFBc0MsQ0FDcEMsaURBRG9DLENBQXRDLENBRUUsQ0FBQyxNQUZILENBRVUsU0FBQyxjQUFELEdBQUE7U0FDUixjQUNFLENBQUMsS0FESCxDQUNTLFNBRFQsRUFFSTtBQUFBLElBQUEsR0FBQSxFQUFLLEdBQUw7QUFBQSxJQUNBLFdBQUEsRUFBYSxpQ0FEYjtBQUFBLElBRUEsVUFBQSxFQUFZLGlCQUZaO0dBRkosRUFEUTtBQUFBLENBRlYsQ0FKQSxDQUFBOzs7OztBQ0FBO0FBQUE7O0dBQUE7QUFBQSxJQUFBLGdCQUFBO0VBQUEsZ0ZBQUE7O0FBQUE7QUFLRSxFQUFBLGdCQUFDLENBQUEsT0FBRCxHQUFVLENBQUUsUUFBRixFQUFZLGVBQVosRUFBNkIsYUFBN0IsRUFBNEMsbUJBQTVDLEVBQWlFLFdBQWpFLEVBQThFLFNBQTlFLENBQVYsQ0FBQTs7QUFDYSxFQUFBLDBCQUFFLE1BQUYsRUFBVyxjQUFYLEVBQTRCLFlBQTVCLEVBQTJDLGtCQUEzQyxFQUFnRSxTQUFoRSxFQUEyRSxPQUEzRSxHQUFBO0FBQ1gsSUFEYSxJQUFDLENBQUEsU0FBRCxNQUNiLENBQUE7QUFBQSxJQURzQixJQUFDLENBQUEsaUJBQUQsY0FDdEIsQ0FBQTtBQUFBLElBRHVDLElBQUMsQ0FBQSxlQUFELFlBQ3ZDLENBQUE7QUFBQSxJQURzRCxJQUFDLENBQUEscUJBQUQsa0JBQ3RELENBQUE7QUFBQSxJQURzRixJQUFDLENBQUEsVUFBRCxPQUN0RixDQUFBO0FBQUEsaURBQUEsQ0FBQTtBQUFBLDJDQUFBLENBQUE7QUFBQSwrQ0FBQSxDQUFBO0FBQUEsdURBQUEsQ0FBQTtBQUFBLCtEQUFBLENBQUE7QUFBQSxpRUFBQSxDQUFBO0FBQUEsaUVBQUEsQ0FBQTtBQUFBLElBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLEdBQWUsTUFBZixDQUFBO0FBRUE7QUFBQTs7T0FGQTtBQUFBLElBS0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxHQUFSLENBQVksZUFBWixFQUE2QixJQUFDLENBQUEsYUFBOUIsQ0FMQSxDQUFBO0FBQUEsSUFNQSxJQUFDLENBQUEsTUFBTSxDQUFDLEdBQVIsQ0FBWSxXQUFaLEVBQXlCLElBQUMsQ0FBQSxrQkFBMUIsQ0FOQSxDQUFBO0FBQUEsSUFPQSxJQUFDLENBQUEsTUFBTSxDQUFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCLElBQUMsQ0FBQSxpQkFBNUIsQ0FQQSxDQUFBO0FBQUEsSUFRQSxJQUFDLENBQUEsTUFBTSxDQUFDLEdBQVIsQ0FBWSxXQUFaLEVBQXlCLElBQUMsQ0FBQSxrQkFBMUIsQ0FSQSxDQUFBO0FBVUE7QUFBQTs7T0FWQTtBQUFBLElBYUEsSUFBQyxDQUFBLGtCQUFrQixDQUFDLEVBQXBCLENBQXVCLGNBQXZCLEVBQXVDLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLElBQUQsR0FBQTtBQUNyQyxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksZ0NBQVosRUFBOEMsSUFBOUMsQ0FBQSxDQUFBO2VBQ0EsS0FBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLGFBQW5CLEVBQWtDLElBQWxDLEVBRnFDO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkMsQ0FiQSxDQUFBO0FBQUEsSUFpQkEsSUFBQyxDQUFBLGtCQUFrQixDQUFDLEVBQXBCLENBQXVCLGVBQXZCLEVBQXdDLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLElBQUQsR0FBQTtlQUN0QyxLQUFDLENBQUEsY0FBYyxDQUFDLFdBQWhCLENBQTRCLElBQTVCLEVBQWtDLEtBQUMsQ0FBQSxNQUFNLENBQUMsS0FBMUMsRUFEc0M7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QyxDQWpCQSxDQUFBO0FBQUEsSUFvQkEsSUFBQyxDQUFBLGtCQUFrQixDQUFDLEVBQXBCLENBQXVCLGlCQUF2QixFQUEwQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxJQUFELEdBQUE7QUFDeEMsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLGlCQUFaLEVBQStCLElBQS9CLENBQUEsQ0FBQTtlQUNBLEtBQUMsQ0FBQSxjQUFjLENBQUMsYUFBaEIsQ0FBOEIsSUFBOUIsRUFBb0MsS0FBQyxDQUFBLE1BQU0sQ0FBQyxLQUE1QyxFQUZ3QztNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFDLENBcEJBLENBQUE7QUFBQSxJQXdCQSxJQUFDLENBQUEsa0JBQWtCLENBQUMsRUFBcEIsQ0FBdUIsT0FBdkIsRUFBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsSUFBRCxHQUFBO2VBQzlCLE9BQU8sQ0FBQyxHQUFSLENBQVksYUFBWixFQUEyQixJQUEzQixFQUQ4QjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDLENBeEJBLENBQUE7QUEyQkE7QUFBQTs7T0EzQkE7QUFBQSxJQThCQSxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsR0FBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ3RCLFlBQUEsU0FBQTtBQUFBLFFBQUEsS0FBQyxDQUFBLGNBQWMsQ0FBQyxjQUFoQixDQUNFO0FBQUEsVUFBQSxHQUFBLDZEQUFrQixDQUFsQjtBQUFBLFVBQ0EsSUFBQSxnRUFBcUIsQ0FEckI7U0FERixDQUFBLENBQUE7ZUFHQSxLQUFDLENBQUEsU0FBRCxDQUNFO0FBQUEsVUFBQSxNQUFBLEVBQVEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxXQUFqQjtBQUFBLFVBQ0EsS0FBQSxFQUFPLEtBQUMsQ0FBQSxPQUFPLENBQUMsVUFEaEI7U0FERixFQUpzQjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBOUJ4QixDQUFBO0FBQUEsSUFzQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFSLEdBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLElBQUQsR0FBQTtBQUN2QixZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FBTyxTQUFBLEdBQUE7aUJBQ0wsS0FBQyxDQUFBLE9BQUQsQ0FBUyxJQUFULEVBREs7UUFBQSxDQUFQLENBQUE7ZUFFQSxLQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsR0FBZSxTQUFBLENBQVcsSUFBWCxFQUFpQixHQUFqQixFQUhRO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0F0Q3pCLENBQUE7QUFBQSxJQTJDQSxJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLEdBQTRCLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLElBQUQsR0FBQTtBQUMxQixZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FBTyxTQUFBLEdBQUE7aUJBQ0wsS0FBQyxDQUFBLFVBQUQsQ0FBWSxJQUFaLEVBREs7UUFBQSxDQUFQLENBQUE7ZUFFQSxLQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsR0FBZSxTQUFBLENBQVcsSUFBWCxFQUFpQixHQUFqQixFQUhXO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0EzQzVCLENBQUE7QUFBQSxJQWdEQSxJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsR0FBdUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUEsR0FBQTtBQUNyQixRQUFBLElBQUcsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsS0FBQyxDQUFBLE1BQU0sQ0FBQyxJQUExQixDQUFIO0FBQ0UsVUFBQSxTQUFTLENBQUMsTUFBVixDQUFpQixLQUFDLENBQUEsTUFBTSxDQUFDLElBQXpCLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsR0FBZSxPQUZqQjtTQURxQjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBaER2QixDQUFBO0FBQUEsSUFxREEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFBLEdBQUE7QUFDZixRQUFBLEtBQUMsQ0FBQSxjQUFjLENBQUMsbUJBQWhCLENBQUEsQ0FBQSxDQUFBO2VBQ0EsS0FBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLENBQXNCLEtBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBQSxDQUF0QixFQUZlO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FyRGpCLENBQUE7QUFBQSxJQXlEQSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsR0FBa0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUEsR0FBQTtBQUNoQixRQUFBLEtBQUMsQ0FBQSxjQUFjLENBQUMsbUJBQWhCLENBQUEsQ0FBQSxDQUFBO2VBQ0EsS0FBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLENBQXNCLEtBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBQSxDQUF0QixFQUZnQjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBekRsQixDQUFBO0FBQUEsSUE2REEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixHQUE2QixDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO2VBQzNCO0FBQUEsVUFBQSxHQUFBLEVBQUssS0FBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxDQUFwQztBQUFBLFVBQ0EsSUFBQSxFQUFNLEtBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsQ0FEckM7VUFEMkI7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQTdEN0IsQ0FEVztFQUFBLENBRGI7O0FBQUEsNkJBbUVBLGtCQUFBLEdBQW9CLFNBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUNsQixJQUFBLEtBQUssQ0FBQyxlQUFOLENBQUEsQ0FBQSxDQUFBO0FBQUEsSUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLDRCQUFaLEVBQTBDLElBQTFDLENBREEsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLGFBQW5CLEVBQWtDLElBQWxDLENBRkEsQ0FBQTtBQUFBLElBR0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxRQUFkLENBQXVCLElBQXZCLENBSEEsQ0FBQTtXQUtBLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxJQUFwQixDQUF5QixhQUF6QixFQUF3QyxJQUF4QyxFQU5rQjtFQUFBLENBbkVwQixDQUFBOztBQUFBLDZCQTJFQSxrQkFBQSxHQUFvQixTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDbEIsSUFBQSxLQUFLLENBQUMsZUFBTixDQUFBLENBQUEsQ0FBQTtXQUNBLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxJQUFwQixDQUF5QixXQUF6QixFQUFzQyxJQUF0QyxFQUZrQjtFQUFBLENBM0VwQixDQUFBOztBQUFBLDZCQStFQSxpQkFBQSxHQUFtQixTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDakIsSUFBQSxLQUFLLENBQUMsZUFBTixDQUFBLENBQUEsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLGtCQUFrQixDQUFDLElBQXBCLENBQXlCLGFBQXpCLEVBQXdDLElBQXhDLENBREEsQ0FBQTtXQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFlLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFBLEdBQUE7ZUFDYixLQUFDLENBQUEsY0FBYyxDQUFDLGFBQWhCLENBQThCLElBQTlCLEVBQW9DLEtBQUMsQ0FBQSxNQUFNLENBQUMsS0FBNUMsRUFEYTtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWYsRUFIaUI7RUFBQSxDQS9FbkIsQ0FBQTs7QUFBQSw2QkFxRkEsYUFBQSxHQUFlLFNBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUNiLElBQUEsS0FBSyxDQUFDLGVBQU4sQ0FBQSxDQUFBLENBQUE7V0FDQSxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsQ0FBQSxFQUZhO0VBQUEsQ0FyRmYsQ0FBQTs7QUFBQSw2QkF5RkEsU0FBQSxHQUFXLFNBQUMsS0FBRCxHQUFBO1dBQ1QsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQWdCLElBQUMsQ0FBQSxjQUFjLENBQUMsc0JBQWhCLENBQXVDLEtBQXZDLEVBRFA7RUFBQSxDQXpGWCxDQUFBOztBQUFBLDZCQTRGQSxPQUFBLEdBQVMsU0FBQyxTQUFELEdBQUE7V0FDUCxJQUFDLENBQUEsY0FBYyxDQUFDLE1BQWhCLENBQXVCLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBL0IsRUFBc0MsU0FBdEMsRUFETztFQUFBLENBNUZULENBQUE7O0FBQUEsNkJBK0ZBLFVBQUEsR0FBWSxTQUFDLFNBQUQsR0FBQTtXQUNWLElBQUMsQ0FBQSxjQUFjLENBQUMsU0FBaEIsQ0FBMEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFsQyxFQUF5QyxTQUF6QyxFQURVO0VBQUEsQ0EvRlosQ0FBQTs7MEJBQUE7O0lBTEYsQ0FBQTs7QUFBQSxPQXdHTyxDQUFDLE1BQVIsQ0FBZSwwREFBZixFQUEyRSxFQUEzRSxDQUNFLENBQUMsVUFESCxDQUNjLGtCQURkLEVBQ2tDLGdCQURsQyxDQXhHQSxDQUFBOzs7OztBQ0FBLE9BQU8sQ0FBQyxNQUFSLENBQWUsd0RBQWYsRUFBeUUsRUFBekUsQ0FDRSxDQUFDLFNBREgsQ0FDYSxhQURiLEVBQzRCLFNBQUMsVUFBRCxFQUFhLE9BQWIsR0FBQTtTQUN4QjtBQUFBLElBQUEsUUFBQSxFQUFVLEdBQVY7QUFBQSxJQUNBLFVBQUEsRUFBWSxrQkFEWjtBQUFBLElBRUEsV0FBQSxFQUFhLHFDQUZiO0FBQUEsSUFHQSxJQUFBLEVBQU0sU0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLElBQWQsR0FBQTtBQUNKLFVBQUEsNEJBQUE7QUFBQSxNQUFBLGFBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsUUFBQSxLQUFLLENBQUMsS0FBTixDQUFZLGVBQVosQ0FBQSxDQUFBO2VBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxpQkFBVixDQUE0QixDQUFDLEdBQTdCLENBQ0U7QUFBQSxVQUFBLE1BQUEsRUFBUSxPQUFPLENBQUMsV0FBaEI7QUFBQSxVQUNBLEtBQUEsRUFBTyxPQUFPLENBQUMsVUFEZjtTQURGLEVBRmM7TUFBQSxDQUFoQixDQUFBO0FBQUEsTUFNQSxhQUFBLEdBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2QsS0FBSyxDQUFDLE1BQU4sQ0FBYSxhQUFiLEVBRGM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQU5oQixDQUFBO0FBQUEsTUFTQSxhQUFBLENBQUEsQ0FUQSxDQUFBO2FBV0EsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsT0FBaEIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixRQUE5QixFQUF3QyxDQUFDLENBQUMsUUFBRixDQUFXLGFBQVgsRUFBMkIsSUFBM0IsQ0FBeEMsRUFaSTtJQUFBLENBSE47SUFEd0I7QUFBQSxDQUQ1QixDQUFBLENBQUE7Ozs7O0FDQUEsT0FBQSxDQUFRLGlDQUFSLENBQUEsQ0FBQTs7QUFBQSxPQUNBLENBQVEsMkJBQVIsQ0FEQSxDQUFBOztBQUFBLE9BRUEsQ0FBUSxnQ0FBUixDQUZBLENBQUE7O0FBQUEsT0FHQSxDQUFRLCtCQUFSLENBSEEsQ0FBQTs7QUFLQTtBQUFBOztHQUxBOztBQUFBLE9BU08sQ0FBQyxNQUFSLENBQWUsNkJBQWYsRUFBOEMsQ0FDNUMsb0RBRDRDLEVBRTdDLHdEQUY2QyxFQUc3QywwREFINkMsRUFJN0Msd0RBSjZDLENBQTlDLENBVEEsQ0FBQTs7Ozs7QUNBQSxJQUFBLE1BQUE7RUFBQSxnRkFBQTs7QUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLG9EQUFmLEVBQXFFLEVBQXJFLENBQ0UsQ0FBQyxPQURILENBQ1csZUFEWCxFQUNrQzs7Ozs7Ozs7OztHQUM5Qjs7QUFBQSxtQkFBQSxZQUFBLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFBTyxHQUFQO0FBQUEsSUFDQSxNQUFBLEVBQVEsR0FEUjtHQURGLENBQUE7O0FBQUEsbUJBR0EsWUFBQSxHQUNFO0FBQUEsSUFBQSxHQUFBLEVBQUssQ0FBTDtBQUFBLElBQ0EsSUFBQSxFQUFNLENBRE47R0FKRixDQUFBOztBQUFBLG1CQU9BLG1CQUFBLEdBQXFCLFNBQUEsR0FBQTtBQUNuQixJQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsS0FBZCxJQUF1QixFQUF2QixDQUFBO1dBQ0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLElBQXdCLEdBRkw7RUFBQSxDQVByQixDQUFBOztBQUFBLG1CQVdBLG1CQUFBLEdBQXFCLFNBQUEsR0FBQTtBQUNuQixJQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsS0FBZCxJQUF1QixFQUF2QixDQUFBO1dBQ0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLElBQXdCLEdBRkw7RUFBQSxDQVhyQixDQUFBOztBQUFBLG1CQWVBLFdBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7QUFDWCxRQUFBLCtCQUFBO0FBQUE7QUFBQTtTQUFBLHFDQUFBO21CQUFBO0FBQ0U7O0FBQUE7QUFBQTthQUFBLHdDQUFBO3lCQUFBO0FBQ0UsVUFBQSxJQUFHLElBQUksQ0FBQyxDQUFMLEtBQVUsSUFBSSxDQUFDLENBQWYsSUFBcUIsSUFBSSxDQUFDLENBQUwsS0FBVSxJQUFJLENBQUMsQ0FBdkM7MEJBQ0UsSUFBSSxDQUFDLE1BQUwsR0FBYyxZQURoQjtXQUFBLE1BQUE7a0NBQUE7V0FERjtBQUFBOztXQUFBLENBREY7QUFBQTttQkFEVztFQUFBLENBZmIsQ0FBQTs7QUFBQSxtQkFxQkEsYUFBQSxHQUFlLFNBQUMsSUFBRCxFQUFPLEtBQVAsR0FBQTtBQUNiLFFBQUEsK0JBQUE7QUFBQSxJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksZUFBWixFQUE2QixJQUE3QixFQUFtQyxLQUFuQyxDQUFBLENBQUE7QUFDQTtBQUFBO1NBQUEscUNBQUE7bUJBQUE7QUFDRTs7QUFBQTtBQUFBO2FBQUEsd0NBQUE7eUJBQUE7QUFDRSxVQUFBLElBQUcsSUFBSSxDQUFDLENBQUwsS0FBVSxJQUFJLENBQUMsQ0FBZixJQUFxQixJQUFJLENBQUMsQ0FBTCxLQUFVLElBQUksQ0FBQyxDQUF2QzswQkFDRSxJQUFJLENBQUMsTUFBTCxHQUFjLFFBRGhCO1dBQUEsTUFBQTtrQ0FBQTtXQURGO0FBQUE7O1dBQUEsQ0FERjtBQUFBO21CQUZhO0VBQUEsQ0FyQmYsQ0FBQTs7QUFBQSxtQkE0QkEsTUFBQSxHQUFRLFNBQUMsS0FBRCxFQUFRLFNBQVIsR0FBQTtBQUNOLElBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFaLEVBQW1CLFNBQW5CLENBQUEsQ0FBQTtBQUNBLElBQUEsSUFBRyxTQUFBLEtBQWEsSUFBaEI7QUFDSSxNQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBWCxDQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sQ0FBQyxDQUFDLEdBQUYsQ0FBTSxDQUFDLENBQUMsS0FBRixDQUFRLEtBQUssQ0FBQyxJQUFkLENBQW1CLENBQUMsS0FBMUIsRUFBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLElBQUQsRUFBTSxDQUFOLEdBQUE7bUJBQ3RDO0FBQUEsY0FBQSxDQUFBLEVBQUcsSUFBSSxDQUFDLENBQUwsR0FBTyxDQUFWO0FBQUEsY0FDQSxDQUFBLEVBQUcsSUFBSSxDQUFDLENBRFI7QUFBQSxjQUVBLE1BQUEsRUFBUSxLQUFDLENBQUEsWUFBWSxDQUFDLE1BRnRCO0FBQUEsY0FHQSxLQUFBLEVBQU8sS0FBQyxDQUFBLFlBQVksQ0FBQyxLQUhyQjtjQURzQztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpDLENBQVA7T0FERixDQUFBLENBQUE7QUFBQSxNQU1BLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBWCxDQUFBLENBTkEsQ0FESjtLQURBO0FBU0EsSUFBQSxJQUFHLFNBQUEsS0FBYSxNQUFoQjtBQUNJLE1BQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFYLENBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxDQUFDLENBQUMsR0FBRixDQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sS0FBSyxDQUFDLElBQWIsQ0FBa0IsQ0FBQyxLQUF6QixFQUFnQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsSUFBRCxFQUFNLENBQU4sR0FBQTttQkFDckM7QUFBQSxjQUFBLENBQUEsRUFBRyxJQUFJLENBQUMsQ0FBTCxHQUFPLENBQVY7QUFBQSxjQUNBLENBQUEsRUFBRyxJQUFJLENBQUMsQ0FEUjtBQUFBLGNBRUEsTUFBQSxFQUFRLEtBQUMsQ0FBQSxZQUFZLENBQUMsTUFGdEI7QUFBQSxjQUdBLEtBQUEsRUFBTyxLQUFDLENBQUEsWUFBWSxDQUFDLEtBSHJCO2NBRHFDO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEMsQ0FBUDtPQURGLENBQUEsQ0FBQTthQU1BLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBWCxDQUFBLEVBUEo7S0FWTTtFQUFBLENBNUJSLENBQUE7O0FBQUEsbUJBK0NBLFNBQUEsR0FBVyxTQUFDLEtBQUQsRUFBUSxTQUFSLEdBQUE7QUFDVCxJQUFBLElBQUcsU0FBQSxLQUFhLE9BQWhCO2FBQ0UsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxLQUFLLENBQUMsSUFBWixFQUFrQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEVBQUssQ0FBTCxHQUFBO0FBQ2hCLFVBQUEsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFWLENBQ0U7QUFBQSxZQUFBLENBQUEsRUFBRyxDQUFDLENBQUMsSUFBRixDQUFPLEdBQUcsQ0FBQyxLQUFYLENBQWlCLENBQUMsQ0FBbEIsR0FBb0IsQ0FBdkI7QUFBQSxZQUNBLENBQUEsRUFBRyxDQUFDLENBQUMsS0FBRixDQUFRLEdBQUcsQ0FBQyxLQUFaLENBQWtCLENBQUMsQ0FEdEI7QUFBQSxZQUVBLE1BQUEsRUFBUSxLQUFDLENBQUEsWUFBWSxDQUFDLE1BRnRCO0FBQUEsWUFHQSxLQUFBLEVBQU8sS0FBQyxDQUFBLFlBQVksQ0FBQyxLQUhyQjtXQURGLENBQUEsQ0FBQTtpQkFLQSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQVYsQ0FBQSxFQU5nQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCLEVBREY7S0FBQSxNQVFLLElBQUcsU0FBQSxLQUFhLE1BQWhCO2FBQ0gsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxLQUFLLENBQUMsSUFBWixFQUFrQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEVBQUssQ0FBTCxHQUFBO0FBQ2hCLFVBQUEsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFWLENBQ0U7QUFBQSxZQUFBLENBQUEsRUFBRyxDQUFDLENBQUMsS0FBRixDQUFRLEdBQUcsQ0FBQyxLQUFaLENBQWtCLENBQUMsQ0FBbkIsR0FBcUIsQ0FBeEI7QUFBQSxZQUNBLENBQUEsRUFBRyxDQUFDLENBQUMsS0FBRixDQUFRLEdBQUcsQ0FBQyxLQUFaLENBQWtCLENBQUMsQ0FEdEI7QUFBQSxZQUVBLE1BQUEsRUFBUSxLQUFDLENBQUEsWUFBWSxDQUFDLE1BRnRCO0FBQUEsWUFHQSxLQUFBLEVBQU8sS0FBQyxDQUFBLFlBQVksQ0FBQyxLQUhyQjtXQURGLENBQUEsQ0FBQTtpQkFLQSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQVYsQ0FBQSxFQU5nQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCLEVBREc7S0FUSTtFQUFBLENBL0NYLENBQUE7O0FBQUEsbUJBaUVBLGNBQUEsR0FBZ0IsU0FBQyxLQUFELEdBQUE7QUFDZCxJQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsR0FBZCxHQUFvQixLQUFLLENBQUMsR0FBMUIsQ0FBQTtXQUNBLElBQUMsQ0FBQSxZQUFZLENBQUMsSUFBZCxHQUFxQixLQUFLLENBQUMsS0FGYjtFQUFBLENBakVoQixDQUFBOztBQUFBLG1CQXFFQSxzQkFBQSxHQUF3QixTQUFDLEtBQUQsR0FBQTtBQUd0QixRQUFBLHVCQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFLLENBQUMsTUFBTixHQUFlLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBeEMsQ0FBUCxDQUFBO0FBQUEsSUFDQSxXQUFBLEdBQWMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFLLENBQUMsS0FBTixHQUFjLElBQUMsQ0FBQSxZQUFZLENBQUMsS0FBdkMsQ0FEZCxDQUFBO1dBRUE7QUFBQSxNQUFBLElBQUE7O0FBQU07YUFBUywwSUFBVCxHQUFBO0FBQ0osdUJBQUE7QUFBQSxZQUFBLEtBQUE7O0FBQU87bUJBQVMsa0pBQVQsR0FBQTtBQUNMLDhCQUFBO0FBQUEsa0JBQUEsQ0FBQSxFQUFHLENBQUg7QUFBQSxrQkFDQSxDQUFBLEVBQUcsQ0FESDtBQUFBLGtCQUVBLE1BQUEsRUFBUSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BRnRCO0FBQUEsa0JBR0EsS0FBQSxFQUFPLElBQUMsQ0FBQSxZQUFZLENBQUMsS0FIckI7QUFBQSxrQkFJQSxNQUFBLEVBQVEsU0FKUjtrQkFBQSxDQURLO0FBQUE7O3lCQUFQO1lBQUEsQ0FESTtBQUFBOzttQkFBTjtNQUxzQjtFQUFBLENBckV4QixDQUFBOztnQkFBQTs7SUFGSixDQUFBLENBQUE7Ozs7O0FDQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSx3REFBZixFQUF5RSxFQUF6RSxDQUNFLENBQUMsT0FESCxDQUNXLG1CQURYLEVBQ2dDO0VBQUMsZUFBRCxFQUFtQixTQUFuQixFQUE4QixTQUFDLGFBQUQsRUFBZ0IsT0FBaEIsR0FBQTtBQUMxRCxRQUFBLDBCQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsRUFBRSxDQUFDLE9BQUgsQ0FBYyxPQUFELEdBQVMsYUFBdEIsQ0FBWCxDQUFBO0FBQUEsSUFDQSxnQkFBQSxHQUFtQixhQUFBLENBQ2pCO0FBQUEsTUFBQSxRQUFBLEVBQVUsUUFBVjtLQURpQixDQURuQixDQUFBO0FBR0EsV0FBTyxnQkFBUCxDQUowRDtFQUFBLENBQTlCO0NBRGhDLENBQUEsQ0FBQTs7Ozs7QUNBQTtBQUFBOztHQUFBO0FBQUEsSUFBQSxjQUFBO0VBQUEsZ0ZBQUE7O0FBQUE7QUFLRSxFQUFBLGNBQUMsQ0FBQSxPQUFELEdBQVUsQ0FBRSxRQUFGLEVBQVksYUFBWixDQUFWLENBQUE7O0FBQ2EsRUFBQSx3QkFBRSxNQUFGLEVBQVcsWUFBWCxHQUFBO0FBQ1gsSUFEYSxJQUFDLENBQUEsU0FBRCxNQUNiLENBQUE7QUFBQSxJQURzQixJQUFDLENBQUEsZUFBRCxZQUN0QixDQUFBO0FBQUEsNkNBQUEsQ0FBQTtBQUFBLElBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLEdBQWUsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFmLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsR0FBUixDQUFZLGNBQVosRUFBNEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUMxQixRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksNEJBQVosRUFBMEMsSUFBMUMsQ0FBQSxDQUFBO2VBQ0EsS0FBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQWMsV0FBZCxFQUEyQixJQUEzQixFQUYwQjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCLENBRkEsQ0FBQTtBQUFBLElBTUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxHQUFSLENBQVksYUFBWixFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxLQUFELEVBQVEsSUFBUixHQUFBO0FBQ3pCLFFBQUEsSUFBRyxJQUFJLENBQUMsSUFBTCxLQUFhLEtBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQTlCLElBQW9DLElBQUksQ0FBQyxJQUFMLEtBQWEsS0FBQyxDQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBckU7QUFDRSxVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksNEJBQVosRUFBMEMsSUFBMUMsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixXQUFuQixFQUFnQyxJQUFJLENBQUMsY0FBckMsRUFGRjtTQUR5QjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLENBTkEsQ0FBQTtBQUFBLElBV0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBYixDQUFrQixDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxHQUFELEdBQUE7QUFDaEIsWUFBQSxHQUFBO0FBQUEsUUFBQSxrQ0FBVyxDQUFFLHVCQUFiO2lCQUNFLEtBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixXQUFuQixFQUFnQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQXpDLEVBREY7U0FBQSxNQUFBO2lCQUdFLEtBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixXQUFuQixFQUFnQyxHQUFoQyxFQUhGO1NBRGdCO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEIsQ0FYQSxDQURXO0VBQUEsQ0FEYjs7QUFBQSwyQkFtQkEsUUFBQSxHQUFVLFNBQUEsR0FBQTtXQUNSLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBdkI7QUFBQSxNQUNBLElBQUEsRUFBTSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUR2QjtLQURGLEVBRFE7RUFBQSxDQW5CVixDQUFBOzt3QkFBQTs7SUFMRixDQUFBOztBQUFBLE9BNkJPLENBQUMsTUFBUixDQUFlLHNEQUFmLEVBQXVFLEVBQXZFLENBQ0UsQ0FBQyxVQURILENBQ2MsZ0JBRGQsRUFDZ0MsY0FEaEMsQ0E3QkEsQ0FBQTs7Ozs7QUNBQSxPQUFPLENBQUMsTUFBUixDQUFlLDBEQUFmLEVBQTJFLEVBQTNFLENBQ0UsQ0FBQyxTQURILENBQ2EsWUFEYixFQUMyQixTQUFDLFVBQUQsRUFBYSxRQUFiLEVBQXVCLE1BQXZCLEVBQStCLE9BQS9CLEVBQXdDLFFBQXhDLEdBQUE7U0FDdkI7QUFBQSxJQUFBLFFBQUEsRUFBVSxHQUFWO0FBQUEsSUFDQSxJQUFBLEVBQU0sU0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLElBQWQsR0FBQTtBQUVKO0FBQUE7O1NBQUE7QUFBQSxNQUdBLEtBQUssQ0FBQyxpQkFBTixHQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7QUFDeEIsVUFBQSxLQUFLLENBQUMsY0FBTixDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxtQkFBWixDQURBLENBQUE7aUJBRUEsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsY0FBakIsRUFDRTtBQUFBLFlBQUEsSUFBQSxFQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBckI7QUFBQSxZQUNBLElBQUEsRUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLENBRHJCO0FBQUEsWUFFQSxjQUFBLEVBQWdCLEtBQUssQ0FBQyxJQUZ0QjtXQURGLEVBSHdCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIMUIsQ0FBQTtBQUFBLE1BV0EsS0FBSyxDQUFDLGlCQUFOLEdBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFDeEIsTUFBQSxDQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sZUFBUDtBQUFBLFlBQ0EsSUFBQSxFQUFNLElBRE47QUFBQSxZQUVBLFNBQUEsRUFBVyxtQkFGWDtBQUFBLFlBR0EsaUJBQUEsRUFBbUIsU0FIbkI7QUFBQSxZQUlBLGVBQUEsRUFBaUIsOENBSmpCO0FBQUEsWUFLQSxLQUFBLEVBQU8sS0FMUDtXQURGLEVBRHdCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FYMUIsQ0FBQTtBQUFBLE1Bb0JBLEtBQUssQ0FBQyxXQUFOLEdBQW9CLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFFbEIsT0FBTyxDQUFDLE1BQU8sQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFsQixDQUE4QixZQUE5QixFQUE0QyxRQUE1QyxFQUZrQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBcEJwQixDQUFBO0FBQUEsTUF3QkEsS0FBSyxDQUFDLGNBQU4sR0FBdUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO2lCQUNyQixLQUFLLENBQUMsS0FBTixDQUFZLGFBQVosRUFBMkIsSUFBM0IsRUFEcUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXhCdkIsQ0FBQTtBQUFBLE1BMkJBLEtBQUssQ0FBQyxZQUFOLEdBQXFCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFDbkIsS0FBSyxDQUFDLEtBQU4sQ0FBWSxXQUFaLEVBQXlCLElBQXpCLEVBRG1CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0EzQnJCLENBQUE7QUE4QkE7QUFBQTs7U0E5QkE7QUFBQSxNQWlDQSxLQUFLLENBQUMsR0FBTixDQUFVLFlBQVYsRUFBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ3RCLFVBQUEsS0FBSyxDQUFDLGVBQU4sQ0FBQSxDQUFBLENBQUE7aUJBQ0EsT0FBTyxDQUFDLGdCQUFSLENBQXlCLFNBQXpCLEVBQW9DLEtBQUssQ0FBQyxpQkFBMUMsRUFGc0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixDQWpDQSxDQUFBO0FBQUEsTUFxQ0EsS0FBSyxDQUFDLEdBQU4sQ0FBVSxZQUFWLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDdEIsVUFBQSxLQUFLLENBQUMsZUFBTixDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBTyxDQUFDLG1CQUFSLENBQTRCLFNBQTVCLEVBQXVDLEtBQUssQ0FBQyxpQkFBN0MsQ0FEQSxDQUFBO2lCQUVBLEtBQUssQ0FBQyxjQUFOLENBQXFCLEtBQUssQ0FBQyxRQUEzQixFQUhzQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCLENBckNBLENBQUE7YUEwQ0EsS0FBSyxDQUFDLEdBQU4sQ0FBVSxjQUFWLEVBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDeEIsVUFBQSxLQUFLLENBQUMsZUFBTixDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBSyxDQUFDLFFBQU4sR0FBaUIsSUFBSSxDQUFDLFFBRHRCLENBQUE7QUFBQSxVQUVBLEtBQUssQ0FBQyxZQUFOLENBQW1CLElBQUksQ0FBQyxRQUF4QixDQUZBLENBQUE7aUJBR0EsS0FBSyxDQUFDLGlCQUFOLENBQXdCLElBQUksQ0FBQyxRQUE3QixFQUp3QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCLEVBNUNJO0lBQUEsQ0FETjtJQUR1QjtBQUFBLENBRDNCLENBQUEsQ0FBQTs7Ozs7QUNBQSxPQUFPLENBQUMsTUFBUixDQUFlLDZEQUFmLEVBQThFLEVBQTlFLENBQ0UsQ0FBQyxTQURILENBQ2EsZUFEYixFQUM4QixTQUFDLFVBQUQsRUFBYSxRQUFiLEVBQXVCLE9BQXZCLEdBQUE7U0FDMUI7QUFBQSxJQUFBLFFBQUEsRUFBVSxHQUFWO0FBQUEsSUFFQSxRQUFBLEVBQVUsbUhBRlY7QUFBQSxJQUdBLElBQUEsRUFBTSxTQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWMsSUFBZCxHQUFBO0FBRUosTUFBQSxLQUFLLENBQUMsZUFBTixHQUF3QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3RCLGNBQUEsT0FBQTtpQkFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLElBQUwsQ0FBVSxxQkFBVixFQURZO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEIsQ0FBQTthQUdBLEtBQUssQ0FBQyxlQUFOLENBQUEsRUFMSTtJQUFBLENBSE47SUFEMEI7QUFBQSxDQUQ5QixDQUFBLENBQUE7Ozs7O0FDQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxvREFBZixFQUFxRSxFQUFyRSxDQUNFLENBQUMsU0FESCxDQUNhLFVBRGIsRUFDeUIsU0FBQyxVQUFELEdBQUE7U0FDckI7QUFBQSxJQUFBLFFBQUEsRUFBVSxHQUFWO0FBQUEsSUFDQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxHQUFWO0tBRkY7QUFBQSxJQUdBLFVBQUEsRUFBWSxnQkFIWjtBQUFBLElBSUEsV0FBQSxFQUFhLG1DQUpiO0FBQUEsSUFLQSxJQUFBLEVBQU0sU0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLElBQWQsR0FBQTtBQUVKLE1BQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFWLEVBQXVCLFNBQUEsR0FBQTtBQUNyQixRQUFBLElBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFmLEtBQXlCLE1BQTVCO2lCQUNFLElBQUksQ0FBQyxRQUFMLENBQWMsU0FBZCxFQURGO1NBRHFCO01BQUEsQ0FBdkIsQ0FBQSxDQUFBO0FBQUEsTUFJQSxJQUFJLENBQUMsSUFBTCxDQUFVLFlBQVYsRUFBd0IsU0FBQSxHQUFBO2VBQ3RCLElBQUksQ0FBQyxXQUFMLENBQWlCLFNBQWpCLEVBRHNCO01BQUEsQ0FBeEIsQ0FKQSxDQUFBO0FBQUEsTUFPQSxLQUFLLENBQUMsTUFBTixDQUFhLGlCQUFiLEVBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFFLE1BQUYsRUFBVSxNQUFWLEdBQUE7QUFDOUIsVUFBQSxJQUFHLGdCQUFBLElBQVksTUFBQSxLQUFZLE1BQTNCO0FBQ0Usb0JBQU8sTUFBUDtBQUFBLG1CQUNPLFVBRFA7dUJBRUksSUFBSSxDQUFDLElBQUwsQ0FBVSxVQUFWLENBQXFCLENBQUMsUUFBdEIsQ0FBK0IsV0FBL0IsRUFGSjtBQUFBLG1CQUdPLE1BSFA7dUJBSUksSUFBSSxDQUFDLElBQUwsQ0FBVSxVQUFWLENBQXFCLENBQUMsV0FBdEIsQ0FBa0MsV0FBbEMsRUFKSjtBQUFBLGFBREY7V0FEOEI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQyxDQVBBLENBQUE7QUFBQSxNQWVBLEtBQUssQ0FBQyxZQUFOLEdBQXFCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFFbkIsVUFBQSxLQUFLLENBQUMsS0FBTixDQUFZLGNBQVosRUFDRTtBQUFBLFlBQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxZQUNBLFFBQUEsRUFBVSxLQUFLLENBQUMsUUFEaEI7V0FERixDQUFBLENBQUE7aUJBR0EsS0FMbUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWZyQixDQUFBO0FBQUEsTUFzQkEsS0FBSyxDQUFDLEdBQU4sQ0FBVSxXQUFWLEVBQXVCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDckIsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFdBQVosRUFBeUIsSUFBekIsQ0FBQSxDQUFBO2lCQUNBLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBZixHQUF3QixPQUZIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkIsQ0F0QkEsQ0FBQTthQTBCQSxLQUFLLENBQUMsR0FBTixDQUFVLFdBQVYsRUFBdUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUNyQixjQUFBLEdBQUE7QUFBQSxVQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBZixHQUF3QixTQUF4QixDQUFBO0FBQUEsVUFDQSxLQUFLLENBQUMsY0FBTixDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUZBLENBQUE7QUFBQSxVQUdBLEdBQUEsR0FBVSxJQUFBLEtBQUEsQ0FBQSxDQUhWLENBQUE7QUFBQSxVQUlBLEdBQUcsQ0FBQyxTQUFKLEdBQWdCLFNBSmhCLENBQUE7QUFBQSxVQUtBLEdBQUcsQ0FBQyxHQUFKLEdBQVUsSUFMVixDQUFBO0FBQUEsVUFNQSxJQUFJLENBQUMsSUFBTCxDQUFVLFVBQVYsQ0FBcUIsQ0FBQyxXQUF0QixDQUFrQyxXQUFsQyxDQU5BLENBQUE7aUJBT0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxnQkFBVixDQUEyQixDQUFDLElBQTVCLENBQWlDLEdBQWpDLEVBUnFCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkIsRUE1Qkk7SUFBQSxDQUxOO0lBRHFCO0FBQUEsQ0FEekIsQ0FBQSxDQUFBOzs7OztBQ0FBLE9BQUEsQ0FBUSwrQkFBUixDQUFBLENBQUE7O0FBQUEsT0FDQSxDQUFRLHlCQUFSLENBREEsQ0FBQTs7QUFBQSxPQUVBLENBQVEsNkJBQVIsQ0FGQSxDQUFBOztBQUFBLE9BR0EsQ0FBUSxvQ0FBUixDQUhBLENBQUE7O0FBQUEsT0FJQSxDQUFRLHVDQUFSLENBSkEsQ0FBQTs7QUFLQTtBQUFBOztHQUxBOztBQUFBLE9BUU8sQ0FBQyxNQUFSLENBQWUsMkJBQWYsRUFBNEMsQ0FDM0MsZ0RBRDJDLEVBRTNDLHNEQUYyQyxFQUcxQyxvREFIMEMsRUFJMUMsMERBSjBDLEVBSzNDLDZEQUwyQyxDQUE1QyxDQVJBLENBQUE7Ozs7O0FDQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxnREFBZixFQUFpRSxFQUFqRSxDQUNFLENBQUMsT0FESCxDQUNXLGFBRFgsRUFDMEIsU0FBQyxLQUFELEVBQVEsT0FBUixHQUFBO1NBRXRCO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7YUFDUixLQUFLLENBQUMsSUFBTixDQUFjLE9BQUQsR0FBUyxZQUF0QixFQUFtQztBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47T0FBbkMsRUFEUTtJQUFBLENBQVY7QUFBQSxJQUdBLE9BQUEsRUFBUyxTQUFDLElBQUQsR0FBQTthQUNQLEtBQUEsQ0FDRTtBQUFBLFFBQUEsR0FBQSxFQUFPLE9BQUQsR0FBUyxZQUFmO0FBQUEsUUFDQSxNQUFBLEVBQVEsSUFEUjtPQURGLEVBRE87SUFBQSxDQUhUO0lBRnNCO0FBQUEsQ0FEMUIsQ0FBQSxDQUFBOzs7OztBQ0FBLE9BQUEsQ0FBUSw2QkFBUixDQUFBLENBQUE7O0FBQUEsT0FDQSxDQUFRLDZCQUFSLENBREEsQ0FBQTs7QUFBQSxPQUVBLENBQVEsb0NBQVIsQ0FGQSxDQUFBOztBQUFBLE9BS08sQ0FBQyxNQUFSLENBQWUsNEJBQWYsRUFBNkMsQ0FDM0MsNENBRDJDLEVBRTNDLHFEQUYyQyxFQUczQyx5REFIMkMsQ0FBN0MsQ0FMQSxDQUFBOzs7OztBQ0FBO0FBQUE7O0dBQUE7QUFBQSxPQUdPLENBQUMsTUFBUixDQUFlLDRDQUFmLEVBQTZELEVBQTdELENBQ0UsQ0FBQyxPQURILENBQ1csUUFEWCxFQUNxQixTQUFBLEdBQUE7QUFBTSxNQUFBLE1BQUE7U0FBTTt3QkFDN0I7O0FBQUE7QUFBQTs7OztPQUFBOztBQUFBLElBS0EsTUFBQyxDQUFBLE1BQUQsR0FBUyxTQUFDLEdBQUQsR0FBQTtBQUNQLFVBQUEsZUFBQTtBQUFBLFdBQUEsVUFBQTt5QkFBQTtZQUEyQixHQUFBLEtBQVksUUFBWixJQUFBLEdBQUEsS0FBcUI7QUFDOUMsVUFBQSxJQUFFLENBQUEsR0FBQSxDQUFGLEdBQVMsS0FBVDtTQURGO0FBQUEsT0FBQTs7V0FFWSxDQUFFLEtBQWQsQ0FBb0IsSUFBcEI7T0FGQTthQUdBLEtBSk87SUFBQSxDQUxULENBQUE7O0FBV0E7QUFBQTs7Ozs7OztPQVhBOztBQUFBLElBbUJBLE1BQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxHQUFELEVBQU0sU0FBTixHQUFBO0FBQ1IsVUFBQSxlQUFBO0FBQUEsV0FBQSxVQUFBO3lCQUFBO2NBQTJCLEdBQUEsS0FBYSxRQUFiLElBQUEsR0FBQSxLQUFzQjs7U0FDL0M7QUFBQSxRQUFBLElBQUcsU0FBQSxJQUFjLE1BQUEsQ0FBQSxLQUFBLEtBQWdCLFVBQWpDO0FBQ0UsVUFBQSxLQUFBLEdBQVEsU0FBQSxDQUFVLEtBQVYsQ0FBUixDQURGO1NBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxTQUFHLENBQUEsR0FBQSxDQUFKLEdBQVcsS0FGWCxDQURGO0FBQUEsT0FBQTs7V0FJWSxDQUFFLEtBQWQsQ0FBb0IsSUFBcEI7T0FKQTthQUtBLEtBTlE7SUFBQSxDQW5CVixDQUFBOztrQkFBQTs7T0FEaUI7QUFBQSxDQURyQixDQUhBLENBQUE7Ozs7O0FDQ0E7QUFBQTs7Ozs7Ozs7R0FBQTtBQUFBLElBQUEsc0NBQUE7RUFBQSxnQkFBQTs7QUFBQSxxQkFTQSxHQUF3QixTQUFDLFNBQUQsRUFBWSxJQUFaLEdBQUE7QUFDdEIsTUFBQSwwRUFBQTtBQUFBLEVBQUEsTUFBZSxDQUFDLElBQUssQ0FBQSxDQUFBLENBQU4sRUFBVSxJQUFLLENBQUEsQ0FBQSxDQUFmLEVBQW1CLElBQUssQ0FBQSxDQUFBLENBQXhCLENBQWYsRUFBQyxXQUFELEVBQUssV0FBTCxFQUFTLFdBQVQsQ0FBQTtBQUFBLEVBQ0EsS0FBQSx3QkFBUSxTQUFTLENBQUUsZ0JBQVgsSUFBcUIsQ0FEN0IsQ0FBQTtBQUFBLEVBRUEsQ0FBQSxHQUFJLENBQUEsQ0FGSixDQUFBO0FBSUEsVUFBTyxJQUFJLENBQUMsTUFBWjtBQUFBLFNBQ08sQ0FEUDtBQUVJO2FBQU8sRUFBQSxDQUFBLEdBQU0sS0FBYixHQUFBO0FBQ0UscUJBQUEsU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxJQUFoQixDQUFxQixTQUFVLENBQUEsQ0FBQSxDQUFFLENBQUMsR0FBbEMsRUFBQSxDQURGO01BQUEsQ0FBQTtxQkFGSjtBQUNPO0FBRFAsU0FJTyxDQUpQO0FBS0k7YUFBTyxFQUFBLENBQUEsR0FBTSxLQUFiLEdBQUE7QUFDRSxzQkFBQSxTQUFVLENBQUEsQ0FBQSxDQUFFLENBQUMsRUFBRSxDQUFDLElBQWhCLENBQXFCLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxHQUFsQyxFQUF1QyxFQUF2QyxFQUFBLENBREY7TUFBQSxDQUFBO3NCQUxKO0FBSU87QUFKUCxTQU9PLENBUFA7QUFRSTthQUFPLEVBQUEsQ0FBQSxHQUFNLEtBQWIsR0FBQTtBQUNFLHNCQUFBLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxFQUFFLENBQUMsSUFBaEIsQ0FBcUIsU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLEdBQWxDLEVBQXVDLEVBQXZDLEVBQTJDLEVBQTNDLEVBQUEsQ0FERjtNQUFBLENBQUE7c0JBUko7QUFPTztBQVBQLFNBVU8sQ0FWUDtBQVdJO2FBQU8sRUFBQSxDQUFBLEdBQU0sS0FBYixHQUFBO0FBQ0Usc0JBQUEsU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxJQUFoQixDQUFxQixTQUFVLENBQUEsQ0FBQSxDQUFFLENBQUMsR0FBbEMsRUFBdUMsRUFBdkMsRUFBMkMsRUFBM0MsRUFBK0MsRUFBL0MsRUFBQSxDQURGO01BQUEsQ0FBQTtzQkFYSjtBQVVPO0FBVlA7QUFjSTthQUFPLEVBQUEsQ0FBQSxHQUFNLEtBQWIsR0FBQTtBQUNFLHNCQUFBLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxFQUFFLENBQUMsS0FBaEIsQ0FBc0IsU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLEdBQW5DLEVBQXdDLElBQXhDLEVBQUEsQ0FERjtNQUFBLENBQUE7c0JBZEo7QUFBQSxHQUxzQjtBQUFBLENBVHhCLENBQUE7O0FBK0JBO0FBQUE7Ozs7Ozs7OztHQS9CQTs7QUFBQSxlQXlDQSxHQUNFO0FBQUE7QUFBQTs7Ozs7Ozs7S0FBQTtBQUFBLEVBU0EsRUFBQSxFQUFJLFNBQUMsS0FBRCxFQUFRLEVBQVIsRUFBWSxHQUFaLEdBQUE7QUFDRixRQUFBLElBQUE7QUFBQSxJQUFBLElBQUcsTUFBQSxDQUFBLEVBQUEsS0FBYSxVQUFiLElBQTRCLE1BQUEsQ0FBQSxLQUFBLEtBQWdCLFFBQS9DOztRQUVFLElBQUMsQ0FBQSxVQUFXO09BQVo7O1lBQ1MsQ0FBQSxLQUFBLElBQVU7T0FEbkI7QUFBQSxNQUdBLElBQUMsQ0FBQSxPQUFRLENBQUEsS0FBQSxDQUFNLENBQUMsSUFBaEIsQ0FBcUI7QUFBQSxRQUFFLElBQUEsRUFBRjtBQUFBLFFBQU0sS0FBQSxHQUFOO09BQXJCLENBSEEsQ0FGRjtLQUFBO0FBTUEsV0FBTyxJQUFQLENBUEU7RUFBQSxDQVRKO0FBa0JBO0FBQUE7Ozs7OztLQWxCQTtBQUFBLEVBeUJBLEdBQUEsRUFBSyxTQUFDLEtBQUQsRUFBUSxFQUFSLEdBQUE7QUFDSCxRQUFBLDhDQUFBO0FBQUEsSUFBQSxZQUFBLHFDQUF5QixDQUFBLEtBQUEsVUFBekIsQ0FBQTtBQUNBLElBQUEsSUFBRyxLQUFBLElBQVUsRUFBViw0QkFBaUIsWUFBWSxDQUFFLGdCQUFsQztBQUVFLE1BQUEsSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBLENBQVQsR0FBa0IsTUFBQSxHQUFTLEVBQTNCLENBQUE7QUFDQSxXQUFBLHNEQUFBO21DQUFBO0FBQ0UsUUFBQSxJQUE0QixRQUFRLENBQUMsRUFBVCxLQUFlLEVBQTNDO0FBQUEsVUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLFFBQVosQ0FBQSxDQUFBO1NBREY7QUFBQSxPQURBO0FBR0EsTUFBQSxJQUFHLE1BQU0sQ0FBQyxNQUFWO0FBQ0UsUUFBQSxJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUEsQ0FBVCxHQUFrQixNQUFsQixDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsTUFBQSxDQUFBLElBQVEsQ0FBQSxPQUFRLENBQUEsS0FBQSxDQUFoQixDQUhGO09BSEE7QUFPQTtBQUFBOzs7U0FURjtLQUFBLE1BYUssSUFBRyxLQUFBLElBQVUsTUFBQSxDQUFBLEVBQUEsS0FBYSxXQUF2Qiw0QkFBdUMsWUFBWSxDQUFFLGdCQUF4RDtBQUNILE1BQUEsTUFBQSxDQUFBLElBQVEsQ0FBQSxPQUFRLENBQUEsS0FBQSxDQUFoQixDQURHO0tBZEw7QUFnQkEsV0FBTyxJQUFQLENBakJHO0VBQUEsQ0F6Qkw7QUE0Q0E7QUFBQTs7Ozs7S0E1Q0E7QUFBQSxFQWtEQSxPQUFBLEVBQVMsU0FBQSxHQUFBO0FBQ1AsUUFBQSw2REFBQTtBQUFBLElBRFEsc0JBQU8sNERBQ2YsQ0FBQTtBQUFBLElBQUEsY0FBQSxxQ0FBMkIsQ0FBQSxLQUFBLFVBQTNCLENBQUE7QUFBQSxJQUNBLFlBQUEsdUNBQXVCLENBQUUsWUFEekIsQ0FBQTtBQUdBLElBQUEsSUFBRyxLQUFBLElBQVUsY0FBVixJQUE0QixZQUEvQjtBQUNFLE1BQUEsNkJBQUcsY0FBYyxDQUFFLGVBQW5CO0FBQ0UsUUFBQSxxQkFBQSxDQUFzQixjQUF0QixFQUFzQyxJQUF0QyxDQUFBLENBREY7T0FBQTtBQUVBLE1BQUEsMkJBQUcsWUFBWSxDQUFFLGVBQWpCO0FBQ0UsUUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsUUFFQSxPQUFPLENBQUMsT0FBUixDQUFnQixLQUFoQixDQUZBLENBQUE7QUFBQSxRQUdBLHFCQUFBLENBQXNCLFlBQXRCLEVBQW9DLE9BQXBDLENBSEEsQ0FERjtPQUhGO0tBSEE7QUFXQSxXQUFPLElBQVAsQ0FaTztFQUFBLENBbERUO0NBMUNGLENBQUE7O0FBQUEsT0EwR08sQ0FBQyxNQUFSLENBQWUscURBQWYsRUFBc0UsRUFBdEUsQ0FDRSxDQUFDLE9BREgsQ0FDVyxpQkFEWCxFQUM4QixTQUFBLEdBQUE7U0FBTSxnQkFBTjtBQUFBLENBRDlCLENBMUdBLENBQUE7Ozs7O0FDREE7QUFBQTs7Ozs7Ozs7Ozs7OztHQUFBO0FBQUEsT0FnQk8sQ0FBQyxNQUFSLENBQWUseURBQWYsRUFBMEUsRUFBMUUsQ0FDRSxDQUFDLE9BREgsQ0FDVyxxQkFEWCxFQUNrQztFQUFFLElBQUYsRUFBUSxTQUFDLEVBQUQsR0FBQTtXQUN0QztBQUFBLE1BQUEsc0JBQUEsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxFQUFFLENBQUMsS0FBSCxDQUFBLENBQWIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUZEO01BQUEsQ0FBeEI7QUFBQSxNQUdBLFdBQUEsRUFBYSxTQUFBLEdBQUE7ZUFDWCxJQUFDLENBQUEsU0FBUyxDQUFDLE9BQVgsQ0FBQSxFQURXO01BQUEsQ0FIYjtNQURzQztFQUFBLENBQVI7Q0FEbEMsQ0FoQkEsQ0FBQTs7Ozs7QUNBQTs7QUNBQTtBQUFBOzs7R0FBQTtBQUFBLElBQUEsTUFBQTs7QUFBQSxPQUlBLENBQVEsbUJBQVIsQ0FKQSxDQUFBOztBQUFBLE9BS0EsQ0FBUSx1QkFBUixDQUxBLENBQUE7O0FBQUEsT0FNQSxDQUFRLHFCQUFSLENBTkEsQ0FBQTs7QUFBQSxPQU9BLENBQVEsc0JBQVIsQ0FQQSxDQUFBOztBQUFBLE1BUUEsR0FBUyxPQUFBLENBQVEsZUFBUixDQVJULENBQUE7O0FBQUEsT0FXRSxDQUFDLE1BREgsQ0FDVSxhQURWLEVBQ3lCLENBQ3JCLFdBRHFCLEVBRXJCLFdBRnFCLEVBR3JCLFlBSHFCLEVBS3JCLFFBTHFCLEVBTXJCLFdBTnFCLEVBT3JCLGtCQVBxQixFQVFyQixnQkFScUIsRUFVckIsNEJBVnFCLEVBV3JCLDZCQVhxQixFQVlyQiwyQkFacUIsRUFhckIscUJBYnFCLENBRHpCLENBaUJFLENBQUMsUUFqQkgsQ0FpQlksU0FqQlosRUFpQnVCLE1BQU0sQ0FBQyxPQWpCOUIsQ0FrQkUsQ0FBQyxRQWxCSCxDQWtCWSxVQWxCWixFQWtCd0IsTUFBTSxDQUFDLFFBbEIvQixDQVZBLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSAnLi9pbmRleCdcclxuXHJcbiMjIypcclxuICMgIyBRdWlja3N0YXJ0IEFwcGxpY2F0aW9uXHJcbiMjI1xyXG5jbGFzcyBNYWluQXBwbGljYXRpb25cclxuXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeSAtPlxyXG4gICAgICBhbmd1bGFyLmJvb3RzdHJhcCBkb2N1bWVudCwgWydxdWlja3N0YXJ0QXBwJ10sXHJcbiAgICAgICAgc3RyaWN0RGk6IHRydWVcclxuXHJcbiAgcnVuOiAtPiBbJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJyRodHRwQmFja2VuZCcsICggJHJvb3RTY29wZSwgJHN0YXRlLCAkaHR0cEJhY2tlbmQgKSAtPlxyXG4gICAgJHJvb3RTY29wZS4kc3RhdGUgPSAkc3RhdGVcclxuICAgIFxyXG4gICAgJHJvb3RTY29wZS4kb24gJyRzdGF0ZUNoYW5nZVN0YXJ0JywgKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSA9PlxyXG4gICAgICAjIGNvbnNvbGUubG9nKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSBcclxuICAgICRyb290U2NvcGUuJG9uICckc3RhdGVDaGFuZ2VFcnJvcicsIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgZXJyb3IpIC0+XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIFxyXG4gICAgXHJcbiAgXVxyXG5cclxuICBjb25maWc6IC0+IFsgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckcHJvdmlkZScsICgkdXJsUm91dGVyUHJvdmlkZXIsICRwcm92aWRlKSAtPlxyXG4gICAgXHJcbiAgICAkdXJsUm91dGVyUHJvdmlkZXJcclxuICAgICAgLm90aGVyd2lzZSAnLydcclxuICAgICRwcm92aWRlLmRlY29yYXRvciAnJGV4Y2VwdGlvbkhhbmRsZXInLCBbICckZGVsZWdhdGUnLCAoJGRlbGVnYXRlKSAtPlxyXG4gICAgICAoZXhjZXB0aW9uLCBjYXVzZSkgLT5cclxuICAgICAgICAkZGVsZWdhdGUgZXhjZXB0aW9uLCBjYXVzZVxyXG4gICAgICAgIGVycm9yRGF0YSA9XHJcbiAgICAgICAgICBleGNlcHRpb246IGV4Y2VwdGlvbixcclxuICAgICAgICAgIGNhdXNlOiBjYXVzZVxyXG4gICAgICAgICMjIyMgQFRPRE8gUFJPVklERSBQUk9QUEVSIEhBTkRMSU5HIEFORCBMT0dHSU5HXHJcbiAgICAgICAgY29uc29sZS5lcnJvciAnJGV4Y2VwdGlvbkhhbmRsZXI6OkVSUk9SOicsIGV4Y2VwdGlvbi5tc2csIGVycm9yRGF0YVxyXG4gICAgXVxyXG4gIF1cclxuXHJcbmFwcCA9IG5ldyBNYWluQXBwbGljYXRpb24oKVxyXG5cclxuYW5ndWxhclxyXG4gIC5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAnLFsnYXBwbGljYXRpb24nXSkuY29uZmlnKCBhcHAuY29uZmlnKCkgKS5ydW4gYXBwLnJ1bigpXHJcblxyXG4iLCIjIyMqXHJcbiAjIEBuZ2RvYyBjb250cm9sbGVyXHJcbiAjIEBuYW1lIFN0YXRlQ29udHJvbGxlclxyXG4jIyNcclxuY2xhc3MgU3RhdGVDb250cm9sbGVyXHJcbiAgQCRpbmplY3Q6IFsgJyRzY29wZSddXHJcbiAgY29uc3RydWN0b3I6IChAJHNjb3BlKSAtPlxyXG4gICAgIyBjb25zb2xlLmxvZygncXVpY2tzdGFydEFwcC5zdGF0ZS5jb250cm9sbGVycy5TdGF0ZUNvbnRyb2xsZXInKVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuc3RhdGUuY29udHJvbGxlcnMuU3RhdGVDb250cm9sbGVyJywgW10pXHJcbiAgLmNvbnRyb2xsZXIgJ1N0YXRlQ29udHJvbGxlcicsIFN0YXRlQ29udHJvbGxlclxyXG4iLCJyZXF1aXJlICcuL2NvbnRyb2xsZXJzL3N0YXRlX2NvbnRyb2xsZXInXHJcbiMjIypcclxuICMgIyBxdWlja3N0YXJ0QXBwIC8gc3RhdGVcclxuIyMjXHJcbmFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLnN0YXRlJywgW1xyXG4gICdxdWlja3N0YXJ0QXBwLnN0YXRlLmNvbnRyb2xsZXJzLlN0YXRlQ29udHJvbGxlcidcclxuXSkuY29uZmlnICgkc3RhdGVQcm92aWRlcikgLT5cclxuICAkc3RhdGVQcm92aWRlclxyXG4gICAgLnN0YXRlICdteVN0YXRlJyxcclxuICAgICAgdXJsOiAnLydcclxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvc3RhdGUvdGVtcGxhdGVzL2xheW91dC5odG1sJ1xyXG4gICAgICBjb250cm9sbGVyOiAnU3RhdGVDb250cm9sbGVyJyBcclxuIiwiIyMjKlxyXG4gIyAgQ2FudmFzQ29udHJvbGxlclxyXG4jIyNcclxuXHJcbmNsYXNzIENhbnZhc0NvbnRyb2xsZXIgIFxyXG4gIEAkaW5qZWN0OiBbICckc2NvcGUnLCAnQ2FudmFzU2VydmljZScsICdTcG90U2VydmljZScsICdMaXZlQ2FudmFzU2VydmljZScsICckaW50ZXJ2YWwnLCAnJHdpbmRvdyddXHJcbiAgY29uc3RydWN0b3I6ICggQF9zY29wZSwgQF9DYW52YXNTZXJ2aWNlLCBAX1Nwb3RTZXJ2aWNlLCBAX0xpdmVDYW52YXNTZXJ2aWNlLCAkaW50ZXJ2YWwsIEBfd2luZG93ICkgLT5cclxuICAgIEBfc2NvcGUuc3RvcCA9IHVuZGVmaW5lZFxyXG5cclxuICAgICMjIypcclxuICAgICAqIEhhbmRsZXJzIGZvciBzY29wZSBFVkVOVFNcclxuICAgICMjI1xyXG4gICAgQF9zY29wZS4kb24gJ2NhbnZhczpyZXNpemUnLCBAX2hhbmRsZVJlc2l6ZVxyXG4gICAgQF9zY29wZS4kb24gJ3Nwb3Q6bG9jaycsIEBfaGFuZGxlUmVzZXJ2ZVNwb3RcclxuICAgIEBfc2NvcGUuJG9uICdzcG90OnVubG9jaycsIEBfaGFuZGxlVW5sb2NrU3BvdFxyXG4gICAgQF9zY29wZS4kb24gJ3Nwb3Q6c2F2ZScsIEBfaGFuZGxlRHJhd2luZ1NhdmVcclxuXHJcbiAgICAjIyMqXHJcbiAgICAgKiBTcG90IEhhbmRsZXJzIGZvciBTT0NLRVRTXHJcbiAgICAjIyNcclxuICAgIEBfTGl2ZUNhbnZhc1NlcnZpY2Uub24gJ3Nwb3QudXBkYXRlZCcsIChkYXRhKSA9PlxyXG4gICAgICBjb25zb2xlLmxvZygnTGl2ZUNhbnZhc1NlcnZpY2Ugc3BvdC51cGRhdGVkJywgZGF0YSlcclxuICAgICAgQF9zY29wZS4kYnJvYWRjYXN0ICdzcG90OnVwZGF0ZScsIGRhdGFcclxuXHJcbiAgICBAX0xpdmVDYW52YXNTZXJ2aWNlLm9uICdzcG90LnJlc2VydmVkJywgKGRhdGEpID0+XHJcbiAgICAgIEBfQ2FudmFzU2VydmljZS5yZXNlcnZlU3BvdCBkYXRhLCBAX3Njb3BlLnNwb3RzXHJcblxyXG4gICAgQF9MaXZlQ2FudmFzU2VydmljZS5vbiAnc3BvdC51bnJlc2VydmVkJywgKGRhdGEpID0+XHJcbiAgICAgIGNvbnNvbGUubG9nICdzcG90LnVucmVzZXJ2ZWQnLCBkYXRhXHJcbiAgICAgIEBfQ2FudmFzU2VydmljZS51bnJlc2VydmVTcG90IGRhdGEsIEBfc2NvcGUuc3BvdHNcclxuXHJcbiAgICBAX0xpdmVDYW52YXNTZXJ2aWNlLm9uICdoZWxsbycsIChkYXRhKSA9PlxyXG4gICAgICBjb25zb2xlLmxvZyAnaGVsbG8gZnJvbSAnLCBkYXRhXHJcblxyXG4gICAgIyMjKlxyXG4gICAgICogSGFuZGxlcnMgZm9yIGNhbnZhcyBuYXZpZ2F0aW9uIEZVTkNUSU9OU1xyXG4gICAgIyMjXHJcbiAgICBAX3Njb3BlLnJlZnJlc2hDYW52YXMgPSAocHJvcHMpID0+XHJcbiAgICAgIEBfQ2FudmFzU2VydmljZS5zZXRDb29yZGluYXRlc1xyXG4gICAgICAgIGxhdDogcHJvcHM/LmxhdCA/IDBcclxuICAgICAgICBsb25nOiBwcm9wcz8ubG9uZyAgPyAwXHJcbiAgICAgIEBfZ2V0U3BvdHNcclxuICAgICAgICBoZWlnaHQ6IEBfd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICAgICAgd2lkdGg6IEBfd2luZG93LmlubmVyV2lkdGhcclxuXHJcbiAgICBAX3Njb3BlLmFkZFJvd0ludGVydmFsID0gKG9wdHMpID0+XHJcbiAgICAgIHRpY2sgPSA9PiBcclxuICAgICAgICBAX2FkZFJvdyhvcHRzKVxyXG4gICAgICBAX3Njb3BlLnN0b3AgPSAkaW50ZXJ2YWwoIHRpY2ssIDUwMClcclxuXHJcbiAgICBAX3Njb3BlLmFkZENvbHVtbkludGVydmFsID0gKG9wdHMpID0+XHJcbiAgICAgIHRpY2sgPSA9PiBcclxuICAgICAgICBAX2FkZENvbHVtbihvcHRzKVxyXG4gICAgICBAX3Njb3BlLnN0b3AgPSAkaW50ZXJ2YWwoIHRpY2ssIDUwMClcclxuXHJcbiAgICBAX3Njb3BlLnN0b3BJbnRlcnZhbCA9ID0+XHJcbiAgICAgIGlmIGFuZ3VsYXIuaXNEZWZpbmVkIEBfc2NvcGUuc3RvcCBcclxuICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsIEBfc2NvcGUuc3RvcFxyXG4gICAgICAgIEBfc2NvcGUuc3RvcCA9IHVuZGVmaW5lZFxyXG5cclxuICAgIEBfc2NvcGUuem9vbUluID0gPT5cclxuICAgICAgQF9DYW52YXNTZXJ2aWNlLmluY3JlYXNlUHJvcG9ydGlvbnMoKVxyXG4gICAgICBAX3Njb3BlLnJlZnJlc2hDYW52YXMgQF9zY29wZS5nZXRDdXJyZW50UG9zaXRpb24oKVxyXG4gICAgICAgIFxyXG4gICAgQF9zY29wZS56b29tT3V0ID0gPT5cclxuICAgICAgQF9DYW52YXNTZXJ2aWNlLmRlY3JlYXNlUHJvcG9ydGlvbnMoKVxyXG4gICAgICBAX3Njb3BlLnJlZnJlc2hDYW52YXMgQF9zY29wZS5nZXRDdXJyZW50UG9zaXRpb24oKVxyXG5cclxuICAgIEBfc2NvcGUuZ2V0Q3VycmVudFBvc2l0aW9uID0gPT5cclxuICAgICAgbGF0OiBAX3Njb3BlLnNwb3RzLnJvd3NbMF0udGlsZXNbMF0ueFxyXG4gICAgICBsb25nOiBAX3Njb3BlLnNwb3RzLnJvd3NbMF0udGlsZXNbMF0ueVxyXG5cclxuICBfaGFuZGxlRHJhd2luZ1NhdmU6IChldmVudCwgZGF0YSkgPT5cclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICBjb25zb2xlLmxvZyAnQ2FudmFzQ29udHJvbGxlciBzcG90OnNhdmUnLCBkYXRhXHJcbiAgICBAX3Njb3BlLiRicm9hZGNhc3QgJ3Nwb3Q6dXBkYXRlJywgZGF0YVxyXG4gICAgQF9TcG90U2VydmljZS5zYXZlRGF0YSBkYXRhXHJcblxyXG4gICAgQF9MaXZlQ2FudmFzU2VydmljZS5lbWl0ICdzcG90LnVwZGF0ZScsIGRhdGFcclxuXHJcbiAgX2hhbmRsZVJlc2VydmVTcG90OiAoZXZlbnQsIGRhdGEpID0+XHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgQF9MaXZlQ2FudmFzU2VydmljZS5lbWl0ICdzcG90LmxvY2snLCBkYXRhICBcclxuICBcclxuICBfaGFuZGxlVW5sb2NrU3BvdDogKGV2ZW50LCBkYXRhKSA9PlxyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgIEBfTGl2ZUNhbnZhc1NlcnZpY2UuZW1pdCAnc3BvdC51bmxvY2snLCBkYXRhXHJcbiAgICBAX3Njb3BlLiRhcHBseSA9PlxyXG4gICAgICBAX0NhbnZhc1NlcnZpY2UudW5yZXNlcnZlU3BvdCBkYXRhLCBAX3Njb3BlLnNwb3RzXHJcblxyXG4gIF9oYW5kbGVSZXNpemU6IChldmVudCwgZGF0YSkgPT5cclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICBAX3Njb3BlLnJlZnJlc2hDYW52YXMoKVxyXG5cclxuICBfZ2V0U3BvdHM6IChwcm9wcykgPT5cclxuICAgIEBfc2NvcGUuc3BvdHMgPSBAX0NhbnZhc1NlcnZpY2UuZ2V0U3BvdHNGb3JQcm9wb3J0aW9ucyBwcm9wc1xyXG5cclxuICBfYWRkUm93OiAoZGlyZWN0aW9uKSA9PlxyXG4gICAgQF9DYW52YXNTZXJ2aWNlLmFkZFJvdyBAX3Njb3BlLnNwb3RzLCBkaXJlY3Rpb25cclxuXHJcbiAgX2FkZENvbHVtbjogKGRpcmVjdGlvbikgPT5cclxuICAgIEBfQ2FudmFzU2VydmljZS5hZGRDb2x1bW4gQF9zY29wZS5zcG90cywgZGlyZWN0aW9uXHJcblxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuY29tbW9uLmNhbnZhcy5jb250cm9sbGVycy5DYW52YXNDb250cm9sbGVyJywgW10pXHJcbiAgLmNvbnRyb2xsZXIgJ0NhbnZhc0NvbnRyb2xsZXInLCBDYW52YXNDb250cm9sbGVyIiwiYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuY29tbW9uLmNhbnZhcy5kaXJlY3RpdmVzLkNhbnZhc0RpcmVjdGl2ZScsIFtdKVxyXG4gIC5kaXJlY3RpdmUgJ21hZ2ljQ2FudmFzJywgKCRyb290U2NvcGUsICR3aW5kb3cpIC0+XHJcbiAgICByZXN0cmljdDogJ0UnXHJcbiAgICBjb250cm9sbGVyOiAnQ2FudmFzQ29udHJvbGxlcidcclxuICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2NhbnZhcy90ZW1wbGF0ZXMvbGF5b3V0Lmh0bWwnXHJcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW0sIGF0dHIpIC0+XHJcbiAgICAgIF9oYW5kbGVSZXNpemUgPSAtPlxyXG4gICAgICAgIHNjb3BlLiRlbWl0ICdjYW52YXM6cmVzaXplJ1xyXG4gICAgICAgIGVsZW0uZmluZCgnLmNhbnZhc193cmFwcGVyJykuY3NzXHJcbiAgICAgICAgICBoZWlnaHQ6ICR3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgICAgICAgIHdpZHRoOiAkd2luZG93LmlubmVyV2lkdGhcclxuXHJcbiAgICAgIF9hcHBseVJlc2l6ZWQgPSA9PlxyXG4gICAgICAgIHNjb3BlLiRhcHBseSBfaGFuZGxlUmVzaXplXHJcblxyXG4gICAgICBfaGFuZGxlUmVzaXplKClcclxuXHJcbiAgICAgIGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kICdyZXNpemUnLCBfLnRocm90dGxlIF9hcHBseVJlc2l6ZWQgLCAxMDAwIiwicmVxdWlyZSAnLi9jb250cm9sbGVycy9jYW52YXNfY29udHJvbGxlcidcclxucmVxdWlyZSAnLi9zZXJ2aWNlcy9jYW52YXNfc2VydmljZSdcclxucmVxdWlyZSAnLi9zZXJ2aWNlcy9saXZlX2NhbnZhc19zZXJ2aWNlJ1xyXG5yZXF1aXJlICcuL2RpcmVjdGl2ZXMvY2FudmFzX2RpcmVjdGl2ZSdcclxuXHJcbiMjIypcclxuICMgQG5hbWUgY2FudmFzXHJcbiMjI1xyXG5cclxuYW5ndWxhci5tb2R1bGUgJ3F1aWNrc3RhcnRBcHAuY29tbW9uLmNhbnZhcycsIFtcclxuICAncXVpY2tzdGFydEFwcC5jb21tb24uY2FudmFzLnNlcnZpY2VzLkNhbnZhc1NlcnZpY2UnXHJcblx0J3F1aWNrc3RhcnRBcHAuY29tbW9uLmNhbnZhcy5zZXJ2aWNlcy5MaXZlQ2FudmFzU2VydmljZSdcclxuXHQncXVpY2tzdGFydEFwcC5jb21tb24uY2FudmFzLmNvbnRyb2xsZXJzLkNhbnZhc0NvbnRyb2xsZXInXHJcblx0J3F1aWNrc3RhcnRBcHAuY29tbW9uLmNhbnZhcy5kaXJlY3RpdmVzLkNhbnZhc0RpcmVjdGl2ZSdcclxuXSBcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuY29tbW9uLmNhbnZhcy5zZXJ2aWNlcy5DYW52YXNTZXJ2aWNlJywgW10pXHJcbiAgLnNlcnZpY2UgJ0NhbnZhc1NlcnZpY2UnLCBjbGFzcyBDYW52YXNcclxuICAgIF9Qcm9wb3J0aW9uczpcclxuICAgICAgd2lkdGg6IDE1MFxyXG4gICAgICBoZWlnaHQ6IDE5NFxyXG4gICAgX2Nvb3Jkb25hdGVzOiBcclxuICAgICAgbGF0OiAwXHJcbiAgICAgIGxvbmc6IDBcclxuXHJcbiAgICBpbmNyZWFzZVByb3BvcnRpb25zOiA9PlxyXG4gICAgICBAX1Byb3BvcnRpb25zLndpZHRoICs9IDEwXHJcbiAgICAgIEBfUHJvcG9ydGlvbnMuaGVpZ2h0ICs9IDE0XHJcblxyXG4gICAgZGVjcmVhc2VQcm9wb3J0aW9uczogPT5cclxuICAgICAgQF9Qcm9wb3J0aW9ucy53aWR0aCAtPSAxNVxyXG4gICAgICBAX1Byb3BvcnRpb25zLmhlaWdodCAtPSAyMVxyXG5cclxuICAgIHJlc2VydmVTcG90OiAoc3BvdCwgc3BvdHMpID0+XHJcbiAgICAgIGZvciByb3cgaW4gc3BvdHMucm93c1xyXG4gICAgICAgIGZvciB0aWxlIGluIHJvdy50aWxlc1xyXG4gICAgICAgICAgaWYgdGlsZS55IGlzIHNwb3QueSBhbmQgdGlsZS54IGlzIHNwb3QueFxyXG4gICAgICAgICAgICB0aWxlLnN0YXR1cyA9ICdyZXNlcnZlZCdcclxuXHJcbiAgICB1bnJlc2VydmVTcG90OiAoc3BvdCwgc3BvdHMpID0+XHJcbiAgICAgIGNvbnNvbGUubG9nICdDYW52YXNTZXJ2aWNlJywgc3BvdCwgc3BvdHNcclxuICAgICAgZm9yIHJvdyBpbiBzcG90cy5yb3dzXHJcbiAgICAgICAgZm9yIHRpbGUgaW4gcm93LnRpbGVzXHJcbiAgICAgICAgICBpZiB0aWxlLnkgaXMgc3BvdC55IGFuZCB0aWxlLnggaXMgc3BvdC54XHJcbiAgICAgICAgICAgIHRpbGUuc3RhdHVzID0gJ2ZyZWUnXHJcblxyXG4gICAgYWRkUm93OiAoc3BvdHMsIGRpcmVjdGlvbikgPT5cclxuICAgICAgY29uc29sZS5sb2cgc3BvdHMsIGRpcmVjdGlvblxyXG4gICAgICBpZiBkaXJlY3Rpb24gaXMgJ3VwJ1xyXG4gICAgICAgICAgc3BvdHMucm93cy51bnNoaWZ0XHJcbiAgICAgICAgICAgIHRpbGVzOiBfLm1hcCBfLmZpcnN0KHNwb3RzLnJvd3MpLnRpbGVzLCAodGlsZSxpKSA9PlxyXG4gICAgICAgICAgICAgIHk6IHRpbGUueS0xXHJcbiAgICAgICAgICAgICAgeDogdGlsZS54XHJcbiAgICAgICAgICAgICAgaGVpZ2h0OiBAX1Byb3BvcnRpb25zLmhlaWdodFxyXG4gICAgICAgICAgICAgIHdpZHRoOiBAX1Byb3BvcnRpb25zLndpZHRoXHJcbiAgICAgICAgICBzcG90cy5yb3dzLnBvcCgpXHJcbiAgICAgIGlmIGRpcmVjdGlvbiBpcyAnZG93bidcclxuICAgICAgICAgIHNwb3RzLnJvd3MucHVzaFxyXG4gICAgICAgICAgICB0aWxlczogXy5tYXAgXy5sYXN0KHNwb3RzLnJvd3MpLnRpbGVzLCAodGlsZSxpKSA9PlxyXG4gICAgICAgICAgICAgIHk6IHRpbGUueSsxXHJcbiAgICAgICAgICAgICAgeDogdGlsZS54XHJcbiAgICAgICAgICAgICAgaGVpZ2h0OiBAX1Byb3BvcnRpb25zLmhlaWdodFxyXG4gICAgICAgICAgICAgIHdpZHRoOiBAX1Byb3BvcnRpb25zLndpZHRoXHJcbiAgICAgICAgICBzcG90cy5yb3dzLnNoaWZ0KClcclxuXHJcbiAgICBhZGRDb2x1bW46IChzcG90cywgZGlyZWN0aW9uKSA9PlxyXG4gICAgICBpZiBkaXJlY3Rpb24gaXMgJ3JpZ2h0J1xyXG4gICAgICAgIF8ubWFwIHNwb3RzLnJvd3MsIChyb3csaSkgPT5cclxuICAgICAgICAgIHJvdy50aWxlcy5wdXNoXHJcbiAgICAgICAgICAgIHg6IF8ubGFzdChyb3cudGlsZXMpLngrMVxyXG4gICAgICAgICAgICB5OiBfLmZpcnN0KHJvdy50aWxlcykueVxyXG4gICAgICAgICAgICBoZWlnaHQ6IEBfUHJvcG9ydGlvbnMuaGVpZ2h0XHJcbiAgICAgICAgICAgIHdpZHRoOiBAX1Byb3BvcnRpb25zLndpZHRoXHJcbiAgICAgICAgICByb3cudGlsZXMuc2hpZnQoKVxyXG4gICAgICBlbHNlIGlmIGRpcmVjdGlvbiBpcyAnbGVmdCdcclxuICAgICAgICBfLm1hcCBzcG90cy5yb3dzLCAocm93LGkpID0+XHJcbiAgICAgICAgICByb3cudGlsZXMudW5zaGlmdFxyXG4gICAgICAgICAgICB4OiBfLmZpcnN0KHJvdy50aWxlcykueC0xXHJcbiAgICAgICAgICAgIHk6IF8uZmlyc3Qocm93LnRpbGVzKS55XHJcbiAgICAgICAgICAgIGhlaWdodDogQF9Qcm9wb3J0aW9ucy5oZWlnaHRcclxuICAgICAgICAgICAgd2lkdGg6IEBfUHJvcG9ydGlvbnMud2lkdGhcclxuICAgICAgICAgIHJvdy50aWxlcy5wb3AoKVxyXG5cclxuICAgIHNldENvb3JkaW5hdGVzOiAocHJvcHMpID0+XHJcbiAgICAgIEBfY29vcmRvbmF0ZXMubGF0ID0gcHJvcHMubGF0XHJcbiAgICAgIEBfY29vcmRvbmF0ZXMubG9uZyA9IHByb3BzLmxvbmdcclxuXHJcbiAgICBnZXRTcG90c0ZvclByb3BvcnRpb25zOiAocHJvcHMpID0+XHJcbiAgICAgICMgcm93cyA9IDEwXHJcbiAgICAgICMgdGlsZXNQZXJSb3cgPSAyMFxyXG4gICAgICByb3dzID0gTWF0aC5mbG9vcihwcm9wcy5oZWlnaHQgLyBAX1Byb3BvcnRpb25zLmhlaWdodClcclxuICAgICAgdGlsZXNQZXJSb3cgPSBNYXRoLmZsb29yKHByb3BzLndpZHRoIC8gQF9Qcm9wb3J0aW9ucy53aWR0aClcclxuICAgICAgcm93czogZm9yIGkgaW4gW0BfY29vcmRvbmF0ZXMubG9uZy4uLkBfY29vcmRvbmF0ZXMubG9uZytyb3dzXVxyXG4gICAgICAgIHRpbGVzOiBmb3IgaiBpbiBbQF9jb29yZG9uYXRlcy5sYXQuLi5AX2Nvb3Jkb25hdGVzLmxhdCt0aWxlc1BlclJvd11cclxuICAgICAgICAgIHg6IGpcclxuICAgICAgICAgIHk6IGlcclxuICAgICAgICAgIGhlaWdodDogQF9Qcm9wb3J0aW9ucy5oZWlnaHRcclxuICAgICAgICAgIHdpZHRoOiBAX1Byb3BvcnRpb25zLndpZHRoXHJcbiAgICAgICAgICBzdGF0dXM6ICdsb2FkaW5nJ1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5jb21tb24uY2FudmFzLnNlcnZpY2VzLkxpdmVDYW52YXNTZXJ2aWNlJywgW10pXHJcbiAgLmZhY3RvcnkgJ0xpdmVDYW52YXNTZXJ2aWNlJywgWydzb2NrZXRGYWN0b3J5JyAsICdCQVNFVVJMJywgKHNvY2tldEZhY3RvcnksIEJBU0VVUkwpIC0+XHJcbiAgICBpb1NvY2tldCA9IGlvLmNvbm5lY3QgXCIje0JBU0VVUkx9L0xpdmVDYW52YXNcIlxyXG4gICAgcmFuZG9tUm9vbVNvY2tldCA9IHNvY2tldEZhY3RvcnlcclxuICAgICAgaW9Tb2NrZXQ6IGlvU29ja2V0XHJcbiAgICByZXR1cm4gcmFuZG9tUm9vbVNvY2tldFxyXG4gIF1cclxuIiwiIyMjKlxyXG4gIyAgU3BvdENvbnRyb2xsZXJcclxuIyMjXHJcblxyXG5jbGFzcyBTcG90Q29udHJvbGxlciAgXHJcbiAgQCRpbmplY3Q6IFsgJyRzY29wZScsICdTcG90U2VydmljZScgXVxyXG4gIGNvbnN0cnVjdG9yOiAoIEBfc2NvcGUsIEBfU3BvdFNlcnZpY2UgKSAtPlxyXG4gICAgQF9zY29wZS5kYXRhID0gQF9nZXREYXRhKClcclxuXHJcbiAgICBAX3Njb3BlLiRvbiAnZHJhd2luZzpzYXZlJywgKGV2ZW50LCBkYXRhKSA9PlxyXG4gICAgICBjb25zb2xlLmxvZyAnc3BvdENvbnRyb2xlciBkcmF3aW5nOnNhdmUnLCBkYXRhXHJcbiAgICAgIEBfc2NvcGUuJGVtaXQgJ3Nwb3Q6c2F2ZScsIGRhdGFcclxuICAgICAgXHJcbiAgICBAX3Njb3BlLiRvbiAnc3BvdDp1cGRhdGUnLCAoZXZlbnQsIGRhdGEpID0+XHJcbiAgICAgIGlmIGRhdGEuaFBvcyBpcyBAX3Njb3BlLnNwb3RPcHRzLnggYW5kIGRhdGEudlBvcyBpcyBAX3Njb3BlLnNwb3RPcHRzLnlcclxuICAgICAgICBjb25zb2xlLmxvZyAnc3BvdENvbnRyb2xlciBzcG90OnVwZGF0ZWQnLCBkYXRhXHJcbiAgICAgICAgQF9zY29wZS4kYnJvYWRjYXN0ICdkcmF3OmRhdGEnLCBkYXRhLmRyYXdpbmdEYXRhVXJsXHJcblxyXG4gICAgQF9zY29wZS5kYXRhLnRoZW4gKHJlcykgPT5cclxuICAgICAgaWYgcmVzLmRhdGE/LmRyYXdpbmdEYXRhVXJsXHJcbiAgICAgICAgQF9zY29wZS4kYnJvYWRjYXN0ICdkcmF3OmRhdGEnLCByZXMuZGF0YS5kcmF3aW5nRGF0YVVybFxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgQF9zY29wZS4kYnJvYWRjYXN0ICdmcmVlOmRhdGEnLCByZXNcclxuXHJcbiAgX2dldERhdGE6ID0+XHJcbiAgICBAX1Nwb3RTZXJ2aWNlLmdldERhdGEgXHJcbiAgICAgIGhQb3M6IEBfc2NvcGUuc3BvdE9wdHMueCBcclxuICAgICAgdlBvczogQF9zY29wZS5zcG90T3B0cy55XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdC5jb250cm9sbGVycy5TcG90Q29udHJvbGxlcicsIFtdKVxyXG4gIC5jb250cm9sbGVyICdTcG90Q29udHJvbGxlcicsIFNwb3RDb250cm9sbGVyIiwiYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnNwb3QuZGlyZWN0aXZlcy5DYW52YXNTcG90RGlyZWN0aXZlJywgW10pXHJcbiAgLmRpcmVjdGl2ZSAnY2FudmFzU3BvdCcsICgkcm9vdFNjb3BlLCAkY29tcGlsZSwgJG1vZGFsLCAkd2luZG93LCBCQVNFSE9TVCkgLT5cclxuICAgIHJlc3RyaWN0OiAnQSdcclxuICAgIGxpbms6IChzY29wZSwgZWxlbSwgYXR0cikgLT5cclxuXHJcbiAgICAgICMjIypcclxuICAgICAgICogW3Njb3BlIE1FVEhPRFNdXHJcbiAgICAgICMjI1xyXG4gICAgICBzY29wZS5fbGlzdGVuRm9yRHJhd2luZyA9IChldmVudCkgPT5cclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgY29uc29sZS5sb2cgJ19saXN0ZW5Gb3JEcmF3aW5nJ1xyXG4gICAgICAgIHNjb3BlLiRicm9hZGNhc3QgJ2RyYXdpbmc6c2F2ZScsIFxyXG4gICAgICAgICAgaFBvczogc2NvcGUuc3BvdE9wdHMueFxyXG4gICAgICAgICAgdlBvczogc2NvcGUuc3BvdE9wdHMueVxyXG4gICAgICAgICAgZHJhd2luZ0RhdGFVcmw6IGV2ZW50LmRhdGFcclxuXHJcbiAgICAgIHNjb3BlLl9vcGVuRHJhd2luZ0ZyYW1lID0gKGRhdGEpID0+XHJcbiAgICAgICAgJG1vZGFsXHJcbiAgICAgICAgICB0aXRsZTogJ2RyYXdpbmcgZnJhbWUnXHJcbiAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICBhbmltYXRpb246ICdhbS1mYWRlLWFuZC1zY2FsZSdcclxuICAgICAgICAgIGJhY2tkcm9wQW5pbWF0aW9uOiAnYW0tZmFkZSdcclxuICAgICAgICAgIGNvbnRlbnRUZW1wbGF0ZTogJ2NvbW1vbi9zcG90L3RlbXBsYXRlcy9kcmF3X2NhbnZhc19mcmFtZS5odG1sJ1xyXG4gICAgICAgICAgc2NvcGU6IHNjb3BlXHJcblxyXG4gICAgICBzY29wZS5zYXZlRHJhd2luZyA9IChkYXRhKSA9PlxyXG4gICAgICAgICMgJHdpbmRvdy5mcmFtZXNbMF0ucG9zdE1lc3NhZ2UgJ3NhdmUuZnJhbWUnLCAnaHR0cDovLzE4NGRmNjlmLm5ncm9rLmNvbSdcclxuICAgICAgICAkd2luZG93LmZyYW1lc1swXS5wb3N0TWVzc2FnZSAnc2F2ZS5mcmFtZScsIEJBU0VIT1NUXHJcblxyXG4gICAgICBzY29wZS5fdW5yZXNlcnZlU3BvdCA9IChkYXRhKSA9PlxyXG4gICAgICAgIHNjb3BlLiRlbWl0ICdzcG90OnVubG9jaycsIGRhdGFcclxuXHJcbiAgICAgIHNjb3BlLl9yZXNlcnZlU3BvdCA9IChkYXRhKSA9PlxyXG4gICAgICAgIHNjb3BlLiRlbWl0ICdzcG90OmxvY2snLCBkYXRhXHJcblxyXG4gICAgICAjIyMqXHJcbiAgICAgICAqIFtzY29wZSBIQU5ETEVSU11cclxuICAgICAgIyMjXHJcbiAgICAgIHNjb3BlLiRvbiAnbW9kYWwuc2hvdycsIChldmVudCkgPT5cclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAnbWVzc2FnZScsIHNjb3BlLl9saXN0ZW5Gb3JEcmF3aW5nXHJcbiAgICAgICAgICBcclxuICAgICAgc2NvcGUuJG9uICdtb2RhbC5oaWRlJywgKGV2ZW50LCBkYXRhKSA9PlxyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgJHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyICdtZXNzYWdlJywgc2NvcGUuX2xpc3RlbkZvckRyYXdpbmdcclxuICAgICAgICBzY29wZS5fdW5yZXNlcnZlU3BvdCBzY29wZS5zcG90T3B0c1xyXG5cclxuICAgICAgc2NvcGUuJG9uICdzcG90OmNvbm5lY3QnLCAoZXZlbnQsIGRhdGEpID0+XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICBzY29wZS5zcG90T3B0cyA9IGRhdGEuc3BvdE9wdHNcclxuICAgICAgICBzY29wZS5fcmVzZXJ2ZVNwb3QoZGF0YS5zcG90T3B0cylcclxuICAgICAgICBzY29wZS5fb3BlbkRyYXdpbmdGcmFtZShkYXRhLnNwb3RPcHRzKVxyXG5cclxuXHJcbiAgICAgIFxyXG4iLCJhbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdC5kaXJlY3RpdmVzLkRyYXdpbmdDYW52YXNEaXJlY3RpdmUnLCBbXSlcclxuICAuZGlyZWN0aXZlICdkcmF3aW5nQ2FudmFzJywgKCRyb290U2NvcGUsICRjb21waWxlLCAkd2luZG93KSAtPlxyXG4gICAgcmVzdHJpY3Q6ICdFJ1xyXG4gICAgIyB0ZW1wbGF0ZTogJycnPGRpdj48Y2FudmFzIGlkPVwiZHJhd2luZ0NhbnZhc1wiIHdpZHRoPVwiNTAwXCIgaGVpZ2h0PVwiNzAwXCI+IDwvY2FudmFzPjwvZGl2PicnJ1xyXG4gICAgdGVtcGxhdGU6ICcnJzxkaXY+PGlmcmFtZSBjbGFzcz1cImRyYXdpbmdDYW52YXNGcmFtZVwiIHdpZHRoPVwiNTUwXCIgaGVpZ2h0PVwiNzExXCIgc3JjPVwiaGFybW9ueV9jYW52YXMvaW5kZXguaHRtbFwiPiA8L2lmcmFtZT48L2Rpdj4nJydcclxuICAgIGxpbms6IChzY29wZSwgZWxlbSwgYXR0cikgLT5cclxuICAgICAgXHJcbiAgICAgIHNjb3BlLl9pbml0RHJhd2luZ1BhZCA9ID0+XHJcbiAgICAgICAgaVdpbmRvdyA9IGVsZW0uZmluZCgnLmRyYXdpbmdDYW52YXNGcmFtZScpICAgICAgICBcclxuXHJcbiAgICAgIHNjb3BlLl9pbml0RHJhd2luZ1BhZCgpXHJcbiIsImFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5zcG90LmRpcmVjdGl2ZXMuU3BvdERpcmVjdGl2ZScsIFtdKVxyXG4gIC5kaXJlY3RpdmUgJ3Nwb3RUaWxlJywgKCRyb290U2NvcGUpIC0+XHJcbiAgICByZXN0cmljdDogJ0UnXHJcbiAgICBzY29wZTpcclxuICAgICAgc3BvdE9wdHM6ICc9J1xyXG4gICAgY29udHJvbGxlcjogJ1Nwb3RDb250cm9sbGVyJ1xyXG4gICAgdGVtcGxhdGVVcmw6ICdjb21tb24vc3BvdC90ZW1wbGF0ZXMvbGF5b3V0Lmh0bWwnXHJcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW0sIGF0dHIpIC0+XHJcblxyXG4gICAgICBlbGVtLmJpbmQgJ21vdXNlb3ZlcicsIC0+XHJcbiAgICAgICAgaWYgc2NvcGUuc3BvdE9wdHMuc3RhdHVzIGlzICdmcmVlJ1xyXG4gICAgICAgICAgZWxlbS5hZGRDbGFzcyAnaG92ZXJlZCdcclxuXHJcbiAgICAgIGVsZW0uYmluZCAnbW91c2VsZWF2ZScsIC0+XHJcbiAgICAgICAgZWxlbS5yZW1vdmVDbGFzcyAnaG92ZXJlZCdcclxuICAgICAgXHJcbiAgICAgIHNjb3BlLiR3YXRjaCAnc3BvdE9wdHMuc3RhdHVzJywgKCBuZXdWYWwsIG9sZFZhbCApID0+XHJcbiAgICAgICAgaWYgbmV3VmFsPyBhbmQgbmV3VmFsIGlzbnQgb2xkVmFsXHJcbiAgICAgICAgICBzd2l0Y2ggbmV3VmFsXHJcbiAgICAgICAgICAgIHdoZW4gJ3Jlc2VydmVkJ1xyXG4gICAgICAgICAgICAgIGVsZW0uZmluZCgnLmRyYXdpbmcnKS5hZGRDbGFzcygnY29ubmVjdGVkJylcclxuICAgICAgICAgICAgd2hlbiAnZnJlZSdcclxuICAgICAgICAgICAgICBlbGVtLmZpbmQoJy5kcmF3aW5nJykucmVtb3ZlQ2xhc3MoJ2Nvbm5lY3RlZCcpXHJcblxyXG4gICAgICBzY29wZS5jb25uZWN0RnJhbWUgPSA9PlxyXG4gICAgICAgICMgZWxlbS5maW5kKCcuZHJhd2luZycpLnRvZ2dsZUNsYXNzKCdjb25uZWN0ZWQnKVxyXG4gICAgICAgIHNjb3BlLiRlbWl0ICdzcG90OmNvbm5lY3QnLCBcclxuICAgICAgICAgIHNjb3BlUmVmOiBzY29wZVxyXG4gICAgICAgICAgc3BvdE9wdHM6IHNjb3BlLnNwb3RPcHRzXHJcbiAgICAgICAgbnVsbFxyXG5cclxuICAgICAgc2NvcGUuJG9uICdmcmVlOmRhdGEnLCAoZXZlbnQsIGRhdGEpID0+XHJcbiAgICAgICAgY29uc29sZS5sb2cgJ2ZyZWU6ZGF0YScsIGRhdGFcclxuICAgICAgICBzY29wZS5zcG90T3B0cy5zdGF0dXMgPSAnZnJlZSdcclxuICAgICAgICBcclxuICAgICAgc2NvcGUuJG9uICdkcmF3OmRhdGEnLCAoZXZlbnQsIGRhdGEpID0+XHJcbiAgICAgICAgc2NvcGUuc3BvdE9wdHMuc3RhdHVzID0gJ2RyYXdpbmcnXHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGVsZW0udW5iaW5kKClcclxuICAgICAgICBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgIGltZy5jbGFzc05hbWUgPSAnZHJhd2luZydcclxuICAgICAgICBpbWcuc3JjID0gZGF0YVxyXG4gICAgICAgIGVsZW0uZmluZCgnLmRyYXdpbmcnKS5yZW1vdmVDbGFzcygnY29ubmVjdGVkJylcclxuICAgICAgICBlbGVtLmZpbmQoJy5kcmF3aW5nQ2FudmFzJykuaHRtbChpbWcpXHJcbiAgICAgICAgIyBlbGVtLmZpbmQoJy5kcmF3aW5nJykuYWRkQ2xhc3MoJ2Nvbm5lY3RlZCcpXHJcbiIsInJlcXVpcmUgJy4vY29udHJvbGxlcnMvc3BvdF9jb250cm9sbGVyJ1xyXG5yZXF1aXJlICcuL3NlcnZpY2VzL3Nwb3Rfc2VydmljZSdcclxucmVxdWlyZSAnLi9kaXJlY3RpdmVzL3Nwb3RfZGlyZWN0aXZlJ1xyXG5yZXF1aXJlICcuL2RpcmVjdGl2ZXMvY2FudmFzX3Nwb3RfZGlyZWN0aXZlJ1xyXG5yZXF1aXJlICcuL2RpcmVjdGl2ZXMvZHJhd2luZ19jYW52YXNfZGlyZWN0aXZlJ1xyXG4jIyMqXHJcbiAjIEBuYW1lIHNwb3RcclxuIyMjXHJcbmFuZ3VsYXIubW9kdWxlICdxdWlja3N0YXJ0QXBwLmNvbW1vbi5zcG90JywgW1xyXG5cdCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5zcG90LnNlcnZpY2VzLlNwb3RTZXJ2aWNlJ1xyXG5cdCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5zcG90LmNvbnRyb2xsZXJzLlNwb3RDb250cm9sbGVyJ1xyXG4gICdxdWlja3N0YXJ0QXBwLmNvbW1vbi5zcG90LmRpcmVjdGl2ZXMuU3BvdERpcmVjdGl2ZSdcclxuICAncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdC5kaXJlY3RpdmVzLkNhbnZhc1Nwb3REaXJlY3RpdmUnXHJcblx0J3F1aWNrc3RhcnRBcHAuY29tbW9uLnNwb3QuZGlyZWN0aXZlcy5EcmF3aW5nQ2FudmFzRGlyZWN0aXZlJ1xyXG5dIFxyXG4iLCJhbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdC5zZXJ2aWNlcy5TcG90U2VydmljZScsIFtdKVxyXG4gIC5mYWN0b3J5ICdTcG90U2VydmljZScsICgkaHR0cCwgQkFTRVVSTCkgLT5cclxuICAgIFxyXG4gICAgc2F2ZURhdGE6IChkYXRhKSAtPlxyXG4gICAgICAkaHR0cC5wb3N0IFwiI3tCQVNFVVJMfS9hcGkvc3BvdC9cIiwgZGF0YTogZGF0YVxyXG5cclxuICAgIGdldERhdGE6IChvcHRzKSAtPlxyXG4gICAgICAkaHR0cFxyXG4gICAgICAgIHVybDpcIiN7QkFTRVVSTH0vYXBpL3Nwb3QvXCJcclxuICAgICAgICBwYXJhbXM6IG9wdHNcclxuICAgICAgICAjIGNhY2hlOiB0cnVlIFxyXG4iLCJyZXF1aXJlICcuL3NlcnZpY2VzL21vZHVsZV9leHRlbnNpb24nXHJcbnJlcXVpcmUgJy4vc2VydmljZXMvb2JzZXJ2YWJsZV9taXhpbidcclxucmVxdWlyZSAnLi9zZXJ2aWNlcy9yZXF1ZXN0X2Fib3J0ZXJfc2VydmljZSdcclxuXHJcblxyXG5hbmd1bGFyLm1vZHVsZSAncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMnLCBbXHJcbiAgJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnV0aWxzLnNlcnZpY2VzLk1vZHVsZSdcclxuICAncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMuc2VydmljZXMuT2JzZXJ2YWJsZU1peGluJ1xyXG4gICdxdWlja3N0YXJ0QXBwLmNvbW1vbi51dGlscy5zZXJ2aWNlcy5SZXF1ZXN0QWJvcnRlck1peGluJ1xyXG5dXHJcbiIsIiMjI1xyXG4gICAgQW4gb2JqZWN0IHRoYXQgYWRkcyBleHRyYSBmdW5jdGlvbmFsaXR5IHRvIGEgYmFzaWMgY2xhc3NcclxuIyMjXHJcbmFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi51dGlscy5zZXJ2aWNlcy5Nb2R1bGUnLCBbXSlcclxuICAuZmFjdG9yeSAnTW9kdWxlJywgKCkgLT4gY2xhc3MgTW9kdWxlXHJcbiAgICAjIyNcclxuICAgICAgICBBdHRhY2hlcyBldmVyeSBwcm9wZXJ0eSBvZiB0aGUgb2JqIGRpcmVjdGx5IG9uIHRoZSBmdW5jdGlvbiBjb25zdHJ1Y3RvclxyXG5cclxuICAgICAgICBAcGFyYW0gW09iamVjdF0gb2JqIGFuZCBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBleHRlbnNpb24gcHJvcGVydGllc1xyXG4gICAgIyMjXHJcbiAgICBAZXh0ZW5kOiAob2JqKSAtPlxyXG4gICAgICBmb3Iga2V5LCB2YWx1ZSBvZiBvYmogd2hlbiBrZXkgbm90IGluIFsnZXh0ZW5kJywnaW5jbHVkZSddXHJcbiAgICAgICAgQFtrZXldID0gdmFsdWVcclxuICAgICAgb2JqLmV4dGVuZGVkPy5hcHBseShAKVxyXG4gICAgICB0aGlzXHJcblxyXG4gICAgIyMjXHJcbiAgICAgICAgQXR0YWNoZXMgZXZlcnkgcHJvcGVydHkgb2YgdGhlIG9iaiB0byB0aGVcclxuICAgICAgICBwcm90b3R5cGUgb2YgdGhlIGZ1bmN0aW9uIGNvbnN0cnVjdG9yXHJcblxyXG4gICAgICAgIEBwYXJhbSBbT2JqZWN0XSBvYmogYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgaW5jbHVkZWQgcHJvcGVydGllc1xyXG4gICAgICAgIEBwYXJhbSBbRnVuY3Rpb25dIGRlY29yYXRvciBhIGRlY29yYXRvciBmdW5jdGlvbiBhcHBsaWVkXHJcbiAgICAgICAgZm9yIGV2ZXJ5IHByb3BlcnR5J3MgdmFsdWVcclxuICAgICMjI1xyXG4gICAgQGluY2x1ZGU6IChvYmosIGRlY29yYXRvcikgLT5cclxuICAgICAgZm9yIGtleSwgdmFsdWUgb2Ygb2JqIHdoZW4ga2V5ICBub3QgaW4gWydleHRlbmQnLCdpbmNsdWRlJ11cclxuICAgICAgICBpZiBkZWNvcmF0b3IgYW5kIHR5cGVvZiB2YWx1ZSBpcyAnRnVuY3Rpb24nXHJcbiAgICAgICAgICB2YWx1ZSA9IGRlY29yYXRvcih2YWx1ZSlcclxuICAgICAgICBAOjpba2V5XSA9IHZhbHVlXHJcbiAgICAgIG9iai5pbmNsdWRlZD8uYXBwbHkoQClcclxuICAgICAgdGhpc1xyXG5cclxuIiwiXHJcbiMjI1xyXG4gICAgR2l2ZW4gYSBsaXN0IG9mIGNhbGxiYWNrIGZ1bmN0aW9ucyBpdCBpdGVyYXRlcyB0aHJvdWdoIGl0XHJcbiAgICBhbmQgY2FsbHMgZWFjaCBmdW5jdGlvbiBhbG9uZ3NpZGUgdGhlIHBhc3NlZCBhcmd1bWVudHNcclxuXHJcbiAgICBUaGFua3MgdG8gSmVyZW15IEFzaGtlbmFzIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2phc2hrZW5hcy9iYWNrYm9uZS9cclxuXHJcbiAgICBAcGFyYW0gW0FycmF5XSBjYWxsYmFja3MgdGhlIGxpc3Qgb2YgY2FsbGJhY2sgZnVuY3Rpb25zIHRvIGJlIGNhbGxlZFxyXG4gICAgQHBhcmFtIFtBcnJheV0gYXJncyB0aGUgYXJndW1lbnRzIGFycmF5IHBhc3NlZCB0byBFdmVudEJ1czo6dHJpZ2dlclxyXG4jIyNcclxudHJpZ2dlckV2ZW50Q2FsbGJhY2tzID0gKGNhbGxiYWNrcywgYXJncykgLT5cclxuICBbYTEsIGEyLCBhM10gPSBbYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXV1cclxuICBjYkxlbiA9IGNhbGxiYWNrcz8ubGVuZ3RoIHx8IDBcclxuICBpID0gLTFcclxuIFxyXG4gIHN3aXRjaCBhcmdzLmxlbmd0aFxyXG4gICAgd2hlbiAwXHJcbiAgICAgIHdoaWxlICgrK2kgPCBjYkxlbilcclxuICAgICAgICBjYWxsYmFja3NbaV0uY2IuY2FsbChjYWxsYmFja3NbaV0uY3R4KVxyXG4gICAgd2hlbiAxXHJcbiAgICAgIHdoaWxlICgrK2kgPCBjYkxlbilcclxuICAgICAgICBjYWxsYmFja3NbaV0uY2IuY2FsbChjYWxsYmFja3NbaV0uY3R4LCBhMSlcclxuICAgIHdoZW4gMlxyXG4gICAgICB3aGlsZSAoKytpIDwgY2JMZW4pXHJcbiAgICAgICAgY2FsbGJhY2tzW2ldLmNiLmNhbGwoY2FsbGJhY2tzW2ldLmN0eCwgYTEsIGEyKVxyXG4gICAgd2hlbiAzXHJcbiAgICAgIHdoaWxlICgrK2kgPCBjYkxlbilcclxuICAgICAgICBjYWxsYmFja3NbaV0uY2IuY2FsbChjYWxsYmFja3NbaV0uY3R4LCBhMSwgYTIsIGEzKVxyXG4gICAgZWxzZVxyXG4gICAgICB3aGlsZSAoKytpIDwgY2JMZW4pXHJcbiAgICAgICAgY2FsbGJhY2tzW2ldLmNiLmFwcGx5KGNhbGxiYWNrc1tpXS5jdHgsIGFyZ3MpXHJcblxyXG4jIyNcclxuICAgIERpc3BhdGNoaW5nIG1lY2hhbmlzbSBmb3IgY2VudHJhbGl6aW5nIGFwcGxpY2F0aW9uLXdpZGUgZXZlbnRzXHJcblxyXG4gICAgVGhlIGludGVybmFsIHN0cnVjdHVyZSBvZiB0aGUgZXZlbnQgbGlzdCBsb29rcyBsaWtlIHRoaXM6XHJcbiAgICAgICAgZXZlbnRzID0ge1xyXG4gICAgICAgICAgICBjYWxsYmFja3M6IFt7Y2IsIGN0eH0sIHtjYiwgY3R4fSwgLi4uXVxyXG4gICAgICAgIH1cclxuICAgIHdoZXJlIGVhY2ggb2JqZWN0IGNvcnJlc3BvbmRpbmcgdG8gdGhlIFwiZXZlbnROYW1lXCIgYXJyYXksXHJcbiAgICByZXByZXNlbnRzIGEgc2V0IGNvbnRhaW5pbmcgYSBjYWxsYmFjayBhbmQgYSBjb250ZXh0XHJcbiMjI1xyXG5PYnNlcnZhYmxlTWl4aW4gPVxyXG4gICMjI1xyXG4gICAgICBBdHRhY2hlcyBhbiBldmVudCB0byBhIGNhbGxiYWNrXHJcblxyXG4gICAgICBAcGFyYW0gW1N0cmluZ10gZXZlbnQgdGhlIG5hbWUgb2YgdGhlIGV2ZW50IGl0IHdpbGwgbW9uaXRvclxyXG4gICAgICBAcGFyYW0gW0Z1bmN0aW9uXSBmbiB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdHJpZ2dlcmVkIGZvciBldmVudFxyXG4gICAgICBAcGFyYW0gW09iamVjdF0gY3R4IENvbnRleHQgaW4gd2hpY2ggdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkXHJcblxyXG4gICAgICBAcmV0dXJuIFtFdmVudEJ1c11cclxuICAjIyNcclxuICBvbjogKGV2ZW50LCBjYiwgY3R4KSAtPlxyXG4gICAgaWYgdHlwZW9mIGNiIGlzICdmdW5jdGlvbicgYW5kIHR5cGVvZiBldmVudCBpcyAnc3RyaW5nJ1xyXG4gICAgICAjIGNvbnN0cnVjdCB0aGUgZXZlbnRzIGxpc3QgYW5kIGFkZCBhbiBlbXB0eSBhcnJheSBhdCBrZXkgJ2V2ZW50J1xyXG4gICAgICBAX2V2ZW50cyA/PSB7fVxyXG4gICAgICBAX2V2ZW50c1tldmVudF0gPz0gW11cclxuICAgICAgIyBjb25zdHJ1Y3QgZXZlbnRzIGlmIG5vdCBhbHJlYWR5IGRlZmluZWQsIHRoZW4gcHVzaCBhIG5ldyBjYWxsYmFja1xyXG4gICAgICBAX2V2ZW50c1tldmVudF0ucHVzaCB7IGNiLCBjdHggfVxyXG4gICAgcmV0dXJuIEBcclxuXHJcbiAgIyMjXHJcbiAgICAgIFJlbW92ZXMgYSBjYWxsYmFjayBmdW5jdGlvbiBmb3IgYSBnaXZlbiBldmVudCBhbmRcclxuICAgICAgZGVsZXRlcyB0aGUgZXZlbnQgaWYgdGhlIGNhbGxiYWNrIGxpc3QgYmVjb21lcyBlbXB0eVxyXG5cclxuICAgICAgQHBhcmFtIFtTdHJpbmddIGV2ZW50IHRoZSBuYW1lIG9mIHRoZSBldmVudFxyXG4gICAgICBAcGFyYW0gW0Z1bmN0aW9uXSBmbiB0aGUgY2FsbGJhY2sgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZSBjYWxsYmFjayBsaXN0XHJcbiAgIyMjXHJcbiAgb2ZmOiAoZXZlbnQsIGNiKSAtPlxyXG4gICAgY2FsbGJhY2tMaXN0ID0gQF9ldmVudHM/W2V2ZW50XVxyXG4gICAgaWYgZXZlbnQgYW5kIGNiIGFuZCBjYWxsYmFja0xpc3Q/Lmxlbmd0aFxyXG4gICAgICAjIHNtYWxsIHR3ZWFrIGJvcnJvd2VkIGZyb20gQmFja2JvbmUuRXZlbnRcclxuICAgICAgQF9ldmVudHNbZXZlbnRdID0gcmV0YWluID0gW11cclxuICAgICAgZm9yIGNhbGxiYWNrLCBpIGluIGNhbGxiYWNrTGlzdFxyXG4gICAgICAgIHJldGFpbi5wdXNoIGNhbGxiYWNrIHVubGVzcyBjYWxsYmFjay5jYiBpcyBjYlxyXG4gICAgICBpZiByZXRhaW4ubGVuZ3RoXHJcbiAgICAgICAgQF9ldmVudHNbZXZlbnRdID0gcmV0YWluXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBkZWxldGUgQF9ldmVudHNbZXZlbnRdXHJcbiAgICAgICMjI1xyXG4gICAgICAgICAgQ2hlY2sgbWFkZSB0byByZW1vdmUgYWxsIHRoZSBjYWxsYmFja3MgZm9yIHRoZSBldmVudFxyXG4gICAgICAgICAgaWYgdGhlcmUgd2FzIG5vIGNhbGxiYWNrIHNwZWNpZmllZFxyXG4gICAgICAjIyNcclxuICAgIGVsc2UgaWYgZXZlbnQgYW5kIHR5cGVvZiBjYiBpcyAndW5kZWZpbmVkJyBhbmQgY2FsbGJhY2tMaXN0Py5sZW5ndGhcclxuICAgICAgZGVsZXRlIEBfZXZlbnRzW2V2ZW50XVxyXG4gICAgcmV0dXJuIEBcclxuXHJcbiAgIyMjXHJcbiAgICAgIFRyaWdnZXJzIHRoZSBldmVudCBzcGVjaWZpZWQgYW5kIGNhbGxzIHRoZVxyXG4gICAgICBhdHRhY2hlZCBjYWxsYmFjayBmdW5jdGlvbnNcclxuXHJcbiAgICAgIEBwYXJhbSBbU3RyaW5nXSBldmVudCB0aGUgbmFtZSBvZiB0aGUgZXZlbnQgdGhhdCB3aWxsIGJlIHRyaWdnZXJlZFxyXG4gICMjI1xyXG4gIHRyaWdnZXI6IChldmVudCwgYXJncy4uLikgLT5cclxuICAgIGV2ZW50Q2FsbGJhY2tzID0gQF9ldmVudHM/W2V2ZW50XVxyXG4gICAgYWxsQ2FsbGJhY2tzID0gQF9ldmVudHM/LmFsbFxyXG5cclxuICAgIGlmIGV2ZW50IGFuZCBldmVudENhbGxiYWNrcyBvciBhbGxDYWxsYmFja3NcclxuICAgICAgaWYgZXZlbnRDYWxsYmFja3M/Lmxlbmd0aFxyXG4gICAgICAgIHRyaWdnZXJFdmVudENhbGxiYWNrcyhldmVudENhbGxiYWNrcywgYXJncylcclxuICAgICAgaWYgYWxsQ2FsbGJhY2tzPy5sZW5ndGhcclxuICAgICAgICB0bXBBcmdzID0gYXJnc1xyXG4gICAgICAgICMgYWRkIHRoZSBldmVudCBuYW1lIHRvIHRoZSBmcm9tIG9mIHRoZSBjYWxsYmFjayBwYXJhbXNcclxuICAgICAgICB0bXBBcmdzLnVuc2hpZnQgZXZlbnRcclxuICAgICAgICB0cmlnZ2VyRXZlbnRDYWxsYmFja3MoYWxsQ2FsbGJhY2tzLCB0bXBBcmdzKVxyXG4gICAgcmV0dXJuIEBcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi51dGlscy5zZXJ2aWNlcy5PYnNlcnZhYmxlTWl4aW4nLCBbXSlcclxuICAuZmFjdG9yeSAnT2JzZXJ2YWJsZU1peGluJywgKCkgLT4gT2JzZXJ2YWJsZU1peGluIiwiIyMjICAgXHJcbiAgUmVxdWVzdEFib3J0ZXJNaXhpbiBjcmVhdGVzIGEgZGVmZmVyZWQgb24gY3VycmVudCBpbnN0YW5jZSBmb3IgZGVsZWdhdGluZyByZXF1ZXN0IHRpbWVvdXRzXHJcbiAgWyBob3cgdG8gdXNlIF1cclxuXHJcbiAgIyMgIGJlZm9yZSBjb25zdHJ1Y3RvciAgICAoICBjdXJyZW50IGNsYXNzIG11c3QgaGF2ZSBNb2R1bGUgYXMgc3VwZXJjbGFzcyAgKVxyXG4gIDEuICBAaW5jbHVkZSBSZXF1ZXN0QWJvcnRlck1peGluICAoaWYgZXh0ZW5kcyBNb2R1bGUpICB8fCAgIGFuZ3VsYXIuZXh0ZW5kIEAsIFJlcXVlc3RBYm9ydGVyTWl4aW4gICAoaWYgZG9lcyBub3QgZXh0ZW5kIE1vZHVsZSlcclxuICBcclxuICAjIyAgaW5zaWRlIGNvbnN0cnVjdG9yIFxyXG4gIDIuIGNhbGwgQHJlZ2lzdGVyUGVuZGluZ1JlcXVlc3QgdG8gY3JlYXRlIGEgZGVmZmVyZWQgb24gY3VycmVudCBpbnN0YW5jZVxyXG4gIFxyXG4gICMjICBhZnRlciBjb25zdHJ1Y3RvciBcclxuICAzLiBwYXNzIEBfYWJvcnRlciB0byByZXNvdXJjZSB0aW1lb3V0IGNvbmZpZyBwcm9wZXJ0aWVzXHJcbiAgNC4gY2FsbCBAa2lsbFJlcXVlc3Qgd2hlbiBzY29wZSBcIiRkZXN0cm95XCIgZXZlbnQgZmlyZXMgXHJcblxyXG4jIyNcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi51dGlscy5zZXJ2aWNlcy5SZXF1ZXN0QWJvcnRlck1peGluJywgW10pXHJcbiAgLmZhY3RvcnkgJ1JlcXVlc3RBYm9ydGVyTWl4aW4nLCBbICckcScsICgkcSkgLT4gXHJcbiAgICByZWdpc3RlclBlbmRpbmdSZXF1ZXN0OiAtPlxyXG4gICAgICBAX2RlZmVycmVkID0gJHEuZGVmZXIoKVxyXG4gICAgICBAX2Fib3J0ZXIgPSBAX2RlZmVycmVkLnByb21pc2VcclxuICAgIGtpbGxSZXF1ZXN0OiAtPlxyXG4gICAgICBAX2RlZmVycmVkLnJlc29sdmUoKVxyXG4gIF1cclxuICBcclxuIiwibW9kdWxlLmV4cG9ydHM9e1wiYmFzZXVybFwiOlwiaHR0cDovL2xvY2FsaG9zdDo1MDAwXCIsXCJiYXNlaG9zdFwiOlwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCJ9IiwiIyMjKlxyXG4gIyBJbmRleCBmaWxlIFxyXG4gIyMgZGVjbGFyZSBkZXBlbmRlbmN5IG1vZHVsZXNcclxuIyMjXHJcbnJlcXVpcmUgJy4vYXBwL3N0YXRlL2luZGV4J1xyXG5yZXF1aXJlICcuL2NvbW1vbi9jYW52YXMvaW5kZXgnXHJcbnJlcXVpcmUgJy4vY29tbW9uL3Nwb3QvaW5kZXgnXHJcbnJlcXVpcmUgJy4vY29tbW9uL3V0aWxzL2luZGV4J1xyXG5jb25maWcgPSByZXF1aXJlICcuL2NvbmZpZy5qc29uJ1xyXG5cclxuYW5ndWxhclxyXG4gIC5tb2R1bGUoJ2FwcGxpY2F0aW9uJywgW1xyXG4gICAgJ3RlbXBsYXRlcydcclxuICAgICduZ0FuaW1hdGUnXHJcbiAgICAnbmdSZXNvdXJjZSdcclxuICAgICMgJ25nTW9ja0UyRSdcclxuICAgICdsb2Rhc2gnXHJcbiAgICAndWkucm91dGVyJ1xyXG4gICAgJ2J0Zm9yZC5zb2NrZXQtaW8nXHJcbiAgICAnbWdjcmVhLm5nU3RyYXAnXHJcbiAgICBcclxuICAgICdxdWlja3N0YXJ0QXBwLmNvbW1vbi51dGlscydcclxuICAgICdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jYW52YXMnXHJcbiAgICAncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdCdcclxuICAgICdxdWlja3N0YXJ0QXBwLnN0YXRlJyBcclxuXHJcbiAgXSlcclxuICAuY29uc3RhbnQoJ0JBU0VVUkwnLCBjb25maWcuYmFzZXVybClcclxuICAuY29uc3RhbnQoJ0JBU0VIT1NUJywgY29uZmlnLmJhc2Vob3N0KVxyXG4iXX0=
