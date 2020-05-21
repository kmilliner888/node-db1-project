const express = require('express');

const knex = require('./data/dbConfig');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const accounts = await knex('accounts');
        res.json(accounts);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "error retrieving accounts"});
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
    const account = await knex.select('*').from('accounts').where({id}).first();
        if(account) {
            res.status(200).json(account);
        }  else {
            res.status(400).json({message: "account not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "whoa, there was an error, sorry"});
    }    
});

router.post('/', async (req, res) => {
    const accountData = req.body;

    try {
        const account = await knex.insert(accountData).into('accounts');
        res.status(201).json(account);
    }  catch (error) {
        res.status(500).json({message: "sorry something went wrong"});
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    try {
        const count = await knex('accounts').update(changes).where({id});
        if (count) {
            res.json({updated: count});
        } else {
            res.status(404).json({message: "id not found"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "oops, something went awry"});
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const count = await knex('accounts').del().where({id});
        if (count) {
            res.json({deleted: count});
        } else {
            res.status(404).json({message: "invalid id"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "something went wrong, sorry"});
    }
});

module.exports = router;

