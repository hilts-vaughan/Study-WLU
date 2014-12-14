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


.controller('AvailabilityController', function($scope, $http, $timeout, DateService, LaurierService, RoomService, ServerService) {


   // Pull in a list of rooms from our laurier service
   $scope.rooms = [];
   _.each(LaurierService.getRooms(), function(item) {
      $scope.rooms.push({name: item});
   })

  $scope.inputs = {};
  $scope.inputs.searchText = "BA20";
  $scope.inputs.selectedRoom = $scope.rooms[0];

  $scope.getResults = function() {
    $scope.pending = true;

    ServerService.getRoomsIn($scope.inputs.selectedRoom.name + " " + $scope.inputs.searchText,
    function(data) {
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
    
      $scope.timetable = RoomService.getRoomsWithFreeTime($scope.results, 30);


  };


})

.controller('SearchController', function($scope, LaurierService, ServerService, RoomService, DateService) {


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

     // Pull in a list of rooms from our laurier service
   $scope.rooms = [];
   _.each(LaurierService.getRooms(), function(item) {
      $scope.rooms.push({name: item});
   })

   $scope.inputs = {};
   $scope.inputs.selectedRoom = $scope.rooms[0];
   $scope.inputs.date = new Date();
   $scope.inputs.minutes = 60;

   $scope.runSearch = function() {

      ServerService.getRoomsInAndFilterByDay($scope.inputs.selectedRoom.name, DateService.getDateCode($scope.inputs.date), function(data) {
          
          // Got the data
          var filteredRooms = RoomService.getRoomsWithFreeTime(data, $scope.inputs.minutes);
          $scope.timetable = filteredRooms;

      });

   };


});
