
var globalCountryList = [];
var correctlySelectedCountries = [];
var hardMode = false;


var globalCountryListIterator = 0
var currentCountry = null
var score = 0
var gameOver = false


console.log("reached onee");



function printFileLines() {
    console.log("reached one1.5");
  fetch('/regionLists/countryData.txt')
    .then(response => response.text())
    .then(text => text.split('\n'))
    .then(lines => lines.forEach(line => console.log(line)));
}

console.log("reached one1");
printFileLines();
console.log("reached one2");



// read in the country names from countryData.txt and add them to globalCountryList array
function readTextFile(file, arrayName) {
    console.log("reached 2");
    let rawFile = new XMLHttpRequest();
    console.log("reached 2.1");
    rawFile.open("GET", file, false);
    console.log("reached 2.2");
    rawFile.onreadystatechange = function () {
        console.log("reached 2.3");
      if (rawFile.readyState === 4) {
          console.log("reached 2.4");
        if (rawFile.status === 200 || rawFile.status == 0) {
            console.log("reached 3");
          let allText = rawFile.responseText;
          let lines = allText.split('\n');
          lines.forEach((line) => {
            //console.log(line);
            arrayName.push(line);
          });
        }
      }
    }
    console.log("reached 4");
    rawFile.send(null);
  }


  console.log("reached 5");

//let's read in the region names, depending on which map we are using
var pageName = document.title;
console.log("pageName is " + pageName);
console.log("document title is " + document.title);
if(pageName == "Nation Namer"){
    console.log("reached a");
    readTextFile('/regionLists/countryData.txt', globalCountryList);
    console.log("reached b");
}
else if(pageName == "unitedStates.html") readTextFile('/regionLists/americanStatesData.txt', globalCountryList);
else if(pageName == "centralAndSouthAmerica.html") {
    var unorderedCountries = [];
    readTextFile('/regionLists/centralAndSouthAmericaCountries.txt', unorderedCountries);
    readTextFile('/regionLists/countryData.txt', globalCountryList);
    globalCountryList = globalCountryList.filter(item => unorderedCountries.includes(item));
}
else if(pageName == "asia.html") {
    var unorderedCountries = [];
    readTextFile('/regionLists/asiaCountries.txt', unorderedCountries);
    readTextFile('/regionLists/countryData.txt', globalCountryList);
    globalCountryList = globalCountryList.filter(item => unorderedCountries.includes(item));
}
else if(pageName == "africa.html") {
    var unorderedCountries = [];
    readTextFile('/regionLists/africaCountries.txt', unorderedCountries);
    readTextFile('/regionLists/countryData.txt', globalCountryList);
    globalCountryList = globalCountryList.filter(item => unorderedCountries.includes(item));
}
else if(pageName == "europe.html") {
    var unorderedCountries = [];
    readTextFile('/regionLists/europeCountries.txt', unorderedCountries);
    readTextFile('/regionLists/countryData.txt', globalCountryList);
    globalCountryList = globalCountryList.filter(item => unorderedCountries.includes(item));
}
else if(pageName == "india.html") readTextFile('/regionLists/indiaStates.txt', globalCountryList);
else if(pageName == "canada.html") readTextFile('/regionLists/canadaProvinces.txt', globalCountryList);
else if(pageName == "china.html") readTextFile('/regionLists/chinaProvinces.txt', globalCountryList);
else if(pageName == "germany.html") readTextFile('/regionLists/germanyStates.txt', globalCountryList);
console.log("reached 6");
console.log("reached 6.1: " + globalCountryList.length);

//now let's semi-shuffle that list
var shuffleGroupSize = 10 //change this val to change how shuffled the list is
for(var p = 0; p < globalCountryList.length; p += shuffleGroupSize){
    var q = Math.min(p + shuffleGroupSize, globalCountryList.length);
    shuffle(globalCountryList, p, q);
}



console.log("reached 7");

