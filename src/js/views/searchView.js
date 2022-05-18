class SearchView {
    _parentEl = document.querySelector('.search');
    _searchField = this._parentEl.querySelector('.search__field');

    addHandlerSearch(handler) {
        this._parentEl.addEventListener('submit', function(e) {
            e.preventDefault();
            handler();
        });
    }

    getSearchQuery() {
        const query = this._searchField.value;
        this._clearSearchField()
        return query;
    }

    _clearSearchField() {
        this._searchField.value = '';
    }
}

export default new SearchView();