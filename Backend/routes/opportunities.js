const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkNGO = require('../middleware/checkNGO');
const { createActivity, createOpportunityStatusActivity } = require('../utils/createActivity');

// @route   POST /api/opportunities
// @desc    Create new opportunity (NGO only)
// @access  Private (NGO)
router.post('/', auth, checkNGO, async(req, res) => {
    try {
        const { title, description, required_skills, duration, location } = req.body;

        // Validation
        if (!title || !description || !duration || !location) {
            return res.status(400).json({
                message: 'Please provide all required fields: title, description, duration, location'
            });
        }

        if (!required_skills || required_skills.length === 0) {
            return res.status(400).json({
                message: 'Please provide at least one required skill'
            });
        }

        // Create opportunity
        const opportunity = new Opportunity({
            ngo_id: req.user.id,
            title,
            description,
            required_skills,
            duration,
            location,
            status: 'open'
        });

        await opportunity.save();

        // Create activity for NGO
        await createActivity({
            user_id: req.user.id,
            actor_id: req.user.id,
            actor_name: req.ngoUser.organization_name || req.ngoUser.name,
            type: 'opportunity_posted',
            opportunity_id: opportunity._id,
            opportunity_title: opportunity.title
        });

        console.log(`✅ Opportunity created: ${opportunity.title} by ${req.ngoUser.name}`);

        res.status(201).json({
            success: true,
            message: 'Opportunity created successfully',
            opportunity
        });
    } catch (error) {
        console.error('Create opportunity error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/opportunities
// @desc    Get all open opportunities (with filters)
// @access  Public
router.get('/', async(req, res) => {
    try {
        const { skills, location, status, search } = req.query;

        // Build filter object
        const filter = {};

        // Filter by status (default: open)
        filter.status = status || 'open';

        // Filter by skills
        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim());
            filter.required_skills = { $in: skillsArray };
        }

        // Filter by location
        if (location) {
            filter.location = new RegExp(location, 'i'); // Case-insensitive search
        }

        // Search in title or description
        if (search) {
            filter.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') }
            ];
        }

        const opportunities = await Opportunity.find(filter)
            .populate('ngo_id', 'name organization_name email location')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: opportunities.length,
            opportunities
        });
    } catch (error) {
        console.error('Get opportunities error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/opportunities/my-opportunities
// @desc    Get NGO's own opportunities
// @access  Private (NGO)
router.get('/my-opportunities', auth, checkNGO, async(req, res) => {
    try {
        const { status } = req.query;

        const filter = { ngo_id: req.user.id };
        if (status) {
            filter.status = status;
        }

        const opportunities = await Opportunity.find(filter)
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: opportunities.length,
            opportunities
        });
    } catch (error) {
        console.error('Get my opportunities error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/opportunities/:id
// @desc    Get single opportunity by ID
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id)
            .populate('ngo_id', 'name organization_name email location bio organization_description website_url');

        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        res.json({
            success: true,
            opportunity
        });
    } catch (error) {
        console.error('Get opportunity error:', error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/opportunities/:id
// @desc    Update opportunity (NGO only, own opportunities)
// @access  Private (NGO)
router.put('/:id', auth, checkNGO, async(req, res) => {
    try {
        let opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        // Check if opportunity belongs to this NGO
        if (opportunity.ngo_id.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied. You can only edit your own opportunities.'
            });
        }

        const { title, description, required_skills, duration, location } = req.body;

        // Update fields
        if (title) opportunity.title = title;
        if (description) opportunity.description = description;
        if (required_skills) opportunity.required_skills = required_skills;
        if (duration) opportunity.duration = duration;
        if (location) opportunity.location = location;

        await opportunity.save();

        console.log(`✅ Opportunity updated: ${opportunity.title}`);

        res.json({
            success: true,
            message: 'Opportunity updated successfully',
            opportunity
        });
    } catch (error) {
        console.error('Update opportunity error:', error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PATCH /api/opportunities/:id/status
// @desc    Change opportunity status (open/closed)
// @access  Private (NGO)
router.patch('/:id/status', auth, checkNGO, async(req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['open', 'closed'].includes(status)) {
            return res.status(400).json({
                message: 'Please provide a valid status: open or closed'
            });
        }

        let opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        // Check if opportunity belongs to this NGO
        if (opportunity.ngo_id.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied. You can only modify your own opportunities.'
            });
        }

        // Update status
        opportunity.status = status;
        await opportunity.save();

        // Create activity
        await createOpportunityStatusActivity(
            req.user.id,
            req.ngoUser.organization_name || req.ngoUser.name,
            opportunity._id,
            opportunity.title,
            status
        );

        console.log(`✅ Opportunity status changed: ${opportunity.title} -> ${status}`);

        res.json({
            success: true,
            message: `Opportunity ${status === 'open' ? 'opened' : 'closed'} successfully`,
            opportunity
        });
    } catch (error) {
        console.error('Change status error:', error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/opportunities/:id
// @desc    Delete opportunity (NGO only, own opportunities)
// @access  Private (NGO)
router.delete('/:id', auth, checkNGO, async(req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        // Check if opportunity belongs to this NGO
        if (opportunity.ngo_id.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied. You can only delete your own opportunities.'
            });
        }

        await opportunity.deleteOne();

        console.log(`✅ Opportunity deleted: ${opportunity.title}`);

        res.json({
            success: true,
            message: 'Opportunity deleted successfully'
        });
    } catch (error) {
        console.error('Delete opportunity error:', error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;