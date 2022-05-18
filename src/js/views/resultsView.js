import View from './View.js';
import previewView from './previewView.js';

import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
    _parentEl = document.querySelector('.results');
    _errorMessage = 'We could not find any matches. Please try something else :)';
    _message = '';

    _generateMarkup() {
        return this._data.map(result => previewView.render(result, false)).join('');
    }
}

export default new ResultsView();