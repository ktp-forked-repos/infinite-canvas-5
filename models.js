'use strict';

exports = module.exports = function(app, mongoose) {

  //embeddable docs first
  require('./api/models/Drawing')(app, mongoose);
  require('./api/models/Category')(app, mongoose);

  //then regular docs
  require('./api/models/User')(app, mongoose);
  require('./api/models/MagicCanvas')(app, mongoose);

};
