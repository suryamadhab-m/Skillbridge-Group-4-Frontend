const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// @route   GET /api/activities
// @desc    Get user's activity feed
// @access  Private
router.get('/', auth, async(req, res) => {
    try {
        const { limit = 20, skip = 0, unread_only = false } = req.query;

        const filter = { user_id: req.user.id };

        // Filter for unread activities only
        if (unread_only === 'true') {
            filter.is_read = false;
        }

        const activities = await Activity.find(filter)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate('actor_id', 'name organization_name')
            .populate('opportunity_id', 'title status')
            .lean();

        const total = await Activity.countDocuments(filter);
        const unreadCount = await Activity.countDocuments({
            user_id: req.user.id,
            is_read: false
        });

        res.json({
            success: true,
            count: activities.length,
            total,
            unreadCount,
            activities
        });
    } catch (error) {
        console.error('Get activities error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/activities/unread-count
// @desc    Get count of unread activities
// @access  Private
router.get('/unread-count', auth, async(req, res) => {
    try {
        const count = await Activity.countDocuments({
            user_id: req.user.id,
            is_read: false
        });

        res.json({
            success: true,
            unreadCount: count
        });
    } catch (error) {
        console.error('Get unread count error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PATCH /api/activities/:id/read
// @desc    Mark activity as read
// @access  Private
router.patch('/:id/read', auth, async(req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Check if activity belongs to this user
        if (activity.user_id.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied. This activity does not belong to you.'
            });
        }

        activity.is_read = true;
        await activity.save();

        res.json({
            success: true,
            message: 'Activity marked as read',
            activity
        });
    } catch (error) {
        console.error('Mark read error:', error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PATCH /api/activities/read-all
// @desc    Mark all activities as read
// @access  Private
router.patch('/read-all', auth, async(req, res) => {
    try {
        const result = await Activity.updateMany({ user_id: req.user.id, is_read: false }, { $set: { is_read: true } });

        res.json({
            success: true,
            message: 'All activities marked as read',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Mark all read error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/activities/:id
// @desc    Delete activity
// @access  Private
router.delete('/:id', auth, async(req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Check if activity belongs to this user
        if (activity.user_id.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied. This activity does not belong to you.'
            });
        }

        await activity.deleteOne();

        res.json({
            success: true,
            message: 'Activity deleted successfully'
        });
    } catch (error) {
        console.error('Delete activity error:', error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;