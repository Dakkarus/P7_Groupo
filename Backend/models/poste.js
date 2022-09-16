const mongoose = require('mongoose');

//Schema de données pour les postes
const posteSchema = mongoose.Schema({
    userId: { type: String, required: true },
    titre: { type: String, required: true },
    userName: { type: String, required: true },
    contenu: { type: String, required: true },
    imageUrl: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: Array, default: [ ] },
    usersDisliked: { type: Array, default: [ ] },
});

module.exports = mongoose.model('Poste', posteSchema);