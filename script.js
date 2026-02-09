const typingText = document.querySelector(".typing-text p");
const inpField = document.querySelector(".wrapper .input-field");
const timeTag = document.querySelector(".time span b");
const mistakeTag = document.querySelector(".mistake span");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");
const themesWrapper = document.querySelector("#themes-wrapper");
const settingsWrapper = document.querySelector("#settings-wrapper");
const mainWrapper = document.querySelector("#mainwrap");
const backdrop = document.createElement("div");
const themeDef = document.querySelector(":root").style;
const themesBtn = document.getElementById("themes-btn");
const settingsBtn = document.getElementById("settings-btn");
const defaultBtn = document.getElementById("default");
const coffeeBtn = document.getElementById("coffee");
const codeBtn = document.getElementById("code");
const beachBtn = document.getElementById("beach");
const lavenderBtn = document.getElementById("lavender");
const mintyfreshBtn = document.getElementById("mintyfresh");
const cherryBtn = document.getElementById("cherry");
const mintchocBtn = document.getElementById("mintchoc");
const cottonCandyBtn = document.getElementById("cottonCandy");
const sunsetBtn = document.getElementById("sunset");
const oceanBtn = document.getElementById("ocean");
const forestBtn = document.getElementById("forest");
const draculaBtn = document.getElementById("dracula");
const monokaiBtn = document.getElementById("monokai");
const hellokittyBtn = document.getElementById("hellokitty");
const hellokittyItem = document.getElementById("hellokitty-item");
const fontSizeSelect = document.getElementById("font-size");
const testDurationSelect = document.getElementById("test-duration");
const wordCountSelect = document.getElementById("word-count");
backdrop.classList.add("backdrop");

let timer;
let maxTime = parseInt(localStorage.getItem("testDuration") || "30");
let timeLeft = maxTime;
let charIndex = (mistakes = isTyping = 0);
let wordCount = parseInt(localStorage.getItem("wordCount") || "50");

function loadParagraph() {
  const randomWords = [];
  for (let i = 0; i < wordCount; i++) {
    randomWords.push(words[Math.floor(Math.random() * words.length)]);
  }
  const text = randomWords.join(' ');
  
  typingText.innerHTML = "";
  text.split("").forEach((char) => {
    typingText.innerHTML += `<span>${char}</span>`;
  });
  typingText.querySelectorAll("span")[0].classList.add("active");
  document.addEventListener("keydown", () => inpField.focus());
  typingText.addEventListener("click", () => inpField.focus());
  
  const fontSize = localStorage.getItem("fontSize") || "2rem";
  typingText.style.fontSize = fontSize;
}

function initTyping() {
  let characters = typingText.querySelectorAll("span");
  let typedChar = inpField.value.split("")[charIndex];
  if (charIndex < characters.length - 1 && timeLeft > 0) {
    if (!isTyping) {
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }
    if (typedChar == null) {
      if (charIndex > 0) {
        charIndex--;
        if (characters[charIndex].classList.contains("incorrect")) {
          mistakes--;
        }
        characters[charIndex].classList.remove("correct", "incorrect");
      }
    } else {
      if (characters[charIndex].innerText == typedChar) {
        characters[charIndex].classList.add("correct");
      } else {
        mistakes++;
        characters[charIndex].classList.add("incorrect");
      }
      charIndex++;
    }
    characters.forEach((span) => span.classList.remove("active"));
    characters[charIndex].classList.add("active");

    let wpm = Math.round(
      ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60,
    );
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

    wpmTag.innerText = wpm;
    mistakeTag.innerText = mistakes;
    cpmTag.innerText = charIndex - mistakes;
  } else {
    clearInterval(timer);
    if (isTyping) {
      let finalWpm = Math.round(((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60);
      saveScore(finalWpm, charIndex - mistakes, mistakes);
    }
    inpField.value = "";
  }
}

function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;
    let wpm = Math.round(
      ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60,
    );
    wpmTag.innerText = wpm;
  } else {
    clearInterval(timer);
    let finalWpm = Math.round(((charIndex - mistakes) / 5 / maxTime) * 60);
    saveScore(finalWpm, charIndex - mistakes, mistakes);
  }
}

