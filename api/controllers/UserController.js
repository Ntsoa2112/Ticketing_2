/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var bcrypt = require('bcrypt');
var localStorage = require('localStorage');

module.exports = {
    create: function(req, res){
        User.create(req.allParams(), function userCreated(err, user){
            if(err){
                return res.send("Erreur:" + err);
            }
            else{
                return res.redirect('/');
            };
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
                localStorage.setItem("moi", req.session.User.matricule);
                var moi = localStorage.getItem("moi");

                // Redirect to protected area
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
                return res.redirect('/');
              }
        })
    }

};

