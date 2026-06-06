const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const shipments = {
  'ZAJ-12345678': {
    status: 'Out for delivery',
    route: 'Abu Dhabi → Dubai',
    driver: 'Omar Hassan',
    eta: 'Today, 5:30 PM',
    steps: ['Shipment created', 'Received at Abu Dhabi hub', 'In transit', 'Out for delivery']
  },
  'ZAJ-77881234': {
    status: 'In transit',
    route: 'Dubai → Sharjah',
    driver: 'Hassan Ali',
    eta: 'Tomorrow, 11:00 AM',
    steps: ['Shipment created', 'Picked up', 'In transit']
  }
};

const emirates = [
  ['Abu Dhabi', 'Main hub', '2–4 hours'], ['Dubai', 'Express hub', '2–5 hours'], ['Sharjah', 'Active branch', '3–6 hours'],
  ['Ajman', 'Partner branch', '4–7 hours'], ['Fujairah', 'Eastern route', '6–9 hours'], ['Ras Al Khaimah', 'Northern route', '6–9 hours'], ['Umm Al Quwain', 'Scheduled route', '5–8 hours']
];

function initNavigation() {
  const header = $('.site-header');
  const toggle = $('.menu-toggle');
  if (toggle && header) toggle.addEventListener('click', () => header.classList.toggle('open'));
}

function initTheme() {
  const savedTheme = localStorage.getItem('zajel-theme');
  if (savedTheme === 'dark') document.body.classList.add('dark');
  const btn = $('#themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('zajel-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    btn.innerHTML = document.body.classList.contains('dark') ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  });
}

function initReveal() {
  const items = $$('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(item => observer.observe(item));
}

function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + (target === 5000 ? '+' : '');
      }, 18);
      observer.unobserve(el);
    });
  });
  counters.forEach(counter => observer.observe(counter));
}

function initTracking() {
  const form = $('#trackingForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = $('#trackingInput').value.trim().toUpperCase();
    const result = $('#trackingResult');
    const data = shipments[input];
    if (!data) {
      result.innerHTML = `<div class="error-box">Shipment <strong>${input}</strong> was not found. Try <strong>ZAJ-12345678</strong>.</div>`;
      return;
    }
    result.innerHTML = `
      <div class="success-box">
        <h3>${data.status}</h3>
        <p><strong>Route:</strong> ${data.route} · <strong>Driver:</strong> ${data.driver} · <strong>ETA:</strong> ${data.eta}</p>
        <ul class="timeline">${data.steps.map(step => `<li class="done"><i class="fa-solid fa-check"></i>${step}</li>`).join('')}</ul>
      </div>`;
  });
}

function initCoverage() {
  const list = $('#emiratesList');
  if (!list) return;
  list.innerHTML = emirates.map(([name, branch, eta]) => `
    <article class="emirate-card"><div><strong>${name}</strong><p>${branch}</p></div><span>${eta}</span></article>`).join('');
}

function initQuote() {
  const form = $('#quoteForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const weight = Number($('#weight').value || 1);
    const type = $('#serviceType').value;
    const pickup = $('#pickup').value;
    const destination = $('#destination').value;
    const base = pickup === destination ? 18 : 35;
    const multipliers = { standard: 1, 'same-day': 1.45, express: 1.8 };
    const price = Math.round((base + weight * 4) * multipliers[type]);
    const vehicle = weight <= 10 ? 'Motorcycle' : weight <= 500 ? 'Van' : 'Truck';
    $('#quoteResult').innerHTML = `<div class="success-box"><h3>Estimated price: AED ${price}</h3><p>Recommended vehicle: <strong>${vehicle}</strong>. Estimated delivery time: <strong>${type === 'standard' ? '24–48 hours' : type === 'same-day' ? 'Same day' : '2–6 hours'}</strong>.</p></div>`;
  });
}

function initContact() {
  const form = $('#contactForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $('#name').value.trim();
    $('#contactResult').innerHTML = `<div class="success-box"><strong>Message sent successfully.</strong><br>Thank you, ${name}. ZAJEL team will contact you soon.</div>`;
    form.reset();
  });
}

function initAuth() {
  const tabs = $$('.auth-tabs button');
  const forms = $$('.auth-form');
  if (!tabs.length) return;
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(item => item.classList.remove('active'));
    forms.forEach(form => form.classList.remove('active'));
    tab.classList.add('active');
    $(`#${tab.dataset.tab}Form`).classList.add('active');
  }));

  const registerForm = $('#registerForm');
  const loginForm = $('#loginForm');
  const message = $('#authMessage');

  registerForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const user = {
      name: $('#registerName').value.trim(),
      email: $('#registerEmail').value.trim().toLowerCase(),
      password: $('#registerPassword').value
    };
    localStorage.setItem(`zajel-user-${user.email}`, JSON.stringify(user));
    message.style.display = 'block';
    message.className = 'auth-message success-box';
    message.textContent = 'Account created successfully. You can login now.';
    document.querySelector('[data-tab="login"]').click();
  });

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = $('#loginEmail').value.trim().toLowerCase();
    const password = $('#loginPassword').value;
    const demoAdmin = email === 'admin@zajel.ae' && password === 'password123';
    const stored = JSON.parse(localStorage.getItem(`zajel-user-${email}`) || 'null');
    if (demoAdmin) return window.location.href = 'admin.html';
    if (stored && stored.password === password) {
      localStorage.setItem('zajel-current-user', JSON.stringify(stored));
      window.location.href = 'dashboard.html';
    } else {
      message.style.display = 'block';
      message.className = 'auth-message error-box';
      message.textContent = 'Invalid email or password.';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation(); initTheme(); initReveal(); initCounters(); initTracking(); initCoverage(); initQuote(); initContact(); initAuth();
});
