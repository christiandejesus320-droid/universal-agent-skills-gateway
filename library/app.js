const state = { data: null, language: 'en', level: 'all', query: '', selected: null };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const text = (value) => typeof value === 'object' ? value[state.language] ?? value.en ?? value.es ?? '' : value ?? '';

async function loadCatalog() {
  const response = await fetch('/v1/design/catalog');
  state.data = await response.json();
  $('#componentCount').textContent = state.data.components.length;
  renderTokens();
  renderWorkflow();
  renderGrid();
}

function matches(component) {
  const query = state.query.trim().toLowerCase();
  const haystack = JSON.stringify(component).toLowerCase();
  return (state.level === 'all' || component.level === state.level) && (!query || haystack.includes(query));
}

function renderGrid() {
  const components = state.data.components.filter(matches);
  $('#catalogGrid').innerHTML = components.length ? components.map((component) => `
    <button class="component-card" data-component="${component.id}" aria-label="${text(component.name)}">
      <div class="card-top"><span class="level">${component.level}</span><span class="card-id">${component.id}</span></div>
      <h3>${text(component.name)}<span>${component.name[state.language === 'en' ? 'es' : 'en']}</span></h3>
      <p class="card-problem">${text(component.problem)}</p>
      <div class="card-footer">${(component.tags ?? []).map((tag) => `<span class="tag">#${tag}</span>`).join('')}</div>
    </button>`).join('') : '<div class="empty-state"><h3>No patterns found / No se encontraron patrones</h3><p>Try another intent or remove a filter. Prueba otra intención o elimina un filtro.</p></div>';
  $$('.component-card').forEach((card) => card.addEventListener('click', () => showInspector(card.dataset.component)));
}

function showInspector(id) {
  const component = state.data.components.find((item) => item.id === id);
  if (!component) return;
  state.selected = component;
  $('#inspector').innerHTML = `<div class="inspector-detail">
    <div class="detail-level">${component.level} / ${component.id}</div>
    <h2>${text(component.name)}<span>${component.name[state.language === 'en' ? 'es' : 'en']}</span></h2>
    <div class="detail-section"><h4>Problem / Problema</h4><p>${text(component.problem)}</p></div>
    <div class="detail-section"><h4>Purpose / Propósito</h4><p>${text(component.purpose)}</p></div>
    <div class="detail-section"><h4>States / Estados</h4><div class="detail-tags">${(component.states ?? []).map((item) => `<span class="tag">${item}</span>`).join('')}</div></div>
    <div class="detail-section"><h4>Inputs / Entradas</h4><p>${(component.inputs ?? []).join(' · ')}</p></div>
    <div class="detail-section"><h4>Accessibility / Accesibilidad</h4><p>${text(component.accessibility ?? {en:'Keyboard-first, visible focus, semantic status.',es:'Teclado primero, foco visible y estado semántico.'})}</p></div>
    <div class="detail-section"><h4>Tags / Etiquetas</h4><div class="detail-tags">${(component.tags ?? []).map((tag) => `<span class="tag">#${tag}</span>`).join('')}</div></div>
    <button class="outline-button" id="copyPrompt">Copy skill brief / Copiar brief</button>
  </div>`;
  $('#copyPrompt').addEventListener('click', () => navigator.clipboard?.writeText(`${text(component.name)}\nProblem: ${text(component.problem)}\nPurpose: ${text(component.purpose)}\nTags: ${(component.tags ?? []).join(', ')}`));
}

function renderWorkflow() {
  const phases = ['Discover / Descubrir','Diagnose / Diagnosticar','Select / Seleccionar','Compose / Componer','Blueprint / Definir blueprint','Preview / Previsualizar','Validate / Validar','Implement / Implementar','Review / Revisar','Ship / Publicar','Reflect / Aprender'];
  const workflow = state.data.workflows?.[0];
  $('#workflowTrack').innerHTML = (workflow?.phases ?? phases).map((phase, index) => `<article class="workflow-step"><span>${String(index + 1).padStart(2, '0')}</span><h3>${phase.includes(' / ') ? phase : phase}</h3><p>${index === 0 ? 'Clarify the outcome / Aclara el resultado' : index === 1 ? 'Name the friction / Nombra la fricción' : index === 2 ? 'Choose the smallest skill / Elige la skill mínima' : index === 9 ? 'Require human authorization / Requiere autorización humana' : 'Produce evidence / Produce evidencia'}</p></article>`).join('');
}

function renderTokens() {
  const tokens = state.data.tokens;
  const colors = Object.entries(tokens.colors.oled).map(([key, value]) => `<div class="swatch"><i style="background:${value}"></i><span>${key}</span><strong>${value}</strong></div>`).join('');
  const spacing = Object.entries(tokens.spacing).map(([key, value]) => `<div class="token-line"><span>${key}</span><span>${value}</span></div>`).join('');
  const motion = Object.entries(tokens.motion).map(([key, value]) => `<div class="token-line"><span>${key}</span><span>${value}</span></div>`).join('');
  $('#tokenBoard').innerHTML = `<article class="token-group"><h3>OLED colors / Colores OLED</h3>${colors}</article><article class="token-group"><h3>Spacing / Espaciado</h3>${spacing}</article><article class="token-group"><h3>Motion / Motion</h3>${motion}</article>`;
}

function selectView(view) {
  ['catalog','tokens','playground','mcp','workflow'].forEach((name) => $(`#${name}View`)?.classList.toggle('hidden', name !== view));
  $$('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === view));
  if (view === 'catalog') $('#catalogView').classList.remove('hidden'); else $('#catalogView').classList.add('hidden');
  if (view === 'catalog') $('.control-bar').classList.remove('hidden'); else $('.control-bar').classList.add('hidden');
}

$('#searchInput').addEventListener('input', (event) => { state.query = event.target.value; renderGrid(); });
$$('.filter-chip').forEach((chip) => chip.addEventListener('click', () => { state.level = chip.dataset.level; $$('.filter-chip').forEach((item) => item.classList.toggle('active', item === chip)); renderGrid(); }));
$$('.nav-item').forEach((item) => item.addEventListener('click', () => selectView(item.dataset.view)));
$('#langToggle').addEventListener('click', () => { state.language = state.language === 'en' ? 'es' : 'en'; renderGrid(); if (state.selected) showInspector(state.selected.id); });
$('#copyTokens').addEventListener('click', () => navigator.clipboard?.writeText(JSON.stringify(state.data.tokens, null, 2)));

const dialog = $('#commandDialog');
$('#commandButton').addEventListener('click', () => { dialog.showModal(); $('#commandInput').focus(); });
$('#commandInput').addEventListener('keydown', (event) => { if (event.key === 'Escape') dialog.close(); });
$$('[data-command]').forEach((item) => item.addEventListener('click', () => { selectView(item.dataset.command); dialog.close(); }));
document.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); dialog.showModal(); $('#commandInput').focus(); } });

$$('.state-button').forEach((button) => button.addEventListener('click', () => {
  const stateName = button.dataset.state; $$('.state-button').forEach((item) => item.classList.toggle('active', item === button));
  const demo = $('#demoButton'); demo.className = `demo-primary ${stateName}`;
  const labels = { idle: 'Save changes / Guardar cambios', loading: 'Saving / Guardando…', success: 'Saved / Guardado', error: 'Retry / Reintentar' };
  demo.childNodes[0].textContent = labels[stateName] + ' ';
  $('#demoCaption').textContent = `${stateName} state / Estado ${stateName}`;
}));

// Optional real-time read-only sync. The library stays usable without this adapter.
try { const events = new EventSource('/events'); events.onmessage = () => { $('#syncState').textContent = 'SYNCED'; setTimeout(() => $('#syncState').textContent = 'LIVE', 1400); }; } catch {}
loadCatalog().catch(() => { $('#catalogGrid').innerHTML = '<div class="empty-state"><h3>Catalog unavailable / Catálogo no disponible</h3><p>Start the optional local adapter or open the files directly.</p></div>'; });
