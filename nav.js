(function () {
  var isWork = /\/work\//.test(window.location.pathname);
  var base   = isWork ? '../' : '';
  var imgSrc = isWork ? 'assets/shared/nav-left.png' : 'work/assets/shared/nav-left.png';

  // ── Load DM Sans if not already present ─────────────────────────
  if (!document.querySelector('link[href*="DM+Sans"]')) {
    var preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);

    var preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    var font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400&display=swap';
    document.head.appendChild(font);
  }

  // ── CSS ─────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent =
    '.nav{position:fixed;top:0;left:0;right:0;height:63px;display:flex;align-items:center;' +
    'justify-content:space-between;padding:0 44px;background:var(--color-bg,#f7f6f2);' +
    'z-index:1000;border-bottom:1px solid rgba(0,0,0,.2)}' +
    '.nav-logo-img{height:32px;width:auto;display:block}' +
    '.nav-links{display:flex;gap:32px;list-style:none;align-items:center}' +
    '.nav-links h3{font-family:"DM Sans",sans-serif;font-size:20px;font-weight:300;' +
    'line-height:1.5;letter-spacing:0;margin:0;color:#383836}' +
    '.nav-links a{font-family:inherit;font-size:inherit;font-weight:inherit;letter-spacing:inherit;' +
    'color:#383836;text-decoration:none;text-transform:none;transition:color .2s ease-in-out}' +
    '.nav-links a:hover{color:var(--color-accent,#0e89cf)}';
  document.head.appendChild(style);

  // ── HTML ─────────────────────────────────────────────────────────
  var nav = document.createElement('nav');
  nav.className = 'nav';
  nav.innerHTML =
    '<a href="' + base + 'index.html">' +
      '<img src="' + imgSrc + '" alt="crystal.chiu" class="nav-logo-img">' +
    '</a>' +
    '<ul class="nav-links">' +
      '<li><h3><a href="' + base + 'index.html#work">work</a></h3></li>' +
      '<li><h3><a href="' + base + 'index.html#about">about</a></h3></li>' +
    '</ul>';

  document.body.insertBefore(nav, document.body.firstChild);
}());
