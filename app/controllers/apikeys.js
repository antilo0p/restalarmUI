
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Apikey = mongoose.model('Apikey')
var utils = require('../../lib/utils')
var extend = require('util')._extend

/**
 * Load
 */

exports.load = function (req, res, next, id){
  var User = mongoose.model('User');

  Apikey.load(id, function (err, apikey) {
    if (err) return next(err);
    if (!apikey) return next(new Error('not found'));
    req.apikey = apikey;
    next();
  });
};

exports.loadbyApikey = function (req, res, next, apikey){
  var User = mongoose.model('User');

  Apikey.loadbyApikey(apikey, function (err, apikey) {
    if (err) return next(err);
    if (!apikey) return next(new Error('not found'));
    req.apikey = apikey;
    next();
  });
};


exports.loadbyAccount = function (req, res, next, account){
  var User = mongoose.model('User');
    req.account = account;
    next();

};
/**
 * List
 */

exports.index = function (req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page
  };

  Apikey.list(options, function (err, apikeys) {
    if (err) return res.render('500');
    Apikey.count().exec(function (err, count) {
      res.render('apikeys/index', {
        title: 'Apikeys',
        apikeys: apikeys,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};

/**
 * List by Creator
 */
exports.indexmyUser = function (req, res){
   var User = mongoose.model('User');
   var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
   var perPage = 30;
   var  options = {
       perPage: perPage,
       page: page,
       criteria: { creator: req.user.id}
       };

    Apikey.listbyUser( options, function (err, apikeys) {
     if (err) return res.render('500');
     Apikey.count().exec(function (err, count) {
       res.render('apikeys/myindex', {
         title: 'Apikeys you own ',
         page: page + 1,
	 apikeys: apikeys,
         pages: Math.ceil(count / perPage)
       });
     });
   });   
};
/**
 * List by Creator
 */
exports.indexbyUser = function (req, res){
   var User = mongoose.model('User');
   var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
   console.log('userId param: %s',req.param('userId'))
   var perPage = 30;
   var  options = {
       perPage: perPage,
       page: page,
       criteria: { creator: req.param('userId') }
       };

    Apikey.listbyUser( options, function (err, apikeys) {
     if (err) return res.render('500');
     Apikey.count().exec(function (err, count) {
       res.render('apikeys/myindex', {
         title: 'Apikeys by ',
         page: page + 1,
	 apikeys: apikeys,
         pages: Math.ceil(count / perPage)
       });
     });
   });   
};

/**
 * List by Account
 */
exports.indexbyAccount = function (req, res){
   var User = mongoose.model('User');
   var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
   var perPage = 30;
   var  options = {
       perPage: perPage,
       page: page,
       criteria: { account: req.account}
       };

    Apikey.listbyAccount( options, function (err, apikeys) {
     if (err) return res.render('500');
     Apikey.count().exec(function (err, count) {
       res.render('apikeys/index', {
         title: 'Apikeys for account '+ req.account,
         page: page + 1,
	 apikeys: apikeys,
         pages: Math.ceil(count / perPage)
       });
     });
   });   
};

/**
 * List Accounts
 */
exports.indexAccounts = function (req, res){
   var User = mongoose.model('User');
   var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
   var perPage = 30;
   var  options = {
       perPage: perPage,
       page: page,
       };

    Apikey.listAccounts( options, function (err, accounts) {
     if (err) return res.render('500')
     console.log('accounts: %s', accounts)
     res.render('apikeys/accounts', {
         title: 'Accounts with apikeys ',
         page: page + 1,
	 accounts: accounts,
         pages: Math.ceil(accounts.lenght / perPage)
       });
   });   
};
/**
 * New apikey
 */

exports.new = function (req, res){
  res.render('apikeys/new', {
    title: 'New ApiKey',
    apikey: new Apikey({})
  });
};

/**
 * Create an article
 * Upload an image
 */

exports.create = function (req, res) {
  var apikey = new Apikey(req.body);
  apikey.creator = req.user;
  apikey.GenerateKeyAndSave(function (err) {
    if (!err) {
      req.flash('success', 'Successfully created Apikey!');
      return res.redirect('/apikeys/'+apikey._id);
    }
    console.log(err);
    res.render('apikeys/new', {
      title: 'New Apikey',
      apikey: apikey,
      errors: utils.errors(err.errors || err)
    });
  });
};

/**
 * Edit an article
 */

exports.edit = function (req, res) {
  res.render('apikeys/edit', {
    title: 'Edit ' + req.apikey.title,
    apikey: req.apikey
  });
};

/**
 * Update article
 */

exports.update = function (req, res){
  var apikey = req.apikey;
  // make sure no one changes the user
  delete req.body.user;
  apikey = extend(apikey, req.body);
  // TODO change for Save only
  apikey.UpdateAndSave(function (err) {
    if (!err) {
      return res.redirect('/apikeys/' + apikey._id);
    }

    res.render('apikeys/edit', {
      title: 'Edit Apikey',
      apikey: apikey,
      errors: utils.errors(err.errors || err)
    });
  });
};

/**
 * Show
 */

exports.show = function (req, res){
  res.render('apikeys/show', {
    title: req.apikey.title,
    apikey: req.apikey
  });
};

/**
 * Show by apikey
 */

exports.showbyApikey = function (req, res){
  var requested_key = req.apikey
  console.log('requested: %s', requested_key)
  var  options = {
       criteria: { apikey: requested_key}
       };
  res.render('apikeys/show', {
    title: req.apikey.title,
    apikey: req.apikey
  });
};


/**
 * Delete an article
 */

exports.destroy = function (req, res){
  var apikey = req.apikey;
  apikey.remove(function (err){
    req.flash('info', 'Deleted successfully');
    res.redirect('/apikeys');
  });
};
