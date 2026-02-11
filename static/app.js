/* ======================
   JavaScript: Interactivity
   ====================== */

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const primaryNav = document.getElementById('primaryNav');
menuBtn?.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile nav when clicking a link
primaryNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    primaryNav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

// Enhance in-page links with smooth scroll + focus management
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Move focus after scrolling (accessibility)
    setTimeout(() => target.setAttribute('tabindex', '-1'), 0);
    setTimeout(() => target.focus({ preventScroll: true }), 400);
  });
});

// ScrollSpy
const sectionSelectors = [
  '#home', '#about',
  '#mms', '#mms-log', '#mms-scheduler', '#mms-notifications', '#mms-team',
  '#services', '#svc-maintenance', '#svc-hpc', '#svc-custom',
  '#dashboard', '#dash-status', '#dash-upcoming', '#dash-activity',
  '#support'
];

const observedSections = sectionSelectors
  .map(s => document.querySelector(s))
  .filter(Boolean);

const linkMap = new Map();
document.querySelectorAll('a[href^="#"]').forEach(a => {
  const id = a.getAttribute('href');
  if (id) linkMap.set(id, a);
});

const openParentSubmenu = (hash) => {
  const link = linkMap.get(hash);
  if (!link) return;
  const details = link.closest('details.submenu');
  if (details && !details.open) details.open = true;
};

const setActiveLink = (hash) => {
  document.querySelectorAll('.nav-link, .submenu-list a').forEach(el => el.removeAttribute('aria-current'));
  const active = linkMap.get(hash);
  if (active) active.setAttribute('aria-current', 'page');
  openParentSubmenu(hash);
};

const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = '#' + entry.target.id;
      setActiveLink(id);
      history.replaceState(null, '', id);
    }
  });
}, { rootMargin: "-50% 0px -45% 0px", threshold: 0.01 });

observedSections.forEach(sec => spy.observe(sec));
if (location.hash) setActiveLink(location.hash);

/* ======================
   Demo Data (in-memory)
   ====================== */
const demoTasks = [
  { title:'Quarterly CNC calibration', equipment:'EQ-000123', type:'calibration', priority:'high', status:'planned', due:'2026-02-01T09:00:00Z' },
  { title:'Lathe belt inspection',    equipment:'EQ-000124', type:'inspection', priority:'low',  status:'planned', due:'2026-02-02T10:00:00Z' },
  { title:'Compressor oil change',    equipment:'EQ-000126', type:'preventive', priority:'medium', status:'planned', due:'2026-02-05T08:30:00Z' },
];

const demoEquipmentStatus = [
  { asset:'EQ-000123', name:'CNC Mill',       state:'ok'   },
  { asset:'EQ-000124', name:'Lathe',          state:'warn' },
  { asset:'EQ-000126', name:'Air Compressor', state:'ok'   },
  { asset:'EQ-000127', name:'CMM',            state:'ok'   },
  { asset:'EQ-000125', name:'3D Printer',     state:'bad'  },
];

const demoActivity = [
  { date:'2026-01-29', equipment:'EQ-000123', action:'Log — Lubrication system check', by:'john@example.com' },
  { date:'2026-01-27', equipment:'EQ-000124', action:'Log — Replaced worn belt',       by:'li@example.com'   },
  { date:'2026-01-26', equipment:'EQ-000125', action:'Log — Nozzle maintenance',       by:'john@example.com' },
];

// KPIs
const kpiTasks = document.getElementById('kpi-tasks');
const kpiUpcoming = document.getElementById('kpi-upcoming');
const kpiOverdue = document.getElementById('kpi-overdue');

const now = new Date('2026-01-31T00:00:00Z'); // fixed for demo
const in7Days = new Date(now.getTime() + 7*24*3600*1000);

kpiTasks.textContent = String(demoTasks.length);
kpiUpcoming.textContent = String(demoTasks.filter(t => new Date(t.due) <= in7Days).length);
kpiOverdue.textContent = String(demoTasks.filter(t => new Date(t.due) < now).length);

// Status list
const statusList = document.getElementById('status-list');
if (statusList) {
  statusList.innerHTML = '';
  demoEquipmentStatus.forEach(e => {
    const dotClass = e.state === 'ok' ? 'status-ok' : e.state === 'warn' ? 'status-warn' : 'status-bad';
    const li = document.createElement('li');
    li.innerHTML = `<span class="status-dot ${dotClass}"></span><strong>${e.asset}</strong> — ${e.name} <span class="muted">(${e.state})</span>`;
    statusList.appendChild(li);
  });
}

// Upcoming list
const upcomingList = document.getElementById('upcoming-list');
if (upcomingList) {
  upcomingList.innerHTML = '';
  demoTasks
    .slice()
    .sort((a,b) => new Date(a.due) - new Date(b.due))
    .forEach(t => {
      const li = document.createElement('li');
      const d = new Date(t.due);
      li.innerHTML = `<strong>${t.title}</strong> — ${t.equipment} · <em>${t.type}</em> · ${t.priority} · <time datetime="${t.due}">${d.toUTCString().slice(0, 22)}</time>`;
      upcomingList.appendChild(li);
    });
}

