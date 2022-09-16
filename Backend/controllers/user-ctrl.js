const bcrypt = require('bcrypt');
const User = require('../models/User');

const jwt = require('jsonwebtoken');
const Admin = false;


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email : req.body.email ,
                name: req.body.name,
                password : hash,
                Admin: Admin,
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({error}));
};


exports.login = (req,res, next)=>{
    User.findOne({ email: req.body.email})
    .then(user=>{if (user=== null){
        res.status(401).json({message:'identifiant ou mot de passe incorrecte'});
    }else {
        bcrypt.compare(req.body.password, user.password)
        .then(valid=>{if(!valid){
            res.status(401).json({message:'identifiant ou mot de passe incorrecte'});
        }else{
            
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id, name:user.name, isadmin:user.Admin },
                    'RANDOM_TOKEN_SECRET',
                    {expiresIn: '24h'}
                )
            });
        }
        })
        .catch(error=>res.status(500).json({error}));
    }
})
    .catch(error=>res.status(500).json({error}));
};