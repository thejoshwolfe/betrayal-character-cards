window.APP = window.angular.module('main', []).controller('MainCtrl', function($scope) {
  $scope.characters = {
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
  };
  // state is what's persisted in localStorage
  $scope.state = {
    explorers: [
      { character: null, health: [], },
    ],
    bigBarValue: -1, // which means hidden
  };

  // for iteration purposes
  $scope.traitIndexes = [0,1,2,3];
  // backwards so that they grow upward
  $scope.healthValues = [8,7,6,5,4,3,2,1,0];
  $scope.bigBarValues = [0,1,2,3,4,5,6,7,8,9,10,11,12];

  $scope.onCharacterSelect = function(explorer) {
    if (explorer.character) {
      // a character is selected. initialize health to starting values.
      for (var t = 0; t < $scope.traitIndexes.length; t++) {
        explorer.health[t] = $scope.character(explorer).traits[t].start;
      }
    } else {
      // no character selected
      explorer.health = [];
    }
    fixupExplorerList();
    saveState();
  };

  $scope.character = function(explorer) {
    return $scope.characters[explorer.character] || {};
  };
  $scope.traitTable = function(explorer) {
    return $scope.character(explorer).traits || [];
  };
  $scope.modifyHealth = function(explorer, t, delta) {
    var healths = explorer.health;
    var value = healths[t];
    if (value == null) value = $scope.character(explorer).traits[t].start;
    healths[t] = clamp(value + delta, 0, $scope.healthValues.length - 1);
    saveState();
  };
  $scope.cellClass = function(explorer, t, h) {
    if (!explorer.character) return "";
    var styles = [];
    if ($scope.traitTable(explorer)[t].start === h) styles.push("starting");
    if (explorer.health[t] === h) styles.push("current");
    return styles.join(" ");
  };

  $scope.modifyBigBar = function(delta) {
    $scope.state.bigBarValue = clamp($scope.state.bigBarValue + delta, 0, 12);
    saveState();
  };

  $scope.showHideBigBar = function() {
    var newValue = getElementById("showBigBar").checked;
    $scope.state.bigBarValue = newValue ? 0 : -1;
    saveState();
  };

  $scope.bigBarClass = function(i) {
    var styles = ["monospace"];
    if (i === $scope.state.bigBarValue) styles.push("current");
    return styles.join(" ");
  };
  $scope.bigBarCell = function(i) {
    var nbsp = String.fromCharCode(0xa0);
    if (i === $scope.state.bigBarValue) {
      return nbsp + "[" + i + "]" + nbsp;
    } else {
      return nbsp + " " + i + " " + nbsp;
    }
  };

  $scope.maybeClearState = function() {
    if (!window.confirm("Reset to default state?")) return;
    delete localStorage.betrayalState;
    // refresh page
    window.location.href = window.location.href;
  };

  loadState();
  fixupExplorerList();

  function saveState() {
    localStorage.betrayalState = window.angular.toJson($scope.state);
  }
  function loadState() {
    var cachedState = localStorage.betrayalState;
    if (cachedState) $scope.state = window.angular.fromJson(cachedState);
  }
  function fixupExplorerList() {
    var explorers = $scope.state.explorers;
    if (explorers[explorers.length - 1].character) {
      // add a blank one to the end
      explorers.push({ character: null, health: [] });
    } else {
      // reduce duplicate blanks from the end
      for (var i = explorers.length - 2; i >= 0; i--) {
        if (explorers[i].character) break;
        // another blank. delete the last one.
        // keep the earlier blank one in existence so that keboard focus doesn't disappear.
        explorers.splice(i + 1, 1);
      }
    }
  }

  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }
  function getElementById(id) {
    return window.document.getElementById(id);
  }
});

