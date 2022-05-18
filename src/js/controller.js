import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//     module.hot.accept();
// }

const controlRecipes = async function() {
    try {
        const id = window.location.hash.slice(1);

        if (!id) return;

        recipeView.renderSpinner();
        resultsView.update(model.getSearchResultPage());
        bookmarksView.update(model.state.bookmarks);

        await model.loadRecipe(id);
        recipeView.render(model.state.recipe);
        
    } catch(err) {
        recipeView.renderError();
    }
}

const controlSearchResults = async function() {
    try {
        resultsView.renderSpinner();

        const query = searchView.getSearchQuery();
        if (!query) return;
        
        await model.loadSearchResults(query);

        // Render search results
        resultsView.render(model.getSearchResultPage());

        // Render pagination
        paginationView.render(model.state.search);
        
    } catch(err) {
        resultsView.renderError();
    }
}

const controlPagination = function(numPage) {
    // Render NEW results
    resultsView.render(model.getSearchResultPage(numPage));

    // Render NEW pagination
    paginationView.render(model.state.search);
}

const controlServings = function(countServings) {
    //Update the recipe servings(in state)
    model.updateRecipeServings(countServings);
    
    //Update the recipe view
    recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {
    // Add or remove bookmark
    if (!model.state.recipe.bookmarked) {
        model.addBookmark(model.state.recipe);
    } else {
        model.removeBookmark(model.state.recipe.id);
    }

    // Update the recipe view
    recipeView.update(model.state.recipe);

    // Render bookmarks
    bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
    bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
    try {
        // Show loading spinner
        addRecipeView.renderSpinner();

        // Upload the new recipe data
        await model.uploadRecipe(newRecipe);

        // Render recipe
        recipeView.render(model.state.recipe);

        // Success message
        addRecipeView.renderMessage();

        // Render bookmarkView
        bookmarksView.render(model.state.bookmarks);

        // Change ID in URL
        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        // Close form window
        setTimeout(function() {
            addRecipeView.toggleWindow();
        }, MODAL_CLOSE_SEC * 1000);

    } catch(err) {
        addRecipeView.renderError(err.message);
    }
}

const init = function() {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerServings(controlServings);
    recipeView.addHandlerBookmark(controlAddBookmark)
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
