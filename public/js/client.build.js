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



},{"./index":19}],2:[function(require,module,exports){

/**
  * @ngdoc controller
  * @name StateController
 */
var StateController;

StateController = (function() {
  StateController.$inject = ['$scope'];

  function StateController(_at_$scope) {
    this.$scope = _at_$scope;
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
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

CanvasController = (function() {
  CanvasController.$inject = ['$scope', 'CanvasService', 'SpotService', 'LiveCanvasService', '$interval', '$window'];

  function CanvasController(_at__scope, _at__CanvasService, _at__SpotService, _at__LiveCanvasService, $interval, _at__window) {
    this._scope = _at__scope;
    this._CanvasService = _at__CanvasService;
    this._SpotService = _at__SpotService;
    this._LiveCanvasService = _at__LiveCanvasService;
    this._window = _at__window;
    this._addColumn = __bind(this._addColumn, this);
    this._addRow = __bind(this._addRow, this);
    this._getSpots = __bind(this._getSpots, this);
    this._handleResize = __bind(this._handleResize, this);
    this._handleUnlockSpot = __bind(this._handleUnlockSpot, this);
    this._handleReserveSpot = __bind(this._handleReserveSpot, this);
    this._handleDrawingSave = __bind(this._handleDrawingSave, this);
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
        var _ref, _ref1;
        _this._CanvasService.setCoordinates({
          lat: (_ref = props != null ? props.lat : void 0) != null ? _ref : 0,
          long: (_ref1 = props != null ? props.long : void 0) != null ? _ref1 : 0
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
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular.module('quickstartApp.common.canvas.services.CanvasService', []).service('CanvasService', Canvas = (function() {
  function Canvas() {
    this.getSpotsForProportions = __bind(this.getSpotsForProportions, this);
    this.setCoordinates = __bind(this.setCoordinates, this);
    this.addColumn = __bind(this.addColumn, this);
    this.addRow = __bind(this.addRow, this);
    this.unreserveSpot = __bind(this.unreserveSpot, this);
    this.reserveSpot = __bind(this.reserveSpot, this);
    this.decreaseProportions = __bind(this.decreaseProportions, this);
    this.increaseProportions = __bind(this.increaseProportions, this);
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
    var row, tile, _i, _len, _ref, _results;
    _ref = spots.rows;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      _results.push((function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = row.tiles;
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          tile = _ref1[_j];
          if (tile.y === spot.y && tile.x === spot.x) {
            _results1.push(tile.status = 'reserved');
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      })());
    }
    return _results;
  };

  Canvas.prototype.unreserveSpot = function(spot, spots) {
    var row, tile, _i, _len, _ref, _results;
    console.log('CanvasService', spot, spots);
    _ref = spots.rows;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      _results.push((function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = row.tiles;
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          tile = _ref1[_j];
          if (tile.y === spot.y && tile.x === spot.x) {
            _results1.push(tile.status = 'free');
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      })());
    }
    return _results;
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
        var _i, _ref, _ref1, _results;
        _results = [];
        for (i = _i = _ref = this._coordonates.long, _ref1 = this._coordonates.long + rows; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
          _results.push({
            tiles: (function() {
              var _j, _ref2, _ref3, _results1;
              _results1 = [];
              for (j = _j = _ref2 = this._coordonates.lat, _ref3 = this._coordonates.lat + tilesPerRow; _ref2 <= _ref3 ? _j < _ref3 : _j > _ref3; j = _ref2 <= _ref3 ? ++_j : --_j) {
                _results1.push({
                  x: j,
                  y: i,
                  height: this._Proportions.height,
                  width: this._Proportions.width,
                  status: 'loading'
                });
              }
              return _results1;
            }).call(this)
          });
        }
        return _results;
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
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

SpotController = (function() {
  SpotController.$inject = ['$scope', 'SpotService'];

  function SpotController(_at__scope, _at__SpotService) {
    this._scope = _at__scope;
    this._SpotService = _at__SpotService;
    this._getData = __bind(this._getData, this);
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
        var _ref;
        if ((_ref = res.data) != null ? _ref.drawingDataUrl : void 0) {
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
      var key, value, _ref;
      for (key in obj) {
        value = obj[key];
        if (key !== 'extend' && key !== 'include') {
          this[key] = value;
        }
      }
      if ((_ref = obj.extended) != null) {
        _ref.apply(this);
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
      var key, value, _ref;
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
      if ((_ref = obj.included) != null) {
        _ref.apply(this);
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
  __slice = [].slice;

triggerEventCallbacks = function(callbacks, args) {
  var a1, a2, a3, cbLen, i, _ref, _results, _results1, _results2, _results3, _results4;
  _ref = [args[0], args[1], args[2]], a1 = _ref[0], a2 = _ref[1], a3 = _ref[2];
  cbLen = (callbacks != null ? callbacks.length : void 0) || 0;
  i = -1;
  switch (args.length) {
    case 0:
      _results = [];
      while (++i < cbLen) {
        _results.push(callbacks[i].cb.call(callbacks[i].ctx));
      }
      return _results;
      break;
    case 1:
      _results1 = [];
      while (++i < cbLen) {
        _results1.push(callbacks[i].cb.call(callbacks[i].ctx, a1));
      }
      return _results1;
      break;
    case 2:
      _results2 = [];
      while (++i < cbLen) {
        _results2.push(callbacks[i].cb.call(callbacks[i].ctx, a1, a2));
      }
      return _results2;
      break;
    case 3:
      _results3 = [];
      while (++i < cbLen) {
        _results3.push(callbacks[i].cb.call(callbacks[i].ctx, a1, a2, a3));
      }
      return _results3;
      break;
    default:
      _results4 = [];
      while (++i < cbLen) {
        _results4.push(callbacks[i].cb.apply(callbacks[i].ctx, args));
      }
      return _results4;
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
    var _base;
    if (typeof cb === 'function' && typeof event === 'string') {
      if (this._events == null) {
        this._events = {};
      }
      if ((_base = this._events)[event] == null) {
        _base[event] = [];
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
    var callback, callbackList, i, retain, _i, _len, _ref;
    callbackList = (_ref = this._events) != null ? _ref[event] : void 0;
    if (event && cb && (callbackList != null ? callbackList.length : void 0)) {
      this._events[event] = retain = [];
      for (i = _i = 0, _len = callbackList.length; _i < _len; i = ++_i) {
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
    var allCallbacks, args, event, eventCallbacks, tmpArgs, _ref, _ref1;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    eventCallbacks = (_ref = this._events) != null ? _ref[event] : void 0;
    allCallbacks = (_ref1 = this._events) != null ? _ref1.all : void 0;
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

/**
  * Index file 
 ## declare dependency modules
 */
require('./app/state/index');

require('./common/canvas/index');

require('./common/spot/index');

require('./common/utils/index');

angular.module('application', ['templates', 'ngAnimate', 'ngResource', 'lodash', 'ui.router', 'btford.socket-io', 'mgcrea.ngStrap', 'quickstartApp.common.utils', 'quickstartApp.common.canvas', 'quickstartApp.common.spot', 'quickstartApp.state']).constant('BASEURL', 'http://5caf19d0.ngrok.com').constant('BASEHOST', 'http://56167789.ngrok.com');



},{"./app/state/index":3,"./common/canvas/index":6,"./common/spot/index":13,"./common/utils/index":15}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxwbGF5LXdpdGgtbWVcXG1hZ2ljLXVuaXZlcnNlLWRldlxcbm9kZV9tb2R1bGVzXFxndWxwLWJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiZDpcXHBsYXktd2l0aC1tZVxcbWFnaWMtdW5pdmVyc2UtZGV2XFxzcmNcXGFwcC5jb2ZmZWUiLCJkOlxccGxheS13aXRoLW1lXFxtYWdpYy11bml2ZXJzZS1kZXZcXHNyY1xcYXBwXFxzdGF0ZVxcY29udHJvbGxlcnNcXHN0YXRlX2NvbnRyb2xsZXIuY29mZmVlIiwiZDpcXHBsYXktd2l0aC1tZVxcbWFnaWMtdW5pdmVyc2UtZGV2XFxzcmNcXGFwcFxcc3RhdGVcXGluZGV4LmNvZmZlZSIsImQ6XFxwbGF5LXdpdGgtbWVcXG1hZ2ljLXVuaXZlcnNlLWRldlxcc3JjXFxjb21tb25cXGNhbnZhc1xcY29udHJvbGxlcnNcXGNhbnZhc19jb250cm9sbGVyLmNvZmZlZSIsImQ6XFxwbGF5LXdpdGgtbWVcXG1hZ2ljLXVuaXZlcnNlLWRldlxcc3JjXFxjb21tb25cXGNhbnZhc1xcZGlyZWN0aXZlc1xcY2FudmFzX2RpcmVjdGl2ZS5jb2ZmZWUiLCJkOlxccGxheS13aXRoLW1lXFxtYWdpYy11bml2ZXJzZS1kZXZcXHNyY1xcY29tbW9uXFxjYW52YXNcXGluZGV4LmNvZmZlZSIsImQ6XFxwbGF5LXdpdGgtbWVcXG1hZ2ljLXVuaXZlcnNlLWRldlxcc3JjXFxjb21tb25cXGNhbnZhc1xcc2VydmljZXNcXGNhbnZhc19zZXJ2aWNlLmNvZmZlZSIsImQ6XFxwbGF5LXdpdGgtbWVcXG1hZ2ljLXVuaXZlcnNlLWRldlxcc3JjXFxjb21tb25cXGNhbnZhc1xcc2VydmljZXNcXGxpdmVfY2FudmFzX3NlcnZpY2UuY29mZmVlIiwiZDpcXHBsYXktd2l0aC1tZVxcbWFnaWMtdW5pdmVyc2UtZGV2XFxzcmNcXGNvbW1vblxcc3BvdFxcY29udHJvbGxlcnNcXHNwb3RfY29udHJvbGxlci5jb2ZmZWUiLCJkOlxccGxheS13aXRoLW1lXFxtYWdpYy11bml2ZXJzZS1kZXZcXHNyY1xcY29tbW9uXFxzcG90XFxkaXJlY3RpdmVzXFxjYW52YXNfc3BvdF9kaXJlY3RpdmUuY29mZmVlIiwiZDpcXHBsYXktd2l0aC1tZVxcbWFnaWMtdW5pdmVyc2UtZGV2XFxzcmNcXGNvbW1vblxcc3BvdFxcZGlyZWN0aXZlc1xcZHJhd2luZ19jYW52YXNfZGlyZWN0aXZlLmNvZmZlZSIsImQ6XFxwbGF5LXdpdGgtbWVcXG1hZ2ljLXVuaXZlcnNlLWRldlxcc3JjXFxjb21tb25cXHNwb3RcXGRpcmVjdGl2ZXNcXHNwb3RfZGlyZWN0aXZlLmNvZmZlZSIsImQ6XFxwbGF5LXdpdGgtbWVcXG1hZ2ljLXVuaXZlcnNlLWRldlxcc3JjXFxjb21tb25cXHNwb3RcXGluZGV4LmNvZmZlZSIsImQ6XFxwbGF5LXdpdGgtbWVcXG1hZ2ljLXVuaXZlcnNlLWRldlxcc3JjXFxjb21tb25cXHNwb3RcXHNlcnZpY2VzXFxzcG90X3NlcnZpY2UuY29mZmVlIiwiZDpcXHBsYXktd2l0aC1tZVxcbWFnaWMtdW5pdmVyc2UtZGV2XFxzcmNcXGNvbW1vblxcdXRpbHNcXGluZGV4LmNvZmZlZSIsImQ6XFxwbGF5LXdpdGgtbWVcXG1hZ2ljLXVuaXZlcnNlLWRldlxcc3JjXFxjb21tb25cXHV0aWxzXFxzZXJ2aWNlc1xcbW9kdWxlX2V4dGVuc2lvbi5jb2ZmZWUiLCJkOlxccGxheS13aXRoLW1lXFxtYWdpYy11bml2ZXJzZS1kZXZcXHNyY1xcY29tbW9uXFx1dGlsc1xcc2VydmljZXNcXG9ic2VydmFibGVfbWl4aW4uY29mZmVlIiwiZDpcXHBsYXktd2l0aC1tZVxcbWFnaWMtdW5pdmVyc2UtZGV2XFxzcmNcXGNvbW1vblxcdXRpbHNcXHNlcnZpY2VzXFxyZXF1ZXN0X2Fib3J0ZXJfc2VydmljZS5jb2ZmZWUiLCJkOlxccGxheS13aXRoLW1lXFxtYWdpYy11bml2ZXJzZS1kZXZcXHNyY1xc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QUFHLElBQUgsRUFBUSxTQUFDLEVBQUQsR0FBQTtXQUN0QztBQUFBLE1BQUEsc0JBQUEsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxFQUFFLENBQUMsS0FBSCxDQUFBLENBQWIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUZEO01BQUEsQ0FBeEI7QUFBQSxNQUdBLFdBQUEsRUFBYSxTQUFBLEdBQUE7ZUFDWCxJQUFDLENBQUEsU0FBUyxDQUFDLE9BQVgsQ0FBQSxFQURXO01BQUEsQ0FIYjtNQURzQztFQUFBLENBQVI7Q0FEbEMsQ0FoQkEsQ0FBQTs7Ozs7QUNBQTtBQUFBOzs7R0FBQTtBQUFBLE9BSUEsQ0FBUyxtQkFBVCxDQUpBLENBQUE7O0FBQUEsT0FLQSxDQUFTLHVCQUFULENBTEEsQ0FBQTs7QUFBQSxPQU1BLENBQVMscUJBQVQsQ0FOQSxDQUFBOztBQUFBLE9BT0EsQ0FBUyxzQkFBVCxDQVBBLENBQUE7O0FBQUEsT0FVRSxDQUFDLE1BREgsQ0FDVyxhQURYLEVBQ3lCLENBQ3BCLFdBRG9CLEVBRXBCLFdBRm9CLEVBR3BCLFlBSG9CLEVBS3BCLFFBTG9CLEVBTXBCLFdBTm9CLEVBT3BCLGtCQVBvQixFQVFwQixnQkFSb0IsRUFVcEIsNEJBVm9CLEVBV3BCLDZCQVhvQixFQVlwQiwyQkFab0IsRUFhcEIscUJBYm9CLENBRHpCLENBbUJFLENBQUMsUUFuQkgsQ0FtQmEsU0FuQmIsRUFtQndCLDJCQW5CeEIsQ0FvQkUsQ0FBQyxRQXBCSCxDQW9CYSxVQXBCYixFQW9CeUIsMkJBcEJ6QixDQVRBLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSAnLi9pbmRleCdcclxuXHJcbiMjIypcclxuICMgIyBRdWlja3N0YXJ0IEFwcGxpY2F0aW9uXHJcbiMjI1xyXG5jbGFzcyBNYWluQXBwbGljYXRpb25cclxuXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeSAtPlxyXG4gICAgICBhbmd1bGFyLmJvb3RzdHJhcCBkb2N1bWVudCwgWydxdWlja3N0YXJ0QXBwJ10sXHJcbiAgICAgICAgc3RyaWN0RGk6IHRydWVcclxuXHJcbiAgcnVuOiAtPiBbJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJyRodHRwQmFja2VuZCcsICggJHJvb3RTY29wZSwgJHN0YXRlLCAkaHR0cEJhY2tlbmQgKSAtPlxyXG4gICAgJHJvb3RTY29wZS4kc3RhdGUgPSAkc3RhdGVcclxuICAgIFxyXG4gICAgJHJvb3RTY29wZS4kb24gJyRzdGF0ZUNoYW5nZVN0YXJ0JywgKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSA9PlxyXG4gICAgICAjIGNvbnNvbGUubG9nKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSBcclxuICAgICRyb290U2NvcGUuJG9uICckc3RhdGVDaGFuZ2VFcnJvcicsIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgZXJyb3IpIC0+XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIFxyXG4gICAgXHJcbiAgICAjICRodHRwQmFja2VuZC53aGVuR0VUKC9hcGlcXC9zcG90LykucmVzcG9uZCAobWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMpIC0+XHJcbiAgICAjICAgcGFyYW1zID0gdXJsLnNwbGl0KCc/JylbMV0uc3BsaXQoJyYnKVxyXG4gICAgIyAgIFsyMDAse1xyXG4gICAgIyAgICAgIyBkcmF3aW5nRGF0YVVybDogXCJkYXRhOmltYWdlL2pwZWc7YmFzZTY0LC85ai80QUFRU2taSlJnQUJBUUFBQVFBQkFBRC8vZ0E3UTFKRlFWUlBVam9nWjJRdGFuQmxaeUIyTVM0d0lDaDFjMmx1WnlCSlNrY2dTbEJGUnlCMk5qSXBMQ0J4ZFdGc2FYUjVJRDBnT1RBSy85c0FRd0FEQWdJREFnSURBd01EQkFNREJBVUlCUVVFQkFVS0J3Y0dDQXdLREF3TENnc0xEUTRTRUEwT0VRNExDeEFXRUJFVEZCVVZGUXdQRnhnV0ZCZ1NGQlVVLzlzQVF3RURCQVFGQkFVSkJRVUpGQTBMRFJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVUvOEFBRVFnQXdnQ1dBd0VpQUFJUkFRTVJBZi9FQUI4QUFBRUZBUUVCQVFFQkFBQUFBQUFBQUFBQkFnTUVCUVlIQ0FrS0MvL0VBTFVRQUFJQkF3TUNCQU1GQlFRRUFBQUJmUUVDQXdBRUVRVVNJVEZCQmhOUllRY2ljUlF5Z1pHaENDTkNzY0VWVXRId0pETmljb0lKQ2hZWEdCa2FKU1luS0NrcU5EVTJOemc1T2tORVJVWkhTRWxLVTFSVlZsZFlXVnBqWkdWbVoyaHBhbk4wZFhaM2VIbDZnNFNGaG9lSWlZcVNrNVNWbHBlWW1acWlvNlNscHFlb3FhcXlzN1MxdHJlNHVickN3OFRGeHNmSXljclMwOVRWMXRmWTJkcmg0dVBrNWVibjZPbnE4Zkx6OVBYMjkvajUrdi9FQUI4QkFBTUJBUUVCQVFFQkFRRUFBQUFBQUFBQkFnTUVCUVlIQ0FrS0MvL0VBTFVSQUFJQkFnUUVBd1FIQlFRRUFBRUNkd0FCQWdNUkJBVWhNUVlTUVZFSFlYRVRJaktCQ0JSQ2thR3h3UWtqTTFMd0ZXSnkwUW9XSkRUaEpmRVhHQmthSmljb0tTbzFOamM0T1RwRFJFVkdSMGhKU2xOVVZWWlhXRmxhWTJSbFptZG9hV3B6ZEhWMmQzaDVlb0tEaElXR2g0aUppcEtUbEpXV2w1aVptcUtqcEtXbXA2aXBxckt6dExXMnQ3aTV1c0xEeE1YR3g4akp5dExUMU5YVzE5aloydUxqNU9YbTUranA2dkx6OVBYMjkvajUrdi9hQUF3REFRQUNFUU1SQUQ4QSswZitGeDVIL0lOaS93Qy83ZjhBeEZNLzRYQjgyZjdQaXovMTNiLzRpdk12d294N1YrYmYyM2ovQVBuNStDL3lQb1A3R3dML0FPWGY0djhBelBWRitOSlgvbUd4ZitCRGYvRVZJbnhua25mYkhwVWJ0L2RXZGlmL0FFWFhrK1BhdFB3OWJ4WEY4LzJra1dVY2JTWE9PcFJjSEE5Q1NGVWU1RlhET2NmT1NqN1Q4Ri9rRXNwd1VZMzVQeGYrWjZKSjhaNVlXS1NhWEdqZHcwN0Evd0RvdWlQNDNHTS84Z3lJL3dEYnczL3hGY2hvdGdOUmErdmJ1S0lXVnVQT1cwT1FOek5oRVhuS3FTZnhBUFdxTi9vbDQxN3FUeUpFMzJaOXNua0hhbThuRzFSam5CNit5bm10bm1tWUtLa3A3K1MveU0xbHVCdlp3L0YvNW5mbjQ0ay84d3lML3dBQ1cvOEFqZE0vNFhaei93QWd5TC93SWIvNGl2T05SMGg5T2RkekJvMmlqa1YrZ2Jjb09CNjR6alB0VWxuNGR2TCt6UzVoVldSM1pRQ2NIQ3J1ZGpuamFCakp6M0ZaZjJ0bUxmTHo2K2kveU5QN0x3TnJ1UDR2L005SVg0NU12L01MaUkvNitXLytOMDRmSFVnLzhncUxQL1h5My94dXZNN1RRNXJyVDN1OXl4eDd4SEdyZFpHd1NjZXdBNUo0RmFXbStFeU5adHJlOGxnZUI0M2xab1pnUmhRMmVSNmJDVGp0MHprWnFPYVpsTnEwOS9KZjVEZVg0S04vZDI4My9tZDMvd0FMNFA4QTBDWXYvQWx2L2pkTi93Q0Y2RS84d3FML0FNQ1cvd0RqZGVWTFpTdmRSMjZydW1rWUtxRHJrbkFIc2FXOXMyc3AyamJIeWtybFd5R3h4a2V4N2UxWmYyeGo3WDUvd1grUnAvWnVFMjVmeFo2bWZqa1NNZjJYRmovcjViLzQzUVBqa1IvekNvdi9BQUpiL3dDTjE1N040ZU1maDZQVVVMeU94TE1GSHlwR0NGM0gvZ1oyajFJYjB5WWw4UDNEUUNWZkxrVjNTTmNQZ2htQVk1QjZZSEJ6amtqclZ2TTh4djhBRjU3TC9JbFlEQjc4djRzOUhQeHpKT2Y3TGkvOENXLytOMDRmSFUvOUFxSS85dkxmL0c2NWFlejArMEYyOFZuNThObVJiVzRkUnVua2JkdWxmL1lBUmlNOGNqME5jZEx6Sy8zVHlmdTlQd3BWY3l4dE8xNm40TC9JcW5nc05MYUg0czliL3dDRjdIL29GUlkvNitXLytOMDF2am9XL3dDWVZGLzRFdC84YnJ5UGowby9DdWYrMXNaL1ArQy95TjFnY092cy9tZXNqNDRFSC9rRnhmOEFnUTMvQU1ib3J5YjhLS24rMU1YL0FEL2d2OGl2cVZIK1V2ZjJMZC84OEpQKy9ULzRVZjJMZVovMUV2OEEzNmYvQUFyNktVREdUVGkyT2xmVC93Q3JVUDhBbjcrSC9CUGsvd0RXT2Y4QXo2WDMvd0RBUG5UK3hMei9BSjRTL3dEZmwvOEE0bXBiZlQ5UnRmTThxS1pmTVhhMzdsemtaQjdyNmdIOEsraVk1TThaeFVpRGtldE5jTnhXcXF2N3YrQ1V1SVpTMDltdnYvNEI4M2pTOVFFdm0rVlA1bTdkdU1VbWMrdjNhdGVUcXIzRFN6UlR5Qi92b0luVlc2bm9GeDFKUFRyWDBWM0pxdHFHcTIrbm9HbmxDWjZMMVkvUURtaytINHdWM1dzdlQvZ21uOXVTbHRTdS9YL2dIejFmMldvNmhjZWJMQk1XQ3FnekZJY0tvQUE2ZWdyY2h0TDdSdkRqUU5ITlBQZWZLc1BsdnRoaXlDMmNEK0pzY2NmZFByWHNzTGF6cUs1dE5LTnZHMzNaYjE5bVBxZzVwNzZmNGx0QVhlM3NieFIveXp0blpHL051S3pqazlPTGNsVWJ2MTVmK0RxYlBNNjhrbDdKZmY4QThBK2VIMDdVNU40YU80SWZHNVJGSUFjZE9NWTRwa2VqWDhiQmtnblJoMEt4U0EveXI2SHQ5ZnR6TVlib1NXTTQ2eDNLN1B4eWVNSHRtcjM5cjJNVTRoZTVpU1Fqb1dINVo2WjlxRmtGR1M1bFcvRC9BSUl2N2FxcDJkTDhmK0FmTmFhTGZ4T3JwQk9qcWNxeXhTQWcrdlNrZlJyK1Z5endUdTVPU1RESVNmMHI2UHVkZXRGS3gyKysrbWI3cVd5Nzgrdkk0T08rTWtlbEVWdDRrdVJ2anRyS3pYUCtydVhaMi9OZUt5ZVJVbG9xcmZvditDYnh6V3JMWDJmNC93REFQbjYxWFZyYXprdFd0NTVyWmdBSXBJcENxNGJjTURIcnpqb2FxTnBtcHVySVk3a296YjJYeXBNRnZYR090ZlNFbDNyR25xZnRlbGVmR3ZMUzJUN3Z5UTgwdHJyRnZxQ0ZyYVVQZ2NyMFlmVWRhcFpKVG5hUHRYZnMxYjlSU3pTZFBWMC94LzRCODJ0cEdvdHV6RGNIZnkyWXBPZnJ4elVmOWhYMy9Qck4vd0IrWC93cjZmV1FzT2VhY3IvTmcwUGgrUDhBejgvRC9nampuRGYyUHgvNEI4di9BTmhYdi9QclAvMzVmL0NqK3dyMy9uMW4vd0MvTC80VjlUUmoyelVyUllHUlUvMkJIL241K0gvQk5sbWtuOW44VDVVL3NHOS81OVovKy9ML0FPRkZmVmlMN0FVVWYyQkQvbjUrSC9CSy90T1g4djRuTTdnZWxaZXN5M0lqaWp0M2FLUTcyVmxHZHpCQ1F1TytldjhBd0dyNGt5ZUtxNmh6SEJJT0dTZVBCK3JCVCtqR3Z1YXF2Qm8vTktjclNSZFRRdGVqaGpsZ21zOVJnS2hsWTVTUndlUi9zaWsyZUlRY2YyQ0Q3L2JFcnEvRERGdkQybmcvd3dxbjVESDlLMDhlMWNVVk54VFVuK0QvQURSOU45V292WGxPS2gwbnhEZkRESmI2WkdlQ1djU1NEM0dNZy9UajYxdGFSNFRzOUxrODlnMTFkbmt6ekhjUWZiMDlNOG5IR2EyL3dvL0NtcWF2ZVR1L00yakNNUGhWaEtXajhLUHdyVXNyWG1uV3VvUitYY3dSenBuSUVpZzRQcVBTcUVmaExTWW85aVdhcjZPSFlPUGJkbk9QYk9LMlB3by9Db2NJdDNhQXEyZW1XdGdyQzNnU0xkeXhBNVkrcFBVbjYxWkhGTCtGSDRWU1NXaUFROGlzYlYvQ3RucWorY29hMnV3Y2llRTdUbjM5ZlRQWEhHUlcxK0ZINFVwUlUxYVNIZXh4N2FicituOEJJTlVqSEFJWVJ5SDNPY0FEMjUrdE1NbXVGc0RRY2Y4QWI0bGRuK0ZHUGFzdlpQcEovaC9rVHl4N0hKclkrSUowSmRyU3hpSXlUOTZSUDVxYWQ0UmxudXRJRnpkVHROSk81Y2JoakErNkFCMnpqUDQxcytJbk1lZ2FrdzQyMjBoeVA5MDFtYUdDbWoyQUhIN2hQL1FSV0toeTFVcnQ2RnQyam9pKzR3ZlNpcE51N21pdCtVazQ4cmp0VkxWSmtpdFZMSEFFMGJINkJ3eC9RRS9oVnN1U00xUmxoL3RMV05Qc3VxTSs2VC9kNXlENlpUelB4RmRkWjhzR3o1Q2hIbnF4aWowSFJMZVMxME94aFliWlV0MFZzOW0yalA2MVoyM0g5NkwvQUw0UCtOQXZiY0Fmdm8vKytoUjl1dC8rZThmL0FIMEs1bHlwSlhQc0F4Y2Yzb3YrK0QvalJpNC92UmY5OEgvR2o3YmIvd0RQZVA4QTc2RkgyMjMvQU9lOGYvZlFwM1hjQXhjZjNvLysrRC9qU2JiaisvSC9BTjhIL0dsKzIyLy9BRDNqL3dDK3hSOXR0LzhBbnZIL0FOOWlpNjdnQVc0L3ZSLzk4bi9HakZ4NnhuOERSOXR0L3dEbnZILzMyS1B0dHY4QTg5NC8rK3hSZGR3REZ4LzB5UDUwZjZSL2RqL00wZmJiZi9udkgvMzJLUHR0di96M2ovNzdGRjEzQVA4QVNQN2taLzRFZjhLQ2JnZjhzNGovQU1EUCtGSDIyMy81N3gvOTlpajdiYi84OTQvKyt4UmRkd0RkYy84QVBLTC9BTCtIL3dDSnBOMXovd0E4b3Y4QXY0Zi9BSW1sKzIyLy9QZVAvdnNVZmJiZi9udkgvd0I5aWk2N2dRNnRidmVhUGVRQlI1a3NEb0FEa1pLa1ZqK0hKUmRhRnA4cThqeVVCOVFRTUg5UWEzamVXN2NDWkNUL0FMUXJsL0Q1L3MrZlV0T1BBdGJoaWkvM1kzK1pmNW1zWC9GVFhWVy9YL01Vdmg5RGQzL2tLS3JHNEFZOFVWc1pjeU9XWEhGV1BCRnY5czErK3ZDT0lVOHRNK2hZcitoamYvdnVxaTlDMWFudzRqV2JSNTl4UG1NNk1jRWdrR0pEbkk5eTM2MXJpTjRvOExMNHAxTG5aWTlxTUQwcUVXYWVzbi9mMXY4QUdrTm1uckwvQU4vVy93QWFqVStpSjhDakFxRDdFbjk2WC92NjMrTkgySlA3MHY4QTM5Yi9BQnBhZ1Q0RkdCNlZCOWlUMWwvNyt0L2pSOWlUKzlKLzM5Yi9BQm8xQW53UFNqQTlLaCt4SjZ5ZjkvVy94byt4cDZ5ZjkvVy94bzFBbXdQU2pBOUtoK3hwNnlmOS9XL3hvK3hwNnlmOS9XL3hwNmdUWUhwUmoycUg3RW5ySi8zOWIvR2o3R25ySi8zOWIvR2xxQk5qMm8yKzFRZllrOVpQKy9yZjQwZllrL3ZTL3dEZjF2OEFHalVDZkh0WEo2eXYyRHhiYlNyd3Q5YnRHVkg5OURrRS93REFTUlhTL1lrL3ZTLzkvVy94cm52RlVhcnFPZ29tVElMaHlNbkoyN0R1Ni9VVmxWdlpQczErWTkwMFBHZHh6elJWZ3FvN1VWdFk0VGxrYkh2VXZnaThGaHFvdG1PRWRUYkVlNlphUC94d3RuM3hWWEJBeldkZFRQWTN5M0VZT1NBNEE3dkdkeWo4UnVCOWhXdGRhY3k2SHoyRnJlenFxNTZ0OXAvNll5Lzk4ai9HajdUL0FOTVpmeUgrTlNST3NzYU9weXJBRUVkeFRzQ3NkWDFQcmlIN1QvMHhsL0lmNDBmYWYrbU12NUQvQUJxYmlqaWl6N2dRL2FmK21NdjVmL1hvKzAvOU1aZnkvd0RyMU54UmlpejdnUS9hZittTXY1Zi9BRjZQdFA4QTB4bC9MLzY5VFlveFJaOXdJZnRQL1RHWDh2OEE2OUgybi9wakwrWC9BTmVwc1VZb3MrNEVQMm4vQUtZeS9sLzllajdUL3dCTVpmeUgrTlRZb3hSWjl3SWZ0UDhBMHhsL0lmNDBmYWYrbU12NUQvR3BzVVlvcys0RUl1TW5IbFNEOFA4QTY5Y3ZxazQxRHhla1lPWTlPaEpQYkVrbmIzK1VWMWtqckZHenNRRlVaSlBZVngvaHVQN1ZwOGwzSU1UWGN6ek42cnpqSDA0L1dzNUxtbkdEOWZ1LzRKTTN5eGJOQm1ORkkrVUpCNE9hSzZiSEJ6THVjbXNoZXFlbzcybnNraVh6TGg1VDVjZjk0N1NQeXl3R2UyYXNSSGIzNHFDNExRMzBNOExiWm1HMk56L0E2Z3NwK24zZ2ZYZ1ZkWnZrZktmTllmbGRST2V4NmZaNmFsdlp3UWw1Rzh1TlV5SFlad0FPZ05TL1k0L1dUL3Y2MytOUTJlb2ZhclNDWllaTVN4cTR4anVNK3RUZmFHLzU0U2ZwL2pYS3VXeDl1QXNrQjZ5ZjkvVy94byt4cDZ5ZjkvVy94byswdC96d2wvVC9BQm8rMHQvendsLzhkL3hwKzZBZlkwejFrLzcrdC9qUjlpanpuTXYvQUg5Yi9HajdRMy9QdkwvNDcvalNmYUgvQU9mZVg4MS94bzkwQmZzY2ZySi8zOWIvQUJvTm5HZThuL2Z4djhhVDdRMy9BRDd5L212K05IMmgvd0RuMmwvTmY4YVBkQVUyY1o3eUQvdG8zK05CczBQOFVuL2Z4djhBR2tOdy93RHo3eS9tditOSDJsditmZVg4MS94bzkzc0ljYlJDT3NuL0FIOGIvR2cyaVk2eWY5L0cvd0FhYjlvZi9uM2wvTmY4YVB0RW4vUHZKK2EvNDBYUXgzMlJQV1QvQUwrTi9qU2ZaRi92U2Y4QWZ4djhhVDdSSi96N3lmbXYrTko5b2wvNTk1UHpYL0dqM1FHM1ZnczlwUER1Y2ViR3laTEU0eU1kNjVqdzlkSDdBTGFRQ081dFdNVXNmZFNEeCtuZnZ6WFRUM2pRVzhzcndTS3NhTTV5VjdEUFkxeW5oMlBicHd2cHp2dWJ6RTgwcDZ0bmtENkFFREZRdjRzZVhzek9vMG9hbWhkU1ltNVBZVVZUbGxNMGpOMHoyb3JzUExjcnM1OXp0UHBXZHFXKzZsczdXRW56cHBkcTQ3WkJVSC92cGwvT3JibmN3Sk5XL0JWZ3VyK0taWjNVUEJaSmdaR1J1T1IvOFhuM1FWRmFYN3UzVm5pWU9uN1N1bDBQU29Za2hpUkZVQlZBVUQwQXArQlVQMktEL25oSC93QjhDajdGQi96d2ovNzRGWmFuMlpOeFJnVkQ5aWcvNTRSLzk4Q2o3RkIvendqL0FPK0JScUdoTnhSeFVQMktEL25oSC8zd0tQc2R2L3p3ai83NEZHb0UzRkhGUS9Zb1ArZUVmL2ZBbyt4UWY4OEkvd0R2Z1VhZ1RjVVlIcFVQMk8zL0FPZUVmL2ZBbyt4UWY4OEkvd0R2Z1VhZ1RjVWNWRDlpZy81NFIvOEFmQW8reDIvL0FEd2ovd0MrQlJxQk54UnhVUDJLMy81NFIvOEFmQW8reFcvL0FEd2ovd0MrQlJxQkpLaXlSc3BHVkl3UWU0cnpYUW1saHRtc3BuTFNXY3IyNXowK1VuR1BiR0s5Ryt4UWY4OFkvd0R2a1Z4SGlPMi9zdnhja3dHSXRSajUvd0N1aWZ5R01maWFpL0xPTW42ZmYvd1RreE1YS203ZE5TeWd3TTBVd3YweFJYYWVOekk1WnBOaTdqejNycFBoVVMraVhMeDdmT2VaV2N0M0JqUTUvd0MraTM2MXpNbm9LMlBoYmQvWjcrNHNtUDNvZHFqMDhwaVB6S3VwL0NzcTYxaXpseXVwYXRaOVQwVC9BRW4waS9Xai9TdittWDYxTmlpc3JlWjlhUS82Vi8weS9Xai9BRW4vQUtaZnJVMUZGdk1DSC9TZlNQOEFNMFp1ZjdzZi9mUi93cWFpaTNtQkRtNS91eGY5OUgvQ2pOei9BSEl2Kyt6L0FJVk5SUmJ6QWh6Yy93RFBPUDhBNzdQK0ZHNjUvd0NlY1gvZlovd3FhaWkzbUJEdXVmOEFubEYvMzhQL0FNVFJ1dWYrZVVYL0FIOFAvd0FUVXZGSEZPM21CRnV1ZitlVVgvZncvd0R4Tkc2NS93Q2VVWC9mdy84QXhOVFVVV0FoM1hQL0FEeWkvd0MvaC84QWlhNVg0aWJ4cCtsdTZxc2cxR0lEYWM4YzU3RDAvU3V3cmh2R3R3THZ4SnBsbm5LVzhiM1RnOURuNVYvRUgrZFkxVjd0dTdSblVrb3diZlloRXVCbWltTklDQU1DaXV6bjhqNWo1bk9iMTllYWJwVnlOTDhRd1RuL0FGVzlaR3p5TnAvZHlFK3dVcWFnd1FjOXFpdlNqZVFXKzZXOHQvOEFkWVl4K2UzOHExcng1b0hqNGFxNmRWU1BiVnM0TVo4bFArK0JTbXpnSno1TWYvZklxcjRmdkd2OUMwNjVjNWVhM2pkdnFWQlA2MW9WeEt6VjdINkhjaE5sQVQvcWsvNzVGSDJLQWptR00vOEFBUlUzNC9wUitOVnlyc0JDYlNBOVlvLysrUlNmWTdjLzhzb3ovd0FBRmNWOFE1ZFh2YnkxMHl3dExpUzNsVExTSXJlV3psc0FPdzZLQmtrZDhqcjBySjhFaTg4UCtNcDlKRTYzRnFITVRHTldXTW55ZytWWEpDbFNkcDU1eU85ZWJQRnFOWlUrVFM5citiT2hVcnc1cm5wWDJPMkgvTEtNZjhBRkFzN1lmOHNvL3dEdmdWNVc5dGVmRXZYcitNWEN3Mjl1em1KWlZMb0ZWeWlmS0NNRmlySGQxNFBvTVRXK3NYR29lQWRadEpacEE4Q3hiV01oTG9yUHRLRnVwSVpYR2ZRaXMxams3dmswczdQdmI4aW5RYXNyNjZYOHJucC8ySzI2aUdNZjhBRko5a3RnZjlWRm4vY0ZlVXRMUEQ0SXQwaXVMaUhicVpVbUNabzJLK1V6QUFnZzRKd2YxcWE5UVhHcStFYm1aMmxuK3pXSjgxdm1KSms1T1R6azVwZlhWWmU1Mi9FUFkrWjZqOWl0L3dEbmhILzN3S0RZMjUvNVlwLzN3S21vcjF1VmRqbElmc01IL1BHUC92Z1VmWXJmL25qSC93QjhDcHNVWW81VjJBaE5sYjQvMUVmL0FId0s4cWUrKzJhN3F0N0hnSVp2SmpBKzdzUVlCSDFyMC9XYm8yR2szdHl2M29ZWGtINEtUWGsyaXdlVnBrQUJ5Q0M0SjlDU2Y2MG94VHFwZHRmMFBLekdvNFVsRmRXYW4yb2tENVJtaW9WRzN0UlhaeXJzZlBjek1rTUdYM3FscUlZUXAzL2V4LzhBb2ExWmgvS3Erc1NBUlJSS3dEdVNSMXljREk2QW43MjN0VjFaY3ROczh1akZ6bWtldytEa0tlRmRLM2RUYkkzUHVNLzFyWi9LdktwUGlMcWdnamhzckNPMXQ0MUNLTm01Z0FNREJkbC85QnFtM2pieEZuUG56NC91aElQOFA2MTU4ZWF5WEt6N2Q1aGg2ZnU4MXoyR2l2TWRMK0pPb3hNRnZJNFpUbmFGbFF3czMwY0VxVDdBVjJ1amVMTERXbUVVYm1DNXhrMjh3MnYrSE9HL0FtbXBMWjZIWFN4Rkt0OERLSGpqeGF2aHV5TVVBRGFoTXA4cmNQa2ovd0J0ejBBSE9CM3g5U09XK0ZiV0MzVXMwczd0cWM1ZU5Ga2pjRWdITHNXSXdXWWpQWG9CNzEyK3RlRTdIWHJxTzR1RE1zcUpzQmlrS2dqT1JrZXh6K2RRYWY0SjAvVGRRaXZVa3VaSjRzbGZObExBWkJIVDZFL25YbVZLTmVlSlZYUnhXMytmcWVsR2NGVGNlck9KOEZYOGZoUFhOU1hVRElxeUJvZC9sbGp1amxjcU1ESjVENUI3ODFCcGxzNmVGZkZOMHlzaXlGTStZQTIxaEl6bGZmQWRSK251ZTc4UWVHZER1NVd2OVFjMmpFQkhuVzRNSVlkQUd3UUQ2WlBOUWwvQ3orSEcwNFhkb05LeDVUSXR4am5yZ25PY25HYzV5ZXRjNndrNCs0MnJKU3Q4KzVUclIzNzJ2OGpqN2UzdXRROEpYZjJPMG52SlYxWGN5UmxkK1BLQUxmTVI2alBjWlBCeFdIcUYxcUVWNVp4M2R2ZDI4OWxIQ2xwRk5DZ2RncmpZY0JqdUpLZ2RjRFBmT2E5ZThPV2VsMk5nVjBtUkpiZG5MbDFtTXU1c0FFbGlTYzRBNzBtcWVGZFAxblViYSt1VWthZTNJS0ZYS2podHd5QWVlUlJQQVRuQk9NdGZ3SEd1bExWYUdqWXRLOXBDMDZoWmlnTHFPelk1SDUxT2FUT0t4ZGU4WWFiNGVCVzRtRFRkb1l5Qy90bkpBSDRrWnIyM0pRWHZNNGphb3J6VzgrSXVxM1ovMFN6RUVmcnMzUDhBbTVVZitPbjYxUS80VExYZzJUTGQvVHk3YWhTYjJUT0NlT29RZG16MGJ4UXBmdzFxcWprbTFsQS83NE5jSjRiZ1ZkR3RISUJZeEtPblRBRkVIeEZ2NGxLM2tjTXNlTU1KNFdpeVBkeGxmMHJOOEw2Z2JmVGZJbVZrVkpHMk9RZVFlUWVRT09mMHBVNWZ2ZlZIRmk2MUtyR000dlk2cFlvM1VNNks1UDhBZUZGVW85VGhaQnNZeUVjRUtNZnpvcmQzdnVjcW5DeHlCQUFOT1NUR005S2kzYmpqdFNnbmQ3VjZXbHJuNS9LcFZpK1JzbU1vYzA4amlvaWNEaW1pZm4ycnp2cmNYTGxVVHBpcDAxelNrV2xpV1NGbFlCbFBCQkdRYWhXeGVGbDhwZ3lBZ2lLUW5BLzNXNnIrdU93cWEya0piL1pOWEhpeDJ4V1ZhcFRsbzN1ZTlSNWtyeDZGNjA4VjZ4cHNZRzZhUkJ4KytSWjFIMElJYy9VMCs0OGU2NWNxVXQ0b0lnZXNyeEZNZlFGamcvVlRXVjVyL2QzSEZKRkU4OHdqWGtuMU5jeXBQK1oyUFdXWTFWWklSNExpOXVCUGVYMDF4Ti9mNEdQcG5KWDZBZ2UxVUpiRStjWGU0ZDBBd3VQbGNmVmhna2RPUHp6eGpvUllJa1hNcDNrZGw0ckp2WUh0bkNzUVZQSVlkRFhmQ2pCYUpITmlNUk8zTTNxUTJNTjliWEhuV1YweXlnY3VUc2JIWWJnTUVlekExMGFlTzlidFlkcndMTXlqZ3ZDTXQ5U3JnZm9LeGJLY1F0eU9Ed2FzelhhTWhDbkpJeHhVem9KeTAwSXcrTnFVb1dVaExyeG5yK3FncTg2V0VSNEloVERFZm14Qjl3MzRWU2dzb1luTWd6SksyU1paRGxqNjgrL3RUSkFNWnBxU25PTTFwRERRZytiZCtaelZjZFhxNlRsb1hOL2FtN0RuM3BpTUIxcDBrb0F3RFhSYXh5OHcvT0tjb01uUVZXVnc3QVpxeUdDZEt6aytVdUR1Tjh0azV5VnpSVnUzajNvV2ZrZEFLSzUzVlNlcU9wVXJxNXp3KzlUaDk0MFVWNkgyR2ZKVmY0djNDR21qNzM0MFVWODVENGtkbFQ0V1hZT3ArbGFRNWhUNlVVVk5UNGZ2UG9NTitpSzUrOGF1YVI5K2YvY0g4NktLN0tYd3hMWDhVc09mbk5VZFY1dFY5bjQvS2lpdlRqdVJXK0dSUVRwU3Ixb29xenprTmsrN1VjZjN4UlJURTl5WmVwcUdVOWFLS1hVNllmQklMZjd5MWJCNjBVVnoxZHlLZXhvVzNNSy9qUlJSWEE5MmVuSDRVZi9aXCJcclxuICAgICMgICAgIHg6IHBhcnNlSW50KHBhcmFtc1swXS5zdWJzdHJpbmcgNSlcclxuICAgICMgICAgIHk6IHBhcnNlSW50KHBhcmFtc1sxXS5zdWJzdHJpbmcgNSlcclxuICAgICMgICB9LHt9XVxyXG4gIF1cclxuXHJcbiAgY29uZmlnOiAtPiBbICckdXJsUm91dGVyUHJvdmlkZXInLCAnJHByb3ZpZGUnLCAoJHVybFJvdXRlclByb3ZpZGVyLCAkcHJvdmlkZSkgLT5cclxuICAgIFxyXG4gICAgJHVybFJvdXRlclByb3ZpZGVyXHJcbiAgICAgIC5vdGhlcndpc2UgJy8nXHJcbiAgICAkcHJvdmlkZS5kZWNvcmF0b3IgJyRleGNlcHRpb25IYW5kbGVyJywgWyAnJGRlbGVnYXRlJywgKCRkZWxlZ2F0ZSkgLT5cclxuICAgICAgKGV4Y2VwdGlvbiwgY2F1c2UpIC0+XHJcbiAgICAgICAgJGRlbGVnYXRlIGV4Y2VwdGlvbiwgY2F1c2VcclxuICAgICAgICBlcnJvckRhdGEgPVxyXG4gICAgICAgICAgZXhjZXB0aW9uOiBleGNlcHRpb24sXHJcbiAgICAgICAgICBjYXVzZTogY2F1c2VcclxuICAgICAgICAjIyMjIEBUT0RPIFBST1ZJREUgUFJPUFBFUiBIQU5ETElORyBBTkQgTE9HR0lOR1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgJyRleGNlcHRpb25IYW5kbGVyOjpFUlJPUjonLCBleGNlcHRpb24ubXNnLCBlcnJvckRhdGFcclxuICAgIF1cclxuICBdXHJcblxyXG5hcHAgPSBuZXcgTWFpbkFwcGxpY2F0aW9uKClcclxuXHJcbmFuZ3VsYXJcclxuICAubW9kdWxlKCdxdWlja3N0YXJ0QXBwJyxbJ2FwcGxpY2F0aW9uJ10pLmNvbmZpZyggYXBwLmNvbmZpZygpICkucnVuIGFwcC5ydW4oKVxyXG5cclxuIiwiIyMjKlxyXG4gIyBAbmdkb2MgY29udHJvbGxlclxyXG4gIyBAbmFtZSBTdGF0ZUNvbnRyb2xsZXJcclxuIyMjXHJcbmNsYXNzIFN0YXRlQ29udHJvbGxlclxyXG4gIEAkaW5qZWN0OiBbICckc2NvcGUnXVxyXG4gIGNvbnN0cnVjdG9yOiAoQCRzY29wZSkgLT5cclxuICAgICMgY29uc29sZS5sb2coJ3F1aWNrc3RhcnRBcHAuc3RhdGUuY29udHJvbGxlcnMuU3RhdGVDb250cm9sbGVyJylcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLnN0YXRlLmNvbnRyb2xsZXJzLlN0YXRlQ29udHJvbGxlcicsIFtdKVxyXG4gIC5jb250cm9sbGVyICdTdGF0ZUNvbnRyb2xsZXInLCBTdGF0ZUNvbnRyb2xsZXJcclxuIiwicmVxdWlyZSAnLi9jb250cm9sbGVycy9zdGF0ZV9jb250cm9sbGVyJ1xyXG4jIyMqXHJcbiAjICMgcXVpY2tzdGFydEFwcCAvIHN0YXRlXHJcbiMjI1xyXG5hbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5zdGF0ZScsIFtcclxuICAncXVpY2tzdGFydEFwcC5zdGF0ZS5jb250cm9sbGVycy5TdGF0ZUNvbnRyb2xsZXInXHJcbl0pLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIpIC0+XHJcbiAgJHN0YXRlUHJvdmlkZXJcclxuICAgIC5zdGF0ZSAnbXlTdGF0ZScsXHJcbiAgICAgIHVybDogJy8nXHJcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3N0YXRlL3RlbXBsYXRlcy9sYXlvdXQuaHRtbCdcclxuICAgICAgY29udHJvbGxlcjogJ1N0YXRlQ29udHJvbGxlcicgXHJcbiIsIiMjIypcclxuICMgIENhbnZhc0NvbnRyb2xsZXJcclxuIyMjXHJcblxyXG5jbGFzcyBDYW52YXNDb250cm9sbGVyICBcclxuICBAJGluamVjdDogWyAnJHNjb3BlJywgJ0NhbnZhc1NlcnZpY2UnLCAnU3BvdFNlcnZpY2UnLCAnTGl2ZUNhbnZhc1NlcnZpY2UnLCAnJGludGVydmFsJywgJyR3aW5kb3cnXVxyXG4gIGNvbnN0cnVjdG9yOiAoIEBfc2NvcGUsIEBfQ2FudmFzU2VydmljZSwgQF9TcG90U2VydmljZSwgQF9MaXZlQ2FudmFzU2VydmljZSwgJGludGVydmFsLCBAX3dpbmRvdyApIC0+XHJcbiAgICBAX3Njb3BlLnN0b3AgPSB1bmRlZmluZWRcclxuXHJcbiAgICAjIyMqXHJcbiAgICAgKiBIYW5kbGVycyBmb3Igc2NvcGUgRVZFTlRTXHJcbiAgICAjIyNcclxuICAgIEBfc2NvcGUuJG9uICdjYW52YXM6cmVzaXplJywgQF9oYW5kbGVSZXNpemVcclxuICAgIEBfc2NvcGUuJG9uICdzcG90OmxvY2snLCBAX2hhbmRsZVJlc2VydmVTcG90XHJcbiAgICBAX3Njb3BlLiRvbiAnc3BvdDp1bmxvY2snLCBAX2hhbmRsZVVubG9ja1Nwb3RcclxuICAgIEBfc2NvcGUuJG9uICdzcG90OnNhdmUnLCBAX2hhbmRsZURyYXdpbmdTYXZlXHJcblxyXG4gICAgIyMjKlxyXG4gICAgICogU3BvdCBIYW5kbGVycyBmb3IgU09DS0VUU1xyXG4gICAgIyMjXHJcbiAgICBAX0xpdmVDYW52YXNTZXJ2aWNlLm9uICdzcG90LnVwZGF0ZWQnLCAoZGF0YSkgPT5cclxuICAgICAgY29uc29sZS5sb2coJ0xpdmVDYW52YXNTZXJ2aWNlIHNwb3QudXBkYXRlZCcsIGRhdGEpXHJcbiAgICAgIEBfc2NvcGUuJGJyb2FkY2FzdCAnc3BvdDp1cGRhdGUnLCBkYXRhXHJcblxyXG4gICAgQF9MaXZlQ2FudmFzU2VydmljZS5vbiAnc3BvdC5yZXNlcnZlZCcsIChkYXRhKSA9PlxyXG4gICAgICBAX0NhbnZhc1NlcnZpY2UucmVzZXJ2ZVNwb3QgZGF0YSwgQF9zY29wZS5zcG90c1xyXG5cclxuICAgIEBfTGl2ZUNhbnZhc1NlcnZpY2Uub24gJ3Nwb3QudW5yZXNlcnZlZCcsIChkYXRhKSA9PlxyXG4gICAgICBjb25zb2xlLmxvZyAnc3BvdC51bnJlc2VydmVkJywgZGF0YVxyXG4gICAgICBAX0NhbnZhc1NlcnZpY2UudW5yZXNlcnZlU3BvdCBkYXRhLCBAX3Njb3BlLnNwb3RzXHJcblxyXG4gICAgQF9MaXZlQ2FudmFzU2VydmljZS5vbiAnaGVsbG8nLCAoZGF0YSkgPT5cclxuICAgICAgY29uc29sZS5sb2cgJ2hlbGxvIGZyb20gJywgZGF0YVxyXG5cclxuICAgICMjIypcclxuICAgICAqIEhhbmRsZXJzIGZvciBjYW52YXMgbmF2aWdhdGlvbiBGVU5DVElPTlNcclxuICAgICMjI1xyXG4gICAgQF9zY29wZS5yZWZyZXNoQ2FudmFzID0gKHByb3BzKSA9PlxyXG4gICAgICBAX0NhbnZhc1NlcnZpY2Uuc2V0Q29vcmRpbmF0ZXNcclxuICAgICAgICBsYXQ6IHByb3BzPy5sYXQgPyAwXHJcbiAgICAgICAgbG9uZzogcHJvcHM/LmxvbmcgID8gMFxyXG4gICAgICBAX2dldFNwb3RzXHJcbiAgICAgICAgaGVpZ2h0OiBAX3dpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgICAgIHdpZHRoOiBAX3dpbmRvdy5pbm5lcldpZHRoXHJcblxyXG4gICAgQF9zY29wZS5hZGRSb3dJbnRlcnZhbCA9IChvcHRzKSA9PlxyXG4gICAgICB0aWNrID0gPT4gXHJcbiAgICAgICAgQF9hZGRSb3cob3B0cylcclxuICAgICAgQF9zY29wZS5zdG9wID0gJGludGVydmFsKCB0aWNrLCA1MDApXHJcblxyXG4gICAgQF9zY29wZS5hZGRDb2x1bW5JbnRlcnZhbCA9IChvcHRzKSA9PlxyXG4gICAgICB0aWNrID0gPT4gXHJcbiAgICAgICAgQF9hZGRDb2x1bW4ob3B0cylcclxuICAgICAgQF9zY29wZS5zdG9wID0gJGludGVydmFsKCB0aWNrLCA1MDApXHJcblxyXG4gICAgQF9zY29wZS5zdG9wSW50ZXJ2YWwgPSA9PlxyXG4gICAgICBpZiBhbmd1bGFyLmlzRGVmaW5lZCBAX3Njb3BlLnN0b3AgXHJcbiAgICAgICAgJGludGVydmFsLmNhbmNlbCBAX3Njb3BlLnN0b3BcclxuICAgICAgICBAX3Njb3BlLnN0b3AgPSB1bmRlZmluZWRcclxuXHJcbiAgICBAX3Njb3BlLnpvb21JbiA9ID0+XHJcbiAgICAgIEBfQ2FudmFzU2VydmljZS5pbmNyZWFzZVByb3BvcnRpb25zKClcclxuICAgICAgQF9zY29wZS5yZWZyZXNoQ2FudmFzIEBfc2NvcGUuZ2V0Q3VycmVudFBvc2l0aW9uKClcclxuICAgICAgICBcclxuICAgIEBfc2NvcGUuem9vbU91dCA9ID0+XHJcbiAgICAgIEBfQ2FudmFzU2VydmljZS5kZWNyZWFzZVByb3BvcnRpb25zKClcclxuICAgICAgQF9zY29wZS5yZWZyZXNoQ2FudmFzIEBfc2NvcGUuZ2V0Q3VycmVudFBvc2l0aW9uKClcclxuXHJcbiAgICBAX3Njb3BlLmdldEN1cnJlbnRQb3NpdGlvbiA9ID0+XHJcbiAgICAgIGxhdDogQF9zY29wZS5zcG90cy5yb3dzWzBdLnRpbGVzWzBdLnhcclxuICAgICAgbG9uZzogQF9zY29wZS5zcG90cy5yb3dzWzBdLnRpbGVzWzBdLnlcclxuXHJcbiAgX2hhbmRsZURyYXdpbmdTYXZlOiAoZXZlbnQsIGRhdGEpID0+XHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgY29uc29sZS5sb2cgJ0NhbnZhc0NvbnRyb2xsZXIgc3BvdDpzYXZlJywgZGF0YVxyXG4gICAgQF9zY29wZS4kYnJvYWRjYXN0ICdzcG90OnVwZGF0ZScsIGRhdGFcclxuICAgIEBfU3BvdFNlcnZpY2Uuc2F2ZURhdGEgZGF0YVxyXG5cclxuICAgIEBfTGl2ZUNhbnZhc1NlcnZpY2UuZW1pdCAnc3BvdC51cGRhdGUnLCBkYXRhXHJcblxyXG4gIF9oYW5kbGVSZXNlcnZlU3BvdDogKGV2ZW50LCBkYXRhKSA9PlxyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgIEBfTGl2ZUNhbnZhc1NlcnZpY2UuZW1pdCAnc3BvdC5sb2NrJywgZGF0YSAgXHJcbiAgXHJcbiAgX2hhbmRsZVVubG9ja1Nwb3Q6IChldmVudCwgZGF0YSkgPT5cclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICBAX0xpdmVDYW52YXNTZXJ2aWNlLmVtaXQgJ3Nwb3QudW5sb2NrJywgZGF0YVxyXG4gICAgQF9zY29wZS4kYXBwbHkgPT5cclxuICAgICAgQF9DYW52YXNTZXJ2aWNlLnVucmVzZXJ2ZVNwb3QgZGF0YSwgQF9zY29wZS5zcG90c1xyXG5cclxuICBfaGFuZGxlUmVzaXplOiAoZXZlbnQsIGRhdGEpID0+XHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgQF9zY29wZS5yZWZyZXNoQ2FudmFzKClcclxuXHJcbiAgX2dldFNwb3RzOiAocHJvcHMpID0+XHJcbiAgICBAX3Njb3BlLnNwb3RzID0gQF9DYW52YXNTZXJ2aWNlLmdldFNwb3RzRm9yUHJvcG9ydGlvbnMgcHJvcHNcclxuXHJcbiAgX2FkZFJvdzogKGRpcmVjdGlvbikgPT5cclxuICAgIEBfQ2FudmFzU2VydmljZS5hZGRSb3cgQF9zY29wZS5zcG90cywgZGlyZWN0aW9uXHJcblxyXG4gIF9hZGRDb2x1bW46IChkaXJlY3Rpb24pID0+XHJcbiAgICBAX0NhbnZhc1NlcnZpY2UuYWRkQ29sdW1uIEBfc2NvcGUuc3BvdHMsIGRpcmVjdGlvblxyXG5cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jYW52YXMuY29udHJvbGxlcnMuQ2FudmFzQ29udHJvbGxlcicsIFtdKVxyXG4gIC5jb250cm9sbGVyICdDYW52YXNDb250cm9sbGVyJywgQ2FudmFzQ29udHJvbGxlciIsImFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jYW52YXMuZGlyZWN0aXZlcy5DYW52YXNEaXJlY3RpdmUnLCBbXSlcclxuICAuZGlyZWN0aXZlICdtYWdpY0NhbnZhcycsICgkcm9vdFNjb3BlLCAkd2luZG93KSAtPlxyXG4gICAgcmVzdHJpY3Q6ICdFJ1xyXG4gICAgY29udHJvbGxlcjogJ0NhbnZhc0NvbnRyb2xsZXInXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9jYW52YXMvdGVtcGxhdGVzL2xheW91dC5odG1sJ1xyXG4gICAgbGluazogKHNjb3BlLCBlbGVtLCBhdHRyKSAtPlxyXG4gICAgICBfaGFuZGxlUmVzaXplID0gLT5cclxuICAgICAgICBzY29wZS4kZW1pdCAnY2FudmFzOnJlc2l6ZSdcclxuICAgICAgICBlbGVtLmZpbmQoJy5jYW52YXNfd3JhcHBlcicpLmNzc1xyXG4gICAgICAgICAgaGVpZ2h0OiAkd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICAgICAgICB3aWR0aDogJHdpbmRvdy5pbm5lcldpZHRoXHJcblxyXG4gICAgICBfYXBwbHlSZXNpemVkID0gPT5cclxuICAgICAgICBzY29wZS4kYXBwbHkgX2hhbmRsZVJlc2l6ZVxyXG5cclxuICAgICAgX2hhbmRsZVJlc2l6ZSgpXHJcblxyXG4gICAgICBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCAncmVzaXplJywgXy50aHJvdHRsZSBfYXBwbHlSZXNpemVkICwgMTAwMCIsInJlcXVpcmUgJy4vY29udHJvbGxlcnMvY2FudmFzX2NvbnRyb2xsZXInXHJcbnJlcXVpcmUgJy4vc2VydmljZXMvY2FudmFzX3NlcnZpY2UnXHJcbnJlcXVpcmUgJy4vc2VydmljZXMvbGl2ZV9jYW52YXNfc2VydmljZSdcclxucmVxdWlyZSAnLi9kaXJlY3RpdmVzL2NhbnZhc19kaXJlY3RpdmUnXHJcblxyXG4jIyMqXHJcbiAjIEBuYW1lIGNhbnZhc1xyXG4jIyNcclxuXHJcbmFuZ3VsYXIubW9kdWxlICdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jYW52YXMnLCBbXHJcbiAgJ3F1aWNrc3RhcnRBcHAuY29tbW9uLmNhbnZhcy5zZXJ2aWNlcy5DYW52YXNTZXJ2aWNlJ1xyXG5cdCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jYW52YXMuc2VydmljZXMuTGl2ZUNhbnZhc1NlcnZpY2UnXHJcblx0J3F1aWNrc3RhcnRBcHAuY29tbW9uLmNhbnZhcy5jb250cm9sbGVycy5DYW52YXNDb250cm9sbGVyJ1xyXG5cdCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jYW52YXMuZGlyZWN0aXZlcy5DYW52YXNEaXJlY3RpdmUnXHJcbl0gXHJcbiIsImFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jYW52YXMuc2VydmljZXMuQ2FudmFzU2VydmljZScsIFtdKVxyXG4gIC5zZXJ2aWNlICdDYW52YXNTZXJ2aWNlJywgY2xhc3MgQ2FudmFzXHJcbiAgICBfUHJvcG9ydGlvbnM6XHJcbiAgICAgIHdpZHRoOiAxNTBcclxuICAgICAgaGVpZ2h0OiAxOTRcclxuICAgIF9jb29yZG9uYXRlczogXHJcbiAgICAgIGxhdDogMFxyXG4gICAgICBsb25nOiAwXHJcblxyXG4gICAgaW5jcmVhc2VQcm9wb3J0aW9uczogPT5cclxuICAgICAgQF9Qcm9wb3J0aW9ucy53aWR0aCArPSAxMFxyXG4gICAgICBAX1Byb3BvcnRpb25zLmhlaWdodCArPSAxNFxyXG5cclxuICAgIGRlY3JlYXNlUHJvcG9ydGlvbnM6ID0+XHJcbiAgICAgIEBfUHJvcG9ydGlvbnMud2lkdGggLT0gMTVcclxuICAgICAgQF9Qcm9wb3J0aW9ucy5oZWlnaHQgLT0gMjFcclxuXHJcbiAgICByZXNlcnZlU3BvdDogKHNwb3QsIHNwb3RzKSA9PlxyXG4gICAgICBmb3Igcm93IGluIHNwb3RzLnJvd3NcclxuICAgICAgICBmb3IgdGlsZSBpbiByb3cudGlsZXNcclxuICAgICAgICAgIGlmIHRpbGUueSBpcyBzcG90LnkgYW5kIHRpbGUueCBpcyBzcG90LnhcclxuICAgICAgICAgICAgdGlsZS5zdGF0dXMgPSAncmVzZXJ2ZWQnXHJcblxyXG4gICAgdW5yZXNlcnZlU3BvdDogKHNwb3QsIHNwb3RzKSA9PlxyXG4gICAgICBjb25zb2xlLmxvZyAnQ2FudmFzU2VydmljZScsIHNwb3QsIHNwb3RzXHJcbiAgICAgIGZvciByb3cgaW4gc3BvdHMucm93c1xyXG4gICAgICAgIGZvciB0aWxlIGluIHJvdy50aWxlc1xyXG4gICAgICAgICAgaWYgdGlsZS55IGlzIHNwb3QueSBhbmQgdGlsZS54IGlzIHNwb3QueFxyXG4gICAgICAgICAgICB0aWxlLnN0YXR1cyA9ICdmcmVlJ1xyXG5cclxuICAgIGFkZFJvdzogKHNwb3RzLCBkaXJlY3Rpb24pID0+XHJcbiAgICAgIGNvbnNvbGUubG9nIHNwb3RzLCBkaXJlY3Rpb25cclxuICAgICAgaWYgZGlyZWN0aW9uIGlzICd1cCdcclxuICAgICAgICAgIHNwb3RzLnJvd3MudW5zaGlmdFxyXG4gICAgICAgICAgICB0aWxlczogXy5tYXAgXy5maXJzdChzcG90cy5yb3dzKS50aWxlcywgKHRpbGUsaSkgPT5cclxuICAgICAgICAgICAgICB5OiB0aWxlLnktMVxyXG4gICAgICAgICAgICAgIHg6IHRpbGUueFxyXG4gICAgICAgICAgICAgIGhlaWdodDogQF9Qcm9wb3J0aW9ucy5oZWlnaHRcclxuICAgICAgICAgICAgICB3aWR0aDogQF9Qcm9wb3J0aW9ucy53aWR0aFxyXG4gICAgICAgICAgc3BvdHMucm93cy5wb3AoKVxyXG4gICAgICBpZiBkaXJlY3Rpb24gaXMgJ2Rvd24nXHJcbiAgICAgICAgICBzcG90cy5yb3dzLnB1c2hcclxuICAgICAgICAgICAgdGlsZXM6IF8ubWFwIF8ubGFzdChzcG90cy5yb3dzKS50aWxlcywgKHRpbGUsaSkgPT5cclxuICAgICAgICAgICAgICB5OiB0aWxlLnkrMVxyXG4gICAgICAgICAgICAgIHg6IHRpbGUueFxyXG4gICAgICAgICAgICAgIGhlaWdodDogQF9Qcm9wb3J0aW9ucy5oZWlnaHRcclxuICAgICAgICAgICAgICB3aWR0aDogQF9Qcm9wb3J0aW9ucy53aWR0aFxyXG4gICAgICAgICAgc3BvdHMucm93cy5zaGlmdCgpXHJcblxyXG4gICAgYWRkQ29sdW1uOiAoc3BvdHMsIGRpcmVjdGlvbikgPT5cclxuICAgICAgaWYgZGlyZWN0aW9uIGlzICdyaWdodCdcclxuICAgICAgICBfLm1hcCBzcG90cy5yb3dzLCAocm93LGkpID0+XHJcbiAgICAgICAgICByb3cudGlsZXMucHVzaFxyXG4gICAgICAgICAgICB4OiBfLmxhc3Qocm93LnRpbGVzKS54KzFcclxuICAgICAgICAgICAgeTogXy5maXJzdChyb3cudGlsZXMpLnlcclxuICAgICAgICAgICAgaGVpZ2h0OiBAX1Byb3BvcnRpb25zLmhlaWdodFxyXG4gICAgICAgICAgICB3aWR0aDogQF9Qcm9wb3J0aW9ucy53aWR0aFxyXG4gICAgICAgICAgcm93LnRpbGVzLnNoaWZ0KClcclxuICAgICAgZWxzZSBpZiBkaXJlY3Rpb24gaXMgJ2xlZnQnXHJcbiAgICAgICAgXy5tYXAgc3BvdHMucm93cywgKHJvdyxpKSA9PlxyXG4gICAgICAgICAgcm93LnRpbGVzLnVuc2hpZnRcclxuICAgICAgICAgICAgeDogXy5maXJzdChyb3cudGlsZXMpLngtMVxyXG4gICAgICAgICAgICB5OiBfLmZpcnN0KHJvdy50aWxlcykueVxyXG4gICAgICAgICAgICBoZWlnaHQ6IEBfUHJvcG9ydGlvbnMuaGVpZ2h0XHJcbiAgICAgICAgICAgIHdpZHRoOiBAX1Byb3BvcnRpb25zLndpZHRoXHJcbiAgICAgICAgICByb3cudGlsZXMucG9wKClcclxuXHJcbiAgICBzZXRDb29yZGluYXRlczogKHByb3BzKSA9PlxyXG4gICAgICBAX2Nvb3Jkb25hdGVzLmxhdCA9IHByb3BzLmxhdFxyXG4gICAgICBAX2Nvb3Jkb25hdGVzLmxvbmcgPSBwcm9wcy5sb25nXHJcblxyXG4gICAgZ2V0U3BvdHNGb3JQcm9wb3J0aW9uczogKHByb3BzKSA9PlxyXG4gICAgICAjIHJvd3MgPSAxMFxyXG4gICAgICAjIHRpbGVzUGVyUm93ID0gMjBcclxuICAgICAgcm93cyA9IE1hdGguZmxvb3IocHJvcHMuaGVpZ2h0IC8gQF9Qcm9wb3J0aW9ucy5oZWlnaHQpXHJcbiAgICAgIHRpbGVzUGVyUm93ID0gTWF0aC5mbG9vcihwcm9wcy53aWR0aCAvIEBfUHJvcG9ydGlvbnMud2lkdGgpXHJcbiAgICAgIHJvd3M6IGZvciBpIGluIFtAX2Nvb3Jkb25hdGVzLmxvbmcuLi5AX2Nvb3Jkb25hdGVzLmxvbmcrcm93c11cclxuICAgICAgICB0aWxlczogZm9yIGogaW4gW0BfY29vcmRvbmF0ZXMubGF0Li4uQF9jb29yZG9uYXRlcy5sYXQrdGlsZXNQZXJSb3ddXHJcbiAgICAgICAgICB4OiBqXHJcbiAgICAgICAgICB5OiBpXHJcbiAgICAgICAgICBoZWlnaHQ6IEBfUHJvcG9ydGlvbnMuaGVpZ2h0XHJcbiAgICAgICAgICB3aWR0aDogQF9Qcm9wb3J0aW9ucy53aWR0aFxyXG4gICAgICAgICAgc3RhdHVzOiAnbG9hZGluZydcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuY29tbW9uLmNhbnZhcy5zZXJ2aWNlcy5MaXZlQ2FudmFzU2VydmljZScsIFtdKVxyXG4gIC5mYWN0b3J5ICdMaXZlQ2FudmFzU2VydmljZScsIFsnc29ja2V0RmFjdG9yeScgLCAnQkFTRVVSTCcsIChzb2NrZXRGYWN0b3J5LCBCQVNFVVJMKSAtPlxyXG4gICAgaW9Tb2NrZXQgPSBpby5jb25uZWN0IFwiI3tCQVNFVVJMfS9MaXZlQ2FudmFzXCJcclxuICAgIHJhbmRvbVJvb21Tb2NrZXQgPSBzb2NrZXRGYWN0b3J5XHJcbiAgICAgIGlvU29ja2V0OiBpb1NvY2tldFxyXG4gICAgcmV0dXJuIHJhbmRvbVJvb21Tb2NrZXRcclxuICBdXHJcbiIsIiMjIypcclxuICMgIFNwb3RDb250cm9sbGVyXHJcbiMjI1xyXG5cclxuY2xhc3MgU3BvdENvbnRyb2xsZXIgIFxyXG4gIEAkaW5qZWN0OiBbICckc2NvcGUnLCAnU3BvdFNlcnZpY2UnIF1cclxuICBjb25zdHJ1Y3RvcjogKCBAX3Njb3BlLCBAX1Nwb3RTZXJ2aWNlICkgLT5cclxuICAgIEBfc2NvcGUuZGF0YSA9IEBfZ2V0RGF0YSgpXHJcblxyXG4gICAgQF9zY29wZS4kb24gJ2RyYXdpbmc6c2F2ZScsIChldmVudCwgZGF0YSkgPT5cclxuICAgICAgY29uc29sZS5sb2cgJ3Nwb3RDb250cm9sZXIgZHJhd2luZzpzYXZlJywgZGF0YVxyXG4gICAgICBAX3Njb3BlLiRlbWl0ICdzcG90OnNhdmUnLCBkYXRhXHJcbiAgICAgIFxyXG4gICAgQF9zY29wZS4kb24gJ3Nwb3Q6dXBkYXRlJywgKGV2ZW50LCBkYXRhKSA9PlxyXG4gICAgICBpZiBkYXRhLmhQb3MgaXMgQF9zY29wZS5zcG90T3B0cy54IGFuZCBkYXRhLnZQb3MgaXMgQF9zY29wZS5zcG90T3B0cy55XHJcbiAgICAgICAgY29uc29sZS5sb2cgJ3Nwb3RDb250cm9sZXIgc3BvdDp1cGRhdGVkJywgZGF0YVxyXG4gICAgICAgIEBfc2NvcGUuJGJyb2FkY2FzdCAnZHJhdzpkYXRhJywgZGF0YS5kcmF3aW5nRGF0YVVybFxyXG5cclxuICAgIEBfc2NvcGUuZGF0YS50aGVuIChyZXMpID0+XHJcbiAgICAgIGlmIHJlcy5kYXRhPy5kcmF3aW5nRGF0YVVybFxyXG4gICAgICAgIEBfc2NvcGUuJGJyb2FkY2FzdCAnZHJhdzpkYXRhJywgcmVzLmRhdGEuZHJhd2luZ0RhdGFVcmxcclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBfc2NvcGUuJGJyb2FkY2FzdCAnZnJlZTpkYXRhJywgcmVzXHJcblxyXG4gIF9nZXREYXRhOiA9PlxyXG4gICAgQF9TcG90U2VydmljZS5nZXREYXRhIFxyXG4gICAgICBoUG9zOiBAX3Njb3BlLnNwb3RPcHRzLnggXHJcbiAgICAgIHZQb3M6IEBfc2NvcGUuc3BvdE9wdHMueVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnNwb3QuY29udHJvbGxlcnMuU3BvdENvbnRyb2xsZXInLCBbXSlcclxuICAuY29udHJvbGxlciAnU3BvdENvbnRyb2xsZXInLCBTcG90Q29udHJvbGxlciIsImFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5zcG90LmRpcmVjdGl2ZXMuQ2FudmFzU3BvdERpcmVjdGl2ZScsIFtdKVxyXG4gIC5kaXJlY3RpdmUgJ2NhbnZhc1Nwb3QnLCAoJHJvb3RTY29wZSwgJGNvbXBpbGUsICRtb2RhbCwgJHdpbmRvdywgQkFTRUhPU1QpIC0+XHJcbiAgICByZXN0cmljdDogJ0EnXHJcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW0sIGF0dHIpIC0+XHJcblxyXG4gICAgICAjIyMqXHJcbiAgICAgICAqIFtzY29wZSBNRVRIT0RTXVxyXG4gICAgICAjIyNcclxuICAgICAgc2NvcGUuX2xpc3RlbkZvckRyYXdpbmcgPSAoZXZlbnQpID0+XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGNvbnNvbGUubG9nICdfbGlzdGVuRm9yRHJhd2luZydcclxuICAgICAgICBzY29wZS4kYnJvYWRjYXN0ICdkcmF3aW5nOnNhdmUnLCBcclxuICAgICAgICAgIGhQb3M6IHNjb3BlLnNwb3RPcHRzLnhcclxuICAgICAgICAgIHZQb3M6IHNjb3BlLnNwb3RPcHRzLnlcclxuICAgICAgICAgIGRyYXdpbmdEYXRhVXJsOiBldmVudC5kYXRhXHJcblxyXG4gICAgICBzY29wZS5fb3BlbkRyYXdpbmdGcmFtZSA9IChkYXRhKSA9PlxyXG4gICAgICAgICRtb2RhbFxyXG4gICAgICAgICAgdGl0bGU6ICdkcmF3aW5nIGZyYW1lJ1xyXG4gICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgYW5pbWF0aW9uOiAnYW0tZmFkZS1hbmQtc2NhbGUnXHJcbiAgICAgICAgICBiYWNrZHJvcEFuaW1hdGlvbjogJ2FtLWZhZGUnXHJcbiAgICAgICAgICBjb250ZW50VGVtcGxhdGU6ICdjb21tb24vc3BvdC90ZW1wbGF0ZXMvZHJhd19jYW52YXNfZnJhbWUuaHRtbCdcclxuICAgICAgICAgIHNjb3BlOiBzY29wZVxyXG5cclxuICAgICAgc2NvcGUuc2F2ZURyYXdpbmcgPSAoZGF0YSkgPT5cclxuICAgICAgICAjICR3aW5kb3cuZnJhbWVzWzBdLnBvc3RNZXNzYWdlICdzYXZlLmZyYW1lJywgJ2h0dHA6Ly8xODRkZjY5Zi5uZ3Jvay5jb20nXHJcbiAgICAgICAgJHdpbmRvdy5mcmFtZXNbMF0ucG9zdE1lc3NhZ2UgJ3NhdmUuZnJhbWUnLCBCQVNFSE9TVFxyXG5cclxuICAgICAgc2NvcGUuX3VucmVzZXJ2ZVNwb3QgPSAoZGF0YSkgPT5cclxuICAgICAgICBzY29wZS4kZW1pdCAnc3BvdDp1bmxvY2snLCBkYXRhXHJcblxyXG4gICAgICBzY29wZS5fcmVzZXJ2ZVNwb3QgPSAoZGF0YSkgPT5cclxuICAgICAgICBzY29wZS4kZW1pdCAnc3BvdDpsb2NrJywgZGF0YVxyXG5cclxuICAgICAgIyMjKlxyXG4gICAgICAgKiBbc2NvcGUgSEFORExFUlNdXHJcbiAgICAgICMjI1xyXG4gICAgICBzY29wZS4kb24gJ21vZGFsLnNob3cnLCAoZXZlbnQpID0+XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAkd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ21lc3NhZ2UnLCBzY29wZS5fbGlzdGVuRm9yRHJhd2luZ1xyXG4gICAgICAgICAgXHJcbiAgICAgIHNjb3BlLiRvbiAnbW9kYWwuaGlkZScsIChldmVudCwgZGF0YSkgPT5cclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciAnbWVzc2FnZScsIHNjb3BlLl9saXN0ZW5Gb3JEcmF3aW5nXHJcbiAgICAgICAgc2NvcGUuX3VucmVzZXJ2ZVNwb3Qgc2NvcGUuc3BvdE9wdHNcclxuXHJcbiAgICAgIHNjb3BlLiRvbiAnc3BvdDpjb25uZWN0JywgKGV2ZW50LCBkYXRhKSA9PlxyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgc2NvcGUuc3BvdE9wdHMgPSBkYXRhLnNwb3RPcHRzXHJcbiAgICAgICAgc2NvcGUuX3Jlc2VydmVTcG90KGRhdGEuc3BvdE9wdHMpXHJcbiAgICAgICAgc2NvcGUuX29wZW5EcmF3aW5nRnJhbWUoZGF0YS5zcG90T3B0cylcclxuXHJcblxyXG4gICAgICBcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnNwb3QuZGlyZWN0aXZlcy5EcmF3aW5nQ2FudmFzRGlyZWN0aXZlJywgW10pXHJcbiAgLmRpcmVjdGl2ZSAnZHJhd2luZ0NhbnZhcycsICgkcm9vdFNjb3BlLCAkY29tcGlsZSwgJHdpbmRvdykgLT5cclxuICAgIHJlc3RyaWN0OiAnRSdcclxuICAgICMgdGVtcGxhdGU6ICcnJzxkaXY+PGNhbnZhcyBpZD1cImRyYXdpbmdDYW52YXNcIiB3aWR0aD1cIjUwMFwiIGhlaWdodD1cIjcwMFwiPiA8L2NhbnZhcz48L2Rpdj4nJydcclxuICAgIHRlbXBsYXRlOiAnJyc8ZGl2PjxpZnJhbWUgY2xhc3M9XCJkcmF3aW5nQ2FudmFzRnJhbWVcIiB3aWR0aD1cIjU1MFwiIGhlaWdodD1cIjcxMVwiIHNyYz1cImhhcm1vbnlfY2FudmFzL2luZGV4Lmh0bWxcIj4gPC9pZnJhbWU+PC9kaXY+JycnXHJcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW0sIGF0dHIpIC0+XHJcbiAgICAgIFxyXG4gICAgICBzY29wZS5faW5pdERyYXdpbmdQYWQgPSA9PlxyXG4gICAgICAgIGlXaW5kb3cgPSBlbGVtLmZpbmQoJy5kcmF3aW5nQ2FudmFzRnJhbWUnKSAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2cgJ2NvbnRleHRXaW5kb3cnLCBhbmd1bGFyLmVsZW1lbnQoaVdpbmRvdylbMF1cclxuICAgICAgICBjb25zb2xlLmxvZyAnY29udGV4dFdpbmRvdycsIGFuZ3VsYXIuZWxlbWVudChpV2luZG93KS5jb250ZW50V2luZG93XHJcblxyXG4gICAgICBzY29wZS5faW5pdERyYXdpbmdQYWQoKVxyXG4iLCJhbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdC5kaXJlY3RpdmVzLlNwb3REaXJlY3RpdmUnLCBbXSlcclxuICAuZGlyZWN0aXZlICdzcG90VGlsZScsICgkcm9vdFNjb3BlKSAtPlxyXG4gICAgcmVzdHJpY3Q6ICdFJ1xyXG4gICAgc2NvcGU6XHJcbiAgICAgIHNwb3RPcHRzOiAnPSdcclxuICAgIGNvbnRyb2xsZXI6ICdTcG90Q29udHJvbGxlcidcclxuICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL3Nwb3QvdGVtcGxhdGVzL2xheW91dC5odG1sJ1xyXG4gICAgbGluazogKHNjb3BlLCBlbGVtLCBhdHRyKSAtPlxyXG5cclxuICAgICAgZWxlbS5iaW5kICdtb3VzZW92ZXInLCAtPlxyXG4gICAgICAgIGlmIHNjb3BlLnNwb3RPcHRzLnN0YXR1cyBpcyAnZnJlZSdcclxuICAgICAgICAgIGVsZW0uYWRkQ2xhc3MgJ2hvdmVyZWQnXHJcblxyXG4gICAgICBlbGVtLmJpbmQgJ21vdXNlbGVhdmUnLCAtPlxyXG4gICAgICAgIGVsZW0ucmVtb3ZlQ2xhc3MgJ2hvdmVyZWQnXHJcbiAgICAgIFxyXG4gICAgICBzY29wZS4kd2F0Y2ggJ3Nwb3RPcHRzLnN0YXR1cycsICggbmV3VmFsLCBvbGRWYWwgKSA9PlxyXG4gICAgICAgIGlmIG5ld1ZhbD8gYW5kIG5ld1ZhbCBpc250IG9sZFZhbFxyXG4gICAgICAgICAgc3dpdGNoIG5ld1ZhbFxyXG4gICAgICAgICAgICB3aGVuICdyZXNlcnZlZCdcclxuICAgICAgICAgICAgICBlbGVtLmZpbmQoJy5kcmF3aW5nJykuYWRkQ2xhc3MoJ2Nvbm5lY3RlZCcpXHJcbiAgICAgICAgICAgIHdoZW4gJ2ZyZWUnXHJcbiAgICAgICAgICAgICAgZWxlbS5maW5kKCcuZHJhd2luZycpLnJlbW92ZUNsYXNzKCdjb25uZWN0ZWQnKVxyXG5cclxuICAgICAgc2NvcGUuY29ubmVjdEZyYW1lID0gPT5cclxuICAgICAgICAjIGVsZW0uZmluZCgnLmRyYXdpbmcnKS50b2dnbGVDbGFzcygnY29ubmVjdGVkJylcclxuICAgICAgICBzY29wZS4kZW1pdCAnc3BvdDpjb25uZWN0JywgXHJcbiAgICAgICAgICBzY29wZVJlZjogc2NvcGVcclxuICAgICAgICAgIHNwb3RPcHRzOiBzY29wZS5zcG90T3B0c1xyXG4gICAgICAgIG51bGxcclxuXHJcbiAgICAgIHNjb3BlLiRvbiAnZnJlZTpkYXRhJywgKGV2ZW50LCBkYXRhKSA9PlxyXG4gICAgICAgIGNvbnNvbGUubG9nICdmcmVlOmRhdGEnLCBkYXRhXHJcbiAgICAgICAgc2NvcGUuc3BvdE9wdHMuc3RhdHVzID0gJ2ZyZWUnXHJcbiAgICAgICAgXHJcbiAgICAgIHNjb3BlLiRvbiAnZHJhdzpkYXRhJywgKGV2ZW50LCBkYXRhKSA9PlxyXG4gICAgICAgIHNjb3BlLnNwb3RPcHRzLnN0YXR1cyA9ICdkcmF3aW5nJ1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlbGVtLnVuYmluZCgpXHJcbiAgICAgICAgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgICBpbWcuY2xhc3NOYW1lID0gJ2RyYXdpbmcnXHJcbiAgICAgICAgaW1nLnNyYyA9IGRhdGFcclxuICAgICAgICBlbGVtLmZpbmQoJy5kcmF3aW5nJykucmVtb3ZlQ2xhc3MoJ2Nvbm5lY3RlZCcpXHJcbiAgICAgICAgZWxlbS5maW5kKCcuZHJhd2luZ0NhbnZhcycpLmh0bWwoaW1nKVxyXG4gICAgICAgICMgZWxlbS5maW5kKCcuZHJhd2luZycpLmFkZENsYXNzKCdjb25uZWN0ZWQnKVxyXG4iLCJyZXF1aXJlICcuL2NvbnRyb2xsZXJzL3Nwb3RfY29udHJvbGxlcidcclxucmVxdWlyZSAnLi9zZXJ2aWNlcy9zcG90X3NlcnZpY2UnXHJcbnJlcXVpcmUgJy4vZGlyZWN0aXZlcy9zcG90X2RpcmVjdGl2ZSdcclxucmVxdWlyZSAnLi9kaXJlY3RpdmVzL2NhbnZhc19zcG90X2RpcmVjdGl2ZSdcclxucmVxdWlyZSAnLi9kaXJlY3RpdmVzL2RyYXdpbmdfY2FudmFzX2RpcmVjdGl2ZSdcclxuIyMjKlxyXG4gIyBAbmFtZSBzcG90XHJcbiMjI1xyXG5hbmd1bGFyLm1vZHVsZSAncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdCcsIFtcclxuXHQncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdC5zZXJ2aWNlcy5TcG90U2VydmljZSdcclxuXHQncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdC5jb250cm9sbGVycy5TcG90Q29udHJvbGxlcidcclxuICAncXVpY2tzdGFydEFwcC5jb21tb24uc3BvdC5kaXJlY3RpdmVzLlNwb3REaXJlY3RpdmUnXHJcbiAgJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnNwb3QuZGlyZWN0aXZlcy5DYW52YXNTcG90RGlyZWN0aXZlJ1xyXG5cdCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5zcG90LmRpcmVjdGl2ZXMuRHJhd2luZ0NhbnZhc0RpcmVjdGl2ZSdcclxuXSBcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnNwb3Quc2VydmljZXMuU3BvdFNlcnZpY2UnLCBbXSlcclxuICAuZmFjdG9yeSAnU3BvdFNlcnZpY2UnLCAoJGh0dHAsIEJBU0VVUkwpIC0+XHJcbiAgICBcclxuICAgIHNhdmVEYXRhOiAoZGF0YSkgLT5cclxuICAgICAgJGh0dHAucG9zdCBcIiN7QkFTRVVSTH0vYXBpL3Nwb3QvXCIsIGRhdGE6IGRhdGFcclxuXHJcbiAgICBnZXREYXRhOiAob3B0cykgLT5cclxuICAgICAgJGh0dHBcclxuICAgICAgICB1cmw6XCIje0JBU0VVUkx9L2FwaS9zcG90L1wiXHJcbiAgICAgICAgcGFyYW1zOiBvcHRzXHJcbiAgICAgICAgIyBjYWNoZTogdHJ1ZSBcclxuIiwicmVxdWlyZSAnLi9zZXJ2aWNlcy9tb2R1bGVfZXh0ZW5zaW9uJ1xyXG5yZXF1aXJlICcuL3NlcnZpY2VzL29ic2VydmFibGVfbWl4aW4nXHJcbnJlcXVpcmUgJy4vc2VydmljZXMvcmVxdWVzdF9hYm9ydGVyX3NlcnZpY2UnXHJcblxyXG5cclxuYW5ndWxhci5tb2R1bGUgJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnV0aWxzJywgW1xyXG4gICdxdWlja3N0YXJ0QXBwLmNvbW1vbi51dGlscy5zZXJ2aWNlcy5Nb2R1bGUnXHJcbiAgJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnV0aWxzLnNlcnZpY2VzLk9ic2VydmFibGVNaXhpbidcclxuICAncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMuc2VydmljZXMuUmVxdWVzdEFib3J0ZXJNaXhpbidcclxuXVxyXG4iLCIjIyNcclxuICAgIEFuIG9iamVjdCB0aGF0IGFkZHMgZXh0cmEgZnVuY3Rpb25hbGl0eSB0byBhIGJhc2ljIGNsYXNzXHJcbiMjI1xyXG5hbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMuc2VydmljZXMuTW9kdWxlJywgW10pXHJcbiAgLmZhY3RvcnkgJ01vZHVsZScsICgpIC0+IGNsYXNzIE1vZHVsZVxyXG4gICAgIyMjXHJcbiAgICAgICAgQXR0YWNoZXMgZXZlcnkgcHJvcGVydHkgb2YgdGhlIG9iaiBkaXJlY3RseSBvbiB0aGUgZnVuY3Rpb24gY29uc3RydWN0b3JcclxuXHJcbiAgICAgICAgQHBhcmFtIFtPYmplY3RdIG9iaiBhbmQgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgZXh0ZW5zaW9uIHByb3BlcnRpZXNcclxuICAgICMjI1xyXG4gICAgQGV4dGVuZDogKG9iaikgLT5cclxuICAgICAgZm9yIGtleSwgdmFsdWUgb2Ygb2JqIHdoZW4ga2V5IG5vdCBpbiBbJ2V4dGVuZCcsJ2luY2x1ZGUnXVxyXG4gICAgICAgIEBba2V5XSA9IHZhbHVlXHJcbiAgICAgIG9iai5leHRlbmRlZD8uYXBwbHkoQClcclxuICAgICAgdGhpc1xyXG5cclxuICAgICMjI1xyXG4gICAgICAgIEF0dGFjaGVzIGV2ZXJ5IHByb3BlcnR5IG9mIHRoZSBvYmogdG8gdGhlXHJcbiAgICAgICAgcHJvdG90eXBlIG9mIHRoZSBmdW5jdGlvbiBjb25zdHJ1Y3RvclxyXG5cclxuICAgICAgICBAcGFyYW0gW09iamVjdF0gb2JqIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGluY2x1ZGVkIHByb3BlcnRpZXNcclxuICAgICAgICBAcGFyYW0gW0Z1bmN0aW9uXSBkZWNvcmF0b3IgYSBkZWNvcmF0b3IgZnVuY3Rpb24gYXBwbGllZFxyXG4gICAgICAgIGZvciBldmVyeSBwcm9wZXJ0eSdzIHZhbHVlXHJcbiAgICAjIyNcclxuICAgIEBpbmNsdWRlOiAob2JqLCBkZWNvcmF0b3IpIC0+XHJcbiAgICAgIGZvciBrZXksIHZhbHVlIG9mIG9iaiB3aGVuIGtleSAgbm90IGluIFsnZXh0ZW5kJywnaW5jbHVkZSddXHJcbiAgICAgICAgaWYgZGVjb3JhdG9yIGFuZCB0eXBlb2YgdmFsdWUgaXMgJ0Z1bmN0aW9uJ1xyXG4gICAgICAgICAgdmFsdWUgPSBkZWNvcmF0b3IodmFsdWUpXHJcbiAgICAgICAgQDo6W2tleV0gPSB2YWx1ZVxyXG4gICAgICBvYmouaW5jbHVkZWQ/LmFwcGx5KEApXHJcbiAgICAgIHRoaXNcclxuXHJcbiIsIlxyXG4jIyNcclxuICAgIEdpdmVuIGEgbGlzdCBvZiBjYWxsYmFjayBmdW5jdGlvbnMgaXQgaXRlcmF0ZXMgdGhyb3VnaCBpdFxyXG4gICAgYW5kIGNhbGxzIGVhY2ggZnVuY3Rpb24gYWxvbmdzaWRlIHRoZSBwYXNzZWQgYXJndW1lbnRzXHJcblxyXG4gICAgVGhhbmtzIHRvIEplcmVteSBBc2hrZW5hcyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNoa2VuYXMvYmFja2JvbmUvXHJcblxyXG4gICAgQHBhcmFtIFtBcnJheV0gY2FsbGJhY2tzIHRoZSBsaXN0IG9mIGNhbGxiYWNrIGZ1bmN0aW9ucyB0byBiZSBjYWxsZWRcclxuICAgIEBwYXJhbSBbQXJyYXldIGFyZ3MgdGhlIGFyZ3VtZW50cyBhcnJheSBwYXNzZWQgdG8gRXZlbnRCdXM6OnRyaWdnZXJcclxuIyMjXHJcbnRyaWdnZXJFdmVudENhbGxiYWNrcyA9IChjYWxsYmFja3MsIGFyZ3MpIC0+XHJcbiAgW2ExLCBhMiwgYTNdID0gW2FyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl1dXHJcbiAgY2JMZW4gPSBjYWxsYmFja3M/Lmxlbmd0aCB8fCAwXHJcbiAgaSA9IC0xXHJcbiBcclxuICBzd2l0Y2ggYXJncy5sZW5ndGhcclxuICAgIHdoZW4gMFxyXG4gICAgICB3aGlsZSAoKytpIDwgY2JMZW4pXHJcbiAgICAgICAgY2FsbGJhY2tzW2ldLmNiLmNhbGwoY2FsbGJhY2tzW2ldLmN0eClcclxuICAgIHdoZW4gMVxyXG4gICAgICB3aGlsZSAoKytpIDwgY2JMZW4pXHJcbiAgICAgICAgY2FsbGJhY2tzW2ldLmNiLmNhbGwoY2FsbGJhY2tzW2ldLmN0eCwgYTEpXHJcbiAgICB3aGVuIDJcclxuICAgICAgd2hpbGUgKCsraSA8IGNiTGVuKVxyXG4gICAgICAgIGNhbGxiYWNrc1tpXS5jYi5jYWxsKGNhbGxiYWNrc1tpXS5jdHgsIGExLCBhMilcclxuICAgIHdoZW4gM1xyXG4gICAgICB3aGlsZSAoKytpIDwgY2JMZW4pXHJcbiAgICAgICAgY2FsbGJhY2tzW2ldLmNiLmNhbGwoY2FsbGJhY2tzW2ldLmN0eCwgYTEsIGEyLCBhMylcclxuICAgIGVsc2VcclxuICAgICAgd2hpbGUgKCsraSA8IGNiTGVuKVxyXG4gICAgICAgIGNhbGxiYWNrc1tpXS5jYi5hcHBseShjYWxsYmFja3NbaV0uY3R4LCBhcmdzKVxyXG5cclxuIyMjXHJcbiAgICBEaXNwYXRjaGluZyBtZWNoYW5pc20gZm9yIGNlbnRyYWxpemluZyBhcHBsaWNhdGlvbi13aWRlIGV2ZW50c1xyXG5cclxuICAgIFRoZSBpbnRlcm5hbCBzdHJ1Y3R1cmUgb2YgdGhlIGV2ZW50IGxpc3QgbG9va3MgbGlrZSB0aGlzOlxyXG4gICAgICAgIGV2ZW50cyA9IHtcclxuICAgICAgICAgICAgY2FsbGJhY2tzOiBbe2NiLCBjdHh9LCB7Y2IsIGN0eH0sIC4uLl1cclxuICAgICAgICB9XHJcbiAgICB3aGVyZSBlYWNoIG9iamVjdCBjb3JyZXNwb25kaW5nIHRvIHRoZSBcImV2ZW50TmFtZVwiIGFycmF5LFxyXG4gICAgcmVwcmVzZW50cyBhIHNldCBjb250YWluaW5nIGEgY2FsbGJhY2sgYW5kIGEgY29udGV4dFxyXG4jIyNcclxuT2JzZXJ2YWJsZU1peGluID1cclxuICAjIyNcclxuICAgICAgQXR0YWNoZXMgYW4gZXZlbnQgdG8gYSBjYWxsYmFja1xyXG5cclxuICAgICAgQHBhcmFtIFtTdHJpbmddIGV2ZW50IHRoZSBuYW1lIG9mIHRoZSBldmVudCBpdCB3aWxsIG1vbml0b3JcclxuICAgICAgQHBhcmFtIFtGdW5jdGlvbl0gZm4gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRyaWdnZXJlZCBmb3IgZXZlbnRcclxuICAgICAgQHBhcmFtIFtPYmplY3RdIGN0eCBDb250ZXh0IGluIHdoaWNoIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZFxyXG5cclxuICAgICAgQHJldHVybiBbRXZlbnRCdXNdXHJcbiAgIyMjXHJcbiAgb246IChldmVudCwgY2IsIGN0eCkgLT5cclxuICAgIGlmIHR5cGVvZiBjYiBpcyAnZnVuY3Rpb24nIGFuZCB0eXBlb2YgZXZlbnQgaXMgJ3N0cmluZydcclxuICAgICAgIyBjb25zdHJ1Y3QgdGhlIGV2ZW50cyBsaXN0IGFuZCBhZGQgYW4gZW1wdHkgYXJyYXkgYXQga2V5ICdldmVudCdcclxuICAgICAgQF9ldmVudHMgPz0ge31cclxuICAgICAgQF9ldmVudHNbZXZlbnRdID89IFtdXHJcbiAgICAgICMgY29uc3RydWN0IGV2ZW50cyBpZiBub3QgYWxyZWFkeSBkZWZpbmVkLCB0aGVuIHB1c2ggYSBuZXcgY2FsbGJhY2tcclxuICAgICAgQF9ldmVudHNbZXZlbnRdLnB1c2ggeyBjYiwgY3R4IH1cclxuICAgIHJldHVybiBAXHJcblxyXG4gICMjI1xyXG4gICAgICBSZW1vdmVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gZXZlbnQgYW5kXHJcbiAgICAgIGRlbGV0ZXMgdGhlIGV2ZW50IGlmIHRoZSBjYWxsYmFjayBsaXN0IGJlY29tZXMgZW1wdHlcclxuXHJcbiAgICAgIEBwYXJhbSBbU3RyaW5nXSBldmVudCB0aGUgbmFtZSBvZiB0aGUgZXZlbnRcclxuICAgICAgQHBhcmFtIFtGdW5jdGlvbl0gZm4gdGhlIGNhbGxiYWNrIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgY2FsbGJhY2sgbGlzdFxyXG4gICMjI1xyXG4gIG9mZjogKGV2ZW50LCBjYikgLT5cclxuICAgIGNhbGxiYWNrTGlzdCA9IEBfZXZlbnRzP1tldmVudF1cclxuICAgIGlmIGV2ZW50IGFuZCBjYiBhbmQgY2FsbGJhY2tMaXN0Py5sZW5ndGhcclxuICAgICAgIyBzbWFsbCB0d2VhayBib3Jyb3dlZCBmcm9tIEJhY2tib25lLkV2ZW50XHJcbiAgICAgIEBfZXZlbnRzW2V2ZW50XSA9IHJldGFpbiA9IFtdXHJcbiAgICAgIGZvciBjYWxsYmFjaywgaSBpbiBjYWxsYmFja0xpc3RcclxuICAgICAgICByZXRhaW4ucHVzaCBjYWxsYmFjayB1bmxlc3MgY2FsbGJhY2suY2IgaXMgY2JcclxuICAgICAgaWYgcmV0YWluLmxlbmd0aFxyXG4gICAgICAgIEBfZXZlbnRzW2V2ZW50XSA9IHJldGFpblxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZGVsZXRlIEBfZXZlbnRzW2V2ZW50XVxyXG4gICAgICAjIyNcclxuICAgICAgICAgIENoZWNrIG1hZGUgdG8gcmVtb3ZlIGFsbCB0aGUgY2FsbGJhY2tzIGZvciB0aGUgZXZlbnRcclxuICAgICAgICAgIGlmIHRoZXJlIHdhcyBubyBjYWxsYmFjayBzcGVjaWZpZWRcclxuICAgICAgIyMjXHJcbiAgICBlbHNlIGlmIGV2ZW50IGFuZCB0eXBlb2YgY2IgaXMgJ3VuZGVmaW5lZCcgYW5kIGNhbGxiYWNrTGlzdD8ubGVuZ3RoXHJcbiAgICAgIGRlbGV0ZSBAX2V2ZW50c1tldmVudF1cclxuICAgIHJldHVybiBAXHJcblxyXG4gICMjI1xyXG4gICAgICBUcmlnZ2VycyB0aGUgZXZlbnQgc3BlY2lmaWVkIGFuZCBjYWxscyB0aGVcclxuICAgICAgYXR0YWNoZWQgY2FsbGJhY2sgZnVuY3Rpb25zXHJcblxyXG4gICAgICBAcGFyYW0gW1N0cmluZ10gZXZlbnQgdGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRoYXQgd2lsbCBiZSB0cmlnZ2VyZWRcclxuICAjIyNcclxuICB0cmlnZ2VyOiAoZXZlbnQsIGFyZ3MuLi4pIC0+XHJcbiAgICBldmVudENhbGxiYWNrcyA9IEBfZXZlbnRzP1tldmVudF1cclxuICAgIGFsbENhbGxiYWNrcyA9IEBfZXZlbnRzPy5hbGxcclxuXHJcbiAgICBpZiBldmVudCBhbmQgZXZlbnRDYWxsYmFja3Mgb3IgYWxsQ2FsbGJhY2tzXHJcbiAgICAgIGlmIGV2ZW50Q2FsbGJhY2tzPy5sZW5ndGhcclxuICAgICAgICB0cmlnZ2VyRXZlbnRDYWxsYmFja3MoZXZlbnRDYWxsYmFja3MsIGFyZ3MpXHJcbiAgICAgIGlmIGFsbENhbGxiYWNrcz8ubGVuZ3RoXHJcbiAgICAgICAgdG1wQXJncyA9IGFyZ3NcclxuICAgICAgICAjIGFkZCB0aGUgZXZlbnQgbmFtZSB0byB0aGUgZnJvbSBvZiB0aGUgY2FsbGJhY2sgcGFyYW1zXHJcbiAgICAgICAgdG1wQXJncy51bnNoaWZ0IGV2ZW50XHJcbiAgICAgICAgdHJpZ2dlckV2ZW50Q2FsbGJhY2tzKGFsbENhbGxiYWNrcywgdG1wQXJncylcclxuICAgIHJldHVybiBAXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMuc2VydmljZXMuT2JzZXJ2YWJsZU1peGluJywgW10pXHJcbiAgLmZhY3RvcnkgJ09ic2VydmFibGVNaXhpbicsICgpIC0+IE9ic2VydmFibGVNaXhpbiIsIiMjIyAgIFxyXG4gIFJlcXVlc3RBYm9ydGVyTWl4aW4gY3JlYXRlcyBhIGRlZmZlcmVkIG9uIGN1cnJlbnQgaW5zdGFuY2UgZm9yIGRlbGVnYXRpbmcgcmVxdWVzdCB0aW1lb3V0c1xyXG4gIFsgaG93IHRvIHVzZSBdXHJcblxyXG4gICMjICBiZWZvcmUgY29uc3RydWN0b3IgICAgKCAgY3VycmVudCBjbGFzcyBtdXN0IGhhdmUgTW9kdWxlIGFzIHN1cGVyY2xhc3MgIClcclxuICAxLiAgQGluY2x1ZGUgUmVxdWVzdEFib3J0ZXJNaXhpbiAgKGlmIGV4dGVuZHMgTW9kdWxlKSAgfHwgICBhbmd1bGFyLmV4dGVuZCBALCBSZXF1ZXN0QWJvcnRlck1peGluICAgKGlmIGRvZXMgbm90IGV4dGVuZCBNb2R1bGUpXHJcbiAgXHJcbiAgIyMgIGluc2lkZSBjb25zdHJ1Y3RvciBcclxuICAyLiBjYWxsIEByZWdpc3RlclBlbmRpbmdSZXF1ZXN0IHRvIGNyZWF0ZSBhIGRlZmZlcmVkIG9uIGN1cnJlbnQgaW5zdGFuY2VcclxuICBcclxuICAjIyAgYWZ0ZXIgY29uc3RydWN0b3IgXHJcbiAgMy4gcGFzcyBAX2Fib3J0ZXIgdG8gcmVzb3VyY2UgdGltZW91dCBjb25maWcgcHJvcGVydGllc1xyXG4gIDQuIGNhbGwgQGtpbGxSZXF1ZXN0IHdoZW4gc2NvcGUgXCIkZGVzdHJveVwiIGV2ZW50IGZpcmVzIFxyXG5cclxuIyMjXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMuc2VydmljZXMuUmVxdWVzdEFib3J0ZXJNaXhpbicsIFtdKVxyXG4gIC5mYWN0b3J5ICdSZXF1ZXN0QWJvcnRlck1peGluJywgWyAnJHEnLCAoJHEpIC0+IFxyXG4gICAgcmVnaXN0ZXJQZW5kaW5nUmVxdWVzdDogLT5cclxuICAgICAgQF9kZWZlcnJlZCA9ICRxLmRlZmVyKClcclxuICAgICAgQF9hYm9ydGVyID0gQF9kZWZlcnJlZC5wcm9taXNlXHJcbiAgICBraWxsUmVxdWVzdDogLT5cclxuICAgICAgQF9kZWZlcnJlZC5yZXNvbHZlKClcclxuICBdXHJcbiAgXHJcbiIsIiMjIypcclxuICMgSW5kZXggZmlsZSBcclxuICMjIGRlY2xhcmUgZGVwZW5kZW5jeSBtb2R1bGVzXHJcbiMjI1xyXG5yZXF1aXJlICcuL2FwcC9zdGF0ZS9pbmRleCdcclxucmVxdWlyZSAnLi9jb21tb24vY2FudmFzL2luZGV4J1xyXG5yZXF1aXJlICcuL2NvbW1vbi9zcG90L2luZGV4J1xyXG5yZXF1aXJlICcuL2NvbW1vbi91dGlscy9pbmRleCdcclxuXHJcbmFuZ3VsYXJcclxuICAubW9kdWxlKCdhcHBsaWNhdGlvbicsIFtcclxuICAgICd0ZW1wbGF0ZXMnXHJcbiAgICAnbmdBbmltYXRlJ1xyXG4gICAgJ25nUmVzb3VyY2UnXHJcbiAgICAjICduZ01vY2tFMkUnXHJcbiAgICAnbG9kYXNoJ1xyXG4gICAgJ3VpLnJvdXRlcidcclxuICAgICdidGZvcmQuc29ja2V0LWlvJ1xyXG4gICAgJ21nY3JlYS5uZ1N0cmFwJ1xyXG4gICAgXHJcbiAgICAncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMnXHJcbiAgICAncXVpY2tzdGFydEFwcC5jb21tb24uY2FudmFzJ1xyXG4gICAgJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnNwb3QnXHJcbiAgICAncXVpY2tzdGFydEFwcC5zdGF0ZScgXHJcblxyXG4gIF0pXHJcbiAgIyAuY29uc3RhbnQoJ0JBU0VVUkwnLCAnaHR0cDovL2xvY2FsaG9zdDo5MDAwJylcclxuICAjIC5jb25zdGFudCgnQkFTRUhPU1QnLCAnaHR0cDovL2xvY2FsaG9zdDo1MDAwJylcclxuICAuY29uc3RhbnQoJ0JBU0VVUkwnLCAnaHR0cDovLzVjYWYxOWQwLm5ncm9rLmNvbScpXHJcbiAgLmNvbnN0YW50KCdCQVNFSE9TVCcsICdodHRwOi8vNTYxNjc3ODkubmdyb2suY29tJylcclxuIl19
