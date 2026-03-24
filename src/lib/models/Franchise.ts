import mongoose from 'mongoose';

const franchiseSchema = new mongoose.Schema(
    {
        franchiseName: { type: String, required: true },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        region: { type: String, required: true },
        commissionPercentage: { type: Number, required: true, default: 10 },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchise', default: null }
    },
    { timestamps: true }
);

const Franchise = mongoose.models.Franchise || mongoose.model('Franchise', franchiseSchema);
export default Franchise;
