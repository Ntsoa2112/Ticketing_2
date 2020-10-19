/**
 * FakeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    create: function(req, res){
        Fake.create(req.allParams(), function fakeCreated(err){
            if(err) return res.send("Erreur:" + err);
            return res.redirect('/fake');
        } );
    },

};

