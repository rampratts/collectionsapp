const express = require('express');
const router = express.Router();
const uuid = require('uuid/v4');

const pool = require('../database');
const authRequired = require('../middleware/auth');

router.get('/:userId', authRequired, async (req, res) => {
    const { userId } = req.params;

    try {
        const response = await pool.query('SELECT collectionId, collection_name, icon FROM collections WHERE owner = $1', [userId]);
        await pool.end;
        
        res.status(200).send({
            success: true,
            response: response.rows
        });
    } catch (error) {
        res.send(error);
    }
})

router.delete('/deleteCollection', authRequired, async (req, res) => {
    const { collectionId, userId } = req.body;

    try {
        const response = await pool.query('DELETE FROM collections WHERE collectionId = $1 AND owner = $2', [collectionId, userId]);
        await pool.end;

        res.status(200).send({
            success: true,
            response
        })
    } catch (error) {
        res.status(400).send(error);
    }
})

router.patch('/updateCollection', authRequired, async (req, res) => {
    const { collectionId, collectionName } = req.body;

    try {
        const response = await pool.query('UPDATE collections SET collection_name = $1 WHERE collectionId = $2', [collectionName, collectionId]);
        await pool.end;

        res.status(200).send({
            success: true,
            response
        })
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/createCollection', authRequired, async (req, res) => {
    const { userId, collectionName, icon } = req.body;

    try {
        const response = await pool.query(`INSERT INTO collections VALUES($1, $2, $3, $4)`, [uuid(), userId, icon, collectionName]);
        await pool.end();

        res.status(200).send({
            success: true,
            response
        })
    } catch (error) {
        res.send(error);
    }
})

module.exports = router;
