'use strict';

exports = module.exports = function(app, mongoose) {
  var drawingSchema = new mongoose.Schema({
    _id: { type: String },
    category: {type: mongoose.Schema.Types.ObjectId, ref:'Category'},
    description: { type: String, default: '' },
    drawingDataUrl: { type:String },
    hPos: {type: String },
    vPos: {type: String },
    name: { type: String, default: '' }
  });
  drawingSchema.index({ description: 1 });
  drawingSchema.index({ name: 1 });
  drawingSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Drawing', drawingSchema);
};