function saveScore(wpm, cpm, mistakes) {
  const scores = JSON.parse(localStorage.getItem("scores") || "[]");
  scores.push({
    wpm,
    cpm,
    mistakes,
    duration: maxTime,
    wordCount: wordCount,
    date: new Date().toLocaleString(),
  });
  localStorage.setItem("scores", JSON.stringify(scores));
}

function coffeeTheme() {
  themeDef.setProperty("--main-bg-color", "#CEB18D");
  themeDef.setProperty("--boba-color", "rgb(25 16 14)");
  themeDef.setProperty("--p-text-color", "rgb(255 255 255)");
  themeDef.setProperty("--correct-color", "rgb(25 16 14)");
  themeDef.setProperty("--incorrect-color", "rgb(230, 84, 99)");
  themeDef.setProperty("--results-color", "rgb(25 16 14)");
  themeDef.setProperty("--caret-color", "rgb(25 16 14)");
}
function beachTheme() {
  themeDef.setProperty("--main-bg-color", "rgb(255, 184, 124)");
  themeDef.setProperty("--boba-color", "rgb(51, 102, 153)");
  themeDef.setProperty("--p-text-color", "rgb(153, 85, 51)");
  themeDef.setProperty("--correct-color", "rgb(255, 255, 255)");
  themeDef.setProperty("--incorrect-color", "rgb(255, 102, 102)");
  themeDef.setProperty("--results-color", "rgb(51, 102, 153)");
  themeDef.setProperty("--caret-color", "rgb(255, 193, 7)");
}

function defaultTheme() {
  themeDef.setProperty("--main-bg-color", "rgb(30 41 59)");
  themeDef.setProperty("--boba-color", "rgb(255 255 255)");
  themeDef.setProperty("--p-text-color", "rgb(71 85 105)");
  themeDef.setProperty("--correct-color", "rgb(255 255 255)");
  themeDef.setProperty("--incorrect-color", "rgb(202, 71, 84)");
  themeDef.setProperty("--results-color", "rgb(255 255 255)");
  themeDef.setProperty("--caret-color", "rgb(0 122 204)");
}
function lavenderTheme() {
  themeDef.setProperty("--main-bg-color", "rgb(200, 190, 230)");
  themeDef.setProperty("--boba-color", "rgb(50, 50, 100)");
  themeDef.setProperty("--p-text-color", "rgb(100, 84, 143)");
  themeDef.setProperty("--correct-color", "rgb(255, 255, 255)");
  themeDef.setProperty("--incorrect-color", "rgb(255, 140, 180)");
  themeDef.setProperty("--results-color", "rgb(50, 50, 100)");
  themeDef.setProperty("--caret-color", "rgb(138, 43, 226)");
}

function mintyfreshTheme() {
  themeDef.setProperty("--main-bg-color", "rgb(173, 255, 199)");
  themeDef.setProperty("--boba-color", "rgb(0, 102, 68)");
  themeDef.setProperty("--p-text-color", "rgb(0, 68, 45)");
  themeDef.setProperty("--correct-color", "rgb(255, 255, 255)");
  themeDef.setProperty("--incorrect-color", "rgb(255, 69, 0)");
  themeDef.setProperty("--results-color", "rgb(0, 102, 68)");
  themeDef.setProperty("--caret-color", "rgb(0, 204, 102)");
}
function cherryTheme() {
  themeDef.setProperty("--main-bg-color", "rgb(255, 223, 230)");
  themeDef.setProperty("--boba-color", "rgb(128, 0, 64)");
  themeDef.setProperty("--p-text-color", "rgb(51, 51, 51)");
  themeDef.setProperty("--correct-color", "rgb(210, 0, 126)");
  themeDef.setProperty("--incorrect-color", "rgb(90, 0, 0)");
  themeDef.setProperty("--results-color", "rgb(51, 51, 51)");
  themeDef.setProperty("--caret-color", "rgb(255, 105, 180)");
}

