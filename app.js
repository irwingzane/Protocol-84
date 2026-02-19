import {
  getSession,
  setSession,
  clearSession,
  getEmployees,
  upsertEmployee,
  updateEmployeeProgress,
} from './storage.js';

const TOTAL_WEEKS = 12;
const THEME_KEY = 'protocol84_theme';
const WEEK_CONTENT_KEY = 'protocol84_week_content';

const WEEK_HASH_PREFIX = 'week-';

/** Currently open week (1–12). Set when opening week-detail; used so notes always load/save for the correct week. */
let currentWeekDetailNum = null;

function getWeekFromHash() {
  const raw = typeof window !== 'undefined' && window.location ? window.location.hash : '';
  const hash = raw && raw.charAt(0) === '#' ? raw.slice(1) : raw;
  if (!hash || !hash.startsWith(WEEK_HASH_PREFIX)) return null;
  const num = parseInt(hash.slice(WEEK_HASH_PREFIX.length), 10);
  return num >= 1 && num <= TOTAL_WEEKS ? num : null;
}

function setWeekHash(week) {
  if (typeof window === 'undefined' || !window.location) return;
  const w = typeof week === 'number' && week >= 1 && week <= TOTAL_WEEKS ? week : null;
  const want = w != null ? WEEK_HASH_PREFIX + w : '';
  if (window.location.hash !== want) window.location.hash = want;
}

function getCurrentWeekForDetail() {
  const fromHash = getWeekFromHash();
  if (fromHash != null) return fromHash;
  return currentWeekDetailNum >= 1 && currentWeekDetailNum <= TOTAL_WEEKS ? currentWeekDetailNum : null;
}

function getWeekContent(week) {
  try {
    const raw = localStorage.getItem(WEEK_CONTENT_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[String(week)] || null;
  } catch (_) {}
  return null;
}

function setWeekContent(week, data) {
  try {
    const raw = localStorage.getItem(WEEK_CONTENT_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[String(week)] = { ...(all[String(week)] || {}), ...data };
    localStorage.setItem(WEEK_CONTENT_KEY, JSON.stringify(all));
  } catch (_) {}
}

function getAllWeeksContent() {
  try {
    const raw = localStorage.getItem(WEEK_CONTENT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {}
  return {};
}

function getTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (_) {}
  return 'dark';
}

function setTheme(theme) {
  const shell = document.getElementById('appShell');
  if (shell) shell.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (_) {}
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.classList.toggle('theme-is-light', theme === 'light');
    toggle.classList.toggle('theme-is-dark', theme === 'dark');
    toggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  }
}

function initTheme() {
  const theme = getTheme();
  setTheme(theme);
}

function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const shell = document.getElementById('appShell');
    const next = shell?.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(next);
  });
}

function getCompanyAccess() {
  try {
    const raw = localStorage.getItem('companyAccess');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function initAccessStatus() {
  const el = document.getElementById('accessStatus');
  if (!el) return;
  const access = getCompanyAccess();
  if (access) {
    el.textContent = `Demo mode (tier: ${access.tier || 'demo'}) – metrics are for example only`;
    el.setAttribute('data-short', 'Demo');
    el.classList.add('access-active');
  } else {
    el.textContent = 'Demo mode – company access not yet purchased';
    el.setAttribute('data-short', 'No access');
    el.classList.add('access-inactive');
  }
}

function initHeaderButtons() {
  const backBtn = document.getElementById('backToMarketing');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = './index.html';
    });
  }

  const logoutBtn = document.getElementById('logoutButton');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearSession();
      showView('login');
      logoutBtn.hidden = true;
    });
  }
}

function showView(view) {
  document.querySelectorAll('.app-view').forEach((el) => {
    if (el.dataset.view === view) {
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  });
}

function switchEmployeeSection(section) {
  document.querySelectorAll('[data-employee-section-view]').forEach((el) => {
    el.hidden = el.dataset.employeeSectionView !== section;
  });
  document.querySelectorAll('[data-employee-section]').forEach((btn) => {
    btn.classList.toggle('app-nav-item-active', btn.dataset.employeeSection === section);
  });
}

function switchAdminSection(section) {
  document.querySelectorAll('[data-admin-section-view]').forEach((el) => {
    el.hidden = el.dataset.adminSectionView !== section;
  });
  document.querySelectorAll('[data-admin-section]').forEach((btn) => {
    btn.classList.toggle('app-nav-item-active', btn.dataset.adminSection === section);
  });
  if (section === 'notes') renderAdminNotes();
}

function initLoginTabs() {
  const tabs = document.querySelectorAll('[data-role-tab]');
  const employeePanel = document.getElementById('employeeLoginPanel');
  const adminPanel = document.getElementById('adminLoginPanel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const role = tab.dataset.roleTab;
      tabs.forEach((t) => t.classList.remove('login-tab-active'));
      tab.classList.add('login-tab-active');

      if (role === 'employee') {
        employeePanel.hidden = false;
        adminPanel.hidden = true;
        adminPanel.classList.add('login-panel-hidden');
      } else {
        employeePanel.hidden = true;
        adminPanel.hidden = false;
        adminPanel.classList.remove('login-panel-hidden');
      }
    });
  });
}

