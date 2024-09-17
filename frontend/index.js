import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const recipeForm = document.getElementById('recipe-form');
    const recipesContainer = document.getElementById('recipes');

    recipeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const ingredients = document.getElementById('ingredients').value.split('\n');
        const instructions = document.getElementById('instructions').value;

        try {
            await backend.addRecipe(title, ingredients, instructions);
            alert('Recipe added successfully!');
            recipeForm.reset();
            await loadRecipes();
        } catch (error) {
            console.error('Error adding recipe:', error);
            alert('Failed to add recipe. Please try again.');
        }
    });

    async function loadRecipes() {
        try {
            const recipes = await backend.getAllRecipes();
            recipesContainer.innerHTML = '';
            for (const recipe of recipes) {
                const recipeElement = await createRecipeElement(recipe);
                recipesContainer.appendChild(recipeElement);
            }
        } catch (error) {
            console.error('Error loading recipes:', error);
            recipesContainer.innerHTML = '<p>Failed to load recipes. Please try again later.</p>';
        }
    }

    async function createRecipeElement(recipe) {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';

        const stars = await backend.getRecipeStars(recipe.id);
        const starsDisplay = stars !== null ? stars.toFixed(1) : 'N/A';

        recipeDiv.innerHTML = `
            <h3>${recipe.title}</h3>
            <p><strong>Ingredients:</strong></p>
            <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
            <p><strong>Instructions:</strong></p>
            <p>${recipe.instructions}</p>
            <p><strong>Stars:</strong> ${starsDisplay}</p>
            <button class="vote-btn" data-id="${recipe.id}" data-vote="up">👍</button>
            <button class="vote-btn" data-id="${recipe.id}" data-vote="down">👎</button>
        `;

        recipeDiv.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = Number(btn.dataset.id);
                const isUpvote = btn.dataset.vote === 'up';
                try {
                    await backend.voteRecipe(id, isUpvote);
                    await loadRecipes();
                } catch (error) {
                    console.error('Error voting:', error);
                    alert('Failed to vote. Please try again.');
                }
            });
        });

        return recipeDiv;
    }

    await loadRecipes();
});
