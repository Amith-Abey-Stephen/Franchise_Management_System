import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },
        description: { type: String }
    },
    { timestamps: true }
);

const Organization = mongoose.models.Organization || mongoose.model('Organization', organizationSchema);
export default Organization;
