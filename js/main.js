/* =============================================
   BASTIOR SUB-SECTOR v2 — main.js
   ============================================= */
'use strict';

/* ---- NAV TOGGLE ---- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const s = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      s[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      s[1].style.opacity = '0';
      s[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      s[0].style.transform = s[1].style.opacity = s[2].style.transform = '';
    }
  });
}

/* ---- ACTIVE LINK ---- */
(function(){
  const p = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === p) a.classList.add('active');
  });
})();

/* ---- SCROLL REVEAL ---- */
(function(){
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ---- BAR ANIMATION ---- */
(function(){
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target, w = el.dataset.w || el.style.width || '0%';
        el.dataset.w = w; el.style.width = '0%';
        requestAnimationFrame(() => setTimeout(() => el.style.width = w, 80));
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => { b.dataset.w = b.style.width; obs.observe(b); });
})();

/* ---- TICKER ---- */
(function(){
  const els = document.querySelectorAll('.ticker .ticker-text');
  if (!els.length) return;
  const msgs = [
    'SHADOW IN THE WARP DETECTED — ASTROPATHIC CHOIR DISRUPTED',
    'HIVE FLEET LEVIATHAN SPLINTER ADVANCING FROM GALACTIC SOUTH',
    'DEFENCE CORDON ALPHA — HOLD AT ALL COSTS — TERRA DEMANDS IT',
    'BIOMASS EXTRACTION CONFIRMED ON AGRI-WORLD SECUNDUS',
    'RALLYING CALL — REINFORCEMENTS REQUESTED AT SECTOR COMMAND',
    'NO RETREAT. NO SURRENDER. FOR THE EMPEROR AND THE BASTIOR SUB-SECTOR.',
  ];
  let i = 0;
  els.forEach(el => {
    setInterval(() => {
      el.style.opacity = '0';
      setTimeout(() => { i = (i+1)%msgs.length; el.textContent = msgs[i]; el.style.opacity = '1'; }, 350);
    }, 5000);
    el.style.transition = 'opacity 0.35s ease';
  });
})();

/* ---- MODAL ---- */
window.Modal = {
  open(id)  { const m = document.getElementById(id); if(!m)return; m.style.display='flex'; requestAnimationFrame(()=>m.classList.add('open')); document.body.style.overflow='hidden'; },
  close(id) { const m = document.getElementById(id); if(!m)return; m.classList.remove('open'); setTimeout(()=>{ m.style.display='none'; }, 300); document.body.style.overflow=''; }
};
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => Modal.close(b.dataset.close)));

/* ---- TABS ---- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const grp = btn.closest('[data-tabs]');
    if (!grp) return;
    grp.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    grp.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const pane = grp.querySelector(`[data-pane="${btn.dataset.tab}"]`);
    if (pane) pane.classList.add('active');
  });
});

/* ---- TABLE FILTER ---- */
window.filterTable = function(inputId, tableId) {
  const q = document.getElementById(inputId)?.value?.toLowerCase() || '';
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
};

/* ---- SECTOR MAP ---- */
window.SectorMap = {
  init() {
    document.querySelectorAll('.map-sys').forEach(n => {
      n.addEventListener('mouseenter', e => this.tip(e, n));
      n.addEventListener('mouseleave', () => this.hideTip());
      n.addEventListener('click', () => this.select(n));
    });
    document.addEventListener('mousemove', e => {
      const t = document.getElementById('map-tooltip');
      if (t && t.style.display === 'block') {
        const rect = t.closest('.map-container')?.getBoundingClientRect();
        if (rect) { t.style.left = (e.clientX - rect.left + 14)+'px'; t.style.top = (e.clientY - rect.top + 14)+'px'; }
      }
    });
  },
  tip(e, n) {
    const t = document.getElementById('map-tooltip'); if (!t) return;
    t.innerHTML = `<div style="font-family:var(--font-mono);font-size:0.55rem;color:var(--text-dim);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.25rem">${n.dataset.type||'System'}</div><div style="font-family:var(--font-heading);font-weight:700;color:var(--brass-bright);margin-bottom:0.2rem">${n.dataset.name||'???'}</div><div style="font-size:0.78rem;color:var(--text)">${n.dataset.status||''}</div>`;
    t.style.display = 'block';
  },
  hideTip() { const t = document.getElementById('map-tooltip'); if (t) t.style.display = 'none'; },
  select(n) {
    document.querySelectorAll('.map-sys').forEach(x => x.classList.remove('selected'));
    n.classList.add('selected');
    const p = document.getElementById('sys-info'); if (!p) return;
    p.style.display = 'block';
    p.querySelector('.si-name').textContent   = n.dataset.name || '???';
    p.querySelector('.si-type').textContent   = n.dataset.type || '';
    p.querySelector('.si-status').textContent = n.dataset.status || '';
    p.querySelector('.si-ctrl').textContent   = n.dataset.control || '';
  }
};

