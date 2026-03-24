import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        basePrice: { type: Number, required: true },
        franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchise', default: null },
        organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
        stock: { type: Number, required: true, default: 0 }
    },
    { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
