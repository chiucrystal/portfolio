// protect.js — lightweight password gate for case study pages.
// Not real security (this is client-side, viewable in source); it's a
// polite deterrent so casual visitors don't stumble into NDA'd work.
(function () {
  // SHA-256 of the shared password — kept hashed so the plaintext isn't
  // sitting in view-source.
  var HASH = '6a07a5c18e0f6c695c2445e84751f8ac9406da91fae839b5c3de36b9c712269e';
  var STORAGE_KEY = 'cc-case-study-unlocked';

  if (localStorage.getItem(STORAGE_KEY) === '1') return;

  document.documentElement.classList.add('cs-locked');

  function sha256(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
    });
  }

  function buildOverlay() {
    var overlay = document.createElement('div');
    overlay.id = 'cs-gate';
    overlay.innerHTML =
      '<div class="cs-gate-box">' +
        '<p class="cs-gate-label">This case study is password protected</p>' +
        '<form id="cs-gate-form" autocomplete="off">' +
          '<input type="password" id="cs-gate-input" placeholder="Password" autocomplete="new-password" autofocus>' +
          '<button type="submit">Unlock</button>' +
        '</form>' +
        '<p class="cs-gate-error" id="cs-gate-error" hidden>Incorrect password — try again.</p>' +
      '</div>';
    document.body.appendChild(overlay);

    document.getElementById('cs-gate-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('cs-gate-input');
      sha256(input.value).then(function (hash) {
        if (hash === HASH) {
          localStorage.setItem(STORAGE_KEY, '1');
          document.documentElement.classList.remove('cs-locked');
          overlay.remove();
        } else {
          document.getElementById('cs-gate-error').hidden = false;
          input.value = '';
          input.focus();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildOverlay);
  } else {
    buildOverlay();
  }
})();
