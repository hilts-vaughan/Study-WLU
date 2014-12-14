angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('AvailabilityController', function($scope, $http, $timeout, DateService) {

 // Setup our selector data

 $scope.rooms = [
      {name:'Bricker Academic Building'},
      {name: 'Dr. Alvin Woods Building'},
      {name: 'Science Building'},
      {name: 'Arts Building'}
  ];


  $scope.inputs = {};
  $scope.inputs.searchText = "N3028";
  $scope.inputs.selectedRoom = $scope.rooms[2];

  $scope.getResults = function() {
    $scope.pending = true;
    $http.get('http://localhost:1337/courses?building=' + $scope.inputs.selectedRoom.name + " " + $scope.inputs.searchText).
      success(function(data, status, headers, config) {
        $scope.results = data;

        // Wait a few seconds until it can re-appear
        
        $timeout(function() {
          $scope.pending = false;
        }, 500);
        
        // Attempt to process the results in some sort of reasonable manner
        $scope.processResults();

      });

  };

  $scope.getDifference = function(start, end) {

    if(!end) {
      return "until closing";
    }

    var delta = new Date(new Date(end) - new Date(start));
    console.log(delta);
    var seconds = delta.getTime() / 1000;
    hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    minutes = Math.floor(seconds / 60);

    return "for " + hours + " hours, " + minutes + " minutes";

  }

  $scope.clearText = function() {
    $scope.inputs.searchText = "";
  }

  $scope.processResults = function() {

      if($scope.results.length == 0) {
        $scope.timetable = [];
        $scope.error = "That room does not seem to be valid.";
        return;
      }
        

    // Remove all mondays
    $scope.results = _.reject($scope.results, function(course) { 
        return course.days.indexOf(DateService.getDateCode()) == -1; 
    });


      if($scope.results.length == 0) {
        $scope.timetable = [];
        $scope.error = "It seems there's no classes in this room today. Free all day!";
        return;
      }
    
    // Filtered by day, how about grouping?
    var grouped = _.groupBy($scope.results, 'building');


    $scope.results.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.times[0]) - new Date(b.times[0]);
    });

    console.log($scope.results);

    // Now that we're all sorted, we can find the largest streaks in which we're free
    var currentStreakIndex = 0;
    var timetable = [];

    var firstDate = new Date($scope.results[0].times[0]);
    var morningDate = new Date(firstDate.getTime());

    morningDate.setSeconds(0);
    morningDate.setHours(8);
    morningDate.setMinutes(30);

    var firstDelta = (firstDate - morningDate);

    if(firstDelta > 1000 * 60 * 30) {
      var entry = {
        start: morningDate.toISOString(),
        end: firstDate
      }

      timetable.push(entry);
    }

    for(var i = 0; i < $scope.results.length - 1; i++) {

      var course = $scope.results[i];
      var nextCourse = $scope.results[i + 1];

      // We get the amount of time that has ended since
      var endDelta = (new Date(nextCourse.times[0]) - new Date(course.times[1]) );

      // Next up, check if the gap is large enough
      if(endDelta > 1000 * 60 * 15) {

        var entry = {
          start: course.times[1],
          end: nextCourse.times[0]
        }

        timetable.push(entry);
      }
    }

    // Of course, there's also a section from the last course to the end of the day
    var entry = {
      start: $scope.results[$scope.results.length - 1].times[1],
      end: null
    }

    timetable.push(entry);

    console.log(timetable);
    $scope.timetable = timetable;


  };


})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
