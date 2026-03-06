/* =============================================
   BASTIOR SUB-SECTOR — TYRANNIC WAR CRUSADE
   Main JavaScript
   ============================================= */

'use strict';

/* ---- NAV TOGGLE ---- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    navLinks.classList.contains('open')
      ? (spans[0].style.transform='rotate(45deg) translate(5px,5px)', spans[1].style.opacity='0', spans[2].style.transform='rotate(-45deg) translate(5px,-5px)')
      : (spans[0].style.transform='', spans[1].style.opacity='', spans[2].style.transform='');
  });
}

/* ---- ACTIVE NAV LINK ---- */
(function highlightNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ---- ANIMATE IN ON SCROLL ---- */
(function initScrollReveal() {
  const els = document.querySelectorAll('.animate-in');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
})();

/* ---- THREAT BAR ANIMATION ---- */
(function animateThreatBars() {
  const bars = document.querySelectorAll('.threat-bar-fill');
  if (!bars.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.dataset.width || '0%';
        setTimeout(() => { el.style.width = target; }, 150);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => {
    const targetW = bar.style.width || bar.dataset.width || '0%';
    bar.dataset.width = targetW;
    bar.style.width = '0%';
    observer.observe(bar);
  });
})();

/* ---- CRUSADE POINT TRACKER (localStorage) ---- */
const CP_KEY = 'bastior_crusade_points';
const SUPPLY_KEY = 'bastior_supply';

function getCPData() {
  try {
    return JSON.parse(localStorage.getItem(CP_KEY)) || { points: 0, supply: 50, history: [] };
  } catch { return { points: 0, supply: 50, history: [] }; }
}
function saveCPData(data) {
  try { localStorage.setItem(CP_KEY, JSON.stringify(data)); } catch {}
}

window.CrusadeTracker = {
  getData: getCPData,
  addPoints(n, reason) {
    const d = getCPData();
    d.points += n;
    d.history.push({ action: `+${n} CP`, reason, ts: Date.now() });
    saveCPData(d);
    this.refresh();
  },
  spendPoints(n, reason) {
    const d = getCPData();
    if (d.points < n) return false;
    d.points -= n;
    d.history.push({ action: `-${n} CP`, reason, ts: Date.now() });
    saveCPData(d);
    this.refresh();
    return true;
  },
  refresh() {
    const d = getCPData();
    document.querySelectorAll('.cp-live').forEach(el => {
      el.textContent = d.points;
    });
    document.querySelectorAll('.supply-live').forEach(el => {
      el.textContent = d.supply;
    });
  },
  reset() {
    if (confirm('Reset all Crusade Points? This cannot be undone.')) {
      saveCPData({ points: 0, supply: 50, history: [] });
      this.refresh();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.CrusadeTracker.refresh();
});

/* ---- BATTLE RESULT LOGGER ---- */
const BR_KEY = 'bastior_battle_log';

window.BattleLog = {
  getAll() {
    try { return JSON.parse(localStorage.getItem(BR_KEY)) || []; } catch { return []; }
  },
  add(entry) {
    const log = this.getAll();
    entry.id = Date.now();
    log.unshift(entry);
    if (log.length > 50) log.pop();
    try { localStorage.setItem(BR_KEY, JSON.stringify(log)); } catch {}
    return entry;
  },
  render(container) {
    if (!container) return;
    const log = this.getAll();
    if (!log.length) {
      container.innerHTML = '<p class="text-dim" style="font-style:italic;font-size:0.85rem;">No battles recorded yet.</p>';
      return;
    }
    container.innerHTML = log.map(b => `
      <div class="timeline-entry animate-in">
        <div class="timeline-date">${b.date || 'Unknown Date'} — Mission ${b.mission || '?'}</div>
        <div class="timeline-title">${b.title || 'Battle Record'}</div>
        <div class="timeline-body">
          <span class="badge ${b.result === 'Victory' ? 'badge-gold' : b.result === 'Defeat' ? 'badge-blood' : 'badge-steel'}">${b.result || 'Unknown'}</span>
          ${b.notes ? `<p style="margin-top:0.5rem;font-size:0.85rem;">${b.notes}</p>` : ''}
          <div style="margin-top:0.5rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
            ${b.cp ? `<span class="badge badge-gold">+${b.cp} CP</span>` : ''}
            ${b.honours ? b.honours.map(h => `<span class="badge badge-steel">${h}</span>`).join('') : ''}
          </div>
        </div>
      </div>
    `).join('');
  }
};

/* ---- FORCE ROSTER DATA ---- */
const ROSTER_KEY = 'bastior_roster';

window.RosterManager = {
  getAll() {
    try { return JSON.parse(localStorage.getItem(ROSTER_KEY)) || []; } catch { return []; }
  },
  save(units) {
    try { localStorage.setItem(ROSTER_KEY, JSON.stringify(units)); } catch {}
  },
  add(unit) {
    const u = this.getAll();
    unit.id = Date.now();
    unit.xp = unit.xp || 0;
    unit.rank = unit.rank || 'Battle-Ready';
    unit.honours = unit.honours || [];
    u.push(unit);
    this.save(u);
    return unit;
  },
  update(id, changes) {
    const u = this.getAll();
    const idx = u.findIndex(x => x.id === id);
    if (idx !== -1) { Object.assign(u[idx], changes); this.save(u); return u[idx]; }
    return null;
  },
  remove(id) {
    const u = this.getAll().filter(x => x.id !== id);
    this.save(u);
  },
  rankFromXP(xp) {
    if (xp >= 16) return 'Legendary';
    if (xp >= 11) return 'Heroic';
    if (xp >= 6)  return 'Blooded';
    if (xp >= 3)  return 'Battle-Hardened';
    return 'Battle-Ready';
  }
};

/* ---- SECTOR MAP INTERACTIVITY ---- */
window.SectorMap = {
  init() {
    document.querySelectorAll('.map-system').forEach(node => {
      node.addEventListener('mouseenter', e => this.showTooltip(e, node));
      node.addEventListener('mouseleave', () => this.hideTooltip());
      node.addEventListener('click', () => this.selectSystem(node));
    });
  },
  showTooltip(e, node) {
    const tooltip = document.getElementById('map-tooltip');
    if (!tooltip) return;
    tooltip.innerHTML = `
      <div class="mono" style="font-size:0.65rem;color:var(--text-dim);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.3rem">${node.dataset.type || 'System'}</div>
      <div style="font-family:var(--font-heading);color:var(--gold-light);margin-bottom:0.3rem">${node.dataset.name || '???'}</div>
      <div style="font-size:0.8rem;color:var(--text-main)">${node.dataset.status || ''}</div>
    `;
    tooltip.style.display = 'block';
    tooltip.style.opacity = '1';
  },
  hideTooltip() {
    const tooltip = document.getElementById('map-tooltip');
    if (tooltip) { tooltip.style.opacity = '0'; setTimeout(() => tooltip.style.display = 'none', 200); }
  },
  selectSystem(node) {
    document.querySelectorAll('.map-system').forEach(n => n.classList.remove('selected'));
    node.classList.add('selected');
    const panel = document.getElementById('selected-system-panel');
    if (!panel) return;
    panel.style.display = 'block';
    panel.querySelector('.selected-name').textContent = node.dataset.name || '???';
    panel.querySelector('.selected-type').textContent = node.dataset.type || '';
    panel.querySelector('.selected-status').textContent = node.dataset.status || '';
    panel.querySelector('.selected-control').textContent = node.dataset.control || '';
  }
};

/* ---- DICE ROLLER UTILITY ---- */
window.DiceRoller = {
  roll(sides, count = 1) {
    const results = [];
    for (let i = 0; i < count; i++) results.push(Math.floor(Math.random() * sides) + 1);
    return { results, total: results.reduce((a, b) => a + b, 0), sides, count };
  },
  d6(n = 1)  { return this.roll(6, n); },
  d3(n = 1)  { return this.roll(3, n); },
  displayRoll(containerId, sides, count) {
    const r = this.roll(sides, count);
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
      <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim);letter-spacing:0.1em;margin-bottom:0.5rem">
        ROLLING ${count}D${sides}
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin-bottom:0.5rem">
        ${r.results.map(v => `
          <div style="
            width:2.5rem;height:2.5rem;
            border:1px solid var(--gold-dim);
            display:flex;align-items:center;justify-content:center;
            font-family:var(--font-heading);font-size:1.1rem;color:var(--gold);
            background:rgba(200,150,12,0.08);
            animation:fadeIn 0.3s ease both;
          ">${v}</div>
        `).join('')}
      </div>
      <div style="font-family:var(--font-heading);font-size:0.85rem;color:var(--bone)">
        Total: <span style="color:var(--gold-light)">${r.total}</span>
      </div>
    `;
  }
};

/* ---- MODAL HANDLER ---- */
window.Modal = {
  open(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.style.display = 'flex';
    requestAnimationFrame(() => m.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
  },
  close(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('is-open');
    setTimeout(() => { m.style.display = 'none'; }, 300);
    document.body.style.overflow = '';
  }
};

document.querySelectorAll('[data-modal-close]').forEach(btn => {
  btn.addEventListener('click', () => Modal.close(btn.dataset.modalClose));
});

/* ---- TABS ---- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.tab-group');
    if (!group) return;
    group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    group.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
    btn.classList.add('active');
    const panel = group.querySelector(`[data-tab="${btn.dataset.tab}"]`);
    if (panel) panel.style.display = 'block';
  });
});

/* ---- HIVE FLEET THREAT TICKER ---- */
(function initTicker() {
  const tickers = document.querySelectorAll('.hive-fleet-ticker .ticker-text');
  if (!tickers.length) return;
  const messages = [
    'SHADOW IN THE WARP DETECTED — ASTROPATHIC CHOIR DISRUPTED',
    'HIVE FLEET LEVIATHAN SPLINTER ADVANCING FROM GALACTIC SOUTH',
    'DEFENCE CORDON ALPHA: HOLD AT ALL COSTS — TERRA DEMANDS IT',
    'BIOMASS EXTRACTION CONFIRMED ON AGRI-WORLD SECUNDUS',
    'RALLYING CALL — REINFORCEMENTS REQUESTED AT SECTOR COMMAND',
    'NO RETREAT. NO SURRENDER. FOR THE EMPEROR AND THE BASTIOR SUB-SECTOR.',
  ];
  let i = 0;
  tickers.forEach(ticker => {
    setInterval(() => {
      ticker.style.opacity = '0';
      setTimeout(() => {
        i = (i + 1) % messages.length;
        ticker.textContent = messages[i];
        ticker.style.opacity = '1';
      }, 400);
    }, 5000);
    ticker.style.transition = 'opacity 0.4s ease';
  });
})();

/* ---- HONOUR ROLL FILTER ---- */
window.filterTable = function(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);
  if (!input || !table) return;
  const filter = input.value.toLowerCase();
  table.querySelectorAll('tbody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(filter) ? '' : 'none';
  });
};

/* ---- XP AWARD ANIMATION ---- */
window.awardXP = function(unitId, amount) {
  const unit = window.RosterManager.update(unitId, {});
  if (!unit) return;
  unit.xp = (unit.xp || 0) + amount;
  unit.rank = window.RosterManager.rankFromXP(unit.xp);
  window.RosterManager.update(unitId, { xp: unit.xp, rank: unit.rank });

  // Flash notification
  const notif = document.createElement('div');
  notif.style.cssText = `
    position:fixed;top:80px;right:20px;z-index:9999;
    background:var(--dark3);border:1px solid var(--gold-dim);
    padding:0.8rem 1.2rem;font-family:var(--font-heading);font-size:0.85rem;
    color:var(--gold-light);letter-spacing:0.06em;
    animation:fadeInUp 0.4s ease, fadeOut 0.4s ease 2.5s forwards;
    box-shadow:var(--shadow-gold);
  `;
  notif.textContent = `+${amount} XP AWARDED`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
};

/* ---- UTILS ---- */
window.CrusadeUtils = {
  formatDate: (ts) => new Date(ts).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }),
  imperialDate: (ts) => {
    const d = new Date(ts);
    const yr = d.getFullYear();
    const day = String(Math.floor((d - new Date(yr,0,0)) / 86400000)).padStart(3,'0');
    return `${day}.${Math.floor(Math.random()*9)}.${yr-2000}M3`;
  },
  capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
};

console.log(
  '%cBASTIOR SUB-SECTOR CRUSADE',
  'font-family: serif; font-size: 1.2rem; color: #c8960c; font-weight: bold;'
);
console.log(
  '%cTyrannic War Supplement — Operational Since 999.M41',
  'font-family: monospace; font-size: 0.75rem; color: #8a7a5a;'
);
