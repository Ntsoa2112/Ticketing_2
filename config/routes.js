/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/:notif?': { view: 'login_register/login' },

  '/creer_compte': { view: 'login_register/creer_compte' },

  'post /creer_compte' : 'UserController.create',

  '/dashboard/:dd?/:df?' : 'DashboardController.affichage',

  'post /dashboard/': 'DashboardController.afficher_date',

  'post /login' : 'userController.login',

  '/logout' : 'userController.logout',

  '/demander_a_trans' : { view: 'demande/demander_a_trans'},

  'post /demander_a_trans' : 'demandeController.demande_a_trans',

  'post /fake' : 'fakeController.create',

  'get /valide_form_demande/:id_demande': 'demandeController.get_form_demande',

  'get /valide_form_demande/form_demande/:id_demande': 'demandeController.prendre_demande',

  '/valide_form_terminer/:id_demande': 'demandeController.valider_form_terminer',

  'post /valide_form_terminer/terminer_tache/:id_tache/:id_demande': 'demandeController.tache_terminer',

  'get /valider_stand_by/:id_demande/:id_tache/:stand' : 'demandeController.valider_form_terminer',

  'post /valider_stand_by/:id_demande/:id_tache/standBy/:id_tache/:id_demande' : 'demandeController.stand_by',

  '/tache_continuer/:id_demande/:id_tache' : 'demandeController.continuer_tache',

  '/contenu/:id_demande' : 'demandeController.afficher_contenu',

  '/message_vue/:matricule_dest' : 'demandeController.message_vue',

  '/exporter_xl' : 'exporterController.exportation',

  'get /mdp_oublier' : { view: 'login_register/mdpoublier' },

  'post /mdp_oublier' : 'UserController.mdp_oublier',

  '/admin/:matricule' : 'UserController.valider_admin',

  '/modif_categorie' : { view: 'login_register/modif_categorie' },

  'post /new_categorie' : 'UserController.modif_categorie'



  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
