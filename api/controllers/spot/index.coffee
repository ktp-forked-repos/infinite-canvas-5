mongoose = require 'mongoose'

# Spot Controller
module.exports = 
  createSpot: (req, res, next) =>
    console.log 'createSpot', req.body
    req.body.data._id = new mongoose.Types.ObjectId()
    req.app.db.models.Drawing 
      .create req.body.data, (err, result) =>
        res.send result

  getSpot: (req, res, next) =>
    console.log 'get spot', req.query
    req.app.db.models.Drawing
      .findOne req.query
      .exec (err, result) =>
        res.send result