/* ---- ROSTER ---- */
window.Roster = {
  KEY: 'bastior_roster',
  all()    { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(d)  { try { localStorage.setItem(this.KEY, JSON.stringify(d)); } catch {} },
  add(u)   { const d=this.all(); u.id=Date.now(); u.xp=0; u.rank='Battle-Ready'; d.push(u); this.save(d); return u; },
  upd(id,c){ const d=this.all(), i=d.findIndex(x=>x.id===id); if(i!==-1){Object.assign(d[i],c);this.save(d);return d[i];} return null; },
  del(id)  { this.save(this.all().filter(x=>x.id!==id)); },
  rank(xp) { if(xp>=36)return'Legendary'; if(xp>=26)return'Heroic'; if(xp>=16)return'Blooded'; if(xp>=6)return'Battle-Hardened'; return'Battle-Ready'; }
};

/* ---- BATTLE LOG ---- */
window.BattleLog = {
  KEY: 'bastior_battles',
  all()   { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  add(e)  { const d=this.all(); e.id=Date.now(); d.unshift(e); if(d.length>60)d.pop(); try{localStorage.setItem(this.KEY,JSON.stringify(d));}catch{} },
  del(id) { try{localStorage.setItem(this.KEY,JSON.stringify(this.all().filter(x=>x.id!==id)));}catch{} }
};

/* ---- TRACKER ---- */
window.Tracker = {
  KEY: 'bastior_tracker',
  def()   { return {cp:0,supMax:1000,ig:6,rp:5,rpHist:[],hist:[]}; },
  load()  { try{return JSON.parse(localStorage.getItem(this.KEY))||this.def();}catch{return this.def();} },
  save(d) { try{localStorage.setItem(this.KEY,JSON.stringify(d));}catch{} },
  log(d,a,r){ d.hist.unshift({a,r,t:Date.now()}); if(d.hist.length>80)d.hist.pop(); },
  cp(n,r) { const d=this.load(); d.cp=Math.max(0,d.cp+n); this.log(d,(n>=0?'+':'')+n+' CP',r); this.save(d); this.render(); },
  render() {
    const d=this.load();
    document.querySelectorAll('.cp-live').forEach(el=>el.textContent=d.cp);
    document.querySelectorAll('.sup-used-live').forEach(el=>el.textContent=d.supUsed);
    document.querySelectorAll('.sup-max-live').forEach(el=>el.textContent=d.supMax);
    document.querySelectorAll('.ig-live').forEach(el=>el.textContent=d.ig);
    document.querySelectorAll('.w-live').forEach(el=>el.textContent=d.w);
    const sBar=document.getElementById('sup-bar-fill');
    if(sBar){ const pct=Math.min(100,Math.round(d.supUsed/d.supMax*100)); sBar.style.width=pct+'%'; sBar.style.background=d.supUsed>d.supMax?'linear-gradient(90deg,#3a0800,var(--rust-bright))':'linear-gradient(90deg,#3a2c00,var(--brass))'; }
    const wBar=document.getElementById('w-bar-fill');
    if(wBar){ wBar.style.width=Math.min(100,Math.round(d.w/d.wMax*100))+'%'; }
    const hist=document.getElementById('cp-hist');
    if(hist){ if(!d.hist.length){hist.innerHTML='<li style="font-style:italic;color:var(--text-dim);font-size:0.82rem;">No transactions yet.</li>';return;} hist.innerHTML=d.hist.slice(0,35).map(h=>`<li style="display:flex;justify-content:space-between;gap:0.5rem;padding:0.38rem 0;border-bottom:1px solid rgba(184,134,11,0.08);font-size:0.78rem;"><span style="font-family:var(--font-mono);font-size:0.68rem;color:var(--brass);flex-shrink:0;">${h.a}</span><span style="color:var(--text-dim);font-style:italic;flex:1">${h.r||''}</span><span style="font-family:var(--font-mono);font-size:0.58rem;color:var(--text-dim);flex-shrink:0;">${new Date(h.t).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</span></li>`).join(''); }
  }
};
document.addEventListener('DOMContentLoaded', () => window.Tracker.render());

console.log('%cBASTIOR SUB-SECTOR CRUSADE','font-family:serif;font-size:1.1rem;color:#e8b020;font-weight:bold;');
