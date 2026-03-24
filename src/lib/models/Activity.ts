import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        action: { type: String, required: true },
        details: { type: String, required: true },
        type: { type: String, enum: ['system', 'franchise', 'organization', 'commission'], default: 'system' },
        isRead: { type: Boolean, default: false },
        organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
        franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchise' }
    },
    { timestamps: true }
);

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
export default Activity;
