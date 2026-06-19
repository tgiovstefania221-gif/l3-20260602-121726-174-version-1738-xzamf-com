(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function bindNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function bindHero() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function bindFilter() {
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-filter-card]"));
    if (!cards.length) {
      return;
    }
    var input = document.querySelector("[data-filter-input]");
    var year = document.querySelector("[data-filter-year]");
    var category = document.querySelector("[data-filter-category]");
    var reset = document.querySelector("[data-filter-reset]");

    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      var yearValue = year ? year.value : "";
      var categoryValue = category ? category.value : "";
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-filter-text") || "").toLowerCase();
        var cardYear = card.getAttribute("data-year") || "";
        var cardCategory = card.getAttribute("data-category") || "";
        var visible = true;
        if (keyword && text.indexOf(keyword) === -1) {
          visible = false;
        }
        if (yearValue && cardYear !== yearValue) {
          visible = false;
        }
        if (categoryValue && cardCategory !== categoryValue) {
          visible = false;
        }
        card.classList.toggle("is-hidden", !visible);
      });
    }

    if (input) {
      input.addEventListener("input", apply);
      var query = new URLSearchParams(window.location.search).get("q");
      if (query) {
        input.value = query;
      }
    }
    if (year) {
      year.addEventListener("change", apply);
    }
    if (category) {
      category.addEventListener("change", apply);
    }
    if (reset) {
      reset.addEventListener("click", function () {
        if (input) {
          input.value = "";
        }
        if (year) {
          year.value = "";
        }
        if (category) {
          category.value = "";
        }
        apply();
      });
    }
    apply();
  }

  ready(function () {
    bindNav();
    bindHero();
    bindFilter();
  });
})();
