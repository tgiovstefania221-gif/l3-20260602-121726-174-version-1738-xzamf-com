(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function openMobileMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            menu.classList.toggle('open');
        });
    }

    function runLeadCarousel() {
        var carousel = document.querySelector('[data-lead-carousel]');
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.lead-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('.lead-dot'));
        var prev = carousel.querySelector('[data-lead-prev]');
        var next = carousel.querySelector('[data-lead-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }

        function restart() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                restart();
            });
        }

        show(0);
        restart();
    }

    function runSearchForms() {
        var forms = document.querySelectorAll('[data-search-form]');
        forms.forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = form.querySelector('input[name="q"]');
                var value = input ? input.value.trim() : '';
                var url = './search.html';
                if (value) {
                    url += '?q=' + encodeURIComponent(value);
                }
                window.location.href = url;
            });
        });
    }

    function runFilters() {
        var input = document.querySelector('[data-filter-input]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
        var empty = document.querySelector('[data-empty]');
        if (!input || !cards.length) {
            return;
        }

        function apply(value) {
            var query = value.trim().toLowerCase();
            var visible = 0;
            cards.forEach(function (card) {
                var text = (card.getAttribute('data-index') || card.textContent || '').toLowerCase();
                var matched = !query || text.indexOf(query) !== -1;
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('show', visible === 0);
            }
        }

        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        if (initial) {
            input.value = initial;
        }
        input.addEventListener('input', function () {
            apply(input.value);
        });
        apply(input.value);
    }

    function initStream(video, url) {
        if (!url || video.getAttribute('data-ready') === '1') {
            return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ enableWorker: true });
            hls.loadSource(url);
            hls.attachMedia(video);
            video._hls = hls;
        } else {
            video.src = url;
        }
        video.setAttribute('data-ready', '1');
    }

    function runPlayers() {
        var shells = document.querySelectorAll('[data-player]');
        shells.forEach(function (shell) {
            var video = shell.querySelector('video');
            var button = shell.querySelector('[data-play-button]');
            if (!video) {
                return;
            }
            var url = video.getAttribute('data-m3u8');

            function start() {
                initStream(video, url);
                if (button) {
                    button.classList.add('hidden');
                }
                var play = video.play();
                if (play && typeof play.catch === 'function') {
                    play.catch(function () {});
                }
            }

            if (button) {
                button.addEventListener('click', start);
            }
            video.addEventListener('click', function () {
                if (video.paused) {
                    start();
                }
            });
        });
    }

    ready(function () {
        openMobileMenu();
        runLeadCarousel();
        runSearchForms();
        runFilters();
        runPlayers();
    });
})();
