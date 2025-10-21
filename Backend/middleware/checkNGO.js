const User = require('../models/User');

/**
 * Middleware to check if user is an NGO
 * Must be used after auth middleware
 */
const checkNGO = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'ngo') {
            return res.status(403).json({
                message: 'Access denied. Only NGOs can perform this action.'
            });
        }

        // Attach user to request for convenience
        req.ngoUser = user;
        next();
    } catch (error) {
        console.error('Check NGO middleware error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = checkNGO;