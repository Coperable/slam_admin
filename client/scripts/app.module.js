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
        ,'easypiechart'
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
        ,'app.i18n'
        ,'app.chart'
        ,'app.ui'
        ,'app.ui.form'
        ,'app.ui.form.validation'
        ,'app.ui.map'
        ,'app.page'
        ,'app.table'

        //Slam
        ,'config'
        ,'app.services'
        ,'app.account'
        ,'app.regions'
        ,'app.users'
        ,'app.participants'
        ,'app.competitions'
    ]);

})();
