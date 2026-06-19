(function () {
    function initMoviePlayer(source, options) {
        const video = document.querySelector(options.player);
        const overlay = document.querySelector(options.overlay);
        let hlsInstance = null;
        let loaded = false;

        if (!video) {
            return;
        }

        const reveal = function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        };

        const attach = function () {
            if (loaded) {
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal || !hlsInstance) {
                        return;
                    }

                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hlsInstance.startLoad();
                        return;
                    }

                    if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hlsInstance.recoverMediaError();
                        return;
                    }

                    hlsInstance.destroy();
                });
            } else {
                video.src = source;
            }

            loaded = true;
        };

        const play = function () {
            attach();
            reveal();
            video.play().catch(function () {});
        };

        if (overlay) {
            overlay.addEventListener("click", play);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });

        video.addEventListener("play", reveal);

        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
