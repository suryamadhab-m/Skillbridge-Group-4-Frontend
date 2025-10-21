const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    ngo_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    required_skills: [{
        type: String,
        trim: true
    }],
    duration: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    }
}, {
    timestamps: true // Automatically creates created_at and updated_at
});

// Index for faster queries
opportunitySchema.index({ ngo_id: 1 });
opportunitySchema.index({ status: 1 });
opportunitySchema.index({ required_skills: 1 });
opportunitySchema.index({ location: 1 });

// Virtual to get NGO details
opportunitySchema.virtual('ngo', {
    ref: 'User',
    localField: 'ngo_id',
    foreignField: '_id',
    justOne: true
});

// Ensure virtuals are included when converting to JSON
opportunitySchema.set('toJSON', { virtuals: true });
opportunitySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);