/**
 * DashboardController
 *
 * @description :: Server-side actions for handling incoming requests
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const io = require('socket.io');
var det = require('../service/traitement');
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
        /*
        function afficher(dd='undefined', df='undefined'){
            if(dd && df){
                Dashboard.details_Tache(dd, df);
            }
            else{
                console.log("Passs");
            }
        }
        */
        console.log("Tafiditra affichage");
        if(!req.param('dd') && !req.param('df')){
            console.log("date now : " + Date.now());
            var parse_now = await Date.parse(new Date(Date.now()).toLocaleDateString());
            var type = "now";
            console.log("parse now : "+parse_now);
            var allTache = await Dashboard.details_Tache( parse_now, parse_now ,type);
            var demande = allTache[0];
            var tache_en_cours = allTache[1];
        }
        console.log("Avant details");
        var resultatStat = det.details(demande, tache_en_cours);
        var detailsNouvelle = resultatStat["nouvelle"];
        var detailsEnCours = resultatStat["enCours"];
        var detailsterminer = resultatStat["terminer"];

                Message.find(function foundMessage(err, messages){
                    if (err) return res.send(err);
                    console.log("Tafiditra foundMesage");
                    sails.sockets.blast("detailsTache", {detailsNouvelle, detailsEnCours , detailsterminer});
                    res.view('pages/dashboard', { demande: demande , tache_en_cours: tache_en_cours, messages:messages, detailsNouvelle, detailsEnCours , detailsterminer, datDebut: "null", datFin: "null" });
                });
    },

    afficher_date: async function(req, res){
        if(req.param('mint') && req.param('maxt')){
            var datd = req.param('mint');
            var datf = req.param('maxt');
            var now = new Date(Date.now()).toLocaleDateString();
            console.log("Now : "+ now)
            if(now == req.param('maxt')){
                type = "now";
                var df = Date.parse(new Date(Date.now()).toLocaleDateString());
            }
            else{
                var date = new Date(req.param('maxt'));
                date.setDate(date.getDate() + 1);
                var df = Date.parse(date);
                var type = "intervale";
            }
            var datd = req.param('mint');
            var dd = Date.parse(new Date(datd).toLocaleDateString());
            var allTache = await Dashboard.details_Tache( dd, df, type );
        }
        console.log(allTache);
        var demande = allTache[0];
        var tache_en_cours = allTache[1];
        var resultatStat = det.details(demande, tache_en_cours);
        var detailsNouvelle = resultatStat["nouvelle"];
        var detailsEnCours = resultatStat["enCours"];
        var detailsterminer = resultatStat["terminer"];
        Message.find(function foundMessage(err, messages){
            if (err) return res.send(err);
            sails.sockets.blast("detailsTache", {detailsNouvelle, detailsEnCours , detailsterminer});
            res.view('pages/dashboard', { demande: demande , tache_en_cours: tache_en_cours, messages:messages, detailsNouvelle, detailsEnCours , detailsterminer , datDebut: datd , datFin: datf});
        });  
    },

};
