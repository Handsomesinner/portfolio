(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initMobileMenu();
    initRevealAnimations();
    initCounterAnimation();
    initFAQ();
    initTestimonialSlider();
    initFooterYear();
    initSmoothScroll();
    initActiveNavLinks();
  });

  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    function onScroll() {
      if (window.scrollY > 40) { navbar.classList.add('scrolled'); }
      else { navbar.classList.remove('scrolled'); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initActiveNavLinks() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) { link.classList.add('active'); }
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (section) { observer.observe(section); });
  }

  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var overlay = document.getElementById('mobileOverlay');
    var closeBtn = document.getElementById('mobileClose');
    var mobileLinks = document.querySelectorAll('.mobile-nav-link');
    if (!hamburger || !overlay) return;
    function openMenu() { overlay.classList.add('open'); hamburger.classList.add('open'); hamburger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
    function closeMenu() { overlay.classList.remove('open'); hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
    hamburger.addEventListener('click', function () { overlay.classList.contains('open') ? closeMenu() : openMenu(); });
    if (closeBtn) { closeBtn.addEventListener('click', closeMenu); }
    mobileLinks.forEach(function (link) { link.addEventListener('click', closeMenu); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('open')) closeMenu(); });
  }

  function initRevealAnimations() {
    var items = document.querySelectorAll('.reveal-item');
    if (!items.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (item) { observer.observe(item); });
  }

  function initCounterAnimation() {
    var statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;
    var counters = statsSection.querySelectorAll('.stat-number');
    var hasAnimated = false;
    function animateCounters() {
      if (hasAnimated) return;
      hasAnimated = true;
      counters.forEach(function (counter) {
        var target = parseInt(counter.getAttribute('data-target'), 10);
        var duration = 1800;
        var startTime = null;
        function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var elapsed = timestamp - startTime;
          var progress = Math.min(elapsed / duration, 1);
          counter.textContent = Math.round(target * easeOutQuart(progress));
          if (progress < 1) { requestAnimationFrame(step); } else { counter.textContent = target; }
        }
        requestAnimationFrame(step);
      });
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { animateCounters(); observer.unobserve(entry.target); } });
    }, { threshold: 0.5 });
    observer.observe(statsSection);
  }

  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;
    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      if (!question) return;
      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        faqItems.forEach(function (other) {
          other.classList.remove('open');
          var q = other.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) { item.classList.add('open'); question.setAttribute('aria-expanded', 'true'); }
      });
    });
  }

  function initTestimonialSlider() {
    var track = document.getElementById('sliderTrack');
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    var dotsContainer = document.getElementById('sliderDots');
    if (!track) return;
    var cards = track.querySelectorAll('.testimonial-card');
    var totalCards = cards.length;
    var currentIndex = 0;
    var autoPlayTimer = null;
    function getVisibleCount() { return window.innerWidth >= 1024 ? 2 : 1; }
    function getMaxIndex() { return Math.max(0, totalCards - getVisibleCount()); }
    function updateSlider(index) {
      var visibleCount = getVisibleCount();
      var maxIndex = getMaxIndex();
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      var colWidth = visibleCount === 2 ? '50%' : '100%';
      track.style.gridTemplateColumns = 'repeat(' + totalCards + ', ' + colWidth + ')';
      var cardWidth = track.parentElement.offsetWidth / visibleCount;
      var offset = currentIndex * (cardWidth + 24 / visibleCount);
      track.style.transform = 'translateX(-' + offset + 'px)';
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.dot').forEach(function (dot, i) { dot.classList.toggle('active', i === currentIndex); });
      }
      if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
      if (nextBtn) nextBtn.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
    }
    function goNext() { var max = getMaxIndex(); updateSlider(currentIndex >= max ? 0 : currentIndex + 1); }
    function goPrev() { var max = getMaxIndex(); updateSlider(currentIndex <= 0 ? max : currentIndex - 1); }
    function startAutoPlay() { stopAutoPlay(); autoPlayTimer = setInterval(goNext, 5000); }
    function stopAutoPlay() { if (autoPlayTimer) { clearInterval(autoPlayTimer); autoPlayTimer = null; } }
    if (nextBtn) { nextBtn.addEventListener('click', function () { goNext(); stopAutoPlay(); startAutoPlay(); }); }
    if (prevBtn) { prevBtn.addEventListener('click', function () { goPrev(); stopAutoPlay(); startAutoPlay(); }); }
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.dot').forEach(function (dot) {
        dot.addEventListener('click', function () { updateSlider(parseInt(dot.getAttribute('data-index'), 10)); stopAutoPlay(); startAutoPlay(); });
      });
    }
    var sliderWrapper = document.querySelector('.slider-wrapper');
    if (sliderWrapper) { sliderWrapper.addEventListener('mouseenter', stopAutoPlay); sliderWrapper.addEventListener('mouseleave', startAutoPlay); }
    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].screenX; stopAutoPlay(); }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
      startAutoPlay();
    }, { passive: true });
    var resizeTimer;
    window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(function () { updateSlider(currentIndex); }, 150); });
    updateSlider(0);
    startAutoPlay();
  }

  function initFooterYear() {
    var el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = anchor.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var navH = document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 80;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 8, behavior: 'smooth' });
      });
    });
  }

})();