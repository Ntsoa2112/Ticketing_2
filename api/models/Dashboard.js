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

  details_Tache: async function(dd, df, type){
    if(type == "now"){
        var demande = await sails.sendNativeQuery(`SELECT * FROM demande WHERE "createdAt" > $1  and etat_demande = $2`, [dd, "nouvelle"]);
        var tache_en_cours = await sails.sendNativeQuery(`SELECT *, effectuer_tache."createdAt" datecours FROM effectuer_tache JOIN demande ON effectuer_tache.id_demande = demande.id WHERE effectuer_tache."createdAt" > $1`, [dd]);
    }
    else if(type == "intervale"){
        var demande = await sails.sendNativeQuery(`SELECT * FROM demande WHERE "createdAt" > $1 and  "createdAt" <= $2 and etat_demande = $3`, [dd, df, "nouvelle"]);
        var tache_en_cours = await sails.sendNativeQuery(`SELECT *, effectuer_tache."createdAt" datecours FROM effectuer_tache JOIN demande ON effectuer_tache.id_demande = demande.id WHERE effectuer_tache."createdAt" > $1 and effectuer_tache."createdAt" <= $2`, [dd, df]);
    }

    demande = demande.rows;
    tache_en_cours = tache_en_cours.rows;
    var allTache = [demande, tache_en_cours];
    return allTache;
  },

  details: function(demande, tacheCours){
    var nP1 = 0, nP2 = 0, nP3 = 0, nRec = 0, nLiv = 0, n = 0, cP1 = 0, cP2 = 0, cP3 = 0, cRec = 0, cLiv = 0, c = 0, tP1 = 0, tP2 = 0, tP3 = 0, tRec = 0, tLiv = 0, t = 0;

    function statdemande(type, demande){
        var nP1 = 0, nP2 = 0, nP3 = 0, nRec = 0, nLiv = 0, n = 0;
        for(var i = 0; i<demande.length; i++){      
            if(demande[i].etat_demande == type){
                n = n + 1;
                if(demande[i].priorite == "P1"){
                    nP1 = nP1 + 1;
                }
                else if(demande[i].priorite == "P2"){
                    nP2 = nP2 + 1;
                }
                else if(demande[i].priorite == "P3"){
                    nP3 = nP3 + 1;
                }
    
                if(demande[i].tache == "Livraison"){
                    nLiv = nLiv + 1;
                }
                if(demande[i].tache == "Récuperation"){
                    nRec = nRec + 1;
                }
            }
        }
        var stat = {"nbrtache":n ,"nbrP1":nP1, "nbrP2":nP2, "nbrP3":nP3, "nbrLiv":nLiv, "nbrRec":nRec };
        return stat;
    }

   var nouvelle = statdemande("nouvelle", demande);
   var enCours = statdemande("En cours", tacheCours);
   var terminer = statdemande("Terminer", tacheCours);
   return {nouvelle, enCours, terminer};
  }

};

