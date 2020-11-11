/**
 * DashboardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const io = require('socket.io');
var socket = io();

module.exports = {
    /*
    affichage: function (req, res){
        Demande.find(function foundDemande(err, demande){
            if(err){
                return res.send(err);
            }
            else{
                res.view('pages/dashboard', { demande: demande });
            }
        });
    },
    */
   
    affichage: async function (req, res){

        async function detailsTache(type){
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
        }

        var detailsNouvelle = await detailsTache('nouvelle', demande);
        var detailsEnCours = await detailsTache('En cours');
        var detailsterminer = await detailsTache('Terminer');

        Demande.find(function foundDemande(err, demande){
            if (err) return res.send(err);
            
            Effectuer_tache.find(function foundEffectuer_tache(err, tache_en_cours){
                if (err) return res.send(err);

                Message.find(function foundMessage(err, messages){
                    if (err) return res.send(err);
                    sails.sockets.blast("detailsTache", {detailsNouvelle, detailsEnCours , detailsterminer});
                    res.view('pages/dashboard', { demande: demande , tache_en_cours: tache_en_cours, messages:messages, detailsNouvelle, detailsEnCours , detailsterminer });
                });
         
            });
        });
    },

};
