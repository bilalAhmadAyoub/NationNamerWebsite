// Utility function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}

// Utility function to delay execution for a given time in seconds
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time * 1000));
}

// Utility function to change the color of an array of countries
function changeCountryArrayColor(givenArray, newColor) {
    givenArray.forEach(country => {
        const countryElements = [
            ...document.getElementsByClassName(country),
            ...document.getElementsByName(country)
        ];
        countryElements.forEach(element => {
            if (!correctlySelectedCountries.includes(country)) {
                element.style.fill = newColor;
                element.style.stroke = hardMode ? 'grey' : 'var(--water-color)';
            }
        });
    });
}

// Initialize global variables
let globalCountryList = [];
let correctlySelectedCountries = [];
let hardMode = false;
let globalCountryListIterator = 0;
let currentCountry = null;
let score = 0;
let gameOver = false;
let regionsData = {};

// Fetch and parse the JSON data
fetch('/data/regionsAndCountries.json')
    .then(response => response.json())
    .then(data => {
        regionsData = data;
        initializeGame();
    })
    .catch(error => console.error('Error loading regions data:', error));

function initializeGame() {
    // Map page names to their corresponding data keys in the JSON
    const pageMap = {
        "": "countryData",
        "index.html": "countryData",
        "unitedStates.html": "americanStatesData",
        "unitedstates": "americanStatesData",
        "centralAndSouthAmerica.html": "centralAndSouthAmericaCountries",
        "centralandsouthamerica": "centralAndSouthAmericaCountries",
        "asia.html": "asiaCountries",
        "africa.html": "africaCountries",
        "europe.html": "europeCountries",
        "india.html": "indiaStates",
        "canada.html": "canadaProvinces",
        "china.html": "chinaProvinces",
        "germany.html": "germanyStates",
    };

    // Read country data based on the current page
    const pageName = window.location.pathname.split("/").pop();
    globalCountryList = regionsData[pageMap[pageName]] || [];

    // Debugging information
    console.log("Debugging information:");
    console.log(pageName);
    console.log(pageMap[pageName]);
    console.log(globalCountryList);

    // Semi-shuffle the country list
    const shuffleGroupSize = 10;
    for (let p = 0; p < globalCountryList.length; p += shuffleGroupSize) {
        const groupToShuffle = globalCountryList.slice(p, p + shuffleGroupSize);
        globalCountryList.splice(p, shuffleGroupSize, ...shuffle(groupToShuffle));
    }

    // Load the game when the document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ready);
    } else {
        ready();
    }
}

function ready() {
    // Initialize the current country and add event listeners to country buttons
    currentCountry = globalCountryList[globalCountryListIterator++];
    globalCountryList.forEach(country => {
        const countryButtons = [
            ...document.getElementsByClassName(country),
            ...document.getElementsByName(country)
        ];
        countryButtons.forEach(button => {
            button.addEventListener('click', operateCommand.bind(null, country), false);
        });
    });

    // Add event listeners to mode buttons
    document.querySelector('.hard-mode-button').addEventListener('click', () => toggleMode('hard'));
    document.querySelector('.normal-mode-button').addEventListener('click', () => toggleMode('normal'));

    // Add event listener to hint button if it exists
    const hintButton = document.querySelector('.hint-button');
    if (hintButton) {
        hintButton.addEventListener('click', provideHint);
    }

    // Display the name of the current country
    document.getElementById("country-name").textContent = currentCountry.toUpperCase();
}

function operateCommand(countryName, event) {
    if (gameOver) return;

    const countryClicked = event.target;
    const isCorrect = currentCountry === countryName;

    countryClicked.style.cssText = `fill: ${isCorrect ? 'green' : 'red'} !important`;

    if (isCorrect) {
        correctlySelectedCountries.push(countryName);
        updateScore();
        if (score < globalCountryList.length) {
            currentCountry = globalCountryList[globalCountryListIterator++];
            document.getElementById("country-name").textContent = currentCountry.toUpperCase();
        } else {
            endGame("YOU'VE WON!");
        }
    } else {
        endGame("GAME OVER");
        highlightCorrectCountry();
    }
}

function updateScore() {
    score++;
    document.getElementById("level-number").textContent = score < 10 ? `0${score}` : `${score}`;
}