function initEmployeeLogin() {
  const form = document.getElementById('employeeLoginForm');
  const statusEl = document.getElementById('employeeLoginStatus');
  if (!form || !statusEl) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const companyCode = (data.get('companyCode') || '').toString().trim() || 'DEMO';
    const email = (data.get('email') || '').toString().trim().toLowerCase() || 'employee@demo.com';
    const name = (data.get('name') || '').toString().trim();

    const employee = upsertEmployee({
      role: 'employee',
      companyCode,
      email,
      name: name || email.split('@')[0],
      weeksCompleted: 0,
      lastActivity: new Date().toISOString(),
    });

    setSession({ role: 'employee', email: employee.email });
    statusEl.textContent = '';
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) logoutBtn.hidden = false;
    showEmployeeDashboard(employee);
  });
}

function initAdminLogin() {
  const form = document.getElementById('adminLoginForm');
  const statusEl = document.getElementById('adminLoginStatus');
  if (!form || !statusEl) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const companyCode = (data.get('companyCode') || '').toString().trim() || 'DEMO';
    const email = (data.get('email') || '').toString().trim().toLowerCase() || 'admin@company.com';

    setSession({ role: 'admin', email, companyCode });
    statusEl.textContent = '';
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) logoutBtn.hidden = false;
    showAdminDashboard();
  });
}

function showEmployeeDashboard(employeeFromLogin) {
  const session = getSession();
  let employee = employeeFromLogin;

  if (!employee && session?.email) {
    const employees = getEmployees();
    employee = employees.find((e) => e.email === session.email) || null;
  }

  if (!employee) {
    showView('login');
    return;
  }

  showView('employee');
  switchEmployeeSection('overview');

  const userBlock = document.getElementById('employeeUserBlock');
  if (userBlock) {
    userBlock.innerHTML = `
      <div class="app-user-name">${employee.name || employee.email}</div>
      <div class="app-user-meta">Employee • 12-week programme</div>
      <div class="app-user-meta">Company: ${employee.companyCode}</div>
    `;
  }

  const welcomeTitle = document.getElementById('employeeWelcomeTitle');
  if (welcomeTitle) {
    welcomeTitle.textContent = `Welcome back, ${employee.name || employee.email}.`;
  }

  renderEmployeeProgress(employee);
  renderEmployeeCurrentWeek(employee);
  renderEmployeeBadges(employee);
  renderEmployeeJourney(employee);
  renderEmployeeLibrary();
  renderEmployeeTraining();
  renderEmployeeMentalHealth();
  renderEmployeeNewsletter();

  const markWeekBtn = document.getElementById('markWeekCompleteButton');
  const undoWeekBtn = document.getElementById('undoWeekCompleteButton');

  function refreshAfterProgressChange(updatedEmployee) {
    if (!updatedEmployee) return;
    employee = updatedEmployee;
    renderEmployeeProgress(employee);
    renderEmployeeCurrentWeek(employee);
    renderEmployeeBadges(employee);
    renderEmployeeJourney(employee);
    if (undoWeekBtn) undoWeekBtn.hidden = (employee.weeksCompleted || 0) === 0;
  }

  if (markWeekBtn) {
    markWeekBtn.onclick = () => {
      const updated = updateEmployeeProgress(employee.email, (current) => {
        const weeksCompleted = Math.min((current.weeksCompleted || 0) + 1, TOTAL_WEEKS);
        return {
          ...current,
          weeksCompleted,
          lastActivity: new Date().toISOString(),
        };
      });
      refreshAfterProgressChange(updated);
    };
  }

  if (undoWeekBtn) {
    undoWeekBtn.hidden = (employee.weeksCompleted || 0) === 0;
    undoWeekBtn.onclick = () => {
      const updated = updateEmployeeProgress(employee.email, (current) => {
        const weeksCompleted = Math.max(0, (current.weeksCompleted || 0) - 1);
        return {
          ...current,
          weeksCompleted,
          lastActivity: new Date().toISOString(),
        };
      });
      refreshAfterProgressChange(updated);
    };
  }

  const weekFromHash = getWeekFromHash();
  if (weekFromHash != null) {
    currentWeekDetailNum = weekFromHash;
    const section = document.querySelector('.employee-section[data-employee-section-view="week-detail"]');
    if (section) section.dataset.currentWeek = String(weekFromHash);
    switchEmployeeSection('week-detail');
    requestAnimationFrame(() => renderWeekDetail());
  }
}

