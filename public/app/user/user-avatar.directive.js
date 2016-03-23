angular
  .module('mage')
  .directive('avatarUser', avatarUser);

function avatarUser() {
  var directive = {
    restrict: "A",
    templateUrl: '/app/user/user-avatar.directive.html',
    scope: {
      user: '=avatarUser',
      avatarWidth: '=?',
      avatarHeight: '=?'
    },
    controller: AvatarUserController,
    bindToController: true
  };

  return directive;
}

AvatarUserController.$inject = ['$scope', '$element', 'LocalStorageService'];

function AvatarUserController($scope, $element, LocalStorageService) {
  if (!$scope.avatarWidth) $scope.avatarWidth = 60;
  if (!$scope.avatarHeight) $scope.avatarHeight = 60;

  $scope.avatar = avatarUrl($scope.user);

  $scope.$watch('user.avatarUrl', function(url) {
    if (!url || $scope.user.avatarData) return;

    $scope.avatar = avatarUrl($scope.user);
  });

  $scope.$watch('user.avatarData', function(avatarData) {
    if (!avatarData) return;

    $scope.avatar = avatarData;
  });

  function avatarUrl(user) {
    if (user && user.avatarUrl) {
      return user.avatarUrl + "?access_token=" + LocalStorageService.getToken() + '&_dc=' + user.lastUpdated;
    } else {
      return "img/missing_photo.png";
    }
  }
}
