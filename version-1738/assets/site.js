(function () {
    function each(list, callback) {
        Array.prototype.forEach.call(list, callback);
    }

    function setupNav() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var nav = document.querySelector("[data-main-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function setupCarousel() {
        var root = document.querySelector("[data-carousel]");
        if (!root) {
            return;
        }
        var slides = root.querySelectorAll("[data-slide]");
        var dots = root.querySelectorAll("[data-carousel-dot]");
        if (!slides.length || !dots.length) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(next) {
            index = (next + slides.length) % slides.length;
            each(slides, function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            each(dots, function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }
        function start() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        each(dots, function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                start();
            });
        });
        root.addEventListener("mouseenter", function () {
            clearInterval(timer);
        });
        root.addEventListener("mouseleave", start);
        start();
    }

    function setupSearch() {
        var scope = document.querySelector("[data-search-scope]");
        if (!scope) {
            return;
        }
        var input = scope.querySelector("[data-search-input]");
        var region = scope.querySelector("[data-region-filter]");
        var year = scope.querySelector("[data-year-filter]");
        var cards = document.querySelectorAll("[data-card]");
        var empty = document.querySelector("[data-empty-state]");
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q") || "";
        if (input && q) {
            input.value = q;
        }
        function normalize(value) {
            return (value || "").toString().trim().toLowerCase();
        }
        function apply() {
            var query = normalize(input ? input.value : "");
            var regionValue = normalize(region ? region.value : "");
            var yearValue = normalize(year ? year.value : "");
            var visible = 0;
            each(cards, function (card) {
                var searchText = normalize(card.getAttribute("data-search-text"));
                var cardRegion = normalize(card.getAttribute("data-region"));
                var cardYear = normalize(card.getAttribute("data-year"));
                var matched = true;
                if (query && searchText.indexOf(query) === -1) {
                    matched = false;
                }
                if (regionValue && cardRegion.indexOf(regionValue) === -1) {
                    matched = false;
                }
                if (yearValue && cardYear.indexOf(yearValue) === -1) {
                    matched = false;
                }
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }
        if (input) {
            input.addEventListener("input", apply);
        }
        if (region) {
            region.addEventListener("change", apply);
        }
        if (year) {
            year.addEventListener("change", apply);
        }
        apply();
    }

    window.initMoviePlayer = function (options) {
        if (!options || !options.video || !options.trigger || !options.url) {
            return;
        }
        var video = options.video;
        var trigger = options.trigger;
        var url = options.url;
        var started = false;
        var hls = null;
        function playVideo() {
            var playResult = video.play();
            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(function () {});
            }
        }
        function load() {
            if (started) {
                playVideo();
                return;
            }
            started = true;
            trigger.classList.add("is-hidden");
            video.controls = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
                video.addEventListener("loadedmetadata", playVideo, { once: true });
                video.load();
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 60
                });
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        hls.destroy();
                        video.src = url;
                        video.load();
                        playVideo();
                    }
                });
                return;
            }
            video.src = url;
            video.load();
            playVideo();
        }
        trigger.addEventListener("click", load);
        video.addEventListener("click", function () {
            if (!started) {
                load();
            }
        });
    };

    document.addEventListener("DOMContentLoaded", function () {
        setupNav();
        setupCarousel();
        setupSearch();
    });
})();