function renderEmployeeProgress(employee) {
  const progress = Math.round(((employee.weeksCompleted || 0) / TOTAL_WEEKS) * 100);
  const progressBar = document.getElementById('employeeProgressBar');
  const progressMeta = document.getElementById('employeeProgressMeta');
  const pill = document.getElementById('employeeProgressPill');

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
  if (progressMeta) {
    progressMeta.textContent = `${employee.weeksCompleted || 0} of ${TOTAL_WEEKS} weeks completed • ${progress}% total`;
  }
  if (pill) {
    pill.textContent =
      progress === 0
        ? 'Getting started – week 1'
        : progress >= 100
        ? 'Programme completed – maintain your habits'
        : `In progress – week ${Math.min((employee.weeksCompleted || 0) + 1, TOTAL_WEEKS)}`;
  }
}

function renderEmployeeCurrentWeek(employee) {
  const list = document.getElementById('employeeCurrentWeekList');
  if (!list) return;

  const week = Math.min((employee.weeksCompleted || 0) + 1, TOTAL_WEEKS);
  const themes = [
    'Foundation: movement, sleep, and baseline habits.',
    'Energy: building sustainable routines around your workday.',
    'Stress: tools to reset quickly between meetings.',
    'Focus: structuring deep-work blocks and communication.',
    'Resilience: handling setbacks and high-pressure periods.',
  ];
  const theme = themes[(week - 1) % themes.length];

  list.innerHTML = `
    <li><strong>Week ${week}</strong> — ${theme}</li>
    <li>3 x short, guided sessions (movement &amp; mobility).</li>
    <li>1 x habit focus with practical prompts.</li>
    <li>On-demand stress reset routine for busy days.</li>
  `;
}

function renderEmployeeBadges(employee) {
  const container = document.getElementById('employeeBadges');
  if (!container) return;
  const completed = employee.weeksCompleted || 0;

  const badges = [
    { id: 'start', label: 'Programme started', threshold: 1 },
    { id: 'half', label: '50% complete', threshold: 6 },
    { id: 'full', label: 'Programme complete', threshold: 12 },
  ];

  container.innerHTML = badges
    .map((b) => {
      const earned = completed >= b.threshold;
      return `
        <span class="badge-chip ${earned ? 'badge-chip-earned' : ''}">
          ${earned ? '<span class="badge-dot"></span>' : ''}
          ${b.label}
        </span>
      `;
    })
    .join('');
}

const WEEK_FOCUS = [
  'Foundations &amp; energy',
  'Foundations &amp; energy',
  'Foundations &amp; energy',
  'Foundations &amp; energy',
  'Execution &amp; resilience',
  'Execution &amp; resilience',
  'Execution &amp; resilience',
  'Execution &amp; resilience',
  'Integration &amp; leadership',
  'Integration &amp; leadership',
  'Integration &amp; leadership',
  'Integration &amp; leadership',
];

function renderEmployeeJourney(employee) {
  const grid = document.getElementById('employeeJourneyGrid');
  if (!grid) return;
  const completedWeeks = employee.weeksCompleted || 0;
  const currentWeek = Math.min(completedWeeks + 1, TOTAL_WEEKS);

  const cards = [];
  for (let week = 1; week <= TOTAL_WEEKS; week += 1) {
    let statusClass = 'journey-status-upcoming';
    let statusLabel = 'Upcoming';
    if (week <= completedWeeks) {
      statusClass = 'journey-status-completed';
      statusLabel = 'Completed';
    } else if (week === currentWeek) {
      statusClass = 'journey-status-current';
      statusLabel = 'Current';
    }
    const focus = WEEK_FOCUS[week - 1] || 'Performance focus';
    cards.push(`
      <button type="button" class="journey-card journey-card-clickable" data-week="${week}" aria-label="Open week ${week} content">
        <div class="journey-card-header">
          <span class="journey-week-label">Week ${week}</span>
          <span class="journey-status-pill ${statusClass}">${statusLabel}</span>
        </div>
        <p>Performance focus: ${focus}.</p>
      </button>
    `);
  }
  grid.innerHTML = cards.join('');
  // Clicks are handled by a single document-level listener in initWeekDetail that reads data-week from the clicked button
}

function openWeekDetail(week) {
  const weekNum = typeof week === 'number' && week >= 1 && week <= TOTAL_WEEKS ? week : null;
  if (weekNum == null) return;
  currentWeekDetailNum = weekNum;
  setWeekHash(weekNum);
  const section = document.querySelector('.employee-section[data-employee-section-view="week-detail"]');
  if (section) section.dataset.currentWeek = String(weekNum);
  switchEmployeeSection('week-detail');
  closeDashboardSidebar();
  requestAnimationFrame(() => renderWeekDetail());
}

