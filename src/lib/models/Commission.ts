import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema(
    {
        franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchise', required: true },
        organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
        month: { type: String, required: true }, // e.g. "2023-10"
        totalSales: { type: Number, required: true, default: 0 },
        commissionAmount: { type: Number, required: true, default: 0 },
        paidStatus: { type: Boolean, default: false },
        generatedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const Commission = mongoose.models.Commission || mongoose.model('Commission', commissionSchema);
export default Commission;
