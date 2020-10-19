/**
 * DashboardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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
    affichage: function (req, res){
        Demande.find(function foundDemande(err, demande){
            if (err) return res.send(err);
            
            Effectuer_tache.find(function foundEffectuer_tache(err, tache_en_cours){
                res.view('pages/dashboard', { demande: demande , tache_en_cours: tache_en_cours });
            });
        });
    },

};
