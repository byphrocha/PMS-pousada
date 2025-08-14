document.addEventListener('DOMContentLoaded', () => {
  // DataTables (se houver)
  const table = document.querySelector('#roomsTable');
  if (table) new DataTable(table);

  // Toast global
  const toastEl = document.getElementById('globalToast');
  if (toastEl && toastEl.querySelector('.toast-body').textContent.trim() !== '') {
    new bootstrap.Toast(toastEl).show();
  }
});