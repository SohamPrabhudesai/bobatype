const themesWrapper = document.querySelector("#themes-wrapper")
const mainWrapper = document.querySelector("#mainwrap")
const backdrop = document.createElement('div')
const themeDef = document.querySelector(":root").style
const defaultBtn = document.getElementById("default")
const coffeeBtn = document.getElementById("coffee")
const codeBtn = document.getElementById("code")
backdrop.classList.add('backdrop');



function showThemeMenu() {
    themesWrapper.classList.remove('hidden');
    backdrop.classList.add('active');
}

function hideThemeMenu() {
    themesWrapper.classList.add('hidden');
    backdrop.classList.remove('active');
}




function coffeeTheme() {
    themeDef.setProperty('--main-bg-color','#CEB18D')
    themeDef.setProperty('--boba-color','rgb(25 16 14)')
    themeDef.setProperty('--p-text-color','rgb(255 255 255)')
    themeDef.setProperty('--correct-color','rgb(25 16 14)')
    themeDef.setProperty('--incorrect-color','rgb(230, 84, 99)')
    themeDef.setProperty('--results-color','rgb(25 16 14)')
    themeDef.setProperty('--caret-color','rgb(25 16 14)')
    
   

}
function defaultTheme() {
    themeDef.setProperty('--main-bg-color','rgb(30 41 59)')
    themeDef.setProperty('--boba-color','rgb(255 255 255)')
    themeDef.setProperty('--p-text-color','rgb(71 85 105)')
    themeDef.setProperty('--correct-color','rgb(255 255 255)')
    themeDef.setProperty('--incorrect-color','rgb(202, 71, 84)')
    themeDef.setProperty('--results-color','rgb(255 255 255)')
    themeDef.setProperty('--caret-color','rgb(0 122 204)')
}

function codeTheme() {
    themeDef.setProperty('--main-bg-color','rgb(0,0,0)')
    themeDef.setProperty('--boba-color','rgb(53, 160, 0)')
    themeDef.setProperty('--p-text-color','rgb(22, 65, 0)')
    themeDef.setProperty('--correct-color','rgb(53, 160, 0)')
    themeDef.setProperty('--incorrect-color','rgb(202, 71, 84)')
    themeDef.setProperty('--results-color','rgb(22, 65, 0)')
    themeDef.setProperty('--caret-color','rgb(53, 160, 0)')

}


function setTheme() {
    let themeName = localStorage.getItem("theme");
    if (themeName == "code") {
        codeTheme();
    }
    else if (themeName == 'coffee') {
        coffeeTheme();
    }
    else if (themeName == 'default'){
        defaultTheme();
    }
    else {
        defaultTheme();
    }
}

setTheme();

coffeeBtn.addEventListener("click", function() {
    localStorage.setItem("theme", "coffee");
    setTheme();
  });

  defaultBtn.addEventListener('click', function() {
    localStorage.setItem("theme", "default");
    setTheme();
    
  });

  codeBtn.addEventListener('click', function() {
    localStorage.setItem("theme", "code");
    setTheme();
    
  });


document.body.appendChild(backdrop);

window.addEventListener('keydown', event =>{
    if (event.key === 'Tab')
{    if (backdrop.classList.contains('active')) {
        hideThemeMenu();
    } else {
        showThemeMenu();
    }
}});