function codeTheme() {
  themeDef.setProperty("--main-bg-color", "rgb(0,0,0)");
  themeDef.setProperty("--boba-color", "rgb(53, 160, 0)");
  themeDef.setProperty("--p-text-color", "rgb(22, 65, 0)");
  themeDef.setProperty("--correct-color", "rgb(53, 160, 0)");
  themeDef.setProperty("--incorrect-color", "rgb(202, 71, 84)");
  themeDef.setProperty("--results-color", "rgb(22, 65, 0)");
  themeDef.setProperty("--caret-color", "rgb(53, 160, 0)");
}
function mintchocTheme() {
  themeDef.setProperty("--main-bg-color", "rgb(17, 17, 17)");
  themeDef.setProperty("--boba-color", "rgb(255, 255, 255)");
  themeDef.setProperty("--p-text-color", "rgb(255, 255, 255)");
  themeDef.setProperty("--correct-color", "rgb(0, 255, 98)");
  themeDef.setProperty("--incorrect-color", "rgb(255, 69, 0)");
  themeDef.setProperty("--results-color", "rgb(255, 255, 255)");
  themeDef.setProperty("--caret-color", "rgb(0, 191, 255)");
}
function cottonCandyTheme() {
  themeDef.setProperty("--main-bg-color", "rgb(255, 188, 217)");
  themeDef.setProperty("--boba-color", "rgb(128, 0, 255)");
  themeDef.setProperty("--p-text-color", "rgb(51, 51, 51)");
  themeDef.setProperty("--correct-color", "rgb(0, 204, 255)");
  themeDef.setProperty("--incorrect-color", "rgb(255, 69, 0)");
  themeDef.setProperty("--results-color", "rgb(51, 51, 51)");
  themeDef.setProperty("--caret-color", "rgb(255, 105, 180)");
}

function sunsetTheme() {
  themeDef.setProperty("--main-bg-color", "rgb(255, 94, 77)");
  themeDef.setProperty("--boba-color", "rgb(255, 223, 0)");
  themeDef.setProperty("--p-text-color", "rgb(255, 179, 71)");
  themeDef.setProperty("--correct-color", "rgb(255, 255, 255)");
  themeDef.setProperty("--incorrect-color", "rgb(139, 0, 0)");
  themeDef.setProperty("--results-color", "rgb(255, 255, 255)");
  themeDef.setProperty("--caret-color", "rgb(255, 223, 0)");
}

function oceanTheme() {
  themeDef.setProperty("--main-bg-color", "rgb(0, 105, 148)");
  themeDef.setProperty("--boba-color", "rgb(0, 180, 216)");
  themeDef.setProperty("--p-text-color", "rgb(144, 224, 239)");
  themeDef.setProperty("--correct-color", "rgb(255, 255, 255)");
  themeDef.setProperty("--incorrect-color", "rgb(255, 87, 51)");
  themeDef.setProperty("--results-color", "rgb(255, 255, 255)");
  themeDef.setProperty("--caret-color", "rgb(0, 180, 216)");
}

function forestTheme() {
  themeDef.setProperty("--main-bg-color", "rgb(34, 139, 34)");
  themeDef.setProperty("--boba-color", "rgb(144, 238, 144)");
  themeDef.setProperty("--p-text-color", "rgb(152, 251, 152)");
  themeDef.setProperty("--correct-color", "rgb(255, 255, 255)");
  themeDef.setProperty("--incorrect-color", "rgb(255, 69, 0)");
  themeDef.setProperty("--results-color", "rgb(255, 255, 255)");
  themeDef.setProperty("--caret-color", "rgb(173, 255, 47)");
}

function draculaTheme() {
  themeDef.setProperty("--main-bg-color", "rgb(40, 42, 54)");
  themeDef.setProperty("--boba-color", "rgb(189, 147, 249)");
  themeDef.setProperty("--p-text-color", "rgb(98, 114, 164)");
  themeDef.setProperty("--correct-color", "rgb(80, 250, 123)");
  themeDef.setProperty("--incorrect-color", "rgb(255, 85, 85)");
  themeDef.setProperty("--results-color", "rgb(248, 248, 242)");
  themeDef.setProperty("--caret-color", "rgb(255, 121, 198)");
}

