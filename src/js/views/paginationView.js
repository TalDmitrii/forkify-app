import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentEl = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentEl.addEventListener('click', function(e) {
            const target = e.target.closest('.btn--inline');
            
            if (!target) return;
            
            handler(+target.dataset.goto);
        });
    }

    _generateMarkup() {
        const searchData = this._data;
        const curPage = searchData.page;
        const numPages = Math.ceil(searchData.results.length / searchData.resultsPerPage);

        // Page 1, and there are other pages
        if (curPage === 1 && numPages > 1) {
            return this._generateMarkuBtnNext(curPage + 1);
        }
        
        // Last page
        if (curPage === numPages && numPages > 1) {
            return this._generateMarkuBtnPrev(numPages - 1);
        }
        
        // Other page
        // if (curPage < numPages) { ?????????????????
        if (curPage !== 1 && curPage < numPages) {
            return this._generateMarkuBtnPrev(curPage - 1) + this._generateMarkuBtnNext(curPage + 1);
        }
        
        // Page 1, and there are NO other pages
        return ''
    }

    _generateMarkuBtnPrev(pageNum) {
        return `
            <button class="btn--inline pagination__btn--prev" data-goto="${pageNum}">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${pageNum}</span>
            </button>
        `;
    }

    _generateMarkuBtnNext(pageNum) {
        return `
            <button class="btn--inline pagination__btn--next" data-goto="${pageNum}">
                <span>Page ${pageNum}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
    }
}

export default new PaginationView();