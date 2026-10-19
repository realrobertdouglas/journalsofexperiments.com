/*  Reader toggle: a page with a `young:` include in its front matter carries two texts, the full one (#reader-full)
    and one for younger readers (#reader-young), and the line in _includes/reader-toggle.html swaps them, as do the audio card's
    Full/Younger pills (a "reader:set" event).
    The full text shows by default and without JavaScript. "#young" in the address opens the younger version;
    otherwise the last choice made in this browser, kept under the key "reading", is used. Each switch is
    announced as a "reader:change" event on the document, which the audio player listens for.
*/
(function () {
  var KEY = 'reading';
  var toggle = document.getElementById('js-reader-toggle');
  var button = toggle && toggle.querySelector('button');
  var full = document.getElementById('reader-full');
  var young = document.getElementById('reader-young');
  if (!toggle || !button || !full || !young) return;

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function remember(mode) {
    try {
      if (mode === 'young') localStorage.setItem(KEY, 'young');
      else localStorage.removeItem(KEY);
    } catch (e) {}
  }
  function show(mode) {
    var isYoung = mode === 'young';
    full.hidden = isYoung;
    young.hidden = !isYoung;
    button.setAttribute('aria-pressed', isYoung ? 'true' : 'false');
    button.textContent = isYoung ? 'Read the full piece' : 'Read a version for younger readers';
    var state = toggle.querySelector('.reader-toggle__state');
    if (state) state.textContent = isYoung ? 'Reading the younger version' : 'Reading the full piece';
    try {                                   // the audio player (static/js/audio-speed.js) follows the text that is showing
      document.dispatchEvent(new CustomEvent('reader:change', { detail: { mode: mode } }));
    } catch (e) {}
  }
  function setHash(mode) {
    if (!history.replaceState) return;
    if (mode === 'young') history.replaceState(null, '', '#young');
    else if (location.hash === '#young') history.replaceState(null, '', location.pathname + location.search);
  }

  function choose(mode) {
    show(mode);
    remember(mode);
    setHash(mode);
  }
  button.addEventListener('click', function () { choose(young.hidden ? 'young' : 'full'); });
  document.addEventListener('reader:set', function (e) {   // the audio card's Full/Younger pills
    choose(e.detail && e.detail.mode === 'young' ? 'young' : 'full');
  });

  show(location.hash === '#young' || stored() === 'young' ? 'young' : 'full');
  toggle.hidden = false;
})();
