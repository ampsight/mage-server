'use strict';

mage.directive('awesomeMarkerIcon', function (AwesomeMarkerIconService) {
  return {
    restrict: "A",
    template: AwesomeMarkerIconService.template,
    scope: {
    	feature:'=awesomeMarkerIcon',
      types:'='
    },
    controller: function($scope, appConstants) {
    	$scope.$watch('feature.properties.TYPE', function(type) {
        if (!type) return;

        var properties = $scope.feature.properties;
        $scope.markerCl***REMOVED*** = "icon-" + AwesomeMarkerIconService.getCl***REMOVED***(properties.TYPE, {types: $scope.types});
    	});

      $scope.$watch('feature.properties.EVENTDATE', function(timestamp) {
        if (!timestamp) return;
        $scope.markerColor = "awesome-marker-icon-" + appConstants.featureToColor($scope.feature);
      });
    }
  };
});