const express = require('express');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM users');
        await pool.end;

        res.send(response.rows);
    } catch (error) {
        res.send('Error');
    }
});

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