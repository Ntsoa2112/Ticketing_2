/**
 * 
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
      matricule_exp: { type: 'number', required: true },
      matricule_dest: { type: 'number', required: true },
      vue : { type: 'boolean', defaultsTo: false },
      sms : { type: 'string', required: true },
      filename : { type: 'string', required: false },
    },
  
    datastore : 'default'
  
  };
