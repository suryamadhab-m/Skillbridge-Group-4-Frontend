const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    actor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    actor_name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: [
            // Volunteer activities
            'application_pending',
            'application_accepted',
            'application_rejected',
            'application_viewed',
            'message_received',
            // NGO activities
            'application_received',
            'application_accepted_by_ngo',
            'application_rejected_by_ngo',
            'opportunity_posted',
            'opportunity_status_changed'
        ]
    },
    opportunity_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity',
        default: null
    },
    opportunity_title: {
        type: String,
        default: ''
    },
    application_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        default: null
    },
    message_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    status_label: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Viewed', 'Message', 'Posted', 'Open', 'Closed'],
        required: true
    },
    icon_type: {
        type: String,
        enum: ['clock', 'check', 'x', 'eye', 'envelope', 'plus', 'edit'],
        required: true
    },
    is_read: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false // We use custom timestamp field
});

// Indexes for faster queries
activitySchema.index({ user_id: 1, timestamp: -1 });
activitySchema.index({ user_id: 1, is_read: 1 });

// Virtual to populate user details
activitySchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

// Virtual to populate actor details
activitySchema.virtual('actor', {
    ref: 'User',
    localField: 'actor_id',
    foreignField: '_id',
    justOne: true
});

// Ensure virtuals are included when converting to JSON
activitySchema.set('toJSON', { virtuals: true });
activitySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Activity', activitySchema);