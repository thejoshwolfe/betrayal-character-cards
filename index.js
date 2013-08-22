window.APP = window.angular.module('main', []).controller('MainCtrl', function($scope) {
  // for debugging
  window._scope = $scope;

  $scope.characters = window.Betrayal.characters;

  // state is what's persisted in localStorage
  $scope.state = {
    explorers: [],
    bigBarValue: -1, // which means hidden
    itIsMeantToBe: null,
  };

  // for iteration purposes
  $scope.traitIndexes = [0,1,2,3];
  // backwards so that they grow upward
  $scope.healthValues = [8,7,6,5,4,3,2,1,0];

  $scope.bigBarValues = [0,1,2,3,4,5,6,7,8,9,10,11,12];

  // same order as traits
  $scope.upgradeRooms = ["Gymnasium", "Larder", "Chapel", "Library"];

  $scope.onCharacterSelect = function(explorer) {
    if (explorer.character) {
      // a character is selected. initialize all the values.
      explorer.health = [];
      explorer.traitUpgraded = [];
      for (var t = 0; t < $scope.traitIndexes.length; t++) {
        explorer.health[t] = $scope.character(explorer).traits[t].start || 0;
        explorer.traitUpgraded[t] = false;
      }
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
  $scope.traitColumnTitle = function(explorer, t) {
    if (!explorer.character) return "";
    if (!explorer.traitUpgraded[t]) {
      return "Click when upgraded at the " + $scope.upgradeRooms[t];
    } else {
      return "Upgraded at the " + $scope.upgradeRooms[t];
    }
  };
  $scope.onTraitColumnClick = function(explorer, t) {
    explorer.traitUpgraded[t] = !explorer.traitUpgraded[t];
    saveState();
  };
  var upArrow = String.fromCharCode(0x2191);
  $scope.traitColumnText = function(explorer, t) {
    if (!explorer.character) return "";
    var result = $scope.traitTable(explorer)[t].name;
    if (explorer.traitUpgraded[t]) result = result + upArrow;
    return result;
  };
  $scope.modifyHealth = function(explorer, t, delta) {
    var healths = explorer.health;
    var value = healths[t];
    healths[t] = clamp(value + delta, 0, window.Infinity);
    saveState();
  };
  $scope.traitCellClass = function(explorer, t, h) {
    if (!explorer.character) return "";
    var styles = [];
    if ($scope.traitTable(explorer)[t].start === h) styles.push("starting");
    if (clampHealth(explorer.health[t]) === h) styles.push("current");
    return styles.join(" ");
  };
  $scope.traitCellTitle = function(explorer, t) {
    if (!explorer.character) return "";
    var trait = $scope.traitTable(explorer)[t];
    var traitName = $scope.traitTable(explorer)[t].name;
    var traitValue = trait.values[clampHealth(explorer.health[t])];
    return "Open Dice Roller for " + trait.name + " " + traitValue;
  };
  $scope.traitCell = function(explorer, t, h) {
    if (!explorer.character) return "";
    var value = "" + $scope.traitTable(explorer)[t].values[h];
    var currentHealth = explorer.health[t];
    if (currentHealth === h) {
      value = "[ " + value + " ]";
    } else if (clampHealth(currentHealth) === h) {
      // overflow health
      var overflow = currentHealth - h;
      value = "[" + value + "]+" + overflow;
    }
    return value;
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

  $scope.showDialog = false;
  $scope.dice = [];
  $scope.diceTotal = "";
  $scope.showDiceRoller = function(explorer, t) {
    var document = window.document;
    var modalMaskDiv = getElementById("modalMask");
    $scope.showDialog = true;
    document.addEventListener("keydown", documentKeyListener);
    function closeDialog() {
      document.removeEventListener("keydown", documentKeyListener);
      $scope.showDialog = false;
    }
    function documentKeyListener(event) {
      // escape
      if (event.keyCode !== 27) return;
      closeDialog();
      $scope.$apply();
    }
    var modalDialogDiv = getElementById("modalDialog");
    modalDialogDiv.style.top = Math.floor(document.height / 10) + "px";
    modalDialogDiv.style.left = Math.floor(document.width / 10) + "px";

    var traitValue = $scope.traitTable(explorer)[t].values[clampHealth(explorer.health[t])];
    setNumberOfDice(traitValue);

    window.setTimeout(function() {
      getElementById("rollButton").focus();
    });
  };
  $scope.modifyDice = function(delta) {
    setNumberOfDice($scope.dice.length + delta);
  };
  function setNumberOfDice(numberOfDice) {
    $scope.dice = [];
    for (var i = 0; i < numberOfDice; i++) {
      $scope.dice.push("?");
    }
    $scope.diceTotal = "?";
  }
  $scope.rollDice = function() {
    var total = 0;
    var value;
    for (var i = 0; i < $scope.dice.length; i++) {
      value = Math.floor(Math.random() * 3);
      $scope.dice[i] = value;
      total += value;
    }
    $scope.diceTotal = total;
  };

  $scope.saveState = saveState;
  function saveState() {
    localStorage.betrayalState = window.angular.toJson($scope.state);
  }
  function loadState() {
    var cachedState = localStorage.betrayalState;
    if (cachedState) $scope.state = window.angular.fromJson(cachedState);
  }
  function fixupExplorerList() {
    var explorers = $scope.state.explorers;
    if (explorers.length === 0 || explorers[explorers.length - 1].character) {
      // add a dummy object to the end. this becomes the -- select character -- control.
      explorers.push({});
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

  function clampHealth(h) {
    return clamp(h, 0, $scope.healthValues.length - 1);
  }

  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }
  function getElementById(id) {
    return window.document.getElementById(id);
  }

  loadState();
  fixupExplorerList();
});

function maybeClearState() {
  if (!window.confirm("Reset to default state?")) return;
  delete localStorage.betrayalState;
  // refresh page
  window.location.href = window.location.href;
}
