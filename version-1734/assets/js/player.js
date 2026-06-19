(function() {
    function initMoviePlayer(source) {
        var video = document.getElementById('movie-video');
        var playButton = document.getElementById('play-control');
        var status = document.getElementById('player-status');
        var shell = video ? video.closest('.player-shell') : null;
        var started = false;
        var hls = null;

        if (!video || !playButton || !shell || !source) {
            return;
        }

        function setStatus(message) {
            if (status) {
                status.textContent = message || '';
            }
        }

        function markPlaying() {
            shell.classList.add('is-playing');
            setStatus('');
        }

        function attemptPlay() {
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function() {
                    shell.classList.remove('is-playing');
                });
            }
        }

        function recoverFatalError(data) {
            if (!hls || !data || !data.fatal) {
                return;
            }
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
                return;
            }
            if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
                return;
            }
            setStatus('播放暂时不可用');
        }

        function start() {
            if (started) {
                attemptPlay();
                return;
            }
            started = true;
            markPlaying();

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                video.load();
                attemptPlay();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.attachMedia(video);
                hls.on(Hls.Events.MEDIA_ATTACHED, function() {
                    hls.loadSource(source);
                    attemptPlay();
                });
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    attemptPlay();
                });
                hls.on(Hls.Events.ERROR, function(event, data) {
                    recoverFatalError(data);
                });
                return;
            }

            video.src = source;
            video.load();
            attemptPlay();
        }

        playButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            start();
        });

        shell.addEventListener('click', function(event) {
            if (!started && event.target !== video) {
                start();
            }
        });

        video.addEventListener('play', markPlaying);
        video.addEventListener('error', function() {
            setStatus('播放暂时不可用');
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
