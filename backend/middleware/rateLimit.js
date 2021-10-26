const rateLimit = require('express-rate-limit');

/* Fonction limitation requêtes création compte */
exports.Limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure de pénalisation
    max: 5, // Bloque à partir de 5 requêtes
    message:
      "Trop de comptes créés à partir de cette adresse IP, veuillez réessayer d'ici une heure."
  });