// ===== Utilidades =====
const $  = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const TOKEN = window.PMS_TOKEN;
// Base absoluta (ex.: http://localhost:3000)
const BASE = window.location.origin;

const modal   = $('#modal-cli');
const form    = $('#cli-form');
const titleEl = $('#modal-cli-title');
const searchI = $('#search');
let editingId = null;
let allData   = []; // cache para busca

// ===== Modal helpers =====
function openModal(title, data = {}) {
  titleEl.textContent = title;
  editingId = data.id || null;

  form.id.value       = data.id       || '';
  form.name.value     = data.name     || '';
  form.email.value    = data.email    || '';
  form.phone.value    = data.phone    || '';
  form.document.value = data.document || '';

  modal.classList.remove('hidden');
}
function closeModal() { modal.classList.add('hidden'); }

// ===== Carregar clientes =====
async function loadCustomers() {
  const res  = await fetch(`${BASE}/customers`);
  allData    = await res.json();
  renderTable(allData);
}

// ===== Renderizar tabela =====
function renderTable(data) {
  const tbody = $('#customers-table tbody');
  tbody.innerHTML = data.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.phone || '-'}</td>
      <td>
        <button class="action-btn" data-edit="${c.id}">✏️</button>
        <button class="action-btn" data-del="${c.id}">🗑️</button>
      </td>
    </tr>
  `).join('');
}

// ===== Eventos de UI =====
$('#btn-add-cli').addEventListener('click', () => openModal('Novo Cliente'));
$('#close-cli').addEventListener('click', closeModal);
$('#cancel-cli').addEventListener('click', closeModal);

// ===== Salvar (create/update) =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  // Remove id se for criação
  if (!editingId) delete data.id;

  const url    = editingId ? `${BASE}/customers/${editingId}` : `${BASE}/customers`;
  const method = editingId ? 'PUT' : 'POST';
  console.log('CLIENTE →', method, url, data);

  const resp = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`
},
    body: JSON.stringify(data)
  });

  if (!resp.ok) {
    const txt = await resp.text();
    console.error('Erro:', resp.status, txt);
    alert('Falha ao salvar cliente');
    return;
  }

  closeModal();
  loadCustomers();
});

// ===== Delegação de cliques na tabela =====
$('#customers-table tbody').addEventListener('click', async (e) => {
  const { edit, del } = e.target.dataset;

  if (edit) {
    const res = await fetch(`${BASE}/customers/${edit}`);
    if (!res.ok) return alert('Cliente não encontrado');
    const cli = await res.json();
    openModal('Editar Cliente', cli);
  }

  if (del) {
    if (confirm('Excluir cliente?')) {
      const delUrl = `${BASE}/customers/${del}`;
      console.log('DELETE →', delUrl);
      await fetch(delUrl, { method: 'DELETE' });
      loadCustomers();
    }
  }
});

// ===== Busca simples =====
searchI.addEventListener('input', () => {
  const q = searchI.value.toLowerCase();
  const filtered = allData.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.email && c.email.toLowerCase().includes(q))
  );
  renderTable(filtered);
});

// ===== Inicialização =====
loadCustomers();