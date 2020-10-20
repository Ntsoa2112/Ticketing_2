/**
 * DemandeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var fs = require('file-system');
const getSize = require('get-folder-size');

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

        if(tache == 'Récuperation'){
            await Fake.findOne({code:req.param('code')}, function foundOneFake(err, Onefake){
                if(err) return res.send(err);
                
                var code = Onefake.code;

                var chemin = Onefake.chemin;
                console.log("aty :" + chemin);
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
                            
                            return res.redirect('/dashboard');
                          });
                        
                    })
                });
               
           })
        }
        else if(tache == 'Livraison'){
            var chemin = req.param('chem1');
            var code = req.param('code');
            fs.readdir(chemin, function readdir(err, files){
                if(err) return res.send(err);
                var contenu = files;
                console.log("tafa:"+ files);
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
                    console.log(size);
                    Demande.create({objet, priorite, tache, code, size, chemin, categorie, matricule},function createDemande(err){
                        if(err){
                            res.send(err);
                        }
                        //console.log("Tafa: " + code);
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
            
            var chemin = oneDemande.chemin;
            fs.readdir(chemin, function readdir(err, files){
                if(err) return res.send(err);
                var contenu = files;
                res.view('demande/valide_form_demande', { oneDemande: oneDemande, datecreation:datecreation , timecreation: timecreation, contenu: contenu });
            });

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
                    return res.redirect('/dashboard');
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
                var chemin = OneDemande.chemin;
                fs.readdir(chemin, function readdir(err, files){
                    if(err) return res.send(err);
                    var contenu = files;
                    res.view('demande/terminer_form_tache', { oneDemande: OneDemande, OneTache:OneTache, datePriseEnCharge:datePriseEnCharge, timePriseEnCharge:timePriseEnCharge, contenu:contenu });
                });       
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
        if(req.param('sms')){
            var sms = req.param('sms');
            var exp_matricule = req.session.User.matricule;
            Demande.findOne(id_demande, function foundDemande(err, OneDemande){
                if(err) return res.send( err);
                var dest_matricule = OneDemande.matricule;
                Message.create({matricule_exp:exp_matricule, matricule_dest:dest_matricule, sms:sms}, function createMessage(err){
                    if(err) return res.send( err);
                })
            });


        };
        Effectuer_tache.updateOne({id:id_tache}, {H_fin_transfert:H_fin_transfert, statu:'Terminer'}, function(err){
            if(err) return res.send( err);
            Demande.updateOne({id:id_demande}, {etat_demande:'Terminer'}, function(err){
                if(err) return res.send( err);
                return res.redirect('/dashboard');
            })

        })
    },

    stand_by: function(req, res){
        var id_demande = req.param('id_demande');
        var id_tache = req.param('id_tache');
        Effectuer_tache.updateOne({id:id_tache}, {statu:'Stand By'}, function(err){
            if(err) return res.send(err);
            Demande.updateOne({id:id_demande}, {etat_demande:'Stand By'}, function(err){
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