function monokaiTheme() {
  themeDef.setProperty("--main-bg-color", "rgb(39, 40, 34)");
  themeDef.setProperty("--boba-color", "rgb(249, 38, 114)");
  themeDef.setProperty("--p-text-color", "rgb(117, 113, 94)");
  themeDef.setProperty("--correct-color", "rgb(166, 226, 46)");
  themeDef.setProperty("--incorrect-color", "rgb(249, 38, 114)");
  themeDef.setProperty("--results-color", "rgb(248, 248, 240)");
  themeDef.setProperty("--caret-color", "rgb(102, 217, 239)");
}

function hellokittyTheme() {
  themeDef.setProperty("--main-bg-color", "rgb(255, 182, 193)");
  themeDef.setProperty("--boba-color", "rgb(255, 20, 147)");
  themeDef.setProperty("--p-text-color", "rgb(255, 105, 180)");
  themeDef.setProperty("--correct-color", "rgb(255, 255, 255)");
  themeDef.setProperty("--incorrect-color", "rgb(220, 20, 60)");
  themeDef.setProperty("--results-color", "rgb(255, 255, 255)");
  themeDef.setProperty("--caret-color", "rgb(255, 20, 147)");
}
function showThemeMenu() {
  hideAllMenus();
  themesWrapper.classList.remove("hidden");
  backdrop.classList.add("active");
}

function showSettingsMenu() {
  hideAllMenus();
  settingsWrapper.classList.remove("hidden");
  backdrop.classList.add("active");
}

function hideAllMenus() {
  themesWrapper.classList.add("hidden");
  settingsWrapper.classList.add("hidden");
  backdrop.classList.remove("active");
}

function setTheme() {
  let themeName = localStorage.getItem("theme");
  const secretHint = document.getElementById("secret-hint");
  
  if (secretHint) {
    secretHint.style.display = themeName === "hellokitty" ? "inline" : "none";
  }
  
  if (themeName == "code") {
    codeTheme();
  } else if (themeName == "coffee") {
    coffeeTheme();
  } else if (themeName == "default") {
    defaultTheme();
  } else if (themeName == "beach") {
    beachTheme();
  } else if (themeName == "lavender") {
    lavenderTheme();
  } else if (themeName == "mintyfresh") {
    mintyfreshTheme();
  } else if (themeName == "cherry") {
    cherryTheme();
  } else if (themeName == "mintchoc") {
    mintchocTheme();
  } else if (themeName == "cottonCandy") {
    cottonCandyTheme();
  } else if (themeName == "sunset") {
    sunsetTheme();
  } else if (themeName == "ocean") {
    oceanTheme();
  } else if (themeName == "forest") {
    forestTheme();
  } else if (themeName == "dracula") {
    draculaTheme();
  } else if (themeName == "monokai") {
    monokaiTheme();
  } else if (themeName == "hellokitty") {
    hellokittyTheme();
  } else {
    defaultTheme();
  }
}

function resetGame() {
  loadParagraph();
  clearInterval(timer);
  maxTime = parseInt(localStorage.getItem("testDuration") || "30");
  wordCount = parseInt(localStorage.getItem("wordCount") || "50");
  timeLeft = maxTime;
  charIndex = mistakes = isTyping = 0;
  inpField.value = "";
  timeTag.innerText = timeLeft;
  wpmTag.innerText = 0;
  mistakeTag.innerText = 0;
  cpmTag.innerText = 0;
}

loadParagraph();
setTheme();
timeTag.innerText = maxTime;

themesBtn.addEventListener("click", showThemeMenu);
settingsBtn.addEventListener("click", showSettingsMenu);

fontSizeSelect.value = localStorage.getItem("fontSize") || "2rem";
testDurationSelect.value = localStorage.getItem("testDuration") || "30";
wordCountSelect.value = localStorage.getItem("wordCount") || "50";

fontSizeSelect.addEventListener("change", (e) => {
  localStorage.setItem("fontSize", e.target.value);
  typingText.style.fontSize = e.target.value;
});

testDurationSelect.addEventListener("change", (e) => {
  localStorage.setItem("testDuration", e.target.value);
  resetGame();
});

wordCountSelect.addEventListener("change", (e) => {
  localStorage.setItem("wordCount", e.target.value);
  resetGame();
});

