window.APP = window.angular.module('main', []).controller('MainCtrl', function($scope) {
  // for debugging
  window._scope = $scope;

  $scope.characters = window.Betrayal.characters;

  // state is what's persisted in localStorage
  resetState();
  function resetState() {
    $scope.state = {
      explorers: [],
      currentTurnIndex: -1,
      selectTraitIndex: -1,
      eventDeck: shuffled(window.Betrayal.events),
      itemDeck: shuffled(Object.keys(window.Betrayal.items)),
      omenDeck: shuffled(Object.keys(window.Betrayal.omens)),
      bigBarValue: -1, // which means hidden
      showDiceRollBar: false,
    };
  }

  // for iteration purposes
  $scope.traitIndexes = [0,1,2,3];
  // backwards so that they grow upward
  $scope.healthValues = [8,7,6,5,4,3,2,1,0];

  $scope.bigBarValues = [0,1,2,3,4,5,6,7,8,9,10,11,12];

  // same order as traits
  $scope.upgradeRooms = ["Gymnasium", "Larder", "Chapel", "Library"];
  var traitList = ["Speed", "Might", "Sanity", "Knowl"];

  $scope.explorerClass = function(explorer) {
    return explorer === $scope.state.explorers[$scope.state.currentTurnIndex] ? "currentTurn" : "";
  };
  $scope.onCharacterSelect = function(explorer) {
    if (explorer.character) {
      // a character is selected. initialize all the values.
      initExplorer(explorer);
    }
    fixupExplorerList();
    saveState();
  };
  function initExplorer(explorer) {
    explorer.health = [];
    explorer.traitUpgraded = [];
    for (var t = 0; t < $scope.traitIndexes.length; t++) {
      explorer.health[t] = $scope.character(explorer).traits[t].start || 0;
      explorer.traitUpgraded[t] = false;
    }
    explorer.inventory = [];
  }

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
    // toggle upgraded state
    explorer.traitUpgraded[t] = !explorer.traitUpgraded[t];
    // increment/decrement stat
    var delta = explorer.traitUpgraded[t] ? 1 : -1;
    modifyHealthAndClamp(explorer, t, delta);
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
    modifyHealthAndClamp(explorer, t, delta);
    saveState();
  };
  function modifyHealthAndClamp(explorer, t, delta) {
    var healths = explorer.health;
    healths[t] = clamp(healths[t] + delta, 0, window.Infinity);
  }
  $scope.traitCellClass = function(explorer, t, h) {
    if (!explorer.character) return "";
    var classes = [];
    if(clampHealth(explorer.health[t]) === h) {
      classes.push("current");
      classes.push("special");
      if ($scope.traitTable(explorer)[t].start === h) {
        classes.push("starting");
      }
    } else if ($scope.traitTable(explorer)[t].start === h) {
      classes.push("starting");
    } else {
      if(("" + $scope.traitTable(explorer)[t].values[h]) === "0") {
        classes.push("skull");
      } else {
        classes.push($scope.character(explorer).colorClass);
      }
      classes.push("cell");
    }
    return classes.join(" ");
  };
  $scope.traitButtonClass = function(explorer, t) {
    if ($scope.state.explorers[$scope.state.currentTurnIndex] !== explorer) return "";
    if ($scope.state.selectTraitIndex !== t) return "";
    return "selectedTrait";
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
    if (value === "0") {
      if ($scope.character(explorer).colorClass === "monster") {
        // 0 means not applicable
        value = "-";
      } else {
        // 0 means death. use a unicode skull.
        value = String.fromCharCode(0x2620);
      }
    }
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
  $scope.drawEvent = function(explorer) {
    var name = $scope.state.eventDeck.pop();
    saveState();
    alert(name);
  };
  $scope.drawItem = function(explorer) {
    drawKeepCard(explorer, "Item");
  };
  $scope.drawOmen = function(explorer) {
    drawKeepCard(explorer, "Omen");
  };
  function drawKeepCard(explorer, type) {
    var cards = Object.keys(getDeckInfo(type));
    cards.sort();
    $scope.getCardDialog = {
      type: type,
      cards: cards,
      drawTopCard: function() {
        var name = getCardDeck(type).pop();
        gainSpecificCard(name);
      },
      specificCard: "",
      getSpecificCard: function() {
        var name = $scope.getCardDialog.specificCard;
        if (getDeckInfo(type)[name] == null) return;
        var deck = getCardDeck(type);
        var index = deck.indexOf(name);
        if (index !== -1) {
          deck.splice(index, 1);
          // otherwise, we're duplicating it. whatever.
        }
        gainSpecificCard(name);
      },
    };

    showThisDialog("getCardDialog");

    function gainSpecificCard(name) {
      var item = { name: name, type: type };
      gainItem(explorer, item);
      closeDialog();
      saveState();
    }
  }
  $scope.discard = function(explorer, item) {
    loseItem(explorer, item);
    saveState();
  };
  function gainItem(explorer, item) {
    explorer.inventory.push(item);
    var cardInfo = getCardInfo(item);
    if (cardInfo.onGain != null) {
      for (var trait in cardInfo.onGain) {
        var delta = cardInfo.onGain[trait];
        var t = traitList.indexOf(trait);
        modifyHealthAndClamp(explorer, t, delta);
      }
    }
  }
  function loseItem(explorer, item) {
    var index = explorer.inventory.indexOf(item);
    explorer.inventory.splice(index, 1);
    var cardInfo = getCardInfo(item);
    if (cardInfo.onLose != null) {
      for (var trait in cardInfo.onLose) {
        var delta = cardInfo.onLose[trait];
        var t = traitList.indexOf(trait);
        modifyHealthAndClamp(explorer, t, delta);
      }
    }
  }
  function getCardInfo(card) {
    return getDeckInfo(card.type)[card.name];
  }
  function getDeckInfo(type) {
    switch (type) {
      case "Item": return window.Betrayal.items;
      case "Omen": return window.Betrayal.omens;
    }
    throw new Error();
  }
  function getCardDeck(type) {
    switch (type) {
      case "Item": return $scope.state.itemDeck;
      case "Omen": return $scope.state.omenDeck;
    }
    throw new Error();
  }

  $scope.eventDeckDisplay = function() {
    return $scope.state.eventDeck.length + "/" + window.Betrayal.events.length;
  };
  $scope.itemDeckDisplay = function() {
    return $scope.state.itemDeck.length + "/" + Object.keys(window.Betrayal.items).length;
  };
  $scope.omenDeckDisplay = function() {
    return $scope.state.omenDeck.length + "/" + Object.keys(window.Betrayal.omens).length;
  };
  $scope.itemClass = function(item) {
    return item.type;
  }

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
    var classes = ["monospace"];
    if (i === $scope.state.bigBarValue) classes.push("current");
    return classes.join(" ");
  };
  $scope.bigBarCell = function(i) {
    var nbsp = String.fromCharCode(0xa0);
    if (i === $scope.state.bigBarValue) {
      return nbsp + "[" + i + "]" + nbsp;
    } else {
      return nbsp + " " + i + " " + nbsp;
    }
  };

  $scope.showDialog = null;
  function showThisDialog(dialogId) {
    var document = window.document;
    var modalMaskDiv = getElementById("modalMask");
    $scope.showDialog = dialogId;
    var modalDialogDiv = getElementById(dialogId);
    modalDialogDiv.style.top = Math.floor(document.body.offsetHeight / 10) + "px";
    modalDialogDiv.style.left = Math.floor(document.body.offsetWidth / 10) + "px";
  }
  document.addEventListener("keydown", documentKeyListener);
  function documentKeyListener(event) {
    switch (event.keyCode) {
      case 27: // Escape
        if (closeDialog()) break;
        if ($scope.state.selectTraitIndex !== -1) $scope.state.selectTraitIndex = -1;
        else $scope.state.currentTurnIndex = -1;
        break;
      case 32: // Space
        if ($scope.showDialog != null) return;
        if ($scope.state.selectTraitIndex !== -1) {
          $scope.showDiceRollerForTrait($scope.state.explorers[$scope.state.currentTurnIndex], $scope.state.selectTraitIndex);
          $scope.state.selectTraitIndex = -1;
          break;
        }
        var playerCount = $scope.state.explorers.length - 1;
        if (playerCount !== 0) {
          $scope.state.currentTurnIndex = ($scope.state.currentTurnIndex + 1) % playerCount;
        } else {
          $scope.state.currentTurnIndex = -1;
        }
        break;

      case "D".charCodeAt(0):
        $scope.showDiceRoller(6);
        break;
      // numbers above qwerty. numpad.
      case "1".charCodeAt(0): case 97:  $scope.showDiceRoller(1); break;
      case "2".charCodeAt(0): case 98:  $scope.showDiceRoller(2); break;
      case "3".charCodeAt(0): case 99:  $scope.showDiceRoller(3); break;
      case "4".charCodeAt(0): case 100: $scope.showDiceRoller(4); break;
      case "5".charCodeAt(0): case 101: $scope.showDiceRoller(5); break;
      case "6".charCodeAt(0): case 102: $scope.showDiceRoller(6); break;
      case "7".charCodeAt(0): case 103: $scope.showDiceRoller(7); break;
      case "8".charCodeAt(0): case 104: $scope.showDiceRoller(8); break;

      case 37: // Left
        var delta = -1;
      case 39: // Right
        if (delta == null) delta = 1;
        if ($scope.showDialog === "diceRollerDialog") {
          $scope.modifyDice(delta);
        } else if ($scope.showDialog == null) {
          // select trait
          $scope.state.selectTraitIndex = clamp($scope.state.selectTraitIndex + delta, 0, 3);
        }
        break;

      case 40: // Down
        var delta = -1;
      case 38: // Up
        if (delta == null) delta = 1;
        if ($scope.showDialog === "diceRollerDialog") {
          $scope.modifyDice(delta);
        } else if ($scope.showDialog == null) {
          if ($scope.state.selectTraitIndex !== -1) {
            // modify trait
            $scope.modifyHealth($scope.state.explorers[$scope.state.currentTurnIndex], $scope.state.selectTraitIndex, delta);
          }
        }
        break;

      default:
        return;
    }
    event.preventDefault();
    saveState();
    $scope.$apply();
  }
  function closeDialog() {
    if ($scope.showDialog != null) {
      $scope.showDialog = null;
      return true;
    }
    return false;
  }

  $scope.dice = [];
  $scope.diceTotal = "";
  $scope.reroll = [];
  $scope.showDiceRollerForTrait = function(explorer, t) {
    var traitValue = $scope.traitTable(explorer)[t].values[clampHealth(explorer.health[t])];
    $scope.showDiceRoller(traitValue);
  };
  $scope.showDiceRoller = function(traitValue) {
    showThisDialog("diceRollerDialog");

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
    $scope.reroll = [];
    for (var i = 0; i < numberOfDice; i++) {
      $scope.dice.push("?");
      $scope.reroll.push(false);
    }
    $scope.diceTotal = "?";
  }
  $scope.dieClass = function(i) {
    return $scope.reroll[i] ? "reroll" : "";
  };
  $scope.selectDieForRerolling = function(i) {
    // don't toggle unrolled dice
    if (isNaN(parseInt($scope.dice[i], 10))) return;
    $scope.reroll[i] = !$scope.reroll[i];
  };
  function rerollCount() {
    var count = 0;
    for (var i = 0; i < $scope.dice.length; i++) {
      if ($scope.reroll[i]) count++;
    }
    return count;
  }
  $scope.rollButtonTitle = function () {
    var count = rerollCount();
    if (count === 0) return "Roll";
    return "Reroll " + count + " Dice";
  };
  $scope.rollDice = function() {
    var rollAll = rerollCount() === 0;
    var total = 0;
    var value;
    for (var i = 0; i < $scope.dice.length; i++) {
      if (rollAll || $scope.reroll[i]) {
        $scope.dice[i] = Math.floor(Math.random() * 3);
        $scope.reroll[i] = false;
      }
      total += $scope.dice[i];
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

  $scope.newGameFullRandom = function() {
    if (!window.confirm("Reset everything and start a random game?")) return;
    resetState();
    var colorToCharacters = {};
    for (var name in window.Betrayal.characters) {
      var color = window.Betrayal.characters[name].colorClass;
      if (color === "monster") continue;
      if (colorToCharacters[color] == null) colorToCharacters[color] = [];
      colorToCharacters[color].push(name);
    }
    var colors = shuffled(Object.keys(colorToCharacters));
    var playerCount = 3 + Math.floor(Math.random() * 4);
    for (var i = 0; i < playerCount; i++) {
      var name = colorToCharacters[colors[i]][Math.floor(Math.random() * 2)];
      var explorer = {character: name};
      initExplorer(explorer);
      $scope.state.explorers.push(explorer);
    }
    $scope.state.currentTurnIndex = Math.floor(Math.random() * playerCount);
    fixupExplorerList();
    saveState();
  }

  loadState();
  fixupExplorerList();
});

function getElementById(id) {
  return window.document.getElementById(id);
}
function maybeClearState() {
  if (!window.confirm("Reset everything?")) return;
  delete localStorage.betrayalState;
  // refresh page
  window.location.href = window.location.href;
}
function shuffled(array) {
  array = array.slice(0);
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    if (i === j) continue;
    var tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
  return array;
}
