// analytics.js — Google Analytics 4 loader.
// Replace GA_ID below with your Measurement ID (looks like "G-XXXXXXX")
// once you've created a GA4 property at analytics.google.com. Until then
// this file no-ops so pages load normally without sending any data.
(function () {
  var GA_ID = 'G-T3PG717377';

  if (GA_ID.indexOf('XXXX') !== -1) return;

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
})();
