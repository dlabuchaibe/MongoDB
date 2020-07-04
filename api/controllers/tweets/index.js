const express = require('express');
const router = express.Router();
const Tweet = require('./../../models/tweets');
const User = require('./../../models/users');
const auth  = require('./../../middlewares/auth');
const { decode } = require('jsonwebtoken');


router.route('/')
    .get((req, res)=>{
        Tweet.find({}, (err, tweets)=>{
            User.populate(tweets, {path: 'user'},(err, tweets)=>{
               // User.populate(tweets.comments, {path:'userId'}, (err, tweetsComments) => {
                  res.status(200).send(tweetsComments);  
            //    })
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
        const comments = {
             comment: req.body.comment,
             tweetID: req.body.tweetId, 
             user: req._id
         };
         console.log(comments)
         Tweet.updateOne({_id: comments.tweetID}, {$push: {comments: {userId: comments.user, userComment: comments.comment }} })
         .then(tweet =>{
             res.status(200).send({message: tweet});
         });
     }) 
    .delete((req, res)=>{
        Tweet.remove({})
        .then(()=>{
            res.status(200).send({message: 'Todos los tweets han sido eliminados'});
        });
    });

router.route('/:id')
    .get((req, res)=>{
        let id = req.params.id;
        id = id.replace(/:/gi, '');
        Tweet.find({user: id}, (err, userTweets) => {
            Tweet.populate(userTweets, {path:'user'}, (err, userTweets) => {
              res.status(200).send(userTweets);    
            })
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