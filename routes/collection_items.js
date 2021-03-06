const express = require('express');
const router = express.Router();
const uuid = require('uuid/v4');

const pool = require('../database');
const authRequired = require('../middleware/auth');

router.get('/:collectionId',authRequired ,async (req, res) => {
    const { collectionId } = req.params;

    try {
        const response = await pool.query('SELECT collection_itemId, title, description, rating FROM collection_items WHERE collection = $1', [collectionId]);
        await pool.end;
        
        res.status(200).send({
            success: true,
            response: response.rows
        });
    } catch (error) {
        res.send(error);
    }
});

router.post('/createCollectionItem', authRequired, async (req, res) => {
    const { collectionId, title, description, rating } = req.body;

    try {
        const response = await pool.query(`INSERT INTO collection_items VALUES($1, $2, $3, $4, $5)`, [uuid(), title, description, rating, collectionId]);
        await pool.end;

        res.status(200).send({
            success: true,
            response
        })
    } catch (error) {
        res.send(error);
    }
})

router.delete('/deleteCollectionItem', authRequired, async (req, res) => {
    const { collectionItemId } = req.body;

    try {
        const response = await pool.query('DELETE FROM collection_items WHERE collection_itemId = $1', [collectionItemId]);
        await pool.end;

        res.status(200).send({
            success: true,
            response
        })
    } catch (error) {
        res.send(error);
    }
})

router.patch('/updateCollectionItem', authRequired, async (req, res) => {
    const { collectionItemId, newTitle, newDescription, newRating } = req.body;

    try {
        const initialRowItem = await pool.query('SELECT title, description, rating FROM collection_items WHERE collection_itemId = $1', [collectionItemId]);
        pool.end;
        const { title, description, rating } = initialRowItem.rows[0];
        const finalTitle = newTitle ? newTitle : title;
        const finalDescription = newDescription ? newDescription : description;
        const finalRating = newRating ? newRating : rating; 

        const response = await pool.query('UPDATE collection_items SET title = $1, description = $2, rating = $3 WHERE collection_itemId = $4', [finalTitle, finalDescription, finalRating, collectionItemId])
        pool.end;

        res.status(200).send({
            success: true,
            response
        })

    } catch (error) {
        res.send(error);
    }
})

module.exports = router;