function endGame(message) {
    gameOver = true;
    document.getElementById("country-name").textContent = message;
    document.getElementById("select-text").textContent = "";
    if (message === "GAME OVER") {
        document.getElementById("country-name").style.color = "red";
    }
}

function highlightCorrectCountry() {
    const correctCountryElements = [
        ...document.getElementsByClassName(currentCountry),
        ...document.getElementsByName(currentCountry)
    ];
    correctCountryElements.forEach(element => {
        element.style.cssText = 'fill: yellow';
    });
}

function toggleMode(mode) {
    const svgPaths = document.querySelectorAll('svg path');
    const strokeColor = mode === 'hard' ? "grey" : "var(--water-color)";
    const activeButton = mode === 'hard' ? '.hard-mode-button' : '.normal-mode-button';
    const inactiveButton = mode === 'hard' ? '.normal-mode-button' : '.hard-mode-button';

    svgPaths.forEach(path => path.style.stroke = strokeColor);
    document.querySelector(activeButton).style.backgroundColor = "green";
    document.querySelector(inactiveButton).style.backgroundColor = "grey";
    hardMode = (mode === 'hard');
}

function provideHint() {
    const regions = {
        africanCountries: regionsData.africaCountries || [],
        europeanCountries: regionsData.europeCountries || [],
        asianCountries: regionsData.asiaCountries || [],
        centralAndSouthAmericanCountries: regionsData.centralAndSouthAmericaCountries || [],
        oceanianAndNorthAmericanCountries: []
    };

    // Populate oceanianAndNorthAmericanCountries with countries not in other regions
    regions.oceanianAndNorthAmericanCountries = globalCountryList.filter(item =>
        !Object.values(regions).flat().includes(item)
    );

    // Helper function to change colors of countries in a region
    const applyHint = (countryArray) => {
        changeCountryArrayColor(countryArray, "lightgrey");
        delay(2).then(() => changeCountryArrayColor(countryArray, "grey"));
    };

    // Determine the region of the current country and apply the hint
    for (let region in regions) {
        if (regions[region].includes(currentCountry)) {
            applyHint(regions[region]);
            break;
        }
    }
}

// Popup buttons (in header)
const openPopupButtons = document.querySelectorAll('[data-modal-target]');
const closeButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');

openPopupButtons.forEach(button => {
    button.addEventListener('click', () => {
        const popup = document.querySelector(button.dataset.modalTarget);
        togglePopup(popup, true);
    });
});

overlay.addEventListener('click', () => {
    document.querySelectorAll('.modal.active').forEach(popup => {
        togglePopup(popup, false);
    });
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const popup = button.closest('.modal');
        togglePopup(popup, false);
    });
});

function togglePopup(popup, isOpen) {
    if (!popup) return;
    popup.classList.toggle('active', isOpen);
    overlay.classList.toggle('active', isOpen);
}

// Color changing buttons in popup
const root = document.documentElement;

document.getElementById("dark-mode").onclick = () => {
    root.style.setProperty("--background-color", "black");
    root.style.setProperty("--water-color", "black");
    root.style.setProperty("--secondary-title-color", "white");
    root.style.setProperty("--map-link-background-color", "purple");
    root.style.setProperty("--border-style", "dashed");

    root.style.setProperty("--default-mode-color", "white");
    root.style.setProperty("--dark-mode-color", "lightgrey");
    root.style.setProperty("--color-blind-mode-color", "white");
};

document.getElementById("default-mode").onclick = () => {
    root.style.setProperty("--background-color", "white");
    root.style.setProperty("--water-color", "#c6eaef");
    root.style.setProperty("--secondary-title-color", "black");
    root.style.setProperty("--map-link-background-color", "pink");
    root.style.setProperty("--border-style", "none");

    root.style.setProperty("--default-mode-color", "lightgrey");
    root.style.setProperty("--dark-mode-color", "white");
    root.style.setProperty("--color-blind-mode-color", "white");
};

document.getElementById("color-blind-mode").onclick = () => {
    root.style.setProperty("--background-color", "black");
    root.style.setProperty("--water-color", "yellow");
    root.style.setProperty("--secondary-title-color", "black");
    root.style.setProperty("--map-link-background-color", "white");
    root.style.setProperty("--border-style", "none");

    root.style.setProperty("--default-mode-color", "white");
    root.style.setProperty("--dark-mode-color", "white");
    root.style.setProperty("--color-blind-mode-color", "lightgrey");
};
