/**
 * Demande.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    //tableName: 'tic_effectuer_tache',
    attributes: {
      id_demande: { type: 'number', required: true },
      matricule_trans: { type: 'number', required: true },
      H_fin_transfert: {type: 'string', required: false},
      statu: { type: 'string', defaultsTo:'En cours' },
    },
  
    datastore : 'ConnexionTicket'
  
  };
  