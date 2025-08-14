const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'pms-secret-123';

function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}

function authenticate(req, res, next) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Token ausente' });

  try {
    req.user = jwt.verify(auth.slice(7), SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function checkRole(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Acesso negado' });
    next();
  };
}

module.exports = { generateToken, authenticate, checkRole };