/*  Audio speed and version: the row of buttons under the player in _includes/audio-player.html sets the playback
    rate of the entry's narration and shows how long is left at that speed ("26:26 left at 1.5×"). Until the file
    has loaded (the player does not preload), the length comes from the entry's audio_duration, carried on the
    player as data-full-duration. The chosen speed is kept in this browser under the key "listening-speed" and
    applied to the next entry too.
    An entry with a narration of its younger-readers text (data-young-src on the player) plays whichever text is
    showing: the reader toggle (static/js/reader-toggle.js) announces each switch as a "reader:change" event on the
    document, and the player changes its file, label and time to match. Without JavaScript the row stays hidden
    and the native controls play the full narration.
*/
(function () {
  var KEY = 'listening-speed';
  var player = document.getElementById('js-audio-player');
  var row = document.getElementById('js-audio-speed');
  var audio = player && player.querySelector('audio');
  var label = document.getElementById('js-audio-label');
  var eta = document.getElementById('js-audio-eta');
  var buttons = row ? Array.prototype.slice.call(row.querySelectorAll('.audio-player__rate')) : [];
  if (!player || !row || !audio || !eta || !buttons.length) return;

  function parseDuration(text) {           // "39:39" or "1:02:03" -> seconds
    var parts = String(text || '').split(':').map(Number);
    if (!parts.length || parts.some(isNaN)) return 0;
    return parts.reduce(function (total, part) { return total * 60 + part; }, 0);
  }
  function format(seconds) {               // seconds -> "26:26" or "1:02:03"
    seconds = Math.max(0, Math.floor(seconds));   // floor, like the duration lines in the front matter
    var h = Math.floor(seconds / 3600), m = Math.floor(seconds % 3600 / 60), s = seconds % 60;
    var mm = (h ? String(m).padStart(2, '0') : String(m)), ss = String(s).padStart(2, '0');
    return h ? h + ':' + mm + ':' + ss : mm + ':' + ss;
  }
  function rateLabel(rate) {
    return (rate % 1 === 0 ? rate.toFixed(0) : String(rate)) + '×';
  }
  function stored() {
    try { var v = parseFloat(localStorage.getItem(KEY)); return v > 0 ? v : 1; } catch (e) { return 1; }
  }
  function remember(rate) {
    try { if (rate === 1) localStorage.removeItem(KEY); else localStorage.setItem(KEY, String(rate)); } catch (e) {}
  }

  var versions = {
    full: { src: player.getAttribute('data-full-src'), duration: player.getAttribute('data-full-duration') || '' },
    young: { src: player.getAttribute('data-young-src'), duration: player.getAttribute('data-young-duration') || '' }
  };
  var version = 'full';
  var fallback = parseDuration(versions.full.duration);

  function remaining() {
    var total = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : fallback;
    return Math.max(0, total - (audio.currentTime || 0));
  }
  function update() {
    var rate = audio.playbackRate || 1;
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', Math.abs(parseFloat(b.getAttribute('data-rate')) - rate) < 0.01 ? 'true' : 'false');
    });
    var left = remaining();
    if (!left) { eta.textContent = ''; return; }
    var started = audio.currentTime > 0;
    eta.textContent = format(left / rate) + (started ? ' left' : '') + ' at ' + rateLabel(rate);
  }
  function setRate(rate) {
    audio.defaultPlaybackRate = rate;
    audio.playbackRate = rate;
    remember(rate);
    update();
  }
  function setVersion(mode) {
    var next = (mode === 'young' && versions.young.src) ? 'young' : 'full';
    if (next === version && audio.getAttribute('src') === versions[next].src) return;
    version = next;
    var v = versions[next];
    audio.pause();
    audio.setAttribute('src', v.src);
    audio.load();                           // preload="none": nothing is fetched until play
    fallback = parseDuration(v.duration);
    if (label) label.textContent = (next === 'young' ? 'Younger version' : 'Listen') + (v.duration ? ' · ' + v.duration : '');
    audio.playbackRate = audio.defaultPlaybackRate;
    update();
  }
  function showingYoung() {
    var young = document.getElementById('reader-young');
    return !!(young && !young.hidden);
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { setRate(parseFloat(b.getAttribute('data-rate'))); });
  });
  ['timeupdate', 'ratechange', 'loadedmetadata', 'durationchange', 'seeked', 'ended'].forEach(function (name) {
    audio.addEventListener(name, update);
  });
  // Some browsers reset the rate when the file starts loading; put the chosen one back.
  audio.addEventListener('play', function () { if (audio.playbackRate !== audio.defaultPlaybackRate) audio.playbackRate = audio.defaultPlaybackRate; });
  document.addEventListener('reader:change', function (e) { setVersion(e.detail && e.detail.mode); });

  setRate(stored());
  setVersion(showingYoung() ? 'young' : 'full');
  row.hidden = false;
})();
