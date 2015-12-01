(function () {
'use strict';

angular.module('app.competitions')
.controller('competition-edit', ['$scope', '$window', '$location', '$state', '$stateParams', '$timeout', 'api_host', 'logger', 'Competition', function($scope, $window, $location, $state, $stateParams, $timeout, api_host, logger, Competition) {

    $scope.torneo = {};

    if($stateParams.competitionId) {
        Competition.get({
            id: $stateParams.competitionId
        }, function(data) {
            $scope.torneo = data;
            $scope.setup_component();
        });

    } else {
        $scope.torneo = new Competition({
            region_id: $stateParams.regionId
        });
        $timeout(function() {
            $scope.setup_component();
        }, 1000);

    }

    $scope.canSubmit = function() {
        return $scope.torneo_form.$valid;
    };

    $scope.revert = function() {
        $scope.torneo = new Competition({});
    };

    $scope.submitForm = function() {
        if($scope.torneo.id) {
            $scope.torneo.$update(function() {
                logger.logSuccess("El torneo fue actualizado con éxito!"); 
                $state.go('competition-view', {
                    competitionId: $scope.torneo.id
                }); 
            }).catch(function(response) {
                logger.logError(response.message); 
            });
        } else {
            $scope.torneo.$save(function() {
                logger.logSuccess("El torneo fue creado con éxito!"); 
                $state.go('competition-view', {
                    competitionId: $scope.torneo.id
                }); 
            }).catch(function(response) {
                logger.logError(response.message); 
            });
        }


    };
    $scope.setup_component = function () {
        var input = document.getElementById('torneo-location'),
        options = {
            types: ['geocode'],
            componentRestrictions: {country: 'ar'}
        };
        var searchBox = new google.maps.places.Autocomplete(input, options);

        searchBox.addListener('place_changed', function() {
            var place = searchBox.getPlace();
            $scope.torneo.location = place;
        });

        jQuery('#torneo_event_date').bootstrapMaterialDatePicker({  
            format : 'DD MM YYYY HH:mm',  
            minDate : moment().subtract(3, 'years'), 
            currentDate: moment($scope.torneo.event_date),
            lang: 'es'  
        }).on('change', function(e, date) { 
            $scope.torneo.event_date = date; 
        }); 

    };



    $scope.upload_url = api_host+"/api/media/upload";
    $scope.uploading = false;

    $scope.onUpload = function(response) {
        $scope.uploading = true;
    };

    $scope.onError = function(response) {
        $scope.uploading = false;
        console.log('error');
    };

    $scope.onComplete = function(response) {
        $scope.uploading = false;
        $scope.torneo.cover_photo = response.data.filename;
    };

    /*

    $scope.onSuccess = function(response) {
        console.log('success');
        $http.get(api_host+'/api/providers/'+$scope.profile.id+'/medias').success(function(medias) {
            $scope.medias = medias;
        });
    };
    */



}])
.controller('competitions-list', ['$scope', '$http', '$state', 'api_host', 'Competition', function($scope, $http, $state, api_host, Competition) {
   
    $scope.view = function(id) {
        console.log('view '+id);
        $state.go('competition-view', {
            competitionId: id
        }); 
    };

    $scope.edit = function(id) {
        $state.go('competition-edit', {
            competitionId: id
        }); 
    };

}])
.controller('competition-view', ['$scope', '$window', 'Competition', '$location', '$state', '$stateParams', function($scope, $window, Competition, $location, $state, $stateParams) {
    $scope.competition = {};

    $scope.show_participants = true;
    $scope.participants = [];
    $scope.videos = [];
    $scope.show_videos = false;
    $scope.show_cups = false;

    console.log('competition view');

    $scope.fetchCompetition = function() {
        Competition.get({
            id: $stateParams.competitionId
        }, function(data) {
            $scope.competition = data;
            $scope.participants = data.users;
            $scope.videos = $scope.competition.videos;
            $scope.mentions = $scope.competition.mentions;
            $scope.cups = $scope.competition.cups;
        });
    };

    $scope.fetchCompetition();


    $scope.showParticipants = function() {
        console.log('click in participants');
        $scope.show_participants = true;
        $scope.show_videos = false;
        $scope.show_cups = false;
    };

    $scope.showVideos = function() {
        console.log('click in videos');
        $scope.show_participants = false;
        $scope.show_videos = true;
        $scope.show_cups = false;
    };

    $scope.showCups = function() {
        console.log('click in cups');
        $scope.show_participants = false;
        $scope.show_videos = false;
        $scope.show_cups = true;
    };

    $scope.edit = function(id) {
        $state.go('competition-edit', {
            competitionId: id
        }); 
    };



}])
.controller('competition-participants', ['$scope', '$state', function($scope, $state) {
    $scope.viewParticipant = function(id) {
        console.log('view '+id);
        $state.go('participant-view', {
            participantId: id
        }); 
    };

    $scope.addParticipant = function() {

    };

}])
.controller('competition-videos', ['$scope', '$http', '$sce', 'api_host', 'Competition', function($scope, $http, $sce, api_host, Competition) {
    $scope.videos_result = [];
    $scope.search_videos = false;
    $scope.query = '';


    console.log('competition videos');

    $scope.showSearch = function() {
        $scope.search_videos = true;
    };

    $scope.cancelSearch = function() {
        $scope.search_videos = false;
    };


    $scope.addVideo = function(video) {
        $http.post(api_host+'/api/competition/'+$scope.competition.id+'/video', {
            title: video.snippet.title,
            name: video.id.videoId,
            description: video.snippet.description,
            thumb_path: video.snippet.thumbnails.medium.url
        }).success(function(data) {
            $scope.videos = data;
            video.picked = true;
        });

    };

    $scope.search = function() {
        $http.post(api_host+'/api/media/videos/search', {
            q: $scope.query
        }).success(function(data) {
            $scope.videos_result = data;
        });

    };
    
    $scope.thumbnail = function(video) {
        var result = video.snippet.thumbnails.medium.url;
        return $sce.trustAsResourceUrl(result);
    };

}])
.controller('video-controller', ['$scope', '$http', '$sce', 'logger', 'api_host', 'Competition', function($scope, $http, $sce, logger, api_host, Competition) {

    $scope.editingParticipants = false;
    $scope.participant_selected = undefined;
    
    $scope.participants_to_add = [];

    $scope.assignParticipants = function() {
        $scope.processVideoParticipants();
        $scope.editingParticipants = true;
    };

    $scope.removeVideo = function() {
        $http.post(api_host+'/api/competition/'+$scope.competition.id+'/remove/video/'+$scope.video.id, {})
        .success(function(data) {
            $scope.video.removed = true;
            logger.logSuccess("El video fue quitado!"); 
        });
    };

    

    $scope.removeParticipant = function(participant) {
        $http.post(api_host+'/api/competition/'+$scope.competition.id+'/video/'+$scope.video.id+'/remove/participant/'+participant.id, {})
        .success(function(data) {
            $scope.video = data;
            logger.logSuccess("Participante desasignado"); 
        });
    };



    $scope.addParticipant = function() {
        $scope.editingParticipants = false;

        var participant = _.find($scope.participants, function(item) {
            return item.username = $scope.participant_selected;
        });

        $http.post(api_host+'/api/competition/'+$scope.competition.id+'/video/'+$scope.video.id+'/participant/'+participant.id, {})
        .success(function(data) {
            $scope.video = data;
            logger.logSuccess("Participante asignado"); 
        });

    };

    $scope.cancelEditing = function() {
        $scope.editingParticipants = false;
    };

    $scope.processVideoParticipants = function() {
        /*
        _.each($scope.video.participants, function(item) {
            var already_participant = _.find($scope.participants, function(subitem) {
                return item.id == subitem.id;
            });
        });
        */
        $scope.participants_to_add = _.pluck($scope.participants, 'username');
        console.dir($scope.participants_to_add);
    };
 

}])
.controller('competition-cups', ['$scope', 'logger', 'Competition', 'Cup', function($scope, logger, Competition, Cup) {

    $scope.cup = new Cup({});
    $scope.editingCup = false;

    $scope.newCup = function() {
        $scope.editingCup = true;
        $scope.cup = new Cup({
            competition_id:  $scope.competition.id
        });
    };

    $scope.editCup = function(cup) {
        $scope.cup = new Cup(cup);
        $scope.editingCup = true;
    };

    $scope.canSubmit = function() {
        return $scope.cup_form.$valid;
    };

    $scope.revert = function() {
        $scope.cup = new Cup({});
        $scope.editingCup = false;
    };

    $scope.submitForm = function() {
        if($scope.cup.id) {
            $scope.cup.$update(function() {
                logger.logSuccess("La Copa fue actualizada con éxito!"); 
                $scope.editingCup = false;
                $scope.fetchCompetition();

            }).catch(function(response) {
                logger.logError(response.message); 

            });
        } else {
            $scope.cup.$save(function() {
                logger.logSuccess("La copa fue creada con éxito!"); 
                $scope.editingCup = false;
                $scope.fetchCompetition();
            }).catch(function(response) {
                logger.logError(response.message); 
            });
        }

    };



}])
.controller('competition-mentions', ['$scope', 'logger', 'Competition', 'Mention', function($scope, logger, Competition, Mention) {
    $scope.mention = new Mention({});
    $scope.editingMention = false;

    $scope.newMention = function() {
        $scope.editingMention = true;
        $scope.mention = new Mention({
            competition_id:  $scope.competition.id
        });
    };

    $scope.editMention = function(mention) {
        $scope.mention = new Mention(mention);
        $scope.editingMention = true;
    };

    $scope.canSubmit = function() {
        return $scope.mention_form.$valid;
    };

    $scope.revert = function() {
        $scope.mention = new Mention({});
        $scope.editingMention = false;
    };

    $scope.submitForm = function() {
        if($scope.mention.id) {
            $scope.mention.$update(function() {
                logger.logSuccess("La Mención fue actualizada con éxito!"); 
                $scope.editingMention = false;
                $scope.fetchCompetition();

            }).catch(function(response) {
                logger.logError(response.message); 

            });
        } else {
            $scope.mention.$save(function() {
                logger.logSuccess("La mención fue creada con éxito!"); 
                $scope.editingMention = false;
                $scope.fetchCompetition();
            }).catch(function(response) {
                logger.logError(response.message); 
            });
        }

    };

}]);



})(); 




