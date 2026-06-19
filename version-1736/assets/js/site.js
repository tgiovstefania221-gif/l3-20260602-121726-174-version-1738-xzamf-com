(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === currentSlide);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === currentSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5600);
    }

    var searchInput = document.querySelector('[data-search-input]');
    var categorySelect = document.querySelector('[data-category-select]');
    var yearSelect = document.querySelector('[data-year-select]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var emptyState = document.querySelector('[data-empty-state]');

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function filterCards() {
        if (!cards.length) {
            return;
        }

        var keyword = normalize(searchInput ? searchInput.value : '');
        var category = categorySelect ? categorySelect.value : '';
        var year = yearSelect ? yearSelect.value : '';
        var visibleCount = 0;

        cards.forEach(function (card) {
            var text = normalize(card.getAttribute('data-search'));
            var cardCategory = card.getAttribute('data-category') || '';
            var cardYear = card.getAttribute('data-year') || '';
            var keywordMatched = !keyword || text.indexOf(keyword) !== -1;
            var categoryMatched = !category || cardCategory === category;
            var yearMatched = !year || cardYear === year;
            var visible = keywordMatched && categoryMatched && yearMatched;

            card.style.display = visible ? '' : 'none';

            if (visible) {
                visibleCount += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('show', visibleCount === 0);
        }
    }

    [searchInput, categorySelect, yearSelect].forEach(function (control) {
        if (control) {
            control.addEventListener('input', filterCards);
            control.addEventListener('change', filterCards);
        }
    });
})();
