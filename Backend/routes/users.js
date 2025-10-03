const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', auth, async(req, res) => {
    try {
        const { name, skills, location, bio, organizationName, organizationDescription, websiteUrl } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id, {
                name,
                skills,
                location,
                bio,
                organizationName,
                organizationDescription,
                websiteUrl
            }, { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users (for testing)
router.get('/', async(req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;