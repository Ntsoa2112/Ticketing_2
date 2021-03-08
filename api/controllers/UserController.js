/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var bcrypt = require('bcrypt');
const io = require('socket.io');
var socket = io();
var ldap = require('ldapjs');

module.exports = {
    login: async function(req, res)
    {
          var email = 0;
          
          if(!isNaN(req.param('email',null))) email = Number(req.param('email',null));
          
  
      //init ldap
          var client = ldap.createClient({
            url: 'ldap://10.128.1.14:389',
            reconnect: false
          });

          var donne_user = await sails.sendNativeQuery("select * from r_personnel where id_pers = $1", [email]);
          client.on('error', function(err) { });

          if(donne_user.rowCount ==1 ){
                //test ldapServer
                client.bind('EASYTECH\\'+req.param('email',null), req.param('password',null), async function(err) {
                if(err){
                    var notif = "Votre mot de passe est invalide";
                    return res.redirect('/'+ notif);
                }
                else
                {
                    req.session.matricule = email;
        //connected
                    var droit = await sails.sendNativeQuery("select r_personnel.id_pers,r_personnel.id_droit, fr_droit_user.droit from r_personnel join fr_droit_user on r_personnel.id_pers = fr_droit_user.id_personnel where r_personnel.id_pers =$1", [email]);
                    if(droit.rowCount == 1){
                        req.session.droit = droit.rows[0].id_droit;
                    }
                    else{
                        req.session.droit = 0
                    }
                    console.log("Droit : " + req.session.droit);
/*
                    Admin.findOne({id_pers:email}, function(err, resu){
                        if(err) return res.send(err);
                        console.log("tafa");
                        console.log(resu);
                    })
                    */

                   var admin = await sails.sendNativeQuery("select * from tic_admin where id_pers = $1", [email]);

                    console.log(admin);
                    req.session.admin = false;
                    if(admin.rowCount == 1 && admin.rows[0].admin == true){
                        req.session.admin = true;
                    }
                    console.log("Admin : " + req.session.admin);

                    var id_dep = donne_user.rows[0].id_departement;
                    var departement = await sails.sendNativeQuery("select libelle from r_departement where id = $1", [id_dep]);
                    if(departement.rowCount == 1){
                        req.session.categorie = departement.rows[0].libelle;
                    }
                    else{
                        req.session.categorie = "Département inconnue";
                    }
                    req.session.categorie = 'TRANS';
                    console.log("dep : " + req.session.categorie);
                    console.log("Connecter : " + email);
                    return res.redirect('/dashboard');               
                }
            });
          }
          else{
            var notif = "Votre matricule est invalide";
            console.log('Email invalide user.'); //afficher email invalide
            return res.redirect('/'+ notif);
          }
          
    },



    logout: function(req, res) {
        req.session.destroy(function(err) {
          if(err){
            return res.send('Erreur déconnexion', 500);
          }
          else{
            return res.redirect('/');
          }
  
        });
    },

    mdp_oublier: function(req, res){
        var matricule = req.param('matricule');
        var password = req.param('password');
        User.updateOne({matricule:matricule}, {password:password}, function updatePassword(err){
            if(err){
                return res.send(err);
              }
              else{
                    return res.redirect('/dashboard');
              }
        })
    },

    valider_admin: function(req, res){
        var matricule_new_admin = req.param("matricule");
        User.updateOne({matricule:matricule_new_admin}, {admin:true}, function(err){
            if(err) res.send(err);
            var exp_matricule = req.session.matricule;
            var sms = exp_matricule + " a confirmé votre droit d'administrateur, reconnectez-vous";
            sails.sockets.blast("new_message", {matricule_exp:exp_matricule, matricule_dest:matricule_new_admin, sms:sms});
        })
    },

    modif_categorie: function(req, res){
        var matricule = req.param("matricule");
        var categorie = req.param("categorie");
        User.updateOne({matricule:matricule}, {categorie:categorie}, function updateCategorie(err){
            if(err){
                return res.send(err);
              }
              else{
                    return res.redirect('/dashboard');
              }
        })
    }

};

