/**
 * Dashboard.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    
  },
  datastore : 'default',

  /*
  detailsTache: async function(type){
    var rawResult = await sails.sendNativeQuery(`SELECT COUNT(*) nbr FROM demande WHERE etat_demande = $1 `, [ type ]);
    var nbrtache = rawResult.rows[0].nbr;

    async function nbrPriorite(priorite, type){
        var rawResult = await sails.sendNativeQuery("SELECT COUNT(*) nbrp FROM demande WHERE etat_demande = $1 and priorite = $2 ", [ type, priorite ]);
        var nbrp = rawResult.rows[0].nbrp;
        return nbrp;
    }
    var nbrP1 = await nbrPriorite('P1', type);
    var nbrP2 = await nbrPriorite('P2', type);
    var nbrP3 = await nbrPriorite('P3', type);

    async function nbrTypeTache(typeTache, type){
        var rawResult = await sails.sendNativeQuery("SELECT COUNT(*) nbrtype FROM demande WHERE etat_demande = $1 and tache = $2 ", [ type, typeTache ]);
        var nbrType = rawResult.rows[0].nbrtype;
        return nbrType;
    }

    var nbrRec = await nbrTypeTache('Récuperation', type);
    var nbrLiv = await nbrTypeTache('Livraison', type);

    var details = {nbrtache, nbrP1, nbrP2, nbrP3, nbrRec, nbrLiv};
    return details;
  },
  */

  details_Tache: async function(dd, df, type){
    console.log("Ato @ details");
    if(type == "now"){
        var demande = await sails.sendNativeQuery(`SELECT * FROM demande WHERE "createdAt" > $1  and etat_demande = $2`, [dd, "nouvelle"]);
        var tache_en_cours = await sails.sendNativeQuery(`SELECT *, effectuer_tache."createdAt" datecours FROM effectuer_tache JOIN demande ON effectuer_tache.id_demande = demande.id WHERE effectuer_tache."createdAt" > $1 OR demande.etat_demande = $2 OR demande.etat_demande = $3`, [dd, "En cours", "Stand By"]);
    }
    else if(type == "intervale"){
        var demande = await sails.sendNativeQuery(`SELECT * FROM demande WHERE "createdAt" > $1 and  "createdAt" <= $2 and etat_demande = $3`, [dd, df, "nouvelle"]);
        var tache_en_cours = await sails.sendNativeQuery(`SELECT *, effectuer_tache."createdAt" datecours FROM effectuer_tache JOIN demande ON effectuer_tache.id_demande = demande.id WHERE effectuer_tache."createdAt" > $1 and effectuer_tache."createdAt" <= $2`, [dd, df]);
    }

    demande = demande.rows;
    tache_en_cours = tache_en_cours.rows;
    var allTache = [demande, tache_en_cours];
    console.log("Hivoka  @ details");
    return allTache;
  },

};

