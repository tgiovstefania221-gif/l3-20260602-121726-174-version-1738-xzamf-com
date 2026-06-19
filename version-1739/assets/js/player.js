(function () {
  function attachPlayer(video, sourceUrl) {
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls();
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
      video.addEventListener('loadedmetadata', function () {
        video.play().catch(function () {});
      }, { once: true });
      return;
    }
    video.src = sourceUrl;
    video.play().catch(function () {});
  }

  window.initMoviePlayer = function (sourceUrl) {
    var video = document.getElementById('movie-player');
    var cover = document.querySelector('.player-cover');
    var button = document.querySelector('.player-start');
    var started = false;
    if (!video) {
      return;
    }

    function start() {
      if (cover) {
        cover.classList.add('is-hidden');
      }
      if (!started) {
        started = true;
        attachPlayer(video, sourceUrl);
        return;
      }
      video.play().catch(function () {});
    }

    if (button) {
      button.addEventListener('click', start);
    }
    if (cover) {
      cover.addEventListener('click', start);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        video.play().catch(function () {});
      } else {
        video.pause();
      }
    });
  };
})();
