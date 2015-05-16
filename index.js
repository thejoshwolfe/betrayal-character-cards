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
      eventDeck: shuffled(Object.keys(window.Betrayal.events)),
      itemDeck: shuffled(Object.keys(window.Betrayal.items)),
      omenDeck: shuffled(Object.keys(window.Betrayal.omens)),
      bigBarValue: -1, // which means hidden
      showDiceRollBar: false,
    };
    getElementById("outstandingActionItems").innerHTML = "";
  }

  // for iteration purposes
  $scope.traitIndexes = [0,1,2,3];
  // backwards so that they grow upward
  $scope.healthValues = [8,7,6,5,4,3,2,1,0];

  $scope.bigBarValues = [0,1,2,3,4,5,6,7,8,9,10,11,12];

  // same order as traits
  $scope.upgradeRooms = ["Gymnasium", "Larder", "Chapel", "Library"];
  var traitList = ["Speed", "Might", "Sanity", "Knowl"];
  var SPEED = 0;
  var MIGHT = 1;
  var SANITY = 2;
  var KNOWL = 3;

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
    drawKeepCard(explorer, "Event");
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
    window.setTimeout(function() {
      document.getElementById("drawTopCardButton").focus();
    }, 0);

    function gainSpecificCard(name) {
      var item = { name: name, type: type };
      if (shouldKeepCard(item)) {
        gainItem(explorer, item);
      }
      closeDialog();
      saveState();

      var doItFunction = getDoCardFunction(item);
      var doItButtonName = "Do It";
      if (doItFunction === closeDialog) doItButtonName = "OK";
      if (doItFunction == null) {
        doItButtonName = "Do It Yourself";
        doItFunction = function() {
          writeActionItem(getCardInfo(item).summary);
          closeDialog();
        };
      }
      $scope.doCardDialog = {
        name: name,
        summary: getCardInfo(item).summary,
        doItName: doItButtonName,
        doIt: function() {
          doItFunction(item);
          $scope.doCardDialog.doItName = "OK";
          $scope.doCardDialog.doIt = closeDialog;
          saveState();
        },
        discard: function() {
          $scope.discard(explorer, item);
          closeDialog();
        },
        keep: function() {
          if (!shouldKeepCard(item)) {
            gainItem(explorer, item);
            saveState();
          }
          closeDialog();
        },
      };
      getElementById("doStuffLog").innerHTML = "";
      getElementById("outstandingActionItems").innerHTML = "";
      showThisDialog("doCardDialog");
      setTimeout(function() {
        getElementById("doItButton").focus();
      }, 0);
    }
  }
  function writeToDoStuffLog(html) {
    var node = document.createElement("li");
    node.innerHTML = html;
    getElementById("doStuffLog").appendChild(node);
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
    if (index === -1) return;
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
      case "Event": return window.Betrayal.events;
      case "Item": return window.Betrayal.items;
      case "Omen": return window.Betrayal.omens;
    }
    throw new Error();
  }
  function getCardDeck(type) {
    switch (type) {
      case "Event": return $scope.state.eventDeck;
      case "Item": return $scope.state.itemDeck;
      case "Omen": return $scope.state.omenDeck;
    }
    throw new Error();
  }
  function shouldKeepCard(card) {
    if (card.type !== "Event") return true;
    switch (card.name) {
      case "Debris":
      case "Grave Dirt":
      case "It is Meant to Be":
      case "Lights Out":
      case "Webs":
        return true;
    }
    return false;
  }
  function getDoCardFunction(card) {
    var explorer = $scope.state.explorers[$scope.state.currentTurnIndex];
    switch (card.name) {
      case "Book":
      case "Crystal Ball":
      case "Dog":
      case "Girl":
      case "Holy Symbol":
      case "Madman":
      case "Mask":
      case "Medallion":
      case "Ring":
      case "Skull":
      case "Spear":
      case "Spirit Board":
        return doHauntRoll;
      case "Bite":
        return function() {
          doAnonymousMight4Attack(explorer);
          doHauntRoll();
        };

      case "Adrenaline Shot":
      case "Amulet of the Ages":
      case "Angel Feather":
      case "Armor":
      case "Axe":
      case "Bell":
      case "Blood Dagger":
      case "Bottle":
      case "Candle":
      case "Dark Dice":
      case "Dynamite":
      case "Healing Salve":
      case "Idol":
      case "Lucky Stone":
      case "Medical Kit":
      case "Music Box":
      case "Pickpocket's Gloves":
      case "Puzzle Box":
      case "Rabbit's Foot":
      case "Revolver":
      case "Sacrificial Dagger":
      case "Smelling Salts":
        return closeDialog;

      case "A Moment of Hope":
        return closeDialog;
      case "Angry Being":
        return function() {
          var result = traitRollAndLog(explorer, SPEED);
          if (result >= 5) {
            modifyHealthAndLog(explorer, SPEED, 1);
          } else if (result >= 2) {
            logDiceOfDamage(explorer, "Physical", 1);
          } else {
            logDiceOfDamage(explorer, "Physical", 1);
            logDiceOfDamage(explorer, "Mental", 1);
          }
        };
      case "Burning Man":                return null;
      case "Bloody Vision":              return null;
      case "Closet Door":                return null;
      case "Creepy Crawlies":
        return function() {
          var result = traitRollAndLog(explorer, SANITY);
          if (result >= 5) {
            modifyHealthAndLog(explorer, SANITY, 1);
          } else if (result >= 1) {
            modifyHealthAndLog(explorer, SANITY, -1);
          } else {
            modifyHealthAndLog(explorer, SANITY, -2);
          }
        };
      case "Creepy Puppet":              return null;
      case "Debris":                     return null;
      case "Disquieting Sounds":
        return function() {
          var result = rollDice(6);
          var omenCount = getOmenCount();
          var renderedOmenCount = formatOmenCount(omenCount);
          writeToDoStuffLog("Roll 6d vs " + renderedOmenCount + ": " + result);
          if (result >= omenCount) {
            modifyHealthAndLog(explorer, SANITY, 1);
          } else {
            logDiceOfDamage(explorer, "Mental", 1);
          }
        };
      case "Drip ... Drip ... Drip ...":
        return closeDialog;
      case "Footsteps":                  return null;
      case "Funeral":                    return null;
      case "Grave Dirt":                 return null;
      case "Groundskeeper":
        return function() {
          if (traitRollAndLog(explorer, KNOWL) >= 4) {
            gainItemAndLog(explorer);
          } else {
            doAnonymousMight4Attack(explorer);
          }
        };
      case "Hanged Men":
        return function() {
          var allPass = true;
          for (var t = 0; t < traitList.length; t++) {
            var result = traitRollAndLog(explorer, t);
            if (result < 2) {
              modifyHealthAndLog(explorer, t, -1);
              allPass = false;
            }
          }
          if (allPass) {
            writeActionItem("Gain 1 in a trait of your choice");
          }
        };
      case "Hideous Shriek":
        return function() {
          var playerCount = $scope.state.explorers.length - 1;
          for (var i = 0; i < playerCount; i++) {
            var explorer = $scope.state.explorers[i];
            writeToDoStuffLog(formatExplorer(explorer) + ":");
            var result = traitRollAndLog(explorer, SANITY);
            if (result >= 4) {
              logNothingHappens();
            } else if (result >= 1) {
              logDiceOfDamage(explorer, "Mental", 1);
            } else {
              logDiceOfDamage(explorer, "Mental", 2);
            }
          }
        };
      case "Image in the Mirror (give)":
        return function() {
          var didAnything = false;
          var playerCount = $scope.state.explorers.length - 1;
          for (var i = 0; i < playerCount; i++) {
            var explorer = $scope.state.explorers[($scope.state.currentTurnIndex + i) % playerCount];
            var items = getItemsInInventory(explorer);
            if (items.length === 0) continue;
            var item = items[Math.floor(Math.random() * items.length)];
            loseItem(explorer, item);
            writeToDoStuffLog(formatExplorer(explorer) + " puts an Item back: " + item.name);
            var deck = $scope.state.itemDeck;
            deck.push(item.name);
            writeToDoStuffLog("Shuffle the Item deck");
            $scope.state.itemDeck = shuffled(deck);
            didAnything = true;
            modifyHealthAndLog(explorer, KNOWL, 1);
            break;
          }
          if (!didAnything) {
            logNothingHappens();
          }
        };
      case "Image in the Mirror (take)":
        return function() {
          gainItemAndLog(explorer);
        };
      case "It is Meant to Be":          return null;
      case "Jonah's Turn":
        return function() {
          var playerCount = $scope.state.explorers.length - 1;
          for (var i = 0; i < playerCount; i++) {
            var otherExplorer = $scope.state.explorers[($scope.state.currentTurnIndex + i) % playerCount];
            var items = getItemsInInventory(otherExplorer);
            var puzzleBoxes = items.filter(function(item) { return item.name === "Puzzle Box"; });
            if (puzzleBoxes.length === 0) continue;
            loseItem(otherExplorer, puzzleBoxes[0]);
            writeToDoStuffLog(formatExplorer(otherExplorer) + " loses the Puzzle Box");
            gainItemAndLog(otherExplorer);
            modifyHealthAndLog(explorer, SANITY, 1);
            return;
          }
          logDiceOfDamage(explorer, "Mental", 1);
        };
      case "Lights Out":
        return closeDialog;
      case "Locked Safe":                return null;
      case "Mists from the Walls":       return null;
      case "Mystic Slide":               return null;
      case "Night View":
        return function() {
          if (traitRollAndLog(explorer, KNOWL) >= 5) {
            modifyHealthAndLog(explorer, KNOWL, 1);
          } else {
            logNothingHappens();
          }
        };
      case "Phone Call":
        return function() {
          var result = rollDice(2);
          writeToDoStuffLog("Roll 2d: " + result);
          if (result >= 4) {
            modifyHealthAndLog(explorer, SANITY, 1);
          } else if (result >= 3) {
            modifyHealthAndLog(explorer, KNOWL, 1);
          } else if (result >= 1) {
            logDiceOfDamage(explorer, "Mental", 1);
          } else {
            logDiceOfDamage(explorer, "Physical", 2);
          }
        };
      case "Possession":                 return null;
      case "Revolving Wall":
        return closeDialog;
      case "Rotten":                     return null;
      case "Secret Passage":             return null;
      case "Secret Stairs":              return null;
      case "Shrieking Wind":             return null;
      case "Silence":                    return null;
      case "Skeletons":                  return null;
      case "Smoke":
        return closeDialog;
      case "Something Hidden":
        return function() {
          if (traitRollAndLog(explorer, KNOWL) >= 4) {
            gainItemAndLog(explorer);
          } else {
            modifyHealthAndLog(explorer, SANITY, -1);
          }
        };
      case "Something Slimy":
        return function() {
          var result = traitRollAndLog(explorer, SPEED);
          if (result >= 4) {
            modifyHealthAndLog(explorer, SPEED, 1);
          } else if (result >= 1) {
            modifyHealthAndLog(explorer, MIGHT, -1);
          } else {
            modifyHealthAndLog(explorer, MIGHT, -1);
            modifyHealthAndLog(explorer, SPEED, -1);
          }
        };
      case "Spider":
        return function() {
          // whichever is better, and prefer sanity.
          var trait = getTraitValue(explorer, SANITY) < getTraitValue(explorer, SPEED) ? SPEED : SANITY;
          var result = traitRollAndLog(explorer, trait);
          if (result >= 4) {
            modifyHealthAndLog(explorer, trait, 1);
          } else if (result >= 1) {
            logDiceOfDamage(explorer, "Physical", 1);
          } else {
            logDiceOfDamage(explorer, "Physical", 2);
          }
        };
      case "The Beckoning":              return null;
      case "The Lost One":
        return function() {
          if (traitRollAndLog(explorer, KNOWL) >= 5) {
            modifyHealthAndLog(explorer, KNOWL, 1);
          } else {
            var total = rollDice(3);
            writeToDoStuffLog("Roll 3: " + total);
            if (total >= 6) {
              writeActionItem("Move to Entrance Hall");
            } else if (total >= 4) {
              writeActionItem("Move to Upper Landing");
            } else if (total >= 2) {
              writeActionItem("Move to a new Upper Floor room");
            } else {
              writeActionItem("Move to a new Basement room");
            }
          }
        };
      case "The Voice":                  return null;
      case "The Walls":
        return null;
      case "Webs":
        return function(item) {
          if (traitRollAndLog(explorer, MIGHT) >= 4) {
            modifyHealthAndLog(explorer, MIGHT, 1);
            $scope.discard(explorer, item);
          } else {
            writeActionItem(formatExplorer(explorer) + " is caught in webs");
          }
        };
      case "What the...?":
        return null;
      case "Whoops!":
        return function() {
          var items = getItemsInInventory(explorer);
          if (items.length === 0) {
            logNothingHappens();
          } else {
            var item = items[Math.floor(Math.random() * items.length)];
            loseItem(explorer, item);
            writeToDoStuffLog(formatExplorer(explorer) + " loses a random Item: " + item.name);
          }
        };
    }
    throw new Error();
  }

  function logNothingHappens() {
    writeToDoStuffLog("Nothing happens.");
  }
  function rollDice(diceCount) {
    var total = 0;
    for (var i = 0; i < diceCount; i++) {
      total += Math.floor(Math.random() * 3);
    }
    return total;
  }
  function traitRollAndLog(explorer, t) {
    var traitValue = getTraitValue(explorer, t);
    var total = rollDice(traitValue);
    writeToDoStuffLog(traitList[t] + " Roll (" + traitValue + "d): " + total);
    return total;
  }
  function modifyHealthAndLog(explorer, t, delta) {
    $scope.modifyHealth(explorer, t, delta);
    var gainsLoses = delta < 0 ? "loses" : "gains";
    writeToDoStuffLog(formatExplorer(explorer) + " " + gainsLoses + " " + Math.abs(delta) + " " + traitList[t]);
  }
  function logDiceOfDamage(explorer, mentalOrPhysical, diceCount) {
    var total = rollDice(diceCount);
    logDamage(explorer, mentalOrPhysical, total);
  }
  function logDamage(explorer, mentalOrPhysical, damage) {
    var renderedPoints = damage + " point" + (damage === 1 ? "" : "s");
    var html = formatExplorer(explorer) + " takes " + renderedPoints + " of " + mentalOrPhysical + " damage";
    if (damage !== 0) {
      writeActionItem(html);
    } else {
      writeToDoStuffLog(html);
    }
  }
  function gainItemAndLog(explorer) {
    var name = getCardDeck("Item").pop();
    gainItem(explorer, {type:"Item", name:name});
    writeToDoStuffLog(formatExplorer(explorer) + " gains an Item: " + name);
  }
  function getOmenCount() {
    return 13 - getCardDeck("Omen").length;
  }
  function formatOmenCount(omenCount) {
    return omenCount + " Omen" + (omenCount === 1 ? "" : "s");
  }
  function doHauntRoll() {
    var omenCount = getOmenCount();
    var renderedOmenCount = formatOmenCount(omenCount);
    var result = rollDice(6);
    writeToDoStuffLog("Haunt Roll (6d) with " + renderedOmenCount + ": " + result);
    if (result >= omenCount) {
      logNothingHappens();
    } else {
      writeActionItem("The Haunt is revealed!");
    }
  }
  function doAnonymousMight4Attack(explorer) {
    var attackDice = 4;
    var attackPower = rollDice(attackDice);
    writeToDoStuffLog("Might " + attackDice + " attack: " + attackPower);
    var defenseDice = getTraitValue(explorer, MIGHT);
    var defensePower = rollDice(defenseDice);
    writeToDoStuffLog("Might " + defenseDice + " defense: " + defensePower);
    var damage = attackPower - defensePower;
    if (damage > 0) {
      logDamage(explorer, "Physical", damage);
    } else {
      logNothingHappens();
    }
  }
  function writeActionItem(html) {
    html = '<span class="actionItem">' + html + '</span>';
    writeToDoStuffLog(html);
    var node = document.createElement("li");
    node.innerHTML = html;
    getElementById("outstandingActionItems").appendChild(node);
  }
  function formatExplorer(explorer) {
    var color = window.Betrayal.characters[explorer.character].colorClass;
    return '<span class="' + color + '">' + explorer.character + '</span>';
  }
  function getItemsInInventory(explorer) {
    return explorer.inventory.filter(function(card) {
      return card.type === "Item";
    });
  }

  $scope.eventDeckDisplay = function() {
    return $scope.state.eventDeck.length + "/" + Object.keys(window.Betrayal.events).length;
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

    // also, this selection shouldn't persist through any dialog opening.
    $scope.state.selectTraitIndex = -1;
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
          break;
        }
        var playerCount = $scope.state.explorers.length - 1;
        if (playerCount !== 0) {
          $scope.state.currentTurnIndex = ($scope.state.currentTurnIndex + 1) % playerCount;
        } else {
          $scope.state.currentTurnIndex = -1;
        }
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
        } else if ($scope.showDialog == null && $scope.state.currentTurnIndex !== -1) {
          // select trait
          if ($scope.state.selectTraitIndex === -1) {
            // from blank, select middle two
            $scope.state.selectTraitIndex = 1.5 + delta / 2;
          } else {
            $scope.state.selectTraitIndex = clamp($scope.state.selectTraitIndex + delta, 0, 3);
          }
        } else return;
        break;

      case 40: // Down
        var delta = -1;
      case 38: // Up
        if (delta == null) delta = 1;
        if ($scope.showDialog === "diceRollerDialog") {
          $scope.modifyDice(delta);
        } else if ($scope.showDialog == null && $scope.state.currentTurnIndex !== -1) {
          if ($scope.state.selectTraitIndex !== -1) {
            // modify trait
            $scope.modifyHealth($scope.state.explorers[$scope.state.currentTurnIndex], $scope.state.selectTraitIndex, delta);
          }
        } else return;
        break;

      case "P".charCodeAt(0):
        var traitIndex = 0;
      case "M".charCodeAt(0):
        if (traitIndex == null) traitIndex = 1;
      case "A".charCodeAt(0):
        if (traitIndex == null) traitIndex = 2;
      case "K".charCodeAt(0):
        if (traitIndex == null) traitIndex = 3;
        if ($scope.showDialog == null && $scope.state.currentTurnIndex !== -1) {
          // select trait
          $scope.state.selectTraitIndex = traitIndex;
        } else return;
        break;

      case "E".charCodeAt(0):
        var cardType = "Event";
      case "I".charCodeAt(0):
        if (cardType == null) cardType = "Item";
      case "O".charCodeAt(0):
        if (cardType == null) cardType = "Omen";
        if ($scope.showDialog == null && $scope.state.currentTurnIndex !== -1) {
          drawKeepCard($scope.state.explorers[$scope.state.currentTurnIndex], cardType);
        } else return;
        break;

      case "D".charCodeAt(0):
        if ($scope.showDialog == null) {
          $scope.showDiceRoller(6);
        } else return;
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
  function getTraitValue(explorer, t) {
    return $scope.traitTable(explorer)[t].values[clampHealth(explorer.health[t])];
  }
  $scope.showDiceRollerForTrait = function(explorer, t) {
    var traitValue = getTraitValue(explorer, t);
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
