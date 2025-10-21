const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    opportunity_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity',
        required: true
    },
    volunteer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    viewed_by_ngo: {
        type: Boolean,
        default: false
    },
    viewed_at: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // Creates created_at and updated_at
});

// Indexes for faster queries
applicationSchema.index({ opportunity_id: 1 });
applicationSchema.index({ volunteer_id: 1 });
applicationSchema.index({ status: 1 });

// Compound index to prevent duplicate applications
applicationSchema.index({ opportunity_id: 1, volunteer_id: 1 }, { unique: true });

// Virtual to populate opportunity details
applicationSchema.virtual('opportunity', {
    ref: 'Opportunity',
    localField: 'opportunity_id',
    foreignField: '_id',
    justOne: true
});

// Virtual to populate volunteer details
applicationSchema.virtual('volunteer', {
    ref: 'User',
    localField: 'volunteer_id',
    foreignField: '_id',
    justOne: true
});

// Ensure virtuals are included when converting to JSON
applicationSchema.set('toJSON', { virtuals: true });
applicationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Application', applicationSchema);