//let's load the game!
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready(){
    console.log("reached 8");
    //iterate through an array of countries
    currentCountry = globalCountryList[globalCountryListIterator++]
    console.log("reached 8.1 " + currentCountry);
    var countryList = globalCountryList;
    for(var j = 0; j < countryList.length; j++){
        var countryButtonList = document.getElementsByClassName(countryList[j])
        //console.log("total length: " + countryButtonList.length);
        for (var i = 0; i < countryButtonList.length; i++){
            var countryButton = countryButtonList[i]
            countryButton.addEventListener('click', operateCommand.bind(null, countryList[j]), false)
        }
    }

    console.log("reached 9");

    for(var j = 0; j < countryList.length; j++){
        var countryButtonList = document.getElementsByName(countryList[j])
        for (var i = 0; i < countryButtonList.length; i++){
            var countryButton = countryButtonList[i]
            countryButton.addEventListener('click', operateCommand.bind(null, countryList[j]), false)
        }
    }

    console.log("reached 10");

    //do the difficulty levels
    document.querySelector('.hard-mode-button').addEventListener('click', function() {
        //console.log("reached");
        var svgPaths = document.querySelectorAll('svg path');
        for (var path of svgPaths) path.style.stroke = "grey";
        this.style.backgroundColor = "green";
        document.querySelector('.normal-mode-button').style.backgroundColor = "grey";
        hardMode = true;
    });

    document.querySelector('.normal-mode-button').addEventListener('click', function() {
        //console.log("reached");
        var svgPaths = document.querySelectorAll('svg path');
        for (var path of svgPaths) path.style.stroke = "var(--water-color)";
        this.style.backgroundColor = "green";
        document.querySelector('.hard-mode-button').style.backgroundColor = "grey";
        hardMode = false;
    });

    console.log("reached 11");


    //do the hint
    if(document.querySelector('.hint-button') != undefined){
        document.querySelector('.hint-button').addEventListener('click', function() {
            //console.log("hint reached");
            //find the continent of currentCountry
            var africanCountries = [];
            var asianCountries = [];
            var centralAndSouthAmericanCountries = [];
            var oceanianAndNorthAmericanCountries = [];
            var europeanCountries = [];
    
            readTextFile('/regionLists/africaCountries.txt', africanCountries);
            readTextFile('/regionLists/europeCountries.txt', europeanCountries);
            readTextFile('/regionLists/asiaCountries.txt', asianCountries);
            readTextFile('/regionLists/centralAndSouthAmericaCountries.txt', centralAndSouthAmericanCountries);
            oceanianAndNorthAmericanCountries = globalCountryList.filter(item => !africanCountries.includes(item) && !asianCountries.includes(item) && !europeanCountries.includes(item) && !centralAndSouthAmericanCountries.includes(item));
            
            if(africanCountries.includes(currentCountry)) {
                //console.log("is african");
                changeCountryArrayColor(africanCountries, "lightgrey");
                delay(2).then(() => changeCountryArrayColor(africanCountries, "grey"));
            }
            else if(europeanCountries.includes(currentCountry)) {
                //console.log("is european");
                changeCountryArrayColor(europeanCountries, "lightgrey");
                delay(2).then(() => changeCountryArrayColor(europeanCountries, "grey"));
            }
            else if(asianCountries.includes(currentCountry)) {
                //console.log("is asian");
                changeCountryArrayColor(asianCountries, "lightgrey");
                delay(2).then(() => changeCountryArrayColor(asianCountries, "grey"));
            }
            else if(centralAndSouthAmericanCountries.includes(currentCountry)) {
                //console.log("is south american");
                changeCountryArrayColor(centralAndSouthAmericanCountries, "lightgrey");
                delay(2).then(() => changeCountryArrayColor(centralAndSouthAmericanCountries, "grey"));
            }
            else if(oceanianAndNorthAmericanCountries.includes(currentCountry)) {
                //console.log("is oceanian");
                changeCountryArrayColor(oceanianAndNorthAmericanCountries, "lightgrey");
                delay(2).then(() => changeCountryArrayColor(oceanianAndNorthAmericanCountries, "grey"));
            }
    
        });

    }
    
        
    //display the first country the player needs to select
    //console.log(currentCountry + "***" + globalCountryList.length);
    document.getElementById("country-name").textContent = currentCountry.toUpperCase();
}

//this function modifies a the game accordingly when a country is clicked
function operateCommand(countryNamee, event){
    var countryClicked = event.target
    //console.log("you clicked " + countryNamee)
    if(currentCountry == countryNamee && !gameOver){
        
        countryClicked.style.cssText = 'fill: green !important';
        correctlySelectedCountries.push(countryNamee);

        //update score
        score++;
        //console.log("score: " + score)
        if(score < 10) document.getElementById("level-number").textContent = "0" + score;
        else document.getElementById("level-number").textContent = "" + score;
        
        //change "currentCountry" to next country in list of all countries
        if(score < globalCountryList.length){ //check if there's even another country in the list!
            currentCountry = globalCountryList[globalCountryListIterator++]
        
            //update displayed country
            //console.log("now find the country: " + currentCountry)
            document.getElementById("country-name").textContent = currentCountry.toUpperCase();
        }
        else{
            //player has won!
            gameOver = true;
            document.getElementById("country-name").textContent = "YOU\'VE WON!";
            document.getElementById("select-text").textContent = "";
        }
    }
    else{
        if(!gameOver){
            //player has lost!
            countryClicked.style.cssText = 'fill: red';
            document.getElementById("country-name").textContent = "GAME OVER"; //display "GAME OVER" text
            document.getElementById("country-name").style.color = "red"; //turn wrongly selected country red
            document.getElementById("select-text").textContent = ""; //remove "select: " label

            
            //turn correct country yellow (so the player learns for the next round)
            var correctCountryList = document.getElementsByClassName(currentCountry);
            for (var i = 0; i < correctCountryList.length; i++){
                var correctCountryList = correctCountryList[i]
                correctCountryList.style.cssText = 'fill: yellow';
            }

            correctCountryList = document.getElementsByName(currentCountry);
            for (var i = 0; i < correctCountryList.length; i++){
                var correctCountryList = correctCountryList[i]
                correctCountryList.style.cssText = 'fill: yellow';
            }   
        }
        gameOver = true;
    }
    
}

