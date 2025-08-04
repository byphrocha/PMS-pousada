/*  app-core.js  –  inicialização global, logout e menus por perfil  */

// ----- Recupera token e usuário -----
const TOKEN = localStorage.getItem('token') || '';
const USER  = JSON.parse(localStorage.getItem('user') || 'null');

console.log('App‑core carregado. token=', TOKEN);
console.log('App‑core USER=', USER);

// Se não estiver autenticado, redireciona para login.html
if ((!TOKEN || !USER) && !location.pathname.endsWith('/login.html')) {
  console.log('Redirecionando para login porque token ou user ausente');
  location.href = '/login.html';
}

// ----- Logout -----
function doLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  location.href = '/login.html';
}

// ----- Adiciona botão “Sair” na navbar (se existir) -----
const navbar = document.querySelector('.navbar');
if (navbar && !location.pathname.endsWith('/login.html')) {
  const btnLogout = document.createElement('button');
  btnLogout.textContent = 'Sair';
  btnLogout.className   = 'secondary';
  btnLogout.style.marginLeft = 'auto';
  btnLogout.onclick = doLogout;
  navbar.appendChild(btnLogout);
}

// ----- Controle de menus por perfil -----
function filterMenuLinks() {
  if (!USER) return;
  const role = USER.role; // 'admin', 'reception', 'housekeeping'
  document.querySelectorAll('aside nav a[data-roles]').forEach(link => {
    const allowed = link.dataset.roles.split(',');
    if (!allowed.includes(role)) link.style.display = 'none';
  });
}
filterMenuLinks();

// ----- Hambúrguer mobile -----
const burger = document.getElementById('toggle-sidebar');
if (burger) {
  burger.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
}

// Exporta token para outros scripts
window.PMS_TOKEN = TOKEN;

/* ========== Toast global ========== */
window.toast = (msg, ok = true) => {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.toggle('error', !ok);
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
};

/* ========== Fechar Sidebar ao clicar em link (mobile) ========== */
document.querySelectorAll('#sidebar nav a').forEach(a =>
  a.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
  })
);

/* ========== Confirmação de logout ========== */
function doLogout() {
  if (!confirm('Deseja sair?')) return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  location.href = '/login.html';
}