/*  Audio speed: the row of buttons under the player in _includes/audio-player.html sets the playback rate of the
    entry's narration and shows how long is left at that speed ("26:26 left at 1.5×"). Until the file has loaded
    (the player does not preload), the length comes from the entry's audio_duration, carried on the row as
    data-duration. The chosen speed is kept in this browser under the key "listening-speed" and applied to the
    next entry too. Without JavaScript the row stays hidden and the native controls work as they are.
*/
(function () {
  var KEY = 'listening-speed';
  var row = document.getElementById('js-audio-speed');
  var player = row && row.closest('.audio-player');
  var audio = player && player.querySelector('audio');
  var eta = document.getElementById('js-audio-eta');
  var buttons = row ? Array.prototype.slice.call(row.querySelectorAll('.audio-player__rate')) : [];
  if (!row || !audio || !eta || !buttons.length) return;

  function parseDuration(text) {           // "39:39" or "1:02:03" -> seconds
    var parts = String(text || '').split(':').map(Number);
    if (!parts.length || parts.some(isNaN)) return 0;
    return parts.reduce(function (total, part) { return total * 60 + part; }, 0);
  }
  function format(seconds) {               // seconds -> "26:26" or "1:02:03"
    seconds = Math.max(0, Math.round(seconds));
    var h = Math.floor(seconds / 3600), m = Math.floor(seconds % 3600 / 60), s = seconds % 60;
    var mm = (h ? String(m).padStart(2, '0') : String(m)), ss = String(s).padStart(2, '0');
    return h ? h + ':' + mm + ':' + ss : mm + ':' + ss;
  }
  function label(rate) {
    return (rate % 1 === 0 ? rate.toFixed(0) : String(rate)) + '×';
  }
  function stored() {
    try { var v = parseFloat(localStorage.getItem(KEY)); return v > 0 ? v : 1; } catch (e) { return 1; }
  }
  function remember(rate) {
    try { if (rate === 1) localStorage.removeItem(KEY); else localStorage.setItem(KEY, String(rate)); } catch (e) {}
  }

  var fallback = parseDuration(row.getAttribute('data-duration'));

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
    eta.textContent = format(left / rate) + (started ? ' left' : '') + ' at ' + label(rate);
  }
  function setRate(rate) {
    audio.defaultPlaybackRate = rate;
    audio.playbackRate = rate;
    remember(rate);
    update();
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { setRate(parseFloat(b.getAttribute('data-rate'))); });
  });
  ['timeupdate', 'ratechange', 'loadedmetadata', 'durationchange', 'seeked', 'ended'].forEach(function (name) {
    audio.addEventListener(name, update);
  });
  // Some browsers reset the rate when the file starts loading; put the chosen one back.
  audio.addEventListener('play', function () { if (audio.playbackRate !== audio.defaultPlaybackRate) audio.playbackRate = audio.defaultPlaybackRate; });

  setRate(stored());
  row.hidden = false;
})();
