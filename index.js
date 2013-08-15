window.APP = window.angular.module('main', []).controller('MainCtrl', function($scope) {
  $scope.state = {
    characters: {
      "Brandon Jaspers": {
        colorClass: "green",
        traits: [
          {name: "Speed",  values: [0,3,4,4,4,5,6,7,8], start: 3},
          {name: "Might",  values: [0,2,3,3,4,5,6,6,7], start: 4},
          {name: "Sanity", values: [0,3,3,3,4,5,6,7,8], start: 4},
          {name: "Knowl",  values: [0,1,3,3,5,5,6,6,7], start: 3},
        ],
      },
      "Darrin \"Flash\" Williams": {
        colorClass: "red",
        traits: [
          {name: "Speed",  values: [0,4,4,4,5,6,7,7,8], start: 5},
          {name: "Might",  values: [0,2,3,3,4,5,6,6,7], start: 3},
          {name: "Sanity", values: [0,1,2,3,4,5,5,5,7], start: 3},
          {name: "Knowl",  values: [0,2,3,3,4,5,5,5,7], start: 3},
        ],
      },
      "Father Rhinehardt": {
        colorClass: "white",
        traits: [
          {name: "Speed",  values: [0,2,3,3,4,5,6,7,7], start: 3},
          {name: "Might",  values: [0,1,2,2,4,4,5,5,7], start: 3},
          {name: "Sanity", values: [0,3,4,5,5,6,7,7,8], start: 5},
          {name: "Knowl",  values: [0,1,3,3,4,5,6,6,8], start: 4},
        ],
      },
      "Heather Granville": {
        colorClass: "purple",
        traits: [
          {name: "Speed",  values: [0,3,3,4,5,6,6,7,8], start: 3},
          {name: "Might",  values: [0,3,3,3,4,5,6,7,8], start: 3},
          {name: "Sanity", values: [0,3,3,3,4,5,6,6,6], start: 3},
          {name: "Knowl",  values: [0,2,3,3,4,5,6,7,8], start: 5},
        ],
      },
      "Jenny LeClerc": {
        colorClass: "purple",
        traits: [
          {name: "Speed",  values: [0,2,3,4,4,4,5,6,8], start: 4},
          {name: "Might",  values: [0,3,4,4,4,4,5,6,8], start: 3},
          {name: "Sanity", values: [0,1,1,2,4,4,4,5,6], start: 5},
          {name: "Knowl",  values: [0,2,3,3,4,4,5,6,8], start: 3},
        ],
      },
      "Madame Zostra": {
        colorClass: "blue",
        traits: [
          {name: "Speed",  values: [0,2,3,3,5,5,6,6,7], start: 3},
          {name: "Might",  values: [0,2,3,3,4,5,5,5,6], start: 4},
          {name: "Sanity", values: [0,4,4,4,5,6,7,8,8], start: 3},
          {name: "Knowl",  values: [0,1,3,4,4,4,5,6,6], start: 4},
        ],
      },
      "Missy Dubourde": {
        colorClass: "yellow",
        traits: [
          {name: "Speed",  values: [0,3,4,5,6,6,6,7,7], start: 3},
          {name: "Might",  values: [0,2,3,3,3,4,5,6,7], start: 4},
          {name: "Sanity", values: [0,1,2,3,4,5,5,6,7], start: 3},
          {name: "Knowl",  values: [0,2,3,4,4,5,6,6,6], start: 4},
        ],
      },
      "Ox Bellows": {
        colorClass: "red",
        traits: [
          {name: "Speed",  values: [0,2,2,2,3,4,5,5,6], start: 5},
          {name: "Might",  values: [0,4,5,5,6,6,7,8,8], start: 3},
          {name: "Sanity", values: [0,2,2,3,4,5,5,6,7], start: 3},
          {name: "Knowl",  values: [0,2,2,3,3,5,5,6,6], start: 3},
        ],
      },
      "Peter Akimoto": {
        colorClass: "green",
        traits: [
          {name: "Speed",  values: [0,3,3,3,4,6,6,7,7], start: 4},
          {name: "Might",  values: [0,2,3,3,4,5,5,6,8], start: 3},
          {name: "Sanity", values: [0,3,4,4,4,5,6,6,7], start: 4},
          {name: "Knowl",  values: [0,3,4,4,5,6,7,7,8], start: 3},
        ],
      },
      "Professor Longfellow": {
        colorClass: "white",
        traits: [
          {name: "Speed",  values: [0,2,2,4,4,5,5,6,6], start: 4},
          {name: "Might",  values: [0,1,2,3,4,5,5,6,6], start: 3},
          {name: "Sanity", values: [0,1,3,3,4,5,5,6,7], start: 3},
          {name: "Knowl",  values: [0,4,5,5,5,5,6,7,8], start: 5},
        ],
      },
      "Vivian Lopez": {
        colorClass: "blue",
        traits: [
          {name: "Speed",  values: [0,3,4,4,4,4,6,7,8], start: 4},
          {name: "Might",  values: [0,2,2,2,4,4,5,6,6], start: 3},
          {name: "Sanity", values: [0,4,4,4,5,6,7,8,8], start: 3},
          {name: "Knowl",  values: [0,4,5,5,5,5,6,6,7], start: 4},
        ],
      },
      "Zoe Ingstrom": {
        colorClass: "yellow",
        traits: [
          {name: "Speed",  values: [0,4,4,4,4,5,6,8,8], start: 4},
          {name: "Might",  values: [0,2,2,3,3,4,4,6,7], start: 4},
          {name: "Sanity", values: [0,3,4,5,5,6,6,7,8], start: 3},
          {name: "Knowl",  values: [0,1,2,3,4,4,5,5,5], start: 3},
        ],
      },
    },
    current: {
      character: "",
      health: [],
    },
  };
  // for iteration purposes
  $scope.traitIndexes = [0,1,2,3];
  // backwards so that they grow upward
  $scope.healthValues = [8,7,6,5,4,3,2,1,0];

  $scope.$watch("state.current.character", initHealth);

  $scope.character = function() {
    return $scope.state.characters[$scope.state.current.character] || {};
  };
  $scope.traitTable = function() {
    return $scope.character().traits || [];
  };
  $scope.modifyHealth = function(t, delta) {
    var healths = $scope.state.current.health;
    var value = healths[t];
    if (value == null) value = $scope.character().traits[t].start;
    healths[t] = clamp(value + delta, 0, $scope.healthValues.length - 1);
  };
  $scope.cellClass = function(t, h) {
    if (!$scope.state.current.character) return "";
    var styles = [];
    if ($scope.traitTable()[t].start === h) styles.push("starting");
    if ($scope.state.current.health[t] === h) styles.push("current");
    return styles.join(" ");
  };
  function initHealth() {
    if (!$scope.state.current.character) return;
    for (var t = 0; t < $scope.traitIndexes.length; t++) {
      $scope.state.current.health[t] = $scope.character().traits[t].start;
    }
  }

  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }
});

