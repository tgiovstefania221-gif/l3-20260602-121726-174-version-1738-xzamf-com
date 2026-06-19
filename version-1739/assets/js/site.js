(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, idx) {
      slide.classList.toggle('active', idx === current);
    });
    dots.forEach(function (dot, idx) {
      dot.classList.toggle('active', idx === current);
    });
  }

  dots.forEach(function (dot, idx) {
    dot.addEventListener('click', function () {
      showSlide(idx);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var cardSearch = document.querySelector('[data-card-search]');
  var regionSelect = document.querySelector('[data-region-filter]');
  var typeSelect = document.querySelector('[data-type-filter]');
  var yearSelect = document.querySelector('[data-year-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

  function filterCards() {
    var word = cardSearch ? cardSearch.value.trim().toLowerCase() : '';
    var region = regionSelect ? regionSelect.value : '';
    var type = typeSelect ? typeSelect.value : '';
    var year = yearSelect ? yearSelect.value : '';
    cards.forEach(function (card) {
      var haystack = [card.dataset.title, card.dataset.region, card.dataset.type, card.dataset.year, card.dataset.genre].join(' ').toLowerCase();
      var matched = true;
      if (word && haystack.indexOf(word) === -1) {
        matched = false;
      }
      if (region && card.dataset.region.indexOf(region) === -1) {
        matched = false;
      }
      if (type && card.dataset.type !== type) {
        matched = false;
      }
      if (year && card.dataset.year !== year) {
        matched = false;
      }
      card.classList.toggle('hidden-card', !matched);
    });
  }

  [cardSearch, regionSelect, typeSelect, yearSelect].forEach(function (control) {
    if (control) {
      control.addEventListener('input', filterCards);
      control.addEventListener('change', filterCards);
    }
  });

  var globalInput = document.querySelector('[data-global-search]');
  var globalButton = document.querySelector('[data-global-search-button]');
  var globalResults = document.querySelector('[data-global-results]');

  function runGlobalSearch() {
    if (!globalInput || !globalResults || !Array.isArray(window.movieSearchIndex)) {
      return;
    }
    var q = globalInput.value.trim().toLowerCase();
    if (!q) {
      globalResults.classList.remove('active');
      globalResults.innerHTML = '';
      return;
    }
    var results = window.movieSearchIndex.filter(function (item) {
      return [item.title, item.region, item.type, item.year, item.genre].join(' ').toLowerCase().indexOf(q) !== -1;
    }).slice(0, 12);
    globalResults.innerHTML = results.map(function (item) {
      return '<a href="' + item.url + '"><strong>' + item.title + '</strong><span>' + item.year + ' · ' + item.region + ' · ' + item.type + '</span></a>';
    }).join('');
    globalResults.classList.toggle('active', results.length > 0);
  }

  if (globalButton) {
    globalButton.addEventListener('click', runGlobalSearch);
  }
  if (globalInput) {
    globalInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        runGlobalSearch();
      }
    });
    globalInput.addEventListener('input', runGlobalSearch);
  }
})();
