const $ = (s) => document.querySelector(s);

async function loadTasks() {
  const res  = await fetch('/housekeeping/tasks');
  const data = await res.json();
  const tbody = $('#hk-table tbody');
  tbody.innerHTML = data.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${r.name}</td>
      <td>${r.cleaningStatus}</td>
      <td>
        <button class="primary" data-clean="${r.id}">Marcar limpo</button>
      </td>
    </tr>
  `).join('');
}

// Delegação de evento para marcar limpo
$('#hk-table tbody').addEventListener('click', async (e) => {
  if (e.target.dataset.clean) {
    const id = e.target.dataset.clean;
    await fetch(`/housekeeping/${id}/clean`, { method: 'PUT' });
    loadTasks();
  }
});

loadTasks();