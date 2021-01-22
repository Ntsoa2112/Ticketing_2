/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var bcrypt = require('bcrypt');
const io = require('socket.io');
var socket = io();

module.exports = {
    create: function(req, res){
        var matricule = req.param('matricule');
        User.find(function findAll(err, users){
            if(err) return res.send(err);
            for(var i=0; i<users.length; i++){
                if(users[i].matricule == matricule){
                    return res.send("Vous avez déjà un compte, ou vérifier votre numèro matricule");
                }
            }
            var categorie = req.param('categorie');
            var password = req.param('password');
            var admin = false;
            var notif = null;
            function creation(matricule, categorie, password, admin, notif){
                User.create({matricule, categorie, password, admin}, function userCreated(err, user){
                    if(err){
                        return res.send(err);
                    }
                    else{
                        if(notif == null){
                            //notif = "Vous pouvez vous connecter";
                            notif = "ustr"
                        }
                        return res.redirect('/'+notif);
                    };
                });
            }
            if(categorie == 'Admin'){
                categorie = 'Trans';
                User.find(function findAll(err, users){
                    if(err) res.send(err);
                    var admin_existe = false;
                    for(var i=0; i<users.length; i++){
                        if(users[i].admin === true){
                            var exp_matricule = req.param('matricule');
                            var sms = exp_matricule + " vous demande le droit d'administrateur ";
                            var dest_matricule = users[i].matricule;
                            admin_existe = true;
                            notif = "adfa"
                            Message.create({matricule_exp:exp_matricule, matricule_dest:dest_matricule, sms:sms}, function createMessage(err){
                                if(err) return res.send( err);                            
                                sails.sockets.blast("new_message", {matricule_exp:exp_matricule, matricule_dest:dest_matricule, sms:sms, confAdmin:true});                 
                            })
                            break;
                        }
                    }
                    if(admin_existe === false){
                        admin = true;
                        notif = "trad"
                    }
                    creation(matricule, categorie, password, admin, notif);
                })
                
            }
            else{
                creation(matricule, categorie, password, admin, notif);
            }
        });     
    },

    login: function(req, res) {
        var matricule = req.param('matricule');
        var password = req.param('password');
  
        // Lookup the user in the database
        User.findOne({
            matricule: matricule,
        }).exec(function (err, user) {
  
            // Account not found
            if (err || !user) {
                return res.send('Vérifier votre nom ou prénom ou mot de passe', 500);
            }

            // Compare the passwords
            bcrypt.compare(password, user.password, function(err, valid) {
                if(err || !valid)
                    return res.send('Mot de passe incorrecte', 500)

                // The user has authenticated successfully, set their session
                req.session.authenticated = true;
                req.session.User = user;

                // Redirect to protected area
                console.log("Avant redirection dashboard")
                return res.redirect('/dashboard');
            });
        });
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
                    var notif = "fdp";
                    return res.redirect('/'+notif);
              }
        })
    },

    valider_admin: function(req, res){
        var matricule_new_admin = req.param("matricule");
        User.updateOne({matricule:matricule_new_admin}, {admin:true}, function(err){
            if(err) res.send(err);
            var exp_matricule = req.session.User.matricule;
            var sms = exp_matricule + " a confirmé votre droit d'administrateur, reconnectez-vous";
            sails.sockets.blast("new_message", {matricule_exp:exp_matricule, matricule_dest:matricule_new_admin, sms:sms});
        })
    }

};

