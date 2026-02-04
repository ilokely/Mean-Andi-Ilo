const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

router.get('/', async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newRole = new Role(req.body);
        await newRole.save();
        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;