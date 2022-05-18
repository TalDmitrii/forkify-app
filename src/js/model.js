import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";

export const state = {
    recipe: {},
    bookmarks: [],
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
}

const createRecipeObject = function(data) {
    const {recipe} = data.data;

    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
    }
}

export const loadRecipe = async function(id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
        state.recipe = createRecipeObject(data);

        if (state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }
    } catch(err) {
        throw err;
    }
}

export const loadSearchResults = async function(query) {
    try {
        state.search.query = query;
        
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key }),
            }
        });
        
        state.search.page = 1;
    } catch(err) {
        throw err;
    }
}

export const getSearchResultPage = function(page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
}

export const updateRecipeServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
        return ing.quantity = (ing.quantity / state.recipe.servings) * newServings;
    });
    state.recipe.servings = newServings;
}

const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

const clearBookmarks = function() {
    localStorage.clear('bookmarks');
}

export const addBookmark = function(recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
}

export const removeBookmark = function(id) {
    // Remove bookmark
    const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
}

export const uploadRecipe = async function(newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
        .filter(entry => entry[0].includes('ingredient') && entry[1] !== '')
        .map(ing => {
            const ingArr = ing[1].split(',').map(el => el.trim());
            if (ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format');

            const [quantity, unit, description] = ingArr;

            return {
                quantity: quantity ? +quantity : null,
                unit,
                description,
            }
        });

        const recipe = {
            title: newRecipe.title,
            publisher: newRecipe.publisher,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            servings: +newRecipe.servings,
            cooking_time: +newRecipe.cookingTime,
            ingredients,
        }

        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
        
    } catch(err) {
        throw err;
    }
}

const init = function() {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
}

init();
