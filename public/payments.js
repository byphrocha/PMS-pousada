/*  payments.js  –  módulo de Pagamentos & Recibos  */

const BASE  = window.location.origin;
//const TOKEN = window.PMS_TOKEN;   // token salvo pelo app-core.js

// ---------- Seletores ----------
const modal   = document.getElementById('modal-pay');
const form    = document.getElementById('pay-form');
const resSel  = document.getElementById('res-select');

// ---------- Helpers ----------
function openModal()  { modal.classList.remove('hidden'); }
function closeModal() { modal.classList.add('hidden'); }

// Carrega reservas elegíveis
async function loadReservationsForSelect() {
  const res  = await fetch(`${BASE}/reservations`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  const data = await res.json();

  resSel.innerHTML = data
    .filter(r => ['booked', 'checked_in'].includes(r.status))
    .map(r => `<option value="${r.id}">#${r.id} – ${r.Customer?.name || 'Sem cliente'}</option>`)
    .join('');
}

// Carrega pagamentos
async function loadPayments() {
  const res = await fetch(`${BASE}/payments`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  if (!res.ok) {
    alert('Erro ao buscar pagamentos');
    return;
  }
  const data = await res.json();

  const tbody = document.querySelector('#payments-table tbody');
  tbody.innerHTML = data.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>#${p.ReservationId}</td>
      <td>${p.Reservation?.Customer?.name || '-'}</td>
      <td>${p.Reservation?.Room?.name || '-'}</td>
      <td>${p.amount.toFixed(2)}</td>
      <td>${p.method}</td>
      <td>${new Date(p.paidAt).toLocaleDateString('pt-BR')}</td>
      <td>
        <button class="action-btn" data-rec="${p.id}">📄 Recibo</button>
      </td>
    </tr>
  `).join('');
}

// ---------- Eventos ----------
document.getElementById('btn-add-pay').addEventListener('click', async () => {
  await loadReservationsForSelect();
  form.reset();
  openModal();
});
document.getElementById('close-pay').addEventListener('click', closeModal);
document.getElementById('cancel-pay').addEventListener('click', closeModal);

// Salvar pagamento
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  data.amount = parseFloat(data.amount);

  const resp = await fetch(`${BASE}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
    body: JSON.stringify(data)
  });

  if (!resp.ok) {
    alert('Erro ao salvar pagamento');
    return;
  }

  closeModal();
  loadPayments();
});

// Abrir recibo PDF
document.querySelector('#payments-table tbody')
  .addEventListener('click', async (e) => {
    const id = e.target.dataset.rec;
    if (!id) return;

    const resp = await fetch(`${BASE}/payments/${id}/receipt`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    if (!resp.ok) return alert('Falha ao gerar recibo');

    const blob = await resp.blob();
    const url  = URL.createObjectURL(blob);
    window.open(url, '_blank');
  });

// ---------- Inicialização ----------
loadPayments();