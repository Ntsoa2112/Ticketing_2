/**
 * 
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var xl = require('excel4node');
const fs = require('fs');
const download = require('download');

module.exports = {

    exportation: function (req, res){
        Demande.find(function foundDemande(err, demande){
            if (err) return res.send(err);
            
            Effectuer_tache.find(function foundEffectuer_tache(err, tache_en_cours){
                if (err) return res.send(err);

                var wb = new xl.Workbook();
                var ws1 = wb.addWorksheet('Nouvelle Tâche');
                var ws2 = wb.addWorksheet('Tâche en cours');
                var ws3 = wb.addWorksheet('Tâche terminé');

                // Create a reusable style
                var style = wb.createStyle({
                font: {
                    color: '#FF0800',
                    size: 12,
                    },
                });               

                //Nouvelle Tâche
                ws1.cell(1, 1).string('Objet').style(style);
                ws1.cell(1, 2).string('Priorité').style(style);
                ws1.cell(1, 3).string('Tâche').style(style);
                ws1.cell(1, 4).string('Code').style(style);
                ws1.cell(1, 5).string('Taille').style(style);
                ws1.cell(1, 6).string('Chemin').style(style);
                ws1.cell(1, 7).string('Expéditeur').style(style);
                ws1.cell(1, 8).string('Etat').style(style);

                var nouvelleTache = [];
                for(var i = 0; i<demande.length; i++){
                    if(demande[i].etat_demande === "nouvelle"){
                        nouvelleTache.push(demande[i]);
                    }
                }

                for(var i = 0; i<nouvelleTache.length; i++){

                        ws1.cell(i+2, 1).string(nouvelleTache[i].objet);
                        ws1.cell(i+2, 2).string(nouvelleTache[i].priorite);
                        ws1.cell(i+2, 3).string(nouvelleTache[i].tache);
                        ws1.cell(i+2, 4).string(nouvelleTache[i].code);
                        ws1.cell(i+2, 5).string(nouvelleTache[i].size);
                        ws1.cell(i+2, 6).string(nouvelleTache[i].chemin);
                        ws1.cell(i+2, 7).string(nouvelleTache[i].categorie);
                        ws1.cell(i+2, 8).string(nouvelleTache[i].etat_demande);

                }

                //Tâche en cours
                ws2.cell(1, 1).string('Objet').style(style);
                ws2.cell(1, 2).string('Priorité').style(style);
                ws2.cell(1, 3).string('Tâche').style(style);
                ws2.cell(1, 4).string('Code').style(style);
                ws2.cell(1, 5).string('Taille').style(style);
                ws2.cell(1, 6).string('Chemin').style(style);
                ws2.cell(1, 7).string('Expéditeur').style(style);
                ws2.cell(1, 8).string('Réalisateur').style(style);
                ws2.cell(1, 9).string('Début').style(style);
                ws2.cell(1, 10).string('Etat tâche').style(style);

                var tacheEnCours = [];
                for(var i=0; i < tache_en_cours.length; i++) {
                    if(tache_en_cours[i].statu != 'Terminer'){
                    var id_demande = tache_en_cours[i].id_demande;
                    var createdAt = tache_en_cours[i].createdAt;

                        for(var j=0; j<demande.length; j++) {
                            if(demande[j].id == id_demande){
                                demande[j].createdAt = createdAt;
                                demande[j].matricule = tache_en_cours[i].matricule_trans;
                                tacheEnCours.push(demande[j])
                            }
                        }
                    }
                }

                for(var i=0; i<tacheEnCours.length; i++){
                    var dateDebut = new Date(tacheEnCours[i].createdAt).toLocaleDateString();
                    var timedebut = new Date(tacheEnCours[i].createdAt).toLocaleTimeString();
                    ws2.cell(i+2, 1).string(tacheEnCours[i].objet);
                    ws2.cell(i+2, 2).string(tacheEnCours[i].priorite);
                    ws2.cell(i+2, 3).string(tacheEnCours[i].tache);
                    ws2.cell(i+2, 4).string(tacheEnCours[i].code);
                    ws2.cell(i+2, 5).string(tacheEnCours[i].size);
                    ws2.cell(i+2, 6).string(tacheEnCours[i].chemin);
                    ws2.cell(i+2, 7).string(tacheEnCours[i].categorie);
                    ws2.cell(i+2, 8).number(tacheEnCours[i].matricule);
                    ws2.cell(i+2, 9).string(dateDebut + " à " + timedebut);
                    ws2.cell(i+2, 10).string("En cours");
                }
                
                //Tache terminé
                ws3.cell(1, 1).string('Objet').style(style);
                ws3.cell(1, 2).string('Priorité').style(style);
                ws3.cell(1, 3).string('Tâche').style(style);
                ws3.cell(1, 4).string('Code').style(style);
                ws3.cell(1, 5).string('Taille').style(style);
                ws3.cell(1, 6).string('Chemin').style(style);
                ws3.cell(1, 7).string('Expéditeur').style(style);
                ws3.cell(1, 8).string('Réalisateur').style(style);
                ws3.cell(1, 9).string('Début').style(style);
                ws3.cell(1, 10).string('Fin').style(style);

                var tacheTerminer = [];
                for(var i=0; i < tache_en_cours.length; i++) {
                    if(tache_en_cours[i].statu == 'Terminer'){
                    var id_demande = tache_en_cours[i].id_demande;
                    var createdAt = tache_en_cours[i].createdAt;

                        for(var j=0; j<demande.length; j++) {
                            if(demande[j].id == id_demande){
                                demande[j].createdAt = createdAt;
                                demande[j].matricule = tache_en_cours[i].matricule_trans;
                                demande[j].etat_demande = tache_en_cours[i].H_fin_transfert;
                                tacheTerminer.push(demande[j]);
                                
                            }
                        }
                    }
                }

                for(var i=0; i<tacheTerminer.length; i++){
                    var dateDebut = new Date(tacheTerminer[i].createdAt).toLocaleDateString();
                    var timedebut = new Date(tacheTerminer[i].createdAt).toLocaleTimeString();
                    ws3.cell(i+2, 1).string(tacheTerminer[i].objet);
                    ws3.cell(i+2, 2).string(tacheTerminer[i].priorite);
                    ws3.cell(i+2, 3).string(tacheTerminer[i].tache);
                    ws3.cell(i+2, 4).string(tacheTerminer[i].code);
                    ws3.cell(i+2, 5).string(tacheTerminer[i].size);
                    ws3.cell(i+2, 6).string(tacheTerminer[i].chemin);
                    ws3.cell(i+2, 7).string(tacheTerminer[i].categorie);
                    ws3.cell(i+2, 8).number(tacheTerminer[i].matricule);
                    ws3.cell(i+2, 9).string(dateDebut + " à " + timedebut);
                    ws3.cell(i+2, 10).string(tacheTerminer[i].etat_demande);
                }

                wb.write('/Tâche.xlsx');
                return res.view("demande/down_excel");

            });
        });
    },

    /*
    down: function(req, res){
        (async () => {
            await download('http://localhost:1337/export/Tâche.xlsx', 'dist');
         
            fs.writeFileSync('dist/Tâche.xlsx', await download('http://localhost:1337/export/Tâche.xlsx'));
         
            download('localhost:1337/export/Tâche.xlsx').pipe(fs.createWriteStream('dist/Tâche.xlsx'));
         
            await Promise.all([
                'localhost:1337/export/Tâche.xlsx'
            ].map(url => download(url, 'dist')));
        })();
        return res.redirect('/dashboard');

    },
    */
    

};