function renderWeekDetail() {
  const section = document.querySelector('.employee-section[data-employee-section-view="week-detail"]');
  const weekLabel = getCurrentWeekForDetail() || parseInt(section?.dataset?.currentWeek || '0', 10);
  if (weekLabel < 1 || weekLabel > TOTAL_WEEKS) return;
  currentWeekDetailNum = weekLabel;
  if (!section) return;
  section.dataset.currentWeek = String(weekLabel);

  const eyebrow = section.querySelector('#weekDetailEyebrow') || document.getElementById('weekDetailEyebrow');
  const title = section.querySelector('#weekDetailTitle') || document.getElementById('weekDetailTitle');
  const subtitle = section.querySelector('#weekDetailSubtitle') || document.getElementById('weekDetailSubtitle');
  const videoContainer = section.querySelector('#weekDetailVideo') || document.getElementById('weekDetailVideo');
  const pdfContainer = section.querySelector('#weekDetailPdf') || document.getElementById('weekDetailPdf');
  const notesInput = section.querySelector('#weekDetailNotes') || document.getElementById('weekDetailNotes');
  const visibleToggle = section.querySelector('#weekDetailNotesVisibleToAdmin') || document.getElementById('weekDetailNotesVisibleToAdmin');
  const saveStatus = section.querySelector('#weekDetailSaveStatus') || document.getElementById('weekDetailSaveStatus');

  const focus = weekLabel <= 4 ? 'Foundations & energy' : weekLabel <= 8 ? 'Execution & resilience' : 'Integration & leadership';
  if (eyebrow) eyebrow.textContent = `Week ${weekLabel}`;
  if (title) title.textContent = `Week ${weekLabel}: ${focus}`;
  if (subtitle) subtitle.textContent = 'Video and resources for this week.';

  const content = getWeekContent(weekLabel);

  if (videoContainer) {
    if (content?.videoUrl) {
      videoContainer.innerHTML = `
        <video class="week-detail-video" controls preload="metadata" aria-label="Week ${weekLabel} video">
          <source src="${content.videoUrl}" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      `;
    } else {
      videoContainer.innerHTML = '<p class="week-detail-placeholder">Video will appear here when added for this week.</p>';
    }
  }

  if (pdfContainer) {
    if (content?.pdfUrl) {
      pdfContainer.innerHTML = `
        <a href="${content.pdfUrl}" class="btn btn-primary" download target="_blank" rel="noopener noreferrer">Download PDF for Week ${weekLabel}</a>
        <p class="form-footnote">Or <a href="${content.pdfUrl}" target="_blank" rel="noopener noreferrer">open in new tab</a>.</p>
      `;
    } else {
      pdfContainer.innerHTML = '<p class="week-detail-placeholder">PDF will be available when added for this week.</p>';
    }
  }

  if (notesInput) notesInput.value = content?.notes || '';
  if (visibleToggle) visibleToggle.checked = !!content?.notesVisibleToAdmin;
  if (saveStatus) saveStatus.textContent = '';
}

function initWeekDetail() {
  // Single document-level listener: read week only from the clicked button (avoids wrong week)
  document.addEventListener(
    'click',
    (e) => {
      const grid = document.getElementById('employeeJourneyGrid');
      if (!grid || !grid.contains(e.target)) return;
      const btn = e.target.closest && e.target.closest('button[data-week]');
      if (!btn) return;
      const weekStr = btn.getAttribute('data-week');
      const weekNum = weekStr != null ? parseInt(weekStr, 10) : 0;
      if (weekNum < 1 || weekNum > TOTAL_WEEKS) return;
      e.preventDefault();
      e.stopPropagation();
      currentWeekDetailNum = weekNum;
      openWeekDetail(weekNum);
    },
    true
  );

  window.addEventListener('hashchange', () => {
    const week = getWeekFromHash();
    const section = document.querySelector('.employee-section[data-employee-section-view="week-detail"]');
    if (week != null && section && !section.hidden) {
      currentWeekDetailNum = week;
      renderWeekDetail();
    }
  });

  const backBtn = document.getElementById('weekDetailBack');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      currentWeekDetailNum = null;
      setWeekHash('');
      switchEmployeeSection('journey');
      closeDashboardSidebar();
    });
  }

  const saveNotesBtn = document.getElementById('weekDetailSaveNotes');
  if (saveNotesBtn) {
    saveNotesBtn.addEventListener('click', () => {
      const weekNum = getCurrentWeekForDetail();
      if (weekNum == null || weekNum < 1 || weekNum > TOTAL_WEEKS) return;
      const notesInput = document.getElementById('weekDetailNotes');
      const visibleToggle = document.getElementById('weekDetailNotesVisibleToAdmin');
      const saveStatus = document.getElementById('weekDetailSaveStatus');
      setWeekContent(weekNum, {
        notes: (notesInput?.value || '').trim() || null,
        notesVisibleToAdmin: !!visibleToggle?.checked,
      });
      if (saveStatus) saveStatus.textContent = 'Notes saved.';
      renderWeekDetail();
    });
  }

  const protocolBtn = document.getElementById('weekDetailProtocolBtn');
  if (protocolBtn) {
    protocolBtn.addEventListener('click', () => {
      const weekNum = getCurrentWeekForDetail();
      const notesInput = document.getElementById('weekDetailNotes');
      const notes = (notesInput?.value || '').trim();
      const content = weekNum != null ? getWeekContent(weekNum) : null;
      const notesForContext = notes || content?.notes || '';
      try {
        sessionStorage.setItem('protocol84_notes_context', notesForContext);
      } catch (_) {}
      switchEmployeeSection('protocol');
      closeDashboardSidebar();
    });
  }
}

