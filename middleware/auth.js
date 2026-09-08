function requireAuth(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ error: 'Debes iniciar sesión.' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ error: 'Debes iniciar sesión.' });
  }
  if (req.session.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'No tienes permisos de administrador.' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
