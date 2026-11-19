// Leonida Trophy Guide: offline tracker for the 55 GTA VI PS5 trophies.
// Progress and settings live in localStorage only. No network request is
// made at runtime except the local fetch of data/trophies.json.
const EARNED_KEY = 'gta6-trophy-guide-earned-v1';
const SETTINGS_KEY = 'gta6-trophy-guide-settings-v1';
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

let earned = new Set();
try { earned = new Set(JSON.parse(localStorage.getItem(EARNED_KEY) ?? '[]')); } catch { earned = new Set(); }
let settings = { spoiler: true };
try { settings = { spoiler: true, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') }; } catch { settings = { spoiler: true }; }

const $ = (id) => document.getElementById(id);
const listEl = $('list');
const detailEl = $('detail');
const statusEl = $('status');
const KIND_LABELS = { story: 'Story', side: 'Side quest', collectibles: 'Collectibles', activities: 'Activities', robbery: 'Robbery', exploration: 'Exploration', money: 'Money', combat: 'Combat', misc: 'Misc' };

function saveEarned() { localStorage.setItem(EARNED_KEY, JSON.stringify([...earned].sort())); }
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }
function isHidden(t) { return settings.spoiler && t.hidden && !earned.has(t.name); }
// Every label in the app is set through textContent, never innerHTML, so no
// HTML escaping helper is needed here. The data file app/data/trophies.json
// must give each trophy an id, name, description, grade, hidden flag, kinds,
// missable flag, stage, guide and source; the platinum is found by grade,
// not by name, and the stage counts are derived from the stage field.

function gradeBadge(t) {
  const s = document.createElement('span');
  s.className = 'grade ' + t.grade;
  s.textContent = t.grade;
  return s;
}

function tag(text, cls) {
  const s = document.createElement('span');
  s.className = 'tag' + (cls ? ' ' + cls : '');
  s.textContent = text;
  return s;
}

function makeCard(t) {
  const card = document.createElement('article');
  card.className = 'card' + (earned.has(t.name) ? ' earned' : '');
  const head = document.createElement('div');
  head.className = 'card-head';
  const h = document.createElement('h3');
  if (isHidden(t)) { h.textContent = 'Hidden trophy'; h.className = 'hidden-name'; }
  else h.textContent = t.name;
  head.append(h, gradeBadge(t));
  card.append(head);
  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = isHidden(t) ? 'Hidden until earned. Turn off spoiler hiding to reveal it.' : t.description;
  card.append(desc);
  const guide = document.createElement('p');
  guide.className = 'guide';
  guide.textContent = isHidden(t) ? 'Earn this trophy to reveal its guide.' : t.guide;
  card.append(guide);
  const tags = document.createElement('div');
  tags.className = 'tags';
  if (t.hidden) tags.append(tag('Hidden', 'hidden-tag'));
  if (t.missable) tags.append(tag('Missable', 'missable'));
  for (const k of t.kinds) tags.append(tag(KIND_LABELS[k] ?? k));
  tags.append(tag('Stage ' + t.stage));
  card.append(tags);
  if (!isHidden(t)) {
    const src = document.createElement('p');
    src.className = 'source';
    src.textContent = 'Source: ';
    const a = document.createElement('a');
    a.href = t.source.url; a.textContent = t.source.name; a.target = '_blank'; a.rel = 'noopener';
    src.append(a);
    card.append(src);
  }
  const foot = document.createElement('div');
  foot.className = 'card-foot';
  const check = document.createElement('label');
  check.className = 'earned-check';
  const box = document.createElement('input');
  box.type = 'checkbox'; box.checked = earned.has(t.name);
  box.setAttribute('aria-label', 'Mark ' + t.name + ' as earned');
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.name); else earned.delete(t.name);
    saveEarned(); render();
  });
  check.append(box, document.createTextNode(box.checked ? 'Earned' : 'Mark earned'));
  foot.append(check);
  const link = document.createElement('a');
  link.className = 'detail-link'; link.href = '#trophy-' + t.id; link.textContent = 'Guide details';
  foot.append(link);
  card.append(foot);
  return card;
}

function filtered() {
  const q = $('search').value.trim().toLowerCase();
  const grade = $('grade').value;
  const kind = $('kind').value;
  const show = $('earnedFilter').value;
  return trophies.filter((t) => {
    if (grade !== 'all' && t.grade !== grade) return false;
    if (kind === 'missable' && !t.missable) return false;
    if (kind === 'online') return false;
    if (kind !== 'all' && kind !== 'missable' && !t.kinds.includes(kind)) return false;
    if (show === 'earned' && !earned.has(t.name)) return false;
    if (show === 'remaining' && earned.has(t.name)) return false;
    if (q && !((t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q))) return false;
    return true;
  });
}

function renderProgress() {
  const n = earned.size;
  const total = trophies.length;
  $('progressText').textContent = n + ' of ' + total + ' earned';
  $('progressPct').textContent = Math.round((n / total) * 100) + '%';
  $('progressBar').style.width = ((n / total) * 100) + '%';
  const plat = trophies.find((t) => t.grade === 'platinum');
  $('platinumLine').textContent = earned.has(plat.name)
    ? 'Platinum earned: Vice Got a Price! Congratulations, Leonida Legend.'
    : 'Platinum: Vice Got a Price! unlocks when the other 54 are earned (' + (total - 1 - (n - (earned.has(plat.name) ? 1 : 0))) + ' to go).';
  for (let s = 1; s <= 3; s++) {
    const inStage = trophies.filter((t) => t.stage === s);
    const done = inStage.filter((t) => earned.has(t.name)).length;
    $('stageCount' + s).textContent = done + ' of ' + inStage.length + ' trophies in this stage earned.';
  }
}

