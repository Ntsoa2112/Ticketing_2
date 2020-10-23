/**
 * Demande.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    objet: { type: 'string', required: true },
    priorite: { type: 'string', required: true },
    tache: { type: 'string', required: true },
    code: { type: 'string', required: true },
    size: { type: 'string', required: true },
    chemin: { type: 'string', required: false },
    categorie: { type: 'string', required: true },
    etat_demande: { type: 'string',  defaultsTo: 'nouvelle' },
    matricule: { model:'User' },
  },

  datastore : 'default'
};