function renderEmployeeLibrary() {
  const grid = document.getElementById('employeeLibraryGrid');
  if (!grid) return;

  const items = [
    {
      category: 'Movement',
      title: '20-minute desk reset',
      meta: 'Guided session • Low impact',
    },
    {
      category: 'Stress',
      title: 'Pre-meeting reset',
      meta: 'Breathing &amp; mental reset • 8 min',
    },
    {
      category: 'Productivity',
      title: '90-minute execution block',
      meta: 'Structure &amp; prompts',
    },
    {
      category: 'Habits',
      title: 'Designing sustainable routines',
      meta: 'Short module',
    },
    {
      category: 'Nutrition',
      title: 'Fuel for high-output days',
      meta: 'Guidelines &amp; templates',
    },
    {
      category: 'Resilience',
      title: 'Managing setbacks under pressure',
      meta: 'Mindset tools',
    },
  ];

  grid.innerHTML = items
    .map(
      (item) => `
      <article class="library-card">
        <div class="library-category">${item.category}</div>
        <div class="library-title">${item.title}</div>
        <div class="library-meta">${item.meta}</div>
      </article>
    `
    )
    .join('');
}

function renderEmployeeTraining() {
  const grid = document.getElementById('employeeTrainingGrid');
  if (!grid) return;
  const items = [
    { category: 'Strength', title: 'Full body strength circuit', meta: '40 min • Intermediate' },
    { category: 'Conditioning', title: 'Boxing conditioning basics', meta: '25 min • Beginner' },
    { category: 'Mobility', title: 'Morning mobility flow', meta: '15 min • All levels' },
    { category: 'Strength', title: 'Lower body & core', meta: '35 min • Intermediate' },
  ];
  grid.innerHTML = items
    .map(
      (item) => `
      <article class="library-card">
        <div class="library-category">${item.category}</div>
        <div class="library-title">${item.title}</div>
        <div class="library-meta">${item.meta}</div>
      </article>
    `
    )
    .join('');
}

function renderEmployeeMentalHealth() {
  const grid = document.getElementById('employeeMentalHealthGrid');
  if (!grid) return;
  const items = [
    { category: 'Stress', title: '5-minute stress reset', meta: 'Breathing & grounding • 5 min' },
    { category: 'Mindfulness', title: 'Daily mindfulness', meta: 'Focus & clarity • 12 min' },
    { category: 'Resilience', title: 'Resilience building blocks', meta: 'Core practices' },
    { category: 'Habits', title: 'Habit stacking', meta: 'Sustainable routines' },
  ];
  grid.innerHTML = items
    .map(
      (item) => `
      <article class="library-card">
        <div class="library-category">${item.category}</div>
        <div class="library-title">${item.title}</div>
        <div class="library-meta">${item.meta}</div>
      </article>
    `
    )
    .join('');
}

function renderEmployeeNewsletter() {
  const grid = document.getElementById('employeeNewsletterGrid');
  if (!grid) return;
  const items = [
    { category: 'Newsletter', title: 'Subscribe to Zane\'s Newsletter', meta: 'Monthly science-based fitness updates' },
    { category: 'Archive', title: 'Past issues', meta: 'Browse previous editions' },
  ];
  grid.innerHTML = items
    .map(
      (item) => `
      <article class="library-card">
        <div class="library-category">${item.category}</div>
        <div class="library-title">${item.title}</div>
        <div class="library-meta">${item.meta}</div>
      </article>
    `
    )
    .join('');
}

