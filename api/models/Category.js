'use strict';

exports = module.exports = function(app, mongoose) {
  var categorySchema = new mongoose.Schema({
    _id: { type: String },
    name: { type: String, default: '' },
    drawings: [mongoose.modelSchemas.Drawing]
  });
  categorySchema.index({ name: 1 });
  categorySchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Category', categorySchema);
};