// Activity table
const activityTBody = document.getElementById('activity-tbody');
if (activityTBody) {
  activityTBody.innerHTML = '';
  demoActivity.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><time datetime="${a.date}">${a.date}</time></td><td>${a.equipment}</td><td>${a.action}</td><td>${a.by}</td>`;
    activityTBody.appendChild(tr);
  });
}

// Notifications helper
const notifList = document.getElementById('notif-list');
const addNotification = (type, title, body) => {
  if (!notifList) return;
  if (notifList.querySelector('li')?.textContent?.includes('No notifications')) notifList.innerHTML = '';
  const li = document.createElement('li');
  li.innerHTML = `<strong>${type}:</strong> ${title} — <span class="muted">${body}</span>`;
  notifList.prepend(li);
};

/* ======================
   Forms (demo-only)
   ====================== */
document.getElementById('form-log')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const equipment = fd.get('equipment');
  const date = fd.get('date');
  addNotification('Log Saved', 'Maintenance log recorded', `${equipment} @ ${date}`);
  alert('Log saved (demo). Wire this to your backend/Supabase.');
  e.currentTarget.reset();
});

document.getElementById('form-task')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const title = fd.get('title');
  const equipment = fd.get('equipment');
  addNotification('Task Created', title, `For ${equipment}`);
  alert('Task created (demo). Wire this to your backend/Supabase.');
  e.currentTarget.reset();
});

document.getElementById('form-thread')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const subject = fd.get('subject');
  const author = fd.get('author') || 'anonymous';
  const body = fd.get('body');
  const list = document.getElementById('thread-list');
  if (list.textContent.includes('No threads')) list.textContent = '';
  const thread = document.createElement('article');
  thread.className = 'card';
  thread.style.marginTop = '.75rem';
  const when = new Date().toISOString().slice(0,10);
  thread.innerHTML = `
    <header><h4>${subject}</h4><p class="muted">Started by ${author} · <time datetime="${when}">${when}</time></p></header>
    <p>${body}</p>
  `;
  list.prepend(thread);
  addNotification('New Thread', subject, `by ${author}`);
  alert('Thread created (demo). Wire this to your backend/Supabase.');
  e.currentTarget.reset();
});

document.getElementById('form-contact')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Message sent (demo). Connect to your email/Helpdesk.');
  e.currentTarget.reset();
});

// Close other <details> on desktop
document.querySelectorAll('details.submenu').forEach(d => {
  d.addEventListener('toggle', () => {
    if (d.open && window.matchMedia('(min-width: 1025px)').matches) {
      document.querySelectorAll('details.submenu').forEach(other => {
        if (other !== d) other.open = false;
      });
    }
  });
});


/* ======================
   Assignment-Compliant Priority Checker (single, compact)
   ====================== */
(function assignmentPriorityChecker() {
  // Elements
  const form = document.getElementById('mc-form');
  if (!form) return;
  const conditionEl = document.getElementById('mc-condition');
  const daysEl = document.getElementById('mc-days');
  const inUseEl = document.getElementById('mc-inuse');
  const badge = document.getElementById('mc-badge');
  const errorEl = document.getElementById('mc-error');
  const btnSubmit = document.getElementById('mc-submit');
  const btnReset = document.getElementById('mc-reset');

  // Floating labels: ensure labels float for non-empty values
  const updateFilled = () => {
    form.querySelectorAll('.field').forEach(field => {
      const el = field.querySelector('input, select, textarea');
      if (!el) return;
      const hasValue =
        (el.tagName === 'SELECT' && el.value !== '') ||
        (el.tagName !== 'SELECT' && String(el.value).trim() !== '');
      field.classList.toggle('filled', hasValue);
    });
  };

  const setError = (msg) => {
    errorEl.textContent = msg || '';
    if (msg) {
      badge.textContent = '—';
      badge.dataset.level = 'low';
    }
  };

  function classify(condition, days, inUse) {
    // Validation
    if (!condition) return { error: 'Error: Machine condition is required. Choose Good, Worn, or Critical.' };
    if (!['Good', 'Worn', 'Critical'].includes(condition)) {
      return { error: 'Error: Machine condition must be Good, Worn, or Critical.' };
    }
    if (days === '' || days === null || isNaN(Number(days))) {
      return { error: 'Error: Days since last service must be a number (0 or more).' };
    }
    const d = Math.floor(Number(days));
    if (d < 0) return { error: 'Error: Days since last service cannot be negative.' };
    if (!inUse) return { error: "Error: 'Is the machine currently in use?' must be answered Yes or No." };

    // Rules
    let level;
    if (condition === 'Critical' || d >= 60) {
      level = 'High';
    } else if (condition === 'Worn' || (d >= 30 && d <= 59)) {
      level = 'Medium';
    } else if (condition === 'Good' && d < 30) {
      level = 'Low';
    } else {
      return { error: 'Error: Unable to determine priority from the provided inputs.' };
    }

    const inUseWarn = (inUse === 'Yes');
    const label = inUseWarn
      ? `${level} priority — WARNING: machine currently in use`
      : `${level} priority`;

    return { level, label, d, condition, inUseWarn };
  }

  const computeAndRender = () => {
    updateFilled();
    const condition = conditionEl.value.trim();
    const days = daysEl.value;
    const inUse = inUseEl.value;
    const result = classify(condition, days, inUse);

    if (result.error) {
      setError(result.error);
      return null;
    }
    setError('');
    badge.textContent = result.label;
    badge.dataset.level = result.level.toLowerCase();
    return result;
  };

  // Auto-evaluate as user types/selects (keeps UI responsive)
  form.addEventListener('input', computeAndRender);
  form.addEventListener('change', computeAndRender);

  // Submit explicitly confirms the result and raises a notification
  btnSubmit?.addEventListener('click', () => {
    const result = computeAndRender();
    if (!result) return;
    // Optional: log in Notifications panel
    addNotification(
      'Priority Checked',
      result.label,
      `Condition: ${result.condition}, Days: ${result.d}, In use: ${result.inUseWarn ? 'Yes' : 'No'}`
    );
  });

  // Reset restores pristine state
  btnReset?.addEventListener('click', () => {
    form.reset();
    updateFilled();
    setError('');
    badge.textContent = '—';
    badge.dataset.level = 'low';
  });

  // Initial state
  computeAndRender();
})();
