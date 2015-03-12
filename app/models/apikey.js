
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var config = require('config');
var uuid = require('node-uuid');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;


/**
 * Apikey Schema
 */

var ApikeySchema = new Schema({
  creator: { type: Schema.ObjectId, ref: 'User',index: true},
  title: {type : String, default : '', trim : true},
  description: {type : String, default : '', trim : true},
  account: {type : String, default : '', trim : true},
  project_id: {type : String, default : '', trim : true},
  activity_id: {type : String, default : '', trim : true},
  apiKey: { type: String, unique: true, index: true },
  environment: { type: String, required: true, trim: true, enum: ['development','test','qa','production'], default : 'development'},
  enabled: {type: Boolean, default: 'true', index: true},
  suspended: {type: Boolean, default: 'false', index: true}, 
  updatedAt: {type: Date, default: Date.now},
  createdAt: {type: Date, default: Date.now}
});


ApikeySchema.virtual('apikeyId').get(function() {
    return this._id;
});

ApikeySchema.virtual('creatorId').get(function() {
    return this.creator;
});

/**
 * Validations
 */

ApikeySchema.path('account').required(true, 'Api Account cannot be blank');
ApikeySchema.path('creator').required(true, 'Api Creator cannot be blank');
ApikeySchema.path('project_id').required(true, 'ProjectID cannot be blank');
ApikeySchema.path('activity_id').required(true, 'ActivityID cannot be blank');
ApikeySchema.path('environment').required(true, 'Environment must be defined');

/**
 * Pre-remove hook
 */

ApikeySchema.pre('remove', function (next) {

  // Notify that apikey was removed

  next();
});

/**
 * Methods
 */

ApikeySchema.methods = {

  /**
   * Save apikey and generate Apikey 
   *   
   * @param {Function} cb
   * @api private
   */
  GenerateKeyAndSave: function (cb) {
    var self = this;

    this.validate(function (err) {
      if (err) return cb(err);
      var genapikey = uuid.v4();     
      self.apiKey = genapikey;
      self.save(cb);
    });
  },

  UpdateAndSave: function (cb) {
    var self = this;
    this.validate(function (err) {
      if (err) return cb(err);
      self.updatedAt = new Date().toISOString();
      self.save(cb);
    });
  }
}

/**
 * Statics
 */

ApikeySchema.statics = {

  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('creator', 'name email username')
      .exec(cb);
  },

  loadbyApikey: function (apikey, cb) {
    this.findOne({ 'apiKey' : apikey })
      .populate('creator', 'name email username')
      .exec(cb);
  },

  /**
   * List apikeys
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('creator', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  },

  /**
   * List apikeys
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  listbyUser: function (options, cb) {
   var criteria = options.criteria || {}
 
    this.find(criteria)
      .populate('creator', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  },

/**
   * List apikeys
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  listbyAccount: function (options, cb) {
   var criteria = options.criteria || {}
 
    this.find(criteria)
      .populate('creator', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  },
/**
   * List accounts
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  listAccounts: function (options, cb) {
   var criteria = options.criteria || {}
 
    this.distinct('account')
      .exec(cb);
  },

}

mongoose.model('Apikey', ApikeySchema);