function renderList() {
  const rows = filtered();
  listEl.replaceChildren();
  if ($('kind').value === 'online') {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'There are no online trophies in GTA VI. All 55 trophies are single-player and offline.';
    listEl.append(p);
  } else if (rows.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'No trophies match these filters. Try clearing the search or changing the filters.';
    listEl.append(p);
  } else {
    for (const t of rows) listEl.append(makeCard(t));
  }
  $('resultCount').textContent = 'Showing ' + rows.length + ' of 55 trophies. ' + earned.size + ' earned in total.';
}

function renderDetail() {
  const m = location.hash.match(/^#trophy-(\d+)$/);
  if (!m) { detailEl.hidden = true; detailEl.replaceChildren(); return; }
  const t = trophies.find((x) => x.id === Number(m[1]));
  if (!t) { detailEl.hidden = true; return; }
  detailEl.hidden = false;
  detailEl.replaceChildren();
  const head = document.createElement('div');
  head.className = 'card-head';
  const h = document.createElement('h2');
  h.textContent = isHidden(t) ? 'Hidden trophy' : t.name;
  head.append(h, gradeBadge(t));
  detailEl.append(head);
  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = isHidden(t) ? 'Hidden until earned. Turn off spoiler hiding to reveal it.' : 'Official description: ' + t.description;
  detailEl.append(desc);
  const guide = document.createElement('p');
  guide.className = 'guide';
  guide.textContent = isHidden(t) ? 'Earn this trophy to reveal its guide.' : t.guide;
  detailEl.append(guide);
  const tags = document.createElement('div');
  tags.className = 'tags';
  if (t.hidden) tags.append(tag('Hidden', 'hidden-tag'));
  if (t.missable) tags.append(tag('Missable: do it before it is gone', 'missable'));
  for (const k of t.kinds) tags.append(tag(KIND_LABELS[k] ?? k));
  tags.append(tag('Roadmap stage ' + t.stage));
  detailEl.append(tags);
  if (!isHidden(t)) {
    const src = document.createElement('p');
    src.className = 'source';
    src.textContent = 'Source: ';
    const a = document.createElement('a');
    a.href = t.source.url; a.textContent = t.source.name; a.target = '_blank'; a.rel = 'noopener';
    src.append(a);
    detailEl.append(src);
  }
  const check = document.createElement('label');
  check.className = 'earned-check';
  const box = document.createElement('input');
  box.type = 'checkbox'; box.checked = earned.has(t.name);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.name); else earned.delete(t.name);
    saveEarned(); render();
  });
  check.append(box, document.createTextNode(box.checked ? 'Earned' : 'Mark earned'));
  detailEl.append(check);
  const nav = document.createElement('div');
  nav.className = 'detail-nav';
  const back = document.createElement('a'); back.href = '#'; back.textContent = 'Back to all trophies';
  nav.append(back);
  const prev = trophies.find((x) => x.id === t.id - 1);
  const next = trophies.find((x) => x.id === t.id + 1);
  if (prev) { const a = document.createElement('a'); a.href = '#trophy-' + prev.id; a.textContent = 'Previous: ' + (isHidden(prev) ? 'Hidden trophy' : prev.name); nav.append(a); }
  if (next) { const a = document.createElement('a'); a.href = '#trophy-' + next.id; a.textContent = 'Next: ' + (isHidden(next) ? 'Hidden trophy' : next.name); nav.append(a); }
  detailEl.append(nav);
  detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function render() { renderProgress(); renderList(); renderDetail(); }

$('search').addEventListener('input', renderList);
$('grade').addEventListener('change', renderList);
$('kind').addEventListener('change', renderList);
$('earnedFilter').addEventListener('change', renderList);
$('spoiler').checked = settings.spoiler;
$('spoiler').addEventListener('change', (e) => { settings.spoiler = e.target.checked; saveSettings(); render(); });
window.addEventListener('hashchange', renderDetail);

$('exportBtn').addEventListener('click', () => {
  const data = { game: 'Grand Theft Auto VI', exported: new Date().toISOString(), earned: [...earned].sort() };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
  statusEl.textContent = 'Progress exported (' + earned.size + ' earned).';
});
$('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const names = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(names)) throw new Error('bad file');
    const known = new Set(trophies.map((t) => t.name));
    const good = names.filter((n) => known.has(n));
    earned = new Set(good);
    saveEarned(); render();
    statusEl.textContent = 'Imported ' + good.length + ' earned trophies' + (good.length < names.length ? ' (' + (names.length - good.length) + ' unknown names skipped).' : '.');
  } catch {
    statusEl.textContent = 'Import failed: that file is not a trophy progress export.';
  }
  e.target.value = '';
});
$('resetBtn').addEventListener('click', () => {
  if (!window.confirm('Clear all earned trophies?')) return;
  earned = new Set(); saveEarned(); render();
  statusEl.textContent = 'Progress reset.';
});

render();
