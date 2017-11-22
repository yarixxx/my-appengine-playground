'use strict';

var HelloApp = angular.module('HelloApp', ['ngMaterial', 'ngSanitize']);
HelloApp.controller('HelloCtrl', function($scope, $mdDialog, $http, $mdToast, $mdSidenav) {
  function load_items() {
    $http.get('/backend/list_items').then(function(response) {
          $scope.items = response.data.items;
      }, function(error) {
        $mdToast.show(
          $mdToast.simple()
              .textContent('Fail to load items!')
              .hideDelay(3000));
      });
  }
  load_items();

  $scope.lat = 0;
  $scope.lon = 0;

  var endpoint = "wss://jgbml2yj.api.satori.com";
  var appKey = "6Efba84ebC1628e5bcAc67BE0639BE8f";
  var channel = "SmartTrash";

  var client = new RTM(endpoint, appKey);
  client.on('enter-connected', function () {
    console.log('Connected to Satori RTM!');
  });
  client.start();

  $scope.chips = ['one', 'two', 'three'];

  $scope.showPrompt = function(ev) {
    var confirm = $mdDialog.prompt()
      .title('What would you name your dog?')
      .textContent('Bowser is a common name.')
      .placeholder('Dog name')
      .ariaLabel('Dog name')
      .initialValue('Buddy')
      .ok('Okay!')
      .cancel('I\'m a cat person');

    $mdDialog.show(confirm).then(function(result) {
      $scope.status = 'You decided to name your dog ' + result + '.';
    }, function() {
      $scope.status = 'You didn\'t name your dog.';
    });
  };

  $scope.showConfirm = function() {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete your debt?')
          .textContent('All of the banks have agreed to forgive you your debts.')
          .ariaLabel('Lucky day')
          .ok('Please do it!')
          .cancel('Sounds like a scam');

    $mdDialog.show(confirm).then(function() {
      $scope.status = 'You decided to get rid of your debt.';
    }, function() {
      $scope.status = 'You decided to keep your debt.';
    });
  };

  $scope.showMenu = function() {
    $mdSidenav('left').toggle();
  }

  $scope.createNewItemDialog = function() {
    $mdSidenav('left').toggle();
    $mdDialog.show({
      controller: CreateNewItemDialogController,
      templateUrl: '/views/createNewItemDialog.html',
      clickOutsideToClose: true
    })
    .then(function(answer) {
      $mdToast.show(
        $mdToast.simple()
            .textContent('Should be created, but status was: ' + answer)
            .hideDelay(3000));
	load_items();
    }, function() {
      $scope.status = 'The new item should not be created.';
    });
  }

  $scope.showAlert = function() {
    $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('This is an alert title')
        .textContent('You can specify some description text in here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
    );
  };

  $scope.showAdvancedDialog = function(ev) {
    $mdDialog.show({
      controller: 'CreateNewItemDialogController',
      templateUrl: '/views/dialog.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };

  $scope.contactChips = [
        {name: 'Jack', image: '//www.gravatar.com/avatar/Jack?s=30&d=retro'},
        {name: 'Jim', image: '//www.gravatar.com/avatar/Jim?s=50&d=retro'},
        {name: 'Jon', image: '//www.gravatar.com/avatar/Jon?s=70&d=retro'}];
  
  $scope.buttonClick = function() {
    console.log('Click!')
    client.publish(channel, trash, function(pdu) {
      $scope.cannotSubmit = true;
      $scope.$digest();
    });
  }

  $scope.showToast = function() {
    $mdToast.show(
      $mdToast.simple()
        .textContent('Simple Toast!')
        .hideDelay(3000)
    );
  }

  $scope.showActionToast = function() {
    var toast = $mdToast.simple()
      .textContent('Marked as read')
      .action('UNDO')
      .highlightAction(true)
      .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.

    $mdToast.show(toast).then(function(response) {
      if ( response == 'ok' ) {
        alert('You clicked the \'UNDO\' action.');
      }
    });
  }
  
  var watchID = navigator.geolocation.watchPosition(function(position) {
    if ($scope.lat != position.coords.latitude || $scope.lon != position.coords.longitude) {
      console.log('position', $scope.lat, position.coords.latitude, $scope.lon, position.coords.longitude);
      $scope.lat = position.coords.latitude;
      $scope.lon = position.coords.longitude;
      $scope.cannotSubmit = false;
      $scope.$digest();
    }
  });
}).controller('CreateNewItemDialogController', CreateNewItemDialogController);

function CreateNewItemDialogController($scope, $http, $mdDialog, $mdToast) {
    $scope.cancel = function() {
        $mdDialog.hide()
    }
    $scope.create = function() {
        $http.post('/backend/create_item', $scope.item)
            .then(function() {
                $mdDialog.hide(true)              
            }, function() {                
            	$mdDialog.hide(false)                  
            });
    }
}
