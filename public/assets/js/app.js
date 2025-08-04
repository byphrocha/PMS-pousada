/* =========================================================
   Script global do PMS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Card de Ocupação ---------- */
  const occEl = document.getElementById('occupation');
  if (occEl) occEl.textContent = '74%';

  /* ---------- Gráfico de Reservas ---------- */
  const ctx = document.getElementById('reservationsChart');
  if (ctx) {
    // Se o Chart.js já registrou um gráfico para esse canvas, destrói-o
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
          label: 'Reservas',
          data: [42, 55, 31, 67, 89, 73],
          backgroundColor: '#18bc9c'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }
});