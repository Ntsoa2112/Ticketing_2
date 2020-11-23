/**
 * DemandeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var fs = require('file-system');
const getSize = require('get-folder-size');
const io = require('socket.io');
var socket = io();

module.exports = {

    afficher_contenu: function(req, res){
        var id_demande = req.param('id_demande');
        Demande.findOne(id_demande, function foundDemande(err, OneDemande){
            if(err) return res.send(err);
            var chemin = OneDemande.chemin;

            fs.readdir(chemin, function readdir(err, files){
                if(err) return res.send(err);
                var contenu = files;
                getSize(chemin, function statChemin(err, size){
                    if(err) return res.send(err);

                    function FileConvertSize(aSize){
                        aSize = Math.abs(parseInt(aSize, 10));
                        var def = [[1, 'octets'], [1024, 'ko'], [1024*1024, 'Mo'], [1024*1024*1024, 'Go'], [1024*1024*1024*1024, 'To']];
                        for(var i=0; i<def.length; i++){
                            if(aSize<def[i][0]) return (aSize/def[i-1][0]).toFixed(2)+' '+def[i-1][1];
                        }
                    }
    
                    var size = FileConvertSize(size);
                    res.view('demande/afficher_contenu', { oneDemande: OneDemande, size: size, contenu: contenu });

                });
            });

        });
    },
    
    demande_a_trans: async function(req, res){
        var objet = req.param('objet');
        var priorite = req.param('priorite');
        var tache = req.param('tache');
        var categorie = req.session.User.categorie;
        var matricule = req.session.User.matricule;
        var code = req.param('code');

        if(tache == 'Récuperation'){
            Demande.create({objet, priorite, tache, code, categorie, matricule},function createDemande(err){
                if(err){
                    res.send(err);
                }
                Demande.findOne({objet:objet, priorite:priorite}, function foundDemande(err, OneDemande){
                    if(err) return res.send(err);
                    var id = OneDemande.id;
                    sails.sockets.blast("nouvelle_tache", {id:id, objet, priorite, tache, code,  categorie, matricule});
                });
                
                return res.redirect('/dashboard');
              });
        }
        else if(tache == 'Livraison'){
            var chemin = req.param('chem1');
            var code = req.param('code');
            fs.readdir(chemin, function readdir(err, files){
                if(err) return res.send(err);
                var contenu = files;

                getSize(chemin, function statChemin(err, size){
                    if(err) return res.send(err);
    
                    function FileConvertSize(aSize){
                        aSize = Math.abs(parseInt(aSize, 10));
                        var def = [[1, 'octets'], [1024, 'ko'], [1024*1024, 'Mo'], [1024*1024*1024, 'Go'], [1024*1024*1024*1024, 'To']];
                        for(var i=0; i<def.length; i++){
                            if(aSize<def[i][0]) return (aSize/def[i-1][0]).toFixed(2)+' '+def[i-1][1];
                        }
                    }
    
                    var size = FileConvertSize(size);

                    Demande.create({objet, priorite, tache, code, size, chemin, categorie, matricule},function createDemande(err){
                        if(err){
                            res.send(err);
                        }

                        sails.sockets.blast("nouvelle_tache", {objet, priorite, tache, code, size, chemin, categorie, matricule});
                        return res.redirect('/dashboard');
                      });
                    
                })
            });
        }    
    },

    get_form_demande: function(req, res){
        Demande.findOne(req.param('id_demande'), function foundOneDemande(err, oneDemande){
            if(err){
                return res.send("Erreur:" + err);
            }

            var datecreation = new Date(oneDemande.createdAt).toLocaleDateString();
            var timecreation = new Date(oneDemande.createdAt).toLocaleTimeString();         
            
            if(!oneDemande.chemin){
                res.view('demande/valide_form_demande', { oneDemande: oneDemande, datecreation:datecreation , timecreation: timecreation});
            }
            else{
                var chemin = oneDemande.chemin;
                fs.readdir(chemin, function readdir(err, files){
                    if(err) return res.send(err);
                    var contenu = files;
                    res.view('demande/valide_form_demande', { oneDemande: oneDemande, datecreation:datecreation , timecreation: timecreation, contenu: contenu });
                });
            }

        } );
    },

    prendre_demande: function(req, res){
        Demande.findOne(req.param('id_demande'), function foundOneFake(err, OneDemande){
            if(err) return res.send(err);
            var id_demande = OneDemande.id;
            var matricule_trans = req.session.User.matricule;           
            Effectuer_tache.create({id_demande, matricule_trans} , async function takeDemande(err){
                if(err) return res.send("Erreur : " + err);
                var etat_demande = 'En cours';
               
                await Demande.updateOne(id_demande, {etat_demande : etat_demande}, function updateDemande(err){
                    if(err) return res.send( err);
                    var datecreation = new Date(OneDemande.createdAt).toLocaleDateString();
                    var timecreation = new Date(OneDemande.createdAt).toLocaleTimeString();
                    var debut = datecreation + " à " + timecreation;

                    Effectuer_tache.findOne({id_demande:id_demande}, function(err, tacheOne){
                        if(err) return res.send( err);
                        var id_tache = tacheOne.id;
                    
                        sails.sockets.blast("tache_en_cours", {id_demande:id_demande, objet:OneDemande.objet, priorite:OneDemande.priorite, tache:OneDemande.tache, code:OneDemande.code, size:OneDemande.size, chemin:OneDemande.chemin, expediteur:OneDemande.categorie, realisateur:matricule_trans, debut:debut, id_tache:id_tache});
                        return res.redirect('/dashboard');
                    });
                });
                
            } );

        });
    },

    valider_form_terminer: function(req, res){
        var id_demande = req.param('id_demande');
        Demande.findOne(id_demande, function foundOneFake(err, OneDemande){
            if(err) return res.send(err);
            Effectuer_tache.findOne({id_demande:id_demande}, function foundOneDemande(err, OneTache){
                if(err) return res.send(err);
                var datePriseEnCharge = new Date(OneTache.createdAt).toLocaleDateString();
                var timePriseEnCharge = new Date(OneTache.createdAt).toLocaleTimeString(); 

                if(!req.param('stand')){
                    if(!OneDemande.chemin){
                        res.view('demande/terminer_form_tache', { oneDemande: OneDemande, OneTache:OneTache, datePriseEnCharge:datePriseEnCharge, timePriseEnCharge:timePriseEnCharge});
                    }
                    else{
                        var chemin = OneDemande.chemin;
                        fs.readdir(chemin, function readdir(err, files){
                            if(err) return res.send(err);
                            var contenu = files;
                            res.view('demande/terminer_form_tache', { oneDemande: OneDemande, OneTache:OneTache, datePriseEnCharge:datePriseEnCharge, timePriseEnCharge:timePriseEnCharge, contenu:contenu });
                        }); 
                    }
    
                }
                else{
                    if(!OneDemande.chemin){
                        res.view('demande/standBy', { oneDemande: OneDemande, OneTache:OneTache, datePriseEnCharge:datePriseEnCharge, timePriseEnCharge:timePriseEnCharge});
                    }
                    else{
                        var chemin = OneDemande.chemin;
                        fs.readdir(chemin, function readdir(err, files){
                            if(err) return res.send(err);
                            var contenu = files;
                            res.view('demande/standBy', { oneDemande: OneDemande, OneTache:OneTache, datePriseEnCharge:datePriseEnCharge, timePriseEnCharge:timePriseEnCharge, contenu:contenu });
                        }); 
                    }
                }
                
                      
            });
        });
    },


    tache_terminer: function(req, res){
        var id_tache = req.param('id_tache');
        var id_demande = req.param('id_demande');
        var now = new Date();
        var dateNow = now.toLocaleDateString();
        var timeNow = now.toLocaleTimeString();
        var H_fin_transfert = dateNow + " à " + timeNow;
        var matr = req.session.User.matricule;
        if(req.param('sms')){
            var sms = req.param('sms');
            var exp_matricule = req.session.User.matricule;
            var noww = Date.now();
            if(req.file('photo')){
                req.file('photo').upload({
                    saveAs: function(file, cb) {
                        cb(null, noww  + file.filename);
                      },
                    dirname: require('path').resolve(sails.config.appPath, 'assets/images/file')
                  },function (err, uploadedFiles) {
                    if (err) return res.serverError(err);
                    var filename = noww  + uploadedFiles[0].filename;
                    Demande.findOne(id_demande, function foundDemande(err, OneDemande){
                        if(err) return res.send( err);
                        var dest_matricule = OneDemande.matricule;
                        Message.create({matricule_exp:exp_matricule, matricule_dest:dest_matricule, sms:sms, filename:filename}, function createMessage(err){
                            sails.sockets.blast("new_message", {matricule_exp:exp_matricule, matricule_dest:dest_matricule, sms:sms, filename:filename});
                            if(err) return res.send( err);
                        })
                    });
                  });
            }
            else{              
                Demande.findOne(id_demande, function foundDemande(err, OneDemande){
                    if(err) return res.send( err);
                    var dest_matricule = OneDemande.matricule;
                    Message.create({matricule_exp:exp_matricule, matricule_dest:dest_matricule, sms:sms}, function createMessage(err){
                        sails.sockets.blast("new_message", {matricule_exp:exp_matricule, matricule_dest:dest_matricule, sms:sms});
                        if(err) return res.send( err);
                    })
                });
            }

        };
        
        Effectuer_tache.updateOne({id:id_tache}, {H_fin_transfert:H_fin_transfert, statu:'Terminer'}, function(err){
            if(err) return res.send( err);
            Demande.updateOne({id:id_demande}, {etat_demande:'Terminer'}, function(err){
                if(err) return res.send( err);
                Demande.findOne(id_demande, function foundDemande(err, OneDemande){
                    if(err) return res.send( err);
                    Effectuer_tache.findOne({id_demande:id_demande}, function foundOneDemande(err, OneTache){
                        if(err) return res.send(err);
                        var datePriseEnCharge = new Date(OneTache.createdAt).toLocaleDateString();
                        var timePriseEnCharge = new Date(OneTache.createdAt).toLocaleTimeString(); 
                        var prise_en_charge = datePriseEnCharge + " à " + timePriseEnCharge;
                        sails.sockets.blast("tache_terminer", {id_demande:id_demande, objet:OneDemande.objet, priorite:OneDemande.priorite, tache:OneDemande.tache, code:OneDemande.code, size:OneDemande.size, chemin:OneDemande.chemin, expediteur:OneDemande.categorie, realisateur:matr, fin:H_fin_transfert, debut:prise_en_charge});
                    });
                });

                return res.redirect('/dashboard');
            })

        })
    },

    stand_by: function(req, res){
        var id_demande = req.param('id_demande');
        var id_tache = req.param('id_tache');
        var commentaire = req.param('commentaire');
        Effectuer_tache.updateOne({id:id_tache}, {statu:'Stand By'}, function(err){
            if(err) return res.send(err);
            Demande.updateOne({id:id_demande}, {etat_demande:'Stand By', commentaire:commentaire}, function(err){
                if(err) return res.send( err);
                return res.redirect('/dashboard');
            })

        })

    },

    continuer_tache: function(req, res){
        var id_demande = req.param('id_demande');
        var id_tache = req.param('id_tache');
        Effectuer_tache.updateOne({id:id_tache}, {statu:'En cours'}, function(err){
            if(err) return res.send(err);
            Demande.updateOne({id:id_demande}, {etat_demande:'En cours'}, function(err){
                if(err) return res.send( err);
                return res.redirect('/dashboard');
            })

        })
    },

    message_vue: function(req, res){
        var matricule_dest = req.param('matricule_dest');
        Message.update({matricule_dest:matricule_dest}, {vue:true}, function updateMessage(err){
            if(err) return res.send(err);
            var mety = "Mety";
            return res.send(mety);
        })
        
    }

};


/*
var code = req.param('code');
        console.log("code :" + code);

        Fake.find(function foundFake(err, fake){
            if(err) return res.send(err);
            //var code = folder.code;
            console.log("folder : " + fake);

            var size = folder.size;
            var chemin = folder.chemin;
            var objet = req.param('objet');
            var priorite = req.param('priorite');
            var tache = req.param('tache');
            var categorie = req.session.User.categorie;
            var matricule = req.session.User.matricule;
            Demande.create({objet, priorite, tache, code, size, chemin, categorie, matricule}, function createdemande(err){
                if(err){
                    res.send("Erreur:" + err);
                }
                return res.redirect('/dashboard');
              });
              
        } );

        /*
        var fichier = req.file('file')._files[0].stream.filename;
        req.file('file').upload({saveAs: fichier}, function onUploadComplete(err, files) {
            if (err) {
                return res.serverError(err);  // IF ERROR Return and send 500 error with error
              }
              var size = files[0].size;
              function FileConvertSize(aSize){
                    aSize = Math.abs(parseInt(aSize, 10));
                    var def = [[1, 'octets'], [1000, 'ko'], [1000*1000, 'Mo'], [1000*1000*1000, 'Go'], [1000*1000*1000*1000, 'To']];
                    for(var i=0; i<def.length; i++){
                        if(aSize<def[i][0]) return (aSize/def[i-1][0]).toFixed(2)+' '+def[i-1][1];
                    }
                }
              size = FileConvertSize(size);
              
              var objet = req.param('objet');
              var priorite = req.param('priorite');
              var tache = req.param('tache');
              var categorie = req.session.User.categorie;
              var matricule = req.session.User.matricule;
              
              Demande.create({objet, priorite, tache, fichier, size, categorie, matricule}, function fileUploaded(err){
                if(err){
                    res.send("Erreur:" + err);
                }
                return res.redirect('/dashboard');
              });

        });
        */