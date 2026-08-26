(function () {
    var STORAGE_KEY = 'vb-color-theme';

    function currentTheme() {
        var stored = null;
        try {
            stored = localStorage.getItem(STORAGE_KEY);
        } catch (e) {}
        if (stored === 'original' || stored === 'tierra') return stored;
        return document.documentElement.getAttribute('data-theme') === 'original' ? 'original' : 'tierra';
    }

    function applyTheme(theme) {
        var next = theme === 'original' ? 'original' : 'tierra';
        document.documentElement.setAttribute('data-theme', next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch (e) {}
        document.querySelectorAll('.theme-switcher-btn').forEach(function (btn) {
            btn.setAttribute('aria-pressed', btn.getAttribute('data-theme-value') === next ? 'true' : 'false');
        });
    }

    applyTheme(currentTheme());

    document.addEventListener('click', function (event) {
        var btn = event.target.closest('.theme-switcher-btn');
        if (!btn) return;
        applyTheme(btn.getAttribute('data-theme-value'));
    });

    window.addEventListener('storage', function (event) {
        if (event.key === STORAGE_KEY && (event.newValue === 'original' || event.newValue === 'tierra')) {
            applyTheme(event.newValue);
        }
    });
})();
