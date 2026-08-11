// loader.js — hides #page-loader once this page's images and fonts
// have finished loading, so the loader never fades out before the
// content underneath is actually ready to show.
//
// Must run after any script that injects DOM images (e.g. nav.js
// building the nav logo), so it's placed last in the script order.
(function () {
  var loader = document.getElementById('page-loader');
  if (!loader) return;

  var MIN_VISIBLE = 300; // ms — stops fast loads from flash-hiding instantly
  var MAX_WAIT = 4000;   // ms — safety net if an asset stalls or errors
  var start = Date.now();
  var hidden = false;

  function hide() {
    if (hidden) return;
    hidden = true;
    var wait = Math.max(0, MIN_VISIBLE - (Date.now() - start));
    setTimeout(function () {
      loader.classList.add('is-hidden');
      loader.addEventListener('transitionend', function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, { once: true });
    }, wait);
  }

  var imagePromises = Array.prototype.map.call(document.images, function (img) {
    if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
    if (img.decode) return img.decode().catch(function () {});
    return new Promise(function (resolve) {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
  });

  var fontsReady = (document.fonts && document.fonts.ready) || Promise.resolve();

  Promise.all([fontsReady].concat(imagePromises)).then(hide);
  setTimeout(hide, MAX_WAIT);
}());
