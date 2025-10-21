const Activity = require('../models/Activity');

/**
 * Create activity notification
 * @param {Object} params - Activity parameters
 * @param {String} params.user_id - User who will see this activity
 * @param {String} params.actor_id - User who performed the action
 * @param {String} params.actor_name - Name of the actor
 * @param {String} params.type - Type of activity
 * @param {String} params.opportunity_id - Optional opportunity ID
 * @param {String} params.opportunity_title - Optional opportunity title
 * @param {String} params.application_id - Optional application ID
 * @param {String} params.message_id - Optional message ID
 */
const createActivity = async(params) => {
    try {
        const {
            user_id,
            actor_id,
            actor_name,
            type,
            opportunity_id = null,
            opportunity_title = '',
            application_id = null,
            message_id = null
        } = params;

        // Map activity type to status label and icon
        const activityConfig = {
            // Volunteer activities
            'application_pending': { label: 'Pending', icon: 'clock' },
            'application_accepted': { label: 'Accepted', icon: 'check' },
            'application_rejected': { label: 'Rejected', icon: 'x' },
            'application_viewed': { label: 'Viewed', icon: 'eye' },
            'message_received': { label: 'Message', icon: 'envelope' },

            // NGO activities
            'application_received': { label: 'Pending', icon: 'clock' },
            'application_accepted_by_ngo': { label: 'Accepted', icon: 'check' },
            'application_rejected_by_ngo': { label: 'Rejected', icon: 'x' },
            'opportunity_posted': { label: 'Posted', icon: 'plus' },
            'opportunity_status_changed': { label: 'Open', icon: 'edit' } // Can be Open or Closed
        };

        const config = activityConfig[type];
        if (!config) {
            console.error(`Unknown activity type: ${type}`);
            return null;
        }

        const activity = new Activity({
            user_id,
            actor_id,
            actor_name,
            type,
            opportunity_id,
            opportunity_title,
            application_id,
            message_id,
            status_label: config.label,
            icon_type: config.icon,
            is_read: false,
            timestamp: new Date()
        });

        await activity.save();
        console.log(`✅ Activity created: ${type} for user ${user_id}`);
        return activity;
    } catch (error) {
        console.error('Error creating activity:', error.message);
        return null;
    }
};

/**
 * Create activity for opportunity status change
 * @param {String} user_id - NGO user ID
 * @param {String} actor_name - NGO name
 * @param {String} opportunity_id - Opportunity ID
 * @param {String} opportunity_title - Opportunity title
 * @param {String} newStatus - New status (open/closed)
 */
const createOpportunityStatusActivity = async(user_id, actor_name, opportunity_id, opportunity_title, newStatus) => {
    const activity = new Activity({
        user_id,
        actor_id: user_id,
        actor_name,
        type: 'opportunity_status_changed',
        opportunity_id,
        opportunity_title,
        status_label: newStatus === 'open' ? 'Open' : 'Closed',
        icon_type: 'edit',
        is_read: false,
        timestamp: new Date()
    });

    await activity.save();
    return activity;
};

module.exports = {
    createActivity,
    createOpportunityStatusActivity
};