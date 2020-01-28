const express = require('express');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database');
const jwt = require('jsonwebtoken');

const { SecretKey } = require('../keys');
const { authRequired } = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM users');
        await pool.end;

        res.send(response.rows);
    } catch (error) {
        res.send('Error');
    }
});

router.post('/verifyToken', authRequired, (req, res) => {
    jwt.verify(req.headers['token'], SecretKey, (err, data) => {
        if(err){
            res.send(err);
            return;
        }
        res.send(data);
    })
})

router.post('/login', async (req, res) => {
    const { userEmail, userPassword } = req.body;
    
    try {
        const response = await pool.query(`SELECT email, username, password FROM users WHERE email = '${userEmail}'`);
        await pool.end;

        if(!response.rows.length) res.status(400).send({error: 'email not found'});

        const { email, username, password } = response.rows[0];

        bcrypt.compare(userPassword, password).then(match => {
            if(!match) {
                res.status(400).send({
                    success: false,
                    error: 'Incorrect Password'
                });
                return;
            }

            //login logic

            const jwtPayload = {
                email,
                username
            }

            jwt.sign(jwtPayload, SecretKey, (err, token) => {
                if(err){
                    res.status(400).send(err);
                    return;
                }

                res.status(200).send({
                    success: true,
                    token
                });
            })

        }).catch(err => res.send(err));
    } catch (error) {
        console.error(error);
    }
    
})

router.post('/register', (req, res) => {
    const {username, password, email} = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            pool.query(`INSERT INTO users VALUES('${uuid()}', '${username}', '${email}', '${hash}')`)
            .then(response =>{
                    res.status(200).send({
                        message: 'User created',
                        response
                    });
                }
            ).catch(err => res.status(400).send(err));

        })
    })
});

module.exports = router;