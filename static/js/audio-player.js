/*  Audio card (_includes/audio-player.html): a small player over the entry's hidden <audio> element. Play and pause,
    a seek bar, a status line ("Listen · 26:26 left at 1.5×", or "Younger version · …"), the clock, speed pills, and,
    for an entry with a narration of its younger-readers text, Full/Younger pills.
    Until the file has loaded (it is not preloaded) the length comes from the entry's audio_duration, carried on the
    card as data-full-duration / data-young-duration. The chosen speed is kept in this browser under the key
    "listening-speed" and applied to the next entry too.
    The version pills and the reader toggle (static/js/reader-toggle.js) stay in step: the pills send a
    "reader:set" event, the toggle switches the text and answers with "reader:change", and the card follows that.
    Without JavaScript the native player shows and the card stays hidden.
*/
(function () {
  var KEY = 'listening-speed';
  var card = document.getElementById('js-audio-player');
  var audio = card && card.querySelector('audio');
  var ui = card && card.querySelector('.audio-card__ui');
  var play = document.getElementById('js-audio-play');
  var seek = document.getElementById('js-audio-seek');
  var status = document.getElementById('js-audio-status');
  var clock = document.getElementById('js-audio-clock');
  if (!card || !audio || !ui || !play || !seek || !status || !clock) return;
  var iconPlay = play.querySelector('.audio-card__icon--play');
  var iconPause = play.querySelector('.audio-card__icon--pause');
  var ratePills = Array.prototype.slice.call(card.querySelectorAll('[data-rate]'));
  var versionPills = Array.prototype.slice.call(card.querySelectorAll('[data-version]'));

  function parseDuration(text) {           // "39:39" or "1:02:03" -> seconds
    var parts = String(text || '').split(':').map(Number);
    if (!parts.length || parts.some(isNaN)) return 0;
    return parts.reduce(function (total, part) { return total * 60 + part; }, 0);
  }
  function format(seconds) {               // seconds -> "26:26" or "1:02:03"
    seconds = Math.max(0, Math.floor(seconds));
    var h = Math.floor(seconds / 3600), m = Math.floor(seconds % 3600 / 60), s = seconds % 60;
    var mm = (h ? String(m).padStart(2, '0') : String(m)), ss = String(s).padStart(2, '0');
    return h ? h + ':' + mm + ':' + ss : mm + ':' + ss;
  }
  function rateLabel(rate) { return (rate % 1 === 0 ? rate.toFixed(0) : String(rate)) + '×'; }
  function stored() {
    try { var v = parseFloat(localStorage.getItem(KEY)); return v > 0 ? v : 1; } catch (e) { return 1; }
  }
  function remember(rate) {
    try { if (rate === 1) localStorage.removeItem(KEY); else localStorage.setItem(KEY, String(rate)); } catch (e) {}
  }

  var versions = {
    full: { src: card.getAttribute('data-full-src'), duration: card.getAttribute('data-full-duration') || '' },
    young: { src: card.getAttribute('data-young-src'), duration: card.getAttribute('data-young-duration') || '' }
  };
  var version = 'full';
  var fallback = parseDuration(versions.full.duration);
  var scrubbing = false;

  function total() {
    return isFinite(audio.duration) && audio.duration > 0 ? audio.duration : fallback;
  }
  function pressed(pills, test) {
    pills.forEach(function (p) { p.setAttribute('aria-pressed', test(p) ? 'true' : 'false'); });
  }
  function update() {
    var rate = audio.playbackRate || 1, length = total(), now = audio.currentTime || 0;
    var left = Math.max(0, length - now), started = now > 0;
    pressed(ratePills, function (p) { return Math.abs(parseFloat(p.getAttribute('data-rate')) - rate) < 0.01; });
    pressed(versionPills, function (p) { return p.getAttribute('data-version') === version; });
    var who = version === 'young' ? 'Younger version' : 'Listen';
    var when = length ? format(left / rate) + (started ? ' left' : '') + (rate !== 1 ? ' at ' + rateLabel(rate) : '') : '';
    status.textContent = when ? who + ' · ' + when : who;
    clock.textContent = format(now) + ' / ' + format(length);
    if (!scrubbing) {
      seek.max = Math.max(1, Math.round(length));
      seek.value = Math.round(now);
    }
    var pct = length ? Math.min(100, 100 * (scrubbing ? seek.value : now) / length) : 0;
    seek.style.background = 'linear-gradient(90deg, var(--seek-fill) ' + pct + '%, var(--seek-track) ' + pct + '%)';
    var playing = !audio.paused && !audio.ended;
    iconPlay.hidden = playing; iconPause.hidden = !playing;
    play.setAttribute('aria-label', playing ? 'Pause the narration' : 'Play the narration');
  }
  function setRate(rate) {
    audio.defaultPlaybackRate = rate;
    audio.playbackRate = rate;
    remember(rate);
    update();
  }
  function setVersion(mode) {
    var next = (mode === 'young' && versions.young.src) ? 'young' : 'full';
    if (next === version && audio.getAttribute('src') === versions[next].src) { update(); return; }
    version = next;
    audio.pause();
    audio.setAttribute('src', versions[next].src);
    audio.load();                           // preload="none": nothing is fetched until play
    fallback = parseDuration(versions[next].duration);
    audio.playbackRate = audio.defaultPlaybackRate;
    update();
  }
  function showingYoung() {
    var young = document.getElementById('reader-young');
    return !!(young && !young.hidden);
  }

  play.addEventListener('click', function () {
    if (audio.paused || audio.ended) {
      var p = audio.play();
      if (p && p.catch) p.catch(function () { update(); });
    } else {
      audio.pause();
    }
  });
  seek.addEventListener('pointerdown', function () { scrubbing = true; });
  seek.addEventListener('keydown', function () { scrubbing = true; });
  seek.addEventListener('input', function () {
    scrubbing = true;
    var length = total();
    clock.textContent = format(seek.value) + ' / ' + format(length);
    var pct = length ? Math.min(100, 100 * seek.value / length) : 0;
    seek.style.background = 'linear-gradient(90deg, var(--seek-fill) ' + pct + '%, var(--seek-track) ' + pct + '%)';
  });
  seek.addEventListener('change', function () {
    scrubbing = false;
    audio.currentTime = Number(seek.value);
    update();
  });
  ratePills.forEach(function (p) {
    p.addEventListener('click', function () { setRate(parseFloat(p.getAttribute('data-rate'))); });
  });
  versionPills.forEach(function (p) {
    p.addEventListener('click', function () {
      var mode = p.getAttribute('data-version');
      if (document.getElementById('js-reader-toggle')) {
        try { document.dispatchEvent(new CustomEvent('reader:set', { detail: { mode: mode } })); return; } catch (e) {}
      }
      setVersion(mode);
    });
  });
  ['timeupdate', 'ratechange', 'loadedmetadata', 'durationchange', 'seeked', 'play', 'pause', 'ended', 'waiting', 'playing'].forEach(function (name) {
    audio.addEventListener(name, update);
  });
  // Some browsers reset the rate when the file starts loading; put the chosen one back.
  audio.addEventListener('play', function () { if (audio.playbackRate !== audio.defaultPlaybackRate) audio.playbackRate = audio.defaultPlaybackRate; });
  document.addEventListener('reader:change', function (e) { setVersion(e.detail && e.detail.mode); });

  audio.removeAttribute('controls');
  audio.hidden = true;
  setRate(stored());
  setVersion(showingYoung() ? 'young' : 'full');
  ui.hidden = false;
})();
