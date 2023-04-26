const searchInput = document.querySelector('input[type="text"]');
const recipeContainer = document.querySelector('.recipe-container');

searchInput.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    const searchQuery = event.target.value;

    // Check if cached data exists for this search query
    const cachedData = localStorage.getItem(searchQuery);
    if (cachedData) {
      displayRecipes(JSON.parse(cachedData));
      return;
    }

    fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${searchQuery}&addRecipeInformation=true&apiKey=dce5af4a260946afb4832dee081bca97`)
      .then(response => response.json())
      .then(data => {
        displayRecipes(data.results);
        localStorage.setItem(searchQuery, JSON.stringify(data.results));
      })
      .catch(error => {
        console.error(error);
        alert('An error occurred while fetching the data. Please try again later.');
      });
  }
});

function displayRecipes(recipes) {
  recipeContainer.innerHTML = '';

  if (recipes.length === 0) {
    recipeContainer.innerHTML = '<p>No recipes found. Please try a different search.</p>';
    return;
  }

  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');

    const recipeImage = document.createElement('img');
    recipeImage.src = recipe.image;
    recipeImage.alt = recipe.title;
    recipeCard.appendChild(recipeImage);

    const recipeName = document.createElement('h2');
    recipeName.textContent = recipe.title;
    recipeCard.appendChild(recipeName);

    const recipeIngredients = document.createElement('p');
    recipeIngredients.innerHTML = recipe.summary;
    recipeCard.appendChild(recipeIngredients);

    recipeCard.addEventListener('click', () => {
      window.open(recipe.sourceUrl);
    });

    recipeContainer.appendChild(recipeCard);
  });
}
