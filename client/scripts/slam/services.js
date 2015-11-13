(function () {
    'use strict';

angular.module('app.services', [])
.factory('Region',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/regions/:id', { id:'@id' }, {
        update: {
            method: 'PUT'
        }
    });
}])
.factory('Competition',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/competitions/:id', { id:'@id' }, {
        update: {
            method: 'PUT'
        }
    });
}])
.factory('Slider',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/sliders/:id', { id:'@id' }, {
        update: {
            method: 'PUT'
        }
    });
}])
.factory('User',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/users/:id', { id:'@id' }, {
        update: {
            method: 'PUT'
        }
    });
}])
.factory('Role',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/roles/:id', { id:'@id' }, {
        update: {
            method: 'PUT'
        }
    });
}])
.factory('Participant',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/participants/:id', { id:'@id' }, {
        update: {
            method: 'PUT'
        }
    });
}])
.factory('Account', ['$http', '$rootScope', '$auth', '$location', 'api_host', function($http, $rootScope, $auth, $location, api_host) {
    return {
        profile: false,
        profile_id: false,
        fetching: false,
        roles: [],
        regions: [],
    
        getProfile: function(callback) {
            var self = this;
            if(!$auth.isAuthenticated()) {
                if(callback) {
                    self.listen(callback);
                }
                return;
            }
            if(self.profile) {
                if(callback) {
                    callback(self.profile);
                } else {
                    return this.profile;
                }
            }
            if(!self.fetching) {
                self.fetching = true;
                return $http.get(api_host+'/api/me').success(function(data){
                    self.fetching = false;
                    if(data.user == null) {
                        $auth.logout();
                        self.profile = false;
                        self.profile_id = false;
                        $rootScope.account = false;
                        self.broadcast();
                        $location.url('/');
                     } else {
                        self.profile = data.user; 
                        self.profile_id = self.profile.id;
                        $rootScope.account = self.profile;
                        self.regions = self.profile.regions;
                        self.roles = self.profile.roles;
                        self.broadcast();
                    }
                    if(callback) {
                        callback(self.profile);
                    }

                }).catch(function(response) {
                    $auth.logout();
                    self.profile = false;
                    self.profile_id = false;
                    self.broadcast();
                });
            } else {
                self.listen(callback);
            }
            return false;
        },

        hasRole: function(role_name) {
            var result = _.find(this.roles, function(role) {
                return role.name == role_name;
            });
            return result ? true : false;
        },

        logout: function() {
            if(!$auth.isAuthenticated()) {
                return;
            }
            this.profile = false;
            this.profile_id = false;
            $auth.logout();
            $rootScope.account = false;
            this.broadcast();
            $location.url('/')
        },
        getStatus: function() {
            return $http.get(api_host+'/api/me/status');
        },
        updateProfile: function(profileData) {
            return $http.put(api_host+'/api/me', profileData);
        },
        broadcast: function() {
            $rootScope.$broadcast("account", this.profile);
        },
        listen: function(callback) {

            console.log('Account: set list for callback');
            $rootScope.$on("account", function(event, newValue, oldValue) {
                if(newValue) {
                    console.log('Account: listening calling callback');
                    callback(newValue);
                }
            });
        }
    };
}])
.factory('Icon',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/icons/:id', { id:'@id' }, {
        update: {
            method: 'POST'
        }
    });
}])
.factory('Color',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/colors/:id', { id:'@id' }, {
        update: {
            method: 'POST'
        }
    });
}])
.factory('User',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/users/:id', { id:'@id' }, {
        update: {
            method: 'POST'
        }
    });
}]);

})(); 
