const { ipcRenderer } = require('electron');

/*buttons header functions*/
document.getElementById('minimize-btn').addEventListener('click', () => {
    ipcRenderer.send('minimize-window');
});
document.getElementById('close-btn').addEventListener('click', () => {
    ipcRenderer.send('close-window');
});

/*sounds hover and click*/
const hoverSound = document.getElementById('hover-sound');
const selectSound = document.getElementById('select-sound');
const cookieBtn = document.getElementById('cookie-btn');
const pancakesBtn = document.getElementById('pancakes-btn');
const orbSound = document.getElementById('orb-sound'); //
const mixingSound = document.getElementById('mixing-sound');

cookieBtn.addEventListener('mouseenter', () => {
    hoverSound.currentTime = 0.01;
    hoverSound.play();
});

pancakesBtn.addEventListener('mouseenter', () => {
    hoverSound.currentTime = 0.01;
    hoverSound.play();
});

cookieBtn.addEventListener('click', () => {
    selectSound.volume = 0.7;
    selectSound.currentTime = 0.01;
    showRecipePage('cookie');
    selectSound.play();
});

pancakesBtn.addEventListener('click', () => {
    selectSound.volume = 0.7;
    selectSound.currentTime = 0.01;
    showRecipePage('pancake');
    selectSound.play();
});

////////////////////////////////////////////

async function showRecipePage(recipeType) {
    try {
        const response = await fetch(`src/json/${recipeType}.json`);
        const recipe = await response.json();
        document.getElementById('app').style.backgroundColor = '#FFCAD4';
        document.getElementById('app').innerHTML = createRecipeHTML(recipe);
        const nextBtn = document.createElement('button');
        nextBtn.className = 'next-btn';
        nextBtn.innerHTML = `<img src="src/images/btntxt/letsgo.png" alt="Let's Go!">`;
        document.body.appendChild(nextBtn);

        nextBtn.addEventListener('click', () => {
            selectSound.currentTime = 0.1;
            selectSound.volume = 0.7;
            selectSound.play();
            nextBtn.remove();
            showMixingPage(recipe);
        });

    } catch (error) {
        console.error('Error loading recipe:', error);
    }
}

function createRecipeHTML(recipe) {
    return `
        <div class="recipe-page">
            <h2 class="recipe-title">${recipe.title}</h2>
            <div class="ingredients-list">
                ${recipe.ingredients.map(ingredient => `
                    <div class="ingredient-row">
                        <img src="${ingredient.image}" alt="${ingredient.name}">
                        <div class="ingredient-info">
                            <span class="ingredient-name">${ingredient.name}</span>
                            <span class="ingredient-quantity">${ingredient.quantity}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function showMixingPage(recipe) {
    document.getElementById('app').style.backgroundColor = '#FFCAD4';

    document.getElementById('app').innerHTML = `
        <div class="mixing-page">
            <img src="src/images/ingredients/bowl.png" class="bowl" alt="Bol">
            <div class="ingredients-falling-area"></div>
        </div>
    `;
    startFallingAnimation(recipe);
}
////////////////////////////////////////////

function startFallingAnimation(recipe) {
    const fallingArea = document.querySelector('.ingredients-falling-area');
    let delay = 0;

    recipe.ingredients.forEach((ingredient, index) => {
        setTimeout(() => {
            const fallingIngredient = document.createElement('img');
            fallingIngredient.src = ingredient.image;
            fallingIngredient.className = 'falling-ingredient';
            fallingIngredient.style.left = `${Math.random() * 30 + 30}%`;

            fallingArea.appendChild(fallingIngredient);

            orbSound.currentTime = 0;
            orbSound.volume = 0.5;
            orbSound.play();

            fallingIngredient.addEventListener('animationend', () => {
                fallingIngredient.style.opacity = '0';
                if (index === recipe.ingredients.length - 1) {
                    setTimeout(() => showMixingBowl(recipe), 300);
                }
            });

        }, delay);

        delay += 500;
    });
}

function showMixingBowl(recipe) {
    const mixingSound = document.getElementById('mixing-sound');
    mixingSound.currentTime = 0;
    mixingSound.volume = 0.7;
    mixingSound.play();

    document.getElementById('app').innerHTML = `
        <div class="mixing-page">
            <h2 class="mixing-title">Mixing...</h2>
            <img src="src/images/ingredients/bowlmixing.gif" class="bowl" alt="Bol">
        </div>
    `;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'next-btn-mixing';
    nextBtn.innerHTML = `<img src="src/images/btntxt/next.png" alt="Next">`;
    document.body.appendChild(nextBtn);

    nextBtn.addEventListener('click', () => {
        mixingSound.pause();
        mixingSound.currentTime = 0;

        selectSound.currentTime = 0.1;
        selectSound.volume = 0.7;
        selectSound.play();
        nextBtn.remove();
        showCookingPage(recipe);
    });
}

function showCookingPage(recipe) {
    const cookingImage = recipe.title === "Pancakes"
        ? "src/images/ingredients/cookingpancake.gif"
        : "src/images/ingredients/ovencooking.gif";

    document.getElementById('app').innerHTML = `
        <div class="cooking-page">
            <h2 class="cooking-title">Cooking...</h2>
            <img src="${cookingImage}" class="cooking-animation" alt="Cooking">
        </div>
    `;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'next-btn-cooking';
    nextBtn.innerHTML = `<img src="src/images/btntxt/next.png" alt="Next">`;
    document.body.appendChild(nextBtn);

    nextBtn.addEventListener('click', () => {
        // COUPE TOUS LES SONS
        hoverSound.pause();
        selectSound.pause();
        orbSound.pause();
        mixingSound.pause();

        selectSound.currentTime = 0.1;
        selectSound.volume = 0.7;
        selectSound.play();
        nextBtn.remove();
        showFinalPage(recipe);
    });
}

function showFinalPage(recipe) {
    const cuteMusic = document.getElementById('cute-music');
    cuteMusic.currentTime = 0;
    cuteMusic.volume = 0.7;
    cuteMusic.play();

    const finalImage = recipe.title === "Pancakes"
        ? "src/images/ingredients/pancake.gif"
        : "src/images/ingredients/cookiecooked.gif";

    document.getElementById('app').innerHTML = `
          <div class="final-page">
            <h2 class="final-title">Yummi !</h2>
            <img src="${finalImage}" class="final-animation" alt="Final Result">
          </div>
    `;
}