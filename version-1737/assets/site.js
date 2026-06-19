(function () {
    const menuButton = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-site-menu]");

    if (menuButton && menu) {
        menuButton.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    const hero = document.querySelector("[data-hero]");

    if (hero) {
        const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        let index = 0;

        const activate = function (nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        };

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                activate(Number(dot.getAttribute("data-hero-dot")) || 0);
            });
        });

        window.setInterval(function () {
            activate(index + 1);
        }, 5200);
    }

    const applyQueryParameter = function () {
        const input = document.querySelector("[data-query-input]");

        if (!input) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const query = params.get("q");

        if (query) {
            input.value = query;
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }
    };

    const setupCards = function (scope) {
        const input = scope.querySelector(".js-card-search");
        const buttons = Array.from(scope.querySelectorAll("[data-filter-value]"));
        const sort = scope.querySelector(".js-card-sort");
        const grid = scope.querySelector("[data-card-grid]");

        if (!grid) {
            return;
        }

        const cards = Array.from(grid.querySelectorAll(".js-card"));
        let activeFilter = "all";

        const matchCard = function (card) {
            const query = input ? input.value.trim().toLowerCase() : "";
            const text = [
                card.getAttribute("data-title") || "",
                card.getAttribute("data-meta") || "",
                card.getAttribute("data-year") || "",
                card.getAttribute("data-type") || ""
            ].join(" ").toLowerCase();
            const filterText = activeFilter.toLowerCase();
            const matchesQuery = !query || text.indexOf(query) !== -1;
            const matchesFilter = activeFilter === "all" || text.indexOf(filterText) !== -1;

            return matchesQuery && matchesFilter;
        };

        const apply = function () {
            cards.forEach(function (card) {
                card.classList.toggle("is-hidden", !matchCard(card));
            });
        };

        const applySort = function () {
            if (!sort) {
                return;
            }

            const value = sort.value;
            const sorted = cards.slice();

            if (value === "heat") {
                sorted.sort(function (a, b) {
                    return Number(b.getAttribute("data-heat")) - Number(a.getAttribute("data-heat"));
                });
            }

            if (value === "rating") {
                sorted.sort(function (a, b) {
                    return Number(b.getAttribute("data-rating")) - Number(a.getAttribute("data-rating"));
                });
            }

            if (value === "year") {
                sorted.sort(function (a, b) {
                    return String(b.getAttribute("data-year")).localeCompare(String(a.getAttribute("data-year")));
                });
            }

            if (value === "default") {
                sorted.sort(function (a, b) {
                    return cards.indexOf(a) - cards.indexOf(b);
                });
            }

            sorted.forEach(function (card) {
                grid.appendChild(card);
            });
        };

        if (input) {
            input.addEventListener("input", apply);
        }

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                activeFilter = button.getAttribute("data-filter-value") || "all";
                buttons.forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                apply();
            });
        });

        if (sort) {
            sort.addEventListener("change", function () {
                applySort();
                apply();
            });
            applySort();
        }

        apply();
    };

    document.querySelectorAll("[data-card-scope]").forEach(setupCards);
    applyQueryParameter();
})();
