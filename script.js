var collapsibles = document.getElementsByClassName("collapsible");
for (var i = 0; i < collapsibles.length; i++) {
  if(collapsibles[i].nextElementSibling.id == null) {
    continue;
  }
  var stored = localStorage.getItem(collapsibles[i].nextElementSibling.id);
  if (stored != null) {
    collapsibles[i].classList = stored;
    var content = collapsibles[i].nextElementSibling;
    if (collapsibles[i].classList.contains("active")) {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  }
  collapsibles[i].addEventListener("click", function () {
    this.classList.toggle("active");
    localStorage.setItem(this.nextElementSibling.id, this.classList);
    var content = this.nextElementSibling;
    if (this.classList.contains("active")) {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  });
}

var tankInputs = [];
var tankLevelInputs = document.getElementsByClassName("tankLevel");
tankInputs.push(...tankLevelInputs);
var tankReceivedInputs = document.getElementsByClassName("received");
tankInputs.push(...tankReceivedInputs);
for (var i = 0; i < tankInputs.length; i++) {
  tankInputs[i].onclick = function () {
    // highlight all when clicked
    //this.select();
  };
  tankInputs[i].oninput = function () {
    var groupElement = this.parentElement.parentElement.parentElement
      .parentElement.parentElement;
    calculateGroup(groupElement);
  };
}

function calculateGroup(groupElement) {
  var previousTotal = parseInt(
    groupElement.getElementsByClassName("previousDayTotal")[0].innerHTML
  );
  if (isNaN(previousTotal)) previousTotal = 0;
  if (groupElement.id == "shaft") {
    calculateShaft(groupElement, previousTotal);
  } else {
    for (
      var i = 1;
      i < groupElement.children[1].children[0].children.length;
      i++
    ) {
      previousTotal = calculateRow(
        groupElement.children[1].children[0].children[i],
        previousTotal
      );
    }
  }
}

function calculateRow(rowElement, previousTotal) {
  var tankLevelElements = rowElement.getElementsByClassName("tankLevel");
  var subtotalElement = rowElement.getElementsByClassName("subtotal");
  var receivedElement = rowElement.getElementsByClassName("received");
  var usedElement = rowElement.getElementsByClassName("used");
  var subtotal = 0;
  var allNaN = true;
  for (var i = 0; i < tankLevelElements.length; i++) {
    var level = parseInt(tankLevelElements[i].value);
    if (isNaN(level)) {
      level = 0;
    } else {
      allNaN = false;
    }
    subtotal += level;
  }
  if (allNaN == true) {
    subtotalElement[0].innerHTML = "";
    usedElement[0].innerHTML = "";
    return 0;
  }
  subtotalElement[0].innerHTML = subtotal;
  var received = parseInt(receivedElement[0].value);
  if (isNaN(received)) received = 0;
  var used = previousTotal - (subtotal - received);
  usedElement[0].innerHTML = used;
  return subtotal;
}

function calculateShaft(groupElement, previousTotal) {
  var todayShaftCounter = parseInt(
    groupElement.getElementsByClassName("todayShaftCounter")[0].value
  );
  if (isNaN(todayShaftCounter)) todayShaftCounter = 0;
  var totalRevolutions = todayShaftCounter - previousTotal;
  var totalRevolutionsElement = groupElement.getElementsByClassName(
    "totalRevolutions"
  )[0];
  totalRevolutionsElement.innerHTML = totalRevolutions;
}

function handleTime(element) {
  var inputVal = parseInt(element.value);
  if (isNaN(inputVal)) inputVal = 0;
  if (inputVal < 0) inputVal = 0;
  if (inputVal > 2359) inputVal = 2359;
  var inputValString = ("000" + inputVal).slice(-4);
  var h = inputValString.substring(0, 2);
  var hInt = parseInt(h);
  var m = inputValString.substring(2, 4);
  var mInt = parseInt(m);
  if (mInt < 0) mInt = 0;
  if (mInt > 59) mInt = 59;
  var target = new Date(1970, 1, 1, hInt, mInt);
  return target;
}

function handleTransferInput(element) {
  var parentTransfer = findAncestor(element, "content");
  calculateTransfer(parentTransfer);
}

function handleCheckButton(checkButton) {
  var checkmarkGroupContainer =
    checkButton.parentElement.parentElement.parentElement;
  var checkButtons = checkmarkGroupContainer.getElementsByTagName("input");
  if (checkButton.checked == true) {
    for (var i = 0; i < checkButtons.length; i++) {
      if (checkButtons[i] != checkButton) {
        checkButtons[i].checked = false;
      }
    }
  }
  handleTransferInput(checkButton);
}

function selectText(element) {
  if (document.selection) {
    // IE
    var range1 = document.body.createTextRange();
    range1.moveToElementText(element);
    range1.select();
  } else if (window.getSelection) {
    var range2 = document.createRange();
    range2.selectNode(element);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range2);
  }
}

function getTankInfo(tankName) {
  var name = "";
  var type = "";
  var max = 0;
  var tank6_134_1_max = 19263;
  var tank6_134_2_max = 18501;
  var tank8_123_1_max = 13459;
  var tank8_123_2_max = 13459;
  var tank7_134_1_max = 43766;
  var tank7_134_2_max = 43766;
  var tank8_127_1_max = 23768;
  var tank8_127_2_max = 23759;
  if (tankName == "6-134-1") {
    name = tankName;
    type = "Fuel";
    max = tank6_134_1_max;
  }
  if (tankName == "6-134-2") {
    name = tankName;
    type = "Fuel";
    max = tank6_134_2_max;
  }
  if (tankName == "8-123-1") {
    name = tankName;
    type = "Potable";
    max = tank8_123_1_max;
  }
  if (tankName == "8-123-2") {
    name = tankName;
    type = "Potable";
    max = tank8_123_2_max;
  }
  if (tankName == "7-134-1") {
    name = tankName;
    type = "Potable";
    max = tank7_134_1_max;
  }
  if (tankName == "7-134-2") {
    name = tankName;
    type = "Potable";
    max = tank7_134_2_max;
  }
  if (tankName == "8-127-1") {
    name = tankName;
    type = "Feedwater";
    max = tank8_127_1_max;
  }
  if (tankName == "8-127-2") {
    name = tankName;
    type = "Feedwater";
    max = tank8_127_2_max;
  }
  return [name, type, max];
}

function findAncestor(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function calculateTransfer(transfer) {
  var transferParentId = transfer.parentElement.id;
  var suctionTimeElement = transfer.getElementsByClassName("suctionTime")[0];
  var suctionLevelElement = transfer.getElementsByClassName("suctionLevel")[0];
  var suctionFromCheckboxes = transfer.children[0].children[3].children[0].getElementsByTagName(
    "input"
  );
  var selectedSuctionFromTankElement;
  for (var a = 0; a < suctionFromCheckboxes.length; a++) {
    if (suctionFromCheckboxes[a].checked) {
      selectedSuctionFromTankElement = suctionFromCheckboxes[a];
      break;
    }
  }

  var suctionTankFromName = "";
  var suctionTankFromType = "";
  var suctionTankFromMax = 0;
  if (selectedSuctionFromTankElement != null) {
    var suctionTankFromInfo = getTankInfo(selectedSuctionFromTankElement.value);
    suctionTankFromName = suctionTankFromInfo[0];
    suctionTankFromType = suctionTankFromInfo[1];
    suctionTankFromMax = suctionTankFromInfo[2];
  }
  var suctionToCheckboxes = transfer.children[0].children[3].children[1].getElementsByTagName(
    "input"
  );
  var selectedSuctionToTankElement;
  for (var b = 0; b < suctionToCheckboxes.length; b++) {
    if (suctionToCheckboxes[b].checked) {
      selectedSuctionToTankElement = suctionToCheckboxes[b];
      break;
    }
  }
  var suctionTankToName = "";
  var suctionTankToType = "";
  var suctionTankToMax = 0;
  if (selectedSuctionToTankElement != null) {
    var suctionTankToInfo = getTankInfo(selectedSuctionToTankElement.value);
    suctionTankToName = suctionTankToInfo[0];
    suctionTankToType = suctionTankToInfo[1];
    suctionTankToMax = suctionTankToInfo[2];
  }
  var suctionTime = handleTime(suctionTimeElement);
  var suctionLevel = parseInt(suctionLevelElement.value);
  if (isNaN(suctionLevel)) suctionLevel = 0;

  var fillTimeElement = transfer.getElementsByClassName("fillTime")[0];
  var fillLevelElement = transfer.getElementsByClassName("fillLevel")[0];
  var fillCheckboxes = transfer.children[0].children[4].children[0].getElementsByTagName(
    "input"
  );
  var selectedFillTankElement;
  for (var c = 0; c < fillCheckboxes.length; c++) {
    if (fillCheckboxes[c].checked) {
      selectedFillTankElement = fillCheckboxes[c];
      break;
    }
  }

  var fillTankName = "";
  var fillTankType = "";
  var fillTankMax = 0;
  if (selectedFillTankElement != null) {
    var fillTankInfo = getTankInfo(selectedFillTankElement.value);
    fillTankName = fillTankInfo[0];
    fillTankType = fillTankInfo[1];
    fillTankMax = fillTankInfo[2];
  }
  var fillTime = handleTime(fillTimeElement);
  var fillLevel = parseInt(fillLevelElement.value);
  if (isNaN(fillLevel)) fillLevel = 0;
  
  var estimatesElement = transfer.children[0].children[5].children[0];
  var estimatesNonEditBoxes = estimatesElement.getElementsByClassName(
    "nonEditBox"
  );
  var previousFlowRate = 0;
  var estimatesFlowRateElement = estimatesElement.getElementsByClassName(
    "estimatesFlowRate"
  )[0];
  var storedPreviousFlowRate = localStorage.getItem("previousFlowRate");
  if (storedPreviousFlowRate != null) {
    estimatesFlowRateElement.placeholder = storedPreviousFlowRate;
  }
  previousFlowRate = parseFloat(estimatesFlowRateElement.value);
  if (isNaN(previousFlowRate))
    previousFlowRate = parseFloat(estimatesFlowRateElement.placeholder);

  var estimatesLevelPercentElement = estimatesElement.getElementsByClassName(
    "estimatesLevelPercent"
  )[0];
  var estimatesLevelPercent = parseInt(estimatesLevelPercentElement.value);
  if (isNaN(estimatesLevelPercent)) estimatesLevelPercent = 90;
  estimatesLevelPercent /= 100;
  var estimatesLevel = fillTankMax * estimatesLevelPercent;
  var estimatesDuration = (estimatesLevel - fillLevel) / previousFlowRate;
  if (estimatesLevel == 0 || previousFlowRate == 0) {
    estimatesDuration = 0;
  }
  var estimatesTime = addMinutes(fillTime, estimatesDuration);
  var estimatesTimeString = "".concat(
    ("0" + estimatesTime.getHours()).slice(-2),
    ("0" + estimatesTime.getMinutes()).slice(-2)
  );
  if (isNaN(estimatesDuration)) estimatesDuration = 0;
  estimatesNonEditBoxes[0].innerHTML = Math.round(estimatesDuration);
  estimatesNonEditBoxes[1].innerHTML = estimatesTimeString;
  estimatesNonEditBoxes[2].innerHTML = "?";

  var finalTimeElement = transfer.getElementsByClassName("finalTime")[0];
  var finalLevelElement = transfer.getElementsByClassName("finalLevel")[0];
  var finalTime = handleTime(finalTimeElement);
  var finalLevel = parseInt(finalLevelElement.value);
  if (isNaN(finalLevel)) finalLevel = 0;

  if (
    isNaN(parseInt(finalTimeElement.value)) == false &&
    isNaN(parseInt(finalLevelElement.value)) == false
  ) {
    if (finalTime < fillTime) {
      finalTime.setDate(2);
    }
    var transferDuration = (finalTime.getTime() - fillTime.getTime()) / 1000;
    transferDuration /= 60;
    transferDuration = Math.abs(Math.round(transferDuration));
    var transferDurationHours = transferDuration/60;

    var amountTransferred = finalLevel - fillLevel;
    var flowRate = amountTransferred / transferDuration;
    if (amountTransferred == 0 || transferDuration == 0) {
      flowRate = 0;
    }
    if (isNaN(flowRate)) flowRate = 0;

    var finishElement = transfer.children[0].children[5].children[1];
    var finishNonEditBoxes = finishElement.getElementsByClassName("nonEditBox");

    finishNonEditBoxes[0].innerHTML = transferDuration;
    finishNonEditBoxes[1].innerHTML = transferDurationHours.toFixed(1);
    finishNonEditBoxes[2].innerHTML = flowRate.toFixed(1);
    finishNonEditBoxes[3].innerHTML = amountTransferred;
    localStorage.setItem("previousFlowRate", flowRate.toFixed(1));
  }

  /*
  var suctionTimeText = "".concat(
    ("0" + suctionTime.getHours()).slice(-2),
    ("0" + suctionTime.getMinutes()).slice(-2)
  );
  var fillTimeText = "".concat(
    ("0" + fillTime.getHours()).slice(-2),
    ("0" + fillTime.getMinutes()).slice(-2)
  );
  var finalTimeText = "".concat(
    ("0" + finalTime.getHours()).slice(-2),
    ("0" + finalTime.getMinutes()).slice(-2)
  );
  */
  
  var suctionTimeText = "".concat(("0" + suctionTime.getHours()).slice(-2), ("0" + suctionTime.getMinutes()).slice(-2));
  var fillTimeText = "".concat(("0" + fillTime.getHours()).slice(-2), ("0" + fillTime.getMinutes()).slice(-2));
  var startLogTime = "";
  var commenceLogTime = "";
  var finishLogTime = "".concat(("0" + finalTime.getHours()).slice(-2), ("0" + finalTime.getMinutes()).slice(-2), " - ");
  if((suctionTimeText == fillTimeText) || (isNaN(parseInt(suctionTimeElement.value)) == false && isNaN(parseInt(fillTimeElement.value)))){
    startLogTime = suctionTimeText;
  }else if(isNaN(parseInt(suctionTimeElement.value)) && isNaN(parseInt(fillTimeElement.value)) == false){
    startLogTime = startLogTime.concat(fillTimeText);
  }else {
    startLogTime = startLogTime.concat(suctionTimeText);
    commenceLogTime = commenceLogTime.concat("<br>", fillTimeText, " -");
  }
  var startLogText = "";
  var commenceLogText = "";
  var finishLogText = "";
  if(selectedSuctionFromTankElement != null || selectedSuctionToTankElement != null){
    startLogText = startLogText.concat(startLogTime, " - ", "Shifted ");
    if(selectedSuctionFromTankElement != null && selectedSuctionToTankElement != null){
      startLogText = startLogText.concat(suctionTankFromType, " ", "suction", " ", "from", " ", suctionTankFromName, " to ", suctionTankToName);
      if(!isNaN(parseInt(suctionLevelElement.value))){
        startLogText = startLogText.concat(" (", suctionLevel, " gal)");
      }
    }else if(selectedSuctionFromTankElement != null){
      startLogText = startLogText.concat(suctionTankFromType, " suction from ", suctionTankFromName);
    }else if(selectedSuctionToTankElement != null){
      startLogText = startLogText.concat(suctionTankToType, " suction to ", suctionTankToName);
      if(!isNaN(parseInt(suctionLevelElement.value))){
        startLogText = startLogText.concat(" (", suctionLevel, " gal)");
      }
    }
    startLogText = startLogText.concat(".");
  }
  if(selectedFillTankElement != null) {
    commenceLogText = commenceLogText.concat(commenceLogTime, " Commenced filling ", fillTankType, " ", fillTankName);
    if(!isNaN(parseInt(fillLevelElement.value))){
        commenceLogText = commenceLogText.concat(" (start: ", fillLevel, " gal)");
      }
    commenceLogText = commenceLogText.concat(".");
  }
  startLogText = startLogText.concat(commenceLogText);
  
  if(isNaN(parseInt(finalTimeElement.value)) == false){
    finishLogText = finishLogText.concat(finishLogTime, "Secured", " ", "filling", " ", fillTankType, " ", fillTankName, " (finish: ", finalLevel, " ", "gal).", " Transferred ", amountTransferred, " gal.");
  }

  transfer.getElementsByClassName("logTextBox")[0].innerHTML = startLogText;
  transfer.getElementsByClassName("logTextBox")[1].innerHTML = finishLogText;
  
  saveTransfer(transfer);
}

var numTransfers = 0;
function addTransfer() {
  var temp = document.getElementsByTagName("template")[0];
  var clon = temp.content.cloneNode(true).firstElementChild;
  var transfersContainer = document.getElementById("transfersContainer");
  transfersContainer.append(clon);
  clon.id += " " + numTransfers;
  numTransfers++;
  localStorage.setItem("numTransfers", numTransfers); // after the ++ so numTransfers > 0 for loop
  var collapsible = clon.getElementsByClassName("collapsible")[0];
  collapsible.addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.parentElement.nextElementSibling;
    localStorage.setItem(
      this.parentElement.parentElement.id + "_collapsibleClassList",
      this.classList
    );
    if (this.classList.contains("active")) {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  });
  var content = collapsible.parentElement.nextElementSibling;
  if (collapsible.classList.contains("active")) {
    content.style.display = "block";
  } else {
    content.style.display = "none";
  }
  return content;
}

function deleteTransfer(deleteButton) {
  var transferParent = deleteButton.parentElement.parentElement;
  var transfersContainer = transferParent.parentElement;
  for(var a = 0; a < transfersContainer.children.length; a++){
    localStorage.removeItem("clonedTransfer "+a+"_collapsibleClassList");
    localStorage.removeItem("clonedTransfer "+a+"_suctionTime");
    localStorage.removeItem("clonedTransfer "+a+"_suctionLevel");
    localStorage.removeItem("clonedTransfer "+a+"_suctionFromCheckbox");
    localStorage.removeItem("clonedTransfer "+a+"_suctionToCheckbox");
    localStorage.removeItem("clonedTransfer "+a+"_fillTime");
    localStorage.removeItem("clonedTransfer "+a+"_fillLevel");
    localStorage.removeItem("clonedTransfer "+a+"_fillCheckbox");
    localStorage.removeItem("clonedTransfer "+a+"_finalTime");
    localStorage.removeItem("clonedTransfer "+a+"_finalLevel");
    localStorage.removeItem("clonedTransfer "+a+"_estimatesFlowRate");
    localStorage.removeItem("clonedTransfer "+a+"_estimatesLevelPercent");
  }
  transferParent.remove();
  for(var i = 0; i < transfersContainer.children.length; i++){
    transfersContainer.children[i].id = "clonedTransfer " + i;
    localStorage.setItem(
      transfersContainer.children[i].id + "_collapsibleClassList",
      transfersContainer.children[i].children[1].classList
    );
    saveTransfer(transfersContainer.children[i].children[1]);
  }
  numTransfers = transfersContainer.children.length;
  localStorage.setItem("numTransfers", numTransfers);
}

function saveTransfer(transfer) {
  var transferParentId = transfer.parentElement.id;
  var suctionTimeElement = transfer.getElementsByClassName("suctionTime")[0];
  var suctionLevelElement = transfer.getElementsByClassName("suctionLevel")[0];
  localStorage.setItem(
    transferParentId + "_suctionTime",
    suctionTimeElement.value
  );
  localStorage.setItem(
    transferParentId + "_suctionLevel",
    suctionLevelElement.value
  );
  var suctionFromCheckboxes = transfer.children[0].children[3].children[0].getElementsByTagName(
    "input"
  );
  var selectedSuctionFromTankElement;
  var suctionFromCheckboxesIndex = -1;
  for (var a = 0; a < suctionFromCheckboxes.length; a++) {
    if (suctionFromCheckboxes[a].checked) {
      selectedSuctionFromTankElement = suctionFromCheckboxes[a];
      suctionFromCheckboxesIndex = a;
      break;
    }
  }
  localStorage.setItem(
    transferParentId + "_suctionFromCheckbox",
    suctionFromCheckboxesIndex
  );
  var suctionToCheckboxes = transfer.children[0].children[3].children[1].getElementsByTagName(
    "input"
  );
  var selectedSuctionToTankElement;
  var suctionToCheckboxesIndex = -1;
  for (var b = 0; b < suctionToCheckboxes.length; b++) {
    if (suctionToCheckboxes[b].checked) {
      selectedSuctionToTankElement = suctionToCheckboxes[b];
      suctionToCheckboxesIndex = b;
      break;
    }
  }
  localStorage.setItem(
    transferParentId + "_suctionToCheckbox",
    suctionToCheckboxesIndex
  );
  var fillTimeElement = transfer.getElementsByClassName("fillTime")[0];
  var fillLevelElement = transfer.getElementsByClassName("fillLevel")[0];
  localStorage.setItem(transferParentId + "_fillTime", fillTimeElement.value);
  localStorage.setItem(transferParentId + "_fillLevel", fillLevelElement.value);
  var fillCheckboxes = transfer.children[0].children[4].children[0].getElementsByTagName(
    "input"
  );
  var selectedFillTankElement;
  var fillCheckboxesIndex = -1;
  for (var c = 0; c < fillCheckboxes.length; c++) {
    if (fillCheckboxes[c].checked) {
      selectedFillTankElement = fillCheckboxes[c];
      fillCheckboxesIndex = c;
      break;
    }
  }
  localStorage.setItem(transferParentId + "_fillCheckbox", fillCheckboxesIndex);
  var finalTimeElement = transfer.getElementsByClassName("finalTime")[0];
  var finalLevelElement = transfer.getElementsByClassName("finalLevel")[0];
  localStorage.setItem(transferParentId + "_finalTime", finalTimeElement.value);
  localStorage.setItem(
    transferParentId + "_finalLevel",
    finalLevelElement.value
  );
  var estimatesElement = transfer.children[0].children[5].children[0];
  var estimatesFlowRateElement = estimatesElement.getElementsByClassName(
    "estimatesFlowRate"
  )[0];
  localStorage.setItem(
    transferParentId + "_estimatesFlowRate",
    estimatesFlowRateElement.value
  );
   var estimatesLevelPercentElement = estimatesElement.getElementsByClassName(
    "estimatesLevelPercent"
  )[0];
  localStorage.setItem(
    transferParentId + "_estimatesLevelPercent",
    estimatesLevelPercentElement.value
  );
}

loadTransfers();
function loadTransfers() {
  var storedNumTransfers = localStorage.getItem("numTransfers");
  if (storedNumTransfers != null) {
    storedNumTransfers = parseInt(storedNumTransfers);
    numTransfers = 0;
    for (var i = 0; i < storedNumTransfers; i++) {
      var transfer = addTransfer();
      var transferParentId = transfer.parentElement.id;

      var storedClassList = localStorage.getItem(transferParentId + "_collapsibleClassList");
      if(storedClassList != null){
        transfer.parentElement.children[0].children[1].classList = storedClassList;
      }
      if (transfer.parentElement.children[0].children[1].classList.contains("active")) {
        transfer.style.display = "block";
      } else {
        transfer.style.display = "none";
      }
      
      var suctionTimeElement = transfer.getElementsByClassName(
        "suctionTime"
      )[0];
      var suctionLevelElement = transfer.getElementsByClassName(
        "suctionLevel"
      )[0];
      suctionTimeElement.value = localStorage.getItem(
        transferParentId + "_suctionTime"
      );
      suctionLevelElement.value = localStorage.getItem(
        transferParentId + "_suctionLevel"
      );

      var suctionFromCheckboxes = transfer.children[0].children[3].children[0].getElementsByTagName(
        "input"
      );
      var suctionFromCheckboxesIndex = localStorage.getItem(
        transferParentId + "_suctionFromCheckbox"
      );
      suctionFromCheckboxesIndex = parseInt(suctionFromCheckboxesIndex);
      if (suctionFromCheckboxesIndex >= 0) {
        suctionFromCheckboxes[suctionFromCheckboxesIndex].checked = true;
      }

      var suctionToCheckboxes = transfer.children[0].children[3].children[1].getElementsByTagName(
        "input"
      );
      var suctionToCheckboxesIndex = localStorage.getItem(
        transferParentId + "_suctionToCheckbox"
      );
      suctionToCheckboxesIndex = parseInt(suctionToCheckboxesIndex);
      if (suctionToCheckboxesIndex >= 0) {
        suctionToCheckboxes[suctionToCheckboxesIndex].checked = true;
      }

      var fillTimeElement = transfer.getElementsByClassName("fillTime")[0];
      var fillLevelElement = transfer.getElementsByClassName("fillLevel")[0];
      fillTimeElement.value = localStorage.getItem(
        transferParentId + "_fillTime"
      );
      fillLevelElement.value = localStorage.getItem(
        transferParentId + "_fillLevel"
      );

      var fillCheckboxes = transfer.children[0].children[4].children[0].getElementsByTagName(
        "input"
      );
      var fillCheckboxesIndex = localStorage.getItem(
        transferParentId + "_fillCheckbox"
      );
      fillCheckboxesIndex = parseInt(fillCheckboxesIndex);
      if (fillCheckboxesIndex >= 0) {
        fillCheckboxes[fillCheckboxesIndex].checked = true;
      }
      
      var estimatesElement = transfer.children[0].children[5].children[0];
      var estimatesFlowRateElement = estimatesElement.getElementsByClassName(
        "estimatesFlowRate"
      )[0];
      estimatesFlowRateElement.value = localStorage.getItem(
        transferParentId + "_estimatesFlowRate"
      );
      var estimatesLevelPercentElement = estimatesElement.getElementsByClassName(
        "estimatesLevelPercent"
      )[0];
      estimatesLevelPercentElement.value = localStorage.getItem(
        transferParentId + "_estimatesLevelPercent"
      );

      var finalTimeElement = transfer.getElementsByClassName("finalTime")[0];
      var finalLevelElement = transfer.getElementsByClassName("finalLevel")[0];
      finalTimeElement.value = localStorage.getItem(
        transferParentId + "_finalTime"
      );
      finalLevelElement.value = localStorage.getItem(
        transferParentId + "_finalLevel"
      );

      calculateTransfer(transfer);
    }
  }
}