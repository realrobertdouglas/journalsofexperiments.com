/*  Write back: the three buttons at the foot of an entry (_includes/write-back.html), "I'm curious about…",
    "I see a gap…", "I want to know more…". Pressing one opens a short note. Send posts it to the endpoint named
    in _config.yml (feedback_endpoint: the worker in _tools/feedback-worker, which opens a GitHub issue) or, when
    there is none or it fails, hands it to the reader's mail app (feedback_email). Text the reader had selected in
    the entry when they pressed goes along as a quotation. Nothing is stored in the browser.
*/
(function () {
  var box = document.getElementById('js-write-back');
  if (!box) return;
  var kinds = box.querySelectorAll('.write-back__kind');
  var form = box.querySelector('.write-back__form');
  var phrase = box.querySelector('.write-back__phrase');
  var text = box.querySelector('.write-back__text');
  var quoteEl = box.querySelector('.write-back__quote');
  var hp = box.querySelector('.write-back__hp');
  var send = box.querySelector('.write-back__send');
  var cancel = box.querySelector('.write-back__cancel');
  var done = box.querySelector('.write-back__done');
  if (!kinds.length || !form || !phrase || !text || !send || !done) return;

  var endpoint = box.getAttribute('data-endpoint') || '';
  var email = box.getAttribute('data-email') || '';
  var title = box.getAttribute('data-title') || document.title;
  var url = box.getAttribute('data-url') || location.href;
  var PROMPTS = {
    curious: 'Say what, in a sentence or two.',
    gap: 'Say what the entry leaves out, or gets wrong.',
    more: 'Say which part, and what you would want to read next.'
  };
  var kind = '';
  var quote = '';

  function pressed(button) {
    Array.prototype.forEach.call(kinds, function (b) {
      b.setAttribute('aria-pressed', b === button ? 'true' : 'false');
    });
  }
  function selectedInEntry() {               // a passage the reader marked before pressing, up to 300 characters
    var sel = window.getSelection && window.getSelection();
    if (!sel || sel.isCollapsed) return '';
    var node = sel.anchorNode;
    while (node && node.nodeType !== 1) node = node.parentNode;
    if (!node || !node.closest || !node.closest('.content')) return '';
    return sel.toString().replace(/\s+/g, ' ').trim().slice(0, 300);
  }
  function readingMode() {
    var young = document.getElementById('reader-young');
    return young && !young.hidden ? 'young' : 'full';
  }
  function open(button) {
    kind = button.getAttribute('data-kind');
    pressed(button);
    phrase.textContent = button.textContent;
    text.placeholder = PROMPTS[kind] || '';
    if (quote) { quoteEl.textContent = '“' + quote + '”'; quoteEl.hidden = false; }
    else { quoteEl.hidden = true; }
    done.hidden = true;
    form.hidden = false;
    text.focus();
  }
  function close() {
    form.hidden = true;
    text.value = '';
    quote = '';
    kind = '';
    pressed(null);
  }
  function finish(message) {                 // sent: the note is gone, say so
    close();
    done.textContent = message;
    done.hidden = false;
  }
  function fail(message) {                   // not sent: keep the note on the page
    done.textContent = message;
    done.hidden = false;
  }
  function mailBody(p) {
    var lines = [p.phrase, '', p.text];
    if (p.quote) lines.push('', 'The passage: “' + p.quote + '”');
    lines.push('', 'Entry: ' + p.title, p.url + (p.mode === 'young' ? ' (the younger readers version)' : ''));
    return lines.join('\n');
  }
  function byMail(p) {
    location.href = 'mailto:' + email +
      '?subject=' + encodeURIComponent(p.phrase + ' (' + p.title + ')') +
      '&body=' + encodeURIComponent(mailBody(p));
    finish('Your mail app has the note. Send it from there.');
  }
  function submit(e) {
    e.preventDefault();
    var note = text.value.trim();
    if (!note) { text.focus(); return; }
    if (hp && hp.value) { finish('Sent. Thank you.'); return; }      // a field only a robot fills
    var payload = { kind: kind, phrase: phrase.textContent, text: note, quote: quote,
                    title: title, url: url, mode: readingMode() };
    if (!endpoint) { if (email) byMail(payload); return; }
    send.disabled = true;
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload), credentials: 'omit' })
      .then(function (r) {
        if (!r.ok) throw new Error('status ' + r.status);
        finish('Sent. Thank you.');
      })
      .catch(function () {
        if (email) byMail(payload);
        else fail('That did not send. Try again in a minute.');
      })
      .then(function () { send.disabled = false; });
  }

  Array.prototype.forEach.call(kinds, function (b) {
    b.addEventListener('pointerdown', function () { quote = selectedInEntry(); });   // before the press clears it
    b.addEventListener('click', function () { open(b); });
  });
  form.addEventListener('submit', submit);
  if (cancel) cancel.addEventListener('click', close);
  box.hidden = false;
})();
