// ── CONFIG: replace with your Formspree form IDs from formspree.io ──
// Both forms should be pointed at support@rnv-tech.com.
const FORMSPREE_SIGNUP  = 'YOUR_SIGNUP_FORM_ID';
const FORMSPREE_CONTACT = 'YOUR_CONTACT_FORM_ID';

const isConfigured = id => id && !id.startsWith('YOUR_');

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ── MOBILE MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function setMenu(open) {
  if (!mobileMenu || !hamburger) return;
  mobileMenu.classList.toggle('is-open', open);
  hamburger.classList.toggle('is-open', open);
  mobileMenu.style.display = open ? 'flex' : '';
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    setMenu(!mobileMenu.classList.contains('is-open'));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      setMenu(false);
      hamburger.focus();
    }
  });
}

// Reset mobile menu when resizing up to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 1100) setMenu(false);
});

// ── SCROLL REVEAL ──
const revealTargets = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealTargets.forEach(el => observer.observe(el));
} else {
  // No observer support — show everything rather than hiding the page
  revealTargets.forEach(el => el.classList.add('visible'));
}

// ── LEGAL PAGE TABS ──
const legalTabs = document.querySelectorAll('.legal-tab');
if (legalTabs.length) {
  const syncTabs = () => {
    const hash = window.location.hash || '#privacy';
    legalTabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('href') === hash);
    });
  };
  legalTabs.forEach(tab => tab.addEventListener('click', () => setTimeout(syncTabs, 0)));
  window.addEventListener('hashchange', syncTabs);
  syncTabs();
}

// ── FORMS ──
async function submitToFormspree(formId, formData, btn, successText, onSuccess) {
  const orig  = btn.dataset.origText;
  const reset = () => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; };
  const fail  = msg => {
    btn.textContent = msg;
    btn.style.background = 'linear-gradient(135deg, #7a2a2a, #a33a3a)';
    setTimeout(reset, 4000);
  };

  btn.disabled = true;
  btn.textContent = 'Sending…';
  btn.style.background = '';

  if (!isConfigured(formId)) {
    console.error(
      'Formspree is not configured. Create a form at https://formspree.io targeting ' +
      'support@rnv-tech.com, then replace the placeholder IDs at the top of js/main.js.'
    );
    fail('Form not configured yet');
    return;
  }

  try {
    const res = await fetch('https://formspree.io/f/' + formId, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      btn.textContent = successText;
      btn.style.background = 'linear-gradient(135deg, #2a7a3a, #3aa34a)';
      if (onSuccess) onSuccess();
      setTimeout(reset, 4000);
    } else {
      let msg = 'Error — please try again';
      try {
        const body = await res.json();
        if (body.errors?.length) msg = body.errors[0].message;
      } catch (_) { /* non-JSON error body — keep the generic message */ }
      fail(msg);
    }
  } catch (_) {
    fail('Network error — try again');
  }
}

function wireForm(formId, formspreeId, successText) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (!btn || btn.disabled) return;
    if (!btn.dataset.origText) btn.dataset.origText = btn.textContent;
    submitToFormspree(formspreeId, new FormData(form), btn, successText, () => form.reset());
  });
}

wireForm('signup-form',  FORMSPREE_SIGNUP,  "You're on the list! ✓");
wireForm('contact-form', FORMSPREE_CONTACT, 'Message Sent! ✓');
