
//first, let's create a list of countries sorted by population
var globalCountryList = ["China", "India", "United States", "Indonesia", "Pakistan", "Brazil", "Nigeria", "Bangladesh", "Russia", "Mexico", "Japan", "Ethiopia", "Philippines", "Egypt", "Vietnam", "DR Congo", "Iran", "Turkey", "Germany", "France", "United Kingdom", "Thailand", "South Africa", "Tanzania", "Italy", "Myanmar", "South Korea", "Colombia", "Kenya", "Spain", "Argentina", "Algeria", "Sudan", "Uganda", "Iraq", "Ukraine", "Canada", "Poland", "Morocco", "Uzbekistan", "Saudi Arabia", "Peru", "Afghanistan", "Malaysia", "Angola", "Mozambique", "Ghana", "Yemen", "Nepal", "Venezuela", "Ivory Coast", "Madagascar", "Australia", "North Korea", "Cameroon", "Niger", "Taiwan", "Sri Lanka", "Burkina Faso", "Mali", "Chile", "Kazakhstan", "Romania", "Malawi", "Zambia", "Syria", "Ecuador", "Netherlands", "Senegal", "Guatemala", "Chad", "Somalia", "Zimbabwe", "Cambodia", "South Sudan", "Rwanda", "Guinea", "Burundi", "Benin", "Bolivia", "Tunisia", "Haiti", "Belgium", "Cuba", "Jordan", "Greece", "Dominican Republic", "Czech Republic", "Sweden", "Portugal", "Azerbaijan", "Hungary", "Honduras", "Tajikistan", "United Arab Emirates", "Israel", "Belarus", "Papua New Guinea", "Austria", "Switzerland", "Sierra Leone", "Togo", "Paraguay", "Laos", "Libya", "Serbia", "El Salvador", "Lebanon", "Kyrgyzstan", "Nicaragua", "Bulgaria", "Turkmenistan", "Denmark", "Congo", "Central African Republic", "Finland", "Slovakia", "Norway", "Palestine", "Costa Rica", "New Zealand", "Ireland", "Kuwait", "Liberia", "Oman", "Panama", "Mauritania", "Croatia", "Georgia", "Eritrea", "Uruguay", "Mongolia", "Bosnia and Herzegovina", "Puerto Rico", "Armenia", "Albania", "Qatar", "Lithuania", "Jamaica", "Moldova", "Namibia", "Gambia", "Botswana", "Gabon", "Lesotho", "Slovenia", "Latvia", "North Macedonia", "Kosovo", "Guinea-Bissau", "Equatorial Guinea", "Bahrain", "Trinidad and Tobago", "Estonia", "East Timor", "Mauritius", "Eswatini", "Djibouti", "Fiji", "Cyprus", "Comoros", "Bhutan", "Guyana", "Solomon Islands", "Luxembourg", "Montenegro", "Western Sahara", "Suriname", "Cape Verde", "Malta", "Belize", "Brunei", "Bahamas", "Maldives", "Iceland", "Vanuatu", "Barbados", "French Polynesia", "New Caledonia", "São Tomé and Principe", "Samoa", "Saint Lucia", "Guam", "Curaçao", "Grenada", "Aruba", "Saint Vincent and the Grenadines", "Micronesia", "Tonga", "Antigua and Barbuda", "Seychelles", "United States Virgin Islands", "Dominica", "Cayman Islands", "Bermuda", "Greenland", "Marshall Islands", "Saint Kitts and Nevis", "Faeroe Islands", "American Samoa", "Northern Mariana Islands", "Turks and Caicos Islands", "Sint Maarten", "British Virgin Islands", "Palau", "Anguilla", "Nauru", "Tuvalu", "Saint-Barthélemy", "Montserrat", "Falkland Islands"]


//now let's semi-shuffle that list
var shuffleGroupSize = 10 //change this val to change how shuffled the list is
for(var p = 0; p < globalCountryList.length; p += shuffleGroupSize){
    var q = Math.min(p + shuffleGroupSize, globalCountryList.length);
    shuffle(globalCountryList, p, q);
}



var globalCountryListIterator = 0
var currentCountry = globalCountryList[globalCountryListIterator++]
var score = 0
var gameOver = false



if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready(){
    //iterate through an array of countries
    var countryList = globalCountryList;
    for(var j = 0; j < countryList.length; j++){
        var countryButtonList = document.getElementsByClassName(countryList[j])
        for (var i = 0; i < countryButtonList.length; i++){
            var countryButton = countryButtonList[i]
            countryButton.addEventListener('click', operateCommand.bind(null, countryList[j]), false)
        }
    }

    for(var j = 0; j < countryList.length; j++){
        var countryButtonList = document.getElementsByName(countryList[j])
        for (var i = 0; i < countryButtonList.length; i++){
            var countryButton = countryButtonList[i]
            countryButton.addEventListener('click', operateCommand.bind(null, countryList[j]), false)
        }
    }

    //display the first country the player needs to select
    document.getElementById("country-name").textContent = currentCountry.toUpperCase();
}

//this function modifies a the game accordingly when a country is clicked
function operateCommand(countryNamee, event){
    var countryClicked = event.target
    console.log("you clicked " + countryNamee)
    if(currentCountry == countryNamee && !gameOver){
        
        countryClicked.style.cssText = 'fill: green';

        //update score
        score++;
        console.log("score: " + score)
        if(score < 10) document.getElementById("level-number").textContent = "0" + score;
        else document.getElementById("level-number").textContent = "" + score;
        
        //change "currentCountry" to next country in list of all countries
        if(score < globalCountryList.length){ //check if there's even another country in the list!
            currentCountry = globalCountryList[globalCountryListIterator++]
        
            //update displayed country
            console.log("now find the country: " + currentCountry)
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



console.log("find the country " + currentCountry);