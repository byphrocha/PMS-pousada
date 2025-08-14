// ===== Utilidades =====
const $  = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const BASE  = window.location.origin;
const TOKEN = window.PMS_TOKEN;   // token já validado no app-core.js

const modal   = $('#modal-res');
const form    = $('#res-form');
const titleEl = $('#modal-res-title');
let editingId = null;

// ----- Modal helpers -----
function openModal(title, data = {}) {
  titleEl.textContent = title;
  editingId = data.id || null;

  form.id.value         = data.id          || '';
  form.guestName.value  = data.guestName   || '';
  form.guestEmail.value = data.guestEmail  || '';
  form.guestPhone.value = data.guestPhone  || '';
  form.RoomId.value     = data.RoomId      || '';
  form.checkIn.value    = data.checkIn     || '';
  form.checkOut.value   = data.checkOut    || '';

  modal.classList.remove('hidden');
}
function closeModal() { modal.classList.add('hidden'); }

// ----- Carrega quartos no select -----
async function loadRoomsSelect() {
  const res  = await fetch(`${BASE}/rooms`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  const data = await res.json();
  $('#room-select').innerHTML = data.map(r =>
    `<option value="${r.id}">${r.name}</option>`
  ).join('');
}

// ----- Renderização -----
function renderRow(r) {
  const ops = [];
  if (r.status === 'booked') {
    ops.push(`<button class="action-btn" data-checkin="${r.id}">✅ Check‑in</button>`);
  }
  if (r.status === 'checked_in') {
    ops.push(`<button class="action-btn" data-checkout="${r.id}">⬅️ Check‑out</button>`);
  }
  return `
    <tr>
      <td>${r.id}</td>
      <td>${r.guestName}</td>
      <td>${r.Room?.name || '-'}</td>
      <td>${r.checkIn}</td>
      <td>${r.checkOut}</td>
      <td>${r.status.replace('_', ' ')}</td>
      <td>
        <button class="action-btn" data-edit="${r.id}">✏️</button>
        <button class="action-btn" data-del="${r.id}">🗑️</button>
      </td>
      <td>${ops.join(' ')}</td>
    </tr>
  `;
}

function renderTable(data) {
  $('#reservations-table tbody').innerHTML = data.map(renderRow).join('');
}

// ----- Carrega reservas -----
async function loadReservations() {
  const res  = await fetch(`${BASE}/reservations`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  const data = await res.json();
  renderTable(data);
}

// ===== Eventos =====
$('#btn-add-res').addEventListener('click', async () => {
  await loadRoomsSelect();
  openModal('Nova Reserva');
});
$('#close-res').addEventListener('click', closeModal);
$('#cancel-res').addEventListener('click', closeModal);

// ----- Salvar (create/update) -----
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  if (!editingId) delete data.id; // criação

  const url    = editingId ? `${BASE}/reservations/${editingId}` : `${BASE}/reservations`;
  const method = editingId ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
    body: JSON.stringify(data)
  });

  closeModal();
  loadReservations();
});

// ----- Delegação de cliques (editar, excluir, check‑in/out) -----
$('#reservations-table tbody').addEventListener('click', async (e) => {
  const { edit, del, checkin, checkout } = e.target.dataset;

  if (edit) {
    const res = await fetch(`${BASE}/reservations/${edit}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const reserva = await res.json();
    await loadRoomsSelect();
    openModal('Editar Reserva', reserva);
  }

  if (del) {
    if (confirm('Excluir reserva?')) {
      await fetch(`${BASE}/reservations/${del}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      loadReservations();
    }
  }

  if (checkin) {
    if (confirm('Confirmar check‑in?')) {
      await fetch(`${BASE}/reservations/${checkin}/checkin`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      loadReservations();
    }
  }

  if (checkout) {
    if (confirm('Confirmar check‑out?')) {
      await fetch(`${BASE}/reservations/${checkout}/checkout`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      loadReservations();
    }
  }
});

// ----- Inicialização -----
loadReservations();