function showAdminDashboard() {
  showView('admin');
  switchAdminSection('analytics');

  const userBlock = document.getElementById('adminUserBlock');
  const session = getSession();
  if (userBlock && session) {
    userBlock.innerHTML = `
      <div class="app-user-name">Admin</div>
      <div class="app-user-meta">${session.email}</div>
      <div class="app-user-meta">Company code: ${session.companyCode || 'N/A'}</div>
    `;
  }

  renderAdminHeroCard();
  renderAdminMetrics();
  renderAdminEmployees();
  initAdminActions();
}

function calculateMetrics() {
  const employees = getEmployees();
  const totalEmployees = employees.length || 0;
  const totalWeeksCompleted = employees.reduce((sum, e) => sum + (e.weeksCompleted || 0), 0);
  const avgCompletion =
    totalEmployees === 0 ? 0 : Math.round((totalWeeksCompleted / (totalEmployees * TOTAL_WEEKS)) * 100);
  const engagedEmployees = employees.filter((e) => (e.weeksCompleted || 0) > 0).length;
  const engagedRate = totalEmployees === 0 ? 0 : Math.round((engagedEmployees / totalEmployees) * 100);
  const burnoutRiskDelta = totalEmployees === 0 ? 0 : -Math.round(avgCompletion / 5);
  // Projected outcomes based on programme engagement (illustrative)
  const projectedPerformanceGain = Math.round(avgCompletion * 0.35);
  const projectedStressReduction = Math.round(avgCompletion * 0.28);
  const projectedProductivityGain = Math.round(avgCompletion * 0.22);

  return {
    totalEmployees,
    avgCompletion,
    engagedRate,
    burnoutRiskDelta,
    projectedPerformanceGain,
    projectedStressReduction,
    projectedProductivityGain,
  };
}

function renderAdminHeroCard() {
  const grid = document.getElementById('adminHeroMetricsGrid');
  if (!grid) return;
  const { avgCompletion, engagedRate, burnoutRiskDelta, projectedPerformanceGain, projectedStressReduction, projectedProductivityGain } = calculateMetrics();
  const burnoutDisplay = burnoutRiskDelta <= 0 ? Math.abs(burnoutRiskDelta) + '% lower' : burnoutRiskDelta + '%';
  grid.innerHTML = `
    <div class="metric-card">
      <p class="metric-label">Programme engagement</p>
      <p class="metric-value">${engagedRate}%</p>
      <div class="metric-trend metric-trend-up">${avgCompletion}% avg completion</div>
    </div>
    <div class="metric-card">
      <p class="metric-label">Burnout risk</p>
      <p class="metric-value">${burnoutDisplay}</p>
      <div class="metric-trend metric-trend-up">Improving</div>
    </div>
    <div class="metric-card">
      <p class="metric-label">Productivity index</p>
      <p class="metric-value">+${projectedProductivityGain}%</p>
      <div class="metric-trend metric-trend-up">Projected</div>
    </div>
    <div class="metric-card">
      <p class="metric-label">Performance gain</p>
      <p class="metric-value">+${projectedPerformanceGain}%</p>
      <div class="metric-trend metric-trend-up">From programme</div>
    </div>
  `;

  renderAdminHeroChart(avgCompletion, engagedRate);
}

