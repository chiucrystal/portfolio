(function () {
  // Sections on index.html (excluding hero which is above the fold)
  var sectionTargets = Array.from(document.querySelectorAll('section:not(.hero), footer'));

  // Block-level content sections on case study pages
  var containerTargets = Array.from(document.querySelectorAll('.container > *'));

  // Individual sections inside a sticky-TOC two-column case study layout
  var caseSectionTargets = Array.from(document.querySelectorAll('.case-section'));

  var targets = sectionTargets.concat(containerTargets, caseSectionTargets);
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