//this function shuffles array from index start up until index end (start included, end not included)
function shuffle(array, start, end) {
    let randomIndex = 0;
    let currentIndex = end - start;
    
    //go through each element in array (backwards)
    while (currentIndex != 0) {
  
      //from the remaining elements, select one at random
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      //swap the item at currentIndex with the one at randomIndex
      [array[currentIndex + start], array[randomIndex + start]] = [array[randomIndex + start], array[currentIndex + start]];
    }
  
    return array;
}


//this function pauses the javascript running for 'time' amount of seconds
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time * 1000));
  }


//change an array of countries to a given color
function changeCountryArrayColor(givenArray, newColor) {
    //console.log("hint reached 2");
    //turn all the countries of that continent light grey
    for(var i = 0; i < givenArray.length; i++) {
        //console.log("turning country " + givenArray[i] + " to color " + newColor);
        var countryButtonList = document.getElementsByClassName("" + givenArray[i]);
        //console.log("total size: " + countryButtonList.length);
        for(var j = 0; j < countryButtonList.length; j++) {
            //console.log("hint reached 3");
            if(countryButtonList.length > 0 && !correctlySelectedCountries.includes(givenArray[i])) {
                //countryButtonList[j].style.cssText = 'fill: ' + newColor;
                //countryButtonList[j].style.cssText = hardMode ? 'stroke: grey' : 'stroke: white';
                countryButtonList[j].style.fill = newColor;
                countryButtonList[j].style.stroke = hardMode ? 'grey' : 'var(--water-color)';
                
            }
        }

        countryButtonList = document.getElementsByName(givenArray[i]);
        //console.log(countryButtonList.length);
        for(var j = 0; j < countryButtonList.length; j++) {
            //console.log("hint reached 3");
            if(countryButtonList.length > 0 && !correctlySelectedCountries.includes(givenArray[i])) {
                countryButtonList[j].style.fill = newColor;
                countryButtonList[j].style.stroke = hardMode ? 'grey' : 'var(--water-color)';
            }
        }
    }
}


//console.log("find the country " + currentCountry);


//pop up buttons (in the header)
const openPopupButtons = document.querySelectorAll('[data-modal-target]')
const closeButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openPopupButtons.forEach(button => {
  button.addEventListener('click', () => {
    const popup = document.querySelector(button.dataset.modalTarget)
    openPopup(popup)
  })
})

overlay.addEventListener('click', () => {
  const popups = document.querySelectorAll('.modal.active')
  popups.forEach(popup => {
    closePopup(popup)
  })
})

closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const popup = button.closest('.modal')
    closePopup(popup)
  })
})

function openPopup(popup) {
  if (popup == null) return
  popup.classList.add('active')
  overlay.classList.add('active')
}

function closePopup(popup) {
  if (popup == null) return
  popup.classList.remove('active')
  overlay.classList.remove('active')
}



// color changing buttons in popup
var root = document.documentElement;
document.getElementById("dark-mode").onclick = function() {
    root.style.setProperty("--background-color", "black");
    root.style.setProperty("--water-color", "black");
    root.style.setProperty("--secondary-title-color", "white");
    root.style.setProperty("--map-link-background-color", "purple");
    root.style.setProperty("--border-style", "dashed");

    root.style.setProperty("--default-mode-color", "white");
    root.style.setProperty("--dark-mode-color", "lightgrey");
    root.style.setProperty("--color-blind-mode-color", "white");
}

document.getElementById("default-mode").onclick = function() {
    root.style.setProperty("--background-color", "white");
    root.style.setProperty("--water-color", "#c6eaef");
    root.style.setProperty("--secondary-title-color", "black");
    root.style.setProperty("--map-link-background-color", "pink");
    root.style.setProperty("--border-style", "none");

    root.style.setProperty("--default-mode-color", "lightgrey");
    root.style.setProperty("--dark-mode-color", "white");
    root.style.setProperty("--color-blind-mode-color", "white");
}

document.getElementById("color-blind-mode").onclick = function() {
    root.style.setProperty("--background-color", "black");
    root.style.setProperty("--water-color", "yellow");
    root.style.setProperty("--secondary-title-color", "black");
    root.style.setProperty("--map-link-background-color", "white");
    root.style.setProperty("--border-style", "none");

    root.style.setProperty("--default-mode-color", "white");
    root.style.setProperty("--dark-mode-color", "white");
    root.style.setProperty("--color-blind-mode-color", "lightgrey");
}
