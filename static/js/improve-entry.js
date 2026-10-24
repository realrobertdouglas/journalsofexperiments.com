/*  Improve this entry: the row at the foot of an entry (_includes/improve-entry.html). "Could this entry improve?"
    No, Partly, Yes: an answer posts at once to the endpoint named in _config.yml (feedback_endpoint: the worker in
    _tools/feedback-worker, which keeps one GitHub issue per entry). No thanks the reader and points at Share; Partly
    or Yes opens "Something is" with unclear, wrong, missing, each opening a short note. Once answered, the row is
    marked open and Share drops below the thanks or the note buttons. Selecting a passage in the entry
    raises a pill with the same three choices, and that note carries the passage. A note that fails to post goes to
    the reader's mail app when feedback_email is set. sessionStorage keeps two things for this visit only: the
    answer, so a reload does not count it twice, and the number of the entry's issue, sent back with the next post
    so two posts in quick succession do not open two threads. Nothing else is stored in the browser.
*/
(function () {
  var box = document.getElementById('js-improve');
  if (!box) return;
  var endpoint = box.getAttribute('data-endpoint') || '';
  var poll = document.getElementById('js-improve-poll');
  var followup = box.querySelector('.improve__followup');
  if (!endpoint || !poll || !followup) return;
  var email = box.getAttribute('data-email') || '';
  var title = box.getAttribute('data-title') || document.title;
  var url = box.getAttribute('data-url') || location.href;
  var answers = poll.querySelectorAll('.improve__answer');
  var row = box.querySelector('.improve__row');
  var thanks = box.querySelector('.improve__thanks');
  var share = box.querySelector('.share-page');
  var kinds = followup.querySelectorAll('.improve__kind');
  var form = followup.querySelector('.improve__form');
  var text = form.querySelector('.improve__text');
  var quoteEl = form.querySelector('.improve__quote');
  var hp = form.querySelector('.improve__hp');
  var send = form.querySelector('.improve__send');
  var cancel = form.querySelector('.improve__cancel');
  var done = followup.querySelector('.improve__done');

  var KINDS = {
    unclear: { label: 'Something is unclear', prompt: 'Which sentence lost you, and how you read it.' },
    wrong:   { label: 'Something is wrong',    prompt: 'What you think it should say, and where you saw it.' },
    missing: { label: 'Something is missing',  prompt: 'What you expected to find here.' }
  };
  var SENT = 'Sent. Thank you. The author reads every note.';
  var FAILED = 'That did not send. Try again in a minute.';
  var STORE = 'improve:' + url;
  var THREAD = 'improve-thread:' + url;

  function readingMode() {
    var young = document.getElementById('reader-young');
    return young && !young.hidden ? 'young' : 'full';
  }
  function keep(key, value) { try { sessionStorage.setItem(key, value); } catch (e) { /* private window */ } }
  function kept(key) { try { return sessionStorage.getItem(key) || ''; } catch (e) { return ''; } }
  function post(payload) {
    var n = parseInt(kept(THREAD), 10);
    if (n > 0) payload.issue = n;
    return fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' },
                             body: JSON.stringify(payload), credentials: 'omit' })
      .then(function (r) { if (!r.ok) throw new Error('status ' + r.status); return r.json(); })
      .then(function (d) { if (d && d.number) keep(THREAD, String(d.number)); return d; });
  }
  function remember(answer) { keep(STORE, answer); }
  function remembered() { return kept(STORE); }
  function pressOnly(list, button) {
    Array.prototype.forEach.call(list, function (b) { b.setAttribute('aria-pressed', b === button ? 'true' : 'false'); });
  }

  /* The question */
  function showAnswer(answer, fresh) {
    if (row) row.classList.add('is-open');          // Share drops below what opens
    if (answer === 'no') {
      followup.hidden = true;
      thanks.textContent = 'Thank you. Share it with someone who would read it.';
      thanks.hidden = false;
      if (share && fresh) {                  // a glance at the Share pills, right there on the row
        share.classList.add('is-nudged');
        setTimeout(function () { share.classList.remove('is-nudged'); }, 2400);
      }
    } else {
      thanks.hidden = true;
      followup.hidden = false;
    }
  }
  Array.prototype.forEach.call(answers, function (b) {
    b.addEventListener('click', function () {
      var answer = b.getAttribute('data-answer');
      pressOnly(answers, b);
      showAnswer(answer, true);
      if (remembered() === answer) return;   // the same tap twice counts once
      remember(answer);
      post({ type: 'answer', answer: answer, title: title, url: url, mode: readingMode() }).catch(function () {});
    });
  });

  /* The note under the question */
  var kind = '';
  var quote = '';
  function selectedInEntry() {               // a passage the reader marked before pressing, up to 300 characters
    var s = entrySelection();
    return s ? s.text : '';
  }
  function openNote(button) {
    kind = button.getAttribute('data-kind');
    pressOnly(kinds, button);
    text.setAttribute('aria-label', KINDS[kind].label);
    text.placeholder = KINDS[kind].prompt;
    if (quote) { quoteEl.textContent = '“' + quote + '”'; quoteEl.hidden = false; }
    else { quoteEl.hidden = true; }
    done.hidden = true;
    form.hidden = false;
    text.focus();
  }
  function closeNote() {
    form.hidden = true;
    text.value = '';
    quote = '';
    kind = '';
    pressOnly(kinds, null);
  }
  function mailBody(p) {
    var lines = [KINDS[p.kind].label, '', p.text];
    if (p.quote) lines.push('', 'The passage: “' + p.quote + '”');
    lines.push('', 'Entry: ' + p.title, p.url + (p.mode === 'young' ? ' (the younger readers version)' : ''));
    return lines.join('\n');
  }
  function byMail(p) {
    location.href = 'mailto:' + email +
      '?subject=' + encodeURIComponent(KINDS[p.kind].label + ' (' + p.title + ')') +
      '&body=' + encodeURIComponent(mailBody(p));
  }
  function sendNote(payload, button, onSent, onFailed) {
    button.disabled = true;
    post(payload)
      .then(function () { onSent(); })
      .catch(function () {
        if (email) { byMail(payload); onSent('Your mail app has the note. Send it from there.'); }
        else onFailed();
      })
      .then(function () { button.disabled = false; });
  }
  function submitNote(e) {
    e.preventDefault();
    var note = text.value.trim();
    if (!note) { text.focus(); return; }
    var finish = function (message) { closeNote(); done.textContent = message || SENT; done.hidden = false; };
    if (hp && hp.value) { finish(); return; }                                   // a field only a robot fills
    sendNote({ type: 'note', kind: kind, text: note, quote: quote, title: title, url: url, mode: readingMode() },
             send, finish, function () { done.textContent = FAILED; done.hidden = false; });
  }
  Array.prototype.forEach.call(kinds, function (b) {
    b.addEventListener('pointerdown', function () { quote = selectedInEntry(); });   // before the press clears it
    b.addEventListener('click', function () { openNote(b); });
  });
  form.addEventListener('submit', submitNote);
  if (cancel) cancel.addEventListener('click', closeNote);

  /* The pill over a selected passage, and the card under it */
  function entrySelection() {
    var sel = window.getSelection && window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;
    var range = sel.getRangeAt(0);
    var node = range.commonAncestorContainer;
    var el = node.nodeType === 1 ? node : node.parentElement;
    if (!el || !el.closest || !el.closest('.content .post') || el.closest('.improve')) return null;
    var words = sel.toString().replace(/\s+/g, ' ').trim();
    if (words.length < 3) return null;
    return { text: words.slice(0, 300), rect: range.getBoundingClientRect(), range: range.cloneRange() };
  }
  var tpl = document.getElementById('js-improve-flag');
  var flag = null;
  var pop = null;
  if (tpl && 'content' in tpl) {
    var frag = document.importNode(tpl.content, true);
    flag = frag.querySelector('.improve-flag');
    pop = frag.querySelector('.improve-pop');
    document.body.appendChild(frag);
  }
  if (flag && pop) {
    var popKind = pop.querySelector('.improve-pop__kind');
    var popQuote = pop.querySelector('.improve-pop__quote');
    var popForm = pop.querySelector('.improve-pop__form');
    var popText = pop.querySelector('.improve-pop__text');
    var popHp = pop.querySelector('.improve__hp');
    var popSend = pop.querySelector('.improve__send');
    var popDone = pop.querySelector('.improve-pop__done');
    var current = null;
    var timer = null;

    function unmark() {
      Array.prototype.forEach.call(document.querySelectorAll('mark.improve-mark'), function (m) {
        var parent = m.parentNode;
        while (m.firstChild) parent.insertBefore(m.firstChild, m);
        parent.removeChild(m);
        parent.normalize();
      });
    }
    function mark(range) {                   // the passage stays lit while the card is open
      try { var m = document.createElement('mark'); m.className = 'improve-mark'; range.surroundContents(m); }
      catch (e) { /* the selection crosses an element; the card still carries the words */ }
    }
    function place(el, left, top) {
      var maxLeft = window.scrollX + document.documentElement.clientWidth - el.offsetWidth - 8;
      el.style.left = Math.max(window.scrollX + 8, Math.min(left, maxLeft)) + 'px';
      el.style.top = top + 'px';
    }
    function closePop() { pop.hidden = true; unmark(); current = null; }

    document.addEventListener('selectionchange', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (!pop.hidden) return;
        var s = entrySelection();
        if (!s) { flag.hidden = true; return; }
        current = s;
        flag.hidden = false;
        place(flag, s.rect.left + window.scrollX + s.rect.width / 2 - flag.offsetWidth / 2,
                    s.rect.top + window.scrollY - flag.offsetHeight - 10);
      }, 150);
    });
    Array.prototype.forEach.call(flag.querySelectorAll('button'), function (b) {
      b.addEventListener('mousedown', function (e) { e.preventDefault(); });      // keep the selection
      b.addEventListener('click', function () {
        var s = current;
        if (!s) return;
        flag.hidden = true;
        var k = b.getAttribute('data-kind');
        popKind.textContent = KINDS[k].label;
        popKind.setAttribute('data-kind', k);
        popQuote.textContent = '“' + s.text + '”';
        popText.value = '';
        popText.placeholder = KINDS[k].prompt;
        popForm.hidden = false;
        popDone.hidden = true;
        pop.hidden = false;
        place(pop, s.rect.left + window.scrollX, s.rect.bottom + window.scrollY + 8);
        mark(s.range);
        if (window.getSelection) window.getSelection().removeAllRanges();
        popText.focus();
      });
    });
    pop.querySelector('.improve__cancel').addEventListener('click', closePop);
    popForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = popText.value.trim();
      if (!note) { popText.focus(); return; }
      var s = current;
      var finish = function (message) {
        popForm.hidden = true;
        popDone.textContent = message || 'Sent. Thank you.';
        popDone.hidden = false;
        setTimeout(closePop, 1800);
      };
      if (popHp && popHp.value) { finish(); return; }
      sendNote({ type: 'note', kind: popKind.getAttribute('data-kind'), text: note, quote: s ? s.text : '',
                 title: title, url: url, mode: readingMode() },
               popSend, finish, function () { popDone.textContent = FAILED; popDone.hidden = false; });
    });
  }

  /* Show, and pick up an answer from earlier in this visit */
  poll.hidden = false;
  var earlier = remembered();
  if (earlier) {
    Array.prototype.forEach.call(answers, function (b) {
      if (b.getAttribute('data-answer') === earlier) { pressOnly(answers, b); showAnswer(earlier, false); }
    });
  }
})();
