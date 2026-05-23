// ── CONFIG: replace with your Formspree form IDs from formspree.io ──
const FORMSPREE_SIGNUP  = 'YOUR_SIGNUP_FORM_ID';
const FORMSPREE_CONTACT = 'YOUR_CONTACT_FORM_ID';

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// Mobile menu toggle
function toggleMenu() {
  const menu      = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger');
  const isOpen    = menu.classList.contains('is-open');
  menu.classList.toggle('is-open', !isOpen);
  hamburger.classList.toggle('is-open', !isOpen);
  menu.style.display = isOpen ? '' : 'flex';
}

const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', toggleMenu);
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', toggleMenu);
  });
}

// Reset mobile menu on resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 1100) {
    const menu      = document.getElementById('mobile-menu');
    const hamburger = document.getElementById('hamburger');
    if (menu)      { menu.classList.remove('is-open'); menu.style.display = ''; }
    if (hamburger) { hamburger.classList.remove('is-open'); }
  }
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Generic Formspree submit
async function submitToFormspree(formId, formData, btn, successText, onSuccess) {
  const orig  = btn.dataset.origText;
  const reset = () => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; };

  btn.disabled = true;
  btn.textContent = 'Sending…';
  btn.style.background = '';

  try {
    const res = await fetch('https://formspree.io/f/' + formId, {
      method: 'POST', body: formData,
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      btn.textContent = successText;
      btn.style.background = 'linear-gradient(135deg, #2a7a3a, #3aa34a)';
      if (onSuccess) onSuccess();
      setTimeout(reset, 4000);
    } else {
      let msg = 'Error — please try again';
      try { const body = await res.json(); if (body.errors?.length) msg = body.errors[0].message; } catch (_) {}
      btn.textContent = msg;
      btn.style.background = 'linear-gradient(135deg, #7a2a2a, #a33a3a)';
      setTimeout(reset, 4000);
    }
  } catch (_) {
    btn.textContent = 'Network error — try again';
    btn.style.background = 'linear-gradient(135deg, #7a2a2a, #a33a3a)';
    setTimeout(reset, 4000);
  }
}

// Launch list signup
function handleSignup(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  if (btn.disabled) return;
  if (!btn.dataset.origText) btn.dataset.origText = btn.textContent;
  submitToFormspree(FORMSPREE_SIGNUP, new FormData(e.target), btn, "You're on the list! ✓", () => e.target.reset());
}

// Contact form
function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  if (btn.disabled) return;
  if (!btn.dataset.origText) btn.dataset.origText = btn.textContent;
  submitToFormspree(FORMSPREE_CONTACT, new FormData(e.target), btn, 'Message Sent! ✓', () => e.target.reset());
}
