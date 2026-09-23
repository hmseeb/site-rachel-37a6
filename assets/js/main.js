/* =========================================================
   Rapid Restore AZ — Site JavaScript
   Vanilla JS, no dependencies, no external requests.
   ========================================================= */
(function () {
  'use strict';

  var BUSINESS_EMAIL = 'rachel@rapidrestoreaz.com';

  /* ---------- Footer year ---------- */
  function setYear() {
    var nodes = document.querySelectorAll('[data-year]');
    var year = new Date().getFullYear();
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = year;
    }
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) close();
    });
  }

  /* ---------- Sticky header shadow ---------- */
  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq() {
    var items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    Array.prototype.forEach.call(items, function (item) {
      var btn = item.querySelector('.faq__q');
      var panel = item.querySelector('.faq__a');
      if (!btn || !panel) return;

      function setOpen(open) {
        item.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.hidden = false;
        panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
      }

      // initial state from markup
      setOpen(btn.getAttribute('aria-expanded') === 'true');

      btn.addEventListener('click', function () {
        var willOpen = !item.classList.contains('is-open');
        // close siblings within the same list
        var group = item.parentElement;
        Array.prototype.forEach.call(group.querySelectorAll('.faq__item.is-open'), function (other) {
          if (other === item) return;
          other.classList.remove('is-open');
          var ob = other.querySelector('.faq__q');
          var op = other.querySelector('.faq__a');
          if (ob) ob.setAttribute('aria-expanded', 'false');
          if (op) op.style.maxHeight = '0px';
        });
        setOpen(willOpen);
      });

      window.addEventListener('resize', function () {
        if (item.classList.contains('is-open')) {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    Array.prototype.forEach.call(els, function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
      io.observe(el);
    });
  }

  /* ---------- Quote / contact form ---------- */
  function initForms() {
    var forms = document.querySelectorAll('form[data-quote-form]');
    if (!forms.length) return;

    Array.prototype.forEach.call(forms, function (form) {
      var note = form.querySelector('.form-note');

      function showNote(type, html) {
        if (!note) return;
        note.className = 'form-note is-visible form-note--' + type;
        note.innerHTML = html;
        note.setAttribute('role', type === 'err' ? 'alert' : 'status');
      }

      function fieldOf(input) { return input.closest('.field'); }

      function setError(input, message) {
        var wrap = fieldOf(input);
        if (!wrap) return;
        wrap.classList.add('has-error');
        var err = wrap.querySelector('.field__error');
        if (err) err.textContent = message;
        input.setAttribute('aria-invalid', 'true');
      }

      function clearError(input) {
        var wrap = fieldOf(input);
        if (!wrap) return;
        wrap.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
      }

      function validate() {
        var ok = true;
        var firstBad = null;
        var controls = form.querySelectorAll('input[required], select[required], textarea[required]');

        Array.prototype.forEach.call(controls, function (input) {
          var value = (input.value || '').trim();
          var message = '';

          if (!value) {
            message = 'This field is required.';
          } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value)) {
            message = 'Please enter a valid email address.';
          } else if (input.type === 'tel' && (value.replace(/\D/g, '').length < 10)) {
            message = 'Please enter a 10-digit phone number.';
          }

          if (message) {
            ok = false;
            setError(input, message);
            if (!firstBad) firstBad = input;
          } else {
            clearError(input);
          }
        });

        if (firstBad) {
          firstBad.focus();
          firstBad.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
        return ok;
      }

      // live clearing of errors
      Array.prototype.forEach.call(form.querySelectorAll('input, select, textarea'), function (input) {
        input.addEventListener('input', function () {
          if (fieldOf(input) && fieldOf(input).classList.contains('has-error')) clearError(input);
        });
        input.addEventListener('change', function () {
          if (fieldOf(input) && fieldOf(input).classList.contains('has-error')) clearError(input);
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        // honeypot: silently ignore bots
        var hp = form.querySelector('input[name="company_website"]');
        if (hp && hp.value) return;

        if (!validate()) {
          showNote('err', 'Please correct the highlighted fields, or call us directly at <a href="tel:+16025738967">(602) 573-8967</a>.');
          return;
        }

        var data = new FormData(form);
        var get = function (key) { return (data.get(key) || '').toString().trim(); };

        var name = get('name');
        var phone = get('phone');
        var email = get('email');
        var service = get('service');
        var property = get('property');
        var address = get('address');
        var urgency = get('urgency');
        var message = get('message');

        var lines = [];
        lines.push('Name: ' + name);
        lines.push('Phone: ' + phone);
        if (email) lines.push('Email: ' + email);
        if (service) lines.push('Service needed: ' + service);
        if (property) lines.push('Property type: ' + property);
        if (address) lines.push('Property location: ' + address);
        if (urgency) lines.push('Urgency: ' + urgency);
        lines.push('');
        lines.push('Details:');
        lines.push(message || '(none provided)');
        lines.push('');
        lines.push('— Sent from the Rapid Restore AZ website quote form');

        var subject = 'Free Estimate Request' + (service ? ' — ' + service : '') + ' — ' + name;
        var mailto = 'mailto:' + BUSINESS_EMAIL +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(lines.join('\n'));

        showNote('ok',
          'Thanks, ' + escapeHtml(name.split(' ')[0] || name) + '! Your email app is opening with your request ready to send. ' +
          'If it does not open, email us at <a href="mailto:' + BUSINESS_EMAIL + '">' + BUSINESS_EMAIL + '</a> ' +
          'or call <a href="tel:+16025738967">(602) 573-8967</a> — we answer 24/7.');

        window.location.href = mailto;
      });
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Prefill service select from query string ---------- */
  function initPrefill() {
    var params = new URLSearchParams(window.location.search);
    var service = params.get('service');
    if (!service) return;
    var select = document.querySelector('form[data-quote-form] select[name="service"]');
    if (!select) return;
    Array.prototype.forEach.call(select.options, function (opt) {
      if (opt.value.toLowerCase() === service.toLowerCase()) select.value = opt.value;
    });
  }

  /* ---------- Init ---------- */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    setYear();
    initNav();
    initHeader();
    initFaq();
    initReveal();
    initForms();
    initPrefill();
  });
})();
