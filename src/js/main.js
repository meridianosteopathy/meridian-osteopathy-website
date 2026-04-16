document.addEventListener('DOMContentLoaded', function() {

  // ─── Mobile menu ───────────────────────────────────────────────
  const hamburger   = document.querySelector('.mobile-menu-toggle');
  const closeBtn    = document.querySelector('.mobile-menu-close-btn');
  const mobileMenu  = document.querySelector('.mobile-menu');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('hidden');
    closeBtn.classList.add('visible');
    document.body.style.overflow = 'hidden'; // prevent page scroll behind menu
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('hidden');
    closeBtn.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMobileMenu);
  if (closeBtn)  closeBtn.addEventListener('click', closeMobileMenu);

  // Close when a plain link inside the mobile menu is tapped
  if (mobileMenu) {
    mobileMenu.querySelectorAll('.mobile-nav > ul > li > a, .mobile-dropdown a').forEach(function(link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ─── Mobile accordion (Services / Team) ────────────────────────
  document.querySelectorAll('.mobile-dropdown-trigger').forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      const parent = this.closest('.mobile-has-dropdown');
      const isOpen = parent.classList.contains('open');

      // Close all other open dropdowns
      document.querySelectorAll('.mobile-has-dropdown.open').forEach(function(el) {
        el.classList.remove('open');
        el.querySelector('.mobile-dropdown-trigger').setAttribute('aria-expanded', 'false');
      });

      // Toggle this one
      if (!isOpen) {
        parent.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ─── Careers Apply Now → pre-select position dropdown ──────────
  document.querySelectorAll('.vacancy-apply-btn[data-position]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault(); // stop href firing before JS runs
      var position = this.getAttribute('data-position');
      var select = document.getElementById('applying-position');
      if (select && position) {
        select.value = position;
      }
      // Now scroll to the form
      var target = document.getElementById('apply');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── Careers "Read more" toggle ────────────────────────────────
  const readMoreBtn = document.querySelector('.careers-read-more-btn');
  const careersExpandable = document.querySelector('.careers-expandable');
  if (readMoreBtn && careersExpandable) {
    readMoreBtn.addEventListener('click', function() {
      const isOpen = careersExpandable.classList.contains('open');
      if (isOpen) {
        careersExpandable.classList.remove('open');
        readMoreBtn.setAttribute('aria-expanded', 'false');
        readMoreBtn.innerHTML = 'Read more <span class="careers-read-more-arrow">↓</span>';
      } else {
        careersExpandable.classList.add('open');
        readMoreBtn.setAttribute('aria-expanded', 'true');
        readMoreBtn.innerHTML = 'Read less <span class="careers-read-more-arrow">↑</span>';
      }
    });
  }

  // ─── FAQ accordion ─────────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function() {
        faqItems.forEach(function(other) {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open');
      });
    }
  });

  // ─── Header scroll effect ──────────────────────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.style.background = 'rgba(30, 58, 95, 0.98)';
      } else {
        header.style.background = 'rgba(30, 58, 95, 0.95)';
      }
    });
  }

});
