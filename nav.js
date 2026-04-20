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

    /* Logo scales continuously from 32px → 22px */
    '.nav-logo-img{height:clamp(22px,2.67vw,32px);width:auto;display:block}' +

    '.nav-links{display:flex;gap:32px;list-style:none;align-items:center}' +
    '.nav-links h3{font-family:"DM Sans",sans-serif;font-size:20px;font-weight:300;' +
    'line-height:1.5;letter-spacing:0;margin:0;color:#383836}' +
    '.nav-links a{font-family:inherit;font-size:inherit;font-weight:inherit;letter-spacing:inherit;' +
    'color:#383836;text-decoration:none;text-transform:none;transition:color .2s ease-in-out}' +
    '.nav-links a:hover{color:var(--color-accent,#0e89cf)}' +

    /* Hamburger button */
    '.nav-hamburger{display:none;background:none;border:none;cursor:pointer;padding:8px;' +
    'color:#383836;line-height:0;flex-shrink:0}' +
    '.nav-hamburger:hover{color:var(--color-accent,#0e89cf)}' +

    /* Full-screen overlay */
    '@keyframes overlayIn{from{opacity:0}to{opacity:1}}' +
    '@keyframes overlayLinkIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}' +
    '.nav-overlay{position:fixed;inset:0;background:var(--color-bg,#f7f6f2);z-index:999;' +
    'display:none;flex-direction:column;justify-content:center;padding:0 24px}' +
    '.nav-overlay--open{animation:overlayIn 0.2s ease forwards}' +
    '.nav-overlay-links{display:flex;flex-direction:column;gap:4px}' +
    '.nav-overlay-links a{font-family:"DM Sans",sans-serif;font-size:clamp(40px,11vw,64px);' +
    'font-weight:300;line-height:1.25;color:#383836;text-decoration:none;' +
    'opacity:0;transition:color 0.2s ease}' +
    '.nav-overlay--open .nav-overlay-links a:nth-child(1){animation:overlayLinkIn 0.25s ease 0.08s forwards}' +
    '.nav-overlay--open .nav-overlay-links a:nth-child(2){animation:overlayLinkIn 0.25s ease 0.15s forwards}' +
    '.nav-overlay-links a:hover{color:var(--color-accent,#0e89cf)}' +

    /* 768px — collapse to hamburger */
    '@media(max-width:768px){' +
    '.nav{padding:0 24px}' +
    '.nav-links{display:none}' +
    '.nav-hamburger{display:flex}' +
    '}' +

    /* 576px */
    '@media(max-width:576px){' +
    '.nav{padding:0 16px}' +
    '.nav-overlay{padding:0 16px}' +
    '}';

  document.head.appendChild(style);

  // ── SVG icons ────────────────────────────────────────────────────
  var ICON_MENU =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '<line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '<line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '</svg>';

  var ICON_CLOSE =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '<line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '</svg>';

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
    '</ul>' +
    '<button class="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">' +
      ICON_MENU +
    '</button>';

  // Full-screen overlay
  var overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<nav class="nav-overlay-links">' +
      '<a href="' + base + 'index.html#work">work</a>' +
      '<a href="' + base + 'index.html#about">about</a>' +
    '</nav>';

  document.body.insertBefore(nav, document.body.firstChild);
  nav.insertAdjacentElement('afterend', overlay);

  // ── Toggle logic ─────────────────────────────────────────────────
  var hamburger = nav.querySelector('.nav-hamburger');
  var isOpen = false;

  function openMenu() {
    isOpen = true;
    overlay.style.display = 'flex';
    overlay.classList.remove('nav-overlay--open');
    void overlay.offsetWidth; // force reflow for animation restart
    overlay.classList.add('nav-overlay--open');
    overlay.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.innerHTML = ICON_CLOSE;
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    overlay.style.display = 'none';
    overlay.classList.remove('nav-overlay--open');
    overlay.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = ICON_MENU;
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (isOpen) closeMenu(); else openMenu();
  });

  // Close when a link is clicked
  overlay.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeMenu();
  });

  // Close on resize back to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && isOpen) closeMenu();
  });
}());
