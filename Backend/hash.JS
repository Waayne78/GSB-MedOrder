// hash.js
const bcrypt = require('bcrypt');

const motDePasseEnClair = 'ADMIN123'; // Remplace par le mot de passe voulu
const saltRounds = 10;

bcrypt.hash(motDePasseEnClair, saltRounds, function(err, hash) {
  if (err) throw err;
  console.log('Mot de passe hashé :', hash);
});