'use strict';
var spot = require('./api/controllers/spot/index');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.set('X-Auth-Required', 'true');
  req.session.returnUrl = req.originalUrl;
  res.redirect('/login/');
}

function ensureAdmin(req, res, next) {
  if (req.user.canPlayRoleOf('admin')) {
    return next();
  }
  res.redirect('/');
}

function ensureAccount(req, res, next) {
  if (req.user.canPlayRoleOf('account')) {
    if (req.app.config.requireAccountVerification) {
      if (req.user.roles.account.isVerified !== 'yes' && !/^\/account\/verification\//.test(req.url)) {
        return res.redirect('/account/verification/');
      }
    }
    return next();
  }
  res.redirect('/');
}

exports = module.exports = function(app, passport) {
  //front end API
  
  //admin check
  app.all('/admin*', ensureAuthenticated);
  app.all('/admin*', ensureAdmin);

  //account check
  app.all('/account*', ensureAuthenticated);
  app.all('/account*', ensureAccount);

  app.get('/api/spot/', spot.getSpot);
  app.post('/api/spot/', spot.createSpot);
}