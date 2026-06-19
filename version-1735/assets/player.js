(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function bindPlayer(box) {
    var video = box.querySelector(".js-player-video");
    var button = box.querySelector(".js-player-start");
    var url = box.getAttribute("data-video-url");
    var hlsInstance = null;
    var loaded = false;
    if (!video || !button || !url) {
      return;
    }

    function load() {
      if (loaded) {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
      } else {
        video.src = url;
      }
      loaded = true;
    }

    function start() {
      load();
      box.classList.add("is-playing");
      video.setAttribute("controls", "controls");
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    button.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (!loaded) {
        start();
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll(".player-wrap")).forEach(bindPlayer);
  });
})();
