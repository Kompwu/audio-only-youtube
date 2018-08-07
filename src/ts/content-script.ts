function makeSetAudioURL(
  videoElement: HTMLVideoElement,
  url: string
): void | any {
  function setBackgroundImage(): void {
    let vid = window.location.search.split('v=')[1];
    const pos = vid.indexOf('&');
    if (pos !== -1) {
      vid = vid.substring(0, pos);
    }
    const bgUrl = `https://img.youtube.com/vi/${vid}/0.jpg`;
    videoElement.style.background = `transparent url(${bgUrl}) no-repeat center`;
    videoElement.style.backgroundSize = '80%';
  }

  function setNoBackgroundImageStyle(): void {
    const gradientTop = document.querySelector('.ytp-gradient-top');
    const gradientBottom = document.querySelector('.ytp-gradient-bottom');
    const moviePlayer = document.getElementById('movie_player');
    const rightControls = document.querySelector('.ytp-right-controls');
    const tooltip = document.querySelector(
      '.ytp-tooltip.ytp-bottom.ytp-preview'
    );
    const mainVideo = document.querySelector(
      'video.video-stream.html5-main-video'
    );
    const chromeBottom = document.querySelector('.ytp-chrome-bottom');
    const playerContanerInner = document.getElementById(
      'player-container-inner'
    );
    if (gradientTop && gradientBottom && rightControls && tooltip) {
      gradientTop.remove();
      gradientBottom.remove();
      rightControls.remove();
      tooltip.remove();
    }
    if (mainVideo && chromeBottom) {
      mainVideo.removeAttribute('style');
      chromeBottom.removeAttribute('style');
    }
    if (moviePlayer && playerContanerInner) {
      moviePlayer.style.height = null;
      playerContanerInner.style.paddingTop = '6rem';
    }
  }

  function setAudioURL(): void {
    if (videoElement.src !== url) {
      videoElement.pause();
      videoElement.src = url;
      videoElement.currentTime = 0;
      videoElement.play();
      chrome.storage.sync.get({ showThumbnail: true }, (item) => {
        item.showThumbnail ? setBackgroundImage() : setNoBackgroundImageStyle();
      });
    }
  }

  setAudioURL();
  return setAudioURL;
}

chrome.runtime.onMessage.addListener((request) => {
  const videoElement = window.document.getElementsByTagName('video')[0];
  if (typeof videoElement !== 'undefined') {
    const url = request.url;

    const videoRect = videoElement.getBoundingClientRect();
    if (videoRect.width === 0 && videoRect.height === 0) {
      return;
    }

    videoElement.onloadeddata = makeSetAudioURL(videoElement, url);
    if (document.getElementsByClassName('audio_only_div').length === 0) {
      const extensionAlert = document.createElement('div');
      extensionAlert.className = 'audio_only_div';

      const alertText = document.createElement('p');
      alertText.className = 'alert_text';
      alertText.innerHTML = `Audio Only. To watch video,
    click on the extension icon above and refresh your page.`;

      extensionAlert.appendChild(alertText);
      const parent = videoElement.parentNode!.parentNode;
      parent!.appendChild(extensionAlert);
    }
  }
});
