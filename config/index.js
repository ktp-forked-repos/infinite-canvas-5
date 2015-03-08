'use strict';


exports.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://192.168.59.103:27017/magicuniverse'
};
