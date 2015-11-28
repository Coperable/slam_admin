(function () {
    'use strict';

    angular.module('app', [
        // Angular modules
         'ngAnimate'
        ,'ngAria'
        ,'ngResource'
  
        // 3rd Party Modules
        ,'ngMaterial'
        ,'ui.router'
        ,'ui.bootstrap'
        ,'ui.tree'
        ,'ngMap'
        ,'ngTagsInput'
        ,'textAngular'
        ,'angular-loading-bar'
        ,'duScroll'
        ,'satellizer'  
        ,'lr.upload'

        // Custom module
        ,'app.nav'
        ,'app.page'
        ,'app.i18n'

        //Slam
        ,'config'
        ,'app.services'
        ,'app.account'
        ,'app.regions'
        ,'app.users'
        ,'app.sliders'
        ,'app.participants'
        ,'app.competitions'
    ]);

})();