inpField.addEventListener("input", initTyping);

coffeeBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "coffee");
  setTheme();
  hideThemeMenu();
});

defaultBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "default");
  setTheme();
  hideThemeMenu();
});

codeBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "code");
  setTheme();
  hideThemeMenu();
});
beachBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "beach");
  setTheme();
  hideThemeMenu();
});

lavenderBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "lavender");
  setTheme();
  hideThemeMenu();
});
mintyfreshBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "mintyfresh");
  setTheme();
  hideThemeMenu();
});
cherryBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "cherry");
  setTheme();
  hideThemeMenu();
});
mintchocBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "mintchoc");
  setTheme();
  hideThemeMenu();
});
cottonCandyBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "cottonCandy");
  setTheme();
  hideThemeMenu();
});

sunsetBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "sunset");
  setTheme();
  hideThemeMenu();
});

oceanBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "ocean");
  setTheme();
  hideThemeMenu();
});

forestBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "forest");
  setTheme();
  hideThemeMenu();
});

draculaBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "dracula");
  setTheme();
  hideThemeMenu();
});

monokaiBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "monokai");
  setTheme();
  hideThemeMenu();
});

hellokittyBtn.addEventListener("click", function () {
  localStorage.setItem("theme", "hellokitty");
  setTheme();
  hideThemeMenu();
});

let secretCode = '';
let secretTimeout;

window.addEventListener('keydown', (event) => {
  if (themesWrapper.classList.contains('hidden')) {
    secretCode = '';
    return;
  }
  
  clearTimeout(secretTimeout);
  secretCode += event.key.toLowerCase();
  
  if (secretCode.includes('nini')) {
    hellokittyItem.classList.remove('hidden');
    hellokittyItem.classList.add('flex');
    secretCode = '';
  }
  
  secretTimeout = setTimeout(() => {
    secretCode = '';
  }, 1000);
});

document.body.appendChild(backdrop);

window.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    if (backdrop.classList.contains("active")) {
      hideAllMenus();
    } else {
      showThemeMenu();
    }
  }
});

mintchocBtn.addEventListener("mouseover", mintchocTheme);
mintchocBtn.addEventListener("mouseleave", setTheme);

mintyfreshBtn.addEventListener("mouseover", mintyfreshTheme);
mintyfreshBtn.addEventListener("mouseleave", setTheme);

cherryBtn.addEventListener("mouseover", cherryTheme);
cherryBtn.addEventListener("mouseleave", setTheme);

lavenderBtn.addEventListener("mouseover", lavenderTheme);
lavenderBtn.addEventListener("mouseleave", setTheme);

coffeeBtn.addEventListener("mouseover", coffeeTheme);
coffeeBtn.addEventListener("mouseleave", setTheme);

codeBtn.addEventListener("mouseover", codeTheme);
codeBtn.addEventListener("mouseleave", setTheme);

defaultBtn.addEventListener("mouseover", defaultTheme);
defaultBtn.addEventListener("mouseleave", setTheme);

cottonCandyBtn.addEventListener("mouseover", cottonCandyTheme);
cottonCandyBtn.addEventListener("mouseleave", setTheme);

beachBtn.addEventListener("mouseover", beachTheme);
beachBtn.addEventListener("mouseleave", setTheme);

sunsetBtn.addEventListener("mouseover", sunsetTheme);
sunsetBtn.addEventListener("mouseleave", setTheme);

oceanBtn.addEventListener("mouseover", oceanTheme);
oceanBtn.addEventListener("mouseleave", setTheme);

forestBtn.addEventListener("mouseover", forestTheme);
forestBtn.addEventListener("mouseleave", setTheme);

draculaBtn.addEventListener("mouseover", draculaTheme);
draculaBtn.addEventListener("mouseleave", setTheme);

monokaiBtn.addEventListener("mouseover", monokaiTheme);
monokaiBtn.addEventListener("mouseleave", setTheme);

hellokittyBtn.addEventListener("mouseover", hellokittyTheme);
hellokittyBtn.addEventListener("mouseleave", setTheme);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (backdrop.classList.contains("active")) {
      hideAllMenus();
    } else {
      resetGame();
    }
  }
});