function renderAdminHeroChart(avgCompletion, engagedRate) {
  const container = document.getElementById('adminHeroChart');
  if (!container) return;

  const points = 6;
  const current = Math.max(avgCompletion, 5);
  const growth = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const value = 2 + (current - 2) * Math.pow(t, 0.8);
    growth.push(Math.min(100, Math.round(value * 10) / 10));
  }
  growth[points - 1] = current;

  const yMin = 0;
  const dataMax = Math.max(...growth);
  const yMax = Math.min(100, dataMax + 12);
  const yRange = yMax - yMin || 1;

  const yTickStep = yMax <= 30 ? 10 : yMax <= 60 ? 20 : 25;
  const yTicks = [];
  for (let t = 0; t <= yMax; t += yTickStep) yTicks.push(t);
  if (yTicks.length < 2) yTicks.push(yMax);
  if (yTicks[yTicks.length - 1] < yMax) yTicks.push(yMax);

  const svgWidth = 320;
  const svgHeight = 160;
  const padding = { top: 12, right: 12, bottom: 28, left: 36 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const x = (i) => padding.left + (i / (points - 1)) * chartWidth;
  const y = (v) => padding.top + chartHeight - ((v - yMin) / yRange) * chartHeight;

  const areaPath =
    `M ${x(0)} ${y(growth[0])}` +
    growth.slice(1).map((v, i) => ` L ${x(i + 1)} ${y(v)}`).join('') +
    ` L ${x(points - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;
  const linePath =
    `M ${x(0)} ${y(growth[0])}` +
    growth.slice(1).map((v, i) => ` L ${x(i + 1)} ${y(v)}`).join('');

  const yTickLines = yTicks
    .map(
      (tick) =>
        `<line x1="${padding.left}" y1="${y(tick)}" x2="${padding.left + chartWidth}" y2="${y(tick)}" class="hero-chart-grid"/>`
    )
    .join('');
  const yLabels = yTicks
    .map(
      (tick) =>
        `<text x="${padding.left - 6}" y="${y(tick)}" class="hero-chart-axis" text-anchor="end" dominant-baseline="middle">${tick}%</text>`
    )
    .join('');

  const xLabels = ['Start', 'M1', 'M2', 'M3', 'M4', 'Now'];
  const xLabelEls = xLabels
    .map(
      (label, i) =>
        `<text x="${x(i)}" y="${svgHeight - 6}" class="hero-chart-axis hero-chart-axis-x" text-anchor="middle">${label}</text>`
    )
    .join('');

  const circles = growth
    .map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="3" class="hero-chart-dot" fill="currentColor"/>`)
    .join('');

  container.innerHTML = `
    <div class="hero-chart-box">
      <p class="hero-chart-title">Engagement &amp; completion trend</p>
      <svg class="hero-growth-chart" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="heroChartGradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="rgba(37, 99, 235, 0.3)"/>
          <stop offset="100%" stop-color="rgba(139, 92, 246, 0.08)"/>
        </linearGradient>
      </defs>
      <rect x="${padding.left}" y="${padding.top}" width="${chartWidth}" height="${chartHeight}" class="hero-chart-plot-area" fill="none" stroke="currentColor"/>
      ${yTickLines}
      ${yLabels}
      ${xLabelEls}
      <path d="${areaPath}" class="hero-chart-area" fill="url(#heroChartGradient)"/>
      <path d="${linePath}" class="hero-chart-line" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      ${circles}
    </svg>
    </div>
  `;
}

function renderAdminMetrics() {
  const grid = document.getElementById('adminMetricsGrid');
  if (!grid) return;
  const {
    totalEmployees,
    avgCompletion,
    engagedRate,
    burnoutRiskDelta,
    projectedPerformanceGain,
    projectedStressReduction,
    projectedProductivityGain,
  } = calculateMetrics();
  const burnoutDisplay = burnoutRiskDelta <= 0 ? Math.abs(burnoutRiskDelta) + '% lower' : burnoutRiskDelta + '%';

  grid.innerHTML = `
    <article class="admin-metric-card">
      <div class="admin-metric-label">Average programme completion</div>
      <div class="admin-metric-value">${avgCompletion}%</div>
      <div class="admin-metric-footnote">Average of weeks completed across enrolled employees.</div>
      <div class="admin-metric-bar">
        <div class="admin-metric-bar-inner" style="width: ${avgCompletion}%;"></div>
      </div>
    </article>
    <article class="admin-metric-card">
      <div class="admin-metric-label">Engaged employees</div>
      <div class="admin-metric-value">${engagedRate}%</div>
      <div class="admin-metric-footnote">${totalEmployees} employees in this browser’s dataset.</div>
      <div class="admin-metric-bar">
        <div class="admin-metric-bar-inner" style="width: ${engagedRate}%;"></div>
      </div>
    </article>
    <article class="admin-metric-card">
      <div class="admin-metric-label">Projected improved performance at work</div>
      <div class="admin-metric-value">+${projectedPerformanceGain}%</div>
      <div class="admin-metric-footnote">Estimated performance gain from programme engagement (illustrative).</div>
      <div class="admin-metric-bar">
        <div class="admin-metric-bar-inner" style="width: ${Math.min(projectedPerformanceGain, 100)}%;"></div>
      </div>
    </article>
    <article class="admin-metric-card">
      <div class="admin-metric-label">Projected lowered stress</div>
      <div class="admin-metric-value">${projectedStressReduction}%</div>
      <div class="admin-metric-footnote">Estimated stress reduction from resilience and habit modules (illustrative).</div>
      <div class="admin-metric-bar">
        <div class="admin-metric-bar-inner" style="width: ${Math.min(projectedStressReduction, 100)}%; background: linear-gradient(90deg, #22c55e, #4ade80);"></div>
      </div>
    </article>
    <article class="admin-metric-card">
      <div class="admin-metric-label">Projected productivity gain</div>
      <div class="admin-metric-value">+${projectedProductivityGain}%</div>
      <div class="admin-metric-footnote">Estimated productivity index improvement (illustrative).</div>
      <div class="admin-metric-bar">
        <div class="admin-metric-bar-inner" style="width: ${Math.min(projectedProductivityGain, 100)}%;"></div>
      </div>
    </article>
    <article class="admin-metric-card">
      <div class="admin-metric-label">Burnout risk (indicative)</div>
      <div class="admin-metric-value">${burnoutDisplay}</div>
      <div class="admin-metric-footnote">Illustrative reduction based on engagement and completion.</div>
      <div class="admin-metric-bar">
        <div class="admin-metric-bar-inner" style="width: ${Math.min(Math.abs(burnoutRiskDelta), 100)}%; background: linear-gradient(90deg, #f97316, #fb7185);"></div>
      </div>
    </article>
  `;
}

