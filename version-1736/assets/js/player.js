(function () {
    function setupPlayer(box) {
        var video = box.querySelector('video');
        var overlay = box.querySelector('[data-play-button]');
        var stream = video ? video.getAttribute('data-stream') : '';
        var ready = false;
        var hls = null;

        if (!video || !stream) {
            return;
        }

        function attachStream() {
            if (ready) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                ready = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                ready = true;
                return;
            }

            video.src = stream;
            ready = true;
        }

        function startPlay() {
            attachStream();
            box.classList.add('is-playing');
            video.play().catch(function () {});
        }

        if (overlay) {
            overlay.addEventListener('click', startPlay);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                startPlay();
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-player-box]')).forEach(setupPlayer);
})();
