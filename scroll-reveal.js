(function () {
  // Sections on index.html (excluding hero which is above the fold)
  var sectionTargets = Array.from(document.querySelectorAll('section:not(.hero), footer'));

  // Block-level content sections on case study pages
  var containerTargets = Array.from(document.querySelectorAll('.container > *'));

  var targets = sectionTargets.concat(containerTargets);
  if (!targets.length) return;

  targets.forEach(function (el) {
    el.classList.add('reveal');
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(function (el) {
    observer.observe(el);
  });
}());