function renderAdminEmployees() {
  const tbody = document.getElementById('adminEmployeeTableBody');
  if (!tbody) return;
  const employees = getEmployees();

  if (employees.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No employee data yet. As employees log in and interact with the programme, they will appear here.</td></tr>`;
    return;
  }

  tbody.innerHTML = employees
    .map((e) => {
      const completion = Math.round(((e.weeksCompleted || 0) / TOTAL_WEEKS) * 100);
      const lastActivity = e.lastActivity ? new Date(e.lastActivity).toLocaleDateString() : '—';
      return `
        <tr>
          <td>${e.name || 'Employee'}</td>
          <td>${e.email}</td>
          <td>${e.weeksCompleted || 0}</td>
          <td>${completion}%</td>
          <td>${lastActivity}</td>
        </tr>
      `;
    })
    .join('');
}

function renderAdminNotes() {
  const placeholder = document.getElementById('adminNotesPlaceholder');
  const content = document.getElementById('adminNotesContent');
  if (!placeholder || !content) return;

  const all = getAllWeeksContent();
  const weeksWithNotes = [];
  for (let week = 1; week <= TOTAL_WEEKS; week += 1) {
    const c = all[String(week)];
    if (c?.notesVisibleToAdmin && (c.notes != null && c.notes !== '')) {
      weeksWithNotes.push({ week, notes: c.notes });
    }
  }

  if (weeksWithNotes.length === 0) {
    placeholder.hidden = false;
    content.hidden = true;
    content.innerHTML = '';
    return;
  }

  placeholder.hidden = true;
  content.hidden = false;
  content.innerHTML = weeksWithNotes
    .map(
      ({ week, notes }) => `
    <div class="admin-notes-item card">
      <h3 class="admin-notes-item-title">Week ${week}</h3>
      <div class="admin-notes-item-body">${escapeHtml(notes).replace(/\n/g, '<br>')}</div>
    </div>
  `
    )
    .join('');
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function initAdminActions() {
  const simulateBtn = document.getElementById('simulateActivityButton');
  if (simulateBtn) {
    simulateBtn.onclick = () => {
      const employees = getEmployees();
      if (employees.length === 0) return;
      employees.forEach((e) => {
        updateEmployeeProgress(e.email, (current) => {
          const increment = Math.random() < 0.5 ? 0 : 1;
          const weeksCompleted = Math.min((current.weeksCompleted || 0) + increment, TOTAL_WEEKS);
          return {
            ...current,
            weeksCompleted,
            lastActivity: new Date().toISOString(),
          };
        });
      });
      renderAdminHeroCard();
      renderAdminMetrics();
      renderAdminEmployees();
    };
  }

  const downloadBtn = document.getElementById('downloadReportButton');
  const statusEl = document.getElementById('reportStatus');
  if (downloadBtn && statusEl) {
    downloadBtn.onclick = () => {
      const data = {
        generatedAt: new Date().toISOString(),
        metrics: calculateMetrics(),
        employees: getEmployees(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'performance-resilience-report.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      statusEl.textContent = 'Sample report downloaded.';
    };
  }
}

function initNavListeners() {
  document.querySelectorAll('[data-employee-section]').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchEmployeeSection(btn.dataset.employeeSection);
    });
  });

  document.querySelectorAll('[data-admin-section]').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchAdminSection(btn.dataset.adminSection);
    });
  });
}

function restoreSession() {
  const session = getSession();
  const logoutBtn = document.getElementById('logoutButton');
  if (session && logoutBtn) logoutBtn.hidden = false;

  if (!session) {
    showView('login');
    return;
  }

  if (session.role === 'employee') {
    showEmployeeDashboard();
  } else if (session.role === 'admin') {
    showAdminDashboard();
  } else {
    showView('login');
  }
}

function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = document.querySelectorAll('.reveal-on-scroll');

  document.body.classList.add('enable-scroll-reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('reveal-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initThemeToggle();
  initAccessStatus();
  initHeaderButtons();
  initLoginTabs();
  initEmployeeLogin();
  initAdminLogin();
  initNavListeners();
  initWeekDetail();
  initScrollReveal();
  restoreSession();
});

