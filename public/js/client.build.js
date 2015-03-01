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
          iWindow = elem.find('.drawingCanvasFrame');
          console.log('contextWindow', angular.element(iWindow)[0]);
          return console.log('contextWindow', angular.element(iWindow).contentWindow);
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
module.exports={"baseurl":"http://localhost:3000","basehost":"http://localhost:3000"}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxpbmZpbml0ZS1jYW52YXNcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImQ6XFxpbmZpbml0ZS1jYW52YXNcXHNyY1xcYXBwLmNvZmZlZSIsImQ6XFxpbmZpbml0ZS1jYW52YXNcXHNyY1xcYXBwXFxzdGF0ZVxcY29udHJvbGxlcnNcXHN0YXRlX2NvbnRyb2xsZXIuY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxhcHBcXHN0YXRlXFxpbmRleC5jb2ZmZWUiLCJkOlxcaW5maW5pdGUtY2FudmFzXFxzcmNcXGNvbW1vblxcY2FudmFzXFxjb250cm9sbGVyc1xcY2FudmFzX2NvbnRyb2xsZXIuY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxjb21tb25cXGNhbnZhc1xcZGlyZWN0aXZlc1xcY2FudmFzX2RpcmVjdGl2ZS5jb2ZmZWUiLCJkOlxcaW5maW5pdGUtY2FudmFzXFxzcmNcXGNvbW1vblxcY2FudmFzXFxpbmRleC5jb2ZmZWUiLCJkOlxcaW5maW5pdGUtY2FudmFzXFxzcmNcXGNvbW1vblxcY2FudmFzXFxzZXJ2aWNlc1xcY2FudmFzX3NlcnZpY2UuY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxjb21tb25cXGNhbnZhc1xcc2VydmljZXNcXGxpdmVfY2FudmFzX3NlcnZpY2UuY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxjb21tb25cXHNwb3RcXGNvbnRyb2xsZXJzXFxzcG90X2NvbnRyb2xsZXIuY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxjb21tb25cXHNwb3RcXGRpcmVjdGl2ZXNcXGNhbnZhc19zcG90X2RpcmVjdGl2ZS5jb2ZmZWUiLCJkOlxcaW5maW5pdGUtY2FudmFzXFxzcmNcXGNvbW1vblxcc3BvdFxcZGlyZWN0aXZlc1xcZHJhd2luZ19jYW52YXNfZGlyZWN0aXZlLmNvZmZlZSIsImQ6XFxpbmZpbml0ZS1jYW52YXNcXHNyY1xcY29tbW9uXFxzcG90XFxkaXJlY3RpdmVzXFxzcG90X2RpcmVjdGl2ZS5jb2ZmZWUiLCJkOlxcaW5maW5pdGUtY2FudmFzXFxzcmNcXGNvbW1vblxcc3BvdFxcaW5kZXguY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxjb21tb25cXHNwb3RcXHNlcnZpY2VzXFxzcG90X3NlcnZpY2UuY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxjb21tb25cXHV0aWxzXFxpbmRleC5jb2ZmZWUiLCJkOlxcaW5maW5pdGUtY2FudmFzXFxzcmNcXGNvbW1vblxcdXRpbHNcXHNlcnZpY2VzXFxtb2R1bGVfZXh0ZW5zaW9uLmNvZmZlZSIsImQ6XFxpbmZpbml0ZS1jYW52YXNcXHNyY1xcY29tbW9uXFx1dGlsc1xcc2VydmljZXNcXG9ic2VydmFibGVfbWl4aW4uY29mZmVlIiwiZDpcXGluZmluaXRlLWNhbnZhc1xcc3JjXFxjb21tb25cXHV0aWxzXFxzZXJ2aWNlc1xccmVxdWVzdF9hYm9ydGVyX3NlcnZpY2UuY29mZmVlIiwiZDovaW5maW5pdGUtY2FudmFzL3NyYy9jb25maWcuanNvbiIsImQ6XFxpbmZpbml0ZS1jYW52YXNcXHNyY1xcaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxvQkFBQTs7QUFBQSxPQUFBLENBQVEsU0FBUixDQUFBLENBQUE7O0FBRUE7QUFBQTs7R0FGQTs7QUFBQTtBQU9lLEVBQUEseUJBQUEsR0FBQTtBQUNYLElBQUEsQ0FBQSxDQUFFLFFBQUYsQ0FBVyxDQUFDLEtBQVosQ0FBa0IsU0FBQSxHQUFBO2FBQ2hCLE9BQU8sQ0FBQyxTQUFSLENBQWtCLFFBQWxCLEVBQTRCLENBQUMsZUFBRCxDQUE1QixFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsSUFBVjtPQURGLEVBRGdCO0lBQUEsQ0FBbEIsQ0FBQSxD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QUlBLENBQVEsbUJBQVIsQ0FKQSxDQUFBOztBQUFBLE9BS0EsQ0FBUSx1QkFBUixDQUxBLENBQUE7O0FBQUEsT0FNQSxDQUFRLHFCQUFSLENBTkEsQ0FBQTs7QUFBQSxPQU9BLENBQVEsc0JBQVIsQ0FQQSxDQUFBOztBQUFBLE1BUUEsR0FBUyxPQUFBLENBQVEsZUFBUixDQVJULENBQUE7O0FBQUEsT0FXRSxDQUFDLE1BREgsQ0FDVSxhQURWLEVBQ3lCLENBQ3JCLFdBRHFCLEVBRXJCLFdBRnFCLEVBR3JCLFlBSHFCLEVBS3JCLFFBTHFCLEVBTXJCLFdBTnFCLEVBT3JCLGtCQVBxQixFQVFyQixnQkFScUIsRUFVckIsNEJBVnFCLEVBV3JCLDZCQVhxQixFQVlyQiwyQkFacUIsRUFhckIscUJBYnFCLENBRHpCLENBaUJFLENBQUMsUUFqQkgsQ0FpQlksU0FqQlosRUFpQnVCLE1BQU0sQ0FBQyxPQWpCOUIsQ0FrQkUsQ0FBQyxRQWxCSCxDQWtCWSxVQWxCWixFQWtCd0IsTUFBTSxDQUFDLFFBbEIvQixDQVZBLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSAnLi9pbmRleCdcclxuXHJcbiMjIypcclxuICMgIyBRdWlja3N0YXJ0IEFwcGxpY2F0aW9uXHJcbiMjI1xyXG5jbGFzcyBNYWluQXBwbGljYXRpb25cclxuXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeSAtPlxyXG4gICAgICBhbmd1bGFyLmJvb3RzdHJhcCBkb2N1bWVudCwgWydxdWlja3N0YXJ0QXBwJ10sXHJcbiAgICAgICAgc3RyaWN0RGk6IHRydWVcclxuXHJcbiAgcnVuOiAtPiBbJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJyRodHRwQmFja2VuZCcsICggJHJvb3RTY29wZSwgJHN0YXRlLCAkaHR0cEJhY2tlbmQgKSAtPlxyXG4gICAgJHJvb3RTY29wZS4kc3RhdGUgPSAkc3RhdGVcclxuICAgIFxyXG4gICAgJHJvb3RTY29wZS4kb24gJyRzdGF0ZUNoYW5nZVN0YXJ0JywgKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSA9PlxyXG4gICAgICAjIGNvbnNvbGUubG9nKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSBcclxuICAgICRyb290U2NvcGUuJG9uICckc3RhdGVDaGFuZ2VFcnJvcicsIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgZXJyb3IpIC0+XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIFxyXG4gICAgXHJcbiAgICAjICRodHRwQmFja2VuZC53aGVuR0VUKC9hcGlcXC9zcG90LykucmVzcG9uZCAobWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMpIC0+XHJcbiAgICAjICAgcGFyYW1zID0gdXJsLnNwbGl0KCc/JylbMV0uc3BsaXQoJyYnKVxyXG4gICAgIyAgIFsyMDAse1xyXG4gICAgIyAgICAgIyBkcmF3aW5nRGF0YVVybDogXCJkYXRhOmltYWdlL2pwZWc7YmFzZTY0LC85ai80QUFRU2taSlJnQUJBUUFBQVFBQkFBRC8vZ0E3UTFKRlFWUlBVam9nWjJRdGFuQmxaeUIyTVM0d0lDaDFjMmx1WnlCSlNrY2dTbEJGUnlCMk5qSXBMQ0J4ZFdGc2FYUjVJRDBnT1RBSy85c0FRd0FEQWdJREFnSURBd01EQkFNREJBVUlCUVVFQkFVS0J3Y0dDQXdLREF3TENnc0xEUTRTRUEwT0VRNExDeEFXRUJFVEZCVVZGUXdQRnhnV0ZCZ1NGQlVVLzlzQVF3RURCQVFGQkFVSkJRVUpGQTBMRFJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVUvOEFBRVFnQXdnQ1dBd0VpQUFJUkFRTVJBZi9FQUI4QUFBRUZBUUVCQVFFQkFBQUFBQUFBQUFBQkFnTUVCUVlIQ0FrS0MvL0VBTFVRQUFJQkF3TUNCQU1GQlFRRUFBQUJmUUVDQXdBRUVRVVNJVEZCQmhOUllRY2ljUlF5Z1pHaENDTkNzY0VWVXRId0pETmljb0lKQ2hZWEdCa2FKU1luS0NrcU5EVTJOemc1T2tORVJVWkhTRWxLVTFSVlZsZFlXVnBqWkdWbVoyaHBhbk4wZFhaM2VIbDZnNFNGaG9lSWlZcVNrNVNWbHBlWW1acWlvNlNscHFlb3FhcXlzN1MxdHJlNHVickN3OFRGeHNmSXljclMwOVRWMXRmWTJkcmg0dVBrNWVibjZPbnE4Zkx6OVBYMjkvajUrdi9FQUI4QkFBTUJBUUVCQVFFQkFRRUFBQUFBQUFBQkFnTUVCUVlIQ0FrS0MvL0VBTFVSQUFJQkFnUUVBd1FIQlFRRUFBRUNkd0FCQWdNUkJBVWhNUVlTUVZFSFlYRVRJaktCQ0JSQ2thR3h3UWtqTTFMd0ZXSnkwUW9XSkRUaEpmRVhHQmthSmljb0tTbzFOamM0T1RwRFJFVkdSMGhKU2xOVVZWWlhXRmxhWTJSbFptZG9hV3B6ZEhWMmQzaDVlb0tEaElXR2g0aUppcEtUbEpXV2w1aVptcUtqcEtXbXA2aXBxckt6dExXMnQ3aTV1c0xEeE1YR3g4akp5dExUMU5YVzE5aloydUxqNU9YbTUranA2dkx6OVBYMjkvajUrdi9hQUF3REFRQUNFUU1SQUQ4QSswZitGeDVIL0lOaS93Qy83ZjhBeEZNLzRYQjgyZjdQaXovMTNiLzRpdk12d294N1YrYmYyM2ovQVBuNStDL3lQb1A3R3dML0FPWGY0djhBelBWRitOSlgvbUd4ZitCRGYvRVZJbnhua25mYkhwVWJ0L2RXZGlmL0FFWFhrK1BhdFB3OWJ4WEY4LzJra1dVY2JTWE9PcFJjSEE5Q1NGVWU1RlhET2NmT1NqN1Q4Ri9rRXNwd1VZMzVQeGYrWjZKSjhaNVlXS1NhWEdqZHcwN0Evd0RvdWlQNDNHTS84Z3lJL3dEYnczL3hGY2hvdGdOUmErdmJ1S0lXVnVQT1cwT1FOek5oRVhuS3FTZnhBUFdxTi9vbDQxN3FUeUpFMzJaOXNua0hhbThuRzFSam5CNit5bm10bm1tWUtLa3A3K1MveU0xbHVCdlp3L0YvNW5mbjQ0ay84d3lML3dBQ1cvOEFqZE0vNFhaei93QWd5TC93SWIvNGl2T05SMGg5T2RkekJvMmlqa1YrZ2Jjb09CNjR6alB0VWxuNGR2TCt6UzVoVldSM1pRQ2NIQ3J1ZGpuamFCakp6M0ZaZjJ0bUxmTHo2K2kveU5QN0x3TnJ1UDR2L005SVg0NU12L01MaUkvNitXLytOMDRmSFVnLzhncUxQL1h5My94dXZNN1RRNXJyVDN1OXl4eDd4SEdyZFpHd1NjZXdBNUo0RmFXbStFeU5adHJlOGxnZUI0M2xab1pnUmhRMmVSNmJDVGp0MHprWnFPYVpsTnEwOS9KZjVEZVg0S04vZDI4My9tZDMvd0FMNFA4QTBDWXYvQWx2L2pkTi93Q0Y2RS84d3FML0FNQ1cvd0RqZGVWTFpTdmRSMjZydW1rWUtxRHJrbkFIc2FXOXMyc3AyamJIeWtybFd5R3h4a2V4N2UxWmYyeGo3WDUvd1grUnAvWnVFMjVmeFo2bWZqa1NNZjJYRmovcjViLzQzUVBqa1IvekNvdi9BQUpiL3dDTjE1N040ZU1maDZQVVVMeU94TE1GSHlwR0NGM0gvZ1oyajFJYjB5WWw4UDNEUUNWZkxrVjNTTmNQZ2htQVk1QjZZSEJ6amtqclZ2TTh4djhBRjU3TC9JbFlEQjc4djRzOUhQeHpKT2Y3TGkvOENXLytOMDRmSFUvOUFxSS85dkxmL0c2NWFlejArMEYyOFZuNThObVJiVzRkUnVua2JkdWxmL1lBUmlNOGNqME5jZEx6Sy8zVHlmdTlQd3BWY3l4dE8xNm40TC9JcW5nc05MYUg0czliL3dDRjdIL29GUlkvNitXLytOMDF2am9XL3dDWVZGLzRFdC84YnJ5UGowby9DdWYrMXNaL1ArQy95TjFnY092cy9tZXNqNDRFSC9rRnhmOEFnUTMvQU1ib3J5YjhLS24rMU1YL0FEL2d2OGl2cVZIK1V2ZjJMZC84OEpQKy9ULzRVZjJMZVovMUV2OEEzNmYvQUFyNktVREdUVGkyT2xmVC93Q3JVUDhBbjcrSC9CUGsvd0RXT2Y4QXo2WDMvd0RBUG5UK3hMei9BSjRTL3dEZmwvOEE0bXBiZlQ5UnRmTThxS1pmTVhhMzdsemtaQjdyNmdIOEsraVk1TThaeFVpRGtldE5jTnhXcXF2N3YrQ1V1SVpTMDltdnYvNEI4M2pTOVFFdm0rVlA1bTdkdU1VbWMrdjNhdGVUcXIzRFN6UlR5Qi92b0luVlc2bm9GeDFKUFRyWDBWM0pxdHFHcTIrbm9HbmxDWjZMMVkvUURtaytINHdWM1dzdlQvZ21uOXVTbHRTdS9YL2dIejFmMldvNmhjZWJMQk1XQ3FnekZJY0tvQUE2ZWdyY2h0TDdSdkRqUU5ITlBQZWZLc1BsdnRoaXlDMmNEK0pzY2NmZFByWHNzTGF6cUs1dE5LTnZHMzNaYjE5bVBxZzVwNzZmNGx0QVhlM3NieFIveXp0blpHL051S3pqazlPTGNsVWJ2MTVmK0RxYlBNNjhrbDdKZmY4QThBK2VIMDdVNU40YU80SWZHNVJGSUFjZE9NWTRwa2VqWDhiQmtnblJoMEt4U0EveXI2SHQ5ZnR6TVlib1NXTTQ2eDNLN1B4eWVNSHRtcjM5cjJNVTRoZTVpU1Fqb1dINVo2WjlxRmtGR1M1bFcvRC9BSUl2N2FxcDJkTDhmK0FmTmFhTGZ4T3JwQk9qcWNxeXhTQWcrdlNrZlJyK1Z5endUdTVPU1RESVNmMHI2UHVkZXRGS3gyKysrbWI3cVd5Nzgrdkk0T08rTWtlbEVWdDRrdVJ2anRyS3pYUCtydVhaMi9OZUt5ZVJVbG9xcmZvditDYnh6V3JMWDJmNC93REFQbjYxWFZyYXprdFd0NTVyWmdBSXBJcENxNGJjTURIcnpqb2FxTnBtcHVySVk3a296YjJYeXBNRnZYR090ZlNFbDNyR25xZnRlbGVmR3ZMUzJUN3Z5UTgwdHJyRnZxQ0ZyYVVQZ2NyMFlmVWRhcFpKVG5hUHRYZnMxYjlSU3pTZFBWMC94LzRCODJ0cEdvdHV6RGNIZnkyWXBPZnJ4elVmOWhYMy9Qck4vd0IrWC93cjZmV1FzT2VhY3IvTmcwUGgrUDhBejgvRC9nampuRGYyUHgvNEI4di9BTmhYdi9QclAvMzVmL0NqK3dyMy9uMW4vd0MvTC80VjlUUmoyelVyUllHUlUvMkJIL241K0gvQk5sbWtuOW44VDVVL3NHOS81OVovKy9ML0FPRkZmVmlMN0FVVWYyQkQvbjUrSC9CSy90T1g4djRuTTdnZWxaZXN5M0lqaWp0M2FLUTcyVmxHZHpCQ1F1TytldjhBd0dyNGt5ZUtxNmh6SEJJT0dTZVBCK3JCVCtqR3Z1YXF2Qm8vTktjclNSZFRRdGVqaGpsZ21zOVJnS2hsWTVTUndlUi9zaWsyZUlRY2YyQ0Q3L2JFcnEvRERGdkQybmcvd3dxbjVESDlLMDhlMWNVVk54VFVuK0QvQURSOU45V292WGxPS2gwbnhEZkRESmI2WkdlQ1djU1NEM0dNZy9UajYxdGFSNFRzOUxrODlnMTFkbmt6ekhjUWZiMDlNOG5IR2EyL3dvL0NtcWF2ZVR1L00yakNNUGhWaEtXajhLUHdyVXNyWG1uV3VvUitYY3dSenBuSUVpZzRQcVBTcUVmaExTWW85aVdhcjZPSFlPUGJkbk9QYk9LMlB3by9Db2NJdDNhQXEyZW1XdGdyQzNnU0xkeXhBNVkrcFBVbjYxWkhGTCtGSDRWU1NXaUFROGlzYlYvQ3RucWorY29hMnV3Y2llRTdUbjM5ZlRQWEhHUlcxK0ZINFVwUlUxYVNIZXh4N2FicituOEJJTlVqSEFJWVJ5SDNPY0FEMjUrdE1NbXVGc0RRY2Y4QWI0bGRuK0ZHUGFzdlpQcEovaC9rVHl4N0hKclkrSUowSmRyU3hpSXlUOTZSUDVxYWQ0UmxudXRJRnpkVHROSk81Y2JoakErNkFCMnpqUDQxcytJbk1lZ2FrdzQyMjBoeVA5MDFtYUdDbWoyQUhIN2hQL1FSV0toeTFVcnQ2RnQyam9pKzR3ZlNpcE51N21pdCtVazQ4cmp0VkxWSmtpdFZMSEFFMGJINkJ3eC9RRS9oVnN1U00xUmxoL3RMV05Qc3VxTSs2VC9kNXlENlpUelB4RmRkWjhzR3o1Q2hIbnF4aWowSFJMZVMxME94aFliWlV0MFZzOW0yalA2MVoyM0g5NkwvQUw0UCtOQXZiY0Fmdm8vKytoUjl1dC8rZThmL0FIMEs1bHlwSlhQc0F4Y2Yzb3YrK0QvalJpNC92UmY5OEgvR2o3YmIvd0RQZVA4QTc2RkgyMjMvQU9lOGYvZlFwM1hjQXhjZjNvLysrRC9qU2JiaisvSC9BTjhIL0dsKzIyLy9BRDNqL3dDK3hSOXR0LzhBbnZIL0FOOWlpNjdnQVc0L3ZSLzk4bi9HakZ4NnhuOERSOXR0L3dEbnZILzMyS1B0dHY4QTg5NC8rK3hSZGR3REZ4LzB5UDUwZjZSL2RqL00wZmJiZi9udkgvMzJLUHR0di96M2ovNzdGRjEzQVA4QVNQN2taLzRFZjhLQ2JnZjhzNGovQU1EUCtGSDIyMy81N3gvOTlpajdiYi84OTQvKyt4UmRkd0RkYy84QVBLTC9BTCtIL3dDSnBOMXovd0E4b3Y4QXY0Zi9BSW1sKzIyLy9QZVAvdnNVZmJiZi9udkgvd0I5aWk2N2dRNnRidmVhUGVRQlI1a3NEb0FEa1pLa1ZqK0hKUmRhRnA4cThqeVVCOVFRTUg5UWEzamVXN2NDWkNUL0FMUXJsL0Q1L3MrZlV0T1BBdGJoaWkvM1kzK1pmNW1zWC9GVFhWVy9YL01Vdmg5RGQzL2tLS3JHNEFZOFVWc1pjeU9XWEhGV1BCRnY5czErK3ZDT0lVOHRNK2hZcitoamYvdnVxaTlDMWFudzRqV2JSNTl4UG1NNk1jRWdrR0pEbkk5eTM2MXJpTjRvOExMNHAxTG5aWTlxTUQwcUVXYWVzbi9mMXY4QUdrTm1uckwvQU4vVy93QWFqVStpSjhDakFxRDdFbjk2WC92NjMrTkgySlA3MHY4QTM5Yi9BQnBhZ1Q0RkdCNlZCOWlUMWwvNyt0L2pSOWlUKzlKLzM5Yi9BQm8xQW53UFNqQTlLaCt4SjZ5ZjkvVy94byt4cDZ5ZjkvVy94bzFBbXdQU2pBOUtoK3hwNnlmOS9XL3hvK3hwNnlmOS9XL3hwNmdUWUhwUmoycUg3RW5ySi8zOWIvR2o3R25ySi8zOWIvR2xxQk5qMm8yKzFRZllrOVpQKy9yZjQwZllrL3ZTL3dEZjF2OEFHalVDZkh0WEo2eXYyRHhiYlNyd3Q5YnRHVkg5OURrRS93REFTUlhTL1lrL3ZTLzkvVy94cm52RlVhcnFPZ29tVElMaHlNbkoyN0R1Ni9VVmxWdlpQczErWTkwMFBHZHh6elJWZ3FvN1VWdFk0VGxrYkh2VXZnaThGaHFvdG1PRWRUYkVlNlphUC94d3RuM3hWWEJBeldkZFRQWTN5M0VZT1NBNEE3dkdkeWo4UnVCOWhXdGRhY3k2SHoyRnJlenFxNTZ0OXAvNll5Lzk4ai9HajdUL0FOTVpmeUgrTlNST3NzYU9weXJBRUVkeFRzQ3NkWDFQcmlIN1QvMHhsL0lmNDBmYWYrbU12NUQvQUJxYmlqaWl6N2dRL2FmK21NdjVmL1hvKzAvOU1aZnkvd0RyMU54UmlpejdnUS9hZittTXY1Zi9BRjZQdFA4QTB4bC9MLzY5VFlveFJaOXdJZnRQL1RHWDh2OEE2OUgybi9wakwrWC9BTmVwc1VZb3MrNEVQMm4vQUtZeS9sLzllajdUL3dCTVpmeUgrTlRZb3hSWjl3SWZ0UDhBMHhsL0lmNDBmYWYrbU12NUQvR3BzVVlvcys0RUl1TW5IbFNEOFA4QTY5Y3ZxazQxRHhla1lPWTlPaEpQYkVrbmIzK1VWMWtqckZHenNRRlVaSlBZVngvaHVQN1ZwOGwzSU1UWGN6ek42cnpqSDA0L1dzNUxtbkdEOWZ1LzRKTTN5eGJOQm1ORkkrVUpCNE9hSzZiSEJ6THVjbXNoZXFlbzcybnNraVh6TGg1VDVjZjk0N1NQeXl3R2UyYXNSSGIzNHFDNExRMzBNOExiWm1HMk56L0E2Z3NwK24zZ2ZYZ1ZkWnZrZktmTllmbGRST2V4NmZaNmFsdlp3UWw1Rzh1TlV5SFlad0FPZ05TL1k0L1dUL3Y2MytOUTJlb2ZhclNDWllaTVN4cTR4anVNK3RUZmFHLzU0U2ZwL2pYS3VXeDl1QXNrQjZ5ZjkvVy94byt4cDZ5ZjkvVy94byswdC96d2wvVC9BQm8rMHQvendsLzhkL3hwKzZBZlkwejFrLzcrdC9qUjlpanpuTXYvQUg5Yi9HajdRMy9QdkwvNDcvalNmYUgvQU9mZVg4MS94bzkwQmZzY2ZySi8zOWIvQUJvTm5HZThuL2Z4djhhVDdRMy9BRDd5L212K05IMmgvd0RuMmwvTmY4YVBkQVUyY1o3eUQvdG8zK05CczBQOFVuL2Z4djhBR2tOdy93RHo3eS9tditOSDJsditmZVg4MS94bzkzc0ljYlJDT3NuL0FIOGIvR2cyaVk2eWY5L0cvd0FhYjlvZi9uM2wvTmY4YVB0RW4vUHZKK2EvNDBYUXgzMlJQV1QvQUwrTi9qU2ZaRi92U2Y4QWZ4djhhVDdSSi96N3lmbXYrTko5b2wvNTk1UHpYL0dqM1FHM1ZnczlwUER1Y2ViR3laTEU0eU1kNjVqdzlkSDdBTGFRQ081dFdNVXNmZFNEeCtuZnZ6WFRUM2pRVzhzcndTS3NhTTV5VjdEUFkxeW5oMlBicHd2cHp2dWJ6RTgwcDZ0bmtENkFFREZRdjRzZVhzek9vMG9hbWhkU1ltNVBZVVZUbGxNMGpOMHoyb3JzUExjcnM1OXp0UHBXZHFXKzZsczdXRW56cHBkcTQ3WkJVSC92cGwvT3JibmN3Sk5XL0JWZ3VyK0taWjNVUEJaSmdaR1J1T1IvOFhuM1FWRmFYN3UzVm5pWU9uN1N1bDBQU29Za2hpUkZVQlZBVUQwQXArQlVQMktEL25oSC93QjhDajdGQi96d2ovNzRGWmFuMlpOeFJnVkQ5aWcvNTRSLzk4Q2o3RkIvendqL0FPK0JScUdoTnhSeFVQMktEL25oSC8zd0tQc2R2L3p3ai83NEZHb0UzRkhGUS9Zb1ArZUVmL2ZBbyt4UWY4OEkvd0R2Z1VhZ1RjVVlIcFVQMk8zL0FPZUVmL2ZBbyt4UWY4OEkvd0R2Z1VhZ1RjVWNWRDlpZy81NFIvOEFmQW8reDIvL0FEd2ovd0MrQlJxQk54UnhVUDJLMy81NFIvOEFmQW8reFcvL0FEd2ovd0MrQlJxQkpLaXlSc3BHVkl3UWU0cnpYUW1saHRtc3BuTFNXY3IyNXowK1VuR1BiR0s5Ryt4UWY4OFkvd0R2a1Z4SGlPMi9zdnhja3dHSXRSajUvd0N1aWZ5R01maWFpL0xPTW42ZmYvd1RreE1YS203ZE5TeWd3TTBVd3YweFJYYWVOekk1WnBOaTdqejNycFBoVVMraVhMeDdmT2VaV2N0M0JqUTUvd0MraTM2MXpNbm9LMlBoYmQvWjcrNHNtUDNvZHFqMDhwaVB6S3VwL0NzcTYxaXpseXVwYXRaOVQwVC9BRW4waS9Xai9TdittWDYxTmlpc3JlWjlhUS82Vi8weS9Xai9BRW4vQUtaZnJVMUZGdk1DSC9TZlNQOEFNMFp1ZjdzZi9mUi93cWFpaTNtQkRtNS91eGY5OUgvQ2pOei9BSEl2Kyt6L0FJVk5SUmJ6QWh6Yy93RFBPUDhBNzdQK0ZHNjUvd0NlY1gvZlovd3FhaWkzbUJEdXVmOEFubEYvMzhQL0FNVFJ1dWYrZVVYL0FIOFAvd0FUVXZGSEZPM21CRnV1ZitlVVgvZncvd0R4Tkc2NS93Q2VVWC9mdy84QXhOVFVVV0FoM1hQL0FEeWkvd0MvaC84QWlhNVg0aWJ4cCtsdTZxc2cxR0lEYWM4YzU3RDAvU3V3cmh2R3R3THZ4SnBsbm5LVzhiM1RnOURuNVYvRUgrZFkxVjd0dTdSblVrb3diZlloRXVCbWltTklDQU1DaXV6bjhqNWo1bk9iMTllYWJwVnlOTDhRd1RuL0FGVzlaR3p5TnAvZHlFK3dVcWFnd1FjOXFpdlNqZVFXKzZXOHQvOEFkWVl4K2UzOHExcng1b0hqNGFxNmRWU1BiVnM0TVo4bFArK0JTbXpnSno1TWYvZklxcjRmdkd2OUMwNjVjNWVhM2pkdnFWQlA2MW9WeEt6VjdINkhjaE5sQVQvcWsvNzVGSDJLQWptR00vOEFBUlUzNC9wUitOVnlyc0JDYlNBOVlvLysrUlNmWTdjLzhzb3ovd0FBRmNWOFE1ZFh2YnkxMHl3dExpUzNsVExTSXJlV3psc0FPdzZLQmtrZDhqcjBySjhFaTg4UCtNcDlKRTYzRnFITVRHTldXTW55ZytWWEpDbFNkcDU1eU85ZWJQRnFOWlUrVFM5citiT2hVcnc1cm5wWDJPMkgvTEtNZjhBRkFzN1lmOHNvL3dEdmdWNVc5dGVmRXZYcitNWEN3Mjl1em1KWlZMb0ZWeWlmS0NNRmlySGQxNFBvTVRXK3NYR29lQWRadEpacEE4Q3hiV01oTG9yUHRLRnVwSVpYR2ZRaXMxams3dmswczdQdmI4aW5RYXNyNjZYOHJucC8ySzI2aUdNZjhBRko5a3RnZjlWRm4vY0ZlVXRMUEQ0SXQwaXVMaUhicVpVbUNabzJLK1V6QUFnZzRKd2YxcWE5UVhHcStFYm1aMmxuK3pXSjgxdm1KSms1T1R6azVwZlhWWmU1Mi9FUFkrWjZqOWl0L3dEbmhILzN3S0RZMjUvNVlwLzN3S21vcjF1VmRqbElmc01IL1BHUC92Z1VmWXJmL25qSC93QjhDcHNVWW81VjJBaE5sYjQvMUVmL0FId0s4cWUrKzJhN3F0N0hnSVp2SmpBKzdzUVlCSDFyMC9XYm8yR2szdHl2M29ZWGtINEtUWGsyaXdlVnBrQUJ5Q0M0SjlDU2Y2MG94VHFwZHRmMFBLekdvNFVsRmRXYW4yb2tENVJtaW9WRzN0UlhaeXJzZlBjek1rTUdYM3FscUlZUXAzL2V4LzhBb2ExWmgvS3Erc1NBUlJSS3dEdVNSMXljREk2QW43MjN0VjFaY3ROczh1akZ6bWtldytEa0tlRmRLM2RUYkkzUHVNLzFyWi9LdktwUGlMcWdnamhzckNPMXQ0MUNLTm01Z0FNREJkbC85QnFtM2pieEZuUG56NC91aElQOFA2MTU4ZWF5WEt6N2Q1aGg2ZnU4MXoyR2l2TWRMK0pPb3hNRnZJNFpUbmFGbFF3czMwY0VxVDdBVjJ1amVMTERXbUVVYm1DNXhrMjh3MnYrSE9HL0FtbXBMWjZIWFN4Rkt0OERLSGpqeGF2aHV5TVVBRGFoTXA4cmNQa2ovd0J0ejBBSE9CM3g5U09XK0ZiV0MzVXMwczd0cWM1ZU5Ga2pjRWdITHNXSXdXWWpQWG9CNzEyK3RlRTdIWHJxTzR1RE1zcUpzQmlrS2dqT1JrZXh6K2RRYWY0SjAvVGRRaXZVa3VaSjRzbGZObExBWkJIVDZFL25YbVZLTmVlSlZYUnhXMytmcWVsR2NGVGNlck9KOEZYOGZoUFhOU1hVRElxeUJvZC9sbGp1amxjcU1ESjVENUI3ODFCcGxzNmVGZkZOMHlzaXlGTStZQTIxaEl6bGZmQWRSK251ZTc4UWVHZER1NVd2OVFjMmpFQkhuVzRNSVlkQUd3UUQ2WlBOUWwvQ3orSEcwNFhkb05LeDVUSXR4am5yZ25PY25HYzV5ZXRjNndrNCs0MnJKU3Q4KzVUclIzNzJ2OGpqN2UzdXRROEpYZjJPMG52SlYxWGN5UmxkK1BLQUxmTVI2alBjWlBCeFdIcUYxcUVWNVp4M2R2ZDI4OWxIQ2xwRk5DZ2RncmpZY0JqdUpLZ2RjRFBmT2E5ZThPV2VsMk5nVjBtUkpiZG5MbDFtTXU1c0FFbGlTYzRBNzBtcWVGZFAxblViYSt1VWthZTNJS0ZYS2podHd5QWVlUlJQQVRuQk9NdGZ3SEd1bExWYUdqWXRLOXBDMDZoWmlnTHFPelk1SDUxT2FUT0t4ZGU4WWFiNGVCVzRtRFRkb1l5Qy90bkpBSDRrWnIyM0pRWHZNNGphb3J6VzgrSXVxM1ovMFN6RUVmcnMzUDhBbTVVZitPbjYxUS80VExYZzJUTGQvVHk3YWhTYjJUT0NlT29RZG16MGJ4UXBmdzFxcWprbTFsQS83NE5jSjRiZ1ZkR3RISUJZeEtPblRBRkVIeEZ2NGxLM2tjTXNlTU1KNFdpeVBkeGxmMHJOOEw2Z2JmVGZJbVZrVkpHMk9RZVFlUWVRT09mMHBVNWZ2ZlZIRmk2MUtyR000dlk2cFlvM1VNNks1UDhBZUZGVW85VGhaQnNZeUVjRUtNZnpvcmQzdnVjcW5DeHlCQUFOT1NUR005S2kzYmpqdFNnbmQ3VjZXbHJuNS9LcFZpK1JzbU1vYzA4amlvaWNEaW1pZm4ycnp2cmNYTGxVVHBpcDAxelNrV2xpV1NGbFlCbFBCQkdRYWhXeGVGbDhwZ3lBZ2lLUW5BLzNXNnIrdU93cWEya0piL1pOWEhpeDJ4V1ZhcFRsbzN1ZTlSNWtyeDZGNjA4VjZ4cHNZRzZhUkJ4KytSWjFIMElJYy9VMCs0OGU2NWNxVXQ0b0lnZXNyeEZNZlFGamcvVlRXVjVyL2QzSEZKRkU4OHdqWGtuMU5jeXBQK1oyUFdXWTFWWklSNExpOXVCUGVYMDF4Ti9mNEdQcG5KWDZBZ2UxVUpiRStjWGU0ZDBBd3VQbGNmVmhna2RPUHp6eGpvUllJa1hNcDNrZGw0ckp2WUh0bkNzUVZQSVlkRFhmQ2pCYUpITmlNUk8zTTNxUTJNTjliWEhuV1YweXlnY3VUc2JIWWJnTUVlekExMGFlTzlidFlkcndMTXlqZ3ZDTXQ5U3JnZm9LeGJLY1F0eU9Ed2FzelhhTWhDbkpJeHhVem9KeTAwSXcrTnFVb1dVaExyeG5yK3FncTg2V0VSNEloVERFZm14Qjl3MzRWU2dzb1luTWd6SksyU1paRGxqNjgrL3RUSkFNWnBxU25PTTFwRERRZytiZCtaelZjZFhxNlRsb1hOL2FtN0RuM3BpTUIxcDBrb0F3RFhSYXh5OHcvT0tjb01uUVZXVnc3QVpxeUdDZEt6aytVdUR1Tjh0azV5VnpSVnUzajNvV2ZrZEFLSzUzVlNlcU9wVXJxNXp3KzlUaDk0MFVWNkgyR2ZKVmY0djNDR21qNzM0MFVWODVENGtkbFQ0V1hZT3ArbGFRNWhUNlVVVk5UNGZ2UG9NTitpSzUrOGF1YVI5K2YvY0g4NktLN0tYd3hMWDhVc09mbk5VZFY1dFY5bjQvS2lpdlRqdVJXK0dSUVRwU3Ixb29xenprTmsrN1VjZjN4UlJURTl5WmVwcUdVOWFLS1hVNllmQklMZjd5MWJCNjBVVnoxZHlLZXhvVzNNSy9qUlJSWEE5MmVuSDRVZi9aXCJcclxuICAgICMgICAgIHg6IHBhcnNlSW50KHBhcmFtc1swXS5zdWJzdHJpbmcgNSlcclxuICAgICMgICAgIHk6IHBhcnNlSW50KHBhcmFtc1sxXS5zdWJzdHJpbmcgNSlcclxuICAgICMgICB9LHt9XVxyXG4gIF1cclxuXHJcbiAgY29uZmlnOiAtPiBbICckdXJsUm91dGVyUHJvdmlkZXInLCAnJHByb3ZpZGUnLCAoJHVybFJvdXRlclByb3ZpZGVyLCAkcHJvdmlkZSkgLT5cclxuICAgIFxyXG4gICAgJHVybFJvdXRlclByb3ZpZGVyXHJcbiAgICAgIC5vdGhlcndpc2UgJy8nXHJcbiAgICAkcHJvdmlkZS5kZWNvcmF0b3IgJyRleGNlcHRpb25IYW5kbGVyJywgWyAnJGRlbGVnYXRlJywgKCRkZWxlZ2F0ZSkgLT5cclxuICAgICAgKGV4Y2VwdGlvbiwgY2F1c2UpIC0+XHJcbiAgICAgICAgJGRlbGVnYXRlIGV4Y2VwdGlvbiwgY2F1c2VcclxuICAgICAgICBlcnJvckRhdGEgPVxyXG4gICAgICAgICAgZXhjZXB0aW9uOiBleGNlcHRpb24sXHJcbiAgICAgICAgICBjYXVzZTogY2F1c2VcclxuICAgICAgICAjIyMjIEBUT0RPIFBST1ZJREUgUFJPUFBFUiBIQU5ETElORyBBTkQgTE9HR0lOR1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgJyRleGNlcHRpb25IYW5kbGVyOjpFUlJPUjonLCBleGNlcHRpb24ubXNnLCBlcnJvckRhdGFcclxuICAgIF1cclxuICBdXHJcblxyXG5hcHAgPSBuZXcgTWFpbkFwcGxpY2F0aW9uKClcclxuXHJcbmFuZ3VsYXJcclxuICAubW9kdWxlKCdxdWlja3N0YXJ0QXBwJyxbJ2FwcGxpY2F0aW9uJ10pLmNvbmZpZyggYXBwLmNvbmZpZygpICkucnVuIGFwcC5ydW4oKVxyXG5cclxuIiwiIyMjKlxyXG4gIyBAbmdkb2MgY29udHJvbGxlclxyXG4gIyBAbmFtZSBTdGF0ZUNvbnRyb2xsZXJcclxuIyMjXHJcbmNsYXNzIFN0YXRlQ29udHJvbGxlclxyXG4gIEAkaW5qZWN0OiBbICckc2NvcGUnXVxyXG4gIGNvbnN0cnVjdG9yOiAoQCRzY29wZSkgLT5cclxuICAgICMgY29uc29sZS5sb2coJ3F1aWNrc3RhcnRBcHAuc3RhdGUuY29udHJvbGxlcnMuU3RhdGVDb250cm9sbGVyJylcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLnN0YXRlLmNvbnRyb2xsZXJzLlN0YXRlQ29udHJvbGxlcicsIFtdKVxyXG4gIC5jb250cm9sbGVyICdTdGF0ZUNvbnRyb2xsZXInLCBTdGF0ZUNvbnRyb2xsZXJcclxuIiwicmVxdWlyZSAnLi9jb250cm9sbGVycy9zdGF0ZV9jb250cm9sbGVyJ1xyXG4jIyMqXHJcbiAjICMgcXVpY2tzdGFydEFwcCAvIHN0YXRlXHJcbiMjI1xyXG5hbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5zdGF0ZScsIFtcclxuICAncXVpY2tzdGFydEFwcC5zdGF0ZS5jb250cm9sbGVycy5TdGF0ZUNvbnRyb2xsZXInXHJcbl0pLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIpIC0+XHJcbiAgJHN0YXRlUHJvdmlkZXJcclxuICAgIC5zdGF0ZSAnbXlTdGF0ZScsXHJcbiAgICAgIHVybDogJy8nXHJcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3N0YXRlL3RlbXBsYXRlcy9sYXlvdXQuaHRtbCdcclxuICAgICAgY29udHJvbGxlcjogJ1N0YXRlQ29udHJvbGxlcicgXHJcbiIsIiMjIypcclxuICMgIENhbnZhc0NvbnRyb2xsZXJcclxuIyMjXHJcblxyXG5jbGFzcyBDYW52YXNDb250cm9sbGVyICBcclxuICBAJGluamVjdDogWyAnJHNjb3BlJywgJ0NhbnZhc1NlcnZpY2UnLCAnU3BvdFNlcnZpY2UnLCAnTGl2ZUNhbnZhc1NlcnZpY2UnLCAnJGludGVydmFsJywgJyR3aW5kb3cnXVxyXG4gIGNvbnN0cnVjdG9yOiAoIEBfc2NvcGUsIEBfQ2FudmFzU2VydmljZSwgQF9TcG90U2VydmljZSwgQF9MaXZlQ2FudmFzU2VydmljZSwgJGludGVydmFsLCBAX3dpbmRvdyApIC0+XHJcbiAgICBAX3Njb3BlLnN0b3AgPSB1bmRlZmluZWRcclxuXHJcbiAgICAjIyMqXHJcbiAgICAgKiBIYW5kbGVycyBmb3Igc2NvcGUgRVZFTlRTXHJcbiAgICAjIyNcclxuICAgIEBfc2NvcGUuJG9uICdjYW52YXM6cmVzaXplJywgQF9oYW5kbGVSZXNpemVcclxuICAgIEBfc2NvcGUuJG9uICdzcG90OmxvY2snLCBAX2hhbmRsZVJlc2VydmVTcG90XHJcbiAgICBAX3Njb3BlLiRvbiAnc3BvdDp1bmxvY2snLCBAX2hhbmRsZVVubG9ja1Nwb3RcclxuICAgIEBfc2NvcGUuJG9uICdzcG90OnNhdmUnLCBAX2hhbmRsZURyYXdpbmdTYXZlXHJcblxyXG4gICAgIyMjKlxyXG4gICAgICogU3BvdCBIYW5kbGVycyBmb3IgU09DS0VUU1xyXG4gICAgIyMjXHJcbiAgICBAX0xpdmVDYW52YXNTZXJ2aWNlLm9uICdzcG90LnVwZGF0ZWQnLCAoZGF0YSkgPT5cclxuICAgICAgY29uc29sZS5sb2coJ0xpdmVDYW52YXNTZXJ2aWNlIHNwb3QudXBkYXRlZCcsIGRhdGEpXHJcbiAgICAgIEBfc2NvcGUuJGJyb2FkY2FzdCAnc3BvdDp1cGRhdGUnLCBkYXRhXHJcblxyXG4gICAgQF9MaXZlQ2FudmFzU2VydmljZS5vbiAnc3BvdC5yZXNlcnZlZCcsIChkYXRhKSA9PlxyXG4gICAgICBAX0NhbnZhc1NlcnZpY2UucmVzZXJ2ZVNwb3QgZGF0YSwgQF9zY29wZS5zcG90c1xyXG5cclxuICAgIEBfTGl2ZUNhbnZhc1NlcnZpY2Uub24gJ3Nwb3QudW5yZXNlcnZlZCcsIChkYXRhKSA9PlxyXG4gICAgICBjb25zb2xlLmxvZyAnc3BvdC51bnJlc2VydmVkJywgZGF0YVxyXG4gICAgICBAX0NhbnZhc1NlcnZpY2UudW5yZXNlcnZlU3BvdCBkYXRhLCBAX3Njb3BlLnNwb3RzXHJcblxyXG4gICAgQF9MaXZlQ2FudmFzU2VydmljZS5vbiAnaGVsbG8nLCAoZGF0YSkgPT5cclxuICAgICAgY29uc29sZS5sb2cgJ2hlbGxvIGZyb20gJywgZGF0YVxyXG5cclxuICAgICMjIypcclxuICAgICAqIEhhbmRsZXJzIGZvciBjYW52YXMgbmF2aWdhdGlvbiBGVU5DVElPTlNcclxuICAgICMjI1xyXG4gICAgQF9zY29wZS5yZWZyZXNoQ2FudmFzID0gKHByb3BzKSA9PlxyXG4gICAgICBAX0NhbnZhc1NlcnZpY2Uuc2V0Q29vcmRpbmF0ZXNcclxuICAgICAgICBsYXQ6IHByb3BzPy5sYXQgPyAwXHJcbiAgICAgICAgbG9uZzogcHJvcHM/LmxvbmcgID8gMFxyXG4gICAgICBAX2dldFNwb3RzXHJcbiAgICAgICAgaGVpZ2h0OiBAX3dpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgICAgIHdpZHRoOiBAX3dpbmRvdy5pbm5lcldpZHRoXHJcblxyXG4gICAgQF9zY29wZS5hZGRSb3dJbnRlcnZhbCA9IChvcHRzKSA9PlxyXG4gICAgICB0aWNrID0gPT4gXHJcbiAgICAgICAgQF9hZGRSb3cob3B0cylcclxuICAgICAgQF9zY29wZS5zdG9wID0gJGludGVydmFsKCB0aWNrLCA1MDApXHJcblxyXG4gICAgQF9zY29wZS5hZGRDb2x1bW5JbnRlcnZhbCA9IChvcHRzKSA9PlxyXG4gICAgICB0aWNrID0gPT4gXHJcbiAgICAgICAgQF9hZGRDb2x1bW4ob3B0cylcclxuICAgICAgQF9zY29wZS5zdG9wID0gJGludGVydmFsKCB0aWNrLCA1MDApXHJcblxyXG4gICAgQF9zY29wZS5zdG9wSW50ZXJ2YWwgPSA9PlxyXG4gICAgICBpZiBhbmd1bGFyLmlzRGVmaW5lZCBAX3Njb3BlLnN0b3AgXHJcbiAgICAgICAgJGludGVydmFsLmNhbmNlbCBAX3Njb3BlLnN0b3BcclxuICAgICAgICBAX3Njb3BlLnN0b3AgPSB1bmRlZmluZWRcclxuXHJcbiAgICBAX3Njb3BlLnpvb21JbiA9ID0+XHJcbiAgICAgIEBfQ2FudmFzU2VydmljZS5pbmNyZWFzZVByb3BvcnRpb25zKClcclxuICAgICAgQF9zY29wZS5yZWZyZXNoQ2FudmFzIEBfc2NvcGUuZ2V0Q3VycmVudFBvc2l0aW9uKClcclxuICAgICAgICBcclxuICAgIEBfc2NvcGUuem9vbU91dCA9ID0+XHJcbiAgICAgIEBfQ2FudmFzU2VydmljZS5kZWNyZWFzZVByb3BvcnRpb25zKClcclxuICAgICAgQF9zY29wZS5yZWZyZXNoQ2FudmFzIEBfc2NvcGUuZ2V0Q3VycmVudFBvc2l0aW9uKClcclxuXHJcbiAgICBAX3Njb3BlLmdldEN1cnJlbnRQb3NpdGlvbiA9ID0+XHJcbiAgICAgIGxhdDogQF9zY29wZS5zcG90cy5yb3dzWzBdLnRpbGVzWzBdLnhcclxuICAgICAgbG9uZzogQF9zY29wZS5zcG90cy5yb3dzWzBdLnRpbGVzWzBdLnlcclxuXHJcbiAgX2hhbmRsZURyYXdpbmdTYXZlOiAoZXZlbnQsIGRhdGEpID0+XHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgY29uc29sZS5sb2cgJ0NhbnZhc0NvbnRyb2xsZXIgc3BvdDpzYXZlJywgZGF0YVxyXG4gICAgQF9zY29wZS4kYnJvYWRjYXN0ICdzcG90OnVwZGF0ZScsIGRhdGFcclxuICAgIEBfU3BvdFNlcnZpY2Uuc2F2ZURhdGEgZGF0YVxyXG5cclxuICAgIEBfTGl2ZUNhbnZhc1NlcnZpY2UuZW1pdCAnc3BvdC51cGRhdGUnLCBkYXRhXHJcblxyXG4gIF9oYW5kbGVSZXNlcnZlU3BvdDogKGV2ZW50LCBkYXRhKSA9PlxyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgIEBfTGl2ZUNhbnZhc1NlcnZpY2UuZW1pdCAnc3BvdC5sb2NrJywgZGF0YSAgXHJcbiAgXHJcbiAgX2hhbmRsZVVubG9ja1Nwb3Q6IChldmVudCwgZGF0YSkgPT5cclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICBAX0xpdmVDYW52YXNTZXJ2aWNlLmVtaXQgJ3Nwb3QudW5sb2NrJywgZGF0YVxyXG4gICAgQF9zY29wZS4kYXBwbHkgPT5cclxuICAgICAgQF9DYW52YXNTZXJ2aWNlLnVucmVzZXJ2ZVNwb3QgZGF0YSwgQF9zY29wZS5zcG90c1xyXG5cclxuICBfaGFuZGxlUmVzaXplOiAoZXZlbnQsIGRhdGEpID0+XHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgQF9zY29wZS5yZWZyZXNoQ2FudmFzKClcclxuXHJcbiAgX2dldFNwb3RzOiAocHJvcHMpID0+XHJcbiAgICBAX3Njb3BlLnNwb3RzID0gQF9DYW52YXNTZXJ2aWNlLmdldFNwb3RzRm9yUHJvcG9ydGlvbnMgcHJvcHNcclxuXHJcbiAgX2FkZFJvdzogKGRpcmVjdGlvbikgPT5cclxuICAgIEBfQ2FudmFzU2VydmljZS5hZGRSb3cgQF9zY29wZS5zcG90cywgZGlyZWN0aW9uXHJcblxyXG4gIF9hZGRDb2x1bW46IChkaXJlY3Rpb24pID0+XHJcbiAgICBAX0NhbnZhc1NlcnZpY2UuYWRkQ29sdW1uIEBfc2NvcGUuc3BvdHMsIGRpcmVjdGlvblxyXG5cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jYW52YXMuY29udHJvbGxlcnMuQ2FudmFzQ29udHJvbGxlcicsIFtdKVxyXG4gIC5jb250cm9sbGVyICdDYW52YXNDb250cm9sbGVyJywgQ2FudmFzQ29udHJvbGxlciIsImFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jYW52YXMuZGlyZWN0aXZlcy5DYW52YXNEaXJlY3RpdmUnLCBbXSlcclxuICAuZGlyZWN0aXZlICdtYWdpY0NhbnZhcycsICgkcm9vdFNjb3BlLCAkd2luZG93KSAtPlxyXG4gICAgcmVzdHJpY3Q6ICdFJ1xyXG4gICAgY29udHJvbGxlcjogJ0NhbnZhc0NvbnRyb2xsZXInXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9jYW52YXMvdGVtcGxhdGVzL2xheW91dC5odG1sJ1xyXG4gICAgbGluazogKHNjb3BlLCBlbGVtLCBhdHRyKSAtPlxyXG4gICAgICBfaGFuZGxlUmVzaXplID0gLT5cclxuICAgICAgICBzY29wZS4kZW1pdCAnY2FudmFzOnJlc2l6ZSdcclxuICAgICAgICBlbGVtLmZpbmQoJy5jYW52YXNfd3JhcHBlcicpLmNzc1xyXG4gICAgICAgICAgaGVpZ2h0OiAkd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICAgICAgICB3aWR0aDogJHdpbmRvdy5pbm5lcldpZHRoXHJcblxyXG4gICAgICBfYXBwbHlSZXNpemVkID0gPT5cclxuICAgICAgICBzY29wZS4kYXBwbHkgX2hhbmRsZVJlc2l6ZVxyXG5cclxuICAgICAgX2hhbmRsZVJlc2l6ZSgpXHJcblxyXG4gICAgICBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCAncmVzaXplJywgXy50aHJvdHRsZSBfYXBwbHlSZXNpemVkICwgMTAwMCIsInJlcXVpcmUgJy4vY29udHJvbGxlcnMvY2FudmFzX2NvbnRyb2xsZXInXHJcbnJlcXVpcmUgJy4vc2VydmljZXMvY2FudmFzX3NlcnZpY2UnXHJcbnJlcXVpcmUgJy4vc2VydmljZXMvbGl2ZV9jYW52YXNfc2VydmljZSdcclxucmVxdWlyZSAnLi9kaXJlY3RpdmVzL2NhbnZhc19kaXJlY3RpdmUnXHJcblxyXG4jIyMqXHJcbiAjIEBuYW1lIGNhbnZhc1xyXG4jIyNcclxuXHJcbmFuZ3VsYXIubW9kdWxlICdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jYW52YXMnLCBbXHJcbiAgJ3F1aWNrc3RhcnRBcHAuY29tbW9uLmNhbnZhcy5zZXJ2aWNlcy5DYW52YXNTZXJ2aWNlJ1xyXG5cdCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jYW52YXMuc2VydmljZXMuTGl2ZUNhbnZhc1NlcnZpY2UnXHJcblx0J3F1aWNrc3RhcnRBcHAuY29tbW9uLmNhbnZhcy5jb250cm9sbGVycy5DYW52YXNDb250cm9sbGVyJ1xyXG5cdCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jYW52YXMuZGlyZWN0aXZlcy5DYW52YXNEaXJlY3RpdmUnXHJcbl0gXHJcbiIsImFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jYW52YXMuc2VydmljZXMuQ2FudmFzU2VydmljZScsIFtdKVxyXG4gIC5zZXJ2aWNlICdDYW52YXNTZXJ2aWNlJywgY2xhc3MgQ2FudmFzXHJcbiAgICBfUHJvcG9ydGlvbnM6XHJcbiAgICAgIHdpZHRoOiAxNTBcclxuICAgICAgaGVpZ2h0OiAxOTRcclxuICAgIF9jb29yZG9uYXRlczogXHJcbiAgICAgIGxhdDogMFxyXG4gICAgICBsb25nOiAwXHJcblxyXG4gICAgaW5jcmVhc2VQcm9wb3J0aW9uczogPT5cclxuICAgICAgQF9Qcm9wb3J0aW9ucy53aWR0aCArPSAxMFxyXG4gICAgICBAX1Byb3BvcnRpb25zLmhlaWdodCArPSAxNFxyXG5cclxuICAgIGRlY3JlYXNlUHJvcG9ydGlvbnM6ID0+XHJcbiAgICAgIEBfUHJvcG9ydGlvbnMud2lkdGggLT0gMTVcclxuICAgICAgQF9Qcm9wb3J0aW9ucy5oZWlnaHQgLT0gMjFcclxuXHJcbiAgICByZXNlcnZlU3BvdDogKHNwb3QsIHNwb3RzKSA9PlxyXG4gICAgICBmb3Igcm93IGluIHNwb3RzLnJvd3NcclxuICAgICAgICBmb3IgdGlsZSBpbiByb3cudGlsZXNcclxuICAgICAgICAgIGlmIHRpbGUueSBpcyBzcG90LnkgYW5kIHRpbGUueCBpcyBzcG90LnhcclxuICAgICAgICAgICAgdGlsZS5zdGF0dXMgPSAncmVzZXJ2ZWQnXHJcblxyXG4gICAgdW5yZXNlcnZlU3BvdDogKHNwb3QsIHNwb3RzKSA9PlxyXG4gICAgICBjb25zb2xlLmxvZyAnQ2FudmFzU2VydmljZScsIHNwb3QsIHNwb3RzXHJcbiAgICAgIGZvciByb3cgaW4gc3BvdHMucm93c1xyXG4gICAgICAgIGZvciB0aWxlIGluIHJvdy50aWxlc1xyXG4gICAgICAgICAgaWYgdGlsZS55IGlzIHNwb3QueSBhbmQgdGlsZS54IGlzIHNwb3QueFxyXG4gICAgICAgICAgICB0aWxlLnN0YXR1cyA9ICdmcmVlJ1xyXG5cclxuICAgIGFkZFJvdzogKHNwb3RzLCBkaXJlY3Rpb24pID0+XHJcbiAgICAgIGNvbnNvbGUubG9nIHNwb3RzLCBkaXJlY3Rpb25cclxuICAgICAgaWYgZGlyZWN0aW9uIGlzICd1cCdcclxuICAgICAgICAgIHNwb3RzLnJvd3MudW5zaGlmdFxyXG4gICAgICAgICAgICB0aWxlczogXy5tYXAgXy5maXJzdChzcG90cy5yb3dzKS50aWxlcywgKHRpbGUsaSkgPT5cclxuICAgICAgICAgICAgICB5OiB0aWxlLnktMVxyXG4gICAgICAgICAgICAgIHg6IHRpbGUueFxyXG4gICAgICAgICAgICAgIGhlaWdodDogQF9Qcm9wb3J0aW9ucy5oZWlnaHRcclxuICAgICAgICAgICAgICB3aWR0aDogQF9Qcm9wb3J0aW9ucy53aWR0aFxyXG4gICAgICAgICAgc3BvdHMucm93cy5wb3AoKVxyXG4gICAgICBpZiBkaXJlY3Rpb24gaXMgJ2Rvd24nXHJcbiAgICAgICAgICBzcG90cy5yb3dzLnB1c2hcclxuICAgICAgICAgICAgdGlsZXM6IF8ubWFwIF8ubGFzdChzcG90cy5yb3dzKS50aWxlcywgKHRpbGUsaSkgPT5cclxuICAgICAgICAgICAgICB5OiB0aWxlLnkrMVxyXG4gICAgICAgICAgICAgIHg6IHRpbGUueFxyXG4gICAgICAgICAgICAgIGhlaWdodDogQF9Qcm9wb3J0aW9ucy5oZWlnaHRcclxuICAgICAgICAgICAgICB3aWR0aDogQF9Qcm9wb3J0aW9ucy53aWR0aFxyXG4gICAgICAgICAgc3BvdHMucm93cy5zaGlmdCgpXHJcblxyXG4gICAgYWRkQ29sdW1uOiAoc3BvdHMsIGRpcmVjdGlvbikgPT5cclxuICAgICAgaWYgZGlyZWN0aW9uIGlzICdyaWdodCdcclxuICAgICAgICBfLm1hcCBzcG90cy5yb3dzLCAocm93LGkpID0+XHJcbiAgICAgICAgICByb3cudGlsZXMucHVzaFxyXG4gICAgICAgICAgICB4OiBfLmxhc3Qocm93LnRpbGVzKS54KzFcclxuICAgICAgICAgICAgeTogXy5maXJzdChyb3cudGlsZXMpLnlcclxuICAgICAgICAgICAgaGVpZ2h0OiBAX1Byb3BvcnRpb25zLmhlaWdodFxyXG4gICAgICAgICAgICB3aWR0aDogQF9Qcm9wb3J0aW9ucy53aWR0aFxyXG4gICAgICAgICAgcm93LnRpbGVzLnNoaWZ0KClcclxuICAgICAgZWxzZSBpZiBkaXJlY3Rpb24gaXMgJ2xlZnQnXHJcbiAgICAgICAgXy5tYXAgc3BvdHMucm93cywgKHJvdyxpKSA9PlxyXG4gICAgICAgICAgcm93LnRpbGVzLnVuc2hpZnRcclxuICAgICAgICAgICAgeDogXy5maXJzdChyb3cudGlsZXMpLngtMVxyXG4gICAgICAgICAgICB5OiBfLmZpcnN0KHJvdy50aWxlcykueVxyXG4gICAgICAgICAgICBoZWlnaHQ6IEBfUHJvcG9ydGlvbnMuaGVpZ2h0XHJcbiAgICAgICAgICAgIHdpZHRoOiBAX1Byb3BvcnRpb25zLndpZHRoXHJcbiAgICAgICAgICByb3cudGlsZXMucG9wKClcclxuXHJcbiAgICBzZXRDb29yZGluYXRlczogKHByb3BzKSA9PlxyXG4gICAgICBAX2Nvb3Jkb25hdGVzLmxhdCA9IHByb3BzLmxhdFxyXG4gICAgICBAX2Nvb3Jkb25hdGVzLmxvbmcgPSBwcm9wcy5sb25nXHJcblxyXG4gICAgZ2V0U3BvdHNGb3JQcm9wb3J0aW9uczogKHByb3BzKSA9PlxyXG4gICAgICAjIHJvd3MgPSAxMFxyXG4gICAgICAjIHRpbGVzUGVyUm93ID0gMjBcclxuICAgICAgcm93cyA9IE1hdGguZmxvb3IocHJvcHMuaGVpZ2h0IC8gQF9Qcm9wb3J0aW9ucy5oZWlnaHQpXHJcbiAgICAgIHRpbGVzUGVyUm93ID0gTWF0aC5mbG9vcihwcm9wcy53aWR0aCAvIEBfUHJvcG9ydGlvbnMud2lkdGgpXHJcbiAgICAgIHJvd3M6IGZvciBpIGluIFtAX2Nvb3Jkb25hdGVzLmxvbmcuLi5AX2Nvb3Jkb25hdGVzLmxvbmcrcm93c11cclxuICAgICAgICB0aWxlczogZm9yIGogaW4gW0BfY29vcmRvbmF0ZXMubGF0Li4uQF9jb29yZG9uYXRlcy5sYXQrdGlsZXNQZXJSb3ddXHJcbiAgICAgICAgICB4OiBqXHJcbiAgICAgICAgICB5OiBpXHJcbiAgICAgICAgICBoZWlnaHQ6IEBfUHJvcG9ydGlvbnMuaGVpZ2h0XHJcbiAgICAgICAgICB3aWR0aDogQF9Qcm9wb3J0aW9ucy53aWR0aFxyXG4gICAgICAgICAgc3RhdHVzOiAnbG9hZGluZydcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuY29tbW9uLmNhbnZhcy5zZXJ2aWNlcy5MaXZlQ2FudmFzU2VydmljZScsIFtdKVxyXG4gIC5mYWN0b3J5ICdMaXZlQ2FudmFzU2VydmljZScsIFsnc29ja2V0RmFjdG9yeScgLCAnQkFTRVVSTCcsIChzb2NrZXRGYWN0b3J5LCBCQVNFVVJMKSAtPlxyXG4gICAgaW9Tb2NrZXQgPSBpby5jb25uZWN0IFwiI3tCQVNFVVJMfS9MaXZlQ2FudmFzXCJcclxuICAgIHJhbmRvbVJvb21Tb2NrZXQgPSBzb2NrZXRGYWN0b3J5XHJcbiAgICAgIGlvU29ja2V0OiBpb1NvY2tldFxyXG4gICAgcmV0dXJuIHJhbmRvbVJvb21Tb2NrZXRcclxuICBdXHJcbiIsIiMjIypcclxuICMgIFNwb3RDb250cm9sbGVyXHJcbiMjI1xyXG5cclxuY2xhc3MgU3BvdENvbnRyb2xsZXIgIFxyXG4gIEAkaW5qZWN0OiBbICckc2NvcGUnLCAnU3BvdFNlcnZpY2UnIF1cclxuICBjb25zdHJ1Y3RvcjogKCBAX3Njb3BlLCBAX1Nwb3RTZXJ2aWNlICkgLT5cclxuICAgIEBfc2NvcGUuZGF0YSA9IEBfZ2V0RGF0YSgpXHJcblxyXG4gICAgQF9zY29wZS4kb24gJ2RyYXdpbmc6c2F2ZScsIChldmVudCwgZGF0YSkgPT5cclxuICAgICAgY29uc29sZS5sb2cgJ3Nwb3RDb250cm9sZXIgZHJhd2luZzpzYXZlJywgZGF0YVxyXG4gICAgICBAX3Njb3BlLiRlbWl0ICdzcG90OnNhdmUnLCBkYXRhXHJcbiAgICAgIFxyXG4gICAgQF9zY29wZS4kb24gJ3Nwb3Q6dXBkYXRlJywgKGV2ZW50LCBkYXRhKSA9PlxyXG4gICAgICBpZiBkYXRhLmhQb3MgaXMgQF9zY29wZS5zcG90T3B0cy54IGFuZCBkYXRhLnZQb3MgaXMgQF9zY29wZS5zcG90T3B0cy55XHJcbiAgICAgICAgY29uc29sZS5sb2cgJ3Nwb3RDb250cm9sZXIgc3BvdDp1cGRhdGVkJywgZGF0YVxyXG4gICAgICAgIEBfc2NvcGUuJGJyb2FkY2FzdCAnZHJhdzpkYXRhJywgZGF0YS5kcmF3aW5nRGF0YVVybFxyXG5cclxuICAgIEBfc2NvcGUuZGF0YS50aGVuIChyZXMpID0+XHJcbiAgICAgIGlmIHJlcy5kYXRhPy5kcmF3aW5nRGF0YVVybFxyXG4gICAgICAgIEBfc2NvcGUuJGJyb2FkY2FzdCAnZHJhdzpkYXRhJywgcmVzLmRhdGEuZHJhd2luZ0RhdGFVcmxcclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBfc2NvcGUuJGJyb2FkY2FzdCAnZnJlZTpkYXRhJywgcmVzXHJcblxyXG4gIF9nZXREYXRhOiA9PlxyXG4gICAgQF9TcG90U2VydmljZS5nZXREYXRhIFxyXG4gICAgICBoUG9zOiBAX3Njb3BlLnNwb3RPcHRzLnggXHJcbiAgICAgIHZQb3M6IEBfc2NvcGUuc3BvdE9wdHMueVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnNwb3QuY29udHJvbGxlcnMuU3BvdENvbnRyb2xsZXInLCBbXSlcclxuICAuY29udHJvbGxlciAnU3BvdENvbnRyb2xsZXInLCBTcG90Q29udHJvbGxlciIsImFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5zcG90LmRpcmVjdGl2ZXMuQ2FudmFzU3BvdERpcmVjdGl2ZScsIFtdKVxyXG4gIC5kaXJlY3RpdmUgJ2NhbnZhc1Nwb3QnLCAoJHJvb3RTY29wZSwgJGNvbXBpbGUsICRtb2RhbCwgJHdpbmRvdywgQkFTRUhPU1QpIC0+XHJcbiAgICByZXN0cmljdDogJ0EnXHJcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW0sIGF0dHIpIC0+XHJcblxyXG4gICAgICAjIyMqXHJcbiAgICAgICAqIFtzY29wZSBNRVRIT0RTXVxyXG4gICAgICAjIyNcclxuICAgICAgc2NvcGUuX2xpc3RlbkZvckRyYXdpbmcgPSAoZXZlbnQpID0+XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGNvbnNvbGUubG9nICdfbGlzdGVuRm9yRHJhd2luZydcclxuICAgICAgICBzY29wZS4kYnJvYWRjYXN0ICdkcmF3aW5nOnNhdmUnLCBcclxuICAgICAgICAgIGhQb3M6IHNjb3BlLnNwb3RPcHRzLnhcclxuICAgICAgICAgIHZQb3M6IHNjb3BlLnNwb3RPcHRzLnlcclxuICAgICAgICAgIGRyYXdpbmdEYXRhVXJsOiBldmVudC5kYXRhXHJcblxyXG4gICAgICBzY29wZS5fb3BlbkRyYXdpbmdGcmFtZSA9IChkYXRhKSA9PlxyXG4gICAgICAgICRtb2RhbFxyXG4gICAgICAgICAgdGl0bGU6ICdkcmF3aW5nIGZyYW1lJ1xyXG4gICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgYW5pbWF0aW9uOiAnYW0tZmFkZS1hbmQtc2NhbGUnXHJcbiAgICAgICAgICBiYWNrZHJvcEFuaW1hdGlvbjogJ2FtLWZhZGUnXHJcbiAgICAgICAgICBjb250ZW50VGVtcGxhdGU6ICdjb21tb24vc3BvdC90ZW1wbGF0ZXMvZHJhd19jYW52YXNfZnJhbWUuaHRtbCdcclxuICAgICAgICAgIHNjb3BlOiBzY29wZVxyXG5cclxuICAgICAgc2NvcGUuc2F2ZURyYXdpbmcgPSAoZGF0YSkgPT5cclxuICAgICAgICAjICR3aW5kb3cuZnJhbWVzWzBdLnBvc3RNZXNzYWdlICdzYXZlLmZyYW1lJywgJ2h0dHA6Ly8xODRkZjY5Zi5uZ3Jvay5jb20nXHJcbiAgICAgICAgJHdpbmRvdy5mcmFtZXNbMF0ucG9zdE1lc3NhZ2UgJ3NhdmUuZnJhbWUnLCBCQVNFSE9TVFxyXG5cclxuICAgICAgc2NvcGUuX3VucmVzZXJ2ZVNwb3QgPSAoZGF0YSkgPT5cclxuICAgICAgICBzY29wZS4kZW1pdCAnc3BvdDp1bmxvY2snLCBkYXRhXHJcblxyXG4gICAgICBzY29wZS5fcmVzZXJ2ZVNwb3QgPSAoZGF0YSkgPT5cclxuICAgICAgICBzY29wZS4kZW1pdCAnc3BvdDpsb2NrJywgZGF0YVxyXG5cclxuICAgICAgIyMjKlxyXG4gICAgICAgKiBbc2NvcGUgSEFORExFUlNdXHJcbiAgICAgICMjI1xyXG4gICAgICBzY29wZS4kb24gJ21vZGFsLnNob3cnLCAoZXZlbnQpID0+XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAkd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ21lc3NhZ2UnLCBzY29wZS5fbGlzdGVuRm9yRHJhd2luZ1xyXG4gICAgICAgICAgXHJcbiAgICAgIHNjb3BlLiRvbiAnbW9kYWwuaGlkZScsIChldmVudCwgZGF0YSkgPT5cclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciAnbWVzc2FnZScsIHNjb3BlLl9saXN0ZW5Gb3JEcmF3aW5nXHJcbiAgICAgICAgc2NvcGUuX3VucmVzZXJ2ZVNwb3Qgc2NvcGUuc3BvdE9wdHNcclxuXHJcbiAgICAgIHNjb3BlLiRvbiAnc3BvdDpjb25uZWN0JywgKGV2ZW50LCBkYXRhKSA9PlxyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgc2NvcGUuc3BvdE9wdHMgPSBkYXRhLnNwb3RPcHRzXHJcbiAgICAgICAgc2NvcGUuX3Jlc2VydmVTcG90KGRhdGEuc3BvdE9wdHMpXHJcbiAgICAgICAgc2NvcGUuX29wZW5EcmF3aW5nRnJhbWUoZGF0YS5zcG90T3B0cylcclxuXHJcblxyXG4gICAgICBcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnNwb3QuZGlyZWN0aXZlcy5EcmF3aW5nQ2FudmFzRGlyZWN0aXZlJywgW10pXHJcbiAgLmRpcmVjdGl2ZSAnZHJhd2luZ0NhbnZhcycsICgkcm9vdFNjb3BlLCAkY29tcGlsZSwgJHdpbmRvdykgLT5cclxuICAgIHJlc3RyaWN0OiAnRSdcclxuICAgICMgdGVtcGxhdGU6ICcnJzxkaXY+PGNhbnZhcyBpZD1cImRyYXdpbmdDYW52YXNcIiB3aWR0aD1cIjUwMFwiIGhlaWdodD1cIjcwMFwiPiA8L2NhbnZhcz48L2Rpdj4nJydcclxuICAgIHRlbXBsYXRlOiAnJyc8ZGl2PjxpZnJhbWUgY2xhc3M9XCJkcmF3aW5nQ2FudmFzRnJhbWVcIiB3aWR0aD1cIjU1MFwiIGhlaWdodD1cIjcxMVwiIHNyYz1cImhhcm1vbnlfY2FudmFzL2luZGV4Lmh0bWxcIj4gPC9pZnJhbWU+PC9kaXY+JycnXHJcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW0sIGF0dHIpIC0+XHJcbiAgICAgIFxyXG4gICAgICBzY29wZS5faW5pdERyYXdpbmdQYWQgPSA9PlxyXG4gICAgICAgIGlXaW5kb3cgPSBlbGVtLmZpbmQoJy5kcmF3aW5nQ2FudmFzRnJhbWUnKSAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2cgJ2NvbnRleHRXaW5kb3cnLCBhbmd1bGFyLmVsZW1lbnQoaVdpbmRvdylbMF1cclxuICAgICAgICBjb25zb2xlLmxvZyAnY29udGV4dFdpbmRvdycsIGFuZ3VsYXIuZWxlbWVudChpV2luZG93KS5jb250ZW50V2luZG93XHJcblxyXG4gICAgICBzY29wZS5faW5pdERyYXdpbmdQYWQoKVxyXG4iLCJhbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdC5kaXJlY3RpdmVzLlNwb3REaXJlY3RpdmUnLCBbXSlcclxuICAuZGlyZWN0aXZlICdzcG90VGlsZScsICgkcm9vdFNjb3BlKSAtPlxyXG4gICAgcmVzdHJpY3Q6ICdFJ1xyXG4gICAgc2NvcGU6XHJcbiAgICAgIHNwb3RPcHRzOiAnPSdcclxuICAgIGNvbnRyb2xsZXI6ICdTcG90Q29udHJvbGxlcidcclxuICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL3Nwb3QvdGVtcGxhdGVzL2xheW91dC5odG1sJ1xyXG4gICAgbGluazogKHNjb3BlLCBlbGVtLCBhdHRyKSAtPlxyXG5cclxuICAgICAgZWxlbS5iaW5kICdtb3VzZW92ZXInLCAtPlxyXG4gICAgICAgIGlmIHNjb3BlLnNwb3RPcHRzLnN0YXR1cyBpcyAnZnJlZSdcclxuICAgICAgICAgIGVsZW0uYWRkQ2xhc3MgJ2hvdmVyZWQnXHJcblxyXG4gICAgICBlbGVtLmJpbmQgJ21vdXNlbGVhdmUnLCAtPlxyXG4gICAgICAgIGVsZW0ucmVtb3ZlQ2xhc3MgJ2hvdmVyZWQnXHJcbiAgICAgIFxyXG4gICAgICBzY29wZS4kd2F0Y2ggJ3Nwb3RPcHRzLnN0YXR1cycsICggbmV3VmFsLCBvbGRWYWwgKSA9PlxyXG4gICAgICAgIGlmIG5ld1ZhbD8gYW5kIG5ld1ZhbCBpc250IG9sZFZhbFxyXG4gICAgICAgICAgc3dpdGNoIG5ld1ZhbFxyXG4gICAgICAgICAgICB3aGVuICdyZXNlcnZlZCdcclxuICAgICAgICAgICAgICBlbGVtLmZpbmQoJy5kcmF3aW5nJykuYWRkQ2xhc3MoJ2Nvbm5lY3RlZCcpXHJcbiAgICAgICAgICAgIHdoZW4gJ2ZyZWUnXHJcbiAgICAgICAgICAgICAgZWxlbS5maW5kKCcuZHJhd2luZycpLnJlbW92ZUNsYXNzKCdjb25uZWN0ZWQnKVxyXG5cclxuICAgICAgc2NvcGUuY29ubmVjdEZyYW1lID0gPT5cclxuICAgICAgICAjIGVsZW0uZmluZCgnLmRyYXdpbmcnKS50b2dnbGVDbGFzcygnY29ubmVjdGVkJylcclxuICAgICAgICBzY29wZS4kZW1pdCAnc3BvdDpjb25uZWN0JywgXHJcbiAgICAgICAgICBzY29wZVJlZjogc2NvcGVcclxuICAgICAgICAgIHNwb3RPcHRzOiBzY29wZS5zcG90T3B0c1xyXG4gICAgICAgIG51bGxcclxuXHJcbiAgICAgIHNjb3BlLiRvbiAnZnJlZTpkYXRhJywgKGV2ZW50LCBkYXRhKSA9PlxyXG4gICAgICAgIGNvbnNvbGUubG9nICdmcmVlOmRhdGEnLCBkYXRhXHJcbiAgICAgICAgc2NvcGUuc3BvdE9wdHMuc3RhdHVzID0gJ2ZyZWUnXHJcbiAgICAgICAgXHJcbiAgICAgIHNjb3BlLiRvbiAnZHJhdzpkYXRhJywgKGV2ZW50LCBkYXRhKSA9PlxyXG4gICAgICAgIHNjb3BlLnNwb3RPcHRzLnN0YXR1cyA9ICdkcmF3aW5nJ1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlbGVtLnVuYmluZCgpXHJcbiAgICAgICAgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgICBpbWcuY2xhc3NOYW1lID0gJ2RyYXdpbmcnXHJcbiAgICAgICAgaW1nLnNyYyA9IGRhdGFcclxuICAgICAgICBlbGVtLmZpbmQoJy5kcmF3aW5nJykucmVtb3ZlQ2xhc3MoJ2Nvbm5lY3RlZCcpXHJcbiAgICAgICAgZWxlbS5maW5kKCcuZHJhd2luZ0NhbnZhcycpLmh0bWwoaW1nKVxyXG4gICAgICAgICMgZWxlbS5maW5kKCcuZHJhd2luZycpLmFkZENsYXNzKCdjb25uZWN0ZWQnKVxyXG4iLCJyZXF1aXJlICcuL2NvbnRyb2xsZXJzL3Nwb3RfY29udHJvbGxlcidcclxucmVxdWlyZSAnLi9zZXJ2aWNlcy9zcG90X3NlcnZpY2UnXHJcbnJlcXVpcmUgJy4vZGlyZWN0aXZlcy9zcG90X2RpcmVjdGl2ZSdcclxucmVxdWlyZSAnLi9kaXJlY3RpdmVzL2NhbnZhc19zcG90X2RpcmVjdGl2ZSdcclxucmVxdWlyZSAnLi9kaXJlY3RpdmVzL2RyYXdpbmdfY2FudmFzX2RpcmVjdGl2ZSdcclxuIyMjKlxyXG4gIyBAbmFtZSBzcG90XHJcbiMjI1xyXG5hbmd1bGFyLm1vZHVsZSAncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdCcsIFtcclxuXHQncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdC5zZXJ2aWNlcy5TcG90U2VydmljZSdcclxuXHQncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdC5jb250cm9sbGVycy5TcG90Q29udHJvbGxlcidcclxuICAncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdC5kaXJlY3RpdmVzLlNwb3REaXJlY3RpdmUnXHJcbiAgJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnNwb3QuZGlyZWN0aXZlcy5DYW52YXNTcG90RGlyZWN0aXZlJ1xyXG5cdCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5zcG90LmRpcmVjdGl2ZXMuRHJhd2luZ0NhbnZhc0RpcmVjdGl2ZSdcclxuXSBcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnNwb3Quc2VydmljZXMuU3BvdFNlcnZpY2UnLCBbXSlcclxuICAuZmFjdG9yeSAnU3BvdFNlcnZpY2UnLCAoJGh0dHAsIEJBU0VVUkwpIC0+XHJcbiAgICBcclxuICAgIHNhdmVEYXRhOiAoZGF0YSkgLT5cclxuICAgICAgJGh0dHAucG9zdCBcIiN7QkFTRVVSTH0vYXBpL3Nwb3QvXCIsIGRhdGE6IGRhdGFcclxuXHJcbiAgICBnZXREYXRhOiAob3B0cykgLT5cclxuICAgICAgJGh0dHBcclxuICAgICAgICB1cmw6XCIje0JBU0VVUkx9L2FwaS9zcG90L1wiXHJcbiAgICAgICAgcGFyYW1zOiBvcHRzXHJcbiAgICAgICAgIyBjYWNoZTogdHJ1ZSBcclxuIiwicmVxdWlyZSAnLi9zZXJ2aWNlcy9tb2R1bGVfZXh0ZW5zaW9uJ1xyXG5yZXF1aXJlICcuL3NlcnZpY2VzL29ic2VydmFibGVfbWl4aW4nXHJcbnJlcXVpcmUgJy4vc2VydmljZXMvcmVxdWVzdF9hYm9ydGVyX3NlcnZpY2UnXHJcblxyXG5cclxuYW5ndWxhci5tb2R1bGUgJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnV0aWxzJywgW1xyXG4gICdxdWlja3N0YXJ0QXBwLmNvbW1vbi51dGlscy5zZXJ2aWNlcy5Nb2R1bGUnXHJcbiAgJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnV0aWxzLnNlcnZpY2VzLk9ic2VydmFibGVNaXhpbidcclxuICAncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMuc2VydmljZXMuUmVxdWVzdEFib3J0ZXJNaXhpbidcclxuXVxyXG4iLCIjIyNcclxuICAgIEFuIG9iamVjdCB0aGF0IGFkZHMgZXh0cmEgZnVuY3Rpb25hbGl0eSB0byBhIGJhc2ljIGNsYXNzXHJcbiMjI1xyXG5hbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMuc2VydmljZXMuTW9kdWxlJywgW10pXHJcbiAgLmZhY3RvcnkgJ01vZHVsZScsICgpIC0+IGNsYXNzIE1vZHVsZVxyXG4gICAgIyMjXHJcbiAgICAgICAgQXR0YWNoZXMgZXZlcnkgcHJvcGVydHkgb2YgdGhlIG9iaiBkaXJlY3RseSBvbiB0aGUgZnVuY3Rpb24gY29uc3RydWN0b3JcclxuXHJcbiAgICAgICAgQHBhcmFtIFtPYmplY3RdIG9iaiBhbmQgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgZXh0ZW5zaW9uIHByb3BlcnRpZXNcclxuICAgICMjI1xyXG4gICAgQGV4dGVuZDogKG9iaikgLT5cclxuICAgICAgZm9yIGtleSwgdmFsdWUgb2Ygb2JqIHdoZW4ga2V5IG5vdCBpbiBbJ2V4dGVuZCcsJ2luY2x1ZGUnXVxyXG4gICAgICAgIEBba2V5XSA9IHZhbHVlXHJcbiAgICAgIG9iai5leHRlbmRlZD8uYXBwbHkoQClcclxuICAgICAgdGhpc1xyXG5cclxuICAgICMjI1xyXG4gICAgICAgIEF0dGFjaGVzIGV2ZXJ5IHByb3BlcnR5IG9mIHRoZSBvYmogdG8gdGhlXHJcbiAgICAgICAgcHJvdG90eXBlIG9mIHRoZSBmdW5jdGlvbiBjb25zdHJ1Y3RvclxyXG5cclxuICAgICAgICBAcGFyYW0gW09iamVjdF0gb2JqIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGluY2x1ZGVkIHByb3BlcnRpZXNcclxuICAgICAgICBAcGFyYW0gW0Z1bmN0aW9uXSBkZWNvcmF0b3IgYSBkZWNvcmF0b3IgZnVuY3Rpb24gYXBwbGllZFxyXG4gICAgICAgIGZvciBldmVyeSBwcm9wZXJ0eSdzIHZhbHVlXHJcbiAgICAjIyNcclxuICAgIEBpbmNsdWRlOiAob2JqLCBkZWNvcmF0b3IpIC0+XHJcbiAgICAgIGZvciBrZXksIHZhbHVlIG9mIG9iaiB3aGVuIGtleSAgbm90IGluIFsnZXh0ZW5kJywnaW5jbHVkZSddXHJcbiAgICAgICAgaWYgZGVjb3JhdG9yIGFuZCB0eXBlb2YgdmFsdWUgaXMgJ0Z1bmN0aW9uJ1xyXG4gICAgICAgICAgdmFsdWUgPSBkZWNvcmF0b3IodmFsdWUpXHJcbiAgICAgICAgQDo6W2tleV0gPSB2YWx1ZVxyXG4gICAgICBvYmouaW5jbHVkZWQ/LmFwcGx5KEApXHJcbiAgICAgIHRoaXNcclxuXHJcbiIsIlxyXG4jIyNcclxuICAgIEdpdmVuIGEgbGlzdCBvZiBjYWxsYmFjayBmdW5jdGlvbnMgaXQgaXRlcmF0ZXMgdGhyb3VnaCBpdFxyXG4gICAgYW5kIGNhbGxzIGVhY2ggZnVuY3Rpb24gYWxvbmdzaWRlIHRoZSBwYXNzZWQgYXJndW1lbnRzXHJcblxyXG4gICAgVGhhbmtzIHRvIEplcmVteSBBc2hrZW5hcyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNoa2VuYXMvYmFja2JvbmUvXHJcblxyXG4gICAgQHBhcmFtIFtBcnJheV0gY2FsbGJhY2tzIHRoZSBsaXN0IG9mIGNhbGxiYWNrIGZ1bmN0aW9ucyB0byBiZSBjYWxsZWRcclxuICAgIEBwYXJhbSBbQXJyYXldIGFyZ3MgdGhlIGFyZ3VtZW50cyBhcnJheSBwYXNzZWQgdG8gRXZlbnRCdXM6OnRyaWdnZXJcclxuIyMjXHJcbnRyaWdnZXJFdmVudENhbGxiYWNrcyA9IChjYWxsYmFja3MsIGFyZ3MpIC0+XHJcbiAgW2ExLCBhMiwgYTNdID0gW2FyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl1dXHJcbiAgY2JMZW4gPSBjYWxsYmFja3M/Lmxlbmd0aCB8fCAwXHJcbiAgaSA9IC0xXHJcbiBcclxuICBzd2l0Y2ggYXJncy5sZW5ndGhcclxuICAgIHdoZW4gMFxyXG4gICAgICB3aGlsZSAoKytpIDwgY2JMZW4pXHJcbiAgICAgICAgY2FsbGJhY2tzW2ldLmNiLmNhbGwoY2FsbGJhY2tzW2ldLmN0eClcclxuICAgIHdoZW4gMVxyXG4gICAgICB3aGlsZSAoKytpIDwgY2JMZW4pXHJcbiAgICAgICAgY2FsbGJhY2tzW2ldLmNiLmNhbGwoY2FsbGJhY2tzW2ldLmN0eCwgYTEpXHJcbiAgICB3aGVuIDJcclxuICAgICAgd2hpbGUgKCsraSA8IGNiTGVuKVxyXG4gICAgICAgIGNhbGxiYWNrc1tpXS5jYi5jYWxsKGNhbGxiYWNrc1tpXS5jdHgsIGExLCBhMilcclxuICAgIHdoZW4gM1xyXG4gICAgICB3aGlsZSAoKytpIDwgY2JMZW4pXHJcbiAgICAgICAgY2FsbGJhY2tzW2ldLmNiLmNhbGwoY2FsbGJhY2tzW2ldLmN0eCwgYTEsIGEyLCBhMylcclxuICAgIGVsc2VcclxuICAgICAgd2hpbGUgKCsraSA8IGNiTGVuKVxyXG4gICAgICAgIGNhbGxiYWNrc1tpXS5jYi5hcHBseShjYWxsYmFja3NbaV0uY3R4LCBhcmdzKVxyXG5cclxuIyMjXHJcbiAgICBEaXNwYXRjaGluZyBtZWNoYW5pc20gZm9yIGNlbnRyYWxpemluZyBhcHBsaWNhdGlvbi13aWRlIGV2ZW50c1xyXG5cclxuICAgIFRoZSBpbnRlcm5hbCBzdHJ1Y3R1cmUgb2YgdGhlIGV2ZW50IGxpc3QgbG9va3MgbGlrZSB0aGlzOlxyXG4gICAgICAgIGV2ZW50cyA9IHtcclxuICAgICAgICAgICAgY2FsbGJhY2tzOiBbe2NiLCBjdHh9LCB7Y2IsIGN0eH0sIC4uLl1cclxuICAgICAgICB9XHJcbiAgICB3aGVyZSBlYWNoIG9iamVjdCBjb3JyZXNwb25kaW5nIHRvIHRoZSBcImV2ZW50TmFtZVwiIGFycmF5LFxyXG4gICAgcmVwcmVzZW50cyBhIHNldCBjb250YWluaW5nIGEgY2FsbGJhY2sgYW5kIGEgY29udGV4dFxyXG4jIyNcclxuT2JzZXJ2YWJsZU1peGluID1cclxuICAjIyNcclxuICAgICAgQXR0YWNoZXMgYW4gZXZlbnQgdG8gYSBjYWxsYmFja1xyXG5cclxuICAgICAgQHBhcmFtIFtTdHJpbmddIGV2ZW50IHRoZSBuYW1lIG9mIHRoZSBldmVudCBpdCB3aWxsIG1vbml0b3JcclxuICAgICAgQHBhcmFtIFtGdW5jdGlvbl0gZm4gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRyaWdnZXJlZCBmb3IgZXZlbnRcclxuICAgICAgQHBhcmFtIFtPYmplY3RdIGN0eCBDb250ZXh0IGluIHdoaWNoIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZFxyXG5cclxuICAgICAgQHJldHVybiBbRXZlbnRCdXNdXHJcbiAgIyMjXHJcbiAgb246IChldmVudCwgY2IsIGN0eCkgLT5cclxuICAgIGlmIHR5cGVvZiBjYiBpcyAnZnVuY3Rpb24nIGFuZCB0eXBlb2YgZXZlbnQgaXMgJ3N0cmluZydcclxuICAgICAgIyBjb25zdHJ1Y3QgdGhlIGV2ZW50cyBsaXN0IGFuZCBhZGQgYW4gZW1wdHkgYXJyYXkgYXQga2V5ICdldmVudCdcclxuICAgICAgQF9ldmVudHMgPz0ge31cclxuICAgICAgQF9ldmVudHNbZXZlbnRdID89IFtdXHJcbiAgICAgICMgY29uc3RydWN0IGV2ZW50cyBpZiBub3QgYWxyZWFkeSBkZWZpbmVkLCB0aGVuIHB1c2ggYSBuZXcgY2FsbGJhY2tcclxuICAgICAgQF9ldmVudHNbZXZlbnRdLnB1c2ggeyBjYiwgY3R4IH1cclxuICAgIHJldHVybiBAXHJcblxyXG4gICMjI1xyXG4gICAgICBSZW1vdmVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gZXZlbnQgYW5kXHJcbiAgICAgIGRlbGV0ZXMgdGhlIGV2ZW50IGlmIHRoZSBjYWxsYmFjayBsaXN0IGJlY29tZXMgZW1wdHlcclxuXHJcbiAgICAgIEBwYXJhbSBbU3RyaW5nXSBldmVudCB0aGUgbmFtZSBvZiB0aGUgZXZlbnRcclxuICAgICAgQHBhcmFtIFtGdW5jdGlvbl0gZm4gdGhlIGNhbGxiYWNrIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgY2FsbGJhY2sgbGlzdFxyXG4gICMjI1xyXG4gIG9mZjogKGV2ZW50LCBjYikgLT5cclxuICAgIGNhbGxiYWNrTGlzdCA9IEBfZXZlbnRzP1tldmVudF1cclxuICAgIGlmIGV2ZW50IGFuZCBjYiBhbmQgY2FsbGJhY2tMaXN0Py5sZW5ndGhcclxuICAgICAgIyBzbWFsbCB0d2VhayBib3Jyb3dlZCBmcm9tIEJhY2tib25lLkV2ZW50XHJcbiAgICAgIEBfZXZlbnRzW2V2ZW50XSA9IHJldGFpbiA9IFtdXHJcbiAgICAgIGZvciBjYWxsYmFjaywgaSBpbiBjYWxsYmFja0xpc3RcclxuICAgICAgICByZXRhaW4ucHVzaCBjYWxsYmFjayB1bmxlc3MgY2FsbGJhY2suY2IgaXMgY2JcclxuICAgICAgaWYgcmV0YWluLmxlbmd0aFxyXG4gICAgICAgIEBfZXZlbnRzW2V2ZW50XSA9IHJldGFpblxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZGVsZXRlIEBfZXZlbnRzW2V2ZW50XVxyXG4gICAgICAjIyNcclxuICAgICAgICAgIENoZWNrIG1hZGUgdG8gcmVtb3ZlIGFsbCB0aGUgY2FsbGJhY2tzIGZvciB0aGUgZXZlbnRcclxuICAgICAgICAgIGlmIHRoZXJlIHdhcyBubyBjYWxsYmFjayBzcGVjaWZpZWRcclxuICAgICAgIyMjXHJcbiAgICBlbHNlIGlmIGV2ZW50IGFuZCB0eXBlb2YgY2IgaXMgJ3VuZGVmaW5lZCcgYW5kIGNhbGxiYWNrTGlzdD8ubGVuZ3RoXHJcbiAgICAgIGRlbGV0ZSBAX2V2ZW50c1tldmVudF1cclxuICAgIHJldHVybiBAXHJcblxyXG4gICMjI1xyXG4gICAgICBUcmlnZ2VycyB0aGUgZXZlbnQgc3BlY2lmaWVkIGFuZCBjYWxscyB0aGVcclxuICAgICAgYXR0YWNoZWQgY2FsbGJhY2sgZnVuY3Rpb25zXHJcblxyXG4gICAgICBAcGFyYW0gW1N0cmluZ10gZXZlbnQgdGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRoYXQgd2lsbCBiZSB0cmlnZ2VyZWRcclxuICAjIyNcclxuICB0cmlnZ2VyOiAoZXZlbnQsIGFyZ3MuLi4pIC0+XHJcbiAgICBldmVudENhbGxiYWNrcyA9IEBfZXZlbnRzP1tldmVudF1cclxuICAgIGFsbENhbGxiYWNrcyA9IEBfZXZlbnRzPy5hbGxcclxuXHJcbiAgICBpZiBldmVudCBhbmQgZXZlbnRDYWxsYmFja3Mgb3IgYWxsQ2FsbGJhY2tzXHJcbiAgICAgIGlmIGV2ZW50Q2FsbGJhY2tzPy5sZW5ndGhcclxuICAgICAgICB0cmlnZ2VyRXZlbnRDYWxsYmFja3MoZXZlbnRDYWxsYmFja3MsIGFyZ3MpXHJcbiAgICAgIGlmIGFsbENhbGxiYWNrcz8ubGVuZ3RoXHJcbiAgICAgICAgdG1wQXJncyA9IGFyZ3NcclxuICAgICAgICAjIGFkZCB0aGUgZXZlbnQgbmFtZSB0byB0aGUgZnJvbSBvZiB0aGUgY2FsbGJhY2sgcGFyYW1zXHJcbiAgICAgICAgdG1wQXJncy51bnNoaWZ0IGV2ZW50XHJcbiAgICAgICAgdHJpZ2dlckV2ZW50Q2FsbGJhY2tzKGFsbENhbGxiYWNrcywgdG1wQXJncylcclxuICAgIHJldHVybiBAXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMuc2VydmljZXMuT2JzZXJ2YWJsZU1peGluJywgW10pXHJcbiAgLmZhY3RvcnkgJ09ic2VydmFibGVNaXhpbicsICgpIC0+IE9ic2VydmFibGVNaXhpbiIsIiMjIyAgIFxyXG4gIFJlcXVlc3RBYm9ydGVyTWl4aW4gY3JlYXRlcyBhIGRlZmZlcmVkIG9uIGN1cnJlbnQgaW5zdGFuY2UgZm9yIGRlbGVnYXRpbmcgcmVxdWVzdCB0aW1lb3V0c1xyXG4gIFsgaG93IHRvIHVzZSBdXHJcblxyXG4gICMjICBiZWZvcmUgY29uc3RydWN0b3IgICAgKCAgY3VycmVudCBjbGFzcyBtdXN0IGhhdmUgTW9kdWxlIGFzIHN1cGVyY2xhc3MgIClcclxuICAxLiAgQGluY2x1ZGUgUmVxdWVzdEFib3J0ZXJNaXhpbiAgKGlmIGV4dGVuZHMgTW9kdWxlKSAgfHwgICBhbmd1bGFyLmV4dGVuZCBALCBSZXF1ZXN0QWJvcnRlck1peGluICAgKGlmIGRvZXMgbm90IGV4dGVuZCBNb2R1bGUpXHJcbiAgXHJcbiAgIyMgIGluc2lkZSBjb25zdHJ1Y3RvciBcclxuICAyLiBjYWxsIEByZWdpc3RlclBlbmRpbmdSZXF1ZXN0IHRvIGNyZWF0ZSBhIGRlZmZlcmVkIG9uIGN1cnJlbnQgaW5zdGFuY2VcclxuICBcclxuICAjIyAgYWZ0ZXIgY29uc3RydWN0b3IgXHJcbiAgMy4gcGFzcyBAX2Fib3J0ZXIgdG8gcmVzb3VyY2UgdGltZW91dCBjb25maWcgcHJvcGVydGllc1xyXG4gIDQuIGNhbGwgQGtpbGxSZXF1ZXN0IHdoZW4gc2NvcGUgXCIkZGVzdHJveVwiIGV2ZW50IGZpcmVzIFxyXG5cclxuIyMjXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMuc2VydmljZXMuUmVxdWVzdEFib3J0ZXJNaXhpbicsIFtdKVxyXG4gIC5mYWN0b3J5ICdSZXF1ZXN0QWJvcnRlck1peGluJywgWyAnJHEnLCAoJHEpIC0+IFxyXG4gICAgcmVnaXN0ZXJQZW5kaW5nUmVxdWVzdDogLT5cclxuICAgICAgQF9kZWZlcnJlZCA9ICRxLmRlZmVyKClcclxuICAgICAgQF9hYm9ydGVyID0gQF9kZWZlcnJlZC5wcm9taXNlXHJcbiAgICBraWxsUmVxdWVzdDogLT5cclxuICAgICAgQF9kZWZlcnJlZC5yZXNvbHZlKClcclxuICBdXHJcbiAgXHJcbiIsIm1vZHVsZS5leHBvcnRzPXtcImJhc2V1cmxcIjpcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiLFwiYmFzZWhvc3RcIjpcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwifSIsIiMjIypcclxuICMgSW5kZXggZmlsZSBcclxuICMjIGRlY2xhcmUgZGVwZW5kZW5jeSBtb2R1bGVzXHJcbiMjI1xyXG5yZXF1aXJlICcuL2FwcC9zdGF0ZS9pbmRleCdcclxucmVxdWlyZSAnLi9jb21tb24vY2FudmFzL2luZGV4J1xyXG5yZXF1aXJlICcuL2NvbW1vbi9zcG90L2luZGV4J1xyXG5yZXF1aXJlICcuL2NvbW1vbi91dGlscy9pbmRleCdcclxuY29uZmlnID0gcmVxdWlyZSAnLi9jb25maWcuanNvbidcclxuXHJcbmFuZ3VsYXJcclxuICAubW9kdWxlKCdhcHBsaWNhdGlvbicsIFtcclxuICAgICd0ZW1wbGF0ZXMnXHJcbiAgICAnbmdBbmltYXRlJ1xyXG4gICAgJ25nUmVzb3VyY2UnXHJcbiAgICAjICduZ01vY2tFMkUnXHJcbiAgICAnbG9kYXNoJ1xyXG4gICAgJ3VpLnJvdXRlcidcclxuICAgICdidGZvcmQuc29ja2V0LWlvJ1xyXG4gICAgJ21nY3JlYS5uZ1N0cmFwJ1xyXG4gICAgXHJcbiAgICAncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMnXHJcbiAgICAncXVpY2tzdGFydEFwcC5jb21tb24uY2FudmFzJ1xyXG4gICAgJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnNwb3QnXHJcbiAgICAncXVpY2tzdGFydEFwcC5zdGF0ZScgXHJcblxyXG4gIF0pXHJcbiAgLmNvbnN0YW50KCdCQVNFVVJMJywgY29uZmlnLmJhc2V1cmwpXHJcbiAgLmNvbnN0YW50KCdCQVNFSE9TVCcsIGNvbmZpZy5iYXNlaG9zdClcclxuIl19
