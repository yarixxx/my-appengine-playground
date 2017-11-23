function CreateItemDialogController($scope, $http, $mdDialog, $mdToast) {
  $scope.cancel = function() {
    $mdDialog.hide();
  }
  $scope.create = function() {
    $http.post('/backend/create_item', $scope.item).then(() => {
      $mdDialog.hide(true);              
    }, () => {                
      $mdDialog.hide(false);                  
    });
  }
}
