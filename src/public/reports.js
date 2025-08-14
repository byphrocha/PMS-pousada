/*  reports.js  –  Relatórios de Ocupação e Faturamento  */

const BASE  = window.location.origin;
//const TOKEN = window.PMS_TOKEN;

// ----- OCUPAÇÃO -----
document.getElementById('btn-occu').addEventListener('click', async () => {
  const from = document.getElementById('from').value;
  const to   = document.getElementById('to').value;
  if (!from || !to) return alert('Selecione o período');

  const res = await fetch(`${BASE}/reports/occupancy?from=${from}&to=${to}`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  if (!res.ok) return alert('Erro ao gerar relatório de ocupação');
  const data = await res.json();

  const tbody = document.querySelector('#occ-table tbody');
  tbody.innerHTML = data.map(d => `
    <tr>
      <td>${d.date}</td>
      <td>${d.occupied}</td>
      <td>${d.total}</td>
      <td>${d.percent}%</td>
    </tr>
  `).join('');
});

// ----- FATURAMENTO -----
document.getElementById('btn-rev').addEventListener('click', async () => {
  const from = document.getElementById('from-r').value;
  const to   = document.getElementById('to-r').value;
  if (!from || !to) return alert('Selecione o período');

  const res = await fetch(`${BASE}/reports/revenue?from=${from}&to=${to}`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  if (!res.ok) return alert('Erro ao gerar relatório de faturamento');
  const { total, breakdown } = await res.json();

  const tbody = document.querySelector('#rev-table tbody');
  tbody.innerHTML = breakdown.map(b => `
    <tr>
      <td>${b.method}</td>
      <td>${parseFloat(b.total).toFixed(2)}</td>
    </tr>
  `).join('');

  document.getElementById('rev-total').textContent = total.toFixed(2);
});