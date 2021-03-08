/**
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    //tableName: 'tic_admin',
    attributes: {
      id_pers: { type: 'number', required: true },
      admin: { type: 'boolean', required: true },
    },
  
    datastore : 'ConnexionTicket'
  
  };
  
  