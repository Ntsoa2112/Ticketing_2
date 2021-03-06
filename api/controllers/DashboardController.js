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
    affichage: async function (req, res){
       var dep = req.session.categorie;
        if(!req.param('dd') && !req.param('df')){
            var dateNow = new Date().toISOString().slice(0,10);
            var parse_now = Date.parse(dateNow);
            var type = "now";       
            var allTache = await Dashboard.details_Tache( parse_now, parse_now ,type, dep);
            var demande = allTache[0];
            var tache_en_cours = allTache[1];
        }
        var resultatStat = det.details(demande, tache_en_cours);
        var detailsNouvelle = resultatStat["nouvelle"];
        var detailsEnCours = resultatStat["enCours"];
        var detailsterminer = resultatStat["terminer"];

        Message.find(function foundMessage(err, messages){
            if (err) return res.send(err);
            sails.sockets.blast("detailsTache", {detailsNouvelle, detailsEnCours , detailsterminer});
            res.view('pages/dashboard', { demande: demande , tache_en_cours: tache_en_cours, messages:messages, detailsNouvelle, detailsEnCours , detailsterminer, datDebut: "null", datFin: "null" });
        });
    },

    afficher_date: async function(req, res){
        var dep = req.session.categorie;
        if(req.param('mint') && req.param('maxt')){
            var datd = req.param('mint');
            var datf = req.param('maxt');
            var now = new Date().toISOString().slice(0,10);
            if(now == req.param('maxt')){
                type = "now";
                var df = Date.parse(new Date().toISOString().slice(0,10));
            }
            else{
                var date = new Date(req.param('maxt'));
                date.setDate(date.getDate() + 1);
                var df = Date.parse(date);
                var type = "intervale";
            }
            var datd = req.param('mint');
            var dd = Date.parse(new Date(datd).toISOString().slice(0,10));
            var allTache = await Dashboard.details_Tache( dd, df, type ,dep);
        }
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