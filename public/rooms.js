//const TOKEN = window.PMS_TOKEN;
// ===== Utilidades =====
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Base absoluta (ex.: http://localhost:3000)
const BASE  = window.location.origin;


const modal      = $('#modal');
const roomForm   = $('#room-form');
const modalTitle = $('#modal-title');
let   editingId  = null;

// ===== Sidebar (mobile) =====
$('#toggle-sidebar').addEventListener('click', () => {
  $('#sidebar').classList.toggle('open');
});

// ===== Modal helpers =====
function openModal(title, room = {}) {
  modalTitle.textContent = title;
  editingId = room.id || null;

  roomForm.id.value        = room.id        || '';
  roomForm.name.value      = room.name      || '';
  roomForm.type.value      = room.type      || '';
  roomForm.capacity.value  = room.capacity  || '';
  roomForm.basePrice.value = room.basePrice || '';
  roomForm.status.value    = room.status    || 'available';

  modal.classList.remove('hidden');
}
function closeModal() { modal.classList.add('hidden'); }

// ===== Renderização de linha =====
function renderRow(r) {
  return `
    <tr>
      <td>${r.id}</td>
      <td>${r.name}</td>
      <td>${r.type}</td>
      <td>${r.status}</td>
      <td>
        <button class="action-btn" data-edit="${r.id}">✏️</button>
        <button class="action-btn" data-del="${r.id}">🗑️</button>
        <button class="action-btn" data-dirty="${r.id}">🧹</button>
      </td>
    </tr>
  `;
}

// ===== Carrega e desenha tabela =====
async function loadRooms() {
  const res  = await fetch(`${BASE}/rooms`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  const data = await res.json();
  $('#rooms-table tbody').innerHTML = data.map(renderRow).join('');
}

// ===== Eventos =====
$('#btn-add').addEventListener('click', () => openModal('Novo Quarto'));
$('#close-modal').addEventListener('click', closeModal);
$('#cancel').addEventListener('click', closeModal);

// ===== Salvar (create/update) =====
roomForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(roomForm));

  data.capacity  = data.capacity  ? parseInt(data.capacity, 10)  : null;
  data.basePrice = data.basePrice ? parseFloat(data.basePrice)  : null;
  if (!data.status)         data.status         = 'available';
  if (!data.cleaningStatus) data.cleaningStatus = 'clean';
  if (!editingId) delete data.id;

  const url    = editingId ? `${BASE}/rooms/${editingId}` : `${BASE}/rooms`;
  const method = editingId ? 'PUT' : 'POST';
  console.log('SALVAR →', method, url);

  await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
    body: JSON.stringify(data)
  });

  closeModal();
  loadRooms();
});

// ===== Delegação de cliques na tabela =====
$('#rooms-table tbody').addEventListener('click', async (e) => {
  const { edit, del, dirty } = e.target.dataset;

  if (edit) {
    const res = await fetch(`${BASE}/rooms/${edit}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    if (!res.ok) return alert('Quarto não encontrado');
    const room = await res.json();
    openModal('Editar Quarto', room);
  }

  if (del) {
    if (confirm('Deseja excluir este quarto?')) {
      const deleteUrl = `${BASE}/rooms/${del}`;
      console.log('DELETE →', deleteUrl);
      await fetch(deleteUrl, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      loadRooms();
    }
  }

  if (dirty) {
    const dirtyUrl = `${BASE}/housekeeping/${dirty}/dirty`;
    console.log('DIRTY →', dirtyUrl);
    await fetch(dirtyUrl, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    alert('Quarto marcado como sujo!');
  }
});

// ===== Inicialização =====
loadRooms();