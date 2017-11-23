'use strict';

var HelloApp = angular.module('HelloApp', ['ngMaterial', 'ngSanitize']);
HelloApp.controller('HelloCtrl', function($scope, $mdDialog, $http, $mdToast, $mdSidenav) {
  function delete_item(id) {
    $http.delete('/backend/delete_item', id).then((response) => {
        $mdToast.show($mdToast.simple().textContent('Item deleted!'));
      }, (error) => {
        $mdToast.show($mdToast.simple().textContent('Fail to delete item!'));
      });
  }
  function load_items() {
    $http.get('/backend/list_items').then((response) => {
        $scope.items = response.data.items;
        $mdToast.show($mdToast.simple().textContent('Items loaded!'));
      }, (error) => {
        $mdToast.show($mdToast.simple().textContent('Fail to load items!'));
      });
  }
  load_items();

  $scope.lat = 0;
  $scope.lon = 0;

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

  $scope.deleteItem = function(id) {
    var confirm = $mdDialog.confirm()
          .title('Delete item?')
          .textContent('Are you sure you want to delete this item?')
          .ariaLabel('Delete item.')
          .ok('Delete')
          .cancel('Keep');
    $mdDialog.show(confirm).then(() => {
      delete_item(id);
      $mdToast.show($mdToast.simple().textContent('Confirmed!'));
    }, () => {
      $mdToast.show($mdToast.simple().textContent('Declined'));
    });
  }

  $scope.showMenu = function() {
    $mdSidenav('left').toggle();
  }

  $scope.createNewItemDialog = function() {
    $mdSidenav('left').toggle();
    $mdDialog.show({
      controller: CreateItemDialogController,
      templateUrl: '/views/create_item_dialog.html',
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
      controller: 'CreateItemDialogController',
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

  $scope.showActionToast = function() {
    var toast = $mdToast.simple()
      .textContent('Marked as read')
      .action('UNDO')
      .highlightAction(true);

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
}).controller('CreateItemDialogController', CreateItemDialogController);
