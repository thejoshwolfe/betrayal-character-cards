window.APP = window.angular.module('main', []).controller('MainCtrl', function($scope) {
  $scope.state = {
    characters: {
      "Martin Luther": {
        colorClass: "blue",
        traits: [
          {name: "Speed",  values: [0,2,2,3,5,5,6,7,8], start: 3},
          {name: "Might",  values: [0,1,2,3,5,5,6,7,8], start: 3},
          {name: "Sanity", values: [0,2,2,3,4,5,6,7,8], start: 2},
          {name: "Knowl",  values: [0,1,2,3,4,5,7,7,7], start: 4},
        ],
      },
      "Dustin Hoffman": {
        colorClass: "red",
        traits: [
          {name: "Speed",  values: [0,1,2,3,4,5,6,7,8], start: 3},
          {name: "Might",  values: [0,1,2,3,4,5,6,7,8], start: 3},
          {name: "Sanity", values: [0,1,2,3,4,5,6,7,8], start: 3},
          {name: "Knowl",  values: [0,1,2,3,4,5,6,7,8], start: 3},
        ],
      },
    },
    current: {
      character: null, // initialized in a moment...
      health: [],
    },
  };
  $scope.characterOptions = function() { return Object.keys($scope.state.characters); };
  $scope.state.current.character = $scope.characterOptions()[0];
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
    var value = healths[t];
    if (value == null) value = $scope.character().traits[t].start;
    healths[t] = clamp(value + delta, 0, $scope.healthValues.length - 1);
  };
  $scope.cellClass = function(t, h) {
    var styles = [];
    if ($scope.traitTable()[t].start === h) styles.push("starting");
    if ($scope.state.current.health[t] === h) styles.push("current");
    return styles.join(" ");
  }

  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }
});

