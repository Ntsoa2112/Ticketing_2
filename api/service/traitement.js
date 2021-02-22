module.exports = {
    attributes: {
         
    },
    datastore : 'default',
    
    details: function(demande, tacheCours){
        var nP1 = 0, nP2 = 0, nP3 = 0, nRec = 0, nLiv = 0, n = 0;  
        function statdemande(type, demande){
            var nP1 = 0, nP2 = 0, nP3 = 0, nRec = 0, nLiv = 0, n = 0;
            for(var i = 0; i<demande.length; i++){      
                if(demande[i].etat_demande == type){
                    n = n + 1;
                    if(demande[i].priorite == "P1"){
                        nP1 = nP1 + 1;
                    }
                    else if(demande[i].priorite == "P2"){
                        nP2 = nP2 + 1;
                    }
                    else if(demande[i].priorite == "P3"){
                        nP3 = nP3 + 1;
                    }
        
                    if(demande[i].tache == "Livraison"){
                        nLiv = nLiv + 1;
                    }
                    if(demande[i].tache == "Récuperation"){
                        nRec = nRec + 1;
                    }
                }
            }
            var stat = {"nbrtache":n ,"nbrP1":nP1, "nbrP2":nP2, "nbrP3":nP3, "nbrLiv":nLiv, "nbrRec":nRec };
            return stat;
        }
    
       var nouvelle = statdemande("nouvelle", demande);
       var enCours = statdemande("En cours", tacheCours);
       var terminer = statdemande("Terminer", tacheCours);
       return {nouvelle, enCours, terminer};
      }

};