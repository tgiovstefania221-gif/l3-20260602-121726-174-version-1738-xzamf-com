(function() {
    var header = document.querySelector('[data-site-header]');
    var menuButton = document.querySelector('[data-mobile-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    function syncHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 20) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });

    if (menuButton && mobilePanel && header) {
        menuButton.addEventListener('click', function() {
            var opened = mobilePanel.classList.toggle('is-open');
            header.classList.toggle('is-open', opened);
            menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });
    }

    document.querySelectorAll('.site-search').forEach(function(form) {
        form.addEventListener('submit', function(event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                event.preventDefault();
                window.location.href = './search.html';
            }
        });
    });

    document.querySelectorAll('[data-hero-slider]').forEach(function(slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var current = Math.max(0, slides.findIndex(function(slide) {
            return slide.classList.contains('is-active');
        }));
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function(dot, dotIndex) {
                if (dotIndex === current) {
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.removeAttribute('aria-current');
                }
            });
        }

        function play() {
            stop();
            timer = window.setInterval(function() {
                show(current + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function(dot, index) {
            dot.addEventListener('click', function() {
                show(index);
                play();
            });
        });

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', play);

        if (slides.length > 1) {
            play();
        }
    });

    document.querySelectorAll('[data-filter-grid]').forEach(function(grid) {
        var root = grid.closest('.page-container') || document;
        var searchInput = root.querySelector('[data-card-search]');
        var regionSelect = root.querySelector('[data-card-region]');
        var yearSelect = root.querySelector('[data-card-year]');
        var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]'));

        function filterCards() {
            var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
            var region = regionSelect ? regionSelect.value : '';
            var year = yearSelect ? yearSelect.value : '';

            cards.forEach(function(card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre'),
                    card.textContent
                ].join(' ').toLowerCase();
                var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchedRegion = !region || card.getAttribute('data-region') === region;
                var matchedYear = !year || card.getAttribute('data-year') === year;
                card.classList.toggle('is-hidden', !(matchedKeyword && matchedRegion && matchedYear));
            });
        }

        [searchInput, regionSelect, yearSelect].forEach(function(control) {
            if (control) {
                control.addEventListener('input', filterCards);
                control.addEventListener('change', filterCards);
            }
        });
    });
})();
