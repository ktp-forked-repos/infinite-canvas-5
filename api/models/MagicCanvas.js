'use strict';

exports = module.exports = function(app, mongoose) {
  var canvasSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    drawings: [mongoose.modelSchemas.Drawing],
    search: [String]
  });
 
  canvasSchema.index({ name: 1 }, { unique: true });
  canvasSchema.index({ search: 1 });
  canvasSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('MagicCanvas', canvasSchema);
};
