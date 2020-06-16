const express = require('express');
const router = express.Router();
const Tweet = require('./../../models/tweets');
const User = require('./../../models/users');
const auth  = require('./../../middlewares/auth');


router.route('/')
    .get((req, res)=>{
        Tweet.find({}, (err, tweets)=>{
            User.populate(tweets, {path: 'user'},(err, tweets)=>{
                res.status(200).send(tweets);
            })
        })
    })
    .post(auth, (req, res)=>{
        //crear el objeto que se va a guardar
        const tweet = {
            content: req.body.content,
            user: req._id
        };
        Tweet.find({content: tweet.content})
        .then(tweets=>{
            if(tweets.length>0){
                res.status(500).send({message: 'Ya existe un elemento con el mismo contenido'});
            }else{
                const object = new Tweet(tweet);
                object.save()
                .then(()=>{
                    res.status(200).send({message: 'El tweet ha sido creado'});
                });
            }    
        });

        
    })
    .put(auth, (req, res)=>{
        const tweet = {
            id: req.body.id,
            content: req.body.content
        };
        Tweet.update({id: tweet.id}, {content: tweet.content})
        .then(()=>{
            res.status(200).send({message: 'El elemento fue actualizado'});
        });

        res.status(200).send({message: 'El tweet ha sido actualizado'});
    })
    .delete((req, res)=>{
        Tweet.remove({})
        .then(()=>{
            res.status(200).send({message: 'Todos los tweets han sido eliminados'});
        });
    });
router.route('/:id')
    .get((req, res)=>{
        const id = req.params.id;
        Tweet.find({_id: id})
        .then(tweet=>{
            res.status(200).send(tweet);
        })
        .catch(err=>{
            res.status(400).send({message: 'No existe el elemento'});
        })
    })
    .delete(auth, (req, res)=>{
        const id = req.params.id;
        Tweet.remove({_id: id})
        .then(()=>{
            res.status(200).send({message: `El elemento con id: ${id} ha sido eliminado`});
        });
    });

module.exports = router;