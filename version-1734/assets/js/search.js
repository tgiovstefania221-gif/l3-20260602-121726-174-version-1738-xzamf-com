(function() {
    var form = document.querySelector('[data-search-page-form]');
    var input = form ? form.querySelector('input[name="q"]') : null;
    var results = document.querySelector('[data-search-results]');
    var summary = document.querySelector('[data-search-summary]');
    var categorySelect = document.querySelector('[data-search-category]');
    var sortSelect = document.querySelector('[data-search-sort]');
    var data = Array.isArray(window.SEARCH_INDEX) ? window.SEARCH_INDEX : [];

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function params() {
        return new URLSearchParams(window.location.search);
    }

    function setUrl(query) {
        var searchParams = params();
        if (query) {
            searchParams.set('q', query);
        } else {
            searchParams.delete('q');
        }
        var next = window.location.pathname + (searchParams.toString() ? '?' + searchParams.toString() : '');
        window.history.replaceState({}, '', next);
    }

    function cardTemplate(item) {
        var tags = Array.isArray(item.tags) ? item.tags.slice(0, 3) : [];
        return [
            '<article class="movie-card">',
            '    <a class="movie-poster" href="' + escapeHtml(item.url) + '" aria-label="观看' + escapeHtml(item.title) + '">',
            '        <img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
            '        <span class="play-chip">播放</span>',
            '    </a>',
            '    <div class="movie-card-body">',
            '        <div class="movie-meta-row">',
            '            <span>' + escapeHtml(item.region) + '</span>',
            '            <span>' + escapeHtml(item.year) + '</span>',
            '            <span>' + escapeHtml(item.type) + '</span>',
            '        </div>',
            '        <h3><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h3>',
            '        <p>' + escapeHtml(item.oneLine) + '</p>',
            '        <div class="tag-list">' + tags.map(function(tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join('') + '</div>',
            '    </div>',
            '</article>'
        ].join('');
    }

    function score(item, query) {
        if (!query) {
            return 1;
        }
        var fields = [item.title, item.region, item.type, item.year, item.genre, item.categoryName, item.oneLine, (item.tags || []).join(' ')].join(' ').toLowerCase();
        var q = query.toLowerCase();
        var value = fields.indexOf(q) === -1 ? 0 : 10;
        if (String(item.title).toLowerCase().indexOf(q) !== -1) {
            value += 10;
        }
        return value;
    }

    function render() {
        if (!results || !summary) {
            return;
        }
        var query = input ? input.value.trim() : '';
        var category = categorySelect ? categorySelect.value : '';
        var sort = sortSelect ? sortSelect.value : 'relevance';
        var matched = data
            .map(function(item) {
                return { item: item, score: score(item, query) };
            })
            .filter(function(entry) {
                var categoryOk = !category || entry.item.category === category;
                var queryOk = !query || entry.score > 0;
                return categoryOk && queryOk;
            });

        if (sort === 'year-desc') {
            matched.sort(function(a, b) { return Number(b.item.year || 0) - Number(a.item.year || 0); });
        } else if (sort === 'year-asc') {
            matched.sort(function(a, b) { return Number(a.item.year || 0) - Number(b.item.year || 0); });
        } else {
            matched.sort(function(a, b) { return b.score - a.score || Number(b.item.year || 0) - Number(a.item.year || 0); });
        }

        var limited = matched.slice(0, 120).map(function(entry) { return entry.item; });
        summary.textContent = limited.length ? '找到 ' + matched.length + ' 部相关影片' : '未找到相关影片';
        results.innerHTML = limited.map(cardTemplate).join('');
    }

    if (input) {
        var initial = params().get('q') || '';
        input.value = initial;
    }

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            setUrl(input ? input.value.trim() : '');
            render();
        });
    }

    [input, categorySelect, sortSelect].forEach(function(control) {
        if (control) {
            control.addEventListener('input', render);
            control.addEventListener('change', render);
        }
    });

    render();
})();
