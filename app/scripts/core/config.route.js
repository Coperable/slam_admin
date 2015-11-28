(function () {
    'use strict';


    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', '$authProvider', 'api_host', function($stateProvider, $urlRouterProvider, $authProvider, api_host) {
            var routes, setRoutes;

            routes = [
                'slam/regions/list',
                'slam/sliders/list',
                'slam/users/list',
                'slam/participants/list',
                'slam/users/edit',

            ];

            setRoutes = function(route) {
                var config, url;
                url = '/' + route;
                config = {
                    url: url,
                    templateUrl: 'views/' + route + '.html',
                    resolve: {
                        loginRequired: loginRequired
                    }

                };
                $stateProvider.state(route, config);

                return $stateProvider;
            };

            routes.forEach(function(route) {
                return setRoutes(route);
            });


            $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/slam/account/signin.html',
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn
                }
            })
            .state('home', {
                url: '/',
                templateUrl: 'views/dashboard.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('region-view', {
                url: '/region-view/:regionId',
                templateUrl: 'views/slam/regions/view.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('user-view', {
                url: '/user-view/:userId',
                templateUrl: 'views/slam/users/view.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('participant-view', {
                url: '/participant-view/:userId',
                templateUrl: 'views/slam/participants/view.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('region-new', {
                url: '/region-new',
                templateUrl: 'views/slam/regions/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('region-edit', {
                url: '/region-edit/:regionId',
                templateUrl: 'views/slam/regions/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('slider-new', {
                url: '/slider-new',
                templateUrl: 'views/slam/sliders/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('slider-edit', {
                url: '/slider-edit/:sliderId',
                templateUrl: 'views/slam/sliders/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('participant-new', {
                url: '/participant-new',
                templateUrl: 'views/slam/participants/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('participant-edit', {
                url: '/participant-edit/:participantId',
                templateUrl: 'views/slam/participants/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('competition-new', {
                url: '/competition-new/:regionId',
                templateUrl: 'views/slam/competitions/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('competition-edit', {
                url: '/competition-edit/:competitionId',
                templateUrl: 'views/slam/competitions/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('competition-view', {
                url: '/competition-view/:competitionId',
                templateUrl: 'views/slam/competitions/view.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('signin', {
                url: '/signup',
                templateUrl: 'views/slam/account/signup.html',
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn
                }
            });

            $urlRouterProvider
                //.when('/', '/dashboard')
                .otherwise('/login');

            function skipIfLoggedIn($q, $auth) {
                var deferred = $q.defer();
                if ($auth.isAuthenticated()) {
                    deferred.reject();
                } else {
                    deferred.resolve();
                }
                return deferred.promise;
            }

            function loginRequired($q, $location, $auth) {
                var deferred = $q.defer();
                if ($auth.isAuthenticated()) {
                    deferred.resolve();
                } else {
                    $location.path('/login');
                }
                return deferred.promise;
            }

            //Satellizer
            $authProvider.baseUrl = api_host+'/';
            $authProvider.httpInterceptor = true;
            $authProvider.signupRedirect = null;

        

        }]
    );

})(); 
