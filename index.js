window.APP = window.angular.module('main', []).controller('MainCtrl', function($scope) {
  $scope.state = {
    characters: {
      "Dustin Hoffman": {
        colorClass: "red",
        traits: [
          {name: "Speed",  values: [0,1,2,3,4,5,6,7,8], start: 3},
          {name: "Might",  values: [0,1,2,3,4,5,6,7,8], start: 3},
          {name: "Sanity", values: [0,1,2,3,4,5,6,7,8], start: 3},
          {name: "Knowl",  values: [0,1,2,3,4,5,6,7,8], start: 3},
        ],
      }
    },
    current: {
      character: "Dustin Hoffman",
      health: [3,3,3,3],
    },
  };
  // for iteration purposes
  $scope.traitIndexes = [0,1,2,3];
  // backwards so that they grow upward
  $scope.healthValues = [8,7,6,5,4,3,2,1,0];

  $scope.character = function() {
    return $scope.state.characters[$scope.state.current.character];
  };
  $scope.traitTable = function() {
    return $scope.character().traits;
  };
  $scope.modifyHealth = function(t, delta) {
    var healths = $scope.state.current.health;
    healths[t] = clamp(healths[t] + delta, 0, $scope.healthValues.length - 1);
  };

  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }
});

